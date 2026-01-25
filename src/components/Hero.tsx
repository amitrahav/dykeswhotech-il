import { Button } from "./ui/button";
import greekStatue from "../assets/greek.png";

const HeroBackgroundText = () => (
    <div className="w-full flex flex-col items-center justify-center select-none mt-16 mb-[-200px] relative z-0 gap-[42px]" aria-hidden="true">
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
        <section className="relative w-full overflow-hidden bg-background pb-20">
            {/* Top Banner Stripes - Matches the provided design image */}
            <div className="w-full flex flex-col">
                {/* Top thick purple bar */}
                <div className="h-[50px] w-full bg-[#8D6BE4]"></div>
                {/* White spacing */}
                <div className="h-[100px] w-full bg-white"></div>
                {/* Second purple bar */}
                <div className="h-[50px] w-full bg-[#8D6BE4]"></div>
            </div>

            <HeroBackgroundText />

            <div className="relative z-10 flex flex-col items-center text-center px-4 pt-32">
                {/* Central Image - Greek Statue Pop-out */}
                {/* Container for circle and statue */}
                <div className="relative w-80 h-80 mb-8 flex items-end justify-center">
                    {/* The Gradient Circle - Linear Gradient 180deg */}
                    {/* Centered in the container */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full"
                        style={{ background: 'linear-gradient(180deg, #C8AEF4 0%, #7349C2 50%, #55368F 100%)' }}>
                    </div>

                    {/* The Statue - Overflows up */}
                    <img src={greekStatue} alt="Greek Statue"
                        className="relative z-10 w-[140%] h-[140%] max-w-none object-cover object-top -mt-32 grayscale brightness-110 contrast-125"
                        style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }} />
                </div>

                <h2 className="text-xl font-medium text-pink-500 mb-3 tracking-wide mt-4">
                    DykesWhoTech
                </h2>

                <h3 className="text-2xl md:text-3xl font-bold mb-4 max-w-2xl text-black">
                    Home for lesbians queer women & trans people in the tech industry
                </h3>

                <p className="max-w-xl text-muted-foreground mb-8 text-lg">
                    We are here to create a professional network, advance careers, and build a safe space where technology meets pride.
                </p>

                <Button variant="secondary" className="px-8 py-6 rounded-full text-lg font-semibold bg-pink-100 hover:bg-pink-200 text-primary shadow-sm hover:shadow-md transition-all">
                    Read more &rarr;
                </Button>
            </div>
        </section>
    );
}
