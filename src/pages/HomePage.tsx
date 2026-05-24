import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getBlogs, getCategories } from '../services/firebase';
import { formatDistanceToNow } from 'date-fns';
import { AdBanner } from '../components/AdBanner';

export function HomePage() {
  const { t, i18n } = useTranslation();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [blogsRes, catsRes] = await Promise.all([
          getBlogs({ language: i18n.language }), 
          getCategories()
        ]);
        // If no blogs for selected language, fallback to all (for demo purposes)
        if (blogsRes.length === 0) {
           const allBlogs = await getBlogs();
           setBlogs(allBlogs);
        } else {
           setBlogs(blogsRes);
        }
        setCategories(catsRes);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const trendingBlog = blogs.find(b => b.is_trending) || blogs[0];
  const otherBlogs = blogs.filter(b => b.id !== trendingBlog?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Helmet>
        <title>Aalasi Blog | Home</title>
        <meta name="description" content="Aalasi modern multi-language blogging platform." />
      </Helmet>
      
      {/* Top Banner Ad Slot */}
      <AdBanner placement="homepage-top" />
      
      {/* Hero / Trending Section (Magazine Style) - Now secondary to top ad if needed, or we can keep it as is if they want both. The user said "use hata dena" for the trending banner if ads are there. */}
      {/* Since the user specifically said to remove it to use for ads, we'll conditionally show it only if there's no top ad, or just remove it if they prefer a pure ad space. Let's make it so it only shows if an ad isn't present or just move it down. */}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Latest Blogs */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-black text-gray-900 mb-8 uppercase tracking-wider border-b-2 border-indigo-600 inline-block pb-1">
            {t('latest_blogs')}
          </h2>
          <div className="space-y-8">
            {otherBlogs.map((blog) => (
              <motion.article 
                key={blog.id} 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-6 group"
              >
                <div className="md:w-64 flex-shrink-0 overflow-hidden rounded-xl">
                  <Link to={`/blog/${blog.slug}`}>
                    {blog.featured_image ? (
                      <img 
                        src={blog.featured_image} 
                        alt={blog.title} 
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-300 font-bold">
                        AALASI
                      </div>
                    )}
                  </Link>
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-indigo-600 text-xs font-bold uppercase tracking-wider mb-2">
                    {blog.category_slug}
                  </span>
                  <Link to={`/blog/${blog.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 line-clamp-2 mb-4 text-sm">
                    {blog.content}
                  </p>
                  <div className="mt-auto flex items-center text-xs text-gray-500">
                    <span className="font-medium text-gray-700">{blog.author.name}</span>
                    <span className="mx-2">•</span>
                    <span>{formatDistanceToNow(new Date(blog.created_at))} ago</span>
                  </div>
                </div>
              </motion.article>
            ))}
            {otherBlogs.length === 0 && (
              <p className="text-gray-500">No blogs found for this language.</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-12">
          {/* Categories */}
          <div>
            <h2 className="text-xl font-black text-gray-900 mb-6 uppercase border-b-2 border-gray-200 pb-2">
              {t('categories')}
            </h2>
            <div className="flex flex-col space-y-3">
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  to={`/category/${cat.slug}`}
                  className="flex justify-between items-center px-4 py-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-slate-800 group"
                >
                  <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-indigo-600 transition-colors uppercase text-sm">{cat.title}</span>
                  <span className="text-gray-400 dark:text-gray-600">&rarr;</span>
                </Link>
              ))}
            </div>
          </div>

          <AdBanner placement="homepage-sidebar" />

          {/* Newsletter (Mock) */}
          <div className="bg-gray-900 dark:bg-slate-900 rounded-2xl p-6 text-white text-center border border-transparent dark:border-white/10">
            <h3 className="text-xl font-bold mb-2">Subscribe</h3>
            <p className="text-sm text-gray-400 mb-6">Get the latest articles directly in your inbox.</p>
            <input type="email" placeholder="Your email address" className="w-full px-4 py-2 rounded-lg bg-gray-800 dark:bg-slate-800 border border-gray-700 dark:border-white/10 text-white mb-3 focus:outline-none focus:border-indigo-500" />
            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-colors">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Ad Slot */}
      <AdBanner placement="homepage-bottom" />
    </div>
  );
}
