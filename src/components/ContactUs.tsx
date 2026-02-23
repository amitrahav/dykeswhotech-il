import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import lips from "../assets/lips.png";

export function ContactUs() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setStatus("idle");

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email }),
            });

            if (!res.ok) throw new Error("Failed");
            setStatus("success");
            setName("");
            setEmail("");
        } catch {
            setStatus("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="w-full text-white overflow-hidden" style={{ background: '#FF66E0' }}>
            <div className="max-w-7xl mx-auto py-24 px-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 justify-between gap-12 md:gap-16 lg:gap-24">

                    {/* Left Column: Text + Form */}
                    <div className="flex flex-col justify-between text-left py-8 md:py-16">
                        <p
                            className="text-2xl md:text-4xl leading-tight m-0 p-0 mb-8 md:mb-0 font-telaviv"
                            style={{
                                fontWeight: 300,
                                textTransform: 'none'
                            }}
                        >
                            Join DykesWhoTech &  shape the future of Tech!
                        </p>

                        <form onSubmit={handleSubmit} className="w-full flex flex-col items-start gap-4 md:gap-6">
                            <div className="w-full flex-1">
                                <input
                                    type="text"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-6 py-4 md:py-5 rounded-2xl bg-white/40 border-none placeholder-white/80 text-black focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg md:text-xl"
                                    style={{ borderRadius: '18px' }}
                                    required
                                />
                            </div>

                            <div className="w-full flex-1" style={{ position: 'relative' }}>
                                <input
                                    type="email"
                                    placeholder="mail@outlook.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-6 py-4 md:py-5 pr-28 md:pr-32 rounded-2xl bg-white/40 border-none placeholder-white/80 text-black focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg md:text-xl"
                                    style={{ borderRadius: '18px' }}
                                    required
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    aria-busy={loading}
                                    aria-label={loading ? "Sending message" : "Send message"}
                                    className="absolute bg-[#8D6BE4] hover:bg-[#7a59d1] disabled:opacity-60 text-white font-semibold text-base md:text-lg flex items-center justify-center transition-all z-20"
                                    style={{
                                        position: 'absolute',
                                        right: '8px',
                                        top: '8px',
                                        bottom: '8px',
                                        padding: '0 16px 0 24px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        cursor: loading ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {loading ? "Sending…" : <><span>Send</span> <SendHorizontal className="ml-1 md:ml-2 w-5 h-5" /></>}
                                </button>
                            </div>
                        </form>
                        <div aria-live="polite" aria-atomic="true">
                            {status === "success" && (
                                <p className="mt-4 text-white font-semibold text-base">
                                    You're in! Check your inbox for a confirmation.
                                </p>
                            )}
                            {status === "error" && (
                                <p className="mt-4 text-white/80 text-base">
                                    Something went wrong. Please try again.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Lips image */}
                    <div className="w-full flex justify-center md:justify-end overflow-visible">
                        <div className="w-64 md:w-96 flex-shrink-0 transform scale-125 md:scale-150">
                            <img
                                src={lips}
                                alt="Lips"
                                className="w-full h-auto object-contain origin-center md:origin-right"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
