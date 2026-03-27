import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from './ThemeContext';

interface TimeWellSpentContextType {
  timeSpent: number; // in seconds
  scrollDepth: number;
  updateScrollDepth: (depth: number) => void;
}

const TimeWellSpentContext = createContext<TimeWellSpentContextType | undefined>(undefined);

export function TimeWellSpentProvider({ children }: { children: React.ReactNode }) {
  const [timeSpent, setTimeSpent] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);
  const { setScrollingExcessively } = useTheme();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // If user scrolls past 5000px, trigger excessive scrolling UI
    if (scrollDepth > 5000) {
      setScrollingExcessively(true);
    } else {
      setScrollingExcessively(false);
    }
  }, [scrollDepth, setScrollingExcessively]);

  const updateScrollDepth = (depth: number) => {
    setScrollDepth(Math.max(scrollDepth, depth));
  };

  return (
    <TimeWellSpentContext.Provider value={{ timeSpent, scrollDepth, updateScrollDepth }}>
      {children}
    </TimeWellSpentContext.Provider>
  );
}

export function useTimeWellSpent() {
  const context = useContext(TimeWellSpentContext);
  if (context === undefined) {
    throw new Error('useTimeWellSpent must be used within a TimeWellSpentProvider');
  }
  return context;
}
