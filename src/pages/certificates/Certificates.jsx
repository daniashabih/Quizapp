import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Award, Download, ExternalLink, Linkedin, ChevronRight, Search, Loader2, FileText, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const mockCertificates = [
    { id: 'CERT-001', tech: 'JavaScript', level: 'Advanced', score: 92, date: '2026-06-15', issued: true },
    { id: 'CERT-002', tech: 'React', level: 'Intermediate', score: 88, date: '2026-06-10', issued: true },
    { id: 'CERT-003', tech: 'Python', level: 'Advanced', score: 85, date: '2026-06-05', issued: true },
    { id: 'CERT-004', tech: 'Node.js', level: 'Intermediate', score: 78, date: '2026-05-28', issued: false },
    { id: 'CERT-005', tech: 'HTML', level: 'Beginner', score: 95, date: '2026-05-20', issued: true },
];

export default function Certificates() {
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [certList] = useState(mockCertificates);

    const filtered = certList.filter(c =>
        c.tech.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const earnedCount = certList.filter(c => c.issued).length;
    const bestScore = Math.max(...certList.map(c => c.score), 0);

    return (
        <div className="max-w-6xl mx-auto space-y-6 animate-fade-up">
            <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--foreground)]">My Certificates</h1>
                <p className="text-sm text-[var(--foreground-muted)] mt-1">
                    {earnedCount} certificates earned · Best score: {bestScore}%
                </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="card p-5 rounded-2xl text-center">
                    <div className="w-10 h-10 rounded-xl bg-[#EAF5F2] border border-[#D4EBE5] flex items-center justify-center mx-auto mb-2">
                        <Award size={18} className="text-[#163B34]" />
                    </div>
                    <p className="text-2xl font-display font-bold text-[var(--foreground)]">{earnedCount}</p>
                    <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Earned</p>
                </div>
                <div className="card p-5 rounded-2xl text-center">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-2">
                        <Lock size={18} className="text-amber-500" />
                    </div>
                    <p className="text-2xl font-display font-bold text-[var(--foreground)]">{certList.filter(c => !c.issued).length}</p>
                    <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Available</p>
                </div>
                <div className="card p-5 rounded-2xl text-center">
                    <div className="w-10 h-10 rounded-xl bg-[#F7FAF9] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-2">
                        <FileText size={18} className="text-[#289B7D]" />
                    </div>
                    <p className="text-2xl font-display font-bold text-[var(--foreground)]">{certList.length}</p>
                    <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">Total</p>
                </div>
            </div>

            <div className="relative max-w-sm">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                <input
                    type="text"
                    placeholder="Search certificates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-field pl-10 py-3"
                />
            </div>

            <div className="grid gap-4">
                {filtered.map((cert, i) => (
                    <div key={i} className={`card p-5 lg:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-all group ${cert.issued ? '' : 'opacity-60'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg ${
                                cert.issued
                                    ? 'bg-gradient-to-br from-[#163B34] to-[#289B7D]'
                                    : 'bg-[var(--muted-bg)] border border-[var(--card-border)]'
                            }`}>
                                {cert.issued ? '🏆' : '🔒'}
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-[var(--foreground)]">{cert.tech}</h3>
                                    {cert.issued && (
                                        <CheckCircle2 size={14} className="text-emerald-500" />
                                    )}
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-xs text-[var(--foreground-muted)]">{cert.level}</span>
                                    <span className="w-1 h-1 rounded-full bg-[var(--card-border)]" />
                                    <span className="text-xs text-[var(--foreground-muted)]">{cert.score}%</span>
                                    <span className="w-1 h-1 rounded-full bg-[var(--card-border)]" />
                                    <span className="text-xs text-[var(--foreground-muted)]">{cert.date}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {cert.issued ? (
                                <>
                                    <Link
                                        to="/certificate/view"
                                        state={{ category: cert.tech, percentage: cert.score, difficulty: cert.level.toLowerCase() }}
                                        className="btn-primary text-xs px-4 py-2.5"
                                    >
                                        <ExternalLink size={13} /> View
                                    </Link>
                                    <button className="p-2.5 rounded-xl text-[var(--foreground-muted)] hover:text-[#163B34] hover:bg-[var(--muted-bg)] transition-all">
                                        <Download size={15} />
                                    </button>
                                    <button className="p-2.5 rounded-xl text-[var(--foreground-muted)] hover:text-[#0A66C2] hover:bg-[var(--muted-bg)] transition-all">
                                        <Linkedin size={15} />
                                    </button>
                                </>
                            ) : (
                                <span className="text-xs text-[var(--foreground-muted)] font-medium">Score 80%+ to unlock</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--muted-bg)] border border-[var(--card-border)] flex items-center justify-center mx-auto mb-3">
                        <Award size={28} className="text-[var(--foreground-muted)] opacity-40" />
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)]">No certificates found.</p>
                </div>
            )}
        </div>
    );
}
