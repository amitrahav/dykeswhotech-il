import { HomeHero } from "../components/HomeHero";
import { AboutUsShort } from "../components/AboutUsShort";
import { Events } from "../components/Events";
import { Jobs } from "../components/Jobs";
import { Support } from "../components/Support";
import { Sponsors } from "../components/Sponsors";
import { SEO } from "../components/SEO";

export function Home() {
  return (
    <>
      <SEO 
        description="Dykes Who Tech is a premier professional ecosystem for LGBTQ+ women and non-binary people in tech. We host the Dykeathon, meetups, and provide a hub for innovation and community."
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Dykeathon - Dykes Who Tech",
          "url": "https://dykeathon.com/",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://dykeathon.com/events/dykeathon?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }}
      />
      <HomeHero />
      <div className="bg-pink-white-purple">
        <AboutUsShort />
        <Events />
      </div>
      <Jobs />
      <Support />
      <Sponsors />
    </>
  );
}
