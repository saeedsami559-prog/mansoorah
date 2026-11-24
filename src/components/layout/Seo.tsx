import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../../config/site';
import { useI18n } from '../../i18n';

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang ? `link[rel="${rel}"][hreflang="${hreflang}"]` : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector<HTMLLinkElement>(selector);
  if (!el) {
    el = document.createElement('link');
    el.rel = rel;
    if (hreflang) el.hreflang = hreflang;
    document.head.appendChild(el);
  }
  el.href = href;
}

/** Per-route title, description, canonical, hreflang, Open Graph/Twitter and optional JSON-LD. */
export function Seo({
  title,
  description,
  jsonLd,
  noindex = false,
}: {
  title: string;
  description: string;
  jsonLd?: object | object[];
  noindex?: boolean;
}) {
  const { lang } = useI18n();
  const { pathname } = useLocation();
  useEffect(() => {
    const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
    document.title = title;
    setMeta('name', 'description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:locale', lang === 'ar' ? 'ar_OM' : 'en_US');
    setMeta('property', 'og:locale:alternate', lang === 'ar' ? 'en_US' : 'ar_OM');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setLink('canonical', lang === 'ar' ? `${url}?lang=ar` : url);
    setLink('alternate', url, 'en');
    setLink('alternate', `${url}?lang=ar`, 'ar');
    setLink('alternate', url, 'x-default');

    document.head.querySelectorAll('script[data-seo-jsonld]').forEach((s) => s.remove());
    if (jsonLd) {
      const s = document.createElement('script');
      s.type = 'application/ld+json';
      s.dataset.seoJsonld = '';
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }, [title, description, jsonLd, noindex, lang, pathname]);
  return null;
}
