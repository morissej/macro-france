import React, { useState, useEffect } from 'react';
import { storage } from '../lib/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { FileText, Play, Image, X, ExternalLink } from 'lucide-react';

interface MediaFile {
    name: string;
    url: string;
    type: 'image' | 'video' | 'pdf' | 'other';
}

const getFileType = (fileName: string): 'image' | 'video' | 'pdf' | 'other' => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext || '')) return 'image';
    if (['mp4', 'webm', 'ogg'].includes(ext || '')) return 'video';
    if (['pdf'].includes(ext || '')) return 'pdf';
    return 'other';
};

const PublicResources: React.FC = () => {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [viewingFile, setViewingFile] = useState<MediaFile | null>(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const listRef = ref(storage, 'media');
                const res = await listAll(listRef);

                // Get all URLs
                const filePromises = res.items.map(async (itemRef) => {
                    const url = await getDownloadURL(itemRef);
                    return {
                        name: itemRef.name,
                        url,
                        type: getFileType(itemRef.name)
                    };
                });

                const allFiles = await Promise.all(filePromises);

                // Sort or filter if needed (simple slice for now)
                setFiles(allFiles.slice(0, 3));
            } catch (e) {
                console.error("Failed to load resources", e);
            }
        };

        fetchFiles();
    }, []);

    // Demo files to ensure the UI looks populated as requested
    const DEMO_FILES: MediaFile[] = [
        { name: "La Vague Silencieuse (Infographie)", type: 'image', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80' },
        { name: "La Vague des Transmissions (Vidéo)", type: 'video', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
        { name: "La Feuille de Route (Présentation)", type: 'pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
    ];

    // Combine real files with demo files to fill the grid up to 3
    const displayFiles = [...files];
    if (displayFiles.length < 3) {
        // Fill the rest with demo files
        for (let i = files.length; i < 3; i++) {
            displayFiles.push(DEMO_FILES[i]);
        }
    }

    return (
        <section className="py-12 px-6">
            <div className="max-w-4xl mx-auto">
                <h3 className="text-center text-slate-500 font-bold text-xs uppercase tracking-widest mb-8">Ressources & Documentation</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayFiles.map((file, idx) => (
                        <button
                            key={file.name}
                            onClick={() => setViewingFile(file)}
                            className="group relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 bg-slate-900"
                        >
                            {/* Visual Preview Layer */}
                            <div className="absolute inset-0">
                                {file.type === 'image' && (
                                    <img
                                        src={file.url}
                                        alt="Aperçu"
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                    />
                                )}
                                {file.type === 'video' && (
                                    <video
                                        src={`${file.url}#t=1.0`}
                                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                        muted
                                        preload="metadata"
                                    />
                                )}
                                {file.type === 'pdf' && (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 p-8">
                                        <div className="w-full h-full bg-white shadow-lg border border-slate-200 rounded-t-lg mx-auto relative overflow-hidden flex flex-col">
                                            {/* Abstract document representation */}
                                            <div className="h-4 bg-slate-100 border-b border-slate-200" />
                                            <div className="p-4 space-y-2">
                                                <div className="h-2 w-3/4 bg-slate-200 rounded" />
                                                <div className="h-2 w-full bg-slate-100 rounded" />
                                                <div className="h-2 w-full bg-slate-100 rounded" />
                                                <div className="h-2 w-1/2 bg-slate-100 rounded" />
                                            </div>
                                            <div className="flex-grow flex items-center justify-center opacity-10">
                                                <FileText className="w-16 h-16 text-slate-900" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-90 transition-opacity" />

                            {/* Content Layer */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                {/* Centered Play/View Icon */}
                                <div className="mb-4 p-4 bg-white/10 backdrop-blur-md rounded-full text-white ring-1 ring-white/30 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                                    {file.type === 'video' && <Play className="w-8 h-8 ml-1 fill-white/20" />}
                                    {file.type === 'image' && <Image className="w-8 h-8" />}
                                    {file.type === 'pdf' && <FileText className="w-8 h-8" />}
                                </div>

                                {/* Label positioned at bottom */}
                                <div className="absolute bottom-8 left-0 right-0 px-4">
                                    <span className="inline-block text-white font-black uppercase tracking-[0.2em] text-[10px] border-b-2 border-transparent group-hover:border-indigo-400 pb-2 transition-all duration-300 transform group-hover:translate-y-[-4px]">
                                        {file.type === 'video' && 'voir la vidéo'}
                                        {file.type === 'image' && "voir l'infographie"}
                                        {file.type === 'pdf' && 'voir la présentation'}
                                    </span>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Viewer Modal */}
            {viewingFile && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-sm p-4 text-white" onClick={() => setViewingFile(null)}>
                    <button
                        onClick={() => setViewingFile(null)}
                        className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <div className="w-full max-w-6xl max-h-[90vh] flex flex-col items-center justify-center p-4" onClick={e => e.stopPropagation()}>

                        {viewingFile.type === 'video' && (
                            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
                                <video src={viewingFile.url} controls autoPlay className="w-full h-full" />
                            </div>
                        )}

                        {viewingFile.type === 'image' && (
                            <img src={viewingFile.url} alt={viewingFile.name} className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" />
                        )}

                        {viewingFile.type === 'pdf' && (
                            <div className="w-full h-[85vh] bg-white rounded-lg shadow-2xl overflow-hidden">
                                <iframe src={`${viewingFile.url}#toolbar=0`} className="w-full h-full" title={viewingFile.name} />
                            </div>
                        )}

                        <div className="mt-6 text-center">
                            <h3 className="text-xl font-bold">{viewingFile.name}</h3>
                            <a href={viewingFile.url} target="_blank" rel="noreferrer" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 inline-block">
                                Ouvrir dans un nouvel onglet
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default PublicResources;
