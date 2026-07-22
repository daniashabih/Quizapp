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
        <div className="min-h-screen bg-[var(--page-bg)] flex flex-col font-sans transition-colors duration-300 relative overflow-hidden">
            <div className="relative z-50 pt-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <Navbar />
            </div>

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 relative z-10">
                <Outlet />
            </main>

            <footer className="relative z-10 border-t border-[var(--card-border)] bg-[var(--muted-bg)]">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[var(--foreground-muted)] font-medium">
                        © 2026 HangBug Platform. All rights reserved.
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)] italic hidden sm:block">
                        "Talk is cheap. Show me the code." — Linus Torvalds
                    </p>
                </div>
            </footer>
        </div>
    );
}
