'use client';
import { useTheme } from '@/contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      className={styles.toggle} 
      onClick={toggleTheme}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
