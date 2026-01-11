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
import { router } from "@inertiajs/react";
import { useEffect, useState } from "react";


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

interface DiseaseData {
  id: number;
  name: string;
  description: string | null;
  severity_level: 'rendah' | 'sedang' | 'tinggi';
}

interface PlantTypeData {
  id: number;
  name: string;
}

interface Props {
  result: FastApiResult | null;
  disease: DiseaseData | null;
  plant_type: PlantTypeData | null;
  error: string | null;
  abstain_reasons?: string[];
  image_url: string | null;
  image_path: string | null;
}

export default function ResultPage({ result, disease, plant_type, error, abstain_reasons, image_url, image_path }: Props) {
  // Flash message handling is now in AppSidebarLayout


  // Determine error type for better messaging
  const getErrorInfo = () => {
    // Check for specific error types
    if (error) {
      return {
        title: "Terjadi Kesalahan",
        subtitle: "Sistem mengalami masalah saat memproses gambar Anda.",
        icon: "error",
        color: "red"
      };
    }

    if (!result) {
      return {
        title: "Tidak Ada Hasil",
        subtitle: "Sistem tidak dapat memproses gambar yang diunggah.",
        icon: "empty",
        color: "gray"
      };
    }

    // Low confidence / abstain case
    if (result.should_abstain || result.confidence === null) {
      const reasons = abstain_reasons || result?.abstain_reasons || [];
      const isLowConfidence = reasons.some(r => r.toLowerCase().includes("confidence"));

      if (isLowConfidence) {
        return {
          title: "Hasil Tidak Meyakinkan",
          subtitle: "AI tidak cukup yakin untuk mengidentifikasi penyakit atau hama pada gambar ini.",
          icon: "uncertain",
          color: "amber"
        };
      }

      return {
        title: "Tidak Dapat Diidentifikasi",
        subtitle: "Gambar yang diunggah tidak dapat dikenali sebagai penyakit atau hama tanaman dalam database kami.",
        icon: "unknown",
        color: "amber"
      };
    }

    // No predicted label
    return {
      title: "Hasil Tidak Tersedia",
      subtitle: "Tidak ada hasil deteksi yang dapat ditampilkan.",
      icon: "empty",
      color: "gray"
    };
  };

  const errorInfo = getErrorInfo();
  const displayReasons = abstain_reasons || result?.abstain_reasons || [];

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
        <Head title="Hasil Tidak Tersedia" />
        <div className="flex flex-col gap-4 p-4 md:px-12 md:py-5">
          {/* HEADER */}
          <Link
            href={route("detect.index")}
            className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Deteksi
          </Link>

          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${errorInfo.color === "red" ? "bg-red-100 text-red-600" :
              errorInfo.color === "amber" ? "bg-amber-100 text-amber-600" :
                "bg-gray-100 text-gray-600"
              }`}>
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{errorInfo.title}</h1>
              <p className="text-muted-foreground max-w-xl">
                {errorInfo.subtitle}
              </p>
            </div>
          </div>

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

              {/* BUTTON COBA LAGI */}
              <Button className="w-full" variant="default" asChild>
                <Link href={route("detect.index")}>
                  <Camera className="mr-2 h-4 w-4" />
                  Coba Foto Lagi
                </Link>
              </Button>
            </div>

            {/* KOLOM KANAN: PENJELASAN & SARAN */}
            <div className="lg:col-span-2 space-y-4">
              {/* Card Info Utama */}
              <Card className={`border-l-4 shadow-md ${errorInfo.color === "red" ? "border-l-red-500" :
                errorInfo.color === "amber" ? "border-l-amber-500" :
                  "border-l-gray-400"
                }`}>
                <CardHeader>
                  <CardTitle className={`text-lg flex items-center gap-2 ${errorInfo.color === "red" ? "text-red-700" :
                    errorInfo.color === "amber" ? "text-amber-700" :
                      "text-gray-700"
                    }`}>
                    <AlertTriangle className="w-5 h-5" />
                    Mengapa Ini Terjadi?
                  </CardTitle>
                  <CardDescription>
                    Berikut kemungkinan penyebab hasil tidak dapat ditampilkan:
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Display abstain reasons if any */}
                  {displayReasons.length > 0 && (
                    <ul className="space-y-2">
                      {displayReasons.map((r, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className={`mt-1.5 h-2 w-2 rounded-full shrink-0 ${errorInfo.color === "red" ? "bg-red-400" :
                            errorInfo.color === "amber" ? "bg-amber-400" :
                              "bg-gray-400"
                            }`}></div>
                          {r}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Display specific error message */}
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  )}

                  {/* Default reasons if none provided */}
                  {displayReasons.length === 0 && !error && (
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-amber-400 shrink-0"></div>
                        Gambar tidak menampilkan tanaman yang jelas
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-amber-400 shrink-0"></div>
                        Penyakit/hama tidak termasuk dalam database yang dikenali
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="mt-1.5 h-2 w-2 rounded-full bg-amber-400 shrink-0"></div>
                        Kualitas gambar kurang baik (blur, gelap, atau silau)
                      </li>
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Card Tips */}
              <Card className="bg-emerald-50/50 border-emerald-100 dark:bg-emerald-950/10 dark:border-emerald-900">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
                    <Leaf className="w-5 h-5" />
                    Tips Mendapatkan Hasil Lebih Baik
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-start gap-3 p-3 bg-background rounded-lg border shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Fokus pada Bagian Terinfeksi</p>
                        <p className="text-xs text-muted-foreground">Ambil foto close-up bagian daun atau batang yang menunjukkan gejala</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-background rounded-lg border shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Pencahayaan yang Baik</p>
                        <p className="text-xs text-muted-foreground">Pastikan gambar tidak terlalu gelap atau terlalu terang</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-background rounded-lg border shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Gambar Tidak Blur</p>
                        <p className="text-xs text-muted-foreground">Pastikan kamera fokus dan gambar tajam sebelum mengambil foto</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-background rounded-lg border shadow-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Hindari Background Ramai</p>
                        <p className="text-xs text-muted-foreground">Fokuskan hanya pada tanaman yang ingin dideteksi</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Supported Plants Info */}
              <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
                <Bug className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Tanaman yang Didukung</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                    Saat ini sistem kami dapat mendeteksi penyakit pada: Tomat, Cabai, Jagung, Pisang, Singkong, Selada, Kentang, dan beberapa tanaman lainnya(Dalam pengembangan).
                    Pastikan tanaman Anda termasuk dalam daftar yang didukung.
                  </p>
                </div>
              </div>
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
        label: result?.predicted_label || null,
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
                    {/* Menggunakan name dari database, fallback ke label dari API */}
                    <CardTitle className="text-3xl font-bold text-emerald-950 dark:text-emerald-50 mt-1">
                      {disease?.name || label}
                    </CardTitle>
                    {/* Plant type and severity badges in consistent layout */}
                    <div className="flex flex-wrap gap-3 mt-3">
                      {plant_type && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Nama Tanaman:</span>
                          <Badge
                            variant="secondary"
                            className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          >
                            {plant_type.name}
                          </Badge>
                        </div>
                      )}
                      {disease?.severity_level && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Tingkat Keparahan:</span>
                          <Badge
                            variant="outline"
                            className={`px-3 py-1 ${disease.severity_level === 'tinggi'
                              ? 'border-red-200 bg-red-50 text-red-700'
                              : disease.severity_level === 'sedang'
                                ? 'border-yellow-200 bg-yellow-50 text-yellow-700'
                                : 'border-green-200 bg-green-50 text-green-700'
                              }`}
                          >
                            {disease.severity_level === 'tinggi' ? 'Tinggi' :
                              disease.severity_level === 'sedang' ? 'Sedang' : 'Rendah'}
                          </Badge>
                        </div>
                      )}
                    </div>
                    {/* Description dari FastAPI */}
                    {advice.description && (
                      <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
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