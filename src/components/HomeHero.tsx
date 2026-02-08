import { useRef, useLayoutEffect, useState } from "react";
import greekStatue from "../assets/greek.png";
import { LiquidText } from "./LiquidText";
import { Navigation } from "./Navigation";

export function HomeHero() {
    const sectionRef = useRef<HTMLElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const [bounds, setBounds] = useState({ top: 0, height: 0 });

    useLayoutEffect(() => {
        const updateBounds = () => {
            if (sectionRef.current && topRef.current && bottomRef.current) {
                const sectionRect = sectionRef.current.getBoundingClientRect();
                const topRect = topRef.current.getBoundingClientRect();
                const bottomRect = bottomRef.current.getBoundingClientRect();

                const top = topRect.bottom - sectionRect.top;
                const height = bottomRect.top - topRect.bottom;

                setBounds({ top, height });
            }
        };

        updateBounds();
        window.addEventListener('resize', updateBounds);
        return () => window.removeEventListener('resize', updateBounds);
    }, []);

    return (
        <section ref={sectionRef} className="relative w-full z-20 pb-32 bg-background">
            {/* Top Banner Stripes - Matches the provided design image */}
            <div className="w-full flex flex-col relative z-10">
                {/* Top thick purple bar */}
                <div className="h-[30px] md:h-[50px] w-full bg-primary"></div>
                {/* White spacing - transparent to show background text */}
                <div className="h-[60px] md:h-[100px] w-full bg-background flex items-center justify-center">
                    <Navigation variant="transparent" />
                </div>
                {/* Second purple bar */}
                <div ref={topRef} className="h-[30px] md:h-[50px] w-full bg-primary purple-boundery"></div>
            </div>

            {/* Background text positioned absolutely between purple 2nd bar and pink 1st bar */}
            <div
                className="absolute w-full overflow-hidden pointer-events-auto z-[1]"
                style={{
                    top: `${bounds.top}px`,
                    height: `${bounds.height}px`
                }}
            >
                <LiquidText height={bounds.height} />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center pt-32 md:pt-64 mt-8 pointer-events-none">
                {/* Central Image - Greek Statue Pop-out */}
                {/* Container for circle and statue */}

                <div className="relative w-full md:max-w-[35rem] max-w-[100vw] h-[18rem] md:h-[35rem] flex items-end justify-center mt-[-3rem] md:mt-[-9rem]">
                    {/* The Gradient Circle - Linear Gradient 180deg */}
                    {/* Centered in the container */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[12rem] h-[12rem] md:w-[23rem] md:h-[23rem] rounded-full md:ml-[-1.5rem]"
                        style={{ background: 'linear-gradient(180deg, #C8AEF4 0%, #7349C2 50%, #55368F 100%)' }}>
                    </div>

                    {/* The Statue - Overflows up */}
                    <img src={greekStatue} alt="Greek Statue"
                        className="relative z-10 w-[auto] h-[22rem] md:h-[35rem] max-w-none object-cover object-top mb-16 md:mb-40 ml-[2rem] md:ml-[1rem]" />
                </div>

                <div className="w-full flex flex-col mt-[-8rem] md:mt-[-18rem]">
                    {/* Bottom thick pink bar */}
                    <div ref={bottomRef} className="h-[25px] md:h-[50px] w-full bg-[#FFE0F5] pink-boundery"></div>

                </div>

            </div>
        </section>
    );
}
