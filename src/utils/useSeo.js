import { useEffect } from 'react';

/**
 * Custom hook to update document title, canonical link, meta tags, and JSON-LD structured data.
 */
export function useSeo({
  title,
  description,
  canonicalUrl,
  ogImage = 'https://althayyiboon.com/og-banner.png',
  ogType = 'website',
  jsonLd = null
} = {}) {
  useEffect(() => {
    const prevTitle = document.title;

    if (title) {
      document.title = title.includes('Al-ThayyiBoon') ? title : `${title} | Al-ThayyiBoon Matrimony`;
    }

    // Helper to set or create meta tag
    const setMetaTag = (attribute, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Description
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    // Titles in OG & Twitter
    if (title) {
      setMetaTag('property', 'og:title', title);
      setMetaTag('name', 'twitter:title', title);
    }

    // Canonical URL & OG URL
    const url = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : 'https://althayyiboon.com/');
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', url);
    setMetaTag('property', 'og:url', url);

    // Image
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage);
      setMetaTag('name', 'twitter:image', ogImage);
    }

    // Type
    if (ogType) {
      setMetaTag('property', 'og:type', ogType);
    }

    // JSON-LD
    const jsonLdString = jsonLd ? JSON.stringify(jsonLd) : '';
    let scriptEl = document.getElementById('dynamic-page-jsonld');
    if (jsonLdString) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'dynamic-page-jsonld';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = jsonLdString;
    } else if (scriptEl) {
      scriptEl.remove();
    }

    return () => {
      document.title = prevTitle;
      const dynScript = document.getElementById('dynamic-page-jsonld');
      if (dynScript) dynScript.remove();
    };
  }, [title, description, canonicalUrl, ogImage, ogType, jsonLd]);
}

export default useSeo;
