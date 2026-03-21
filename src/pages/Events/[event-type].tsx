import { useParams, Link } from "react-router-dom";
import { useContent } from "../../contexts/ContentContext";
import { parseEventDate } from "../../lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PageHero } from "../../components/PageHero";
import { Card, CardTitle } from "../../components/ui/card";
import xoxo from "../../assets/xoxo.png";
import demeterSwag from "../../assets/Demeter-swag.png";
import { Button } from "../../components/ui/button";
import { RegisterModal } from "../../components/RegisterModal";
import { useOrgLogos } from "../../hooks/useOrgLogos";
import { useState } from "react";


function OrgLogoCarousel({ organizationIds = [], organizations = [], orgLogos = {} }: { organizationIds?: string[], organizations?: any[], orgLogos?: any }) {
    const filteredIds = organizationIds.filter(id => {
        const org = organizations?.find((o: any) => o.id === id);
        return org && org.logoId && orgLogos[org.logoId];
    });

    const [currentPage, setCurrentPage] = useState(0);
    const totalPages = filteredIds.length;

    const scroll = (direction: 'left' | 'right') => {
        let nextPage = direction === 'left' ? currentPage - 1 : currentPage + 1;
        if (nextPage < 0) nextPage = 0;
        if (nextPage >= totalPages) nextPage = totalPages - 1;
        setCurrentPage(nextPage);
    };

    if (filteredIds.length === 0) return null;

    const currentOrg = organizations?.find((o: any) => o.id === filteredIds[currentPage]);

    return (
        <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full mb-0 overflow-visible flex flex-col items-center"
        >
            <div className="relative group/carousel w-full flex items-center justify-center">
                {currentPage > 0 && (
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('left'); }}
                        className="absolute left-[-20px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-primary hover:text-white transition-all duration-300 active:scale-95"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                <div className="w-[150px] h-[120px] overflow-hidden flex items-center justify-start relative mx-auto">
                    <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${currentPage * 150}px)` }}
                    >
                        {filteredIds.map((orgId: string) => {
                            const org = organizations?.find((o: any) => o.id === orgId);
                            const logo = org?.logoId ? orgLogos[org.logoId] : null;

                            return (
                                <div
                                    key={orgId}
                                    className="w-[150px] h-[120px] flex items-center justify-center shrink-0"
                                >
                                    <div className="w-24 h-24 bg-[#F8F9FA] border-2 border-gray-100 rounded-[2rem] flex items-center justify-center p-4 shadow-lg overflow-hidden">
                                        <img src={logo.url} className="w-full h-full object-contain" alt={org.name} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {currentPage < totalPages - 1 && (
                    <button
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); scroll('right'); }}
                        className="absolute right-[-20px] top-1/2 -translate-y-1/2 z-20 bg-white shadow-lg border border-gray-100 rounded-full p-2 hover:bg-primary hover:text-white transition-all duration-300 active:scale-95"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}
            </div>

            {/* Info Text */}
            <div className="mt-2 flex flex-col items-center gap-1 w-full justify-center px-4">
                <p className="text-[#293744] font-black text-[12px] uppercase tracking-tight leading-tight text-center w-full truncate" title={currentOrg?.name}>
                    {currentOrg?.name}
                </p>
                {totalPages > 1 && (
                    <p className="text-gray-400 font-bold text-[10px] mt-1">
                        {currentPage + 1} of {totalPages}
                    </p>
                )}
            </div>
        </div>
    );
}


export function EventArchive() {
    const { eventType: eventTypeSlug } = useParams<{ eventType: string }>();
    const { content } = useContent();
    const { events: eventsData } = content;
    const { global: globalContent, categories, events, organizations } = eventsData as any;
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

    const eventType = categories?.find((t: any) => t.id === eventTypeSlug);

    const allOrgLogos = Array.from(new Set(organizations?.map((o: any) => o.logoId).filter(Boolean))) as string[];
    const { logos: orgLogos } = useOrgLogos(allOrgLogos);

    if (!eventType) {
        return <div className="min-h-screen flex items-center justify-center text-white">Event type not found</div>;
    }

    const pastEvents = events?.filter((e: any) => e.typeId === eventTypeSlug && parseEventDate(e.date) <= Date.now()) || [];
    const upcomingEvent = events?.find((e: any) => e.typeId === eventTypeSlug && parseEventDate(e.date) > Date.now());


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
                    backgroundPosition: 'center bottom',
                    backgroundSize: '100% auto',
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

            {upcomingEvent && globalContent?.displayUpcoming && (
                <div className="relative z-10 w-full bg-[#8A5CF5] mb-32 py-[60px]">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">

                        {/* Title */}
                        <h2
                            className="text-4xl md:text-5xl lg:text-[64px] font-bold leading-tight mb-[60px] tracking-tight"
                            style={{ fontFamily: 'Montserrat, sans-serif', color: '#F5F1FD' }}
                        >
                            Upcoming - {upcomingEvent.title}
                        </h2>

                        {/* Metadata columns */}
                        <div className="flex flex-wrap gap-y-8 gap-x-[86px] mb-[60px]">
                            <div className="flex flex-col gap-0 min-w-[140px]">
                                <p className="font-montserrat font-normal text-xl md:text-[28px] leading-[48px]" style={{ color: 'rgba(245,241,253,0.7)' }}>What:</p>
                                <h3 className="font-telaviv font-normal text-3xl md:text-[40px] leading-[48px] uppercase" style={{ color: '#F5F1FD' }}>{upcomingEvent.title}</h3>
                            </div>
                            <div className="flex flex-col gap-0 min-w-[140px]">
                                <p className="font-montserrat font-normal text-xl md:text-[28px] leading-[48px]" style={{ color: 'rgba(245,241,253,0.7)' }}>When:</p>
                                <h3 className="font-telaviv font-normal text-3xl md:text-[40px] leading-[48px] uppercase" style={{ color: '#F5F1FD' }}>{upcomingEvent.date}</h3>
                            </div>
                            <div className="flex flex-col gap-0 min-w-[160px]">
                                <p className="font-montserrat font-normal text-xl md:text-[28px] leading-[48px]" style={{ color: 'rgba(245,241,253,0.7)' }}>Where:</p>
                                <h3 className="font-telaviv font-normal text-3xl md:text-[40px] leading-[48px] uppercase" style={{ color: '#F5F1FD' }}>{upcomingEvent.location}</h3>
                            </div>
                        </div>

                        {/* Register button */}
                        <Button
                            onClick={() => setIsRegisterModalOpen(true)}
                            className="bg-[#85F2AA] hover:bg-[#7AE39B] text-[#0B4F2B] font-bold rounded-full h-[48px] px-8 text-base tracking-wide transition-all hover:scale-105 active:scale-95 uppercase"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                        >
                            Register
                        </Button>
                    </div>
                </div>
            )}

            {isRegisterModalOpen && upcomingEvent && (
                <RegisterModal
                    event={{
                        title: upcomingEvent.title,
                        date: upcomingEvent.date,
                        location: upcomingEvent.location,
                        collaboration: upcomingEvent.collaboration,
                        tallyId: upcomingEvent.tallyId
                    }}
                    onClose={() => setIsRegisterModalOpen(false)}
                />
            )}

            {pastEvents.length > 0 && (
                <div className="px-6 md:px-12 lg:px-20 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-5xl md:text-8xl font-bold mb-8 text-[#293744] font-montserrat tracking-tighter">
                            Blast from the past
                        </h2>
                        <p className="text-gray-600 max-w-5xl mb-24 text-xl md:text-2xl font-medium leading-relaxed">
                            No explanations needed: Creating events and meetups where our identity is the default, not something we have to justify or explain.
                        </p>                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                            {pastEvents.map((pastEvent: any, index: number) => (
                                <Link key={index} to={`/events/${eventTypeSlug}/${pastEvent.id}`} className="h-full block">
                                    <Card className="bg-white border-0 text-black overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.1)] rounded-[2.5rem] flex flex-col h-full hover:translate-y-[-12px] transition-all duration-500 group">
                                        <div className="p-8 pb-5 flex flex-col gap-2">
                                            <div className="inline-block w-fit px-3 py-1 bg-[#1DFF87] text-[#293744] text-[12px] font-black rounded-lg uppercase tracking-widest mb-2 shadow-sm">
                                                {new Date(parseEventDate(pastEvent.date)).getFullYear()}
                                            </div>
                                            <CardTitle className="text-2xl font-black leading-none mb-1 group-hover:text-primary transition-colors">{pastEvent.title}</CardTitle>
                                            <p className="text-gray-500 text-base font-bold tracking-tight">{pastEvent.location}</p>
                                        </div>

                                        <div className="relative aspect-[16/11] w-full overflow-hidden border-y border-gray-50">
                                            {pastEvent.image && (
                                                <img
                                                    src={pastEvent.image}
                                                    alt={pastEvent.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                />
                                            )}
                                        </div>

                                        <div className="p-8 pb-6 flex-grow flex flex-col justify-between bg-white pt-2">
                                            <OrgLogoCarousel
                                                organizationIds={pastEvent.organizationIds}
                                                organizations={organizations}
                                                orgLogos={orgLogos}
                                            />
                                            <p className="text-sm text-gray-500 leading-relaxed pt-6 border-t border-gray-100 font-semibold italic truncate w-full" title={pastEvent.description}>
                                                {pastEvent.description}
                                            </p>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
