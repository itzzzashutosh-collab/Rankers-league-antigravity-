import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth.js";
import crypto from "crypto";

const router = Router();
router.use(requireAuth);

// POST /api/v1/registration/checkout
router.post("/checkout", async (req: Request, res: Response) => {
  try {
    const { contestId, contestName, entryFee, language } = req.body;
    const userId = req.userId!;
    const db = req.db!;

    if (!contestId || !contestName || entryFee === undefined || !language) {
      return res.status(400).json({ error: "Missing required fields: contestId, contestName, entryFee, language" });
    }

    const fee = Number(entryFee);

    // 1. Check duplicate registration
    const { data: existing } = await db
      .from("contest_registrations")
      .select("id, registration_number")
      .eq("user_id", userId)
      .eq("contest_id", contestId)
      .maybeSingle();

    if (existing) {
      return res.status(409).json({ error: "Already registered for this contest.", registrationNumber: existing.registration_number });
    }

    // 2. Wallet deduction (only if fee > 0)
    let transactionId: string | null = null;
    if (fee > 0) {
      // Check balance
      const { data: bal } = await db
        .from("wallet_balances")
        .select("available_balance, contest_entry_balance")
        .eq("wallet_id", userId)
        .single();

      const totalAvailable = (bal?.available_balance || 0) + (bal?.contest_entry_balance || 0);
      if (totalAvailable < fee) {
        return res.status(402).json({
          error: "Insufficient wallet balance.",
          required: fee,
          available: totalAvailable
        });
      }

      // Deduct via transaction (triggers DB balance update)
      const refNo = `TXN-REG-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
      const { data: txn, error: txnErr } = await db
        .from("wallet_transactions")
        .insert({
          wallet_id: userId,
          type_id: "contest_entry",
          status_id: "completed",
          amount: -fee,  // negative = debit
          reference_number: refNo,
          contest_name: contestName,
          description: `Registration fee for ${contestName}`,
        })
        .select("id")
        .single();

      if (txnErr || !txn) {
        return res.status(500).json({ error: `Payment failed: ${txnErr?.message || "Unknown error"}` });
      }
      transactionId = txn.id;
    }

    // 3. Create registration row
    const regNo = `RL-${contestId.replace(/-/g, "").toUpperCase().slice(0, 8)}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const { data: reg, error: regErr } = await db
      .from("contest_registrations")
      .insert({
        user_id: userId,
        contest_id: contestId,
        registration_number: regNo,
        selected_language: language,
        status: "confirmed",
        payment_status: fee > 0 ? "paid" : "waived",
        entry_fee_paid: fee,
      })
      .select("id")
      .single();

    if (regErr || !reg) {
      return res.status(500).json({ error: "Registration record creation failed. Contact support." });
    }

    // 4. Create participant record
    const seatNo = `SEAT-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const reportingTime = new Date();
    reportingTime.setDate(reportingTime.getDate() + 3);

    await db.from("contest_participants").insert({
      registration_id: reg.id,
      seat_number: seatNo,
      reporting_time: reportingTime.toISOString(),
      verification_status: "pending",
    });

    // 5. Payment receipt
    await db.from("contest_payments").insert({
      registration_id: reg.id,
      wallet_transaction_id: transactionId,
      amount: fee,
      payment_method: fee > 0 ? "wallet" : "free_tier",
      payment_status: "completed",
    });

    // 6. Audit log
    await db.from("contest_audit_logs").insert({
      user_id: userId,
      action: "CONTEST_REGISTERED",
      details: { contestId, registrationNumber: regNo, amount: fee },
    });

    // 7. Return fresh wallet balance
    const { data: newBal } = await db
      .from("wallet_balances")
      .select("available_balance")
      .eq("wallet_id", userId)
      .single();

    res.json({
      success: true,
      registrationId: reg.id,
      registrationNumber: regNo,
      seatNumber: seatNo,
      newWalletBalance: newBal?.available_balance ?? null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Checkout failed.";
    res.status(500).json({ error: msg });
  }
});

// GET /api/v1/registration/:contestId — get registration status
router.get("/:contestId", async (req: Request, res: Response) => {
  try {
    const { contestId } = req.params;
    const { data, error } = await req.db!
      .from("contest_registrations")
      .select(`*, contest_participants(*)`)
      .eq("user_id", req.userId!)
      .eq("contest_id", contestId)
      .maybeSingle();

    if (error) throw error;
    res.json({ registered: !!data, registration: data || null });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch registration status." });
  }
});

// GET /api/v1/registration/:contestId/admit-card
router.get("/:contestId/admit-card", async (req: Request, res: Response) => {
  try {
    const { contestId } = req.params;
    const db = req.db!;
    const userId = req.userId!;

    // Fetch registration with participant data
    const { data: reg, error: regErr } = await db
      .from("contest_registrations")
      .select(`*, contest_participants(*)`)
      .eq("user_id", userId)
      .eq("contest_id", contestId)
      .maybeSingle();

    if (regErr || !reg) {
      return res.status(404).json({ error: "Registration not found for this contest." });
    }

    // Fetch user profile
    const { data: profile } = await db
      .from("profiles")
      .select("full_name, username, phone")
      .eq("id", userId)
      .single();

    const participant = reg.contest_participants?.[0];
    const phone = profile?.phone || "";
    const maskedPhone = phone.length >= 4 ? `XXXXXX${phone.slice(-4)}` : "XXXXXXXXXX";

    res.json({
      participantName: profile?.full_name || "Aspirant",
      username: profile?.username || "",
      maskedMobile: maskedPhone,
      registrationNumber: reg.registration_number,
      registrationStatus: reg.status,
      selectedLanguage: reg.selected_language,
      seatNumber: participant?.seat_number || "SEAT-PENDING",
      verificationStatus: participant?.verification_status || "pending",
      reportingTime: participant?.reporting_time || new Date(Date.now() + 3 * 86400000).toISOString(),
      entryFeePaid: reg.entry_fee_paid,
      createdAt: reg.created_at,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate admit card data." });
  }
});

export default router;
