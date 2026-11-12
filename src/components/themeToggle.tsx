'use client';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
    const { theme, resolvedTheme, setTheme } = useTheme();

    // console.log({ 'Theme': theme, 'Thema Resolvido': resolvedTheme });

    return (
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            Mudar para {theme === 'dark' ? 'light' : 'dark'}
        </button>
    );
}