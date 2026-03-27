import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ImagePlus, Wand2, Hash, SlidersHorizontal, Check, Image as ImageIcon, Video, AlignLeft } from 'lucide-react';
import { cn } from '../lib/utils';

const FILTERS = [
  { id: 'none', name: 'Normal', class: '' },
  { id: 'aura', name: 'Aura Glow', class: 'contrast-110 saturate-150 hue-rotate-15' },
  { id: 'cyber', name: 'Cyberpunk', class: 'contrast-125 saturate-200 hue-rotate-90' },
  { id: 'vintage', name: 'Vintage', class: 'sepia-[.5] contrast-125 saturate-50' },
  { id: 'noir', name: 'Noir', class: 'grayscale contrast-150' },
  { id: 'ethereal', name: 'Ethereal', class: 'brightness-110 saturate-50 contrast-75 blur-[1px]' },
];

export function CreatePost() {
  const [postType, setPostType] = useState<'image' | 'video' | 'text'>('image');
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestedHashtags, setSuggestedHashtags] = useState<string[]>([]);
  const [isAnalyzingMedia, setIsAnalyzingMedia] = useState(false);
  const [recommendedFilter, setRecommendedFilter] = useState<string | null>(null);
  const [appliedFilter, setAppliedFilter] = useState<string>('none');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setIsAnalyzingMedia(true);
      setRecommendedFilter(null);
      setAppliedFilter('none');
      
      // Simulate AI filter recommendation
      setTimeout(() => {
        setIsAnalyzingMedia(false);
        setRecommendedFilter('aura');
        // Optionally auto-apply the recommended filter
        // setAppliedFilter('aura');
      }, 2000);
    }
  };

  const handleAIMagic = (style: 'funny' | 'savage' | 'aesthetic') => {
    if (!caption) return;
    setIsGenerating(true);
    setTimeout(() => {
      const newCaptions = {
        funny: `Just me pretending I have my life together 😂 ${caption}`,
        savage: `I'm not always sarcastic. Sometimes I'm sleeping. 💅 ${caption}`,
        aesthetic: `Finding beauty in the chaos ✨ ${caption}`
      };
      setCaption(newCaptions[style]);
      setSuggestedHashtags(['#vibes', '#mood', '#aesthetic', '#daily']);
      setIsGenerating(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Create Post</h1>
        <button className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold rounded-full hover:scale-105 transition-transform shadow-lg shadow-slate-900/20 dark:shadow-white/20">
          Share
        </button>
      </div>

      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl backdrop-saturate-150 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl shadow-black/5 border border-white/50 dark:border-slate-800/50">
        
        {/* Post Type Selector */}
        <div className="flex gap-2 p-1.5 mb-8 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/40 dark:border-slate-700/50">
          {[
            { id: 'image', label: 'Image', icon: <ImageIcon className="w-4 h-4" /> },
            { id: 'video', label: 'Video', icon: <Video className="w-4 h-4" /> },
            { id: 'text', label: 'Text', icon: <AlignLeft className="w-4 h-4" /> }
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setPostType(type.id as any);
                setImage(null);
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all",
                postType === type.id
                  ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {type.icon}
              {type.label}
            </button>
          ))}
        </div>

        {/* Media Upload Area */}
        {postType !== 'text' && (
          <div className="mb-8 relative group">
            {image ? (
            <div className="space-y-4">
              <div className="relative aspect-square sm:aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img 
                  src={image} 
                  alt="Preview" 
                  className={cn("w-full h-full object-cover transition-all duration-500", FILTERS.find(f => f.id === appliedFilter)?.class)} 
                />
                
                {isAnalyzingMedia && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white">
                    <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="mb-4">
                      <Sparkles className="w-10 h-10 text-indigo-400" />
                    </motion.div>
                    <p className="font-medium tracking-wide text-lg">AI is analyzing your media...</p>
                    <p className="text-sm text-slate-300 mt-2">Finding the perfect aesthetic</p>
                  </div>
                )}

                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                >
                  ✕
                </button>
              </div>

              {/* Filter Selection */}
              {!isAnalyzingMedia && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
                >
                  {FILTERS.map(filter => (
                    <button
                      key={filter.id}
                      onClick={() => setAppliedFilter(filter.id)}
                      className={cn(
                        "relative flex-shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all overflow-hidden",
                        appliedFilter === filter.id 
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30" 
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      )}
                    >
                      {recommendedFilter === filter.id && (
                        <div className="absolute top-0 right-0 w-2 h-2 bg-amber-400 rounded-bl-lg animate-pulse" />
                      )}
                      <div className="flex items-center gap-2">
                        {recommendedFilter === filter.id && <Sparkles className={cn("w-3.5 h-3.5", appliedFilter === filter.id ? "text-amber-300" : "text-amber-500")} />}
                        {filter.name}
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center aspect-square sm:aspect-video rounded-3xl border-2 border-dashed border-white/50 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-slate-800/60 transition-colors cursor-pointer group-hover:border-indigo-400 dark:group-hover:border-indigo-500 shadow-inner">
              <div className="w-16 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                {postType === 'video' ? <Video className="w-8 h-8 text-indigo-500" /> : <ImagePlus className="w-8 h-8 text-indigo-500" />}
              </div>
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Upload {postType === 'video' ? 'Video' : 'Photo'}</p>
              <p className="text-sm text-slate-500 mt-1">Drag and drop or click to browse</p>
              <input type="file" className="hidden" accept={postType === 'video' ? 'video/*' : 'image/*'} onChange={handleImageUpload} />
            </label>
          )}
        </div>
        )}

        {/* Caption Input */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            Caption
            {isGenerating && <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}><Wand2 className="w-4 h-4 text-indigo-500" /></motion.div>}
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Write a caption..."
            className="w-full px-5 py-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/50 dark:border-slate-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none h-32 text-lg shadow-inner"
          />
        </div>

        {/* AI Magic Buttons */}
        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
            <Wand2 className="w-4 h-4 text-purple-500" /> AI Magic Rewrite
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'funny', label: 'Make it funny 😂', color: 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-500/30' },
              { id: 'savage', label: 'Make it savage 💅', color: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-500/30' },
              { id: 'aesthetic', label: 'Make it aesthetic ✨', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-400 hover:bg-indigo-200 dark:hover:bg-indigo-500/30' }
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => handleAIMagic(btn.id as any)}
                disabled={!caption || isGenerating}
                className={cn(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  btn.color
                )}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hashtags */}
        {suggestedHashtags.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800"
          >
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-500" /> Suggested Hashtags
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedHashtags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Add Sparkles icon since it wasn't imported at the top
function Sparkles(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
