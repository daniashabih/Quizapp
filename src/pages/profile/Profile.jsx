import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    User, Mail, Calendar, Award, Trophy, Star, Zap, Edit3, Check, X,
    Github, Linkedin, Globe, MapPin, ChevronRight, Clock, BookOpen, Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const mockTimeline = [
    { action: 'Completed React Expert Quiz', score: '92%', date: 'Today', icon: '🏆' },
    { action: 'Earned JavaScript Certificate', score: '88%', date: '2 days ago', icon: '📜' },
    { action: 'Started Python Intermediate', score: 'In progress', date: '5 days ago', icon: '▶️' },
    { action: 'Completed HTML Basics', score: '100%', date: '1 week ago', icon: '✅' },
    { action: 'Joined HangBug', score: '', date: '2 weeks ago', icon: '🚀' },
];

const skills = [
    { name: 'JavaScript', level: 90, color: 'from-yellow-500 to-yellow-600' },
    { name: 'React', level: 85, color: 'from-sky-500 to-blue-600' },
    { name: 'Python', level: 75, color: 'from-blue-500 to-blue-700' },
    { name: 'Node.js', level: 70, color: 'from-green-500 to-emerald-600' },
    { name: 'HTML/CSS', level: 95, color: 'from-orange-500 to-red-500' },
];

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ name: user?.name || '', email: user?.email || '' });
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await axios.put('/auth/update-profile', editData);
            updateUser(res.data.user);
            toast.success("Profile updated");
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 animate-fade-up">
            {/* Header */}
            <div>
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--foreground)]">Profile</h1>
                <p className="text-sm text-[var(--foreground-muted)]">Manage your personal information and view your activity.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* Profile Card */}
                    <div className="card p-6 rounded-2xl text-center">
                        <div className="relative inline-block mb-4">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-display font-extrabold text-4xl shadow-xl">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[var(--card-bg)]" />
                        </div>
                        {!isEditing ? (
                            <>
                                <h2 className="text-xl font-bold text-[var(--foreground)]">{user?.name}</h2>
                                <p className="text-sm text-[var(--foreground-muted)]">{user?.email}</p>
                                <div className="flex items-center justify-center gap-2 mt-3">
                                    <span className="badge-indigo text-[10px]">{user?.role}</span>
                                </div>
                                <button onClick={() => setIsEditing(true)}
                                    className="btn-secondary w-full justify-center text-sm mt-5">
                                    <Edit3 size={14} /> Edit Profile
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleSave} className="text-left space-y-3 mt-2">
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

                    {/* Quick Info */}
                    <div className="card p-6 rounded-2xl space-y-4">
                        <InfoRow icon={Mail} label="Email" value={user?.email} />
                        <InfoRow icon={Calendar} label="Joined" value="June 2026" />
                        <InfoRow icon={MapPin} label="Location" value="Earth" />
                        <InfoRow icon={Globe} label="Website" value="https://hangbug.dev" isLink />
                    </div>

                    {/* Social */}
                    <div className="card p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-[var(--foreground)] mb-4">Social Links</h3>
                        <div className="space-y-3">
                            <SocialLink icon={Github} label="GitHub" href="#" />
                            <SocialLink icon={Linkedin} label="LinkedIn" href="#" />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Skills */}
                    <div className="card p-6 rounded-2xl">
                        <h3 className="text-sm font-bold text-[var(--foreground)] mb-6">Skills & Expertise</h3>
                        <div className="space-y-5">
                            {skills.map((skill, i) => (
                                <div key={i}>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-sm font-semibold text-[var(--foreground)]">{skill.name}</span>
                                        <span className="text-xs font-bold text-[var(--foreground-muted)]">{skill.level}%</span>
                                    </div>
                                    <div className="progress-bar">
                                        <div className={`h-full rounded-full bg-gradient-to-r ${skill.color} transition-all duration-1000`}
                                            style={{ width: `${skill.level}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Activity Timeline */}
                    <div className="card overflow-hidden rounded-2xl">
                        <div className="p-6 border-b border-[var(--card-border)]">
                            <h3 className="text-sm font-bold text-[var(--foreground)]">Activity Timeline</h3>
                        </div>
                        <div className="divide-y divide-[var(--card-border)]">
                            {mockTimeline.map((item, i) => (
                                <div key={i} className="p-5 flex items-center gap-4 hover:bg-[var(--muted-bg)] transition-colors">
                                    <div className="w-10 h-10 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)] flex items-center justify-center text-lg">
                                        {item.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-[var(--foreground)]">{item.action}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-xs text-[var(--foreground-muted)]">{item.date}</span>
                                            {item.score && (
                                                <>
                                                    <span className="w-1 h-1 rounded-full bg-[var(--card-border)]" />
                                                    <span className={`text-xs font-medium ${item.score.includes('%') ? 'text-emerald-500' : 'text-[var(--foreground-muted)]'}`}>{item.score}</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-[var(--foreground-muted)]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon: Icon, label, value, isLink }) {
    return (
        <div className="flex items-center gap-3">
            <Icon size={15} className="text-[var(--foreground-muted)] shrink-0" />
            <div>
                <p className="text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">{label}</p>
                {isLink ? (
                    <a href={value} className="text-sm font-medium text-indigo-500 hover:text-indigo-400">{value}</a>
                ) : (
                    <p className="text-sm font-medium text-[var(--foreground)]">{value}</p>
                )}
            </div>
        </div>
    );
}

function SocialLink({ icon: Icon, label, href }) {
    return (
        <a href={href} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)] hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:text-indigo-500 transition-all text-sm font-medium text-[var(--foreground)] group">
            <Icon size={16} className="group-hover:scale-110 transition-transform" />
            {label}
            <ChevronRight size={14} className="ml-auto text-[var(--foreground-muted)]" />
        </a>
    );
}
