import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare, Paperclip, Upload } from 'lucide-react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { UpdateConfirmationModal } from '@/components/admin/UpdateConfirmModal';

import { PageProps } from '@inertiajs/core';

import { Plant } from '@/types/admin';

interface Props extends PageProps  {
  plant: Plant;
}

export default function EditInformasiTanaman({ plant } : Props) {

  const [ deleteModal, setDeleteModal ] = useState(false);
  const [ updateModal, setUpdateModal ] = useState(false);
  const [ uploadedImage, setUploadedImage ] = useState(plant.img_path ? '/storage/plant/' + plant.img_path : '');
  

  const { data, setData, submit } = useForm({
    name: plant.name,
    scientific_name: plant.scientific_name,
    detail: plant.detail,
    old_img: plant.img_path,
    new_img: null
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('new_img', file);
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  return (
    <>
      {/*Main Content */}

        {/* Content */}
        <div className="p-8 text-gray-900">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-7xl">
            <h1 className="text-3xl text-gray-900 font-bold mb-8">Edit Informasi tanaman</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image */}
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
                          setData('new_img', null);
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

              {/* Right Column - Form */}
              <div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        scientific name
                      </label>
                      <input
                        type="text"
                        name="scientific_name"
                        value={data.scientific_name}
                        onChange={(e) => setData('scientific_name', e.target.value)}
                        className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 italic"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detail
                    </label>
                    <textarea
                      name="detail"
                      value={data.detail}
                      onChange={(e) => setData('detail', e.target.value)}
                      rows={8}
                      className="text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button 
                      onClick={() => {
                        setDeleteModal(true)
                      }}
                      className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Hapus
                    </button>
                    <button 
                      onClick={() => {
                        setUpdateModal(true);
                      }}
                      className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
      <DeleteConfirmationModal isOpen={deleteModal} onClose={() => {
        setDeleteModal(false)

      }} onConfirm={() => {
        submit('delete', `/admin/plant/${plant.id}`, {forceFormData: true, preserveScroll: true});
        setDeleteModal(false);
  
      }} itemName={plant.name}/>

      <UpdateConfirmationModal isOpen={updateModal} onClose={() => {
        setUpdateModal(false);
      }} onConfirm={() => {
          router.post('/admin/plant/' + plant.id, {
            _method: 'patch',
            forceFormData: true,
            ...data
          });
      }} itemName={plant.name}/>
    </>
  );
}

EditInformasiTanaman.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='plant'>
    {page}
  </AdminLayout>
)