import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send } from 'lucide-react';

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
        <div className="min-h-[80vh] flex items-center justify-center p-4">
            <div className="card w-full max-w-md p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500" />
                
                <Link to="/login" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-blue-400 mb-8 transition-colors">
                    <ArrowLeft size={16} /> Back to Login
                </Link>

                {!submitted ? (
                    <>
                        <h2 className="text-3xl font-display font-bold text-[var(--foreground)] mb-2">Forgot Password?</h2>
                        <p className="text-[var(--muted)] mb-8">No worries, we'll send you reset instructions.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[var(--muted)] group-focus-within:text-blue-400 transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input 
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-[var(--muted-bg)] border border-[var(--card-border)] rounded-xl py-3.5 pl-11 pr-4 text-sm focus:border-blue-500 outline-none transition-all"
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
                    <div className="text-center py-8">
                        <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400 border border-emerald-500/20 shadow-inner">
                            <Mail size={40} />
                        </div>
                        <h2 className="text-2xl font-display font-bold text-[var(--foreground)] mb-3">Check your email</h2>
                        <p className="text-[var(--muted)] mb-8">
                            We've sent a password reset link to <span className="text-[var(--foreground)] font-bold">{email}</span>. 
                            Please check your inbox (and spam folder).
                        </p>
                        <p className="text-sm text-[var(--muted)]">
                            Didn't receive it? <button onClick={handleSubmit} className="text-blue-400 font-bold hover:underline">Click to resend</button>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
