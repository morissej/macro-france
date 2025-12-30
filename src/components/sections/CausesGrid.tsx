"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scale, FileText, Factory, Users, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const causes = [
    {
        icon: <Scale className="h-8 w-8 text-amber-500" />,
        title: "Fiscalité de Production",
        desc: "3,8% du PIB en France vs 0,7% en Allemagne (écart x5,4). Résultat : 15% de compétitivité-prix perdue avant même de produire. Une fiscalité qui taxe l'existence plutôt que le profit.",
        color: "bg-amber-50 border-amber-200"
    },
    {
        icon: <Zap className="h-8 w-8 text-blue-500" />,
        title: "Investissement & Robots",
        desc: "R&D à 0,6% du CA contre 3% en Allemagne. Sous-investissement chronique : dans 7 ans, vos gammes seront obsolètes face à la concurrence. 180 robots/10k salariés vs 350.",
        color: "bg-blue-50 border-blue-200"
    },
    {
        icon: <Factory className="h-8 w-8 text-slate-500" />,
        title: "Taille Critique (ETI)",
        desc: "Des marges trop faibles pour grandir : seulement 5000 ETI. Le manque de fonds propres rend impossible le passage à l'échelle critique pour exporter massivement.",
        color: "bg-slate-50 border-slate-200"
    },
    {
        icon: <FileText className="h-8 w-8 text-red-500" />,
        title: "Lourdeur Administrative",
        desc: "CSRD, normes, complexité : pour une PME de 50 salariés, c'est 150k€ de surcoûts annuels par rapport à l'Allemagne comparable. Une 'taxe administrative' invisible.",
        color: "bg-red-50 border-red-200"
    },
    {
        icon: <Users className="h-8 w-8 text-purple-500" />,
        title: "Compétences & Talents",
        desc: "Fuite des cerveaux vers USA et Allemagne. Pénurie d'ingénieurs qualifiés et baisse de la productivité (-0,4%/an). Le talent disponible devient moins bon et plus cher.",
        color: "bg-purple-50 border-purple-200"
    }
];

export function CausesGrid() {
    return (
        <section id="causes-racines" className="relative min-h-[80vh] py-24 px-6 bg-slate-50 flex flex-col justify-center">
            <div className="mx-auto max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-primary md:text-5xl mb-4">
                        Les 5 Freins Structurels
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Ce n'est pas une fatalité, mais le résultat de choix politiques et économiques accumulés sur 30 ans.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {causes.map((cause, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card className={`h-full border-l-4 ${cause.color} shadow-sm hover:shadow-md transition-all`}>
                                <CardHeader>
                                    <div className="mb-4">{cause.icon}</div>
                                    <CardTitle className="text-xl">{cause.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-600">{cause.desc}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="bg-primary text-white rounded-xl p-8 flex flex-col justify-center items-center text-center shadow-xl lg:col-span-1"
                    >
                        <h3 className="text-2xl font-bold mb-4">La conséquence ?</h3>
                        <p className="text-lg text-blue-100">
                            Cash-flow détruit, impossibilité de financer l'avenir. Le choix n'est plus stratégique mais mathématique : Pivoter, Délocaliser ou Mourir.
                        </p>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
