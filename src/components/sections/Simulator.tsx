"use client";

import React, { useState } from "react";
import { Link2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Simulator() {
    const [params, setParams] = useState({
        invest: 55,
        skills: 45,
        stability: 35
    });

    const handleChange = (key: keyof typeof params, val: number) => {
        setParams(prev => ({ ...prev, [key]: val }));
    };

    // Simple Model Equations from spec
    // prodTrajectory = 100 + 0.08*invest + 0.06*skills + 0.04*stability
    const prodIndex = 100 + (0.08 * params.invest) + (0.06 * params.skills) + (0.04 * params.stability);

    // competitiveness = 50 + 0.10*invest + 0.05*skills
    const competitiveness = 50 + (0.10 * params.invest) + (0.05 * params.skills);

    // investmentCapacity = 50 + 0.09*stability + 0.07*invest
    const capacity = 50 + (0.09 * params.stability) + (0.07 * params.invest);

    return (
        <section id="simulateur" className="relative min-h-screen py-24 px-6 bg-white border-t border-border">
            <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-primary md:text-4xl">
                        Simulateur : Trajectoire 10 ans
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                        Un modèle simple : investissement, compétences, stabilité. Sans ces ingrédients, aucune magie n'opère.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Controls */}
                    <div className="space-y-8 bg-slate-50 p-8 rounded-[24px] border border-border">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Investissement Numérique ({params.invest}%)
                            </label>
                            <input
                                type="range" min="0" max="100"
                                value={params.invest}
                                onChange={(e) => handleChange("invest", Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                            />
                            <div className="flex justify-between text-xs text-muted mt-1">
                                <span>Faible</span><span>Moyen</span><span>Fort</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Compétences / Formation ({params.skills}%)
                            </label>
                            <input
                                type="range" min="0" max="100"
                                value={params.skills}
                                onChange={(e) => handleChange("skills", Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Stabilité Réglementaire ({params.stability}%)
                            </label>
                            <input
                                type="range" min="0" max="100"
                                value={params.stability}
                                onChange={(e) => handleChange("stability", Number(e.target.value))}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                            />
                        </div>
                    </div>

                    {/* Results */}
                    <div className="grid gap-6">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium text-muted-foreground flex items-center justify-between">
                                    Productivité (Index)
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-4xl font-bold text-primary mb-2">
                                    {prodIndex.toFixed(1)}
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-300"
                                        style={{ width: `${(prodIndex - 100) / 0.2}%` }} // Adjusted visualization scale
                                    />
                                </div>
                                <p className="text-xs text-muted mt-2">Projection à 10 ans base 100</p>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-2 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Compétitivité Hors-prix</div>
                                    <div className="text-2xl font-bold text-secondary">{competitiveness.toFixed(1)}</div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="text-sm font-medium text-muted-foreground mb-1">Capacité d'Investissement</div>
                                    <div className="text-2xl font-bold text-accent">{capacity.toFixed(1)}</div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <h4 className="font-bold text-primary text-sm mb-1">Le verdict</h4>
                            <p className="text-sm text-primary/80">
                                {prodIndex < 105 ? "Stagnation inquiétante. Le décrochage se poursuit." :
                                    prodIndex < 112 ? "Trajectoire de rattrapage modérée." :
                                        "Rebond structurel puissant !"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
