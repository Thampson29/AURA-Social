import React from 'react';
import { motion } from 'motion/react';
import { Settings, Grid, Bookmark, Heart, Sparkles } from 'lucide-react';

export function Profile() {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Profile Header */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 rounded-[2.5rem] p-8 mb-12 shadow-2xl shadow-black/5 border border-white/50 dark:border-slate-800/50 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/50 dark:border-slate-800/50 shadow-xl">
              <img src="https://picsum.photos/seed/user1/400/400" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-2 right-2 bg-indigo-500 text-white p-2 rounded-full border-2 border-white/50 dark:border-slate-800/50 shadow-lg">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold tracking-tight">alex_rivera</h1>
              <div className="flex gap-2">
                <button className="px-6 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-900 dark:text-white font-semibold rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors border border-white/50 dark:border-slate-700/50 shadow-sm">
                  Edit Profile
                </button>
                <button className="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md text-slate-900 dark:text-white rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors border border-white/50 dark:border-slate-700/50 shadow-sm">
                  <Settings className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex justify-center md:justify-start gap-8 mb-6">
              <div className="flex flex-col items-center md:items-start">
                <span className="text-xl font-bold">142</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Posts</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-xl font-bold">12.4K</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Followers</span>
              </div>
              <div className="flex flex-col items-center md:items-start">
                <span className="text-xl font-bold">840</span>
                <span className="text-sm text-slate-500 dark:text-slate-400">Following</span>
              </div>
            </div>

            <div className="max-w-md mx-auto md:mx-0">
              <h2 className="font-semibold text-lg mb-1">Alex Rivera ✨</h2>
              <p className="text-slate-600 dark:text-slate-300 mb-2">
                Digital creator & AI enthusiast. Exploring the intersection of technology and art. 🎨🤖
              </p>
              <a href="#" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
                linktr.ee/alexrivera
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button className="flex items-center gap-2 px-8 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl text-slate-900 dark:text-white font-semibold border border-white/50 dark:border-slate-700/50 shadow-sm">
          <Grid className="w-5 h-5" /> Posts
        </button>
        <button className="flex items-center gap-2 px-8 py-3 rounded-2xl text-slate-500 dark:text-slate-400 font-medium hover:bg-white/40 dark:hover:bg-slate-800/40 backdrop-blur-md transition-colors">
          <Bookmark className="w-5 h-5" /> Saved
        </button>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-3 gap-1 sm:gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="aspect-square relative group cursor-pointer overflow-hidden rounded-xl sm:rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 shadow-sm"
          >
            <img src={`https://picsum.photos/seed/profile${i}/400/400`} alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <div className="flex items-center gap-6 text-white font-bold text-lg">
                <span className="flex items-center gap-2"><Heart className="w-6 h-6 fill-white" /> {Math.floor(Math.random() * 5)}K</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
