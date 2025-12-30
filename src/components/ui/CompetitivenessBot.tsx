"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, RefreshCcw, Briefcase, TrendingUp, AlertTriangle, ShieldCheck, PlayCircle, User, Globe, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// --- Types ---
type Sector = "Industry" | "Services" | "Retail" | "Tech" | "Autre";
type CompanySize = "Small" | "Medium" | "Large" | "Corp";

interface Question {
    id: number;
    text: string;
    options: { label: string; score: number }[];
    weight: Record<Sector, number>;
}

interface Message {
    id: string;
    sender: "bot" | "user";
    text: React.ReactNode;
}

// --- Data & Logic ---

const sectors: { label: string; value: Sector }[] = [
    { label: "Industrie / BTP", value: "Industry" },
    { label: "Services B2B", value: "Services" },
    { label: "Commerce / Retail", value: "Retail" },
    { label: "Tech / SaaS", value: "Tech" },
    { label: "Autre", value: "Autre" },
];

const sizes: { label: string; value: CompanySize }[] = [
    { label: "< 1 M€ (TPE)", value: "Small" },
    { label: "1 - 10 M€ (PME)", value: "Medium" },
    { label: "10 - 50 M€ (ETI)", value: "Large" },
    { label: "> 50 M€ (Groupe)", value: "Corp" },
];

const questions: Question[] = [
    {
        id: 1,
        text: "Comment situez-vous vos prix par rapport à la concurrence ?",
        options: [
            { label: "Plus bas (Low cost)", score: 10 },
            { label: "Alignés", score: 20 },
            { label: "Plus élevés (Premium)", score: 30 },
        ],
        weight: { Industry: 1.2, Services: 1, Retail: 1.5, Tech: 0.8, Autre: 1.0 }
    },
    {
        id: 2,
        text: "Quelle est votre position sur votre marché ?",
        options: [
            { label: "Challenger / Petit", score: 5 },
            { label: "Moyenne / Équivalent", score: 15 },
            { label: "Leader / Dominant", score: 25 },
        ],
        weight: { Industry: 1.5, Services: 1, Retail: 1.2, Tech: 2.0, Autre: 1.0 }
    },
    {
        id: 3,
        text: "Quelle part de CA réalisez-vous à l'export ?",
        options: [
            { label: "Nulle (< 5%)", score: 5 },
            { label: "Opportuniste (5-20%)", score: 15 },
            { label: "Structurelle (> 20%)", score: 25 },
        ],
        weight: { Industry: 1.5, Services: 0.8, Retail: 0.5, Tech: 1.2, Autre: 1.0 }
    },
    {
        id: 4,
        text: "Niveau de digitalisation des opérations ?",
        options: [
            { label: "Basique (Excel/Papier)", score: 5 },
            { label: "Intermédiaire (ERP)", score: 15 },
            { label: "Avancé (Data/IA/Auto)", score: 25 },
        ],
        weight: { Industry: 1.3, Services: 1.2, Retail: 1.0, Tech: 0.5, Autre: 1.0 }
    },
    {
        id: 5,
        text: "Part du CA réinvestie en innovation/R&D ?",
        options: [
            { label: "Faible (< 2%)", score: 0 },
            { label: "Moyenne (2-5%)", score: 15 },
            { label: "Forte (> 5%)", score: 25 },
        ],
        weight: { Industry: 1.2, Services: 1.0, Retail: 0.8, Tech: 2.5, Autre: 1.0 }
    },
];

