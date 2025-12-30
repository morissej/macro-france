"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { X } from "lucide-react";

export function ModalContainer() {
    const { activeModal, closeModal } = useAppStore();

    if (!activeModal) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={closeModal}
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-[24px] shadow-2xl p-6 md:p-8"
                >
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>

                    {activeModal === "sources" && <SourcesContent />}
                    {activeModal === "ceoTranslation" && <CeoContent />}
                </motion.div>
            </div>
        </AnimatePresence>
    );
}

function SourcesContent() {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">Sources & Méthodologie</h3>
            <div className="space-y-4 text-muted-foreground">
                <div>
                    <h4 className="font-semibold text-gray-900">Synthèse compétitivité</h4>
                    <p>Données issues de la CNP (Conseil National de Productivité) et de l'INSEE. Le décrochage de productivité (-3,5% vs 2019) est un fait statistique majeur observé depuis 2023.</p>
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900">Investissements IA</h4>
                    <p>Comparaisons basées sur les rapports "Stanford AI Index" et données Eurostat. L'écart US/Europe est significatif sur les investissements privés.</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-xl text-xs text-yellow-800">
                    Note : Ce prototype utilise des données simplifiées à des fins de démonstration narrative.
                </div>
            </div>
        </div>
    );
}

function CeoContent() {
    return (
        <div className="space-y-6">
            <h3 className="text-2xl font-bold text-primary">Version Entreprise</h3>
            <div className="space-y-4 text-muted-foreground">
                <p>
                    L'analyse macro-économique permet de comprendre le contexte, mais l'action se passe dans votre entreprise.
                </p>
                <p>
                    Nous pouvons décliner ce moteur narratif pour visualiser vos propres données :
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                    <li><strong className="text-primary">Scorecard Compétitivité :</strong> Où vous situez-vous (Prix vs Hors-prix) ?</li>
                    <li><strong className="text-primary">Radar Digital :</strong> Maturité de votre stack technologique.</li>
                    <li><strong className="text-primary">Stress-test Marge :</strong> Impact fiscal et réglementaire sur votre EBITDA.</li>
                </ul>
                <div className="mt-8 pt-6 border-t font-medium text-center text-primary">
                    Contactez-nous pour une démo personnalisée.
                </div>
            </div>
        </div>
    );
}
