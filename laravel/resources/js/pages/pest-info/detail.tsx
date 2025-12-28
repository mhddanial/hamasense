import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Pest } from '@/types/admin';
import { Head, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import {
    ArrowLeft,
    Shield,
    Stethoscope,
    Sprout,
    Info,
    CheckCircle2,
    Copy,
    Check,
    Bug
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

interface Props {
    pest: Pest;
}

export default function PestDetails({ pest }: Props) {
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
            title: pest.name,
            href: '#',
        },
    ];

    const getRiskColorClass = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'tinggi': return "bg-red-100 text-red-700 border-red-200";
            case 'sedang': return "bg-orange-100 text-orange-700 border-orange-200";
            case 'rendah': return "bg-emerald-100 text-emerald-700 border-emerald-200";
            default: return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getRiskLabel = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'tinggi': return 'Tinggi';
            case 'sedang': return 'Sedang';
            case 'rendah': return 'Rendah';
            default: return risk;
        }
    };

    // Build image URL
    const imageUrl = pest.img_path ? `/storage/pest/${pest.img_path}` : null;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Hama - ${pest.name}`} />

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
                                    {pest.name}
                                </h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <p className="text-lg text-muted-foreground italic font-serif">
                                        {pest.scientific_name}
                                    </p>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-muted-foreground hover:bg-primary/10 hover:text-primary"
                                        onClick={() => handleCopy(pest.scientific_name)}
                                        title="Salin Nama Ilmiah"
                                    >
                                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* MAIN IMAGE */}
                        <div className="relative aspect-video w-full overflow-hidden rounded-2xl shadow-md border bg-white">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt={pest.name}
                                    className="h-full w-full object-cover transition-transform hover:scale-105 duration-700"
                                    onError={(e) => {
                                        e.currentTarget.src = "/images/no-image.png";
                                    }}
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                                    <Bug className="h-24 w-24 opacity-20" />
                                </div>
                            )}
                        </div>

                        {/* DESCRIPTION */}
                        {pest.description && (
                            <Card className="border-none shadow-sm bg-white/60 backdrop-blur-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-2">
                                        <Info className="h-5 w-5 text-primary" />
                                        Deskripsi Hama
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="leading-relaxed text-gray-700 whitespace-pre-line">
                                        {pest.description}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

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
                                    <span className="font-medium">{pest.category}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-dashed">
                                    <span className="text-muted-foreground">Risiko</span>
                                    <Badge variant="outline" className={`${getRiskColorClass(pest.risk_level)} border-0`}>
                                        {getRiskLabel(pest.risk_level)}
                                    </Badge>
                                </div>

                                {pest.plant && pest.plant.length > 0 && (
                                    <div className="pt-2">
                                        <span className="text-muted-foreground block mb-2 flex items-center gap-1.5">
                                            <Sprout className="h-3.5 w-3.5" /> Tanaman Inang:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {pest.plant.map((plantName, i) => (
                                                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-600 font-normal">
                                                    {plantName}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* PREVENTION & HANDLING ACCORDION */}
                        {((pest.pencegahan && pest.pencegahan.length > 0) || (pest.penanganan && pest.penanganan.length > 0)) && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold px-1">Tindakan Pengendalian</h3>

                                <Accordion type="single" collapsible className="w-full space-y-3" defaultValue="item-1">

                                    {/* Prevention */}
                                    {pest.pencegahan && pest.pencegahan.length > 0 && (
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
                                    )}

                                    {/* Handling */}
                                    {pest.penanganan && pest.penanganan.length > 0 && (
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
                                    )}

                                </Accordion>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
