import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useInView } from 'motion/react';
import { Heart, MessageCircle, Share2, Bookmark, Sparkles, Info, Play, Image as ImageIcon, Video, AlignLeft, LayoutGrid, Square, Zap, Eye, Music, X, Plus } from 'lucide-react';
import { cn } from '../lib/utils';

const POST_TYPES = [
  { id: 'all', icon: <LayoutGrid className="w-5 h-5" />, label: 'All' },
  { id: 'image', icon: <ImageIcon className="w-5 h-5" />, label: 'Images' },
  { id: 'video', icon: <Video className="w-5 h-5" />, label: 'Videos' },
  { id: 'text', icon: <AlignLeft className="w-5 h-5" />, label: 'Texts' },
];

type PostType = 'image' | 'video' | 'text';

export interface Comment {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

export interface StoryItem {
  id: string;
  mediaUrl: string;
  type: 'image' | 'video';
  timestamp: string;
}

export interface UserStory {
  id: string;
  author: string;
  avatar: string;
  hasUnviewed: boolean;
  isCurrentUser?: boolean;
  items: StoryItem[];
}

interface Post {
  id: number;
  type: PostType;
  author: string;
  handle: string;
  avatar: string;
  content: string;
  mediaUrl?: string;
  songName?: string;
  aiReason: string;
  likes: number;
  commentCount: number;
  commentsList: Comment[];
  timestamp: string;
}

// Helper to generate realistic mock data
const generateMockComments = (count: number, depth: number = 0): Comment[] => {
  if (depth > 2) return []; // Max nesting depth
  const comments: Comment[] = [];
  const authors = [
    { name: 'Sarah Jenkins', handle: '@sarahj' },
    { name: 'Tech Daily', handle: '@techdaily' },
    { name: 'Alex Rivera', handle: '@arivera' },
    { name: 'Meme Central', handle: '@memegod' },
    { name: 'Nature Vibes', handle: '@nature' },
    { name: 'Dr. Code', handle: '@drcode' },
    { name: 'Design Hub', handle: '@uiux' },
    { name: 'Fitness Guru', handle: '@fitlife' },
  ];
  const contents = [
    "This is so true!",
    "I completely agree with this.",
    "Interesting perspective, hadn't thought of that.",
    "Can you elaborate on this?",
    "Love this! 🔥",
    "Not sure I agree, but good point.",
    "Thanks for sharing!",
    "This made my day."
  ];

  for (let i = 0; i < count; i++) {
    const author = authors[Math.floor(Math.random() * authors.length)];
    const hasReplies = Math.random() > 0.5 && depth < 2;
    comments.push({
      id: Math.random().toString(36).substr(2, 9),
      author: author.name,
      handle: author.handle,
      avatar: `https://picsum.photos/seed/${author.name.replace(' ', '')}/100/100`,
      content: contents[Math.floor(Math.random() * contents.length)],
      timestamp: `${Math.floor(Math.random() * 23) + 1}h ago`,
      likes: Math.floor(Math.random() * 100),
      replies: hasReplies ? generateMockComments(Math.floor(Math.random() * 3) + 1, depth + 1) : []
    });
  }
  return comments;
};

const generateMockStories = (): UserStory[] => {
  const authors = [
    { name: 'You', handle: '@currentuser', isCurrentUser: true },
    { name: 'Sarah Jenkins', handle: '@sarahj' },
    { name: 'Tech Daily', handle: '@techdaily' },
    { name: 'Alex Rivera', handle: '@arivera' },
    { name: 'Nature Vibes', handle: '@nature' },
    { name: 'Design Hub', handle: '@uiux' },
  ];

  return authors.map((author, i) => ({
    id: `story_user_${i}`,
    author: author.name,
    avatar: author.isCurrentUser ? `https://picsum.photos/seed/currentuser/100/100` : `https://picsum.photos/seed/${author.name.replace(' ', '')}/100/100`,
    hasUnviewed: !author.isCurrentUser && Math.random() > 0.3,
    isCurrentUser: author.isCurrentUser,
    items: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, j) => ({
      id: `story_item_${i}_${j}`,
      mediaUrl: `https://picsum.photos/seed/story_${i}_${j}/800/1200`,
      type: 'image',
      timestamp: `${Math.floor(Math.random() * 12) + 1}h ago`
    }))
  }));
};

