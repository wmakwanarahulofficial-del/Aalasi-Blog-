import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Search, RefreshCw, Layers, CheckCircle, Smartphone, Sliders, AlertTriangle } from 'lucide-react';

export function AdminSEO() {
  const [globalTitle, setGlobalTitle] = useState('Aalasi Blog | Chill Articles about Tech & Trading');
  const [globalDesc, setGlobalDesc] = useState('Read relaxed and thoughtful deep dives into social media algorithms, technology news, financial analysis, and creator economies.');
  const [indexation, setIndexation] = useState(true);
  const [keywords, setKeywords] = useState<string[]>(["aalasi", "tech tips", "trading strategies", "creator economy", "social media algorithm"]);
  const [newKeyword, setNewKeyword] = useState('');
  const [generatingSitemap, setGeneratingSitemap] = useState(false);
  const [sitemapSucceeded, setSitemapSucceeded] = useState(false);

  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim().toLowerCase())) {
      setKeywords([...keywords, newKeyword.trim().toLowerCase()]);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setKeywords(keywords.filter(k => k !== kw));
  };

  const generateSitemap = () => {
    setGeneratingSitemap(true);
    setTimeout(() => {
      setGeneratingSitemap(false);
      setSitemapSucceeded(true);
      setTimeout(() => setSitemapSucceeded(false), 4000);
    }, 2000);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center bg-[#0B0F19] p-6 rounded-2xl border border-[#1E2536]">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">SEO Engine</h1>
          <p className="text-xs text-gray-400">Control indexing headers, search keywords, meta descriptions, and automate XML sitemaps creation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Keywords and metadata details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2"><Search className="w-4 h-4" /> Global Meta Tags</h2>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Fallback Title Template</label>
                <input 
                  type="text" 
                  value={globalTitle} 
                  onChange={e => setGlobalTitle(e.target.value)}
                  className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Fallback Description Template</label>
                <textarea 
                  value={globalDesc} 
                  onChange={e => setGlobalDesc(e.target.value)}
                  className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none h-24 resize-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2"><Target className="w-4 h-4" /> Focus Keywords Tracker</h2>
            
            <form onSubmit={handleAddKeyword} className="flex gap-2">
              <input 
                type="text" 
                value={newKeyword} 
                onChange={e => setNewKeyword(e.target.value)}
                placeholder="Insert focus keyword..." 
                className="flex-1 bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2 text-xs text-white focus:border-indigo-500 outline-none"
              />
              <button type="submit" className="px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold uppercase rounded-xl tracking-wider hover:bg-indigo-700 transition-colors">Add</button>
            </form>

            <div className="flex flex-wrap gap-2 pt-2">
              {keywords.map(kw => (
                <span key={kw} className="flex items-center gap-2 text-xs font-bold font-mono py-1 rounded-lg px-2.5 bg-indigo-950/40 text-indigo-300 border border-indigo-505/10 bg-opacity-80">
                  #{kw}
                  <button type="button" onClick={() => handleRemoveKeyword(kw)} className="text-gray-500 hover:text-red-400 transition-colors font-bold text-[11px] font-sans">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Indexation sitemaps column */}
        <div className="space-y-6">
          <div className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2"><Sliders className="w-4 h-4" /> Robotics Control</h2>
            
            <div className="flex items-center justify-between p-3.5 bg-[#111624] rounded-xl border border-[#1E2536]/80 pt-2">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-tight">Crawl & Indexation</h4>
                <p className="text-[9px] text-gray-500 mt-0.5">Toggle indexing rules on google/bing robots.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={indexation} onChange={e => setIndexation(e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-[#0B0F19] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650 peer-checked:after:bg-white border border-[#1E2536]"></div>
              </label>
            </div>
          </div>

          <div className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2"><Layers className="w-4 h-4" /> Sitemap.xml Indexing</h2>
            <p className="text-[10px] text-gray-400 leading-relaxed pt-1">Build automatic site-wide directories XML containing blogs, categories and search maps endpoints so crawlers can index pages instantly.</p>
            
            <div className="pt-2">
              <button 
                onClick={generateSitemap}
                disabled={generatingSitemap}
                className="w-full flex items-center justify-center gap-2.5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-[0.15em] rounded-xl transition-all shadow-md active:scale-98 disabled:opacity-50"
              >
                {generatingSitemap ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Index...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" /> Regenerate Sitemap
                  </>
                )}
              </button>
            </div>

            <AnimatePresence>
              {sitemapSucceeded && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl mt-2 text-[10px] font-bold font-mono"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" /> Unified sitemap.xml generated and pinged successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
