import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Settings, 
  Users, 
  TrendingUp,
  LogOut,
  Edit,
  Trash2,
  Plus,
  MonitorPlay,
  Link as LinkIcon,
  Video,
  X,
  Eye,
  DollarSign,
  BarChart,
  MousePointer,
  ChevronLeft
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { 
  getBlogs, 
  getAds, 
  getCategories, 
  createBlog, 
  deleteBlog,
  getAdminProfile,
  getAnalyticsOverview
} from '../services/firebase';
import { useLocation, useNavigate, Link } from 'react-router-dom';

import { 
  AreaChart, 
  Area, 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

import { ContentBlockEditor } from '../components/ContentBlockEditor';
import { ContentRenderer } from '../components/ContentRenderer';
import { AdminDrafts } from '../components/AdminDrafts';
import { AdminAllBlogs } from '../components/AdminAllBlogs';
import { AdminAds } from '../components/AdminAds';
import { AdminCategories } from '../components/AdminCategories';
import { AdminMedia } from '../components/AdminMedia';
import { AdminTeam } from '../components/AdminTeam';
import { AdminConfig } from '../components/AdminConfig';
import { AdminSEO } from '../components/AdminSEO';

export function Dashboard() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [totalViews, setTotalViews] = useState(0);

  // Dynamic Live Analytics & Profile States
  const [profile, setProfile] = useState<any>({ name: 'Rahul Makwana', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul' });
  const [analytics, setAnalytics] = useState<any>({
    totalViews: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalUsers: 0,
    totalImpressions: 0,
    totalClicks: 0,
    averageCTR: '0.00%',
    estimatedRevenue: 0.0,
    deviceBreakdown: { desktop: 42, mobile: 50, tablet: 8 },
    countryBreakdown: {},
    weeklyStats: []
  });
  const [analyticsLoading, setAnalyticsLoading] = useState(true);
  
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isLivePreview, setIsLivePreview] = useState(true);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [editorData, setEditorData] = useState<any>({});

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  
  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[pathParts.length - 1] || 'dashboard';

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Synchronize admin profile details
  useEffect(() => {
    getAdminProfile()
      .then((data) => {
        if (data) setProfile(data);
      })
      .catch((e) => console.error("Error fetching admin profile setting inside dashboard", e));
  }, [activeTab]);

  // Synchronize live overview telemetry metric
  useEffect(() => {
    if (activeTab === 'dashboard') {
      setAnalyticsLoading(true);
      getAnalyticsOverview()
        .then((data) => {
          if (data) setAnalytics(data);
        })
        .catch((e) => console.error("Failed loading dynamic analytics matrix", e))
        .finally(() => setAnalyticsLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [blogData, adData, categoryData, viewsData] = await Promise.all([
          getBlogs(), 
          getAds(), 
          getCategories(),
          fetch('/api/total-views').then(r => r.json())
        ]);
        setBlogs(blogData);
        setAds(adData);
        setCategories(categoryData);
        setTotalViews(viewsData.count);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDashboardData();
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/aalsi-admin-login');
  };

  const handleCreateNew = () => {
    setEditorData({
      title: '', slug: '', content: '', excerpt: '', 
      category_slug: 'trending', type: 'text', featured_image: '', 
      thumbnail: '', video_url: '', banner_image: '', 
      seo_title: '', seo_description: '',
      featured: false, is_trending: false,
      featured_category_blog: false
    });
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditorData((prev: any) => ({ ...prev, [field]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBlog = async (status: 'draft' | 'published') => {
    try {
      const saved = await createBlog({ ...editorData, status });
      if (editorData.id) {
        setBlogs(blogs.map(b => b.id === saved.id ? saved : b));
      } else {
        setBlogs([...blogs, saved]);
      }
      setIsEditorOpen(false);
    } catch (err) {
      console.error('Failed to save blog:', err);
    }
  };

  const handlePublishDraft = async (id: string | number) => {
    try {
      const draftToPublish = blogs.find(b => b.id == id);
      if (draftToPublish) {
        const saved = await createBlog({ ...draftToPublish, status: 'published' });
        setBlogs(blogs.map(b => b.id == id ? saved : b));
      }
    } catch (err) {
      console.error('Failed to publish draft:', err);
    }
  };

  const handleDeleteBlog = async (id: string | number) => {
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter(b => b.id != id));
    } catch (err) {
      console.error('Failed to delete blog/draft:', err);
    }
  };

  const stats = [
    { name: 'Total Posts', value: (blogs.length || analytics.totalBlogs).toString(), change: `+${analytics.publishedBlogs} Live`, icon: FileText },
    { name: 'Total Views', value: (totalViews || analytics.totalViews).toLocaleString(), change: '+24.4%', icon: Eye },
    { name: 'Estimated Revenue', value: `$${analytics.estimatedRevenue.toFixed(2)}`, change: '+15.2%', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#060913] w-full flex flex-col md:flex-row gap-0 relative font-sans">
      <Helmet>
        <title>Admin Dashboard | Aalasi Blog</title>
      </Helmet>

      {/* Mobile Header Toggle */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0B0F19] border-b border-[#1E2536] sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 flex-shrink-0">
            <img 
              src="/uploads/aalasi_logo.png?v=fresh" 
              alt="Aalasi Logo" 
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const fallback = parent.querySelector('.logo-fallback');
                  if (fallback) (fallback as HTMLElement).style.display = 'flex';
                }
              }}
              className="w-8 h-8 rounded-full border border-indigo-500/20 object-cover"
            />
            <div className="logo-fallback hidden absolute inset-0 rounded bg-indigo-600 items-center justify-center text-white font-bold text-sm select-none">
              A
            </div>
          </div>
          <span className="font-extrabold text-white text-md tracking-tight">
            Aalasi Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <img 
            src={profile?.avatar} 
            alt="Admin Avatar" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name || 'Admin'}`;
            }}
            className="w-8 h-8 rounded-full border border-indigo-500/20 object-cover bg-gray-950 flex-shrink-0" 
          />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-gray-400 hover:text-white transition-colors">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Icons.Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0 bg-[#0B0F19] text-gray-300 min-h-screen p-6 border-r border-[#1E2536] transition-all absolute md:static z-40`}>
        <div className="sticky top-8">
          <div className="hidden md:flex items-center gap-3 mb-6 pl-2">
            <div className="relative w-9 h-9 flex-shrink-0">
              <img 
                src="/uploads/aalasi_logo.png?v=fresh" 
                alt="Aalasi Logo" 
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                  const parent = (e.target as HTMLImageElement).parentElement;
                  if (parent) {
                    const fallback = parent.querySelector('.logo-fallback');
                    if (fallback) (fallback as HTMLElement).style.display = 'flex';
                  }
                }}
                className="w-9 h-9 rounded-full border border-indigo-500/30 object-cover shadow-[0_0_15px_rgba(79,70,229,0.4)]"
              />
              <div className="logo-fallback hidden absolute inset-0 rounded bg-indigo-600 items-center justify-center text-white font-bold text-lg select-none">
                A
              </div>
            </div>
            <div>
              <h3 className="font-bold text-white text-md leading-none">Aalasi Blog</h3>
              <p className="text-[10px] text-gray-500 font-mono mt-1">CMS Engine v2.1</p>
            </div>
          </div>

          {/* Admin User Profile Widget in Sidebar */}
          <div className="flex items-center gap-3 p-3 bg-[#111624] rounded-xl border border-[#1E2536] mb-8">
            <img 
              src={profile?.avatar} 
              alt="Admin display profile" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile?.name || 'Admin'}`;
              }}
              className="w-10 h-10 rounded-full border border-indigo-500/20 object-cover bg-gray-950 flex-shrink-0" 
            />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white leading-tight truncate">{profile?.name || 'Rahul Makwana'}</h4>
              <p className="text-[9px] text-gray-500 font-mono mt-0.5 leading-none uppercase tracking-wider select-none">Webmaster</p>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
              { id: 'add-blog', name: 'Story Editor', icon: Plus },
              { id: 'blogs', name: 'All Content', icon: FileText },
              { id: 'drafts', name: 'Unfinished Drafts', icon: Icons.Clock },
              { id: 'ads-manager', name: 'Ads Management', icon: MonitorPlay },
              { id: 'categories', name: 'Segments', icon: LayoutDashboard },
              { id: 'media', name: 'Assets', icon: MonitorPlay },
              { id: 'users', name: 'Team', icon: Users },
              { id: 'settings', name: 'Core Config', icon: Settings },
              { id: 'seo', name: 'SEO Engine', icon: Settings },
            ].map((item) => {
              const isActive = (!isEditorOpen && (activeTab === item.id || (item.id === 'ads-manager' && (activeTab === 'ads' || activeTab === 'ads-manager')))) || (isEditorOpen && item.id === 'add-blog');
              return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'add-blog') {
                    handleCreateNew();
                  } else {
                    setIsEditorOpen(false);
                    navigate(`/admin/${item.id}`);
                  }
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-gray-400 hover:bg-[#1E2536] hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </button>
            )})}
            <div className="pt-8 mt-8 border-t border-[#1E2536] space-y-1">
              <a href="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm font-medium text-gray-400 hover:bg-[#1E2536] hover:text-white transition-colors">
                Back to Site
              </a>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isEditorOpen ? 'p-0 overflow-hidden h-screen' : 'p-8'} w-full text-gray-300`}>
        {isEditorOpen ? (
          <div className="animate-in fade-in h-screen flex flex-col bg-[#060913]">
            {/* Editor Top Bar */}
            <div className="px-6 py-3 border-b border-[#1E2536] flex items-center justify-between bg-[#0B0F19] z-50">
               <div className="flex items-center gap-4">
                 <button onClick={handleCloseEditor} className="p-2 hover:bg-[#1E2536] rounded-full transition-colors text-gray-400 hover:text-white">
                   <Icons.ChevronLeft className="w-6 h-6" />
                 </button>
                 <div className="h-6 w-px bg-[#1E2536]"></div>
                 <div>
                   <h2 className="text-white font-bold text-sm uppercase tracking-wider">{editorData.id ? 'Editing Article' : 'Drafting New Story'}</h2>
                   <p className="text-[10px] text-gray-500 font-mono">Last saved: {new Date().toLocaleTimeString()}</p>
                 </div>
               </div>

               <div className="flex items-center gap-4">
                  <div className="flex items-center bg-[#1E2536] rounded-xl p-1">
                    <button 
                      onClick={() => setIsLivePreview(false)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg transition-all ${!isLivePreview ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
                    >
                      Editor
                    </button>
                    <button 
                      onClick={() => setIsLivePreview(true)}
                      className={`px-3 py-1 text-[10px] font-bold uppercase rounded-lg transition-all ${isLivePreview ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
                    >
                      Live Preview
                    </button>
                  </div>
                  <div className="h-6 w-px bg-[#1E2536]"></div>
                  <button onClick={() => handleSaveBlog('draft')} className="px-4 py-2 text-gray-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors">Save Draft</button>
                  <button onClick={() => handleSaveBlog('published')} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-indigo-600/20">Publish Now</button>
               </div>
            </div>
            
            <div className="flex-1 flex overflow-hidden">
               {/* EDITOR COLUMN */}
               <div className={`overflow-y-auto custom-scrollbar transition-all duration-500 ${isLivePreview ? 'w-1/2 border-r border-[#1E2536]' : 'w-full max-w-4xl mx-auto'}`}>
                  <div className="p-10 space-y-12">
                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-600 tracking-[0.2em]">Story Settings</label>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-400">Primary Title</label>
                             <input type="text" value={editorData.title} onChange={e => setEditorData({...editorData, title: e.target.value})} className="w-full px-0 py-2 bg-transparent border-b border-[#1E2536] text-3xl font-black text-white outline-none focus:border-indigo-500 transition-all placeholder:text-gray-800" placeholder="Your Catchy Title..." />
                           </div>
                           <div className="space-y-2">
                             <label className="text-xs font-bold text-gray-400">Category</label>
                             <select value={editorData.category_slug} onChange={e => setEditorData({...editorData, category_slug: e.target.value})} className="w-full px-0 py-2 bg-transparent border-b border-[#1E2536] text-white outline-none focus:border-indigo-500 transition-all">
                               <option value="" disabled>Select Segment</option>
                               {categories.map(c => <option key={c.id} value={c.slug}>{c.title}</option>)}
                             </select>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] uppercase font-black text-gray-600 tracking-[0.2em]">Visual Assets</label>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-400">Featured Image</label>
                              <div className="h-40 rounded-2xl border-2 border-dashed border-[#1E2536] bg-[#0B0F19] overflow-hidden relative group">
                                {editorData.featured_image ? (
                                  <img src={editorData.featured_image} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-600">
                                    <Icons.CloudUpload className="w-8 h-8 mb-2" />
                                    <span className="text-[10px] font-bold">DROP COVER IMAGE</span>
                                  </div>
                                )}
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'featured_image')} className="absolute inset-0 opacity-0 cursor-pointer" />
                              </div>
                           </div>
                           <div className="space-y-2">
                              <label className="text-xs font-bold text-gray-400">Article Brief</label>
                              <textarea value={editorData.excerpt} onChange={e => setEditorData({...editorData, excerpt: e.target.value})} className="w-full h-40 bg-[#0B0F19] border border-[#1E2536] rounded-2xl p-4 text-sm text-gray-300 outline-none focus:border-indigo-500 transition-all resize-none" placeholder="Write a short summary to hook readers..."></textarea>
                           </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <label className="text-[10px] uppercase font-black text-gray-600 tracking-[0.2em]">Story Builder</label>
                        <ContentBlockEditor 
                          content={editorData.content} 
                          onChange={(newContent) => setEditorData({ ...editorData, content: newContent })} 
                        />
                      </div>

                      <div className="pt-10 border-t border-[#1E2536] space-y-6">
                         <label className="text-[10px] uppercase font-black text-gray-600 tracking-[0.2em]">SEO Core</label>
                         <div className="grid grid-cols-2 gap-6">
                            <input type="text" value={editorData.seo_title} onChange={e => setEditorData({...editorData, seo_title: e.target.value})} className="bg-[#0B0F19] border border-[#1E2536] p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-500" placeholder="Meta Title..." />
                            <input type="text" value={editorData.slug} onChange={e => setEditorData({...editorData, slug: e.target.value})} className="bg-[#0B0F19] border border-[#1E2536] p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-500" placeholder="URL Slug Override..." />
                            <textarea value={editorData.seo_description} onChange={e => setEditorData({...editorData, seo_description: e.target.value})} className="col-span-2 bg-[#0B0F19] border border-[#1E2536] p-3 rounded-xl text-xs text-white outline-none focus:border-indigo-500 h-20" placeholder="Meta Description..."></textarea>
                         </div>
                      </div>
                  </div>
               </div>

               {/* PREVIEW COLUMN */}
               {isLivePreview && (
                 <div className="flex-1 bg-white overflow-y-auto custom-scrollbar-white">
                    {/* Simulated Browser Bar */}
                    <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-4 py-2 flex items-center justify-between z-10">
                       <div className="flex gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                       </div>
                       <div className="bg-white border border-gray-200 rounded-md px-10 py-1 text-[10px] text-gray-400 font-mono truncate max-w-xs">
                         aalasiblog.com/blog/{editorData.slug || 'preview'}
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => setPreviewDevice('mobile')}
                            className={`p-1.5 rounded transition-colors ${previewDevice === 'mobile' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            <Icons.Smartphone className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => setPreviewDevice('desktop')}
                            className={`p-1.5 rounded transition-colors ${previewDevice === 'desktop' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            <Icons.Monitor className="w-3.5 h-3.5" />
                          </button>
                       </div>
                    </div>
                    
                    {/* Real Article Mockup */}
                    <div className={`transition-all duration-500 mx-auto bg-white ${previewDevice === 'mobile' ? 'max-w-[375px] shadow-2xl my-10 border-[12px] border-gray-900 rounded-[50px] min-h-[700px]' : 'max-w-4xl'}`}>
                      <article className={`p-8 text-black ${previewDevice === 'mobile' ? 'h-full overflow-y-auto' : ''}`}>
                         <div className="mb-10 text-center">
                         <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6 inline-block shadow-lg shadow-indigo-600/30">
                           {editorData.category_slug || 'CONCEPT'}
                         </span>
                         <h1 className="text-5xl font-black text-gray-900 leading-[1.1] mb-6 uppercase tracking-tighter">
                           {editorData.title || 'Your Article Title'}
                         </h1>
                         <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span className="text-indigo-600">Aalasi Team</span>
                            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                            <span>{new Date().toDateString()}</span>
                         </div>
                       </div>

                       {editorData.featured_image && (
                         <div className="mb-14 -mx-10">
                            <img src={editorData.featured_image} className="w-full h-[400px] object-cover rounded-3xl shadow-2xl" alt="" />
                         </div>
                       )}

                       <div className="blog-content-preview">
                          <ContentRenderer content={editorData.content} />
                       </div>
                    </article>
                    </div>
                 </div>
               )}
            </div>
          </div>
        ) : activeTab === 'blogs' ? (
           <AdminAllBlogs blogs={blogs} onEdit={(blog) => { setEditorData(blog); setIsEditorOpen(true); }} onDelete={handleDeleteBlog} />
        ) : activeTab === 'drafts' ? (
           <AdminDrafts blogs={blogs} onEdit={(blog) => { setEditorData(blog); setIsEditorOpen(true); }} onPublish={handlePublishDraft} onDelete={handleDeleteBlog} />
        ) : (activeTab === 'ads' || activeTab === 'ads-manager') ? (
           <AdminAds />
        ) : activeTab === 'categories' ? (
           <AdminCategories categories={categories} onUpdateCategories={setCategories} />
        ) : activeTab === 'media' ? (
           <AdminMedia />
        ) : activeTab === 'users' ? (
           <AdminTeam />
        ) : activeTab === 'settings' ? (
           <AdminConfig onSave={() => {
             getAdminProfile()
               .then((data) => {
                 if (data) setProfile(data);
               })
               .catch((e) => console.error("Error refreshing admin profile in dashboard", e));
           }} />
        ) : activeTab === 'seo' ? (
           <AdminSEO />
        ) : activeTab === 'dashboard' ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 animate-in fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-black text-white uppercase tracking-wider">Enterprise Performance Analytics</h1>
                <p className="text-xs text-gray-400 font-mono">Real-time live transactional database counts. No stale data.</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold font-mono px-3 py-1.5 bg-[#0B0F19] border border-[#1E2536] rounded-xl text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                LIVE METRICS FEED
              </div>
            </div>

            {/* Quick KPI Bento Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'Total Web Views', value: analytics.totalViews.toLocaleString(), sub: `Across ${analytics.totalBlogs} articles`, icon: Eye, color: 'text-indigo-400' },
                { name: 'Ad Impressions', value: analytics.totalImpressions.toLocaleString(), sub: 'Raw campaign banners loaded', icon: BarChart, color: 'text-sky-400' },
                { name: 'Ad Clicks Tracker', value: analytics.totalClicks.toLocaleString(), sub: 'Direct user link interactions', icon: MousePointer, color: 'text-emerald-400' },
                { name: 'Average Campaign CTR', value: analytics.averageCTR, sub: 'Interactive clicks conversion', icon: TrendingUp, color: 'text-purple-400' }
              ].map((kpi, idx) => (
                <div key={idx} className="bg-[#0B0F19] rounded-2xl p-6 border border-[#1E2536] hover:border-indigo-500/20 transition-all shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono uppercase text-gray-500 tracking-wider bg-gray-950 px-2 py-0.5 rounded-md border border-[#1E2536]/40">{kpi.name}</span>
                    <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                  <p className="text-2xl font-black text-white tracking-tight">{kpi.value}</p>
                  <p className="text-[9px] text-[#A2A4B0] font-mono mt-1 font-medium leading-none">{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Trailing Performance & Interaction Visualizer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Line Area Chart: Trailing Telemetry */}
              <div className="bg-[#0B0F19] p-6 rounded-2xl border border-[#1E2536] shadow-xl space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase text-indigo-400 font-mono tracking-widest flex items-center gap-2">📊 Daily Viewership & Revenue</h3>
                  <p className="text-[10px] text-gray-500 leading-normal">Real-time daily interaction peaks recorded over 7-day windows.</p>
                </div>
                <div className="w-full" style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={analytics.weeklyStats}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2536" />
                      <XAxis dataKey="day" stroke="#4B5563" fontSize={10} tickLine={false} />
                      <YAxis stroke="#4B5563" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1E2536', borderRadius: '10px', fontSize: '11px', color: '#fff' }}
                      />
                      <Legend fontSize={10} boxSize={10} wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                      <Area name="Page Views" type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#viewsGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Bar Chart: Ad Performance */}
              <div className="bg-[#0B0F19] p-6 rounded-2xl border border-[#1E2536] shadow-xl space-y-4">
                <div>
                  <h3 className="text-xs font-black uppercase text-sky-400 font-mono tracking-widest flex items-center gap-2">⚡ Ad Impressions & Click Conversions</h3>
                  <p className="text-[10px] text-gray-500 leading-normal">Interactive clicks compared against system direct-link impressions.</p>
                </div>
                <div className="w-full" style={{ height: 280 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={analytics.weeklyStats}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2536" />
                      <XAxis dataKey="day" stroke="#4B5563" fontSize={10} tickLine={false} />
                      <YAxis stroke="#4B5563" fontSize={10} tickLine={false} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#1E2536', borderRadius: '10px', fontSize: '11px', color: '#fff' }}
                      />
                      <Legend wrapperStyle={{ fontSize: '10px', marginTop: '10px' }} />
                      <Bar name="Impressions" dataKey="impressions" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                      <Bar name="Clicks" dataKey="clicks" fill="#34d399" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Geolocations & Device Breakdowns Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Country Distribution */}
              <div className="bg-[#0B0F19] p-6 rounded-2xl border border-[#1E2536] shadow-xl">
                <h3 className="text-xs font-black uppercase text-indigo-400 font-mono tracking-widest mb-4">🌎 Geolocation Demographics</h3>
                <div className="space-y-3">
                  {Object.keys(analytics.countryBreakdown).length === 0 ? (
                    <div className="text-xs text-gray-500 py-6 text-center">No geolocation queries authenticated yet.</div>
                  ) : (
                    Object.entries(analytics.countryBreakdown).map(([country, count]: any, idx) => {
                      const total: number = Object.values(analytics.countryBreakdown).reduce((a: any, b: any) => a + b, 0) as number;
                      const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-white font-mono uppercase">{country}</span>
                            <span className="text-gray-500 font-mono">{count} Views ({percentage}%)</span>
                          </div>
                          <div className="w-full bg-[#111624] h-1.5 rounded-full overflow-hidden border border-[#1E2536]/50">
                            <div 
                              className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Device Segmentation Class list */}
              <div className="bg-[#0B0F19] p-6 rounded-2xl border border-[#1E2536] shadow-xl">
                <h3 className="text-xs font-black uppercase text-pink-400 font-mono tracking-widest mb-4">📱 Device Breakdown</h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[
                    { label: 'Desktop', value: `${analytics.deviceBreakdown.desktop}%`, color: 'bg-indigo-500', note: 'Large monitors' },
                    { label: 'Mobile', value: `${analytics.deviceBreakdown.mobile}%`, color: 'bg-emerald-500', note: 'Phones & handhelds' },
                    { label: 'Tablet', value: `${analytics.deviceBreakdown.tablet}%`, color: 'bg-sky-500', note: 'iPad/Surface devices' }
                  ].map((dev, idx) => (
                    <div key={idx} className="p-4 bg-[#111624] rounded-xl border border-[#1E2536]/80 text-center space-y-1">
                      <div className="flex items-center justify-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${dev.color}`}></span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{dev.label}</span>
                      </div>
                      <p className="text-xl font-black text-white">{dev.value}</p>
                      <p className="text-[8px] text-gray-600 font-mono font-medium leading-none">{dev.note}</p>
                    </div>
                  ))}
                </div>
                <div className="w-full bg-[#111624] h-3 rounded-full flex overflow-hidden border border-[#1E2536]/50">
                  <div style={{ width: `${analytics.deviceBreakdown.desktop}%` }} className="bg-indigo-500 h-full"></div>
                  <div style={{ width: `${analytics.deviceBreakdown.mobile}%` }} className="bg-emerald-500 h-full"></div>
                  <div style={{ width: `${analytics.deviceBreakdown.tablet}%` }} className="bg-sky-500 h-full"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}

        {!isEditorOpen && !['dashboard', 'blogs', 'drafts', 'ads', 'ads-manager', 'users', 'settings', 'seo', 'media', 'categories'].includes(activeTab) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-[50vh] text-center border border-dashed border-[#1E2536] rounded-2xl bg-[#0B0F19] p-8">
            <Settings className="w-16 h-16 text-indigo-500/20 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Section Under Development</h2>
            <p className="text-gray-400">The <strong>{activeTab}</strong> section is currently being built and will be available soon.</p>
          </motion.div>
        )}
        
      </div>

    </div>
  );
}
