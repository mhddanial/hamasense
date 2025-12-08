import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare, Settings, FolderOpen } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

import { PageProps } from '@inertiajs/core';

import { UpdateConfirmationModal } from '@/components/admin/UpdateConfirmModal';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';

import { Category, Article } from '@/types/admin';

interface Props extends PageProps {
  article: Article;
  categories: Category[];
}


export default function EditArtikel({ article, categories }: Props) {
  const [ deleteModal, setDeleteModal ] = useState(false);
  const [ updateModal, setUpdateModal ] = useState(false);

  const form = useForm({
    'title': article.title,
    'category_id': article.category_id, 
    'content': article.content
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement | HTMLSelectElement>) => {
    const { value, name } = e.target;
    form.setData((prev) => ({...prev, [name]: value}))
  };

  const goToManageCategories = () => {
    alert('Navigasi ke halaman Kelola Kategori Artikel');
    // Router navigation would go here
  };

  return (
      <>     
      {/* Main Content */}
      <div className="flex-1 overflow-auto">


        {/* Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-5xl mx-auto">
            {/* Header with Manage Categories Button */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl text-gray-900 font-bold">Edit Artikel</h1>
              <button 
                onClick={goToManageCategories}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <FolderOpen className="w-5 h-5" />
                Kelola Kategori
              </button>
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
                  value={form.data.title}
                  onChange={(e) => { handleInputChange(e) }}
                  placeholder="Masukkan judul artikel..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  name="category"
                  value={form.data.category_id}
                  onChange={(e) => { handleInputChange(e) }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900"
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
                  value={form.data.content}
                  onChange={(e) => { handleInputChange(e) }}
                  placeholder="Tulis konten artikel Anda di sini..."
                  rows={16}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none text-gray-900"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-2">
                <button 
                  onClick={() => {setDeleteModal(true);}}
                  className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Hapus
                </button>
                <button 
                  onClick={() => {setUpdateModal(true);}}
                  className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    
        <DeleteConfirmationModal isOpen={deleteModal} onClose={() => {
          setDeleteModal(false)

        }} onConfirm={() => {
          console.log(`/admin/article/${article.id}`);
          form.delete(`/admin/article/${article.id}`);
          setDeleteModal(false)
    
        }} itemName={article.title}/>

        <UpdateConfirmationModal isOpen={updateModal} onClose={() => {
          setUpdateModal(false)
        }} onConfirm={() => {
          console.log(`/admin/article/${article.id}`);
          form.patch(`/admin/article/${article.id}`);
          setUpdateModal(false)

        }} itemName={article.title}/>
                    
    </>
  );
}

EditArtikel.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='article'>
    {page}
  </AdminLayout>
);