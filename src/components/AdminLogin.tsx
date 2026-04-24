"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Lock, X } from "lucide-react";

interface AdminLoginProps {
    onCancel: () => void;
}

export default function AdminLogin({ onCancel }: AdminLoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            console.error("Admin login failed:", message);
            setError("Identifiants invalides ou accès refusé.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-login-title"
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
        >
            <form
                onSubmit={onSubmit}
                className="relative bg-slate-900 border border-slate-700 p-8 rounded-2xl w-full max-w-sm text-center"
            >
                <button
                    type="button"
                    onClick={onCancel}
                    aria-label="Fermer"
                    className="absolute top-3 right-3 p-2 text-slate-400 hover:text-white"
                >
                    <X className="w-5 h-5" aria-hidden="true" />
                </button>
                <div className="bg-indigo-500/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Lock className="w-8 h-8 text-indigo-400" aria-hidden="true" />
                </div>
                <h3 id="admin-login-title" className="text-white font-bold text-xl mb-2">
                    Espace Partenaire
                </h3>
                <p className="text-slate-400 text-sm mb-6">
                    Accès réservé aux administrateurs NexDeal.
                </p>

                <label htmlFor="admin-email" className="sr-only">Email</label>
                <input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white mb-3 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-600"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                />

                <label htmlFor="admin-password" className="sr-only">Mot de passe</label>
                <input
                    id="admin-password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white mb-4 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-600"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                    <p role="alert" className="text-red-400 text-xs mb-3">
                        {error}
                    </p>
                )}

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors font-medium text-sm"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-colors"
                    >
                        {loading ? "..." : "Accéder"}
                    </button>
                </div>
            </form>
        </div>
    );
}
