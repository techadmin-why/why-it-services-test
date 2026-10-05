/**
 * PressReleaseDetail — Phase J CMS Hydration
 *
 * Fetches article content from GET /api/v1/public/news/:slug.
 * localStorage is NO LONGER the primary data source — it is only an emergency cache.
 * Sanitized HTML body is rendered safely.
 */
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, MapPin, Calendar, CheckCircle2, ArrowRight, Share2, Building, Play, User, Globe } from 'lucide-react';
import NotFound from './NotFound';
import { getPublicNewsBySlug, extractObject } from '../api/cms';

function getYouTubeEmbedUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  return url.startsWith('http') ? url : `https://www.youtube.com/embed/${url}`;
}

function sanitizeHtml(htmlStr) {
  if (!htmlStr) return '';
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlStr, 'text/html');
    const dangerous = doc.querySelectorAll('script, iframe[src*="javascript:"], object, embed, style');
    dangerous.forEach(s => s.remove());
    const allElements = doc.querySelectorAll('*');
    allElements.forEach(el => {
      [...el.attributes].forEach(attr => {
        if (attr.name.startsWith('on') || attr.value.trim().toLowerCase().startsWith('javascript:')) {
          el.removeAttribute(attr.name);
        }
      });
      // Ensure external links are safe
      if (el.tagName === 'A' && el.getAttribute('target') === '_blank') {
        el.setAttribute('rel', 'noopener noreferrer');
      }
    });
    return doc.body.innerHTML;
  } catch {
    return htmlStr;
  }
}

export default function PressReleaseDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadArticle() {
      const currentSlug = slug || '';
      if (!currentSlug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const res = await getPublicNewsBySlug(currentSlug);
        if (!mounted) return;

        const data = extractObject(res);
        if (data) {
          setArticle(data);
          setNotFound(false);

          // Update document title
          const articleTitle = data.seo_title || data.seoTitle || data.title;
          document.title = `${articleTitle} | WHY IT Services`;
          const metaDesc = document.querySelector('meta[name="description"]');
          if (metaDesc) {
            metaDesc.setAttribute('content', data.seo_description || data.seoDescription || data.summary || data.excerpt || articleTitle);
          }
        } else {
          setNotFound(true);
          document.title = 'Page Not Found | WHY IT Services';
        }
      } catch (err) {
        if (!mounted) return;

        // 404 from API → article not found
        if (err.status === 404) {
          setNotFound(true);
          document.title = 'Page Not Found | WHY IT Services';
        } else {
          // Network error — try local cache
          try {
            const cached = localStorage.getItem('why_news_articles_cache');
            if (cached) {
              const parsed = JSON.parse(cached);
              if (Array.isArray(parsed)) {
                const found = parsed.find(a => a.slug === currentSlug || a.id === currentSlug);
                if (found && (found.status === 'Published' || found.status === 'published')) {
                  setArticle(found);
                  setNotFound(false);
                  return;
                }
              }
            }
          } catch {
            // Cache also unavailable
          }
          setNotFound(true);
          document.title = 'Page Not Found | WHY IT Services';
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadArticle();
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-[3px] border-blue-200 border-t-[#2563EB] rounded-full animate-spin" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading article...</span>
        </div>
      </div>
    );
  }

  if (notFound) {
    return <NotFound />;
  }

  if (!article) return null;

  const youtubeEmbed = getYouTubeEmbedUrl(article.videoUrl || article.video_url);
  const imageUrl = article.image || article.image_url || null;

  return (
    <div className="bg-[#FAFAFC] text-[#0F172A] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Back Navigation Link */}
        <div className="flex items-center justify-start pb-2">
          <Link 
            to="/about/news"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold text-[#2563EB] hover:text-[#1E40AF] bg-[#EFF6FF] hover:bg-[#BFDBFE] px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-[#BFDBFE] transition-all shadow-sm group"
          >
            <ArrowLeft className="w-4 h-4 text-[#2563EB] group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to All News &amp; Press Releases</span>
          </Link>
        </div>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="bg-[#2563EB] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {article.category || 'PRESS RELEASE'}
            </span>
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#2563EB]" />
              {article.date || article.published_at || ''}
            </span>
            {(article.location) && (
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                {article.location}
              </span>
            )}
            {(article.author) && (
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#2563EB]" />
                {article.author}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight">
            {article.title}
          </h1>

          {(article.summary || article.excerpt) && (
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal border-l-2 border-[#2563EB] pl-4 italic">
              {article.summary || article.excerpt}
            </p>
          )}
        </div>

        {/* Media Showcase: YouTube Video Embed or Featured Image */}
        {youtubeEmbed ? (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 bg-black aspect-video">
            <iframe
              src={youtubeEmbed}
              title={article.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : imageUrl ? (
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
            <img 
              src={imageUrl} 
              alt={article.title}
              className="w-full h-[280px] sm:h-[420px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent flex items-end p-6 text-white justify-between">
              <div>
                <span className="text-[10px] font-mono text-sky-300 font-bold uppercase tracking-wider block">WHY IT Services Global Newsroom</span>
                <h3 className="text-base sm:text-xl font-extrabold">{article.title}</h3>
              </div>
            </div>
          </div>
        ) : null}

        {/* Main Press Release Body */}
        <div className="bg-white border border-[#BFDBFE] rounded-3xl p-6 sm:p-10 shadow-sm space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
          
          <div 
            className="prose prose-blue max-w-none space-y-4"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content || article.body || '<p>No additional content provided.</p>') }}
          />

          {/* Official Registered HQ Box */}
          <div className="bg-[#F8FAFC] border border-[#BFDBFE] rounded-2xl p-5 space-y-2 text-xs sm:text-sm mt-8">
            <div className="flex items-center gap-2 font-extrabold text-[#2563EB] uppercase tracking-wider">
              <Building className="w-4 h-4 text-[#2563EB]" />
              <span>Official Registered Headquarters</span>
            </div>
            <p className="font-bold text-[#0F172A]">WHY Services India Private Limited</p>
            <p className="text-slate-600">
              1st Floor, No. 14/1, Balaji Krupa, 2nd Main Road, Seshadripuram, Bengaluru – 560020, Karnataka, India
            </p>
          </div>

          <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/schedule-discovery"
              className="bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-extrabold px-8 py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
            >
              <span>Schedule Discovery Call</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            
            <Link
              to="/about/news"
              className="text-xs font-bold text-slate-600 hover:text-[#2563EB] transition-colors"
            >
              Explore More Corporate News →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
