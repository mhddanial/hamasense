import { PageProps } from '@inertiajs/core';
import { Article, Category } from "@/types/admin";
import React, { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/layout";
import { Link, router, usePage, useForm } from "@inertiajs/react";
import {
    SquarePen,
    Trash2,
    FolderOpen,
    Plus,
    Tag,
    Edit2,
    X
} from 'lucide-react';
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmModal";
import { AdminNotificationToast } from "@/components/admin/InformationToast";

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

interface Props extends PageProps {
    articles: PaginatedArticles;
    categories: Category[];
}


const KelolaArtikel = ({ articles, categories }: Props) => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    // Tab State
    const [activeTab, setActiveTab] = useState<'articles' | 'categories'>('articles');

    // Article Operation State
    const [selectedItem, setSelectedItem] = useState({
        'id': 0,
        'name': ''
    });

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
            setNotifications((prev) => [...prev, { type: 'success', message: success }])
        }
        if (error) {
            setNotifications((prev) => [...prev, { type: 'error', message: error }])
        }
    }, [success, error]);

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

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

    const handleCategorySubmit = () => {
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
        if (deleteType === 'article') {
            router.delete(`/admin/article/${selectedItem.id}`);
        } else {
            router.delete(`/admin/article-category/${selectedItem.id}`);

        }
        setDeleteModal(false);
    }

    return (
        <div className="p-6 space-y-6 bg-gray-50 min-h-screen font-sans">
            {/* Header Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-blue-600">Manajemen Artikel</h1>
                    <p className="text-gray-500 mt-1">Kelola artikel dan kategori konten dalam satu tempat</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/article/create"
                        className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-medium"
                    >
                        <Plus className="w-5 h-5" />
                        Tambah Artikel
                    </Link>
                    <button
                        onClick={openCreateCategoryModal}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200 font-medium"
                    >
                        <FolderOpen className="w-5 h-5" />
                        Tambah Kategori
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2 flex overflow-x-auto gap-2">
                <button
                    onClick={() => setActiveTab('articles')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'articles'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <FolderOpen className="w-5 h-5" />
                    Artikel
                </button>
                <button
                    onClick={() => setActiveTab('categories')}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === 'categories'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50'
                        }`}
                >
                    <Tag className="w-5 h-5" />
                    Kategori
                </button>
            </div>

            {/* Content Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {activeTab === 'articles' ? (
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Gambar</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Judul</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Kategori</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Deskripsi</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {articles.data && articles.data.length > 0 ? (
                                    articles.data.map((article) => (
                                        <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="h-16 w-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
                                                    {article.image ? (
                                                        <img
                                                            src={typeof article.image === 'string' ? article.image : ''}
                                                            alt={article.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <FolderOpen className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-bold text-gray-900">{article.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {article.category ? (
                                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
                                                        {article.category.name}
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                                                        Tanpa Kategori
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm text-gray-600 line-clamp-2 max-w-xs">{article.content}</p>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-sm text-gray-600">
                                                    {new Date(article.created_at).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/article/${article.id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                        title="Edit"
                                                    >
                                                        <SquarePen size={18} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDeleteClick('article', article.id, article.title)}
                                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            Belum ada artikel. Klik "Tambah Artikel" untuk membuat.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
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
                                                    onClick={() => handleDeleteClick('category', category.id, category.name)}
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
                </div>

                {/* Pagination - Only for Articles */}
                {activeTab === 'articles' && articles.last_page >= 2 && (
                    <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30">
                        <div className="flex justify-center gap-1">
                            {articles.links.map((link, i: number) => (
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${link.active
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                                            }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ) : (
                                    <span
                                        key={i}
                                        className="px-3 py-1 rounded-md text-sm font-medium bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                )
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <AdminNotificationToast notifications={notifications} removeNotification={removeNotification} />

            <DeleteConfirmationModal
                isOpen={deleteModal}
                onClose={() => {
                    setDeleteModal(false)
                    setSelectedItem({ 'id': 0, 'name': '' });
                }}
                onConfirm={handleConfirmDelete}
                itemName={selectedItem.name}
            />

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {categoryModalMode === 'create' ? 'Tambah Kategori Baru' : 'Edit Kategori'}
                            </h2>
                            <button
                                onClick={closeCategoryModal}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nama Kategori
                            </label>
                            <input
                                type="text"
                                value={categoryForm.data.name}
                                onChange={(e) => categoryForm.setData({ name: e.target.value })}
                                placeholder="Masukkan nama kategori..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                                autoFocus
                            />
                            {categoryForm.errors.name && (
                                <p className="text-red-500 text-sm mt-1">{categoryForm.errors.name}</p>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100 bg-gray-50/50">
                            <button
                                onClick={closeCategoryModal}
                                className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleCategorySubmit}
                                disabled={categoryForm.processing}
                                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {categoryForm.processing ? 'Menyimpan...' : (categoryModalMode === 'create' ? 'Buat Kategori' : 'Update Kategori')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default KelolaArtikel;


KelolaArtikel.layout = (page: React.ReactElement) => (
    <AdminLayout>
        {page}
    </AdminLayout>
)
