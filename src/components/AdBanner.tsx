import { useEffect, useState } from 'react';
import { getAds, getAdsConfig, trackAdEvent } from '../services/firebase';
import { motion } from 'motion/react';
import { Monitor, ExternalLink, ShieldCheck } from 'lucide-react';

export function AdBanner({ 
  placement, 
  categorySlug 
}: { 
  placement?: string; 
  categorySlug?: string;
}) {
  const [ad, setAd] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    const loadAdAndConfig = async () => {
      try {
        const [adsList, configData] = await Promise.all([
          getAds({ placement, category: categorySlug, device: window.innerWidth < 768 ? 'mobile' : 'desktop' }),
          getAdsConfig()
        ]);
        
        setConfig(configData);

        if (adsList.length > 0) {
          // Choose a random active ad for this specific slot
          const randomAd = adsList[Math.floor(Math.random() * adsList.length)];
          setAd(randomAd);
        } else {
          setAd(null);
        }
      } catch (err) {
        console.error("Failed to load ad banner details", err);
      }
    };

    loadAdAndConfig();
  }, [placement, categorySlug]);

  // Handle SEO safe Lazy Loading / Delayed Rendering
  useEffect(() => {
    if (!config) return;

    const delayTime = config.seoSafe?.delayedLoad ? config.seoSafe.delayMs || 1000 : 0;
    
    const renderTimer = setTimeout(() => {
      setIsRendered(true);
    }, delayTime);

    return () => clearTimeout(renderTimer);
  }, [config]);

  // Track impressions when the ad becomes visible
  useEffect(() => {
    if (ad && isRendered) {
      trackAdEvent(ad.id, 'impression', placement).catch((err) => console.error("Err tracking impression", err));
    }
  }, [ad, isRendered, placement]);

  const handleAdClick = () => {
    if (ad) {
      trackAdEvent(ad.id, 'click', placement).catch((err) => console.error("Err tracking click", err));
    }
  };

  if (!isRendered) {
    // CLS Optimization: show empty placeholder while loading
    if (config?.seoSafe?.preventLayoutShift) {
      return (
        <div className="w-full h-24 bg-gray-50/10 dark:bg-slate-900/10 rounded-2xl border border-dashed border-gray-100 dark:border-slate-800/20 my-8 animate-pulse flex items-center justify-center">
          <span className="text-[9px] uppercase tracking-widest font-mono text-gray-400">Loading Safe Ads Slot...</span>
        </div>
      );
    }
    return null;
  }

  // Fallback Empty State: Display professional Sponsor Space
  if (!ad) {
    return (
      <div className="w-full bg-linear-to-r from-gray-50 to-slate-100 dark:from-slate-900/20 dark:to-slate-950/40 border border-dashed border-gray-200 dark:border-slate-800/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between p-6 my-8 gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-yellow-500/10 dark:bg-yellow-500/5 text-yellow-500 rounded-xl"><Monitor className="w-5 h-5 animate-pulse" /></div>
          <div className="text-left">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#6366F1] dark:text-[#A5B4FC] block mb-0.5">Advertise with Aalasi</span>
            <p className="text-gray-500 dark:text-gray-400 text-xs text-balance">Reach thousands of tech pioneers, creators, and expert traders daily.</p>
          </div>
        </div>
        <a 
          href="/contact" 
          className="px-4 py-2 bg-slate-900 dark:bg-indigo-650 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
        >
          Book Slot Space
        </a>
      </div>
    );
  }

  // RENDER INTERACTION BASED ON DIRECT MONETIZATION SYSTEMS
  if (ad.type === 'adsense') {
    return (
      <div className="w-full bg-[#FCF8E3] dark:bg-[#030712] rounded-2xl shadow-sm border border-[#FBEED5] dark:border-[#1E2536] overflow-hidden my-8 p-6 relative group">
        <div className="absolute top-4 right-4 bg-yellow-500/15 backdrop-blur text-yellow-600 dark:text-yellow-500 text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border border-yellow-500/25 pointer-events-none">
          AdSense responsive
        </div>
        
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <span className="p-1.5 bg-yellow-500/10 rounded-lg text-yellow-600 mb-2"><ShieldCheck className="w-5 h-5" /></span>
          <h4 className="text-gray-800 dark:text-slate-100 font-extrabold text-sm tracking-tight mb-1">
            Google AdSense Automated Slot
          </h4>
          <span className="text-[10px] text-gray-500 font-mono">
            Slot ID: {config?.adSense?.adSlotId || ad.id} • Publisher ID: {config?.adSense?.publisherId || 'Pending Approval'}
          </span>
          <p className="text-[10px] text-gray-400 max-w-sm mt-1.5 leading-relaxed">
            Automatic contextual banner active. Responsive scale optimized for {window.innerWidth >= 1024 ? 'Desktop displays (728x90)' : 'Mobile viewport (320x50)'}.
          </p>
        </div>
      </div>
    );
  }

  if (ad.type === 'adsterra') {
    return (
      <div className="w-full bg-[#FAF5FF] dark:bg-[#0D0B14] rounded-2xl shadow-sm border border-[#F3E8FF] dark:border-[#2C1E3C] overflow-hidden my-8 p-6 relative group">
        <div className="absolute top-4 right-4 bg-purple-500/15 backdrop-blur text-purple-600 dark:text-purple-400 text-[8px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border border-purple-500/25 pointer-events-none">
          Adsterra format
        </div>

        <div className="flex flex-col items-center justify-center py-6 text-center">
          <span className="p-1.5 bg-purple-500/10 rounded-lg text-purple-500 mb-2"><Monitor className="w-5 h-5" /></span>
          <h4 className="text-gray-800 dark:text-purple-100 font-extrabold text-xs tracking-tight mb-1 uppercase">
            Adsterra Multi-Format Widget
          </h4>
          <p className="text-[10px] text-gray-400 max-w-sm leading-relaxed">
            Direct Link Monetization channel enabled safely.
          </p>
          <a
            href={config?.popunder?.code || ad.url} 
            onClick={handleAdClick}
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/90 hover:bg-purple-600 text-white font-black text-[9px] uppercase tracking-wider rounded shadow-md"
          >
            Open Offer <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  // RENDER SPONSORED CARDS OR SPONSOR BANNER DESIGNS
  if (ad.type === 'sponsored-card') {
    return (
      <div className="w-full bg-slate-100 dark:bg-[#0B0F19] p-4 rounded-2xl border border-dashed border-indigo-500/10 dark:border-indigo-500/25 my-8">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="h-28 w-full sm:w-44 bg-slate-900 rounded-xl overflow-hidden relative group shrink-0">
            <img src={ad.mediaUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur text-white text-[8px] font-black uppercase tracking-wider">Sponsored</span>
          </div>
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div>
              <span className="text-[9px] uppercase text-indigo-400 font-extrabold tracking-widest">{ad.sponsorName || 'Featured Partner'}</span>
              <h4 className="text-gray-800 dark:text-white font-extrabold text-sm uppercase leading-snug line-clamp-2">{ad.title}</h4>
            </div>
            <a 
              href={ad.url} 
              onClick={handleAdClick}
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[9px] uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
            >
              Learn More <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // STANDARD IMAGE/VIDEO ADS RENDER
  return (
    <div className="w-full bg-white dark:bg-[#060913] rounded-2xl shadow-sm border border-gray-100 dark:border-[#1E2536] overflow-hidden my-8 p-1 relative group transition-all duration-300 hover:border-indigo-500/30">
      <div className="absolute top-4 right-4 bg-slate-900/60 backdrop-blur text-white text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-white/10 z-10 pointer-events-none">
        {ad.sponsorName ? `Sponsor: ${ad.sponsorName}` : 'Advertisement'}
      </div>
      <a 
        href={ad.url} 
        onClick={handleAdClick}
        target="_blank" 
        rel="noopener noreferrer" 
        className="block relative overflow-hidden rounded-xl h-auto"
      >
        {ad.type === 'video' ? (
          ad.mediaUrl ? (
            <video 
              src={ad.mediaUrl} 
              autoPlay 
              loop 
              muted 
              playsInline
              className="w-full h-auto max-h-64 object-cover"
            />
          ) : null
        ) : (
          ad.mediaUrl ? (
            <img 
              src={ad.mediaUrl} 
              alt={ad.title} 
              className="w-full h-auto max-h-64 object-cover group-hover:scale-101 transition-all duration-500"
            />
          ) : null
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/8 transition-colors flex items-center justify-center">
        </div>
      </a>
    </div>
  );
}
