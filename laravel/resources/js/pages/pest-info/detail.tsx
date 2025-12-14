import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { route } from 'ziggy-js';

export default function PestDetails() {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Detail Hama',
            href: route('pest.detail'),
        },
    ];

    // === DUMMY DATA KHUSUS PAGE INI ===
    const pest = {
        id: 2,
        nama: "Ulat Grayak",
        namaIlmiah: "Spodoptera litura",
        kategori: "Ulat",
        risiko: "Berat",
        gambarUtama:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1mISTcr5hMwDcom313ai0_CkwS6ihN0pqmp1MvfBnR-sY_2TN668onnDtI4P2Km2TDCz7ijZbpox59vmkT3IAZKHolAeSveRpmhadoA&s=1024",
        deskripsi: `
            Ulat grayak (Spodoptera litura) adalah hama penting pada berbagai jenis tanaman seperti padi, jagung, kedelai, sayuran daun, dan tanaman hortikultura lainnya. Serangan ulat grayak biasanya terjadi pada malam hari, ketika ulat aktif memakan daun hingga hanya menyisakan tulang daun. Pada serangan berat, tanaman dapat tampak gundul dan pertumbuhan menjadi terhambat.
        `,
        pencegahan: [
            "Melakukan rotasi tanaman untuk memutus siklus hidup hama.",
            "Menjaga kebersihan lahan dari gulma yang dapat menjadi inang alternatif.",
            "Memasang perangkap lampu untuk memonitor dan menekan populasi ngengat dewasa.",
            "Menanam varietas yang lebih tahan terhadap serangan hama (jika tersedia).",
        ],
        penanganan: [
            "Memungut dan memusnahkan telur serta ulat secara manual pada awal serangan.",
            "Menggunakan musuh alami seperti parasitoid atau entomopatogen (misalnya Beauveria bassiana).",
            "Aplikasi insektisida nabati (misalnya ekstrak daun mimba, sirsak, atau tembakau) sesuai anjuran.",
            "Jika serangan sudah berat, gunakan insektisida kimia sesuai dosis anjuran dan rotasi bahan aktif.",
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

    const getRiskBadgeColor = (risk: string) => {
        switch (risk.toLowerCase()) {
            case 'berat':
                return 'bg-red-100 text-red-700';
            case 'sedang':
                return 'bg-orange-100 text-orange-700';
            case 'rendah':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Hama - ${pest.nama}`} />

            <div className="flex min-h-screen w-full bg-[#F4F5F7]">
                <main className="flex-1 p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {/* Header & Info Singkat */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">
                                    Informasi Hama / Detail
                                </p>
                                <h1 className="text-3xl font-bold mb-1">
                                    {pest.nama}
                                </h1>
                                <p className="italic text-gray-600 text-sm">
                                    {pest.namaIlmiah}
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                                    Kategori: {pest.kategori}
                                </span>
                                <span
                                    className={`px-3 py-1 text-xs rounded-full font-medium ${getRiskBadgeColor(
                                        pest.risiko
                                    )}`}
                                >
                                    Tingkat Risiko: {pest.risiko}
                                </span>
                            </div>
                        </div>

                        {/* Gambar Utama + Ringkasan */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                            <div className="md:col-span-3">
                                <div className="rounded-xl overflow-hidden shadow-sm bg-white">
                                    <img
                                        src={pest.gambarUtama}
                                        alt={pest.nama}
                                        className="w-full h-72 md:h-96 object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "/images/no-image.png";
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2">
                                <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
                                    <h2 className="text-lg font-semibold">
                                        Ringkasan Hama
                                    </h2>
                                    <div className="space-y-2 text-sm text-gray-700">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Nama Umum</span>
                                            <span className="font-medium">{pest.nama}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Nama Ilmiah</span>
                                            <span className="font-medium italic">
                                                {pest.namaIlmiah}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Kategori</span>
                                            <span className="font-medium">{pest.kategori}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Tingkat Risiko</span>
                                            <span className={`font-medium ${getRiskBadgeColor(pest.risiko)}`}>
                                                {pest.risiko}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 border-t pt-4">
                                        <p className="text-xs text-gray-500 mb-1">
                                            Catatan:
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Data pada halaman ini masih berupa data dummy untuk
                                            keperluan desain tampilan. Nantinya dapat diganti dengan
                                            data dari database.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Deskripsi */}
                        <section className="bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-semibold mb-3">
                                Deskripsi Hama
                            </h2>
                            <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                                {pest.deskripsi}
                            </p>
                        </section>

                        {/* Gejala Serangan (Gambar) */}
                        <section className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">
                                    Contoh Gejala Serangan
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {pest.gejalaGambar.map((g, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col bg-gray-50 rounded-lg overflow-hidden border"
                                    >
                                        <img
                                            src={g.url}
                                            alt={g.caption}
                                            className="w-full h-40 object-cover"
                                            onError={(e) => {
                                                e.currentTarget.src = "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=";
                                            }}
                                        />
                                        <div className="p-3">
                                            <p className="text-xs text-gray-700">
                                                {g.caption}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Pencegahan & Penanganan */}
                        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Pencegahan */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-3">
                                    Pencegahan
                                </h2>
                                <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
                                    {pest.pencegahan.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            </div>

                            {/* Penanganan */}
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-semibold mb-3">
                                    Penanganan
                                </h2>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                    {pest.penanganan.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ol>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}
