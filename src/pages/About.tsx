import { useEffect, useState } from "react";
import greekStatue from "../assets/greek.png";
import pinkSquares from "../assets/pink-squares.png";
import classics from "../assets/classics.png";
import omg from "../assets/omg.png";
import queen from "../assets/queen.png";
import { PageHero } from "../components/PageHero";
import { useContent } from "../contexts/ContentContext";

export function About() {
  const { content } = useContent();
  const { hero, mission, vision, team } = content.about;
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setOffset(window.pageYOffset);
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="w-full bg-[#FFE0F5] relative overflow-hidden flex flex-col">
      <style>{`
                @keyframes drawLine {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
                .hero-text-outline {
                    -webkit-text-stroke: 1px #FFE0F5;
                    color: transparent;
                }
            `}</style>

      {/* Hero Section */}
      <section className="relative w-full bg-pink overflow-hidden min-h-[600px] md:min-h-[800px]">
        {/* Large Background Text extracted to component */}
        <PageHero />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-start justify-between pt-40 pb-20 px-6 md:px-16 lg:px-24">
          <div className="w-full md:w-3/5 mt-10">
            <span className="font-light tracking-widest text-sm mb-0 block">{hero.badge}</span>
            <h1 className="text-3xl md:text-5xl font-bold mb-8 font-telaviv leading-tight">
              {hero.title}
            </h1>

            <div className="space-y-8 text-lg md:text-xl font-light text-gray-800 leading-relaxed md:pr-12">
              {hero.description.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
            </div>
          </div>

          {/* Parallax Statue */}
          <div className="w-full md:w-2/5 mt-12 md:mt-20 relative flex justify-center items-center">
            <div className="relative w-full max-w-[300px] md:max-w-none">
              {/* Decorative blob behind statue */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full opacity-40 blur-3xl pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, #FFE0F5 0%, #D8B4FE 100%)',
                  transform: `translate(${-50 - (isMobile ? 0 : offset * 0.03)}%, ${-50 - (isMobile ? 0 : offset * 0.02)}%)`
                }}
              ></div>

              <img
                src={greekStatue}
                alt="Greek Statue"
                className="relative z-10 w-full h-auto drop-shadow-2xl"
                style={{
                  transform: isMobile ? 'none' : `translateY(${offset * 0.22}px) rotate(${offset * 0.015}deg) scaleX(-1)`
                }}
              />
            </div>
          </div>
        </div>
        {/* Background image affixed to bottom with screen blend mode */}
        <div
          className="absolute inset-x-0 bottom-0 w-full h-[120%] pointer-events-none z-0 mix-blend-screen opacity-40"
          style={{
            filter: 'brightness(100)',
            backgroundImage: `url(${omg})`,
            // backgroundSize: 'auto 100%',
            backgroundPosition: 'center 0',
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'screen'
          }}
        ></div>
      </section>

      {/* Mission & Vision Section with SVG Grid */}
      <section className="relative w-full py-32 px-6 md:px-16 lg:px-24 bg-white border-t border-gray-100 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <NotebookGrid delay={0.2} opacity={0.9} />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Mission Section */}
          <div className="flex flex-col md:flex-row items-center mb-40 gap-16 md:gap-24">
            <div className="w-full md:w-1/3 flex justify-center">
              {/* Plus icon made of squares - Matches the purple-gradient squares in the design */}
              {/* Pink squares image refined */}
              <div className="relative w-64 h-64 flex items-center justify-center">
                <img src={pinkSquares} alt="Plus" className="w-full h-auto opacity-90 drop-shadow-xl" />
              </div>
            </div>
            <div className="w-full md:w-2/3">

              <span className="font-light tracking-widest text-sm mb-0 block">{mission.badge}</span>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 font-telaviv leading-tight">
                {mission.title}
              </h2>
              <div className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10 font-light whitespace-pre-line">
                {mission.description}
              </div>
              <ul className="space-y-6">
                {mission.items.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-2 h-2 mt-2.5 rounded-full bg-purple-400 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-800">{item.title}:</span>{" "}
                      <span className="text-gray-600 font-light">{item.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Vision Section */}
          <div className="flex flex-col md:flex-row items-start gap-16 md:gap-24">
            <div className="hidden md:block md:w-1/3"></div>
            <div className="w-full md:w-2/3">

              <span className="font-light tracking-widest text-sm mb-0 block ">{vision.badge}</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 font-telaviv leading-tight">
                {vision.title}
              </h2>
              <div className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10 font-light whitespace-pre-line">
                {vision.description}
              </div>
              <ul className="space-y-6">
                {vision.items.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-2 h-2 mt-2.5 rounded-full bg-purple-400 mr-4 flex-shrink-0"></div>
                    <div>
                      <span className="font-bold text-gray-800">{item.title}:</span>{" "}
                      <span className="text-gray-600 font-light">{item.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="relative w-full py-32 px-6 md:px-16 lg:px-24 bg-[#FFE0F5] overflow-hidden">
        {/* Background decorative images - Grayscale statue assets */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] overflow-hidden">
          <img src={queen} alt="" className="absolute -top-20 -left-40 w-[800px] h-auto grayscale blur-[4px] rotate-[-10deg]" />
          <img src={omg} alt="" className="absolute top-1/2 -right-20 w-[600px] h-auto grayscale blur-[2px] opacity-50" />
          <img src={classics} alt="classics" className="absolute -bottom-20 left-1/4 w-[900px] h-auto grayscale blur-[6px] rotate-[5deg]" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-left mb-20">
            <span className="font-light tracking-widest text-sm mb-0 block">{team.badge}</span>
            <h2 className="text-4xl md:text-6xl font-bold font-regular font-telaviv leading-tight">
              {team.title}
            </h2>
          </div>

          {/* Team Grid with blue card placeholders */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="group aspect-square p-2 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-full h-full bg-[#7389F4]/80 group-hover:bg-[#7389F4] rounded-lg transition-colors"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

const NotebookGrid = ({ delay = 0, opacity = 0.2 }: { delay?: number; opacity?: number }) => {
  const squareSize = 40;
  const width = 2000;
  const height = 1500;

  const horizontalLines = Math.ceil(height / squareSize) + 1;
  const verticalLines = Math.ceil(width / squareSize) + 1;

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
      style={{ zIndex: 0 }}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: horizontalLines }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * squareSize}
          x2={width}
          y2={i * squareSize}
          stroke={`#90EE90`}
          strokeWidth="0.5"
          strokeOpacity={opacity}
          style={{
            strokeDasharray: width,
            strokeDashoffset: width,
            animation: `drawLine 2s ease-out ${delay + i * 0.04}s forwards`
          }}
        />
      ))}
      {Array.from({ length: verticalLines }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * squareSize}
          y1="0"
          x2={i * squareSize}
          y2={height}
          stroke={`#90EE90`}
          strokeWidth="0.5"
          strokeOpacity={opacity}
          style={{
            strokeDasharray: height,
            strokeDashoffset: height,
            animation: `drawLine 2.5s ease-out ${delay + i * 0.04}s forwards`
          }}
        />
      ))}
    </svg>
  );
};
