import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Home, Compass, PlusSquare, User, Settings, Clock, Wind, Menu } from 'lucide-react';
import { useTimeWellSpent } from '../context/TimeWellSpentContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export function Layout() {
  const location = useLocation();
  const { timeSpent, updateScrollDepth } = useTimeWellSpent();
  const { isScrollingExcessively } = useTheme();
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
    { icon: PlusSquare, label: 'Create', path: '/create', highlighted: true },
    { icon: User, label: 'Profile', path: '/profile' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="flex flex-col min-h-screen max-w-3xl mx-auto relative bg-slate-950 font-sans text-slate-50">
      {/* Time Well Spent Meter (Top Bar) */}
      <div className={cn(
        "fixed top-0 left-0 right-0 h-1 z-50 transition-all duration-1000",
        isScrollingExcessively ? "bg-rose-500" : "bg-gradient-to-r from-purple-500 to-blue-500"
      )}>
        <div 
          className="h-full bg-slate-200/50" 
          style={{ width: `${Math.min((timeSpent / 1800) * 100, 100)}%` }} 
        />
      </div>

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="text-slate-300 hover:text-white transition-colors">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold tracking-tight text-white">Aura</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 shadow-md">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="text-sm text-slate-400 font-medium">{formatTime(timeSpent)}</span>
        </div>
      </header>

      {isScrollingExcessively && !zenMode && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xl border border-slate-800 px-4 py-2 rounded-full shadow-lg flex items-center gap-3 text-sm text-white"
        >
          <Clock className="w-4 h-4 text-rose-400" />
          <span>You've been scrolling a while.</span>
          <button 
            onClick={() => setZenMode(true)}
            className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-xs font-semibold hover:opacity-90 transition-all shadow-[0_0_15px_rgba(168,85,247,0.4)]"
          >
            <Wind className="w-3 h-3 inline mr-1" /> Zen Mode
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
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-3xl flex flex-col items-center justify-center text-white"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="w-64 h-64 rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-[100px] absolute"
            />
            <div className="relative z-10 flex flex-col items-center">
              <Wind className="w-12 h-12 mb-6 text-blue-400" />
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
                className="px-6 py-3 rounded-full border border-slate-700 hover:bg-slate-800 transition-colors backdrop-blur-md shadow-lg"
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

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 z-40 pb-safe">
        <div className="flex justify-around items-center p-2 max-w-3xl mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            if (item.highlighted) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center justify-center p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg hover:scale-105 transition-all duration-200"
                >
                  <Icon className="w-6 h-6" />
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 hover:bg-slate-900",
                  isActive ? "text-white" : "text-slate-500 hover:text-slate-300"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "text-blue-500")} />
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
