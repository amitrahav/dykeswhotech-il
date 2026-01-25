import { Button } from "./ui/button";

export function About() {
    return (
        <section className="w-full pt-10 pb-20 px-8 md:px-16 lg:px-24">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl text-black mb-4" style={{
                    fontFamily: '"Tel Aviv", sans-serif',
                }}>
                    Dykes Who Tech
                </h2>

                <h3 className="text-2xl md:text-3xl font-bold mb-6 text-black" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}>
                    Home for lesbians queer women & trans people in the tech industry
                </h3>

                <p className="text-base font-light text-gray-700 mb-8 max-w-2xl leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}>
                    We are here to create a professional network, advance careers, and build a safe space where technology meets pride.
                </p>

                <Button variant="secondary" className="px-6 py-3 rounded-md text-sm font-medium bg-pink-100 hover:bg-pink-200 text-primary shadow-sm hover:shadow-md transition-all" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Read more →
                </Button>
            </div>
        </section>
    );
}
