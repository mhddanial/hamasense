import { PageProps } from '@inertiajs/core';
import { Article, Category } from "@/types/admin";
import { type BreadcrumbItem } from '@/types';
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/layout";
import { Head, Link, router, usePage, useForm } from "@inertiajs/react";
import {
    SquarePen,
    Trash2,
    FolderOpen,
    Plus,
    Tag,
    Edit2,
    FileText,
    ImageIcon,
    Calendar,
    Search,
    Loader2,
    RefreshCw,
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
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmModal";
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Kelola Artikel', href: '/admin/article' },
];

// Pagination Link Type
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Paginated Response Type
interface PaginatedArticles {
    data: Article[];
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
    articles: PaginatedArticles;
    categories: Category[];
    filters?: Filters;
}


const KelolaArtikel = ({ articles, categories, filters }: Props) => {
    const [deleteModal, setDeleteModal] = useState(false);

    // Tab State
    const [activeTab, setActiveTab] = useState<'articles' | 'categories'>('articles');

    // Article Operation State
    const [selectedItem, setSelectedItem] = useState<{ id: number; name: string } | null>(null);

    // Search State
    const [search, setSearch] = useState(filters?.keyword || '');
    const [sortBy, setSortBy] = useState(filters?.sort || 'latest');
    const [isLoading, setIsLoading] = useState(false);

    // Category Operation State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit'>('create');
    const [categoryId, setCategoryId] = useState(0);
    const categoryForm = useForm({
        name: ''
    });

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

    // Category Handlers
    const openCreateCategoryModal = () => {
        setCategoryModalMode('create');
        categoryForm.setData({ name: '' });
        setShowCategoryModal(true);
    };

    const openEditCategoryModal = (category: Category) => {
        setCategoryModalMode('edit');
        categoryForm.setData({ name: category.name });
        setCategoryId(category.id);
        setShowCategoryModal(true);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setCategoryModalMode('create');
        categoryForm.setData({ name: '' });
        setCategoryId(0);
    };

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (categoryModalMode === 'create') {
            categoryForm.post('/admin/article-category', {
                onSuccess: () => closeCategoryModal()
            });
        } else {
            categoryForm.patch(`/admin/article-category/${categoryId}`, {
                onSuccess: () => closeCategoryModal()
            });
        }
    };

    // Unified Delete Handler
    const [deleteType, setDeleteType] = useState<'article' | 'category'>('article');

    const handleDeleteClick = (type: 'article' | 'category', id: number, name: string) => {
        setDeleteType(type);
        setSelectedItem({ id, name });
        setDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedItem) {
            if (deleteType === 'article') {
                router.delete(`/admin/article/${selectedItem.id}`);
            } else {
                router.delete(`/admin/article-category/${selectedItem.id}`);
            }
        }
        setDeleteModal(false);
        setSelectedItem(null);
    };

    // Search Handler
    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        setIsLoading(true);

        router.get('/admin/article', {
            keyword: search || undefined,
            sort: sortBy,
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Sort Handler
    const handleSortChange = (value: string) => {
        setSortBy(value);
        setIsLoading(true);
        router.get('/admin/article', {
            keyword: search || undefined,
            sort: value,
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Reset Filters Handler
    const handleResetFilters = () => {
        setSearch('');
        setSortBy('latest');
        setIsLoading(true);

        router.get('/admin/article', {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const hasActiveFilters = search !== '' || sortBy !== 'latest';

    const articlesData = articles?.data || [];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen space-y-6 p-6 bg-gray-50 font-sans">
                <Head title="Kelola Artikel" />

                {/* Header Section */}
                <Card className="shadow-sm border-0">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 font-bold text-2xl text-gray-900">
                                    <FileText className="size-6 text-primary" />
                                    Kelola Artikel
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Kelola artikel dan kategori konten dalam satu tempat
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-sm">
                                    Total: {articles.total} artikel
                                </Badge>
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/admin/article/create"
                                        className="flex items-center gap-2 transition-all shadow-sm bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90"
                                    >
                                        <Plus className="size-5" />
                                        Tambah Artikel
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
                        {/* Search and Sort */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-2/5">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari judul artikel..."
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
                            {hasActiveFilters && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleResetFilters}
                                    disabled={isLoading}
                                    title="Reset filter"
                                >
                                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                                </Button>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation Tabs */}
                <div className="flex overflow-x-auto gap-2 rounded-lg shadow-sm border border-gray-100 p-2 bg-white">
                    <button
                        onClick={() => setActiveTab('articles')}
                        className={`flex flex-1 items-center justify-center transition-all gap-2 px-6 py-3 rounded-lg font-medium ${activeTab === 'articles'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <FolderOpen className="size-5" />
                        Artikel
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

                {/* Content Table */}
                <Card className="border-0 shadow-sm px-4">
                    <CardContent className="p-0">
                        {activeTab === 'articles' ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/80">
                                        <TableHead className="w-16">No</TableHead>
                                        <TableHead className="w-20">Gambar</TableHead>
                                        <TableHead>Judul</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead>Deskripsi</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead className="text-right w-28">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {articlesData.length > 0 ? (
                                        articlesData.map((article, index) => (
                                            <TableRow key={article.id} className="hover:bg-gray-50/50 hover:cursor-pointer">
                                                <TableCell className="font-medium text-gray-500">
                                                    {(articles.current_page - 1) * articles.per_page + index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                        {article.image ? (
                                                            <img
                                                                src={typeof article.image === 'string' ? article.image : ''}
                                                                alt={article.title}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                                                                }}
                                                            />
                                                        ) : null}
                                                        <ImageIcon className={`w-5 h-5 text-gray-400 ${article.image ? 'hidden' : ''}`} />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-medium text-gray-900">{article.title}</p>
                                                </TableCell>
                                                <TableCell>
                                                    {article.category ? (
                                                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">
                                                            {article.category.name}
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 border-0">
                                                            Tanpa Kategori
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="text-gray-600 text-sm line-clamp-2 max-w-xs">
                                                        {article.content}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(article.created_at).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric'
                                                        })}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={`/admin/article/${article.id}`}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                                                                <SquarePen className="text-gray-500 h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteClick('article', article.id, article.title)}
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
                                                    <FileText className="w-10 h-10 mb-2 opacity-30" />
                                                    <p className="font-medium">Tidak ada artikel ditemukan</p>
                                                    <p className="text-sm">Klik "Tambah Artikel" untuk membuat</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/80">
                                        <TableHead className="w-16">No</TableHead>
                                        <TableHead>Nama Kategori</TableHead>
                                        <TableHead className="text-right w-28">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.length > 0 ? (
                                        categories.map((category, index) => (
                                            <TableRow key={category.id} className="hover:bg-gray-50/50">
                                                <TableCell className="font-medium text-gray-500">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-medium text-gray-900">{category.name}</p>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-blue-50"
                                                            onClick={() => openEditCategoryModal(category)}
                                                        >
                                                            <Edit2 className="text-gray-500 h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteClick('category', category.id, category.name)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="h-32 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <Tag className="w-10 h-10 mb-2 opacity-30" />
                                                    <p className="font-medium">Tidak ada kategori</p>
                                                    <p className="text-sm">Klik "Tambah Kategori" untuk membuat</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}

                        {/* Pagination - Only for Articles */}
                        {activeTab === 'articles' && articles.last_page > 1 && (
                            <div className="px-6 py-4 border-t bg-gray-50/30">
                                <div className="flex justify-center gap-1">
                                    {articles.links.map((link, i: number) => (
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

                {/* Delete Confirmation Modal */}
                <DeleteConfirmationModal
                    isOpen={deleteModal}
                    onClose={() => {
                        setDeleteModal(false);
                        setSelectedItem(null);
                    }}
                    onConfirm={handleConfirmDelete}
                    itemName={selectedItem?.name || ''}
                />

                {/* Category Modal */}
                <Dialog open={showCategoryModal} onOpenChange={setShowCategoryModal}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {categoryModalMode === 'create' ? 'Tambah Kategori' : 'Edit Kategori'}
                            </DialogTitle>
                            <DialogDescription>
                                {categoryModalMode === 'create'
                                    ? 'Tambahkan kategori baru untuk artikel.'
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
                                    placeholder="Contoh: Pertanian"
                                    required
                                />
                                {categoryForm.errors.name && (
                                    <p className="text-red-500 text-sm">{categoryForm.errors.name}</p>
                                )}
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
            </div>
        </AdminLayout>
    );
};


export default KelolaArtikel;
