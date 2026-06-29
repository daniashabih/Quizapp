import { useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { ACTIVITY_HEARTBEAT_INTERVAL_MS, getVisitorId } from "../utils/activityPresence";

export default function MainLayout() {
    useEffect(() => {
        const visitorId = getVisitorId();

        const sendHeartbeat = async () => {
            try {
                await axios.post('/activity/heartbeat', { visitorId });
            } catch {
                // Presence updates are best-effort and should stay invisible to users.
            }
        };

        sendHeartbeat();
        const intervalId = window.setInterval(sendHeartbeat, ACTIVITY_HEARTBEAT_INTERVAL_MS);

        return () => {
            window.clearInterval(intervalId);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[var(--page-bg)] flex flex-col font-sans transition-colors duration-300">
            {/* Subtle ambient background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600/8 rounded-full blur-[100px]" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-sky-600/6 rounded-full blur-[100px]" />
            </div>

            <Navbar />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
                <Outlet />
            </main>

            <footer className="relative z-10 border-t border-[var(--card-border)]">
                <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
                    <p className="text-xs text-[var(--muted)] font-medium">
                        © 2026 DeeBug Platform. All rights reserved.
                    </p>
                    <p className="text-xs text-[var(--muted)] italic hidden sm:block">
                        "The only way to learn a new programming language is by writing programs in it." — Dennis Ritchie
                    </p>
                </div>
            </footer>
        </div>
    );
}
