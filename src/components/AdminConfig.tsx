import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Settings, Save, Globe, Eye, MessageSquare, Mail, Share2, CircleSlash, Youtube, Facebook, Twitter, Camera, Loader2 } from 'lucide-react';
import { getAdminProfile, updateAdminProfile, getSiteConfig, updateSiteConfig } from '../services/api';

interface AdminConfigProps {
  onSave?: () => void;
}

export function AdminConfig({ onSave }: AdminConfigProps) {
  const [siteName, setSiteName] = useState('Aalasi Blog');
  const [motto, setMotto] = useState('The Ultimate Tech & Trading Oasis for the Laid-back Intellect.');
  const [footer, setFooter] = useState('© 2026 Aalasi Blog. Made with React, Tailwind, and Love.');
  const [contactEmail, setContactEmail] = useState('support@aalasi.com');
  const [instagram, setInstagram] = useState('https://instagram.com/aalasiblog');
  const [telegram, setTelegram] = useState('https://t.me/aalasiblog');
  const [youtube, setYoutube] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');

  // Interactive configurations toggles
  const [allowComments, setAllowComments] = useState(true);
  const [newsletterActive, setNewsletterActive] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [hasNewSettingsNotification, setHasNewSettingsNotification] = useState(false);

  // Administrative Profile State Hooks
  const [adminName, setAdminName] = useState('Rahul Makwana');
  const [adminAvatar, setAdminAvatar] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul');
  const [profileSaving, setProfileSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // 1. Fetch Admin Profile
    getAdminProfile()
      .then((p) => {
        if (p) {
          setAdminName(p.name || 'Rahul Makwana');
          setAdminAvatar(p.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul');
        }
      })
      .catch((e) => console.error("Error loading admin display profile context details", e));

    // 2. Fetch Global Site configuration
    getSiteConfig()
      .then((cfg) => {
        if (cfg) {
          if (cfg.siteName) setSiteName(cfg.siteName);
          if (cfg.motto) setMotto(cfg.motto);
          if (cfg.footer) setFooter(cfg.footer);
          if (cfg.contactEmail) setContactEmail(cfg.contactEmail);
          if (cfg.instagram) setInstagram(cfg.instagram);
          if (cfg.telegram) setTelegram(cfg.telegram);
          if (cfg.youtube) setYoutube(cfg.youtube);
          if (cfg.facebook) setFacebook(cfg.facebook);
          if (cfg.twitter) setTwitter(cfg.twitter);
        }
      })
      .catch((e) => console.error("Error loading site config details", e));
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      if (data && data.url) {
        setAdminAvatar(data.url);
      }
    } catch (err) {
      console.error("Failed to upload admin avatar:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      // 1. Update Profile (Name & Avatar)
      await updateAdminProfile({ name: adminName, avatar: adminAvatar });

      // 2. Update Site Configuration (Social links, metadata)
      await updateSiteConfig({
        siteName,
        motto,
        footer,
        contactEmail,
        telegram,
        instagram,
        youtube,
        facebook,
        twitter,
        siteLogo: "/uploads/aalasi_logo.png?v=fresh"
      });

      if (onSave) {
        onSave();
      }
      setHasNewSettingsNotification(true);
      setTimeout(() => setHasNewSettingsNotification(false), 3000);
    } catch (err) {
      console.error("Failed to update config settings admin & site data:", err);
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center bg-[#0B0F19] p-6 rounded-2xl border border-[#1E2536]">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Core Config & Branding</h1>
          <p className="text-xs text-gray-400">Govern general metadata values, contact routes, social channels, and core feature triggers.</p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Settings Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2"><Globe className="w-4 h-4" /> Global Site Identity</h2>
            
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Web Project Brand Name</label>
                <input 
                  type="text" 
                  value={siteName} 
                  onChange={e => setSiteName(e.target.value)}
                  className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Active Motto / Catchphrase</label>
                <input 
                  type="text" 
                  value={motto} 
                  onChange={e => setMotto(e.target.value)}
                  className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Active Copyright Footer Text</label>
                <input 
                  type="text" 
                  value={footer} 
                  onChange={e => setFooter(e.target.value)}
                  className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2"><Share2 className="w-4 h-4" /> Channels & Inbound Contact</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Support / Contact Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input 
                    type="email" 
                    value={contactEmail} 
                    onChange={e => setContactEmail(e.target.value)}
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Official Telegram Feed Channel</label>
                <input 
                  type="text" 
                  value={telegram} 
                  onChange={e => setTelegram(e.target.value)}
                  placeholder="https://t.me/..."
                  className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Official Instagram Link</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-xs font-bold text-gray-500">IG</span>
                  <input 
                    type="text" 
                    value={instagram} 
                    onChange={e => setInstagram(e.target.value)}
                    placeholder="https://instagram.com/..."
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Official YouTube Link</label>
                <div className="relative">
                  <Youtube className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    value={youtube} 
                    onChange={e => setYoutube(e.target.value)}
                    placeholder="https://youtube.com/..."
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Official Facebook Link</label>
                <div className="relative">
                  <Facebook className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    value={facebook} 
                    onChange={e => setFacebook(e.target.value)}
                    placeholder="https://facebook.com/..."
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-gray-400">Official Twitter / X Link</label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                  <input 
                    type="text" 
                    value={twitter} 
                    onChange={e => setTwitter(e.target.value)}
                    placeholder="https://twitter.com/..."
                    className="w-full bg-[#111624] border border-[#1E2536] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Switches Right Side */}
        <div className="space-y-6">
          {/* Admin Persona Customization */}
          <div className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-2xl space-y-4">
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2">🕵️‍♂️ Admin Panel Persona</h2>
            <p className="text-[10px] text-gray-400 leading-normal">Set your administrative photo and login signature, shown across author headings and layouts.</p>
            
            <div className="flex flex-col items-center gap-4 p-4 bg-[#111624] rounded-xl border border-[#1E2536] mt-2 text-center">
              <div className="relative group overflow-hidden rounded-full w-20 h-20 border-2 border-indigo-500/30 shadow-[0_0_15px_rgba(79,70,229,0.2)] bg-gray-950 flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <img 
                  src={adminAvatar} 
                  alt="Avatar Preview" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${adminName || 'Admin'}`;
                  }}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" 
                />
                
                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mb-0.5" />
                      <span className="text-[8px] uppercase tracking-wider font-extrabold font-mono">Upload Photo</span>
                    </>
                  )}
                </div>
              </div>
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                accept="image/*"
                className="hidden"
              />

              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white leading-tight truncate">{adminName || 'Rahul Makwana'}</h4>
                <p className="text-[9px] text-indigo-400 font-mono leading-none mt-1 uppercase font-bold tracking-wider">System Administrator</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-gray-400">Owner Name</label>
                <input 
                  type="text" 
                  value={adminName} 
                  onChange={e => setAdminName(e.target.value)}
                  className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-gray-400">Avatar Image Link or Upload Above</label>
                <input 
                  type="text" 
                  value={adminAvatar} 
                  onChange={e => setAdminAvatar(e.target.value)}
                  placeholder="e.g. https://domain.com/photo.jpg or Rahul"
                  className="w-full bg-[#111624] border border-[#1E2536] rounded-xl px-3 py-2 text-[10px] text-white focus:border-indigo-500 outline-none font-mono"
                  required
                />
              </div>
            </div>
          </div>

          <div className="bg-[#0B0F19] border border-[#1E2536] p-6 rounded-2xl space-y-5">
            <h2 className="text-xs font-black text-indigo-400 uppercase tracking-widest font-mono flex items-center gap-2"><Settings className="w-4 h-4" /> System Toggles</h2>
            
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 bg-[#111624] rounded-xl border border-[#1E2536]/80">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Allow Articles Comments</h4>
                  <p className="text-[9px] text-gray-500 font-medium">Allows community readers to leave active feedback.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={allowComments} onChange={e => setAllowComments(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-[#0B0F19] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650 peer-checked:after:bg-white border border-[#1E2536]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#111624] rounded-xl border border-[#1E2536]/80">
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight">Newsletter signups</h4>
                  <p className="text-[9px] text-gray-500 font-medium font-mono">Enable active weekly inbox mailing letters.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={newsletterActive} onChange={e => setNewsletterActive(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-[#0B0F19] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650 peer-checked:after:bg-white border border-[#1E2536]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#111624] rounded-xl border border-[#1E2536]/80">
                <div>
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-tight">Maintenance Mode</h4>
                  <p className="text-[9px] text-gray-500 font-medium">Bridges the web under development lockdown.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={maintenanceMode} onChange={e => setMaintenanceMode(e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-[#0B0F19] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-650 peer-checked:after:bg-white border border-[#1E2536]"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              disabled={profileSaving}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-[0.15em] rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-55"
            >
              <Save className="w-4 h-4" /> {profileSaving ? 'Saving Context...' : 'Save Core Branding'}
            </button>
            <AnimatePresence>
              {hasNewSettingsNotification && (
                <motion.div 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0 }}
                  className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] text-center py-2 rounded-xl font-bold font-mono"
                >
                  🎉 Dynamic configuration saved successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </form>
    </motion.div>
  );
}
