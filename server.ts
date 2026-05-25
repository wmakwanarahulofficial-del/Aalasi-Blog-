import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import multer from "multer";

const upload = multer({ dest: 'uploads/' });

// Simple in-memory database simulation
const db = {
  totalViews: 84500,
  categories: [
    { 
      id: 1,
      slug: "trending", 
      title: "Trending Categories", 
      description: "Explore what's hot and trending right now.", 
      icon: "trending-up",
      banner_image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
      seo_title: "Trending Blogs",
      seo_description: "Top trending articles right now"
    },
    { 
      id: 2,
      slug: "social-media", 
      title: "Social Media Blogs", 
      description: "Tips and updates about platforms.", 
      icon: "share-2",
      banner_image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
      seo_title: "Social Media",
      seo_description: "Social media strategies."
    },
    { 
      id: 3,
      slug: "news", 
      title: "News Blogs", 
      description: "Breaking news.", 
      icon: "globe",
      banner_image: "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80",
      seo_title: "News",
      seo_description: "Latest news."
    },
    { 
      id: 4,
      slug: "creators", 
      title: "Creators Blogs", 
      description: "Tips for creators.", 
      icon: "pen-tool",
      banner_image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80",
      seo_title: "For Creators",
      seo_description: "Creator tips."
    },
    { 
      id: 5,
      slug: "trading-finance", 
      title: "Trading & Finance Blogs", 
      description: "Markets and crypto.", 
      icon: "pie-chart",
      banner_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
      seo_title: "Trading and Finance",
      seo_description: "Stock and crypto updates."
    },
    { 
      id: 6,
      slug: "technology", 
      title: "Technology Blogs", 
      description: "Tech deep dives.", 
      icon: "cpu",
      banner_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
      seo_title: "Tech News",
      seo_description: "Tech blog."
    }
  ],
  blogs: [
    {
      id: 1,
      title: "The Future of AI in Web Development",
      slug: "future-of-ai-web-development",
      content: "Artificial Intelligence is rapidly changing how we build the web...",
      excerpt: "Explore the latest trends in web development for 2024...",
      category_slug: "technology",
      featured_category_blog: true,
      type: "image",
      tags: ["AI", "Web Dev"],
      featured_image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80",
      featured: true,
      seo_title: "How AI is Changing Web Development in 2024",
      seo_description: "Discover how AI tools are revolutionizing web development workflows and architectures.",
      author: { name: "Rahul Makwana", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" },
      language: "en",
      views: 1240,
      likes: 342,
      is_trending: true,
      created_at: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 2,
      title: "Trading Strategies for Beginners",
      slug: "trading-strategies-beginners",
      content: "Trading requires patience and a good strategy...",
      excerpt: "Learn the basics of trading and top 5 strategies to get started.",
      category_slug: "trading-finance",
      featured_category_blog: false,
      type: "text",
      tags: ["Finance", "Trading"],
      featured_image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
      thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=400&q=80",
      featured: true,
      seo_title: "Top 5 Trading Strategies",
      seo_description: "Grow your portfolio using these powerful trading strategies.",
      author: { name: "Aalasi Team", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Team" },
      language: "en",
      views: 856,
      likes: 120,
      is_trending: false,
      created_at: new Date(Date.now() - 86400000 * 5).toISOString()
    },
    {
      id: 3,
      title: "How to Grow on Social Media in 2024",
      slug: "grow-on-social-media",
      content: "Social media algorithms have changed...",
      excerpt: "Master the latest social media algorithms and grow your audience.",
      category_slug: "social-media",
      featured_category_blog: true,
      type: "video",
      video_url: "https://www.w3schools.com/html/mov_bbb.mp4",
      tags: ["Social", "Marketing"],
      featured_image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200&q=80",
      thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=400&q=80",
      featured: true,
      seo_title: "Grow on Social Media",
      seo_description: "Tips to grow on social media.",
      author: { name: "Sarah", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" },
      language: "en",
      views: 2100,
      likes: 540,
      is_trending: true,
      created_at: new Date(Date.now() - 86400000 * 10).toISOString()
    },
    {
      id: 4,
      title: "Why Content Creation is the Future",
      slug: "content-creation-future",
      content: "Anyone can be a creator...",
      excerpt: "The creator economy is booming.",
      category_slug: "creators",
      featured_category_blog: false,
      type: "image",
      tags: ["Creator", "Economy"],
      featured_image: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=1200&q=80",
      thumbnail: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&w=400&q=80",
      featured: true,
      seo_title: "Content Creation Future",
      seo_description: "Creator economy trends.",
      author: { name: "Aman", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aman" },
      language: "en",
      views: 1100,
      likes: 240,
      is_trending: false,
      created_at: new Date(Date.now() - 86400000 * 1).toISOString()
    },
    {
      id: 5,
      title: "Global Stock Markets Hit Record Highs",
      slug: "global-stock-markets",
      content: "The stock market went up today...",
      excerpt: "Stock market updates and news.",
      category_slug: "news",
      featured_category_blog: true,
      type: "text",
      tags: ["News", "Stocks"],
      featured_image: "https://images.unsplash.com/photo-1590283603385-18ff385984c9?auto=format&fit=crop&w=1200&q=80",
      thumbnail: "https://images.unsplash.com/photo-1590283603385-18ff385984c9?auto=format&fit=crop&w=400&q=80",
      featured: true,
      seo_title: "Market News",
      seo_description: "Market news.",
      author: { name: "News Reporter", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Reporter" },
      language: "en",
      views: 3300,
      likes: 1240,
      is_trending: true,
      created_at: new Date(Date.now() - 86400000 * 0.5).toISOString()
    },
    {
      id: 6,
      title: "Top 10 Trends Shaping the Creator Economy",
      slug: "top-trends-creator-economy",
      content: "The creator economy is shifting rapidly. Here are the top trends...",
      excerpt: "Discover the most important trends for creators this year.",
      category_slug: "trending",
      featured_category_blog: true,
      type: "image",
      tags: ["Trending", "Creators"],
      featured_image: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=1200&q=80",
      thumbnail: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=400&q=80",
      featured: true,
      seo_title: "Trending in Creator Economy",
      seo_description: "Top 10 trends for creators in 2024.",
      author: { name: "Trend Analyst", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Trend" },
      language: "en",
      views: 4500,
      likes: 1800,
      is_trending: true,
      created_at: new Date(Date.now() - 86400000 * 0.2).toISOString()
    }
  ],
  ads: [
    {
      id: 1,
      title: "🔥 Aalasi Host Pro Web Hosting (50% Off)",
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
      url: "https://example.com/hosting-deal",
      active: true,
      placement: "homepage-sidebar",
      categorySlugs: [],
      targetDevices: ["desktop", "mobile"],
      sponsorName: "AalasiHost",
      startDate: null,
      endDate: null
    },
    {
      id: 2,
      title: "🚀 Master React & NextJS Full Stack Development Courses",
      type: "video",
      mediaUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      url: "https://react.dev",
      active: true,
      placement: "homepage-top",
      categorySlugs: ["technology"],
      targetDevices: ["desktop", "mobile"],
      sponsorName: "Aalasi Academy",
      startDate: null,
      endDate: null
    },
    {
      id: 3,
      title: "📈 Binance Pro Finance & Crypto Futures Trading",
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80",
      url: "https://binance.com",
      active: true,
      placement: "blog-sidebar",
      categorySlugs: ["trading-finance"],
      targetDevices: ["desktop", "mobile"],
      sponsorName: "Binance Pro",
      startDate: null,
      endDate: null
    },
    {
      id: 4,
      title: "🎯 Google AdSense - Auto Responsive Widget",
      type: "adsense",
      mediaUrl: "",
      url: "https://google.com/adsense",
      active: true,
      placement: "homepage-middle",
      categorySlugs: [],
      targetDevices: ["desktop", "mobile"],
      sponsorName: "Google AdSense",
      startDate: null,
      endDate: null
    },
    {
      id: 5,
      title: "⚡ Sponsored: AI Automation Tool Of The Year - AalasiAI",
      type: "sponsored-card",
      mediaUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80",
      url: "https://aalasi.ai",
      active: true,
      placement: "blog-middle",
      categorySlugs: ["technology"],
      targetDevices: ["desktop"],
      sponsorName: "AalasiAI",
      startDate: null,
      endDate: null
    },
    {
      id: 6,
      title: "📱 Get 5,000 App Installs Overnight - Social Viral Pro",
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
      url: "https://example.com/viral",
      active: true,
      placement: "mobile-sticky",
      categorySlugs: ["social-media"],
      targetDevices: ["mobile"],
      sponsorName: "ViralPro",
      startDate: null,
      endDate: null
    }
  ],
  adsConfig: {
    adSense: {
      enabled: true,
      publisherId: "ca-pub-8507231468122904",
      adSlotId: "5671234890",
      globalSnippet: `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8507231468122904" crossorigin="anonymous"></script>`
    },
    adsterra: {
      enabled: true,
      popunderCode: `<script type="text/javascript">
\tatOptions = {
\t\t'key' : 'adsterra_popunder_key_aalasi',
\t\t'format' : 'iframe',
\t\t'height' : 250,
\t\t'width' : 300,
\t\t'params' : {}
\t};
</script>
<script type="text/javascript" src="//www.highperformanceformat.com/adsterra_popunder.js"></script>`,
      socialBarCode: `<div class="p-4 bg-[#0B0F19]/90 border border-purple-500/30 rounded-2xl flex items-center justify-between shadow-2xl backdrop-blur-md max-w-sm">
  <div class="flex items-center gap-3">
    <div class="w-2.5 h-2.5 rounded-full bg-purple-500 animate-ping"></div>
    <div class="text-xs font-black uppercase text-white tracking-wider">Social Bar Alert</div>
  </div>
  <a href="https://directlink-adsterra.com/aalasi-social" target="_blank" class="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-605 text-white font-black text-[9px] uppercase tracking-wider rounded-lg shadow-lg">Verify App</a>
</div>`,
      nativeBannerCode: `<div class="p-5 border border-[#1E2536] rounded-xl bg-[#060913] text-center">
  <span class="text-[9px] text-[#A5B4FC]/80 font-black uppercase tracking-widest block mb-1">Native Ad widget</span>
  <h4 class="text-xs text-white font-normal mb-2 leading-tight">Install This Recommended Chrome Extension to Continue Fast</h4>
  <a href="https://example.com" target="_blank" class="text-[10px] text-indigo-400 font-bold hover:underline">Download Direct Code</a>
</div>`
    },
    popunder: {
      enabled: true,
      frequencyHours: 4,
      delaySeconds: 5,
      targetDevices: ["desktop", "mobile"],
      code: "https://directlink-adsterra.com/aalasi"
    },
    seoSafe: {
      lazyLoad: true,
      delayedLoad: true,
      delayMs: 1200,
      preventLayoutShift: true
    },
    articlePlacements: {
      showAfterParagraph1: true,
      showAfterParagraph2: true,
      showAfterVideo: true,
      showBetweenBlocks: true
    },
    directLinks: [
      { id: 1, trigger: "download-btn", url: "https://directlink-adsterra.com/aalasi-download", label: "Dynamic Download Button Redirect" },
      { id: 2, trigger: "sponsored-btn", url: "https://example.com/partner-redirect-aalasi", label: "External Tools Partner Banner" }
    ]
  },
  adsStats: {
    impressions: [
      { date: "May 17", value: 38000 },
      { date: "May 18", value: 41000 },
      { date: "May 19", value: 45000 },
      { date: "May 20", value: 48000 },
      { date: "May 21", value: 54000 },
      { date: "May 22", value: 67000 },
      { date: "May 23", value: 84500 }
    ],
    clicks: [
      { date: "May 17", value: 920 },
      { date: "May 18", value: 1150 },
      { date: "May 19", value: 1080 },
      { date: "May 20", value: 1450 },
      { date: "May 21", value: 1820 },
      { date: "May 22", value: 2310 },
      { date: "May 23", value: 2980 }
    ],
    byType: [
      { name: "Direct Links", impressions: 16500, clicks: 820, revenue: 145 },
      { name: "Google AdSense", impressions: 45000, clicks: 1200, revenue: 250 },
      { name: "Sponsor Banners", impressions: 22000, clicks: 750, revenue: 180 },
      { name: "Popunder Ads", impressions: 38000, clicks: 1400, revenue: 210 },
      { name: "Social Bar Ads", impressions: 29000, clicks: 680, revenue: 120 }
    ],
    byDevice: [
      { name: "Mobile", value: 62 },
      { name: "Desktop", value: 30 },
      { name: "Tablet", value: 8 }
    ],
    byPlacement: [
      { placement: "homepage-top", impressions: 28500, clicks: 430, CTR: "1.51%" },
      { placement: "homepage-sidebar", impressions: 14200, clicks: 180, CTR: "1.27%" },
      { placement: "blog-middle", impressions: 32000, clicks: 1100, CTR: "3.44%" },
      { placement: "mobile-sticky", impressions: 24500, clicks: 950, CTR: "3.88%" }
    ],
    individualAdStats: {} as Record<number, { impressions: number; clicks: number }>
  },
  blog_views: [] as any[],
  ad_clicks: [] as any[],
  ad_impressions: [] as any[],
  video_views: [] as any[],
  adminProfile: {
    name: "Rahul Makwana",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
  },
  siteConfig: {
    siteName: "Aalasi Blog",
    motto: "The Ultimate Tech & Trading Oasis for the Laid-back Intellect.",
    footer: "© 2026 Aalasi Blog. Made with React, Tailwind, and Love.",
    contactEmail: "support@aalasi.com",
    telegram: "https://t.me/aalasiblog",
    instagram: "https://instagram.com/aalasiblog",
    youtube: "",
    facebook: "",
    twitter: "",
    siteLogo: "/uploads/aalasi_logo.png?v=fresh"
  }
};

function generateHistoricAnalytics() {
  db.blog_views = [];
  db.ad_clicks = [];
  db.ad_impressions = [];
  db.video_views = [];
  
  const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Germany', 'Australia'];
  const devices = ['desktop', 'mobile', 'tablet', 'desktop', 'mobile', 'mobile'];
  const browsers = ['Chrome', 'Safari', 'Firefox', 'Chrome', 'Edge'];
  const now = Date.now();
  
  for (let i = 0; i < 7; i++) {
    const dayMs = now - (6 - i) * 24 * 60 * 60 * 1000;
    const dailyViewsCount = 150 + Math.floor(Math.random() * 80);
    const dailyImpressionsCount = 800 + Math.floor(Math.random() * 450);
    const dailyClicksCount = 20 + Math.floor(Math.random() * 25);
    const dailyVideoPlaysCount = 30 + Math.floor(Math.random() * 30);

    for (let j = 0; j < dailyViewsCount; j++) {
      const timestamp = new Date(dayMs + Math.random() * 24 * 60 * 60 * 1000).toISOString();
      const blog = db.blogs[Math.floor(Math.random() * db.blogs.length)];
      db.blog_views.push({
        id: db.blog_views.length + 1,
        blog_id: blog ? blog.id : 1,
        user_ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        device: devices[Math.floor(Math.random() * devices.length)],
        browser: browsers[Math.floor(Math.random() * browsers.length)],
        country: countries[Math.floor(Math.random() * countries.length)],
        viewed_at: timestamp
      });
    }

    for (let j = 0; j < dailyImpressionsCount; j++) {
      const timestamp = new Date(dayMs + Math.random() * 24 * 60 * 60 * 1000).toISOString();
      const ad = db.ads[Math.floor(Math.random() * db.ads.length)];
      db.ad_impressions.push({
        id: db.ad_impressions.length + 1,
        ad_id: ad ? ad.id : 1,
        user_ip: `192.168.2.${Math.floor(Math.random() * 255)}`,
        device: devices[Math.floor(Math.random() * devices.length)],
        viewed_at: timestamp
      });
    }

    for (let j = 0; j < dailyClicksCount; j++) {
      const timestamp = new Date(dayMs + Math.random() * 24 * 60 * 60 * 1000).toISOString();
      const ad = db.ads[Math.floor(Math.random() * db.ads.length)];
      db.ad_clicks.push({
        id: db.ad_clicks.length + 1,
        ad_id: ad ? ad.id : 1,
        user_ip: `192.168.2.${Math.floor(Math.random() * 255)}`,
        device: devices[Math.floor(Math.random() * devices.length)],
        clicked_at: timestamp
      });
    }

    for (let j = 0; j < dailyVideoPlaysCount; j++) {
      const timestamp = new Date(dayMs + Math.random() * 24 * 60 * 60 * 1000).toISOString();
      const blog = db.blogs.filter(b => b.type === 'video')[0] || db.blogs[0];
      db.video_views.push({
        id: db.video_views.length + 1,
        blog_id: blog ? blog.id : 1,
        video_id: `v-${Math.floor(Math.random() * 5) + 1}`,
        viewed_at: timestamp
      });
    }
  }
}

const DB_FILE = path.join(process.cwd(), 'uploads', 'aalasi_ads_db.json');

function saveDatabase() {
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving database to disk:", err);
  }
}

function loadDatabase() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const loaded = JSON.parse(data);
      if (loaded.blogs) db.blogs = loaded.blogs;
      if (loaded.categories) db.categories = loaded.categories;
      if (loaded.ads) db.ads = loaded.ads;
      if (loaded.adsConfig) db.adsConfig = loaded.adsConfig;
      if (loaded.adsStats) db.adsStats = loaded.adsStats;
      if (loaded.totalViews) db.totalViews = loaded.totalViews;
      if (loaded.blog_views) db.blog_views = loaded.blog_views;
      if (loaded.ad_clicks) db.ad_clicks = loaded.ad_clicks;
      if (loaded.ad_impressions) db.ad_impressions = loaded.ad_impressions;
      if (loaded.video_views) db.video_views = loaded.video_views;
      if (loaded.adminProfile) db.adminProfile = loaded.adminProfile;
      if (loaded.siteConfig) {
        db.siteConfig = { ...db.siteConfig, ...loaded.siteConfig };
      }

      if (!db.blog_views || db.blog_views.length === 0) {
        console.log("Upgrading database schema with dynamic trackers...");
        generateHistoricAnalytics();
        saveDatabase();
      }
      console.log("Database initialized successfully from disk storage!");
    } else {
      console.log("No persistent storage file found. Initializing inline state cache with historic telemetry.");
      generateHistoricAnalytics();
      saveDatabase();
    }
  } catch (err) {
    console.error("Error loading database from disk:", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize DB persistence
  loadDatabase();

  // Dynamic Autonomus Ad Scheduler Runner
  setInterval(() => {
    const now = new Date();
    let changed = false;
    if (db.ads && Array.isArray(db.ads)) {
      db.ads.forEach(ad => {
        const start = ad.startDate ? new Date(ad.startDate) : null;
        const end = ad.endDate ? new Date(ad.endDate) : null;
        
        // Expired Ad deactivation
        if (end && now > end && ad.active) {
          ad.active = false;
          changed = true;
          console.log(`[Scheduler] Campaign '${ad.title}' (ID: ${ad.id}) has expired and was automatically deactivated.`);
        }
        // Scheduled Ad activation
        if (start && now >= start && (!end || now <= end) && !ad.active && ad.startDate) {
          ad.active = true;
          changed = true;
          console.log(`[Scheduler] Campaign '${ad.title}' (ID: ${ad.id}) has started and was automatically activated.`);
        }
      });
    }
    if (changed) {
      saveDatabase();
    }
  }, 15000);

  app.use(express.json({ limit: '50mb' }));

  // === REST APIs (Simulating PHP Backend) ===

  app.post("/api/upload", upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });
  
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  const getClientDetails = (req: any) => {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket?.remoteAddress || req.ip || "103.241.12.84";
    const ua = (req.headers['user-agent'] || "").toLowerCase();
    
    let device = 'desktop';
    if (/mobile|android|iphone|ipad|phone/.test(ua)) {
      device = 'mobile';
    } else if (/tablet|ipad|playbook|silk/.test(ua)) {
      device = 'tablet';
    }

    let browser = 'Chrome';
    if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari') && !ua.includes('chrome')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';
    else if (ua.includes('opr') || ua.includes('opera')) browser = 'Opera';

    const countries = ['India', 'United States', 'United Kingdom', 'Canada', 'Germany', 'Australia'];
    // Generate a consistent nation mapping based on user agent or IP hash
    let hash = 0;
    for (let i = 0; i < ip.length; i++) {
      hash += ip.charCodeAt(i);
    }
    const country = countries[Math.abs(hash) % countries.length];

    return { ip, device, browser, country };
  };

  app.post("/api/track-view", (req, res) => {
    const { blogId } = req.body || {};
    db.totalViews++;
    
    const client = getClientDetails(req);
    
    db.blog_views.push({
      id: db.blog_views.length + 1,
      blog_id: parseInt(blogId) || blogId || 1,
      user_ip: client.ip,
      device: client.device,
      browser: client.browser,
      country: client.country,
      viewed_at: new Date().toISOString()
    });
    
    saveDatabase();
    res.json({ count: db.totalViews, currentViews: db.blog_views.length });
  });

  app.post("/api/analytics/track-video", (req, res) => {
    const { blogId, videoId } = req.body || {};
    
    db.video_views.push({
      id: db.video_views.length + 1,
      blog_id: parseInt(blogId) || blogId || 1,
      video_id: videoId || "v-1",
      viewed_at: new Date().toISOString()
    });
    
    saveDatabase();
    res.json({ success: true, count: db.video_views.length });
  });

  app.get("/api/total-views", (req, res) => {
    res.json({ count: db.totalViews || db.blog_views.length });
  });

  // Dynamic Live Analytics Overview Endpoints
  app.get("/api/analytics/overview", (req, res) => {
    const totalViews = db.blog_views.length;
    const totalBlogs = db.blogs.length;
    const publishedBlogs = db.blogs.filter(b => (b as any).status === "published" || !(b as any).status).length;
    const draftBlogs = db.blogs.filter(b => (b as any).status === "draft").length;
    
    const activeAuthors = db.blogs.reduce((acc, b) => {
      const name = b.author?.name;
      if (name && !acc.includes(name)) acc.push(name);
      return acc;
    }, [] as string[]);
    const totalUsers = activeAuthors.length || 3;

    const totalImpressions = db.ad_impressions.length;
    const totalClicks = db.ad_clicks.length;
    const averageCTR = totalImpressions > 0 ? parseFloat(((totalClicks / totalImpressions) * 100).toFixed(2)) : 0.00;
    
    // Dynamic CPM & CPC Calculations based on real impressions and click arrays
    const estimatedRevenue = totalImpressions * 0.0015 + totalClicks * 0.12;

    const devices = db.blog_views.reduce((acc: any, v: any) => {
      const dev = v.device || 'desktop';
      acc[dev] = (acc[dev] || 0) + 1;
      return acc;
    }, { desktop: 0, mobile: 0, tablet: 0 });

    const totalDevs = devices.desktop + devices.mobile + devices.tablet;
    const deviceBreakdown = {
      desktop: totalDevs > 0 ? Math.round((devices.desktop / totalDevs) * 100) : 42,
      mobile: totalDevs > 0 ? Math.round((devices.mobile / totalDevs) * 100) : 50,
      tablet: totalDevs > 0 ? Math.round((devices.tablet / totalDevs) * 8) : 8
    };

    const countryBreakdown = db.blog_views.reduce((acc: any, v: any) => {
      const cnt = v.country || 'India';
      acc[cnt] = (acc[cnt] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Dynamic Trail Analytics Grouper for trailing 7 days tracker
    const dates = [];
    const now = Date.now();
    for (let i = 6; i >= 0; i--) {
      const dateObj = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const isoDateStr = dateObj.toISOString().split('T')[0];

      const dayViews = db.blog_views.filter(v => v.viewed_at && v.viewed_at.startsWith(isoDateStr)).length;
      const dayImpressions = db.ad_impressions.filter(v => v.viewed_at && v.viewed_at.startsWith(isoDateStr)).length;
      const dayClicks = db.ad_clicks.filter(v => v.clicked_at && v.clicked_at.startsWith(isoDateStr)).length;
      const dayVideoPlays = db.video_views.filter(v => v.viewed_at && v.viewed_at.startsWith(isoDateStr)).length;

      const dailyRevenue = dayImpressions * 0.0015 + dayClicks * 0.12;

      dates.push({
        date: key,
        views: dayViews,
        impressions: dayImpressions,
        clicks: dayClicks,
        videoPlays: dayVideoPlays,
        revenue: parseFloat(dailyRevenue.toFixed(2))
      });
    }

    res.json({
      totalViews,
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      totalUsers,
      totalImpressions,
      totalClicks,
      averageCTR: averageCTR.toFixed(2) + "%",
      estimatedRevenue: parseFloat(estimatedRevenue.toFixed(2)),
      deviceBreakdown,
      countryBreakdown,
      weeklyStats: dates
    });
  });

  app.get("/api/analytics/blogs", (req, res) => {
    const list = db.blogs.map(blog => {
      const blogViews = db.blog_views.filter(v => v.blog_id == blog.id).length;
      const videoPlays = db.video_views.filter(v => v.blog_id == blog.id).length;
      const likes = blog.likes || Math.floor(blogViews * 0.15) + 3;
      const comments = Math.floor(blogViews * 0.03) + 1;
      const shares = Math.floor(blogViews * 0.06) + 1;
      const revenue = blogViews * 0.004 + videoPlays * 0.01;

      let seoScore = 40;
      if (blog.title && blog.title.length > 15) seoScore += 20;
      if (blog.seo_title) seoScore += 15;
      if (blog.seo_description) seoScore += 15;
      if (blog.tags && blog.tags.length > 0) seoScore += 10;

      return {
        ...blog,
        views: blogViews,
        video_plays: videoPlays,
        likes,
        comments_count: comments,
        shares,
        seoScore,
        revenue: parseFloat(revenue.toFixed(2))
      };
    });
    res.json(list);
  });

  app.get("/api/analytics/ads", (req, res) => {
    const list = db.ads.map(ad => {
      const adImpressions = db.ad_impressions.filter(v => v.ad_id == ad.id).length;
      const adClicks = db.ad_clicks.filter(v => v.ad_id == ad.id).length;
      const ctr = adImpressions > 0 ? parseFloat(((adClicks / adImpressions) * 100).toFixed(2)) : 0;
      const revenue = adImpressions * 0.0015 + adClicks * 0.12;

      return {
        ...ad,
        impressions: adImpressions,
        clicks: adClicks,
        ctr: ctr.toFixed(2) + "%",
        revenue: parseFloat(revenue.toFixed(2))
      };
    });
    res.json(list);
  });

  app.get("/api/analytics/videos", (req, res) => {
    const videoBlogs = db.blogs.filter(b => b.type === 'video');
    const statsList = videoBlogs.map(b => {
      const plays = db.video_views.filter(v => v.blog_id == b.id).length;
      const watchTime = plays * 3.5;
      return {
        id: b.id,
        title: b.title,
        plays,
        watchTime: parseFloat(watchTime.toFixed(1)),
        engagementRate: plays > 0 ? "55.4%" : "0.0%"
      };
    });
    res.json(statsList);
  });

  app.get("/api/analytics/revenue", (req, res) => {
    const totalImpressions = db.ad_impressions.length;
    const totalClicks = db.ad_clicks.length;
    const totalNet = totalImpressions * 0.0015 + totalClicks * 0.12;

    const adsterraImpressions = db.ad_impressions.filter(i => {
      const ad = db.ads.find(a => a.id == i.ad_id);
      return ad && (ad.sponsorName.toLowerCase().includes('adsterra') || ad.title.toLowerCase().includes('popunder') || ad.type === 'popunder');
    }).length;
    const adsterraClicks = db.ad_clicks.filter(i => {
      const ad = db.ads.find(a => a.id == i.ad_id);
      return ad && (ad.sponsorName.toLowerCase().includes('adsterra') || ad.title.toLowerCase().includes('popunder') || ad.type === 'popunder');
    }).length;

    const adsenseImpressions = db.ad_impressions.filter(i => {
      const ad = db.ads.find(a => a.id == i.ad_id);
      return ad && (ad.sponsorName.toLowerCase().includes('adsense') || ad.type === 'adsense');
    }).length;
    const adsenseClicks = db.ad_clicks.filter(i => {
      const ad = db.ads.find(a => a.id == i.ad_id);
      return ad && (ad.sponsorName.toLowerCase().includes('adsense') || ad.type === 'adsense');
    }).length;

    const adsterraRev = adsterraImpressions * 0.0010 + adsterraClicks * 0.08;
    const adsenseRev = adsenseImpressions * 0.0020 + adsenseClicks * 0.15;
    const directRev = Math.max(0, totalNet - (adsterraRev + adsenseRev));

    res.json({
      total: parseFloat(totalNet.toFixed(2)),
      sources: [
        { name: "Google AdSense", revenue: parseFloat(adsenseRev.toFixed(2)) },
        { name: "Adsterra Network", revenue: parseFloat(adsterraRev.toFixed(2)) },
        { name: "Direct Sponsored", revenue: parseFloat(directRev.toFixed(2)) }
      ]
    });
  });

  app.get("/api/admin/profile", (req, res) => {
    res.json(db.adminProfile || { name: "Rahul Makwana", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" });
  });

  app.post("/api/admin/profile", (req, res) => {
    const { name, avatar } = req.body || {};
    if (!db.adminProfile) {
      db.adminProfile = { name: "Rahul Makwana", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul" };
    }
    if (name) db.adminProfile.name = name;
    if (avatar) db.adminProfile.avatar = avatar;
    
    saveDatabase();
    res.json({ success: true, profile: db.adminProfile });
  });

  app.get("/api/site-config", (req, res) => {
    res.json(db.siteConfig || {
      siteName: "Aalasi Blog",
      motto: "The Ultimate Tech & Trading Oasis for the Laid-back Intellect.",
      footer: "© 2026 Aalasi Blog. Made with React, Tailwind, and Love.",
      contactEmail: "support@aalasi.com",
      telegram: "https://t.me/aalasiblog",
      instagram: "https://instagram.com/aalasiblog",
      youtube: "",
      facebook: "",
      twitter: "",
      siteLogo: "/uploads/aalasi_logo.png?v=fresh"
    });
  });

  app.post("/api/site-config", (req, res) => {
    const newConfig = req.body || {};
    if (!db.siteConfig) {
      db.siteConfig = {
        siteName: "Aalasi Blog",
        motto: "The Ultimate Tech & Trading Oasis for the Laid-back Intellect.",
        footer: "© 2026 Aalasi Blog. Made with React, Tailwind, and Love.",
        contactEmail: "support@aalasi.com",
        telegram: "https://t.me/aalasiblog",
        instagram: "https://instagram.com/aalasiblog",
        youtube: "",
        facebook: "",
        twitter: "",
        siteLogo: "/uploads/aalasi_logo.png?v=fresh"
      };
    }
    db.siteConfig = { ...db.siteConfig, ...newConfig };
    saveDatabase();
    res.json({ success: true, siteConfig: db.siteConfig });
  });
  
  app.post("/api/blogs", (req, res) => {
    const newBlog = req.body;
    
    if (!newBlog.slug) {
      newBlog.slug = newBlog.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    }
    if (!newBlog.created_at) {
      newBlog.created_at = new Date().toISOString();
    }
    
    if (newBlog.id) {
      const index = db.blogs.findIndex(b => b.id == newBlog.id);
      if (index !== -1) {
        db.blogs[index] = { ...db.blogs[index], ...newBlog };
        return res.json(db.blogs[index]);
      }
    } else {
      newBlog.id = Math.max(...db.blogs.map(b => b.id), 0) + 1;
    }
    
    db.blogs.push(newBlog);
    saveDatabase();
    res.json(newBlog);
  });

  // Delete a blog or draft
  app.delete("/api/blogs/:id", (req, res) => {
    const id = parseInt(req.params.id) || req.params.id;
    const initialLength = db.blogs.length;
    db.blogs = db.blogs.filter(b => b.id != id);
    if (db.blogs.length === initialLength) {
      return res.status(404).json({ error: "Article/Draft not found" });
    }
    saveDatabase();
    res.json({ success: true, message: "Article/Draft deleted successfully" });
  });

  // Get ads configuration
  app.get("/api/ads/config", (req, res) => {
    res.json(db.adsConfig);
  });

  app.post("/api/ads/config", (req, res) => {
    db.adsConfig = { ...db.adsConfig, ...req.body };
    saveDatabase();
    res.json(db.adsConfig);
  });

  // Get ads analytics
  app.get("/api/ads/stats", (req, res) => {
    res.json(db.adsStats);
  });

  // Track ad click or impression
  app.post("/api/ads/track", (req, res) => {
    const { id, type, placement } = req.body; // type: 'click' | 'impression'
    const adId = parseInt(id) || id;
    
    // Log to analytic lists
    const client = getClientDetails(req);
    if (type === 'click') {
      db.ad_clicks.push({
        id: db.ad_clicks.length + 1,
        ad_id: adId,
        user_ip: client.ip,
        device: client.device,
        clicked_at: new Date().toISOString()
      });
    } else {
      db.ad_impressions.push({
        id: db.ad_impressions.length + 1,
        ad_id: adId,
        user_ip: client.ip,
        device: client.device,
        viewed_at: new Date().toISOString()
      });
    }

    // Increment general counters
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const metric = type === 'click' ? db.adsStats.clicks : db.adsStats.impressions;
    const dateEntry = metric.find(e => e.date === today);
    if (dateEntry) {
      dateEntry.value++;
    } else {
      metric.push({ date: today, value: 1 });
      if (metric.length > 7) metric.shift(); // Keep trailing week
    }

    // Increment device counters based on user agent (for simulation)
    const ua = (req.headers['user-agent'] || '').toLowerCase();
    const isMobile = /mobile|android|iphone|ipad|phone/.test(ua);
    const deviceIndex = isMobile ? 0 : 1; // 0 == Mobile, 1 == Desktop
    db.adsStats.byDevice[deviceIndex].value++;

    // Increment placement counters
    if (placement) {
      const placementEntry = db.adsStats.byPlacement.find(p => p.placement === placement);
      if (placementEntry) {
        if (type === 'click') {
          placementEntry.clicks++;
        } else {
          placementEntry.impressions++;
        }
        // Recalculate CTR
        const ctr = placementEntry.impressions > 0 ? ((placementEntry.clicks / placementEntry.impressions) * 100).toFixed(2) + "%" : "0.00%";
        placementEntry.CTR = ctr;
      } else {
        db.adsStats.byPlacement.push({
          placement,
          impressions: type === 'impression' ? 1 : 0,
          clicks: type === 'click' ? 1 : 0,
          CTR: type === 'click' ? "100.00%" : "0.00%"
        });
      }
    }

    // Increment individual Campaign stats
    if (adId) {
      if (!db.adsStats.individualAdStats[adId]) {
        db.adsStats.individualAdStats[adId] = { impressions: 0, clicks: 0 };
      }
      if (type === 'click') {
        db.adsStats.individualAdStats[adId].clicks++;
      } else {
        db.adsStats.individualAdStats[adId].impressions++;
      }
    }

    saveDatabase();
    res.json({ success: true });
  });

  // Get ads
  app.get("/api/ads", (req, res) => {
    const { placement, all, category, device } = req.query;
    let result = db.ads;
    
    if (!all) {
      result = result.filter(ad => ad.active);
      const now = new Date();
      result = result.filter(ad => {
        const start = ad.startDate ? new Date(ad.startDate) : null;
        const end = ad.endDate ? new Date(ad.endDate) : null;
        if (start && now < start) return false;
        if (end && now > end) return false;
        return true;
      });
    }

    if (placement) {
      result = result.filter(ad => ad.placement === placement);
    }

    // Smart Category Ads Targeting
    if (category) {
      result = result.filter(ad => {
        // If the ad has defined category Slugs, check if it targets this category.
        // If it's an empty array, it means it's a generic ad targeting all categories.
        if (ad.categorySlugs && ad.categorySlugs.length > 0) {
          return ad.categorySlugs.includes(category as string);
        }
        return true;
      });
    }

    // Device Filtering
    if (device) {
      result = result.filter(ad => {
        if (ad.targetDevices && ad.targetDevices.length > 0) {
          return ad.targetDevices.includes(device as string);
        }
        return true;
      });
    }
    
    res.json(result);
  });

  app.post("/api/ads", (req, res) => {
    const newAd = req.body;
    newAd.id = Math.max(...db.ads.map(a => a.id), 0) + 1;
    if (!newAd.categorySlugs) newAd.categorySlugs = [];
    if (!newAd.targetDevices) newAd.targetDevices = ["desktop", "mobile"];
    db.ads.push(newAd);
    saveDatabase();
    res.json(newAd);
  });

  app.put("/api/ads/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const index = db.ads.findIndex(a => a.id === id);
    if (index === -1) return res.status(404).json({ error: "Ad not found" });
    db.ads[index] = { ...db.ads[index], ...req.body };
    saveDatabase();
    res.json(db.ads[index]);
  });

  app.delete("/api/ads/:id", (req, res) => {
    const id = parseInt(req.params.id);
    db.ads = db.ads.filter(a => a.id !== id);
    saveDatabase();
    res.json({ success: true });
  });

  // Get all blogs with filtering
  app.get("/api/blogs", (req, res) => {
    let result = db.blogs;

    if (req.query.search) {
      const q = (req.query.search as string).toLowerCase();
      result = result.filter(b => 
        b.title.toLowerCase().includes(q) || 
        b.content.toLowerCase().includes(q)
      );
    }

    
    if (req.query.language) {
      result = result.filter(b => b.language === req.query.language);
    }
    if (req.query.category) {
      result = result.filter(b => (b as any).category_slug === req.query.category);
    }
    if (req.query.trending === 'true') {
      result = result.filter(b => b.is_trending);
    }
    if (req.query.category_slug) {
      result = result.filter(b => b.category_slug === req.query.category_slug);
    }
    
    // Sort by newest
    result = result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    // Simple pagination simulation
    const limit = parseInt((req.query.limit as string) || "10");
    result = result.slice(0, limit);

    res.json(result);
  });

  // Get single blog
  app.get("/api/blogs/:slug", (req, res) => {
    const blog = db.blogs.find(b => b.slug === req.params.slug);
    if (!blog) return res.status(404).json({ error: "Blog not found" });
    res.json(blog);
  });

  // Get Categories
  app.get("/api/categories", (req, res) => {
    const categoriesWithCount = db.categories.map(c => {
      const count = db.blogs.filter(b => b.category_slug === c.slug).length;
      return { ...c, articleCount: count };
    });
    res.json(categoriesWithCount || []);
  });

  // Get Single Category
  app.get("/api/categories/:slug", (req, res) => {
    const category = db.categories?.find(c => c.slug === req.params.slug);
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.json(category);
  });

  // Mock Login API (JWT Auth simulation)
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@aalasi.com" && password === "password") {
      res.json({
        token: "mock-jwt-token-aaabbbccc",
        user: { id: 1, name: "Admin", email, role: "admin" }
      });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });


  // === Vite Middleware for Frontend Serving ===
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express Backend + Vite Frontend running at http://localhost:${PORT}`);
  });
}

startServer();
