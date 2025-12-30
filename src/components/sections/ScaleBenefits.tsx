"use client";

import React from "react";
import { motion } from "framer-motion";
import {
    Zap,
    Rocket,
    Handshake,
    Repeat,
    Lightbulb,
    ArrowUpRight,
    TrendingUp
} from "lucide-react";
import { Card } from "@/components/ui/card";

export function ScaleBenefits() {

    const benefits = [
        {
            title: "Synergies Opérationnelles",
            icon: Zap,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
            description: "Rationalisation des fonctions supports (IT, RH, Finance). L'union fait la force : élimination des doublons et optimisation des coûts fixes.",
            stat: "1 + 1 = 3"
        },
        {
            title: "Capacité d'Investissement & R&D",
            icon: Rocket,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
            description: "Accès aux technologies de rupture (IA, Robotisation) inaccessibles aux petites structures. L'innovation devient un moteur, pas un luxe.",
            stat: "Innovation x2"
        },
        {
            title: "Poids Fournisseurs (Purchasing Power)",
            icon: Handshake,
            color: "text-green-400",
            bg: "bg-green-400/10",
            description: "Rapport de force inversé. Négociation de remises sur volume et amélioration critique du BFR via des délais de paiement optimisés.",
            stat: "-15% Coûts"
        },
        {
            title: "Cross-Selling & Maillage",
            icon: Repeat,
            color: "text-purple-400",
            bg: "bg-purple-400/10",
            description: "Vente croisée de services complémentaires sur une base client élargie. Augmentation mécanique de la 'Life Time Value' (LTV).",
            stat: "+35% Rev (Amazon)"
        },
        {
            title: "Best Practices & Talents",
            icon: Lightbulb,
            color: "text-pink-400",
            bg: "bg-pink-400/10",
            description: "Attraction des meilleurs profils cadres grâce à des perspectives de carrière. Standardisation des processus sur le modèle le plus performant.",
            stat: "Productivité ++"
        },
        {
            title: "Valorisation (Multiple Arbitrage)",
            icon: TrendingUp,
            color: "text-teal-400",
            bg: "bg-teal-400/10",
            description: "Mécanique financière clé : la taille critique permet de débloquer des multiples de valorisation supérieurs à la revente.",
            stat: "Multiples +30%"
        }
    ];

    return (
        <section id="scale-benefits" className="relative rubik py-24 px-4 bg-slate-900 text-white overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-32 bg-blue-600/20 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 p-32 bg-purple-600/20 rounded-full blur-3xl opacity-50" />

            <div className="mx-auto max-w-7xl relative z-10 w-full">

                {/* Header */}
                <div className="text-center mb-20 space-y-4">
                    <h2 className="text-4xl font-extrabold md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-white to-purple-400">
                        La Force de la taille
                    </h2>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
                        Le M&A n'est pas qu'une addition financière. C'est un multiplicateur de puissance industrielle et commerciale.
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full bg-slate-800/50 backdrop-blur-sm border-slate-700 p-8 hover:bg-slate-800/80 transition-colors group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className={`p-3 rounded-xl ${benefit.bg} ${benefit.color}`}>
                                        <benefit.icon className="h-8 w-8" />
                                    </div>
                                    <div className="bg-slate-700/50 px-3 py-1 rounded-full text-xs font-bold text-slate-300 flex items-center gap-1">
                                        {benefit.stat}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-3 text-slate-100 group-hover:text-white transition-colors">
                                    {benefit.title}
                                </h3>

                                <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                    {benefit.description}
                                </p>

                                <div className="mt-6 flex items-center text-sm font-medium text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                                    En savoir plus <ArrowUpRight className="ml-1 h-4 w-4" />
                                </div>
                            </Card>
                        </motion.div>
                    ))}

                    {/* Call to Action Card in the grid */}

                </div>
            </div>
        </section>
    );
}
