import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, BookOpen } from 'lucide-react';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useLanguage } from '../context/AppContext';

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([]);
  const { t, lang } = useLanguage();

  useEffect(() => {
    const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 px-6 sm:px-12 max-w-7xl mx-auto relative z-10">
      <div className="mb-12">
        <h2 
          className="text-4xl md:text-5xl font-black uppercase tracking-tight glitch-effect inline-block"
          data-text={lang === 'EN' ? 'THE_GRID_CHRONICLES' : 'গ্রিড_ক্রনিকলস'}
        >
          {lang === 'EN' ? 'THE_GRID_CHRONICLES' : 'গ্রিড_ক্রনিকলস'}
        </h2>
        <div className="h-1 w-24 bg-[#00f3ff] mt-4" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="group glass-card overflow-hidden flex flex-col h-full border-t border-white/5 hover:border-[#ff00ff]/30 transition-all cursor-pointer"
          >
            <div className="h-48 overflow-hidden relative">
               <img 
                 src={post.image || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'} 
                 alt={post.title} 
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                 loading="lazy"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
               <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10 text-[10px] font-mono tracking-widest text-[#ff00ff]">
                 ENCRYPTED_LOG
               </div>
            </div>

            <div className="p-6 flex flex-col flex-1">
               <div className="flex items-center gap-2 text-[10px] font-mono text-white/40 mb-4 tracking-widest uppercase">
                 <Calendar size={12} />
                 {new Date(post.createdAt?.toDate?.() || post.createdAt).toLocaleDateString()}
               </div>
               <h3 className="text-xl font-bold font-mono mb-4 text-[#00f3ff] group-hover:text-white transition-colors">{post.title}</h3>
               <p className="text-white/60 text-sm font-mono leading-relaxed line-clamp-3 mb-6 italic">
                 {post.content}
               </p>
               <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                 <span className="text-[10px] font-mono flex items-center gap-2 group-hover:text-[#ff00ff] transition-colors uppercase tracking-[0.2em]">
                   <BookOpen size={12} /> READ_ARCHIVE
                 </span>
                 <ArrowRight size={16} className="text-white/20 group-hover:text-[#ff00ff] group-hover:translate-x-2 transition-all" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
