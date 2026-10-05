/**
 * Testimonials — Phase J CMS Hydration
 *
 * Fetches testimonials from GET /api/v1/public/testimonials.
 * If CMS is empty (admin unpublished all), no hardcoded testimonials are resurrected.
 * Static fallback only on network error.
 */
import React, { useState, useEffect } from 'react';
import { Quote, Star, ChevronLeft, ChevronRight, Sparkles, Building2, CheckCircle2 } from 'lucide-react';
import { getPublicTestimonials, extractArray } from '../api/cms';

// Emergency static fallback — only used on network error, not empty CMS
const STATIC_FALLBACK = [
  {
    id: 'static-1',
    quote: "our dedicated engineering team delivered our event-driven dispatch engine with zero production downtime. Their engineering pod integrated seamlessly into our daily sprints and cut our operational dispatch latency by 85%.",
    author_name: "Engineering Pod Review",
    author_role: "VP of Digital Engineering",
    company: "WHY Platform Ecosystem",
    badge: "Care & Companion Tech",
    rating: 5
  },
  {
    id: 'static-2',
    quote: "The LLM RAG pipeline built by our dedicated engineering team processes over 10,000 document queries daily with sub-second response times and zero hallucination errors. High velocity and top-tier code quality.",
    author_name: "Product Leadership",
    author_role: "Chief Technology Officer",
    company: "Enterprise SaaS Client",
    badge: "Artificial Intelligence",
    rating: 5
  },
  {
    id: 'static-3',
    quote: "Migrating our legacy monolithic architecture to Kubernetes AWS EKS saved us 45% in monthly cloud infrastructure costs. Their 24/7 SRE monitoring pod ensures 99.99% system availability.",
    author_name: "Cloud Operations Pod",
    author_role: "Director of Infrastructure",
    company: "Logistics Enterprise",
    badge: "Cloud Modernization",
    rating: 5
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await getPublicTestimonials();
        if (!mounted) return;

        const data = extractArray(res);
        setTestimonials(data);
        setUsedFallback(false);
      } catch {
        if (!mounted) return;
        // Network error only — use static fallback
        setTestimonials(STATIC_FALLBACK);
        setUsedFallback(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-[#F8FAFC] via-white to-[#FAFAFC] border border-[#BFDBFE] rounded-3xl p-6 sm:p-10 shadow-lg my-12 relative overflow-hidden">
        <div className="animate-pulse max-w-4xl mx-auto space-y-6">
          <div className="h-6 bg-slate-200 rounded-full w-40" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
          <div className="h-4 bg-slate-200 rounded-full w-32" />
        </div>
      </div>
    );
  }

  // CMS deliberately returned no testimonials — respect that, show nothing
  if (testimonials.length === 0 && !usedFallback) {
    return null;
  }

  // Zero testimonials even from fallback — nothing to show
  if (testimonials.length === 0) return null;

  // Clamp index in case testimonials changed
  const safeIndex = Math.min(currentIndex, testimonials.length - 1);
  const t = testimonials[safeIndex];

  // Normalize field names (CMS might use author_name or author)
  const authorName = t.author_name || t.author || 'Anonymous';
  const authorRole = t.author_role || t.role || '';
  const company = t.company || t.company_name || '';
  const badge = t.badge || t.category || '';
  const rating = typeof t.rating === 'number' ? t.rating : 5;
  const quote = t.quote || t.content || t.text || '';

  return (
    <div className="bg-gradient-to-b from-[#F8FAFC] via-white to-[#FAFAFC] border border-[#BFDBFE] rounded-3xl p-6 sm:p-10 shadow-lg my-12 relative overflow-hidden">
      
      {/* Background Decorator */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EFF6FF]/60 rounded-full blur-3xl -z-10 pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Engineering Excellence Feedback</span>
            </div>
            <h3 className="text-2xl font-extrabold text-[#0F172A]">Client &amp; Architecture Feedback</h3>
          </div>

          {/* Slider Arrows — only shown if multiple */}
          {testimonials.length > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-[#2563EB] hover:bg-[#EFF6FF] text-slate-700 hover:text-[#2563EB] flex items-center justify-center transition-all shadow-sm"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:border-[#2563EB] hover:bg-[#EFF6FF] text-slate-700 hover:text-[#2563EB] flex items-center justify-center transition-all shadow-sm"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Testimonial Card */}
        <div className="bg-white border border-[#BFDBFE] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 relative">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(Math.min(rating, 5))].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
            </div>
            {badge && (
              <span className="bg-[#2563EB] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full">
                {badge}
              </span>
            )}
          </div>

          <blockquote className="text-sm sm:text-base text-slate-700 leading-relaxed italic font-medium">
            "{quote}"
          </blockquote>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center font-bold text-xs">
                {authorName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-extrabold text-xs text-[#0F172A]">{authorName}</div>
                <div className="text-[10px] text-slate-500 font-semibold">
                  {[authorRole, company].filter(Boolean).join(' • ')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-emerald-600 text-[11px] font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Verified Delivery</span>
            </div>
          </div>

        </div>

        {/* Pagination Dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 pt-2">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Testimonial ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  safeIndex === idx ? 'w-8 bg-[#2563EB]' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}
