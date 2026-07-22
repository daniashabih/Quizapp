import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme] = useState('light');

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
        localStorage.setItem('hangbug-theme', 'light');
    }, []);

    return (
        <ThemeContext.Provider value={{
            theme: 'light',
            resolvedTheme: 'light',
            toggleTheme: () => {},
            setThemeMode: () => {},
            isDark: false
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};
