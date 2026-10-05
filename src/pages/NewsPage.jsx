/**
 * NewsPage — Phase J CMS Hydration
 *
 * Fetches news articles from GET /api/v1/public/news using the central CMS layer.
 * No localhost hardcodes. No primary localStorage source.
 * localStorage is used ONLY as a last-resort emergency cache (stale-while-unavailable).
 * If CMS returns empty, the page reflects that — no static resurrection.
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, ArrowRight, MapPin, Building } from 'lucide-react';
import { getPublicNews, extractArray } from '../api/cms';
import { useSiteSettings } from '../context/SiteSettingsContext';

const CACHE_KEY = 'why_news_articles_cache';

export default function NewsPage() {
  const { general } = useSiteSettings();
  const brandName = general?.brand_name || 'WHY IT Services';
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadNews() {
      try {
        const res = await getPublicNews();
        if (!mounted) return;

        const data = extractArray(res);
        setArticles(data);
        setError(null);

        // Update local cache for offline resilience
        if (data.length > 0) {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
          } catch {
            // localStorage unavailable — not critical
          }
        }
      } catch (err) {
        if (!mounted) return;

        // Network error — try local cache as emergency fallback
        try {
          const cached = localStorage.getItem(CACHE_KEY);
          if (cached) {
            const parsed = JSON.parse(cached);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setArticles(parsed.filter(a => a.status === 'Published' || a.status === 'published'));
              setError('Showing cached news. Live data unavailable.');
              return;
            }
          }
        } catch {
          // Cache also unavailable
        }

        setError('Unable to load news articles. Please try again.');
        setArticles([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadNews();
    return () => { mounted = false; };
  }, []);

  const featuredArticle = articles.find(a => a.is_featured || a.isFeatured) || articles[0] || null;
  const otherArticles = featuredArticle
    ? articles.filter(a => (a.id !== featuredArticle.id) && (a.slug !== featuredArticle.slug))
    : articles;

  return (
    <div className="bg-[#FAFAFC] text-[#0F172A] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-[#2563EB]" />
            Corporate Newsroom &amp; Press Releases
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            News &amp; <span className="text-[#2563EB]">Press Releases</span>
          </h1>
          <p className="text-slate-600 text-sm leading-relaxed">
            Stay updated with corporate expansions, technology breakthroughs, and engineering pod announcements at {brandName}.
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="flex flex-col items-center gap-3">
              <div className="w-9 h-9 border-[3px] border-blue-200 border-t-[#2563EB] rounded-full animate-spin" />
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading news...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-6 bg-amber-50 border border-amber-200 rounded-2xl px-6">
            <p className="text-sm text-amber-700 font-medium">{error}</p>
          </div>
        )}

        {/* Empty State — CMS returned no articles */}
        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl px-6">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-600 text-lg">No Press Releases Yet</h3>
            <p className="text-xs text-slate-400 mt-1">Check back soon for the latest corporate news.</p>
          </div>
        )}

        {/* Featured Press Release Card */}
        {!loading && featuredArticle && (
          <div className="bg-gradient-to-br from-blue-50/40 via-white to-slate-50/60 border border-[#BFDBFE] rounded-3xl p-6 sm:p-10 shadow-lg space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
              <div className="inline-flex items-center gap-2 bg-[#2563EB] text-white px-3.5 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm shrink-0">
                FEATURED NEWS
              </div>
              <span className="text-xs text-blue-700 font-bold">{featuredArticle.category} • {featuredArticle.date || featuredArticle.published_at}</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              {featuredArticle.title}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2">
              {featuredArticle.image && (
                <div className="lg:col-span-7 relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
                  <img
                    src={featuredArticle.image}
                    alt={featuredArticle.title}
                    className="w-full h-[240px] sm:h-[340px] object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                </div>
              )}

              <div className={`${featuredArticle.image ? 'lg:col-span-5' : 'lg:col-span-12'} space-y-6`}>
                <p className="text-sm text-slate-700 leading-relaxed font-normal">
                  {featuredArticle.summary || featuredArticle.excerpt}
                </p>

                <div className="pt-2">
                  <Link
                    to={`/about/news/${featuredArticle.slug || featuredArticle.id}`}
                    className="w-full sm:w-auto bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs sm:text-sm font-extrabold px-6 py-4 rounded-xl uppercase tracking-wider transition-all shadow-md flex sm:inline-flex items-center justify-center gap-2.5 text-center active:scale-98"
                  >
                    <span>Read the press release</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        {!loading && otherArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            {otherArticles.map((news) => (
              <div key={news.id || news.slug} className="bg-white border border-[#BFDBFE] rounded-3xl overflow-hidden shadow-sm hover:border-[#2563EB] hover:shadow-lg transition-all flex flex-col justify-between group">
                <div>
                  {news.image && (
                    <img
                      src={news.image}
                      alt={news.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  )}
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                      <span className="text-[#2563EB] font-bold">{news.category}</span>
                      <span>{news.date || news.published_at}</span>
                    </div>
                    <h3 className="font-extrabold text-base text-[#0F172A] group-hover:text-[#2563EB] transition-colors leading-snug">
                      {news.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {news.summary || news.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <Link
                    to={`/about/news/${news.slug || news.id}`}
                    className="text-xs font-extrabold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    <span>Read Full Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
