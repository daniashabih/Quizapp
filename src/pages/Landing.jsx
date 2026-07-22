import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ArrowRight, Code2, Target, Trophy, Zap, Users, BookOpen,
    Sparkles, Star, Award, BarChart3, Search,
    ChevronDown, ChevronUp, Quote, Play, GraduationCap, BrainCircuit
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BrandLogo from '../components/BrandLogo';

const technologies = [
    { name: 'HTML', level: 'Beginner', questions: 120, color: '#E44D26' },
    { name: 'CSS', level: 'Beginner', questions: 150, color: '#1572B6' },
    { name: 'JavaScript', level: 'Intermediate', questions: 200, color: '#F7DF1E' },
    { name: 'React', level: 'Advanced', questions: 180, color: '#61DAFB' },
    { name: 'Node.js', level: 'Intermediate', questions: 160, color: '#339933' },
    { name: 'Python', level: 'Intermediate', questions: 190, color: '#3776AB' },
    { name: 'Tailwind CSS', level: 'Intermediate', questions: 100, color: '#06B6D4' },
    { name: 'MongoDB', level: 'Intermediate', questions: 90, color: '#47A248' },
];

export default function Landing() {
    const { user } = useAuth();
    const [activeFaq, setActiveFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [testimonialIdx, setTestimonialIdx] = useState(0);

    const filteredTechs = technologies.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-28 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#163B34]/3 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-[#289B7D]/3 rounded-full blur-[150px]" style={{ animationDelay: "2s" }} />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF5F2] text-[#163B34] text-xs font-semibold tracking-wide mb-6 animate-fade-up">
                                <span className="w-2 h-2 rounded-full bg-[#163B34]" />
                                AI-Powered Quizzes — Now Live
                            </div>
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold text-[#163B34] leading-[1.05] tracking-tighter mb-6 animate-fade-up">
                                Master Web
                                <br />Development{' '}
                                <span className="text-gradient">One Quiz</span>
                                <br />at a Time
                            </h1>
                            <p className="text-lg sm:text-xl text-[#6B7280] max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8 animate-fade-up">
                                The ultimate platform to test, certify, and showcase your web development skills.
                                AI-powered quizzes, verified certificates, and global leaderboards.
                            </p>

                            {/* Search */}
                            <div className="max-w-md mx-auto lg:mx-0 mb-8 animate-fade-up">
                                <div className="relative">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                                    <input type="text" placeholder="Search technologies (e.g., React, Python)..."
                                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm text-[#163B34] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#163B34]/10 focus:border-[#163B34] transition-all shadow-sm" />
                                    {searchQuery && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden z-10 animate-scale-in">
                                            {filteredTechs.length > 0 ? filteredTechs.map(t => (
                                                <Link key={t.name} to="/technologies"
                                                    className="flex items-center justify-between px-5 py-3.5 hover:bg-[#F7FAF9] transition-colors border-b border-gray-100 last:border-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-2 h-2 rounded-full" style={{ background: t.color }} />
                                                        <span className="text-sm font-medium text-[#163B34]">{t.name}</span>
                                                    </div>
                                                    <span className="text-xs text-[#6B7280]">{t.questions} questions</span>
                                                </Link>
                                            )) : (
                                                <div className="px-5 py-8 text-center text-sm text-[#6B7280]">No technologies found.</div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-up">
                                {user ? (
                                    <Link to="/dashboard" className="btn-primary px-8 py-4 text-base">
                                        Go to Dashboard <ArrowRight size={20} />
                                    </Link>
                                ) : (
                                    <>
                                        <Link to="/register" className="btn-primary px-8 py-4 text-base">
                                            Start Learning Free <ArrowRight size={20} />
                                        </Link>
                                        <Link to="/technologies" className="btn-secondary px-8 py-4 text-base">
                                            Browse Technologies
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Hero Illustration */}
                        <div className="flex-1 w-full max-w-lg lg:max-w-none animate-fade-up">
                            <div className="bg-[#F7FAF9] border border-gray-200 rounded-3xl p-8 shadow-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <BrandLogo variant="mark" size="md" />
                                    <div>
                                        <p className="text-sm font-bold text-[#163B34]">HangBug Assessment</p>
                                        <p className="text-xs text-[#6B7280]">Web Development</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="p-4 rounded-xl bg-white border border-gray-200">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-semibold text-[#163B34]">React Expert Quiz</span>
                                            <span className="badge-emerald text-[10px]">In Progress</span>
                                        </div>
                                        <div className="progress-bar"><div className="progress-bar-fill" style={{ width: '75%' }} /></div>
                                        <p className="text-xs text-[#6B7280] mt-1.5 font-medium">12/15 answered</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { label: 'Score', value: '92%', color: 'text-[#22C55E]' },
                                            { label: 'Time', value: '8m 42s', color: 'text-[#163B34]' },
                                            { label: 'Streak', value: '7 days', color: 'text-[#F59E0B]' },
                                            { label: 'Rank', value: '#42', color: 'text-[#289B7D]' },
                                        ].map(stat => (
                                            <div key={stat.label} className="p-3 rounded-xl bg-white border border-gray-200">
                                                <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wider">{stat.label}</p>
                                                <p className={`text-lg font-display font-bold ${stat.color}`}>{stat.value}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-[#FEF3C7]/50 border border-[#FDE68A]">
                                        <Zap size={16} className="text-[#F59E0B]" />
                                        <p className="text-xs font-medium text-[#B45309]">75 XP away from next level!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 border-y border-gray-200 bg-[#F7FAF9]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
                        {[
                            { value: "10,000+", label: "Active Learners", icon: Users },
                            { value: "1,500+", label: "Quiz Questions", icon: BookOpen },
                            { value: "18", label: "Technologies", icon: Code2 },
                            { value: "95%", label: "Satisfaction Rate", icon: Star },
                        ].map(({ value, label, icon: Icon }, i) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 rounded-xl bg-[#EAF5F2] flex items-center justify-center mx-auto mb-3">
                                    <Icon size={22} className="text-[#163B34]" />
                                </div>
                                <p className="text-3xl font-display font-extrabold text-[#163B34]">{value}</p>
                                <p className="text-sm text-[#6B7280] font-medium">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 lg:py-28">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="badge-emerald mb-4">Why Choose HangBug</div>
                        <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-[#163B34] mb-4">
                            Everything You Need to <span className="text-gradient">Excel</span>
                        </h2>
                        <p className="text-lg text-[#6B7280]">A comprehensive platform designed to take your skills to the next level.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: BrainCircuit, title: "AI-Powered Questions", desc: "Adaptive difficulty that evolves with your skill level.", grad: "from-[#163B34] to-[#289B7D]" },
                            { icon: GraduationCap, title: "Verified Certificates", desc: "Earn verifiable certificates to showcase on LinkedIn.", grad: "from-[#289B7D] to-[#53AF97]" },
                            { icon: BarChart3, title: "Deep Analytics", desc: "Track progress with detailed performance metrics.", grad: "from-[#163B34] to-[#289B7D]" },
                            { icon: Trophy, title: "Global Leaderboard", desc: "Compete with developers worldwide and climb ranks.", grad: "from-[#289B7D] to-[#7EC3B1]" },
                            { icon: Code2, title: "18+ Technologies", desc: "From HTML to Python. Full web dev stack coverage.", grad: "from-[#163B34] to-[#289B7D]" },
                            { icon: Star, title: "Gamified Learning", desc: "Earn XP, maintain streaks, unlock achievements.", grad: "from-[#289B7D] to-[#53AF97]" },
                        ].map(({ icon: Icon, title, desc, grad }, i) => (
                            <div key={i} className="group card-hover p-8 rounded-2xl animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                                    <Icon size={26} className="text-white" />
                                </div>
                                <h3 className="text-xl font-display font-bold text-[#163B34] mb-3">{title}</h3>
                                <p className="text-[#6B7280] leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Roadmap */}
            <section className="py-20 bg-[#F7FAF9]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="badge-emerald mb-4">Learning Path</div>
                        <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-[#163B34] mb-4">Your Road to <span className="text-gradient">Mastery</span></h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: 1, title: "Pick a Technology", desc: "Choose from 18+ technologies", icon: Code2 },
                            { step: 2, title: "Select Difficulty", desc: "Start at any skill level", icon: Target },
                            { step: 3, title: "Take the Quiz", desc: "Timed questions with feedback", icon: Play },
                            { step: 4, title: "Earn Certificate", desc: "Score 80%+ to unlock", icon: Award },
                        ].map(({ step, title, desc, icon: Icon }, i) => (
                            <div key={i} className="relative">
                                {i < 3 && <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#163B34]/30 to-[#289B7D]/30" />}
                                <div className="group card p-8 rounded-2xl text-center animate-fade-up" style={{ animationDelay: `${i * 0.15}s` }}>
                                    <div className="relative mb-6 inline-flex">
                                        <div className="w-16 h-16 rounded-2xl bg-[#163B34] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                                            <Icon size={28} className="text-white" />
                                        </div>
                                        <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-[#163B34] flex items-center justify-center">
                                            <span className="text-xs font-bold text-[#163B34]">{step}</span>
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-display font-bold text-[#163B34] mb-2">{title}</h3>
                                    <p className="text-sm text-[#6B7280]">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Technologies */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
                        <div className="max-w-xl">
                            <div className="badge-emerald mb-4">Technologies</div>
                            <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-[#163B34] mb-4">Master <span className="text-gradient">18+</span> Technologies</h2>
                            <p className="text-lg text-[#6B7280]">From HTML to advanced frameworks.</p>
                        </div>
                        <Link to="/technologies" className="btn-secondary shrink-0">View All <ArrowRight size={16} /></Link>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {technologies.map((tech, i) => (
                            <Link key={tech.name} to="/technologies"
                                className="group card-hover p-5 rounded-2xl text-center animate-fade-up"
                                style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="w-12 h-12 rounded-xl bg-[#F7FAF9] border border-gray-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300"
                                    style={{ borderColor: tech.color + '40' }}>
                                    <span className="font-bold text-lg" style={{ color: tech.color }}>{tech.name.charAt(0)}</span>
                                </div>
                                <h4 className="text-sm font-bold text-[#163B34] mb-1">{tech.name}</h4>
                                <p className="text-[10px] font-medium text-[#6B7280] uppercase tracking-wider">{tech.level}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-[#F7FAF9] border-y border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <div className="badge-emerald mb-4">Testimonials</div>
                        <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-[#163B34] mb-4">What Our <span className="text-gradient">Learners</span> Say</h2>
                    </div>
                    <div className="relative max-w-3xl mx-auto">
                        <div className="overflow-hidden">
                            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${testimonialIdx * 100}%)` }}>
                                {[
                                    { name: "Sarah Chen", role: "Frontend Developer", avatar: "SC", text: "HangBug completely transformed my interview prep. The AI-generated questions are incredibly relevant.", rating: 5 },
                                    { name: "James Wilson", role: "CS Student", avatar: "JW", text: "The gamification keeps me coming back every day. I've earned 5 certificates!", rating: 5 },
                                    { name: "Priya Patel", role: "Full Stack Developer", avatar: "PP", text: "Finally, a quiz platform that adapts to my skill level. The analytics are fantastic.", rating: 5 },
                                ].map((t, i) => (
                                    <div key={i} className="min-w-full px-4">
                                        <div className="card p-8 lg:p-10 rounded-2xl text-center">
                                            <div className="w-16 h-16 rounded-2xl bg-[#163B34] flex items-center justify-center text-white font-bold text-xl mx-auto mb-6 shadow-sm">{t.avatar}</div>
                                            <Quote size={24} className="text-[#D4EBE5] mx-auto mb-4" />
                                            <p className="text-lg text-[#6B7280] leading-relaxed mb-6 italic">"{t.text}"</p>
                                            <div className="flex items-center justify-center gap-1 mb-4">
                                                {Array.from({ length: t.rating }).map((_, j) => (
                                                    <Star key={j} size={16} className="fill-[#F59E0B] text-[#F59E0B]" />
                                                ))}
                                            </div>
                                            <p className="font-bold text-[#163B34]">{t.name}</p>
                                            <p className="text-sm text-[#6B7280]">{t.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-3 mt-8">
                            {[0, 1, 2].map((_, i) => (
                                <button key={i} onClick={() => setTestimonialIdx(i)}
                                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === testimonialIdx ? 'bg-[#163B34] w-8' : 'bg-[#D4EBE5] hover:bg-[#A9D7CB]'}`} />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="badge-emerald mb-4">FAQ</div>
                        <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-[#163B34] mb-4">Frequently Asked <span className="text-gradient">Questions</span></h2>
                    </div>
                    <div className="space-y-3">
                        {[
                            { q: "Is HangBug free to use?", a: "Yes! HangBug offers free access to all basic quizzes. Premium features available with subscription." },
                            { q: "How are certificates verified?", a: "Each certificate includes a unique verification ID and QR code for authenticity." },
                            { q: "Can I retake quizzes?", a: "Absolutely! Retake any quiz as many times as you want. Best score is saved." },
                            { q: "How long does a quiz take?", a: "Most take 10-15 minutes. Each question has a 60-second timer." },
                        ].map((faq, i) => (
                            <div key={i} className="card rounded-2xl overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <button onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-5 lg:p-6 text-left">
                                    <span className="text-sm font-semibold text-[#163B34] pr-4">{faq.q}</span>
                                    {activeFaq === i ? <ChevronUp size={18} className="text-[#163B34] shrink-0" /> : <ChevronDown size={18} className="text-[#6B7280] shrink-0" />}
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${activeFaq === i ? 'max-h-40' : 'max-h-0'}`}>
                                    <p className="px-5 lg:px-6 pb-5 lg:pb-6 text-sm text-[#6B7280] leading-relaxed">{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 lg:py-28">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#F7FAF9] border border-gray-200 rounded-3xl p-10 lg:p-16 text-center relative overflow-hidden shadow-lg">
                        <div className="absolute inset-0 pointer-events-none">
                            <div className="absolute top-[-50%] left-[-20%] w-[400px] h-[400px] bg-[#163B34]/5 rounded-full blur-[100px]" />
                            <div className="absolute bottom-[-50%] right-[-20%] w-[400px] h-[400px] bg-[#289B7D]/5 rounded-full blur-[100px]" />
                        </div>
                        <div className="relative">
                            <div className="badge-emerald mb-6 mx-auto">Get Started Today</div>
                            <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-[#163B34] mb-4">Ready to Level Up <span className="text-gradient">Your Skills?</span></h2>
                            <p className="text-lg text-[#6B7280] max-w-xl mx-auto mb-8">Join thousands of developers using HangBug to sharpen their skills.</p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                {user ? (
                                    <Link to="/dashboard" className="btn-primary px-8 py-4 text-base">Go to Dashboard <ArrowRight size={20} /></Link>
                                ) : (
                                    <>
                                        <Link to="/register" className="btn-primary px-8 py-4 text-base">Start Learning Free <ArrowRight size={20} /></Link>
                                        <Link to="/technologies" className="btn-secondary px-8 py-4 text-base">Browse Technologies</Link>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-[#6B7280] mt-6">No credit card required • Free forever</p>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    );
}
