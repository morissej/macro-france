import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, getDocs, addDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { DiagnosticEntry } from '../types';
import { Database, Download, Trash2, X, Eye, FileText, Globe, UploadCloud, CheckCircle, AlertTriangle } from 'lucide-react';
import MediaManager from './MediaManager';

const AdminDashboard: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [entries, setEntries] = useState<DiagnosticEntry[]>([]);
    const [selectedEntry, setSelectedEntry] = useState<DiagnosticEntry | null>(null);
    const [visitCount, setVisitCount] = useState<number>(0);


    useEffect(() => {
        fetchEntries();
    }, []);

    const fetchEntries = async () => {
        try {
            // Fetch from Firestore
            const q = query(collection(db, "macro_france_diagnostics"), orderBy("created_at", "desc"));
            const querySnapshot = await getDocs(q);

            const mappedData: DiagnosticEntry[] = querySnapshot.docs.map(doc => ({
                id: doc.id,
                timestamp: doc.data().created_at,
                userName: doc.data().user_name,
                title: doc.data().title,
                company: doc.data().company,
                website: doc.data().website,
                score: doc.data().score,
                diagnostic: doc.data().diagnostic,
                transcript: doc.data().transcript
            }));
            setEntries(mappedData);

            // Fetch Visits
            const statsRef = doc(db, "stats", "global");
            const statsSnap = await getDoc(statsRef);
            if (statsSnap.exists()) {
                setVisitCount(statsSnap.data().visits || 0);
            }
        } catch (e) {
            console.error("Error fetching data:", e);
        }
    };

    const deleteEntry = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce diagnostic de la base ?")) return;
        try {
            await deleteDoc(doc(db, "macro_france_diagnostics", id));
            setEntries(entries.filter(e => e.id !== id));
        } catch (e) {
            console.error("Delete failed:", e);
            alert("Erreur lors de la suppression.");
        }
    };

    const downloadCSV = () => {
        if (entries.length === 0) return;

        const headers = ['Date', 'Nom', 'Titre', 'Entreprise', 'Site Web', 'Score', 'Synthese', 'Compte Rendu Detaille'];
        const rows = entries.map(e => [
            new Date(e.timestamp).toLocaleString(),
            `"${e.userName.replace(/"/g, '""')}"`,
            `"${e.title?.replace(/"/g, '""') || ''}"`,
            `"${e.company.replace(/"/g, '""')}"`,
            `"${e.website?.replace(/"/g, '""') || ''}"`,
            e.score,
            `"${e.diagnostic.replace(/"/g, '""')}"`,
            `"${(e.transcript || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = [headers, ...rows].map(r => r.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `base_donnees_nexdeal_${new Date().toISOString().split('T')[0]}.csv`);
        link.click();
    };

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-[98vw] h-[95vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
                {/* Header - Minimalist with Close Button */}
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg text-white">
                            <Database className="w-5 h-5" />
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">Portail Partenaires</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X className="w-8 h-8" />
                    </button>
                </div>

                {/* Content Tabs or Sections */}
                <div className="flex-grow overflow-auto p-6 space-y-8 bg-slate-50 flex flex-col">

                    {/* Block 1: Stats & Actions (Stacked) */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <p className="text-xs text-slate-500">{entries.length} questionnaire(s) enregistré(s)</p>
                            <div className="h-4 w-px bg-slate-300"></div>
                            <p className="text-xs text-indigo-600 font-bold flex items-center gap-1">
                                <Globe className="w-3 h-3" /> {visitCount} Visites Uniques
                            </p>
                        </div>

                        <button
                            onClick={downloadCSV}
                            className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-sm w-full md:w-auto"
                        >
                            <Download className="w-4 h-4" />
                            Télécharger CSV Complet
                        </button>
                    </div>

                    {/* Section 1: Database - Takes full width */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <Database className="w-4 h-4 text-indigo-500" />
                                Liste des Diagnostics (Leads)
                            </h3>
                        </div>

                        <div className="flex-grow overflow-auto">
                            {entries.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                                    <FileText className="w-12 h-12 mb-3 opacity-20" />
                                    <p className="text-sm">Aucune donnée enregistrée.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-white z-10">
                                        <tr className="text-xs uppercase text-slate-400 font-bold border-b border-gray-100">
                                            <th className="py-2 px-4">Date</th>
                                            <th className="py-2 px-4">Dirigeant</th>
                                            <th className="py-2 px-4">Score</th>
                                            <th className="py-2 px-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-sm">
                                        {entries.map((entry) => (
                                            <tr key={entry.id} className="border-b border-gray-50 hover:bg-slate-50 transition-colors">
                                                <td className="py-3 px-4 text-slate-500">{new Date(entry.timestamp).toLocaleDateString()}</td>
                                                <td className="py-3 px-4 font-medium text-slate-900">{entry.userName} - {entry.company}</td>
                                                <td className="py-3 px-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${entry.score > 75 ? 'bg-green-100 text-green-700' :
                                                        entry.score > 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {entry.score}/100
                                                    </span>
                                                </td>
                                                <td className="py-3 px-4 text-right space-x-1">
                                                    <button onClick={() => setSelectedEntry(entry)} className="p-1 text-indigo-600 hover:bg-indigo-50 rounded"><Eye className="w-4 h-4" /></button>
                                                    <button onClick={() => deleteEntry(entry.id)} className="p-1 text-red-400 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>

                    {/* Section 2: Media Manager - Full width below */}
                    <div className="bg-white p-0 rounded-2xl shadow-sm border border-gray-100 overflow-hidden w-full flex-shrink-0 min-h-[500px]">
                        <MediaManager />
                    </div>

                </div>
            </div>

            {/* Detail Modal */}
            {selectedEntry && (
                <div className="fixed inset-0 bg-black/50 z-[210] flex items-center justify-center p-8">
                    <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                        <div className="p-8 border-b border-gray-100 flex justify-between items-start">
                            <div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 uppercase mb-1">
                                    Dossier Diagnostic NexDeal
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">{selectedEntry.userName}</h3>
                                <div className="flex gap-4 mt-2 text-sm text-slate-500">
                                    <span className="font-semibold">{selectedEntry.title} @ {selectedEntry.company}</span>
                                    {selectedEntry.website && <span>| Site : {selectedEntry.website}</span>}
                                </div>
                            </div>
                            <button onClick={() => setSelectedEntry(null)} className="p-2 hover:bg-gray-100 rounded-full">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="flex-grow overflow-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Synthèse Qualitative */}
                            <div>
                                <h4 className="text-xs font-black uppercase text-slate-400 mb-4 border-b pb-2">1. Synthèse Qualitative</h4>
                                <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap bg-indigo-50/50 p-6 rounded-xl border border-indigo-100 shadow-sm">
                                    {selectedEntry.diagnostic}
                                </div>
                            </div>

                            {/* Compte rendu détaillé par question */}
                            <div>
                                <h4 className="text-xs font-black uppercase text-slate-400 mb-4 border-b pb-2">2. Compte rendu détaillé</h4>
                                <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-wrap bg-slate-50 p-6 rounded-xl border border-slate-200 font-mono text-[12px]">
                                    {selectedEntry.transcript || "Aucun compte-rendu détaillé disponible pour cette entrée ancienne."}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-slate-50 border-t border-gray-100 text-right">
                            <button
                                onClick={() => setSelectedEntry(null)}
                                className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold"
                            >
                                Fermer la fiche
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
