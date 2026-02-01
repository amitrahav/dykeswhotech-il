import { Routes, Route } from "react-router-dom";
import { Navigation } from "./components/Navigation";
import { ContactUs } from "./components/ContactUs";
import { Home } from "./pages/Home";
import { About } from "./pages/About";

function App() {
  return (
    <main className="min-h-screen bg-pink-white">
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <ContactUs />
    </main>
  );
}

export default App;
