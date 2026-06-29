import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Code, ShieldCheck, User, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const { user, logout } = useAuth();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => setIsOpen(false), [location.pathname]);

    const isActive = (path) => location.pathname === path;

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--card-border)] shadow-2xl shadow-black/5 dark:shadow-black/20'
                : 'bg-transparent'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">

                        {/* Brand */}
                        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
                            <img
                                src={logo}
                                alt="DeeBug"
                                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                            <span className="text-lg font-display font-bold text-[var(--foreground)]">
                                Dee<span className="text-gradient">Bug</span>
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            <NavLink to="/" active={isActive('/')} icon={<LayoutDashboard size={15} />} label="Home" />
                            {user && <NavLink to="/dashboard" active={isActive('/dashboard')} icon={<LayoutDashboard size={15} />} label="Dashboard" />}
                            <NavLink to="/quiz" active={isActive('/quiz')} icon={<Code size={15} />} label="Challenges" />
                            {user?.role === 'admin' && (
                                <NavLink to="/admin" active={isActive('/admin')} icon={<ShieldCheck size={15} />} label="Admin" />
                            )}
                        </div>

                        {/* Right Actions */}
                        <div className="hidden md:flex items-center gap-3">
                            {user ? (
                                <>
                                    {/* User Info */}
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)]">
                                        <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                            <User size={14} />
                                        </div>
                                        <div className="leading-tight">
                                            <p className="text-xs font-bold text-[var(--foreground)]">{user.name}</p>
                                            <p className="text-[10px] text-[var(--muted)] uppercase tracking-wider font-semibold">{user.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-[var(--muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                                        title="Sign out"
                                    >
                                        <LogOut size={16} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/login"
                                        className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] px-4 py-2 transition-colors duration-200"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-lg shadow-blue-900/30 active:scale-95"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}

                        </div>

                        {/* Mobile Right */}
                        <div className="md:hidden flex items-center gap-2">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="p-2 text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)] rounded-lg transition-all"
                            >
                                {isOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Sheet */}
            <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsOpen(false)}
                />
                {/* Drawer */}
                <div className={`absolute top-0 right-0 h-full w-72 bg-[var(--card-bg)] border-l border-[var(--card-border)] shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full pt-20 px-6 pb-8">
                        <div className="space-y-1 flex-1">
                            <MobileNavLink to="/" active={isActive('/')} icon={<LayoutDashboard size={18} />} label="Home" />
                            {user && <MobileNavLink to="/dashboard" active={isActive('/dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />}
                            <MobileNavLink to="/quiz" active={isActive('/quiz')} icon={<Code size={18} />} label="Challenges" />
                            {user?.role === 'admin' && (
                                <MobileNavLink to="/admin" active={isActive('/admin')} icon={<ShieldCheck size={18} />} label="Admin" />
                            )}
                        </div>

                        <div className="pt-6 border-t border-[var(--card-border)]">
                            {user ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-xl card shadow-sm">
                                        <div className="w-9 h-9 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                            <User size={16} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[var(--foreground)]">{user.name}</p>
                                            <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-semibold">{user.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 font-medium text-sm transition-all"
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link to="/login" className="block w-full text-center py-3 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-all">
                                        Sign In
                                    </Link>
                                    <Link to="/register" className="block w-full text-center py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all">
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function NavLink({ to, active, icon, label }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${active
                ? 'bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/20'
                : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)]'
                }`}
        >
            {icon}
            {label}
        </Link>
    );
}

function MobileNavLink({ to, active, icon, label }) {
    return (
        <Link
            to={to}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${active
                ? 'bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/20'
                : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)]'
                }`}
        >
            {icon}
            {label}
        </Link>
    );
}
