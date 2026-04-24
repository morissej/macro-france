"use client";

interface CTAProps {
    onOpenAdmin?: () => void;
}

export function CTA({ onOpenAdmin }: CTAProps) {
    return (
        <section id="cta" className="py-32 bg-slate-950 border-t border-slate-800 relative z-0">
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
                        type="button"
                        onClick={onOpenAdmin}
                        className="relative z-50 px-6 py-3 bg-slate-900 text-slate-500 font-bold rounded-xl text-[10px] uppercase tracking-widest border border-slate-800 hover:text-indigo-400 hover:border-indigo-900/50 transition-colors pointer-events-auto cursor-pointer select-none"
                    >
                        Portail Partenaires
                    </button>
                </div>
            </div>
        </section>

    );
}
