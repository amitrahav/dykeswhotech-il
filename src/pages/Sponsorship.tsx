import { useEffect, useState, useRef } from "react";
import queen from "../assets/queen.png";
import queenGlitch from "../assets/queen-glitch.png";
import { PageHero } from "../components/PageHero";
import { useContent } from "../contexts/ContentContext";
import { TierModal } from "../components/TierModal";

// Tier card glassmorphism style (matching Figma exactly)
const glassBg: React.CSSProperties = {
    backgroundImage:
        "linear-gradient(rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 100%), linear-gradient(90deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.5) 100%)",
    backdropFilter: "blur(2px)",
    WebkitBackdropFilter: "blur(2px)",
};

export function Sponsorship() {
    const { content } = useContent();
    const { hero, whyJoin, engagementOpportunities, customImpact } = content.sponsorship;
    const [offset, setOffset] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const [selectedTier, setSelectedTier] = useState<{ name: string; price: string } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const crownRef = useRef<HTMLImageElement>(null);
    const [crownHeight, setCrownHeight] = useState(0);
    const [isGlitching, setIsGlitching] = useState(false);
    const glitchEnabaled = useRef(false);

    // Random glitch effect logic
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const scheduleGlitch = () => {
            // Random time between 2 to 6 seconds until next glitch
            const nextGlitchTime = Math.random() * 4000 + 2000;

            timeoutId = setTimeout(() => {
                setIsGlitching(true);

                // Glitch lasts between 50ms and 150ms
                const glitchDuration = Math.random() * 100 + 50;

                setTimeout(() => {
                    setIsGlitching(false);
                    scheduleGlitch(); // Schedule the next one after returning to normal
                }, glitchDuration);

            }, nextGlitchTime);
        };
        console.log(glitchEnabaled.current)
        if (glitchEnabaled.current) {
            scheduleGlitch(); // Start the loop
        }

        return () => clearTimeout(timeoutId); // Cleanup on unmount
    }, []);

    useEffect(() => {
        const handleScroll = () => setOffset(window.pageYOffset);
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (crownRef.current) {
                setCrownHeight(crownRef.current.clientHeight);
            }
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

    // Calculate parallax movement
    const containerHeight = containerRef.current?.clientHeight || 0;
    const windowHeight = typeof window !== 'undefined' ? window.innerHeight : 0;

    // The total distance the page can scroll
    const maxScroll = Math.max(0, document.body.scrollHeight - windowHeight);

    // Progress from 0 (top) to 1 (bottom)
    const scrollProgress = maxScroll > 0 ? Math.min(1, Math.max(0, offset / maxScroll)) : 0;

    // Start at windowHeight * 0.9 (bottom view - 10%)
    const startY = windowHeight * 0.9;

    // End at bottom of container
    const endY = containerHeight - crownHeight;

    // Interpolate
    const currentY = startY + (endY - startY) * scrollProgress;

    return (
        <div className="w-full bg-[#8D6BE4] relative overflow-hidden flex flex-col min-h-screen">
            <section ref={containerRef} className="relative w-full overflow-hidden flex-grow flex flex-col">

                {/* Large Background Title */}
                <PageHero title={hero.title} />

                {/* Pink Haze Animated Background */}
                <div
                    className="absolute inset-0 z-[5] pointer-events-none"
                    style={{
                        transform: isMobile ? "none" : `translate(${mousePos.x}px, ${mousePos.y}px)`,
                        transition: "transform 0.4s ease-out",
                    }}
                >
                    <svg
                        className="absolute top-[0%] right-[-20%] w-[100%] h-auto opacity-80"
                        viewBox="0 0 2873 3097"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{ filter: "blur(100px)" }}
                    >
                        <path
                            d="M930.071 1238.36C93.7699 1411.76 276.589 2228.42 287.335 2328.24C1114.35 2752.21 2797.22 1995.84 2593.5 792.643C2389.79 -410.558 1526.38 -213.889 1544.79 173.319C1563.2 560.528 1766.37 1064.96 930.071 1238.36Z"
                            fill="#FFE0F5"
                        />
                    </svg>
                </div>

                {/* Main Content */}
                <div className="w-full max-w-[1920px] mx-auto relative z-10 flex flex-col pb-32 px-6 md:px-16 lg:px-24 xl:px-[calc(8.33%+79px)] pt-4 md:pt-0">

                    {/* ── Hero Content ── */}
                    <div className="w-full mb-20 max-w-[1160px]">
                        {/* Badge */}
                        <span className="font-heading font-normal tracking-widest text-white/90 text-sm md:text-base mb-3 block uppercase">
                            {hero.badge}
                        </span>

                        {/* Main Heading */}
                        <h1 className="font-telaviv font-normal text-[clamp(2rem,4.5vw,3.25rem)] uppercase text-white leading-[1.05] mb-8 whitespace-pre-line">
                            {hero.heading.replace(/ (?=CONNECT|DRIVE)/g, "\n")}
                        </h1>

                        {/* Description — matches Figma mixed-weight paragraph */}
                        <p className="text-white text-[clamp(1rem,1.8vw,1.3rem)] font-light font-sans leading-[1.55] mb-10">
                            <span className="font-bold">DykesWhoTech</span>
                            {" is a premier professional ecosystem of "}
                            <span className="font-black">over 400 </span>
                            <span className="font-bold">LGBTQ+ women in tech</span>
                            <span className="font-black">.</span>
                            {" We bridge the gap between top-tier talent and the industry's leading organizations. With dozens of successful high-impact projects, we are more than a community, we are a grassroots movement building real-world tools and fostering the next generation of tech leadership."}
                        </p>

                        {/* CTA — scrolls smoothly to tiers section */}
                        <button
                            className="bg-[#c8aef4] text-white font-heading font-extrabold px-8 py-3 rounded-full text-sm uppercase tracking-wider hover:bg-[#b99af0] transition-colors cursor-pointer"
                            onClick={() => document.getElementById("partnership-tiers")?.scrollIntoView({ behavior: "smooth" })}
                        >
                            {hero.cta}
                        </button>
                    </div>

                    {/* ── Why Join Our Mission ── */}
                    <div className="w-full mb-20 max-w-[1160px]">
                        <h2 className="font-telaviv font-normal text-[clamp(2rem,4vw,3.25rem)] uppercase text-white leading-[1.1] mb-6">
                            {whyJoin.title}
                        </h2>
                        <p className="text-white/90 text-[clamp(1rem,1.8vw,1.3rem)] font-light font-sans leading-[1.55] mb-10">
                            {whyJoin.intro}
                        </p>
                        <ul className="space-y-8">
                            {whyJoin.items.map((item: any, i: number) => (
                                <li key={i} className="flex items-start font-sans text-white text-[clamp(1rem,1.8vw,1.3rem)] leading-[1.55]">
                                    <span className="mt-2 mr-4 flex-shrink-0 w-2 h-2 rounded-full bg-white/60 inline-block" />
                                    <div>
                                        <span className="font-bold">{item.title} :</span>
                                        <br />
                                        <span className="font-light text-white/90">{item.text}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* ── Engagement Opportunities ── */}
                    <div className="w-full mb-8 max-w-[1320px]">
                        {/* Badge + Title */}
                        <span className="font-heading font-normal tracking-widest text-white/90 text-sm md:text-base mb-3 block uppercase">
                            {engagementOpportunities.badge}
                        </span>
                        <h2 className="font-telaviv font-normal text-[clamp(2rem,4vw,3.25rem)] uppercase text-white leading-[1.1] mb-8 max-w-[1160px]">
                            {engagementOpportunities.title}
                        </h2>

                        {/* Subtitle */}
                        <p className="text-white/90 text-[clamp(1rem,1.8vw,1.3rem)] font-heading font-normal mb-6">
                            {engagementOpportunities.subtitle}
                        </p>

                        {/* Included items (bullet list) */}
                        <ul className="space-y-6 mb-14 max-w-[1160px]">
                            {engagementOpportunities.includedItems.map((item: any, i: number) => (
                                <li key={i} className="flex items-start font-sans text-white text-[clamp(1rem,1.8vw,1.3rem)] leading-[1.55]">
                                    <span className="mt-2 mr-4 flex-shrink-0 w-2 h-2 rounded-full bg-white/60 inline-block" />
                                    <div>
                                        <span className="font-bold">{item.title} :</span>
                                        <br />
                                        <span className="font-light text-white/90">{item.text}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        {/* ── Tier Cards ── */}
                        <div id="partnership-tiers" className="grid grid-cols-1 lg:grid-cols-3 gap-7 mb-7">
                            {engagementOpportunities.tiers.map((tier: any, i: number) => (
                                <div
                                    key={i}
                                    className="border-4 border-white rounded-[40px] flex flex-col items-center px-10 py-10"
                                    style={glassBg}
                                >
                                    {/* Content grows to fill card height, keeping button at a fixed distance from bottom */}
                                    <div className="flex flex-col gap-7 items-start w-full flex-grow">
                                        {/* Price + Name */}
                                        <div className="flex flex-col gap-5 w-full">
                                            <p className="font-heading font-black text-[clamp(1.8rem,3vw,2.6rem)] text-[#8a5cf5] leading-[1.3]">
                                                {tier.price}
                                            </p>
                                            <p className="font-heading font-bold text-[clamp(1.1rem,1.6vw,1.4rem)] text-[#8a5cf5] leading-snug">
                                                {tier.name}
                                            </p>
                                        </div>

                                        {/* The Value */}
                                        <div className="text-[#8a5cf5] text-sm w-full">
                                            <p>
                                                <span className="font-heading font-bold">The Value:</span>
                                                <br />
                                                <span className="font-heading font-medium">{tier.value}</span>
                                            </p>
                                        </div>

                                        {/* Features */}
                                        <div className="flex flex-col gap-4 w-full text-[#8a5cf5] text-sm">
                                            {tier.features.map((feature: any, j: number) => (
                                                <p key={j}>
                                                    <span className="font-heading font-bold">{feature.title}:</span>
                                                    <br />
                                                    <span className="font-heading font-medium">{feature.text}</span>
                                                </p>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA Button — fixed pt-10 gap, content above absorbs extra height */}
                                    <div className="pt-10 w-full flex justify-center flex-shrink-0">
                                        <button
                                            className="bg-[#8a5cf5] text-white font-heading font-bold px-12 py-3 rounded-full text-sm hover:bg-[#7c4ef0] transition-colors cursor-pointer"
                                            onClick={() => setSelectedTier({ name: tier.name, price: tier.price })}
                                        >
                                            {tier.cta}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Custom Impact Wide Card ── */}
                        <div
                            className="border-4 border-white rounded-[40px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 px-10 md:px-16 py-10"
                            style={glassBg}
                        >
                            <div className="flex-1 flex flex-col gap-4">
                                <p className="font-heading font-black text-[clamp(1.4rem,2.5vw,2rem)] text-[#8a5cf5] leading-[1.3]">
                                    {customImpact.title}
                                </p>
                                <div className="text-[#8a5cf5] text-sm">
                                    <p className="font-heading font-bold text-[clamp(1rem,1.5vw,1.2rem)] mb-2">
                                        {customImpact.subtitle}
                                    </p>
                                    {customImpact.text.map((paragraph: string, i: number) => (
                                        <p key={i} className="font-heading font-medium max-w-[636px] leading-relaxed text-sm md:text-[0.95rem]">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-shrink-0">
                                <button
                                    className="bg-[#8a5cf5] text-white font-heading font-bold px-12 py-3 rounded-full text-sm hover:bg-[#7c4ef0] transition-colors cursor-pointer whitespace-nowrap"
                                    onClick={() => setSelectedTier({ name: customImpact.title, price: "Custom" })}
                                >
                                    {customImpact.cta}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tier modal */}
                {selectedTier && (
                    <TierModal tier={selectedTier} onClose={() => setSelectedTier(null)} />
                )}

                {/* Queen parallax image wrapper */}
                <div
                    className="absolute inset-x-0 top-0 w-full pointer-events-none mix-blend-screen flex justify-center"
                    style={{
                        zIndex: 0,
                        transform: `translateY(${currentY}px)`,
                        willChange: "transform",
                    }}
                >
                    <img
                        ref={crownRef}
                        src={isGlitching ? queenGlitch : queen}
                        alt="Crown Background"
                        onLoad={(e) => setCrownHeight(e.currentTarget.clientHeight)}
                        className="w-[90%] md:w-[calc(100vw-120px)] h-auto"
                        style={{
                            filter: "brightness(100)",
                            opacity: isGlitching ? 0.02 : 0.05,
                        }}
                    />
                </div>
            </section>
        </div>
    );
}