export function CompetitivenessBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(0); // 0=Intro, 1=Sector, 2=Size, 3..7=Questions, 8=LeadForm, 9=Result
    const [sector, setSector] = useState<Sector | null>(null);
    const [size, setSize] = useState<CompanySize | null>(null);

    // Lead Form State
    const [leadName, setLeadName] = useState("");
    const [leadRole, setLeadRole] = useState("");
    const [leadUrl, setLeadUrl] = useState("");

    const [score, setScore] = useState(0);
    const [maxPossibleScore, setMaxPossibleScore] = useState(0);
    const [transcript, setTranscript] = useState<string>("");

    const [messages, setMessages] = useState<Message[]>([
        { id: "intro", sender: "bot", text: "Bonjour ! Je suis l'IA de NexDeal. Analysons votre compétitivité réelle." }
    ]);
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    useEffect(() => scrollToBottom(), [messages, isTyping, isOpen]);

    // --- Interaction Handlers ---

    const handleStart = () => {
        addMessage("user", "Démarrer l'analyse");
        processStep(1); // Ask Sector
    };

    const handleSectorSelect = (s: Sector) => {
        setSector(s);
        addMessage("user", sectors.find(sec => sec.value === s)?.label || s);
        processStep(2); // Ask Size
    };

    const handleSizeSelect = (s: CompanySize) => {
        setSize(s);
        addMessage("user", sizes.find(sz => sz.value === s)?.label || s);
        processStep(3); // First Question
    };

    const handleQuestionAnswer = (option: { label: string; score: number }, qIndex: number) => {
        addMessage("user", option.label);

        // Logic
        const currentQ = questions[qIndex];
        const weight = sector ? currentQ.weight[sector] : 1;
        setScore(prev => prev + (option.score * weight));
        setMaxPossibleScore(prev => prev + (30 * weight));

        setTranscript(prev => prev + `\nQ: ${currentQ.text}\nR: ${option.label}\n`);

        processStep(step + 1);
    };

    const handleLeadSubmit = async () => {
        if (!leadName || !leadRole) return; // Basic validation
        addMessage("user", `Nom: ${leadName}, Rôle: ${leadRole}`);
        setIsTyping(true);

        try {
            await saveToFirebase();
        } catch (e) {
            console.error("Save failed", e);
        }

        processStep(step + 1); // Show Result
    };

    const addMessage = (sender: "bot" | "user", text: React.ReactNode) => {
        const id = Math.random().toString(36).substring(7);
        setMessages(prev => [...prev, { id, sender, text }]);
    };

    const processStep = (nextStep: number) => {
        setIsTyping(true);
        setStep(nextStep);

        // Delays for natural feeling
        setTimeout(() => {
            setIsTyping(false);

            if (nextStep === 1) {
                addMessage("bot", "Pour commencer, quel est votre secteur d'activité principal ?");
            } else if (nextStep === 2) {
                addMessage("bot", "Quelle est la taille de votre entreprise (CA annuel) ?");
            } else if (nextStep >= 3 && nextStep < 3 + questions.length) { // 3 to 7
                const qIndex = nextStep - 3;
                addMessage("bot", questions[qIndex].text);
            } else if (nextStep === 3 + questions.length) { // 8 => Lead Form
                addMessage("bot", "Analyse presque terminée ! Pour générer votre rapport personnalisé, j'ai besoin de quelques infos :");
            } else { // 9 => Result
                showResult();
            }
        }, 800);
    };

    const saveToFirebase = async () => {
        const ratio = (score / maxPossibleScore) * 100;
        let diagnosis = getDiagnosis(ratio).title;

        try {
            await addDoc(collection(db, "diagnostics"), {
                created_at: new Date().toISOString(),
                user_name: leadName || "Anonyme",
                title: leadRole || "N/A",
                company: size || "N/A",
                website: leadUrl || "",
                score: Math.round(ratio),
                diagnostic: diagnosis,
                transcript: transcript,
                sector: sector
            });
        } catch (e) {
            console.error("Error saving to DB", e);
        }
    };

    const getDiagnosis = (ratio: number) => {
        if (ratio < 40) return { title: "Compétitivité Fragile", rec: "Urgence : Consolidation ou adossement à un groupe.", color: "red" };
        if (ratio < 75) return { title: "Bonne résilience", rec: "Action : Croissance externe ciblée.", color: "amber" };
        return { title: "Leader de marché", rec: "Stratégie : Devenez un consolidateur sectoriel.", color: "emerald" };
    };

    const showResult = () => {
        const ratio = (score / maxPossibleScore) * 100;
        const { title, rec, color } = getDiagnosis(ratio);

        const resultCard = (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 space-y-3">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-slate-500">Score IA</span>
                    <span className={cn("text-xl font-black", color === "emerald" ? "text-emerald-600" : color === "amber" ? "text-amber-500" : "text-red-500")}>
                        {Math.round(ratio)}/100
                    </span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className={cn("h-full transition-all duration-1000", color === "emerald" ? "bg-emerald-500" : color === "amber" ? "bg-amber-500" : "bg-red-500")} style={{ width: `${ratio}%` }}></div>
                </div>

                <div className="space-y-1">
                    <div className="flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-slate-400 mt-1" />
                        <p className="text-sm text-slate-700 font-medium">{title}</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <Briefcase className="w-4 h-4 text-indigo-500 mt-1" />
                        <p className="text-sm text-indigo-700 font-bold">{rec}</p>
                    </div>
                </div>
            </div>
        );

        addMessage("bot", "Analyse complétée. Voici mon diagnostic stratégique :");
        setTimeout(() => addMessage("bot", resultCard), 600);
    };

    const reset = () => {
        setStep(0);
        setScore(0);
        setMaxPossibleScore(0);
        setSector(null);
        setLeadName("");
        setLeadRole("");
        setMessages([{ id: "reset", sender: "bot", text: "Réinitialisation... On reprend depuis le début ?" }]);
    };

    // --- Render Helpers ---

    return (
        <>
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-[380px] sm:w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden font-sans"
                        >
                            {/* Simple Header */}
                            <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-indigo-500/20 rounded-lg">
                                        <Bot className="h-5 w-5 text-indigo-400" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-sm block">NexDeal AI Analyst</span>
                                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Diagnostic Stratégique</span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button onClick={reset} className="hover:bg-white/10 p-2 rounded-lg transition-colors text-slate-400 hover:text-white" title="Reset">
                                        <RefreshCcw className="h-4 w-4" />
                                    </button>
                                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-2 rounded-lg transition-colors text-slate-400 hover:text-white" title="Close">
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 scrollbar-thin scrollbar-thumb-slate-200">
                                {messages.map((msg) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={cn(
                                            "max-w-[85%] p-3.5 text-sm rounded-2xl shadow-sm leading-relaxed",
                                            msg.sender === "bot"
                                                ? "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                                                : "bg-indigo-600 text-white self-end ml-auto rounded-tr-none"
                                        )}
                                    >
                                        {msg.text}
                                    </motion.div>
                                ))}

                                {isTyping && (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 w-fit">
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                            <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area (Contextual) */}
                            <div className="p-4 bg-white border-t border-slate-100">
                                {/* Intro */}
                                {step === 0 && (
                                    <Button onClick={handleStart} className="w-full h-12 text-md rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20">
                                        Lancer l'analyse <PlayCircle className="ml-2 h-4 w-4" />
                                    </Button>
                                )}

                                {/* Sector */}
                                {step === 1 && !isTyping && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {sectors.map((sec) => (
                                            <button
                                                key={sec.value}
                                                onClick={() => handleSectorSelect(sec.value)}
                                                className="p-3 text-sm font-medium bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all truncate"
                                            >
                                                {sec.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Size */}
                                {step === 2 && !isTyping && (
                                    <div className="grid grid-cols-1 gap-2">
                                        {sizes.map((sz) => (
                                            <button
                                                key={sz.value}
                                                onClick={() => handleSizeSelect(sz.value)}
                                                className="w-full p-3 text-sm font-medium bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all"
                                            >
                                                {sz.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Questions */}
                                {step >= 3 && step < 3 + questions.length && !isTyping && (
                                    <div className="space-y-2">
                                        {questions[step - 3].options.map((opt, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => handleQuestionAnswer(opt, step - 3)}
                                                className="w-full text-left p-3.5 text-sm bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl transition-colors border border-slate-200 font-medium"
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Lead Form */}
                                {step === 3 + questions.length && !isTyping && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Prénom / Nom</label>
                                            <input
                                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="Jean Dupont"
                                                value={leadName}
                                                onChange={(e) => setLeadName(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Rôle / Fonction</label>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                value={leadRole}
                                                onChange={(e) => setLeadRole(e.target.value)}
                                            >
                                                <option value="">Sélectionner...</option>
                                                <option value="CEO">CEO / Dirigeant</option>
                                                <option value="M&A">Directeur M&A / Stratégie</option>
                                                <option value="CFO">DAF / Finance</option>
                                                <option value="Investisseur">Investisseur</option>
                                                <option value="Autre">Autre</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-500 uppercase">Site Web (Optionnel)</label>
                                            <input
                                                className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                                                placeholder="www.monentreprise.fr"
                                                value={leadUrl}
                                                onChange={(e) => setLeadUrl(e.target.value)}
                                            />
                                        </div>
                                        <Button
                                            onClick={handleLeadSubmit}
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 mt-2"
                                            disabled={!leadName || !leadRole}
                                        >
                                            Voir mon résultat <TrendingUp className="w-4 h-4 ml-2" />
                                        </Button>
                                    </div>
                                )}

                                {/* Result Action */}
                                {step > 3 + questions.length && (
                                    <Button onClick={() => window.open("https://nexdeal-advisory.firebaseapp.com/", "_blank")} className="w-full bg-slate-900 hover:bg-slate-800">
                                        Contacter un Expert M&A
                                    </Button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Floating Trigger Button */}
                {!isOpen && (
                    <motion.button
                        id="open-chat-button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="group flex items-center gap-3 pr-6 pl-2 py-2 bg-white rounded-full shadow-2xl border border-slate-100 cursor-pointer hover:border-indigo-100 transition-all"
                    >
                        <div className="h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg group-hover:bg-indigo-700 transition-colors">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                            <span className="block text-xs font-bold text-indigo-600 uppercase tracking-wider">Diagnostic IA</span>
                            <span className="block text-sm font-bold text-slate-900">Testez votre PME</span>
                        </div>
                    </motion.button>
                )}
            </div>
        </>
    );
}
