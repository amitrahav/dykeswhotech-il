import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef, type JSXElementConstructor, type Key, type ReactElement, type ReactNode, type ReactPortal } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink } from "lucide-react";
import { useContent } from "../../contexts/ContentContext";
import { Button } from "../../components/ui/button";
import { RegisterModal } from "../../components/RegisterModal";
import { PageHero } from "../../components/PageHero";
import { CloudinaryGallery } from "../../components/CloudinaryGallery";
import demeterSwag from "../../assets/Demeter-swag.png";
import { useOrgLogos } from "../../hooks/useOrgLogos";


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
    const { eventType: eventTypeSlug, singularEvent: singularEventSlug } = useParams<{ eventType: string; singularEvent: string }>();
    const { content } = useContent();
    const { events: eventsData } = content;
    const { events, organizations: allOrganizations = [], projects: allProjects = [] } = eventsData as any;
    const [registerOpen, setRegisterOpen] = useState(false);

    // Find the single event from JSON
    const singleEvent = events?.find(
        (e: any) => e.typeId === eventTypeSlug && e.id === singularEventSlug
    );

    // Resolve organizations for this event from root-level lookup
    const eventOrgsRaw: Organization[] = (singleEvent?.organizationIds ?? []).map((id: string) => {
        const org = allOrganizations.find((o: any) => o.id === id);
        if (!org) return null;
        const projects: OrgProject[] = allProjects.filter((p: any) => p.orgId === id);
        return { ...org, projects };
    }).filter(Boolean);

    const logoIdsToFetch = Array.from(new Set(eventOrgsRaw.map((o) => o.logoId).filter(Boolean))) as string[];
    const { logos: orgLogos } = useOrgLogos(logoIdsToFetch);

    const eventOrgs = eventOrgsRaw.map(org => ({
        ...org,
        logoUrl: org.logoId ? orgLogos[org.logoId]?.url : undefined
    }));

    useTallyEmbed(singleEvent?.tallyId);

    if (!singleEvent) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5F5F5] gap-6">
                <h1 className="text-4xl font-telaviv text-[#293744]">Event not found</h1>
                <Link to={`/events/${eventTypeSlug}`}>
                    <Button className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all">← Back to events</Button>
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
                                    <p>{singleEvent.about}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Illustration */}
                    <div className="lg:w-2/5 w-full flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-[414px] bg-transparent overflow-hidden hover:scale-[1.02] transition-transform duration-500 flex justify-center items-center">
                            <img
                                src={demeterSwag}
                                alt="Demeter Swag Statue"
                                className="w-full h-auto object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Registration CTA if open */}
                {singleEvent.registrationOpen && (
                    <div className="max-w-7xl mx-auto mt-12 px-0">
                        <Button
                            onClick={() => setRegisterOpen(true)}
                            className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        >
                            Register now
                        </Button>
                    </div>
                )}
            </section>

            {/* ═══════════════════════════════════════
                 PARTNERS SECTION
            ═══════════════════════════════════════ */}
            {singleEvent.partners && singleEvent.partners.length > 0 && (
                <section className="relative z-10 py-10 border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
                        {singleEvent.partners.map(({ logoUrl, name }: { logoUrl: string; name: string }) => (
                            <PartnerLogo key={name} src={logoUrl} name={name} />
                        ))}
                    </div>
                </section>
            )}


            {/* ═══════════════════════════════════════
                 ORGANIZATIONS SECTION
            ═══════════════════════════════════════ */}
            {eventOrgs.length > 0 && (
                <OrganizationsSection organizations={eventOrgs} />
            )}

            {/* ═══════════════════════════════════════
                 GALLERY SECTION
            ═══════════════════════════════════════ */}
            {singleEvent.galleryTag && (
                <section className="relative z-10 bg-[#F5F5F5] px-6 md:px-12 lg:px-20 py-16 md:py-20">
                    <div className="max-w-7xl mx-auto">
                        <CloudinaryGallery galleryTag={singleEvent.galleryTag} />
                    </div>
                </section>
            )}


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

                <div className="relative z-20 px-6 md:px-12 lg:px-20 py-24 md:py-32">
                    <div className="max-w-7xl mx-auto min-h-[50vh] flex flex-row items-end gap-4 md:gap-0">
                        {/* Hestia — Beside content */}
                        <div className="w-1/3 md:w-[22rem] lg:w-[28rem] flex-shrink-0 pointer-events-none">
                            <img
                                src="/assets/Hestia-standing.png"
                                alt="Hestia"
                                className="h-[20rem] md:h-[42rem] object-contain object-bottom drop-shadow-2xl"
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1">

                        <span className="text-xs font-black uppercase tracking-widest text-primary mb-4 block">Results</span>
                        <h2 className="text-4xl md:text-6xl font-telaviv text-[#293744] uppercase leading-tight mb-6">
                            Final outcome
                        </h2>
                        <p className="text-gray-600 font-poppins text-lg leading-relaxed mb-14 max-w-2xl">
                            {singleEvent.about?.[singleEvent.about.length - 1] || "An incredible day of building, connecting, and creating real impact for the community."}
                        </p>

                        {/* Top 3 project cards */}
                        {singleEvent.tracks && singleEvent.tracks.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
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
            </div>

                {/* Hearts background — xoxo technique: screen blend, bottom-anchored */}
                <div id="haze"
                    className="absolute bottom-0 left-0 z-0 pointer-events-none rounded-full bg-[#FEB5FF] transform translate-y-1/2 -translate-x-1/3 h-[70rem] w-[70rem] blur-xl"></div>

                <div
                    className="absolute inset-x-0 bottom-0 w-full h-[20rem] pointer-events-none z-10 mix-blend-screen opacity-40"
                    style={{
                        filter: 'brightness(100)',
                        backgroundImage: `url(/assets/hearts.png)`,
                        backgroundPosition: 'center bottom',
                        backgroundSize: 'auto auto',
                        backgroundRepeat: 'no-repeat',
                        backgroundBlendMode: 'screen',
                    }}
                />


            </section>

            {/* ═══════════════════════════════════════
                BOTTOM BACK LINK
            ═══════════════════════════════════════ */}
            <div className="relative z-10 bg-[#F5F5F5] px-6 md:px-12 lg:px-20 py-16 text-center border-t border-gray-200">
                <Link to={`/events/${eventTypeSlug}`}>
                    <Button className="rounded-full bg-[#293744] text-white font-semibold px-8 py-3 hover:bg-[#1e2a33] hover:scale-105 active:scale-95 transition-all">
                        ← All {(eventTypeSlug as string).replace(/-/g, ' ')} events
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

// ────────────────────────────────────────────────────────────────
// Types
// ────────────────────────────────────────────────────────────────
interface OrgProject {
    title: string;
    description: string;
    links: { title: string; url: string }[];
    participants: { name: string; linkedin: string }[];
    presentationUrl?: string;
}

interface Organization {
    id: string;
    name: string;
    logoId: string;
    logoUrl?: string;
    about: string;
    website?: string;
    projects: OrgProject[];
}

// ────────────────────────────────────────────────────────────────
// Embed URL helpers
// ────────────────────────────────────────────────────────────────
function getEmbedUrl(url: string): string | null {
    // Google Slides: extract presentation ID and return embed URL
    const slidesMatch = url.match(/\/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (slidesMatch) {
        return `https://docs.google.com/presentation/d/${slidesMatch[1]}/embed?start=false&loop=false&delayms=5000`;
    }
    // Canva: convert view URL to embed URL
    const canvaMatch = url.match(/canva\.com\/design\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)\//);
    if (canvaMatch) {
        return `https://www.canva.com/design/${canvaMatch[1]}/${canvaMatch[2]}/view?embed`;
    }
    return null;
}

// ────────────────────────────────────────────────────────────────
// Project popup modal
// ────────────────────────────────────────────────────────────────
function ParticipantAvatar({ name, linkedin }: { name: string; linkedin?: string }) {
    const initials = name.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
    const colors = ["bg-purple-100 text-purple-700", "bg-pink-100 text-pink-700", "bg-blue-100 text-blue-700",
        "bg-green-100 text-green-700", "bg-yellow-100 text-yellow-700", "bg-orange-100 text-orange-700"];
    const color = colors[name.charCodeAt(0) % colors.length];
    const inner = (
        <span className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${color}`}>
            {initials}
        </span>
    );
    if (linkedin) {
        return (
            <a href={linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-sm hover:border-blue-400 hover:text-blue-700 transition-colors"
                title={name}
            >
                {inner}
                <span>{name}</span>
                <ExternalLink size={11} className="opacity-50" />
            </a>
        );
    }
    return (
        <span className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 text-gray-700 text-sm">
            {inner}
            <span>{name}</span>
        </span>
    );
}

function ProjectPopup({ project, org, onClose }: { project: OrgProject; org: Organization; onClose: () => void }) {
    const [orgLogoFailed, setOrgLogoFailed] = useState(false);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handler);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handler);
            document.body.style.overflow = "";
        };
    }, [onClose]);

    const presentationUrl = project.presentationUrl || project.links?.find(l => l.url)?.url || null;
    const embedUrl = presentationUrl ? getEmbedUrl(presentationUrl) : null;
    const hasParticipants = project.participants?.some(p => p.name);

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md px-4 py-6"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto relative flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header: org + project name ── */}
                <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-4 min-w-0">
                        {/* Org logo → links to website */}
                        {org.website ? (
                            <a href={org.website} target="_blank" rel="noopener noreferrer"
                                className="flex-shrink-0 hover:opacity-80 transition-opacity"
                                title={org.name}
                            >
                                {org.logoUrl && !orgLogoFailed ? (
                                    <img src={org.logoUrl} alt={org.name} onError={() => setOrgLogoFailed(true)}
                                        className="h-10 max-w-[80px] object-contain" />
                                ) : (
                                    <span className="text-sm font-bold text-gray-600">{org.name}</span>
                                )}
                            </a>
                        ) : (
                            <div className="flex-shrink-0">
                                {org.logoUrl && !orgLogoFailed ? (
                                    <img src={org.logoUrl} alt={org.name} onError={() => setOrgLogoFailed(true)}
                                        className="h-10 max-w-[80px] object-contain" />
                                ) : (
                                    <span className="text-sm font-bold text-gray-600">{org.name}</span>
                                )}
                            </div>
                        )}
                        <div className="min-w-0">
                            <div className="text-xs text-gray-400 font-medium mb-0.5 truncate">{org.name}</div>
                            <h3 className="text-xl font-telaviv text-[#293744] uppercase leading-tight">{project.title}</h3>
                        </div>
                    </div>
                    <button onClick={onClose} aria-label="Close"
                        className="text-gray-400 hover:text-gray-700 transition-colors ml-4 mt-1 flex-shrink-0">
                        <X size={20} />
                    </button>
                </div>

                {/* ── About the organization ── */}
                {org.about && (
                    <div className="px-6 pt-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">About {org.name}</div>
                        <p className="text-gray-600 font-poppins text-sm leading-relaxed">{org.about}</p>
                    </div>
                )}

                {/* ── Embedded presentation ── */}
                {embedUrl && (
                    <div className="w-full bg-gray-100 mt-4" style={{ aspectRatio: "16/9" }}>
                        <iframe src={embedUrl} className="w-full h-full" allowFullScreen
                            title={project.title} allow="autoplay" />
                    </div>
                )}

                {/* ── Body ── */}
                <div className="p-6 space-y-5">
                    {presentationUrl && !embedUrl && (
                        <a href={presentationUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#293744] hover:underline">
                            View presentation <ExternalLink size={13} />
                        </a>
                    )}

                    {project.description && (
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">About the project</div>
                            <p className="text-gray-600 font-poppins text-sm leading-relaxed">{project.description}</p>
                        </div>
                    )}

                    {hasParticipants && (
                        <div>
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Team</div>
                            <div className="flex flex-wrap gap-2">
                                {project.participants.filter(p => p.name).map((p, i) => (
                                    <ParticipantAvatar key={i} name={p.name} linkedin={p.linkedin} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        , document.body);
}

// ────────────────────────────────────────────────────────────────
// Single org card with tooltip
// ────────────────────────────────────────────────────────────────
function OrgCard({ org }: { org: Organization }) {
    const [tooltipVisible, setTooltipVisible] = useState(false);
    const [activeProject, setActiveProject] = useState<OrgProject | null>(null);
    const [imgFailed, setImgFailed] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <div
                ref={cardRef}
                className="relative flex flex-col items-center"
                onMouseEnter={() => setTooltipVisible(true)}
                onMouseLeave={() => setTooltipVisible(false)}
            >
                {/* Logo / name */}
                <div className="flex items-center justify-center h-12 px-2 cursor-default">
                    {org.logoUrl && !imgFailed ? (
                        <img
                            src={org.logoUrl}
                            alt={org.name}
                            className="h-24 max-h-[70px] object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
                            onError={() => setImgFailed(true)}
                        />
                    ) : (
                        <span className="text-sm font-bold text-gray-500 tracking-tight hover:text-gray-800 transition-colors">{org.name}</span>
                    )}
                </div>

                {/* Tooltip */}
                {tooltipVisible && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[520px] bg-white rounded-xl shadow-2xl border border-gray-100 p-4 z-30 pointer-events-auto flex flex-col gap-4"
                        onMouseEnter={() => setTooltipVisible(true)}
                        onMouseLeave={() => setTooltipVisible(false)}
                    >
                        {org.logoUrl && !imgFailed ? (
                            <img src={org.logoUrl} alt={org.name} onError={() => setImgFailed(true)}
                                className="h-auto w-auto object-conatins align-center justify-center" />
                        ) : null}
                        {/* Arrow */}
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
                        {/* Left: logo, name, about, website */}
                        <div className="flex flex-row gap-4">
                            <div className="flex-1 min-w-0 flex flex-col gap-2">
                                <div className="text-xs font-black uppercase tracking-widest text-gray-400">{org.name}</div>
                                {org.about && (
                                    <p className="text-gray-600 text-xs leading-relaxed">{org.about}</p>
                                )}
                                {org.website && (
                                    <a
                                        href={org.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors mt-auto"
                                    >
                                        Visit website <ExternalLink size={10} />
                                    </a>
                                )}
                            </div>

                            {/* Divider */}
                            {org.projects && org.projects.length > 0 && (
                                <div className="w-px bg-gray-100 self-stretch flex-shrink-0" />
                            )}

                            {/* Right: projects */}
                            {org.projects && org.projects.length > 0 && (
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Projects</div>
                                    <ul className="space-y-1">
                                        {org.projects.map((project, i) => {
                                            const hasPresentation = Boolean(project.presentationUrl || project.links?.some(l => l.url));
                                            return (
                                                <li key={i}>
                                                    {hasPresentation ? (
                                                        <button
                                                            onClick={() => setActiveProject(project)}
                                                            className="text-sm text-[#293744] font-medium hover:text-purple-600 hover:underline text-left transition-colors w-full"
                                                        >
                                                            → {project.title}
                                                        </button>
                                                    ) : (
                                                        <div className="text-sm text-[#293744] font-medium text-left w-full cursor-default">
                                                            → {project.title}
                                                        </div>
                                                    )}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            )}
                        </div>


                    </div>
                )}
            </div>

            {activeProject && (
                <ProjectPopup
                    project={activeProject}
                    org={org}
                    onClose={() => setActiveProject(null)}
                />
            )}
        </>
    );
}

// ────────────────────────────────────────────────────────────────
// Organizations section
// ────────────────────────────────────────────────────────────────
function OrganizationsSection({ organizations }: { organizations: Organization[] }) {
    return (
        <section className="relative z-10 py-10">
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-wrap justify-center items-center gap-x-12 gap-y-4">
                {organizations.map((org) => (
                    <OrgCard key={org.id} org={org} />
                ))}
            </div>
        </section>
    );
}
