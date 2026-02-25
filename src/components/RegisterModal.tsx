import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

// ── Notebook grid (same as Events.tsx) ──────────────────────────
const NotebookGrid = () => {
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
                        stroke="rgba(96,118,132,0.2)" strokeWidth="0.9"
                        style={{ opacity: 0, animation: `fadeIn 1.5s ease-out ${i * 0.04}s forwards` }} />
                ))}
                {Array.from({ length: vLines }).map((_, i) => (
                    <line key={`v-${i}`} x1={i * squareSize} y1="0" x2={i * squareSize} y2={height}
                        stroke="rgba(96,118,132,0.2)" strokeWidth="0.9"
                        style={{ strokeDasharray: height, strokeDashoffset: height, animation: `drawLine 1.5s ease-out ${i * 0.04}s forwards` }} />
                ))}
            </svg>
        </div>
    );
};

// ── Tally embed loader ───────────────────────────────────────────
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

// ── Types ────────────────────────────────────────────────────────
export interface RegisterModalEvent {
    title: string;
    date: string;
    location: string;
    collaboration?: string;
    tallyId: string;
}

interface RegisterModalProps {
    event: RegisterModalEvent | null;
    onClose: () => void;
}

// ── Component ────────────────────────────────────────────────────
export function RegisterModal({ event, onClose }: RegisterModalProps) {
    useTallyEmbed(event?.tallyId);

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    if (!event) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 overflow-y-auto"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={onClose}
        >
            {/* Card */}
            <div
                className="relative w-full max-w-4xl rounded-2xl overflow-hidden border-2 border-[#3d4f5e] my-auto"
                style={{ backgroundColor: "#293744" }}
                onClick={e => e.stopPropagation()}
            >
                {/* Animated notebook grid background */}
                <NotebookGrid />

                {/* Close button */}
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-9 h-9 flex items-center justify-center rounded-full text-white/50 hover:text-white hover:bg-white/10 text-xl leading-none transition-all cursor-pointer"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Content */}
                <div className="relative z-10 px-8 md:px-12 lg:px-16 pt-12 pb-10">

                    {/* Eyebrow label */}
                    <span className="text-xs font-black uppercase tracking-widest text-[#85F2AA] mb-4 block">
                        Register
                    </span>

                    {/* Title */}
                    <h2
                        className="text-4xl md:text-5xl font-telaviv text-white uppercase leading-tight mb-10"
                    >
                        {event.title}
                    </h2>

                    {/* Metadata row — What / When / Where / Collaboration */}
                    <div
                        className="flex flex-wrap gap-y-6 gap-x-12 mb-10 pb-10 border-b border-white/10"
                    >
                        <div className="flex flex-col gap-0 min-w-[100px]">
                            <p className="font-montserrat font-normal text-sm md:text-base leading-6"
                                style={{ color: 'rgba(245,241,253,0.55)' }}>What:</p>
                            <h3 className="font-telaviv font-normal text-xl md:text-2xl leading-7 uppercase"
                                style={{ color: '#F5F1FD' }}>{event.title}</h3>
                        </div>
                        <div className="flex flex-col gap-0 min-w-[100px]">
                            <p className="font-montserrat font-normal text-sm md:text-base leading-6"
                                style={{ color: 'rgba(245,241,253,0.55)' }}>When:</p>
                            <h3 className="font-telaviv font-normal text-xl md:text-2xl leading-7 uppercase"
                                style={{ color: '#F5F1FD' }}>{event.date}</h3>
                        </div>
                        <div className="flex flex-col gap-0 min-w-[100px]">
                            <p className="font-montserrat font-normal text-sm md:text-base leading-6"
                                style={{ color: 'rgba(245,241,253,0.55)' }}>Where:</p>
                            <h3 className="font-telaviv font-normal text-xl md:text-2xl leading-7 uppercase"
                                style={{ color: '#F5F1FD' }}>{event.location}</h3>
                        </div>
                        {event.collaboration && (
                            <div className="flex flex-col gap-0 min-w-[100px]">
                                <p className="font-montserrat font-normal text-sm md:text-base leading-6"
                                    style={{ color: 'rgba(245,241,253,0.55)' }}>With:</p>
                                <h3 className="font-telaviv font-normal text-xl md:text-2xl leading-7 uppercase"
                                    style={{ color: '#F5F1FD' }}>{event.collaboration}</h3>
                            </div>
                        )}
                    </div>

                    {/* Tally form */}
                    <div className="w-full">
                        <iframe
                            data-tally-src={`https://tally.so/embed/${event.tallyId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1`}
                            loading="lazy"
                            width="100%"
                            title={`Register for ${event.title}`}
                        />
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
