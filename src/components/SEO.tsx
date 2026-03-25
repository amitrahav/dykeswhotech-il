import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  jsonLd?: object | object[];
}

export function SEO({ title, description, jsonLd }: SEOProps) {
  const baseTitle = "Dykeathon - Dykes Who Tech";
  const fullTitle = title ? `${title} | ${baseTitle}` : baseTitle;

  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);

  useEffect(() => {
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
      // Also update og:description and twitter:description
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) ogDescription.setAttribute('content', description);
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) twitterDescription.setAttribute('content', description);
    }
  }, [description]);

  useEffect(() => {
    if (jsonLd) {
      const jsonLdArray = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      const scripts: HTMLScriptElement[] = [];

      jsonLdArray.forEach((data) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(data);
        document.head.appendChild(script);
        scripts.push(script);
      });

      return () => {
        scripts.forEach((script) => {
          document.head.removeChild(script);
        });
      };
    }
  }, [jsonLd]);

  return null;
}
