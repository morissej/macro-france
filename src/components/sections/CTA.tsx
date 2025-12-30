"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Download, Rocket, Info } from "lucide-react";

interface CTAProps {
    onOpenAdmin?: () => void;
}

export function CTA({ onOpenAdmin }: CTAProps) {
    const { openModal } = useAppStore();

    const handleShare = async () => {
        const shareData = {
            title: 'Le Casse-tête de la Compétitivité',
            text: 'Comprendre en 5 minutes pourquoi la compétitivité française est fragile — et où agir.',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert("Lien copié dans le presse-papier !");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleExport = () => {
        window.print();
    };

    return (
        <section id="cta" className="py-20 bg-slate-950 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
                <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em]">NexDeal Advisory © 2025 - Vision Stratégique 2035</p>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 flex-wrap">
                    <a
                        href="https://nexdeal-sparring.firebaseapp.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-slate-900 text-slate-400 font-bold rounded-xl text-[10px] uppercase tracking-widest border border-slate-800 hover:text-indigo-400 hover:border-indigo-900/50 transition-all hover:bg-slate-800/50"
                    >
                        En savoir plus sur CEOs Pain Points
                    </a>

                    <a
                        href="https://nexdeal-advisory.firebaseapp.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-slate-900 text-slate-400 font-bold rounded-xl text-[10px] uppercase tracking-widest border border-slate-800 hover:text-emerald-400 hover:border-emerald-900/50 transition-all hover:bg-slate-800/50"
                    >
                        NexDeal Advisory
                    </a>

                    <a
                        href="https://www.linkedin.com/showcase/ceos-pain-points/?viewAsMember=true"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-slate-900 text-slate-400 font-bold rounded-xl text-[10px] uppercase tracking-widest border border-slate-800 hover:text-blue-400 hover:border-blue-900/50 transition-all hover:bg-slate-800/50"
                    >
                        Linkedin CEOs Pain Points
                    </a>

                    <button
                        onClick={onOpenAdmin}
                        className="px-6 py-3 bg-slate-900 text-slate-500 font-bold rounded-xl text-[10px] uppercase tracking-widest border border-slate-800 hover:text-indigo-400 hover:border-indigo-900/50 transition-colors"
                    >
                        Portail Partenaires
                    </button>
                </div>
            </div>
        </section>

    );
}
