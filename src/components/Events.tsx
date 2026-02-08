import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardFooter, CardTitle } from "./ui/card";

import { useContent } from "../contexts/ContentContext";



// Animated notebook grid lines component
const NotebookGrid = ({ delay = 0, color = "rgba(144, 238, 144, 0.2)" }: { delay?: number, color?: string }) => {
    const squareSize = 40; // Size of each square in the grid
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const updateDimensions = (entries: ResizeObserverEntry[]) => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setDimensions({ width, height });
            }
        };

        const resizeObserver = new ResizeObserver(updateDimensions);
        resizeObserver.observe(containerRef.current);

        return () => resizeObserver.disconnect();
    }, []);

    const { width, height } = dimensions;

    // Calculate number of lines needed to cover full card
    const horizontalLines = height > 0 ? Math.ceil(height / squareSize) + 1 : 0;
    const verticalLines = width > 0 ? Math.ceil(width / squareSize) + 1 : 0;

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Horizontal lines */}
                {Array.from({ length: horizontalLines }).map((_, i) => {
                    const y = i * squareSize;
                    return (
                        <line
                            key={`h-${i}`}
                            x1="0"
                            y1={y}
                            x2={width}
                            y2={y}
                            stroke={color}
                            strokeWidth="0.9"
                            strokeLinecap="round"
                            style={{
                                opacity: 0,
                                animation: `fadeIn 1.5s ease-out ${delay + i * 0.08}s forwards`
                            }}
                        />
                    );
                })}

                {/* Vertical lines */}
                {Array.from({ length: verticalLines }).map((_, i) => {
                    const x = i * squareSize;
                    const lineLength = height;
                    return (
                        <line
                            key={`v-${i}`}
                            x1={x}
                            y1="0"
                            x2={x}
                            y2={height}
                            stroke={color}
                            strokeWidth="0.9"
                            strokeLinecap="round"
                            vectorEffect="non-scaling-stroke"
                            style={{
                                strokeDasharray: lineLength,
                                strokeDashoffset: lineLength,
                                animation: `drawLine 1.5s ease-out ${delay + i * 0.08}s forwards`
                            }}
                        />
                    );
                })}
            </svg>
        </div>
    );
};

function UpcommingEvent() {
    const { content } = useContent();
    const { events: eventsContent } = content;

    useEffect(() => {
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
    }, []);

    return (
        <div className="flex flex-col justify-center bg-[#293744] rounded-[23px] md:mt-16 mt-4 md:px-40 px-10 py-10 md:py-20 relative overflow-hidden">
            <NotebookGrid color="rgba(96, 118, 132, 0.2)" />

            <div className="flex md:flex-row md:gap-0 gap-4 flex-col w-full justify-between text-white mb-10 md:mb-20 relative z-10">
                <div><p>What:</p><h3 className="text-2xl font-telaviv text-white">{eventsContent.upCommingDetails.title}</h3></div>
                <div><p>When:</p><h3 className="text-2xl font-telaviv text-white">{eventsContent.upCommingDetails.date}</h3></div>
                <div><p>Where:</p><h3 className="text-2xl font-telaviv text-white">{eventsContent.upCommingDetails.location}</h3></div>
            </div>
            <div className="w-full relative z-10">
                <iframe
                    data-tally-src={`https://tally.so/embed/${eventsContent.upCommingDetails.tallyId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
                    loading="lazy"
                    width="100%"
                />
            </div>
        </div>
    );
}

export function Events() {
    const { content } = useContent();
    const { events: eventsContent } = content;

    const eventTypes = eventsContent.eventTypes.map((item) => ({
        ...item
    }));

    return (
        <section className="w-full pt-10 pb-20 px-8 md:px-16 lg:px-24">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl mb-8 font-extrabold" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>{eventsContent.title}</h2>
                <p className="max-w-2xl text-gray-700 mb-12 text-base md:text-lg font-light">
                    {eventsContent.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:mx-[-10rem]">
                    {eventTypes.map((event, index) => (
                        <Card key={index} className="relative bg-[#293744] border-2 border-[#293744] text-white overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300 rounded-3xl relative"
                        >
                            {/* Animated notebook grid - lowest z-index */}
                            <NotebookGrid delay={index * 0.3} />

                            <div className="relative h-full w-full"
                                style={{
                                    background: 'radial-gradient(circle at 70% 80%, rgba(133, 242, 170, 0.5) 0%, rgba(133, 242, 170, 0.4) 25%, rgba(133, 242, 170, 0.2) 45%, rgba(133, 242, 170, 0.05) 65%, transparent 80%)'
                                }}
                            >
                                <div className="image-glow-wrap absolute lg:translate-x-[80%] translate-x-[40%] translate-y-[20%]">
                                    <img src={event.image} alt={event.title} className="h-full object-cover" />
                                </div>
                            </div>
                            <CardFooter className="px-4 py-6 absolute bottom-0 h-full" style={{ zIndex: 1 }}>
                                <div className="flex flex-col h-full justify-between">
                                    <CardTitle className="text-2xl font-normal leading-tight">{event.title}</CardTitle>
                                    <Button className="rounded-full bg-[#90EE90] hover:bg-[#7CDC7C] text-black font-bold text-xs h-8">
                                        {eventsContent.button} <span className="ml-1">→</span>
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
            {eventsContent.displayUpcoming && new Date(eventsContent.displayUpcomingUntil) > new Date() && (
                <div className="max-w-6xl mx-auto mt-10">
                    <h2 className="text-2xl mb-8 font-extrabold" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>{eventsContent.upcomingTitle}</h2>
                    {eventsContent.upcomingDescription && eventsContent.upcomingDescription.length > 0 && (
                        <p className="max-w-2xl text-gray-700 mb-12 text-base md:text-lg font-light">
                            {eventsContent.upcomingDescription}
                        </p>
                    )}
                    <UpcommingEvent />
                </div>
            )}
        </section>
    );
}
