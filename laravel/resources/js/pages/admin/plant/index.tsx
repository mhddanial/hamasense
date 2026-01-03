import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Plant } from '@/types/admin';
import {
    Leaf,
    Search,
    Trash2,
    Eye,
    AlertTriangle,
    Plus,
    ImageIcon,
    ArrowUpDown
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Kelola Tanaman', href: '/admin/plant' },
];

// Types
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedPlants {
    data: Plant[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    keyword?: string;
    sort?: string;
}

interface Props extends PageProps {
    plants: PaginatedPlants;
    filters?: Filters;
}

export default function KelolaTanaman({ plants, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.keyword || '');
    const [sortBy, setSortBy] = useState(filters?.sort || 'latest');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedPlant, setSelectedPlant] = useState<{ id: number; name: string } | null>(null);

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
        router.get('/admin/plant', { keyword: searchTerm, sort: sortBy }, { preserveState: true });
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        router.get('/admin/plant', { keyword: searchTerm || undefined, sort: value }, { preserveState: true });
    };

    const handleDeleteClick = (plant: Plant) => {
        setSelectedPlant({ id: plant.id, name: plant.name });
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedPlant) {
            router.delete(`/admin/plant/${selectedPlant.id}`);
        }
        setDeleteDialogOpen(false);
        setSelectedPlant(null);
    };

    const plantsData = plants?.data || [];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="flex-1 min-h-screen p-6 bg-gray-50/50">
                <Head title="Kelola Tanaman" />

                {/* Header */}
                <Card className="mb-6 border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Leaf className="w-6 h-6 text-primary" />
                                    Kelola Tanaman
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Kelola daftar tanaman yang tersedia dalam sistem
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-sm">
                                    Total: {plants.total} tanaman
                                </Badge>
                                <Link href="/admin/plant/create">
                                    <Button className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Tambah Tanaman
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Search and Sort */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <form onSubmit={handleSearch} className="flex gap-2 w-full md:max-w-md">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="Cari tanaman..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Button type="submit" variant="default">
                                    Cari
                                </Button>
                            </form>
                            <Select value={sortBy} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <ArrowUpDown className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Terbaru</SelectItem>
                                    <SelectItem value="oldest">Terlama</SelectItem>
                                    <SelectItem value="name_asc">Nama A-Z</SelectItem>
                                    <SelectItem value="name_desc">Nama Z-A</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Plants Table */}
                <Card className="border-0 shadow-sm px-4">
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/80">
                                    <TableHead className="w-16">No</TableHead>
                                    <TableHead className="w-20">Gambar</TableHead>
                                    <TableHead>Nama Tanaman</TableHead>
                                    <TableHead>Nama Ilmiah</TableHead>
                                    <TableHead>Detail</TableHead>
                                    <TableHead className="text-right w-28">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plantsData.length > 0 ? (
                                    plantsData.map((plant, index) => (
                                        <TableRow key={plant.id} className="hover:bg-gray-50/50 hover:cursor-pointer">
                                            <TableCell className="font-medium text-gray-500">
                                                {(plants.current_page - 1) * plants.per_page + index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                    {plant.img_path ? (
                                                        <img
                                                            src={`/storage/plant/${plant.img_path}`}
                                                            alt={plant.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                                (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                        />
                                                    ) : null}
                                                    <ImageIcon className={`w-5 h-5 text-gray-400 ${plant.img_path ? 'hidden' : ''}`} />
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <p className="font-medium text-gray-900">{plant.name}</p>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-gray-600 italic">{plant.scientific_name || '-'}</span>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-gray-600 text-sm line-clamp-2 max-w-xs">
                                                    {plant.detail || '-'}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Link href={`/admin/plant/${plant.id}`}>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                            <Eye className="text-gray-500 h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteClick(plant)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center">
                                            <div className="flex flex-col items-center justify-center text-gray-500">
                                                <Leaf className="w-10 h-10 mb-2 opacity-30" />
                                                <p className="font-medium">Tidak ada tanaman ditemukan</p>
                                                <p className="text-sm">Coba ubah kata kunci pencarian atau tambah tanaman baru</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {plants.last_page > 1 && (
                            <div className="px-6 py-4 border-t bg-gray-50/30">
                                <div className="flex justify-center gap-1">
                                    {plants.links.map((link, i) => (
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
                                Apakah Anda yakin ingin menghapus tanaman <strong>{selectedPlant?.name}</strong>?
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
        </AdminLayout>
    );
}
