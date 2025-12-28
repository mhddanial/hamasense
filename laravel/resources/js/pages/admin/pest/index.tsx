import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { PageProps } from '@inertiajs/core';
import { Pest } from '@/types/admin';
import {
    Bug,
    Search,
    Trash2,
    Eye,
    AlertTriangle,
    Plus,
    ImageIcon
} from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

// Types
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedPests {
    data: Pest[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props extends PageProps {
    pests: PaginatedPests;
    search?: string;
}

export default function KelolaDataHama({ pests, search }: Props) {
    const [searchTerm, setSearchTerm] = useState(search || '');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPest, setSelectedPest] = useState<{ id: number; name: string } | null>(null);

    const { flash } = usePage().props;
    const success = flash?.success;
    const error = flash?.error;

    useEffect(() => {
        if (success) {
            toast.success(success as string);
        }
        if (error) {
            toast.error(error as string);
        }
    }, [success, error]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/admin/pest', { keyword: searchTerm }, { preserveState: true });
    };

    const handleDeleteClick = (pest: Pest) => {
        setSelectedPest({ id: pest.id, name: pest.name });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedPest) {
            router.delete(`/admin/pest/${selectedPest.id}`);
        }
        setDeleteDialogOpen(false);
        setSelectedPest(null);
    };

    const getRiskBadge = (riskLevel: string) => {
        switch (riskLevel) {
            case 'tinggi':
                return <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-0">Tinggi</Badge>;
            case 'sedang':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-0">Sedang</Badge>;
            case 'rendah':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">Rendah</Badge>;
            default:
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-200 border-0">-</Badge>;
        }
    };

    const pestsData = pests?.data || [];

    return (
        <div className="flex-1 min-h-screen p-6 bg-gray-50/50">
            <Head title="Kelola Hama" />

            {/* Header */}
            <Card className="mb-6 border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Bug className="w-6 h-6 text-primary" />
                                Kelola Hama
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Kelola daftar hama tanaman yang tersedia dalam sistem
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-sm">
                                Total: {pests.total} hama
                            </Badge>
                            <Link href="/admin/pest/create">
                                <Button className="gap-2">
                                    <Plus className="w-4 h-4" />
                                    Tambah Hama
                                </Button>
                            </Link>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search */}
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:max-w-md">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                                type="text"
                                placeholder="Cari hama..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Button type="submit" variant="default">
                            Cari
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Pests Table */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/80">
                                <TableHead className="w-16">No</TableHead>
                                <TableHead className="w-20">Gambar</TableHead>
                                <TableHead>Nama Hama</TableHead>
                                <TableHead>Nama Ilmiah</TableHead>
                                <TableHead>Tingkat Risiko</TableHead>
                                <TableHead>Kategori</TableHead>
                                <TableHead className="text-right w-28">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pestsData.length > 0 ? (
                                pestsData.map((pest, index) => (
                                    <TableRow key={pest.id} className="hover:bg-gray-50/50 hover:cursor-pointer">
                                        <TableCell className="font-medium text-gray-500">
                                            {(pests.current_page - 1) * pests.per_page + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                {pest.img_path ? (
                                                    <img
                                                        src={`/storage/pest/${pest.img_path}`}
                                                        alt={pest.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).style.display = 'none';
                                                            (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                        }}
                                                    />
                                                ) : null}
                                                <ImageIcon className={`w-5 h-5 text-gray-400 ${pest.img_path ? 'hidden' : ''}`} />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <p className="font-medium text-gray-900">{pest.name}</p>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-gray-600 italic">{pest.scientific_name || '-'}</span>
                                        </TableCell>
                                        <TableCell>
                                            {getRiskBadge(pest.risk_level)}
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-gray-600">{pest.category || '-'}</span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link href={`/admin/pest/${pest.id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                                                        <Eye className="text-gray-500 h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeleteClick(pest)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Bug className="w-10 h-10 mb-2 opacity-30" />
                                            <p className="font-medium">Tidak ada hama ditemukan</p>
                                            <p className="text-sm">Coba ubah kata kunci pencarian atau tambah hama baru</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {pests.last_page > 1 && (
                        <div className="px-6 py-4 border-t bg-gray-50/30">
                            <div className="flex justify-center gap-1">
                                {pests.links.map((link, i) => (
                                    link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${link.active
                                                ? 'bg-primary text-white shadow-sm'
                                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                                }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            Konfirmasi Hapus
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus hama <strong>{selectedPest?.name}</strong>?
                            Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Hapus
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

KelolaDataHama.layout = (page: React.ReactElement) => (
    <AdminLayout>
        {page}
    </AdminLayout>
);
