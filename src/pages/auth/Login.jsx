import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, ArrowLeft, Github } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BrandLogo from '../../components/BrandLogo';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const success = await login(email, password);
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
                        <h1 className="text-3xl font-display font-bold text-[#163B34] mb-2">Welcome back</h1>
                        <p className="text-[#6B7280] text-sm">Sign in to continue your journey.</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
                        <button className="btn-social text-sm mb-6"><Github size={18} /> Continue with GitHub</button>
                        <div className="relative mb-6">
                            <div className="divider" />
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 text-xs font-semibold text-[#6B7280] bg-white">or continue with email</span>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-1.5">
                                <label className="input-label">Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" placeholder="name@example.com" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="input-label">Password</label>
                                    <Link to="/forgot-password" className="text-xs font-semibold text-[#163B34] hover:text-[#1F4D44]">Forgot?</Link>
                                </div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                                    <input type={showPass ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="input-field pl-10 pr-10" placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#163B34]">{showPass ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 rounded-xl text-sm mt-2">
                                {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <><LogIn size={16} /> Sign In</>}
                            </button>
                        </form>
                        <div className="divider my-6" />
                        <p className="text-center text-sm text-[#6B7280]">Don't have an account? <Link to="/register" className="font-semibold text-[#163B34] hover:text-[#1F4D44]">Create one free</Link></p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Login;
