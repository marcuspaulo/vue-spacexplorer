import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';
import { ThemeContext, type Theme } from '@/providers/theme-context';

const STORAGE_KEY = 'theme';

// index.html applies the initial class before paint to avoid a flash.
function getInitialTheme(): Theme {
    return document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
}

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // Storage may be unavailable (private mode); the theme still applies.
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
    }, []);

    const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

    return <ThemeContext value={value}>{children}</ThemeContext>;
}
