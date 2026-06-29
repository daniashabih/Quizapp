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
            <nav className={`w-full transition-all duration-500 rounded-2xl ${scrolled ? 'glass-nav py-2 px-4' : 'bg-transparent py-4 px-2'}`}>
                <div className="flex items-center justify-between">
                    
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-3 group shrink-0">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-md group-hover:bg-cyan-400/40 transition-colors" />
                            <img
                                src={logo}
                                alt="DeeBug"
                                className="relative h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-110"
                            />
                        </div>
                        <span className="text-xl font-display font-bold text-white tracking-wide">
                            Dee<span className="text-gradient">Bug</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-2 bg-obsidian-900/60 p-1.5 rounded-xl border border-white/5 backdrop-blur-md">
                        <NavLink to="/" active={isActive('/')} icon={<LayoutDashboard size={16} />} label="Home" />
                        {user && <NavLink to="/dashboard" active={isActive('/dashboard')} icon={<LayoutDashboard size={16} />} label="Dashboard" />}
                        <NavLink to="/quiz" active={isActive('/quiz')} icon={<Code size={16} />} label="Challenges" />
                        {user?.role === 'admin' && (
                            <NavLink to="/admin" active={isActive('/admin')} icon={<ShieldCheck size={16} />} label="Admin" />
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                {/* User Info */}
                                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-obsidian-800/80 border border-white/10 hover:border-cyan-500/30 transition-colors">
                                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                                        <User size={16} />
                                    </div>
                                    <div className="leading-tight">
                                        <p className="text-sm font-bold text-white">{user.name}</p>
                                        <p className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold glow-text">{user.role}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={logout}
                                    className="p-2 text-obsidian-300 hover:text-amethyst-400 hover:bg-amethyst-500/10 rounded-lg transition-all duration-200"
                                    title="Sign out"
                                >
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="text-sm font-semibold text-obsidian-300 hover:text-white px-4 py-2 transition-colors duration-200"
                                >
                                    Sign In
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-neon px-6 py-2"
                                >
                                    Get Started
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 text-obsidian-300 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sheet */}
            <div className={`fixed inset-0 z-[100] md:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
                {/* Backdrop */}
                <div
                    className={`absolute inset-0 bg-obsidian-950/80 backdrop-blur-md transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
                    onClick={() => setIsOpen(false)}
                />
                {/* Drawer */}
                <div className={`absolute top-0 right-0 h-full w-72 glass-panel shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="flex flex-col h-full pt-16 px-6 pb-8">
                        <button onClick={() => setIsOpen(false)} className="absolute top-6 right-6 text-obsidian-300 hover:text-white">
                            <X size={24} />
                        </button>

                        <div className="space-y-2 flex-1 mt-8">
                            <MobileNavLink to="/" active={isActive('/')} icon={<LayoutDashboard size={18} />} label="Home" />
                            {user && <MobileNavLink to="/dashboard" active={isActive('/dashboard')} icon={<LayoutDashboard size={18} />} label="Dashboard" />}
                            <MobileNavLink to="/quiz" active={isActive('/quiz')} icon={<Code size={18} />} label="Challenges" />
                            {user?.role === 'admin' && (
                                <MobileNavLink to="/admin" active={isActive('/admin')} icon={<ShieldCheck size={18} />} label="Admin" />
                            )}
                        </div>

                        <div className="pt-6 border-t border-white/10">
                            {user ? (
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 rounded-xl bg-obsidian-800/50 border border-white/5 shadow-sm">
                                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-white">{user.name}</p>
                                            <p className="text-xs text-cyan-400 uppercase tracking-wider font-semibold glow-text">{user.role}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center justify-center gap-3 p-3 rounded-xl text-amethyst-400 hover:bg-amethyst-500/10 border border-transparent hover:border-amethyst-500/20 font-medium text-sm transition-all"
                                    >
                                        <LogOut size={18} /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    <Link to="/login" className="btn-glass w-full">
                                        Sign In
                                    </Link>
                                    <Link to="/register" className="btn-neon w-full">
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
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${active
                ? 'bg-cyan-500/15 text-cyan-400 shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]'
                : 'text-obsidian-300 hover:text-white hover:bg-white/5'
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
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${active
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(0,240,255,0.05)]'
                : 'text-obsidian-300 hover:text-white hover:bg-white/5'
                }`}
        >
            {icon}
            {label}
        </Link>
    );
}
