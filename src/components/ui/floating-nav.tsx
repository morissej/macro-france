"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const sections = [
    { id: "hero", label: "Intro" },
    { id: "global-competitiveness", label: "Le Constat" },
    { id: "causes-racines", label: "Les Causes" },
    { id: "duel-pme", label: "Le Duel" },
    { id: "bot-section", label: "Diagnostic" },
    { id: "scale-benefits", label: "La Solution" },
    { id: "cta", label: "Conclusion" },
];

export function FloatingNav() {
    const { activeSection } = useAppStore();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <div className="fixed right-6 top-1/2 z-50 -translate-y-1/2 hidden lg:flex flex-col gap-4">
            {sections.map((section) => (
                <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className="group relative flex items-center justify-end"
                    aria-label={`Go to ${section.label}`}
                >
                    <span
                        className={cn(
                            "absolute right-8 rounded-md bg-primary/90 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity duration-300",
                            "group-hover:opacity-100 pointer-events-none"
                        )}
                    >
                        {section.label}
                    </span>
                    <div
                        className={cn(
                            "h-3 w-3 rounded-full border-2 border-primary transition-all duration-300",
                            activeSection === section.id
                                ? "bg-primary scale-125"
                                : "bg-transparent hover:bg-primary/50"
                        )}
                    />
                </button>
            ))}
        </div>
    );
}
