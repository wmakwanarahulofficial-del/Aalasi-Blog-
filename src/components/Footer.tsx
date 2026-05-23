import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, Youtube, Facebook, Twitter, Instagram } from 'lucide-react';
import { getSiteConfig } from '../services/api';

export function Footer() {
  const [cfg, setCfg] = useState({
    siteName: "Aalasi Blog",
    motto: "Your premium destination for the latest in technology, business, and lifestyle. Multi-language, AI-ready platform for modern readers.",
    footer: `© ${new Date().getFullYear()} Aalasi Blog. All rights reserved.`,
    contactEmail: "support@aalasi.com",
    telegram: "https://t.me/aalasiblog",
    instagram: "https://instagram.com/aalasiblog",
    youtube: "",
    facebook: "",
    twitter: "",
    siteLogo: "/uploads/aalasi_logo.png?v=fresh"
  });

  useEffect(() => {
    getSiteConfig()
      .then((data) => {
        if (data) {
          setCfg((prev) => ({
            ...prev,
            ...data,
            footer: data.footer || prev.footer
          }));
        }
      })
      .catch((err) => console.error("Error loading site config details in footer", err));
  }, []);

  return (
    <footer className="bg-gray-950 text-white mt-20 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src={cfg.siteLogo} 
                alt={`${cfg.siteName} Logo`} 
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/uploads/aalasi_logo.png?v=fresh";
                }}
                className="w-9 h-9 rounded-full border border-indigo-500/30 object-cover shadow-[0_0_15px_rgba(79,70,229,0.4)]"
              />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 font-sans tracking-tight">
                {cfg.siteName}
              </span>
            </div>
            
            <p className="text-gray-400 text-sm max-w-sm font-sans leading-relaxed">
              {cfg.motto}
            </p>

            {/* Social Media channels */}
            <div className="flex items-center gap-3 pt-2">
              {cfg.contactEmail && (
                <a 
                  href={`mailto:${cfg.contactEmail}`} 
                  title="Contact Email"
                  className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hover:border-indigo-500 flex items-center justify-center text-gray-400 hover:text-indigo-400 transition-all shadow-md group"
                >
                  <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              )}
              {cfg.telegram && (
                <a 
                  href={cfg.telegram} 
                  target="_blank" 
                  rel="noreferrer" 
                  title="Telegram"
                  className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hover:border-sky-500 flex items-center justify-center text-gray-400 hover:text-sky-400 transition-all shadow-md group"
                >
                  <Send className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              )}
              {cfg.instagram && (
                <a 
                  href={cfg.instagram} 
                  target="_blank" 
                  rel="noreferrer" 
                  title="Instagram"
                  className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hover:border-pink-500 flex items-center justify-center text-gray-400 hover:text-pink-400 transition-all shadow-md group"
                >
                  <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              )}
              {cfg.youtube && (
                <a 
                  href={cfg.youtube} 
                  target="_blank" 
                  rel="noreferrer" 
                  title="YouTube"
                  className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hover:border-red-500 flex items-center justify-center text-gray-400 hover:text-red-400 transition-all shadow-md group"
                >
                  <Youtube className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              )}
              {cfg.facebook && (
                <a 
                  href={cfg.facebook} 
                  target="_blank" 
                  rel="noreferrer" 
                  title="Facebook"
                  className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hover:border-blue-500 flex items-center justify-center text-gray-400 hover:text-blue-500 transition-all shadow-md group"
                >
                  <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              )}
              {cfg.twitter && (
                <a 
                  href={cfg.twitter} 
                  target="_blank" 
                  rel="noreferrer" 
                  title="Twitter / X"
                  className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 hover:border-slate-400 flex items-center justify-center text-gray-400 hover:text-slate-200 transition-all shadow-md group"
                >
                  <Twitter className="w-4 h-4 transition-transform group-hover:scale-110" />
                </a>
              )}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-indigo-400 mb-4 font-mono">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link to="/categories" className="hover:text-indigo-400 transition-colors">Categories</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-indigo-400 mb-4 font-mono">Legal</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-900 mt-12 pt-8 text-center text-gray-500 text-xs font-mono">
          <p>{cfg.footer}</p>
        </div>
      </div>
    </footer>
  );
}
