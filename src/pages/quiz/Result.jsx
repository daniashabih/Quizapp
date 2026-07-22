import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Trophy, Home, RotateCcw, Download, CheckCircle2, XCircle, Clock, Award, BarChart3, Sparkles, Linkedin } from "lucide-react";
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function Result() {
    const location = useLocation();
    const { score = 0, total = 0, percentage = 0, category = 'Web Development', difficulty = 'beginner', timeTaken = 0 } = location.state || {};
    const [animateScore, setAnimateScore] = useState(0);
    const [showConfetti, setShowConfetti] = useState(percentage >= 70);

    const passed = percentage >= 70;
    const minutes = Math.floor(timeTaken / 60);
    const secs = timeTaken % 60;
    const circumference = 2 * Math.PI * 60;
    const offset = circumference - (animateScore / 100) * circumference;

    useEffect(() => {
        const timer = setTimeout(() => {
            const interval = setInterval(() => {
                setAnimateScore(prev => {
                    if (prev >= percentage) { clearInterval(interval); return percentage; }
                    return prev + 1;
                });
            }, 20);
            return () => clearInterval(interval);
        }, 500);
        return () => clearTimeout(timer);
    }, [percentage]);

    useEffect(() => {
        if (showConfetti) {
            const timer = setTimeout(() => setShowConfetti(false), 4000);
            return () => clearTimeout(timer);
        }
    }, []);

    const grade = passed
        ? { label: percentage >= 90 ? "Exceptional" : "Commendable", color: "#22C55E", gradient: "from-[#22C55E] to-[#16A34A]" }
        : { label: "Keep Practicing", color: "#EF4444", gradient: "from-[#EF4444] to-[#DC2626]" };

    return (
        <div className="min-h-screen bg-[var(--page-bg)] flex flex-col">
            {showConfetti && passed && (
                <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="absolute w-2 h-2 rounded-sm"
                            style={{
                                left: `${Math.random() * 100}%`, top: '-2%',
                                backgroundColor: ['#22C55E', '#289B7D', '#163B34', '#22C55E', '#EF4444'][i % 5],
                                animation: `confetti-fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
                                transform: `rotate(${Math.random() * 360}deg)`,
                                width: `${4 + Math.random() * 6}px`, height: `${4 + Math.random() * 6}px`,
                            }} />
                    ))}
                </div>
            )}
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 pt-24 lg:pt-28">
                <div className="w-full max-w-2xl animate-fade-up">
                    <div className="card overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="p-8 lg:p-10 text-center bg-gradient-to-b from-[var(--muted-bg)] to-[var(--card-bg)]">
                            <div className="relative inline-flex mb-5">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#163B34] to-[#289B7D] flex items-center justify-center text-5xl shadow-2xl">
                                    {passed ? '🏆' : '📚'}
                                </div>
                                {passed && <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#163B34] flex items-center justify-center shadow-lg"><Sparkles size={14} className="text-white" /></div>}
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-display font-extrabold text-[var(--foreground)] mb-2">{passed ? 'Congratulations!' : 'Keep Going!'}</h1>
                            <p className="text-[var(--foreground-muted)] text-sm mb-6">{passed ? 'You passed!' : 'Review and try again.'}</p>

                            {/* Circular Score */}
                            <div className="circular-progress w-36 h-36 mx-auto mb-4">
                                <svg width="144" height="144" viewBox="0 0 144 144">
                                    <circle cx="72" cy="72" r="60" fill="none" stroke="var(--card-border)" strokeWidth="8" />
                                    <circle cx="72" cy="72" r="60" fill="none" stroke={passed ? '#22C55E' : '#EF4444'} strokeWidth="8" strokeLinecap="round"
                                        strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90, 72, 72)"
                                        style={{ transition: 'stroke-dashoffset 2s ease-out' }} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-4xl font-display font-extrabold ${passed ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>{animateScore}%</span>
                                    <span className="text-[10px] text-[var(--foreground-muted)] font-semibold uppercase">Score</span>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF5F2] text-[#163B34] border border-[#D4EBE5]">
                                Grade: {grade.label}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="p-6 lg:p-8 space-y-5">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { label: 'Correct', value: score, icon: CheckCircle2, color: 'text-[#22C55E]', bg: 'bg-[#22C55E]/10' },
                                    { label: 'Wrong', value: total - score, icon: XCircle, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10' },
                                    { label: 'Total', value: total, icon: BarChart3, color: 'text-[#289B7D]', bg: 'bg-[#289B7D]/10' },
                                    { label: 'Time', value: `${minutes}:${secs < 10 ? `0${secs}` : secs}`, icon: Clock, color: 'text-[#163B34]', bg: 'bg-[#163B34]/10' },
                                ].map(s => (
                                    <div key={s.label} className={`p-4 rounded-xl ${s.bg} border border-transparent text-center group hover:shadow-sm transition-all`}>
                                        <s.icon size={16} className={`${s.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                                        <p className={`text-xl font-display font-bold ${s.color}`}>{s.value}</p>
                                        <p className="text-[10px] text-[var(--foreground-muted)] font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)]">
                                    <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase mb-1">Technology</p>
                                    <p className="text-sm font-bold text-[var(--foreground)]">{category}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)]">
                                    <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase mb-1">Difficulty</p>
                                    <p className="text-sm font-bold text-[var(--foreground)] capitalize">{difficulty}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => window.history.back()} className="btn-primary justify-center py-3.5 text-sm">
                                        <RotateCcw size={15} /> Retry
                                    </button>
                                    <Link to="/technologies" className="btn-secondary justify-center py-3.5 text-sm">
                                        <Home size={15} /> New Track
                                    </Link>
                                </div>
                                {passed && (
                                    <div className="flex items-center justify-center gap-3 pt-2">
                                        <Link to="/certificate/view" state={{ category, percentage, score, total, difficulty }}
                                            className="flex items-center gap-1.5 text-xs font-semibold text-[#289B7D] hover:text-[#163B34] transition-colors">
                                            <Download size={13} /> View Certificate
                                        </Link>
                                        <button className="flex items-center gap-1.5 text-xs font-semibold text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
                                            <Linkedin size={13} /> Share
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
