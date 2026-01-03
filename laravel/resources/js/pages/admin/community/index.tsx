import React, { useState, useEffect } from 'react';
import { Head, router, Link, usePage, useForm } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/components/admin/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
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
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Kelola Komunitas', href: '/admin/community' },
];
import {
    Search,
    MessageSquare,
    Heart,
    Eye,
    Trash2,
    AlertTriangle,
    Flag,
    Calendar,
    ArrowUpDown,
    RefreshCw,
    Loader2,
    Tag,
    Edit2,
    FolderOpen,
} from 'lucide-react';
import { BreadcrumbItem } from '@/types';

interface Author {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    category: string;
    image?: string;
    created_at: string;
    owned_by: Author;
    likes_count: number;
    all_comments_count: number;
    reports_count: number;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedPosts {
    data: Post[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    keyword?: string;
    category?: string;
    sort?: string;
}

interface Category {
    id?: number;
    slug: string;
    name: string;
}

interface Props {
    posts: PaginatedPosts;
    categories: Category[];
    filters: Filters;
}

const KelolaCommunity = ({ posts, categories, filters }: Props) => {
    // Tab State
    const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');

    // Search and Filter State
    const [search, setSearch] = useState(filters.keyword || '');
    const [sortBy, setSortBy] = useState(filters.sort || 'latest');
    const [isLoading, setIsLoading] = useState(false);

    // Delete Modal State
    const [deleteModal, setDeleteModal] = useState(false);
    const [deleteType, setDeleteType] = useState<'post' | 'category'>('post');
    const [selectedItem, setSelectedItem] = useState<{ id: number; name: string } | null>(null);

    // Category Modal State
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [categoryModalMode, setCategoryModalMode] = useState<'create' | 'edit'>('create');
    const [categoryId, setCategoryId] = useState(0);
    const categoryForm = useForm({
        name: ''
    });

    const { flash } = usePage().props;
    const success = (flash as any)?.success;
    const error = (flash as any)?.error;

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
        setCategoryId(category.id || 0);
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
            categoryForm.post('/admin/community-category', {
                onSuccess: () => closeCategoryModal()
            });
        } else {
            categoryForm.patch(`/admin/community-category/${categoryId}`, {
                onSuccess: () => closeCategoryModal()
            });
        }
    };

    // Unified Delete Handler
    const handleDeleteClick = (type: 'post' | 'category', id: number, name: string) => {
        setDeleteType(type);
        setSelectedItem({ id, name });
        setDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (selectedItem) {
            if (deleteType === 'post') {
                router.delete(route('admin.community.destroy', selectedItem.id));
            } else {
                router.delete(`/admin/community-category/${selectedItem.id}`);
            }
        }
        setDeleteModal(false);
        setSelectedItem(null);
    };

    // Search Handler
    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        setIsLoading(true);

