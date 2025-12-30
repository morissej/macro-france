"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { WaterfallChart } from "@/components/charts/WaterfallChart";
import { datasets } from "@/lib/data";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function Waterfall() {
    const { isCeoMode, toggleCeoMode } = useAppStore();
    const [selectedBar, setSelectedBar] = useState<string | null>(null);

    const data = datasets.waterfall.prodDecrochage;

    // Find tooltip content
    const selectedDetails = data.find(d => d.id === selectedBar);

    return (
        <section id="waterfall" className="relative min-h-screen py-24 px-6 bg-slate-50">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl mb-4">
                        Pourquoi ça décroche : la décomposition
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        L'écart de productivité n'est pas une fatalité, c'est une somme de mécanismes.
                        <br />Cliquez sur les barres pour comprendre les effets.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-8 bg-white p-6 rounded-[24px] shadow-sm border border-border">
                        <WaterfallChart
                            data={data}
                            totalLabel="Écart Total"
                            onClickBar={setSelectedBar}
                            height={500}
                        />
                    </div>

                    <div className="lg:col-span-4 space-y-6">
                        <AnimatePresence mode="wait">
                            {selectedDetails ? (
                                <motion.div
                                    key={selectedDetails.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                >
                                    <Card className="border-secondary/20 bg-secondary/5">
                                        <CardHeader>
                                            <CardTitle className="text-xl flex items-center gap-2">
                                                <Info className="h-5 w-5 text-secondary" />
                                                {selectedDetails.label}
                                            </CardTitle>
                                            <CardDescription className="text-lg font-bold text-secondary">
                                                {selectedDetails.value}% d'impact
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-secondary-foreground/80">
                                                {selectedDetails.tooltip}
                                            </p>
                                            {isCeoMode && (
                                                <div className="mt-4 pt-4 border-t border-secondary/10">
                                                    <strong className="text-sm uppercase tracking-wider text-secondary">Impact Business</strong>
                                                    <p className="text-sm mt-1">
                                                        Cela traduit une difficulté à recruter des profils immédiatement opérationnels ou performants.
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ) : (
                                <Card className="border-dashed">
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center">
                                        <Info className="h-8 w-8 mb-2 opacity-50" />
                                        <p>Cliquez sur un élément du graphique<br />pour voir les détails.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </AnimatePresence>

                        <Button
                            variant="ghost"
                            className="w-full justify-start text-muted-foreground hover:text-primary"
                            onClick={toggleCeoMode}
                        >
                            {isCeoMode ? "Désactiver le mode business" : "Activer la lecture business"}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
