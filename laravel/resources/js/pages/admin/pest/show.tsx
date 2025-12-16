import React, { useEffect, useState } from 'react';
import { Upload, Paperclip } from 'lucide-react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { UpdateConfirmationModal } from '@/components/admin/UpdateConfirmModal';

import { Pest } from '@/types/admin';


export default function HamaSenseEdit() {

  const { props } = usePage<{message: String, pest: Pest}>();
  const { message, pest } = props;

  const [ deleteModal, setDeleteModal ] = useState(false);
  const [ updateModal, setUpdateModal ] = useState(false);
  const [ uploadedImage, setUploadedImage ] = useState(pest.img_path ? '/storage/pest/' + pest.img_path : '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];

    setData('new_img', file);
    setUploadedImage(() => URL.createObjectURL(file));
    console.log(data);
  };

  const {data, setData, submit} = useForm({
    'id': pest.id,
    'name': pest.name,
    'scientific_name': pest.scientific_name, 
    'description': pest.description,
    'old_img': pest.img_path,
    'new_img': null
  }); 

  return (
    <>

      {/* Main Content */}
    <div className="flex-1 min-h-screen p-8 text-gray-900">
        {/* Content */}
        <div className="p-8 bg-white max-w-7xl">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">Edit Informasi Hama</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              {/* <div>
                <div className="bg-gradient-to-br from-green-700 to-green-900 rounded-lg overflow-hidden mb-4 aspect-video flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1563126116-1e160c81e57c?w=500&h=350&fit=crop"
                    alt="Kutu daun"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-green-700 to-green-900">
                      <img
                        src="https://images.unsplash.com/photo-1563126116-1e160c81e57c?w=200&h=200&fit=crop"
                        alt={`Thumbnail ${i}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div> */}
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
                      <button
                        onClick={(e) => {
                          setData('new_img', null );
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
                


              {/* Right Column - Form */}
              <div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Hama
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Latin
                      </label>
                      <input
                        type="text"
                        name="scientific_name"
                        value={data.scientific_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detail
                    </label>
                    <textarea
                      name="description"
                      value={data.description}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-4">
                    <button onClick={() => {
                      setDeleteModal(true);
                    }}className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                      Hapus
                    </button>
                    <button onClick={() => {
                      setUpdateModal(true);
                    }} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
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
        console.log(`/admin/article/${pest.id}`);
        submit('delete', `/admin/pest/${pest.id}`);
        setDeleteModal(false)
  
      }} itemName={pest.name}/>

      <UpdateConfirmationModal isOpen={updateModal} onClose={() => {
        setUpdateModal(false)
      }} onConfirm={() => {
        console.log(`/admin/pest/${pest.id}`);
        router.post( `/admin/pest/${pest.id}`, {
          _method: 'patch',
          forceFormData: true,
          ...data
        });
        setUpdateModal(false)

      }} itemName={pest.name}/>
  </>
  );
}

HamaSenseEdit.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='pest'>
    {page}
  </AdminLayout>
)
