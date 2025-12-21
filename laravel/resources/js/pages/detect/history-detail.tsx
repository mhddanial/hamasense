import { Head, Link, router } from "@inertiajs/react";
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
import {
  ArrowLeft,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  Bug,
  Trash2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { route } from "ziggy-js";

interface AdviceData {
  description: string;
  symptoms: string[];
  treatment: string[];
  prevention: string[];
}

interface Info {
  label: string;
  confidence: number;
  data: AdviceData;
  notes: string | null;
}

interface Props {
  item: {
    id: number;
    image_path: string;
    label: string;
    confidence: number;
    entropy: number;
    info: Info;
    created_at: string;
  };
}

export default function HistoryDetail({ item }: Props) {
  const advice = item.info.data;
  const confidencePercent = Math.round((item.confidence ?? 0) * 100);

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-primary";
    if (score >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <AppLayout breadcrumbs={[{ title: "Detail Riwayat", href: "#" }]}>
      <Head title="Detail Riwayat Deteksi" />

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:px-12">

        {/* Back Button */}
        <Link
          href={route("detect.history")}
          className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors w-fit"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Riwayat
        </Link>

        {/* TITLE */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Detail Riwayat Deteksi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Hasil analisis dari gambar yang Anda unggah.
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* LEFT — Image */}
          <div className="space-y-3 lg:col-span-1">
            <p className="font-semibold">Gambar Deteksi</p>

            <div className="rounded-xl overflow-hidden border bg-white shadow-md">
              <img
                src={`/storage/${item.image_path}`}
                className="w-full h-auto object-cover"
              />
            </div>

            {/* Detection Date */}
            <Card>
              <CardContent className="text-sm">
                <p className="font-medium text-muted-foreground">Waktu Deteksi:</p>
                <p className="text-base font-semibold">
                  {new Date(item.created_at).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </CardContent>
            </Card>

            {/* CTA Card */}
            <Card className="bg-emerald-900 text-white border-none shadow-lg">
              <CardContent className="p-5 flex flex-col items-center text-center">
                <div className="bg-white/20 p-3 rounded-full mb-3">
                  <Leaf className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-lg font-semibold">Monitoring Berkelanjutan</h3>

                <p className="text-sm text-white/80 mt-1 mb-4">
                  Dapatkan pendampingan AI untuk memantau perkembangan tanaman Anda secara real-time.
                </p>

                <Link
                  href={route('cases.createFormDetection', item.id)}
                  method="post"
                  as="button"
                  className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold mt-2 inline-flex items-center justify-center rounded-md text-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 w-full py-2"
                >
                  Mulai Monitoring →
                </Link>
              </CardContent>
            </Card>

            {/* DELETE BUTTON */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Hapus Riwayat
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Hapus Riwayat Deteksi?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tindakan ini tidak dapat dibatalkan. Riwayat ini akan dihapus secara permanen dari server kami.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={() => router.delete(route('detect.history.delete', item.id))} className="bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:cursor-pointer">
                    <span className="text-white">Hapus</span>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* RIGHT — Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Result Card */}
            <Card className="border-l-4 border-l-emerald-500 shadow-md">
              <CardHeader>
                <CardDescription>Teridentifikasi sebagai</CardDescription>

                <CardTitle className="text-3xl font-bold mt-1">
                  {item.label}
                </CardTitle>

                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                  {advice.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm font-medium">
                  <span>Tingkat Kepercayaan</span>
                  <span>{confidencePercent}%</span>
                </div>

                <Progress
                  value={confidencePercent}
                  className={`h-3 [&>div]:${getProgressColor(confidencePercent)}`}
                />
              </CardContent>
            </Card>

            {/* Symptoms & Prevention */}
            <div className="grid gap-6 md:grid-cols-2">

              {/* Symptoms */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Bug className="w-5 h-5 text-red-500" />
                    Gejala Umum
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <ul className="space-y-3">
                    {advice.symptoms.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed">
                        <div className="mt-1.5 w-2 h-2 min-w-2 min-h-2 rounded-full bg-red-400" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Prevention */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    Pencegahan
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-2">
                  <ul className="space-y-3">
                    {advice.prevention.map((p, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed">
                        <div className="mt-1.5 w-2 h-2 min-w-2 min-h-2 rounded-full bg-blue-400" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Treatment */}
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

          </div>

        </div>
      </div>
    </AppLayout>
  );
}
