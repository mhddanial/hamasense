import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare, Upload, Paperclip, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

export default function TambahHama() {

  const {data, setData, post} = useForm({
    name: '',
    scientific_name: '',
    description: '',
    images: []
  });
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setData('images', files);
    
    // Create preview URLs for all selected files
    const newImagePreviews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        newImagePreviews.push(reader.result);
        if (newImagePreviews.length === files.length) {
          setUploadedImages(newImagePreviews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (indexToRemove) => {
    const newImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(newImages);
    
    // Update form data
    const currentFiles = Array.from(data.images);
    const newFiles = currentFiles.filter((_, index) => index !== indexToRemove);
    setData('images', newFiles);
  };

  const handleCancel = () => {
    setData({
      name: '',
      scientific_name: '',
      description: '',
      images: []
    });
    setUploadedImages([]);
  };

  const create = async () => {
    post('/admin/pest/', {
      forceFormData: true
    });
  }

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 overflow-auto text-gray-900">
        {/* Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-5xl">
            <h1 className="text-2xl font-bold mb-8 text-gray-900">Tambahkan Hama</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Upload */}
              <div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Upload Foto</h3>
                  
                  {uploadedImages.length > 0 ? (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {uploadedImages.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image} 
                              alt={`Preview ${index + 1}`} 
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <button
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {uploadedImages.length} gambar dipilih
                      </p>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <div className="flex justify-center mb-4">
                        <Upload className="w-12 h-12 text-gray-400" />
                      </div>
                      <p className="text-gray-700 mb-2">Seret atau unggah gambar</p>
                      <p className="text-sm text-gray-500 mb-4">
                        atau klik tombol dibawah ini untuk memilih file
                      </p>
                    </div>
                  )}
                  
                  <label className="inline-flex items-center gap-2 px-6 py-2 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-gray-900">
                    <Paperclip className="w-4 h-4" />
                    <span>{uploadedImages.length > 0 ? 'Tambah Gambar' : 'Pilih File'}</span>
                    <input
                      multiple
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      name="images[]"
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
                        placeholder="Kutu Daun"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                        placeholder="Aphididae"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={data.description}
                      onChange={handleInputChange}
                      placeholder="Tubuh kecil (1-3 mm), hijau muda atau hitam, biasanya berkumpul di bawah daun atau pucuk muda."
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={handleCancel}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={create}
                      type='button'
                      className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
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
};

TambahHama.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='pest'>
    {page}
  </AdminLayout>
)