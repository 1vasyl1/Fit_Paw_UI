import {MapPin} from "lucide-react";

const MAP_API_KEY = import.meta.env.VITE_MAP_API_KEY;

const MAP_SRC =
    "https://maps.googleapis.com/maps/api/staticmap" +
    "?center=Warsaw,Stoklosy+3" +
    "&zoom=15" +
    "&size=600x300" +
    "&maptype=roadmap" +
    "&markers=color:red%7CWarsaw,Stoklosy+3" +
    `&key=${MAP_API_KEY}`;

export function AboutPage() {
    return (
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-[800px] mx-auto flex flex-col items-center gap-10 sm:gap-12">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div
                        className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"/>
                        <span>Side project</span>
                        <span className="text-slate-300">•</span>
                        <span>Built in Warsaw</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-semibold text-gray-900">
                        About FitPaw
                    </h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        New gym for building healthy fitness routines with your furry
                        friend.
                    </p>
                </div>

                {/* Description */}
                <div className="w-full flex justify-center">
                    <div className="w-full bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-200
                                    transition-transform transition-shadow duration-200
                                    hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                What is FitPaw?
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    FitPaw is a small training project built to practice React,
                                    TypeScript, and Tailwind best practices while designing a
                                    simple fitness planner for dog owners.
                                </p>
                                <p>
                                    The app is developed in Warsaw, at Stokłosy 3, and is focused
                                    on clean architecture, reusable UI components, and easy
                                    integration with a Django API backend.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vision / roadmap */}
                <div className="w-full flex justify-center">
                    <div
                        className="w-full bg-white rounded-xl p-5 sm:p-6 shadow-sm border border-dashed border-gray-200
                                   transition-transform transition-shadow duration-200
                                   hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                            What&apos;s next?
                        </h3>
                        <p className="text-sm text-gray-600">
                            Planned features include smarter workout scheduling synced with
                            your dog&apos;s routine, basic progress tracking for both owner
                            and pet, simple sharing options with trainers or vets, and a clean
                            dashboard that connects directly to the Django API.
                        </p>
                    </div>
                </div>

                {/* Location Card */}
                <div className="w-full flex justify-center">
                    <div className="w-full bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200
                                    transition-transform transition-shadow duration-200
                                    hover:-translate-y-0.5 hover:shadow-md"
                    >
                        <div className="w-full h-48 sm:h-64 bg-gray-100">
                            <img
                                src={MAP_SRC}
                                alt="Map showing location Warsaw, Stokłosy 3"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Location Info */}
                        <div className="p-6 sm:p-8">
                            <div className="flex gap-4 items-start">
                                <div
                                    className="flex-shrink-0 w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-sky-600"/>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        Location
                                    </h3>
                                    <p className="text-gray-600">Warsaw, Stokłosy 3</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Developed in Warsaw, Poland.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
