import { useEffect, useState } from "react";
import queen from "../assets/queen.png";
import { PageHero } from "../components/PageHero";
import { useContent } from "../contexts/ContentContext";

export function Sponsorship() {
    const { content } = useContent();
    const { hero, allocation } = content.sponsorship;
    const [offset, setOffset] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.pageYOffset);
        };
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        const handleMouseMove = (e: MouseEvent) => {
            if (!isMobile) {
                setMousePos({
                    x: (e.clientX / window.innerWidth - 0.5) * 60,
                    y: (e.clientY / window.innerHeight - 0.5) * 60,
                });
            }
        };

        window.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);
        handleResize();

        return () => {
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, [isMobile]);

    return (
        <div className="w-full bg-[#8D6BE4] relative overflow-hidden flex flex-col min-h-screen">
            <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -30px) scale(1.1); }
        }
        .animate-pink-haze {
          animation: float 20s ease-in-out infinite;
        }
        .hero-text-outline {
          -webkit-text-stroke: 1px #8D6BE4;
          color: transparent;
        }
      `}</style>

            {/* Hero Section & Content Wrapper */}
            <section className="relative w-full overflow-hidden flex-grow flex flex-col pt-12">
                {/* Large Background Text */}
                <PageHero title={hero.title} />

                {/* Pink Haze Animated Background - Reactive and gentle */}
                <div
                    className="absolute inset-0 z-5 pointer-events-none"
                    style={{
                        transform: isMobile ? 'none' : `translate(${mousePos.x}px, ${mousePos.y}px)`,
                        transition: 'transform 0.4s ease-out'
                    }}
                >
                    <svg
                        className="absolute top-[0%] right-[-20%] w-[100%] h-auto opacity-80 animate-pink-haze"
                        viewBox="0 0 2873 3097"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ filter: 'blur(100px)' }}
                    >
                        <path
                            d="M930.071 1238.36C93.7699 1411.76 276.589 2228.42 287.335 2328.24C1114.35 2752.21 2797.22 1995.84 2593.5 792.643C2389.79 -410.558 1526.38 -213.889 1544.79 173.319C1563.2 560.528 1766.37 1064.96 930.071 1238.36Z"
                            fill="#FFE0F5"
                        />
                    </svg>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto relative z-10 flex flex-col pt-40 pb-32 px-6 md:px-16 lg:px-24">

                    {/* Join Our Proud Partners */}
                    <div className="w-full mb-24">
                        <span className="font-light tracking-widest text-white/70 text-sm mb-2 block uppercase font-montserrat">
                            {hero.badge}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold mb-10 font-telaviv leading-tight uppercase text-white">
                            {hero.title}
                        </h1>

                        <div className="space-y-8 text-lg md:text-xl font-light text-white leading-relaxed">
                            {hero.description.map((text, i) => (
                                <p key={i}>{text}</p>
                            ))}
                        </div>
                    </div>

                    {/* Allocation Section */}
                    <div className="w-full">
                        <span className="font-light tracking-widest text-white/70 text-sm mb-2 block uppercase font-montserrat">
                            {allocation.badge}
                        </span>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 font-telaviv leading-tight uppercase text-white">
                            {allocation.title}
                        </h2>

                        <ul className="space-y-8">
                            {allocation.items.map((item, i) => (
                                <li key={i} className="flex items-start">
                                    <div className="w-2.5 h-2.5 mt-2 rounded-full bg-white/40 mr-6 flex-shrink-0"></div>
                                    <div className="flex flex-col text-white">
                                        <span className="font-bold text-white text-xl mb-1">{item.title}:</span>
                                        <span className="text-white/90 text-lg font-light leading-relaxed">{item.text}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Queen background image - handled like omg.png on About section */}
                <div
                    className="absolute inset-x-0 bottom-0 w-full h-[100%] pointer-events-none z-0 mix-blend-screen"
                    style={{
                        filter: 'brightness(100)',
                        opacity: 0.5,
                        backgroundImage: `url(${queen})`,
                        backgroundPosition: isMobile ? 'center center' : 'center bottom',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '100% auto',
                        backgroundBlendMode: 'screen',
                        transform: isMobile ? 'none' : `translateY(${offset * 0.15}px)`
                    }}
                ></div>
            </section>
        </div>
    );
}