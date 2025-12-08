import React, { useState } from 'react';
import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileUp, Loader2, ArrowLeft, Send } from 'lucide-react';

interface CaseData {
    id: number;
    label: string;
    image_path: string;
    confidence: number;
    status: string;
    ai_summary: any;
    created_at: string;
    logs: any[];
}

export default function ContinuousCareIndex({ case: caseData }: { case: CaseData }) {
    const { auth } = usePage().props as any;
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        image: null as File | null,
        user_prompt: '',
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('cases.followUp', caseData.id), {
            onSuccess: () => {
                reset();
                setPreview(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Continuous Care', href: '#' }]}>
            <Head title={`Care: ${caseData.label}`} />

            <div className="w-full min-h-screen bg-gray-50 flex flex-col md:flex-row">
                {/* LEFT SIDEBAR: History & Stats */}
                <div className="w-full md:w-1/4 bg-white border-r p-6 space-y-6 hidden md:block">
                    <div className="flex items-center gap-2 mb-6">
                        <Link href={route('detect.history')} className="text-gray-500 hover:text-green-700">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h2 className="font-bold text-xl text-green-900">Patient Status</h2>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                        <h3 className="font-semibold text-emerald-800">{caseData.label}</h3>
                        <p className="text-xs text-emerald-600 mt-1">Detected: {new Date(caseData.created_at).toLocaleDateString()}</p>
                        <div className="mt-2 text-sm text-emerald-700 bg-white/50 p-2 rounded">
                            Status: <span className="font-bold uppercase">{caseData.status}</span>
                        </div>
                    </div>

                    {/* Timeline / Logs Preview */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700">Care Timeline</h3>
                        <div className="relative border-l-2 border-gray-200 ml-3 space-y-6 pb-4">
                            {caseData.logs && caseData.logs.map((log, idx) => (
                                <div key={log.id} className="relative pl-6">
                                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                                    <p className="text-xs text-gray-400 mb-1">{new Date(log.created_at).toLocaleDateString()}</p>
                                    <p className="text-sm font-medium text-gray-800">{log.message}</p>
                                    {log.type === 'initial' && <span className="text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-500">Initial Detection</span>}
                                    {log.type === 'follow_up' && <span className="text-[10px] bg-blue-100 px-2 py-0.5 rounded text-blue-600">Follow Up</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* MAIN CONTENT: Chat & Interaction */}
                <div className="flex-1 flex flex-col h-screen overflow-hidden">
                    {/* Header Mobile */}
                    <div className="md:hidden p-4 bg-white border-b flex items-center justify-between">
                         <h1 className="font-bold">Continuous Care</h1>
                         <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{caseData.label}</span>
                    </div>

                    {/* Chat Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-gray-50">
                        {/* Initial System Message */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white shrink-0">AI</div>
                            <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-2xl border">
                                <p className="text-gray-800">
                                    Halo! Saya asisten perawatan tanaman Anda. 
                                    Berdasarkan deteksi awal pada <strong>{new Date(caseData.created_at).toLocaleDateString()}</strong>, tanaman Anda terindikasi <strong>{caseData.label}</strong>.
                                </p>
                                <div className="mt-4">
                                    <img src={`/storage/${caseData.image_path}`} className="w-48 h-32 object-cover rounded-lg border" />
                                </div>
                            </div>
                        </div>

                        {/* Logs Rendered as Chat */}
                        {caseData.logs && caseData.logs.filter(l => l.type === 'follow_up').map(log => (
                            <React.Fragment key={log.id}>
                                {/* User Upload (if any) could be inferred here if we stored user prompt separately, but let's assume log message contains prompt or create a different structure. For now, showing AI response */}
                                <div className="flex gap-4 flex-row-reverse">
                                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">U</div>
                                    <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none shadow-sm max-w-2xl">
                                        <p>{log.message}</p>
                                        {log.image_path && (
                                            <img src={`/storage/${log.image_path}`} className="mt-2 w-48 h-32 object-cover rounded-lg border border-white/20" />
                                        )}
                                    </div>
                                </div>

                                {log.ai_response && (
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white shrink-0">AI</div>
                                        <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm max-w-2xl border space-y-2">
                                            {(() => {
                                                try {
                                                    const analysis = JSON.parse(log.ai_response);
                                                    const info = analysis.info?.data || {};
                                                    return (
                                                        <>
                                                            <p className="font-semibold text-green-800">Analisis Lanjutan:</p>
                                                            <p className="text-gray-700">{info.description || "Tidak ada deskripsi."}</p>
                                                            {info.treatment && (
                                                                <div className="bg-green-50 p-3 rounded-lg text-sm mt-2">
                                                                    <strong>Saran Perawatan Terbaru:</strong>
                                                                    <ul className="list-disc ml-4 mt-1">
                                                                        {Array.isArray(info.treatment) ? info.treatment.map((t: string, i: number) => <li key={i}>{t}</li>) : <li>{info.treatment}</li>}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                } catch (e) {
                                                    return <p className="text-gray-500 italic">Data analisis tidak dapat ditampilkan.</p>;
                                                }
                                            })()}
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Input Area (Bottom) */}
                    <div className="p-4 bg-white border-t">
                        <form onSubmit={submit} className="max-w-4xl mx-auto flex flex-col gap-4">
                            <div className="flex gap-4 items-start">
                                {/* Image Upload Button */}
                                <div>
                                    <input 
                                        id="image-upload" 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={handleImageChange}
                                    />
                                    <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-lg border transition">
                                        <FileUp className="w-6 h-6 text-gray-500" />
                                    </Label>
                                </div>

                                {/* Text Input */}
                                <div className="flex-1 relative">
                                    <Textarea 
                                        value={data.user_prompt}
                                        onChange={e => setData('user_prompt', e.target.value)}
                                        placeholder="Jelaskan kondisi tanaman saat ini... (misal: Daun mulai menguning lagi)"
                                        className="w-full resize-none pr-12 min-h-[50px] max-h-[150px]"
                                    />
                                    <Button 
                                        type="submit" 
                                        disabled={processing || (!data.image && !data.user_prompt)}
                                        className="absolute bottom-2 right-2 h-8 w-8 p-0 rounded-full"
                                        size="icon"
                                    >
                                        {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                    </Button>
                                    {errors.user_prompt && <p className="text-red-500 text-xs mt-1 absolute -bottom-5">{errors.user_prompt}</p>}
                                </div>
                            </div>
                            
                            {/* Preview Image */}
                            {preview && (
                                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg w-fit border">
                                    <img src={preview} className="w-16 h-16 object-cover rounded" />
                                    <div className="text-xs">
                                        <p className="font-semibold text-gray-700">Foto Terlampir</p>
                                        <button type="button" onClick={() => { setData('image', null); setPreview(null); }} className="text-red-500 hover:underline">Hapus</button>
                                    </div>
                                    {errors.image && <p className="text-red-500 text-xs ml-2">{errors.image}</p>}
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}