import { Button } from "./ui/button";
import { LayoutGrid, Triangle } from "lucide-react"; // Examples for logos


export function Support() {
    return (
        <section className="py-32 px-4 bg-[#8D6BE4] text-white text-center relative overflow-hidden">
            {/* Background Gradient Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#8D6BE4] to-[#9F7AEA] opacity-50"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-4xl font-extrabold mb-2">Support Us</h2>
                <h3 className="text-3xl font-extrabold text-pink-300 mb-8">Join our proud partners</h3>

                <p className="max-w-2xl mx-auto mb-12 text-lg opacity-90 leading-relaxed">
                    Our community grows thanks to the passion and time of volunteers. However, to keep producing high-quality events, investing in great content, and creating meaningful connections, we need your support. Every donation helps us ensure our community remains independent, strong, and accessible to everyone.
                </p>

                <Button className="bg-white text-primary hover:bg-gray-100 rounded-full px-8 py-6 text-xl font-bold mb-16 shadow-lg">
                    <span className="mr-2">♻</span> Label
                </Button>

                <div className="mt-12 pt-12 border-t border-white/20 bg-gradient-to-r from-pink-50 to-white/90 p-8 rounded-xl text-black">
                    <div className="flex flex-wrap justify-center items-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
                        {/* Partner Logo Placeholders */}
                        <div className="flex items-center gap-2 font-bold"><LayoutGrid /> IronSource</div>
                        <div className="flex items-center gap-2 font-bold"><Triangle /> PAGAY</div>
                        <div className="flex items-center gap-2 font-bold"> monday.com</div>
                        <div className="flex items-center gap-2 font-bold"> Unity</div>
                        <div className="flex items-center gap-2 font-bold"> Microsoft</div>
                        <div className="flex items-center gap-2 font-bold"> riskified</div>
                    </div>
                </div>
            </div>
        </section>
    );
}
