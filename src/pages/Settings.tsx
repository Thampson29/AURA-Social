import React from 'react';
import { motion } from 'motion/react';
import { Moon, Sun, Clock, Shield, Bell, Eye, Smartphone, LogOut, User, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';

export function Settings() {
  const { theme, setTheme } = useTheme();

  const sections = [
    {
      title: 'Appearance & AI',
      items: [
        {
          icon: Moon,
          label: 'Theme Mode',
          value: theme.charAt(0).toUpperCase() + theme.slice(1),
          action: (
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button onClick={() => setTheme('light')} className={cn("p-2 rounded-lg transition-colors", theme === 'light' ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500")}><Sun className="w-4 h-4" /></button>
              <button onClick={() => setTheme('dark')} className={cn("p-2 rounded-lg transition-colors", theme === 'dark' ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500")}><Moon className="w-4 h-4" /></button>
              <button onClick={() => setTheme('calm')} className={cn("p-2 rounded-lg transition-colors", theme === 'calm' ? "bg-white dark:bg-slate-700 shadow-sm" : "text-slate-500")}><Eye className="w-4 h-4" /></button>
            </div>
          )
        },
        {
          icon: Clock,
          label: 'Time Well Spent Limits',
          value: '30 mins / day',
          action: <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer">Edit</span>
        },
        {
          icon: Shield,
          label: 'AI Content Filtering',
          value: 'Strict',
          action: <span className="text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer">Edit</span>
        }
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Personal Information', value: '', action: <ChevronRight className="w-5 h-5 text-slate-400" /> },
        { icon: Bell, label: 'Notifications', value: 'All On', action: <ChevronRight className="w-5 h-5 text-slate-400" /> },
        { icon: Smartphone, label: 'Device Management', value: '2 Devices', action: <ChevronRight className="w-5 h-5 text-slate-400" /> },
      ]
    }
  ];

  return (
    <div className="max-w-3xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Settings</h1>

      <div className="space-y-8">
        {sections.map((section, i) => (
          <motion.div 
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 rounded-[2rem] p-6 shadow-xl shadow-black/5 border border-white/50 dark:border-slate-800/50"
          >
            <h2 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">{section.title}</h2>
            <div className="space-y-6">
              {section.items.map((item, j) => {
                const Icon = item.icon;
                return (
                  <div key={j} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{item.label}</p>
                        {item.value && <p className="text-sm text-slate-500 dark:text-slate-400">{item.value}</p>}
                      </div>
                    </div>
                    <div>{item.action}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ))}

        <motion.button 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="w-full py-4 rounded-2xl border-2 border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
        >
          <LogOut className="w-5 h-5" /> Log Out
        </motion.button>
      </div>
    </div>
  );
}
