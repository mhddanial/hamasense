import { useCallback, useState, useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import Cropper, { type Area } from "react-easy-crop";
import {
  Camera,
  CheckCircle2,
  Crop as CropIcon,
  ImageIcon,
  LoaderCircle,
  Upload,
} from "lucide-react";

import AppLayout from "@/layouts/app-layout";
import { route } from "ziggy-js";
import { type BreadcrumbItem } from "@/types";
import { PlaceholderPattern } from "@/components/ui/placeholder-pattern";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Deteksi",
    href: route("detect.index"),
  },
];

type UploadStatus = "idle" | "uploading" | "done";

export default function DetectPage() {
  const [file, setFile] = useState<File | null>(null);

  const {
    data,
    setData,
    post,
    processing,
    errors,
    progress: uploadProgress,
  } = useForm({
    image: null as File | null,
  });

  useEffect(() => {
    setData("image", file);
  }, [file, setData]);

  // original file & preview untuk bisa recrop dari gambar awal
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(
    null
  );

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);

  // state tambahan untuk UX
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // state cropper
  const [isCropping, setIsCropping] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, croppedArea: Area) => {
    setCroppedAreaPixels(croppedArea);
  }, []);

  const resetState = () => {
    setFile(null);
    setOriginalFile(null);
    setStatus("idle");
    setProgress(0);
    setIsAnalyzing(false);
    setIsCropping(false);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    if (previewUrl && previewUrl !== originalPreviewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    if (originalPreviewUrl) {
      URL.revokeObjectURL(originalPreviewUrl);
    }

    setPreviewUrl(null);
    setOriginalPreviewUrl(null);
  };

  const handleFileSelected = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      alert("Mohon unggah file gambar (jpg, jpeg, png, dll).");
      return;
    }

    // bersihin URL lama
    if (originalPreviewUrl) URL.revokeObjectURL(originalPreviewUrl);
    if (previewUrl && previewUrl !== originalPreviewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const url = URL.createObjectURL(selectedFile);

    // simpan original + set sebagai aktif
    setOriginalFile(selectedFile);
    setOriginalPreviewUrl(url);
    setFile(selectedFile);
    setPreviewUrl(url);

    setStatus("idle");
    setProgress(0);
    setIsAnalyzing(false);

    // reset posisi crop
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedAreaPixels(null);

    // buka modal crop pertama kali
    setIsCropping(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;
    handleFileSelected(selectedFile);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files?.[0] ?? null;
    handleFileSelected(droppedFile);
  };

  const preventDefaults = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // helper: crop di sisi client
  const getCroppedImageBlob = async (
    imageSrc: string,
    pixelCrop: Area
  ): Promise<Blob> => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Canvas context not available");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("Failed to create blob"));
        resolve(blob);
      }, "image/jpeg");
    });
  };

  const handleConfirmCrop = async () => {
    const source = originalPreviewUrl ?? previewUrl;
    if (!source || !croppedAreaPixels || !originalFile) {
      setIsCropping(false);
      return;
    }

    try {
      // selalu crop dari gambar original
      const croppedBlob = await getCroppedImageBlob(source, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], originalFile.name, {
        type: "image/jpeg",
      });

      setFile(croppedFile);
      setIsCropping(false);

      // update preview ke hasil crop
      const newUrl = URL.createObjectURL(croppedFile);
      setPreviewUrl((old) => {
        if (old && old !== originalPreviewUrl) URL.revokeObjectURL(old);
        return newUrl;
      });
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan saat memotong gambar.");
      setIsCropping(false);
    }
  };

  const MIN_ANALYZE_TIME = 1200;
  const finishAnalyze = (startTime: number) => {
    const elapsed = performance.now() - startTime;
    const remaining = MIN_ANALYZE_TIME - elapsed;

    const stop = () => {
      setIsAnalyzing(false);
    };

    if (remaining > 0) {
      setTimeout(stop, remaining);
    } else {
      stop();
    }
  };


  const handleDetectClick = (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Silakan unggah atau ambil foto terlebih dahulu.");
      return;
    }

    setStatus("uploading");
    setProgress(0);
    setIsAnalyzing(false);

    const startTime = performance.now();

    post(route("detect.store"), {
      forceFormData: true,
      onStart: () => {
        setStatus("uploading");
        setProgress(0);
        setIsAnalyzing(false);
      },
      onProgress: (progressEvent) => {
      if (typeof progressEvent?.percentage === "number") {
        setProgress(progressEvent.percentage);

        if (progressEvent.percentage >= 100) {
          setIsAnalyzing(true);
        }
      }
    },
      onSuccess: () => {
        finishAnalyze(startTime);
      },
      onError: (errors) => {
        console.error("Error dari Laravel:", errors);
        finishAnalyze(startTime);
        alert(
          "Gagal mendeteksi. " +
            (errors.image || errors.system || errors.api || "Terjadi kesalahan.")
        );
      },
      onFinish: () => {
        setIsAnalyzing(false);
      },
    });
  };

  const showAnalyzeSkeleton = isAnalyzing;

  // 1. DATA SAMPLE
  const sampleImages = [
    {
      label: "Penyakit Moko Pisang",
      url: "/images/banana_moko_disease.jpg",
      filename: "sample_moko.jpg",
    },
    {
      label: "Green Mite",
      url: "/images/cassava_green_mite.jpg",
      filename: "sample_green_mite.jpg",
    },
    {
      label: "Gambar Ngawur",
      url: "/images/gambar_ngawur.webp",
      filename: "sample_ngawur.webp",
    },
  ];

  // 2. HANDLER: Mengubah URL Gambar menjadi File Object
  const handleSampleClick = async (url: string, filename: string) => {
    try {
      // Tampilkan loading sebentar jika perlu, atau langsung proses
      const response = await fetch(url);
      const blob = await response.blob();
      
      // Buat File object dari Blob (meniru perilaku input type="file")
      const file = new File([blob], filename, { type: blob.type });
      
      // Reuse logic yang sudah ada!
      handleFileSelected(file);
    } catch (error) {
      console.error("Gagal memuat sample:", error);
      alert("Gagal memuat gambar contoh.");
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Deteksi Hama Tanaman" />

      {/* Overlay global saat sedang menganalisis */}
      {showAnalyzeSkeleton && (
        <div className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300">
          <div className="bg-background/95 border rounded-xl px-6 py-5 shadow-lg flex flex-col items-center gap-3 animate-in fade-in-0 zoom-in-95">
            <LoaderCircle className="h-7 w-7 animate-spin text-primary" />
            <p className="text-sm font-medium">
              Sistem sedang menganalisis gambar Anda...
            </p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Proses ini mungkin memakan beberapa detik tergantung ukuran gambar
              dan kompleksitas deteksi.
            </p>
          </div>
        </div>
      )}

      <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 md:px-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Deteksi Hama Tanaman
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Upload foto daun tanaman Anda untuk mendapatkan analisis dan
            rekomendasi penanganan hama dari sistem kecerdasan buatan.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Kiri: Upload & status */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Card className="border-sidebar-border/70 dark:border-sidebar-border transition-all duration-300">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">
                  Upload Foto
                </CardTitle>
                <CardDescription>
                  Pilih foto yang jelas menunjukkan area daun yang terkena hama,
                  lalu sesuaikan crop untuk fokus pada area penting.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Area upload / preview utama */}
                <div
                  onDrop={handleDrop}
                  onDragOver={preventDefaults}
                  onDragEnter={preventDefaults}
                  onDragLeave={preventDefaults}
                  className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-muted-foreground/40 bg-muted/40 text-center transition-all duration-300 hover:border-primary/60 hover:bg-muted/70"
                >
                  <PlaceholderPattern className="pointer-events-none absolute inset-0 size-full stroke-neutral-900/5 dark:stroke-neutral-100/10" />

                  {/* Jika belum ada gambar → tampilkan UI upload */}
                  {!file && (
                    <button
                      type="button"
                      className="relative z-10 flex w-full flex-col items-center gap-2 px-4 py-10 outline-none transition-all duration-300 hover:scale-[1.01]"
                      onClick={() =>
                        document.getElementById("file-input")?.click()
                      }
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                        <Upload className="h-5 w-5 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Seret atau unggah gambar
                        </p>
                        <p className="text-xs text-muted-foreground">
                          atau klik area ini untuk memilih file dari perangkat
                          Anda
                        </p>
                      </div>
                    </button>
                  )}

                  {/* Jika sudah ada gambar → tampilkan preview di area yang sama */}
                  {file && previewUrl && (
                    <div className="relative z-10 w-full animate-in fade-in-0 duration-300">
                      <div className="relative aspect-video w-full overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Preview daun"
                          className="h-full w-full object-cover transition-transform duration-500"
                        />
                        {/* Overlay tombol di pojok kanan atas */}
                        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
                          <span className="rounded-full bg-black/40 px-3 py-1 text-xs text-white backdrop-blur">
                            Preview Gambar
                          </span>
                          <div className="flex">
                            <Button
                              type="button"
                              size="icon"
                              variant="outline"
                              className="h-8 w-8 border-white/60 bg-black/40 text-white hover:bg-black/70"
                              onClick={() => {
                                setCrop({ x: 0, y: 0 });
                                setZoom(1);
                                setCroppedAreaPixels(null);
                                setIsCropping(true);
                              }}
                            >
                              <CropIcon className="h-4 w-4 text-white" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hidden input untuk file & kamera */}
                <Input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleInputChange}
                />
                <Input
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleInputChange}
                />

                {/* Tombol bawah dropzone */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="transition-all duration-200"
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Pilih file
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="transition-all duration-200"
                    onClick={() =>
                      document.getElementById("camera-input")?.click()
                    }
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Buka kamera
                  </Button>
                  {file && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="transition-all duration-200"
                      onClick={resetState}
                      disabled={processing}
                    >
                      Reset
                    </Button>
                  )}
                </div>

                {/* Info file + progress */}
                {file && previewUrl && (
                  <div className="mt-1 space-y-3 rounded-lg border bg-background/60 p-3 transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-muted overflow-hidden">
                        <img
                          src={previewUrl}
                          alt="Preview daun"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="truncate text-xs font-medium md:text-sm">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground md:text-xs">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {status === "done" && !processing ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                              <span className="text-[11px] text-emerald-700">
                                Berhasil diunggah, siap dideteksi.
                              </span>
                            </>
                          ) : processing ? (
                            <>
                              <LoaderCircle className="h-3.5 w-3.5 animate-spin text-primary" />
                              <span className="text-[11px] text-muted-foreground">
                                {progress < 100
                                  ? "Mengunggah gambar..."
                                  : "Menganalisis gambar di server..."}
                              </span>
                            </>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">
                              Siap untuk dideteksi.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <Progress
                      value={status === "idle" ? 0 : progress}
                      className="transition-all duration-300"
                    />
                  </div>
                )}

                <Separator />

                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <p className="text-xs text-muted-foreground">
                    Pastikan gambar sudah ter-crop dan fokus pada daun yang ingin
                    dianalisis.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    className="md:min-w-[140px] transition-all duration-200"
                    onClick={handleDetectClick}
                    disabled={!file || processing}
                  >
                    {processing && (
                      <LoaderCircle className="h-4 w-4 animate-spin mr-1" />
                    )}
                    {processing ? "Sedang memproses..." : "Deteksi Sekarang"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* --- TAMBAHAN: BAGIAN SAMPLE DATA --- */}
            <Card className="border-sidebar-border/70 dark:border-sidebar-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Gunakan Gambar Contoh</CardTitle>
                <CardDescription>
                  Belum punya foto daun? Coba deteksi menggunakan gambar sampel
                  berikut untuk melihat bagaimana AI bekerja.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {sampleImages.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSampleClick(sample.url, sample.filename)}
                      className="group relative aspect-square w-full overflow-hidden rounded-lg border bg-muted transition-all hover:ring-2 hover:ring-primary hover:ring-offset-2"
                      disabled={processing || isAnalyzing}
                    >
                      <img
                        src={sample.url}
                        alt={sample.label}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      {/* Label Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1.5 backdrop-blur-sm transition-opacity">
                        <p className="text-[10px] font-medium text-white text-center truncate">
                          {sample.label}
                        </p>
                      </div>
                      
                      {/* Loading overlay saat user klik sample ini */}
                      {processing && (
                          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                            <LoaderCircle className="h-5 w-5 animate-spin text-primary" />
                          </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Kanan: Tips & format */}
          <div className="flex flex-col gap-4">
            <Card className="border-sidebar-border/70 dark:border-sidebar-border">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm md:text-lg">
                  <Info className="w-6 h-6" />
                  Tips Foto Berkualitas
                </CardTitle>
                <CardDescription className="text-sm">
                  Ikuti panduan ini untuk meningkatkan akurasi prediksi model.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ScrollArea className="pr-2">
                  <ul className="space-y-2 text-xs md:text-md text-muted-foreground">
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>
                        Pastikan pencahayaan cukup dan tidak terlalu gelap.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>
                        Fokus pada daun yang dicurigai terserang hama.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>Jarak ideal 10–30 cm dari daun tanaman.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>
                        Hindari bayangan tangan atau objek lain yang menutupi
                        daun.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>
                        Gunakan background yang kontras agar daun lebih jelas.
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span>
                        Usahakan daun tidak blur / goyang saat difoto.
                      </span>
                    </li>
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>

            <Card className="border-sidebar-border/70 dark:border-sidebar-border">
              <CardHeader className="pb-1">
                <CardTitle className="flex items-center gap-2 text-sm md:text-base">
                  <ImageIcon className="h-6 w-6 text-primary" />
                  Format yang Didukung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs text-muted-foreground">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">JPG</Badge>
                  <Badge variant="outline">JPEG</Badge>
                  <Badge variant="outline">PNG</Badge>
                  <Badge variant="outline">WEBP</Badge>
                </div>
                <p>Ukuran maksimal: 10 MB per gambar.</p>
                <div className="text-[11px]">
                  <p>
                    Gambar yang terlalu kecil atau pecah dapat menurunkan akurasi
                    model pendeteksi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Dialog Cropper */}
      <Dialog open={isCropping} onOpenChange={setIsCropping}>
        <DialogContent className="max-w-lg gap-4 z-[99999]">
          <DialogHeader>
            <DialogTitle>Sesuaikan Area Gambar</DialogTitle>
          </DialogHeader>

          <div className="relative h-64 w-full overflow-hidden rounded-md bg-black/80">
            {(originalPreviewUrl ?? previewUrl) && (
              <Cropper
                image={originalPreviewUrl ?? (previewUrl as string)}
                crop={crop}
                zoom={zoom}
                aspect={4 / 3}
                onCropChange={setCrop}
                onZoomChange={(value) => setZoom(value)}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Zoom</p>
            <Slider
              min={1}
              max={3}
              step={0.1}
              value={[zoom]}
              onValueChange={([value]) => setZoom(value)}
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsCropping(false)}
            >
              Batal
            </Button>
            <Button type="button" size="sm" onClick={handleConfirmCrop}>
              Simpan Crop
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function Info(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none" />
      <line x1="12" y1="10" x2="12" y2="16" stroke="currentColor" />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}
