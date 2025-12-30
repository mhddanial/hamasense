import React, { useState } from 'react';
import { Upload, Paperclip } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

import { PageProps } from '@inertiajs/core';
import { Plant } from '@/types/admin';
import { ExampleCombobox } from '@/components/admin/Combobox';

interface Props extends PageProps {
    plants: Plant[]
}

export default function TambahkanTanaman({ plants }: Props) {
  
  console.log(plants);

  const { data, setData, post } = useForm({
    name:'',
    description: '',
    cause: '',
    solution: '',
    severity_level: '',
    img_path: null,
    plant_type_id: 0,
  });
  
  const [uploadedImage, setUploadedImage] = useState('');
  const [ disableCreate, setDisableCreate ] = useState(false);

  const create = async () => {
    setDisableCreate(true);
    post('/admin/disease/');
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setData('img_path', file);

    setUploadedImage(URL.createObjectURL(file));
  };

  return (
  <>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">


        {/* Content */}
        <div className="p-8 text-gray-900 ">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-7xl">
            <h1 className="text-3xl font-bold mb-8">Tambahkan Data Penyakit</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Upload */}
              <div>
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
                </div>
              </div>


              {/* Right Column - Form */}
              <div>
                <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nama Penyakit
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value) }
                        placeholder="Tomat"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Penyebab
                      </label>
                      <input
                        type="text"
                        name="cause"
                        value={data.cause}
                        onChange={(e) => setData('cause', e.target.value)}
                        placeholder="Solanum lycopersicum"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 italic"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Solusi
                      </label>
                      <input
                        type="text"
                        name="solution"
                        value={data.solution}
                        onChange={(e) => setData('solution', e.target.value)}
                        placeholder="Solanum lycopersicum"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 italic"
                      />
                    </div>                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Severity Level
                      </label>
                      <input
                        type="number"
                        name="severity_level"
                        value={data.severity_level}
                        onChange={(e) => setData('severity_level', e.target.value)}
                        placeholder="Solanum lycopersicum"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 italic"
                      />
                    </div>
                    <div>

                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tanaman Terkait
                      </label>
                          <ExampleCombobox value={data['plant_type_id']} setValue={setData} keyValue={'plant_type_id'} items={plants.map(plant => ({value: String(plant.id), label: plant.name}))} onSelect={(value : any) => {setData('plant_type_id', value)}}/>
                      
                    </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="detail"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Tomat (Solanum lycopersicum) adalah buah yang sering digunakan sebagai sayuran dalam masakan. Tanaman ini berasal dari Amerika Selatan dan termasuk keluarga Solanaceae."
                      rows={8}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button 
                    //   onClick={handleCancel}
                      className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Batal
                    </button>
                    <button 
                      disabled={disableCreate}
                      onClick={create}
                      type='button'
                      className={`px-8 py-3 ${ disableCreate ? 'bg-gray-300 text-gray-900' : 'bg-teal-600 text-white hover:bg-teal-700' }  rounded-lg  transition-colors font-medium`} 
                    >
                      Tambahkan
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
</>
  );
}

TambahkanTanaman.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='disease'>
    {page}
  </AdminLayout>
)