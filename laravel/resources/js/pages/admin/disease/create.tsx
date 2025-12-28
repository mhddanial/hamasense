import React, { useState } from 'react';
import { Upload, Paperclip } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

import { PageProps } from '@inertiajs/core';
import { Plant } from '@/types/admin';

interface Props extends PageProps {
  plants: Plant[]
}

const SEVERITY_LEVELS = [
  { value: 'rendah', label: 'Rendah' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'tinggi', label: 'Tinggi' },
];

export default function TambahkanPenyakit({ plants }: Props) {

  const { data, setData, post, processing, errors } = useForm({
    label: '',
    name: '',
    description: '',
    severity_level: '',
    img_path: null as File | null,
    plant_type_id: 0,
  });

  const [uploadedImage, setUploadedImage] = useState('');

  const create = async () => {
    post('/admin/disease/', {
      forceFormData: true,
    });
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('img_path', file);
      setUploadedImage(URL.createObjectURL(file));
    }
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
                        type="button"
                        onClick={() => {
                          setData('img_path', null);
                          setUploadedImage('');
                        }}
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
                  {errors.img_path && <div className="text-red-500 text-sm mt-2">{errors.img_path}</div>}
                </div>
              </div>


              {/* Right Column - Form */}
              <div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Label (ID Unik)
                    </label>
                    <input
                      type="text"
                      name="label"
                      value={data.label}
                      onChange={(e) => setData('label', e.target.value)}
                      placeholder="late_blight"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.label && <div className="text-red-500 text-sm mt-1">{errors.label}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Penyakit
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="Busuk Daun"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tingkat Keparahan
                    </label>
                    <select
                      name="severity_level"
                      value={data.severity_level}
                      onChange={(e) => setData('severity_level', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="">Pilih tingkat keparahan...</option>
                      {SEVERITY_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                    {errors.severity_level && <div className="text-red-500 text-sm mt-1">{errors.severity_level}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis Tanaman
                    </label>
                    <select
                      name="plant_type_id"
                      value={data.plant_type_id}
                      onChange={(e) => setData('plant_type_id', +e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      <option value="">Pilih jenis tanaman...</option>
                      {plants.map((plant) => (
                        <option key={plant.id} value={plant.id}>
                          {plant.name}
                        </option>
                      ))}
                    </select>
                    {errors.plant_type_id && <div className="text-red-500 text-sm mt-1">{errors.plant_type_id}</div>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi
                    </label>
                    <textarea
                      name="description"
                      value={data.description}
                      onChange={(e) => setData('description', e.target.value)}
                      placeholder="Deskripsi singkat tentang penyakit ini..."
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    ></textarea>
                    {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Batal
                    </button>
                    <button
                      onClick={create}
                      type='button'
                      disabled={processing}
                      className={`px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {processing ? 'Menyimpan...' : 'Tambahkan'}
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

TambahkanPenyakit.layout = (page: React.ReactElement) => (
  <AdminLayout>
    {page}
  </AdminLayout>
)