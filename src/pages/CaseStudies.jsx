/**
 * CaseStudies — Phase J CMS Hydration
 *
 * Fetches case studies from GET /api/v1/public/case-studies.
 * Categories derived dynamically from CMS data.
 * Falls back to static ONLY on network error.
 * Empty CMS = empty page (no static resurrection).
 */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, CheckCircle2, ShieldCheck, 
  BarChart, Code2, Cpu, Database, Server, X, Activity
} from 'lucide-react';
import { getPublicCaseStudies, extractArray } from '../api/cms';
import { useSiteSettings } from '../context/SiteSettingsContext';

// Emergency static fallback — only on network error
const STATIC_CASES = [
  {
    id: 'case-1',
    title: 'WHY Companion & Dispatch Engine',
    category: 'Care & Companion Tech',
    badge: 'Flagship Platform',
    client: 'WHY Services Platform',
    summary: 'Real-time GPS companion matching engine connecting families with vetted support professionals.',
    problem: 'Manual dispatch and background verification caused long wait times and operational bottlenecks for companion assignments.',
    solution: 'Engineered an event-driven WebSocket dispatch engine integrated with automated background check verification APIs and Redis state caching.',
    results: ['85% Reduction in Dispatch Overhead', 'Architecture Benchmarked & QA Verified', '99.4% Positive Family Rating'],
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'WebSockets', 'AWS Lambda'],
    architecture: 'Event-Driven WebSocket Microservices with Dual-DB Sync'
  },
  {
    id: 'case-2',
    title: 'HIPAA Patient Telemetry & Alert Platform',
    category: 'Healthcare & Life Sciences',
    badge: 'HIPAA & GRC Certified',
    client: 'Healthcare Network',
    summary: 'Real-time vital telemetry monitoring dashboard with encrypted alert triggers for medical teams.',
    problem: 'Legacy telemetry systems suffered from delayed alert triggers (>30s) and lacked SOC2 audit logging for patient vitals.',
    solution: 'Built an AWS KMS encrypted microservice telemetry pipeline ingesting IoT patient data streams with sub-2s alert triggers.',
    results: ['< 2s Telemetry Alert Latency', '100% Audit Trail Compliance', '99.99% Guaranteed SLA Uptime'],
    tech_stack: ['Python FastAPI', 'AWS EKS', 'TimescaleDB', 'Docker', 'React', 'Datadog'],
    architecture: 'Encrypted IoT Stream Ingestion with Time-Series Storage'
  },
  {
    id: 'case-3',
    title: 'Generative AI & RPA Automation Suite',
    category: 'Artificial Intelligence',
    badge: 'GenAI & LLMs',
    client: 'Global Marketing & B2B Enterprise',
    summary: 'Multi-modal LLM content generation engine and attended RPA BOT workflow automation.',
    problem: 'High manual workload spent writing marketing copy and transferring unstructured invoice data into ERP systems.',
    solution: 'Implemented Large Language Model (LLM) qualitative extraction combined with unattended RPA BOTs for automated ERP entry.',
    results: ['65% Efficiency Gain via RPA BOTs', '3x Faster Release Cycles', '0% Manual Entry Error Rate'],
    tech_stack: ['Python', 'OpenAI LLM API', 'LangChain', 'RPA Engine', 'PostgreSQL', 'Docker'],
    architecture: 'LLM Multi-Modal Orchestrator with RPA Automation Pipeline'
  },
  {
    id: 'case-4',
    title: 'Enterprise Legacy Monolith to Kubernetes Migration',
    category: 'Enterprise SaaS & Cloud',
    badge: 'Cloud Modernization',
    client: 'Enterprise Logistics Firm',
    summary: 'Zero-downtime migration of a legacy monolithic platform to cloud-native Kubernetes microservices.',
    problem: 'Heavy legacy monolithic codebase caused deployment delays, high cloud hosting costs, and frequent server downtime.',
    solution: 'Decomposed monolith into containerized Docker microservices, automated CI/CD pipelines via GitHub Actions, and deployed onto AWS EKS.',
    results: ['45% Cloud Hosting Cost Savings', 'Zero-Downtime Live Migration', '100% Automated CI/CD Pipeline'],
    tech_stack: ['Docker', 'Kubernetes (EKS)', 'Terraform', 'GitHub Actions', 'Node.js', 'PostgreSQL'],
    architecture: 'Containerized Kubernetes Microservices with IaC'
  }
];

