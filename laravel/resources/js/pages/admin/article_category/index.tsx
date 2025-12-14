import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare, Settings, Plus, Edit2, Trash2, X } from 'lucide-react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

import { PageProps } from '@inertiajs/core';

type Category = {
  id: number;
  name: string;
}

interface Props {
  categories: Category[];
}

export default function KelolaKategoriArtikel({ categories }: Props) {
  

    const [activeMenu, setActiveMenu] = useState('Kelola Artikel');
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
    const [currentCategory, setCurrentCategory] = useState({ id: null, name: '' });
    const [newCategoryName, setNewCategoryName] = useState('');

    const [id, set_id] = useState(0);
    const new_category_form = useForm({
        name: ''
    });

    const openCreateModal = () => {
        setShowModal(true);
        setModalMode('create')
        new_category_form.setData({name: ''});
    };

    const openEditModal = (category: Category ) => {
        setShowModal(true);
        setModalMode('edit');
        new_category_form.setData({name: category.name});
        set_id(category.id);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalMode('');
        new_category_form.setData({name: ''});
        set_id(0);
    };

    const handleSubmit = () => {
        if(modalMode === 'create'){
            new_category_form.post('/admin/article-category/');
        }else {
            new_category_form.patch(`/admin/article-category/${id}`);
        }
        closeModal();
    };

    const handleDelete = (article_id: number) => {
        if (confirm('Apakah Anda yakin ingin menghapus kategori ini?')) {
            router.delete(`/admin/article-category/${article_id}`)
        }
    };

    return (
    <>
    
      {/* Main Content */}
      <div className="flex-1 overflow-auto">

        {/* Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-7xl ">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2 text-gray-900">Kelola Kategori Artikel</h1>
                <p className="text-gray-600">Manage kategori untuk artikel</p>
              </div>
              <button 
                onClick={openCreateModal}
                className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Tambah Kategori
              </button>
            </div>

            {/* Table */}
            <div className="overflow-hidden border border-gray-200 rounded-lg">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">No</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Kategori</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {categories.map((category, index) => (
                    <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => openEditModal(category)}
                            className="text-gray-600 hover:text-teal-600 transition-colors"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(category.id)}
                            className="text-gray-600 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === 'create' ? 'Tambah Kategori Baru' : 'Edit Kategori'}
              </h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kategori
              </label>
              <input
                type="text"
                value={new_category_form.data.name}
                onChange={(e) => new_category_form.setData({name: e.target.value})}
                placeholder="Masukkan nama kategori..."
                className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                autoFocus
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
              <button 
                onClick={closeModal}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button 
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                {modalMode === 'create' ? 'Tambahkan' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

KelolaKategoriArtikel.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='article'>
    {page}
  </AdminLayout>
);