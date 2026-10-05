import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { getPublicPageBySlug, extractObject } from '../api/cms';
import DOMPurify from 'dompurify';

export default function PrivacyPolicy() {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getPublicPageBySlug('privacy')
      .then(res => {
        if (isMounted) setPage(extractObject(res));
      })
      .catch(console.error)
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return <div className="min-h-[50vh] flex items-center justify-center">Loading...</div>;
  }

  // Fallback to static if CMS is empty or errors
  if (!page) {
    return (
      <div className="bg-[#FAFAFC] text-[#0F172A] pt-8 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold">Privacy Policy</h1>
          <p className="mt-4 text-slate-600">Our privacy policy is currently being updated. Please check back later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFC] text-[#0F172A] pt-8 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm space-y-8">
          
          <div className="border-b border-slate-200 pb-6">
            <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              Data Protection & Privacy
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A]">{page.title}</h1>
            <p className="text-xs text-slate-500 mt-2">
              Last Updated: {new Date(page.updated_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} | WHY Services India Private Limited
            </p>
          </div>

          <div 
            className="space-y-6 text-sm text-slate-700 leading-relaxed prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(page.content) }}
          />
        </div>
      </div>
    </div>
  );
}
