import React, { useState } from 'react';
import { Paperclip, Upload } from 'lucide-react';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { UpdateConfirmationModal } from '@/components/admin/UpdateConfirmModal';

import { PageProps } from '@inertiajs/core';

import { Disease, Pest, Plant } from '@/types/admin';
import { BadgeDemo } from '@/components/admin/Badge';
import { DataTableDemo } from '@/components/admin/Table';

interface Props extends PageProps  {
  plant: Plant;
  diseases: Disease[];
  pest: Pest[]
}


export default function EditInformasiTanaman({ plant, diseases, pests } : Props) {

  const [ deleteModal, setDeleteModal ] = useState(false);
  const [ updateModal, setUpdateModal ] = useState(false);
  const [ uploadedImage, setUploadedImage ] = useState(plant.img_path ? '/storage/plant/' + plant.img_path : '');
  const [ errors, setErrors ] = useState<Record<string, string>>({});

  const [ pestList, setPestList ] = useState(plant.pest.map((disease) => disease.id));
  console.log('pestList')
  console.log(pestList)

  const { data, setData, submit } = useForm({
    name: plant.name,
    scientific_name: plant.scientific_name,
    detail: plant.detail,
    old_img: plant.img_path,
    new_img: null,
  });
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setData('new_img', file);
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) {
      newErrors.name = 'Nama tumbuhan wajib diisi';
    }

    if (!data.scientific_name.trim()) {
      newErrors.scientific_name = 'Nama latin wajib diisi';
    }

    if (!data.detail.trim()) {
      newErrors.detail = 'Detail tanaman wajib diisi';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setUpdateModal(false);
    if (!validate()) return;
    router.post('/admin/plant/' + plant.id, {
      _method: 'patch',
      forceFormData: true,
      ...data,
      pests: pestList
      // diseases: diseasesList.map((disease) => disease.id)
    });
  }

  return (
    <>
      {/*Main Content */}

        {/* Content */}
        <div className="p-8 text-gray-900">
          <div className="bg-white max-w-7xl">
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
                        className={`text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${ errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                      )}
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
                        className={`text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 italic ${ errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
                      />
                      {errors.scientific_name && (
                        <p className="text-sm text-red-500 mt-1">{errors.scientific_name}</p>
                      )}

                    </div>
                  </div>
                    <div className='col-span-2 '>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanaman yang Diserang
                      </label>
                      
                        <div className='w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500'>
                          <DataTableDemo allDatas={pests} checkedDatas={pestList} onChange={(value) => {
                            setPestList((prev) => {
                              if (!pestList.includes(value)) {
                                console.log(value) 
                                return prev.includes(value) ? prev : [...prev, value];
                              }
                              return prev.filter((id) => id !== value);
                            });
                          }} name={'plants'}/>
                          <BadgeDemo checkedItems={pestList} allItems={pests} onClick={(id: number) => { setPestList((disease) => disease.filter((disease: Disease) => disease.id !== id))}}/>
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
                      className={`text-gray-900 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none ${errors.detail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
                    ></textarea>
                      {errors.detail && (
                        <p className="text-sm text-red-500 mt-1">{errors.detail}</p>
                      )}
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

      {/* <BadgeDemo items={diseasesList} onClick={(id: number) => { SetDiseasesList(() => diseasesList.filter((disease: Disease) => disease.id !== id))}}/>

      <BadgeDemo items={diseasesList} onClick={(id: number) => { SetDiseasesList(() => diseasesList.filter((disease: Disease) => disease.id !== id))}}/> */}

      <DeleteConfirmationModal isOpen={deleteModal} onClose={() => {
        setDeleteModal(false)

      }} onConfirm={() => {
        submit('delete', `/admin/plant/${plant.id}`, {forceFormData: true, preserveScroll: true});
        setDeleteModal(false);
  
      }} itemName={plant.name}/>

      <UpdateConfirmationModal isOpen={updateModal} onClose={() => {
        setUpdateModal(false);
      }} onConfirm={() => {
        handleSubmit();
      }} itemName={plant.name}/>
    </>
  );
}

EditInformasiTanaman.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='plant'>
    {page}
  </AdminLayout>
)