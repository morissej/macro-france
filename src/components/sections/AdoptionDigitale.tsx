"use client";

import React from "react";
import * as d3 from "d3";
import { datasets } from "@/lib/data";
import { useAppStore } from "@/lib/store";
import { CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PieGauge = ({ value, label, size = 160, color = "#0E7490" }: { value: number, label: string, size?: number, color?: string }) => {
    const radius = size / 2;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * (radius - strokeWidth);
    const strokeDashoffset = circumference - (value / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        cx={radius} cy={radius} r={radius - strokeWidth}
                        stroke="currentColor" strokeWidth={strokeWidth}
                        fill="transparent" className="text-gray-100"
                    />
                    <circle
                        cx={radius} cy={radius} r={radius - strokeWidth}
                        stroke={color} strokeWidth={strokeWidth}
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                <div className="absolute text-3xl font-bold text-primary">
                    {value}%
                </div>
            </div>
            <span className="font-semibold text-primary">{label}</span>
        </div>
    );
};

export function AdoptionDigitale() {
    const { isCeoMode } = useAppStore();
    const data = datasets.digitalAdoption.byCountry;

    return (
        <section id="adoption-digitale" className="relative min-h-screen py-24 px-6 bg-white">
            <div className="mx-auto max-w-6xl">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
                            Adoption Digitale : le retard à l'allumage
                        </h2>
                        <p className="text-lg text-muted-foreground">
                            Seulement 57% des entreprises françaises utilisent une technologie digitale avancée (Cloud, IA, Big Data).
                        </p>

                        {isCeoMode && (
                            <Card className="bg-orange-50 border-orange-200">
                                <CardContent className="pt-6">
                                    <h4 className="font-bold text-orange-800 mb-2 flex items-center gap-2">
                                        <XCircle className="w-5 h-5" /> Risque pour votre PME
                                    </h4>
                                    <ul className="list-disc pl-5 text-sm text-orange-800/80 space-y-1">
                                        <li>Sans data, impossible d'optimiser finement les coûts.</li>
                                        <li>Vos concurrents digitalisés ont des marges 5-10% supérieures.</li>
                                        <li>L'écart se creuse exponentiellement (effet cumulatif).</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <div className="bg-slate-50 rounded-[30px] p-12 border border-slate-100 flex flex-col items-center justify-center gap-12">
                        <h3 className="text-lg font-medium text-muted-foreground">Comparaison : Entreprises digitalisées</h3>
                        <div className="flex flex-wrap justify-center gap-8">
                            <PieGauge
                                value={data.find(d => d.country === "France")?.value || 0}
                                label="France"
                                color="#D97706" // Warning color
                            />
                            <PieGauge
                                value={data.find(d => d.country === "UE")?.value || 0}
                                label="Moyenne UE"
                                color="#0E7490"
                            />
                            <PieGauge
                                value={data.find(d => d.country === "États-Unis")?.value || 0}
                                label="États-Unis"
                                color="#1F8A70" // Success color
                            />
                        </div>
                        <p className="text-xs text-muted text-center pt-4 border-t border-slate-200 w-full">
                            Source: {datasets.digitalAdoption.source}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
