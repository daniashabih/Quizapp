import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, ArrowLeft, Github } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BrandLogo from '../../components/BrandLogo';

export default function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirm) { toast.error("Passwords do not match"); return; }
        if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
        setLoading(true);
        const success = await register(name, email, password);
        setLoading(false);
        if (success) navigate('/dashboard');
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Navbar />
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 pt-24">
                <div className="w-full max-w-md animate-fade-up">
                    <Link to="/" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#163B34] transition-colors mb-8"><ArrowLeft size={16} /> Back to Home</Link>
                    <div className="text-center mb-8">
                        <BrandLogo variant="mark" size="xl" className="mx-auto mb-4" />
                        <h1 className="text-3xl font-display font-bold text-[#163B34] mb-2">Create Account</h1>
                        <p className="text-[#6B7280] text-sm">Start your HangBug journey.</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                        <button className="btn-social text-sm mb-6"><Github size={18} /> Sign up with GitHub</button>
                        <div className="relative mb-6">
                            <div className="divider" />
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-xs font-semibold text-[#6B7280] bg-white">or with email</span>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="input-label">Full Name</label>
                                <div className="relative"><User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-10" placeholder="John Doe" /></div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="input-label">Email</label>
                                <div className="relative"><Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="name@example.com" /></div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="input-label">Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                                    <input type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 pr-10" placeholder="Min 8 characters" />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#163B34]">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="input-label">Confirm Password</label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                                    <input type={showConfirm ? 'text' : 'password'} required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="input-field pl-10 pr-10" placeholder="Re-enter" />
                                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#163B34]">{showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-sm mt-2">
                                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><UserPlus size={16} /> Create Free Account</>}
                            </button>
                        </form>
                        <div className="divider my-6" />
                        <p className="text-center text-sm text-[#6B7280]">Already have an account? <Link to="/login" className="font-semibold text-[#163B34] hover:text-[#1F4D44]">Sign in</Link></p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
