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
        ? { label: percentage >= 90 ? "Exceptional" : "Commendable", color: "#2ECC71", gradient: "from-[#2ECC71] to-[#27AE60]" }
        : { label: "Keep Practicing", color: "#E74C3C", gradient: "from-[#E74C3C] to-[#C0392B]" };

    return (
        <div className="min-h-screen bg-[#2D1511] flex flex-col">
            {showConfetti && passed && (
                <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div key={i} className="absolute w-2 h-2 rounded-sm"
                            style={{
                                left: `${Math.random() * 100}%`, top: '-2%',
                                backgroundColor: ['#B66A36', '#D88A52', '#F39C12', '#2ECC71', '#E74C3C'][i % 5],
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
                    <div className="bg-[#37201B] border border-[#B66A36]/25 rounded-2xl overflow-hidden shadow-2xl">
                        {/* Header */}
                        <div className="p-8 lg:p-10 text-center bg-gradient-to-b from-[#3A211C] to-[#37201B]">
                            <div className="relative inline-flex mb-5">
                                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#B66A36] to-[#D88A52] flex items-center justify-center text-5xl shadow-2xl">
                                    {passed ? '🏆' : '📚'}
                                </div>
                                {passed && <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#B66A36] flex items-center justify-center shadow-lg"><Sparkles size={14} className="text-white" /></div>}
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-display font-extrabold text-white mb-2">{passed ? 'Congratulations!' : 'Keep Going!'}</h1>
                            <p className="text-[#A89B96] text-sm mb-6">{passed ? 'You passed!' : 'Review and try again.'}</p>

                            {/* Circular Score */}
                            <div className="circular-progress w-36 h-36 mx-auto mb-4">
                                <svg width="144" height="144" viewBox="0 0 144 144">
                                    <circle cx="72" cy="72" r="60" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <circle cx="72" cy="72" r="60" fill="none" stroke={passed ? '#2ECC71' : '#E74C3C'} strokeWidth="8" strokeLinecap="round"
                                        strokeDasharray={circumference} strokeDashoffset={offset} transform="rotate(-90, 72, 72)"
                                        style={{ transition: 'stroke-dashoffset 2s ease-out' }} />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className={`text-4xl font-display font-extrabold ${passed ? 'text-[#2ECC71]' : 'text-[#E74C3C]'}`}>{animateScore}%</span>
                                    <span className="text-[10px] text-[#A89B96] font-semibold uppercase">Score</span>
                                </div>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#B66A36]/15 text-[#D88A52] border border-[#B66A36]/30">
                                Grade: {grade.label}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="p-6 lg:p-8 space-y-5">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {[
                                    { label: 'Correct', value: score, icon: CheckCircle2, color: 'text-[#2ECC71]', bg: 'bg-[#2ECC71]/10' },
                                    { label: 'Wrong', value: total - score, icon: XCircle, color: 'text-[#E74C3C]', bg: 'bg-[#E74C3C]/10' },
                                    { label: 'Total', value: total, icon: BarChart3, color: 'text-[#D88A52]', bg: 'bg-[#B66A36]/10' },
                                    { label: 'Time', value: `${minutes}:${secs < 10 ? `0${secs}` : secs}`, icon: Clock, color: 'text-[#B66A36]', bg: 'bg-[#B66A36]/10' },
                                ].map(s => (
                                    <div key={s.label} className={`p-4 rounded-xl ${s.bg} border border-transparent text-center group hover:shadow-sm transition-all`}>
                                        <s.icon size={16} className={`${s.color} mx-auto mb-2 group-hover:scale-110 transition-transform`} />
                                        <p className={`text-xl font-display font-bold ${s.color}`}>{s.value}</p>
                                        <p className="text-[10px] text-[#A89B96] font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 rounded-xl bg-[#3A211C] border border-[#B66A36]/20">
                                    <p className="text-[10px] font-semibold text-[#A89B96] uppercase mb-1">Technology</p>
                                    <p className="text-sm font-bold text-white">{category}</p>
                                </div>
                                <div className="p-4 rounded-xl bg-[#3A211C] border border-[#B66A36]/20">
                                    <p className="text-[10px] font-semibold text-[#A89B96] uppercase mb-1">Difficulty</p>
                                    <p className="text-sm font-bold text-white capitalize">{difficulty}</p>
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
                                            className="flex items-center gap-1.5 text-xs font-semibold text-[#D88A52] hover:text-[#B66A36] transition-colors">
                                            <Download size={13} /> View Certificate
                                        </Link>
                                        <button className="flex items-center gap-1.5 text-xs font-semibold text-[#A89B96] hover:text-white transition-colors">
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
