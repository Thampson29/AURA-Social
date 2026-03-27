import React from 'react';
import { motion } from 'motion/react';
import { Search, TrendingUp, Sparkles, Hash, Heart, MessageCircle } from 'lucide-react';

const TRENDING = [
  { id: 1, topic: '#AIArt', posts: '1.2M', color: 'bg-purple-500/10 text-purple-600' },
  { id: 2, topic: '#TechTalk', posts: '850K', color: 'bg-blue-500/10 text-blue-600' },
  { id: 3, topic: '#MindfulMoments', posts: '420K', color: 'bg-emerald-500/10 text-emerald-600' },
  { id: 4, topic: '#FutureOfWork', posts: '310K', color: 'bg-orange-500/10 text-orange-600' },
];

const DISCOVER_POSTS = Array.from({ length: 12 }).map((_, i) => ({
  id: i,
  image: `https://picsum.photos/seed/explore${i}/400/400`,
  size: i % 5 === 0 ? 'large' : 'small',
}));

export function Explore() {
  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Bar */}
      <div className="sticky top-0 z-30 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl backdrop-saturate-150 pb-6 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-white/30 dark:border-slate-800/50 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search Aura (Try 'aesthetic cafes near me')" 
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border border-white/50 dark:border-slate-700/50 focus:ring-2 focus:ring-indigo-500/50 transition-all text-lg placeholder:text-slate-500 shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-sm font-medium flex items-center gap-1">
            <Sparkles className="w-4 h-4" /> AI
          </div>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mb-10">
        <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" /> Trending Now
        </h2>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {TRENDING.map((trend) => (
            <div key={trend.id} className="min-w-[160px] p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl backdrop-saturate-150 border border-white/50 dark:border-slate-800/50 shadow-xl shadow-black/5 flex-shrink-0 hover:scale-105 transition-transform cursor-pointer">
              <div className={`w-10 h-10 rounded-xl ${trend.color} flex items-center justify-center mb-3`}>
                <Hash className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg">{trend.topic}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{trend.posts} posts</p>
            </div>
          ))}
        </div>
      </div>

      {/* Discover Grid */}
      <div>
        <h2 className="text-xl font-bold tracking-tight mb-6">Discover For You</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {DISCOVER_POSTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 group cursor-pointer ${
                post.size === 'large' ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
              }`}
            >
              <img src={post.image} alt="Discover" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <div className="flex items-center gap-4 text-white">
                  <span className="flex items-center gap-1 font-medium"><Heart className="w-4 h-4 fill-white" /> {Math.floor(Math.random() * 10)}K</span>
                  <span className="flex items-center gap-1 font-medium"><MessageCircle className="w-4 h-4 fill-white" /> {Math.floor(Math.random() * 500)}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
