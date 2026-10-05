import React, { useState, useEffect } from 'react';
import { getHomepageSections, getPublicServices, getPublicDomains, getTechItems, extractArray } from '../api/cms';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Code2, Users, DollarSign, ShieldCheck, Layers, Layers3, Activity, 
  RefreshCw, Clock, ArrowRight, CheckCircle2, Star, 
  Sparkles, Check, ChevronRight, Award, Compass, Database, 
  Bot, Server, ExternalLink, HelpCircle, Monitor, Smartphone, 
  Globe, Laptop, Cpu, Heart, Rocket, FileText, Building2
} from 'lucide-react';
import PartnerTicker from '../components/PartnerTicker';
import { getTechLogo } from '../components/TechLogos';
import Testimonials from '../components/Testimonials';
import GlobalDeliveryMap from '../components/GlobalDeliveryMap';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Home() {
  const { general } = useSiteSettings();
  const brandName = general?.brand_name || 'WHY IT Services';
  const navigate = useNavigate();

  const [sections, setSections] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [domainsData, setDomainsData] = useState([]);
  const [techItems, setTechItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [techTab, setTechTab] = useState('mobile');
  const [activePillarTab, setActivePillarTab] = useState('digital-strategy');
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [expandedServiceIndex, setExpandedServiceIndex] = useState(null);
  const [activeBentoSlide, setActiveBentoSlide] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const [secRes, srvRes, domRes, techRes] = await Promise.all([
          getHomepageSections(),
          getPublicServices(),
          getPublicDomains(),
          getTechItems()
        ]);
        if (secRes.success) setSections(extractArray(secRes));
        if (srvRes.success) setServicesData(extractArray(srvRes));
        if (domRes.success) setDomainsData(extractArray(domRes));
        if (techRes && techRes.success) setTechItems(extractArray(techRes));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const heroSection = sections.find(s => s.section_type === 'hero') || {};
  const statsSection = sections.find(s => s.section_type === 'stats') || {};



  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }



  const handleBentoScroll = (e) => {
    const scrollLeft = e.target.scrollLeft;
    const width = e.target.offsetWidth || 300;
    const current = Math.min(4, Math.max(1, Math.round(scrollLeft / (width * 0.75)) + 1));
    setActiveBentoSlide(current);
  };

  // 4-Card Grid: "Why Work With ${brandName}?" with Background Images
  const whyWorkWithUs = [
    {
      title: 'Custom Software Solutions',
      desc: 'Tailored enterprise software, SaaS platforms, and mobile apps built using secure, scalable full-stack technologies.',
      badge: 'Full-Stack & Cloud',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      link: '/services/digital-engineering'
    },
    {
      title: 'Dedicated Agile Squads',
      desc: 'Hire senior full-stack, AI, cloud, and mobile developers onboarded within 48 hours for your custom project needs.',
      badge: '48h Squad Onboarding',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      link: '/hire'
    },
    {
      title: 'Enterprise AI & Data Lakes',
      desc: 'Leverage custom GenAI models, LLM fine-tuning, automated ETL data ingestion pipelines, and RPA bots.',
      badge: 'AI & Automation',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      link: '/services/generative-ai'
    },
    {
      title: '24/7 Cloud Managed Ops',
      desc: 'Continuous performance benchmarking, zero-downtime CI/CD pipelines, ISO-grade compliance, and 24/7 SRE support.',
      badge: '24/7 Managed Ops',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      link: '/services/infrastructure-services'
    }
  ];

  // Services 4 Core Cards from PPT / TENJUMPS reference layout
  const servicesList = [
    {
      title: 'Digital Strategy & Engineering',
      desc: 'Architecting scalable web, mobile, and enterprise SaaS platforms aligned with modern business goals.',
      badge: 'Strategy & Build',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      link: '/services/digital-strategy'
    },
    {
      title: 'Data Engineering & Analytics',
      desc: 'Real-time ETL pipelines, data lake ingestion layers, and BI dashboards for enterprise decision-making.',
      badge: 'Data & Analytics',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      link: '/services/data-engineering'
    },
    {
      title: 'Generative AI & LLM Integration',
      desc: 'Custom LLM fine-tuning, enterprise RAG architectures, and AI-driven SDLC code generation.',
      badge: 'GenAI & LLMs',
      image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=800&q=80',
      link: '/services/generative-ai'
    },
    {
      title: '24/7 Cloud Managed Ops & Squads',
      desc: '24/7 SRE infrastructure support, continuous DevOps CI/CD, and 48-hour agile pod onboarding.',
      badge: 'Cloud & 24/7 Ops',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
      link: '/services/infrastructure-services'
    }
  ];

  // Technologies Tab Switcher Data

  let techCategories = {
    ai_genai: [], mobile: [], frontend: [], backend: [], database: [], cloud_devops: [], testing: []
  };
  
  if (techItems && techItems.length > 0) {
    techItems.forEach(t => {
      if (!techCategories[t.category]) techCategories[t.category] = [];
      techCategories[t.category].push({ name: t.name });
    });
  } else {
    // Fallback
    techCategories = {
      ai_genai: [
        { name: 'OpenAI (GPT-4o & o3)' },
        { name: 'Anthropic Claude 3.5' },
        { name: 'Google Gemini & Vertex' },
        { name: 'Meta Llama 3.2' },
        { name: 'LangChain & RAG' },
        { name: 'DeepSeek R1 & AI' },
        { name: 'PyTorch & ML' },
        { name: 'TensorFlow & Keras' },
        { name: 'Pinecone & Milvus DB' },
        { name: 'Hugging Face AI' },
        { name: 'Midjourney & SDXL' },
        { name: 'vLLM & Ollama' },
        { name: 'CrewAI & Agents' },
        { name: 'ChromaDB & Qdrant' },
        { name: 'LlamaIndex' },
        { name: 'Mistral AI' }
      ],
      mobile: [
        { name: 'Android' }, { name: 'iOS' }, { name: 'Swift' }, { name: 'Ionic' },
        { name: 'Flutter' }, { name: 'React Native' }, { name: 'Xamarin' }, { name: 'Kotlin' }
      ],
      frontend: [
        { name: 'React.js' }, { name: 'Next.js' }, { name: 'Vue.js' }, { name: 'Angular' },
        { name: 'Svelte' }, { name: 'Tailwind CSS' }, { name: 'Redux' }, { name: 'TypeScript' }
      ],
      backend: [
        { name: 'Node.js' }, { name: 'Python' }, { name: 'Java Spring' }, { name: '.NET Core' },
        { name: 'Go (Golang)' }, { name: 'Ruby on Rails' }, { name: 'PHP Laravel' }, { name: 'Rust' }
      ],
      database: [
        { name: 'PostgreSQL' }, { name: 'MongoDB' }, { name: 'MySQL' }, { name: 'Redis' },
        { name: 'Elasticsearch' }, { name: 'DynamoDB' }, { name: 'Cassandra' }, { name: 'Snowflake' }
      ],
      cloud_devops: [
        { name: 'AWS' }, { name: 'Microsoft Azure' }, { name: 'Google Cloud (GCP)' }, { name: 'Docker' },
        { name: 'Kubernetes' }, { name: 'Jenkins' }, { name: 'Terraform' }, { name: 'GitHub Actions' }
      ],
      testing: [
        { name: 'Selenium' }, { name: 'Cypress' }, { name: 'Jest' }, { name: 'Playwright' },
        { name: 'Appium' }, { name: 'JUnit' }, { name: 'Postman' }, { name: 'JMeter' }
      ]
    };
  }


  // 4-Step Quality Process with Icons & Custom Metadata
  const qualitySteps = [
    {
      num: '01',
      title: 'Define Scope of Work',
      subtitle: 'Requirement Analysis',
      desc: 'Specify your core technical requirements. We match specialized software architects and product experts to your domain.',
      bullets: ['Branding & UX Design', 'Architecture Audit', 'Web & Mobile Scope'],
      icon: FileText
    },
    {
      num: '02',
      title: 'Architecture & Pod Alignment',
      subtitle: 'Flexible Engagement',
      desc: 'Based on your scope, we align dedicated software architects and team pods tailored to your technical roadmap.',
      bullets: ['Dedicated Sprint Pods', 'Turnkey Milestones', 'Architecture Roadmaps'],
      icon: Layers
    },
    {
      num: '03',
      title: 'Kick-off & Squad Match',
      subtitle: 'Account Alignment',
      desc: 'Meet your dedicated engineers, technical project manager, and account leads during an aligned kickoff sprint.',
      bullets: ['Prepare Scope Agenda', 'Sprint Goal Alignment', 'Slack / Jira Setup'],
      icon: Users
    },
    {
      num: '04',
      title: 'Ready? Let\'s Build!',
      subtitle: 'High Velocity Execution',
      desc: 'With team onboarding complete and sprint milestones agreed upon, we immediately begin agile sprint deployment.',
      bullets: ['Dedicated PM Included', '24/7 SRE Support', 'Weekly Demo Sprints'],
      icon: Rocket
    }
  ];

  // 3-Column Capability Links
  const capabilityColumns = [
    {
      title: 'Mobile App Development',
      badge: 'iOS & Android',
      items: [
        'iOS App Development',
        'Android App Development',
        'Cross Platform Development',
        'Flutter App Development',
        'Swift App Development',
        'App Maintenance & Support'
      ]
    },
    {
      title: 'Software Development',
      badge: 'Custom & Cloud',
      items: [
        'Custom Software Development',
        'SaaS Development',
        'ERP Software Development',
        'Cloud & DevOps',
        'Custom CRM Development',
        'AI / ML Development'
      ]
    },
    {
      title: 'Web Development',
      badge: 'Full Stack',
      items: [
        'Web App Development',
        'eCommerce Development',
        'API Development',
        'Frontend Development',
        'Backend Development',
        'Hire a Dedicated Developer'
      ]
    }
  ];

  // 5 Core Pillars
  const pillars = servicesData.length > 0 ? servicesData.map(s => ({
    id: s.slug,
    title: s.title,
    tagline: s.tagline,
    description: s.description,
    badge: 'Strategy & Build',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    link: '/services/' + s.slug
  })) : [
    // Fallback if empty
    {
      id: 'digital-strategy',
      title: 'Digital Strategy',
      tagline: 'Strategic Roadmaps & Technical Audits',
      description: 'Discovery, ideation, experience engineering, technology & data audits.',
      badge: 'Strategy & Build',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      link: '/services/digital-strategy'
    }
  ];

  const industryShowcase = domainsData.length > 0 ? domainsData.map(d => ({
    title: d.title,
    link: '/solutions/' + d.slug,
    icon: Globe,
    image: d.media_url || 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
  })) : [
    // Fallback
    {
      title: 'Healthcare & Medicine',
      link: '/solutions/healthcare',
      icon: Heart,
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80'
    }
  ];

  return (
    <div className="bg-[#FAFAFC] text-[#0F172A] overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 pb-10 sm:pt-14 sm:pb-20 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 w-full max-w-full overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-center">
          
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-50/90 border border-blue-200/80 text-blue-700 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm max-w-full">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span className="truncate">Enterprise AI & Software Engineering</span>
            </div>

            <h1 className="font-space text-3xl sm:text-5xl lg:text-[54px] font-semibold text-[#0F172A] tracking-[-0.03em] leading-[1.12] sm:leading-[1.15]">
              <span className="block text-[#0F172A]">
                Ideas are only the beginning.
              </span>
              <span className="block font-medium text-blue-600 pt-1.5 tracking-[-0.02em]">
                Let's build what's next.
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
              We bring together custom software development, cloud data lakes, and enterprise AI to solve complex technical challenges and build high-velocity digital capabilities.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 w-full">
              <Link
                to="/schedule-discovery"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-7 py-3.5 sm:px-8 sm:py-4 rounded-xl transition-all shadow-lg text-xs sm:text-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 ring-2 ring-blue-100"
              >
                <span>SCHEDULE DISCOVERY CALL</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
              <Link
                to="/services"
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold px-6 py-3.5 sm:px-7 sm:py-4 rounded-xl transition-all border border-slate-200 shadow-sm text-xs sm:text-sm text-center"
              >
                Explore All Offerings
              </Link>
            </div>
          </div>

          {/* Hero Professional Enterprise Media Showcase */}
          <div className="lg:col-span-5 relative pt-2 lg:pt-0">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80">
              <img 
                src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80" 
                alt="Enterprise IT Services & Cloud Infrastructure"
                className="w-full h-[240px] sm:h-[380px] lg:h-[420px] object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED PRESS RELEASE / NEWS ANNOUNCEMENT BANNER (TENJUMPS STYLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="bg-gradient-to-br from-blue-50/40 via-white to-slate-50/60 border border-blue-100 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg space-y-5 sm:space-y-6">
          
          <div className="inline-flex items-center gap-2 bg-blue-50/80 text-blue-600 border border-blue-100 px-3.5 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Featured Press Announcement</span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight max-w-5xl leading-snug sm:leading-tight">
            {brandName} expands engineering center in Bengaluru to support growing global demand
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-1">
            
            {/* Left Media Video Thumbnail Container */}
            <div 
              className="lg:col-span-7 relative rounded-3xl overflow-hidden shadow-xl border border-slate-200 group cursor-pointer"
              onClick={() => setIsNewsModalOpen(true)}
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
                alt={brandName + " Bangalore Engineering Expansion"}
                className="w-full h-[200px] sm:h-[260px] lg:h-[280px] object-cover transform group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-3 left-3 right-3 text-white text-xs sm:text-sm font-extrabold bg-slate-950/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/20 flex items-center justify-between">
                <span>Bengaluru Engineering Center Expansion</span>
                <span className="text-blue-300 font-mono hidden sm:inline-block">Press Release</span>
              </div>
            </div>

            {/* Right Summary Excerpt & Action Button */}
            <div className="lg:col-span-5 space-y-4">
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
                The new Bengaluru presence expands {brandName}'s global delivery capabilities, adding highly skilled local talent to provide clients with greater flexibility, efficiency, and cost-effective access to data and digital engineering expertise.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/about/news/why-it-services-expands-bangalore-engineering-center"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold px-6 py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 group text-center"
                >
                  <span>Read the press release</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>



      {/* 4. AGILE ENGINEERING BANNER CARD */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl text-center space-y-3">
          <div className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-blue-200">
            AGILE ENGINEERING
          </div>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white tracking-tight max-w-4xl mx-auto">
            Engineering Leadership Focused on <span className="font-medium text-blue-200">Modern Software Excellence</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Our technology leads and software architects specialize in digital strategy, full-stack enterprise development, real-time data lakes, QA automation, and cloud infrastructure management.
          </p>
          <div className="pt-1">
            <Link
              to="/schedule-discovery"
              className="bg-white hover:bg-blue-50/80 text-blue-600 font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider inline-block shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              Connect with Our Engineering Pods
            </Link>
          </div>
        </div>
      </section>

      {/* 5. STARTUP METRICS & MISSION BANNER */}
      <section className="relative w-full bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white py-6 sm:py-8 overflow-hidden border-y border-blue-500/20">
        
        {/* Ambient Blue Background Glow Accents across full screen */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
              Built for <span className="text-sky-300">Agile Product Innovation</span>
            </h2>
          </div>

          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-slate-900/70 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4 sm:p-5 text-center space-y-1 hover:border-blue-500/50 transition-all shadow-md">
              <div className="text-2xl sm:text-4xl font-extrabold text-blue-400">100%</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider">Dedicated Engineering Pods</div>
              <div className="text-[9px] text-blue-300 font-mono">/ 01</div>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4 sm:p-5 text-center space-y-1 hover:border-blue-500/50 transition-all shadow-md">
              <div className="text-2xl sm:text-4xl font-extrabold text-blue-400">48 hrs</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider">Squad Onboarding Time</div>
              <div className="text-[9px] text-blue-300 font-mono">/ 02</div>
            </div>
            <div className="bg-slate-900/70 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4 sm:p-5 text-center space-y-1 hover:border-blue-500/50 transition-all shadow-md">
              <div className="text-2xl sm:text-4xl font-extrabold text-blue-400">24 / 7</div>
              <div className="text-[10px] sm:text-xs text-slate-300 font-semibold uppercase tracking-wider">SRE Cloud Monitoring</div>
              <div className="text-[9px] text-blue-300 font-mono">/ 03</div>
            </div>
          </div>

          {/* Mission Statement Banner */}
          <div className="relative z-10 max-w-3xl mx-auto bg-slate-900/80 backdrop-blur-md border border-blue-500/20 rounded-2xl p-4 sm:p-5 text-center space-y-2">
            <p className="text-xs sm:text-sm text-slate-200 italic leading-relaxed">
              “At ${brandName}, we engineered our core architecture from the ground up to empower ambitious founders and growing companies with modern AI, cloud data lakes, and custom software solutions.”
            </p>
            <div>
              <div className="font-bold text-xs text-white">{brandName} Engineering Leadership</div>
              <div className="text-[9px] text-blue-400 font-semibold uppercase tracking-wider">AI & Software Engineering Pods</div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. "OUR OFFERINGS: EXPLORE PROVEN IT SOLUTIONS" INTERACTIVE ACCORDION SHOWCASE (TENJUMPS STYLE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4 sm:gap-6">
          <div className="space-y-1">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider">OUR OFFERINGS</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Explore Proven Enterprise Solutions
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm lg:text-base max-w-xl font-normal leading-relaxed">
              Designed to accelerate your growth, efficiency, and digital transformation journey.
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold px-6 py-3.5 rounded-full uppercase tracking-wider shrink-0 transition-all shadow-md text-center inline-flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-auto"
          >
            <span>GET A CUSTOM PROPOSAL NOW</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>

        {/* Accordion Flex Container matching Tenjumps Reference */}
        <div className="flex flex-col md:flex-row gap-3 sm:gap-4 lg:gap-6 min-h-0 md:min-h-[360px]">
          {(pillars || servicesList).map((service, idx) => {
            const isExpanded = expandedServiceIndex === idx;

            return (
              <div 
                key={idx}
                onClick={() => {
                  setExpandedServiceIndex(isExpanded ? null : idx);
                }}
                className={`relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-7 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0A0D14] text-white shadow-xl transition-all duration-500 ease-out flex flex-col justify-between group cursor-pointer border ${
                  isExpanded 
                    ? 'min-h-[220px] md:min-h-[350px] md:flex-[2.8] border-blue-500 ring-2 ring-blue-500/40' 
                    : 'h-[110px] sm:h-[125px] md:h-auto md:min-h-[350px] md:flex-[1.1] border-slate-800/80 hover:border-blue-500/40'
                }`}
              >
                {/* Background Image with Fallback handling */}
                <img 
                  src={service.image} 
                  alt={service.title} 
                  onError={(e) => { e.target.style.display = 'none'; }}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Dark Gradient Overlay for Text Readability */}
                <div className={`absolute inset-0 bg-gradient-to-t from-[#0F172A]/95 via-[#0F172A]/70 to-slate-950/30 transition-opacity duration-300 ${
                  isExpanded ? 'opacity-95' : 'opacity-85'
                }`} />

                {/* Top Area: Number Badge (Left) + Arrow Circle Button when unexpanded (Right) */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 text-xs font-bold font-mono shadow-sm">
                    {idx + 1}
                  </div>

                  {!isExpanded && (
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center border border-white/30 transition-all shadow-md group-hover:bg-blue-600 group-hover:border-blue-500 group-hover:scale-110">
                      <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </div>

                {/* Bottom Content Area: Title + Elaboration Description & Explore Solution Link */}
                <div className="relative z-10 mt-auto space-y-2">
                  <h3 className="font-extrabold text-base sm:text-lg md:text-2xl text-white tracking-tight leading-snug group-hover:text-blue-200 transition-colors">
                    {service.title}
                  </h3>

                  {/* Elaboration Content (Description + Explore Solution Button) - Visible ONLY when Elaborated / Expanded */}
                  {isExpanded && (
                    <div className="space-y-3 pt-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-lg">
                        {(service.description || service.desc)}
                      </p>

                      <div className="pt-2 border-t border-white/20 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(service.link);
                          }}
                          className="text-xs sm:text-sm font-extrabold text-white hover:text-sky-300 inline-flex items-center gap-2 transition-colors group/btn cursor-pointer"
                        >
                          <span>Explore Solution</span>
                          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform text-sky-300" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      </section>

      {/* 7B. DEDICATED SENIOR TECH TALENT SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-center">
        
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50/90 border border-blue-200/80 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Top 3% Vetted Senior Tech Talent</span>
        </div>

        {/* Main Section Heading */}
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight max-w-4xl mx-auto mb-4">
          Hire Dedicated Senior Developers <span className="font-accent-italic font-normal text-blue-600">in 48 Hours</span>
        </h2>

        {/* Subtitle Description */}
        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 font-normal">
          Scale your engineering capabilities with pre-vetted full-stack developers, AI engineers, and cloud architects working 100% dedicated to your agile roadmap.
        </p>

        {/* Talent Showcase Media Card */}
        <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 relative group">
          <img
            src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1200&auto=format&fit=crop"
            alt="Dedicated Senior Software Engineers"
            className="w-full h-60 sm:h-72 lg:h-80 object-cover transform group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/30 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white text-left space-y-1.5">
            <span className="text-xs font-mono text-sky-300 font-extrabold uppercase tracking-wider">Top 3% Vetted Talent</span>
            <h3 className="text-lg sm:text-2xl font-extrabold text-white">Agile Full-Stack & AI Squads</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">Seamlessly integrated into your daily Git, Jira, and Slack channels.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
          <Link
            to="/hire"
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-4 rounded-xl uppercase tracking-wider shadow-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <span>Hire Developers Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/schedule-discovery"
            className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 font-bold px-7 py-4 rounded-xl hover:bg-slate-50 transition-all text-xs sm:text-sm text-center shadow-sm"
          >
            Schedule Discovery Call
          </Link>
        </div>

      </section>

      {/* 7C. EXPERT MINDS: WHY PARTNER WITH WHY IT SERVICES? (PREMIUM ENTERPRISE BENTO GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 lg:py-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 sm:mb-6 lg:mb-6 gap-3.5 sm:gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-blue-50/90 border border-blue-200/80 text-blue-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>Enterprise Execution</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Why Partner With <span className="text-blue-600">{brandName}</span>?
            </h2>
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 max-w-2xl font-normal leading-relaxed">
              We engineer scalable digital capabilities for global leaders through specialized agile pods, enterprise AI, data lakes, and continuous cloud ops.
            </p>
          </div>
          
          <Link
            to="/schedule-discovery"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold px-6 py-3 rounded-xl uppercase tracking-wider shrink-0 transition-all shadow-md text-center inline-flex items-center justify-center gap-2 whitespace-nowrap self-start md:self-auto"
          >
            <span>Schedule Discovery Call</span>
            <ArrowRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>

        {/* Mobile Swipe Hint Badge with Dynamic Slide Counter */}
        <div className="flex lg:hidden items-center justify-between pb-2.5 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1.5 text-blue-600">
            <Sparkles className="w-3.5 h-3.5" /> Swipe cards to explore
          </span>
          <span className="font-mono text-xs text-blue-700 font-extrabold bg-blue-50/80 px-2.5 py-0.5 rounded-full border border-blue-100">
            {activeBentoSlide} of 4
          </span>
        </div>

        {/* Premium Corporate Bento Grid Container - Horizontal Touch Slider on Mobile, 2x2 Bento Grid on Desktop */}
        <div 
          onScroll={handleBentoScroll}
          className="flex lg:grid lg:grid-cols-12 gap-3.5 lg:gap-4 overflow-x-auto lg:overflow-visible snap-x snap-mandatory no-scrollbar pb-3 -mx-4 px-4 lg:mx-0 lg:px-0 lg:pb-0"
        >
          
          {/* Card 1 (Span 7 Cols - Custom Software Solutions) */}
          <div className="w-[88vw] xs:w-[90vw] sm:w-[420px] lg:w-auto shrink-0 snap-center lg:col-span-7 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-4.5 relative overflow-hidden shadow-xl border border-blue-500/20 flex flex-col justify-between group">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-blue-600 text-white text-[10px] sm:text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  Full-Stack & Cloud Architecture
                </span>
                <span className="text-[10px] sm:text-[10.5px] font-mono text-sky-300 font-bold bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800/60 whitespace-nowrap">
                  01 / CUSTOM SOFTWARE
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-xl lg:text-lg font-extrabold text-white tracking-tight">
                  Custom Enterprise Software
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm lg:text-xs leading-relaxed max-w-xl font-normal">
                  SaaS platforms, cloud-native microservices, and mobile apps engineered with secure, scalable modern tech stacks.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
                <div className="bg-slate-900/80 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs lg:text-[11px] text-blue-200 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>SaaS Platforms</span>
                </div>
                <div className="bg-slate-900/80 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs lg:text-[11px] text-blue-200 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>iOS & Android</span>
                </div>
                <div className="bg-slate-900/80 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs lg:text-[11px] text-blue-200 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Microservices</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-2.5 mt-3 border-t border-blue-500/20 flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm lg:text-[11px] text-sky-300 font-bold">100% Dedicated Engineering</span>
              <Link
                to="/services/digital-engineering"
                className="bg-white text-blue-600 hover:bg-blue-50/80 text-xs lg:text-[10.5px] font-extrabold px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-all inline-flex items-center gap-1.5 shadow-md whitespace-nowrap shrink-0"
              >
                <span>Explore Engineering</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Card 2 (Span 5 Cols - Dedicated Agile Squads) */}
          <div className="w-[88vw] xs:w-[90vw] sm:w-[420px] lg:w-auto shrink-0 snap-center lg:col-span-5 bg-gradient-to-br from-blue-50/40 via-white to-slate-50/60 border border-blue-100 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-4.5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-blue-600 text-white text-[10px] sm:text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  48h Squad Onboarding
                </span>
                <span className="text-[10px] sm:text-[10.5px] font-mono text-blue-600 font-bold bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100 whitespace-nowrap">
                  02 / TALENT SQUADS
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg lg:text-base font-bold text-[#0F172A] tracking-tight">
                  Dedicated Agile Squads
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm lg:text-xs leading-relaxed font-normal">
                  Senior full-stack, AI, and cloud engineers onboarded within 48 hours for immediate team output.
                </p>
              </div>

              <div className="bg-white/80 border border-blue-100 p-2.5 rounded-xl flex items-center justify-between shadow-sm">
                <div>
                  <div className="text-sm sm:text-base font-extrabold text-blue-600">48 Hours</div>
                  <div className="text-[9px] sm:text-[9.5px] text-slate-500 uppercase font-bold tracking-wider">Rapid Pod Match</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#0F172A]">Direct Git & Slack</div>
                  <div className="text-[9px] sm:text-[9.5px] text-blue-700 font-bold">Risk-Free 3-Day Trial</div>
                </div>
              </div>
            </div>

            <div className="pt-2.5 mt-3 border-t border-blue-100 flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm lg:text-[11px] text-slate-500 font-semibold">Zero Onboarding Overhead</span>
              <Link
                to="/hire"
                className="text-xs sm:text-sm lg:text-[11px] font-extrabold text-blue-600 hover:underline inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>Hire Developers</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Card 3 (Span 5 Cols - Enterprise AI & Data Lakes) */}
          <div className="w-[88vw] xs:w-[90vw] sm:w-[420px] lg:w-auto shrink-0 snap-center lg:col-span-5 bg-gradient-to-br from-blue-50/40 via-white to-slate-50/60 border border-blue-100 rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-4.5 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-blue-600 text-white text-[10px] sm:text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  AI & Automation
                </span>
                <span className="text-[10px] sm:text-[10.5px] font-mono text-blue-600 font-bold bg-blue-50/80 px-2.5 py-1 rounded-lg border border-blue-100 whitespace-nowrap">
                  03 / GEN AI & DATA
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-lg lg:text-base font-bold text-[#0F172A] tracking-tight">
                  Enterprise AI & Data Lakes
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm lg:text-xs leading-relaxed font-normal">
                  Custom GenAI models, LLM fine-tuning, enterprise RAG, and real-time ETL data ingestion pipelines.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div className="bg-white border border-blue-100 p-2 rounded-lg text-center">
                  <div className="text-xs font-bold text-blue-600">LLM Fine-Tuning</div>
                  <div className="text-[9px] sm:text-[9.5px] text-slate-500 font-medium">RAG & Vector DBs</div>
                </div>
                <div className="bg-white border border-blue-100 p-2 rounded-lg text-center">
                  <div className="text-xs font-bold text-blue-600">Real-Time ETL</div>
                  <div className="text-[9px] sm:text-[9.5px] text-slate-500 font-medium">Data Lake Ingestion</div>
                </div>
              </div>
            </div>

            <div className="pt-2.5 mt-3 border-t border-blue-100 flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm lg:text-[11px] text-slate-500 font-semibold">Custom AI Architectures</span>
              <Link
                to="/services/generative-ai"
                className="text-xs sm:text-sm lg:text-[11px] font-extrabold text-blue-600 hover:underline inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <span>Explore Generative AI</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Card 4 (Span 7 Cols - 24/7 Cloud Managed Ops) */}
          <div className="w-[88vw] xs:w-[90vw] sm:w-[420px] lg:w-auto shrink-0 snap-center lg:col-span-7 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white rounded-2xl lg:rounded-3xl p-4 sm:p-5 lg:p-4.5 relative overflow-hidden shadow-xl border border-blue-500/20 flex flex-col justify-between group">
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="bg-blue-600 text-white text-[10px] sm:text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  24/7 Managed Ops
                </span>
                <span className="text-[10px] sm:text-[10.5px] font-mono text-sky-300 font-bold bg-blue-950/80 px-2.5 py-1 rounded-lg border border-blue-800/60 whitespace-nowrap">
                  04 / MANAGED INFRA
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base sm:text-xl lg:text-lg font-extrabold text-white tracking-tight">
                  24/7 Cloud Ops & SRE Support
                </h3>
                <p className="text-slate-300 text-xs sm:text-sm lg:text-xs leading-relaxed max-w-xl font-normal">
                  ISO-certified cloud infrastructure, zero-downtime CI/CD pipelines, and proactive 24/7 SRE monitoring.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1">
                <div className="bg-slate-900/80 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs lg:text-[11px] text-blue-200 font-medium flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>ISO 27001 & SOC2</span>
                </div>
                <div className="bg-slate-900/80 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs lg:text-[11px] text-blue-200 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>24/7 SRE Monitoring</span>
                </div>
                <div className="bg-slate-900/80 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs lg:text-[11px] text-blue-200 font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Zero-Downtime CI/CD</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-2.5 mt-3 border-t border-blue-500/20 flex items-center justify-between gap-2">
              <span className="text-xs sm:text-sm lg:text-[11px] text-sky-300 font-bold">100% SLA Guarantee</span>
              <Link
                to="/services/infrastructure-services"
                className="bg-white text-blue-600 hover:bg-blue-50/80 text-xs lg:text-[10.5px] font-extrabold px-3.5 py-1.5 rounded-lg uppercase tracking-wider transition-all inline-flex items-center gap-1.5 shadow-md whitespace-nowrap shrink-0"
              >
                <span>Explore Managed Ops</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </Link>
            </div>
          </div>
        </div>

      </section>

      {/* 8. INDUSTRY MARQUEE SHOWCASE (ROBOFLOW STYLE - SCROLLING LEFT TO RIGHT) */}
      <section className="py-12 sm:py-16 overflow-hidden bg-gradient-to-b from-[#FAFAFC] via-blue-50/20 to-[#FAFAFC] border-y border-blue-100">
        
        {/* Section Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 bg-blue-50/90 border border-blue-200/80 text-blue-700 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Industry Solutions</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight max-w-4xl mx-auto">
            Thousands of software engineers rely on <span className="font-accent-italic font-normal text-blue-600">{brandName}</span> in their industry.
          </h2>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            Accelerate your digital transformation with pre-vetted engineering squads, custom AI models, data lakes, and cloud infrastructure tailored for your sector.
          </p>
        </div>

        {/* Left-To-Right Continuous Marquee Ticker Container */}
        <div className="relative w-full overflow-hidden py-2">
          
          {/* Subtle Side Fade Gradients for Seamless Depth */}
          <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-[#FAFAFC] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-[#FAFAFC] to-transparent z-10 pointer-events-none" />

          {/* Marquee Track (Scrolling Left to Right) */}
          <div className="animate-marquee-ltr flex items-center gap-3.5 sm:gap-5 w-max">
            {[...industryShowcase, ...industryShowcase].map((item, idx) => {
              return (
                <Link
                  key={idx}
                  to={item.link}
                  className="w-[230px] sm:w-[270px] h-[115px] sm:h-[135px] shrink-0 rounded-xl sm:rounded-2xl overflow-hidden relative group shadow-md hover:shadow-xl transition-all cursor-pointer"
                >
                  {/* Background Image with Smooth Zoom */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Dark Gradient Overlay matching Roboflow layout */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-transparent transition-opacity group-hover:opacity-95" />

                  {/* Industry Name Text - Exact Font, Size & Bottom-Left Alignment */}
                  <span className="absolute bottom-3 left-4 right-4 text-white font-medium text-sm sm:text-base tracking-normal drop-shadow-sm truncate">
                    {item.title}
                  </span>

                </Link>
              );
            })}
          </div>

        </div>

      </section>

      {/* 8B. CLIENT & ARCHITECTURE FEEDBACK SLIDER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Testimonials />
      </section>

      {/* 8C. GLOBAL DELIVERY NETWORK & HQ MAP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlobalDeliveryMap />
      </section>


      {/* 10. "PARTNER WITH SKILLED SPECIALISTS" 3-COLUMN CAPABILITY GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] tracking-tight">
            Partner with Skilled Specialists to Elevate Your Project's Success
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Our team offers ongoing technical and expert support throughout the entire process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {capabilityColumns.map((col, idx) => (
            <div key={idx} className="w-full bg-gradient-to-b from-blue-50/30 via-white to-white border border-blue-100 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                <h3 className="font-bold text-base sm:text-lg text-[#0F172A]">{col.title}</h3>
                <span className="text-xs font-bold text-blue-600 bg-blue-50/80 px-2.5 py-1 rounded-lg">{col.badge}</span>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                {col.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 hover:text-blue-600 font-medium transition-colors cursor-pointer">
                    <ChevronRight className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 11. UNIFIED HIGH-CONVERTING PARTNERSHIP CTA */}
      <section className="bg-gradient-to-r from-slate-900 via-[#1E293B] to-slate-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 sm:space-y-5">
          <div className="inline-flex items-center gap-2 bg-blue-950/80 border border-blue-800 text-blue-200 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>Risk-Free 3-Day Engineering Trial</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Ready to Build Your Next <span className="font-accent-italic font-normal text-blue-200">Digital Capability</span>?
          </h2>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Assign a trial task to one of our dedicated senior developers or schedule an architecture discovery call with our leadership team.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <Link
              to="/schedule-discovery"
              className="w-full sm:w-auto bg-white hover:bg-blue-50/80 text-blue-600 font-extrabold px-8 py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-xl transition-all flex items-center justify-center gap-2"
            >
              <span>SCHEDULE DISCOVERY CALL</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/hire"
              className="w-full sm:w-auto bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold px-8 py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider transition-all text-center"
            >
              Explore Developer Squads
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED PRESS RELEASE PREVIEW MODAL */}
      {isNewsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative space-y-6">
            <button 
              onClick={() => setIsNewsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors font-bold text-xs"
            >
              ✕ Close
            </button>

            <div className="space-y-3">
              <span className="bg-blue-600 text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                PRESS RELEASE
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] leading-tight">
                {brandName} expands engineering center in Bengaluru to support growing global demand
              </h3>
              <p className="text-xs font-mono text-blue-600 font-bold">BENGALURU, INDIA — SEPTEMBER 2026</p>
            </div>

            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80"
              alt="Bangalore Center Expansion"
              className="w-full h-64 object-cover rounded-2xl"
            />

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {brandName} today announced the expansion of its Global Delivery Headquarters in Bengaluru, Karnataka. The new facility expands client capacity for dedicated Generative AI, cloud data lakes, and high-velocity developer squads.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200">
              <Link
                to="/about/news/why-it-services-expands-bangalore-engineering-center"
                onClick={() => setIsNewsModalOpen(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-7 py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-md inline-flex items-center gap-2"
              >
                <span>Read Full Article & Address</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
