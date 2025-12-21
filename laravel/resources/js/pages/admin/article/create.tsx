import React, { useState } from 'react';
import { Category } from '@/types/admin';
import { PageProps } from '@inertiajs/core';
import { Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { FolderOpen, Paperclip, Upload } from 'lucide-react';


interface Props extends PageProps {
    categories: Category[];
}


export default function BuatArtikel({categories}: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        category_id: number;
        content: string;
        image: File | null;
    }>({
        title: '',
        category_id: 0,
        content: '',
        image: null,
    });

    const [uploadedImage, setUploadedImage] = useState('');

    const handleSubmit = () => {
        if (!data.title || !data.content || !data.category_id) {
            alert('Mohon lengkapi semua field!');
            return;
        }

        post('/admin/article', {
            forceFormData: true,
            onError: (errors) => {
                console.log(errors);
                alert('Gagal menyimpan artikel. Periksa input Anda.');
            }
        });
    };

    const handleCancel = () => {
        setData({
            title: '',
            category_id: 0,
            content: '',
            image: null,
        });

        setUploadedImage('');
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            setData('image', file);
            setUploadedImage(URL.createObjectURL(file));
        }
    };

    return (
        <>
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
                                    onClick={() => setUploadedImage('')}
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
                    <div className="space-y-6">
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                                >
                                    <option value="">Pilih kategori...</option>
                                    {categories.map((cat, index) => (
                                        <option key={index} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.image && <div className="text-red-500 text-sm mt-1 text-center">{errors.image}</div>}
                        </div>

                        {/* Content */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Konten Artikel
                            </label>
                            <textarea
                                name="content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                placeholder="Tulis konten artikel Anda di sini..."
                                rows={16}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                            >
                                {data.content}
                            </textarea>
                            {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
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
        </>
    );
}

BuatArtikel.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='article'>
    {page}
  </AdminLayout>
);