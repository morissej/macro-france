"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, Cpu, Hammer, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const techs = [
    { id: "ia", label: "IA / Big Data", icon: Cpu, baseImpact: 0.05 },
    { id: "robot", label: "Robotique avancée", icon: Hammer, baseImpact: 0.08 },
    { id: "process", label: "Process / Lean", icon: Zap, baseImpact: 0.04 },
];

export function ComboImpact() {
    const [selected, setSelected] = useState<string[]>(["ia"]);

    const toggle = (id: string) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    // Logic: 
    // 1 item = base impact
    // 2 items = sum + 20% synergy
    // 3 items = sum + 50% synergy

    const baseTotal = selected.reduce((acc, id) => {
        return acc + (techs.find(t => t.id === id)?.baseImpact || 0);
    }, 0);

    let synergy = 0;
    if (selected.length === 2) synergy = 0.20;
    if (selected.length === 3) synergy = 0.50;

    const totalGrowth = baseTotal * (1 + synergy);
    const formattedGrowth = (totalGrowth * 100).toFixed(1);

    return (
        <section id="effet-combo" className="relative min-h-[80vh] py-24 px-6 bg-slate-50 flex items-center">
            <div className="mx-auto max-w-5xl w-full grid md:grid-cols-2 gap-16 items-center">

                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-primary">
                        L'effet de levier technologique
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        L'IA seule aide, mais ne transforme pas tout. C'est la combinaison des technologies qui crée le saut de productivité.
                    </p>

                    <div className="grid gap-4">
                        {techs.map((tech) => (
                            <button
                                key={tech.id}
                                onClick={() => toggle(tech.id)}
                                className={cn(
                                    "flex items-center p-4 rounded-xl border-2 transition-all w-full text-left",
                                    selected.includes(tech.id)
                                        ? "border-primary bg-primary/5 text-primary"
                                        : "border-gray-200 bg-white hover:border-primary/50 text-gray-500"
                                )}
                            >
                                <div className={cn(
                                    "h-6 w-6 rounded-md border flex items-center justify-center mr-4 transition-colors",
                                    selected.includes(tech.id) ? "bg-primary border-primary text-white" : "border-gray-300"
                                )}>
                                    {selected.includes(tech.id) && <Check className="h-4 w-4" />}
                                </div>
                                <tech.icon className="h-5 w-5 mr-3" />
                                <span className="font-semibold">{tech.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center bg-white p-8 rounded-[30px] border border-gray-100 shadow-xl">
                    <div className="relative w-48 h-64 bg-gray-100 rounded-2xl overflow-hidden flex items-end justify-center mb-6">
                        {/* Bar */}
                        <motion.div
                            className="w-full bg-gradient-to-t from-secondary to-accent"
                            initial={{ height: "5%" }}
                            animate={{ height: `${Math.min(100, totalGrowth * 400)}%` }} // Scaling factor for visual
                            transition={{ type: "spring", stiffness: 100 }}
                        />

                        {/* Markers */}
                        <div className="absolute top-0 w-full h-full border-b border-gray-300 pointer-events-none" />
                    </div>

                    <div className="text-center">
                        <motion.div
                            key={formattedGrowth}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent"
                        >
                            +{formattedGrowth}%
                        </motion.div>
                        <div className="text-sm font-medium text-gray-500 mt-2 uppercase tracking-wide">
                            Gains de productivité
                        </div>
                        {selected.length > 1 && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-2 text-xs font-bold text-success bg-success/10 px-2 py-1 rounded"
                            >
                                Synergie active !
                            </motion.div>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}
