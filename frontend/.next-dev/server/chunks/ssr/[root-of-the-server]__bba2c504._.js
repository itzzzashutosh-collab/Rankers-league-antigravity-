module.exports = [
"[project]/frontend/.next-internal/server/app/dashboard/achievements/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/frontend/services/auth/achievementsService.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "achievementsService",
    ()=>achievementsService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-rsc] (ecmascript)");
;
const achievementsService = {
    // Get all user achievements
    async getUserAchievements (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // 1. Fetch catalog
        const { data: catalogData } = await supabase.from("achievements").select("*");
        // 2. Fetch user unlocked records
        const { data: unlockedData } = await supabase.from("user_achievements").select("*").eq("user_id", userId);
        const unlockedMap = new Map(); // key -> earned_at
        unlockedData?.forEach((ach)=>{
            unlockedMap.set(ach.achievement_key, ach.earned_at);
        });
        const catalog = (catalogData || []).map((item)=>{
            const isUnlocked = unlockedMap.has(item.key);
            return {
                key: item.key,
                category_id: item.category_id,
                title: item.title,
                description: item.description,
                icon: item.icon || "🏆",
                rarity: item.rarity,
                aura_reward: item.aura_reward,
                unlocked: isUnlocked,
                earned_at: unlockedMap.get(item.key)
            };
        });
        const totalUnlocked = catalog.filter((a)=>a.unlocked).length;
        const totalLocked = catalog.length - totalUnlocked;
        const completionPercentage = catalog.length > 0 ? Math.round(totalUnlocked / catalog.length * 100) : 0;
        // Get latest unlocked
        const sortedUnlocked = [
            ...catalog
        ].filter((a)=>a.unlocked && a.earned_at).sort((a, b)=>new Date(b.earned_at).getTime() - new Date(a.earned_at).getTime());
        const latestAchievement = sortedUnlocked[0] || null;
        // Suggest a locked one to unlock next
        const nextAchievement = catalog.find((a)=>!a.unlocked) || null;
        return {
            catalog,
            completionPercentage,
            totalUnlocked,
            totalLocked,
            latestAchievement,
            nextAchievement
        };
    },
    // Get all badges & progress
    async getUserBadges (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // 1. Fetch badges catalog
        const { data: badgesData } = await supabase.from("badges").select("*");
        // 2. Fetch user unlocked badges
        const { data: userBadgesData } = await supabase.from("user_badges").select("*").eq("user_id", userId);
        // 3. Fetch badge progress
        const { data: progressData } = await supabase.from("badge_progress").select("*").eq("user_id", userId);
        const unlockedMap = new Map(); // key -> earned_at
        userBadgesData?.forEach((b)=>{
            unlockedMap.set(b.badge_key, b.earned_at);
        });
        const progressMap = new Map(); // key -> progress
        progressData?.forEach((p)=>{
            progressMap.set(p.badge_key, p.current_progress);
        });
        return (badgesData || []).map((b)=>{
            const isUnlocked = unlockedMap.has(b.key);
            const current_progress = progressMap.get(b.key) || (isUnlocked ? b.target_value : 0);
            return {
                key: b.key,
                category_id: b.category_id,
                title: b.title,
                description: b.description,
                requirements: b.requirements,
                target_value: b.target_value,
                icon: b.icon || "🏅",
                rarity: b.rarity,
                badge_artwork: b.badge_artwork || "",
                unlocked: isUnlocked,
                earned_at: unlockedMap.get(b.key),
                current_progress
            };
        });
    },
    // Get all user certificates
    async getUserCertificates (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("user_certificates").select("*").eq("user_id", userId).order("created_at", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    },
    // Get user streaks
    async getUserStreak (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("streaks").select("*").eq("user_id", userId).single();
        if (error || !data) {
            return {
                user_id: userId,
                current_streak: 0,
                longest_streak: 0,
                last_active_date: null,
                weekly_activity_mask: 0,
                monthly_activity_mask: 0,
                updated_at: new Date().toISOString()
            };
        }
        return data;
    },
    // Get Aura details & tier progression
    async getAuraProgress (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        // 1. Get user profile aura
        const { data: profile } = await supabase.from("profiles").select("aura_points").eq("id", userId).single();
        const currentAura = profile?.aura_points || 0;
        // 2. Fetch all levels to evaluate tier
        const { data: tiers } = await supabase.from("aura_levels").select("*").order("min_aura", {
            ascending: true
        });
        let currentTier = "Explorer";
        let nextTier = null;
        let minAura = 0;
        let maxAura = 499;
        let color = "text-zinc-400 border-zinc-500/20 bg-zinc-500/5";
        let badge = "Explorer";
        if (tiers && tiers.length > 0) {
            for(let i = 0; i < tiers.length; i++){
                const t = tiers[i];
                if (currentAura >= t.min_aura && currentAura <= t.max_aura) {
                    currentTier = t.tier;
                    minAura = t.min_aura;
                    maxAura = t.max_aura;
                    color = t.color;
                    badge = t.badge;
                    nextTier = i + 1 < tiers.length ? tiers[i + 1].tier : null;
                    break;
                }
            }
        }
        const range = maxAura - minAura;
        const progressInTier = currentAura - minAura;
        const progressPercent = range > 0 ? Math.min(100, Math.max(0, Math.round(progressInTier / range * 100))) : 100;
        const remainingAura = nextTier ? maxAura + 1 - currentAura : 0;
        const tierInfo = {
            currentTier,
            nextTier,
            minAura,
            maxAura,
            color,
            badge,
            remainingAura,
            progressPercent
        };
        // 3. Fetch recent history
        const { data: historyData } = await supabase.from("aura_history").select("id, event_type, points, description, contest_name, created_at").eq("user_id", userId).order("created_at", {
            ascending: false
        });
        return {
            tierInfo,
            history: historyData || []
        };
    },
    // Verify certificate by public verification ID
    async verifyCertificate (verificationId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data: cert, error } = await supabase.from("user_certificates").select("*").eq("verification_id", verificationId).maybeSingle();
        if (error || !cert) {
            return {
                certificate: null,
                verificationCount: 0,
                error: "Certificate not found"
            };
        }
        // Increment verification auditor count
        const { data: verifyLogs } = await supabase.from("certificate_verifications").select("*").eq("certificate_id", cert.id).maybeSingle();
        let viewCount = 1;
        if (verifyLogs) {
            viewCount = verifyLogs.view_count + 1;
            await supabase.from("certificate_verifications").update({
                view_count: viewCount
            }).eq("certificate_id", cert.id);
        } else {
            await supabase.from("certificate_verifications").insert({
                certificate_id: cert.id,
                view_count: 1
            });
        }
        return {
            certificate: cert,
            verificationCount: viewCount,
            error: null
        };
    }
};
}),
"[project]/frontend/components/dashboard/achievements/AchievementsHubClient.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/frontend/components/dashboard/achievements/AchievementsHubClient.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/dashboard/achievements/AchievementsHubClient.tsx <module evaluation>", "default");
}),
"[project]/frontend/components/dashboard/achievements/AchievementsHubClient.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/frontend/components/dashboard/achievements/AchievementsHubClient.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/components/dashboard/achievements/AchievementsHubClient.tsx", "default");
}),
"[project]/frontend/components/dashboard/achievements/AchievementsHubClient.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$dashboard$2f$achievements$2f$AchievementsHubClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/components/dashboard/achievements/AchievementsHubClient.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$dashboard$2f$achievements$2f$AchievementsHubClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/frontend/components/dashboard/achievements/AchievementsHubClient.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$dashboard$2f$achievements$2f$AchievementsHubClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/frontend/app/dashboard/achievements/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AchievementsDashboardPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$achievementsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/services/auth/achievementsService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$dashboard$2f$achievements$2f$AchievementsHubClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/components/dashboard/achievements/AchievementsHubClient.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
async function AchievementsDashboardPage() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/auth/login?redirect=/dashboard/achievements");
    }
    // Fetch all achievements, badges, certificates, streaks and aura milestones
    const achievements = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$achievementsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["achievementsService"].getUserAchievements(user.id);
    const badges = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$achievementsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["achievementsService"].getUserBadges(user.id);
    const certificates = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$achievementsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["achievementsService"].getUserCertificates(user.id);
    const streak = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$achievementsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["achievementsService"].getUserStreak(user.id);
    const aura = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$achievementsService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["achievementsService"].getAuraProgress(user.id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$components$2f$dashboard$2f$achievements$2f$AchievementsHubClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            userId: user.id,
            initialAchievements: achievements,
            initialBadges: badges,
            initialCertificates: certificates,
            initialStreak: streak,
            initialAura: aura
        }, void 0, false, {
            fileName: "[project]/frontend/app/dashboard/achievements/page.tsx",
            lineNumber: 26,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/dashboard/achievements/page.tsx",
        lineNumber: 25,
        columnNumber: 5
    }, this);
}
const dynamic = "force-dynamic";
}),
"[project]/frontend/app/dashboard/achievements/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/dashboard/achievements/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__bba2c504._.js.map