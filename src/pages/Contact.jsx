import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Mail, MapPin, Phone, ShieldCheck, Clock, CheckCircle2, 
  Send, Sparkles, Building2, User
} from 'lucide-react';

import { submitContactInquiry } from '../api/client';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Contact() {
  const location = useLocation();
  const preselectedData = location.state || {};
  const { general, phone, email, address, mapsUrl, companyLegalName, businessHours, forms } = useSiteSettings();
  const brandName = general?.brand_name || 'WHY IT Services';

  const contactConfig = forms?.contact || {};
  const dynamicFields = Array.isArray(contactConfig.fields) && contactConfig.fields.length > 0 ? contactConfig.fields : null;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    serviceInterest: preselectedData.serviceInterest || 'digital-strategy',
    budget: preselectedData.budget || '$10k - $25k',
    message: preselectedData.notes ? `[Estimate Context: ${preselectedData.notes}] ` : ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (preselectedData.serviceInterest || preselectedData.budget || preselectedData.notes) {
      setFormData(prev => ({
        ...prev,
        serviceInterest: preselectedData.serviceInterest || prev.serviceInterest,
        budget: preselectedData.budget || prev.budget,
        message: preselectedData.notes ? `[Estimate Context: ${preselectedData.notes}] ${prev.message || ''}` : prev.message
      }));
    }
  }, [preselectedData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const payload = dynamicFields ? { ...formData } : {
        name: formData.fullName,
        email: formData.email,
        company: formData.company || null,
        serviceInterest: formData.serviceInterest || null,
        budget: formData.budget || null,
        message: formData.message
      };

      const response = await submitContactInquiry(payload);

      if (response && response.success) {
        setRefId(response.inquiryId || response.data?.refId || 'INQ-' + Date.now());
        setSubmitted(true);
      } else {
        throw new Error('Unexpected response format from server.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAFAFC] text-[#0F172A] pt-8 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <div className="inline-flex items-center gap-2 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-4 h-4 text-[#2563EB]" />
          Direct Access to Founding Leadership
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[#0F172A] tracking-tight leading-tight mb-4">
          Book a Demo & <span className="italic font-normal text-[#2563EB]">Technical Discovery Call</span>
        </h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Tell us about your project or digital transformation objectives. Our senior technology directors will review your requirements and provide a clear execution roadmap.
        </p>
      </section>

      {/* 2. FORM & TRUST COLUMN GRID WITH SOFT LAVENDER GRADIENT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Interactive Form Card */}
          <div className="lg:col-span-7 bg-gradient-to-b from-[#F8FAFC] via-white to-[#FAFAFC] border border-[#BFDBFE] rounded-3xl p-6 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-[11px] font-mono font-bold text-[#2563EB] bg-[#EFF6FF] px-3 py-1 rounded-full border border-[#BFDBFE] uppercase inline-block">
                  Reference ID: {refId}
                </span>
                <h2 className="text-2xl font-bold text-[#0F172A]">Discovery Request Received!</h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to {brandName}. Your request reference is <strong className="font-mono text-[#2563EB]">{refId}</strong>. One of our lead technical directors will review your details and respond within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ fullName: '', email: '', company: '', serviceInterest: 'digital-strategy', budget: '$10k - $25k', message: '' });
                  }}
                  className="bg-[#2563EB] text-white text-xs font-bold px-6 py-3 rounded-xl hover:bg-[#1E40AF] transition-all shadow-sm"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#0F172A]">{contactConfig.intro_text || 'Project Intake Details'}</h2>
                  <p className="text-slate-500 text-xs mt-1">Fields marked with * are required.</p>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs font-semibold">
                    {errorMsg}
                  </div>
                )}

                {dynamicFields ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {dynamicFields.map(field => (
                      <div key={field.key} className={field.type === 'textarea' ? 'sm:col-span-2' : ''}>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          {field.label} {field.required && '*'}
                        </label>
                        {field.type === 'textarea' ? (
                          <textarea
                            rows={4}
                            required={field.required}
                            value={formData[field.key] || ''}
                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                            placeholder={field.placeholder || ''}
                            className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          />
                        ) : field.type === 'select' ? (
                          <select
                            required={field.required}
                            value={formData[field.key] || ''}
                            onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          >
                            <option value="" disabled>Select an option</option>
                            {(field.options || []).map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          <div className="relative">
                            {field.type === 'email' ? <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" /> : 
                             (field.type === 'tel' ? <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" /> : 
                             <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />)}
                            <input
                              type={field.type}
                              required={field.required}
                              value={formData[field.key] || ''}
                              onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                              placeholder={field.placeholder || ''}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            required
                            value={formData.fullName || ''}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="Alex Morgan"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Work Email *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="email"
                            required
                            value={formData.email || ''}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="alex@company.com"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Company / Organization
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                          <input
                            type="text"
                            value={formData.company || ''}
                            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Acme Enterprise"
                            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Primary Service Focus
                        </label>
                        <select
                          value={formData.serviceInterest || 'digital-strategy'}
                          onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                          className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                        >
                          <option value="digital-strategy">Digital Strategy & Ideation</option>
                          <option value="digital-engineering">Digital Engineering & QA</option>
                          <option value="data-engineering">Data Engineering & Analytics (ETL)</option>
                          <option value="generative-ai">Generative AI & RPA Automation</option>
                          <option value="infrastructure">Infrastructure Managed Services (L1/L2)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                        Project Scope / Requirements *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.message || ''}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Describe your goals, tech stack, or legacy migration requirements..."
                        className="w-full p-4 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 outline-none transition-all"
                      ></textarea>
                    </div>
                  </>
                )}

                {contactConfig.privacy_consent_text && (
                  <div className="flex items-start gap-2 mt-4 text-xs text-slate-500">
                     <input type="checkbox" required className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-0 w-3.5 h-3.5" />
                     <span className="leading-relaxed">{contactConfig.privacy_consent_text}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#2563EB] hover:bg-[#1E40AF] disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-sm"
                >
                  <Send className="w-4 h-4" />
                  {isSubmitting ? 'Submitting...' : (contactConfig.submit_button_label || 'Submit Discovery Request')}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Trust Timeline & Direct Coordinates (Soft Lavender Gradient Cards) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-gradient-to-b from-blue-50/30 via-white to-white border border-[#BFDBFE] rounded-3xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-xl font-bold text-[#0F172A] mb-6">What Happens Next?</h3>
              
              <div className="space-y-6">
                {[
                  {
                    icon: ShieldCheck,
                    title: '1. Confidential Review',
                    desc: 'Your intake is assigned directly to a principal engineer under strict NDA guidelines.'
                  },
                  {
                    icon: Clock,
                    title: '2. 24-Hour Response Guarantee',
                    desc: 'We analyze your requirements and schedule a 30-minute interactive technical roadmap call.'
                  },
                  {
                    icon: CheckCircle2,
                    title: '3. Scope & Proposal',
                    desc: 'You receive a clear scope document, architecture breakdown, timeline, and team augmentation options.'
                  }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-[#BFDBFE] text-[#2563EB] flex items-center justify-center shrink-0 shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#0F172A]">{item.title}</h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Contact Coordinates Card (Soft Lavender Gradient Card matching screenshot) */}
            <div className="bg-gradient-to-b from-blue-50/30 via-white to-white border border-[#BFDBFE] rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <h3 className="text-lg font-bold text-[#0F172A]">Direct Contact Coordinates</h3>
              
              <div className="space-y-3.5 text-xs text-slate-700">
                {phone && (
                  <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center gap-3.5 hover:text-[#2563EB] transition-colors group">
                    <Phone className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span className="font-semibold text-slate-800 group-hover:text-[#2563EB]">
                      {phone}{businessHours ? ` (${businessHours})` : ''}
                    </span>
                  </a>
                )}
                {email && (
                  <a href={`mailto:${email}`} className="flex items-center gap-3.5 hover:text-[#2563EB] transition-colors group">
                    <Mail className="w-4 h-4 text-[#2563EB] shrink-0" />
                    <span className="font-semibold text-slate-800 group-hover:text-[#2563EB]">{email}</span>
                  </a>
                )}
                {mapsUrl && (
                  <a 
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3.5 hover:text-[#2563EB] transition-colors group pt-1"
                  >
                    <MapPin className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">
                      {companyLegalName && <><strong className="text-[#0F172A] group-hover:text-[#2563EB]">{companyLegalName}</strong><br /></>}
                      {address}
                    </span>
                  </a>
                )}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. FAQ ACCORDION GRID WITH SOFT LAVENDER GRADIENT CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Frequently Asked Questions</span>
          <h2 className="text-3xl font-extrabold text-[#0F172A] mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {[
            {
              q: 'What engagement models do you offer?',
              a: 'We offer Digital Strategy Audits, End-to-End Milestone Projects, Sustenance & Support Retainers, and Engineering Team Augmentation.'
            },
            {
              q: 'How do you handle QA Verification & Validation?',
              a: 'Our QA engineering processes cover functional and non-functional automated testing, security validation, and continuous integration audits.'
            },
            {
              q: 'How does {brandName} leverage Generative AI?',
              a: 'We implement LLMs for qualitative insight extraction, AI-assisted SDLC code generation, and RPA attended/unattended BOTs.'
            },
            {
              q: 'What experience does your leadership team bring?',
              a: 'Our founding leadership team brings deep technical expertise across enterprise software, data lakes, generative AI, and infrastructure management.'
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-gradient-to-b from-[#EFF6FF]/60 via-[#F8FAFC]/40 to-white border border-[#BFDBFE] rounded-2xl p-6 shadow-sm hover:border-[#2563EB] transition-all"
            >
              <h3 className="font-bold text-sm text-[#0F172A] mb-2">{item.q}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
