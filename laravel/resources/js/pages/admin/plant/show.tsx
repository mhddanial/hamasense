import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
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

  // const { props } = usePage();
  // const { plant }: {plant: Plant} = props;


  const { data, setData, submit } = useForm({
    id: plant.id,
    name: plant.name,
    scientific_name: plant.scientific_name,
    detail: plant.detail
  }); 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    console.log(name, value);
    setData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">

        {/* Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl text-gray-900 font-bold mb-8">Edit Informasi tanaman</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image */}
              <div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=600&fit=crop"
                    alt="Tomat"
                    className="w-full h-auto object-cover"
                  />
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
                        onChange={handleInputChange}
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
                        onChange={handleInputChange}
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
                      onChange={handleInputChange}
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
      </div>
      <DeleteConfirmationModal isOpen={deleteModal} onClose={() => {
        setDeleteModal(false)

      }} onConfirm={() => {
        submit('delete', `/admin/plant/${plant.id}`);
        setDeleteModal(false);
  
      }} itemName={plant.name}/>

      <UpdateConfirmationModal isOpen={updateModal} onClose={() => {
        setUpdateModal(false);
      }} onConfirm={() => {
        console.log(`/admin/plant/${plant.id}`);
        submit('patch', `/admin/plant/${plant.id}`);
        setUpdateModal(false)
      }} itemName={plant.name}/>
    </>
  );
}

EditInformasiTanaman.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='plant'>
    {page}
  </AdminLayout>
)