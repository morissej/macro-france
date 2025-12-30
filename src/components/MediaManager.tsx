import React, { useState, useEffect } from 'react';
import { storage } from '../lib/firebase';
import { ref, listAll, getDownloadURL, uploadBytes, deleteObject } from 'firebase/storage';
import { Upload, Trash2, Image, Link as LinkIcon, AlertCircle, Check, FileText, Play, X, Eye } from 'lucide-react';

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

const MediaManager: React.FC = () => {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [viewingFile, setViewingFile] = useState<MediaFile | null>(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        try {
            const listRef = ref(storage, 'media');
            const res = await listAll(listRef);

            const filePromises = res.items.map(async (itemRef) => {
                const url = await getDownloadURL(itemRef);
                return {
                    name: itemRef.name,
                    url,
                    type: getFileType(itemRef.name)
                };
            });
            const fileData = await Promise.all(filePromises);
            setFiles(fileData);
        } catch (err) {
            console.error('Error fetching files:', err);
            // setError('Impossible de charger les fichiers. Vérifiez que le bucket "media" existe et est public.');
        }
    };

    const uploadFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            setError(null);
            setSuccess(null);

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('Veuillez sélectionner un fichier.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;

            const storageRef = ref(storage, `media/${fileName}`);
            await uploadBytes(storageRef, file);

            setSuccess('Fichier téléchargé avec succès !');
            fetchFiles();
        } catch (err: any) {
            console.error('Error uploading:', err);
            setError(err.message || 'Erreur lors du téléchargement.');
        } finally {
            setUploading(false);
        }
    };

    const deleteFile = async (fileName: string) => {
        try {
            const deleteRef = ref(storage, `media/${fileName}`);
            await deleteObject(deleteRef);
            setFiles(files.filter(f => f.name !== fileName));
        } catch (err: any) {
            console.error('Error deleting:', err);
            setError('Erreur lors de la suppression.');
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url);
        setSuccess('URL copiée !');
        setTimeout(() => setSuccess(null), 2000);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl w-full text-slate-200">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Image className="w-6 h-6 text-indigo-500" />
                    Médiathèque (PNG, MP4, PDF)
                </h2>
                <div className="relative">
                    <input
                        type="file"
                        accept="image/png,image/jpeg,video/mp4,application/pdf"
                        onChange={uploadFile}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploading}
                    />
                    <button
                        className={`flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <>Téléchargement...</>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Uploader un fichier
                            </>
                        )}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-900/50 border border-red-800 text-red-200 p-3 rounded-lg flex items-center gap-2 mb-4 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-emerald-900/50 border border-emerald-800 text-emerald-200 p-3 rounded-lg flex items-center gap-2 mb-4 text-sm">
                    <Check className="w-4 h-4" />
                    {success}
                </div>
            )}

            {files.length === 0 ? (
                <div className="text-center py-12 text-slate-500 bg-slate-950/50 rounded-xl border border-dashed border-slate-800">
                    <Image className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>Aucun fichier dans la bibliothèque.</p>
                    <p className="text-xs mt-1">Uploadez des images, vidéos ou PDF pour les utiliser.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.map((file) => (
                        <div key={file.name} className="group relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
                            <div
                                className="aspect-square bg-slate-900 relative overflow-hidden cursor-pointer"
                                onClick={() => setViewingFile(file)}
                            >
                                {file.type === 'image' && (
                                    <img
                                        src={file.url}
                                        alt={file.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                )}
                                {file.type === 'video' && (
                                    <div className="w-full h-full flex items-center justify-center bg-slate-900 group-hover:bg-slate-800 transition-colors">
                                        <Play className="w-12 h-12 text-slate-700 group-hover:text-indigo-500 transition-colors" />
                                        <video src={file.url} className="absolute inset-0 w-full h-full object-cover opacity-50" muted />
                                    </div>
                                )}
                                {file.type === 'pdf' && (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 group-hover:bg-slate-800 transition-colors p-4 text-center">
                                        <FileText className="w-12 h-12 text-slate-700 group-hover:text-red-500 transition-colors mb-2" />
                                        <span className="text-[10px] text-slate-500 group-hover:text-slate-300">PDF Document</span>
                                    </div>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setViewingFile(file); }}
                                        className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
                                        title="Voir"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); copyToClipboard(file.url); }}
                                        className="p-2 bg-white text-slate-900 rounded-full hover:bg-slate-200 transition-colors"
                                        title="Copier l'URL"
                                    >
                                        <LinkIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteFile(file.name); }}
                                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                        title="Supprimer"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-2 text-xs text-slate-400 truncate border-t border-slate-800 flex items-center gap-2">
                                {file.type === 'video' && <Play className="w-3 h-3 text-indigo-500 flex-shrink-0" />}
                                {file.type === 'pdf' && <FileText className="w-3 h-3 text-red-500 flex-shrink-0" />}
                                {file.type === 'image' && <Image className="w-3 h-3 text-emerald-500 flex-shrink-0" />}
                                <span className="truncate">{file.name}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Media Viewer Modal */}
            {viewingFile && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4" onClick={() => setViewingFile(null)}>
                    <div className="relative max-w-5xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setViewingFile(null)}
                            className="absolute -top-12 right-0 p-2 text-white/50 hover:text-white transition-colors"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div className="w-full h-full bg-slate-900 rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
                            {viewingFile.type === 'image' && (
                                <img src={viewingFile.url} alt={viewingFile.name} className="max-w-full max-h-[85vh] object-contain" />
                            )}

                            {viewingFile.type === 'video' && (
                                <video
                                    src={viewingFile.url}
                                    controls
                                    autoPlay
                                    className="max-w-full max-h-[85vh]"
                                />
                            )}

                            {viewingFile.type === 'pdf' && (
                                <iframe
                                    src={`${viewingFile.url}#toolbar=0`}
                                    className="w-full h-[85vh] bg-white"
                                    title="PDF Viewer"
                                />
                            )}
                        </div>

                        <div className="mt-4 flex items-center gap-4">
                            <span className="text-white font-medium">{viewingFile.name}</span>
                            <button
                                onClick={() => copyToClipboard(viewingFile.url)}
                                className="text-xs flex items-center gap-1 text-slate-400 hover:text-indigo-400"
                            >
                                <LinkIcon className="w-3 h-3" /> Copier l'URL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaManager;
