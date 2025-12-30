"use client";

import { useState } from "react";
import { FloatingNav } from "@/components/ui/floating-nav";
import { Hero } from "@/components/sections/Hero";
import { CTA } from "@/components/sections/CTA";
import { ModalContainer } from "@/components/ui/modal-container";
import { useScrollSpy } from "@/lib/hooks";
import { CompetitivenessBot } from "@/components/ui/CompetitivenessBot";
import { GlobalCompetitiveness } from "@/components/sections/GlobalCompetitiveness";
import { CausesGrid } from "@/components/sections/CausesGrid";
import { DuelPME } from "@/components/sections/DuelPME";
import { BotSection } from "@/components/sections/BotSection";
import { ScaleBenefits } from "@/components/sections/ScaleBenefits";
import PublicResources from "@/components/PublicResources";
import AdminDashboard from "@/components/AdminDashboard";
import { Lock } from "lucide-react";

export default function Home() {
  useScrollSpy([
    "hero", "global-competitiveness", "causes-racines",
    "duel-pme", "bot-section", "scale-benefits", "cta"
  ]);

  const [showAdmin, setShowAdmin] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");

  const handleAdminAuth = () => {
    if (password === "65350000") {
      setShowAdmin(true);
      setShowPasswordPrompt(false);
      setPassword("");
    } else {
      alert("Mot de passe incorrect");
    }
  };

  return (
    <main className="relative min-h-screen bg-transparent">
      <FloatingNav />
      <Hero />
      <div className="space-y-0">
        <GlobalCompetitiveness />
        <CausesGrid />
        <DuelPME />
        <BotSection />
        <ScaleBenefits />
        <PublicResources />
        <CTA onOpenAdmin={() => setShowPasswordPrompt(true)} />
      </div>
      <ModalContainer />
      <CompetitivenessBot />

      {/* Password Prompt Modal */}
      {showPasswordPrompt && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-sm text-center">
            <div className="bg-indigo-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Lock className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="text-white font-bold text-xl mb-2">Espace Partenaire</h3>
            <p className="text-slate-400 text-sm mb-6">Accès réservé aux administrateurs NexDeal.</p>

            <input
              type="password"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white mb-4 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600 font-mono text-center tracking-widest"
              placeholder="Passcode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleAdminAuth()}
            />

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowPasswordPrompt(false)}
                className="py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors font-medium text-sm"
              >
                Annuler
              </button>
              <button
                onClick={handleAdminAuth}
                className="py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-sm transition-colors"
              >
                Accéder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}
    </main>
  );
}
