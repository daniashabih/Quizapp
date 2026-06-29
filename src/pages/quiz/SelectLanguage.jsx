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
                const res = await axios.get('/categories');
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
                const res = await axios.get('/activity/active-now');
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
                const res = await axios.post('/activity/heartbeat', { visitorId });
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
        if (n.includes('python')) return { icon: Binary, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
        if (n.includes('js') || n.includes('javascript')) return { icon: Globe, color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
        if (n.includes('java')) return { icon: Cpu, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
        if (n.includes('sql') || n.includes('db')) return { icon: Database, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
        if (n.includes('react')) return { icon: Layers, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' };
        return { icon: Code2, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    };

    const formattedActiveNow = activeNow === null ? '...' : new Intl.NumberFormat().format(activeNow);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 size={36} className="text-blue-400 animate-spin" />
                <p className="text-slate-400 text-sm font-medium animate-pulse">Loading tracks...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto animate-fade-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                    <div className="badge bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
                        <Sparkles size={12} />
                        Assessment Platform
                    </div>
                    <h1 className="text-4xl font-display font-bold text-[var(--foreground)] mb-3">
                        Choose your <span className="text-gradient">track</span>
                    </h1>
                    <p className="text-[var(--muted)] max-w-xl text-sm leading-relaxed">
                        Select a programming language track to begin your assessment. Each challenge is crafted to test real-world proficiency.
                    </p>
                </div>

                {/* Stat chip */}
                <div className="flex items-center gap-4 px-5 py-4 card shrink-0">
                    <div>
                        <p className="text-[10px] text-[var(--muted)] uppercase font-bold tracking-wider mb-0.5">Active Now</p>
                        <p className="text-xl font-display font-bold text-[var(--foreground)]">{formattedActiveNow}</p>
                    </div>
                    <div className="h-8 w-px bg-[var(--card-border)]" />
                    <div className="flex -space-x-2">
                        {['from-blue-500 to-blue-700', 'from-sky-500 to-sky-700', 'from-slate-400 to-slate-600'].map((grad, i) => (
                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-[var(--card-bg)] bg-gradient-to-br ${grad} shadow-sm`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Categories Grid */}
            {categories.length === 0 ? (
                <div className="text-center py-24 card border-dashed">
                    <Code2 size={40} className="mx-auto text-slate-600 mb-4" />
                    <p className="text-slate-400 font-medium mb-2">No tracks available yet.</p>
                    <p className="text-slate-500 text-sm">An administrator needs to add categories first.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categories.map((cat) => {
                        const { icon: Icon, color, bg, border } = getIcon(cat.name);
                        return (
                            <button
                                key={cat.id}
                                onClick={() => navigate('level', { state: { category: cat.name } })}
                                className={`group card p-6 text-left flex flex-col gap-5 transition-all duration-300 active:scale-[0.98]
                                    hover:border-${color.split('-')[1]}-500/40 hover:bg-${color.split('-')[1]}-500/[0.03] 
                                    hover:shadow-2xl hover:shadow-${color.split('-')[1]}-500/10`}
                            >
                                <div className={`w-12 h-12 rounded-xl ${bg} border ${border} flex items-center justify-center group-hover:scale-110 group-hover:bg-opacity-20 transition-all duration-300`}>
                                    <Icon size={22} className={color} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-lg font-display font-bold text-[var(--foreground)] mb-1.5 group-hover:text-blue-400 transition-colors">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[var(--muted)] text-xs leading-relaxed">
                                        Comprehensive assessment covering core foundations and specialized edge cases.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Multi-level</span>
                                    <div className={`flex items-center gap-1.5 ${color} font-semibold text-xs group-hover:gap-2.5 transition-all duration-300`}>
                                        Start Session <ArrowRight size={14} />
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
