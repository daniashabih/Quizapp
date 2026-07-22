import { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Award, ChevronRight, Search, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const mockUsers = [
    { rank: 1, name: 'Sarah Chen', initials: 'SC', xp: 12500, quizzes: 48, certs: 12, badges: 9, score: 98, gradient: 'from-amber-400 to-yellow-500' },
    { rank: 2, name: 'James Wilson', initials: 'JW', xp: 11200, quizzes: 42, certs: 10, badges: 7, score: 94, gradient: 'from-slate-300 to-slate-400' },
    { rank: 3, name: 'Priya Patel', initials: 'PP', xp: 9800, quizzes: 38, certs: 8, badges: 8, score: 91, gradient: 'from-amber-600 to-yellow-700' },
    { rank: 4, name: 'Marcus Johnson', initials: 'MJ', xp: 8200, quizzes: 32, certs: 6, badges: 5, score: 87 },
    { rank: 5, name: 'Emily Davis', initials: 'ED', xp: 7500, quizzes: 28, certs: 5, badges: 6, score: 84 },
    { rank: 6, name: 'Alex Kim', initials: 'AK', xp: 6800, quizzes: 25, certs: 4, badges: 4, score: 81 },
    { rank: 7, name: 'Lisa Anderson', initials: 'LA', xp: 6200, quizzes: 22, certs: 3, badges: 5, score: 78 },
    { rank: 8, name: 'David Martinez', initials: 'DM', xp: 5500, quizzes: 18, certs: 2, badges: 3, score: 75 },
    { rank: 9, name: 'Rachel Lee', initials: 'RL', xp: 4800, quizzes: 15, certs: 1, badges: 4, score: 72 },
    { rank: 10, name: 'Tom Brown', initials: 'TB', xp: 4200, quizzes: 12, certs: 1, badges: 2, score: 68 },
];

export default function Leaderboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [users] = useState(mockUsers);

    const filtered = users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const top3 = users.slice(0, 3);

    return (
        <div className="min-h-screen bg-[var(--page-bg)] flex flex-col">
            <Navbar />
            <div className="flex-1 pt-24 lg:pt-28 pb-16">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-up">
                    <div className="text-center mb-12">
                        <div className="badge-emerald mx-auto mb-4">
                            <Trophy size={12} />
                            Leaderboard
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-display font-extrabold text-[var(--foreground)] mb-3">
                            Global <span className="text-gradient">Rankings</span>
                        </h1>
                        <p className="text-[var(--foreground-muted)] max-w-lg mx-auto">
                            Compete with developers worldwide. Top performers earn exclusive badges and recognition.
                        </p>
                    </div>

                    <div className="flex items-end justify-center gap-4 mb-12">
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white font-bold text-lg mb-2 shadow-lg border-2 border-white">
                                2
                            </div>
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-xl">
                                {users[1].initials}
                            </div>
                            <p className="text-sm font-bold text-[var(--foreground)]">{users[1].name}</p>
                            <p className="text-xs text-[var(--foreground-muted)]">{users[1].xp.toLocaleString()} XP</p>
                            <div className="w-20 h-24 bg-gradient-to-t from-slate-300/20 to-slate-300/5 rounded-t-2xl mt-2 border border-slate-200 flex items-center justify-center text-sm font-bold text-slate-400">
                                <Medal size={20} className="text-slate-400" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center -mt-4">
                            <div className="w-10 h-7 rounded-t-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-sm shadow-lg -mb-2 z-10">
                                <Trophy size={14} />
                            </div>
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-3xl mb-2 shadow-2xl ring-4 ring-amber-200">
                                {users[0].initials}
                            </div>
                            <p className="text-lg font-bold text-[var(--foreground)]">{users[0].name}</p>
                            <p className="text-sm text-[var(--foreground-muted)]">{users[0].xp.toLocaleString()} XP</p>
                            <div className="w-28 h-32 bg-gradient-to-t from-amber-400/20 to-amber-400/5 rounded-t-2xl mt-2 border border-amber-200 flex items-center justify-center">
                                <Trophy size={28} className="text-amber-500" />
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-600 to-yellow-700 flex items-center justify-center text-white font-bold text-lg mb-2 shadow-lg border-2 border-white">
                                3
                            </div>
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-600 to-yellow-700 flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-xl">
                                {users[2].initials}
                            </div>
                            <p className="text-sm font-bold text-[var(--foreground)]">{users[2].name}</p>
                            <p className="text-xs text-[var(--foreground-muted)]">{users[2].xp.toLocaleString()} XP</p>
                            <div className="w-20 h-20 bg-gradient-to-t from-amber-600/20 to-amber-600/5 rounded-t-2xl mt-2 border border-amber-200 flex items-center justify-center text-sm font-bold text-amber-600">
                                <Medal size={20} />
                            </div>
                        </div>
                    </div>

                    <div className="relative max-w-sm mb-6">
                        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                        <input
                            type="text"
                            placeholder="Search leaderboard..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-10 py-3"
                        />
                    </div>

                    <div className="card overflow-hidden rounded-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-[var(--card-border)] bg-[var(--muted-bg)]/50">
                                        {['Rank', 'User', 'XP', 'Quizzes', 'Certificates', 'Badges', 'Score', ''].map(h => (
                                            <th key={h} className="px-6 py-4 text-[10px] font-bold text-[var(--foreground-muted)] uppercase tracking-widest">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--card-border)]">
                                    {filtered.map((user, i) => (
                                        <tr key={i} className="hover:bg-[var(--muted-bg)] transition-colors group">
                                            <td className="px-6 py-4">
                                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                                    user.rank <= 3
                                                        ? `bg-gradient-to-br ${user.gradient} text-white`
                                                        : 'bg-[var(--muted-bg)] text-[var(--foreground-muted)]'
                                                }`}>
                                                    {user.rank}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#163B34] to-[#289B7D] flex items-center justify-center text-white font-bold text-sm shadow-md">
                                                        {user.initials}
                                                    </div>
                                                    <span className="text-sm font-semibold text-[var(--foreground)]">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-bold text-amber-500">{user.xp.toLocaleString()}</span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-[var(--foreground-muted)] font-medium">{user.quizzes}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Award size={14} className="text-[#163B34]" />
                                                    <span className="text-sm font-medium text-[var(--foreground)]">{user.certs}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1">
                                                    <Star size={12} className="text-amber-500 fill-amber-500" />
                                                    <span className="text-sm font-medium text-[var(--foreground)]">{user.badges}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-bold ${
                                                    user.score >= 90 ? 'text-emerald-500' : user.score >= 80 ? 'text-[#163B34]' : 'text-[var(--foreground-muted)]'
                                                }`}>
                                                    {user.score}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <ChevronRight size={16} className="text-[var(--foreground-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {filtered.length === 0 && (
                            <div className="p-12 text-center">
                                <Users size={32} className="mx-auto text-[var(--foreground-muted)] opacity-40 mb-3" />
                                <p className="text-sm text-[var(--foreground-muted)]">No users found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
