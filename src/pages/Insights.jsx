import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, BookOpen, Clock, Tag, Search, 
  Share2, ChevronRight, User, Calendar, Cpu, Layers, ShieldCheck
} from 'lucide-react';
import { getPublicNews, extractArray } from '../api/cms';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Insights() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  

    const { general } = useSiteSettings();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    let mounted = true;
    async function fetchInsights() {
      try {
        const res = await getPublicNews();
        if (mounted && res.success) {
          const allNews = extractArray(res);
          const insightsOnly = allNews.filter(n => n.type === 'insight');
          setArticles(insightsOnly);
          
          const cats = ['All', ...new Set(insightsOnly.map(a => a.category).filter(Boolean))];
          setCategories(cats);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchInsights();
    return () => { mounted = false; };
  }, []);

  const filteredArticles = articles.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.summary || item.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.tags || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFC] min-h-screen py-12">
      
      {/* Header Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 bg-orange-950/80 border border-blue-800 text-sky-300 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Engineering Insights & Thought Leadership</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              Tech Insights, AI Architecture & Engineering Whitepapers
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Explore in-depth technical analysis, Generative AI implementation guides, data lake engineering strategies, and enterprise software best practices from {general?.brand_name || 'WHY IT Services'} engineering pods.
            </p>
          </div>
        </div>
      </section>

      {/* Filter Tabs & Search */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#BFDBFE] shadow-sm">
          
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search AI, Data, Cloud guides..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium text-[#0F172A] focus:outline-none focus:border-[#2563EB]"
            />
          </div>

        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex lg:grid overflow-x-auto snap-x snap-mandatory lg:overflow-visible pb-4 gap-4 lg:grid-cols-3 lg:gap-8 no-scrollbar">
          {filteredArticles.map((article) => (
            <article 
              key={article.id}
              className="shrink-0 w-[85vw] max-w-sm snap-center lg:w-auto lg:shrink bg-white border border-[#BFDBFE] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-[#2563EB] transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#2563EB] text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-md">
                    {article.category}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      {article.readTime}
                    </span>
                    <span>{article.date}</span>
                  </div>

                  <h3 className="font-extrabold text-base text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {article.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {article.tags.map((t) => (
                      <span key={t} className="text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded-md">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500">{article.author}</span>
                <Link 
                  to="/schedule-discovery"
                  className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-white border border-[#BFDBFE] rounded-3xl p-8">
            <h3 className="text-lg font-bold text-slate-700">No articles matched your filter criteria</h3>
            <p className="text-xs text-slate-500 mt-1">Try changing your search terms or active category tab.</p>
          </div>
        )}
      </section>

    </div>
  );
}

