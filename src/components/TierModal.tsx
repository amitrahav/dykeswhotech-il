import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowUpRight } from "lucide-react";
import heartBackground from "../assets/xoxo.png";

type FormStatus = "idle" | "submitting" | "success" | "error";

interface TierModalProps {
    tier: { name: string; price: string } | null;
    onClose: () => void;
}

export function TierModal({ tier, onClose }: TierModalProps) {
    const [form, setForm] = useState({ fullName: "", company: "", email: "", phone: "" });
    const [status, setStatus] = useState<FormStatus>("idle");
    const [errorMsg, setErrorMsg] = useState("");

    const sent = status === "success";

    useEffect(() => {
        const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => { document.body.style.overflow = ""; };
    }, []);

    if (!tier) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");
        setErrorMsg("");

        try {
            const res = await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    fullName: form.fullName,
                    company: form.company,
                    email: form.email,
                    phone: form.phone || undefined,
                    tierName: tier.name,
                    tierPrice: tier.price,
                }),
            });

            // Log raw status so it's visible in browser DevTools even if JSON parse fails
            console.log("[send-email] status:", res.status, res.statusText);

            const contentType = res.headers.get("content-type") ?? "";
            const isJson = contentType.includes("application/json");

            if (!res.ok) {
                const errorBody = isJson
                    ? await res.json().catch(() => ({}))
                    : { error: `Server returned ${res.status} ${res.statusText}` };
                console.error("[send-email] error response:", errorBody);
                throw new Error(errorBody?.error || `Request failed (${res.status})`);
            }

            setStatus("success");
        } catch (err: unknown) {
            console.error("[send-email] fetch error:", err);
            const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
            setErrorMsg(message);
            setStatus("error");
        }
    };

    const isSubmitting = status === "submitting";

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl rounded-2xl overflow-hidden border-2 border-[#293744]"
                style={{ backgroundColor: "#582c99" }}
                onClick={e => e.stopPropagation()}
            >
                {/* ── FORM STATE decorations ── */}

                {/* Heart-shaped background — left side */}
                <img
                    src={heartBackground}
                    alt=""
                    className="absolute top-1/2 left-0 -translate-y-1/2 h-[90%] w-auto object-contain object-left pointer-events-none mix-blend-plus-lighter"
                    style={{ opacity: sent ? 0 : 0.5, transition: "opacity 0.6s ease" }}
                />

                {/* ── SUCCESS STATE decorations ── */}

                {/* Vi checkmark — large, fills card background */}
                <img
                    src="/assets/vi"
                    alt=""
                    className="absolute inset-0 w-full h-full object-contain pointer-events-none mix-blend-plus-lighter"
                    style={{ opacity: sent ? 0.4 : 0, transition: "opacity 0.6s ease" }}
                />

                {/* Close button */}
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onClose(); }}
                    className="absolute top-4 right-4 z-50 text-white/60 hover:text-white text-2xl leading-none font-light transition-colors cursor-pointer"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Main content */}
                <div className="relative z-10 flex flex-col items-center text-center px-8 md:px-16 py-12 md:py-14 gap-8">

                    {/* Selected tier label — always visible */}
                    <p className="font-heading font-normal text-white text-base md:text-xl opacity-90 w-full">
                        Selected tier:{" "}
                        <span className="font-semibold">{tier.name} – {tier.price}</span>
                    </p>

                    {!sent ? (
                        <>
                            <div className="flex flex-col gap-3 w-full">
                                <p className="font-heading font-extrabold text-white text-2xl md:text-4xl leading-tight">
                                    Great choice. Let's make it happen
                                </p>
                                <p className="font-heading font-light text-white text-base md:text-xl opacity-90 max-w-xl mx-auto">
                                    Leave your details below and our team will reach out shortly to activate your partnership
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="w-full max-w-lg flex flex-col gap-4">
                                <div className="flex flex-col gap-1.5 items-start">
                                    <label className="font-heading font-bold text-[#c8aef4] text-sm">Full Name</label>
                                    <input required type="text" value={form.fullName}
                                        disabled={isSubmitting}
                                        onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                                        className="w-full h-11 rounded-lg px-3 bg-[#e3fcef] text-[#1a1a2e] font-heading text-sm outline-none focus:ring-2 focus:ring-[#8a5cf5] disabled:opacity-60" />
                                </div>
                                <div className="flex flex-col gap-1.5 items-start">
                                    <label className="font-heading font-bold text-[#c8aef4] text-sm">Company</label>
                                    <input required type="text" value={form.company}
                                        disabled={isSubmitting}
                                        onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                                        className="w-full h-11 rounded-lg px-3 bg-[#e3fcef] text-[#1a1a2e] font-heading text-sm outline-none focus:ring-2 focus:ring-[#8a5cf5] disabled:opacity-60" />
                                </div>
                                <div className="flex flex-col gap-1.5 items-start">
                                    <label className="font-heading font-bold text-[#c8aef4] text-sm">Email</label>
                                    <input required type="email" value={form.email}
                                        disabled={isSubmitting}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full h-11 rounded-lg px-3 bg-[#e3fcef] text-[#1a1a2e] font-heading text-sm outline-none focus:ring-2 focus:ring-[#8a5cf5] disabled:opacity-60" />
                                </div>
                                <div className="flex flex-col gap-1.5 items-start">
                                    <label className="font-heading font-bold text-[#c8aef4] text-sm">Phone</label>
                                    <input type="tel" value={form.phone}
                                        disabled={isSubmitting}
                                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                                        className="w-full h-11 rounded-lg px-3 bg-[#e3fcef] text-[#1a1a2e] font-heading text-sm outline-none focus:ring-2 focus:ring-[#8a5cf5] disabled:opacity-60" />
                                </div>

                                {/* Error message */}
                                {status === "error" && (
                                    <p className="text-red-300 text-sm font-heading text-center">
                                        {errorMsg}
                                    </p>
                                )}

                                <div className="flex justify-center mt-2">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex items-center gap-3 bg-[#2ee66b] hover:bg-[#22d460] disabled:opacity-70 disabled:cursor-not-allowed text-white font-sans font-semibold text-lg px-10 py-4 rounded-full transition-colors cursor-pointer"
                                    >
                                        {isSubmitting ? "Sending…" : "SEND"}
                                        {!isSubmitting && (
                                            <ArrowUpRight className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-6 py-10">
                            {/* Purple six flower from public assets */}
                            <img
                                src="/assets/Purple six flower.svg"
                                alt=""
                                className="w-32 h-32 object-contain"
                            />
                            <div className="flex flex-col gap-3 text-center">
                                <p className="font-heading font-extrabold text-white text-2xl md:text-4xl leading-tight">
                                    You're in - Let's build impact
                                </p>
                                <p className="font-heading font-light text-white/90 text-base md:text-xl max-w-xl mx-auto">
                                    Leave your details below and our team will reach out shortly to activate your partnership
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="bg-[#2ee66b] hover:bg-[#22d460] text-white font-heading font-bold px-12 py-4 rounded-full text-lg transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
