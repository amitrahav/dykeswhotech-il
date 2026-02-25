import { useParams, Link } from "react-router-dom";
import { useContent } from "../../contexts/ContentContext";
import { PageHero } from "../../components/PageHero";
import { Button } from "../../components/ui/button";
import { useEffect, useRef, useState } from "react";
import xoxo from "../../assets/xoxo.png";
import queenGlitch from "../../assets/queen-glitch.png";

// ────────────────────────────────────────────────────────────────
// Notebook grid lines (reused from other pages)
// ────────────────────────────────────────────────────────────────
const NotebookGrid = ({ color = "rgba(144, 238, 144, 0.15)" }: { color?: string }) => {
    const squareSize = 40;
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const observer = new ResizeObserver((entries) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        });
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const { width, height } = dimensions;
    const hLines = height > 0 ? Math.ceil(height / squareSize) + 1 : 0;
    const vLines = width > 0 ? Math.ceil(width / squareSize) + 1 : 0;

    return (
        <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" fill="none">
                {Array.from({ length: hLines }).map((_, i) => (
                    <line key={`h-${i}`} x1="0" y1={i * squareSize} x2={width} y2={i * squareSize}
                        stroke={color} strokeWidth="0.9" style={{ opacity: 0, animation: `fadeIn 1.5s ease-out ${i * 0.04}s forwards` }} />
                ))}
                {Array.from({ length: vLines }).map((_, i) => (
                    <line key={`v-${i}`} x1={i * squareSize} y1="0" x2={i * squareSize} y2={height}
                        stroke={color} strokeWidth="0.9" style={{ strokeDasharray: height, strokeDashoffset: height, animation: `drawLine 1.5s ease-out ${i * 0.04}s forwards` }} />
                ))}
            </svg>
        </div>
    );
};

// ────────────────────────────────────────────────────────────────
// Tally form loader hook
// ────────────────────────────────────────────────────────────────
function useTallyEmbed(tallyId?: string) {
    useEffect(() => {
        if (!tallyId) return;
        const d = document;
        const w = "https://tally.so/widgets/embed.js";
        const v = () => {
            // @ts-ignore
            if (typeof Tally !== "undefined") { // @ts-ignore
                Tally.loadEmbeds();
            } else {
                d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((e) => {
                    // @ts-ignore
                    e.src = e.dataset.tallySrc;
                });
            }
        };
        // @ts-ignore
        if (typeof Tally !== "undefined") { v(); }
        else if (!d.querySelector(`script[src="${w}"]`)) {
            const s = d.createElement("script");
            s.src = w; s.onload = v; s.onerror = v;
            d.body.appendChild(s);
        }
    }, [tallyId]);
}

