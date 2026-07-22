import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Target, Shield, Trophy, Star, Clock, BookOpen } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const levels = [
    {
        id: 'beginner',
        name: 'Foundational',
        label: 'Beginner',
        desc: 'Perfect for beginners. Covers core syntax, basic concepts, and fundamental logic building.',
        icon: Target,
        gradient: 'from-emerald-500 to-teal-500',
        color: 'text-emerald-600 dark:text-emerald-400',
        bg: 'bg-emerald-50 dark:bg-emerald-500/10',
        border: 'border-emerald-200 dark:border-emerald-500/20',
        hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500/40',
        details: { questions: '10-15', timer: '60s per Q', passing: '60%' },
    },
    {
        id: 'intermediate',
        name: 'Professional',
        label: 'Intermediate',
        desc: 'For experienced developers. Tests architectural patterns, best practices, and complex problem solving.',
        icon: Shield,
        gradient: 'from-[#289B7D] to-[#163B34]',
        color: 'text-[#289B7D]',
        bg: 'bg-[#EAF5F2]',
        border: 'border-[#D4EBE5]',
        hoverBorder: 'hover:border-[#289B7D]',
        details: { questions: '15-20', timer: '45s per Q', passing: '70%' },
    },
    {
        id: 'expert',
        name: 'Maestro',
        label: 'Expert',
        desc: 'The ultimate challenge. Deep dives into performance optimization, edge cases, and advanced patterns.',
        icon: Trophy,
        gradient: 'from-amber-500 to-orange-500',
        color: 'text-amber-600 dark:text-amber-400',
        bg: 'bg-amber-50 dark:bg-amber-500/10',
        border: 'border-amber-200 dark:border-amber-500/20',
        hoverBorder: 'hover:border-amber-400 dark:hover:border-amber-500/40',
        details: { questions: '20-25', timer: '30s per Q', passing: '80%' },
    },
];

export default function SelectLevel() {
    const navigate = useNavigate();
    const location = useLocation();
    const category = location.state?.category;

    if (!category) {
        navigate('/technologies');
        return null;
    }

    return (
        <div className="min-h-screen bg-[var(--page-bg)] flex flex-col">
            <Navbar />
            <div className="flex-1 pt-24 lg:pt-28 pb-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up">
                    {/* Back */}
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-[#163B34] transition-colors mb-8"
                    >
                        <ArrowLeft size={16} /> Back to Technologies
                    </button>

                    {/* Header */}
                    <div className="text-center mb-12">                            <div className="badge-emerald mx-auto mb-4">
                            <Sparkles size={12} />
                            {category} Track
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-[var(--foreground)] mb-4">
                            Choose Your{' '}
                            <span className="text-gradient">Difficulty</span>
                        </h1>
                        <p className="text-[var(--foreground-muted)] max-w-xl mx-auto">
                            Select the challenge level that matches your current expertise. You can always retry at a higher difficulty later.
                        </p>
                    </div>

                    {/* Levels Grid */}
                    <div className="grid md:grid-cols-3 gap-5 mb-10">
                        {levels.map((level) => {
                            const Icon = level.icon;
                            return (
                                <button
                                    key={level.id}
                                    onClick={() => navigate('/quiz/start', { state: { category, language: category, difficulty: level.id } })}
                                    className={`group card p-6 lg:p-7 text-left flex flex-col gap-5 ${level.hoverBorder} transition-all duration-300 active:scale-[0.98]`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${level.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                                            <Icon size={26} className="text-white" />
                                        </div>
                                        <span className={`badge ${level.bg} ${level.color} ${level.border} text-[10px]`}>
                                            {level.label}
                                        </span>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className={`text-xl font-display font-bold text-[var(--foreground)] mb-2 group-hover:${level.color} transition-colors`}>
                                            {level.name}
                                        </h3>
                                        <p className="text-sm text-[var(--foreground-muted)] leading-relaxed">{level.desc}</p>
                                    </div>

                                    {/* Details */}
                                    <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[var(--card-border)]">
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-[var(--foreground)]">{level.details.questions}</p>
                                            <p className="text-[10px] text-[var(--foreground-muted)] font-medium">Questions</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-[var(--foreground)]">{level.details.timer}</p>
                                            <p className="text-[10px] text-[var(--foreground-muted)] font-medium">Per Q</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-[var(--foreground)]">{level.details.passing}</p>
                                            <p className="text-[10px] text-[var(--foreground-muted)] font-medium">Passing</p>
                                        </div>
                                    </div>

                                    <div className={`btn bg-gradient-to-r ${level.gradient} text-white w-full justify-center text-sm py-3 rounded-xl font-semibold group-hover:-translate-y-0.5 transition-all duration-300 shadow-lg`}>
                                        Start Challenge <ArrowRight size={15} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Pro Tip */}
                    <div className="card p-6 rounded-2xl flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                            <Star size={18} />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-[var(--foreground)] mb-1">Pro Tip</h4>
                            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
                                You can revisit any completed track to try a higher difficulty and earn advanced certifications. 
                                Each attempt is tracked and saved to your profile. Score 80%+ to unlock a verified certificate!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
