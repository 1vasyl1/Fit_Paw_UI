import { motion } from "motion/react";
import { ChevronDown, Heart, Calendar, TrendingUp } from "lucide-react";

export function HomePage() {
    const sponsors = [
        { name: "HealthPlus", width: 90 },
        { name: "FitGear", width: 80 },
        { name: "ActiveLife", width: 85 },
        { name: "Wellness", width: 90 },
        { name: "GymPro", width: 75 },
    ];

    const features = [
        {
            icon: Calendar,
            title: "Smart Scheduling",
            description:
                "Plan workouts around your daily routine. Schedule gym sessions that work with your commitments.",
        },
        {
            icon: TrendingUp,
            title: "Track Progress",
            description:
                "Monitor your fitness journey and celebrate milestones. See how far you have come.",
        },
        {
            icon: Heart,
            title: "Stay Motivated",
            description:
                "Set goals and build healthy habits. Get reminders to keep you on track with your fitness routine.",
        },
    ];

    const scrollToFeatures = () => {
        const featuresSection = document.querySelector("#features");
        if (featuresSection) {
            featuresSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <main>
            {/* HERO */}
            <section id="home" className="w-full py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                        <motion.div
                            className="space-y-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200/50 rounded-full">
                                <span className="text-sm text-blue-700">A new place</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl tracking-tight">
                                Fitness Planning That Fits Your Life
                            </h1>

                            <p className="text-muted-foreground">
                                Plan your gym sessions around your schedule. Whether you have a
                                dog to walk or other commitments, FitPaw helps you stay
                                consistent with your fitness goals.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Get Started Free
                                </button>
                                <button
                                    onClick={scrollToFeatures}
                                    className="px-6 py-3 text-foreground hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
                                >
                                    Learn More
                                    <ChevronDown className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Illustration/App Preview */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        >
                            {/*TODO: Change to free license img*/}
                            <div className="bg-white border border-border rounded-2xl p-2 shadow-sm">
                                <img
                                    src="https://images.unsplash.com/photo-1591311630200-ffa9120a540f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXRuZXNzJTIwYXBwJTIwbW9ja3VwfGVufDF8fHx8MTc2NjY5MzM5Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                    alt="Fitness app interface showing workout planning features"
                                    className="w-full h-auto rounded-xl object-cover aspect-square"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* SPONSORS */}
            <motion.section
                className="w-full py-8 hidden md:block"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white border border-border rounded-2xl px-8 py-6 shadow-sm">
                        <p className="text-xs text-muted-foreground text-center mb-6 uppercase tracking-wide">
                            Trusted by Leading Brands
                        </p>
                        <div className="flex items-center justify-center gap-8 flex-wrap">
                            {sponsors.map((sponsor) => (
                                <div
                                    key={sponsor.name}
                                    className="h-8 flex items-center justify-center opacity-40 hover:opacity-60 transition-opacity"
                                    style={{ width: sponsor.width }}
                                >
                                    <div className="w-full h-6 bg-gradient-to-r from-gray-300 to-gray-200 rounded flex items-center justify-center">
                    <span className="text-xs text-gray-500 font-medium">
                      {sponsor.name}
                    </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* FEATURES */}
            <section id="features" className="w-full py-16 md:py-24">
                <div className="max-w-3xl mx-auto px-4">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200/50 rounded-full mb-4">
                            <span className="text-sm text-blue-700">Why FitPaw?</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl tracking-tight mb-4">
                            Everything You Need to Stay Active
                        </h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Simple tools to help you maintain a healthy, active lifestyle.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                className="bg-white border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                    <feature.icon className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="mb-2">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </main>
    );
}
