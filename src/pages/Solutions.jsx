import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublicDomains, extractArray } from '../api/cms';
import { 
  HeartHandshake, Stethoscope, Compass, Building2, 
  ArrowRight, ShieldCheck, CheckCircle2, Sparkles, 
  Bot, Database, Activity, Lock, Cpu, Server
} from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';


const ICONS = { HeartHandshake, Stethoscope, Compass, Building2, ArrowRight, ShieldCheck, CheckCircle2, Sparkles, Bot, Database, Activity, Lock, Cpu, Server };
const getIcon = (iconName) => ICONS[iconName] || Database;

export default function Solutions() {
  const { general } = useSiteSettings();
  const [activeDomain, setActiveDomain] = useState('family-care');

  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPublicDomains();
        if (res.success) {
           const data = extractArray(res);
           setDomains(data);
           if (data.length > 0) setActiveDomain(data[0].slug || data[0].id);
        }
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

  const [pipelineStage, setPipelineStage] = useState(0);
  const [matrixMode, setMatrixMode] = useState('industry'); // 'industry' | 'capability'

  const capabilityMatrix = [
    {
      title: 'Generative AI & LLM Agents',
      stack: 'OpenAI, Claude 3.5, LangChain, PyTorch, vLLM',
      focus: 'Enterprise RAG, Automated Document QA, AI Customer Support & Code Gen',
      sla: '99.9% Model Availability'
    },
    {
      title: 'Cloud Native & Microservices',
      stack: 'AWS EKS, Docker, NestJS, Spring Boot, Go',
      focus: 'Distributed Architectures, Zero-Downtime CI/CD, High-Throughput REST',
      sla: '99.99% Cloud SLA'
    },
    {
      title: 'Real-Time Data Lakes & ETL',
      stack: 'PostgreSQL, Redis, Snowflake, Apache Spark, Kafka',
      focus: 'Streaming Telemetry, Data Normalization, BI Dashboarding',
      sla: '< 50ms Query Latency'
    },
    {
      title: 'Enterprise GRC & Cyber Resilience',
      stack: 'ISO 27001, SOC 2, AWS KMS, OAuth2, Vault',
      focus: 'Zero-Trust Role-Based Access, SAST/DAST Auditing, End-to-End Encryption',
      sla: '100% Audit Compliance'
    }
  ];

  const activeData = domains.find(d => (d.slug || d.id) === activeDomain) || domains[0];

  if (!domains || domains.length === 0) {
    return (
      <div className="pt-24 pb-12 min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <Compass className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-700">Solutions coming soon</h2>
        <p className="text-slate-500 mt-2">We are updating our industry solutions. Please check back later.</p>
      </div>
    );
  }


  const pipelineSteps = [
    { title: '1. Strategy & Discovery', desc: 'Assess AI/ML suitability, data compliance, and technical debt.' },
    { title: '2. Verification Gate', desc: 'Automated QA verification & validation testing.' },
    { title: '3. Data Lake Ingestion', desc: 'Structured & unstructured real-time ETL data pipeline.' },
    { title: '4. AI & RPA Execution', desc: 'LLM insights generation & RPA BOT task execution.' },
    { title: '5. Managed Infra Operations', desc: '24/7 L1/L2 support, monitoring, and failover.' }
  ];

  return (
    <div className="bg-[#FAFAFC] text-[#0F172A] pt-8 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          Purpose-Built Solutions
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-6">
          Industry Solutions Built for <span className="text-[#2563EB]">Sustainable Growth</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
          Combining digital strategy, enterprise engineering, data lake analytics, generative AI, and managed infrastructure across high-trust domains.
        </p>

        {/* Matrix View Selector Toggle */}
        <div className="inline-flex items-center p-1.5 bg-[#EFF6FF] border border-[#BFDBFE] rounded-2xl shadow-inner">
          <button
            onClick={() => setMatrixMode('industry')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              matrixMode === 'industry'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-[#2563EB] hover:bg-white/50'
            }`}
          >
            By Industry Domains
          </button>
          <button
            onClick={() => setMatrixMode('capability')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              matrixMode === 'capability'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-[#2563EB] hover:bg-white/50'
            }`}
          >
            By Tech Capability Matrix
          </button>
        </div>
      </section>

      {/* 2. DOMAIN OR CAPABILITY SELECTOR */}
      {matrixMode === 'industry' ? (
        <>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {domains.map((dom) => {
                const isSelected = activeDomain === dom.id;
                return (
                  <button
                    key={dom.id}
                    onClick={() => setActiveDomain(dom.id)}
                    className={`text-left p-6 rounded-3xl border transition-all ${
                      isSelected
                        ? 'bg-gradient-to-b from-blue-50/50 via-white to-white border-[#2563EB] shadow-md ring-2 ring-[#2563EB]/20'
                        : 'bg-white border-slate-200 hover:bg-[#EFF6FF]/40 hover:border-[#BFDBFE] shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-full border border-[#BFDBFE]">
                        {dom.badge}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#0F172A] mb-1">{dom.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{dom.tagline}</p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 3. SELECTED DOMAIN DETAIL DISPLAY */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-gradient-to-b from-[#F8FAFC] via-white to-[#FAFAFC] border border-[#BFDBFE] rounded-3xl p-6 sm:p-10 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                <div className="lg:col-span-7 space-y-6">
                  <div>
                    <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Solution Architecture</span>
                    <h2 className="text-3xl font-extrabold text-[#0F172A] mt-1">{activeData.title}</h2>
                    <p className="text-sm font-semibold text-[#2563EB] mt-1">{(activeData.subtitle || activeData.tagline)}</p>
                    <p className="text-slate-600 mt-3 text-sm leading-relaxed">{activeData.description}</p>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Key Solution Features</h3>
                    <div className="space-y-2.5">
                      {(activeData.modules || activeData.key_solutions || activeData.capabilities || []).map((cap, idx) => (
                        <div key={idx} className="flex items-center gap-3 bg-gradient-to-b from-[#EFF6FF]/60 to-white border border-[#BFDBFE] p-3.5 rounded-2xl">
                          <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
                          <span className="text-xs font-semibold text-slate-700">{cap.title || cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-4 rounded-2xl">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Architecture Standard</span>
                    <p className="text-xs font-mono text-slate-700">{(activeData.architecture || "Cloud-Native API Architecture")}</p>
                  </div>
                </div>

                {/* Impact & Architecture Image Card */}
                <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-xl border border-[#BFDBFE] group">
                  <img 
                    src={
                      activeData.id === 'family-care' ? 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80' :
                      activeData.id === 'healthcare' ? 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80' :
                      activeData.id === 'ai-automation' ? 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80' :
                      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80'
                    } 
                    alt={activeData.title} 
                    className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent flex flex-col justify-end p-6 text-white space-y-1">
                    <div className="text-xs font-mono font-bold text-sky-300 uppercase tracking-wider">{(activeData.slug || activeData.badge)}</div>
                    <div className="text-base font-extrabold">{activeData.title}</div>
                    <div className="text-[11px] text-slate-300">Targeted enterprise architecture & agile delivery</div>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </>
      ) : (
        /* CAPABILITY MATRIX GRID */
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {capabilityMatrix.map((item, idx) => (
              <div key={idx} className="bg-white border border-[#BFDBFE] p-6 sm:p-8 rounded-3xl shadow-sm hover:border-[#2563EB] transition-all space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold bg-[#2563EB] text-white px-3 py-1 rounded-full uppercase">
                    Core Capability #{idx + 1}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600">{item.sla}</span>
                </div>
                <h3 className="text-xl font-extrabold text-[#0F172A]">{item.title}</h3>
                <div className="text-xs font-mono text-slate-900 bg-[#F8FAFC] p-3 rounded-xl border border-[#BFDBFE]">
                  {item.stack}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.focus}</p>
                <div className="pt-3 border-t border-slate-100 flex justify-end">
                  <Link to="/contact" className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1">
                    Request Custom Specs <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. INTERACTIVE WORKFLOW PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[#0F172A] rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Enterprise Transformation Engine</span>
            <h2 className="text-3xl font-extrabold mt-1">5-Step Solution Pipeline</h2>
            <p className="text-slate-400 text-sm mt-2">Interactive walkthrough of how {general?.brand_name || 'WHY IT Services'} executes transformation pipelines.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-8">
            {pipelineSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setPipelineStage(idx)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  pipelineStage === idx
                    ? 'bg-[#2563EB] border-blue-400 text-white shadow-lg'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-850'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider mb-1 opacity-80">Phase 0{idx + 1}</div>
                <div className="text-xs font-bold truncate">{step.title.split('. ')[1]}</div>
              </button>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-800/50">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE PIPELINE PHASE #{pipelineStage + 1}
              </div>
              <h3 className="text-xl font-bold">{pipelineSteps[pipelineStage].title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{pipelineSteps[pipelineStage].desc}</p>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-sky-300 w-full sm:w-auto min-w-[240px]">
              <div>status: 200_OK</div>
              <div>leadership: FOUNDING_LEADS</div>
              <div>audit: GRC_PASSED</div>
              <div>sla: 99.99_PERCENT</div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BOTTOM CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center">
          <h2 className="text-3xl font-extrabold mb-4">Have an Enterprise Challenge to Solve?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto mb-8">
            Our engineering team builds custom solution pipelines tailored precisely to your domain needs.
          </p>
          <Link
            to="/contact"
            className="bg-white hover:bg-blue-50 text-[#2563EB] font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-sm inline-block"
          >
            Get Started with {general?.brand_name || 'WHY IT Services'}
          </Link>
        </div>
      </section>

    </div>
  );
}

