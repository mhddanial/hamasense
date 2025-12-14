import React, { useState } from 'react';
import { FolderOpen, Paperclip, Upload } from 'lucide-react';
import { router, useForm } from '@inertiajs/react';
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
    'content': article.content,
    'old_img': article.img_path,
    'new_img': null
  });

  const [ uploadedImage, setUploadedImage ] = useState(article.img_path ? '/storage/article/' + article.img_path : '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement| HTMLTextAreaElement | HTMLSelectElement>) => {
    const { value, name } = e.target;
    form.setData((prev) => ({...prev, [name]: value}))
  };

  const goToManageCategories = () => {
    alert('Navigasi ke halaman Kelola Kategori Artikel');
    // Router navigation would go here
  };

    const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      form.setData('new_img', file);
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return (
      <>     
      {/* Main Content */}
    {/* <div className="flex-1 min-h-screen p-8"> */}


        {/* Content */}
          <div className="p-8 ">
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

                          <div>
                <div className="rounded-lg overflow-hidden">

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-full flex flex-col justify-center">
                  <h3 className="text-lg font-semibold mb-6">Upload Foto</h3>
                  
                  {uploadedImage ? (
                    <div className="mb-4">
                      <img 
                        src={uploadedImage} 
                        alt="Preview" 
                        className="w-full h-80 object-cover rounded-lg mb-4"
                      />
                      <button type='button'
                        onClick={(e) => {
                          e.preventDefault();
                          form.setData('new_img', null);
                          setUploadedImage('');
                         }
                        }
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
                </div>
                </div>
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

      {/* </div> */}
    
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
          router.post(`/admin/article/${article.id}`, {
            _method: 'patch',
            forceFormData: true, 
            ...form.data
          });
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