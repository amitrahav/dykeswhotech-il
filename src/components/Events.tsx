import { Button } from "./ui/button";
import { Card, CardFooter, CardTitle } from "./ui/card";
import hestia1 from "../assets/Hestia01.png";
import hestia2 from "../assets/Hestia02.png";
import demeter from "../assets/Demeter.png";

const eventImages = [hestia1, hestia2, demeter, hestia1];

export function Events() {
    const events = [
        { title: "Dykeathon", date: "12/09/2023", type: "Hackathon", image: eventImages[0] },
        { title: "Meetups", date: "24/10/2023", type: "Guest Event", image: eventImages[1] },
        { title: "Drink & Dyke", date: "15/11/2023", type: "Social", image: eventImages[2] },
        { title: "Meetups", date: "12/12/2023", type: "Guest Event", image: eventImages[3] },
    ];

    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-5xl font-extrabold mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}>Events & Spaces</h2>
                <p className="max-w-2xl text-gray-700 mb-12 text-lg" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}>
                    Our events are where it all happens. We meet to learn, create, consult, and sometimes just to have a drink and feel at home.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {events.map((event, index) => (
                        <Card key={index} className="bg-[#1A1F2C]/90 text-white border-0 overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300 rounded-3xl">
                            <div className="h-48 bg-gradient-to-b from-transparent to-[#1A1F2C] relative p-4 pb-0">
                                <div className="absolute inset-0">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-80 mix-blend-overlay" />
                                </div>
                                <div className="relative z-10 flex flex-col h-full justify-end">
                                    <p className="text-[10px] uppercase tracking-wider text-[#90EE90] mb-1">Upcoming Event</p>
                                    <CardTitle className="text-2xl font-bold leading-tight mb-2">{event.title}</CardTitle>
                                    <p className="text-xs text-gray-400 mb-4">{event.type} <br /> {event.date}</p>
                                </div>
                            </div>
                            <CardFooter className="p-4 pt-0">
                                <Button className="w-full rounded-full bg-[#90EE90] hover:bg-[#7CDC7C] text-black font-bold text-xs h-8">
                                    Read Details &rarr;
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
