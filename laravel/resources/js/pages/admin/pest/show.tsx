import React, { useState } from 'react';
import { Upload, Paperclip, Plus, Trash2 } from 'lucide-react';
import { router, useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { UpdateConfirmationModal } from '@/components/admin/UpdateConfirmModal';

import { Pest, Plant } from '@/types/admin';
import { BadgeDemo } from '@/components/admin/Badge';
import { DataTableDemo } from '@/components/admin/Table';

const CATEGORIES = ['Serangga', 'Jamur', 'Bakteri', 'Virus', 'Nematoda', 'Gulma', 'Lainnya'];

const RISK_LEVELS = [
  { value: 'rendah', label: 'Rendah' },
  { value: 'sedang', label: 'Sedang' },
  { value: 'tinggi', label: 'Tinggi' },
];

export default function EditHama() {

  const { props } = usePage<{ message: String, pest: Pest }>();
  const { pest } = props;

  const [updateModal, setUpdateModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(pest.img_path ? '/storage/pest/' + pest.img_path : '');

  const { data, setData, processing, errors } = useForm<{
    name: string;
    slug: string;
    scientific_name: string;
    description: string;
    category: string;
    risk_level: 'rendah' | 'sedang' | 'tinggi';
    plant: string[];
    pencegahan: string[];
    penanganan: string[];
    old_img: string | null;
    new_img: File | null;
  }>({
    name: pest.name,
    slug: pest.slug || '',
    scientific_name: pest.scientific_name,
    description: pest.description || '',
    category: pest.category || 'Serangga',
    risk_level: pest.risk_level || 'sedang',
    plant: pest.plant || [],
    pencegahan: pest.pencegahan || [],
    penanganan: pest.penanganan || [],
    old_img: pest.img_path || null,
    new_img: null
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('new_img', file);
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    window.history.back();
  }

  const handleUpdate = () => {
    router.post(`/admin/pest/${pest.id}`, {
      _method: 'patch',
      ...data
    }, {
      forceFormData: true,
    });
  };

  // Dynamic list handlers - Tanaman
  const addPlant = () => {
    setData('plant', [...data.plant, '']);
  };

  const updatePlant = (index: number, value: string) => {
    const newList = [...data.plant];
    newList[index] = value;
    setData('plant', newList);
  };

  const removePlant = (index: number) => {
    setData('plant', data.plant.filter((_, i) => i !== index));
  };

  // Dynamic list handlers - Pencegahan
  const addPencegahan = () => {
    setData('pencegahan', [...data.pencegahan, '']);
  };

  const updatePencegahan = (index: number, value: string) => {
    const newList = [...data.pencegahan];
    newList[index] = value;
    setData('pencegahan', newList);
  };

  const removePencegahan = (index: number) => {
    setData('pencegahan', data.pencegahan.filter((_, i) => i !== index));
  };

  const addPenanganan = () => {
    setData('penanganan', [...data.penanganan, '']);
  };

  const updatePenanganan = (index: number, value: string) => {
    const newList = [...data.penanganan];
    newList[index] = value;
    setData('penanganan', newList);
  };

  const removePenanganan = (index: number) => {
    setData('penanganan', data.penanganan.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="flex-1 min-h-screen p-8 text-gray-900">
        <div className="p-8 bg-white max-w-7xl rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-8 text-gray-900">Edit Informasi Hama</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image Upload */}
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
                      type="button"
                      onClick={() => {
                        setData('new_img', null);
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
                {errors.new_img && <div className="text-red-500 text-sm mt-2">{errors.new_img}</div>}
              </div>
            </div>

            {/* Right Column - Form */}
            <div>
              <div className="space-y-6">
                {/* Slug (optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug <span className="text-gray-400 font-normal">(opsional, auto-generate)</span>
                  </label>
                  <input
                    type="text"
                    value={data.slug}
                    onChange={(e) => setData('slug', e.target.value)}
                    placeholder="Kosongkan untuk auto-generate"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  {errors.slug && <div className="text-red-500 text-sm mt-1">{errors.slug}</div>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Nama Hama */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Hama
                    </label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    {errors.name && <div className="text-red-500 text-sm mt-1">{errors.name}</div>}
                  </div>
                  {/* Nama Latin */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nama Latin
                    </label>
                    <input
                      type="text"
                      value={data.scientific_name}
                      onChange={(e) => setData('scientific_name', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 italic"
                    />
                    {errors.scientific_name && <div className="text-red-500 text-sm mt-1">{errors.scientific_name}</div>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Kategori */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <select
                      value={data.category}
                      onChange={(e) => setData('category', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
                  </div>
                  {/* Tingkat Risiko */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tingkat Risiko
                    </label>
                    <select
                      value={data.risk_level}
                      onChange={(e) => setData('risk_level', e.target.value as 'rendah' | 'sedang' | 'tinggi')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      {RISK_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>{level.label}</option>
                      ))}
                    </select>
                    {errors.risk_level && <div className="text-red-500 text-sm mt-1">{errors.risk_level}</div>}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                  ></textarea>
                  {errors.description && <div className="text-red-500 text-sm mt-1">{errors.description}</div>}
                </div>

                {/* Tanaman Inang */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Tanaman Inang
                    </label>
                    <button
                      type="button"
                      onClick={addPlant}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Tambah
                    </button>
                  </div>
                  <div className="space-y-2">
                    {data.plant.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updatePlant(index, e.target.value)}
                          placeholder={`Nama tanaman ${index + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => removePlant(index)}
                          className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {data.plant.length === 0 && (
                      <p className="text-sm text-gray-400 italic">Belum ada tanaman inang</p>
                    )}
                  </div>
                </div>

                {/* Pencegahan */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Langkah Pencegahan
                    </label>
                    <button
                      type="button"
                      onClick={addPencegahan}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Tambah
                    </button>
                  </div>
                  <div className="space-y-2">
                    {data.pencegahan.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updatePencegahan(index, e.target.value)}
                          placeholder={`Langkah pencegahan ${index + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => removePencegahan(index)}
                          className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {data.pencegahan.length === 0 && (
                      <p className="text-sm text-gray-400 italic">Belum ada langkah pencegahan</p>
                    )}
                  </div>
                </div>

                {/* Penanganan */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Langkah Penanganan
                    </label>
                    <button
                      type="button"
                      onClick={addPenanganan}
                      className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" /> Tambah
                    </button>
                  </div>
                  <div className="space-y-2">
                    {data.penanganan.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updatePenanganan(index, e.target.value)}
                          placeholder={`Langkah penanganan ${index + 1}`}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                        <button
                          type="button"
                          onClick={() => removePenanganan(index)}
                          className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {data.penanganan.length === 0 && (
                      <p className="text-sm text-gray-400 italic">Belum ada langkah penanganan</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpdateModal(true)}
                    disabled={processing}
                    className={`px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {processing ? 'Menyimpan...' : 'Update'}
                  </button>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <UpdateConfirmationModal
        isOpen={updateModal}
        onClose={() => setUpdateModal(false)}
        onConfirm={() => {
          handleUpdate();
          setUpdateModal(false);
        }}
        itemName={pest.name}
      />
    </>
  );
}

EditHama.layout = (page: React.ReactElement) => (
  <AdminLayout>
    {page}
  </AdminLayout>
)
