"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { datasets } from "@/lib/data";
// Tooltip implemented as custom hover div

// Coordinates for a schematic world map (0-100 scale)
const regions = {
    "États-Unis": { x: 25, y: 35 },
    "Europe": { x: 52, y: 30 },
    "Chine": { x: 75, y: 40 },
    "Royaume-Uni": { x: 48, y: 28 }, // Close to Europe
};

export function MapInvestIA() {
    const data = datasets.aiInvest.byRegion;
    const maxVal = Math.max(...data.map(d => d.value));

    return (
        <section id="carte-invest-ia" className="relative min-h-screen py-24 px-6 bg-slate-900 text-white overflow-hidden">
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

            <div className="mx-auto max-w-7xl relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight md:text-5xl mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                        Investissements IA : l'écart qui compte
                    </h2>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                        L’écart d’investissement dans le numérique aujourd'hui est l'écart de productivité de demain.
                    </p>
                </div>

                <div className="relative aspect-video w-full max-w-5xl mx-auto rounded-[30px] border border-white/10 bg-slate-800/50 backdrop-blur-sm shadow-2xl p-8">
                    {/* Abstract Map Background */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        {/* Simple shapes for continents could go here, for now just a grid feeling */}
                        <svg width="100%" height="100%">
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    {/* Bubbles */}
                    <div className="relative w-full h-full">
                        {data.map((item) => {
                            const coords = regions[item.region as keyof typeof regions] || { x: 50, y: 50 };
                            // Scale size relative to max, min size 40px
                            const size = 60 + (item.value / maxVal) * 200;

                            return (
                                <motion.div
                                    key={item.region}
                                    className="absolute flex flex-col items-center justify-center rounded-full border border-white/20 shadow-[0_0_50px_rgba(14,116,144,0.3)] backdrop-blur-md cursor-pointer group"
                                    style={{
                                        left: `${coords.x}%`,
                                        top: `${coords.y}%`,
                                        width: size,
                                        height: size,
                                        backgroundColor: item.region === "États-Unis" ? "rgba(59, 130, 246, 0.2)" :
                                            item.region === "Chine" ? "rgba(239, 68, 68, 0.2)" :
                                                "rgba(255, 255, 255, 0.1)"
                                    }}
                                    initial={{ scale: 0, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 1, type: "spring" }}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                                >
                                    <span className="font-bold text-lg md:text-2xl">{item.value} Mds$</span>
                                    <span className="text-xs md:text-sm text-slate-300 font-medium uppercase tracking-wider mt-1">{item.region}</span>

                                    {/* Tooltip-like details on hover */}
                                    <div className="absolute -bottom-16 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-white/20 p-2 rounded text-xs w-40 text-center pointer-events-none z-20">
                                        Investissement privé cumulé 2013-2023
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    <div className="absolute bottom-6 left-6 text-xs text-slate-500">
                        Source: Stanford AI Index Report 2024
                    </div>
                </div>
            </div>
        </section>
    );
}
