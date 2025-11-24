import { Head, Link } from "@inertiajs/react";
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
import {
  CheckCircle2,
  ArrowLeft,
  Leaf,
  Bug,
  Activity,
  ShieldCheck,
  Save,
  Camera,
} from "lucide-react";
import { detect } from "@/routes";
import { Separator } from "@radix-ui/react-separator";

// ==========================================
// 1. DEFINISI TIPE DATA
// ==========================================
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
  // Kita buat opsional (?) agar tidak error saat development/preview tanpa backend
  result?: DetectionResult; 
}

// ==========================================
// 2. DATA DUMMY (UNTUK PREVIEW)
// ==========================================
const DUMMY_RESULT: DetectionResult = {
  source: "preview_daun_tomat.jpg",
  predicted_label: "tomato_early_blight",
  confidence: 0.92, // 92%
  info: {
    data: {
      description:
        "Penyakit Hawar Daun Awal (Early Blight) disebabkan oleh jamur Alternaria solani. Penyakit ini umumnya menyerang tanaman tomat dan kentang, menyebabkan bercak cincin konsentris pada daun tua yang berujung pada kerontokan daun.",
      symptoms: [
        "Bercak coklat melingkar (seperti papan target) pada daun tua",
        "Daun menguning (klorosis) di sekitar bercak",
        "Batang tanaman memiliki luka cekung berwarna gelap",
        "Buah tomat busuk pada bagian pangkal",
      ],
      treatment: [
        "Pangkas dan bakar daun yang terinfeksi segera",
        "Semprotkan fungisida berbahan aktif Tembaga Hidroksida atau Mankozeb",
        "Berikan pupuk tinggi Kalium dan Kalsium",
        "Pastikan drainase tanah baik agar tidak terlalu lembab",
      ],
      prevention: [
        "Lakukan rotasi tanaman (hindari menanam tomat/kentang berturut-turut)",
        "Gunakan varietas benih yang tahan jamur",
        "Atur jarak tanam agar sirkulasi udara lancar",
        "Lakukan penyiraman di pagi hari pada akar (bukan daun)",
      ],
    },
  },
};

