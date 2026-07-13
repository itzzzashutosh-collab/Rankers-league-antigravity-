module.exports = [
"[project]/frontend/.next-internal/server/app/api/auth/contests/register/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/frontend/utils/supabase/server.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://bgsdovlumtjwvcwzjnnn.supabase.co");
const supabaseKey = ("TURBOPACK compile-time value", "sb_publishable_YSeECVTNhPL63VEU5GSi2Q_TZHs7md2");
const createClient = async ()=>{
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createServerClient"])(supabaseUrl, supabaseKey, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing
                // user sessions.
                }
            }
        }
    });
};
}),
"[project]/frontend/utils/supabase/admin.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminClient",
    ()=>createAdminClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://bgsdovlumtjwvcwzjnnn.supabase.co");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const createAdminClient = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}),
"[project]/frontend/services/auth/walletService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "walletService",
    ()=>walletService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/admin.ts [app-route] (ecmascript)");
;
;
const walletService = {
    // Get wallet balance summary
    async getWalletBalances (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("wallet_balances").select("*").eq("wallet_id", userId).single();
        if (error || !data) {
            // Return default fallbacks
            return {
                wallet_id: userId,
                available_balance: 0.00,
                pending_rewards: 0.00,
                processing_rewards: 0.00,
                contest_entry_balance: 0.00,
                lifetime_earnings: 0.00,
                lifetime_withdrawals: 0.00,
                updated_at: new Date().toISOString()
            };
        }
        return {
            wallet_id: data.wallet_id,
            available_balance: Number(data.available_balance),
            pending_rewards: Number(data.pending_rewards),
            processing_rewards: Number(data.processing_rewards),
            contest_entry_balance: Number(data.contest_entry_balance),
            lifetime_earnings: Number(data.lifetime_earnings),
            lifetime_withdrawals: Number(data.lifetime_withdrawals),
            updated_at: data.updated_at
        };
    },
    // Get filtered transaction history
    async getTransactions (userId, filters = {}) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        let query = supabase.from("wallet_transactions").select("*").eq("wallet_id", userId);
        if (filters.type && filters.type !== "all") {
            query = query.eq("type_id", filters.type);
        }
        if (filters.status && filters.status !== "all") {
            query = query.eq("status_id", filters.status);
        }
        if (filters.startDate) {
            query = query.gte("created_at", filters.startDate);
        }
        if (filters.endDate) {
            query = query.lte("created_at", filters.endDate);
        }
        const { data, error } = await query.order("created_at", {
            ascending: false
        });
        if (error || !data) return [];
        let transactions = data;
        // Frontend search filter
        if (filters.search) {
            const term = filters.search.toLowerCase();
            transactions = transactions.filter((t)=>t.reference_number.toLowerCase().includes(term) || t.contest_name && t.contest_name.toLowerCase().includes(term) || t.description && t.description.toLowerCase().includes(term));
        }
        return transactions;
    },
    // Get specific transaction detail
    async getTransactionDetail (userId, transactionId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("wallet_transactions").select("*").eq("wallet_id", userId).eq("id", transactionId).single();
        if (error || !data) return null;
        return data;
    },
    // Manage bank accounts
    async getBankAccounts (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("bank_accounts").select("*").eq("user_id", userId).order("is_primary", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    },
    async addBankAccount (userId, account) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // Check if it's the first account, make it primary
        const existing = await this.getBankAccounts(userId);
        const isPrimary = existing.length === 0;
        const { data, error } = await supabase.from("bank_accounts").insert({
            user_id: userId,
            account_holder: account.account_holder,
            account_number: account.account_number,
            ifsc: account.ifsc,
            bank_name: account.bank_name,
            branch: account.branch,
            is_primary: isPrimary || account.is_primary,
            is_verified: true
        }).select().single();
        if (error) return {
            data: null,
            error: error.message
        };
        // If marked primary, update others
        if (account.is_primary && existing.length > 0) {
            await supabase.from("bank_accounts").update({
                is_primary: false
            }).eq("user_id", userId).neq("id", data.id);
        }
        return {
            data: data,
            error: null
        };
    },
    async deleteBankAccount (userId, accountId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("bank_accounts").delete().eq("user_id", userId).eq("id", accountId);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            error: null
        };
    },
    async setPrimaryBankAccount (userId, accountId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // Set all to false first
        await supabase.from("bank_accounts").update({
            is_primary: false
        }).eq("user_id", userId);
        // Set targeted to true
        const { error } = await supabase.from("bank_accounts").update({
            is_primary: true
        }).eq("user_id", userId).eq("id", accountId);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            error: null
        };
    },
    // Manage UPI accounts
    async getUpiAccounts (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("upi_accounts").select("*").eq("user_id", userId).order("is_primary", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    },
    async addUpiAccount (userId, upiId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const existing = await this.getUpiAccounts(userId);
        const isPrimary = existing.length === 0;
        const { data, error } = await supabase.from("upi_accounts").insert({
            user_id: userId,
            upi_id: upiId,
            is_primary: isPrimary,
            is_verified: true
        }).select().single();
        if (error) return {
            data: null,
            error: error.message
        };
        return {
            data: data,
            error: null
        };
    },
    async deleteUpiAccount (userId, upiAccountId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("upi_accounts").delete().eq("user_id", userId).eq("id", upiAccountId);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            error: null
        };
    },
    async setPrimaryUpiAccount (userId, upiAccountId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        await supabase.from("upi_accounts").update({
            is_primary: false
        }).eq("user_id", userId);
        const { error } = await supabase.from("upi_accounts").update({
            is_primary: true
        }).eq("user_id", userId).eq("id", upiAccountId);
        if (error) return {
            success: false,
            error: error.message
        };
        return {
            success: true,
            error: null
        };
    },
    // Withdrawal Request Flow
    async requestWithdrawal (userId, amount, method, accountId) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        // 1. Double submission protection: Check for any processing withdrawal transaction in last 30 seconds
        const thirtySecAgo = new Date(Date.now() - 30000).toISOString();
        const { data: recentTx, error: txCheckError } = await supabase.from("wallet_transactions").select("id").eq("wallet_id", userId).eq("type_id", "withdrawal").eq("status_id", "processing").gte("created_at", thirtySecAgo);
        if (txCheckError) return {
            success: false,
            error: "System check failed. Please try again."
        };
        if (recentTx && recentTx.length > 0) {
            return {
                success: false,
                error: "A withdrawal request is already processing. Please wait a moment."
            };
        }
        // 2. Fetch current wallet balance to double check available limits
        const balances = await this.getWalletBalances(userId);
        if (amount < 100) return {
            success: false,
            error: "Minimum withdrawal limit is ₹100.00."
        };
        if (amount > 50000) return {
            success: false,
            error: "Maximum withdrawal limit per transaction is ₹50,000.00."
        };
        if (amount > balances.available_balance) {
            return {
                success: false,
                error: "Insufficient funds in Available Balance."
            };
        }
        // 3. Initiate the payout transaction
        const referenceNumber = "TXN-WDL-" + Math.floor(10000000 + Math.random() * 90000000);
        const description = `Withdrawal payout via ${method === "upi" ? "UPI" : "Bank Transfer"}`;
        const { data: tx, error: txError } = await supabase.from("wallet_transactions").insert({
            wallet_id: userId,
            type_id: "withdrawal",
            status_id: "processing",
            amount: -amount,
            reference_number: referenceNumber,
            description
        }).select().single();
        if (txError || !tx) {
            return {
                success: false,
                error: txError?.message || "Failed to create withdrawal transaction."
            };
        }
        // 4. Create matching withdrawal request record
        const { error: wdlError } = await supabase.from("withdrawal_requests").insert({
            wallet_id: userId,
            amount,
            method_id: method,
            status_id: "processing",
            bank_account_id: method === "bank_account" ? accountId : null,
            upi_account_id: method === "upi" ? accountId : null,
            reference_number: referenceNumber,
            estimated_processing_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        });
        if (wdlError) {
            // Revert transaction state to failed to restore user's balance
            await supabase.from("wallet_transactions").update({
                status_id: "failed"
            }).eq("id", tx.id);
            return {
                success: false,
                error: wdlError.message
            };
        }
        return {
            success: true,
            error: null
        };
    },
    // Payout history list
    async getPayoutHistory (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("withdrawal_requests").select("*").eq("wallet_id", userId).order("created_at", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    },
    // Insights / Metrics calculations
    async getFinancialInsights (userId) {
        const transactions = await this.getTransactions(userId, {
            status: "completed"
        });
        let totalPrizeEarned = 0;
        let totalEntryFeesPaid = 0;
        let totalRefunds = 0;
        let largestPrize = 0;
        let prizeCount = 0;
        const monthlyMap = {};
        transactions.forEach((tx)=>{
            const amt = Math.abs(tx.amount);
            const date = new Date(tx.created_at);
            const monthKey = date.toLocaleString("default", {
                month: "short",
                year: "numeric"
            });
            if (tx.type_id === "prize_credit") {
                totalPrizeEarned += amt;
                prizeCount++;
                if (amt > largestPrize) largestPrize = amt;
                // Map monthly earnings
                monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + amt;
            } else if (tx.type_id === "contest_entry") {
                totalEntryFeesPaid += amt;
            } else if (tx.type_id === "contest_refund") {
                totalRefunds += amt;
            }
        });
        const averagePrize = prizeCount > 0 ? totalPrizeEarned / prizeCount : 0;
        // Convert monthly data map to array
        const monthlyEarnings = Object.entries(monthlyMap).map(([month, amount])=>({
                month,
                amount
            }));
        return {
            totalPrizeEarned,
            totalEntryFeesPaid,
            totalRefunds,
            averagePrize,
            largestPrize,
            monthlyEarnings
        };
    }
};
}),
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[project]/frontend/services/auth/contestRegistrationService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "contestRegistrationService",
    ()=>contestRegistrationService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/admin.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$walletService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/services/auth/walletService.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto [external] (crypto, cjs)");