const ALL_STORIES = generateMockStories();

const generateMockPosts = (count: number): Post[] => {
  const authors = [
    { name: 'Sarah Jenkins', handle: '@sarahj' },
    { name: 'Tech Daily', handle: '@techdaily' },
    { name: 'Alex Rivera', handle: '@arivera' },
    { name: 'Meme Central', handle: '@memegod' },
    { name: 'Nature Vibes', handle: '@nature' },
    { name: 'Dr. Code', handle: '@drcode' },
    { name: 'Design Hub', handle: '@uiux' },
    { name: 'Fitness Guru', handle: '@fitlife' },
  ];

  const textContents = [
    "Just had the best coffee of my life. Small moments matter.",
    "Why is CSS so hard sometimes? Just spent 2 hours centering a div.",
    "Remember to drink water and take a screen break today!",
    "Hot take: pineapple absolutely belongs on pizza.",
    "Just deployed to production on a Friday. Wish me luck.",
    "What's everyone reading right now? Need book recommendations.",
    "The new AI models are getting insanely good. We are living in the future.",
    "Sometimes you just need to unplug and go for a walk.",
    "Can we normalize not having everything figured out by 25?",
    "I've listened to the same song 40 times today. No regrets."
  ];

  const aiReasons = [
    "You usually engage with relaxing content on Sunday mornings.",
    "Based on your recent interest in #technology and #science.",
    "You follow this creator and frequently interact with their posts.",
    "You shared similar programming memes yesterday.",
    "You saved 3 nature posts this week.",
    "This post is trending among people with similar interests.",
    "Matches your current content preferences.",
    "You've been spending time learning about this topic recently."
  ];

  const videoUrls = [
    "https://www.w3schools.com/html/mov_bbb.mp4",
    "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"
  ];

  const songNames = [
    "Chill Vibes - Lofi Beat",
    "Summer Pop Hits 2026",
    "Acoustic Sunrise",
    "Cyberpunk Synthwave",
    "Nature Sounds - Rain",
    "Epic Orchestral Trailer",
    "Jazz Cafe Ambience",
    "Deep House Mix"
  ];

  const posts: Post[] = [];
  const types: PostType[] = ['image', 'video', 'text', 'text', 'image']; // Weighted towards text and image

  for (let i = 1; i <= count; i++) {
    const author = authors[Math.floor(Math.random() * authors.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    
    let mediaUrl;
    let songName;
    if (type === 'image') {
      mediaUrl = `https://picsum.photos/seed/${i * 100}/800/800`;
      songName = songNames[Math.floor(Math.random() * songNames.length)];
    } else if (type === 'video') {
      mediaUrl = videoUrls[Math.floor(Math.random() * videoUrls.length)];
      songName = songNames[Math.floor(Math.random() * songNames.length)];
    }

    posts.push({
      id: i,
      type,
      author: author.name,
      handle: author.handle,
      avatar: `https://picsum.photos/seed/${author.name.replace(' ', '')}/100/100`,
      content: textContents[Math.floor(Math.random() * textContents.length)],
      mediaUrl,
      songName,
      aiReason: aiReasons[Math.floor(Math.random() * aiReasons.length)],
      likes: Math.floor(Math.random() * 50000) + 10,
      commentCount: Math.floor(Math.random() * 2000) + 1,
      commentsList: generateMockComments(Math.floor(Math.random() * 3) + 1),
      timestamp: `${Math.floor(Math.random() * 23) + 1}h ago`
    });
  }
  return posts;
};

const ALL_POSTS = generateMockPosts(200); // Generate 200 posts for infinite scroll

const CommentItem: React.FC<{ comment: Comment; depth?: number }> = ({ comment, depth = 0 }) => {
  const [showReplies, setShowReplies] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div className={cn("flex gap-3", depth > 0 ? "mt-3" : "mt-4")}>
      <img src={comment.avatar} alt={comment.author} className="w-8 h-8 rounded-full object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-slate-900 dark:text-white">{comment.author}</span>
            <span className="text-xs text-slate-500">{comment.timestamp}</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
        </div>
        <div className="flex items-center gap-4 mt-1 ml-2 text-xs text-slate-500 font-medium">
          <button className="hover:text-indigo-500 transition-colors">Like</button>
          <button className="hover:text-indigo-500 transition-colors">Reply</button>
          {comment.likes > 0 && <span>{comment.likes} likes</span>}
        </div>
        
        {hasReplies && (
          <div className="mt-2 ml-2">
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="text-xs font-semibold text-indigo-500 hover:text-indigo-600 flex items-center gap-1"
            >
              <div className="w-6 h-[1px] bg-indigo-500/50" />
              {showReplies ? 'Hide replies' : `View ${comment.replies!.length} replies`}
            </button>
            
            <AnimatePresence>
              {showReplies && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {comment.replies!.map(reply => (
                    <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

interface PostCardProps {
  post: Post;
  isCinematic: boolean;
  onInView: (id: number) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, isCinematic, onInView }) => {
  const [showReason, setShowReason] = useState(false);
  const [isResonating, setIsResonating] = useState(false);
  const [hasResonated, setHasResonated] = useState(false);
  const [resonance, setResonance] = useState(post.likes);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [commentsList, setCommentsList] = useState<Comment[]>(post.commentsList);
  const [commentText, setCommentText] = useState("");
  
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { margin: "-40% 0px -40% 0px" });

  useEffect(() => {
    if (isInView && isCinematic) {
      onInView(post.id);
    }
  }, [isInView, isCinematic, post.id, onInView]);

  // 3D Tilt Effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleResonate = () => {
    if (!hasResonated) {
      setIsResonating(true);
      setTimeout(() => {
        setIsResonating(false);
        setHasResonated(true);
        setResonance(prev => prev + 1);
      }, 800);
    } else {
      setHasResonated(false);
      setResonance(prev => prev - 1);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Aura',
          text: 'Check out this post on Aura!',
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      setIsShared(true);
      setTimeout(() => setIsShared(false), 2000);
    }
  };

  const handlePostComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'You',
      handle: '@currentuser',
      avatar: 'https://picsum.photos/seed/currentuser/100/100',
      content: commentText.trim(),
      timestamp: 'Just now',
      likes: 0,
      replies: []
    };
    setCommentsList([...commentsList, newComment]);
    setCommentText("");
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isCinematic ? (isInView ? 1 : 0.3) : 1, 
        scale: isCinematic ? (isInView ? 1 : 0.95) : 1,
        y: 0 
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(
        "bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl backdrop-saturate-150 rounded-[2rem] overflow-hidden border border-white/50 dark:border-slate-800/50 shadow-xl shadow-black/5 transition-all duration-500",
        isCinematic && isInView && "ring-4 ring-indigo-500/30 shadow-2xl shadow-indigo-500/20 z-10 relative"
      )}
    >
      {/* Post Header */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={post.avatar} alt={post.author} className="w-11 h-11 rounded-full object-cover border border-slate-100 dark:border-slate-800" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base">{post.author}</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">{post.handle}</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">{post.timestamp}</p>
          </div>
        </div>
        
        {/* AI Transparency Label */}
        <div className="relative">
          <button 
            onClick={() => setShowReason(!showReason)}
            className="p-2 rounded-full hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-indigo-500"
          >
            <Info className="w-5 h-5" />
          </button>
          <AnimatePresence>
            {showReason && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute right-0 top-full mt-2 w-64 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl backdrop-saturate-150 text-slate-900 dark:text-white rounded-2xl shadow-2xl shadow-black/10 z-20 text-sm border border-white/50 dark:border-slate-700/50"
              >
                <div className="flex items-start gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span className="font-semibold">Why you're seeing this</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{post.aiReason}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Text Content (if text-only or caption above media) */}
      {post.type === 'text' && (
        <div className="px-6 pb-6 pt-2">
          <p className="text-xl leading-relaxed font-medium text-slate-800 dark:text-slate-100">
            {post.content}
          </p>
        </div>
      )}

      {/* Media Content with 3D Tilt */}
      {(post.type === 'image' || post.type === 'video') && post.mediaUrl && (
        <div className="px-5 pb-2 perspective-1000">
          <motion.div 
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="w-full relative overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800 shadow-lg group"
          >
            {post.type === 'image' ? (
              <div className="aspect-square sm:aspect-[4/5] w-full">
                <img src={post.mediaUrl} alt="Post content" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ) : (
              <div className="aspect-video w-full group">
                <video 
                  src={post.mediaUrl} 
                  autoPlay 
                  muted 
                  loop 
                  playsInline 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-4 h-4" />
                </div>
              </div>
            )}
            
            {/* 3D Reflection Overlay */}
            <motion.div 
              style={{ 
                background: "linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.3) 25%, transparent 30%)",
                x: useTransform(mouseXSpring, [-0.5, 0.5], ["-100%", "100%"]),
                y: useTransform(mouseYSpring, [-0.5, 0.5], ["-100%", "100%"])
              }}
              className="absolute inset-0 pointer-events-none mix-blend-overlay"
            />

            {/* Music Player Overlay */}
            {post.songName && (
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <div className="bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl p-3 flex items-center justify-between text-white shadow-lg">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsPlayingAudio(!isPlayingAudio);
                      }}
                      className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center shrink-0 transition-colors"
                    >
                      {isPlayingAudio ? <Square className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current ml-0.5" />}
                    </button>
                    <div className="flex flex-col overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <Music className="w-3 h-3 text-white/70 shrink-0" />
                        <span className="text-xs font-medium truncate text-white/90">{post.songName}</span>
                      </div>
                      <span className="text-[10px] text-white/60 truncate">Original Audio</span>
                    </div>
                  </div>
                  
                  {/* Audio Waveform */}
                  <div className="flex items-center gap-0.5 h-4 px-2 shrink-0">
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={isPlayingAudio ? { height: ["20%", "100%", "20%"] } : { height: "20%" }}
                        transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, delay: Math.random() * 0.5 }}
                        className="w-0.5 bg-white/80 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Post Actions & Caption */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-6">
            {/* Resonate Button */}
            <div className="relative">
              <button 
                onClick={handleResonate}
                className={cn(
                  "flex items-center gap-2 transition-colors group relative z-10",
                  hasResonated ? "text-indigo-500" : "text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400"
                )}
              >
                <div className="relative">
                  <Zap className={cn("w-6 h-6 transition-transform", hasResonated && "fill-indigo-500 scale-110")} />
                  {isResonating && (
                    <>
                      <motion.div 
                        initial={{ scale: 1, opacity: 0.8 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="absolute inset-0 bg-indigo-400 rounded-full"
                      />
                      {[...Array(6)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                          animate={{ 
                            scale: [0, 1, 0],
                            x: Math.cos(i * 60 * Math.PI / 180) * 40,
                            y: Math.sin(i * 60 * Math.PI / 180) * 40,
                            opacity: 0
                          }}
                          transition={{ duration: 0.6, ease: "easeOut" }}
                          className="absolute top-1/2 left-1/2 w-2 h-2 bg-indigo-500 rounded-full -ml-1 -mt-1 pointer-events-none"
                        />
                      ))}
                    </>
                  )}
                </div>
                <span className="text-sm font-medium">{resonance >= 1000 ? `${(resonance / 1000).toFixed(1)}k` : resonance}</span>
              </button>
            </div>

            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors group">
              <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-sm font-medium">{post.commentCount + (commentsList.length - post.commentsList.length)}</span>
            </button>
            
            <div className="relative">
              <button 
                onClick={handleShare}
                className={cn(
                  "transition-colors group hover:text-emerald-400",
                  isShared ? "text-emerald-400" : "text-slate-400"
                )}
              >
                <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>
              <AnimatePresence>
                {isShared && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: -40, scale: 1 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="absolute -top-4 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-md whitespace-nowrap shadow-lg pointer-events-none"
                  >
                    Copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className={cn(
              "transition-colors group hover:text-amber-400",
              isSaved ? "text-amber-400" : "text-slate-400"
            )}
          >
            <Bookmark className={cn("w-6 h-6 group-hover:scale-110 transition-transform", isSaved && "fill-current")} />
          </button>
        </div>
        
        {post.type !== 'text' && (
          <p className="text-sm leading-relaxed mt-3">
            <span className="font-bold mr-2">{post.author}</span>
            {post.content}
          </p>
        )}

        {/* Comments Section */}
        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-slate-800"
            >
              <div className="flex flex-col gap-2">
                {commentsList.map(comment => (
                  <CommentItem key={comment.id} comment={comment} />
                ))}
              </div>
              
              {/* Add Comment Input */}
              <div className="mt-4 flex items-center gap-3">
                <img src={`https://picsum.photos/seed/currentuser/100/100`} alt="You" className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
                    placeholder="Add a comment..." 
                    className="w-full bg-slate-800/80 rounded-full py-2 pl-4 pr-16 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all border border-slate-700"
                  />
                  <button 
                    onClick={handlePostComment}
                    disabled={!commentText.trim()}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-indigo-300 font-bold text-sm px-3 py-1.5 bg-indigo-500/10 rounded-full transition-colors"
                  >
                    Post
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}

const StoryViewer: React.FC<{
  stories: UserStory[];
  initialUserIndex: number;
  onClose: () => void;
}> = ({ stories, initialUserIndex, onClose }) => {
  const [userIndex, setUserIndex] = useState(initialUserIndex);
  const [itemIndex, setItemIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const currentUser = stories[userIndex];
  const currentItem = currentUser.items[itemIndex];

  const handleNext = useCallback(() => {
    if (itemIndex < currentUser.items.length - 1) {
      setItemIndex(prev => prev + 1);
      setProgress(0);
    } else if (userIndex < stories.length - 1) {
      setUserIndex(prev => prev + 1);
      setItemIndex(0);
      setProgress(0);
    } else {
      onClose();
    }
  }, [itemIndex, userIndex, currentUser.items.length, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    if (itemIndex > 0) {
      setItemIndex(prev => prev - 1);
      setProgress(0);
    } else if (userIndex > 0) {
      setUserIndex(prev => prev - 1);
      setItemIndex(stories[userIndex - 1].items.length - 1);
      setProgress(0);
    }
  }, [itemIndex, userIndex, stories]);

  useEffect(() => {
    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + step >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [userIndex, itemIndex, handleNext]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="absolute inset-0 z-10 flex">
        <div className="w-1/3 h-full cursor-pointer" onClick={handlePrev} />
        <div className="w-2/3 h-full cursor-pointer" onClick={handleNext} />
      </div>
      
      <div className="relative w-full max-w-md h-full sm:h-[90vh] sm:rounded-3xl overflow-hidden bg-slate-900">
        {/* Progress Bars */}
        <div className="absolute top-0 inset-x-0 z-20 flex gap-1 p-4 bg-gradient-to-b from-black/60 to-transparent">
          {currentUser.items.map((item, idx) => (
            <div key={item.id} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-50 ease-linear"
                style={{ 
                  width: idx === itemIndex ? `${progress}%` : idx < itemIndex ? '100%' : '0%' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-6 inset-x-0 z-20 px-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-3">
            <img src={currentUser.avatar} alt={currentUser.author} className="w-8 h-8 rounded-full border border-white/50" />
            <div>
              <p className="text-white font-semibold text-sm drop-shadow-md">{currentUser.author}</p>
              <p className="text-white/80 text-xs drop-shadow-md">{currentItem.timestamp}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-white hover:bg-white/20 rounded-full transition-colors relative z-30 pointer-events-auto">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Media */}
        <img 
          key={currentItem.id}
          src={currentItem.mediaUrl} 
          alt="Story" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export function Home() {
  const [postType, setPostType] = useState<string>('all');
  const [isCinematic, setIsCinematic] = useState(false);
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  
  // Infinite scroll state
  const [displayedPosts, setDisplayedPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const postsPerPage = 10;
  const loaderRef = useRef<HTMLDivElement>(null);

  // Filter posts by type
  const filteredPosts = React.useMemo(() => {
    if (postType === 'all') return ALL_POSTS;
    return ALL_POSTS.filter(post => post.type === postType);
  }, [postType]);

  // Reset page when postType changes
  useEffect(() => {
    setPage(1);
    setDisplayedPosts(filteredPosts.slice(0, postsPerPage));
  }, [postType, filteredPosts]);

  // Load more posts
  const loadMore = useCallback(() => {
    const nextPosts = filteredPosts.slice(0, (page + 1) * postsPerPage);
    setDisplayedPosts(nextPosts);
    setPage(prev => prev + 1);
  }, [page, filteredPosts]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedPosts.length < filteredPosts.length) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loadMore, displayedPosts.length, filteredPosts.length]);

  return (
    <div className="max-w-2xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Type Selector */}
      <div className="sticky top-[57px] z-30 bg-white/40 dark:bg-slate-950/40 backdrop-blur-2xl backdrop-saturate-150 pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 border-b border-white/30 dark:border-slate-800/50 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Your Feed</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCinematic(!isCinematic)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                isCinematic
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                  : "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20"
              )}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Cinematic</span>
            </button>
            <div className="relative group">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-md group-hover:bg-indigo-500/40 transition-colors" />
              <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/50 dark:bg-slate-900/50 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                <span>AI Curated</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {POST_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setPostType(t.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-2xl font-medium transition-all whitespace-nowrap backdrop-blur-md border",
                postType === t.id 
                  ? "bg-white/80 dark:bg-white/90 text-slate-900 shadow-lg scale-105 border-white/50" 
                  : "bg-white/40 text-slate-600 dark:bg-slate-800/40 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60 border-white/30 dark:border-slate-700/30"
              )}
            >
              <span className="text-slate-500 dark:text-slate-400">{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className={cn("space-y-8 transition-all duration-1000", isCinematic && "bg-black/80 -mx-4 px-4 py-8 rounded-3xl backdrop-blur-2xl")}>
        
        {/* Stories Bar */}
        {!isCinematic && (
          <div className="flex gap-4 overflow-x-auto pb-4 pt-2 px-2 -mx-2 scrollbar-hide snap-x">
            {ALL_STORIES.map((story, idx) => (
              <div 
                key={story.id} 
                className="flex flex-col items-center gap-2 cursor-pointer shrink-0 snap-start"
                onClick={() => setActiveStoryIndex(idx)}
              >
                <div className={cn(
                  "relative p-[3px] rounded-full transition-transform hover:scale-105",
                  story.hasUnviewed ? "bg-gradient-to-tr from-amber-400 via-rose-500 to-fuchsia-600" : "bg-slate-200 dark:bg-slate-700",
                  story.isCurrentUser && !story.hasUnviewed && "bg-transparent"
                )}>
                  <div className="bg-white dark:bg-slate-950 p-[2px] rounded-full">
                    <img src={story.avatar} alt={story.author} className="w-16 h-16 rounded-full object-cover" />
                  </div>
                  {story.isCurrentUser && (
                    <div className="absolute bottom-0 right-0 bg-indigo-500 text-white rounded-full p-1 border-2 border-white dark:border-slate-950">
                      <Plus className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate w-16 text-center">
                  {story.author}
                </span>
              </div>
            ))}
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {displayedPosts.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              isCinematic={isCinematic} 
              onInView={setActivePostId} 
            />
          ))}
        </AnimatePresence>
        
        {/* Infinite Scroll Loader */}
        {displayedPosts.length < filteredPosts.length && (
          <div ref={loaderRef} className="py-8 flex justify-center">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              <span className="text-sm font-medium">Curating more posts...</span>
            </div>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            <p className="text-lg">No posts found for this type right now.</p>
            <p className="text-sm mt-2">Try changing your filter or check back later.</p>
          </div>
        )}

        {displayedPosts.length > 0 && displayedPosts.length === filteredPosts.length && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <p className="font-medium">You're all caught up!</p>
            <p className="text-sm mt-1">Take a break or switch your filter to see different content.</p>
          </div>
        )}
      </div>

      {/* Story Viewer Modal */}
      <AnimatePresence>
        {activeStoryIndex !== null && (
          <StoryViewer 
            stories={ALL_STORIES} 
            initialUserIndex={activeStoryIndex} 
            onClose={() => setActiveStoryIndex(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

