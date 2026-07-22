import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Code2, ArrowRight, Search, Sparkles, Clock, BookOpen, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const techIcons = { html: 'from-[#E44D26] to-[#C13D1A]', css: 'from-[#1572B6] to-[#0E5A8A]', javascript: 'from-[#F7DF1E] to-[#D4B815]', react: 'from-[#61DAFB] to-[#3AA9D4]', 'node.js': 'from-[#339933] to-[#267326]', python: 'from-[#3776AB] to-[#2A5C8A]', default: 'from-[#163B34] to-[#289B7D]' };

export default function Technologies() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try { const res = await axios.get('/categories'); setCategories(res.data); }
            catch { toast.error("Failed to load technologies"); }
            finally { setLoading(false); }
        };
        fetch();
    }, []);

    const filtered = categories.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const getGradient = (name) => techIcons[name.toLowerCase()] || techIcons.default;

    if (loading) return (
        <div className="min-h-screen bg-[var(--page-bg)] flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-[#163B34] mx-auto mb-4" />
                <p className="text-sm font-medium text-[var(--foreground-muted)] animate-pulse text-center">Loading technologies...</p>
            </div>
            <Footer />
        </div>
    );

    return (
        <div className="min-h-screen bg-[var(--page-bg)] flex flex-col">
            <Navbar />
            <div className="flex-1 pt-24 lg:pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="badge-emerald mx-auto mb-4"><Sparkles size={12} /> Technologies</div>
                        <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-[var(--foreground)] mb-4">Choose Your <span className="text-gradient">Stack</span></h1>
                        <p className="text-lg text-[var(--foreground-muted)] max-w-xl mx-auto">Select a technology to test your knowledge across multiple difficulty levels.</p>
                    </div>

                    <div className="relative max-w-md mx-auto mb-10">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                        <input type="text" placeholder="Search technologies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-[#E5E7EB] rounded-2xl py-3.5 pl-11 pr-4 text-sm text-[#163B34] placeholder-[var(--foreground-muted)] focus:outline-none focus:ring-2 focus:ring-[#163B34]/20 focus:border-[#163B34] transition-all" />
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <Code2 size={36} className="text-[var(--foreground-muted)] mx-auto mb-4" />
                            <p className="text-sm text-[var(--foreground-muted)]">No technologies found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filtered.map((cat) => {
                                const gradient = getGradient(cat.name);
                                return (
                                    <button key={cat.id}
                                        onClick={() => navigate('/technologies/level', { state: { category: cat.name } })}
                                        className="group bg-white border border-[#E5E7EB] rounded-2xl p-6 text-left hover:border-[#163B34] hover:shadow-xl hover:shadow-[#163B34]/10 hover:-translate-y-1 transition-all duration-300">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                                            <span className="text-white font-bold text-lg">{cat.name.charAt(0)}</span>
                                        </div>
                                        <h3 className="text-xl font-display font-bold text-[var(--foreground)] mb-2 group-hover:text-[#163B34] transition-colors">{cat.name}</h3>
                                        <p className="text-sm text-[var(--foreground-muted)] mb-4">Comprehensive assessment covering core concepts.</p>
                                        <div className="flex items-center gap-4 pt-3 border-t border-[#E5E7EB]">
                                            <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]"><BookOpen size={13} /> 100 Questions</div>
                                            <div className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]"><Clock size={13} /> 50 min</div>
                                        </div>
                                        <div className="flex items-center gap-1 pt-3 text-sm font-semibold text-[#163B34] group-hover:gap-2 transition-all">
                                            Start Quiz <ArrowRight size={14} />
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
