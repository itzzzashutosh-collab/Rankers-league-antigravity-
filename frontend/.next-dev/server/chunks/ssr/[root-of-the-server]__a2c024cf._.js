module.exports = [
"[project]/frontend/.next-internal/server/app/dashboard/notifications/page/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/frontend/services/auth/notificationService.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "notificationService",
    ()=>notificationService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-rsc] (ecmascript)");
;
const notificationService = {
    // Fetch user notifications with unread grouping helper
    async getUserNotifications (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("user_notifications").select("*").eq("user_id", userId).eq("is_archived", false).order("created_at", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    },
    // Get unread count
    async getUnreadCount (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { count, error } = await supabase.from("user_notifications").select("*", {
            count: "exact",
            head: true
        }).eq("user_id", userId).eq("is_read", false).eq("is_archived", false);
        if (error || count === null) return 0;
        return count;
    },
    // Mark as read
    async markAsRead (userId, notificationId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("user_notifications").update({
            is_read: true,
            read_at: new Date().toISOString()
        }).eq("id", notificationId).eq("user_id", userId);
        return !error;
    },
    // Mark all as read
    async markAllAsRead (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("user_notifications").update({
            is_read: true,
            read_at: new Date().toISOString()
        }).eq("user_id", userId).eq("is_read", false);
        return !error;
    },
    // Archive notification
    async archiveNotification (userId, notificationId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("user_notifications").update({
            is_archived: true
        }).eq("id", notificationId).eq("user_id", userId);
        return !error;
    },
    // Delete notification
    async deleteNotification (userId, notificationId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("user_notifications").delete().eq("id", notificationId).eq("user_id", userId);
        return !error;
    },
    // Get preferences
    async getPreferences (userId) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("notification_preferences").select("*").eq("user_id", userId).single();
        if (error || !data) {
            return {
                user_id: userId,
                contest_reminders: true,
                result_notifications: true,
                prize_notifications: true,
                achievement_notifications: true,
                marketing_emails: false,
                platform_updates: true,
                system_alerts: true,
                email_enabled: true,
                sms_enabled: false,
                whatsapp_enabled: false,
                push_enabled: false,
                updated_at: new Date().toISOString()
            };
        }
        return data;
    },
    // Update preferences
    async updatePreferences (userId, prefs) {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { error } = await supabase.from("notification_preferences").update({
            ...prefs,
            updated_at: new Date().toISOString()
        }).eq("user_id", userId);
        return !error;
    },
    // Get announcements (public)
    async getAnnouncements () {
        const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
        const { data, error } = await supabase.from("announcements").select("*").order("publish_date", {
            ascending: false
        });
        if (error || !data) return [];
        return data;
    }
};
}),
"[project]/frontend/app/dashboard/notifications/NotificationsDashboardClient.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/frontend/app/dashboard/notifications/NotificationsDashboardClient.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/app/dashboard/notifications/NotificationsDashboardClient.tsx <module evaluation>", "default");
}),
"[project]/frontend/app/dashboard/notifications/NotificationsDashboardClient.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/frontend/app/dashboard/notifications/NotificationsDashboardClient.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/frontend/app/dashboard/notifications/NotificationsDashboardClient.tsx", "default");
}),
"[project]/frontend/app/dashboard/notifications/NotificationsDashboardClient.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$dashboard$2f$notifications$2f$NotificationsDashboardClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/frontend/app/dashboard/notifications/NotificationsDashboardClient.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$dashboard$2f$notifications$2f$NotificationsDashboardClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/frontend/app/dashboard/notifications/NotificationsDashboardClient.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$dashboard$2f$notifications$2f$NotificationsDashboardClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/frontend/app/dashboard/notifications/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PrivateNotificationsPage,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/utils/supabase/server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$notificationService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/services/auth/notificationService.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$dashboard$2f$notifications$2f$NotificationsDashboardClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/frontend/app/dashboard/notifications/NotificationsDashboardClient.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
async function PrivateNotificationsPage() {
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$utils$2f$supabase$2f$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createClient"])();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["redirect"])("/auth/login?redirect=/dashboard/notifications");
    }
    // Fetch private notifications and channel preferences
    const notifications = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$notificationService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notificationService"].getUserNotifications(user.id);
    const preferences = await __TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$services$2f$auth$2f$notificationService$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notificationService"].getPreferences(user.id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "w-full",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$frontend$2f$app$2f$dashboard$2f$notifications$2f$NotificationsDashboardClient$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
            initialNotifications: notifications,
            initialPreferences: preferences
        }, void 0, false, {
            fileName: "[project]/frontend/app/dashboard/notifications/page.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/frontend/app/dashboard/notifications/page.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
const dynamic = "force-dynamic";
}),
"[project]/frontend/app/dashboard/notifications/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/frontend/app/dashboard/notifications/page.tsx [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a2c024cf._.js.map