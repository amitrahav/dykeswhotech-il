import { useParams } from "react-router-dom";
import { useContent } from "../../contexts/ContentContext";
import { PageHero } from "../../components/PageHero";
import { Card, CardTitle } from "../../components/ui/card";
import { useEffect } from "react";
import demeterSwag from "../../assets/Demeter-swag.png";
import xoxo from "../../assets/xoxo.png";
import { Button } from "../../components/ui/button";


export function EventArchive() {
    const { event } = useParams<{ event: string }>();
    const { content } = useContent();
    const { events: eventsContent } = content;

    const eventType = eventsContent.eventTypes.find(t => t.id === event);

    if (!eventType) {
        return <div className="min-h-screen flex items-center justify-center text-white">Event type not found</div>;
    }

    const pastEvents = eventsContent.pastEvents.filter(e => e.typeId === event);
    const upcomingEvent = eventsContent.upCommingDetails.typeId === event ? eventsContent.upCommingDetails : null;

    useEffect(() => {
        // Tally embed script loading
        const d = document;
        const w = "https://tally.so/widgets/embed.js";
        const v = () => {
            // @ts-ignore
            if (typeof Tally !== "undefined") {
                // @ts-ignore
                Tally.loadEmbeds();
            } else {
                d.querySelectorAll("iframe[data-tally-src]:not([src])").forEach((e) => {
                    // @ts-ignore
                    e.src = e.dataset.tallySrc;
                });
            }
        };
        // @ts-ignore
        if (typeof Tally !== "undefined") {
            v();
        } else if (d.querySelector(`script[src="${w}"]`) === null) {
            const s = d.createElement("script");
            s.src = w;
            s.onload = v;
            s.onerror = v;
            d.body.appendChild(s);
        }
    }, [upcomingEvent]);

    return (
        <div className="bg-[#FFE0F5] min-h-screen pb-40 relative overflow-hidden">
            <PageHero />

            {/* Background Decor: Purple Haze Inlined for control */}
            <div className="absolute top-[-10%] left-[-10%] w-full h-[120%] pointer-events-none z-0">
                <svg width="100%" height="100%" viewBox="0 0 1902 1402" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
                    <g filter="url(#purpleHazeBlur)">
                        <path d="M898.032 630.059C1442.67 810.035 1610.58 273.655 1637.85 211.986C1299.21 -312.317 66.4157 -437.506 -219.134 330.715C-504.684 1098.94 63.5348 1274.48 182.852 1043.09C302.17 811.695 353.39 450.082 898.032 630.059Z" fill="#8A5CF5" />
                    </g>
                    <defs>
                        <filter id="purpleHazeBlur" x="-561.637" y="-476.534" width="2462.67" height="1877.59" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                            <feGaussianBlur stdDeviation="131.593" result="effect1_foregroundBlur" />
                        </filter>
                    </defs>
                </svg>
            </div>

            {/* Background Decor: XOXO with About.tsx styling */}
            <div
                className="absolute inset-x-0 bottom-0 w-full h-[120%] pointer-events-none z-0 mix-blend-screen opacity-40"
                style={{
                    filter: 'brightness(100)',
                    backgroundImage: `url(${xoxo})`,
                    backgroundPosition: 'center 0',
                    backgroundRepeat: 'no-repeat',
                    backgroundBlendMode: 'screen'
                }}
            ></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-12 lg:gap-20 mb-32">
                    {/* Hero Image Section */}
                    <div className="relative w-full md:w-[40%] flex justify-center md:justify-start pt-8">
                        <img
                            src={demeterSwag}
                            alt="Demeter Swag Statue"
                            className="h-[22rem] md:h-[35rem] max-w-none object-cover"
                            style={{ filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.5))' }}
                        />
                    </div>

                    {/* Hero Text Section */}
                    <div className="w-full md:w-[60%] flex flex-col justify-center">
                        <div className="mb-10">
                            <p className="text-gray-500 font-semibold mb-2 text-xl">What:</p>
                            <h1 className="text-6xl md:text-8xl font-telaviv text-primary uppercase leading-[0.85] tracking-tight">
                                {eventType.title}
                            </h1>
                        </div>

                        <div className="max-w-3xl">
                            <p className="text-gray-800 text-xl md:text-2xl font-medium mb-10 leading-relaxed italic border-l-4 border-primary/20 pl-6">
                                "{eventType.description}"
                            </p>

                            {eventType.features && (
                                <ul className="space-y-4">
                                    {eventType.features.map((feature: string, idx: number) => {
                                        const parts = feature.split(': ');
                                        const title = parts[0];
                                        const desc = parts.slice(1).join(': ');
                                        return (
                                            <li key={idx} className="flex items-start gap-4">
                                                <span className="text-primary text-3xl leading-none mt-1">•</span>
                                                <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
                                                    <span className="font-extrabold">{title}:</span> {desc}
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {upcomingEvent && eventsContent.displayUpcoming && (
                <div className="px-6 md:px-12 lg:px-20 mb-40 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-5xl md:text-7xl font-bold mb-16 text-[#293744] font-montserrat tracking-tighter">
                            Upcoming - {upcomingEvent.title}
                        </h2>

                        <div className="flex flex-col justify-center bg-transparent rounded-[40px] px-8 md:px-16 py-16 md:py-24 relative overflow-hidden border-2 border-primary/10">

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-[#293744] mb-20 relative z-10">
                                <div className="flex flex-col">
                                    <p className="text-gray-500 text-lg mb-3">What:</p>
                                    <h3 className="text-2xl md:text-4xl font-telaviv uppercase tracking-tighter">{upcomingEvent.title}</h3>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-500 text-lg mb-3">When:</p>
                                    <h3 className="text-2xl md:text-4xl font-telaviv uppercase tracking-tighter">{upcomingEvent.date}</h3>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-500 text-lg mb-3">Where:</p>
                                    <h3 className="text-2xl md:text-4xl font-telaviv uppercase tracking-tighter">{upcomingEvent.location}</h3>
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-gray-500 text-lg mb-3">Collaboration:</p>
                                    <h3 className="text-2xl md:text-4xl font-telaviv uppercase tracking-tighter">{upcomingEvent.collaboration || "LGBTQ"}</h3>
                                </div>
                            </div>

                            <div className="flex justify-start relative z-10">
                                <Button className="bg-[#1DFF87] hover:bg-[#15e076] text-[#293744] font-black px-12 md:px-16 py-10 md:py-12 rounded-3xl text-3xl shadow-xl transition-all hover:scale-105 active:scale-95 uppercase tracking-widest border-b-8 border-black/10">
                                    Register
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {pastEvents.length > 0 && (
                <div className="px-6 md:px-12 lg:px-20 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-5xl md:text-8xl font-bold mb-8 text-[#293744] font-montserrat tracking-tighter">
                            blessed from the past
                        </h2>
                        <p className="text-gray-600 max-w-5xl mb-24 text-xl md:text-2xl font-medium leading-relaxed">
                            No explanations needed: Creating events and meetups where our identity is the default, not something we have to justify or explain.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                            {pastEvents.map((event: any, index: number) => (
                                <Card key={index} className="bg-white border-0 text-black overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] flex flex-col h-full hover:translate-y-[-12px] transition-all duration-500 group">
                                    <div className="p-8 pb-5 flex flex-col gap-2">
                                        <div className="inline-block w-fit px-3 py-1 bg-[#1DFF87] text-[#293744] text-[12px] font-black rounded-lg uppercase tracking-widest mb-2 shadow-sm">
                                            {new Date(event.date).getFullYear()}
                                        </div>
                                        <CardTitle className="text-2xl font-black leading-none mb-1 group-hover:text-primary transition-colors">{event.title}</CardTitle>
                                        <p className="text-gray-500 text-base font-bold tracking-tight">{event.host || "Host name / place"}</p>
                                    </div>

                                    <div className="relative aspect-[16/11] w-full overflow-hidden border-y border-gray-50">
                                        {event.image && (
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                        )}
                                    </div>

                                    <div className="p-8 flex-grow flex flex-col justify-between bg-white">
                                        <div className="flex gap-4 mb-8">
                                            {[1, 2, 3].map(i => (
                                                <div key={i} className="w-14 h-14 bg-[#F8F9FA] border border-gray-100 rounded-2xl flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 opacity-90 p-2">
                                                    <img src={`/assets/Hestia0${i % 2 === 0 ? '2' : '1'}.png`} className="w-full h-full object-contain" alt="partner" />
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-500 leading-relaxed pt-6 border-t border-gray-100 font-semibold italic">
                                            {event.description}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

