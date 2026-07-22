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
        return { icon: Code2, color: 'text-[#289B7D]', bg: 'bg-[#EAF5F2]', border: 'border-[#D4EBE5]', hoverBorder: 'hover:border-[#289B7D]', glow: 'hover:shadow-[0_0_20px_rgba(22,59,52,0.1)]' };
    };

    const formattedActiveNow = activeNow === null ? '...' : new Intl.NumberFormat().format(activeNow);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 size={40} className="text-[#163B34] animate-spin" />
                <p className="text-[#163B34] text-sm font-bold tracking-widest uppercase animate-pulse">Initializing Tracks...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in relative z-10 pt-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5F2] border border-[#D4EBE5] text-[#163B34] text-xs font-bold tracking-widest uppercase mb-6">
                        <Sparkles size={14} />
                        Assessment Platform
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-extrabold text-[var(--foreground)] mb-4 tracking-tighter">
                        Choose your <span className="text-gradient">track</span>
                    </h1>
                    <p className="text-[var(--foreground-muted)] max-w-xl text-base leading-relaxed font-medium">
                        Select a programming language track to begin your assessment. Each challenge is crafted to test real-world proficiency.
                    </p>
                </div>

                <div className="flex items-center gap-5 px-6 py-4 bg-white border border-[#E5E7EB] rounded-2xl shrink-0">
                    <div>
                        <p className="text-[10px] text-[var(--foreground-muted)] uppercase font-bold tracking-widest mb-1">Active Now</p>
                        <p className="text-2xl font-display font-bold text-[var(--foreground)]">{formattedActiveNow}</p>
                    </div>
                    <div className="h-10 w-px bg-[#E5E7EB]" />
                    <div className="flex -space-x-3">
                        {['from-[#163B34] to-[#289B7D]', 'from-[#289B7D] to-[#53AF97]', 'from-[#1F4D44] to-[#163B34]'].map((grad, i) => (
                            <div key={i} className={`w-10 h-10 rounded-full border-2 border-white bg-gradient-to-br ${grad}`} />
                        ))}
                    </div>
                </div>
            </div>

            {categories.length === 0 ? (
                <div className="text-center py-24 bg-white border border-[#E5E7EB] rounded-3xl">
                    <div className="w-20 h-20 mx-auto bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-2xl flex items-center justify-center mb-6">
                        <Code2 size={36} className="text-[var(--foreground-muted)]" />
                    </div>
                    <p className="text-[var(--foreground)] font-bold text-xl mb-2">No tracks available yet.</p>
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
                                className={`group bg-white border border-[#E5E7EB] p-6 rounded-3xl text-left flex flex-col gap-6 transition-all duration-500 active:scale-[0.98] hover:border-[#163B34] hover:shadow-xl hover:-translate-y-1`}
                            >
                                <div className={`w-14 h-14 rounded-2xl ${bg} border ${border} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                                    <Icon size={26} className={color} />
                                </div>

                                <div className="flex-1">
                                    <h3 className="text-xl font-display font-bold text-[var(--foreground)] mb-2 tracking-tight group-hover:text-[#163B34] transition-colors duration-300">
                                        {cat.name}
                                    </h3>
                                    <p className="text-[var(--foreground-muted)] text-sm leading-relaxed font-medium">
                                        Comprehensive assessment covering core foundations and specialized edge cases.
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB]">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--foreground-muted)]">Multi-level</span>
                                    <div className="flex items-center gap-2 text-[#163B34] font-bold text-sm group-hover:gap-3 transition-all duration-300">
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
