import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, Menu, ChevronDown, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { db } from "../firebase";

export function Navbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { t } = useTranslation();
  const [catsOpen, setCatsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
 //   getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    setCatsOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setMobileSearchOpen(false);
    }
  };

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('latest_blogs'), path: '/latest' },
    { name: t('trending'), path: '/trending' },
  ];

  return (
    <div className="flex flex-col w-full relative z-40">
      {/* Main Sticky Navbar */}
      <header 
        className={`sticky top-0 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-200/80 dark:border-white/10 shadow-sm py-2' 
            : 'bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-white/5 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-12">
            {/* Mobile Menu Button */}
            <button 
              onClick={onOpenMenu}
              className="lg:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="text-2xl sm:text-3xl font-black tracking-tight shrink-0 flex items-center gap-2 group">
              <img 
                src="/uploads/aalasi_logo.png?v=fresh" 
                alt="Aalasi Blog Logo" 
                className="w-9 h-9 rounded-full border border-indigo-500/30 object-cover shadow-[0_0_15px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] transition-all duration-300"
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 font-extrabold">
                Aalasi Blog
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`text-sm font-bold transition-all relative py-2 group ${
                    location.pathname === link.path ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white'
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 shadow-[0_0_8px_rgba(79,70,229,0.8)] ${
                    location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}></span>
                </Link>
              ))}

              {/* Categories Dropdown */}
              <div 
                className="relative py-2"
                onMouseEnter={() => setCatsOpen(true)}
                onMouseLeave={() => setCatsOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm font-bold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-white transition-colors group">
                  {t('categories')} <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${catsOpen ? 'rotate-180' : ''}`} />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 transition-all duration-300 group-hover:w-full shadow-[0_0_8px_rgba(79,70,229,0.8)]"></span>
                </button>
                <AnimatePresence>
                  {catsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 overflow-hidden py-2 z-50"
                    >
                      {categories.slice(0, 5).map(cat => (
                        <Link key={cat.id} to={`/category/${cat.slug}`} className="block px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                          {cat.title}
                        </Link>
                      ))}
                      <div className="border-t border-gray-100 dark:border-white/10 mt-2 pt-2">
                        <Link to="/categories" className="block px-4 py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:text-indigo-800 dark:hover:text-indigo-300 text-center">View All Categories</Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Functional Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex relative group">
              <button type="submit" className="absolute inset-y-0 left-0 pl-3 flex items-center hover:opacity-80">
                <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors" />
              </button>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search')} 
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-slate-900 rounded-full text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:text-white transition-all outline-none"
              />
            </form>

            {/* Mobile Search Icon toggling native inputs */}
            <button 
              className={`md:hidden p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 ${
                mobileSearchOpen ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10' : 'text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Slide-down Search Bar Overlay */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden w-full bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-white/10 px-4 py-3 z-30 shadow-md relative"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search') || 'Search articles...'}
                className="w-full pl-10 pr-10 py-2.5 border border-indigo-500/30 bg-gray-50 dark:bg-slate-950 rounded-xl text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/10 dark:text-white outline-none"
                autoFocus
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black uppercase text-indigo-500 hover:text-indigo-700 tracking-wider"
                >
                  Clear
                </button>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
