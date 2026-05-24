import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { getBlogs, getCategory } from '../services/firebase';
import * as Icons from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AdBanner } from '../components/AdBanner';

const categoryStyles: Record<string, { gradient: string }> = {
  'trending': { gradient: 'from-[#FF5D5D] to-[#FF3B3B]' },
  'social-media': { gradient: 'from-[#FF4E98] to-[#D946EF]' },
  'news': { gradient: 'from-[#3B82F6] to-[#2563EB]' },
  'creators': { gradient: 'from-[#10B981] to-[#059669]' },
  'trading-finance': { gradient: 'from-[#F59E0B] to-[#D97706]' },
  'technology': { gradient: 'from-[#06B6D4] to-[#0284C7]' },
};

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<any>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getBannerPlacement = (area: 'top' | 'sidebar' | 'bottom') => {
    if (area === 'top' && slug) {
      if (slug === 'trending') return 'trend-cat-top';
      if (slug === 'social-media') return 'social-media-top';
      if (slug === 'news') return 'news-top';
      if (slug === 'creators') return 'creators-top';
      if (slug === 'trading-finance') return 'trading-top';
      if (slug === 'technology') return 'tech-top';
    }
    return `category-page-${area}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (!slug) return;
        const catData = await getCategory(slug);
        setCategory(catData);
        
        const blogsData = await getBlogs({ category_slug: slug, limit: 10 });
        setBlogs(blogsData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="flex justify-center flex-col items-center h-screen text-center">
        <h2 className="text-3xl font-bold mb-4">Category Not Found</h2>
        <Link to="/categories" className="text-indigo-600 hover:text-indigo-800 underline">Back to Categories</Link>
      </div>
    );
  }

  const style = categoryStyles[slug || ''] || { gradient: 'from-indigo-500 to-purple-600' };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>{category.seo_title || category.title} | Aalasi Blog</title>
        <meta name="description" content={category.seo_description || category.description} />
      </Helmet>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 uppercase tracking-wide">
        {category.title} Articles
      </h2>
      
      <AdBanner placement={getBannerPlacement('top')} />

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map((blog, bIdx) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: bIdx * 0.1 }}
              >
                <Link 
                  to={`/blog/${blog.slug}`} 
                  className="bg-white dark:bg-[#0B0F19] rounded-2xl overflow-hidden shadow-sm hover:shadow-[0_0_30px_rgba(99,102,241,0.15)] dark:hover:shadow-[0_0_30px_rgba(99,102,241,0.1)] transition-all duration-300 border border-gray-100 dark:border-[#1E2536] flex flex-col h-full group relative"
                >
                  <div className="relative h-[220px] overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                    {blog.thumbnail || blog.featured_image ? (
                      <img 
                        src={blog.thumbnail || blog.featured_image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 font-bold">AALASI</div>
                    )}
                    {blog.type === 'video' && (
                      <div className="absolute bottom-3 right-3 z-20 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                        <Icons.Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
                      </div>
                    )}
                    {blog.featured_category_blog && (
                      <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    {blog.is_trending && (
                      <span className="text-[10px] font-bold text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded-full uppercase tracking-widest w-fit mb-3">Trending</span>
                    )}
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-[#818cf8] transition-colors line-clamp-2 leading-tight">
                      {blog.title}
                    </h4>
                    <div className="mt-auto pt-5 border-t border-gray-50 dark:border-white/5 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 font-medium">
                      <span className="flex items-center gap-3">
                        {blog.author.avatar ? (
                          <img src={blog.author.avatar} alt="" className="w-6 h-6 rounded-full" />
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-[8px] font-bold text-indigo-600">
                            {blog.author.name.charAt(0)}
                          </div>
                        )}
                        {blog.author.name}
                      </span>
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
            {blogs.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-500 dark:text-gray-400 border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl">
                No articles found in this category yet.
              </div>
            )}
          </div>
        </div>

        <aside className="lg:w-80 space-y-8">
           <AdBanner placement={getBannerPlacement('sidebar')} />
           <div className="bg-indigo-50 dark:bg-indigo-900/10 p-6 rounded-2xl border border-indigo-100 dark:border-indigo-500/10">
              <h3 className="text-sm font-black text-indigo-900 dark:text-indigo-400 uppercase tracking-widest mb-4">Newsletter</h3>
              <p className="text-xs text-indigo-700 dark:text-indigo-500/70 mb-4 font-medium">Stay updated with {category.title} news.</p>
              <input type="email" placeholder="Email.." className="w-full bg-white dark:bg-[#060913] border border-indigo-200 dark:border-indigo-500/20 p-3 rounded-xl text-xs outline-none focus:border-indigo-500" />
           </div>
        </aside>
      </div>

      <div className="mt-12">
        <AdBanner placement={getBannerPlacement('bottom')} />
      </div>

    </div>
  );
}
