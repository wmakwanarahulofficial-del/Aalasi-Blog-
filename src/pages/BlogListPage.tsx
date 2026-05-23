import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getBlogs } from '../services/api';
import { formatDistanceToNow } from 'date-fns';
import { ChevronLeft } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

export function BlogListPage({ type = 'latest' }: { type?: 'latest' | 'trending' | 'category' }) {
  const { t, i18n } = useTranslation();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const categorySlug = queryParams.get('category');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = { language: i18n.language };
        if (type === 'trending') params.trending = 'true';
        if (categorySlug) params.category = categorySlug;

        const blogsRes = await getBlogs(params);
        if (blogsRes.length === 0) {
           // Fallback if no specific language blogs exist (for demo purposes)
           const fallbackParams: any = {};
           if (type === 'trending') fallbackParams.trending = 'true';
           if (categorySlug) fallbackParams.category = categorySlug;
           const allBlogs = await getBlogs(fallbackParams);
           setBlogs(allBlogs);
        } else {
           setBlogs(blogsRes);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    window.scrollTo(0, 0);
  }, [i18n.language, type, categorySlug, location.search]);

  let title = t('latest_blogs');
  if (type === 'trending') title = t('trending');
  if (categorySlug) title = `${t('categories')}: ${categorySlug.toUpperCase()}`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>{title} | Aalasi Blog</title>
      </Helmet>

      {categorySlug && (
        <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>
      )}

      <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-10 uppercase tracking-wider border-b-4 border-indigo-600 inline-block pb-2">
        {title}
      </h1>

      <AdBanner placement={type === 'latest' ? 'latest-blogs-top' : 'trending-top'} />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog, index) => (
            <motion.article 
              key={blog.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col group"
            >
              <Link to={`/blog/${blog.slug}`} className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors z-10"></div>
                {blog.featured_image ? (
                  <img 
                    src={blog.featured_image} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 font-bold">AALASI</div>
                )}
                <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-md">
                  {blog.category_slug}
                </span>
              </Link>
              
              <div className="p-6 flex flex-col flex-grow">
                <Link to={`/blog/${blog.slug}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>
                <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                  {blog.content}
                </p>
                
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    {blog.author.avatar ? (
                      <img src={blog.author.avatar} alt="Author" className="w-8 h-8 rounded-full bg-gray-100" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 uppercase">
                        {blog.author.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-gray-700">{blog.author.name}</span>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {formatDistanceToNow(new Date(blog.created_at))} ago
                  </span>
                </div>
              </div>
            </motion.article>
          ))}

          {blogs.length === 0 && (
            <div className="col-span-full py-20 text-center text-gray-500">
              <p className="text-xl">No articles found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
