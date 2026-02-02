import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useContent } from "../contexts/ContentContext";

export function AboutUsShort() {
    const { content } = useContent();
    const { aboutShort } = content.home;

    return (
        <section className="w-full pt-10 pb-20 px-8 md:px-16 lg:px-24">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl mb-4">
                    {aboutShort.title}
                </h2>

                <h3 className="text-2xl md:text-3xl font-extrabold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {aboutShort.subtitle}
                </h3>

                <p className="text-base font-light text-gray-700 mb-8 leading-relaxed">
                    {aboutShort.description}
                </p>
                <Link to="/about">
                    <Button variant="secondary" className="px-6 py-3 rounded-md text-sm font-medium bg-pink-100 hover:bg-pink-200 text-primary shadow-sm hover:shadow-md transition-all">
                        {aboutShort.button}
                    </Button>
                </Link>

            </div>
        </section>
    );
}
