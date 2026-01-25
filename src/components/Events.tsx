import { Button } from "./ui/button";
import { Card, CardFooter, CardTitle } from "./ui/card";
import hestia1 from "../assets/Hestia01.png";
import hestia2 from "../assets/Hestia02.png";
import demeter from "../assets/Demeter.png";

const eventImages = [hestia1, hestia2, demeter, hestia1];

// Animated notebook grid lines component
const NotebookGrid = ({ delay = 0 }: { delay?: number }) => {
    const squareSize = 40; // Size of each square in the grid
    const width = 300;
    const height = 400;

    // Calculate number of lines needed to cover full card
    const horizontalLines = Math.ceil(height / squareSize) + 1;
    const verticalLines = Math.ceil(width / squareSize) + 1;

    return (
        <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 0 }}
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Horizontal lines */}
            {Array.from({ length: horizontalLines }).map((_, i) => {
                const y = i * squareSize;
                const lineLength = width;
                return (
                    <line
                        key={`h-${i}`}
                        x1="0"
                        y1={y}
                        x2={width}
                        y2={y}
                        stroke="rgba(144, 238, 144, 0.2)"
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
                        stroke="rgba(144, 238, 144, 0.2)"
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
    );
};

export function Events() {
    const events = [
        { title: "Dykeathon", date: "12/09/2023", type: "Hackathon", image: eventImages[0], status: "Upcoming" },
        { title: "Meetups", date: "24/10/2023", type: "Guest Event", image: eventImages[1], status: "Past" },
        { title: "Drink & Dyke", date: "15/11/2023", type: "Social", image: eventImages[2], status: "Past" },
        { title: "Meetups", date: "12/12/2023", type: "Guest Event", image: eventImages[3], status: "Past" },
    ];

    return (
        <section className="py-20 px-4">
            <style>{`
                @keyframes drawLine {
                    to {
                        stroke-dashoffset: 0;
                    }
                }
            `}</style>
            <div className="max-w-6xl mx-auto">
                <h2 className="text-5xl font-extrabold mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}>Events & Spaces</h2>
                <p className="max-w-2xl text-gray-700 mb-12 text-lg" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}>
                    Our events are where it all happens. We meet to learn, create, consult, and sometimes just to have a drink and feel at home.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ml-[-10rem] mr-[-10rem]">
                    {events.map((event, index) => (
                        <Card key={index} className="bg-[#293744] border-2 border-[#293744] text-white overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300 rounded-3xl relative"
                        >
                            {/* Animated notebook grid - lowest z-index */}
                            <NotebookGrid delay={index * 0.3} />

                            <div className="relative h-full w-full"
                                style={{
                                    background: 'radial-gradient(circle at 70% 80%, rgba(133, 242, 170, 0.5) 0%, rgba(133, 242, 170, 0.4) 25%, rgba(133, 242, 170, 0.2) 45%, rgba(133, 242, 170, 0.05) 65%, #293744 80%)'
                                }}
                            >
                                <div className="image-glow-wrap absolute translate-x-[30%] translate-y-[20%]">
                                    <img src={event.image} alt={event.title} className="h-full object-cover" />
                                </div>
                            </div>
                            <CardFooter className="px-4 py-2 absolute bottom-0 h-full" style={{ zIndex: 1 }}>
                                <div className="flex flex-col h-full justify-between">
                                    <p className="text-[10px] uppercase tracking-wider mb-1" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800, color: event.status === "Upcoming" ? "#90EE90" : "#4DE3ED" }}>{event.status} Event</p>
                                    <CardTitle className="text-2xl font-normal leading-tight ">{event.title}</CardTitle>
                                    <p className="text-xs  mb-4">{event.type} <br /> {event.date}</p>
                                    <Button className="rounded-full bg-[#90EE90] hover:bg-[#7CDC7C] text-black font-bold text-xs h-8 mb-10">
                                        Read Details &rarr;
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
