import { Button } from "./ui/button";

export function Jobs() {
    return (
        <section className="py-20 px-4 bg-white">
            <div className="max-w-6xl mx-auto text-center md:text-left">
                <h2 className="text-4xl md:text-5xl font-black mb-4 text-gray-900">Jobs</h2>
                <p className="max-w-2xl text-gray-600 mb-12 text-base md:text-lg font-light">
                    Our events are where it all happens. We meet to learn, create, consult, and sometimes just to have a drink and feel at home.
                </p>

                <div className="flex flex-col gap-4 mb-12 w-full">
                    {[
                        { company: "IronSource", role: "Senior Backend Engineer", category: "Tech" },
                        { company: "HourOne", role: "Machine Learning Researcher", category: "Tech" },
                        { company: "IronSource", role: "Marketing Operations Manager", category: "Non-Tech" }
                    ].map((job, i) => (
                        <div key={i} className="w-full p-4 flex flex-col md:flex-row md:items-center justify-between bg-pink-50/50 rounded-xl hover:bg-pink-100/60 transition-colors cursor-pointer border border-pink-200/30 group">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-12">
                                <span className="text-sm font-black text-pink-600 uppercase tracking-tighter w-24">{job.company}</span>
                                <span className="text-lg font-bold text-gray-900">{job.role}</span>
                            </div>
                            <span className="mt-2 md:mt-0 self-start md:self-center text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white text-gray-400 rounded-full border border-gray-100 group-hover:border-pink-200 group-hover:text-pink-500 transition-colors">
                                {job.category}
                            </span>
                        </div>
                    ))}
                </div>

                <Button variant="secondary" className="px-8 py-5 rounded-full text-base font-semibold bg-gray-100 hover:bg-gray-200 text-black shadow-sm">
                    Read more &rarr;
                </Button>
            </div>
        </section>
    );
}
