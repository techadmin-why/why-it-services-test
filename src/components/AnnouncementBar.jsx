/**
 * AnnouncementBar — Phase J CMS Hydration
 *
 * Fetches the active announcement from GET /api/v1/public/announcement.
 * Falls back to static content if the API is unavailable or returns no data.
 * If the CMS explicitly disables the announcement (is_active: false or empty),
 * the bar is hidden — no static resurrection.
 */
import React, { useEffect, useState } from 'react';
import { ArrowRight, Sparkles, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getPublicAnnouncement } from '../api/cms';

// Static fallback — used ONLY when API is completely unavailable (network error)
const STATIC_FALLBACK = {
  text: 'WHY Digital Engineering Summit 2026: Modernizing Infrastructure & Connected Services',
  link_url: '/reserve-spot',
  link_label: 'Reserve Your Spot',
  badge_text: 'Event',
  is_active: true,
};

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await getPublicAnnouncement();
        if (!mounted) return;

        if (res?.success && res?.data && res.data.is_active !== false) {
          setAnnouncement(res.data);
          setUsedFallback(false);
        } else if (res?.success) {
          // CMS explicitly returned no active announcement — respect that
          setAnnouncement(null);
        } else {
          // API error shape — use fallback
          setAnnouncement(STATIC_FALLBACK);
          setUsedFallback(true);
        }
      } catch {
        // Network error — use fallback
        if (mounted) {
          setAnnouncement(STATIC_FALLBACK);
          setUsedFallback(true);
        }
      } finally {
        if (mounted) setLoaded(true);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  // Don't render anything until we know what to show
  if (!loaded) return null;

  // CMS explicitly has no active announcement
  if (!announcement) return null;

  // User dismissed this session
  if (dismissed) return null;

  const linkUrl = announcement.link_url || '/reserve-spot';
  const linkLabel = announcement.link_label || 'Reserve Your Spot';
  const badgeText = announcement.badge_text || 'Event';
  const text = announcement.text || announcement.message || '';
  const isExternalLink = linkUrl.startsWith('http');

  const Content = () => (
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 min-w-0 group">
      {/* Left / Center Announcement Text */}
      <div className="flex items-center gap-2 min-w-0 max-w-full overflow-hidden mx-auto sm:mx-0">
        <span className="bg-[#2563EB] text-white px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider hidden sm:flex items-center gap-1 shrink-0">
          <Sparkles className="w-3 h-3" /> {badgeText}
        </span>
        <span className="bg-[#2563EB] text-white px-1.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider sm:hidden flex items-center gap-0.5 shrink-0">
          <Sparkles className="w-2.5 h-2.5" /> {badgeText.toUpperCase()}
        </span>
        <span className="text-slate-900 font-medium truncate text-[11.5px] sm:text-xs">
          {text}
        </span>
      </div>

      {/* Right: CTA link */}
      <div className="flex items-center gap-1 text-[#2563EB] font-bold shrink-0 text-xs">
        <span className="hidden md:inline whitespace-nowrap group-hover:underline">{linkLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </div>
    </div>
  );

  return (
    <div className="bg-white border-b border-slate-200/80 text-[#2563EB] py-2 px-3 sm:px-4 text-xs font-semibold relative z-30 overflow-hidden w-full max-w-full hover:bg-blue-50/50 transition-colors">
      {announcement.is_dismissible && (
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss announcement"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 z-10"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {isExternalLink ? (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Content />
        </a>
      ) : (
        <Link to={linkUrl} className="block">
          <Content />
        </Link>
      )}
    </div>
  );
}
