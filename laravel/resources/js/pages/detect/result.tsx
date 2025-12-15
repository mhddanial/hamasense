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
import { router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  image_path: string | null;
}

export default function ResultPage({ result, error, abstain_reasons, image_url, image_path  }: Props) {
  const { flash } = usePage().props as any;
  useEffect(() => {
    if (flash?.success) toast.success(flash.success);
    if (flash?.error) toast.error(flash.error);
  }, [flash]);

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
        <div className="flex flex-col gap-4 p-4 md:px-12 md:py-5">
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
            <div className="space-y-3 lg:col-span-1">
              <p className="font-semibold text-base">Gambar yang Diunggah</p>

              <div className="rounded-xl overflow-hidden border bg-white shadow-md">
                {image_url ? (
                  <img
                    src={image_url}
                    alt="Uploaded image"
                    className="w-full h-auto object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-muted-foreground bg-muted">
                    <Leaf className="w-12 h-12 opacity-20 mb-2" />
                    <span className="text-xs">Gambar tidak tersedia</span>
                  </div>
                )}
              </div>

              {/* TIPS */}
              <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-xl border border-amber-200 dark:border-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600 mt-1" />
                <p className="text-xs text-muted-foreground leading-normal">
                  <span className="font-medium">Tips:</span> Upload foto yang bersih, fokus,
                  dan jelas untuk mendapatkan hasil deteksi yang lebih akurat.
                </p>
              </div>
          </div>

            {/* KOLOM KANAN: PENJELASAN ERROR */}
            <div className="lg:col-span-2">
              <Card className="border-l-4 border-l-red-500 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-5 h-5" />
                    Analisis Tidak Dapat Dilanjutkan
                  </CardTitle>
                  <CardDescription>
                    Sistem tidak dapat mengidentifikasi gambar. Berikut kemungkinan penyebabnya:
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

                    {error && (
                      <li className="text-sm italic text-muted-foreground">{error}</li>
                    )}
                  </ul>

                  <Button className="mt-6 w-full bg-primary hover:bg-primary/90" asChild>
                    <Link href={route("detect.index")}>
                      <Camera className="mr-2 h-4 w-4" />
                      Coba Lagi
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
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

  const [isSaving, setIsSaving] = useState(false);
  const handleSave = () => {
    setIsSaving(true);

    router.post(
      route("detect.save"),
      {
        label: result?.info?.label || null,
        confidence: result?.confidence || null,
        entropy: result?.entropy || null,
        info: result?.info ? JSON.stringify(result.info) : null,
        should_abstain: result?.should_abstain || false,
        abstain_reasons: result?.abstain_reasons || abstain_reasons || [],
        image_path: image_path,
      },
      {
        onFinish: () => setIsSaving(false),
      }
    );
  };



  return (
    <AppLayout breadcrumbs={[{ title: "Hasil Deteksi", href: "#" }]}>
      <Head title="Hasil Analisis" />

      <div className="flex flex-col gap-4 p-4 md:px-12 md:py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-2">
          <Link
            href={route("detect.index")}
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-fit hover:underline"
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
          <div className="space-y-3 lg:col-span-1">
            <p className="font-semibold text-base">Gambar yang Diunggah</p>

            {/* PREVIEW GAMBAR */}
            <div className="rounded-xl overflow-hidden border bg-white shadow-md">
              {image_url ? (
                <img
                  src={image_url}
                  alt="Uploaded image"
                  className="w-full h-auto object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-muted-foreground bg-muted">
                  <Leaf className="w-12 h-12 opacity-20 mb-2" />
                  <span className="text-xs">Gambar tidak tersedia</span>
                </div>
              )}
            </div>

            {/* BUTTON ULANGI FOTO */}
            <Button className="w-full" variant="default" asChild>
              <Link href={route("detect.index")}>
                <Camera className="mr-2 h-4 w-4" />
                Ambil Foto Ulang
              </Link>
            </Button>

            {/* TIPS */}
            <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
              <AlertTriangle className="w-4 h-4 text-emerald-600 mt-1" />
              <p className="text-xs text-muted-foreground leading-normal">
                <span className="font-medium">Tips:</span> Pastikan foto yang Anda upload bersih, 
                jernih, agar mendapatkan hasil deteksi yang lebih akurat.
              </p>
            </div>
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
                        <span className="text-sm text-foregroun leading-relaxed">
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
              <Button
                className="w-full"
                variant="default"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Simpan Riwayat
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}