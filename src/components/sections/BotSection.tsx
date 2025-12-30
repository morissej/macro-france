"use client";

import React from "react";
import { MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BotSection() {
    const handleClick = () => {
        // This is a hack to trigger the floating bot opening
        // Ideally we would share state via Context/Zustand, but the Bot is self-contained.
        // For now, let's just highlight the button area or assume the user sees the floating button.
        // BETTER: Let's make the store control the bot visibility globally if needed, 
        // OR just visual cue.

        // Simulating a click on the floating button if it exists
        const fab = document.getElementById('open-chat-button');
        // This is brittle but works for this "loose coupling" requirement without rewriting the Bot entirely to use Store.
        if (fab) fab.click();
    };

    return (
        <section id="bot-section" className="relative py-32 px-6 bg-white flex flex-col items-center justify-center text-center">
            <div className="max-w-3xl mx-auto space-y-8">
                <div className="inline-block p-4 bg-primary/10 rounded-full mb-4">
                    <MessageSquare className="h-12 w-12 text-primary" />
                </div>

                <h2 className="text-4xl font-extrabold text-slate-900 md:text-5xl">
                    Et vous, où en êtes-vous ?
                </h2>

                <p className="text-xl text-slate-600 leading-relaxed">
                    Votre PME est-elle armée pour affronter la concurrence européenne, ou êtes-vous en danger sans le savoir ?
                    <br />Faites le test en 5 questions.
                </p>

                <Button
                    size="lg"
                    className="text-lg h-16 px-12 rounded-full shadow-xl hover:scale-105 transition-transform"
                    onClick={handleClick}
                >
                    Lancer le diagnostic
                    <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
            </div>
        </section>
    );
}
