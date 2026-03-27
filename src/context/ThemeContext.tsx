import React, { createContext, useContext, useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

type Theme = 'light' | 'dark' | 'calm';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isScrollingExcessively: boolean;
  setScrollingExcessively: (val: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [isScrollingExcessively, setScrollingExcessively] = useState(false);

  // Mouse tracking for ambient blobs
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });
  const invertedMouseX = useTransform(mouseX, (v) => -v);
  const invertedMouseY = useTransform(mouseY, (v) => -v);
  const halfMouseX = useTransform(mouseX, (v) => v * 0.5);
  const halfMouseY = useTransform(mouseY, (v) => v * 0.5);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const xPct = (e.clientX / window.innerWidth) - 0.5;
      const yPct = (e.clientY / window.innerHeight) - 0.5;
      mouseX.set(xPct * 100);
      mouseY.set(yPct * 100);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    // Auto-detect theme based on time
    const hour = new Date().getHours();
    if (hour >= 20 || hour < 6) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark', 'calm');
    root.classList.add(theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isScrollingExcessively, setScrollingExcessively }}>
      <div className={`min-h-screen transition-colors duration-1000 relative overflow-hidden ${
        theme === 'dark' ? 'bg-slate-950 text-slate-50' : 
        theme === 'calm' ? 'bg-indigo-50 text-indigo-950' : 
        'bg-slate-50 text-slate-900'
      } ${isScrollingExcessively ? 'backdrop-blur-sm bg-opacity-90' : ''}`}>
        
        {/* Ambient background blobs for Apple-like glassmorphism effect */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <motion.div 
            style={{ x: mouseX, y: mouseY }}
            className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-400/30 dark:bg-indigo-600/20 blur-[120px]" 
          />
          <motion.div 
            style={{ x: invertedMouseX, y: invertedMouseY }}
            className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/30 dark:bg-purple-600/20 blur-[120px]" 
          />
          <motion.div 
            style={{ x: halfMouseX, y: halfMouseY }}
            className="absolute top-[40%] left-[60%] w-[40%] h-[40%] rounded-full bg-emerald-400/20 dark:bg-emerald-600/10 blur-[100px]" 
          />
        </div>

        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
