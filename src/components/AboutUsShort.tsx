import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { useContent } from "../contexts/ContentContext";

export function AboutUsShort() {
    const { content } = useContent();
    const { aboutShort } = content.home;

    return (
        <section className="w-full pt-10 pb-20 px-8 md:px-12 lg:px-16 xl:px-24">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl mb-8 font-extrabold">
                    {aboutShort.title}
                </h2>

                <div className="max-w-2xl">
                    <p className="font-bold mb-8">
                        {aboutShort.subtitle}
                    </p>

                    <p className="text-base font-light text-gray-700 mb-8 leading-relaxed">
                        {aboutShort.description}
                    </p>
                    <Link to="/about">
                        <Button variant="secondary" className="px-6 py-8 rounded-md text-sm font-medium bg-pink-100 hover:bg-pink-200 text-primary shadow-sm hover:shadow-md transition-all">
                            {aboutShort.button} →
                        </Button>
                    </Link>
                </div>

            </div>
        </section>
    );
}
