"use client";

import { motion } from "framer-motion";
import { ArrowRight, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
    const scrollToParadoxe = () => {
        document.getElementById("global-competitiveness")?.scrollIntoView({ behavior: "smooth" });
    };

    const scrollToWaterfall = () => {
        document.getElementById("waterfall")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <section id="hero" className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 pt-20 lg:pt-0">
            {/* Background decoration */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -right-[10%] top-[10%] h-[500px] w-[500px] rounded-full bg-secondary/5 blur-[100px]" />
                <div className="absolute -left-[10%] bottom-[10%] h-[400px] w-[400px] rounded-full bg-accent/5 blur-[100px]" />
            </div>

            <div className="mx-auto grid max-w-7xl lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="flex flex-col gap-8"
                >
                    <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-primary md:text-6xl lg:text-[4rem]">
                        Compétitivité française : <span className="text-secondary block mt-2">le diagnostic vital.</span>
                    </h1>

                    <p className="max-w-xl text-lg text-muted-foreground md:text-xl leading-relaxed">
                        Comment une opération de M&A bien exécutée peut vous aider à surmonter ce handicap.
                    </p>

                    <div className="flex flex-wrap gap-4 mt-8">
                        <button
                            onClick={scrollToParadoxe}
                            className="bg-primary hover:bg-primary/90 text-white p-4 rounded-full shadow-lg transition-all hover:scale-105 flex items-center gap-2 animate-bounce"
                            aria-label="Commencer l'analyse"
                        >
                            <ArrowRight className="h-6 w-6 rotate-90" />
                        </button>
                    </div>
                </motion.div>

                {/* Visual Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative hidden lg:block h-[600px] w-full"
                >
                    <svg viewBox="0 0 600 600" className="w-full h-full text-primary/10">
                        {/* Abstract Circuit/Gear Motif */}
                        <motion.circle
                            cx="300" cy="300" r="150"
                            stroke="currentColor" strokeWidth="2" fill="none"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                        />
                        <motion.circle
                            cx="300" cy="300" r="220"
                            stroke="currentColor" strokeWidth="1" fill="none"
                            strokeDasharray="10 10"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
                        />
                        <circle cx="300" cy="300" r="50" fill="currentColor" className="text-secondary/20" />

                        {/* Floating Elements */}
                        <motion.g
                            animate={{ y: [-20, 20, -20] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <rect x="400" y="150" width="120" height="80" rx="10" fill="white" stroke="var(--color-border)" strokeWidth="2" className="shadow-lg" />
                            <rect x="410" y="165" width="80" height="10" rx="2" fill="var(--color-secondary)" fillOpacity="0.2" />
                            <rect x="410" y="185" width="100" height="10" rx="2" fill="var(--color-primary)" fillOpacity="0.1" />
                            <rect x="410" y="205" width="60" height="10" rx="2" fill="var(--color-primary)" fillOpacity="0.1" />
                        </motion.g>

                        <motion.g
                            animate={{ y: [15, -15, 15] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <rect x="80" y="350" width="140" height="90" rx="10" fill="white" stroke="var(--color-border)" strokeWidth="2" className="shadow-lg" />
                            {/* Mini Bar Chart */}
                            <rect x="100" y="390" width="15" height="30" fill="var(--color-accent)" />
                            <rect x="125" y="370" width="15" height="50" fill="var(--color-secondary)" />
                            <rect x="150" y="400" width="15" height="20" fill="var(--color-primary)" />
                            <rect x="175" y="360" width="15" height="60" fill="var(--color-success)" />
                        </motion.g>
                    </svg>
                </motion.div>
            </div>
        </section>
    );
}
