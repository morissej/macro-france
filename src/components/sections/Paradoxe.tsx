"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { LineDualAxis } from "@/components/charts/LineDualAxis";
import { datasets } from "@/lib/data";
import { Eye, TrendingDown, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Paradoxe() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { isCeoMode, toggleCeoMode } = useAppStore();

    // Prepare data: merge productivity (France only usually) and employment
    // For demo, let's look at datasets structure
    // datasets.timeSeries.productivityIndex.data has year, France, etc.
    // datasets.timeSeries.employmentIndex.data has year, France

    // We need to merge them on year
    const mergedData = datasets.timeSeries.productivityIndex.data.map(p => {
        const emp = datasets.timeSeries.employmentIndex.data.find(e => e.year === p.year);
        return {
            year: p.year,
            productivity: p.France,
            employment: emp ? emp.France : 0 // employment starts 2019
        };
    }).filter(d => d.year >= 2019); // Focus on post-2019


    return (
        <section id="paradoxe" ref={containerRef} className="relative min-h-[150vh] py-24 px-6 bg-white">
            <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-12 sticky top-24">

                {/* Narrative Side */}
                <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center space-x-2 rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-800">
                            <TrendingDown className="h-3 w-3" />
                            <span>Le grand décrochage</span>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-primary md:text-4xl">
                            Le paradoxe : plus d’emplois, moins de productivité
                        </h2>
                        <p className="text-lg text-muted text-justify">
                            La France a réussi un miracle sur l’emploi. Mais elle est la seule grande économie européenne encore sous son niveau de productivité de 2019.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="p-6 bg-gray-50 rounded-[20px] border border-gray-100">
                            <h3 className="font-semibold text-primary mb-2 flex items-center">
                                <Users className="h-5 w-5 mr-2 text-secondary" />
                                Le pari de l'emploi
                            </h3>
                            <p className="text-sm text-muted">
                                Des réformes structurelles (ordonnances travail, apprentissage) ont enrichi la croissance en emplois. Le chômage baisse.
                            </p>
                        </div>

                        <div className="p-6 bg-orange-50 rounded-[20px] border border-orange-100">
                            <h3 className="font-semibold text-orange-900 mb-2 flex items-center">
                                <TrendingDown className="h-5 w-5 mr-2 text-orange-600" />
                                Le coût caché : l'efficacité
                            </h3>
                            <p className="text-sm text-orange-900/80">
                                Sans gains de productivité, il n'y a pas de marge durable à distribuer en salaires ou en dividendes. La machine tourne plus vite, mais ne produit pas plus de valeur par heure.
                            </p>
                        </div>
                    </div>

                    <div>
                        <Button
                            variant="outline"
                            onClick={toggleCeoMode}
                            className="w-full justify-between"
                        >
                            <span>{isCeoMode ? "Mode Économiste" : "Mode CEO : Impact Business"}</span>
                            <Eye className="h-4 w-4" />
                        </Button>

                        {isCeoMode && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10 text-sm text-primary"
                            >
                                <strong>Impact PME/ETI :</strong><br />
                                • Pression sur les marges (EBITDA)<br />
                                • Difficulté à financer l'innovation à iso-coût<br />
                                • Risque de déclassement prix/qualité
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Chart Side */}
                <div className="lg:col-span-7 bg-white rounded-[24px] shadow-card border border-border p-8 flex flex-col justify-center">
                    <div className="mb-6">
                        <h4 className="text-lg font-bold text-primary">France : Productivité vs Emploi</h4>
                        <p className="text-sm text-muted">Base 100 = 2019</p>
                    </div>

                    <LineDualAxis
                        data={mergedData}
                        series={[
                            { key: 'productivity', label: 'Productivité par tête', color: 'var(--color-danger)' },
                            { key: 'employment', label: 'Emploi total', color: 'var(--color-success)' }
                        ]}
                        height={400}
                    />

                    <div className="mt-6 text-xs text-muted text-center italic">
                        Sources: {datasets.timeSeries.productivityIndex.source}
                    </div>
                </div>
            </div>
        </section>
    );
}
