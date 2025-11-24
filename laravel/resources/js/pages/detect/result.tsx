import { Head, Link, usePage } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Leaf,
  Bug,
  Activity,
  ShieldCheck,
  Save,
  Camera,
} from "lucide-react";

interface DetectionResult {
  source: string;
  predicted_label: string;
  confidence: number;
  info?: {
    data: {
      description: string;
      symptoms: string[];
      treatment: string[];
      prevention: string[];
    };
  };
}

interface Props {
  result: DetectionResult;
}

export default function ResultPage({ result }: Props) {
  // Helper untuk format persentase
  const confidencePercent = Math.round((result.confidence || 0) * 100);
  
  // Helper membersihkan nama label (misal: tomato_bacterial_spot -> Tomato Bacterial Spot)
  const formatLabel = (label: string) => {
    return label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const advice = result.info?.data;

  // Warna progress bar berdasarkan confidence
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Hasil Deteksi", href: "#" }]}>
      <Head title="Hasil Analisis" />

      <div className="flex flex-col gap-6 p-4 md:px-12 md:py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <Link
            href={route("detect.index")}
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Deteksi
          </Link>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Hasil Analisis Tanaman
          </h1>
          <p className="text-muted-foreground">
            Berikut adalah laporan deteksi AI berdasarkan citra daun yang Anda unggah.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* KOLOM KIRI: Gambar & Status */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="overflow-hidden border-2 border-primary/10 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-base">Gambar yang Diunggah</CardTitle>
              </CardHeader>
              <div className="relative aspect-[4/3] w-full bg-black/5">
                {/* Menampilkan gambar source. 
                    Catatan: Idealnya gambar diupload ke storage laravel agar bisa diakses via URL.
                    Untuk demo, kita pakai placeholder atau URL blob jika dikirim dari prev page. 
                    Disini saya asumsikan User ingin melihat hasil crop. */}
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted">
                    {/* Karena Inertia pass props server-side, image blob local tidak terbawa. 
                        Solusi: Tampilkan nama file atau icon, kecuali kita upload ke storage dulu. */}
                    <div className="flex flex-col items-center gap-2">
                        <Leaf className="w-12 h-12 opacity-20" />
                        <span className="text-xs">{result.source}</span>
                    </div>
                </div>
              </div>
              <CardContent className="p-4 space-y-4">
                <Button className="w-full" variant="default" asChild>
                    <Link href={route('detect.index')}>
                        <Camera className="mr-2 h-4 w-4" />
                        Ambil Foto Ulang
                    </Link>
                </Button>
                
                <Alert className="bg-blue-50/50 text-blue-900 border-blue-100 dark:bg-blue-950/20 dark:text-blue-200 dark:border-blue-900">
                  <Activity className="h-4 w-4 stroke-blue-600 dark:stroke-blue-400" />
                  <AlertTitle>Tips Akurasi</AlertTitle>
                  <AlertDescription className="text-xs mt-1">
                    Jika hasil kurang akurat, pastikan foto fokus pada daun yang sakit dengan pencahayaan cukup.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* KOLOM KANAN: Hasil Deteksi & Gemini AI */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* 1. KARTU HASIL UTAMA (Sesuai Desain) */}
            <Card className="border-l-4 border-l-emerald-500 shadow-md">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <CardDescription>Terdeteksi sebagai</CardDescription>
                    <CardTitle className="text-3xl font-bold text-emerald-950 dark:text-emerald-50 mt-1">
                      {formatLabel(result.predicted_label || "Tidak Diketahui")}
                    </CardTitle>
                    {/* Deskripsi Singkat dari Gemini */}
                    {advice?.description && (
                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            {advice.description}
                        </p>
                    )}
                  </div>
                  <Badge variant="outline" className="px-3 py-1 h-fit text-sm border-emerald-200 bg-emerald-50 text-emerald-700">
                    Confidence: {confidencePercent}%
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Confidence Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Tingkat Kepercayaan AI</span>
                    <span>{confidencePercent}%</span>
                  </div>
                  <Progress
                    value={confidencePercent}
                    className={`h-3 [&>div]:${getProgressColor(confidencePercent)}`}
                    />
                </div>

                {/* Kemungkinan Lain (Placeholder jika API belum support multi-class list) */}
                {/* <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Kemungkinan lain (Analisis margin rendah)</span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                            <span>{result.predicted_label === 'tomato_healthy' ? 'Bacterial Spot' : 'Healthy'}</span>
                            <div className="flex items-center gap-2 w-1/3">
                                <Progress value={100 - confidencePercent} className="h-2" />
                                <span className="w-8 text-right">{100 - confidencePercent}%</span>
                            </div>
                        </div>
                    </div>
                </div> */}
              </CardContent>
            </Card>

            {/* 2. GEJALA & BAGIAN TERDAMPAK */}
            {advice && (
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <Bug className="w-5 h-5 text-red-500" />
                                Gejala / Tanda Serangan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {advice.symptoms.length > 0 ? (
                                    advice.symptoms.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-muted-foreground italic">Tidak ada data gejala spesifik.</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-blue-500" />
                                Pencegahan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="space-y-2">
                                {advice.prevention.length > 0 ? (
                                    advice.prevention.map((item, idx) => (
                                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))
                                ) : (
                                    <li className="text-sm text-muted-foreground italic">Data pencegahan tidak tersedia.</li>
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 3. LANGKAH PERAWATAN (Card Besar) */}
            {advice && (
                <Card className="bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                            <Leaf className="w-5 h-5" />
                            Rekomendasi Perawatan
                        </CardTitle>
                        <CardDescription>
                            Langkah-langkah yang disarankan untuk menangani masalah ini.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3">
                             {advice.treatment.length > 0 ? (
                                advice.treatment.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-3 p-3 bg-background rounded-lg border shadow-sm">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                                        <span className="text-sm font-medium text-foreground">{item}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground italic">Belum ada rekomendasi perawatan spesifik.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons Footer */}
            <div className="flex gap-4 pt-4">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Hasil
                </Button>
                <Button variant="outline" className="flex-1">
                    Lihat Detail Lengkap
                </Button>
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}