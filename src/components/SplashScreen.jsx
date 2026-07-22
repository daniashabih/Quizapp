import { useState, useEffect } from 'react';
import BrandLogo from './BrandLogo';

export default function SplashScreen({ onFinish }) {
    const [phase, setPhase] = useState('enter'); // 'enter' | 'loading' | 'exit'
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        // Phase 1: Initial pause to show the logo
        const enterTimer = setTimeout(() => {
            setPhase('loading');
        }, 600);

        return () => clearTimeout(enterTimer);
    }, []);

    useEffect(() => {
        if (phase !== 'loading') return;

        // Phase 2: Animate progress bar from 0 to 100
        const interval = setInterval(() => {
            setProgress(prev => {
                const increment = Math.random() * 12 + 3;
                const next = Math.min(prev + increment, 100);
                if (next >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setPhase('exit');
                        setTimeout(() => {
                            setVisible(false);
                            if (onFinish) onFinish();
                        }, 600);
                    }, 300);
                    return 100;
                }
                return next;
            });
        }, 180);

        return () => clearInterval(interval);
    }, [phase, onFinish]);

    if (!visible) return null;

    return (
        <div
            className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-700 ease-in-out bg-white ${
                phase === 'exit' ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            }`}
        >
            {/* Ambient background glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#163B34]/5 rounded-full blur-[120px] animate-pulse-glow" />
            </div>

            <div className="relative flex flex-col items-center">
                {/* Logo with staggered animation */}
                <div className={`relative mb-3 transition-all duration-1000 ${
                    phase === 'enter' ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
                }`}>
                    <BrandLogo variant="script" size="lg" className="drop-shadow-sm" />
                </div>

                {/* Brand tagline */}
                <div className={`text-center transition-all duration-700 delay-200 ${
                    phase === 'enter' ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'
                }`}>
                    <p className={`text-sm font-medium text-[#6B7280] mt-2 transition-all duration-500 delay-500 ${
                        phase === 'enter' ? 'opacity-0' : 'opacity-100'
                    }`}>
                        Master Development • One Quiz at a Time
                    </p>
                </div>

                {/* Tagline / version */}
                <p className={`text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-[0.2em] mt-6 transition-all duration-500 delay-700 ${
                    phase === 'enter' ? 'opacity-0' : 'opacity-100'
                }`}>
                    v1.0.0
                </p>

                {/* Progress bar */}
                <div className={`w-48 mt-10 transition-all duration-500 delay-700 ${
                    phase === 'enter' ? 'opacity-0' : 'opacity-100'
                }`}>
                    <div className="h-1 rounded-full bg-[#EAF5F2] overflow-hidden">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#163B34] to-[#289B7D] transition-all duration-300 ease-out"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-[10px] font-mono text-[#9CA3AF] mt-2 text-center tabular-nums">
                        {Math.round(progress)}%
                    </p>
                </div>

                {/* Bottom loading dots */}
                <div className="flex items-center gap-1.5 mt-8">
                    {[0, 1, 2].map(i => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full bg-[#163B34]/40 animate-bounce"
                            style={{
                                animationDelay: `${i * 0.15}s`,
                                animationDuration: '0.8s',
                                opacity: phase === 'enter' ? 0 : 1,
                                transition: `opacity 0.5s ${0.8 + i * 0.1}s`,
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Bottom branding */}
            <p className={`absolute bottom-8 text-[10px] font-medium text-[#9CA3AF] tracking-wider transition-all duration-500 ${
                phase === 'enter' ? 'opacity-0' : 'opacity-100'
            }`}>
                © {new Date().getFullYear()} HangBug Platform
            </p>
        </div>
    );
}
