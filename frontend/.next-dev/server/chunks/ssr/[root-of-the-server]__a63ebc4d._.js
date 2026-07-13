module.exports = [
"[project]/frontend/.next-internal/server/app/dashboard/wallet/withdraw/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[project]/frontend/app/favicon.ico.mjs { IMAGE => \"[project]/frontend/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/favicon.ico.mjs { IMAGE => \"[project]/frontend/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/frontend/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/frontend/app/dashboard/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/dashboard/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/frontend/utils/supabase/admin.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createAdminClient",
    ()=>createAdminClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://bgsdovlumtjwvcwzjnnn.supabase.co");
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const createAdminClient = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
}),
"[project]/frontend/services/auth/walletService.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "walletService",
    ()=>walletService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/admin.ts [app-rsc] (ecmascript)");
;
;
const walletService = {
    // Get wallet balance summary
    async getWalletBalances (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("wallet_transactions").select("*").eq("wallet_id", userId).eq("id", transactionId).single();
        if (error || !data) return null;
        return data;
    },
    // Manage bank accounts
    async getBankAccounts (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("bank_accounts").select("*").eq("user_id", userId).order("is_primary", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    },
    async addBankAccount (userId, account) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("upi_accounts").select("*").eq("user_id", userId).order("is_primary", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    },
    async addUpiAccount (userId, upiId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
        const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createAdminClient"])();
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
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
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
"[project]/frontend/components/dashboard/wallet/WithdrawWinningsClient.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/frontend/components/dashboard/wallet/WithdrawWinningsClient.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/dashboard/wallet/WithdrawWinningsClient.tsx <module evaluation>", "default");
}),
"[project]/frontend/components/dashboard/wallet/WithdrawWinningsClient.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/frontend/components/dashboard/wallet/WithdrawWinningsClient.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/dashboard/wallet/WithdrawWinningsClient.tsx", "default");
}),
"[project]/frontend/components/dashboard/wallet/WithdrawWinningsClient.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$dashboard$2f$wallet$2f$WithdrawWinningsClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/components/dashboard/wallet/WithdrawWinningsClient.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$dashboard$2f$wallet$2f$WithdrawWinningsClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/frontend/components/dashboard/wallet/WithdrawWinningsClient.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$dashboard$2f$wallet$2f$WithdrawWinningsClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/frontend/app/dashboard/wallet/withdraw/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WithdrawWinningsPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$walletService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/services/auth/walletService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$dashboard$2f$wallet$2f$WithdrawWinningsClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/dashboard/wallet/WithdrawWinningsClient.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
async function WithdrawWinningsPage() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/auth/login?redirect=/dashboard/wallet/withdraw");
    }
    // Get current balances, bank accounts and UPI addresses
    const balances = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$walletService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["walletService"].getWalletBalances(user.id);
    const bankAccounts = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$walletService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["walletService"].getBankAccounts(user.id);
    const upiAccounts = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$walletService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["walletService"].getUpiAccounts(user.id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$dashboard$2f$wallet$2f$WithdrawWinningsClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            userId: user.id,
            initialBalances: balances,
            bankAccounts: bankAccounts,
            upiAccounts: upiAccounts
        }, void 0, false, {
            fileName: "[project]/frontend/app/dashboard/wallet/withdraw/page.tsx",
            lineNumber: 24,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/dashboard/wallet/withdraw/page.tsx",
        lineNumber: 23,
        columnNumber: 5
    }, this);
}
const dynamic = "force-dynamic";
}),
"[project]/frontend/app/dashboard/wallet/withdraw/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/dashboard/wallet/withdraw/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a63ebc4d._.js.map