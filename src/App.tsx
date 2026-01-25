import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Events } from "./components/Events";
import { Jobs } from "./components/Jobs";
import { Support } from "./components/Support";

function App() {
  return (
    <main className="min-h-screen bg-pink-white">
      <Navigation />
      <Hero />
      <div className="bg-pink-white-purple">
        <About />
        <Events />
      </div>
      <Jobs />
      <Support />
    </main>
  );
}

export default App;
