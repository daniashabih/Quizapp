import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    User, Lock, Bell, Sun, Moon, Shield, Trash2, Save,
    ChevronRight, Eye, EyeOff, Monitor
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Settings() {
    const { user, updateUser } = useAuth();
    const { theme, setThemeMode, resolvedTheme } = useTheme();

    // Profile
    const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' });
    const [savingProfile, setSavingProfile] = useState(false);

    // Password
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [savingPassword, setSavingPassword] = useState(false);

    // Notifications
    const [notifications, setNotifications] = useState({
        quizReminders: true,
        certificateAlerts: true,
        weeklyDigest: false,
        marketingEmails: false,
    });

    const [activeSection, setActiveSection] = useState('profile');

    const handleProfileSave = async (e) => {
        e.preventDefault();
        setSavingProfile(true);
        try {
            const res = await axios.put('/auth/update-profile', profileData);
            updateUser(res.data.user);
            toast.success("Profile updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update");
        } finally {
            setSavingProfile(false);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        if (passwordData.newPassword.length < 8) {
            return toast.error("Password must be at least 8 characters");
        }
        setSavingPassword(true);
        try {
            // For demo - in production this would be a real API call
            toast.success("Password changed successfully");
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to change password");
        } finally {
            setSavingPassword(false);
        }
    };

    const sections = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'password', icon: Lock, label: 'Password' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'theme', icon: Sun, label: 'Appearance' },
        { id: 'privacy', icon: Shield, label: 'Privacy' },
        { id: 'danger', icon: Trash2, label: 'Danger Zone' },
    ];

    const renderActiveSection = () => {
        switch (activeSection) {
            case 'profile':
                return (
                    <form onSubmit={handleProfileSave} className="space-y-5">
                        <div>
                            <h3 className="text-lg font-display font-bold text-[var(--foreground)] mb-1">Profile Information</h3>
                            <p className="text-sm text-[var(--foreground-muted)] mb-6">Update your personal details.</p>
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="input-label">Full Name</label>
                                <input type="text" value={profileData.name}
                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                    className="input-field" required />
                            </div>
                            <div className="space-y-1.5">
                                <label className="input-label">Email Address</label>
                                <input type="email" value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="input-field" required />
                            </div>
                        </div>
                        <button type="submit" disabled={savingProfile} className="btn-primary text-sm">
                            {savingProfile ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </form>
                );

            case 'password':
                return (
                    <form onSubmit={handlePasswordChange} className="space-y-5 max-w-md">
                        <div>
                            <h3 className="text-lg font-display font-bold text-[var(--foreground)] mb-1">Change Password</h3>
                            <p className="text-sm text-[var(--foreground-muted)] mb-6">Ensure your account is secure.</p>
                        </div>
                        <div className="space-y-1.5">
                            <label className="input-label">Current Password</label>
                            <div className="relative">
                                <input type={showCurrent ? 'text' : 'password'} value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    className="input-field pr-10" required />
                                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="input-label">New Password</label>
                            <div className="relative">
                                <input type={showNew ? 'text' : 'password'} value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    className="input-field pr-10" required />
                                <button type="button" onClick={() => setShowNew(!showNew)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">
                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="input-label">Confirm New Password</label>
                            <input type="password" value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                className="input-field" required />
                        </div>
                        <button type="submit" disabled={savingPassword} className="btn-primary text-sm">
                            {savingPassword ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Lock size={16} />}
                            Update Password
                        </button>
                    </form>
                );

            case 'notifications':
                return (
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-lg font-display font-bold text-[var(--foreground)] mb-1">Notification Preferences</h3>
                            <p className="text-sm text-[var(--foreground-muted)] mb-6">Manage what you receive.</p>
                        </div>
                        <div className="space-y-4">
                            {Object.entries(notifications).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)]">
                                    <span className="text-sm font-medium text-[var(--foreground)] capitalize">
                                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                                    </span>
                                    <button
                                        onClick={() => setNotifications(prev => ({ ...prev, [key]: !value }))}
                                        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${value ? 'bg-[#163B34]' : 'bg-[var(--card-border)]'}`}
                                    >
                                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${value ? 'translate-x-5' : ''}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'theme':
                return (
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-lg font-display font-bold text-[var(--foreground)] mb-1">Appearance</h3>
                            <p className="text-sm text-[var(--foreground-muted)] mb-6">Customize your interface.</p>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { id: 'light', icon: Sun, label: 'Light', desc: 'Bright & clean' },
                                { id: 'dark', icon: Moon, label: 'Dark', desc: 'Easy on eyes' },
                                { id: 'system', icon: Monitor, label: 'System', desc: 'Follows device' },
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setThemeMode(opt.id)}
                                    className={`p-5 rounded-2xl border-2 text-center transition-all ${
                                        theme === opt.id
                                            ? 'border-[#163B34] bg-[#EAF5F2]'
                                            : 'border-[var(--card-border)] hover:border-[#289B7D]'
                                    }`}
                                >
                                    <opt.icon size={24} className={`mx-auto mb-2 ${theme === opt.id ? 'text-[#163B34]' : 'text-[var(--foreground-muted)]'}`} />
                                    <p className="text-sm font-bold text-[var(--foreground)]">{opt.label}</p>
                                    <p className="text-[10px] text-[var(--foreground-muted)]">{opt.desc}</p>
                                </button>
                            ))}
                        </div>
                        <div className="p-4 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)]">
                            <p className="text-xs text-[var(--foreground-muted)]">
                                Current: <strong className="text-[var(--foreground)] capitalize">{resolvedTheme}</strong> mode
                            </p>
                        </div>
                    </div>
                );

            case 'privacy':
                return (
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-lg font-display font-bold text-[var(--foreground)] mb-1">Privacy Settings</h3>
                            <p className="text-sm text-[var(--foreground-muted)] mb-6">Control your data visibility.</p>
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Show profile on leaderboard', enabled: true },
                                { label: 'Share quiz results publicly', enabled: true },
                                { label: 'Allow certificate verification', enabled: true },
                                { label: 'Enable activity tracking', enabled: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted-bg)] border border-[var(--card-border)]">
                                    <span className="text-sm font-medium text-[var(--foreground)]">{item.label}</span>
                                    <button
                                        className={`relative w-11 h-6 rounded-full transition-all duration-200 ${item.enabled ? 'bg-[#163B34]' : 'bg-[var(--card-border)]'}`}
                                    >
                                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${item.enabled ? 'translate-x-5' : ''}`} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'danger':
                return (
                    <div className="space-y-5">
                        <div>
                            <h3 className="text-lg font-display font-bold text-[var(--foreground)] mb-1">Danger Zone</h3>
                            <p className="text-sm text-red-500 mb-6">Irreversible actions. Proceed with caution.</p>
                        </div>
                        <div className="p-6 rounded-2xl border-2 border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-xl bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center shrink-0">
                                    <Trash2 size={22} className="text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-base font-bold text-[var(--foreground)] mb-1">Delete Account</h4>
                                    <p className="text-sm text-[var(--foreground-muted)] mb-4">
                                        Permanently delete your account and all associated data. This action cannot be undone.
                                    </p>
                                    <button
                                        onClick={() => {
                                            if (window.confirm('Are you absolutely sure? This will delete all your data.')) {
                                                toast.error('Account deletion requested');
                                            }
                                        }}
                                        className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-all shadow-lg shadow-red-500/30"
                                    >
                                        <Trash2 size={14} className="inline mr-1.5" />
                                        Delete My Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="max-w-5xl mx-auto animate-fade-up">
            <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-display font-bold text-[var(--foreground)]">Settings</h1>
                <p className="text-sm text-[var(--foreground-muted)]">Manage your account settings and preferences.</p>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="card p-2 rounded-2xl space-y-1">
                        {sections.map(s => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                                    activeSection === s.id
                                        ? 'bg-[#EAF5F2] text-[#163B34]'
                                        : 'text-[var(--foreground-muted)] hover:text-[var(--foreground)] hover:bg-[var(--muted-bg)]'
                                } ${s.id === 'danger' ? 'hover:text-red-500' : ''}`}
                            >
                                <s.icon size={16} />
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <div className="card p-6 lg:p-8 rounded-2xl">
                        {renderActiveSection()}
                    </div>
                </div>
            </div>
        </div>
    );
}
