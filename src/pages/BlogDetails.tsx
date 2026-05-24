import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { getBlogBySlug } from '../services/firebase';
import { format } from 'date-fns';
import { Share2, Heart, MessageSquare, ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { AdBanner } from '../components/AdBanner';

import { ContentRenderer } from '../components/ContentRenderer';

export function BlogDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (slug) {
          const data = await getBlogBySlug(slug);
          setBlog(data);
          if (data && data.id) {
            fetch('/api/track-view', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ blogId: data.id })
            }).catch(err => console.error("Error tracking view:", err));
          }
        }
      } catch (error) {
        console.error("Failed to fetch blog", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
    // Scroll to top
    window.scrollTo(0, 0);
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Article Not Found</h1>
        <button onClick={() => navigate(-1)} className="text-indigo-600 hover:underline flex items-center justify-center gap-2 mx-auto">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Helmet>
        <title>{blog.seo_title || blog.title} | Aalasi Blog</title>
        <meta name="description" content={blog.seo_description} />
      </Helmet>

      <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back
      </button>

      <header className="mb-10 text-center mx-auto max-w-3xl">
        <AdBanner placement="blog-top" />
        <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
          {blog.category_slug}
        </span>
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 leading-tight">
          {blog.title}
        </h1>
        <div className="flex items-center justify-center text-gray-500 text-sm gap-6">
          <div className="flex items-center gap-2">
            {blog.author.avatar ? (
              <img src={blog.author.avatar} alt={blog.author.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                {blog.author.name.charAt(0)}
              </div>
            )}
            <div className="text-left">
              <p className="font-semibold text-gray-900">{blog.author.name}</p>
              <p className="text-xs">{t('author')}</p>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="text-left">
            <p className="font-semibold text-gray-900">{format(new Date(blog.created_at), 'MMMM d, yyyy')}</p>
            <p className="text-xs">{t('published')}</p>
          </div>
        </div>
      </header>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 rounded-2xl overflow-hidden shadow-xl"
      >
        {blog.featured_image ? (
          <img 
            src={blog.featured_image} 
            alt={blog.title} 
            className="w-full h-auto max-h-[600px] object-cover"
          />
        ) : null}
      </motion.div>

      <div className="flex flex-col md:flex-row gap-10">
        {/* Social Share Sidebar */}
        <div className="md:w-16 flex flex-row md:flex-col items-center justify-start gap-4 text-gray-400">
          <button className="p-3 bg-white rounded-full shadow-sm hover:text-indigo-600 hover:shadow-md transition-all">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white rounded-full shadow-sm hover:text-blue-500 hover:shadow-md transition-all">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white rounded-full shadow-sm hover:text-green-500 hover:shadow-md transition-all">
            <MessageSquare className="w-5 h-5" />
          </button>
          <span className="text-xs font-semibold uppercase mt-2">{blog.views} <br className="hidden md:block"/>views</span>
        </div>

        {/* Content */}
        <div className="flex-1 prose prose-lg prose-indigo max-w-none text-gray-700">
          <p className="lead text-xl text-gray-600 font-medium mb-8 leading-relaxed">
            {blog.seo_description}
          </p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-100">
            <h4 className="text-lg font-bold text-gray-900 mb-4 uppercase text-sm tracking-wider">Table of Contents</h4>
            <ul className="space-y-2 m-0 list-none pl-0">
              <li><a href="#" className="text-indigo-600 font-medium no-underline hover:underline">1. Introduction</a></li>
              <li><a href="#" className="text-indigo-600 font-medium no-underline hover:underline">2. The Main Concept</a></li>
              <li><a href="#" className="text-indigo-600 font-medium no-underline hover:underline">3. Conclusion</a></li>
            </ul>
          </div>

          <ContentRenderer content={blog.content} />
          
          <div className="my-10">
            <AdBanner placement="blog-bottom" />
          </div>

          {/* Tags */}
          <div className="mt-12 flex flex-wrap gap-2">
            {blog.tags.map((tag: string) => (
              <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full font-medium"> # {tag} </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
