import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Home, Clock, TrendingUp, Grid, X, Info, Phone, Moon, Sun, Search, Lock } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../context/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
    onClose();
  };

  const navItems = [
    { name: t('home'), path: '/', icon: Home },
    { name: t('latest_blogs'), path: '/latest', icon: Clock },
    { name: t('trending'), path: '/trending', icon: TrendingUp },
    { name: t('categories'), path: '/categories', icon: Grid },
    { name: t('about') || 'About Us', path: '/about', icon: Info },
    { name: t('contact') || 'Contact', path: '/contact', icon: Phone },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-950/60 backdrop-blur-sm z-[60] lg:hidden"
          />
          
          {/* Mobile Drawer (Premium Dark Glassmorphism) */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 w-[320px] max-w-[85vw] bg-slate-950/95 backdrop-blur-2xl border-r border-indigo-500/10 z-[70] flex flex-col overflow-hidden shadow-[20px_0_40px_rgba(0,0,0,0.5)] lg:hidden"
          >
            {/* Glowing Ambient Orbs */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/30 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="p-6 flex items-center justify-between relative z-10 border-b border-white/5">
              <Link to="/" onClick={onClose} className="text-2xl font-black flex items-center gap-2 group">
                <img 
                  src="/uploads/aalasi_logo.png?v=fresh" 
                  alt="Aalasi Blog Logo" 
                  className="w-8 h-8 rounded-full border border-indigo-500/30 object-cover shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 font-extrabold">
                  Aalasi Blog
                </span>
              </Link>
              <button 
                onClick={onClose} 
                className="p-2 text-gray-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto relative z-10 custom-scrollbar pb-6 pt-6">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-3 mt-2">Menu</div>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    onClick={onClose}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 relative overflow-hidden group ${
                      isActive 
                        ? 'text-white bg-gradient-to-r from-indigo-500/20 to-purple-500/5 border border-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-r-full shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                    )}
                    <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400'}`} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/5 relative z-10 bg-black/20 backdrop-blur-md">
              <div className="relative mb-2">
                <button 
                  onClick={() => setLangOpen(!langOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-indigo-400" />
                    <span className="font-medium text-sm">Language</span>
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/20">
                    {i18n.language}
                  </span>
                </button>
                
                <AnimatePresence>
                  {langOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 bottom-full mb-2 w-full bg-slate-900 border border-white/10 rounded-xl shadow-2xl py-2 overflow-hidden z-20"
                    >
                      <button onClick={() => changeLanguage('en')} className="block w-full text-left px-5 py-3 text-sm font-bold text-gray-300 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors">English</button>
                      <button onClick={() => changeLanguage('hi')} className="block w-full text-left px-5 py-3 text-sm font-bold text-gray-300 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors">हिन्दी</button>
                      <button onClick={() => changeLanguage('gu')} className="block w-full text-left px-5 py-3 text-sm font-bold text-gray-300 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors">ગુજરાતી</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-400 mt-2">
                <span className="font-medium">Dark Mode</span>
                <div className="flex items-center bg-black/50 rounded-full p-1 border border-white/10">
                  <button 
                    onClick={() => isDark && toggleTheme()}
                    className={`p-1.5 rounded-full transition-colors ${!isDark ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : 'text-gray-500 hover:text-white'}`}
                  >
                    <Sun className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => !isDark && toggleTheme()}
                    className={`p-1.5 rounded-full transition-colors ${isDark ? 'bg-indigo-500/20 text-indigo-400 shadow-sm' : 'text-gray-500 hover:text-white'}`}
                  >
                    <Moon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
