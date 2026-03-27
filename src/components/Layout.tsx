import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Compass, PlusSquare, User, Settings, Clock, Wind } from 'lucide-react';
import { useTimeWellSpent } from '../context/TimeWellSpentContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Layout() {
  const location = useLocation();
  const { timeSpent, updateScrollDepth } = useTimeWellSpent();
  const { theme, isScrollingExcessively } = useTheme();
  const [zenMode, setZenMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      updateScrollDepth(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [updateScrollDepth]);

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Compass, label: 'Explore', path: '/explore' },
    { icon: PlusSquare, label: 'Create', path: '/create' },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col min-h-screen max-w-3xl mx-auto relative">
      {/* Time Well Spent Meter (Top Bar) */}
      <div className={cn(
        "fixed top-0 left-0 right-0 h-1 z-50 transition-all duration-1000",
        isScrollingExcessively ? "bg-red-500" : "bg-emerald-400"
      )}>
        <div 
          className="h-full bg-white/50" 
          style={{ width: `${Math.min((timeSpent / 1800) * 100, 100)}%` }} 
        />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl backdrop-saturate-150 border-b border-white/30 dark:border-slate-800/50 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">A</div>
          <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">Aura</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-slate-700/50 shadow-sm">
          <Clock className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-semibold">{formatTime(timeSpent)}</span>
        </div>
      </header>

      {isScrollingExcessively && !zenMode && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 border border-white/50 dark:border-slate-800/50 px-4 py-2 rounded-full shadow-xl shadow-black/5 flex items-center gap-3 text-sm text-slate-900 dark:text-white"
        >
          <Clock className="w-4 h-4 text-rose-500" />
          <span>You've been scrolling a while.</span>
          <button 
            onClick={() => setZenMode(true)}
            className="px-3 py-1 bg-indigo-500 text-white rounded-full text-xs font-semibold hover:bg-indigo-600 transition-colors flex items-center gap-1"
          >
            <Wind className="w-3 h-3" /> Zen Mode
          </button>
        </motion.div>
      )}

      {/* Zen Mode Overlay */}
      <AnimatePresence>
        {zenMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-3xl flex flex-col items-center justify-center text-white"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-64 h-64 rounded-full bg-gradient-to-tr from-indigo-500/40 to-emerald-500/40 blur-2xl absolute"
            />
            <div className="relative z-10 flex flex-col items-center">
              <Wind className="w-12 h-12 mb-6 text-emerald-400" />
              <motion.h2 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="text-3xl font-light tracking-widest mb-2"
              >
                BREATHE
              </motion.h2>
              <p className="text-slate-400 mb-12">Take a moment for yourself.</p>
              
              <button 
                onClick={() => setZenMode(false)}
                className="px-6 py-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors backdrop-blur-md"
              >
                Return to Aura
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 pb-24 min-h-screen relative">
        <Outlet />
      </main>

      {/* Bottom Nav (All Screens) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl backdrop-saturate-150 border-t border-white/30 dark:border-slate-800/50 z-40 pb-safe">
        <div className="flex justify-around items-center p-4 max-w-3xl mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all",
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "fill-indigo-100 dark:fill-indigo-900/30")} />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
