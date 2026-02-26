import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useContent } from "../contexts/ContentContext";

export function AboutUsShort() {
    const { content } = useContent();
    const { aboutShort } = content.home;

    return (
        <section className="w-full pt-10 pb-20 px-8 md:px-12 lg:px-16 xl:px-24">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl mb-8 font-extrabold" style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700 }}>{aboutShort.title}</h2>
                <p className="font-bold">
                    {aboutShort.subtitle}
                </p>
                <p className="max-w-2xl text-gray-700 mb-12 text-base md:text-lg font-light">
                    {aboutShort.description}
                </p>

                <Link to="/about">
                    <Button className="px-6 h-[48px] rounded-md text-sm font-regular text-secondary">
                        {aboutShort.button} →
                    </Button>
                </Link>

            </div>
        </section>
    );
}
