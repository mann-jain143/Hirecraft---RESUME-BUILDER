import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ThumbsUp, User, Clock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import API from '../utils/api';
import Navbar from '../components/Navbar';
import PremiumAnimatedBackground from '../components/layout/PremiumAnimatedBackground';

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '', category: 'General' });
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data } = await API.get('/community/posts');
      setPosts(data);
    } catch (err) {
      toast.error('Failed to load posts');
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    setIsPosting(true);
    try {
      const { data } = await API.post('/community/posts', newPost);
      setPosts([data, ...posts]); // optimistic prepend
      setNewPost({ title: '', content: '', category: 'General' });
      toast.success('Post created!');
      fetchPosts(); // refresh to get populated user
    } catch (err) {
      toast.error('Failed to post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await API.put(`/community/posts/${id}/upvote`);
      fetchPosts(); // Simple refresh for upvote count
    } catch (err) {
      toast.error('Failed to upvote');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050816] text-slate-900 dark:text-white relative transition-colors duration-300">
      <PremiumAnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow max-w-5xl w-full mx-auto px-4 py-10 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500">
                <MessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black font-display tracking-tight">Career Community</h1>
                <p className="text-slate-500">Ask questions, share experiences, and get advice.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Post Feed */}
            <div className="lg:col-span-2 space-y-6">
              {posts.map(post => (
                <div key={post._id} className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl shadow-sm hover:shadow-lg transition">
                  <div className="flex items-start gap-4">
                    <button onClick={() => handleUpvote(post._id)} className="flex flex-col items-center gap-1 text-slate-400 hover:text-orange-500 p-2 bg-slate-100 dark:bg-white/5 rounded-xl transition">
                      <ThumbsUp className="w-5 h-5" />
                      <span className="text-xs font-bold">{post.upvotes?.length || 0}</span>
                    </button>
                    
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-slate-200 dark:bg-white/10 rounded-md text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">{post.category}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(post.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 whitespace-pre-wrap">{post.content}</p>
                      
                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 pt-4">
                        <div className="flex items-center gap-2 text-sm font-semibold">
                          <div className="w-6 h-6 bg-brand-500 rounded-full flex items-center justify-center text-white text-xs">{post.user?.name?.[0] || 'U'}</div>
                          <span>{post.user?.name || 'Anonymous'}</span>
                        </div>
                        <button className="text-brand-500 font-bold text-sm flex items-center gap-1 hover:text-brand-600">
                          Reply <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <div className="text-center py-20 text-slate-500">No posts yet. Be the first to start a discussion!</div>}
            </div>

            {/* Create Post Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white/70 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-3xl p-6 backdrop-blur-xl sticky top-24 shadow-xl">
                <h3 className="text-lg font-bold mb-4">Start a Discussion</h3>
                <form onSubmit={handlePost} className="space-y-4">
                  <div>
                    <select value={newPost.category} onChange={e => setNewPost({...newPost, category: e.target.value})} className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none text-sm font-semibold">
                      <option value="General">General</option>
                      <option value="Interview Prep">Interview Prep</option>
                      <option value="Resume Review">Resume Review</option>
                      <option value="Career Advice">Career Advice</option>
                    </select>
                  </div>
                  <div>
                    <input 
                      required
                      type="text" 
                      placeholder="Post Title" 
                      value={newPost.title} 
                      onChange={e => setNewPost({...newPost, title: e.target.value})} 
                      className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <textarea 
                      required
                      placeholder="What's on your mind?" 
                      rows={5}
                      value={newPost.content} 
                      onChange={e => setNewPost({...newPost, content: e.target.value})} 
                      className="w-full bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 outline-none text-sm resize-none"
                    />
                  </div>
                  <button type="submit" disabled={isPosting} className="btn-primary w-full py-3">
                    {isPosting ? 'Posting...' : 'Post'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
