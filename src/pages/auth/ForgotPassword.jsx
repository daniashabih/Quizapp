import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/auth/forgot-password', { email });
            toast.success(res.data.message);
            setSubmitted(true);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--page-bg)] flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 pt-24">
                <div className="w-full max-w-md animate-fade-up">
                    <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[var(--foreground-muted)] hover:text-indigo-500 transition-colors mb-8">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>

                    <div className="card p-8 rounded-2xl">
                        {!submitted ? (
                            <>
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                                        <Mail size={28} className="text-indigo-500" />
                                    </div>
                                    <h1 className="text-2xl font-display font-bold text-[var(--foreground)] mb-2">Forgot Password?</h1>
                                    <p className="text-sm text-[var(--foreground-muted)]">No worries, we'll send you reset instructions.</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="input-label">Email Address</label>
                                        <div className="relative">
                                            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="input-field pl-10"
                                                placeholder="name@example.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn-primary w-full justify-center py-3.5 text-sm"
                                    >
                                        {loading ? (
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                Send Reset Link <Send size={16} />
                                            </>
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle size={28} className="text-emerald-500" />
                                </div>
                                <h2 className="text-2xl font-display font-bold text-[var(--foreground)] mb-3">Check your email</h2>
                                <p className="text-sm text-[var(--foreground-muted)] mb-6">
                                    We've sent a password reset link to <strong className="text-[var(--foreground)]">{email}</strong>.
                                </p>
                                <button onClick={handleSubmit} className="text-sm font-semibold text-indigo-500 hover:text-indigo-400 transition-colors">
                                    Didn't receive it? Click to resend
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