        router.get(route('admin.community.index'), {
            keyword: search || undefined,
            category: filters.category,
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
        router.get(route('admin.community.index'), {
            keyword: search || undefined,
            category: filters.category,
            sort: value,
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    // Category Filter Handler
    const handleCategoryChange = (value: string) => {
        setIsLoading(true);
        router.get(route('admin.community.index'), {
            keyword: search || undefined,
            category: value === 'all' ? undefined : value,
            sort: sortBy,
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

        router.get(route('admin.community.index'), {}, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setIsLoading(false),
        });
    };

    const truncateContent = (content: string, maxLength: number = 80) => {
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + '...';
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    // Get category display name
    const getCategoryLabel = (slug: string) => {
        const cat = categories.find(c => c.slug === slug);
        return cat?.name || slug;
    };

    const hasActiveFilters = search !== '' || (filters.category && filters.category !== 'all') || sortBy !== 'latest';
    const postsData = posts?.data || [];

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <div className="min-h-screen space-y-6 p-6 bg-gray-50 font-sans">
                <Head title="Kelola Komunitas" />

                {/* Header Section */}
                <Card className="shadow-sm border-0">
                    <CardHeader className="pb-3">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <CardTitle className="flex items-center gap-2 font-bold text-2xl text-gray-900">
                                    <MessageSquare className="size-6 text-primary" />
                                    Kelola Komunitas
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    Kelola postingan dan kategori komunitas
                                </CardDescription>
                            </div>
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-sm">
                                    Total: {posts.total} postingan
                                </Badge>
                                <button
                                    onClick={openCreateCategoryModal}
                                    className="flex items-center gap-2 transition-all shadow-sm font-medium px-5 py-2.5 rounded-lg hover:bg-primary/10 bg-primary/5 text-primary border border-primary/20"
                                >
                                    <Tag className="size-5" />
                                    Tambah Kategori
                                </button>
                                <Link
                                    href={route('admin.community.reports')}
                                    className="flex items-center gap-2 transition-all shadow-sm bg-primary text-white px-5 py-2.5 rounded-lg font-medium hover:bg-primary/90"
                                >
                                    <Flag className="size-5" />
                                    Lihat Laporan
                                </Link>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Search, Filter and Sort */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-2/5">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari postingan..."
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

                            <Select value={filters.category || 'all'} onValueChange={handleCategoryChange}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue placeholder="Kategori" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.slug} value={cat.slug}>{cat.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={sortBy} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <ArrowUpDown className="w-4 h-4 mr-2" />
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">Terbaru</SelectItem>
                                    <SelectItem value="oldest">Terlama</SelectItem>
                                    <SelectItem value="most_liked">Like Terbanyak</SelectItem>
                                    <SelectItem value="most_commented">Komentar Terbanyak</SelectItem>
                                    <SelectItem value="most_reported">Laporan Terbanyak</SelectItem>
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
                        onClick={() => setActiveTab('posts')}
                        className={`flex flex-1 items-center justify-center transition-all gap-2 px-6 py-3 rounded-lg font-medium ${activeTab === 'posts'
                            ? 'bg-primary text-white shadow-sm'
                            : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        <FolderOpen className="size-5" />
                        Postingan
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
                        {activeTab === 'posts' ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/80">
                                        <TableHead className="w-16">No</TableHead>
                                        <TableHead className="w-[35%]">Konten</TableHead>
                                        <TableHead>Penulis</TableHead>
                                        <TableHead>Kategori</TableHead>
                                        <TableHead className="text-center">Engagement</TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead className="text-right w-28">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {postsData.length > 0 ? (
                                        postsData.map((post, index) => (
                                            <TableRow key={post.id} className="hover:bg-gray-50/50 hover:cursor-pointer">
                                                <TableCell className="font-medium text-gray-500">
                                                    {(posts.current_page - 1) * posts.per_page + index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-medium text-gray-900 line-clamp-2">
                                                        {truncateContent(post.content)}
                                                    </p>
                                                    {post.reports_count > 0 && (
                                                        <Badge variant="destructive" className="mt-1 gap-1">
                                                            <AlertTriangle className="w-3 h-3" />
                                                            {post.reports_count} Laporan
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarImage src={post.owned_by?.avatar} />
                                                            <AvatarFallback>
                                                                {post.owned_by?.name?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="text-sm font-medium">{post.owned_by?.name}</p>
                                                            <p className="text-xs text-muted-foreground">{post.owned_by?.email}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-0">
                                                        {getCategoryLabel(post.category)}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="w-4 h-4" />
                                                            {post.likes_count}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MessageSquare className="w-4 h-4" />
                                                            {post.all_comments_count}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="flex items-center gap-1 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(post.created_at)}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Link href={route('admin.community.show', post.id)}>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
                                                                <Eye className="text-gray-500 h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteClick('post', post.id, truncateContent(post.content, 30))}
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
                                                    <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
                                                    <p className="font-medium">Tidak ada postingan ditemukan</p>
                                                    <p className="text-sm">Postingan komunitas akan muncul di sini</p>
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
                                        <TableHead>Slug</TableHead>
                                        <TableHead>Nama Kategori</TableHead>
                                        <TableHead className="text-right w-28">Aksi</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {categories.length > 0 ? (
                                        categories.map((category, index) => (
                                            <TableRow key={category.slug} className="hover:bg-gray-50/50">
                                                <TableCell className="font-medium text-gray-500">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    <code className="px-2 py-1 bg-gray-100 rounded text-sm">{category.slug}</code>
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
                                                            onClick={() => handleDeleteClick('category', category.id || 0, category.name)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-32 text-center">
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

                        {/* Pagination - Only for Posts */}
                        {activeTab === 'posts' && posts.last_page > 1 && (
                            <div className="px-6 py-4 border-t bg-gray-50/30">
                                <div className="flex justify-center gap-1">
                                    {posts.links.map((link, i: number) => (
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
                    itemType={deleteType === 'post' ? 'postingan' : 'kategori'}
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
                                    ? 'Tambahkan kategori baru untuk komunitas.'
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
                                    placeholder="Contoh: Tips & Trik"
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

export default KelolaCommunity;
