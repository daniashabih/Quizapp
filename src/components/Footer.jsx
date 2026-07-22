import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail, Heart, Code2 } from 'lucide-react';
import BrandLogo from './BrandLogo';

export default function Footer() {
    const year = new Date().getFullYear();
    return (
        <footer className="border-t border-gray-200 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
                    <div className="col-span-2 md:col-span-2">
                        <Link to="/" className="flex items-center mb-4">
                            <BrandLogo size="md" />
                        </Link>
                        <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs mb-6">
                            AI-powered web development quizzes and certification platform. Level up your coding skills.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                { icon: Github, href: '#' },
                                { icon: Twitter, href: '#' },
                                { icon: Linkedin, href: '#' },
                                { icon: Mail, href: '#' },
                            ].map((s, i) => (
                                <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-xl bg-[#F7FAF9] border border-gray-200 flex items-center justify-center text-[#6B7280] hover:text-[#163B34] hover:border-[#163B34] transition-all">
                                    <s.icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>
                    {[
                        { title: 'Platform', links: [{ l: 'Technologies', t: '/technologies' }, { l: 'Leaderboard', t: '/leaderboard' }, { l: 'Certificates', t: '/certificate/view' }, { l: 'Dashboard', t: '/dashboard' }] },
                        { title: 'Company', links: [{ l: 'About', t: '#' }, { l: 'Blog', t: '#' }, { l: 'Careers', t: '#' }, { l: 'Contact', t: '#' }] },
                        { title: 'Support', links: [{ l: 'Help Center', t: '#' }, { l: 'Privacy', t: '#' }, { l: 'Terms', t: '#' }, { l: 'Cookies', t: '#' }] },
                    ].map(col => (
                        <div key={col.title}>
                            <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest mb-4">{col.title}</h4>
                            <ul className="space-y-3">
                                {col.links.map(link => (
                                    <li key={link.l}>
                                        <Link to={link.t} className="text-sm font-medium text-[#6B7280] hover:text-[#163B34] transition-colors">{link.l}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-[#6B7280]">© {year} HangBug. All rights reserved.</p>
                    <p className="text-sm text-[#6B7280] flex items-center gap-1.5">
                        Made with <Heart size={14} className="text-red-400" /> by <Code2 size={14} className="text-[#163B34]" />
                        <span className="font-semibold text-[#163B34]">HangBug Team</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
