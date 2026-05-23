import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LayoutDashboard, Plus, Edit, Trash2, Globe, TrendingUp, Cpu, Share2, PenTool, PieChart, Tag, Image, X } from 'lucide-react';

interface Segment {
  id: number;
  slug: string;
  title: string;
  description: string;
  icon: string;
  banner_image: string;
  seo_title?: string;
  seo_description?: string;
  articleCount?: number;
}

interface AdminCategoriesProps {
  categories: Segment[];
  onUpdateCategories: (newCats: Segment[]) => void;
}

export function AdminCategories({ categories, onUpdateCategories }: AdminCategoriesProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingCat, setEditingCat] = useState<Segment | null>(null);
  
  // Form fields
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('tag');
  const [banner, setBanner] = useState('https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !slug) return;
    
    const newSegment: Segment = {
      id: Math.max(...categories.map(c => c.id), 0) + 1,
      slug: slug.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      description,
      icon,
      banner_image: banner,
      articleCount: 0
    };
    
    onUpdateCategories([...categories, newSegment]);
    resetForm();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;

    const updated = categories.map(c => c.id === editingCat.id ? { ...editingCat } : c);
    onUpdateCategories(updated);
    setEditingCat(null);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this segment? Articles under this segment will lose their category tag.")) {
      onUpdateCategories(categories.filter(c => c.id !== id));
    }
  };

  const resetForm = () => {
    setSlug('');
    setTitle('');
    setDescription('');
    setIcon('tag');
    setIsAdding(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center bg-[#0B0F19] p-6 rounded-2xl border border-[#1E2536]">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Segments & Categories</h1>
          <p className="text-xs text-gray-400">Add, organize, and manage website categories and topical segments.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/10"
        >
          <Plus className="w-4 h-4" /> Add Segment
        </button>
      </div>

      {/* Adding Form Grid */}
      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-[#111624] p-6 rounded-2xl border border-[#1E2536] space-y-4"
          >
            <h2 className="text-sm font-black text-white uppercase tracking-wider">Create New Segment</h2>
            <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Segment Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={e => {
                    setTitle(e.target.value);
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  className="w-full bg-[#0B0F19] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  placeholder="e.g. Artificial Intelligence"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Slug (URL Name)</label>
                <input 
                  type="text" 
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  placeholder="e.g. artificial-intelligence"
                  required
                />
              </div>
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Short Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none h-20 resize-none"
                  placeholder="A brief segment details..."
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Display Icon Preset</label>
                <select 
                  value={icon}
                  onChange={e => setIcon(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                >
                  <option value="tag">🏷️ Tag</option>
                  <option value="trending-up">📈 Trending Up</option>
                  <option value="share-2">📱 Social Media</option>
                  <option value="globe">🌐 Globe / News</option>
                  <option value="pen-tool">✍️ Pen / Creative</option>
                  <option value="pie-chart">📊 Pie Chart</option>
                  <option value="cpu">💻 CPU / Technology</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Banner Background URL</label>
                <input 
                  type="text" 
                  value={banner}
                  onChange={e => setBanner(e.target.value)}
                  className="w-full bg-[#0B0F19] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  placeholder="Image URL..."
                />
              </div>
              <div className="col-span-2 flex justify-end gap-2 pt-2 border-t border-[#1E2536]/20">
                <button type="button" onClick={resetForm} className="px-4 py-2 bg-transparent text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg">Create Category</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Displaying Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="group bg-[#0B0F19] border border-[#1E2536] rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all shadow-md relative flex flex-col justify-between">
            <div>
              <div className="h-28 relative bg-gray-950 overflow-hidden">
                <img src={cat.banner_image || banner} className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform" />
                <div className="absolute top-4 left-4 p-3 bg-[#0B0F19] text-indigo-400 rounded-xl border border-[#1E2536] shadow-md uppercase font-black text-xs font-mono">
                  {cat.icon || 'tag'}
                </div>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="text-white font-bold text-base flex items-center gap-2">
                  {cat.title}
                  <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md font-mono font-bold lowercase">
                    /{cat.slug}
                  </span>
                </h3>
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{cat.description || 'No description provided.'}</p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-[#1E2536]/40 flex items-center justify-between mt-4">
              <div className="text-[10px] font-mono text-gray-500 uppercase font-black">
                {cat.articleCount || 0} Articles
              </div>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setEditingCat(cat)}
                  className="p-1.5 bg-[#1E2536] text-gray-400 hover:text-white rounded-lg transition-colors border border-[#1E2536]"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 bg-[#1E2536] text-gray-400 hover:text-red-400 rounded-lg transition-colors border border-[#1E2536]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editing Modal Popup */}
      <AnimatePresence>
        {editingCat && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-2xl w-full max-w-md shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Tag className="w-4 h-4 text-indigo-400" /> Edit Segment Details
                </h2>
                <button onClick={() => setEditingCat(null)} className="p-1 text-gray-400 hover:text-white rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Segment Title</label>
                  <input 
                    type="text" 
                    value={editingCat.title} 
                    onChange={e => setEditingCat({ ...editingCat, title: e.target.value })}
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Description</label>
                  <textarea 
                    value={editingCat.description}
                    onChange={e => setEditingCat({ ...editingCat, description: e.target.value })}
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none h-20 resize-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-400">Banner Background URL</label>
                  <input 
                    type="text" 
                    value={editingCat.banner_image} 
                    onChange={e => setEditingCat({ ...editingCat, banner_image: e.target.value })}
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-[#1E2536]/20">
                  <button type="button" onClick={() => setEditingCat(null)} className="px-4 py-2 bg-transparent text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-lg">Save Changes</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
