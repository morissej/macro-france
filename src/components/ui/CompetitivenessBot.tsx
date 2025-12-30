"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, RefreshCcw, Briefcase, TrendingUp, AlertTriangle, ShieldCheck, PlayCircle, User, Globe, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

// --- Types ---
type Sector = "Industry" | "Services" | "Retail" | "Tech" | "Transport" | "Autre";
type CompanySize = "Small" | "Medium" | "Large" | "Corp";

interface Question {
    id: number;
    context: string; // Explaining WHY we ask this
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
    { label: "Transport / Logistique", value: "Transport" },
    { label: "Autre / Divers", value: "Autre" },
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
        context: "Le pricing power est le premier indicateur de la valeur perçue par vos clients.",
        text: "Comment vos prix se situent-ils par rapport à vos principaux concurrents directs ?",
        options: [
            { label: "Plus bas : Nous jouons sur la compétitivité coût / volume.", score: 10 },
            { label: "Alignés : Nous suivons les prix du marché.", score: 20 },
            { label: "Premium : Nos prix sont supérieurs, justifiés par la valeur.", score: 30 },
        ],
        weight: { Industry: 1.2, Services: 1, Retail: 1.5, Tech: 0.8, Transport: 1.4, Autre: 1.0 }
    },
    {
        id: 2,
        context: "La dynamique de parts de marché révèle votre momentum commercial.",
        text: "Quelle est votre position actuelle sur votre marché principal ?",
        options: [
            { label: "Challenger : Petite part de marché, en conquête.", score: 5 },
            { label: "Établi : Acteur solide parmi d'autres.", score: 15 },
            { label: "Leader : Position dominante ou numéro 1.", score: 25 },
        ],
        weight: { Industry: 1.5, Services: 1, Retail: 1.2, Tech: 2.0, Transport: 1.3, Autre: 1.0 }
    },
    {
        id: 3,
        context: "L'indépendance vis-à-vis du cycle économique national est cruciale pour la valorisation.",
        text: "Quelle part de votre Chiffre d'Affaires réalisez-vous à l'international ?",
        options: [
            { label: "Nulle : < 5% (Exclusivement domestique)", score: 5 },
            { label: "Opportuniste : 5-20% (Quelques clients étrangers)", score: 15 },
            { label: "Structurelle : > 20% (Présence internationale établie)", score: 25 },
        ],
        weight: { Industry: 1.5, Services: 0.8, Retail: 0.5, Tech: 1.2, Transport: 1.0, Autre: 1.0 }
    },
    {
        id: 4,
        context: "L'efficience opérationnelle moderne repose sur la donnée.",
        text: "Quel est le niveau de digitalisation et d'automatisation de vos opérations ?",
        options: [
            { label: "Basique : Pilotage manuel, Excel prédominant.", score: 5 },
            { label: "Intermédiaire : ERP en place, process structurés.", score: 15 },
            { label: "Avancé : Pilotage par la donnée, IA, automatisation forte.", score: 25 },
        ],
        weight: { Industry: 1.3, Services: 1.2, Retail: 1.0, Tech: 0.5, Transport: 1.5, Autre: 1.0 }
    },
    {
        id: 5,
        context: "L'investissement aujourd'hui détermine la croissance de demain.",
        text: "Quelle part de votre budget consacrez-vous à l'innovation ou à la R&D ?",
        options: [
            { label: "Faible (< 2%) : Maintien de l'existant.", score: 0 },
            { label: "Moyenne (2-5%) : Amélioration continue.", score: 15 },
            { label: "Forte (> 5%) : Innovation de rupture et nouveaux produits.", score: 25 },
        ],
        weight: { Industry: 1.2, Services: 1.0, Retail: 0.8, Tech: 2.5, Transport: 1.0, Autre: 1.0 }
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
                const q = questions[qIndex];

                // Add Context first
                addMessage("bot", <span className="italic text-indigo-600 block mb-1 font-medium">{q.context}</span>);

                // Then ask the question after a small delay
                setTimeout(() => {
                    addMessage("bot", q.text);
                }, 600);

            } else if (nextStep === 3 + questions.length) { // 8 => Lead Form
                addMessage("bot", "Analyse presque terminée ! Pour générer votre rapport personnalisé, j'ai besoin de quelques infos :");
            } else { // 9 => Result
                showResult();
            }
        }, 800);
    };

    const generateDetailedReport = (ratio: number, sector: Sector | null, size: CompanySize | null) => {
        if (!sector || !size) return "Analyse incomplète.";

        let analysis = "";

        // Intro based on Score
        if (ratio < 40) {
            analysis += `Votre score de ${Math.round(ratio)}/100 révèle une fragilité structurelle importante. `;
        } else if (ratio < 75) {
            analysis += `Votre score de ${Math.round(ratio)}/100 indique une entreprise résiliente mais perfectible. `;
        } else {
            analysis += `Votre score exceptionnel de ${Math.round(ratio)}/100 vous place en position de leader. `;
        }

        // Sector Specifics
        if (sector === "Industry") {
            if (ratio < 60) analysis += "Dans l'industrie, cela signale souvent un sous-investissement productif ou une exposition trop forte aux coûts de l'énergie et des matières premières. ";
            else analysis += "Votre outil industriel semble performant, ce qui est une barrière à l'entrée majeure pour vos concurrents. ";
        } else if (sector === "Tech") {
            if (ratio < 60) analysis += "Pour une Tech, ce score suggère un Product-Market Fit encore incertain ou un taux de churn trop élevé. La scalabilité semble freinée. ";
            else analysis += "Vous avez craqué le code de la croissance rentable. La priorité est maintenant de vérouiller vos parts de marché. ";
        } else if (sector === "Retail") {
            if (ratio < 60) analysis += "Le Retail ne pardonne pas : vos marges sont probablement sous pression face aux géants ou au e-commerce. ";
            else analysis += "Votre marque est forte et votre fidélisation client fonctionne. C'est un actif immatériel clé pour la valorisation. ";
        } else if (sector === "Transport") {
            if (ratio < 60) analysis += "Le secteur Transport est impitoyable sur les marges. Votre structure de coûts semble trop lourde par rapport aux standards du marché. ";
            else analysis += "Votre optimisation logistique est un avantage compétitif durable qui maximise votre EBITDA. ";
        } else {
            analysis += "Votre modèle économique présente des spécificités qui méritent une analyse plus fine de vos leviers de marge. ";
        }

        // Size Specifics
        if (size === "Small") {
            analysis += "En tant que TPE, votre priorité absolue doit être la sécurisation du cash pour financer ce pivot.";
        } else if (size === "Medium" || size === "Large") {
            analysis += "À votre échelle, la structuration du management intermédiaire et la digitalisation sont les leviers les plus rapides pour gagner les 10 points manquants.";
        } else {
            analysis += "Pour un groupe de votre taille, la croissance externe est désormais le levier le plus rationnel pour continuer à croître.";
        }

        return analysis;
    };

    const saveToFirebase = async () => {
        const ratio = (score / maxPossibleScore) * 100;
        let diagnosisTitle = getDiagnosis(ratio).title;
        let detailedReport = generateDetailedReport(ratio, sector, size);

        try {
            await addDoc(collection(db, "macro_france_diagnostics"), {
                created_at: new Date().toISOString(),
                user_name: leadName || "Anonyme",
                title: leadRole || "N/A",
                company: size || "N/A",
                website: leadUrl || "",
                score: Math.round(ratio),
                diagnostic: detailedReport, // Saving full report here
                transcript: transcript, // Keeping transcript for Q&A
                sector: sector,
                diagnosis_title: diagnosisTitle // Saving title separately if needed
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
        const detailedAnalysis = generateDetailedReport(ratio, sector, size);

        const resultCard = (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 space-y-4">
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
                        <TrendingUp className="w-4 h-4 text-slate-400 mt-1 shrink-0" />
                        <p className="text-sm text-slate-700 font-bold">{title}</p>
                    </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-100 text-xs text-slate-600 leading-relaxed text-justify">
                    {detailedAnalysis}
                </div>

                <div className="flex items-start gap-2 pt-2 border-t border-slate-200">
                    <Briefcase className="w-4 h-4 text-indigo-500 mt-1 shrink-0" />
                    <p className="text-xs text-indigo-700 font-bold">{rec}</p>
                </div>
            </div>
        );

        addMessage("bot", "Analyse complétée. Voici mon diagnostic stratégique détaillé :");
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
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-4 pointer-events-none">
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="w-full max-w-[380px] sm:w-[380px] h-[650px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden font-sans pointer-events-auto"
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
                        className="group flex items-center gap-3 pr-6 pl-2 py-2 bg-white rounded-full shadow-2xl border border-slate-100 cursor-pointer hover:border-indigo-100 transition-all pointer-events-auto"
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

