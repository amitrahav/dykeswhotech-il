import { useEffect, useState } from "react";
import queen from "../assets/queen.png";
import { PageHero } from "../components/PageHero";
import { useContent } from "../contexts/ContentContext";

export function Sponsorship() {
    const { content } = useContent();
    const { hero } = content.sponsorship;
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
            {/* Hero Section & Content Wrapper */}
            <section className="relative w-full overflow-hidden flex-grow flex flex-col">
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
                        className="absolute top-[0%] right-[-20%] w-[100%] h-auto opacity-80"
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
                <div className="max-w-6xl mx-auto relative z-10 flex flex-col pb-32 px-6 md:px-16 lg:px-24 pt-12 md:pt-0">

                    {/* Join Our Proud Partners */}
                    <div className="w-full mb-24">
                        <span className="font-light tracking-widest text-white/70 text-sm mb-2 block uppercase font-montserrat">
                            {hero.badge}
                        </span>
                        <h1 className="text-3xl md:text-5xl font-bold mb-10 font-telaviv leading-tight uppercase text-white">
                            {hero.title}
                        </h1>

                        <div className="space-y-8 text-lg md:text-xl font-light text-white leading-relaxed">
                            {hero.description.map((text: string, i: number) => (
                                <p key={i}>{text}</p>
                            ))}
                        </div>
                    </div>

                    {/* Why Partner With Us */}
                    <div className="w-full mb-24">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 font-telaviv leading-tight uppercase text-white">
                            {content.sponsorship.whyPartner.title}
                        </h2>

                        <ul className="space-y-8">
                            {content.sponsorship.whyPartner.items.map((item: any, i: number) => (
                                <li key={i} className="flex items-start">
                                    <div className="w-2.5 h-2.5 mt-2 rounded-full bg-white/40 mr-6 flex-shrink-0"></div>
                                    <div className="flex flex-col text-white">
                                        <span className="font-bold text-white text-xl mb-1">{item.title}</span>
                                        <span className="text-white/90 text-lg font-light leading-relaxed">{item.text}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Ways to Collaborate */}
                    <div className="w-full mb-24">
                        <div className="mb-10">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 font-telaviv leading-tight uppercase text-white">
                                {content.sponsorship.collaboration.title}
                            </h2>
                            <p className="text-white/80 text-lg font-light font-montserrat">
                                {content.sponsorship.collaboration.subtitle}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {content.sponsorship.collaboration.items.map((item: any, i: number) => (
                                <div key={i} className="bg-white/10 backdrop-blur-sm p-8 rounded-lg border border-white/20 transition hover:bg-white/20 flex flex-col h-full">
                                    <h3 className="text-2xl font-bold text-white mb-3 font-telaviv uppercase">{item.title}</h3>
                                    <p className="text-white/90 text-lg font-light leading-relaxed">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom Impact */}
                    <div className="w-full">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 font-telaviv leading-tight uppercase text-white">
                            {content.sponsorship.customImpact.title}
                        </h2>
                        <div className="space-y-6 text-lg md:text-xl font-light text-white leading-relaxed">
                            {content.sponsorship.customImpact.text.map((paragraph: string, i: number) => (
                                <p key={i}>{paragraph}</p>
                            ))}
                        </div>
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