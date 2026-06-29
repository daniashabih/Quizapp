import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Target, Trophy, Zap, Users, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

export default function Home() {
    const { user } = useAuth();
    const [hasNewQuizzes, setHasNewQuizzes] = useState(false);

    useEffect(() => {
        const checkNew = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/questions/status');
                const data = await res.json();
                setHasNewQuizzes(data.hasNew);
            } catch {
                // silent
            }
        };
        checkNew();
    }, []);

    const features = [
        {
            icon: Code2,
            title: "Multiple Languages",
            desc: "Practice with C, C++, Java, Python, and JavaScript across all skill levels.",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
        },
        {
            icon: Target,
            title: "Track Progress",
            desc: "Detailed analytics and insights to identify your weak spots and measure growth.",
            color: "text-sky-400",
            bg: "bg-sky-500/10",
            border: "border-sky-500/20",
        },
        {
            icon: Trophy,
            title: "Compete & Grow",
            desc: "Climb the leaderboard, earn badges and showcase your verified skills.",
            color: "text-yellow-400",
            bg: "bg-yellow-500/10",
            border: "border-yellow-500/20",
        },
    ];

    const stats = [
        { value: "10K+", label: "Questions", icon: BookOpen },
        { value: "1.2K+", label: "Candidates", icon: Users },
        { value: "5", label: "Languages", icon: Zap },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Hero */}
            <section className="flex flex-col items-center text-center pt-8 pb-20 space-y-8 animate-fade-in">
                {/* Logo Badge */}
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl scale-150" />
                    <img
                        src={logo}
                        alt="DeeBug"
                        className="relative w-20 h-20 object-contain drop-shadow-2xl"
                    />
                </div>

                {/* New quizzes pill */}
                {hasNewQuizzes && (
                    <div className="flex items-center gap-2 badge bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        New Quizzes Available
                    </div>
                )}

                {/* Heading */}
                <div className="space-y-4">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-[var(--foreground)] leading-[1.05] tracking-tight">
                        Master Coding<br />
                        <span className="text-gradient">The Smart Way</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-[var(--muted)] max-w-2xl mx-auto leading-relaxed font-light">
                        Challenge yourself with real-world coding questions, track your progress, and level up your skills in C, Python, Java and more.
                    </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                    {user ? (
                        <Link
                            to="/dashboard"
                            className="btn-primary text-base px-8 py-3.5 rounded-xl"
                        >
                            Go to Dashboard <ArrowRight size={18} />
                        </Link>
                    ) : (
                        <Link
                            to="/quiz"
                            className="btn-primary text-base px-8 py-3.5 rounded-xl"
                        >
                            Start Learning Now <ArrowRight size={18} />
                        </Link>
                    )}
                    {!user && (
                        <Link
                            to="/register"
                            className="btn-secondary text-base px-8 py-3.5 rounded-xl"
                        >
                            Create Free Account
                        </Link>
                    )}
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-8 pt-4">
                    {stats.map(({ value, label, icon: Icon }, i) => (
                        <div key={i} className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-1.5 text-[var(--foreground)] font-display font-bold text-2xl">
                                <Icon size={18} className="text-blue-400" />
                                {value}
                            </div>
                            <p className="text-xs text-[var(--muted)] uppercase tracking-wider font-semibold">{label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Divider */}
            <div className="divider mb-16" />

            {/* Features */}
            <section className="pb-8">
                <div className="text-center mb-12">
                    <h2 className="text-2xl font-display font-bold text-[var(--foreground)] mb-2">Everything you need to grow</h2>
                    <p className="text-[var(--muted)] text-sm">A complete platform built for serious developers.</p>
                </div>
                <div className="grid sm:grid-cols-3 gap-6">
                    {features.map(({ icon: Icon, title, desc, color, bg, border }, i) => (
                        <div
                            key={i}
                            className="card p-6 hover:border-blue-500/30 transition-all duration-300 group shadow-sm hover:shadow-md"
                        >
                            <div className={`w-11 h-11 rounded-xl ${bg} border ${border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon size={20} className={color} />
                            </div>
                            <h3 className="text-base font-display font-bold text-[var(--foreground)] mb-2">{title}</h3>
                            <p className="text-sm text-[var(--muted)] leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
