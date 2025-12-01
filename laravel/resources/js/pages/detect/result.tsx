import { route } from "ziggy-js";
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
import {
  CheckCircle2,
  ArrowLeft,
  Leaf,
  Bug,
  ShieldCheck,
  Save,
  Camera,
  AlertTriangle,
} from "lucide-react";

interface APIAdvice {
  label: string;
  confidence: number;
  data: {
    description: string;
    symptoms: string[];
    treatment: string[];
    prevention: string[];
  };
  notes: string | null;
}

interface FastApiResult {
  source: string;
  predicted_label: string | null;
  confidence: number | null;
  should_abstain: boolean;
  abstain_reasons: string[];
  entropy: number | null;
  info: APIAdvice | null;
}

interface Props {
  result: FastApiResult | null;
  error: string | null;
  abstain_reasons?: string[];
  image_url: string | null;
}

export default function ResultPage({ result, error, abstain_reasons, image_url }: Props) {
  const isAbstain =
    error ||
    !result ||
    result.should_abstain ||
    result.confidence === null ||
    result.predicted_label === null;

  // Jika abstain → tampilkan UI fallback error
  if (isAbstain) {
    return (
      <AppLayout breadcrumbs={[{ title: "Hasil Deteksi", href: "#" }]}>
        <Head title="Gagal Mendeteksi" />
        
        <div className="flex flex-col gap-6 p-4 md:px-12 md:py-8">
          
          {/* HEADER */}
          <Link
            href={route("detect.index")}
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Deteksi
          </Link>

          <h1 className="text-2xl font-bold">Hasil Tidak Dapat Dipastikan</h1>
          <p className="text-muted-foreground max-w-xl">
            Sistem tidak dapat memastikan jenis penyakit atau hama pada gambar ini.
            Silakan unggah gambar yang lebih jelas atau ambil foto ulang.
          </p>

          <div className="grid gap-6 lg:grid-cols-3">
            
            {/* GAMBAR */}
            <Card className="overflow-hidden border-2 border-destructive/20">
              <CardHeader className="bg-destructive/10 pb-4">
                <CardTitle className="text-base">Gambar yang Diunggah</CardTitle>
              </CardHeader>
              <div className="relative aspect-[4/3] bg-black/5">
                {image_url ? (
                  <img
                    src={image_url}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Leaf className="w-12 h-12 opacity-20 mb-2" />
                    <span className="text-xs">Gambar tidak tersedia</span>
                  </div>
                )}
              </div>
            </Card>

            {/* INFO ERROR */}
            <Card className="lg:col-span-2 border-l-4 border-l-red-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                  <AlertTriangle className="w-5 h-5" />
                  Analisis Tidak Dapat Dilanjutkan
                </CardTitle>
                <CardDescription>
                  Berikut beberapa kemungkinan penyebab:
                </CardDescription>
              </CardHeader>

              <CardContent>
                <ul className="space-y-2">
                  {(abstain_reasons || result?.abstain_reasons || []).map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <div className="mt-1.5 h-2 w-2 rounded-full bg-red-400"></div>
                      {r}
                    </li>
                  ))}

                  {/* Jika API error general */}
                  {error && (
                    <li className="text-sm text-muted-foreground italic">{error}</li>
                  )}
                </ul>

                <Button
                  className="mt-6 w-full bg-primary"
                  asChild
                >
                  <Link href={route("detect.index")}>
                    <Camera className="mr-2 h-4 w-4" />
                    Coba Lagi
                  </Link>
                </Button>
              </CardContent>
            </Card>

          </div>
        </div>
      </AppLayout>
    );
  }


  const { label, data: advice } = result.info!;
  const confidencePercent = Math.round((result.confidence || 0) * 100);

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-primary";
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
            Berikut adalah hasil analisis berdasarkan gambar yang Anda unggah.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* KOLOM KIRI: Gambar Preview */}  
          <div className="space-y-6 lg:col-span-1">
            <Card className="overflow-hidden border-2 border-primary/10 shadow-sm">
              <CardHeader className="bg-muted/30 pb-4">
                <CardTitle className="text-base">Gambar yang Diunggah</CardTitle>
              </CardHeader>
              <div className="relative aspect-[4/3] w-full bg-black/5">
                {image_url ? (
                  <img 
                    src={image_url} 
                    alt="Uploaded leaf" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground bg-muted">
                    <Leaf className="w-12 h-12 opacity-20 mb-2" />
                    <span className="text-xs">Gambar tidak tersedia</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center bg-muted/50 p-2 rounded-md">
                    <span className="truncate max-w-[200px]">{result.source}</span>
                </div>
                <Button className="w-full" variant="secondary" asChild>
                  <Link href={route("detect.index")}>
                    <Camera className="mr-2 h-4 w-4" />
                    Ambil Foto Ulang
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* KOLOM KANAN: Detail Hasil */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* 1. KARTU HASIL UTAMA */}
            <Card className="border-l-4 border-l-emerald-500 shadow-md">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div>
                    <CardDescription>Terdeteksi sebagai</CardDescription>
                    {/* Menggunakan label dari JSON (info.label) */}
                    <CardTitle className="text-3xl font-bold text-emerald-950 dark:text-emerald-50 mt-1">
                      {label}
                    </CardTitle>
                    {/* Description dari JSON */}
                    {advice.description && (
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
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Tingkat Kecocokan</span>
                    <span>{confidencePercent}%</span>
                  </div>
                  <Progress
                    value={confidencePercent}
                    className={`h-3 [&>div]:${getProgressColor(confidencePercent)}`}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 2. GEJALA & PENCEGAHAN */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Card Gejala */}
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Bug className="w-5 h-5 text-red-500" />
                    Gejala Umum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {advice.symptoms?.length > 0 ? (
                      advice.symptoms.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm italic text-muted-foreground">Tidak ada data gejala.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>

              {/* Card Pencegahan */}
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    Pencegahan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {advice.prevention?.length > 0 ? (
                      advice.prevention.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-sm italic text-muted-foreground">Tidak ada data pencegahan.</li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* 3. REKOMENDASI PERAWATAN / PENANGANAN */}
            <Card className="bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                  <Leaf className="w-5 h-5" />
                  Solusi & Penanganan
                </CardTitle>
                <CardDescription>
                  Langkah yang disarankan untuk mengendalikan penyakit ini.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {advice.treatment?.length > 0 ? (
                    advice.treatment.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 bg-background rounded-lg border shadow-sm"
                      >
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                        <span className="text-sm font-medium text-foreground">
                          {item}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm italic text-muted-foreground">Belum ada saran perawatan spesifik.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 mr-2" />
                Simpan Riwayat
              </Button>
              {/* Optional: Tombol Detail jika ada halaman ensiklopedia */}
              {/* <Button variant="outline" className="flex-1">
                Lihat di Ensiklopedia
              </Button> */}
            </div>

          </div>
        </div>
      </div>
    </AppLayout>
  );
}