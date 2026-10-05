/**
 * SiteSettingsContext — Phase J
 *
 * Provides global site settings (general info, footer, social links, booking)
 * to the entire public website without prop drilling.
 *
 * Usage:
 *   const settings = useSiteSettings();
 *   settings.general.site_name
 *   settings.general.phone
 *   settings.socialLinks
 *   settings.loading
 *   settings.error
 */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getGeneralSettings, getFooterSettings, getPublicSocialLinks, getBookingSettings, getFormsSettings, extractObject, extractArray } from '../api/cms';

const SiteSettingsContext = createContext(null);

export function SiteSettingsProvider({ children }) {
  const [general, setGeneral] = useState(null);
  const [footer, setFooter] = useState(null);
  const [socialLinks, setSocialLinks] = useState([]);
  const [booking, setBooking] = useState(null);
  const [forms, setForms] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      try {
        const [generalRes, footerRes, socialRes, bookingRes, formsRes] = await Promise.allSettled([
          getGeneralSettings(),
          getFooterSettings(),
          getPublicSocialLinks(),
          getBookingSettings(),
          getFormsSettings()
        ]);

        if (!mounted) return;

        // General settings
        if (generalRes.status === 'fulfilled' && generalRes.value?.success) {
          setGeneral(extractObject(generalRes.value) || generalRes.value?.data || null);
        }

        // Footer settings
        if (footerRes.status === 'fulfilled' && footerRes.value?.success) {
          setFooter(extractObject(footerRes.value) || footerRes.value?.data || null);
        }

        // Social links
        if (socialRes.status === 'fulfilled' && socialRes.value?.success) {
          const arr = extractArray(socialRes.value);
          setSocialLinks(arr);
        }

        // Booking settings
        if (bookingRes.status === 'fulfilled' && bookingRes.value?.success) {
          setBooking(extractObject(bookingRes.value) || bookingRes.value?.data || null);
        }

        // Forms settings
        if (formsRes.status === 'fulfilled' && formsRes.value?.success) {
          setForms(extractObject(formsRes.value) || formsRes.value?.data || null);
        }

      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to load site settings');
          console.warn('[SiteSettings] Failed to load settings:', err.message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadSettings();
    return () => { mounted = false; };
  }, []);

  
  // Update Favicon & Site Title dynamically based on General Settings
  useEffect(() => {
    if (general?.favicon_url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = general.favicon_url;
    }
  }, [general?.favicon_url]);

  const value = {
    general,
    footer,
    socialLinks,
    booking,
    forms,
    loading,
    error,
    // Convenience accessors with fallbacks
    siteName: general?.site_name || 'WHY IT Services',
    phone: general?.phone || '',
    email: general?.email || '',
    address: general?.address || '',
    companyLegalName: general?.company_legal_name || 'WHY Services India Private Limited',
    tagline: general?.tagline || 'AI & Enterprise Software Engineering',
    mapsUrl: general?.google_maps_url || 'https://maps.app.goo.gl/TBWPpqZDwFBvMyF98',
    businessHours: general?.business_hours || '',
    missionStatement: general?.mission_statement || '',
    visionStatement: general?.vision_statement || '',
    footerTagline: footer?.tagline || 'Connecting enterprises with verified software engineering, AI-driven solutions, and dependable cloud digital platforms.',
    copyrightText: footer?.copyright_text || `© ${new Date().getFullYear()} WHY Services India Private Limited (WHY IT Services). All rights reserved.`,
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) {
    // Return safe defaults if used outside provider (e.g., in tests)
    return {
      general: null,
      footer: null,
      socialLinks: [],
      booking: null,
      forms: null,
      loading: false,
      error: null,
      siteName: 'WHY IT Services',
      phone: '',
      email: '',
      address: '',
      companyLegalName: 'WHY Services India Private Limited',
      tagline: 'AI & Enterprise Software Engineering',
      mapsUrl: 'https://maps.app.goo.gl/TBWPpqZDwFBvMyF98',
      businessHours: '',
      missionStatement: '',
      visionStatement: '',
      footerTagline: 'Connecting enterprises with verified software engineering, AI-driven solutions, and dependable cloud digital platforms.',
      copyrightText: `© ${new Date().getFullYear()} WHY Services India Private Limited (WHY IT Services). All rights reserved.`,
    };
  }
  return ctx;
}

export default SiteSettingsContext;
