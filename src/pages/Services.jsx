import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicServices, extractArray } from '../api/cms';
import { 
  Compass, Code2, Database, Bot, Server, 
  ArrowRight, CheckCircle2, ShieldCheck, Sparkles, 
  Zap, Layers, Terminal, Activity, Check, Quote,
  Clock, Users, Award
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

const ICONS = { Compass, Code2, Database, Bot, Server, ArrowRight, CheckCircle2, ShieldCheck, Sparkles, Zap, Layers, Terminal, Activity, Check, Quote, Clock, Users, Award };
const getIcon = (iconName) => ICONS[iconName] || Layers;

export default function Services() {
  const { general } = useSiteSettings();
  const [activeTab, setActiveTab] = useState('digital-strategy');

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPublicServices();
        if (res.success) setServices(extractArray(res));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }


  const hiringModels = [
    {
      title: 'Dedicated Engineering Teams',
      badge: 'Full-Time Scale',
      desc: 'Build your extended tech team with senior full-stack developers, cloud architects, and QA engineers working 100% dedicated to your roadmap.',
      features: ['Direct Git & Jira integration', 'Daily agile standups', 'Zero HR overhead']
    },
    {
      title: 'Hourly & On-Demand Talent',
      badge: 'Flexible Hours',
      desc: 'Access specialized expertise for targeted code reviews, AI model tuning, architecture audits, or emergency bug fixes on an hourly basis.',
      features: ['Pay-as-you-use flexibility', 'Immediate senior deployment', 'No long-term lock-in']
    },
    {
      title: 'Milestone Fixed-Scope Projects',
      badge: 'Turnkey Delivery',
      desc: 'End-to-end custom application buildout with clear milestone deliverables, fixed budgets, defined timelines, and 100% IP ownership.',
      features: ['Guaranteed delivery scope', 'Dedicated project manager', 'Post-launch 24/7 support']
    }
  ];

  const activeService = services.find(s => (s.slug || s.id) === activeTab) || services[0];

  if (!services || services.length === 0) {
    return (
      <div className="pt-24 pb-12 min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <Compass className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Services coming soon</h2>
        <p className="text-slate-500 mt-2">We are updating our service offerings. Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFC] text-[#0F172A] pt-8 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          5 Core Enterprise Offerings
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-6">
          Our Service Offerings & <span className="text-[#2563EB]">Engineering Capabilities</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          From digital strategy and enterprise application buildout to real-time data lakes, generative AI, and managed infrastructure—{general?.brand_name || 'WHY IT Services'} delivers end-to-end technical excellence.
        </p>
      </section>

      {/* 2. INTERACTIVE SERVICE PILLARS DEEP-DIVE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-b from-[#F8FAFC] via-white to-[#FAFAFC] border border-[#BFDBFE] rounded-3xl p-6 sm:p-10 shadow-sm">
          
          {/* Pillar Tabs */}
          <div className="flex items-center gap-2 justify-start sm:justify-center overflow-x-auto no-scrollbar py-2 mb-8 border-b border-slate-200/80 pb-6">
            {services.map((s) => {
              const Icon = getIcon(s.icon);
              const isActive = activeTab === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setActiveTab(s.id)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#2563EB]'}`} />
                  {s.title}
                </button>
              );
            })}
          </div>

          {/* Active Service Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Pillar Details</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] mt-1">{activeService.title}</h2>
                <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-[#EFF6FF] px-3.5 py-1.5 rounded-full border border-[#BFDBFE]">
                  <Quote className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>{activeService.tagline}</span>
                </div>
                <p className="text-slate-600 mt-4 text-sm leading-relaxed">{activeService.description}</p>
              </div>

              {/* Sub-services breakdown */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Sub-Service Offerings</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(activeService.capabilities || activeService.subServices || []).map((sub, idx) => (
                    <div 
                      key={idx} 
                      className="bg-gradient-to-b from-blue-50/30 via-white to-white border border-[#BFDBFE] p-4 rounded-2xl space-y-1 shadow-sm hover:border-[#2563EB] transition-all"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                        <h4 className="text-xs font-bold text-[#0F172A]">{(sub.title || sub.name)}</h4>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed pl-6">{(sub.description || sub.desc)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Architecture Image Card */}
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-2xl border border-[#BFDBFE] group">
              <img 
                src={
                  activeService.id === 'digital-strategy' ? 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80' :
                  activeService.id === 'digital-engineering' ? 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80' :
                  activeService.id === 'data-engineering' ? 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80' :
                  activeService.id === 'generative-ai' ? 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80' :
                  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
                } 
                alt={activeService.title} 
                className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent flex flex-col justify-end p-6 text-white space-y-1">
                <div className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider">{activeService.id}</div>
                <div className="text-base font-extrabold">{activeService.title} Engineering</div>
                <div className="text-[11px] text-slate-300">Clean code standards & agile pod execution</div>
              </div>
            </div>

          </div>

        </div>
      </section>



      {/* 4. FLEXIBLE ENGAGEMENT & HIRING MODELS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Flexible Engagement Options</span>
          <h2 className="text-3xl font-extrabold text-[#0F172A] mt-1">Hire Senior IT Developers & Teams</h2>
          <p className="text-slate-600 text-sm mt-2">Tailored engagement structures to suit your budget, technical roadmap, and scaling speed.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {hiringModels.map((model, idx) => (
            <div 
              key={idx}
              className="bg-gradient-to-b from-blue-50/30 via-white to-white border border-[#BFDBFE] p-6 sm:p-8 rounded-3xl shadow-sm hover:border-[#2563EB] transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <span className="inline-block bg-[#2563EB] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  {model.badge}
                </span>
                <h3 className="text-xl font-extrabold text-[#0F172A]">{model.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{model.desc}</p>
                <div className="space-y-2 pt-2">
                  {model.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <Check className="w-4 h-4 text-[#2563EB]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                to="/contact"
                className="w-full bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-bold py-3 rounded-xl text-center transition-all shadow-md block"
              >
                Inquire About {model.title}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 5. BOTTOM CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center">
          <h2 className="text-3xl font-extrabold mb-4">Need Tailored Service Engineering for Your Company?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
            Speak directly with our senior technology leaders and solution architects today.
          </p>
          <Link
            to="/contact"
            className="bg-white hover:bg-blue-50/80 text-[#2563EB] font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-sm inline-block"
          >
            Schedule Technical Consultation
          </Link>
        </div>
      </section>

    </div>
  );
}

