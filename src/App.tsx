import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { Events } from "./components/Events";
import { Jobs } from "./components/Jobs";
import { Support } from "./components/Support";

function App() {
  return (
    <main className="min-h-screen bg-pink-white">
      <Navigation />
      <Hero />
      <Events />
      <Jobs />
      <Support />
    </main>
  );
}

export default App;
