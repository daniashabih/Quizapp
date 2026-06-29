import { Link, useLocation } from "react-router-dom";
import { Trophy, Home, RotateCcw, Sparkles, Download, Share2, CheckCircle2, XCircle } from "lucide-react";

export default function Result() {
    const location = useLocation();
    const { score, total } = location.state || { score: 0, total: 0 };
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    const getGrade = () => {
        if (percentage >= 90) return { label: "Exceptional", color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: "🏆" };
        if (percentage >= 70) return { label: "Strong", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "✅" };
        if (percentage >= 50) return { label: "Qualified", color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", icon: "📋" };
        return { label: "Needs Work", color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", icon: "📚" };
    };

    const grade = getGrade();

    return (
        <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            {/* Ambient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
                    style={{ background: 'radial-gradient(circle at center, rgba(99,102,241,0.08) 0%, transparent 65%)' }} />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-600/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-sky-600/6 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-lg z-10 animate-fade-in">
                <div className="glass rounded-2xl overflow-hidden">
                    {/* Trophy Header */}
                    <div className="p-8 text-center border-b border-[var(--card-border)]">
                        {/* Badge */}
                        <div className="relative inline-flex mb-6">
                            <div className={`w-20 h-20 rounded-2xl ${grade.bg} border ${grade.border} flex items-center justify-center text-4xl shadow-2xl`}>
                                {grade.icon}
                            </div>
                            <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center shadow-lg">
                                <Sparkles size={13} className="text-white" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-display font-bold text-[var(--foreground)] mb-1.5">
                            Assessment Complete
                        </h1>
                        <p className="text-[var(--muted)] text-sm">
                            Your results have been recorded and saved to your profile.
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="p-6 space-y-4">
                        {/* Score Bar */}
                        <div className="card p-5">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Your Score</span>
                                <span className={`text-2xl font-display font-bold ${grade.color}`}>{percentage}%</span>
                            </div>
                            <div className="h-2 bg-[var(--muted-bg)] rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-1000 ${percentage >= 70 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-sky-500' : 'bg-red-500'}`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2">
                                <span className="text-[10px] text-[var(--muted)] font-medium">0</span>
                                <span className="text-[10px] text-[var(--muted)] font-medium">100</span>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <StatBox
                                label="Correct"
                                value={score}
                                icon={<CheckCircle2 size={15} className="text-emerald-400" />}
                                color="text-emerald-400"
                            />
                            <StatBox
                                label="Wrong"
                                value={total - score}
                                icon={<XCircle size={15} className="text-red-400" />}
                                color="text-red-400"
                            />
                            <StatBox
                                label="Total"
                                value={total}
                                icon={<Trophy size={15} className="text-blue-400" />}
                                color="text-blue-400"
                            />
                        </div>

                        {/* Grade Badge */}
                        <div className={`flex items-center justify-center gap-2 p-3 rounded-xl ${grade.bg} border ${grade.border}`}>
                            <span className={`text-sm font-bold ${grade.color}`}>Grade: {grade.label}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 pt-0 space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <Link
                                to="/quiz"
                                className="btn-primary justify-center py-3 text-sm"
                            >
                                <RotateCcw size={15} /> New Quiz
                            </Link>
                            <Link
                                to="/dashboard"
                                className="btn-secondary justify-center py-3 text-sm"
                            >
                                <Home size={15} /> Dashboard
                            </Link>
                        </div>

                        <div className="flex items-center justify-center gap-6 pt-1">
                            <button className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-blue-400 transition-colors font-medium">
                                <Download size={13} /> Save Transcript
                            </button>
                            <div className="w-1 h-1 rounded-full bg-[var(--card-border)]" />
                            <button className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-blue-400 transition-colors font-medium">
                                <Share2 size={13} /> Share Result
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, icon, color }) {
    return (
        <div className="card p-4 text-center group hover:bg-[var(--muted-bg)] transition-all">
            <div className="flex justify-center mb-2 group-hover:scale-110 transition-transform">{icon}</div>
            <p className={`text-xl font-display font-bold ${color}`}>{value}</p>
            <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider mt-0.5">{label}</p>
        </div>
    );
}