export default function ResultPage({ result }: Props) {
  // ==========================================
  // 3. LOGIC SWITCH (LIVE vs DUMMY)
  // ==========================================
  // Jika props 'result' ada (dari Laravel), pakai itu. 
  // Jika tidak, pakai DUMMY_RESULT.
  const activeResult = result || DUMMY_RESULT;

  const advice = activeResult.info?.data;

  // Helper format label
  const formatLabel = (label: string) => {
    return label.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Helper persentase
  const confidencePercent = Math.round((activeResult.confidence || 0) * 100);

  // Helper warna progress bar
  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-slate-100";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Hasil Deteksi", href: "#" }]}>
      <Head title="Hasil Analisis" />

      <div className="flex flex-col gap-6 p-4 md:px-12 md:py-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          {/* Link kembali kita arahkan ke detect.index, pastikan route ini ada di Laravel */}
          <Link
            href={detect()}
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Deteksi
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    Hasil Analisis Tanaman
                </h1>
                <p className="text-muted-foreground mt-1">
                    Laporan deteksi AI berdasarkan citra daun yang Anda unggah.
                </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* KOLOM KIRI: Gambar & Status */}
          <div className="space-y-6 lg:col-span-1">
            <Card className="overflow-hidden border-2 border-primary/10 shadow-sm">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-base">Gambar yang Diunggah</CardTitle>
              </CardHeader>
              
              <div className="relative aspect-[4/3] w-full bg-neutral-100 overflow-hidden group">
                {/* Logika Gambar:
                  1. Jika pakai Data Dummy (Preview Mode), kita arahkan ke path manual.
                  2. Jika data asli, nanti URL-nya dikirim dari backend via props 'image_url'.
                  
                  Disini kita hardcode path sesuai request Anda untuk simulasi dummy.
                */}
                <img 
                  // Ganti 'tomato_early_blight_0026.JPG' sesuai nama file asli Anda di folder public
                  src={result ? `/storage/images/${result.source}` : "/images/tomato_early_blight_0026.JPG"} 
                  alt="Daun Terdeteksi"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    // Fallback jika gambar tidak ditemukan (biar tidak pecah)
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "https://placehold.co/600x400?text=Gambar+Tidak+Ditemukan";
                  }}
                />

                {/* Overlay Gradient saat Hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                    <Badge variant="secondary" className="bg-white/90 text-black backdrop-blur-sm">
                        Lihat Ukuran Penuh
                    </Badge>
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                {/* Menampilkan nama file asli kecil di bawah gambar */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center bg-muted/50 p-2 rounded-md">
                    <span className="truncate max-w-[200px]">{activeResult.source}</span>
                </div>

                <Button className="w-full" variant="default" asChild>
                  <Link href={detect()}>
                    <Camera className="mr-2 h-4 w-4" />
                    Ambil Foto Ulang
                  </Link>
                </Button>

                <Alert className="bg-blue-50/50 text-blue-900 border-blue-100 dark:bg-blue-950/20 dark:text-blue-200 dark:border-blue-900">
                  <Activity className="h-4 w-4 stroke-blue-600 dark:stroke-blue-400" />
                  <AlertTitle>Tips Akurasi</AlertTitle>
                  <AlertDescription className="text-xs mt-1">
                    Pastikan foto fokus pada daun yang sakit dengan pencahayaan cukup.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>

          {/* KOLOM KANAN: Hasil Deteksi & Gemini AI */}
          <div className="space-y-6 lg:col-span-2">
            {/* 1. KARTU HASIL UTAMA */}
            <Card className="border-l-4 border-l-emerald-500 shadow-md transition-all hover:shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <CardDescription>Terdeteksi sebagai</CardDescription>
                    <CardTitle className="text-3xl font-bold text-emerald-950">
                      {formatLabel(activeResult.predicted_label || "Tidak Diketahui")}
                    </CardTitle>
                    {advice?.description && (
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                        {advice.description}
                      </p>
                    )}
                  </div>
                  <Badge
                    variant="outline"
                    className="px-3 py-1 h-fit text-sm border-emerald-200 bg-emerald-50 text-emerald-700"
                  >
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
                    className={`h-3 bg-primary ${getProgressColor(confidencePercent)}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. GEJALA & PENCEGAHAN */}
            {advice && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Card Gejala */}
                <Card className="flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Bug className="w-5 h-5 text-red-500" />
                      Gejala / Tanda Serangan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {advice.symptoms.length > 0 ? (
                        advice.symptoms.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-muted-foreground italic">
                          Tidak ada data gejala spesifik.
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>

                {/* Card Pencegahan */}
                <Card className="flex flex-col h-full">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-blue-500" />
                      Pencegahan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {advice.prevention.length > 0 ? (
                        advice.prevention.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                            <span className="leading-snug">{item}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-sm text-muted-foreground italic">
                          Data pencegahan tidak tersedia.
                        </li>
                      )}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* 3. LANGKAH PERAWATAN (Highlight) */}
            {advice && (
              <Card className="bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                    <Leaf className="w-5 h-5" />
                    Rekomendasi Perawatan
                  </CardTitle>
                  <CardDescription>
                    Tindakan kuratif yang disarankan oleh sistem untuk menangani masalah ini.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {advice.treatment.length > 0 ? (
                      advice.treatment.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-3 p-3 bg-background rounded-lg border border-emerald-100/50 shadow-sm"
                        >
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                          <span className="text-sm font-medium text-foreground leading-relaxed">
                            {item}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        Belum ada rekomendasi perawatan spesifik.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons Footer */}
            <div className="flex gap-4 pt-2">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 shadow-md">
                <Save className="w-4 h-4 mr-2" />
                Simpan ke Riwayat
              </Button>
              <Button variant="outline" className="flex-1 border-primary/20 hover:bg-primary/5 hover:text-primary">
                Bagikan Hasil
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}