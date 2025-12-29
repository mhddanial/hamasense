import { Pest, Category } from '@/types/admin';
import SearchBar from '@/components/SearchBar';
import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage, useForm } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { PageProps } from '@inertiajs/core';
import {
    Bug,
    Search,
    Trash2,
    Eye,
    AlertTriangle,
    Plus,
    ImageIcon,
    Tag,
    SquarePen,
    Edit2,
    Loader2,
    RefreshCw
} from 'lucide-react';
import { Filter, FolderOpen, SearchX } from 'lucide-react';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { AdminNotificationToast } from '@/components/admin/InformationToast';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';
import { MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

interface Filters {
    search?: string;
    category?: string;
    risk?: string;
}

interface Props extends PageProps {
    pests: PaginatedPests;
    categories: Category[];
    filters?: Filters;
}

export default function KelolaDataHama({ pests, categories, filters }: Props) {
    const [selectedPest, setSelectedPest] = useState<{ id: number; name: string } | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<'pest' | 'category'>('pest');

    const [categoryId, setCategoryId] = useState(0);
    const [search, setSearch] = useState(filters?.search || '');
    const [risiko, setRisiko] = useState(filters?.risk || "Semua Risiko");
    const [kategori, setKategori] = useState(filters?.category || "Semua Kategori");
    const [isLoading, setIsLoading] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit'>('create');
    const categoryForm = useForm({
        name: ''
    });

    const [activeTab, setActiveTab] = useState<'articles' | 'categories'>('articles');

    // Server-side search handler
    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        setIsLoading(true);

        router.get('/admin/pest', {
            search: search || undefined,
            category: kategori !== "Semua Kategori" ? kategori : undefined,
            risk: risiko !== "Semua Risiko" ? risiko : undefined,
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Handle filter change with immediate search
    const handleFilterChange = (type: 'category' | 'risk', value: string) => {
        if (type === 'category') {
            setKategori(value);
        } else {
            setRisiko(value);
        }

        setIsLoading(true);

        router.get('/admin/pest', {
            search: search || undefined,
            category: type === 'category'
                ? (value !== "Semua Kategori" ? value : undefined)
                : (kategori !== "Semua Kategori" ? kategori : undefined),
            risk: type === 'risk'
                ? (value !== "Semua Risiko" ? value : undefined)
                : (risiko !== "Semua Risiko" ? risiko : undefined),
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Handle reset filters
    const handleResetFilters = () => {
        setSearch("");
        setKategori("Semua Kategori");
        setRisiko("Semua Risiko");
        setIsLoading(true);

        router.get('/admin/pest', {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Check if any filter is active
    const hasActiveFilters = search || kategori !== "Semua Kategori" || risiko !== "Semua Risiko";

    // CATEGORY HANDLERS
    const openCreateCategoryModal = () => {
        setCategoryModalMode('create');
        categoryForm.setData({ name: '' })
        setShowCategoryModal(true);
    };

    const openEditCategoryModal = (category: Category) => {
        setCategoryModalMode('edit');
        categoryForm.setData({ name: category.name });
        setCategoryId(category.id);
        setShowCategoryModal(true);
    };

    const handleDeleteCategoryClick = (category: Category) => {
        setDeleteTarget('category');
        setSelectedPest({ id: category.id, name: category.name });
        setDeleteModal(true);
    }

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setCategoryModalMode('create');
        categoryForm.setData({ name: '' });
        setCategoryId(0);
    }

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (categoryModalMode === 'create') {
            categoryForm.post('/admin/article-category', {
                onSuccess: () => closeCategoryModal()
            });
        } else {
            categoryForm.put(`/admin/article-category/${categoryId}`, {
                onSuccess: () => closeCategoryModal()
            });
        }
    }

    const [notifications, setNotifications] = useState<any[]>([]);
    const [deleteModal, setDeleteModal] = useState(false);

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

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    const handleDeleteClick = (pest: Pest) => {
        setDeleteTarget('pest');
        setSelectedPest({ id: pest.id, name: pest.name });
        setDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedPest) {
            if (deleteTarget === 'pest') {
                router.delete(`/admin/pest/${selectedPest.id}`);
            } else {
                router.delete(`/admin/pest-category/${selectedPest.id}`);
            }
        }
        setDeleteModal(false);
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
        <div className="min-h-screen space-y-6 p-6 bg-gray-50 font-sans">
            <Head title="Kelola Hama" />

            {/* HEADER SECTION */}
            <Card className="shadow-sm mb-6 border-0">
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="flex items-center gap-2 font-bold text-2xl text-gray-900">
                                <Bug className="size-6 text-primary" />
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
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/admin/pest/create"
                                    className="flex items-center gap-2 transition-all shadow-sm bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90"
                                >
                                    <Plus className="size-5" />
                                    Tambah Data Hama
                                </Link>
                                <button
                                    onClick={openCreateCategoryModal}
                                    className="flex items-center gap-2 transition-all shadow-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary/10 bg-primary/5 text-primary border border-primary/20"
                                >
                                    <FolderOpen className="size-5" />
                                    Tambah Kategori
                                </button>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* FILTERS & SEARCH CONTROL */}
                    <div className="md:flex md:items-center md:justify-between md:gap-4 md:space-y-0 shadow-sm bg-card border rounded-lg p-4">

                        {/* SEARCH */}
                        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-2/5 mb-4 md:mb-0">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari nama atau ilmiah..."
                                    className="pl-10 bg-white"
                                />
                            </div>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                                <span className="ml-2 hidden sm:inline">Cari</span>
                            </Button>
                        </form>

                        {/* COMPONENT SELECT FILTERS */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">

                            {/* FILTER KATEGORI */}
                            <Select value={kategori} onValueChange={(v) => handleFilterChange('category', v)}>
                                <SelectTrigger className="w-full sm:w-[200px] bg-white">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Filter className="size-4" />
                                        <SelectValue placeholder="Kategori" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Semua Kategori">Semua Kategori</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* FILTER RISIKO */}
                            <Select value={risiko} onValueChange={(v) => handleFilterChange('risk', v)}>
                                <SelectTrigger className="w-full sm:w-[200px] bg-white">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <AlertTriangle className="size-4" />
                                        <SelectValue placeholder="Risiko" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Semua Risiko">Semua Risiko</SelectItem>
                                    <SelectItem value="rendah">Rendah</SelectItem>
                                    <SelectItem value="sedang">Sedang</SelectItem>
                                    <SelectItem value="tinggi">Tinggi</SelectItem>
                                </SelectContent>
                            </Select>

                            {/* Reset Button */}
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleResetFilters}
                                    disabled={isLoading}
                                    className="shrink-0"
                                    title="Reset semua filter"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* NAVIGATION TABS */}
            <div className="flex overflow-x-auto gap-2 rounded-lg shadow-sm border border-gray-100 p-2 bg-white">
                <button
                    onClick={() => setActiveTab('articles')}
                    className={`flex flex-1 items-center justify-center transition-all gap-2 px-6 py-3 rounded-lg font-medium ${activeTab === 'articles'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <FolderOpen className="size-5" />
                    Data Hama
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`flex flex-1 items-center justify-center gap-2 transition-all px-6 py-3 rounded-lg font-medium ${activeTab === 'categories'
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <Tag className="size-5" />
                    Kategori
                </button>
            </div>

            {/* PEST TABLE */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-0">
                    {activeTab === 'articles' ? (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/80">
                                    <TableHead className="w-16">No</TableHead>
                                    <TableHead className="w-20">Gambar</TableHead>
                                    <TableHead>Nama Hama</TableHead>
                                    <TableHead>Nama Ilmiah</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Risiko</TableHead>
                                    <TableHead className="w-48">Tanaman Inang</TableHead>
                                    <TableHead className="w-64">Tindakan Penanganan</TableHead>
                                    <TableHead className="w-10 text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pests.data.length > 0 ? (
                                    pests.data.map((pest: Pest, index: number) => (
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
                                                <span className="text-gray-600">{pest.category || '-'}</span>
                                            </TableCell>
                                            <TableCell>
                                                {getRiskBadge(pest.risk_level)}
                                            </TableCell>
                                            <TableCell>
                                                {pest.plant && pest.plant.length > 0 ? (
                                                    <div className="flex flex-wrap gap-1">
                                                        {pest.plant.join(', ')}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {pest.penanganan && pest.penanganan.length > 0 ? (
                                                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                                        {pest.penanganan.slice(0, 3).map((item: string, i: number) => (
                                                            <li key={i} className="line-clamp-1">{item}</li>
                                                        ))}
                                                        {pest.penanganan.length > 3 && (
                                                            <li className="text-xs text-gray-400 italic">+{pest.penanganan.length - 3} lainnya</li>
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                                            <span className="sr-only">Open menu</span>
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => router.get(`/admin/pest/${pest.id}`)}>
                                                            <Edit2 className="mr-2 h-4 w-4" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            onClick={() => handleDeleteClick(pest)}
                                                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Hapus
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={9} className="h-32 text-center">
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
                    ) : (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">No</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-full">Nama Kategori</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {categories.map((category, index) => (
                                    <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => openEditCategoryModal(category)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategoryClick(category)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {categories.length === 0 && (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                                            Belum ada kategori. Klik "Tambah Kategori" untuk membuat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </CardContent>
            </Card>

            <DeleteConfirmationModal isOpen={deleteModal} onClose={() => {
                setDeleteModal(false)
                setSelectedPest(null);
            }} onConfirm={handleConfirmDelete} itemName={selectedPest?.name || ''} />

            <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {categoryModalMode === 'create' ? 'Tambah Kategori' : 'Edit Kategori'}
                        </DialogTitle>
                        <DialogDescription>
                            {categoryModalMode === 'create'
                                ? 'Tambahkan kategori baru untuk hama dan artikel.'
                                : 'Perbarui nama kategori.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div className="grid w-full gap-2">
                            <Label htmlFor="category_name">Nama Kategori</Label>
                            <Input
                                id="category_name"
                                value={categoryForm.data.name}
                                onChange={e => categoryForm.setData('name', e.target.value)}
                                placeholder="Contoh: Serangga"
                                required
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeCategoryModal}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={categoryForm.processing}>
                                {categoryForm.processing ? 'Menyimpan...' : 'Simpan'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AdminNotificationToast notifications={notifications} removeNotification={removeNotification} />
        </div>
    );
}

KelolaDataHama.layout = (page: React.ReactElement) => (
    <AdminLayout>
        {page}
    </AdminLayout>
)
