import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { usePostHog } from "posthog-js/react";
import { Navigation } from "./components/Navigation";
import { ContactUs } from "./components/ContactUs";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Sponsorship } from "./pages/Sponsorship";

import { ContentProvider } from "./contexts/ContentContext";

import { EventArchive } from "./pages/Events/[event]";
import { EventDetail } from "./pages/Events/EventDetail";

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.capture("$pageview");
  }, [location, posthog]);

  return (
    <ContentProvider>
      <ScrollToTop />
      <main className="min-h-screen">
        {isHomePage && <Navigation empty />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sponsorship" element={<Sponsorship />} />
          <Route path="/events/:event" element={<EventArchive />} />
          <Route path="/events/:event/:eventId" element={<EventDetail />} />
        </Routes>
        <ContactUs />
        <Footer />
      </main>
    </ContentProvider>
  );
}

export default App;
