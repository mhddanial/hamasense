import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare, Settings, FolderOpen } from 'lucide-react';
import { Link, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

import { Category } from '@/types/admin';
import { PageProps } from '@inertiajs/core';


interface Props extends PageProps {
  categories: Category[];
}

export default function BuatArtikel({categories}: Props) {

  const { data, setData, post } = useForm({
    title: '',
    category_id: 0,
    content: ''
  });

  const handleSubmit = () => {
    if (!data.title || !data.content || !data.category_id) {
      alert('Mohon lengkapi semua field!');
      return;
    }

    post('/admin/article');
  };

  const handleCancel = () => {
    setData({
      title: '',
      category_id: 0,
      content: ''
    });
  };

  return (
    <>

      {/* Main Content */}
      <div className="flex-1 overflow-auto text-gray-900">
        
        {/* Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-5xl mx-auto">
            {/* Header with Manage Categories Button */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-bold">Buat Artikel</h1>
              <Link
                href={'/admin/article-category'}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FolderOpen className="w-5 h-5" />
                Kelola Kategori
              </Link>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Judul Artikel
                </label>
                <input
                  type="text"
                  name="title"
                  value={data.title}
                  onChange={(e) => setData((prev) => ({...prev, 'title' : e.target.value}))}
                  placeholder="Masukkan judul artikel..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  name="category"
                  value={data.category_id}
                  onChange={(e) => setData((prev) => ({...prev, 'category_id': (+e.target.value)}))}
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

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konten Artikel
                </label>
                <textarea
                  name="content"
                  value={data.content}
                  onChange={(e) => setData((prev) => ({...prev, 'content': e.target.value}))}
                  placeholder="Tulis konten artikel Anda di sini..."
                  rows={16}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                ></textarea>
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
                  className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Publikasikan
                </button>
              </div>
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