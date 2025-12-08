import { route } from 'ziggy-js';
import AppLayout from '@/layouts/app-layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useState, useRef, useEffect } from 'react';
import {
    Head,
    Link,
    useForm,
    usePage
} from '@inertiajs/react';
import {
    Card,
    CardTitle,
    CardHeader,
    CardContent,
    CardDescription
} from '@/components/ui/card';
import {
    Send,
    FileUp,
    Loader2,
    Droplets,
    Calendar,
    ArrowLeft,
    AlertCircle,
    CheckCircle2,
    ThermometerSun
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';


interface QuotaInfo {
    is_trial_expired: boolean;
    days_left: number;
    daily_prompts_used: number;
    daily_prompts_max: number;
    remaining_prompts: number;
    daily_photos_used: number;
    daily_photos_max: number;
    can_upload_photo: boolean;
}

export default function ContinuousCareIndex({ case: caseData, quota }: { case: CaseData, quota: QuotaInfo }) {
    const { auth } = usePage().props as any;
    const [preview, setPreview] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

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
        if (quota.is_trial_expired) return;
        
        e.preventDefault();
        post(route('cases.followUp', caseData.id), {
            onSuccess: () => {
                reset();
                setPreview(null);
            },
        });
    };
    
    // Auto-scroll ke bagian bawah dari chat
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [caseData.logs]);

    // Menghitung hari sejak awal
    const startDate = new Date(caseData.created_at);
    const getDaysSince = (dateStr: string) => {
        const d = new Date(dateStr);
        const diffTime = Math.abs(d.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays === 0 ? 1 : diffDays + 1; // Hari 1 based
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Ruang Konsultasi', href: '#' }]}>
            <Head title={`Care: ${caseData.label}`} />

            <div className="w-full bg-white border-b sticky top-0 z-10 md:hidden">
                 <div className="flex items-center gap-3 p-4">
                    <Link href={route('detect.history')}><ArrowLeft className="w-5 h-5 text-gray-500" /></Link>
                    <div>
                        <h1 className="font-semibold text-gray-900">{caseData.label}</h1>
                        <p className="text-xs text-gray-500">Mulai: {new Date(caseData.created_at).toLocaleDateString()}</p>
                    </div>
                 </div>
            </div>

            <div className="w-full min-h-[calc(100vh-65px)] bg-gray-50 grid grid-cols-1 md:grid-cols-12 p-4 md:p-6 gap-6">
                
                {/* 1. KOLOM KIRI: TIMELINE (Riwayat Konsultasi) */}
                <div className="hidden md:flex flex-col md:col-span-3 space-y-4 h-[85vh] overflow-y-auto pr-2 custom-scrollbar">
                    <h2 className="font-bold text-lg text-gray-900">Riwayat Konsultasi</h2>
                    <div className="space-y-3">
                        {/* Initial Detection Card */}
                         <Card className="border shadow-sm hover:shadow-md transition">
                            <CardContent className="p-4 space-y-2">
                                <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Hari 1</Badge>
                                <p className="text-sm font-medium text-gray-800">Deteksi pertama. {caseData.label} terdeteksi.</p>
                                <p className="text-xs text-gray-400">{new Date(caseData.created_at).toLocaleDateString()}</p>
                            </CardContent>
                        </Card>

                        {/* Update terbaru dari Logs */}
                        {caseData.logs && caseData.logs
                            .filter(l => l.type === 'follow_up')
                            .slice().reverse() // Tampilkan yang terbaru terlebih dahulu di daftar riwayat? Atau yang terlama? Desain menunjukkan daftar yang disarankan secara kronologis tapi mungkin daftar sederhana.
                            .map((log) => (
                            <Card key={log.id} className="border shadow-sm hover:shadow-md transition">
                                <CardContent className="p-4 space-y-2">
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">Hari {getDaysSince(log.created_at)}</Badge>
                                    <p className="text-sm font-medium text-gray-800 line-clamp-2">{log.message}</p>
                                    <p className="text-xs text-gray-400">{new Date(log.created_at).toLocaleDateString()}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* 2. KOLOM TENGAH: CHAT AREA (Main Interaction) */}
                <div className="md:col-span-6 flex flex-col h-[85vh] bg-transparent gap-4 min-w-0">
                    
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar relative">
                        
                        {/* Trial Expired Overlay */}
                        {quota.is_trial_expired && (
                            <div className="sticky top-0 z-50 bg-red-50 border border-red-200 p-4 rounded-xl flex items-center gap-3 shadow-sm mb-4">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                                <div>
                                    <h4 className="font-bold text-red-700">Masa Percobaan Habis</h4>
                                    <p className="text-sm text-red-600">Akses gratis 3 hari telah berakhir. Silakan berlangganan untuk melanjutkan konsultasi.</p>
                                </div>
                            </div>
                        )}

                        {/* System Greeting */}
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm text-green-800">AI HamaSense</span>
                            </div>
                            <div className="bg-[#064e3b] text-white p-5 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] md:max-w-2xl text-sm leading-relaxed">
                                Halo! Sudah {getDaysSince(new Date().toISOString())} hari sejak deteksi pertama <b>{caseData.label}</b>.
                                Bagaimana kondisi tanaman Anda hari ini? 
                                <span className="block text-[10px] text-green-200/80 mt-2 text-right">
                                    {new Date(caseData.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                        </div>

                        {/* Log Loop */}
                        {caseData.logs && caseData.logs.filter(l => l.type === 'follow_up').map(log => (
                            <React.Fragment key={log.id}>
                                {/* Pesan pengguna */}
                                <div className="flex flex-col gap-2 items-end">
                                     {/* Gambar jika ada */}
                                     {log.image_path && (
                                        <div className="bg-white p-2 rounded-2xl rounded-tr-none border shadow-sm max-w-[80%]">
                                             <img src={`/storage/${log.image_path}`} className="w-full h-auto rounded-lg max-h-60 object-cover" />
                                        </div>
                                    )}
                                    {/* Text */}
                                    <div className="bg-white border text-gray-800 p-5 rounded-2xl rounded-tr-none shadow-sm max-w-[90%] md:max-w-2xl text-sm leading-relaxed">
                                        {log.message}
                                        <span className="block text-[10px] text-gray-400 mt-2 text-right">
                                            {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    </div>
                                </div>

                                {/* AI Response */}
                                {log.ai_response && (
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-sm text-green-800">AI HamaSense</span>
                                        </div>
                                        <div className="bg-[#064e3b] text-white p-5 rounded-2xl rounded-tl-none shadow-sm max-w-[90%] md:max-w-2xl text-sm leading-relaxed space-y-4">
                                            {(() => {
                                                try {
                                                    const analysis = JSON.parse(log.ai_response);
                                                    // Tangani kedua struktur: Direct AdviceResponse (analysis.data) atau PredictionResponse (analysis.info.data)
                                                    const info = analysis.data || analysis.info?.data || {};
                                                    return (
                                                        <>  
                                                            <div>
                                                                <p>{info.description || "Terima kasih updatenya. Berikut analisis kondisi tanaman Anda."}</p>
                                                            </div>
                                                            
                                                            {info.treatment && (
                                                                <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                                                                    <p className="font-semibold text-green-200 mb-1 flex items-center gap-2">
                                                                        <CheckCircle2 className="w-4 h-4"/> Rekomendasi Tindakan:
                                                                    </p>
                                                                    <ul className="list-disc ml-5 space-y-1 text-green-50">
                                                                        {Array.isArray(info.treatment) ? info.treatment.map((t: string, i: number) => <li key={i}>{t}</li>) : <li>{info.treatment}</li>}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                } catch (e) {
                                                    return <p>Maaf, data analisis tidak dapat ditampilkan dengan benar.</p>;
                                                }
                                            })()}
                                            <span className="block text-[10px] text-green-200/80 mt-2 text-right">
                                                {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="mt-auto">
                        {/* INDIKATOR STATUS KUOTA */}
                        {!quota.is_trial_expired && (
                            <div className="flex justify-between items-center mb-2 px-1">
                                <span className="text-xs text-gray-500">
                                    Sisa Kuota Harian: <b>{quota.remaining_prompts}</b> Chat, <b>{quota.daily_photos_max - quota.daily_photos_used}</b> Upload Foto
                                </span>
                                {errors.quota && (
                                    <span className="text-xs text-red-600 font-bold bg-red-50 px-2 py-1 rounded-md animate-pulse">
                                        {errors.quota}
                                    </span>
                                )}
                            </div>
                        )}

                        <form onSubmit={submit} className={`flex flex-col gap-4 ${quota.is_trial_expired ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                            {/* Area Unggah tombol besar */}
                            {quota.can_upload_photo && !data.image && !preview && (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-white hover:bg-gray-50 hover:border-green-400 transition group">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <FileUp className="w-8 h-8 mb-3 text-gray-400 group-hover:text-green-500 transition" />
                                        <p className="mb-2 text-sm text-gray-500 font-medium">Upload foto kondisi tanaman</p>
                                        <p className="text-xs text-gray-400">Klik untuk ambil foto / pilih file</p>
                                    </div>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            )}
                            
                            {!quota.can_upload_photo && !data.image && !preview && (
                                <div className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                                    <p className="text-xs text-gray-400">Kuota upload foto hari ini habis</p>
                                </div>
                            )}

                            {/* Preview Area */}
                            {preview && (
                                <div className="relative w-full h-48 bg-gray-100 rounded-2xl overflow-hidden group border">
                                    <img src={preview} className="w-full h-full object-contain" />
                                    <button 
                                        type="button" 
                                        onClick={() => { setData('image', null); setPreview(null); }}
                                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full text-xs px-3 transition backdrop-blur-sm"
                                    >
                                        Hapus Foto
                                    </button>
                                </div>
                            )}

                            {/* Text Input Row */}
                            <div className="flex gap-2">
                                <Input 
                                    value={data.user_prompt}
                                    onChange={e => setData('user_prompt', e.target.value)}
                                    placeholder={
                                        quota.remaining_prompts > 0 
                                        ? "Silahkan ketikkan kondisi tanaman anda😊..." 
                                        : "Kuota chat harian habis..."
                                    }
                                    disabled={quota.remaining_prompts <= 0}
                                    className="h-12 rounded-xl bg-white border-gray-200 focus:border-green-500 focus:ring-green-500 disabled:bg-gray-100"
                                />
                                <Button 
                                    type="submit" 
                                    disabled={processing || (!data.image && !data.user_prompt) || quota.remaining_prompts <= 0}
                                    className="h-12 px-6 rounded-xl bg-[#064e3b] hover:bg-[#065f46] text-white font-medium disabled:opacity-50"
                                >
                                    {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Kirim'}
                                </Button>
                            </div>
                             {errors.user_prompt && <p className="text-red-500 text-xs">{errors.user_prompt}</p>}
                        </form>
                    </div>

                </div>

                {/* 3. KOLOM KANAN: INFO & STATUS */}
                <div className="hidden md:flex flex-col md:col-span-3 space-y-6 h-fit sticky top-6">
                    
                    {/* Status Info Card */}
                    <Card className="border-none shadow-sm rounded-2xl bg-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold">Informasi Status</CardTitle>
                            <CardDescription>Detail penanganan hama</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-sm mb-1">Tindakan Terakhir</h4>
                                <p className="text-xs text-gray-500 mb-2">Hari ke-{getDaysSince(new Date().toISOString())} ({new Date().toLocaleDateString()})</p>
                                <ul className="space-y-1">
                                    {caseData.logs && caseData.logs.length > 0 ? (
                                        <li className="flex items-center gap-2 text-sm text-gray-700">
                                            <CheckCircle2 className="w-4 h-4 text-green-500"/> 
                                            <span className="truncate">Monitoring Rutin</span>
                                        </li>
                                    ) : (
                                        <li className="text-sm text-gray-400 italic">Belum ada tindakan lanjut</li>
                                    )}
                                </ul>
                            </div>
                            
                            <div>
                                <div className="flex justify-between text-sm font-semibold mb-1">
                                    <span>Kondisi</span>
                                    <span className={`font-bold ${quota.is_trial_expired ? 'text-red-500' : 'text-green-600'}`}>
                                        {quota.is_trial_expired ? 'Masa Percobaan Habis' : 'Terpantau'}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className={`h-full w-[75%] rounded-full ${quota.is_trial_expired ? 'bg-red-500' : 'bg-green-600'}`}></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daily Tips Card */}
                    <Card className="border-none shadow-sm rounded-2xl bg-white">
                         <CardHeader className="pb-2">
                            <CardTitle className="text-base font-bold">Tips Hari ini</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600 leading-relaxed">
                                Berdasarkan data cuaca hari ini, penyiraman lebih awal sangat disarankan untuk menjaga kelembapan tanah tanpa memicu jamur.
                            </p>
                            <div className="flex gap-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                    <ThermometerSun className="w-3 h-3"/> 32°C
                                </div>
                                <div className="flex items-center gap-1 bg-blue-50 text-blue-600 px-2 py-1 rounded">
                                    <Droplets className="w-3 h-3"/> 65%
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </AppLayout>
    );
}