export default function CaseStudies() {
  const { general } = useSiteSettings();
  const brandName = general?.brand_name || 'WHY IT Services';
  const [cases, setCases] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCase, setSelectedCase] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const res = await getPublicCaseStudies();
        if (!mounted) return;

        const data = extractArray(res);
        setCases(data);
        setUsedFallback(false);

        const cats = ['All', ...new Set(data.map(c => c.category).filter(Boolean))];
        setCategories(cats);
      } catch {
        if (!mounted) return;
        // Network error only
        setCases(STATIC_CASES);
        setUsedFallback(true);
        setCategories(['All', 'Care & Companion Tech', 'Healthcare & Life Sciences', 'Artificial Intelligence', 'Enterprise SaaS & Cloud']);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedCase(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Normalize field names
  const normalize = (c) => ({
    ...c,
    results: c.results || c.key_results || [],
    tech_stack: c.tech_stack || c.techStack || [],
    badge: c.badge || c.type_badge || '',
    client: c.client || c.client_name || '',
  });

  const filteredCases = cases.map(normalize).filter(c =>
    activeCategory === 'All' || c.category === activeCategory
  );

  return (
    <div className="bg-[#FAFAFC] text-[#0F172A] pt-8 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          Engineering Architecture Spotlights
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-6">
          Enterprise Case Studies &amp; <span className="italic font-normal text-[#2563EB]">Technical Spotlights</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Explore how {brandName} delivers custom software, real-time data lakes, generative AI, and cloud modernization to drive operational growth.
        </p>

        {/* Filter Categories */}
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? 'bg-[#2563EB] text-white shadow-md'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-[#EFF6FF] hover:text-[#2563EB]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 2. LOADING STATE */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="flex flex-col items-center gap-3">
            <div className="w-9 h-9 border-[3px] border-blue-200 border-t-[#2563EB] rounded-full animate-spin" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Loading case studies...</span>
          </div>
        </div>
      )}

      {/* 3. EMPTY CMS STATE */}
      {!loading && cases.length === 0 && !usedFallback && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-white border border-slate-200 rounded-3xl px-6">
            <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-600 text-lg">No Case Studies Yet</h3>
            <p className="text-xs text-slate-400 mt-1">Check back soon for engineering spotlights.</p>
          </div>
        </div>
      )}

      {/* 4. CASE STUDY CARDS GRID */}
      {!loading && filteredCases.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {filteredCases.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCase(c)}
                className="bg-gradient-to-b from-blue-50/30 via-white to-white border border-[#BFDBFE] rounded-3xl p-6 sm:p-8 shadow-sm hover:border-[#2563EB] transition-all cursor-pointer group space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-[#2563EB] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                      {c.badge}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{c.category}</span>
                  </div>
                  
                  <h3 className="text-2xl font-extrabold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">
                    {c.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 leading-relaxed">{c.summary}</p>

                  {Array.isArray(c.results) && c.results.length > 0 && (
                    <div className="space-y-2 pt-2 border-t border-slate-200/60">
                      <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-wider block mb-1">Key Results Delivered:</span>
                      {c.results.map((res, rIdx) => (
                        <div key={rIdx} className="flex items-center gap-2 text-xs font-bold text-[#2563EB]">
                          <CheckCircle2 className="w-4 h-4 shrink-0" />
                          <span>{res}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 flex items-center justify-between text-xs font-bold text-[#2563EB] group-hover:translate-x-1 transition-transform">
                  <span>Inspect Architecture &amp; Tech Stack</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>

          {filteredCases.length === 0 && cases.length > 0 && (
            <div className="text-center py-12 bg-white border border-slate-200 rounded-2xl p-6">
              <h3 className="font-bold text-slate-700">No case studies in this category</h3>
              <button type="button" onClick={() => setActiveCategory('All')} className="mt-2 text-xs text-[#2563EB] font-bold hover:underline">Show All</button>
            </div>
          )}
        </section>
      )}

      {/* 5. CASE STUDY DETAIL POPUP MODAL */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative space-y-6">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedCase(null)}
              className="absolute top-6 right-6 text-slate-400 hover:text-[#2563EB] bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-4 space-y-2">
              <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-[#BFDBFE]">
                {selectedCase.badge}
              </span>
              <h2 className="text-3xl font-extrabold text-[#0F172A] pt-2">{selectedCase.title}</h2>
              <p className="text-xs font-semibold text-[#2563EB]">Industry: {selectedCase.category}</p>
            </div>

            <div className="space-y-4 text-xs leading-relaxed text-slate-700">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <h4 className="font-bold text-sm text-[#0F172A] mb-1">The Challenge / Problem</h4>
                <p>{selectedCase.problem}</p>
              </div>

              <div className="bg-gradient-to-b from-[#EFF6FF] to-white border border-[#BFDBFE] p-4 rounded-2xl">
                <h4 className="font-bold text-sm text-[#2563EB] mb-1">Our Engineering Solution</h4>
                <p>{selectedCase.solution}</p>
              </div>

              {Array.isArray(selectedCase.results) && selectedCase.results.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A] mb-2">Verified Results</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {selectedCase.results.map((res, idx) => (
                      <div key={idx} className="bg-white border border-[#BFDBFE] p-3 rounded-xl text-center font-bold text-[#2563EB]">
                        {res}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Array.isArray(selectedCase.tech_stack) && selectedCase.tech_stack.length > 0 && (
                <div>
                  <h4 className="font-bold text-sm text-[#0F172A] mb-2">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCase.tech_stack.map((tech, idx) => (
                      <span key={idx} className="bg-[#0F172A] text-sky-300 font-mono text-[11px] px-3 py-1 rounded-lg">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <Link
                to="/contact"
                onClick={() => setSelectedCase(null)}
                className="bg-[#2563EB] hover:bg-[#1E40AF] text-white text-xs font-bold px-6 py-3 rounded-xl transition-all shadow-md"
              >
                Schedule Architecture Review
              </Link>
            </div>

          </div>
        </div>
      )}

      {/* 6. BOTTOM CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center">
          <h2 className="text-3xl font-extrabold mb-4">Want Similar Results for Your Business?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
            Speak directly with our solution architects to build a customized technical roadmap.
          </p>
          <Link
            to="/contact"
            className="bg-white hover:bg-blue-50/80 text-[#2563EB] font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-sm inline-block"
          >
            Request Free Technical Proposal
          </Link>
        </div>
      </section>

    </div>
  );
}
