import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import logo from '../../assets/logo.png';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        const success = await register(name, email, password);
        if (success) navigate('/quiz');
    };

    return (
        <div className="min-h-screen bg-[var(--page-bg)] flex items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
            {/* Ambient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/8 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[40%] bg-sky-600/6 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-md z-10 animate-fade-in">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="relative inline-block mb-5">
                        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl scale-150" />
                        <img src={logo} alt="DeeBug" className="relative w-16 h-16 object-contain" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-[var(--foreground)] mb-1.5">
                        Create your account
                    </h1>
                    <p className="text-[var(--muted)] text-sm">Join thousands of developers on DeeBug.</p>
                </div>

                {/* Card */}
                <div className="glass rounded-2xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Full Name</label>
                            <div className="relative">
                                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field !pl-10"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Email</label>
                            <div className="relative">
                                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field !pl-10"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Password</label>
                            <div className="relative">
                                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field !pl-10 !pr-10"
                                    placeholder="Minimum 8 characters"
                                />
                                <button type="button" onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm password */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="input-field !pl-10 !pr-10"
                                    placeholder="Re-enter password"
                                />
                                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary w-full py-3.5 rounded-xl text-sm mt-2"
                        >
                            <UserPlus size={16} />
                            Create Account
                        </button>
                    </form>

                    <div className="divider my-6" />

                    <p className="text-center text-sm text-[var(--muted)]">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-blue-400 font-semibold hover:text-blue-500 transition-colors inline-flex items-center gap-1"
                        >
                            Sign in <Sparkles size={13} />
                        </Link>
                    </p>
                </div>

                <p className="mt-6 text-center text-xs text-[var(--muted)]/50">
                    By creating an account you agree to our Terms of Service.
                </p>
            </div>
        </div>
    );
};

export default Register;
