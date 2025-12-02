import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare, Upload, Paperclip } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';


export default function TambahkanTanaman() {
  
  const { data, setData, post } = useForm({
      name: '',
      scientific_name: '',
      detail: ''
  });
  
  const [uploadedImage, setUploadedImage] = useState(null);

  const create = async () => {
    post('/admin/plant/');
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // const file = e.target.files[0];
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onloadend = () => {
    //     setUploadedImage(reader.result);
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  return (
  <>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">


        {/* Content */}
        <div className="p-8 text-gray-900 ">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Tambahkan Tanaman</h1>

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
                        onClick={() => setUploadedImage(null)}
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
                        Nama Tumbuhan
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
                        Nama Latin
                      </label>
                      <input
                        type="text"
                        name="scientific_name"
                        value={data.scientific_name}
                        onChange={(e) => setData('scientific_name', e.target.value)}
                        placeholder="Solanum lycopersicum"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 italic"
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
                      onClick={create}
                      type='button'
                      className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
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
  <AdminLayout page_title='plant'>
    {page}
  </AdminLayout>
)