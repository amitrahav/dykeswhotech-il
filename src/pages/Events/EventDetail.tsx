import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from "react";
import { useContent } from "../../contexts/ContentContext";
import { Button } from "../../components/ui/button";
import { RegisterModal } from "../../components/RegisterModal";
import { PageHero } from "../../components/PageHero";


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
    const [registerOpen, setRegisterOpen] = useState(false);

    // Find the single event from JSON
    const singleEvent = (eventsContent as any).singleEvents?.find(
        (e: any) => e.typeId === event && e.id === eventId
    );

    useTallyEmbed(singleEvent?.tallyId);

    if (!singleEvent) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] gap-6">
                <h1 className="text-4xl font-telaviv text-[#293744]">Event not found</h1>
                <Link to={`/events/${event}`}>
                    <Button className="bg-primary text-white px-8 py-4 rounded-2xl text-lg">← Back to events</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-[#F5F5F5] min-h-screen">

            {/* ═══════════════════════════════════════
                TOP LOGO HEADER — rainbow gradient background
            ═══════════════════════════════════════ */}
            <div
                className="w-full"
                style={{
                    background: 'linear-gradient(90deg, #FEECFF 0%, #FECAFF 11.71%, #FEB5FF 26.8%, #FFDBE7 40.18%, #FFF4D6 49.22%, #F3FCD7 58.71%, #D2F5EE 71.29%, #C3EFFF 84.44%, #FBEFFF 100%)',
                }}
            >
                <PageHero />
            </div>

            {/* ═══════════════════════════════════════
                HERO / "WHAT" SECTION
            ═══════════════════════════════════════ */}
            <section className="relative z-10 px-6 md:px-12 lg:px-20 py-16 md:py-24">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-start">

                    {/* Left: Info */}
                    <div className="lg:w-3/5">
                        <div className="text-sm font-medium text-gray-400 mb-3 font-poppins tracking-wide">what</div>
                        <h2 className="text-5xl md:text-7xl font-telaviv text-[#293744] uppercase leading-[0.9] tracking-tight mb-8">
                            {singleEvent.title}
                        </h2>

                        <div className="space-y-6 max-w-2xl">
                            {singleEvent.tagline && (
                                <p className="text-xl text-gray-700 italic font-medium">
                                    "{singleEvent.tagline}"
                                </p>
                            )}

                            <div className="space-y-4 text-gray-700 font-poppins leading-relaxed text-lg">
                                {Array.isArray(singleEvent.about) && singleEvent.about.length > 0 ? (
                                    singleEvent.about.map((paragraph: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined, i: Key | null | undefined) => (
                                        <p key={i}>{paragraph}</p>
                                    ))
                                ) : (
                                    <p>Our mission is simple: to create a network that actually works for us. We don't wait for an invite to the table; we're building our own.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Illustration */}
                    <div className="lg:w-2/5 w-full flex justify-center lg:justify-end">
                        <div className="w-full aspect-square bg-[#C4C4C4] max-w-[414px] flex items-center justify-center overflow-hidden hover:scale-[1.02] transition-transform duration-500">
                            {singleEvent.image ? (
                                <img src={singleEvent.image} alt={singleEvent.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-gray-400 font-bold">IMAGE</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Registration CTA if open */}
                {singleEvent.registrationOpen && (
                    <div className="max-w-7xl mx-auto mt-12 px-0">
                        <Button
                            onClick={() => setRegisterOpen(true)}
                            className="bg-[#FF00E5] hover:bg-[#e000cc] text-white font-black px-12 py-8 rounded-full text-xl shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest cursor-pointer"
                        >
                            Register now
                        </Button>
                    </div>
                )}
            </section>

            {/* ═══════════════════════════════════════
                 PARTNERS SECTION
            ═══════════════════════════════════════ */}
            <section className="relative z-10 py-10 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-wrap justify-start items-center gap-x-12 gap-y-4">
                    {[
                        { src: "/assets/unity-logo.png", name: "Unity" },
                        { src: "/assets/hourone-logo.png", name: "Hour One" },
                        { src: "/assets/microsoft-logo.png", name: "Microsoft" },
                        { src: "/assets/riskified-logo.png", name: "Riskified" },
                    ].map(({ src, name }) => (
                        <PartnerLogo key={name} src={src} name={name} />
                    ))}
                </div>
            </section>


            {/* ═══════════════════════════════════════
                 GALLERY SECTION
            ═══════════════════════════════════════ */}
            <section className="relative z-10 bg-[#F5F5F5] px-6 md:px-12 lg:px-20 py-16 md:py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
                        {Array.from({ length: 25 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-[#C4C4C4]" />
                        ))}
                    </div>

                    <div className="flex justify-center">
                        <Button className="bg-[#FF00E5] hover:bg-[#e000cc] text-white font-black px-10 py-5 rounded-full text-base tracking-widest uppercase cursor-pointer transition-all hover:scale-105 active:scale-95">
                            View gallery
                        </Button>
                    </div>
                </div>
            </section>


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
                FINAL OUTCOME SECTION
            ═══════════════════════════════════════ */}
            <section className="relative z-10 overflow-hidden bg-white">

                {/* Hearts background — xoxo technique: screen blend, bottom-anchored */}
                <div
                    className="absolute inset-x-0 bottom-0 w-full h-[120%] pointer-events-none z-0 mix-blend-screen opacity-40"
                    style={{
                        filter: 'brightness(100)',
                        backgroundImage: `url(/assets/hearts.png)`,
                        backgroundPosition: 'center bottom',
                        backgroundSize: '100% auto',
                        backgroundRepeat: 'no-repeat',
                        backgroundBlendMode: 'screen',
                    }}
                />

                {/* Pink shade — 80vw, screen blend */}
                <div
                    className="absolute left-0 top-0 h-full pointer-events-none z-0 mix-blend-screen"
                    style={{
                        width: '80vw',
                        background: 'radial-gradient(ellipse at -5% 70%, rgba(255,0,229,0.55) 0%, rgba(255,0,229,0.18) 45%, transparent 70%)',
                    }}
                />

                {/* Hestia — anchored to bottom-left */}
                <div className="absolute bottom-0 left-0 z-10 pointer-events-none">
                    <img
                        src="/assets/Hestia-standing.png"
                        alt="Hestia"
                        className="h-[28rem] md:h-[42rem] object-contain object-bottom drop-shadow-2xl"
                    />
                </div>

                {/* Content — padded left to clear the statue on md+ */}
                <div className="relative z-20 px-6 md:px-12 lg:px-20 py-24 md:py-32">
                    <div className="max-w-7xl mx-auto md:pl-[22rem] lg:pl-[28rem]">

                        <span className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">Results</span>
                        <h2 className="text-4xl md:text-6xl font-telaviv text-[#293744] uppercase leading-tight mb-6">
                            Final outcome
                        </h2>
                        <p className="text-gray-600 font-poppins text-lg leading-relaxed mb-14 max-w-2xl">
                            {singleEvent.about?.[singleEvent.about.length - 1] || "An incredible day of building, connecting, and creating real impact for the community."}
                        </p>

                        {/* Top 3 project cards */}
                        {singleEvent.tracks && singleEvent.tracks.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                {(singleEvent.tracks as { title: string; description: string }[]).slice(0, 3).map((track, i) => (
                                    <div key={i}
                                        className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                                        <div className="absolute top-3 right-4 text-6xl font-telaviv text-primary/8 leading-none select-none italic">
                                            {i + 1}
                                        </div>
                                        <div className="text-2xl mb-2">{["🥇", "🥈", "🥉"][i]}</div>
                                        <h3 className="text-lg font-black text-[#293744] uppercase font-montserrat tracking-tight mb-2">
                                            {track.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm leading-relaxed font-light font-poppins">
                                            {track.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════
                BOTTOM BACK LINK
            ═══════════════════════════════════════ */}
            <div className="relative z-10 bg-[#F5F5F5] px-6 md:px-12 lg:px-20 py-16 text-center border-t border-gray-200">
                <Link to={`/events/${event}`}>
                    <Button variant="outline" className="border-2 border-[#293744] text-[#293744] font-black px-10 py-6 rounded-3xl text-lg hover:bg-[#293744] hover:text-white transition-all uppercase tracking-widest font-montserrat">
                        ← All {(event as string).replace(/-/g, ' ')} events
                    </Button>
                </Link>
            </div>

            {/* Registration popup */}
            {registerOpen && singleEvent?.registrationOpen && (
                <RegisterModal
                    event={{
                        title: singleEvent.title,
                        date: singleEvent.date,
                        location: singleEvent.location,
                        collaboration: singleEvent.collaboration,
                        tallyId: singleEvent.tallyId,
                    }}
                    onClose={() => setRegisterOpen(false)}
                />
            )}
        </div>
    );
}

// ────────────────────────────────────────────────────────────────
// Helper sub-components
// ────────────────────────────────────────────────────────────────
function MetaBlockLight({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-gray-400 text-sm font-semibold uppercase tracking-wider">{label}:</span>
            <span className="text-white text-xl md:text-3xl font-telaviv uppercase tracking-tight leading-tight">{value}</span>
        </div>
    );
}

function PartnerLogo({ src, name }: { src: string; name: string }) {
    const [failed, setFailed] = useState(false);
    return failed ? (
        <span className="text-base font-bold text-gray-400 tracking-tight">{name}</span>
    ) : (
        <img
            src={src}
            alt={name}
            className="h-7 object-contain grayscale opacity-60"
            onError={() => setFailed(true)}
        />
    );
}
