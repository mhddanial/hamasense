import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { type BreadcrumbItem } from '@/types';
import { route } from 'ziggy-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { toast } from 'sonner';
import {
    ArrowLeft,
    Flag,
    Eye,
    CheckCircle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
} from 'lucide-react';

interface Reporter {
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
    created_by: number;
    owned_by?: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
}

interface Report {
    id: number;
    post_id: number;
    user_id: number;
    reason: string;
    description?: string;
    status: 'pending' | 'reviewed' | 'dismissed';
    reviewed_by?: number;
    reviewed_at?: string;
    created_at: string;
    post: Post;
    reporter: Reporter;
    reviewer?: {
        id: number;
        name: string;
    };
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedReports {
    data: Report[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
}

interface Filters {
    status?: string;
}

interface Props {
    reports: PaginatedReports;
    filters: Filters;
}

export default function CommunityReports({ reports, filters }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Kelola Komunitas', href: '/admin/community' },
        { title: 'Laporan', href: '#' },
    ];

    const handleStatusChange = (status: string) => {
        router.get(route('admin.community.reports'), { status }, { preserveState: true });
    };

    const handleReview = (reportId: number, status: 'reviewed' | 'dismissed') => {
        router.patch(route('admin.community.reports.review', reportId), { status }, {
            onSuccess: () => {
                toast.success(status === 'reviewed' ? 'Laporan ditandai sebagai ditinjau' : 'Laporan dibatalkan');
            },
            onError: () => {
                toast.error('Gagal memperbarui status laporan');
            },
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getReasonLabel = (reason: string) => {
        const labels: Record<string, string> = {
            spam: 'Spam',
            inappropriate: 'Konten Tidak Pantas',
            harassment: 'Pelecehan',
            misinformation: 'Misinformasi',
            other: 'Lainnya',
        };
        return labels[reason] || reason;
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending':
                return <Badge variant="destructive">Menunggu</Badge>;
            case 'reviewed':
                return <Badge variant="default" className="bg-green-500">Ditinjau</Badge>;
            case 'dismissed':
                return <Badge variant="secondary">Dibatalkan</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const truncateContent = (content: string, maxLength: number = 60) => {
        if (content.length <= maxLength) return content;
        return content.slice(0, maxLength) + '...';
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Laporan Komunitas" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('admin.community.index')}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Kembali
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Laporan Komunitas</h1>
                            <p className="text-gray-500 dark:text-gray-400 mt-1">
                                Tinjau laporan dari pengguna
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filter */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">Filter Status:</span>
                            <Select
                                value={filters.status || 'pending'}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua</SelectItem>
                                    <SelectItem value="pending">Menunggu</SelectItem>
                                    <SelectItem value="reviewed">Ditinjau</SelectItem>
                                    <SelectItem value="dismissed">Dibatalkan</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Results Count */}
                <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        {reports.total} laporan ditemukan
                    </p>
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Postingan</TableHead>
                                    <TableHead>Pelapor</TableHead>
                                    <TableHead>Alasan</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {reports.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <Flag className="w-12 h-12 mx-auto text-muted-foreground/50 mb-2" />
                                            <p className="text-muted-foreground">Tidak ada laporan ditemukan</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    reports.data.map((report) => (
                                        <TableRow key={report.id}>
                                            <TableCell>
                                                <div className="max-w-xs">
                                                    <p className="font-medium text-sm line-clamp-2">
                                                        {truncateContent(report.post?.content || 'Postingan dihapus')}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        oleh {report.post?.owned_by?.name || 'Unknown'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Avatar className="w-8 h-8">
                                                        <AvatarImage src={report.reporter?.avatar} />
                                                        <AvatarFallback>
                                                            {report.reporter?.name?.charAt(0).toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">{report.reporter?.name}</p>
                                                        <p className="text-xs text-muted-foreground">{report.reporter?.email}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <Badge variant="outline" className="mb-1">
                                                        {getReasonLabel(report.reason)}
                                                    </Badge>
                                                    {report.description && (
                                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                                            {report.description}
                                                        </p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(report.status)}
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {formatDate(report.created_at)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    {report.post && (
                                                        <Link href={route('admin.community.show', report.post_id)}>
                                                            <Button size="sm" variant="ghost">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {report.status === 'pending' && (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-green-600 hover:text-green-600"
                                                                onClick={() => handleReview(report.id, 'reviewed')}
                                                                title="Tandai Ditinjau"
                                                            >
                                                                <CheckCircle className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                className="text-muted-foreground"
                                                                onClick={() => handleReview(report.id, 'dismissed')}
                                                                title="Batalkan Laporan"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {reports.last_page > 1 && (
                    <div className="flex items-center justify-center gap-2">
                        {reports.links.map((link, index) => {
                            if (link.label.includes('Previous')) {
                                return (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                );
                            }
                            if (link.label.includes('Next')) {
                                return (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        size="sm"
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                );
                            }
                            return (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => link.url && router.get(link.url)}
                                >
                                    {link.label}
                                </Button>
                            );
                        })}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