// ────────────────────────────────────────────────────────────────
// Main component
// ────────────────────────────────────────────────────────────────
export function EventDetail() {
    const { event, eventId } = useParams<{ event: string; eventId: string }>();
    const { content } = useContent();
    const { events: eventsContent } = content;

    // Find the single event from JSON
    const singleEvent = (eventsContent as any).singleEvents?.find(
        (e: any) => e.typeId === event && e.id === eventId
    );

    useTallyEmbed(singleEvent?.tallyId);

    if (!singleEvent) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFE0F5] gap-6">
                <h1 className="text-4xl font-telaviv text-[#293744]">Event not found</h1>
                <Link to={`/events/${event}`}>
                    <Button className="bg-primary text-white px-8 py-4 rounded-2xl text-lg">← Back to events</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#FFE0F5] min-h-screen relative overflow-hidden">

            {/* ── Purple haze background blob ── */}
            <div className="absolute top-[-10%] left-[-10%] w-full h-[120%] pointer-events-none z-0">
                <svg width="100%" height="100%" viewBox="0 0 1902 1402" fill="none" className="opacity-30">
                    <g filter="url(#phBlur)">
                        <path d="M898.032 630.059C1442.67 810.035 1610.58 273.655 1637.85 211.986C1299.21 -312.317 66.4157 -437.506 -219.134 330.715C-504.684 1098.94 63.5348 1274.48 182.852 1043.09C302.17 811.695 353.39 450.082 898.032 630.059Z" fill="#8A5CF5" />
                    </g>
                    <defs>
                        <filter id="phBlur" x="-561.637" y="-476.534" width="2462.67" height="1877.59" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="131.593" result="effect1_foregroundBlur" />
                        </filter>
                    </defs>
                </svg>
            </div>

            {/* ── XOXO texture overlay ── */}
            <div
                className="absolute inset-x-0 bottom-0 w-full h-[120%] pointer-events-none z-0 mix-blend-screen opacity-30"
                style={{ filter: 'brightness(100)', backgroundImage: `url(${xoxo})`, backgroundPosition: 'center 0', backgroundRepeat: 'no-repeat' }}
            />

            {/* ═══════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════ */}
            <section className="relative z-10">
                <PageHero title={singleEvent.title} />

                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-8 pb-24">
                    <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-20">

                        {/* Left: event image */}
                        <div className="relative w-full lg:w-[42%] flex justify-center lg:justify-start pt-4 shrink-0">
                            <div className="relative">
                                {/* glow blob behind image */}
                                <div className="absolute inset-0 -z-10 blur-3xl opacity-40 rounded-full"
                                    style={{ background: 'radial-gradient(circle, #D8B4FE 0%, #FFE0F5 100%)', transform: 'scale(1.3)' }} />
                                <img
                                    src={singleEvent.image}
                                    alt={singleEvent.title}
                                    className="h-[20rem] md:h-[30rem] max-w-none object-contain drop-shadow-2xl"
                                />
                            </div>
                        </div>

                        {/* Right: event metadata + CTA */}
                        <div className="w-full lg:w-[58%] flex flex-col justify-center pt-4 lg:pt-16">

                            {/* Back breadcrumb */}
                            <Link to={`/events/${event}`} className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm font-semibold mb-8 w-fit">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Back to {event}
                            </Link>

                            {/* Type label */}
                            <span className="inline-block text-xs font-black uppercase tracking-widest text-primary mb-3">
                                {(singleEvent.typeId as string).replace(/-/g, ' ')}
                            </span>

                            {/* Title */}
                            <h1 className="text-5xl md:text-7xl font-telaviv text-[#293744] uppercase leading-[0.9] tracking-tight mb-6">
                                {singleEvent.title}
                            </h1>

                            {/* Tagline */}
                            {singleEvent.tagline && (
                                <p className="text-xl md:text-2xl text-gray-700 italic font-medium mb-10 border-l-4 border-primary/30 pl-5">
                                    "{singleEvent.tagline}"
                                </p>
                            )}

                            {/* Quick-info grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
                                <MetaBlock label="When" value={singleEvent.date} />
                                <MetaBlock label="Where" value={singleEvent.location} />
                                {singleEvent.address && <MetaBlock label="Address" value={singleEvent.address} />}
                                {singleEvent.collaboration && <MetaBlock label="With" value={singleEvent.collaboration} />}
                            </div>

                            {/* CTA */}
                            {singleEvent.registrationOpen && (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <a href="#register">
                                        <Button className="bg-[#1DFF87] hover:bg-[#15e076] text-[#293744] font-black px-10 py-7 rounded-3xl text-xl shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest border-b-4 border-black/10">
                                            Register now
                                        </Button>
                                    </a>
                                    <a href="#program">
                                        <Button variant="outline" className="border-2 border-[#293744] text-[#293744] font-black px-10 py-7 rounded-3xl text-xl hover:bg-[#293744] hover:text-white transition-all uppercase tracking-widest">
                                            See program
                                        </Button>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                ABOUT SECTION  (dark)
            ═══════════════════════════════════════ */}
            <section className="relative z-10 bg-[#293744] px-6 md:px-12 lg:px-20 py-24 md:py-32 overflow-hidden">
                <NotebookGrid color="rgba(96, 118, 132, 0.25)" />

                {/* Decorative glitch queen */}
                <img
                    src={queenGlitch}
                    alt=""
                    aria-hidden="true"
                    className="absolute right-0 bottom-0 h-[80%] max-h-[600px] object-contain opacity-5 pointer-events-none select-none"
                />

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        <div className="lg:w-1/3">
                            <span className="text-xs font-black uppercase tracking-widest text-[#85F2AA] mb-4 block">About the event</span>
                            <h2 className="text-4xl md:text-6xl font-telaviv text-white uppercase leading-tight">
                                What is the Dykeathon?
                            </h2>
                        </div>
                        <div className="lg:w-2/3 space-y-6">
                            {(singleEvent.about as string[]).map((paragraph, i) => (
                                <p key={i} className="text-gray-300 text-lg md:text-xl leading-relaxed font-light">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                TRACKS  (white)
            ═══════════════════════════════════════ */}
            {singleEvent.tracks && singleEvent.tracks.length > 0 && (
                <section className="relative z-10 bg-white px-6 md:px-12 lg:px-20 py-24 md:py-32">
                    <div className="max-w-7xl mx-auto">
                        <span className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">Challenge tracks</span>
                        <h2 className="text-4xl md:text-6xl font-telaviv text-[#293744] uppercase leading-tight mb-16">
                            What will you build?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {(singleEvent.tracks as { title: string; description: string }[]).map((track, i) => (
                                <div key={i}
                                    className="group relative bg-[#FFE0F5] rounded-[2rem] p-8 hover:bg-primary hover:text-white transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                                    <div className="absolute top-4 right-4 text-6xl font-telaviv text-primary/20 group-hover:text-white/20 transition-colors leading-none select-none">
                                        0{i + 1}
                                    </div>
                                    <h3 className="text-2xl font-black text-[#293744] group-hover:text-white transition-colors mb-4 uppercase font-montserrat tracking-tight">
                                        {track.title}
                                    </h3>
                                    <p className="text-gray-600 group-hover:text-white/80 transition-colors leading-relaxed font-light">
                                        {track.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════
                PROGRAM / SCHEDULE  (pink)
            ═══════════════════════════════════════ */}
            {singleEvent.program && singleEvent.program.length > 0 && (
                <section id="program" className="relative z-10 bg-[#FFE0F5] px-6 md:px-12 lg:px-20 py-24 md:py-32 overflow-hidden scroll-mt-8">

                    {/* Faint purple blob */}
                    <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
                        style={{ background: 'radial-gradient(circle at 80% 50%, rgba(141,75,255,0.08) 0%, transparent 70%)' }} />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <span className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">Day of the event</span>
                        <h2 className="text-4xl md:text-6xl font-telaviv text-[#293744] uppercase leading-tight mb-16">
                            Program
                        </h2>

                        <div className="relative">
                            {/* Vertical timeline line */}
                            <div className="absolute left-[3.5rem] md:left-[4.5rem] top-0 bottom-0 w-[2px] bg-primary/20 hidden sm:block" />

                            <div className="space-y-4">
                                {(singleEvent.program as { time: string; title: string; description: string }[]).map((item, i) => (
                                    <div key={i} className="flex gap-6 md:gap-10 items-start group">
                                        {/* Time bubble */}
                                        <div className="shrink-0 w-24 md:w-28 text-right">
                                            <span className="inline-block bg-[#293744] text-white text-sm font-black px-3 py-1.5 rounded-xl font-mono tracking-wide">
                                                {item.time}
                                            </span>
                                        </div>

                                        {/* Dot on the timeline */}
                                        <div className="shrink-0 hidden sm:flex items-start pt-1.5 -ml-2">
                                            <div className="w-4 h-4 rounded-full border-2 border-primary bg-[#FFE0F5] group-hover:bg-primary transition-colors" />
                                        </div>

                                        {/* Content card */}
                                        <div className="flex-1 bg-white rounded-2xl px-6 py-5 shadow-sm hover:shadow-md transition-shadow mb-0 group-hover:-translate-y-0.5 duration-300">
                                            <h4 className="font-black text-[#293744] text-lg mb-1 uppercase tracking-tight font-montserrat">
                                                {item.title}
                                            </h4>
                                            <p className="text-gray-500 text-base font-light leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════
                REGISTRATION  (dark)
            ═══════════════════════════════════════ */}
            {singleEvent.registrationOpen && (
                <section id="register" className="relative z-10 bg-[#293744] px-6 md:px-12 lg:px-20 py-24 md:py-32 overflow-hidden scroll-mt-8">
                    <NotebookGrid color="rgba(96, 118, 132, 0.2)" />

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="mb-16">
                            <span className="text-xs font-black uppercase tracking-widest text-[#85F2AA] mb-4 block">Join us</span>
                            <h2 className="text-4xl md:text-6xl font-telaviv text-white uppercase leading-tight">
                                Register for<br />{singleEvent.title}
                            </h2>
                        </div>

                        {/* Quick info row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white mb-16 pb-16 border-b border-white/10">
                            <MetaBlockLight label="What" value={singleEvent.title} />
                            <MetaBlockLight label="When" value={singleEvent.date} />
                            <MetaBlockLight label="Where" value={singleEvent.location} />
                            {singleEvent.collaboration && <MetaBlockLight label="With" value={singleEvent.collaboration} />}
                        </div>

                        {/* Embedded Tally form */}
                        {singleEvent.tallyId && (
                            <div className="w-full">
                                <iframe
                                    data-tally-src={`https://tally.so/embed/${singleEvent.tallyId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
                                    loading="lazy"
                                    width="100%"
                                    title={`Register for ${singleEvent.title}`}
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* ═══════════════════════════════════════
                BOTTOM BACK LINK
            ═══════════════════════════════════════ */}
            <div className="relative z-10 bg-[#FFE0F5] px-6 md:px-12 lg:px-20 py-16 text-center">
                <Link to={`/events/${event}`}>
                    <Button variant="outline" className="border-2 border-[#293744] text-[#293744] font-black px-10 py-6 rounded-3xl text-lg hover:bg-[#293744] hover:text-white transition-all uppercase tracking-widest">
                        ← All {(event as string).replace(/-/g, ' ')} events
                    </Button>
                </Link>
            </div>
        </div>
    );
}

// ────────────────────────────────────────────────────────────────
// Helper sub-components
// ────────────────────────────────────────────────────────────────
function MetaBlock({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{label}:</span>
            <span className="text-[#293744] text-xl md:text-2xl font-telaviv uppercase tracking-tight leading-tight">{value}</span>
        </div>
    );
}

function MetaBlockLight({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{label}:</span>
            <span className="text-white text-xl md:text-3xl font-telaviv uppercase tracking-tight leading-tight">{value}</span>
        </div>
    );
}
