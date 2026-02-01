import { Hero } from "../components/Hero";
import { AboutUsShort } from "../components/AboutUsShort";
import { Events } from "../components/Events";
import { Jobs } from "../components/Jobs";
import { Support } from "../components/Support";
import { Sponsors } from "../components/Sponsors";

export function Home() {
  return (
    <>
      <Hero />
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
