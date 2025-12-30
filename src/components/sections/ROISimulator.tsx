"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Clock, Euro } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ROISimulator() {
    const [cost, setCost] = useState(100); // k€
    const [laborSavings, setLaborSavings] = useState(40); // k€/year

    // ROI Calculation Simplified
    // France: 25% IS. But high production taxes on machine value (often forgotten).
    // Germany: Similar IS but faster depreciation rules in some contexts (e.g. digital goods).

    // Let's model a "Months to Breakeven"
    // Breakeven = Cost / (Annual Savings * Margin_Factor)

    const calculateROI = (c: number, s: number, country: "fr" | "de") => {
        // Hidden factor: tax on asset
        const taxOnAsset = country === "fr" ? 0.03 : 0.005; // 3% vs 0.5% (symbolizing CFE/CVAE etc)
        const effectiveSavings = s - (c * taxOnAsset);

        // Simple payback in months
        if (effectiveSavings <= 0) return 999;
        return (c / effectiveSavings) * 12;
    };

    const roiFR = calculateROI(cost, laborSavings, "fr");
    const roiDE = calculateROI(cost, laborSavings, "de");

    const diffMonths = roiFR - roiDE;

    return (
        <section id="roi-simulator" className="relative min-h-[80vh] py-24 px-6 bg-white border-t border-slate-100">
            <div className="mx-auto max-w-6xl">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-sm">
                            <Calculator className="h-4 w-4" /> Simulateur d'Investissement
                        </div>
                        <h2 className="text-3xl font-bold text-primary md:text-4xl">
                            Le Coût du Statu Quo
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Pourquoi vos voisins allemands robotisent-ils plus vite ? Parce que leur fiscalité récompense le risque industriel plus que la nôtre.
                        </p>

                        <div className="bg-slate-50 p-8 rounded-[24px] border border-slate-200 text-left space-y-6">
                            <div>
                                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                                    <span>Investissement Machine / Logiciel</span>
                                    <span className="text-primary font-bold">{cost} k€</span>
                                </label>
                                <input
                                    type="range" min="10" max="500" step="10"
                                    value={cost}
                                    onChange={(e) => setCost(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm font-medium text-gray-700 mb-2">
                                    <span>Gain annuel estimé (Productivité)</span>
                                    <span className="text-primary font-bold">{laborSavings} k€/an</span>
                                </label>
                                <input
                                    type="range" min="5" max="200" step="5"
                                    value={laborSavings}
                                    onChange={(e) => setLaborSavings(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        {/* Comparison Cards */}
                        <div className="grid gap-4">
                            <Card className="border-l-4 border-l-blue-600 shadow-md">
                                <CardContent className="p-6 flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">🇫🇷 Rentabilité en France</div>
                                        <div className="text-3xl font-bold text-primary">
                                            {roiFR > 100 ? "> 10 ans" : `${roiFR.toFixed(1)} mois`}
                                        </div>
                                    </div>
                                    <Clock className="w-8 h-8 text-blue-100" />
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-black shadow-md opacity-75">
                                <CardContent className="p-6 flex items-center justify-between bg-slate-50">
                                    <div>
                                        <div className="text-sm text-muted-foreground mb-1">🇩🇪 Rentabilité en Allemagne</div>
                                        <div className="text-3xl font-bold text-gray-800">
                                            {roiDE > 100 ? "> 10 ans" : `${roiDE.toFixed(1)} mois`}
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mb-1">
                                            Plus rapide
                                        </span>
                                        <span className="font-bold text-green-600 text-sm">
                                            -{Math.abs(diffMonths).toFixed(1)} mois
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-8 bg-amber-50 rounded-xl p-4 border border-amber-200 flex gap-4 items-start">
                            <Euro className="w-6 h-6 text-amber-600 shrink-0 mt-1" />
                            <p className="text-sm text-amber-900">
                                <strong>L'effet invisible :</strong> Les impôts de production français agissent comme une "taxe sur la modernisation". Plus vous investissez dans des machines, plus vous payez d'impôts locaux, ce qui retarde votre seuil de rentabilité.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
