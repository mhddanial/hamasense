import React, { useState } from 'react';
import { Upload, Paperclip } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { DataTableDemo } from '@/components/admin/Table';
import { BadgeDemo } from '@/components/admin/Badge';
import { Pest } from '@/types/admin';


export default function TambahkanTanaman() {

  const [ uploadedImage, setUploadedImage] = useState('');
  const [ buttonDisable, setButtonDisable ] = useState(false);
  const [ pestList, setPestList ] = useState([]);
  const [ errors, setErrors ] = useState<Record<string, string>>({});

  const { data, setData, post } = useForm({
      name: '',
      scientific_name: '',
      detail: '',
      img_path: null,
      pests: pestList
  });

  const { pests } = usePage().props;

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


  const handleSubmit = async () => {
    
    if (!validate()) return;

    setButtonDisable(true);    
    post('/admin/plant/');
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    setData('img_path', file);

    if (file) {
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleCancel = () => {
    setData({
      name: '',
      scientific_name: '',
      detail: '',
      img_path: null,
      pests: []
    });
    setUploadedImage('');
  };

  return (
  <>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">


        {/* Content */}
        <div className="p-8 text-gray-900 ">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-7xl">
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
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
                      />
                      {errors.name && (
                        <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                      )}
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
                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 italic ${errors.scientific_name ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
                      />
                      {errors.scientific_name && (
                        <p className="text-sm text-red-500 mt-1">{errors.scientific_name}</p>
                      )}
                    </div>
                  </div>
                  <div className='col-span-2 '>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hama yang menyerang
                      </label>
                      
                        <div className='w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500'>
                          <DataTableDemo allDatas={pests} checkedDatas={data.pests} onChange={(value: number) => {
                              const checkedPest: number[] = data.pests;
                              if (!data.pests.includes(value)) {
                                setData('pests', [...checkedPest, value]);
                                return;
                              }else {
                                setData('pests', [...checkedPest.filter((id) => value !== id)]);
                                return;
                              }
                          }} name={'plants'}/>
                          <BadgeDemo checkedItems={data.pests} allItems={pests} onClick={(id: number) => { setPestList((pest) => pest.filter((pest: Pest) => pest.id !== id))}}/>
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
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none ${errors.detail ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
                    ></textarea>
                      {errors.detail && (
                        <p className="text-sm text-red-500 mt-1">{errors.detail}</p>
                      )}
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button 
                      onClick={handleCancel}
                      className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Batal
                    </button>
                    <button 
                      disabled={buttonDisable}
                      onClick={handleSubmit}
                      type='button'
                      className={`px-8 py-3 ${ buttonDisable ? 'bg-gray-300 text-gray-900' : 'bg-teal-600 text-white hover:bg-teal-700' }   rounded-lg  transition-colors font-medium`}
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