import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/firebase';
import * as Icons from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

const categoryStyles: Record<string, { gradient: string, border: string, bgGlow: string, text: string, iconBg: string }> = {
  'trending': { 
    gradient: 'from-[#A855F7]/10 to-transparent',
    border: 'border-[#1E2536] dark:border-[#A855F7]/30 hover:border-[#A855F7]/60 dark:hover:border-[#A855F7]',
    bgGlow: 'hover:bg-gray-50 dark:hover:bg-[#A855F7]/5',
    text: 'text-purple-600 dark:text-[#E879F9]', 
    iconBg: 'bg-gradient-to-br from-[#C084FC] to-[#9333EA]'
  },
  'social-media': { 
    gradient: 'from-[#EC4899]/10 to-transparent',
    border: 'border-[#1E2536] dark:border-[#EC4899]/30 hover:border-[#EC4899]/60 dark:hover:border-[#EC4899]',
    bgGlow: 'hover:bg-gray-50 dark:hover:bg-[#EC4899]/5',
    text: 'text-pink-600 dark:text-[#F472B6]', 
    iconBg: 'bg-gradient-to-br from-[#F472B6] to-[#DB2777]'
  },
  'news': { 
    gradient: 'from-[#3B82F6]/10 to-transparent',
    border: 'border-[#1E2536] dark:border-[#3B82F6]/30 hover:border-[#3B82F6]/60 dark:hover:border-[#3B82F6]',
    bgGlow: 'hover:bg-gray-50 dark:hover:bg-[#3B82F6]/5',
    text: 'text-blue-600 dark:text-[#60A5FA]', 
    iconBg: 'bg-gradient-to-br from-[#60A5FA] to-[#2563EB]'
  },
  'creators': { 
    gradient: 'from-[#10B981]/10 to-transparent',
    border: 'border-[#1E2536] dark:border-[#10B981]/30 hover:border-[#10B981]/60 dark:hover:border-[#10B981]',
    bgGlow: 'hover:bg-gray-50 dark:hover:bg-[#10B981]/5',
    text: 'text-emerald-600 dark:text-[#34D399]', 
    iconBg: 'bg-gradient-to-br from-[#34D399] to-[#059669]'
  },
  'trading-finance': { 
    gradient: 'from-[#F59E0B]/10 to-transparent',
    border: 'border-[#1E2536] dark:border-[#F59E0B]/30 hover:border-[#F59E0B]/60 dark:hover:border-[#F59E0B]',
    bgGlow: 'hover:bg-gray-50 dark:hover:bg-[#F59E0B]/5',
    text: 'text-amber-600 dark:text-[#FBBF24]', 
    iconBg: 'bg-gradient-to-br from-[#FBBF24] to-[#D97706]'
  },
  'technology': { 
    gradient: 'from-[#06B6D4]/10 to-transparent',
    border: 'border-[#1E2536] dark:border-[#06B6D4]/30 hover:border-[#06B6D4]/60 dark:hover:border-[#06B6D4]',
    bgGlow: 'hover:bg-gray-50 dark:hover:bg-[#06B6D4]/5',
    text: 'text-cyan-600 dark:text-[#22D3EE]', 
    iconBg: 'bg-gradient-to-br from-[#22D3EE] to-[#0284C7]'
  },
};

export function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catData = await getCategories();
        setCategories(catData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 font-sans">
      <Helmet>
        <title>Explore Categories | Aalasi Blog</title>
      </Helmet>

      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#818cf8] to-[#c084fc]">Categories</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl">
          Choose a category to explore articles in your area of interest.
        </p>
        <div className="w-12 h-1 bg-gradient-to-r from-[#818cf8] to-[#c084fc] rounded-full mx-auto mt-6"></div>
      </div>

      <AdBanner placement="category-list-top" />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#818cf8]"></div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {categories.map((cat, index) => {
            // @ts-ignore
            const Icon = Icons[cat.icon?.split('-').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('')] || Icons.Folder;
            const style = categoryStyles[cat.slug] || { 
              gradient: 'from-indigo-500/10 to-transparent',
              border: 'border-[#1E2536] dark:border-indigo-500/30 hover:border-indigo-500',
              bgGlow: 'hover:bg-gray-50 dark:hover:bg-indigo-500/5',
              text: 'text-indigo-600 dark:text-indigo-400',
              iconBg: 'bg-gradient-to-br from-indigo-400 to-indigo-600'
            };
            
            return (
              <motion.div 
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link 
                  to={`/category/${cat.slug}`}
                  className={`flex items-center justify-between p-5 md:p-6 rounded-3xl bg-white dark:bg-[#0A0D15] border ${style.border} ${style.bgGlow} transition-all duration-300 relative overflow-hidden group`}
                >
                  {/* Subtle Background Glow effect */}
                  <div className={`absolute left-0 bottom-0 top-0 w-3/4 md:w-1/2 bg-gradient-to-r ${style.gradient} opacity-0 dark:opacity-100`}></div>
                  
                  <div className="flex items-center gap-5 md:gap-6 relative z-10 w-full pr-4">
                    <div className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-white ${style.iconBg} shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 md:w-8 md:h-8 stroke-[1.5]" />
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:dark:text-white transition-colors">{cat.title}</h3>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 truncate md:whitespace-normal">{cat.description}</p>
                      <span className={`text-sm md:text-[13px] font-bold ${style.text}`}>{cat.articleCount || 0} Articles</span>
                    </div>
                  </div>
                  
                  <div className={`hidden sm:flex w-10 h-10 md:w-12 md:h-12 rounded-full border border-gray-200 dark:border-gray-800 items-center justify-center shrink-0 group-hover:border-current ${style.text} transition-colors relative z-10`}>
                     <Icons.ArrowRight className="w-5 h-5 text-gray-400 dark:text-white group-hover:text-current transition-colors" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
