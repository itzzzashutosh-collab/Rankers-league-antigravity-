module.exports = [
"[project]/frontend/.next-internal/server/app/api/auth/check-username/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/frontend/services/auth/usernameService.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "usernameService",
    ()=>usernameService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/admin.ts [app-route] (ecmascript)");
;
const USERNAME_REGEX = /^[a-z0-9_]{3,20}$/;
const usernameService = {
    // Validate username format
    validateFormat (username) {
        if (username.length < 3) return {
            valid: false,
            message: "Username must be at least 3 characters."
        };
        if (username.length > 20) return {
            valid: false,
            message: "Username cannot exceed 20 characters."
        };
        if (!USERNAME_REGEX.test(username)) {
            return {
                valid: false,
                message: "Only lowercase letters, numbers and underscores allowed."
            };
        }
        return {
            valid: true,
            message: "Username looks good!"
        };
    },
    // Check username availability — uses admin to bypass RLS
    async checkAvailability (username) {
        const format = this.validateFormat(username);
        if (!format.valid) return {
            available: false,
            message: format.message
        };
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const { data, error } = await admin.from("usernames").select("username").eq("username", username.toLowerCase()).single();
        if (error) {
            if (error.code === "PGRST116") {
                // PGRST116 = no rows found — username is available
                return {
                    available: true,
                    message: "Username is available!"
                };
            }
            return {
                available: false,
                message: `DB Error [${error.code}]: ${error.message}`
            };
        }
        if (data) return {
            available: false,
            message: "This username is already taken."
        };
        return {
            available: false,
            message: "Unable to verify availability. Try again."
        };
    },
    // Reserve username for a user (transactional: profiles + usernames tables)
    async reserveUsername (userId, username) {
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const lowerUsername = username.toLowerCase();
        // Update profile username
        const { error: profileError } = await admin.from("profiles").update({
            username: lowerUsername
        }).eq("id", userId);
        if (profileError) return {
            error: profileError.message
        };
        // Insert into username registry
        const { error: usernameError } = await admin.from("usernames").insert({
            username: lowerUsername,
            user_id: userId
        });
        if (usernameError) {
            // Rollback profile username if registry insert fails
            await admin.from("profiles").update({
                username: null
            }).eq("id", userId);
            return {
                error: "Username is already taken. Please choose another."
            };
        }
        return {
            error: null
        };
    },
    // Generate a unique participant ID like RL-20260001
    async generateParticipantId () {
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const year = new Date().getFullYear();
        const { count } = await admin.from("participant_identity").select("*", {
            count: "exact",
            head: true
        });
        const seq = ((count || 0) + 1).toString().padStart(4, "0");
        return `RL-${year}${seq}`;
    },
    // Register participant identity after profile completion
    async registerIdentity (userId, username) {
        const admin = (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$admin$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createAdminClient"])();
        const participantId = await this.generateParticipantId();
        const publicUrl = `/profile/${username.toLowerCase()}`;
        const { error } = await admin.from("participant_identity").insert({
            user_id: userId,
            participant_id: participantId,
            public_profile_url: publicUrl
        });
        if (error) return {
            error: error.message
        };
        return {
            error: null
        };
    }
};
}),
"[project]/frontend/app/api/auth/check-username/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$usernameService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/services/auth/usernameService.ts [app-route] (ecmascript)");
;
;
async function GET(request) {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    if (!username) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            available: false,
            message: "Username is required."
        }, {
            status: 400
        });
    }
    const result = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$usernameService$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["usernameService"].checkAvailability(username);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fedd227c._.js.map