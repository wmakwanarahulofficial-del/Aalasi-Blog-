import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Image, Video, FileText, Search, Trash2, Copy, Check, Upload, ArrowUpRight, X, Eye } from 'lucide-react';

interface MediaItem {
  id: number;
  name: string;
  url: string;
  type: 'image' | 'video' | 'other';
  size: string;
  dimensions?: string;
  uploaded_at: string;
}

export function AdminMedia() {
  const [items, setItems] = useState<MediaItem[]>([
    {
      id: 1,
      name: "Future AI Cover Technology",
      url: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
      type: 'image',
      size: "245 KB",
      dimensions: "1200 x 800",
      uploaded_at: "May 22, 2026"
    },
    {
      id: 2,
      name: "Global Markets Stock Record",
      url: "https://images.unsplash.com/photo-1590283603385-18ff385984c9?auto=format&fit=crop&w=1200&q=80",
      type: 'image',
      size: "180 KB",
      dimensions: "1200 x 780",
      uploaded_at: "May 21, 2026"
    },
    {
      id: 3,
      name: "Social Media Platform Algorithms",
      url: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
      type: 'image',
      size: "310 KB",
      dimensions: "1200 x 920",
      uploaded_at: "May 19, 2026"
    },
    {
      id: 4,
      name: "Creative Economy Creator Hub",
      url: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=1200&q=80",
      type: 'image',
      size: "145 KB",
      dimensions: "1200 x 850",
      uploaded_at: "May 15, 2026"
    }
  ]);

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<MediaItem | null>(null);

  // File Upload Handlers (Simulating drag & drop upload)
  const handleUploadedFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const isVideo = file.type.startsWith('video');
      const newMedia: MediaItem = {
        id: Date.now(),
        name: file.name.split('.')[0],
        url: reader.result as string,
        type: isVideo ? 'video' : 'image',
        size: `${Math.round(file.size / 1024)} KB`,
        dimensions: isVideo ? undefined : "1920 x 1080",
        uploaded_at: new Date().toLocaleDateString()
      };
      setItems([newMedia, ...items]);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyLink = (item: MediaItem, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this asset?")) {
      setItems(items.filter(item => item.id !== id));
      if (selectedAsset?.id === id) {
        setSelectedAsset(null);
      }
    }
  };

  const filtered = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4 bg-[#0B0F19] p-6 rounded-2xl border border-[#1E2536]">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Visual Assets & Media</h1>
          <p className="text-xs text-gray-400">Upload, keep secure, and manage media files used in articles and cover posts.</p>
        </div>

        {/* Upload Button */}
        <div className="relative">
          <label className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-lg hover:shadow-indigo-600/20 shadow-indigo-600/10">
            <Upload className="w-4 h-4" /> Upload New Asset
            <input type="file" onChange={handleUploadedFiles} className="hidden" accept="image/*,video/*" />
          </label>
        </div>
      </div>

      {/* Toolbar Filter */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search assets by file name..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0F19] border border-[#1E2536] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-600 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'image', 'video'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-2 border rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                filterType === type 
                  ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/10' 
                  : 'bg-[#0B0F19] border-[#1E2536] text-gray-400 hover:border-gray-700'
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedAsset(item)}
            className="group bg-[#0B0F19] border border-[#1E2536] rounded-2xl overflow-hidden hover:border-indigo-500/50 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="relative h-40 bg-gray-950 overflow-hidden flex items-center justify-center">
              {item.type === 'video' ? (
                <div className="w-full h-full relative">
                  <video src={item.url} className="w-full h-full object-cover opacity-60" muted />
                  <Video className="absolute inset-0 m-auto w-10 h-10 text-white/80" />
                </div>
              ) : (
                <img src={item.url} className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" alt="" />
              )}
              
              {/* Cover Indicator menu */}
              <div className="absolute top-2.5 right-2.5 flex gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[9px] text-gray-400 font-bold uppercase tracking-widest font-mono">
                {item.size}
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="text-white font-bold text-xs uppercase tracking-tight truncate">{item.name}</div>
              <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>{item.uploaded_at}</span>
                <span>{item.dimensions || 'VIDEO'}</span>
              </div>
            </div>

            <div className="p-4 pt-0 flex gap-2 border-t border-[#1E2536]/30 mt-1">
              <button 
                onClick={(e) => handleCopyLink(item, e)}
                className="flex-1 py-1.5 bg-[#1E2536] hover:bg-indigo-600 text-gray-300 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors border border-[#1E2536]"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Link
                  </>
                )}
              </button>
              <button 
                onClick={(e) => handleDelete(item.id, e)}
                className="p-1.5 bg-[#1E2536] hover:bg-red-500/10 text-gray-500 hover:text-red-400 rounded-lg transition-colors border border-[#1E2536]"
                title="Delete Media"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Detailed Asset Information Modal Drawer */}
      <AnimatePresence>
        {selectedAsset && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[110]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-3xl w-full max-w-lg shadow-2xl relative"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Image className="w-4 h-4 text-indigo-400" /> Asset View & Metadata
                </h2>
                <button onClick={() => setSelectedAsset(null)} className="p-1 text-gray-400 hover:text-white rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl overflow-hidden border border-[#1E2536] bg-gray-950 aspect-video flex items-center justify-center">
                  {selectedAsset.type === 'video' ? (
                    <video src={selectedAsset.url} controls className="w-full max-h-56" />
                  ) : (
                    <img src={selectedAsset.url} className="w-full max-h-56 object-contain" alt="" />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 bg-[#111624] p-4 rounded-2xl border border-[#1E2536]">
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-black">File Name</div>
                    <div className="text-xs font-bold text-white mt-0.5 truncate">{selectedAsset.name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-black">Dimensions</div>
                    <div className="text-xs font-bold text-indigo-400 mt-0.5">{selectedAsset.dimensions || 'Video asset (N/A)'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-black">File Weight</div>
                    <div className="text-xs font-bold text-white mt-0.5">{selectedAsset.size}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-500 uppercase font-black">Uploaded on</div>
                    <div className="text-xs font-bold text-white mt-0.5">{selectedAsset.uploaded_at}</div>
                  </div>
                  <div className="col-span-2">
                    <div className="text-[10px] text-gray-500 uppercase font-black">CDN Reference URL</div>
                    <div className="text-xs font-mono text-gray-400 mt-1 select-all break-all bg-[#0B0F19] p-2 rounded-lg border border-[#1E2536]">{selectedAsset.url}</div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    onClick={(e) => {
                      navigator.clipboard.writeText(selectedAsset.url);
                      alert("Asset URL copied successfully!");
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" /> Copy Path
                  </button>
                  <button 
                    onClick={() => setSelectedAsset(null)}
                    className="px-4 py-2 bg-[#1E2536] hover:bg-[#252E42] text-gray-300 text-xs font-bold uppercase tracking-wider rounded-xl"
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
