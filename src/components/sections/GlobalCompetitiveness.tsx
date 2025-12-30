"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BarChart3, TrendingDown, TrendingUp, Trophy, Globe, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --- DATA ---
const rankingHistory = [
    { year: 2019, rank: 31 },
    { year: 2020, rank: 32 },
    { year: 2021, rank: 29 },
    { year: 2022, rank: 28 },
    { year: 2023, rank: 33 },
    { year: 2024, rank: 33 },
    { year: 2025, rank: 32 },
];

const benchmark2025 = [
    { country: "Allemagne", flag: "🇩🇪", rank: 6, score: 85 },
    { country: "Pays-Bas", flag: "🇳🇱", rank: 10, score: 82 },
    { country: "Royaume-Uni", flag: "🇬🇧", rank: 19, score: 77 },
    { country: "Belgique", flag: "🇧🇪", rank: 23, score: 75 },
    { country: "France", flag: "🇫🇷", rank: 32, score: 70, highlight: true },
    { country: "Espagne", flag: "🇪🇸", rank: 38, score: 66 },
    { country: "Italie", flag: "🇮🇹", rank: 42, score: 62 },
];

export function GlobalCompetitiveness() {
    const [view, setView] = useState<"ranking" | "trade">("ranking");

    return (
        <section id="global-competitiveness" className="relative min-h-screen py-24 px-6 bg-white flex flex-col justify-center">
            <div className="mx-auto max-w-7xl w-full">

                {/* HEADER */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-extrabold tracking-tight text-primary md:text-6xl mb-6">
                        La France face à ses voisins : <span className="text-red-600">Le décrochage</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                        Au delà des déficits, c'est la compétitivité globale de l'économie française qui stagne en milieu de tableau.
                    </p>

                    {/* View Switcher */}
                    <div className="inline-flex bg-slate-100 p-1 rounded-full">
                        <button
                            onClick={() => setView("ranking")}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${view === "ranking" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Classement Mondial
                        </button>
                        <button
                            onClick={() => setView("trade")}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${view === "trade" ? "bg-white text-blue-700 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                            Déficit & Industrie
                        </button>
                    </div>
                </div>

                {view === "ranking" ? <RankingView /> : <TradeView />}

            </div>
        </section>
    );
}

function RankingView() {
    return (
        <div className="grid lg:grid-cols-12 gap-12 items-start">

            {/* LEFT: LEADERBOARD */}
            <div className="lg:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" /> Classement IMD 2025
                </h3>
                <div className="space-y-3">
                    {benchmark2025.map((item, idx) => (
                        <div
                            key={item.country}
                            className={`flex items-center justify-between p-3 rounded-xl border ${item.highlight ? "bg-white border-blue-500 shadow-md scale-105 z-10" : "bg-white/50 border-transparent text-slate-500"}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`font-mono font-bold w-6 text-center ${item.highlight ? "text-blue-700" : "text-slate-400"}`}>#{item.rank}</div>
                                <div className="text-2xl">{item.flag}</div>
                                <div className={`font-medium ${item.highlight ? "text-slate-900" : ""}`}>{item.country}</div>
                            </div>
                            {item.rank < 32 && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">Top {Math.floor(item.rank / 10) * 10 + 10}</span>}
                        </div>
                    ))}
                </div>
                <p className="mt-6 text-xs text-slate-400 italic text-center">
                    Source: IMD World Competitiveness Ranking 2025 (Estimé)
                </p>
            </div>

            {/* RIGHT: EVOLUTION CHART */}
            <div className="lg:col-span-7 bg-white p-2">
                <div className="mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Une stagnation inquiétante</h3>
                    <p className="text-slate-600 leading-relaxed">
                        Alors que l'Allemagne (6e) et les Pays-Bas (10e) trustent le haut du classement, la France oscille autour de la <strong>30e place</strong>.
                        <br /><br />
                        Après un sursaut post-Covid (28e en 2022), la compétitivité a rechuté, plombée par l'efficacité gouvernementale et la dette.
                    </p>
                </div>

                <div className="relative h-[320px] w-full bg-slate-50 rounded-xl border border-slate-100 p-6">
                    {/* Grid Lines */}
                    <div className="absolute inset-x-6 top-6 bottom-12 flex flex-col justify-between pointer-events-none opacity-10">
                        <div className="w-full h-px bg-slate-900" />
                        <div className="w-full h-px bg-slate-900" />
                        <div className="w-full h-px bg-slate-900" />
                        <div className="w-full h-px bg-slate-900" />
                    </div>

                    {/* Chart Area - Absolute Positioning with Fixed Height */}
                    <div className="absolute left-6 right-6 bottom-12 h-[250px] flex items-end justify-between px-4">
                        {rankingHistory.map((pt, i) => {
                            const maxRank = 35;
                            const minRank = 25;
                            // Reversing the logic: Higher rank (worse) = Taller bar
                            // Formula: ((pt.rank - minRank) / (maxRank - minRank)) * 220
                            // 35 -> 1.0 -> 220px
                            // 25 -> 0.0 -> 20px (min)
                            const barHeight = Math.max(20, ((pt.rank - minRank) / (maxRank - minRank)) * 220);

                            // Determine color manually
                            let barColor = "#3b82f6"; // blue-500
                            if (pt.rank >= 33) barColor = "#ef4444"; // red-500
                            else if (pt.rank <= 29) barColor = "#22c55e"; // green-500

                            return (
                                <div key={pt.year} className="flex flex-col justify-end items-center gap-2 group w-12 h-full relative z-10">
                                    {/* Rank Label */}
                                    <div className={`font-bold transition-all text-sm ${pt.rank >= 33 ? "text-red-600 scale-110" : "text-blue-700"}`}>
                                        #{pt.rank}
                                    </div>

                                    {/* Bar - Fixed height */}
                                    <div
                                        style={{
                                            height: `${barHeight}px`,
                                            backgroundColor: barColor,
                                            width: '100%',
                                        }}
                                        className="rounded-t-sm shadow-sm transition-all duration-700 relative"
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs p-1 rounded -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none">
                                            {pt.year}: #{pt.rank}
                                        </div>
                                    </div>

                                    {/* Year Label */}
                                    <div className="text-xs font-bold text-slate-400 absolute -bottom-8">{pt.year}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

        </div>
    );
}

// Reuse the previous component for "TradeView" to keep the functionality
function TradeView() {
    const [selectedId, setSelectedId] = useState("de");

    const comparisons = [
        { id: "de", name: "Allemagne", flag: "🇩🇪", tradeBalance: 240, industryShare: 18 },
        { id: "it", name: "Italie", flag: "🇮🇹", tradeBalance: 55, industryShare: 15 },
        { id: "uk", name: "Royaume-Uni", flag: "🇬🇧", tradeBalance: -25, industryShare: 9 },
    ];

    const current = comparisons.find(c => c.id === selectedId)!;

    return (
        <div className="grid lg:grid-cols-12 gap-12 items-start animate-in fade-in duration-500">
            {/* Controls */}
            <div className="lg:col-span-4 space-y-6">
                <Card className="bg-slate-50 border-slate-200 shadow-sm">
                    <CardHeader><CardTitle className="text-lg text-slate-700">Comparer avec...</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                        {comparisons.map(country => (
                            <button
                                key={country.id}
                                onClick={() => setSelectedId(country.id)}
                                className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${selectedId === country.id ? "border-blue-600 bg-blue-50 shadow-md" : "border-transparent bg-white hover:bg-slate-100"}`}
                            >
                                <span className="flex items-center gap-3 font-bold text-lg"><span className="text-2xl">{country.flag}</span> {country.name}</span>
                                {selectedId === country.id && <ArrowRight className="text-blue-600 h-5 w-5" />}
                            </button>
                        ))}
                    </CardContent>
                </Card>

                <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                    <h4 className="font-bold text-red-800 mb-2 flex items-center gap-2"><TrendingDown className="h-5 w-5" /> Déficit Record</h4>
                    <p className="text-red-700 text-sm">Le déficit commercial structurel (-85 Mds€) est la conséquence directe de la désindustrialisation.</p>
                </div>
            </div>

            {/* Charts */}
            <div className="lg:col-span-8 bg-slate-50 rounded-[32px] p-8 border border-slate-200">
                <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2"><BarChart3 /> Balance Commerciale</h3>
                        <BarRow label="France" val={-85} max={250} color="bg-red-500" flag="🇫🇷" />
                        <BarRow label={current.name} val={current.tradeBalance} max={250} color={current.tradeBalance > 0 ? "bg-green-500" : "bg-red-500"} flag={current.flag} />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2"><FactoryIcon /> Part Industrie</h3>
                        <BarRow label="France" val={10} max={25} color="bg-blue-500" flag="🇫🇷" suffix="%" />
                        <BarRow label={current.name} val={current.industryShare} max={25} color="bg-slate-700" flag={current.flag} suffix="%" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function BarRow({ label, val, max, color, flag, suffix }: any) {
    const width = (Math.abs(val) / max) * 100;
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
                <span className="flex items-center gap-2">{flag} {label}</span>
                <span>{val > 0 ? "+" : ""}{val} {suffix || "Mds€"}</span>
            </div>
            <div className="h-10 bg-gray-200 rounded overflow-hidden relative">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${width}%` }}
                    className={`absolute top-0 bottom-0 ${color}`}
                />
            </div>
        </div>
    )
}

function FactoryIcon() { return <BarChart3 className="h-5 w-5 text-gray-500" /> }
