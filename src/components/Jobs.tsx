import { Button } from "./ui/button";

export function Jobs() {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto text-center md:text-left">
                <h2 className="text-5xl font-extrabold mb-4 text-gray-900" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 900 }}>Jobs</h2>
                <p className="max-w-2xl text-gray-600 mb-12 text-lg" style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 300 }}>
                    Our events are where it all happens. We meet to learn, create, consult, and sometimes just to have a drink and feel at home.
                </p>

                <div className="flex flex-col gap-4 mb-12">
                    {/* Skeleton/Placeholder Job Items */}
                    {[1, 2, 3].map((_, i) => (
                        <div key={i} className="w-full h-14 bg-pink-100/60 rounded-xl hover:bg-pink-200 transition-colors cursor-pointer border border-pink-200/50"></div>
                    ))}
                </div>

                <Button variant="secondary" className="px-8 py-5 rounded-full text-base font-semibold bg-gray-100 hover:bg-gray-200 text-black shadow-sm">
                    Read more &rarr;
                </Button>
            </div>
        </section>
    );
}
