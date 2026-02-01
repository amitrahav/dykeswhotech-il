import { Button } from "./ui/button";
import { StarIcon } from "lucide-react"; // Examples for logos

export function Support() {
    return (
        <section className="py-20 md:py-32 px-4 bg-[#8D6BE4] text-white text-center relative overflow-hidden rounded-[23px] rounded-b-[0px]">
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#8D6BE4] to-[#9F7AEA] opacity-50"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-2" style={{ fontFamily: 'Tel Aviv', fontWeight: 900 }}>Become a sponsor</h2>
                <h3 className="text-2xl md:text-3xl font-extrabold text-[#FF66E0] mb-8" style={{ fontFamily: 'Tel Aviv', fontWeight: 900 }}>Join our proud partners</h3>

                <p className="max-w-2xl mx-auto mb-12 text-base md:text-lg opacity-90 leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}>
                    Our community grows thanks to the passion and time of volunteers. However, to keep producing high-quality events, investing in great content, and creating meaningful connections, we need your support. Every donation helps us ensure our community remains independent, strong, and accessible to everyone.
                </p>

                <Button className="bg-[#E3FCEF] hover:bg-[#E3FCEF] text-[#0B4F2B] rounded-full px-8 py-6 text-xl font-light mb-16 shadow-lg" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}>
                    <span className="mr-2"><StarIcon /></span> Read More
                </Button>
            </div>
        </section>
    );
}
