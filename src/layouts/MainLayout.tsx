import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Footer } from '../components/Footer';
//import { getAdsConfig, trackAdEvent } from '../services/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, MessageCircle, ArrowUpRight } from 'lucide-react';

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [showSocialBar, setShowSocialBar] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  /*  return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  // 1. Fetch Ads & Popunder Configurations
  useEffect(() => {
    getAdsConfig()
      .then((data) => {
        setConfig(data);
        
        // Match social bar visible conditions
        if (data?.adsterra?.enabled && data?.adsterra?.socialBarCode) {
          // Delay social bar entrance slightly for dynamic visual tracking
          const timer = setTimeout(() => {
            setShowSocialBar(true);
            trackAdEvent('social-bar-widget', 'impression', 'social-bar-overlay').catch(console.error);
          }, 3500);
          return () => clearTimeout(timer);
        }
      })
      .catch((err) => console.error("MainLayout: Failed to load ads configurations", err));
  }, []);*/

  // 2. Automated Popunder Interceptor with frequency checks
  useEffect(() => {
    if (!config || !config.popunder?.enabled || !config.popunder?.code) return;

    const delayTimer = setTimeout(() => {
      const handleGlobalClick = () => {
        // Run frequency cap verification matching defined hours
        const lastPopunderTime = localStorage.getItem('aalasi_last_popunder');
        const now = Date.now();
        const capHoursMs = (config.popunder.frequencyHours || 4) * 60 * 60 * 1000;

        if (lastPopunderTime && now - parseInt(lastPopunderTime) < capHoursMs) {
          // Inside cap window, do not trigger
          return;
        }

        // Trigger safe Popunder tab sequence
        try {
          window.open(config.popunder.code, '_blank');
          localStorage.setItem('aalasi_last_popunder', now.toString());
          trackAdEvent('popunder-widget', 'impression', 'popunder-trigger').catch(console.error);
        } 
        /*catch (err) {
          console.error("Popup blocked or failed to redirect", err);
        }

        // Remove listener after first successful dispatch
        document.body.removeEventListener('click', handleGlobalClick);
      };

      document.body.addEventListener('click', handleGlobalClick);
      
      return () => {
        document.body.removeEventListener('click', handleGlobalClick);
      };
    }, (config.popunder.delaySeconds || 5) * 1000);

    return () => clearTimeout(delayTimer);
  }, [config]);*/

  // 3. Global Direct Link Button Event Handlers matching customized trigger selectors
  useEffect(() => {
    if (!config?.directLinks || config.directLinks.length === 0) return;

    const interceptButtonClicks = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Check if target is a custom download/sponsored action button
      config.directLinks.forEach((link: any) => {
        const matchesBtn = target.id === link.trigger || 
                           target.classList.contains(link.trigger) ||
                           target.closest(`#${link.trigger}`);

        if (matchesBtn) {
          // Track custom click telemetry
          trackAdEvent(`direct-link-${link.id}`, 'click', `trigger-${link.trigger}`).catch(console.error);
          window.open(link.url, '_blank');
          e.preventDefault();
          e.stopPropagation();
        }
      });
    };

    document.addEventListener('click', interceptButtonClicks, true);
    return () => document.removeEventListener('click', interceptButtonClicks, true);
  }, [config]);

  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50 dark:bg-slate-950 transition-colors duration-500">
      {/* Top sticky Navbar for all screens */}
      <Navbar onOpenMenu={() => setSidebarOpen(true)} />
      
      {/* Slide-out mobile drawer (hidden on lg screens) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content Area */}
      <main className="flex-grow w-full relative z-0">
        <Outlet />
      </main>
      
      <Footer />

      {/* ADSTERRA / SOCIAL BAR FLOATING SLIDE-IN ALERT */}
      <AnimatePresence>
        {showSocialBar && config?.adsterra?.enabled && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 100 }}
            transition={{ type: 'spring', damping: 20, stiffness: 120 }}
            className="fixed bottom-6 right-6 z-[99] max-w-sm w-full outline-hidden"
          >
            <div className="relative group bg-slate-900 border border-purple-500/30 rounded-2xl p-5 shadow-2xl backdrop-blur-md overflow-hidden">
              {/* Pulsing glow boundary */}
              <div className="absolute inset-0 bg-linear-to-r from-purple-500/10 via-indigo-500/5 to-transparent pointer-events-none"></div>
              
              <div className="flex justify-between items-start">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 shadow-lg">
                    <MessageCircle className="w-5 h-5 animate-bounce" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_#A855F7] animate-ping"></span>
                      <span className="text-[9px] uppercase font-mono text-purple-400 font-extrabold tracking-widest">Recommended offer</span>
                    </div>
                    <h5 className="text-white font-extrabold text-sm uppercase tracking-tight leading-snug">
                      Claim Your Free Domain & Ad Credits Overnight
                    </h5>
                    <p className="text-gray-400 text-[10px] mt-1 leading-relaxed">
                      Download our special partner browser widget to immediately request ca-pub approvals.
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSocialBar(false)} 
                  className="p-1 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <div className="flex gap-2.5 mt-4 pt-3 border-t border-white/5">
                <button
                  onClick={() => setShowSocialBar(false)}
                  className="flex-1 py-2 text-center text-gray-400 hover:text-white transition-colors text-[10px] uppercase font-black tracking-wider"
                >
                  Skip Offer
                </button>
                <a
                  href={config?.popunder?.code || '#'}
                  onClick={() => {
                    trackAdEvent('social-bar-widget', 'click', 'social-bar-overlay').catch(console.error);
                    setShowSocialBar(false);
                  }}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 text-center bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-500 hover:to-indigo-600 text-white font-black text-[9px] uppercase tracking-wider rounded-xl shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1 transition-all"
                >
                  Verify Now <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
