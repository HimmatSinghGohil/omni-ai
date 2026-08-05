import type { AppProps } from 'next/app';
import { useEffect, useState } from 'react';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setIsDark(savedTheme === 'dark');
  }, []);

  return (
    <div className={`min-h-screen ${isDark ? 'dark' : ''}`}>
      <Component {...pageProps} />
    </div>
  );
}
