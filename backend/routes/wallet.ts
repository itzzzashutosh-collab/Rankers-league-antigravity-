import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth.js";
import crypto from "crypto";

const router = Router();

// All wallet routes require authentication
router.use(requireAuth);

// GET /api/v1/wallet/balances
router.get("/balances", async (req: Request, res: Response) => {
  try {
    const { data, error } = await req.db!
      .from("wallet_balances")
      .select("*")
      .eq("wallet_id", req.userId!)
      .single();

    if (error || !data) {
      // Auto-create wallet if not found
      await req.db!.from("wallets").insert({ id: req.userId! }).select().single();
      await req.db!.from("wallet_balances").insert({ wallet_id: req.userId! }).select().single();
      return res.json({
        wallet_id: req.userId,
        available_balance: 0,
        pending_rewards: 0,
        processing_rewards: 0,
        contest_entry_balance: 0,
        lifetime_earnings: 0,
        lifetime_withdrawals: 0,
      });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wallet balances." });
  }
});

// GET /api/v1/wallet/transactions?limit=20&offset=0&type=all
router.get("/transactions", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    const typeFilter = req.query.type as string;

    let query = req.db!
      .from("wallet_transactions")
      .select("*")
      .eq("wallet_id", req.userId!)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (typeFilter && typeFilter !== "all") {
      query = query.eq("type_id", typeFilter);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    res.json({ transactions: data || [], total: count || 0 });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch transactions." });
  }
});

// POST /api/v1/wallet/deposit
router.post("/deposit", async (req: Request, res: Response) => {
  try {
    const { amount, method } = req.body;
    const numAmount = Number(amount);

    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).json({ error: "Invalid deposit amount. Must be > 0." });
    }
    if (numAmount > 100000) {
      return res.status(400).json({ error: "Maximum single deposit is ₹1,00,000." });
    }

    const refNo = `TXN-DEP-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;

    const { data, error } = await req.db!
      .from("wallet_transactions")
      .insert({
        wallet_id: req.userId!,
        type_id: "manual_adjustment",
        status_id: "completed",
        amount: numAmount,
        reference_number: refNo,
        description: `Wallet Deposit via ${(method || "UPI").toUpperCase()}`,
      })
      .select("id")
      .single();

    if (error || !data) throw new Error(error?.message || "Deposit failed.");

    // Fetch updated balance
    const { data: balanceData } = await req.db!
      .from("wallet_balances")
      .select("available_balance")
      .eq("wallet_id", req.userId!)
      .single();

    res.json({
      success: true,
      reference: refNo,
      newBalance: balanceData?.available_balance ?? null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

// POST /api/v1/wallet/withdraw
router.post("/withdraw", async (req: Request, res: Response) => {
  try {
    const { amount, method, accountId } = req.body;
    const numAmount = Number(amount);

    if (!numAmount || numAmount < 100) {
      return res.status(400).json({ error: "Minimum withdrawal is ₹100." });
    }
    if (numAmount > 50000) {
      return res.status(400).json({ error: "Maximum withdrawal per transaction is ₹50,000." });
    }

    // Check balance
    const { data: bal } = await req.db!
      .from("wallet_balances")
      .select("available_balance")
      .eq("wallet_id", req.userId!)
      .single();

    if (!bal || bal.available_balance < numAmount) {
      return res.status(400).json({ error: "Insufficient available balance." });
    }

    // Double-submission guard: no processing withdrawal in last 30s
    const thirtySecAgo = new Date(Date.now() - 30000).toISOString();
    const { data: recent } = await req.db!
      .from("wallet_transactions")
      .select("id")
      .eq("wallet_id", req.userId!)
      .eq("type_id", "withdrawal")
      .eq("status_id", "processing")
      .gte("created_at", thirtySecAgo);

    if (recent && recent.length > 0) {
      return res.status(429).json({ error: "A withdrawal is already processing. Please wait." });
    }

    const refNo = `TXN-WDL-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;

    const { error } = await req.db!
      .from("wallet_transactions")
      .insert({
        wallet_id: req.userId!,
        type_id: "withdrawal",
        status_id: "processing",
        amount: -numAmount,
        reference_number: refNo,
        description: `Withdrawal via ${method === "upi" ? "UPI" : "Bank Transfer"}`,
      });

    if (error) throw new Error(error.message);

    res.json({ success: true, reference: refNo });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: msg });
  }
});

// GET /api/v1/wallet/bank-accounts
router.get("/bank-accounts", async (req: Request, res: Response) => {
  const { data, error } = await req.db!
    .from("bank_accounts")
    .select("*")
    .eq("user_id", req.userId!)
    .order("is_primary", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

// GET /api/v1/wallet/upi-accounts
router.get("/upi-accounts", async (req: Request, res: Response) => {
  const { data, error } = await req.db!
    .from("upi_accounts")
    .select("*")
    .eq("user_id", req.userId!)
    .order("is_primary", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data || []);
});

export default router;
