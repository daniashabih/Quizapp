import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trophy, Award, Calendar, ChevronRight, Download, BarChart2, Star, Clock, User, Mail, Edit3, Check, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function UserDashboard() {
    const { user, updateUser } = useAuth();
    const [results, setResults] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Profile Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: '', email: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setEditData({ name: user.name, email: user.email });
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await axios.put('/auth/update-profile', editData);
            updateUser(res.data.user);
            toast.success(res.data.message);
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resultsRes, statsRes] = await Promise.all([
                    axios.get('/results/my-results'),
                    axios.get('/results/stats')
                ]);
                setResults(resultsRes.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                toast.error("Failed to load your progress.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleDownloadCertificate = (category, score) => {
        // Logic to generate/download certificate
        // We can open a new window with a printable certificate view
        const certificateWindow = window.open('', '_blank');
        
        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Certificate of Achievement - ${category}</title>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Outfit:wght@700&display=swap" rel="stylesheet">
                <style>
                    body {
                        margin: 0;
                        padding: 0;
                        background: #f8fafc;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        font-family: 'Inter', sans-serif;
                    }
                    .certificate {
                        width: 800px;
                        padding: 60px;
                        background: white;
                        border: 20px solid #6366f1;
                        position: relative;
                        text-align: center;
                        box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
                    }
                    .certificate-inner {
                        border: 2px solid #e2e8f0;
                        padding: 40px;
                    }
                    .logo {
                        font-family: 'Outfit', sans-serif;
                        font-size: 24px;
                        color: #6366f1;
                        margin-bottom: 20px;
                    }
                    h1 {
                        font-family: 'Outfit', sans-serif;
                        font-size: 48px;
                        margin: 20px 0;
                        color: #1e293b;
                    }
                    .subtitle {
                        font-size: 18px;
                        color: #64748b;
                        margin-bottom: 40px;
                    }
                    .name {
                        font-size: 36px;
                        font-weight: 700;
                        color: #6366f1;
                        border-bottom: 2px solid #e2e8f0;
                        display: inline-block;
                        padding-bottom: 5px;
                        margin-bottom: 30px;
                    }
                    .description {
                        font-size: 18px;
                        line-height: 1.6;
                        color: #475569;
                        max-width: 600px;
                        margin: 0 auto 40px;
                    }
                    .footer {
                        display: flex;
                        justify-content: space-between;
                        margin-top: 60px;
                    }
                    .sign-box {
                        width: 200px;
                        border-top: 1px solid #94a3b8;
                        padding-top: 10px;
                        color: #64748b;
                        font-size: 14px;
                    }
                    .badge {
                        position: absolute;
                        bottom: 60px;
                        left: 50%;
                        transform: translateX(-50%);
                        width: 100px;
                        height: 100px;
                        opacity: 0.1;
                    }
                    @media print {
                        body { background: white; }
                        .certificate { box-shadow: none; border-color: #6366f1 !important; print-color-adjust: exact; }
                    }
                </style>
            </head>
            <body>
                <div class="certificate">
                    <div class="certificate-inner">
                        <div class="logo">DeeBug Platform</div>
                        <p class="subtitle">CERTIFICATE OF ACHIEVEMENT</p>
                        <p>This is to certify that</p>
                        <div class="name">${user?.name || 'Candidate'}</div>
                        <p class="description">
                            Has successfully completed the assessment for <strong>${category}</strong> 
                            with a score of <strong>${score}%</strong>, demonstrating exceptional 
                            proficiency and technical knowledge in the field.
                        </p>
                        <div class="footer">
                            <div class="sign-box">
                                Date Issued: ${new Date().toLocaleDateString()}<br>
                                Platform Director
                            </div>
                            <div class="sign-box">
                                Certificate ID: DB-${Math.random().toString(36).substr(2, 9).toUpperCase()}<br>
                                Verified Assessment
                            </div>
                        </div>
                    </div>
                </div>
                <script>
                    window.onload = function() {
                        window.print();
                    }
                </script>
            </body>
            </html>
        `;
        
        certificateWindow.document.write(html);
        certificateWindow.document.close();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500/20 border-t-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
            {/* Header */}
            <header className="mb-10">
                <h1 className="text-3xl font-display font-bold text-[var(--foreground)]">User Dashboard</h1>
                <p className="text-[var(--muted)]">Track your growth and claim your certificates.</p>
            </header>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Side: Profile, Stats & Certificates */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Profile Card */}
                    <div className="card p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3">
                            <button 
                                onClick={() => setIsEditing(!isEditing)}
                                className="p-2 rounded-lg hover:bg-[var(--muted-bg)] text-[var(--muted)] hover:text-blue-400 transition-all"
                            >
                                {isEditing ? <X size={18} /> : <Edit3 size={18} />}
                            </button>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20 shadow-inner">
                                <User size={40} />
                            </div>
                            
                            {!isEditing ? (
                                <>
                                    <h2 className="text-xl font-display font-bold text-[var(--foreground)]">{user?.name}</h2>
                                    <p className="text-sm text-[var(--muted)] mb-4 flex items-center gap-1.5 justify-center">
                                        <Mail size={12} /> {user?.email}
                                    </p>
                                    <div className="badge bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] py-1 px-3">
                                        Verified {user?.role}
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleUpdateProfile} className="w-full space-y-4 mt-2">
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Full Name</label>
                                        <input 
                                            type="text"
                                            value={editData.name}
                                            onChange={(e) => setEditData({...editData, name: e.target.value})}
                                            className="w-full bg-[var(--page-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-1.5 text-left">
                                        <label className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Email Address</label>
                                        <input 
                                            type="email"
                                            value={editData.email}
                                            onChange={(e) => setEditData({...editData, email: e.target.value})}
                                            className="w-full bg-[var(--page-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2 text-sm focus:border-blue-500 outline-none transition-all"
                                            required
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="flex-1 px-4 py-2 rounded-xl border border-[var(--card-border)] text-sm font-bold text-[var(--muted)] hover:bg-[var(--muted-bg)] transition-all"
                                        >
                                            Cancel
                                        </button>
                                        <button 
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
                                        >
                                            {isSaving ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Check size={16} />}
                                            Save
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                    {/* Stats Summary */}
                    <div className="card p-6 border-blue-500/10 bg-blue-500/[0.02]">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                                <BarChart2 size={20} />
                            </div>
                            <h2 className="text-lg font-display font-bold text-[var(--foreground)]">Quick Stats</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-[var(--page-bg)] border border-[var(--card-border)]">
                                <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Total Quizzes</p>
                                <p className="text-2xl font-display font-bold text-[var(--foreground)]">{results.length}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-[var(--page-bg)] border border-[var(--card-border)]">
                                <p className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest">Avg. Score</p>
                                <p className="text-2xl font-display font-bold text-emerald-400">
                                    {results.length > 0 ? (results.reduce((acc, r) => acc + parseFloat(r.percentage), 0) / results.length).toFixed(1) : 0}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Eligible Certificates */}
                    <div className="card p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400">
                                <Award size={20} />
                            </div>
                            <h2 className="text-lg font-display font-bold text-[var(--foreground)]">Your Certificates</h2>
                        </div>
                        
                        <div className="space-y-4">
                            {stats.filter(s => s.best_score >= 80).length > 0 ? (
                                stats.filter(s => s.best_score >= 80).map((cert, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)] group hover:border-blue-500/30 transition-all">
                                        <div>
                                            <p className="font-bold text-[var(--foreground)]">{cert.category}</p>
                                            <p className="text-xs text-[var(--muted)] font-medium">Best Score: {cert.best_score}%</p>
                                        </div>
                                        <button 
                                            onClick={() => handleDownloadCertificate(cert.category, cert.best_score)}
                                            className="p-2.5 rounded-lg bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                            title="Download Certificate"
                                        >
                                            <Download size={16} />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6">
                                    <div className="w-12 h-12 rounded-full bg-[var(--muted-bg)] flex items-center justify-center mx-auto mb-3 text-[var(--muted)] opacity-50">
                                        <Award size={20} />
                                    </div>
                                    <p className="text-xs text-[var(--muted)] font-medium px-4">Score above 80% in any language to unlock your certificate.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Side: Quiz History */}
                <div className="lg:col-span-2">
                    <div className="card overflow-hidden">
                        <div className="p-6 border-b border-[var(--card-border)] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-400">
                                    <Clock size={20} />
                                </div>
                                <h2 className="text-lg font-display font-bold text-[var(--foreground)]">Quiz History</h2>
                            </div>
                            <span className="text-[10px] font-bold text-[var(--muted)] uppercase tracking-widest bg-[var(--muted-bg)] px-2 py-1 rounded">
                                {results.length} Sessions Total
                            </span>
                        </div>
                        
                        <div className="divide-y divide-[var(--card-border)]">
                            {results.length > 0 ? (
                                results.map((res, i) => (
                                    <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--muted-bg)] transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center text-lg shadow-sm ${
                                                res.percentage >= 80 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                res.percentage >= 60 ? 'bg-sky-500/10 border-sky-500/20 text-sky-400' :
                                                'bg-red-500/10 border-red-500/20 text-red-400'
                                            }`}>
                                                {res.percentage >= 80 ? '🏆' : '🔥'}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[var(--foreground)]">{res.category}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="flex items-center gap-1 text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider">
                                                        <Calendar size={10} />
                                                        {new Date(res.created_at).toLocaleDateString()}
                                                    </div>
                                                    <div className="w-1 h-1 rounded-full bg-[var(--card-border)]" />
                                                    <div className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider">
                                                        {res.difficulty || 'Default'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right">
                                                <p className={`text-xl font-display font-bold ${
                                                    res.percentage >= 80 ? 'text-emerald-400' :
                                                    res.percentage >= 60 ? 'text-sky-400' :
                                                    'text-red-400'
                                                }`}>{res.percentage}%</p>
                                                <p className="text-[10px] text-[var(--muted)] font-bold uppercase tracking-wider">{res.score}/{res.total} Points</p>
                                            </div>
                                            <ChevronRight size={18} className="text-[var(--muted)]" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-[var(--muted-bg)] flex items-center justify-center mx-auto mb-4 text-[var(--muted)] opacity-30">
                                        <Trophy size={32} />
                                    </div>
                                    <h3 className="font-display font-bold text-[var(--foreground)] mb-1">No quizzes taken yet</h3>
                                    <p className="text-sm text-[var(--muted)] max-w-xs mx-auto mb-6">Start your first quiz to see your progress and earn certificates.</p>
                                    <button 
                                        className="btn-primary text-sm px-6"
                                        onClick={() => window.location.href='/quiz'}
                                    >
                                        Take a Quiz
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
