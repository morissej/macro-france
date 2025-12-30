"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Scale, TrendingUp, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BalancePriceQuality() {
    const [sliderValue, setSliderValue] = useState(55);

    const getReview = (val: number) => {
        if (val < 40) return {
            headline: "Approche coût (Low Cost)",
            insight: "Soulage à court terme, mais ne crée pas d'avantage défendable face aux pays à bas coût.",
            color: "text-red-600",
            bg: "bg-red-50"
        };
        if (val <= 70) return {
            headline: "Zone réaliste (Compromis)",
            insight: "Le mix actuel : on essaie de maintenir la qualité tout en compressant les coûts.",
            color: "text-amber-600",
            bg: "bg-amber-50"
        };
        return {
            headline: "Montée en gamme (Hors-prix)",
            insight: "La seule issue viable : l'innovation et la marque justifient un prix plus élevé.",
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        };
    };

    const review = getReview(sliderValue);

    // Rotation calculation for the scale visual
    // 0 -> -15deg (heavy on left/cost)
    // 100 -> 15deg (heavy on right/quality)
    const rotation = (sliderValue - 50) * 0.5;

    return (
        <section id="prix-horsprix" className="relative min-h-screen py-24 px-6 bg-white overflow-hidden">
            <div className="mx-auto max-w-7xl grid lg:grid-cols-2 gap-16 items-center">

                {/* Controls Side */}
                <div className="space-y-12">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
                            Compétitivité-prix vs Hors-prix
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Le cœur du problème français : nous vendons des produits de gamme moyenne avec des coûts de gamme haute.
                            <br />Quelle est votre stratégie ?
                        </p>
                    </div>

                    <div className="p-8 rounded-[24px] bg-white shadow-card border border-border space-y-8">
                        <div className="space-y-4">
                            <div className="flex justify-between font-medium text-sm">
                                <span className="text-primary">Baisser les coûts</span>
                                <span className="text-secondary">Monter en gamme</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={sliderValue}
                                onChange={(e) => setSliderValue(Number(e.target.value))}
                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                            />
                        </div>

                        <motion.div
                            key={review.headline}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`p-6 rounded-xl border ${review.bg} ${review.color}`}
                        >
                            <h4 className="font-bold text-lg mb-2">{review.headline}</h4>
                            <p className="text-black/80">{review.insight}</p>
                        </motion.div>
                    </div>

                    <div>
                        <Button variant="outline" className="gap-2">
                            Que fait l'Allemagne ?
                        </Button>
                    </div>
                </div>

                {/* Visual Scale Side */}
                <div className="relative h-[500px] flex justify-center items-center bg-slate-50 rounded-[30px]">
                    {/* Scale Stand */}
                    <div className="absolute bottom-20 w-4 h-40 bg-gray-300 rounded-t-full" />
                    <div className="absolute bottom-16 w-32 h-4 bg-gray-300 rounded-full" />

                    {/* Moving Balance Beam */}
                    <motion.div
                        className="relative w-[80%] h-4 bg-primary rounded-full origin-center flex justify-between items-center px-4"
                        animate={{ rotate: rotation }}
                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    >
                        {/* Left Pan (Price) */}
                        <div className="relative">
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-16 bg-gray-400" />
                            <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-24 h-24 bg-white border-4 border-gray-400 rounded-full flex items-center justify-center shadow-lg">
                                <DollarSign className="w-10 h-10 text-gray-400" />
                                {/* Weight visual based on inverse slider value */}
                                <motion.div
                                    className="absolute inset-0 bg-primary/10 rounded-full"
                                    animate={{ scale: (100 - sliderValue) / 50 }}
                                />
                            </div>
                        </div>

                        {/* Pivot */}
                        <div className="w-8 h-8 bg-secondary rounded-full border-4 border-white z-10" />

                        {/* Right Pan (Quality) */}
                        <div className="relative">
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-16 bg-gray-400" />
                            <div className="absolute top-[70px] left-1/2 -translate-x-1/2 w-24 h-24 bg-white border-4 border-gray-400 rounded-full flex items-center justify-center shadow-lg">
                                <TrendingUp className="w-10 h-10 text-secondary" />
                                {/* Weight visual based on slider value */}
                                <motion.div
                                    className="absolute inset-0 bg-secondary/10 rounded-full"
                                    animate={{ scale: sliderValue / 50 }}
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
