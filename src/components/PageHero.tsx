import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { useContent } from "../contexts/ContentContext";
import { Navigation } from "../components/Navigation";

export function PageHero({ title }: { title?: string }) {
    const { content } = useContent();
    const displayTitle = title || content.about.hero.title;
    const [bounds, setBounds] = useState({ top: 0, height: 0 });
    const [offset, setOffset] = useState(0);
    const [isMdOrSmaller, setIsMdOrSmaller] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.pageYOffset);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useLayoutEffect(() => {
        const updateBounds = () => {
            // Proportional height logic: 
            // Based on an aspect ratio where the full word (12 chars) fits in 100vw
            // with a height that is roughly 1/10th of the width (like in Hero.tsx viewBox 1000:100)
            const height = window.innerWidth / 9;
            setBounds(prev => ({ ...prev, height }));
            setIsMdOrSmaller(window.innerWidth < 1024);
        };

        updateBounds();
        window.addEventListener('resize', updateBounds);
        const timeoutId = setTimeout(updateBounds, 100);

        return () => {
            window.removeEventListener('resize', updateBounds);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <div className="relative top-0">
            <div
                ref={containerRef}
                className="relative top-0 left-0 w-full pointer-events-none z-1 overflow-hidden"
                style={{
                    height: `${bounds.height}px`,
                    display: 'flex',
                    alignItems: 'center'
                }}
            >
                <div
                    className="w-full h-full flex items-center"
                    style={{
                        transform: `translateX(${-offset * 0.1}px)`,
                        width: '120%'
                    }}
                >
                    <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
                        <text
                            x="0"
                            y="75%"
                            textAnchor="start"
                            className="fill-white opacity-70 uppercase"
                            style={{
                                fontFamily: '"Tel Aviv", sans-serif',
                                fontWeight: 400,
                                fontSize: '115px',
                            }}
                            textLength="100%"
                            lengthAdjust="spacingAndGlyphs"
                        >
                            {displayTitle}
                        </text>
                    </svg>
                </div>
            </div>
            <div
                className="w-auto flex items-end absolute right-2 lg:right-5 z-20 opacity-80"
                style={{
                    transform: `translateY(${offset * 0.1}px)`,
                    top: bounds.height - (isMdOrSmaller ? 30 : 50),
                }}
            >
                <Navigation variant="transparent" text="bright" />
            </div>
        </div>
    );
}
