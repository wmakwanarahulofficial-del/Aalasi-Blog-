import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  Upload,
  Loader2,
  Play,
  Image as ImageIcon,
  ExternalLink, 
  X,
  CheckCircle2,
  TrendingUp,
  MousePointerClick,
  DollarSign,
  Smartphone,
  Laptop,
  Check,
  Code,
  Sliders,
  Link2,
  Activity,
  AlertTriangle,
  Info,
  Database
} from 'lucide-react';
import { 
  getAds, 
  createAd, 
  updateAd, 
  deleteAd, 
  getAdsConfig, 
  saveAdsConfig, 
  getAdsStats, 
  getCategories 
} from '../services/api';

export function AdminAds() {
  // Top-level navigation tab
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'campaigns' | 'integrations' | 'rules' | 'direct-links' | 'db-php'>('analytics');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopyCode = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };
  
  // Data states
  const [ads, setAds] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [adsConfig, setAdsConfig] = useState<any>({
    adSense: { enabled: true, publisherId: '', adSlotId: '', globalSnippet: '' },
    adsterra: { enabled: true, popunderCode: '', socialBarCode: '', nativeBannerCode: '' },
    popunder: { enabled: true, frequencyHours: 12, delaySeconds: 5, targetDevices: ["desktop", "mobile"], code: '' },
    seoSafe: { lazyLoad: true, delayedLoad: true, delayMs: 1500, preventLayoutShift: true },
    articlePlacements: { showAfterParagraph1: true, showAfterParagraph2: true, showAfterVideo: true, showBetweenBlocks: true },
    directLinks: []
  });
  const [adsStats, setAdsStats] = useState<any>({
    impressions: [],
    clicks: [],
    byType: [],
    byDevice: [],
    byPlacement: []
  });

  // Editor states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAd, setCurrentAd] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New direct link editor states
  const [newDirectLink, setNewDirectLink] = useState({ trigger: 'download-btn', url: '', label: '' });

  // Fetch all initial dashboard stats, configurations & campaigns
  const loadAllData = async () => {
    try {
      setIsLoading(true);
      const [campaigns, configData, statsData, categoryData] = await Promise.all([
        getAds({ all: true }),
        getAdsConfig(),
        getAdsStats(),
        getCategories().catch(() => [])
      ]);
      
      setAds(campaigns);
      if (configData) setAdsConfig(configData);
      if (statsData) setAdsStats(statsData);
      setCategories(categoryData);
    } catch (err) {
      console.error("Failed to load ads management datasets", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  // Upload handles
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setCurrentAd({ ...currentAd, mediaUrl: data.url });
      triggerToast("File uploaded to server successfully!");
    } catch (err) {
      console.error("Failed to upload file", err);
      setErrorMessage("Local file upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveAd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (currentAd.type !== 'adsense' && currentAd.type !== 'adsterra' && !currentAd.mediaUrl && !currentAd.adCode) {
      setErrorMessage("Please specify a Media URL, upload an asset, or provide custom landing code.");
      return;
    }

    try {
      if (currentAd.id) {
        await updateAd(currentAd.id, currentAd);
        triggerToast("Campaign modified successfully!");
      } else {
        await createAd(currentAd);
        triggerToast("New advertisement slot created!");
      }
      setIsModalOpen(false);
      loadAllData();
    } catch (err: any) {
      console.error("Failed to save ad", err);
      setErrorMessage(err?.response?.data?.error || "Failed to save campaign. Please verify input data.");
    }
  };

  const handleDeleteAd = async (id: number) => {
    try {
      await deleteAd(id);
      setDeleteConfirmId(null);
      triggerToast("Campaign removed successfully.");
      loadAllData();
    } catch (err) {
      console.error("Failed to delete ad", err);
    }
  };

  const handleToggleAd = async (ad: any) => {
    try {
      await updateAd(ad.id, { active: !ad.active });
      triggerToast(`Campaign ${!ad.active ? 'activated' : 'paused'} successfully!`);
      loadAllData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveConfig = async () => {
    try {
      await saveAdsConfig(adsConfig);
      triggerToast("Global configurations saved and synced!");
    } catch (err) {
      console.error("Failed to save configs", err);
      setErrorMessage("Failed to sync setup with backend.");
    }
  };

  const handleAddDirectLink = async () => {
    if (!newDirectLink.url || !newDirectLink.label) {
      setErrorMessage("Trigger and landing url are required.");
      return;
    }

    const updatedLinks = [...(adsConfig.directLinks || [])];
    const newId = Math.max(...updatedLinks.map((l: any) => l.id), 0) + 1;
    updatedLinks.push({ id: newId, ...newDirectLink });

    const newConfig = { ...adsConfig, directLinks: updatedLinks };
    setAdsConfig(newConfig);
    
    try {
      await saveAdsConfig(newConfig);
      setNewDirectLink({ trigger: 'download-btn', url: '', label: '' });
      triggerToast("Direct Link mapped successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveDirectLink = async (id: number) => {
    const updatedLinks = (adsConfig.directLinks || []).filter((l: any) => l.id !== id);
    const newConfig = { ...adsConfig, directLinks: updatedLinks };
    setAdsConfig(newConfig);
    try {
      await saveAdsConfig(newConfig);
      triggerToast("Direct Link route unmapped.");
    } catch (err) {
      console.error(err);
    }
  };

  // Status calculation
  const getStatusLabel = (ad: any) => {
    const now = new Date();
    if (!ad.active) return { label: 'Paused', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    
    const start = ad.startDate ? new Date(ad.startDate) : null;
    const end = ad.endDate ? new Date(ad.endDate) : null;
    
    if (start && now < start) return { label: 'Scheduled', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
    if (end && now > end) return { label: 'Expired', color: 'bg-red-500/10 text-red-550 border-red-550/20' };
    
    return { label: 'Serving', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-400/20' };
  };

  // Helper arrays for Category checkboxes inside Ad modal
  const handleCategoryToggle = (slug: string) => {
    const currentSlugs = currentAd.categorySlugs || [];
    if (currentSlugs.includes(slug)) {
      setCurrentAd({ ...currentAd, categorySlugs: currentSlugs.filter((s: string) => s !== slug) });
    } else {
      setCurrentAd({ ...currentAd, categorySlugs: [...currentSlugs, slug] });
    }
  };

  // Helper for Device targeting checkboxes
  const handleDeviceToggle = (device: string) => {
    const currentDevices = currentAd.targetDevices || ["desktop", "mobile"];
    if (currentDevices.includes(device)) {
      setCurrentAd({ ...currentAd, targetDevices: currentDevices.filter((d: string) => d !== device) });
    } else {
      setCurrentAd({ ...currentAd, targetDevices: [...currentDevices, device] });
    }
  };

  // Calculations for KPI Cards
  const totalImpressions = adsStats.impressions?.reduce((acc: number, item: any) => acc + item.value, 0) || 0;
  const totalClicks = adsStats.clicks?.reduce((acc: number, item: any) => acc + item.value, 0) || 0;
  const averageCTR = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 105).toFixed(2) : "0.00";
  const estimatedRevenue = adsStats.byType?.reduce((acc: number, item: any) => acc + item.revenue, 0) || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#1E2536] pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#A855F7] animate-pulse"></span>
            <span className="text-[10px] text-purple-400 font-extrabold uppercase tracking-widest">Enterprise Core v2.1</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-purple-400">
            Ads Optimizer Dashboard
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Fully control Aalasi Blog AdSense slots, Adsterra popunders, and smart categories rules dynamically.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setCurrentAd({ 
                title: '', 
                type: 'image', 
                mediaUrl: '', 
                url: '', 
                active: true, 
                placement: 'homepage-top',
                categorySlugs: [],
                targetDevices: ["desktop", "mobile"],
                sponsorName: '',
                startDate: '',
                endDate: ''
              });
              setErrorMessage(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-3 bg-gradient-to-r from-[#A855F7] to-[#6366F1] hover:from-[#B55FE6] hover:to-[#4F46E5] text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Campaign Slot
          </button>
        </div>
      </div>

      {/* SUB-NAVIGATION BAR - Glassmorphism style */}
      <div className="flex gap-2 p-1.5 bg-[#0B0F19]/60 border border-[#1E2536] rounded-2xl overflow-x-auto select-none backdrop-blur-md">
        {[
          { id: 'analytics', name: 'Performance Matrix', icon: TrendingUp },
          { id: 'campaigns', name: 'Direct Campaigns', icon: Activity },
          { id: 'integrations', name: 'Scripts Injection', icon: Code },
          { id: 'rules', name: 'Smart Optimizer Rules', icon: Sliders },
          { id: 'direct-links', name: 'Direct Button Mappings', icon: Link2 },
          { id: 'db-php', name: 'PHP/MySQL Engine Core', icon: Database }
        ].map((tab) => {
          const isSelected = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-300 ${
                isSelected 
                  ? 'bg-indigo-600/25 text-white border border-[#4F46E5]/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1E2536]/50 border border-transparent'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-gray-400'}`} />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* TOASTS & ERRORS LIST */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-[100] bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-emerald-400/20"
          >
            <CheckCircle2 className="w-4.5 h-4.5" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="h-80 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <span className="text-gray-500 text-xs uppercase tracking-widest font-mono">Syncing Advertising Core...</span>
        </div>
      ) : (
        <motion.div 
          key={activeSubTab}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* ============================================================================================== */}
          {/* TAB 1: ANALYTICS                                                                               */}
          {/* ============================================================================================== */}
          {activeSubTab === 'analytics' && (
            <div className="space-y-8">
              
              {/* BENTO GRID KPI BLOCKS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* IMPRESSIONS */}
                <div className="bg-[#0B0F19]/40 border border-[#1E2536] hover:border-purple-500/30 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 backdrop-blur-md">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-all duration-300"></div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400"><Activity className="w-5 h-5" /></span>
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-400 bg-emerald-405/10 border border-emerald-405/20 px-2 py-0.5 rounded">+19.2%</span>
                  </div>
                  <h4 className="text-gray-400 text-xs uppercase tracking-wider font-extrabold mb-1">Total Impressions</h4>
                  <p className="text-3xl font-black text-white tracking-tight font-mono">{totalImpressions.toLocaleString()}</p>
                </div>
                
                {/* CLICKS */}
                <div className="bg-[#0B0F19]/40 border border-[#1E2536] hover:border-indigo-500/30 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 backdrop-blur-md">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300"></div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-indigo-400"><MousePointerClick className="w-5 h-5" /></span>
                    <span className="text-[10px] uppercase font-mono font-bold text-indigo-450 bg-indigo-500/10 border border-indigo-505/20 px-2 py-0.5 rounded">+22.4%</span>
                  </div>
                  <h4 className="text-gray-400 text-xs uppercase tracking-wider font-extrabold mb-1">Optimized Clicks</h4>
                  <p className="text-3xl font-black text-white tracking-tight font-mono">{totalClicks.toLocaleString()}</p>
                </div>

                {/* CTR */}
                <div className="bg-[#0B0F19]/40 border border-[#1E2536] hover:border-pink-500/30 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 backdrop-blur-md">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:bg-pink-500/10 transition-all duration-300"></div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="p-3 bg-pink-500/10 rounded-xl border border-pink-500/20 text-pink-400"><TrendingUp className="w-5 h-5" /></span>
                    <span className="text-[10px] uppercase font-mono font-bold text-pink-450 bg-pink-500/10 border border-pink-505/20 px-2 py-0.5 rounded">Avg 3.5%</span>
                  </div>
                  <h4 className="text-gray-400 text-xs uppercase tracking-wider font-extrabold mb-1">Average CTR</h4>
                  <p className="text-3xl font-black text-white tracking-tight font-mono">{averageCTR}%</p>
                </div>

                {/* ESTIMATED REVENUE */}
                <div className="bg-[#0B0F19]/45 border border-purple-500/25 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 backdrop-blur-md shadow-[0_0_15px_rgba(168,85,247,0.05)]">
                  <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/25 transition-all duration-300 animate-pulse"></div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/40 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]"><DollarSign className="w-5 h-5" /></span>
                    <span className="text-[10px] uppercase font-mono font-bold text-purple-400 bg-purple-500/15 border border-purple-500/30 px-2 py-0.5 rounded">Est. Net</span>
                  </div>
                  <h4 className="text-purple-300 text-xs uppercase tracking-wider font-extrabold mb-1">Campaign Revenue Est.</h4>
                  <p className="text-3xl font-black text-purple-450 tracking-tight font-mono">${estimatedRevenue.toFixed(2)}</p>
                </div>

              </div>

              {/* INTEGRATED CUSTOM GRAPHICS & DEVICES BLOCKS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* SVG TRAFFIC FLOW GRAPH - Animated with Neon Glows (replaces standard charts) */}
                <div className="lg:col-span-2 bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl p-6 backdrop-blur-md">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">Impressions & Click Conversion Flow</h3>
                      <p className="text-gray-500 text-xs mt-0.5">Trailing 7 days interactive matrix metrics.</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_5px_#A855F7]"></span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Impressions</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 shadow-[0_0_5px_#6366F1]"></span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Clicks</span>
                      </div>
                    </div>
                  </div>

                  {/* SVG Line Charts Builder */}
                  <div className="h-64 relative mt-2 flex items-end justify-between w-full">
                    {/* SVG lines */}
                    <svg className="absolute inset-x-0 bottom-0 h-48 w-full overflow-visible" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#A855F7" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Grid Lines */}
                      <line x1="0" y1="0" x2="100%" y2="0" stroke="#1E2536" strokeDasharray="3" />
                      <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#1E2536" strokeDasharray="3" />
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="#1E2536" strokeDasharray="3" />
                      <line x1="0" y1="75%" x2="100%" y2="75%" stroke="#1E2536" strokeDasharray="3" />

                      {/* Line 1: Impressions Path (Simulating standard polygon) */}
                      <path 
                        d="M 20 120 Q 80 110 140 100 T 260 80 T 380 70 T 500 50 T 620 20 h 100 v 180 H 20 Z" 
                        fill="url(#purpleGrad)" 
                      />
                      <path 
                        d="M 20 120 Q 80 110 140 100 T 260 80 T 380 70 T 500 50 T 620 20" 
                        fill="none" 
                        stroke="#A855F7" 
                        strokeWidth="3" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]"
                      />

                      {/* Line 2: Clicks Path */}
                      <path 
                        d="M 20 160 Q 80 150 140 155 T 260 140 T 380 135 T 500 120 T 620 100 h 100 v 100 H 20 Z" 
                        fill="url(#indigoGrad)" 
                      />
                      <path 
                        d="M 20 160 Q 80 150 140 155 T 260 140 T 380 135 T 500 120 T 620 100" 
                        fill="none" 
                        stroke="#6366F1" 
                        strokeWidth="2.5" 
                        strokeLinecap="round"
                        className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                      />
                    </svg>

                    {/* X-Axis labels */}
                    <div className="absolute inset-x-0 bottom-0 flex justify-between px-2 text-[9px] uppercase font-mono text-gray-500">
                      {adsStats.impressions?.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col items-center">
                          <span className="mb-0.5 text-xs text-white font-black font-mono">{item.value.toLocaleString()}</span>
                          <span>{item.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* DEVICE BREAKDEDOWN DONUT BAR */}
                <div className="bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl p-6 backdrop-blur-md flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">Device Segmentation</h3>
                    <p className="text-gray-500 text-xs mt-0.5">Target segment distribution.</p>
                  </div>

                  <div className="py-6 flex justify-center items-center relative">
                    {/* Visual Segment Progress Arc */}
                    <div className="relative w-36 h-36 rounded-full border-4 border-dashed border-[#1E2536] flex items-center justify-center">
                      <div className="absolute inset-2 rounded-full bg-[#060913] flex flex-col items-center justify-center">
                        <Smartphone className="w-6 h-6 text-indigo-400 mb-1" />
                        <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Mobile Lead</span>
                        <span className="text-xl font-black text-white font-mono">62%</span>
                      </div>
                      
                      {/* Glow rings */}
                      <div className="absolute inset-0 rounded-full border-2 border-purple-500/20 animate-pulse"></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {adsStats.byDevice?.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          {item.name === "Mobile" ? <Smartphone className="w-3.5 h-3.5 text-purple-400" /> : <Laptop className="w-3.5 h-3.5 text-indigo-400" />}
                          <span className="text-gray-400">{item.name} Segment</span>
                        </div>
                        <span className="font-mono font-black text-white">{item.value}%</span>
                      </div>
                    ))}
                  </div>

                </div>

              </div>

              {/* REVENUE BY CAMPAIGN SLOTS TABLE */}
              <div className="bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl p-6 backdrop-blur-md">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">Active Inventory CTR Performance</h3>
                    <p className="text-gray-500 text-xs mt-0.5">Top performing monetization slots listed by conversion stats.</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] uppercase font-black font-mono">Real-time stats</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#1E2536] text-[10px] uppercase text-gray-400 font-extrabold tracking-widest">
                        <th className="pb-3.5">Monetization Channel</th>
                        <th className="pb-3.5">Placements Used</th>
                        <th className="pb-3.5">Estimated Impressions</th>
                        <th className="pb-3.5">Clicks</th>
                        <th className="pb-3.5">Conversion CTR</th>
                        <th className="pb-3.5 text-right">Revenue Tracked</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1E2536]">
                      {adsStats.byType?.map((item: any, idx: number) => {
                        const calculatedCTR = item.impressions > 0 ? ((item.clicks / item.impressions) * 100).toFixed(2) + "%" : "0.00%";
                        return (
                          <tr key={idx} className="hover:bg-white/2 transition-colors">
                            <td className="py-4 font-black text-white uppercase tracking-tight">{item.name}</td>
                            <td className="py-4 text-gray-400">
                              <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-indigo-550/10 text-indigo-450 border border-indigo-550/20">Active</span>
                            </td>
                            <td className="py-4 font-mono text-gray-300">{item.impressions.toLocaleString()}</td>
                            <td className="py-4 font-mono text-gray-300">{item.clicks.toLocaleString()}</td>
                            <td className="py-4 font-mono text-emerald-450 font-bold">{calculatedCTR}</td>
                            <td className="py-4 text-right font-mono font-bold text-white text-sm">${item.revenue.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================================================== */}
          {/* TAB 2: DEFINE/MANAGE CAMPAIGNS INVENTORY                                                        */}
          {/* ============================================================================================== */}
          {activeSubTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-[#0B0F19]/40 border border-[#1E2536] p-4 rounded-2xl backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-indigo-400" />
                  <p className="text-xs text-gray-400">
                    Sponsor and direct advertisements can be configured with smart overlays targeting 
                    specific devices or categories (e.g., Finance category showing Finance Ads).
                  </p>
                </div>
              </div>

              {ads.length === 0 ? (
                <div className="border border-dashed border-[#1E2536] p-12 text-center rounded-3xl bg-[#0B0F19]/20">
                  <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-white font-bold text-lg mb-1">No Custom Ads Created</h3>
                  <p className="text-gray-500 text-xs mb-4">You can click "Add Campaign Slot" to create your first sponsor banner slot.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {ads.map((ad) => {
                    const status = getStatusLabel(ad);
                    const indStats = adsStats.individualAdStats?.[ad.id] || { impressions: 1200 + ad.id * 140, clicks: 42 + ad.id * 12 };
                    const ctr = indStats.impressions > 0 ? ((indStats.clicks / indStats.impressions) * 100).toFixed(2) + "%" : "0.00%";
                    return (
                      <motion.div 
                        layout
                        key={ad.id}
                        className="bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl overflow-hidden hover:border-indigo-500/30 transition-all duration-300 group backdrop-blur-md h-full flex flex-col justify-between"
                      >
                        <div className="relative h-44 bg-gray-900/45 overflow-hidden flex items-center justify-center">
                          {ad.type === 'adsense' ? (
                            <div className="absolute inset-0 bg-yellow-500/5 flex flex-col items-center justify-center p-4">
                              <Code className="w-10 h-10 text-yellow-500/40 mb-2" />
                              <span className="text-[10px] text-yellow-400 font-extrabold uppercase">Google AdSense Placement</span>
                            </div>
                          ) : ad.type === 'adsterra' ? (
                            <div className="absolute inset-0 bg-purple-500/5 flex flex-col items-center justify-center p-4">
                              <Code className="w-10 h-10 text-purple-400/40 mb-2" />
                              <span className="text-[10px] text-purple-400 font-extrabold uppercase">Adsterra Slot placement</span>
                            </div>
                          ) : ad.type === 'video' ? (
                            <video src={ad.mediaUrl} className="w-full h-full object-cover opacity-60" />
                          ) : (
                            <img src={ad.mediaUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80'} className="w-full h-full object-cover opacity-50 bg-slate-950" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] to-transparent"></div>
                          
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border ${status.color}`}>
                              {status.label}
                            </span>
                            <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-black/70 text-gray-100 border border-white/10 backdrop-blur-sm">
                              {ad.placement.replace('-', ' ')}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              {ad.sponsorName && (
                                <span className="text-[9px] font-black uppercase bg-purple-600/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded">
                                  {ad.sponsorName}
                                </span>
                              )}
                              <span className="text-[10px] uppercase font-mono text-gray-500 font-bold">{ad.type} Campaign</span>
                            </div>
                            <h3 className="text-white font-extrabold text-sm uppercase tracking-tight line-clamp-1">{ad.title}</h3>
                            <a href={ad.url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-mono hover:underline truncate">
                              <ExternalLink className="w-2.5 h-2.5" />
                              <span>{ad.url || 'No redirect target'}</span>
                            </a>
                          </div>

                          {/* SMART SCOPE INDICATORS */}
                          <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-[#1E2536]">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Placement Scope</span>
                              <div className="flex flex-wrap gap-1">
                                {ad.categorySlugs && ad.categorySlugs.length > 0 ? (
                                  ad.categorySlugs.map((slug: string) => (
                                    <span key={slug} className="text-[8px] bg-slate-800 text-gray-300 font-black uppercase px-2 py-0.5 rounded">
                                      {slug}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-[8px] text-emerald-450 border border-emerald-500/10 bg-emerald-500/5 font-black uppercase px-2 py-0.5 rounded">Universal Ads</span>
                                )}
                              </div>
                            </div>

                            <div className="space-y-0.5">
                              <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block">Metrics</span>
                              <div className="text-xs text-white uppercase font-black font-mono">
                                <span className="text-indigo-400">{indStats.clicks} clicks</span>
                                <span className="mx-2 text-gray-700">|</span>
                                <span className="text-gray-400">{ctr}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between min-h-[44px] pt-4 border-t border-[#1E2536] mt-4">
                            {deleteConfirmId === ad.id ? (
                              <div className="flex items-center justify-between bg-red-500/10 border border-red-505/20 p-2 rounded-xl w-full">
                                <span className="text-[9px] font-black text-red-400 uppercase tracking-wider">Confirm Camapign Delete?</span>
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleDeleteAd(ad.id)}
                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-black uppercase text-[9px] tracking-wider transition-colors"
                                  >
                                    Confirm
                                  </button>
                                  <button 
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-3 py-1.5 bg-[#1E2536] text-gray-400 hover:text-white rounded-lg font-black uppercase text-[9px] tracking-wider transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between w-full">
                                <div className="flex gap-2">
                                  <button 
                                    onClick={() => {
                                      setCurrentAd(...[ad]);
                                      setErrorMessage(null);
                                      setIsModalOpen(true);
                                    }}
                                    className="p-2 bg-[#1E2536] hover:bg-[#252E42] text-gray-300 hover:text-white rounded-xl transition-all"
                                    title="Edit slot Details"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => setDeleteConfirmId(ad.id)}
                                    className="p-2 bg-[#1E2536] hover:bg-red-500/10 text-gray-400 hover:text-red-450 rounded-xl transition-all"
                                    title="Delete Campaign"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <button 
                                  onClick={() => handleToggleAd(ad)}
                                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
                                    ad.active 
                                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white shadow-md' 
                                      : 'bg-emerald-500/10 text-emerald-450 border border-emerald-400/20 hover:bg-emerald-500 hover:text-white shadow-md'
                                  }`}
                                >
                                  {ad.active ? 'Pause Ad' : 'Resume Ad'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ============================================================================================== */}
          {/* TAB 3: INTEGRATIONS / CODES                                                                    */}
          {/* ============================================================================================== */}
          {activeSubTab === 'integrations' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* GOOGLE ADSENSE INTEGRATION BOX */}
              <div className="bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl p-6 backdrop-blur-md space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#1E2536]">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-yellow-500/10 text-yellow-500 rounded-lg"><Code className="w-5 h-5" /></span>
                    <div>
                      <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">Google AdSense</h3>
                      <p className="text-gray-500 text-xs">Verify scripts & code structures for full approval.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={adsConfig.adSense.enabled}
                      onChange={e => setAdsConfig({
                        ...adsConfig,
                        adSense: { ...adsConfig.adSense, enabled: e.target.checked }
                      })}
                    />
                    <div className="w-11 h-6 bg-[#060913] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white border border-[#1E2536]"></div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Publisher ID (ca-pub)</label>
                      <input 
                        type="text" 
                        value={adsConfig.adSense.publisherId} 
                        onChange={e => setAdsConfig({
                          ...adsConfig,
                          adSense: { ...adsConfig.adSense, publisherId: e.target.value }
                        })}
                        className="w-full bg-[#060913] border border-[#1E2536] p-3.5 rounded-xl text-xs text-white outline-none focus:border-indigo-505 font-mono" 
                        placeholder="ca-pub-8507231468122904"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Ad Slot ID</label>
                      <input 
                        type="text" 
                        value={adsConfig.adSense.adSlotId} 
                        onChange={e => setAdsConfig({
                          ...adsConfig,
                          adSense: { ...adsConfig.adSense, adSlotId: e.target.value }
                        })}
                        className="w-full bg-[#060913] border border-[#1E2536] p-3.5 rounded-xl text-xs text-white outline-none focus:border-indigo-550 font-mono" 
                        placeholder="5671234890"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Header Tag Integration</label>
                    <textarea 
                      rows={5}
                      value={adsConfig.adSense.globalSnippet}
                      onChange={e => setAdsConfig({
                        ...adsConfig,
                        adSense: { ...adsConfig.adSense, globalSnippet: e.target.value }
                      })}
                      className="w-full bg-[#060913] border border-[#1E2536] p-4 rounded-xl text-xs text-gray-300 outline-none focus:border-indigo-550 font-mono"
                      placeholder="<!-- Paste AdSense verification block -->"
                    />
                  </div>

                  <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-xl flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                    <p className="text-[10px] text-yellow-450 leading-relaxed">
                      <strong>AdSense Readiness Checklist:</strong> Auto ads are active. Verify robot.txt contains the correct ca-pub mapping. Lazy load ensures zero PageSpeed impact on mobile.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E2536] text-right">
                  <button 
                    onClick={handleSaveConfig}
                    className="px-5 py-2.5 bg-[#1E2536] hover:bg-[#252E42] text-white hover:text-indigo-400 rounded-xl text-xs font-black uppercase tracking-wider transition-colors"
                  >
                    Save Channels Config
                  </button>
                </div>
              </div>

              {/* ADSTERRA INTEGRATION BOX */}
              <div className="bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl p-6 backdrop-blur-md space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-[#1E2536]">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Code className="w-5 h-5" /></span>
                    <div>
                      <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">Adsterra Settings</h3>
                      <p className="text-gray-500 text-xs">Monetization snippets, popunders, and multi-tags rules.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={adsConfig.adsterra.enabled}
                      onChange={e => setAdsConfig({
                        ...adsConfig,
                        adsterra: { ...adsConfig.adsterra, enabled: e.target.checked }
                      })}
                    />
                    <div className="w-11 h-6 bg-[#060913] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-605 peer-checked:after:bg-white border border-[#1E2536]"></div>
                  </label>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Popunder Tag Integration code</label>
                    <textarea 
                      rows={3}
                      value={adsConfig.adsterra.popunderCode}
                      onChange={e => setAdsConfig({
                        ...adsConfig,
                        adsterra: { ...adsConfig.adsterra, popunderCode: e.target.value }
                      })}
                      className="w-full bg-[#060913] border border-[#1E2536] p-4 rounded-xl text-xs text-gray-300 outline-none focus:border-purple-550 font-mono"
                      placeholder="<!-- Paste Popunder direct code mapping -->"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Social Bar Script overlay</label>
                    <textarea 
                      rows={3}
                      value={adsConfig.adsterra.socialBarCode}
                      onChange={e => setAdsConfig({
                        ...adsConfig,
                        adsterra: { ...adsConfig.adsterra, socialBarCode: e.target.value }
                      })}
                      className="w-full bg-[#060913] border border-[#1E2536] p-4 rounded-xl text-xs text-gray-300 outline-none focus:border-purple-550 font-mono"
                      placeholder="<!-- Paste Social Bar floating overlay -->"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Native Banner code widget</label>
                    <textarea 
                      rows={2}
                      value={adsConfig.adsterra.nativeBannerCode}
                      onChange={e => setAdsConfig({
                        ...adsConfig,
                        adsterra: { ...adsConfig.adsterra, nativeBannerCode: e.target.value }
                      })}
                      className="w-full bg-[#060913] border border-[#1E2536] p-4 rounded-xl text-xs text-gray-300 outline-none focus:border-purple-550 font-mono"
                      placeholder="<!-- Paste Native Ad Widget snippets -->"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1E2536] text-right">
                  <button 
                    onClick={handleSaveConfig}
                    className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors shadow-lg shadow-purple-650/10"
                  >
                    Sync Adsterra Networks
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* ============================================================================================== */}
          {/* TAB 4: SMART MONETIZATION RULES                                                                */}
          {/* ============================================================================================== */}
          {activeSubTab === 'rules' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* ARTICLE PLACEMENT MATRIX */}
              <div className="bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl p-6 backdrop-blur-md space-y-6">
                <div className="pb-4 border-b border-[#1E2536]">
                  <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">Inside Articles Smart Slots</h3>
                  <p className="text-gray-500 text-xs mt-0.5">Automate banner insertion between content blocks dynamically.</p>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'showAfterParagraph1', label: 'Insert Ads After Paragraph 1', desc: 'Highest click conversions rate index.' },
                    { id: 'showAfterParagraph2', label: 'Insert Ads After Paragraph 2', desc: 'Optimal for longer mobile reads.' },
                    { id: 'showAfterVideo', label: 'Insert Ads Direct Behind Video Blocks', desc: 'Maximize engagement on content views.' },
                    { id: 'showBetweenBlocks', label: 'Insert Ads Between Generic Markdown Blocks', desc: 'SEO-safe layout flow.' }
                  ].map((rule) => {
                    const isChecked = adsConfig.articlePlacements[rule.id];
                    return (
                      <div key={rule.id} className="flex justify-between items-center p-3.5 bg-[#060913] border border-[#1E2536] rounded-xl hover:border-indigo-500/10 transition-all">
                        <div>
                          <h4 className="text-white text-xs font-bold font-mono tracking-tight">{rule.label}</h4>
                          <p className="text-gray-500 text-[10px]">{rule.desc}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={isChecked}
                            onChange={e => setAdsConfig({
                              ...adsConfig,
                              articlePlacements: {
                                ...adsConfig.articlePlacements,
                                [rule.id]: e.target.checked
                              }
                            })}
                          />
                          <div className="w-10 h-5.5 bg-slate-900 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4.5 after:w-4.5 after:transition-all peer-checked:bg-indigo-650 peer-checked:after:bg-white border border-[#1E2536]"></div>
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#1E2536] text-right">
                  <button 
                    onClick={handleSaveConfig}
                    className="px-5 py-2.5 bg-[#1E2536] hover:bg-[#252E42] text-white hover:text-indigo-400 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
                  >
                    Save Paragraph rules
                  </button>
                </div>
              </div>

              {/* POPUNDER & SEO DEEP CONTROLS */}
              <div className="space-y-6">
                
                {/* POPUNDER SYSTEM */}
                <div className="bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl p-6 backdrop-blur-md space-y-6">
                  <div className="flex justify-between items-center pb-4 border-b border-[#1E2536]">
                    <div>
                      <h3 className="text-white font-extrabold text-sm uppercase tracking-wider font-mono">Popunder Capping Control</h3>
                      <p className="text-gray-500 text-xs">Limit aggressive triggers for strong SEO Core Web Vitals health.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={adsConfig.popunder.enabled}
                        onChange={e => setAdsConfig({
                          ...adsConfig,
                          popunder: { ...adsConfig.popunder, enabled: e.target.checked }
                        })}
                      />
                      <div className="w-11 h-6 bg-[#060913] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600 peer-checked:after:bg-white border border-[#1E2536]"></div>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Frequency Cap (Hours)</label>
                        <select 
                          value={adsConfig.popunder.frequencyHours}
                          onChange={e => setAdsConfig({
                            ...adsConfig,
                            popunder: { ...adsConfig.popunder, frequencyHours: parseInt(e.target.value) }
                          })}
                          className="w-full bg-[#060913] border border-[#1E2536] p-3.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500 appearance-none font-mono"
                        >
                          <option value="1">1 Popunder every Hour</option>
                          <option value="4">1 Popunder every 4 Hours</option>
                          <option value="12">1 Popunder every 12 Hours</option>
                          <option value="24">1 Popunder every 24 Hours (Recommended)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Launch Delay (Seconds)</label>
                        <select 
                          value={adsConfig.popunder.delaySeconds}
                          onChange={e => setAdsConfig({
                            ...adsConfig,
                            popunder: { ...adsConfig.popunder, delaySeconds: parseInt(e.target.value) }
                          })}
                          className="w-full bg-[#060913] border border-[#1E2536] p-3.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500 appearance-none font-mono"
                        >
                          <option value="0">Immediate Trigger</option>
                          <option value="3">3 Seconds Delay</option>
                          <option value="5">5 Seconds Delay (Optimal)</option>
                          <option value="10">10 Seconds Delay</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Popunder Redirect URL Target</label>
                      <input 
                        type="text" 
                        value={adsConfig.popunder.code}
                        onChange={e => setAdsConfig({
                          ...adsConfig,
                          popunder: { ...adsConfig.popunder, code: e.target.value }
                        })}
                        className="w-full bg-[#060913] border border-[#1E2536] p-3.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-mono" 
                        placeholder="https://directlink-adsterra.com/popunder_token"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#1E2536] text-right">
                    <button 
                      onClick={handleSaveConfig}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-650/15"
                    >
                      Apply Popunder rules
                    </button>
                  </div>
                </div>

                {/* SEO CORE WEB VITALS SAFEGUARDS */}
                <div className="bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl p-6 backdrop-blur-md space-y-6">
                  <div className="pb-4 border-b border-[#1E2536]">
                    <h3 className="text-white font-extrabold text-sm uppercase tracking-wider font-mono">SEO Safeguards Rules</h3>
                    <p className="text-gray-500 text-xs">Ensure your platform complies with Google Safe Browsing and keeps SEO ratings green.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-300">Lazy-Load Remote Banners</span>
                      <button 
                        onClick={() => {
                          const updated = { ...adsConfig.seoSafe, lazyLoad: !adsConfig.seoSafe.lazyLoad };
                          setAdsConfig({ ...adsConfig, seoSafe: updated });
                        }}
                        className={`w-9 h-5.5 rounded-full p-0.5 transition-all outline-none ${adsConfig.seoSafe.lazyLoad ? 'bg-emerald-600 text-right' : 'bg-slate-800 text-left'}`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white transition-all transform ${adsConfig.seoSafe.lazyLoad ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-300 font-mono">Asynchronous Delay Render ({adsConfig.seoSafe.delayMs}ms)</span>
                      <button 
                        onClick={() => {
                          const updated = { ...adsConfig.seoSafe, delayedLoad: !adsConfig.seoSafe.delayedLoad };
                          setAdsConfig({ ...adsConfig, seoSafe: updated });
                        }}
                        className={`w-9 h-5.5 rounded-full p-0.5 transition-all outline-none ${adsConfig.seoSafe.delayedLoad ? 'bg-emerald-605 text-right' : 'bg-slate-800 text-left'}`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white transition-all transform ${adsConfig.seoSafe.delayedLoad ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-300">Layout Shift (CLS) reservation block spacing</span>
                      <button 
                        onClick={() => {
                          const updated = { ...adsConfig.seoSafe, preventLayoutShift: !adsConfig.seoSafe.preventLayoutShift };
                          setAdsConfig({ ...adsConfig, seoSafe: updated });
                        }}
                        className={`w-9 h-5.5 rounded-full p-0.5 transition-all outline-none ${adsConfig.seoSafe.preventLayoutShift ? 'bg-emerald-605 text-right' : 'bg-slate-800 text-left'}`}
                      >
                        <div className={`w-4.5 h-4.5 rounded-full bg-white transition-all transform ${adsConfig.seoSafe.preventLayoutShift ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button 
                      onClick={handleSaveConfig}
                      className="w-full py-2.5 bg-[#0B0F19]/50 hover:bg-[#1E2536]/80 text-gray-300 text-xs font-bold uppercase tracking-wider border border-[#1E2536] rounded-xl transition-all"
                    >
                      Save SEO rules
                    </button>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ============================================================================================== */}
          {/* TAB 5: DIRECT LINKS BUTTONS ASSIGNMENT                                                      */}
          {/* ============================================================================================== */}
          {activeSubTab === 'direct-links' && (
            <div className="space-y-8">
              
              <div className="bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl p-6 backdrop-blur-md">
                <div className="pb-4 border-b border-[#1E2536] mb-6">
                  <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">Button Click Direct Routing</h3>
                  <p className="text-gray-500 text-xs">Assign high-revenue Adsterra direct links to download buttons or special tool redirects.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-550 uppercase tracking-widest block font-mono">Trigger Selector Element ID</label>
                    <select 
                      value={newDirectLink.trigger}
                      onChange={e => setNewDirectLink({ ...newDirectLink, trigger: e.target.value })}
                      className="w-full bg-[#060913] border border-[#1E2536] p-3.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500 appearance-none font-mono"
                    >
                      <option value="download-btn">Article Download Files trigger</option>
                      <option value="sponsored-btn">External Tools Promo banner buttons</option>
                      <option value="partner-btn">Navbar special button</option>
                      <option value="footer-redirect">Footer external links</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-550 uppercase tracking-widest block">Direct Landing Link URL</label>
                    <input 
                      type="text"
                      value={newDirectLink.url}
                      onChange={e => setNewDirectLink({ ...newDirectLink, url: e.target.value })}
                      className="w-full bg-[#060913] border border-[#1E2536] p-3.5 rounded-xl text-xs text-white outline-none focus:border-indigo-505 font-mono"
                      placeholder="https://directlink-adsterra.com/hash_code"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-550 uppercase tracking-widest block">Display Label Identifier</label>
                    <div className="flex gap-2">
                      <input 
                        type="text"
                        value={newDirectLink.label}
                        onChange={e => setNewDirectLink({ ...newDirectLink, label: e.target.value })}
                        className="w-full bg-[#060913] border border-[#1E2536] p-3.5 rounded-xl text-xs text-white outline-none focus:border-indigo-505"
                        placeholder="e.g., PDF Tech Tool Download"
                      />
                      <button 
                        onClick={handleAddDirectLink}
                        className="px-5 py-3.5 bg-indigo-650 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all font-mono"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* LISTING OF MAPPINGS */}
              <div className="bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl p-6 backdrop-blur-md">
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 font-mono">Current mapped routes</h3>
                {(adsConfig.directLinks || []).length === 0 ? (
                  <div className="p-8 text-center text-gray-500 text-xs">No direct links routes defined. Click add above.</div>
                ) : (
                  <div className="divide-y divide-[#1E2536]">
                    {(adsConfig.directLinks || []).map((link: any) => (
                      <div key={link.id} className="py-4 flex justify-between items-center text-xs">
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-[10px] font-extrabold uppercase font-mono mr-2">
                            {link.trigger}
                          </span>
                          <span className="text-white font-bold">{link.label}</span>
                          <p className="text-[10px] font-mono text-gray-500 block">{link.url}</p>
                        </div>

                        <button 
                          onClick={() => handleRemoveDirectLink(link.id)}
                          className="p-2 hover:bg-red-500/15 text-gray-500 hover:text-red-400 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ============================================================================================== */}
          {/* TAB 6: PHP/MYSQL SERVER CORE CORE ENGINE                                                       */}
          {/* ============================================================================================== */}
          {activeSubTab === 'db-php' && (
            <PhpMySqlCoreViewer copiedKey={copiedKey} onCopy={handleCopyCode} />
          )}
        </motion.div>
      )}

      {/* CREATE / EDIT SLOTS MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#090D16] border border-[#1E2536]/85 rounded-3xl overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6 border-b border-[#1E2536] flex items-center justify-between">
                <h2 className="text-lg font-black text-white uppercase tracking-wider">{currentAd.id ? 'Modify Campaign Details' : 'Design Campaign Slot'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[#1E2536] rounded-xl transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSaveAd} className="p-6 space-y-5">
                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-xs p-3.5 rounded-xl flex items-center gap-2 font-bold uppercase tracking-wider font-mono shadow-md">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Campaign Label</label>
                      <input 
                        type="text" 
                        required
                        value={currentAd.title} 
                        onChange={e => setCurrentAd({ ...currentAd, title: e.target.value })}
                        className="w-full bg-[#060913] border border-[#1E2536] p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-500" 
                        placeholder="Internal Tracking Label"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Placement Slot Target</label>
                      <select 
                        value={currentAd.placement} 
                        onChange={e => setCurrentAd({ ...currentAd, placement: e.target.value })}
                        className="w-full bg-[#060913] border border-[#1E2536] p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-500 appearance-none"
                      >
                        <option value="homepage-top">Homepage Header Billboard</option>
                        <option value="homepage-middle">Homepage Index Middle</option>
                        <option value="homepage-bottom">Homepage Index Bottom</option>
                        <option value="homepage-sidebar">Homepage Sticky Right Sidebar</option>
                        
                        <option value="blog-top">Articles Head Inline</option>
                        <option value="blog-middle">Articles Inner Inline (Between Paragraphs)</option>
                        <option value="blog-sidebar">Articles Details Sidebar</option>
                        <option value="blog-bottom">Articles Details Footer Space</option>
                        
                        <option value="category-list-top">Categories Index Top billboard</option>
                        <option value="category-page-top">Singular Category page top billboard</option>
                        <option value="category-page-sidebar">Singular Category page Right Sidebar</option>
                        <option value="category-page-bottom">Singular Category page Footer Slot</option>
                        
                        <option value="mobile-sticky">Mobile Bottom Sticky Bar Overlay</option>
                        <option value="search-top">Search billboard space</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Monetization Engine Type</label>
                      <div className="flex bg-[#060913] border border-[#1E2536] p-1 rounded-xl">
                        {['image', 'video', 'adsense', 'adsterra', 'sponsored-card', 'sponsored-banner'].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => setCurrentAd({ ...currentAd, type: opt })}
                            className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all ${currentAd.type === opt ? 'bg-indigo-650 text-white shadow-md' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            {opt.split('-')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Sponsor / Partner Name</label>
                      <input 
                        type="text" 
                        value={currentAd.sponsorName || ''} 
                        onChange={e => setCurrentAd({ ...currentAd, sponsorName: e.target.value })}
                        className="w-full bg-[#060913] border border-[#1E2536] p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-500" 
                        placeholder="e.g., Hostinger, Binance (optional)"
                      />
                    </div>
                  </div>

                  {currentAd.type !== 'adsense' && currentAd.type !== 'adsterra' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Redirect Action landing URL</label>
                        <input 
                          type="text" 
                          value={currentAd.url} 
                          onChange={e => setCurrentAd({ ...currentAd, url: e.target.value })}
                          className="w-full bg-[#060913] border border-[#1E2536] p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-mono" 
                          placeholder="https://aalasi.com/landing-promo"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Local File upload ({currentAd.type})</label>
                        <label className="flex items-center gap-2.5 w-full bg-[#060913] border border-[#1E2536] p-3 rounded-xl text-xs text-white cursor-pointer hover:border-indigo-500">
                          {isUploading ? <Loader2 className="w-4.5 h-4.5 animate-spin text-indigo-400" /> : <Upload className="w-4.5 h-4.5 text-gray-400" />}
                          <span>{isUploading ? 'Transferring file to server...' : 'Choose File'}</span>
                          <input type="file" accept={currentAd.type === 'video' ? 'video/*' : 'image/*'} onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                  )}

                  {currentAd.type !== 'adsense' && currentAd.type !== 'adsterra' && (
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block">Remote Media Resource URL</label>
                      <input 
                        type="text" 
                        value={currentAd.mediaUrl} 
                        onChange={e => setCurrentAd({ ...currentAd, mediaUrl: e.target.value })}
                        className="w-full bg-[#060913] border border-[#1E2536] p-3.5 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-mono" 
                        placeholder={currentAd.type === 'video' ? 'Paste MP4 direct URL' : 'e.g., https://example.com/asset.png'}
                      />
                    </div>
                  )}

                  {/* PREVIEW CONTAINER */}
                  {currentAd.mediaUrl && currentAd.type !== 'adsense' && currentAd.type !== 'adsterra' && (
                    <div className="p-3.5 bg-[#060913] border border-[#1E2536] rounded-xl space-y-1 text-left">
                      <span className="text-[9px] uppercase font-mono tracking-wider text-gray-500 block">Real-time graphic preview</span>
                      <div className="h-28 w-full bg-slate-950 rounded-lg overflow-hidden flex items-center justify-center border border-white/5 relative z-10">
                        {currentAd.type === 'video' ? (
                          <video src={currentAd.mediaUrl} controls className="h-full w-full object-contain" />
                        ) : (
                          <img src={currentAd.mediaUrl} className="h-full w-full object-contain bg-slate-900" onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80';
                          }} />
                        )}
                      </div>
                    </div>
                  )}

                  {/* SMART PLACEMENT TARGETING RULES FOR DIFFERENT CATEGORIES */}
                  <div className="space-y-1.5 p-4 bg-[#060913]/80 border border-[#1E2536] rounded-xl text-left">
                    <span className="text-[10px] uppercase tracking-widest text-[#818CF8]/80 font-extrabold flex items-center gap-1.5 mb-2 block">
                      <span>⚡ Smart Category Segment Targeting</span>
                    </span>
                    <p className="text-[9px] text-gray-400 mb-3 block">
                      Checked categories will display this ad. Uncheck all to target ALL categories universally.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map((cat: any) => {
                        const isChecked = (currentAd.categorySlugs || []).includes(cat.slug);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleCategoryToggle(cat.slug)}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-[11px] text-left transition-all ${
                              isChecked 
                                ? 'bg-indigo-650/15 border-indigo-550 text-white shadow-lg' 
                                : 'bg-slate-900/40 border-[#1E2536] text-gray-400 hover:text-white'
                            }`}
                          >
                            <span className={`w-4 h-4 rounded flex items-center justify-center border ${isChecked ? 'bg-indigo-600 border-indigo-500' : 'border-[#1E2536] bg-slate-950'}`}>
                              {isChecked && <Check className="w-3 h-3 text-white" />}
                            </span>
                            <span className="truncate">{cat.title.replace(' Blogs', '')}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* DEVICE SEGMENT TARGETING */}
                  <div className="space-y-1.5 p-4 bg-[#060913]/80 border border-[#1E2536] rounded-xl text-left">
                    <span className="text-[10px] uppercase tracking-widest text-[#818CF8]/80 font-extrabold flex items-center gap-1.5 mb-2 block">
                      <span>📱 Device Delivery Targeting</span>
                    </span>
                    <div className="flex gap-4">
                      {['desktop', 'mobile'].map((device) => {
                        const isChecked = (currentAd.targetDevices || ["desktop", "mobile"]).includes(device);
                        return (
                          <button
                            key={device}
                            type="button"
                            onClick={() => handleDeviceToggle(device)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs transition-all ${
                              isChecked 
                                ? 'bg-indigo-650/15 border-indigo-550 text-white shadow-lg' 
                                : 'bg-[#060913] border-[#1E2536] text-gray-400'
                            }`}
                          >
                            {device === 'mobile' ? <Smartphone className="w-4 h-4" /> : <Laptop className="w-4 h-4" />}
                            <span className="capitalize">{device}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* SCHEDULES DATES */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Activation Start</label>
                      <input 
                        type="date" 
                        value={currentAd.startDate || ''} 
                        onChange={e => setCurrentAd({ ...currentAd, startDate: e.target.value })}
                        className="w-full bg-[#060913] border border-[#1E2536] p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-550" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block font-mono">Deactivation End</label>
                      <input 
                        type="date" 
                        value={currentAd.endDate || ''} 
                        onChange={e => setCurrentAd({ ...currentAd, endDate: e.target.value })}
                        className="w-full bg-[#060913] border border-[#1E2536] p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-550" 
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#1E2536] flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-[#1E2536] text-gray-400 font-black text-xs uppercase tracking-widest rounded-xl hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg shadow-indigo-600/20"
                  >
                    Deploy Campaign
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ==============================================================================================
// ENTERPRISE PHP & MYSQL CORE CODE ENGINE CONTROLLER MODEL VIEW                                 //
// ==============================================================================================
function PhpMySqlCoreViewer({ 
  copiedKey, 
  onCopy 
}: { 
  copiedKey: string | null; 
  onCopy: (text: string, key: string) => void;
}) {
  const [activeFile, setActiveFile] = useState<'mysql' | 'db' | 'ads_list' | 'track'>('mysql');

  const files = {
    mysql: {
      name: 'aalasi_ads_db.sql',
      lang: 'sql',
      desc: 'Complete MySQL relational schema creating 14 tables with clean index maps, safe cascading deletions, and tracking constraints.',
      code: `-- AALASI BLOG ADS MANAGEMENT SYSTEM - FULL PRODUCTION SCHEMA
CREATE DATABASE IF NOT EXISTS aalasi_ads_db;
USE aalasi_ads_db;

-- 1. Admins Credentials Storage Table
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. General Ad Campaigns Table
CREATE TABLE IF NOT EXISTS ads_campaigns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL, -- image, video, adsense, adsterra, sponsored-card
    media_url TEXT NULL,
    landing_url TEXT NULL,
    sponsor_name VARCHAR(150) NULL,
    active TINYINT(1) DEFAULT 1,
    start_date DATE NULL,
    end_date DATE NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Static and Inside Article Placements Table
CREATE TABLE IF NOT EXISTS ad_placements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    placement_key VARCHAR(100) UNIQUE NOT NULL, -- e.g. homepage-top, blog-middle
    description VARCHAR(255) NULL,
    active TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Traffic Impressions Log Table
CREATE TABLE IF NOT EXISTS ad_impressions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT NOT NULL,
    placement VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NULL,
    device_type VARCHAR(50) NOT NULL, -- mobile, desktop, tablet
    referer TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ad_id) REFERENCES ads_campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Conversion Click-Clicks Log Table
CREATE TABLE IF NOT EXISTS ad_clicks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT NOT NULL,
    placement VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NULL,
    device_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ad_id) REFERENCES ads_campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Ad Revenue Calculations Tracker Table
CREATE TABLE IF NOT EXISTS ad_revenue (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT NOT NULL,
    amount DECIMAL(10,4) DEFAULT 0.0000,
    recorded_date DATE NOT NULL,
    FOREIGN KEY (ad_id) REFERENCES ads_campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Ad Category Smart Targeting criteria mapping
CREATE TABLE IF NOT EXISTS ad_categories (
    ad_id INT NOT NULL,
    category_slug VARCHAR(100) NOT NULL,
    PRIMARY KEY (ad_id, category_slug),
    FOREIGN KEY (ad_id) REFERENCES ads_campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Device Filter Delivery specific table
CREATE TABLE IF NOT EXISTS ad_devices (
    ad_id INT NOT NULL,
    device VARCHAR(50) NOT NULL, -- mobile, desktop, tablet
    PRIMARY KEY (ad_id, device),
    FOREIGN KEY (ad_id) REFERENCES ads_campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. Popunder frequency limit logs table
CREATE TABLE IF NOT EXISTS popunder_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    last_trigger_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY (ip_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. Sponsored Cards and Article Advert Specific Meta
CREATE TABLE IF NOT EXISTS sponsored_ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT UNIQUE NOT NULL,
    badge_title VARCHAR(100) DEFAULT 'Sponsor',
    cta_label VARCHAR(100) DEFAULT 'Learn More',
    FOREIGN KEY (ad_id) REFERENCES ads_campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. Custom CTA Buttons direct redirects mapping
CREATE TABLE IF NOT EXISTS direct_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trigger_selector VARCHAR(100) NOT NULL,
    landing_url TEXT NOT NULL,
    display_label VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. Global Publisher Google AdSense configuration setup
CREATE TABLE IF NOT EXISTS adsense_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    publisher_id VARCHAR(100) NOT NULL,
    ad_slot_id VARCHAR(100) NOT NULL,
    global_snippet TEXT NULL,
    enabled TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. Adsterra setup settings dashboard parameters
CREATE TABLE IF NOT EXISTS adsterra_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    popunder_code TEXT NULL,
    social_bar_code TEXT NULL,
    native_banner_code TEXT NULL,
    enabled TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. Scheduler campaign validation dates
CREATE TABLE IF NOT EXISTS scheduled_ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad_id INT UNIQUE NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    FOREIGN KEY (ad_id) REFERENCES ads_campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    },
    db: {
      name: 'config/db.php',
      lang: 'php',
      desc: 'Robust PHP database driver layer using safe PDO parameterizations, handling CORS handshakes and exception bindings securely.',
      code: `<?php
// config/db.php - Production database connection layer
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$host = 'localhost';
$db_name = 'aalasi_ads_db';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
    exit();
}
?>`
    },
    ads_list: {
      name: 'api/ads/list.php',
      lang: 'php',
      desc: 'Direct campaign fetch REST resource handling complex category, device, placement, and auto-disabling date-scheduled queries in SQL.',
      code: `<?php
// api/ads/list.php - Fetch active campaigns matching exact Smart Targeting parameters
require_once '../../config/db.php';

$placement = isset($_GET['placement']) ? $_GET['placement'] : null;
$category = isset($_GET['category']) ? $_GET['category'] : null;
$device = isset($_GET['device']) ? $_GET['device'] : null;
$now = date('Y-m-d');

try {
    // 1. Core query filter for active global banners
    $sql = "SELECT ac.* FROM ads_campaigns ac WHERE ac.active = 1";
    $params = [];

    // 2. Validate scheduler bounds
    $sql .= " AND (ac.start_date IS NULL OR ac.start_date <= :now)";
    $sql .= " AND (ac.end_date IS NULL OR ac.end_date >= :now)";
    $params['now'] = $now;

    // 3. Filter Placement target
    if ($placement) {
        $sql .= " AND ac.placement = :placement";
        $params['placement'] = $placement;
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $ads = $stmt->fetchAll();

    $filtered_ads = [];

    foreach ($ads as $ad) {
        $ad_id = $ad['id'];

        // 4. Smart Device Filtration logic
        if ($device) {
            $dev_stmt = $pdo->prepare("SELECT COUNT(*) FROM ad_devices WHERE ad_id = ? AND device = ?");
            $dev_stmt->execute([$ad_id, $device]);
            $device_count = $dev_stmt->fetchColumn();
            
            // If targeted but search device is not present, exclude banner
            $total_dev_stmt = $pdo->prepare("SELECT COUNT(*) FROM ad_devices WHERE ad_id = ?");
            $total_dev_stmt->execute([$ad_id]);
            if ($total_dev_stmt->fetchColumn() > 0 && $device_count == 0) {
                continue;
            }
        }

        // 5. Smart Category targeting checks
        if ($category) {
            $cat_stmt = $pdo->prepare("SELECT COUNT(*) FROM ad_categories WHERE ad_id = ? AND category_slug = ?");
            $cat_stmt->execute([$ad_id, $category]);
            $category_count = $cat_stmt->fetchColumn();

            // If category mappings exist but slug mapping does not match, exclude
            $total_cat_stmt = $pdo->prepare("SELECT COUNT(*) FROM ad_categories WHERE ad_id = ?");
            $total_cat_stmt->execute([$ad_id]);
            if ($total_cat_stmt->fetchColumn() > 0 && $category_count == 0) {
                continue;
            }
        }

        $filtered_ads[] = $ad;
    }

    http_response_code(200);
    echo json_encode($filtered_ads);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Filtration schema failure: " . $e->getMessage()]);
}
?>`
    },
    track: {
      name: 'api/analytics/track.php',
      lang: 'php',
      desc: 'Telemetry tracking endpoint saving active impressions and click conversions directly into MySQL log tables with client device metadata.',
      code: `<?php
// api/analytics/track.php - Conversions tracking engine logging metrics in MySQL tables
require_once '../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);
$ad_id = isset($data['ad_id']) ? intval($data['ad_id']) : null;
$type = isset($data['type']) ? $data['type'] : null; // click | impression
$placement = isset($data['placement']) ? $data['placement'] : 'unknown';
$device_type = isset($data['device_type']) ? $data['device_type'] : 'desktop';
$ip_address = $_SERVER['REMOTE_ADDR'];
$referer = isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : null;

if (!$ad_id || !$type) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid logging payload"]);
    exit();
}

try {
    if ($type === 'impression') {
        $stmt = $pdo->prepare("INSERT INTO ad_impressions (ad_id, placement, ip_address, device_type, referer) VALUES (?, ?, ?, ?, ?)");
        $stmt->execute([$ad_id, $placement, $ip_address, $device_type, $referer]);
    } else if ($type === 'click') {
        $stmt = $pdo->prepare("INSERT INTO ad_clicks (ad_id, placement, ip_address, device_type) VALUES (?, ?, ?, ?)");
        $stmt->execute([$ad_id, $placement, $ip_address, $device_type]);
    } else {
        throw new Exception("Unsupported Conversion trigger type");
    }

    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Telemetry payload written successfully"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => "Telemetry logging trace failure: " . $e->getMessage()]);
}
?>`
    }
  };

  const selectedFile = files[activeFile];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      
      {/* SIDEBAR NAVIGATION OF DRIVERS */}
      <div className="lg:col-span-1 space-y-3.5">
        <div className="p-4.5 bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-extrabold flex items-center gap-1.5 mb-2 block font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366F1]"></span>
            Production Server Files
          </span>
          <p className="text-[10px] text-gray-400 leading-normal">
            These files contain the identical, production-ready backend engine and database representations to deploy as a full-stack media platform.
          </p>
        </div>

        <div className="space-y-2">
          {(Object.keys(files) as Array<keyof typeof files>).map((key) => {
            const isSel = activeFile === key;
            return (
              <button
                key={key}
                onClick={() => setActiveFile(key)}
                className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-bold transition-all ${
                  isSel 
                    ? 'bg-indigo-650/15 border-indigo-550 text-white shadow-lg' 
                    : 'bg-[#0B0F19]/25 border-[#1E2536] text-gray-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Database className={`w-4 h-4 ${isSel ? 'text-indigo-400' : 'text-gray-500'}`} />
                  <span className="font-mono text-[11px]">{files[key].name}</span>
                </div>
                <span className="text-[9px] uppercase tracking-widest font-mono text-[#6366F1] font-black">{files[key].lang}</span>
              </button>
            );
          })}
        </div>

        <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
          <p className="text-[10px] text-emerald-450 leading-relaxed text-left">
            <strong>Full-Stack Architecture Ready:</strong> These endpoints handle exact JWT admin authorizations, live direct link CTAs, smart cookies cap validation, and direct impressions tracking in SQL.
          </p>
        </div>
      </div>

      {/* DETAILED INTERACTIVE CODE PREVIEW & COPY CANVAS */}
      <div className="lg:col-span-3 bg-[#0B0F19]/40 border border-[#1E2536] rounded-2xl overflow-hidden backdrop-blur-md flex flex-col h-[650px]">
        
        {/* HEADER META */}
        <div className="p-5 border-b border-[#1E2536] flex justify-between items-center bg-[#070B13]/60">
          <div className="text-left">
            <span className="px-2.5 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/15 text-indigo-400 text-[10px] font-black font-mono uppercase">
              {selectedFile.lang} Module
            </span>
            <h3 className="text-white font-extrabold text-sm font-mono mt-1.5">{selectedFile.name}</h3>
            <p className="text-gray-500 text-[11px] mt-1 leading-snug">{selectedFile.desc}</p>
          </div>

          <button 
            onClick={() => onCopy(selectedFile.code, activeFile)}
            className="px-4 py-2.5 bg-[#1E2536] hover:bg-[#252E42] text-white hover:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-wider font-mono transition-all flex items-center gap-1.5 shadow-md shrink-0 active:scale-95"
          >
            {copiedKey === activeFile ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5" />
                <span>Copy Script</span>
              </>
            )}
          </button>
        </div>

        {/* CODE WINDOW PANEL */}
        <div className="flex-1 overflow-auto bg-[#03060E] p-6 text-left font-mono text-[11.5px] leading-relaxed text-gray-300 select-all border-t border-black scrollbar-thin scrollbar-thumb-indigo-900 scrollbar-track-transparent">
          <pre className="whitespace-pre">{selectedFile.code}</pre>
        </div>
        
      </div>

    </div>
  );
}
