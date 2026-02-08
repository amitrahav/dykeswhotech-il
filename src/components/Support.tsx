import { Button } from "./ui/button";
import { StarIcon } from "lucide-react"; // Examples for logos
import { useContent } from "../contexts/ContentContext";
import { Link } from "react-router-dom";

export function Support() {
    const { content } = useContent();
    const { support, jobs } = content.home;

    const hasJobs = jobs?.items?.length > 0;

    return (
        <section className={`py-20 md:py-32 px-4 bg-[#8D49FF] text-white text-center relative overflow-hidden ${hasJobs ? "rounded-[23px] rounded-b-[0px]" : ""}`}>

            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-3xl md:text-4xl font-black mb-2">{support.title}</h2>
                <h3 className="text-2xl md:text-3xl font-black text-[#FF66E0] mb-8">{support.subtitle}</h3>

                <p className="max-w-2xl mx-auto mb-12 text-base md:text-lg opacity-90 leading-relaxed font-medium">
                    {support.description}
                </p>
                <Link to="/sponsorship">
                    <Button className="bg-[#E3FCEF] hover:bg-[#E3FCEF] text-[#0B4F2B] rounded-full px-8 py-6 text-xl font-light mb-16 shadow-lg">
                        <span className="mr-2"><StarIcon /></span> {support.button}
                    </Button>
                </Link>

            </div>
        </section>
    );
}
