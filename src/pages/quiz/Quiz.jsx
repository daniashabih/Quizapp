import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Clock, CheckCircle2, Menu, X, Bug, Terminal, ArrowRight, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Quiz = () => {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const selectedCategory = location.state?.category || location.state?.language;
    const difficulty = location.state?.difficulty;

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(60);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [wrongAnswers, setWrongAnswers] = useState({});
    const [showBugs, setShowBugs] = useState(false);

    const normalizeValue = (value) => String(value || '').trim().replace(/\s+/g, ' ').toLowerCase();

    useEffect(() => {
        setTimeLeft(60);
        setShowBugs(false);
    }, [currentQuestionIndex]);

    useEffect(() => {
        if (!loading && questions.length > 0 && !isSubmitted) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev <= 1 ? 0 : prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [loading, questions, isSubmitted, currentQuestionIndex]);

    useEffect(() => {
        if (timeLeft === 0 && !isSubmitted && !loading) {
            setShowBugs(true);
            const currentQ = questions[currentQuestionIndex];
            if (currentQ) setWrongAnswers(prev => ({ ...prev, [currentQ.id]: true }));
            setTimeout(() => {
                if (currentQuestionIndex < questions.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1);
                } else {
                    handleSubmitQuiz();
                }
            }, 1500);
        }
    }, [timeLeft, loading, isSubmitted]);

    useEffect(() => {
        if (!selectedCategory) {
            toast.error("Invalid session.");
            navigate('/quiz');
            return;
        }
        const fetchQuestions = async () => {
            try {
                let url = `/questions?category=${encodeURIComponent(selectedCategory)}`;
                if (difficulty) url += `&difficulty=${encodeURIComponent(difficulty)}`;
                const res = await axios.get(url);
                const filteredQuestions = res.data.filter((question) => {
                    const categoryMatches = normalizeValue(question.category) === normalizeValue(selectedCategory);
                    const difficultyMatches = !difficulty || normalizeValue(question.difficulty) === normalizeValue(difficulty);
                    return categoryMatches && difficultyMatches;
                });

                setQuestions(filteredQuestions);
                if (filteredQuestions.length === 0) {
                    toast.info(`No ${difficulty || ''} questions found for ${selectedCategory}.`.replace(/\s+/g, ' ').trim());
                }
            } catch {
                toast.error("Failed to load questions.");
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, [selectedCategory, difficulty, navigate]);

    const handleAnswerSelect = (questionId, optionIndex) => {
        setSelectedAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
        const currentQ = questions.find(q => q.id === questionId);
        if (currentQ) {
            let opts = currentQ.options;
            if (typeof opts === 'string') {
                try { opts = JSON.parse(opts); } catch { opts = []; }
            }
            if (opts[optionIndex] !== currentQ.correct_answer) {
                setShowBugs(true);
                setWrongAnswers(prev => ({ ...prev, [questionId]: true }));
                setTimeout(() => setShowBugs(false), 2000);
            } else {
                setWrongAnswers(prev => {
                    const n = { ...prev };
                    delete n[questionId];
                    return n;
                });
            }
        }
    };

    const handleSubmitQuiz = async () => {
        let score = 0;
        questions.forEach(q => {
            const idx = selectedAnswers[q.id];
            if (idx !== undefined) {
                let opts = q.options;
                if (typeof opts === 'string') { try { opts = JSON.parse(opts); } catch { opts = []; } }
                if (opts[idx] === q.correct_answer) score++;
            }
        });
        
        const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
        
        try {
            await axios.post('/results/save', {
                category: selectedCategory,
                score,
                total: questions.length,
                percentage,
                difficulty
            });
            toast.success("Result saved successfully!");
        } catch (error) {
            console.error("Error saving result:", error);
            const errorMsg = error.response?.data?.message || error.response?.data?.error || "Failed to save result to your profile.";
            toast.error(errorMsg);
        }

        setIsSubmitted(true);
        navigate('/quiz/result', { state: { score, total: questions.length } });
    };

    if (loading) {
        return (
            <div className="fixed inset-0 bg-[var(--page-bg)] flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                <p className="text-[var(--muted)] text-sm font-medium animate-pulse tracking-widest uppercase">Loading Assessment...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <div className="max-w-lg w-full card p-8 text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[var(--muted-bg)] border border-[var(--card-border)] flex items-center justify-center text-[var(--muted)]">
                        <Layers size={24} />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-[var(--foreground)] mb-3">
                        No questions available
                    </h2>
                    <p className="text-[var(--muted)] text-sm leading-relaxed mb-6">
                        We could not find any questions for the {selectedCategory} track{difficulty ? ` at ${difficulty} difficulty` : ''}.
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <button
                            onClick={() => navigate('/quiz')}
                            className="btn-secondary text-sm"
                        >
                            Change Track
                        </button>
                        <button
                            onClick={() => navigate(-1)}
                            className="btn-primary text-sm"
                        >
                            Choose Another Level
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];
    let currentOptions = currentQuestion?.options;
    if (typeof currentOptions === 'string') {
        try { currentOptions = JSON.parse(currentOptions); } catch { currentOptions = []; }
    }

    const answeredCount = Object.keys(selectedAnswers).length;
    const timerPct = (timeLeft / 60) * 100;
    const timerIsLow = timeLeft < 10;

    return (
        <div className="flex flex-col h-screen bg-[var(--page-bg)] text-[var(--foreground)] overflow-hidden transition-colors duration-300">
            {/* Header Bar */}
            <header className="h-16 bg-[var(--nav-bg)] backdrop-blur-xl border-b border-[var(--card-border)] flex items-center justify-between px-6 z-50 shrink-0">
                {/* Left: Context */}
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
                        <Terminal size={15} />
                    </div>
                    <div>
                        <p className="text-sm font-display font-bold text-[var(--foreground)] leading-tight">{selectedCategory}</p>
                        <p className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-semibold">{difficulty} level</p>
                    </div>
                </div>

                {/* Center: Timer */}
                <div className="hidden md:flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-2">
                        <Clock size={14} className={timerIsLow ? 'text-red-400' : 'text-[var(--muted)]'} />
                        <span className={`font-mono text-lg font-bold tabular-nums ${timerIsLow ? 'text-red-400 animate-pulse' : 'text-[var(--foreground)]'}`}>
                            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </span>
                    </div>
                    <div className="w-36 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${timerIsLow ? 'bg-red-500' : 'bg-blue-500'}`}
                            style={{ width: `${timerPct}%` }}
                        />
                    </div>
                </div>

                {/* Right: User + toggle */}
                <div className="flex items-center gap-3">
                    <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--muted-bg)] border border-[var(--card-border)] text-xs font-medium text-[var(--foreground)]">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {user?.name}
                    </div>
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 bg-[var(--muted-bg)] rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] transition-colors border border-[var(--card-border)] shadow-sm"
                    >
                        {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Main */}
                <main className="flex-1 overflow-y-auto">
                    <div className="max-w-3xl mx-auto p-8 pb-24">
                        {/* Q Status Row */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <span className="badge bg-blue-500/15 border border-blue-500/25 text-blue-400 text-[10px]">
                                    Q {currentQuestionIndex + 1} / {questions.length}
                                </span>
                                <span className="text-xs text-[var(--muted)] font-bold uppercase tracking-wider">Proctored</span>
                            </div>
                            <span className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-widest">Select one answer</span>
                        </div>

                        {/* Question */}
                        <div className="mb-8">
                            <h2 className="text-xl md:text-2xl font-display font-bold text-[var(--foreground)] leading-snug mb-6">
                                {currentQuestion?.question_text}
                            </h2>
                            <div className="h-px bg-gradient-to-r from-blue-500/40 to-transparent" />
                        </div>

                        {/* Options */}
                        <div className="space-y-3">
                            {currentOptions?.map((opt, idx) => {
                                const isSelected = selectedAnswers[currentQuestion.id] === idx;
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswerSelect(currentQuestion.id, idx)}
                                        className={`w-full group flex items-center gap-4 p-5 rounded-xl border text-left transition-all duration-200 ${isSelected
                                            ? 'bg-blue-500/10 border-blue-500 shadow-xl shadow-blue-500/10'
                                            : 'card bg-[var(--card-bg)] hover:bg-[var(--muted-bg)]'
                                            }`}
                                    >
                                        <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 font-mono font-bold text-sm transition-all ${isSelected
                                            ? 'bg-blue-600 border-blue-500 text-white'
                                            : 'bg-[var(--muted-bg)] border-[var(--card-border)] text-[var(--muted)] group-hover:border-blue-400'
                                            }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className={`text-sm font-medium leading-snug flex-1 ${isSelected ? 'text-[var(--foreground)]' : 'text-[var(--muted)] group-hover:text-[var(--foreground)]'}`}>
                                            {opt}
                                        </span>
                                        {isSelected && (
                                            <CheckCircle2 size={20} className="text-blue-400 shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Nav */}
                        <div className="flex items-center justify-between mt-10">
                            <button
                                onClick={() => setCurrentQuestionIndex(p => Math.max(0, p - 1))}
                                disabled={currentQuestionIndex === 0}
                                className="btn-secondary text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            {currentQuestionIndex < questions.length - 1 ? (
                                <button
                                    onClick={() => setCurrentQuestionIndex(p => p + 1)}
                                    className="btn-primary text-sm"
                                >
                                    Next <ArrowRight size={15} />
                                </button>
                            ) : (
                                <button
                                    onClick={handleSubmitQuiz}
                                    className="btn-primary text-sm bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/30"
                                >
                                    Submit Quiz <CheckCircle2 size={15} />
                                </button>
                            )}
                        </div>
                    </div>
                </main>

                {/* Sidebar */}
                <aside className={`${isSidebarOpen ? 'w-72' : 'w-0'} shrink-0 transition-all duration-300 overflow-hidden`}>
                    <div className="w-72 h-full flex flex-col bg-[var(--card-bg)] border-l border-[var(--card-border)] shadow-2xl">
                        {/* Nav Header */}
                        <div className="p-5 border-b border-[var(--card-border)]">
                            <div className="flex items-center gap-2 mb-4">
                                <Layers size={14} className="text-[var(--muted)]" />
                                <h3 className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Question Navigator</h3>
                            </div>
                            <div className="grid grid-cols-5 gap-2">
                                {questions.map((_, idx) => {
                                    const active = currentQuestionIndex === idx;
                                    const answered = selectedAnswers[questions[idx].id] !== undefined;
                                    const wrong = wrongAnswers[questions[idx].id];
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentQuestionIndex(idx)}
                                            className={`h-9 w-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${active
                                                ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-900/30'
                                                : wrong
                                                    ? 'bg-red-500/15 text-red-400 border border-red-500/30'
                                                    : answered
                                                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                                        : 'bg-[var(--muted-bg)] text-[var(--muted)] border border-[var(--card-border)] hover:border-blue-400'
                                                }`}
                                        >
                                            {wrong ? <Bug size={12} /> : idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="p-5 space-y-3">
                            <StatCard label="Answered" value={answeredCount} color="text-blue-500 dark:text-blue-400" />
                            <StatCard label="Remaining" value={questions.length - answeredCount} color="text-[var(--muted)]" />
                            <StatCard label="Errors" value={Object.keys(wrongAnswers).length} color="text-red-500" />
                        </div>

                        {/* Submit */}
                        <div className="mt-auto p-5 border-t border-[var(--card-border)]">
                            <button
                                onClick={handleSubmitQuiz}
                                className="btn-primary w-full justify-center py-3.5 text-sm bg-blue-600 hover:bg-blue-500"
                            >
                                Finish Session <ArrowRight size={15} />
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            {/* Wrong Answer Overlay */}
            <div className={`fixed inset-0 z-[100] pointer-events-none transition-opacity duration-300 ${showBugs ? 'opacity-100' : 'opacity-0'}`}>
                <div className="absolute inset-0 bg-red-950/20 backdrop-blur-[2px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-red-500">
                    <Bug size={72} className="animate-bounce" />
                    <span className="font-black text-xl tracking-tight mt-3">WRONG ANSWER</span>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ label, value, color }) => (
    <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--page-bg)] border border-[var(--card-border)] shadow-sm">
        <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">{label}</p>
        <p className={`text-xl font-display font-bold ${color}`}>{value}</p>
    </div>
);

export default Quiz;
