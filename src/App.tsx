import { Routes, Route, useLocation } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { ContactUs } from "./components/ContactUs";
import { ScrollToTop } from "./components/ScrollToTop";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Sponsorship } from "./pages/Sponsorship";

import { ContentProvider } from "./contexts/ContentContext";

function App() {
  const location = useLocation();
  const isSponsorshipPage = location.pathname === "/sponsorship";

  return (
    <ContentProvider>
      <ScrollToTop />
      <main className="min-h-screen bg-pink-white">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sponsorship" element={<Sponsorship />} />
        </Routes>
        {!isSponsorshipPage && <ContactUs />}
      </main>
    </ContentProvider>
  );
}

export default App;
