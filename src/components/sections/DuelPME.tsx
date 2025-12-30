"use client";

import React, { useState } from "react";
import { Factory, Building2, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FinancialLine {
    label: string;
    fr: number;
    de: number;
    highlight?: boolean;
    isTotal?: boolean;
    comment?: string;
    unit?: string;
}

export function DuelPME() {
    const [sector, setSector] = useState<"industry" | "services">("industry");

    // DATA MODEL (in M€ for a 10M€ CA company)
    const getData = (sec: "industry" | "services"): FinancialLine[] => {
        // Determine factor based on sector (Industry has higher energy/COGS, Services has higher salaries)
        const isInd = sec === "industry";

        return [
            { label: "Chiffre d'Affaires", fr: 10.0, de: 10.0, isTotal: true, unit: "M€" },
            {
                label: "Achats & Énergie",
                fr: isInd ? -4.0 : -2.0,
                de: isInd ? -3.8 : -1.9, // Energy cheaper/subsidized or Mat optimized
                comment: isInd ? "Énergie + chère en DE mais aides massives" : ""
            },
            { label: "Marge Brute", fr: isInd ? 6.0 : 8.0, de: isInd ? 6.2 : 8.1, isTotal: true, highlight: true },

            {
                label: "Salaires & Charges",
                fr: isInd ? -4.5 : -6.0,
                de: isInd ? -4.2 : -5.7,
                comment: "Charges sociales FR > DE"
            },
            {
                label: "Impôts Production",
                fr: -0.35, // 3.5% C3S/CVAE/Foncier
                de: -0.07, // 0.7% in DE
                highlight: true,
                comment: "Le boulet fiscal français (C3S, CVAE...)"
            },

            { label: "EBITDA", fr: isInd ? 1.15 : 1.65, de: isInd ? 1.93 : 2.33, isTotal: true },

            { label: "Amortissements", fr: -0.5, de: -0.6, comment: "Investissement + fort en DE" },

            { label: "EBIT (Rés. Exploit.)", fr: isInd ? 0.65 : 1.15, de: isInd ? 1.33 : 1.73, isTotal: true },

            { label: "Impôts Société (IS)", fr: isInd ? -0.16 : -0.29, de: isInd ? -0.40 : -0.52, comment: "Taux IS souvent + élevé en DE" },

            { label: "RÉSULTAT NET", fr: isInd ? 0.49 : 0.86, de: isInd ? 0.93 : 1.21, isTotal: true, highlight: true, unit: "M€" }
        ];
    };

    const data = getData(sector);
    const netFr = data[data.length - 1].fr;
    const netDe = data[data.length - 1].de;
    const ratio = (netDe / netFr).toFixed(1);

    const fmt = (val: number) => Math.abs(val).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " M€";

    return (
        <section id="duel-pme" className="relative rubik py-24 px-4 bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-5xl">

                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold md:text-5xl text-blue-900 mb-4">Le Match : France vs Allemagne</h2>
                    <p className="text-lg text-slate-600">
                        Simulation pour une PME standard de <strong>10 M€ de CA</strong>.
                        <br />Même activité, mais pas le même "reste à vivre".
                    </p>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mb-10">
                    <Button
                        variant={sector === "industry" ? "primary" : "outline"}
                        onClick={() => setSector("industry")}
                        className="gap-2"
                    >
                        <Factory className="h-4 w-4" /> Industrie
                    </Button>
                    <Button
                        variant={sector === "services" ? "primary" : "outline"}
                        onClick={() => setSector("services")}
                        className="gap-2"
                    >
                        <Building2 className="h-4 w-4" /> Services
                    </Button>
                </div>

                {/* TABLE COMPARISON */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">

                    {/* Columns Header */}
                    <div className="grid grid-cols-12 bg-slate-100 p-4 font-bold border-b border-slate-200">
                        <div className="col-span-4 text-slate-500 uppercase text-xs tracking-wider flex items-center">Poste de Dépense</div>
                        <div className="col-span-4 text-center text-blue-700 flex flex-col">
                            <span className="text-lg">🇫🇷 PME France</span>
                        </div>
                        <div className="col-span-4 text-center text-black flex flex-col">
                            <span className="text-lg">🇩🇪 Mittelstand</span>
                        </div>
                    </div>

                    {/* Rows */}
                    <div className="divide-y divide-slate-100">
                        {data.map((row, idx) => {
                            const gap = row.de - row.fr;
                            // For costs (negative nums), if DE > FR (e.g. -3 > -4), it's better for DE.
                            // If Result (positive), if DE > FR, it's better.
                            // So in all cases, if (row.de - row.fr) > 0, massive advantage DE? 
                            // Wait, -0.07 (DE) vs -0.35 (FR) -> -0.07 - (-0.35) = +0.28. Yes.

                            return (
                                <div key={idx} className={`grid grid-cols-12 p-4 items-center hover:bg-slate-50 transition-colors ${row.isTotal ? "bg-slate-50/50 font-bold" : "text-sm"}`}>

                                    {/* Label */}
                                    <div className="col-span-4 flex flex-col justify-center">
                                        <span className={row.highlight ? "text-blue-900 font-bold" : "text-slate-700"}>{row.label}</span>
                                        {row.comment && <span className="text-[10px] text-slate-400 font-normal italic mt-0.5">{row.comment}</span>}
                                    </div>

                                    {/* FR Value */}
                                    <div className="col-span-4 text-center">
                                        <span className={row.fr < 0 ? "text-red-500" : "text-blue-700"}>
                                            {row.fr > 0 && idx > 0 ? "+" : ""}{fmt(row.fr)}
                                        </span>
                                    </div>

                                    {/* DE Value - With Visual Diff indicator */}
                                    <div className="col-span-4 text-center relative">
                                        <span className={row.de < 0 ? "text-red-500" : "text-black"}>
                                            {row.de > 0 && idx > 0 ? "+" : ""}{fmt(row.de)}
                                        </span>

                                        {/* Diff Badge if significant */}
                                        {Math.abs(gap) > 0.1 && (
                                            <div className={`absolute right-0 top-1/2 -translate-y-1/2 text-[10px] px-1.5 py-0.5 rounded font-bold hidden md:block ${gap > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {gap > 0 ? "+" : ""}{gap.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* FOOTER SUMMARY */}
                    <div className="bg-slate-900 text-white p-6 grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <AlertTriangle className="text-yellow-400" /> Le verdict
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed">
                                À performance opérationnelle égale, la fiscalité de production et les charges sociales agissent comme un "frein à main".
                                La PME française a moins de cash pour investir, innover ou automatiser.
                            </p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4 flex items-center justify-between border border-white/20">
                            <div>
                                <div className="text-slate-400 text-xs uppercase tracking-wider">Écart Profitabilité</div>
                                <div className="text-2xl font-bold text-green-400">x{ratio}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm">Le Mittelstand génère</div>
                                <div className="font-bold text-white text-lg">2 fois plus de cash</div>
                            </div>
                            <CheckCircle className="h-8 w-8 text-green-400" />
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
