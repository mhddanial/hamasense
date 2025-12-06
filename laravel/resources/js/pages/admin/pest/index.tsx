import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import FilterDropdown from '@/components/filterDropdown';
import { Plus, Edit2, Trash2, ChevronDown, Filter } from 'lucide-react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { PageProps } from '@inertiajs/core';
import { Pest } from '@/types/admin';

interface Props extends PageProps {
  pests: Pest[];
}

export default function KelolaDataHama({pests} : Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedLevel, setSelectedLevel] = useState('Semua Tingkat');

  const [selectedItem, setSelectedItem] = useState({
    'id': 0,
    'name': ''
  });

  const [ deleteModal, setDeleteModal ] = useState(false);

  const hamaData = [
    {
      id: 1,
      namaHama: 'Kutu Daun',
      namaIlmiah: 'Aphidoidea',
      kategori: 'Serangga',
      tingkatBahaya: 'Sedang',
      tingkatColor: 'bg-orange-100 text-orange-600',
      tanaman: ['Tomat', 'Cabai', 'Terong']
    },
    {
      id: 2,
      namaHama: 'Thrips',
      namaIlmiah: 'Thysanoptera',
      kategori: 'Serangga',
      tingkatBahaya: 'Ringan',
      tingkatColor: 'bg-green-100 text-green-600',
      tanaman: ['Paprika', 'Tomat', 'Mentimun']
    },
    {
      id: 3,
      namaHama: 'Ulat Grayak',
      namaIlmiah: 'Spodoptera litura',
      kategori: 'Serangga',
      tingkatBahaya: 'Berat',
      tingkatColor: 'bg-red-100 text-red-600',
      tanaman: ['Kol', 'Sawi', 'Tomat', '+1']
    },
    {
      id: 4,
      namaHama: 'Jamur Karat',
      namaIlmiah: 'Puccinia spp.',
      kategori: 'Jamur',
      tingkatBahaya: 'Sedang',
      tingkatColor: 'bg-orange-100 text-orange-600',
      tanaman: ['Tomat', 'Kacang', 'Jagung']
    }
  ];

  const filteredData = hamaData.filter(item => {
    const matchesSearch = item.namaHama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.namaIlmiah.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Semua Kategori' || item.kategori === selectedCategory;
    const matchesLevel = selectedLevel === 'Semua Tingkat' || item.tingkatBahaya === selectedLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <>

    <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Data Hama</h1>
            <p className="text-gray-600">Manage database hama dan penyakit tanaman</p>
          </div>
          <Link href='/admin/pest/create' className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            Tambah Hama
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchBar value={searchTerm} onChange={setSearchTerm}/>
            <FilterDropdown
              options={["Semua Kategori", "Serangga", "Jamur", "Bakteri", "Virus"]}
              value={selectedCategory}
              onChange={setSelectedCategory}
            />
            <FilterDropdown
              options={["Semua Risiko", "Rendah", "Sedang", "Berat"]}
              value={selectedLevel}
              onChange={setSelectedLevel}
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gambar Hama</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Hama</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Ilmiah</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tingkat Bahaya</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tanaman Terserang</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pests?.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 italic">{item.scientific_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">item.kategori</td>
                    <td className="px-6 py-4">
                      
                      sadasd`{/* <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${item.tingkatColor}`}>
                        {item.tingkatBahaya}
                      </span> */}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {/* {item.tanaman.map((tanaman, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {tanaman}
                          </span>
                        ))} */}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <Link href={`/admin/pest/${item.id}`} className="text-gray-600 hover:text-green-600 transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </Link>
                        <button onClick={() => {
                          setSelectedItem({'id': item.id, 'name': item.name})
                          setDeleteModal(true)
                        }} className="text-gray-600 hover:text-red-600 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Tidak ada data hama yang ditemukan</p>
            </div>
          )}
        </div>
      </div>
    </div>

    <DeleteConfirmationModal isOpen={deleteModal} onClose={() => {
      setDeleteModal(false)
      setSelectedItem({'id': 0, 'name': ''});
    }} onConfirm={() => {
      console.log(`/admin/pest/${selectedItem.id}`)
      router.delete(`/admin/pest/${selectedItem.id}`);
      setDeleteModal(false)

    }} itemName={selectedItem.name}/>
    </>
  );
}

KelolaDataHama.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='pest'>
    {page}
  </AdminLayout>
)
