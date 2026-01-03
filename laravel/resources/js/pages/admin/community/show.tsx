import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import { route } from 'ziggy-js';
import AdminLayout from '@/components/admin/layout';
import { type BreadcrumbItem } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
    ArrowLeft,
    Heart,
    MessageSquare,
    Calendar,
    Trash2,
    AlertTriangle,
    User,
    Mail,
} from 'lucide-react';

interface Author {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

interface Comment {
    id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    replies?: Comment[];
}

interface Report {
    id: number;
    reason: string;
    description?: string;
    status: string;
    created_at: string;
    reporter: {
        id: number;
        name: string;
        email: string;
    };
}

interface Post {
    id: number;
    title: string;
    content: string;
    category: string;
    image?: string;
    image_url?: string;
    created_at: string;
    owned_by: Author;
    likes_count: number;
    all_comments_count: number;
    reports_count: number;
    all_comments: Comment[];
    reports: Report[];
}

interface Props {
    post: Post;
}

export default function CommunityAdminShow({ post }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Admin', href: '/admin' },
        { title: 'Kelola Komunitas', href: '/admin/community' },
        { title: 'Detail Post', href: '#' },
    ];

    const handleDeletePost = () => {
        setIsDeleting(true);
        router.delete(route('admin.community.destroy', post.id), {
            onSuccess: () => {
                toast.success('Postingan berhasil dihapus');
            },
            onError: () => {
                toast.error('Gagal menghapus postingan');
                setIsDeleting(false);
            },
        });
    };

    const handleDeleteComment = (commentId: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus komentar ini?')) {
            router.delete(route('admin.community.comment.destroy', commentId), {
                onSuccess: () => {
                    toast.success('Komentar berhasil dihapus');
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
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

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Postingan" />

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
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Postingan</h1>
                        </div>
                    </div>

                    {/* Delete Button with Dialog */}
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" disabled={isDeleting}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Hapus Postingan
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Konfirmasi Hapus Postingan</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus postingan ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua komentar serta laporan terkait.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeletePost}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white hover:cursor-pointer"
                                >
                                    Ya, Hapus
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Post Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-12 h-12">
                                            <AvatarImage src={post.owned_by?.avatar} />
                                            <AvatarFallback>
                                                {post.owned_by?.name?.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold">{post.owned_by?.name}</p>
                                            <p className="text-sm text-muted-foreground">{post.owned_by?.email}</p>
                                        </div>
                                    </div>
                                    <Badge variant="outline">{post.category}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-foreground whitespace-pre-wrap">{post.content}</p>

                                {(post.image_url || post.image) && (
                                    <div className="rounded-lg overflow-hidden border">
                                        <img
                                            src={post.image_url || `/storage/${post.image}`}
                                            alt="Post image"
                                            className="w-full max-h-96 object-cover"
                                        />
                                    </div>
                                )}

                                <Separator />

                                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-2">
                                        <Heart className="w-4 h-4" />
                                        {post.likes_count} likes
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4" />
                                        {post.all_comments_count} komentar
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        {formatDate(post.created_at)}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Comments Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Komentar ({post.all_comments?.length || 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {post.all_comments?.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">
                                        Belum ada komentar
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {post.all_comments?.map((comment) => (
                                            <div key={comment.id} className="p-4 rounded-lg bg-muted/50">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="w-8 h-8">
                                                            <AvatarImage src={comment.user?.avatar} />
                                                            <AvatarFallback>
                                                                {comment.user?.name?.charAt(0).toUpperCase()}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-medium text-sm">{comment.user?.name}</p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {formatDate(comment.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="text-destructive hover:text-destructive"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                                <p className="mt-2 text-sm">{comment.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Reports Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                                    Laporan ({post.reports?.length || 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {post.reports?.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-4">
                                        Tidak ada laporan
                                    </p>
                                ) : (
                                    <div className="space-y-4">
                                        {post.reports?.map((report) => (
                                            <div key={report.id} className="p-3 rounded-lg border">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Badge variant={report.status === 'pending' ? 'destructive' : 'secondary'}>
                                                        {getReasonLabel(report.reason)}
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        {report.status}
                                                    </Badge>
                                                </div>
                                                {report.description && (
                                                    <p className="text-sm text-muted-foreground mb-2">
                                                        {report.description}
                                                    </p>
                                                )}
                                                <div className="space-y-1 text-xs text-muted-foreground">
                                                    <div className="flex items-center gap-2">
                                                        <User className="w-3 h-3" />
                                                        <span>{report.reporter?.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Mail className="w-3 h-3" />
                                                        <span>{report.reporter?.email}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
