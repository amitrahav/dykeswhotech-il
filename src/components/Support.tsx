import { Button } from "./ui/button";
import { StarIcon } from "lucide-react"; // Examples for logos
import { useContent } from "../contexts/ContentContext";
import { Link } from "react-router-dom";

export function Support() {
    const { content } = useContent();
    const { support, jobs } = content.home;

    const hasJobs = jobs?.items?.length > 0;

    return (
        <section className={`py-20 md:py-32 px-4 bg-[#8D49FF] text-white text-center relative overflow-hidden ${hasJobs ? "rounded-[23px] rounded-b-[0px]" : "border-0"}`}>

            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">{support.title}</h2>
                <h3 className="text-2xl md:text-4xl font-black text-[#FF66E0] mb-8">{support.subtitle}</h3>

                <p className="max-w-2xl mx-auto mb-12 text-base md:text-lg opacity-90 leading-relaxed font-medium">
                    {support.description}
                </p>
                <Link to="/sponsorship">
                    <Button className="rounded-full bg-[#85F2AA] text-[#0B4F2B] font-semibold px-8 py-3 hover:bg-[#6DDEA0] hover:scale-105 active:scale-95 transition-all mb-16">
                        {support.button}
                    </Button>
                </Link>

            </div>
        </section>
    );
}
