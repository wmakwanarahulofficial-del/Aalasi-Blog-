import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Grid, List as ListIcon, Edit, Trash2, Eye, TrendingUp, Star, X, Calendar, Clock, Heart } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ContentRenderer } from './ContentRenderer';

interface AdminAllBlogsProps {
  blogs: any[];
  onEdit: (blog: any) => void;
  onDelete: (id: string | number) => void;
}

export function AdminAllBlogs({ blogs, onEdit, onDelete }: AdminAllBlogsProps) {
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [previewBlog, setPreviewBlog] = useState<any | null>(null);

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || b.category_slug === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-2">Content Management</h1>
          <p className="text-gray-400 text-sm">Managing {blogs.length} articles across all categories. Click any row or item to preview.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search articles..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-[#0B0F19] border border-[#1E2536] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 w-full md:w-64"
            />
          </div>
          <div className="flex items-center bg-[#0B0F19] border border-[#1E2536] rounded-xl p-1">
            <button 
              onClick={() => setView('grid')}
              className={`p-1.5 rounded-lg transition-all ${view === 'grid' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={`p-1.5 rounded-lg transition-all ${view === 'list' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white'}`}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        {['all', 'trending', 'social-media', 'news', 'creators', 'trading-finance', 'technology'].map((cat) => (
          <button 
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              category === cat 
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                : 'bg-[#131927] border-[#1E2536] text-gray-400 hover:border-gray-600'
            }`}
          >
            {cat.toUpperCase().replace('-', ' ')}
          </button>
        ))}
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBlogs.map((blog) => (
            <motion.div 
               layout
               key={blog.id} 
               className="group bg-[#0B0F19] rounded-2xl border border-[#1E2536] overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden cursor-pointer" onClick={() => setPreviewBlog(blog)}>
                  {blog.featured_image ? (
                    <img src={blog.featured_image} alt="" className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <Icons.FileText className="w-8 h-8 text-gray-800" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider">
                      {blog.category_slug}
                    </span>
                    {blog.featured && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                     <span className="text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                       <Eye className="w-4 h-4" /> Quick Preview
                     </span>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                   <div className={`text-[10px] font-bold uppercase tracking-widest ${blog.status === 'published' ? 'text-emerald-400' : 'text-orange-400'}`}>
                     • {blog.status}
                   </div>
                   <h3 
                     onClick={() => setPreviewBlog(blog)}
                     className="text-white font-bold text-sm line-clamp-2 leading-tight h-10 group-hover:text-indigo-400 transition-colors uppercase tracking-tight cursor-pointer"
                   >
                     {blog.title}
                   </h3>
                </div>
              </div>
              <div className="p-4 pt-0 space-y-3">
                 <div className="flex items-center justify-between pt-2 border-t border-[#1E2536]">
                    <div className="flex items-center gap-1 text-gray-500">
                       <Eye className="w-3 h-3" />
                       <span className="text-[10px] font-mono">{blog.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                       <TrendingUp className="w-3 h-3" />
                       <span className="text-[10px] font-mono">{blog.likes || 0} likes</span>
                    </div>
                 </div>
                 
                 <div className="flex gap-2 w-full pt-1">
                    <button onClick={() => onEdit(blog)} className="flex-1 py-1.5 bg-[#1E2536] hover:bg-indigo-600 hover:text-white text-gray-300 font-bold text-xs rounded-lg transition-colors">Edit</button>
                    <button 
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this article?")) {
                          onDelete(blog.id);
                        }
                      }}
                      className="flex-1 py-1.5 bg-red-650/20 text-red-400 hover:bg-red-600 hover:text-white font-bold text-xs rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-[#0B0F19] rounded-2xl border border-[#1E2536] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#111624] text-[10px] uppercase font-bold text-gray-500 tracking-[0.2em]">
              <tr>
                <th className="px-6 py-4">Article Details</th>
                <th className="px-6 py-4">Status & Category</th>
                <th className="px-6 py-4">Performance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2536]">
              {filteredBlogs.map((blog) => (
                <tr key={blog.id} className="group hover:bg-[#1E2536]/20 transition-colors">
                  <td className="px-6 py-4 max-w-sm">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => setPreviewBlog(blog)}>
                      {blog.featured_image ? (
                        <img src={blog.featured_image} className="w-12 h-12 rounded-lg object-cover bg-gray-900 flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-900 flex items-center justify-center flex-shrink-0">
                          <Icons.FileText className="w-4 h-4 text-gray-800" />
                        </div>
                      )}
                      <div className="truncate">
                        <div className="text-white font-bold text-sm uppercase tracking-tight truncate group-hover:text-indigo-400 transition-colors">{blog.title}</div>
                        <div className="text-[10px] text-gray-500 mt-1 uppercase font-mono">Updated {new Date(blog.created_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex flex-col gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase w-fit ${blog.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'}`}>
                           {blog.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{blog.category_slug}</span>
                     </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-xs font-mono text-white">{blog.views || 0}</div>
                        <div className="text-[9px] uppercase text-gray-500 font-bold">Views</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-mono text-indigo-400">{blog.likes || 0}</div>
                        <div className="text-[9px] uppercase text-gray-500 font-bold">Likes</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button onClick={() => setPreviewBlog(blog)} className="p-2 text-gray-400 hover:text-white hover:bg-[#1E2536] rounded-lg transition-all" title="View Article"><Eye className="w-4 h-4" /></button>
                       <button onClick={() => onEdit(blog)} className="p-2 text-gray-400 hover:text-white hover:bg-indigo-600 rounded-lg transition-all" title="Edit Article"><Edit className="w-4 h-4" /></button>
                       <button 
                         onClick={() => {
                           if (window.confirm("Are you sure you want to delete this article?")) {
                             onDelete(blog.id);
                           }
                         }} 
                         className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" 
                         title="Delete Article"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Side-Drawer Slide-Over Preview Panel */}
      <AnimatePresence>
        {previewBlog && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-end z-[100]" onClick={() => setPreviewBlog(null)}>
            <motion.div 
               initial={{ x: '100%' }} 
               animate={{ x: 0 }} 
               exit={{ x: '100%' }} 
               transition={{ type: 'spring', damping: 25, stiffness: 220 }}
               className="w-full max-w-2xl bg-[#090D16] h-full border-l border-[#1E2536] flex flex-col shadow-2xl relative"
               onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#1E2536] flex items-center justify-between bg-[#0B0F19]">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-indigo-600/10 text-indigo-400 rounded-md text-[10px] font-black uppercase tracking-wider">
                    {previewBlog.category_slug}
                  </span>
                  <span className="text-gray-500 text-xs font-mono">• Article Detail View</span>
                </div>
                <button 
                  onClick={() => setPreviewBlog(null)}
                  className="p-1.5 text-gray-400 hover:text-white hover:bg-[#1E2536] rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black text-white leading-tight uppercase tracking-tight">
                    {previewBlog.title}
                  </h1>
                  <p className="text-xs text-gray-500 mt-2 font-medium flex items-center gap-4">
                    <span>by Aalasi Team</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(previewBlog.created_at).toDateString()}</span>
                  </p>
                </div>

                {previewBlog.featured_image && (
                  <div className="rounded-2xl overflow-hidden border border-[#1E2536] bg-gray-950">
                    <img src={previewBlog.featured_image} className="w-full h-64 object-cover" alt="" />
                  </div>
                )}

                {previewBlog.excerpt && (
                  <div className="bg-[#111624] p-4 rounded-xl border border-l-4 border-indigo-500 border-l-indigo-500 text-gray-300 text-xs italic leading-relaxed">
                    "{previewBlog.excerpt}"
                  </div>
                )}

                <div className="pt-4 border-t border-[#1E2536] text-sm text-gray-300 leading-relaxed space-y-4">
                  {previewBlog.content ? (
                    <ContentRenderer content={previewBlog.content} />
                  ) : (
                    <span className="text-gray-500 italic">No structure blocks inside content.</span>
                  )}
                </div>
              </div>

              {/* Footer Panel */}
              <div className="p-6 border-t border-[#1E2536] bg-[#0B0F19] flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-sm font-bold text-white font-mono">{previewBlog.views || 0}</div>
                    <div className="text-[9px] text-gray-500 uppercase font-black">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-indigo-400 font-mono">{previewBlog.likes || 0}</div>
                    <div className="text-[9px] text-gray-500 uppercase font-black">Likes</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      setPreviewBlog(null);
                      onEdit(previewBlog);
                    }}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/10 flex items-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5" /> Edit Content
                  </button>
                  <button 
                    onClick={() => setPreviewBlog(null)}
                    className="px-4 py-2 bg-[#1E2536] hover:bg-[#252E42] text-gray-300 text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
