import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, Code2, Trophy, Award, User, Settings as SettingsIcon,
    LogOut, Menu, X, Bell, Search, ShieldCheck, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
    { icon: Code2, label: "Technologies", to: "/dashboard/technologies" },
    { icon: Trophy, label: "My Quizzes", to: "/dashboard/quizzes" },
    { icon: Award, label: "Certificates", to: "/dashboard/certificates" },
    { icon: Trophy, label: "Leaderboard", to: "/dashboard/leaderboard" },
    { icon: User, label: "Profile", to: "/dashboard/profile" },
    { icon: SettingsIcon, label: "Settings", to: "/dashboard/settings" },
];

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchFocus, setSearchFocus] = useState(false);
    const [notifOpen, setNotifOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    useEffect(() => { if (!user) navigate('/login'); }, [user, navigate]);
    useEffect(() => { setMobileOpen(false); setNotifOpen(false); }, [location.pathname]);
    useEffect(() => {
        const h = () => { if (window.innerWidth < 1024) setSidebarOpen(false); else setSidebarOpen(true); };
        h(); window.addEventListener('resize', h); return () => window.removeEventListener('resize', h);
    }, []);

    const isActive = (path) => path === '/dashboard' ? location.pathname === '/dashboard' : location.pathname.startsWith(path);

    return (
        <div className="min-h-screen bg-[#F7FAF9]">
            {mobileOpen && <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />}

            <aside className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 bg-white border-r border-gray-200 ${
                sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
            } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                <div className="h-full flex flex-col overflow-hidden">
                    <div className={`flex items-center h-16 lg:h-20 px-4 border-b border-gray-200 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
                        {sidebarOpen && (
                            <Link to="/" className="flex items-center shrink-0">
                                <BrandLogo size="sm" />
                            </Link>
                        )}
                        <button onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="hidden lg:flex p-1.5 rounded-lg text-[#6B7280] hover:text-[#163B34] hover:bg-[#F7FAF9] transition-all">
                            {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
                        </button>
                        <button onClick={() => setMobileOpen(false)} className="lg:hidden p-1.5 rounded-lg text-[#6B7280]"><X size={18} /></button>
                    </div>
                    <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                        {sidebarItems.map(item => (
                            <Link key={item.to} to={item.to}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                                    isActive(item.to) ? 'bg-[#163B34] text-white shadow-sm' : 'text-[#6B7280] hover:text-[#163B34] hover:bg-[#F7FAF9]'
                                }`}
                                title={!sidebarOpen ? item.label : undefined}>
                                <item.icon size={18} className="shrink-0" />
                                {sidebarOpen && <span>{item.label}</span>}
                                {!sidebarOpen && (
                                    <div className="absolute left-16 ml-2 px-2 py-1 rounded-lg bg-white border border-gray-200 shadow-lg text-xs font-medium text-[#163B34] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </nav>
                    <div className={`p-3 border-t border-gray-200 ${!sidebarOpen && 'flex justify-center'}`}>
                        {sidebarOpen ? (
                            <div className="space-y-1">
                                <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#163B34] hover:bg-[#F7FAF9] transition-all">Home</Link>
                                <button onClick={logout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"><LogOut size={18} /> Sign Out</button>
                            </div>
                        ) : (
                            <button onClick={logout} className="p-2.5 rounded-xl text-red-500 hover:bg-red-50" title="Sign Out"><LogOut size={18} /></button>
                        )}
                    </div>
                </div>
            </aside>

            <div className={`transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-16'}`}>
                <header className="sticky top-0 z-30 h-16 lg:h-20 bg-white/90 backdrop-blur-xl border-b border-gray-200">
                    <div className="flex items-center justify-between h-full px-4 lg:px-8">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl text-[#6B7280] hover:text-[#163B34] hover:bg-[#F7FAF9]"><Menu size={20} /></button>
                            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-200 bg-[#F7FAF9] ${searchFocus ? 'border-[#163B34] shadow-sm' : 'border-gray-200'}`}>
                                <Search size={16} className="text-[#6B7280]" />
                                <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm text-[#163B34] placeholder-[#9CA3AF] w-48 lg:w-64"
                                    onFocus={() => setSearchFocus(true)} onBlur={() => setSearchFocus(false)} />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <button onClick={() => setNotifOpen(!notifOpen)}
                                    className="relative p-2.5 rounded-xl text-[#6B7280] hover:text-[#163B34] hover:bg-[#F7FAF9] transition-all">
                                    <Bell size={18} />
                                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#163B34] ring-2 ring-white" />
                                </button>
                                {notifOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden animate-scale-in z-50">
                                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                                                <h3 className="text-sm font-semibold text-[#163B34]">Notifications</h3>
                                                <button className="text-xs font-medium text-[#6B7280] hover:text-[#163B34]">Mark all read</button>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {[
                                                    { title: "New Quiz Available", desc: "React Advanced quiz is live!", time: "5m ago", unread: true },
                                                    { title: "Certificate Earned", desc: "JavaScript Basics ✓", time: "2h ago", unread: true },
                                                    { title: "7-Day Streak!", desc: "Keep going! 🔥", time: "1d ago", unread: false },
                                                ].map((n, i) => (
                                                    <div key={i} className={`px-5 py-4 border-b border-gray-100 hover:bg-[#F7FAF9] transition-colors cursor-pointer ${n.unread ? 'bg-[#F7FAF9]' : ''}`}>
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div>
                                                                <p className="text-sm font-semibold text-[#163B34]">{n.title}</p>
                                                                <p className="text-xs text-[#6B7280] mt-0.5">{n.desc}</p>
                                                            </div>
                                                            {n.unread && <div className="w-2 h-2 rounded-full bg-[#163B34] mt-1.5 shrink-0" />}
                                                        </div>
                                                        <p className="text-[10px] text-[#6B7280] mt-1.5 font-medium">{n.time}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <button onClick={() => navigate('/dashboard/profile')}
                                className="flex items-center gap-2.5 pl-2.5 pr-1 py-1.5 rounded-xl hover:bg-[#F7FAF9] transition-all group">
                                <div className="w-8 h-8 rounded-lg bg-[#163B34] flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                                <div className="hidden lg:block text-left leading-tight">
                                    <p className="text-sm font-semibold text-[#163B34]">{user?.name || 'User'}</p>
                                    <p className="text-[10px] text-[#6B7280] font-medium">Learner</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </header>
                <main className="p-4 lg:p-8"><Outlet /></main>
            </div>
        </div>
    );
}
