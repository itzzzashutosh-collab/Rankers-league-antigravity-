import { createClient } from "@/utils/supabase/server";
import { createAdminClient } from "@/utils/supabase/admin";
import { walletService } from "@/services/auth/walletService";
import crypto from "crypto";

export interface ContestRegistration {
  id: string;
  user_id: string;
  contest_id: string;
  registration_number: string;
  selected_language: string;
  status: "registered" | "confirmed" | "cancelled" | "completed";
  payment_status: "pending" | "paid" | "refunded" | "waived";
  entry_fee_paid: number;
  created_at: string;
}

export interface AdmitCard {
  participantName: string;
  username: string;
  maskedMobile: string;
  contestName: string;
  contestCategory: string;
  contestDate: string;
  reportingTime: string;
  contestStartTime: string;
  contestDuration: string;
  selectedLanguage: string;
  registrationNumber: string;
  registrationStatus: string;
  seatNumber: string;
  verificationStatus: string;
  reportingTimestamp: string;
  startTimestamp: string;
}

export const contestRegistrationService = {
  // Get active registration for user and contest
  async getRegistration(userId: string, contestId: string): Promise<ContestRegistration | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contest_registrations")
      .select("*")
      .eq("user_id", userId)
      .eq("contest_id", contestId)
      .maybeSingle();

    if (error || !data) return null;
    return data as ContestRegistration;
  },

  // Check seat counts
  async getSeatsDetails(contestId: string, maxSeats: number): Promise<{
    registeredCount: number;
    seatsAvailable: number;
    status: "open" | "closing_soon" | "sold_out";
  }> {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("contest_registrations")
      .select("*", { count: "exact", head: true })
      .eq("contest_id", contestId)
      .in("status", ["registered", "confirmed", "completed"]);

    const registeredCount = (error || count === null) ? 0 : count;
    const seatsAvailable = Math.max(0, maxSeats - registeredCount);

    let status: "open" | "closing_soon" | "sold_out" = "open";
    if (seatsAvailable === 0) {
      status = "sold_out";
    } else if (seatsAvailable < 20) {
      status = "closing_soon";
    }

    return { registeredCount, seatsAvailable, status };
  },

  // Complete checkout & process payment deduction
  async checkoutAndRegister(
    userId: string,
    contestId: string,
    contestName: string,
    entryFee: number,
    language: string
  ): Promise<{ success: boolean; registrationId?: string; registrationNumber?: string; error?: string }> {
    const supabase = createAdminClient();

    // 1. Check duplicate registration
    const existing = await this.getRegistration(userId, contestId);
    if (existing) {
      return { success: false, error: "You are already registered for this contest." };
    }

    // 2. Wallet checks (only if entry fee > 0)
    let transactionId: string | null = null;
    if (entryFee > 0) {
      const balanceObj = await walletService.getWalletBalances(userId);
      if (!balanceObj || balanceObj.available_balance < entryFee) {
        return { success: false, error: "Insufficient wallet balance. Please add funds to your wallet." };
      }

      // Create a unique reference
      const refNo = `TXN-REG-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

      // Insert transaction into wallet_transactions to trigger deduction
      const { data: txn, error: txnErr } = await supabase
        .from("wallet_transactions")
        .insert({
          wallet_id: userId,
          type_id: "contest_entry",
          status_id: "completed",
          amount: -entryFee,
          reference_number: refNo,
          contest_name: contestName,
          description: `Registration fee for ${contestName}`
        })
        .select("id")
        .single();

      if (txnErr || !txn) {
        return { success: false, error: "Payment transaction processing failed. Try again." };
      }
      transactionId = txn.id;
    }

    // 3. Create registration row
    const regNo = `RL-REG-${contestId.replace("-live", "").toUpperCase()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
    const { data: reg, error: regErr } = await supabase
      .from("contest_registrations")
      .insert({
        user_id: userId,
        contest_id: contestId,
        registration_number: regNo,
        selected_language: language,
        status: "confirmed",
        payment_status: entryFee > 0 ? "paid" : "waived",
        entry_fee_paid: entryFee
      })
      .select("id")
      .single();

    if (regErr || !reg) {
      // Rollback payment transaction if possible (manual correction since no pg tx block here, or log critical)
      console.error("Critical: Payment succeeded but registration table row insert failed!", regErr);
      return { success: false, error: "Registration record creation failed. Contact support with transaction ID." };
    }

    // 4. Create participant record (seat number and mock reporting time)
    const seatNo = `SEAT-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
    const reportingTime = new Date();
    reportingTime.setDate(reportingTime.getDate() + 3); // Mock date: 3 days in future

    await supabase.from("contest_participants").insert({
      registration_id: reg.id,
      seat_number: seatNo,
      reporting_time: reportingTime.toISOString(),
      verification_status: "pending"
    });

    // 5. Create payment receipt entry
    await supabase.from("contest_payments").insert({
      registration_id: reg.id,
      wallet_transaction_id: transactionId,
      amount: entryFee,
      payment_method: entryFee > 0 ? "wallet" : "free_tier",
      payment_status: "completed"
    });

    // 6. Log audit trail
    await supabase.from("contest_audit_logs").insert({
      user_id: userId,
      action: "CONTEST_REGISTERED",
      details: { contestId, registrationNumber: regNo, amount: entryFee }
    });

    return { success: true, registrationId: reg.id, registrationNumber: regNo };
  },

  // Generate Digital Admit Card info
  async getAdmitCard(userId: string, contestId: string, contestDetails: any): Promise<AdmitCard | null> {
    const supabase = await createClient();

    // 1. Fetch user registration
    const { data: reg, error: regErr } = await supabase
      .from("contest_registrations")
      .select("id, registration_number, selected_language, status")
      .eq("user_id", userId)
      .eq("contest_id", contestId)
      .maybeSingle();

    if (regErr || !reg) return null;

    // 2. Fetch associated participant credentials
    const { data: part } = await supabase
      .from("contest_participants")
      .select("seat_number, reporting_time, verification_status")
      .eq("registration_id", reg.id)
      .maybeSingle();

    // 3. Fetch profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, username, phone_number")
      .eq("id", userId)
      .single();

    // Clean dates formatting
    const rawRepTime = part?.reporting_time ? new Date(part.reporting_time) : new Date();
    const cleanRepStr = rawRepTime.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) + ", " + rawRepTime.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });

    // Mask phone number
    const rawPhone = profile?.phone_number || "9876543210";
    const maskedPhone = rawPhone.substring(0, 3) + "•••••" + rawPhone.substring(rawPhone.length - 2);

    return {
      participantName: profile?.full_name || "Aspirant Candidate",
      username: profile?.username || "aspirant",
      maskedMobile: maskedPhone,
      contestName: contestDetails.title,
      contestCategory: contestDetails.category,
      contestDate: contestDetails.date,
      reportingTime: cleanRepStr,
      contestStartTime: contestDetails.time,
      contestDuration: contestDetails.duration,
      selectedLanguage: reg.selected_language,
      registrationNumber: reg.registration_number,
      registrationStatus: reg.status,
      seatNumber: part?.seat_number || "SEAT-102",
      verificationStatus: part?.verification_status || "pending",
      reportingTimestamp: part?.reporting_time || new Date().toISOString(),
      startTimestamp: new Date().toISOString() // will handle countdowns
    };
  },

  // Verification device service (generating hashed verification code)
  async generateVerificationCode(userId: string, contestId: string): Promise<string> {
    const supabase = await createClient();
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric
    const hashed = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Expires in 10 minutes

    // Write to database
    await supabase.from("contest_verification_codes").insert({
      user_id: userId,
      contest_id: contestId,
      code_hash: hashed,
      expires_at: expiresAt.toISOString()
    });

    return code; // Return plain-text code so caller can simulate SMS/WhatsApp delivery (log output)
  },

  // Validate verification code
  async verifyDeviceCode(userId: string, contestId: string, plainCode: string, fingerprint: string, deviceName: string): Promise<boolean> {
    const supabase = await createClient();
    const hashed = crypto.createHash("sha256").update(plainCode).digest("hex");

    const { data: record, error } = await supabase
      .from("contest_verification_codes")
      .select("*")
      .eq("user_id", userId)
      .eq("contest_id", contestId)
      .eq("code_hash", hashed)
      .eq("is_used", false)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (error || !record) return false;

    // Mark code as used
    await supabase
      .from("contest_verification_codes")
      .update({ is_used: true })
      .eq("id", record.id);

    // Save device to trusted devices catalog
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + 30); // Valid for 30 days
    await supabase.from("trusted_devices").insert({
      user_id: userId,
      device_fingerprint: fingerprint,
      device_name: deviceName,
      expires_at: expDate.toISOString()
    });

    return true;
  },

  // Check if device is trusted
  async isDeviceTrusted(userId: string, fingerprint: string): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("trusted_devices")
      .select("id")
      .eq("user_id", userId)
      .eq("device_fingerprint", fingerprint)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    return !error && !!data;
  },

  // Get user registration history
  async getRegistrationHistory(userId: string): Promise<any[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("contest_registrations")
      .select(`
        id,
        contest_id,
        registration_number,
        selected_language,
        status,
        payment_status,
        created_at
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error || !data) return [];
    return data;
  }
};
