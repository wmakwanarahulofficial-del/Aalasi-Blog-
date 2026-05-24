import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'react-router-dom';
import { getBlogs } from '../services/firebase';
import { formatDistanceToNow } from 'date-fns';
import { AdBanner } from '../components/AdBanner';

export function SearchPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQ = queryParams.get('q') || '';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: any = { search: searchQ };
        const blogsRes = await getBlogs(params);
        setBlogs(blogsRes);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    if (searchQ) {
      fetchData();
    } else {
      setBlogs([]);
      setLoading(false);
    }
    window.scrollTo(0, 0);
  }, [searchQ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>Search: {searchQ} | Aalasi Blog</title>
      </Helmet>

      <AdBanner placement="search-top" />

      <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-10 uppercase tracking-wider border-b-4 border-indigo-600 inline-block pb-2">
        Search Results for "{searchQ}"
      </h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          <div className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {blogs.map((blog, index) => (
                <motion.article 
                  key={blog.id} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-800 flex flex-col group"
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
                      <div className="w-full h-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-gray-300 font-bold">AALASI</div>
                    )}
                    <span className="absolute top-4 left-4 z-20 px-3 py-1 bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-md">
                      {blog.category}
                    </span>
                  </Link>
                  
                  <div className="p-6 flex flex-col flex-grow">
                    <Link to={`/blog/${blog.slug}`}>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 line-clamp-3">
                      {blog.content}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        {blog.author.avatar ? (
                          <img src={blog.author.avatar} alt="Author" className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase">
                            {blog.author.name.charAt(0)}
                          </div>
                        )}
                        <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{blog.author.name}</span>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {formatDistanceToNow(new Date(blog.created_at))} ago
                      </span>
                    </div>
                  </div>
                </motion.article>
              ))}

              {blogs.length === 0 && (
                <div className="col-span-full py-20 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-xl">No articles found matching your query.</p>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:w-80">
            <AdBanner placement="search-sidebar" />
          </aside>
        </div>
      )}
    </div>
  );
}
