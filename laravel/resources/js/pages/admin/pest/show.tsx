import React, { useEffect, useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { UpdateConfirmationModal } from '@/components/admin/UpdateConfirmModal';

import { Pest } from '@/types/admin';

export default function HamaSenseEdit() {

  const [ deleteModal, setDeleteModal ] = useState(false);
  const [ updateModal, setUpdateModal ] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const { props } = usePage<{message: String, pest: Pest}>();
  const { message, pest } = props;
  
  const {data, setData, submit} = useForm<Pest>({
    'id': pest.id,
    'name': pest.name,
    'scientific_name': pest.scientific_name, 
    'description': pest.description,
    'pics': pest.pics
  }); 

  return (
    <>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">

        {/* Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-5xl">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">Edit Informasi Hama</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div>
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
        submit('patch', `/admin/pest/${pest.id}`);
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
