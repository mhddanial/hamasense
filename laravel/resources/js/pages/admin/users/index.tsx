import React, { useEffect, useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { PageProps } from '@inertiajs/core';
import {
    Users,
    Search,
    Trash2,
    Shield,
    User as UserIcon,
    MoreHorizontal,
    AlertTriangle,
    Mail,
    Calendar,
    ArrowUpDown,
    RefreshCw
} from 'lucide-react';

// Shadcn UI Components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

// Types
interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'customer';
    avatar: string | null;
    avatar_url: string;
    google_id: string | null;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: User[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Filters {
    keyword?: string;
    sort?: string;
    role?: string;
}

interface Props extends PageProps {
    users: PaginatedUsers;
    filters?: Filters;
}

export default function KelolaUsers({ users, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters?.keyword || '');
    const [sortBy, setSortBy] = useState(filters?.sort || 'latest');
    const [roleFilter, setRoleFilter] = useState(filters?.role || 'all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        router.get('/admin/users', {
            keyword: searchTerm || undefined,
            sort: sortBy,
            role: roleFilter !== 'all' ? roleFilter : undefined
        }, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const handleSortChange = (value: string) => {
        setSortBy(value);
        setIsLoading(true);
        router.get('/admin/users', {
            keyword: searchTerm || undefined,
            sort: value,
            role: roleFilter !== 'all' ? roleFilter : undefined
        }, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const handleRoleFilterChange = (value: string) => {
        setRoleFilter(value);
        setIsLoading(true);
        router.get('/admin/users', {
            keyword: searchTerm || undefined,
            sort: sortBy,
            role: value !== 'all' ? value : undefined
        }, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const handleResetFilters = () => {
        setSearchTerm('');
        setSortBy('latest');
        setRoleFilter('all');
        setIsLoading(true);
        router.get('/admin/users', {}, {
            preserveState: true,
            onFinish: () => setIsLoading(false)
        });
    };

    const hasActiveFilters = searchTerm !== '' || sortBy !== 'latest' || roleFilter !== 'all';

    const handleDeleteClick = (user: User) => {
        setSelectedUser(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedUser) {
            router.delete(`/admin/users/${selectedUser.id}`);
        }
        setDeleteDialogOpen(false);
        setSelectedUser(null);
    };

    const handleRoleChange = (user: User, newRole: 'admin' | 'customer') => {
        router.patch(`/admin/users/${user.id}/role`, { role: newRole });
    };

    const getRoleBadge = (role: string) => {
        if (role === 'admin') {
            return (
                <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-0">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin
                </Badge>
            );
        }
        return (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-0">
                <UserIcon className="w-3 h-3 mr-1" />
                Customer
            </Badge>
        );
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const usersData = users?.data || [];

    return (
        <div className="flex-1 min-h-screen p-6 bg-gray-50/50">
            <Head title="Kelola Pengguna" />

            {/* Header */}
            <Card className="mb-6 border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <Users className="w-6 h-6 text-primary" />
                                Kelola Pengguna
                            </CardTitle>
                            <CardDescription className="mt-1">
                                Kelola semua pengguna yang terdaftar dalam sistem
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-sm">
                                Total: {users.total} pengguna
                            </Badge>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <form onSubmit={handleSearch} className="flex gap-2 w-full md:max-w-md">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Cari berdasarkan nama atau email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Button type="submit" variant="default" disabled={isLoading}>
                                Cari
                            </Button>
                        </form>
                        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
                            <SelectTrigger className="w-full sm:w-[160px]">
                                <Shield className="w-4 h-4 mr-2" />
                                <SelectValue placeholder="Role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Role</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="customer">Customer</SelectItem>
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

            {/* Users Table */}
            <Card className="border-0 shadow-sm px-4">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/80">
                                <TableHead className="w-16">No</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Bergabung</TableHead>
                                <TableHead className="text-right w-20">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {usersData.length > 0 ? (
                                usersData.map((user, index) => (
                                    <TableRow key={user.id} className="hover:bg-gray-50/50">
                                        <TableCell className="font-medium text-gray-500">
                                            {(users.current_page - 1) * users.per_page + index + 1}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                                    <AvatarImage src={user.avatar_url} alt={user.name} />
                                                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                                                        {getInitials(user.name)}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.name}</p>
                                                    {user.google_id && (
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <img src="https://www.google.com/favicon.ico" alt="" className="w-3 h-3" />
                                                            Google Account
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="flex items-center gap-2 text-gray-600">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                {user.email}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {getRoleBadge(user.role)}
                                        </TableCell>
                                        <TableCell>
                                            {user.email_verified_at ? (
                                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-0">
                                                    Terverifikasi
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 border-0">
                                                    Belum Verifikasi
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <span className="flex items-center gap-2 text-gray-600 text-sm">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(user.created_at).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48">
                                                    <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleRoleChange(user, user.role === 'admin' ? 'customer' : 'admin')}
                                                        className="cursor-pointer"
                                                    >
                                                        <Shield className="w-4 h-4 mr-2" />
                                                        {user.role === 'admin' ? 'Jadikan Customer' : 'Jadikan Admin'}
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDeleteClick(user)}
                                                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                        Hapus Pengguna
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <Users className="w-10 h-10 mb-2 opacity-30" />
                                            <p className="font-medium">Tidak ada pengguna ditemukan</p>
                                            <p className="text-sm">Coba ubah kata kunci pencarian</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    {users.last_page > 1 && (
                        <div className="px-6 py-4 border-t bg-gray-50/30">
                            <div className="flex justify-center gap-1">
                                {users.links.map((link, i) => (
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
                            Apakah Anda yakin ingin menghapus pengguna <strong>{selectedUser?.name}</strong>?
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

KelolaUsers.layout = (page: React.ReactElement) => (
    <AdminLayout>
        {page}
    </AdminLayout>
);
