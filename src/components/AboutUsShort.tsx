import { Button } from "./ui/button";
import { Link } from "react-router-dom";

export function AboutUsShort() {
    return (
        <section className="w-full pt-10 pb-20 px-8 md:px-16 lg:px-24">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl mb-4">
                    DykesWhoTech
                </h2>

                <h3 className="text-2xl md:text-3xl font-extrabold mb-6" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Home for lesbians queer women & trans people in the tech industry
                </h3>

                <p className="text-base font-light text-gray-700 mb-8 leading-relaxed">
                    We are here to create a professional network, advance careers, and build a safe space where technology meets pride.
                </p>
                <Link to="/about">
                    <Button variant="secondary" className="px-6 py-3 rounded-md text-sm font-medium bg-pink-100 hover:bg-pink-200 text-primary shadow-sm hover:shadow-md transition-all">
                        Read more →
                    </Button>
                </Link>

            </div>
        </section>
    );
}
