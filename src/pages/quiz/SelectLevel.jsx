import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Sparkles, Target, Shield, Trophy, Star } from 'lucide-react';

const levels = [
    {
        id: 'beginner',
        name: 'Foundational',
        label: 'Beginner',
        desc: 'Ideal for those starting their journey. Focuses on core syntax and fundamental logic.',
        icon: Target,
        color: 'text-sky-400',
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/20',
        hoverBorder: 'hover:border-sky-500/40',
        btnBg: 'bg-sky-600 hover:bg-sky-500 shadow-sky-900/30',
    },
    {
        id: 'intermediate',
        name: 'Professional',
        label: 'Intermediate',
        desc: 'For experienced practitioners. Tests architectural patterns and complex problem solving.',
        icon: Shield,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        hoverBorder: 'hover:border-blue-500/40',
        btnBg: 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/30',
    },
    {
        id: 'expert',
        name: 'Maestro',
        label: 'Expert',
        desc: 'The ultimate challenge. Deep dives into performance, memory management, and edge cases.',
        icon: Trophy,
        color: 'text-yellow-400',
        bg: 'bg-yellow-500/10',
        border: 'border-yellow-500/20',
        hoverBorder: 'hover:border-yellow-500/40',
        btnBg: 'bg-yellow-600 hover:bg-yellow-500 shadow-yellow-900/30',
    },
];

export default function SelectLevel() {
    const navigate = useNavigate();
    const location = useLocation();
    const category = location.state?.category;

    if (!category) {
        navigate('/quiz');
        return null;
    }

    return (
        <div className="max-w-5xl mx-auto animate-fade-in">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="group flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] text-sm font-medium mb-10 transition-colors duration-200"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Tracks
            </button>

            {/* Header */}
            <div className="text-center mb-12">
                <div className="badge bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 mx-auto">
                    <Sparkles size={12} />
                    {category} Track
                </div>
                <h1 className="text-4xl font-display font-bold text-[var(--foreground)] mb-3">
                    Select your <span className="text-gradient">difficulty</span>
                </h1>
                <p className="text-[var(--muted)] text-sm max-w-lg mx-auto leading-relaxed">
                    Choose a starting point that matches your current skill level. You can always retry with a harder difficulty.
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
                            className={`group card p-7 text-left flex flex-col gap-5 ${level.hoverBorder} hover:shadow-xl transition-all duration-300 active:scale-[0.98]`}
                        >
                            <div className="flex items-start justify-between">
                                <div className={`w-12 h-12 rounded-xl ${level.bg} border ${level.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon size={22} className={level.color} />
                                </div>
                                <span className={`badge ${level.bg} ${level.color} border ${level.border} text-[10px]`}>
                                    {level.label}
                                </span>
                            </div>

                            <div className="flex-1">
                                <h3 className={`text-xl font-display font-bold text-[var(--foreground)] mb-2 group-hover:${level.color} transition-colors`}>
                                    {level.name}
                                </h3>
                                <p className="text-[var(--muted)] text-sm leading-relaxed">
                                    {level.desc}
                                </p>
                            </div>

                            <div className={`btn-primary ${level.btnBg} w-full justify-center text-sm mt-1 group-hover:-translate-y-0.5 transition-transform duration-300`}>
                                Start Challenge <ArrowRight size={15} />
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Pro Tip */}
            <div className="flex items-start gap-4 p-5 card shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400 shrink-0">
                    <Star size={18} />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-[var(--foreground)] mb-1">Pro Tip</h4>
                    <p className="text-[var(--muted)] text-xs leading-relaxed">
                        You can revisit any completed track to try a higher difficulty and earn advanced certifications. Each attempt is tracked and saved to your profile.
                    </p>
                </div>
            </div>
        </div>
    );
}
