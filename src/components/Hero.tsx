
import greekStatue from "../assets/greek.png";

const HeroBackgroundText = () => (
    <div className="w-full flex flex-col items-center justify-center select-none relative z-0 pt-10 gap-[42px]" aria-hidden="true">
        {[1, 2, 3].map((_, i) => (
            <div key={i} className="text-[#383838] text-center uppercase"
                style={{
                    fontFamily: '"Tel Aviv", sans-serif',
                    fontWeight: 400,
                    fontSize: '190px',
                    lineHeight: '88px',
                    letterSpacing: '0.01em',
                    textAlign: 'center',
                    verticalAlign: 'middle'
                }}>
                DYKESWHOTECH
            </div>
        ))}
    </div>
);

export function Hero() {
    return (
        <section className="relative w-full z-20 pb-32 bg-background">
            {/* Background text positioned absolutely to avoid clipping */}
            <div className="absolute top-[200px] left-0 w-full overflow-hidden pointer-events-none z-[1] h-full">
                <HeroBackgroundText />
            </div>

            {/* Top Banner Stripes - Matches the provided design image */}
            <div className="w-full flex flex-col relative z-10">
                {/* Top thick purple bar */}
                <div className="h-[50px] w-full bg-[#8D6BE4]"></div>
                {/* White spacing - transparent to show background text */}
                <div className="h-[100px] w-full"></div>
                {/* Second purple bar */}
                <div className="h-[50px] w-full bg-[#8D6BE4]"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center pt-64 mt-8">
                {/* Central Image - Greek Statue Pop-out */}
                {/* Container for circle and statue */}

                <div className="relative w-[35rem] h-[35rem] flex items-end justify-center mt-[-9rem]">
                    {/* The Gradient Circle - Linear Gradient 180deg */}
                    {/* Centered in the container */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[23rem] h-[23rem] rounded-full ml-[-1.5rem]"
                        style={{ background: 'linear-gradient(180deg, #C8AEF4 0%, #7349C2 50%, #55368F 100%)' }}>
                    </div>

                    {/* The Statue - Overflows up */}
                    <img src={greekStatue} alt="Greek Statue"
                        className="relative z-10  max-w-none object-cover object-top mb-40 ml-[1rem]" />
                </div>

                <div className="w-full flex flex-col mt-[-18rem] ml-[-2rem] mr-[-2rem]">
                    {/* Bottom thick pink bar */}
                    <div className="h-[50px] w-full bg-[#FFE0F5]"></div>

                </div>

            </div>
        </section>
    );
}
