import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    ArrowLeft,
    Shield,
    Stethoscope,
    Sprout,
    ThermometerSun,
    Info,
    CheckCircle2,
    Copy,
    Check
} from 'lucide-react';
import { toast } from 'sonner';

// Shadcn UI Components
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

export default function PestDetails({ id }: { id?: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Nama ilmiah berhasil disalin ke clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    // Breadcrumbs
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Info Hama',
            href: route('pest.user.index'),
        },
        {
            title: 'Detail',
            href: '#',
        },
    ];

    // === DUMMY DATA KHUSUS PAGE INI ===
    const pest = {
        id: 2,
        nama: "Ulat Grayak",
        namaIlmiah: "Spodoptera litura",
        kategori: "Serangga",
        risiko: "Berat",
        gambarUtama:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1mISTcr5hMwDcom313ai0_CkwS6ihN0pqmp1MvfBnR-sY_2TN668onnDtI4P2Km2TDCz7ijZbpox59vmkT3IAZKHolAeSveRpmhadoA&s=1024",
        deskripsi: `Ulat grayak (Spodoptera litura) adalah hama penting pada berbagai jenis tanaman seperti padi, jagung, kedelai, sayuran daun, dan tanaman hortikultura lainnya. Serangan ulat grayak biasanya terjadi pada malam hari, ketika ulat aktif memakan daun hingga hanya menyisakan tulang daun. \n\nPada serangan berat, tanaman dapat tampak gundul dan pertumbuhan menjadi terhambat. Hama ini memiliki siklus hidup yang cepat dan kemampuan reproduksi tinggi, sehingga pengendalian sejak dini sangat diperlukan.`,
        tanaman: ["Jagung", "Padi", "Kedelai", "Cabai", "Bawang Merah"],
        pencegahan: [
            "Melakukan rotasi tanaman untuk memutus siklus hidup hama.",
            "Menjaga kebersihan lahan dari gulma yang dapat menjadi inang alternatif.",
            "Memasang perangkap lampu (light trap) untuk memonitor dan menekan populasi ngengat dewasa.",
            "Menanam varietas yang lebih tahan terhadap serangan hama (jika tersedia).",
        ],
        penanganan: [
            "Memungut dan memusnahkan telur serta ulat secara manual pada awal serangan.",
            "Menggunakan musuh alami seperti parasitoid atau entomopatogen (misalnya Beauveria bassiana).",
            "Aplikasi insektisida nabati (misalnya ekstrak daun mimba, sirsak, atau tembakau) sesuai anjuran.",
            "Jika serangan sudah berat, gunakan insektisida kimia sesuai dosis anjuran dan rotasi bahan aktif untuk mencegah resistensi.",
        ],
        gejalaGambar: [
            {
                url: "https://content.peat-cloud.com/w400/fall-armyworm-cabbage-1579082800.jpg",
                caption: "Daun tanaman yang berlubang dan tersisa tulang daun.",
            },
            {
                url: "https://content.peat-cloud.com/w400/fall-armyworm-soybean-1579084169.jpg",
                caption: "Kerusakan pada daun muda akibat gigitan ulat.",
            },
            {
                url: "https://content.peat-cloud.com/w400/fall-armyworm-potato-1579083584.jpg",
                caption: "Tanaman tampak seperti 'gundul' pada serangan berat.",
            },
        ],
    };

    const getRiskBadgeVariant = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'berat':
                return 'destructive'; // Shadcn variant (usually red)
            case 'sedang':
                return 'outline'; // Fallback or custom
            case 'rendah':
                return 'secondary';
            default:
                return 'outline';
        }
    };

    const getRiskColorClass = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'berat': return "bg-red-100 text-red-700 border-red-200";
            case 'sedang': return "bg-orange-100 text-orange-700 border-orange-200";
            case 'rendah': return "bg-emerald-100 text-emerald-700 border-emerald-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Hama - ${pest.nama}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:px-8 lg:px-12 py-8 bg-slate-50/50">

                {/* BACK BUTTON */}
                <div>
                    <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary gap-2">
                        <Link href={route('pest.user.index')}>
                            <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Hama
                        </Link>
                    </Button>
                </div>

                {/* HERO SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Main Info & Image */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* HEADER */}
                        <div className="space-y-4">
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                                    {pest.nama}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-lg text-muted-foreground italic font-serif">
                                        {pest.namaIlmiah}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                        onClick={() => handleCopy(pest.namaIlmiah)}
                                        title="Salin Nama Ilmiah"
                                    >
                                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* MAIN IMAGE */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md border bg-white">
                            <img
                                src={pest.gambarUtama}
                                alt={pest.nama}
                                className="h-full w-full object-cover transition-transform hover:scale-105 duration-700"
                                onError={(e) => {
                                    e.currentTarget.src = "/images/no-image.png"; // Replace/Handle error
                                }}
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2">
                                    <Info className="h-5 w-5 text-primary" />
                                    Deskripsi Hama
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="leading-relaxed text-gray-700 whitespace-pre-line">
                                    {pest.deskripsi}
                                </p>
                            </CardContent>
                        </Card>

                        {/* SYMPTOMS GALLERY */}
                        <section className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <ThermometerSun className="h-5 w-5 text-orange-500" />
                                Gejala Serangan
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {pest.gejalaGambar.map((g, index) => (
                                    <div key={index} className="group relative overflow-hidden rounded-xl border bg-background shadow-sm hover:shadow-md transition-all">
                                        <div className="aspect-square w-full overflow-hidden">
                                            <img
                                                src={g.url}
                                                alt={g.caption}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div className="p-3 bg-white">
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {g.caption}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                    </div>

                    {/* RIGHT COLUMN: Sidebar / Quick Info */}
                    <div className="space-y-6">

                        {/* QUICK STATS CARD */}
                        <Card className="overflow-hidden border-primary/20 shadow-md">
                            <div className="h-2 w-full bg-primary" /> {/* Top Accent Info */}
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg">Ringkasan Cepat</CardTitle>
                                <CardDescription>Informasi kunci mengenai hama ini.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex justify-between items-center py-2 border-b border-dashed">
                                    <span className="text-muted-foreground">Kategori</span>
                                    <span className="font-medium">{pest.kategori}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-dashed">
                                    <span className="text-muted-foreground">Risiko</span>
                                    <Badge variant="outline" className={`${getRiskColorClass(pest.risiko)} border-0`}>{pest.risiko}</Badge>
                                </div>

                                <div className="pt-2">
                                    <span className="text-muted-foreground block mb-2 flex items-center gap-1.5">
                                        <Sprout className="h-3.5 w-3.5" /> Tanaman Inang:
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {pest.tanaman.map((t, i) => (
                                            <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                                                {t}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* PREVENTION & HANDLING ACCORDION */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold px-1">Tindakan Pengendalian</h3>

                            <Accordion type="single" collapsible className="w-full space-y-3" defaultValue="item-1">

                                {/* Prevention */}
                                <AccordionItem value="item-1" className="border rounded-xl bg-white px-4 shadow-sm">
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                <Shield className="h-4 w-4" />
                                            </div>
                                            <span className="font-semibold text-emerald-800">Pencegahan</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 pb-4">
                                        <ul className="space-y-2">
                                            {pest.pencegahan.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2.5">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                                {/* Handling */}
                                <AccordionItem value="item-2" className="border rounded-xl bg-white px-4 shadow-sm">
                                    <AccordionTrigger className="hover:no-underline py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                                <Stethoscope className="h-4 w-4" />
                                            </div>
                                            <span className="font-semibold text-orange-800">Penanganan</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="text-gray-600 pb-4">
                                        <ul className="space-y-2">
                                            {pest.penanganan.map((item, i) => (
                                                <li key={i} className="flex items-start gap-2.5">
                                                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-bold text-orange-600 border border-orange-200">
                                                        {i + 1}
                                                    </span>
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>

                            </Accordion>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
