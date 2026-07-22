import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Trophy, Award, Calendar, ChevronRight, Download, BarChart3, Star, Clock,
    User, Mail, Edit3, Check, X, Zap, Flame, Target, BookOpen,
    TrendingUp, Activity, Circle, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function UserDashboard() {
    const { user, updateUser } = useAuth();
    const [results, setResults] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) setEditData({ name: user.name, email: user.email });
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resultsRes, statsRes] = await Promise.all([
                    axios.get('/results/my-results'),
                    axios.get('/results/stats')
                ]);
                setResults(resultsRes.data);
                setStats(statsRes.data);
            } catch {
                toast.error("Failed to load your data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await axios.put('/auth/update-profile', editData);
            updateUser(res.data.user);
            toast.success("Profile updated!");
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        } finally {
            setIsSaving(false);
        }
    };

    const avgScore = results.length > 0
        ? (results.reduce((acc, r) => acc + parseFloat(r.percentage), 0) / results.length).toFixed(1)
        : 0;

    const streakDays = 7;
    const xpLevel = Math.floor(results.length / 3) + 1;
    const xpProgress = results.length % 3;

    const badges = [
        { label: 'Quick Learner', icon: Zap, earned: results.length >= 1, color: 'text-amber-500' },
        { label: 'Dedicated', icon: Flame, earned: streakDays >= 7, color: 'text-orange-500' },
        { label: 'Knowledge Seeker', icon: BookOpen, earned: results.length >= 5, color: 'text-[#163B34]' },
        { label: 'Top Scorer', icon: Trophy, earned: results.filter(r => r.percentage >= 90).length >= 1, color: 'text-emerald-500' },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#163B34]/20 border-t-[#163B34]" />
            </div>
        );
    }

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const activityData = [3, 5, 2, 7, 4, 6, 1];

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-up">
            {/* Welcome Card */}
            <div className="card overflow-hidden rounded-2xl">
                <div className="p-6 lg:p-8 relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#163B34]/5 to-[#289B7D]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#163B34] to-[#289B7D] flex items-center justify-center text-white font-display font-extrabold text-2xl shadow-xl">
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--foreground)]">
                                        Welcome back, {user?.name?.split(' ')[0] || 'Learner'}!
                                    </h1>
                                    <p className="text-[var(--foreground-muted)] text-sm mt-1">
                                        Ready to level up your skills today?
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200">
                                    <Flame size={18} className="text-amber-500" />
                                    <span className="text-sm font-bold text-amber-600">{streakDays} day streak</span>
                                </div>
                                <Link to="/dashboard/technologies" className="btn-primary text-sm">
                                    Take a Quiz
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardStat icon={Trophy} label="Total Quizzes" value={results.length} gradient="from-[#163B34] to-[#289B7D]" />
                <DashboardStat icon={BarChart3} label="Average Score" value={`${avgScore}%`} gradient="from-emerald-500 to-teal-500" />
                <DashboardStat icon={Award} label="Certificates" value={stats.filter(s => s.best_score >= 80).length} gradient="from-amber-500 to-orange-500" />
                <DashboardStat icon={Zap} label="XP Level" value={xpLevel} gradient="from-[#289B7D] to-[#53AF97]" />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    <div className="card p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-[var(--foreground)]">Profile</h3>
                            <button onClick={() => setIsEditing(!isEditing)}
                                className="p-2 rounded-lg text-[var(--foreground-muted)] hover:text-[#163B34] hover:bg-[var(--muted-bg)] transition-all">
                                {isEditing ? <X size={16} /> : <Edit3 size={16} />}
                            </button>
                        </div>

                        {!isEditing ? (
                            <div className="text-center">
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#163B34] to-[#289B7D] flex items-center justify-center text-white font-display font-extrabold text-3xl mx-auto mb-4 shadow-xl">
                                    {user?.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <h2 className="text-lg font-bold text-[var(--foreground)]">{user?.name}</h2>
                                <p className="text-sm text-[var(--foreground-muted)] mb-3">{user?.email}</p>
                                <span className="badge-emerald text-[10px]">{user?.role} Account</span>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdateProfile} className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Name</label>
                                    <input type="text" value={editData.name} onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                                        className="input-field mt-1" required />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">Email</label>
                                    <input type="email" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                                        className="input-field mt-1" required />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="button" onClick={() => setIsEditing(false)}
                                        className="btn-secondary flex-1 justify-center py-2 text-sm">Cancel</button>
                                    <button type="submit" disabled={isSaving}
                                        className="btn-primary flex-1 justify-center py-2 text-sm">
                                        {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><Check size={14} /> Save</>}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div className="card p-6 rounded-2xl">
                        <div className="flex items-center gap-3 mb-4">
                            <Zap size={18} className="text-amber-500" />
                            <h3 className="text-sm font-bold text-[var(--foreground)]">XP Progress</h3>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-[var(--foreground-muted)] font-medium">Level {xpLevel}</span>
                            <span className="text-xs text-[var(--foreground-muted)] font-medium">Level {xpLevel + 1}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar-fill" style={{ width: `${(xpProgress / 3) * 100}%` }} />
                        </div>
                        <p className="text-[10px] text-[var(--foreground-muted)] mt-1.5">{xpProgress}/3 quizzes to next level</p>
                    </div>

                    <div className="card p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-[var(--foreground)] mb-4">Achievements</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {badges.map((b, i) => (
                                <div key={i} className={`p-3 rounded-xl text-center border transition-all ${b.earned ? 'border-[#D4EBE5] bg-[#EAF5F2]' : 'border-[var(--card-border)] opacity-40'}`}>
                                    <b.icon size={20} className={`${b.color} mx-auto mb-1`} />
                                    <p className="text-[10px] font-bold text-[var(--foreground)]">{b.label}</p>
                                </div>
                            ))}
                        </div>
                        <Link to="/dashboard/profile" className="text-xs font-medium text-[#163B34] hover:text-[#289B7D] mt-3 inline-flex items-center gap-1">
                            View all achievements <ChevronRight size={12} />
                        </Link>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="card p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Activity size={16} className="text-[#163B34]" />
                                <h3 className="text-sm font-bold text-[var(--foreground)]">Weekly Activity</h3>
                            </div>
                            <span className="text-[10px] font-medium text-[var(--foreground-muted)]">This week</span>
                        </div>
                        <div className="flex items-end justify-between gap-2 h-32">
                            {weekDays.map((day, i) => {
                                const height = (activityData[i] / 7) * 100;
                                return (
                                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="text-[10px] text-[var(--foreground-muted)] font-medium">{activityData[i]}</span>
                                        <div className="w-full rounded-lg relative" style={{ height: '100px' }}>
                                            <div
                                                className="absolute bottom-0 w-full rounded-lg bg-gradient-to-t from-[#163B34] to-[#289B7D] transition-all duration-500 hover:opacity-80"
                                                style={{ height: `${height}%`, minHeight: activityData[i] > 0 ? '8px' : '0' }}
                                            />
                                        </div>
                                        <span className="text-[10px] text-[var(--foreground-muted)] font-medium">{day}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="card overflow-hidden rounded-2xl">
                        <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Clock size={16} className="text-[#289B7D]" />
                                <h3 className="text-sm font-bold text-[var(--foreground)]">Recent Quizzes</h3>
                            </div>
                            <Link to="/dashboard/quizzes" className="text-xs font-medium text-[#163B34] hover:text-[#289B7D] flex items-center gap-1">
                                View All <ChevronRight size={12} />
                            </Link>
                        </div>

                        <div className="divide-y divide-[var(--card-border)]">
                            {results.slice(0, 5).length > 0 ? (
                                results.slice(0, 5).map((res, i) => (
                                    <div key={i} className="p-5 flex items-center justify-between hover:bg-[var(--muted-bg)] transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg ${
                                                res.percentage >= 80 ? 'bg-emerald-50 border-emerald-200' :
                                                res.percentage >= 60 ? 'bg-[#EAF5F2] border-[#D4EBE5]' :
                                                'bg-red-50 border-red-200'
                                            }`}>
                                                {res.percentage >= 80 ? '🏆' : res.percentage >= 60 ? '✅' : '📚'}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[var(--foreground)]">{res.category}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-[10px] text-[var(--foreground-muted)]">{new Date(res.created_at).toLocaleDateString()}</span>
                                                    <span className="w-1 h-1 rounded-full bg-[var(--card-border)]" />
                                                    <span className="text-[10px] text-[var(--foreground-muted)]">{res.difficulty || 'Default'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className={`text-lg font-display font-bold ${
                                                    res.percentage >= 80 ? 'text-emerald-500' :
                                                    res.percentage >= 60 ? 'text-[#163B34]' :
                                                    'text-red-500'
                                                }`}>{res.percentage}%</p>
                                                <p className="text-[10px] text-[var(--foreground-muted)] font-medium">{res.score}/{res.total}</p>
                                            </div>
                                            <ChevronRight size={16} className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-14 h-14 rounded-2xl bg-[var(--muted-bg)] border border-[var(--card-border)] flex items-center justify-center mx-auto mb-3">
                                        <Trophy size={24} className="text-[var(--foreground-muted)] opacity-40" />
                                    </div>
                                    <h3 className="text-sm font-bold text-[var(--foreground)] mb-1">No quizzes yet</h3>
                                    <p className="text-xs text-[var(--foreground-muted)] mb-4">Start your first quiz to track progress.</p>
                                    <Link to="/dashboard/technologies" className="btn-primary text-sm px-6 py-2.5">
                                        Take a Quiz
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DashboardStat({ icon: Icon, label, value, gradient }) {
    return (
        <div className="card p-5 rounded-2xl flex items-center gap-4 group hover:-translate-y-0.5 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                <Icon size={20} className="text-white" />
            </div>
            <div>
                <p className="text-2xl font-display font-extrabold text-[var(--foreground)]">{value}</p>
                <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">{label}</p>
            </div>
        </div>
    );
}
