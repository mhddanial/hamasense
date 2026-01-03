import React, { useState } from 'react';
import { Category } from '@/types/admin';
import { type BreadcrumbItem } from '@/types';
import { PageProps } from '@inertiajs/core';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { FolderOpen, Paperclip, Upload, Plus, Trash2 } from 'lucide-react';
import { Editor } from '@/components/blocks/editor-00/editor';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Admin', href: '/admin' },
    { title: 'Kelola Artikel', href: '/admin/article' },
    { title: 'Buat Artikel', href: '#' },
];

type Reference = {
    source_name: string;
    url: string;
};

interface Props extends PageProps {
    categories: Category[];
}


export default function BuatArtikel({ categories }: Props) {
    const { data, setData, post, processing } = useForm<{
        title: string;
        category_id: number;
        content: string;
        image: File | null;
        references: Reference[];
    }>({
        title: '',
        category_id: 0,
        content: '',
        image: null,
        references: [],
    });

    const [uploadedImage, setUploadedImage] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = () => {
        if (!validate()) return;

        post('/admin/article', {
            forceFormData: true,
            onError: (errors) => {
                console.log('Validation errors:', errors);
                // Show first error message if available
                const firstError = Object.values(errors)[0];
                if (firstError) {
                    alert(`Gagal menyimpan artikel: ${firstError}`);
                } else {
                    alert('Gagal menyimpan artikel. Periksa input Anda.');
                }
            }
        });
    };

    const handleCancel = () => {
        setData({
            title: '',
            category_id: 0,
            content: '',
            image: null,
            references: [],
        });

        setUploadedImage('');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setData('image', file);
            setUploadedImage(URL.createObjectURL(file));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!data.title.trim()) {
            newErrors.title = 'Judul artikel wajib diisi';
        }

        if (!data.content.trim()) {
            newErrors.content = 'Konten artikel wajib diisi';
        }

        if (!data.category_id) {
            newErrors.category_id = 'Kategori belum dipilih';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const addReference = () => {
        setData('references', [...data.references, { source_name: '', url: '' }]);
    };

    const removeReference = (index: number) => {
        const newRefs = data.references.filter((_, i) => i !== index);
        setData('references', newRefs);
    };

    const updateReference = (index: number, field: keyof Reference, value: string) => {
        const newRefs = [...data.references];
        newRefs[index] = { ...newRefs[index], [field]: value };
        setData('references', newRefs);
    };

    // Handle rich text editor content change
    const handleContentChange = (html: string) => {
        setData('content', html);
    };

    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            {/* Main Content */}
            <div className="flex-1 overflow-auto text-gray-900">

                {/* Content */}
                <div className="p-8">
                    {/* Header with Manage Categories Button */}
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold">Buat Artikel</h1>
                    </div>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-full flex flex-col justify-center">
                        <h3 className="text-lg font-semibold mb-6">Upload Foto</h3>
                        {uploadedImage ? (
                            <div className="mb-4">
                                <img
                                    src={uploadedImage}
                                    alt="Preview"
                                    className="w-full h-80 object-cover rounded-lg mb-4"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setData('image', null);
                                        setUploadedImage('');
                                    }}
                                    className="text-sm text-red-500 hover:text-red-700"
                                >
                                    Hapus gambar
                                </button>
                            </div>
                        ) : (
                            <div className="mb-6">
                                <div className="flex justify-center mb-6">
                                    <Upload className="w-16 h-16 text-gray-400" />
                                </div>
                                <p className="text-gray-700 font-medium mb-2">Seret atau unggah gambar</p>
                                <p className="text-sm text-gray-400 mb-6">
                                    atau klik tombol dibawah ini untuk memilih file
                                </p>
                            </div>
                        )}

                        <label className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mx-auto">
                            <Paperclip className="w-5 h-5" />
                            <span className="font-medium">Pilih File</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </label>

                        {errors.image && <div className="text-red-500 text-sm mt-1 text-center">{errors.image}</div>}
                    </div>

                    {/* Form */}
                    <div className="space-y-6 mt-6">
                        <div className="grid grid-cols-2 gap-6">
                            {/* Title */}
                            <div>
                                <label className="flex text-sm font-medium text-gray-700 mb-2">
                                    Judul Artikel
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Masukkan judul artikel..."
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
                                />
                                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="flex text-sm font-medium text-gray-700 mb-2">
                                    Kategori
                                </label>
                                <select
                                    name="category"
                                    value={data.category_id}
                                    onChange={(e) => setData('category_id', + e.target.value)}
                                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${errors.category_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
                                >
                                    <option value="">Pilih kategori...</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.category_id && <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>}
                            </div>
                        </div>

                        {/* Content - Rich Text Editor */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Konten Artikel
                            </label>
                            <div
                                className={`w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${errors.category_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
                            >
                                <Editor onHtmlChange={handleContentChange} />
                            </div>
                            {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
                        </div>

                        {/* References */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Referensi Sumber
                                </label>
                                <button
                                    type="button"
                                    onClick={addReference}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Tambah Referensi
                                </button>
                            </div>

                            {data.references.length === 0 && (
                                <p className="text-sm text-gray-500 italic">Belum ada referensi. Klik tombol di atas untuk menambah.</p>
                            )}

                            <div className="space-y-3">
                                {data.references.map((ref, index) => (
                                    <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                                        <div className="flex-1 grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">Nama Sumber</label>
                                                <input
                                                    type="text"
                                                    value={ref.source_name}
                                                    onChange={(e) => updateReference(index, 'source_name', e.target.value)}
                                                    placeholder="Contoh: FAO, Jurnal Pertanian"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                                                <input
                                                    type="url"
                                                    value={ref.url}
                                                    onChange={(e) => updateReference(index, 'url', e.target.value)}
                                                    placeholder="https://..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeReference(index)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-2">
                            <button
                                onClick={handleCancel}
                                className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={processing}
                                className={`px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {processing ? 'Menyimpan...' : 'Publikasikan'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}