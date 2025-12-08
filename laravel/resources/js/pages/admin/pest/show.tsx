import React, { useEffect, useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare, Plus, X, Upload, Paperclip } from 'lucide-react';
import { useForm, usePage, router } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import TagInput from '@/components/TagInput';

import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { UpdateConfirmationModal } from '@/components/admin/UpdateConfirmModal';

import { Pest, PlantType } from '@/types/admin';

export default function HamaSenseEdit() {

  const [ deleteModal, setDeleteModal ] = useState(false);
  const [ updateModal, setUpdateModal ] = useState(false);

  // Define proper types for extended pest with images
  interface PestWithImages extends Pest {
    images?: { filename: string, pest_id: number }[];
  }

  const { props } = usePage<{message: String, pest: PestWithImages, plantTypes: PlantType[]}>();
  const { message, pest } = props;

  // Initial existing images
  const [existingImages, setExistingImages] = useState(pest.images || []);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const {data, setData, post, processing} = useForm({
    _method: 'patch',
    name: pest.name,
    scientific_name: pest.scientific_name,
    category: pest.category || 'Serangga',
    risk_level: pest.risk_level || 'Sedang',
    description: pest.description,
    images: [] as File[], // For new images
    deleted_images: [] as string[], // For deleted existing images
    plant_types: pest.plant_types ? pest.plant_types.map(pt => pt.name) : [] as string[]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(name as any, value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setData('images', [...data.images, ...files]);
    
    // Create preview URLs
    const newPreviews: string[] = [];
    files.forEach(file => {
       const reader = new FileReader();
       reader.onloadend = () => {
         newPreviews.push(reader.result as string);
         if (newPreviews.length === files.length) {
            setUploadedImages(prev => [...prev, ...newPreviews]);
         }
       };
       reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    const newFiles = [...data.images];
    newFiles.splice(index, 1);
    setData('images', newFiles);

    const newPreviews = [...uploadedImages];
    newPreviews.splice(index, 1);
    setUploadedImages(newPreviews);
  };

  const removeExistingImage = (filename: string) => {
    setExistingImages(prev => prev.filter(img => img.filename !== filename));
    setData('deleted_images', [...data.deleted_images, filename]);
  };

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-5xl">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">Edit Informasi Hama</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Images */}
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Foto Hama</h3>
                  
                  {/* Existing Images */}
                  {existingImages.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">Foto Saat Ini:</p>
                        <div className="grid grid-cols-2 gap-2">
                            {existingImages.map((img) => (
                                <div key={img.filename} className="relative group">
                                    <img 
                                        src={`/storage/images/${img.filename}`} 
                                        alt="Existing" 
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(img.filename)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}

                  {/* New Uploaded Images Preview */}
                  {uploadedImages.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-medium text-green-700 mb-2">Foto Baru:</p>
                         <div className="grid grid-cols-2 gap-2">
                            {uploadedImages.map((preview, index) => (
                                <div key={index} className="relative group">
                                    <img 
                                        src={preview} 
                                        alt="New Upload" 
                                        className="w-full h-32 object-cover rounded-lg border-2 border-green-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(index)}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                  )}

                  <label className="inline-flex items-center gap-2 px-6 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-gray-900 w-full justify-center">
                    <Plus className="w-4 h-4" />
                    <span>Tambah Foto Baru</span>
                    <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
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

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori
                      </label>
                      <select
                        name="category"
                        value={data.category}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Serangga">Serangga</option>
                        <option value="Jamur">Jamur</option>
                        <option value="Bakteri">Bakteri</option>
                        <option value="Virus">Virus</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tingkat Bahaya
                      </label>
                      <select
                        name="risk_level"
                        value={data.risk_level}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      >
                        <option value="Rendah">Rendah</option>
                        <option value="Sedang">Sedang</option>
                        <option value="Berat">Berat</option>
                      </select>
                    </div>
                  </div>

                   <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tanaman yang Diserang
                    </label>
                    <TagInput 
                      value={data.plant_types}
                      onChange={(tags) => setData('plant_types', tags)}
                      placeholder="Ketik nama tanaman dan tekan Enter..."
                    />
                    <p className="text-xs text-gray-500 mt-1">Ketik nama tanaman lalu tekan Enter untuk menambahkan.</p>
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
                    <button 
                      onClick={() => setUpdateModal(true)} 
                      disabled={processing}
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50"
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
        router.delete(`/admin/pest/${pest.id}`);
        setDeleteModal(false)
      }} itemName={pest.name}/>

      <UpdateConfirmationModal isOpen={updateModal} onClose={() => {
        setUpdateModal(false)
      }} onConfirm={() => {
        post(`/admin/pest/${pest.id}`, {
          forceFormData: true,
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
