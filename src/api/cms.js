/**
 * PUBLIC CMS DATA LAYER — Phase J & K
 *
 * All public-facing CMS data fetching functions.
 * Uses the shared apiRequest() from client.js which reads VITE_API_BASE_URL.
 * No localhost hardcodes. All calls are environment-aware.
 */
import { apiRequest } from './client';

// ─────────────────────────────────────────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────────────────────────────────────────

/** Fetch all public site settings (all groups in one call) */
export async function getPublicSettings() {
  return apiRequest('/api/v1/public/settings');
}

/** Fetch a specific settings group */
export async function getPublicSettingsGroup(key) {
  return apiRequest(`/api/v1/public/settings/${encodeURIComponent(key)}`);
}

export async function getGeneralSettings() {
  return getPublicSettingsGroup('general');
}

export async function getFooterSettings() {
  return getPublicSettingsGroup('footer');
}

export async function getGlobalSeoSettings() {
  return getPublicSettingsGroup('seo');
}

export async function getFormsSettings() {
  return getPublicSettingsGroup('forms');
}

export async function getBookingSettings() {
  return getPublicSettingsGroup('booking');
}

export async function getCookieBannerSettings() {
  return getPublicSettingsGroup('cookie_banner');
}

export async function getEventSettings() {
  return getPublicSettingsGroup('event_settings');
}

// ─────────────────────────────────────────────────────────────────────────────
// ANNOUNCEMENT
// ─────────────────────────────────────────────────────────────────────────────

export async function getPublicAnnouncement() {
  return apiRequest('/api/v1/public/announcement');
}

// ─────────────────────────────────────────────────────────────────────────────
// NAVIGATION
// ─────────────────────────────────────────────────────────────────────────────

export async function getHeaderNavigation() {
  return apiRequest('/api/v1/public/navigation/header');
}

export async function getFooterNavigation() {
  return apiRequest('/api/v1/public/navigation/footer');
}

// ─────────────────────────────────────────────────────────────────────────────
// SERVICES & DOMAINS
// ─────────────────────────────────────────────────────────────────────────────

export async function getPublicServices() {
  return apiRequest('/api/v1/public/services');
}

export async function getPublicServiceBySlug(slug) {
  return apiRequest(`/api/v1/public/services/${encodeURIComponent(slug)}`);
}

export async function getPublicDomains() {
  return apiRequest('/api/v1/public/domains');
}

export async function getPublicDomainBySlug(slug) {
  return apiRequest(`/api/v1/public/domains/${encodeURIComponent(slug)}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// CONTENT MODULES (TESTIMONIALS, CASE STUDIES, NEWS, FAQS)
// ─────────────────────────────────────────────────────────────────────────────

export async function getPublicTestimonials() {
  return apiRequest('/api/v1/public/testimonials');
}

export async function getPublicCaseStudies() {
  return apiRequest('/api/v1/public/case-studies');
}

export async function getPublicCaseStudyBySlug(slug) {
  return apiRequest(`/api/v1/public/case-studies/${encodeURIComponent(slug)}`);
}

export async function getPublicNews() {
  return apiRequest('/api/v1/public/news');
}

export async function getPublicNewsBySlug(slug) {
  return apiRequest(`/api/v1/public/news/${encodeURIComponent(slug)}`);
}

export async function getPublicFaqs() {
  return apiRequest('/api/v1/public/faqs');
}

export async function getPublicLeadership() {
  return apiRequest('/api/v1/public/leadership');
}

export async function getPublicJobOpenings(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = `/api/v1/public/jobs${query ? `?${query}` : ''}`;
  return apiRequest(endpoint);
}

export async function getPublicSocialLinks() {
  return apiRequest('/api/v1/public/social-links');
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGES SEO
// ─────────────────────────────────────────────────────────────────────────────

export async function getPageSeo(routePath) {
  return apiRequest(`/api/v1/public/seo/page?route=${encodeURIComponent(routePath)}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGES CMS (Phase K)
// ─────────────────────────────────────────────────────────────────────────────
export async function getPublicPageBySlug(slug) {
  return apiRequest(`/api/v1/public/pages/${encodeURIComponent(slug)}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Safely extract an array from API response data.
 * Returns empty array on null/undefined/error.
 */
export function extractArray(response, key = 'data') {
  if (!response || !response.success) return [];
  const val = response[key];
  return Array.isArray(val) ? val : (val && Array.isArray(val.data) ? val.data : []);
}

/**
 * Safely extract a single object from API response data.
 * Returns null on null/undefined/error.
 */
export function extractObject(response, key = 'data') {
  if (!response || !response.success) return null;
  const val = response[key];
  return val && typeof val === 'object' && !Array.isArray(val) ? val : null;
}
export async function getHomepageSections() { return apiRequest('/api/v1/public/homepage-sections'); }
export async function getPartnerItems() { return apiRequest('/api/v1/public/partner-items'); }
export async function getTechItems() { return apiRequest('/api/v1/public/tech-items'); }
