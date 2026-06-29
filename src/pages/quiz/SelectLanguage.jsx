import { Code2, ArrowRight, Loader2, Sparkles, Binary, Cpu, Database, Globe, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ACTIVITY_HEARTBEAT_INTERVAL_MS, getVisitorId } from '../../utils/activityPresence';

export default function SelectLanguage() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeNow, setActiveNow] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('/api/categories');
                setCategories(res.data);
            } catch {
                toast.error("Failed to load categories");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        let isActive = true;
        const visitorId = getVisitorId();

        const fetchActiveNow = async () => {
            try {
                const res = await axios.get('/api/activity/active-now');
                if (isActive) {
                    setActiveNow(res.data.activeNow);
                }
            } catch {
                if (isActive) {
                    setActiveNow(0);
                }
            }
        };

        const registerVisitor = async () => {
            try {
                const res = await axios.post('/api/activity/heartbeat', { visitorId });
                if (isActive) {
                    setActiveNow(res.data.activeNow);
                }
            } catch {
                fetchActiveNow();
            }
        };

        registerVisitor();
        const intervalId = window.setInterval(fetchActiveNow, ACTIVITY_HEARTBEAT_INTERVAL_MS);

        return () => {
            isActive = false;
            window.clearInterval(intervalId);
        };
    }, []);

    const getIcon = (name) => {
        const n = name.toLowerCase();
        if (n.includes('python')) return { icon: Binary, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', hoverBorder: 'hover:border-cyan-500/50', glow: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]' };
        if (n.includes('js') || n.includes('javascript')) return { icon: Globe, color: 'text-amethyst-400', bg: 'bg-amethyst-500/10', border: 'border-amethyst-500/20', hoverBorder: 'hover:border-amethyst-500/50', glow: 'hover:shadow-[0_0_20px_rgba(157,0,255,0.15)]' };
        if (n.includes('java')) return { icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', hoverBorder: 'hover:border-cyan-500/50', glow: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]' };
        if (n.includes('sql') || n.includes('db')) return { icon: Database, color: 'text-amethyst-400', bg: 'bg-amethyst-500/10', border: 'border-amethyst-500/20', hoverBorder: 'hover:border-amethyst-500/50', glow: 'hover:shadow-[0_0_20px_rgba(157,0,255,0.15)]' };
        if (n.includes('react')) return { icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', hoverBorder: 'hover:border-cyan-500/50', glow: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]' };
        return { icon: Code2, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', hoverBorder: 'hover:border-cyan-500/50', glow: 'hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]' };
    };

    const formattedActiveNow = activeNow === null ? '...' : new Intl.NumberFormat().format(activeNow);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 size={40} className="text-cyan-400 animate-spin glow-text" />
                <p className="text-cyan-400 text-sm font-bold tracking-widest uppercase animate-pulse">Initializing Tracks...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in relative z-10 pt-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold tracking-widest uppercase mb-6 backdrop-blur-md">
                        <Sparkles size={14} className="animate-pulse" />
                        Assessment Platform
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-extrabold text-white mb-4 tracking-tighter">
                        Choose your <span className="text-gradient">track</span>
                    </h1>
                    <p className="text-[var(--foreground-muted)] max-w-xl text-base leading-relaxed font-medium">
                        Select a programming language track to begin your assessment. Each challenge is crafted to test real-world proficiency.
                    </p>
                </div>

                {/* Stat chip */}
                <div className="flex items-center gap-5 px-6 py-4 glass-panel rounded-2xl shrink-0">
                    <div>
                        <p className="text-[10px] text-[var(--foreground-muted)] uppercase font-bold tracking-widest mb-1">Active Now</p>
                        <p className="text-2xl font-display font-bold text-white glow-text">{formattedActiveNow}</p>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="flex -space-x-3">
                        {['from-cyan-400 to-cyan-600', 'from-amethyst-400 to-amethyst-600', 'from-cyan-700 to-obsidian-600'].map((grad, i) => (
                            <div key={i} className={`w-10 h-10 rounded-full border-2 border-obsidian-900 bg-gradient-to-br ${grad} shadow-[0_0_10px_rgba(0,0,0,0.5)]`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            {categories.length === 0 ? (
                <div className="text-center py-24 glass-panel rounded-3xl border border-white/5">
                    <div className="w-20 h-20 mx-auto bg-obsidian-900 border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                        <Code2 size={36} className="text-obsidian-500" />
                    </div>
                    <p className="text-white font-bold text-xl mb-2">No tracks available yet.</p>
                    <p className="text-[var(--foreground-muted)] text-sm font-medium">System awaits administrator configuration.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat) => {
                        const { icon: Icon, color, bg, border, hoverBorder, glow } = getIcon(cat.name);
                        return (
                            <button
                                key={cat.id}
                                onClick={() => navigate('level', { state: { category: cat.name } })}
                                className={`group glass-panel p-6 rounded-3xl text-left flex flex-col gap-6 transition-all duration-500 active:scale-[0.98]
                                    ${hoverBorder} hover:bg-white/[0.02] hover:-translate-y-1 ${glow}`}
                            >
                                <div className={`w-14 h-14 rounded-2xl ${bg} border ${border} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-inner`}>
                                    <Icon size={26} className={color} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-display font-bold text-white mb-2 tracking-tight group-hover:text-cyan-400 transition-colors duration-300">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[var(--foreground-muted)] text-sm leading-relaxed font-medium">
                                        Comprehensive assessment covering core foundations and specialized edge cases.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Multi-level</span>
                                    <div className={`flex items-center gap-2 ${color} font-bold text-sm group-hover:gap-3 transition-all duration-300`}>
                                        Start Session <ArrowRight size={16} />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
