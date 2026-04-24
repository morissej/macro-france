"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
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
import AdminLogin from "@/components/AdminLogin";

export default function Home() {
  useScrollSpy([
    "hero", "global-competitiveness", "causes-racines",
    "duel-pme", "bot-section", "scale-benefits", "cta"
  ]);

  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (next) => {
      setUser(next);
      if (next) {
        try {
          const token = await next.getIdTokenResult(true);
          setIsAdmin(token.claims.admin === true);
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  const showAdmin = user !== null && isAdmin;

  const handleCloseDashboard = async () => {
    setShowLogin(false);
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Sign out failed:", err);
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
        <CTA onOpenAdmin={() => setShowLogin(true)} />
      </div>
      <ModalContainer />
      <CompetitivenessBot />

      {showLogin && !showAdmin && (
        <AdminLogin onCancel={() => setShowLogin(false)} />
      )}

      {showAdmin && <AdminDashboard onClose={handleCloseDashboard} />}
    </main>
  );
}