;
;
;
;
const contestRegistrationService = {
    // Get active registration for user and contest
    async getRegistration (userId, contestId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("contest_registrations").select("*").eq("user_id", userId).eq("contest_id", contestId).maybeSingle();
        if (error || !data) return null;
        return data;
    },
    // Check seat counts
    async getSeatsDetails (contestId, maxSeats) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { count, error } = await supabase.from("contest_registrations").select("*", {
            count: "exact",
            head: true
        }).eq("contest_id", contestId).in("status", [
            "registered",
            "confirmed",
            "completed"
        ]);
        const registeredCount = error || count === null ? 0 : count;
        const seatsAvailable = Math.max(0, maxSeats - registeredCount);
        let status = "open";
        if (seatsAvailable === 0) {
            status = "sold_out";
        } else if (seatsAvailable < 20) {
            status = "closing_soon";
        }
        return {
            registeredCount,
            seatsAvailable,
            status
        };
    },
    // Complete checkout & process payment deduction
    async checkoutAndRegister (userId, contestId, contestName, entryFee, language) {
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        // 1. Check duplicate registration
        const existing = await this.getRegistration(userId, contestId);
        if (existing) {
            return {
                success: false,
                error: "You are already registered for this contest."
            };
        }
        // 2. Wallet checks (only if entry fee > 0)
        let transactionId = null;
        if (entryFee > 0) {
            const balanceObj = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$walletService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["walletService"].getWalletBalances(userId);
            if (!balanceObj || balanceObj.available_balance < entryFee) {
                return {
                    success: false,
                    error: "Insufficient wallet balance. Please add funds to your wallet."
                };
            }
            // Create a unique reference
            const refNo = `TXN-REG-${__TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(4).toString("hex").toUpperCase()}`;
            // Insert transaction into wallet_transactions to trigger deduction
            const { data: txn, error: txnErr } = await supabase.from("wallet_transactions").insert({
                wallet_id: userId,
                type_id: "contest_entry",
                status_id: "completed",
                amount: -entryFee,
                reference_number: refNo,
                contest_name: contestName,
                description: `Registration fee for ${contestName}`
            }).select("id").single();
            if (txnErr || !txn) {
                return {
                    success: false,
                    error: "Payment transaction processing failed. Try again."
                };
            }
            transactionId = txn.id;
        }
        // 3. Create registration row
        const regNo = `RL-REG-${contestId.replace("-live", "").toUpperCase()}-${__TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(3).toString("hex").toUpperCase()}`;
        const { data: reg, error: regErr } = await supabase.from("contest_registrations").insert({
            user_id: userId,
            contest_id: contestId,
            registration_number: regNo,
            selected_language: language,
            status: "confirmed",
            payment_status: entryFee > 0 ? "paid" : "waived",
            entry_fee_paid: entryFee
        }).select("id").single();
        if (regErr || !reg) {
            // Rollback payment transaction if possible (manual correction since no pg tx block here, or log critical)
            console.error("Critical: Payment succeeded but registration table row insert failed!", regErr);
            return {
                success: false,
                error: "Registration record creation failed. Contact support with transaction ID."
            };
        }
        // 4. Create participant record (seat number and mock reporting time)
        const seatNo = `SEAT-${__TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].randomBytes(2).toString("hex").toUpperCase()}`;
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
            details: {
                contestId,
                registrationNumber: regNo,
                amount: entryFee
            }
        });
        return {
            success: true,
            registrationId: reg.id,
            registrationNumber: regNo
        };
    },
    // Generate Digital Admit Card info
    async getAdmitCard (userId, contestId, contestDetails) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        // 1. Fetch user registration
        const { data: reg, error: regErr } = await supabase.from("contest_registrations").select("id, registration_number, selected_language, status").eq("user_id", userId).eq("contest_id", contestId).maybeSingle();
        if (regErr || !reg) return null;
        // 2. Fetch associated participant credentials
        const { data: part } = await supabase.from("contest_participants").select("seat_number, reporting_time, verification_status").eq("registration_id", reg.id).maybeSingle();
        // 3. Fetch profile
        const { data: profile } = await supabase.from("profiles").select("full_name, username, phone_number").eq("id", userId).single();
        // Clean dates formatting
        const rawRepTime = part?.reporting_time ? new Date(part.reporting_time) : new Date();
        const cleanRepStr = rawRepTime.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit"
        }) + ", " + rawRepTime.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short"
        });
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
    async generateVerificationCode (userId, contestId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit numeric
        const hashed = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(code).digest("hex");
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
    async verifyDeviceCode (userId, contestId, plainCode, fingerprint, deviceName) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const hashed = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto__$5b$external$5d$__$28$crypto$2c$__cjs$29$__["default"].createHash("sha256").update(plainCode).digest("hex");
        const { data: record, error } = await supabase.from("contest_verification_codes").select("*").eq("user_id", userId).eq("contest_id", contestId).eq("code_hash", hashed).eq("is_used", false).gt("expires_at", new Date().toISOString()).maybeSingle();
        if (error || !record) return false;
        // Mark code as used
        await supabase.from("contest_verification_codes").update({
            is_used: true
        }).eq("id", record.id);
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
    async isDeviceTrusted (userId, fingerprint) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("trusted_devices").select("id").eq("user_id", userId).eq("device_fingerprint", fingerprint).gt("expires_at", new Date().toISOString()).maybeSingle();
        return !error && !!data;
    },
    // Get user registration history
    async getRegistrationHistory (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("contest_registrations").select(`
        id,
        contest_id,
        registration_number,
        selected_language,
        status,
        payment_status,
        created_at
      `).eq("user_id", userId).order("created_at", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    }
};
}),
"[project]/frontend/app/api/auth/contests/register/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$contestRegistrationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/services/auth/contestRegistrationService.ts [app-route] (ecmascript)");
;
;
;
async function POST(req) {
    try {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Unauthorized"
            }, {
                status: 401
            });
        }
        const { contestId, contestName, entryFee, language } = await req.json();
        if (!contestId || !contestName || entryFee === undefined || !language) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required parameters"
            }, {
                status: 400
            });
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$contestRegistrationService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["contestRegistrationService"].checkoutAndRegister(user.id, contestId, contestName, entryFee, language);
        if (!result.success) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: result.error
            }, {
                status: 400
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
    } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: errorMsg
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__551fc327._.js.map