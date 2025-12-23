import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Upload, Paperclip, X } from 'lucide-react';
import AdminLayout from '@/components/admin/layout';

export default function TambahHama() {

  const [ createButton, setCreateButton ] = useState(true);

const {data, setData, post} = useForm({
  name: '',
  scientific_name: '',
  description: '',
  img_path: null
});
const [uploadedImage, setUploadedImage] = useState<string|null>(null);

const handleInputChange = (e) => {
const { name, value } = e.target;
setData(prev => ({ ...prev, [name]: value }));
};

const handleImageUpload = (e) => {
  const file = e.target.files[0]
  setData('img_path', file);
  setUploadedImage(URL.createObjectURL(file));
};

const handleCancel = () => {
  setData({
  name: '',
  scientific_name: '',
  description: '',
  img_path: null
  });
  setUploadedImage(null);
};

const create = async () => {
  setCreateButton(!createButton);
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
            <div className="bg-white rounded-lg shadow-sm p-8 max-w-7xl">
                <h1 className="text-2xl font-bold mb-8 text-gray-900">Tambahkan Hama</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Upload */}
                    <div>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center h-full flex flex-col justify-center">
                            <h3 className="text-lg font-semibold mb-6">Upload Foto</h3>

                            {uploadedImage ? (
                            <div className="mb-4">
                                <img src={uploadedImage} alt="Preview"
                                    className="w-full h-80 object-cover rounded-lg mb-4" />
                                <button onClick={()=> setUploadedImage('')}
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

                            <label
                                className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mx-auto">
                                <Paperclip className="w-5 h-5" />
                                <span className="font-medium">Pilih File</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
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
                                    <input type="text" name="name" value={data.name} onChange={handleInputChange}
                                        placeholder="Kutu Daun"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nama Latin
                                    </label>
                                    <input type="text" name="scientific_name" value={data.scientific_name}
                                        onChange={handleInputChange} placeholder="Aphididae"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea name="description" value={data.description} onChange={handleInputChange}
                                    placeholder="Tubuh kecil (1-3 mm), hijau muda atau hitam, biasanya berkumpul di bawah daun atau pucuk muda."
                                    rows={5}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"></textarea>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={handleCancel}
                                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors">
                                    Batal
                                </button>
                                <button onClick={create} type='button' disabled={!createButton}
                                    className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
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
