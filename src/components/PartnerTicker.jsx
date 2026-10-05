import React, { useState, useEffect } from 'react';
import { Compass, Code2, Database, Cpu, Bot, Server, ShieldCheck, RefreshCw, Sparkles } from 'lucide-react';
import { apiRequest } from '../api/client';

export default function PartnerTicker() {
  const [partnerLogos, setPartnerLogos] = useState([
    { name: 'Digital Strategy', tag: 'Discovery, Experience & GRC', icon: Compass },
    { name: 'Digital Engineering', tag: 'App Buildout & QA Verification', icon: Code2 },
    { name: 'Data Engineering & Analytics', tag: 'Data Lakes, ETL & BI Tools', icon: Database },
    { name: 'Generative AI', tag: 'LLMs, Content Gen & AI SDLC', icon: Cpu },
    { name: 'Intelligent Automation', tag: 'Attended & Unattended RPA BOTs', icon: Bot },
    { name: 'Infrastructure Managed Services', tag: 'Datacenter & L1/L2 Support Operations', icon: Server },
    { name: 'Verification & Validation', tag: 'Functional & Non-Functional QA', icon: ShieldCheck },
    { name: 'Application Sustenance', tag: 'Legacy Support & Productivity', icon: RefreshCw }
  ]);

  useEffect(() => {
    apiRequest('/api/v1/public/partner-items').then(res => {
      if (res.success && res.data && res.data.length > 0) {
        setPartnerLogos(res.data.map(p => ({
          name: p.name,
          tag: p.partner_type,
          icon: Compass // Default icon if no logo_url
        })));
      }
    }).catch(console.error);
  }, []);

  const doubleLogos = [...partnerLogos, ...partnerLogos];

  return (
    <section className="bg-white border-y border-slate-200/80 py-12 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest inline-flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" />
          Our Core Business Domains
        </span>
      </div>

      <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
        {doubleLogos.map((partner, index) => {
          const Icon = partner.icon;
          return (
            <div 
              key={index} 
              className="flex items-center gap-4 px-10 py-4 mx-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-default min-w-[280px]"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-[#2563EB] shrink-0">
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-extrabold text-slate-800 text-[15px]">{partner.name}</h4>
                <p className="text-[11px] font-bold text-slate-500 tracking-wide mt-0.5">{partner.tag}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
