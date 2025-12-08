import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare, Settings, Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { Link, router, usePage } from '@inertiajs/react';
import plant from '@/routes/plant';
import AdminLayout from '@/components/admin/layout';

import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';

import { PageProps } from '@inertiajs/core';
import { Plant } from '@/types/admin';

interface Props extends PageProps {
  plants: Plant[];
}


export default function KelolaTanaman({ plants } : Props) {
  const [searchTerm, setSearchTerm] = useState('');

  const [ selectedItem, setSelectedItem ] = useState({
    'id': 0, 
    'name': ''
  });

  const [ deleteModal, setDeleteModal ] = useState(false);


  const tanamanData = [
    {
      id: 1,
      nama: 'Cabai Merah',
      namaIlmiah: 'Capsicum annuum L.',
      kategori: 'Buah',
      image: 'https://images.unsplash.com/photo-1583852968583-ff5f93f5d815?w=400&h=300&fit=crop',
      detail: '{{ Detail }}',
      tags: ['Tomat', 'Paprika', 'Cabai', '+1']
    },
    {
      id: 2,
      nama: 'Tomat',
      namaIlmiah: 'Solanum lycopersicum',
      kategori: 'Buah',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400&h=300&fit=crop',
      detail: '{{ Detail }}',
      tags: ['Tomat', 'Paprika', 'Cabai', '+1']
    },
    {
      id: 3,
      nama: 'Sawi Putih',
      namaIlmiah: 'Brassica rapa conva., pekinensis',
      kategori: 'Sayur',
      image: 'https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?w=400&h=300&fit=crop',
      detail: '{{ Detail }}',
      tags: ['Tomat', 'Paprika', 'Cabai', '+1']
    },
    {
      id: 4,
      nama: 'Kacang Panjang',
      namaIlmiah: 'Vigna unguiculata',
      kategori: 'Buah',
      image: 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&h=300&fit=crop',
      detail: '{{ Detail }}',
      tags: ['Kacang', 'Polong', 'Sayur', '+1']
    },
    {
      id: 5,
      nama: 'Mint',
      namaIlmiah: 'Mentha',
      kategori: 'Daun',
      image: 'https://images.unsplash.com/photo-1628556270448-4d4e4148e1b1?w=400&h=300&fit=crop',
      detail: '{{ Detail }}',
      tags: ['Herbal', 'Mint', 'Daun', '+1']
    },
    {
      id: 6,
      nama: 'Bunga Sepatu',
      namaIlmiah: 'Hibiscus rosa-sinensis',
      kategori: 'Bunga',
      image: 'https://images.unsplash.com/photo-1597165163864-67082f97f373?w=400&h=300&fit=crop',
      detail: '{{ Detail }}',
      tags: ['Bunga', 'Hias', 'Merah', '+1']
    }
  ];

  const filteredData = tanamanData.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.namaIlmiah.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">

        {/* Content */}
        <div className="p-8">
          {/* Page Header */}
          <div className="bg-white rounded-lg shadow-sm p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-gray-900 text-3xl font-bold">Kelola Tanaman</h1>
              <Link href="/admin/plant/create" className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition-colors font-medium">
                <Plus className="w-5 h-5" />
                Tambah Tanaman
              </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari hama berdasarkan nama, nama ilmiah, atau tanaman ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plants?.map((tanaman) => (
              <div key={tanaman.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={'asas'}
                    alt={tanaman.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 bg-white text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    {'kategori'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{tanaman.name}</h3>
                      <p className="text-sm text-gray-600 italic">{tanaman.scientific_name}</p>
                    </div>
                    <div className="flex gap-2 ml-2">
                      <Link href={`/admin/plant/${tanaman.id}`} className="text-gray-600 hover:text-teal-600 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => {
                        setSelectedItem({
                          'id': tanaman.id,
                          'name': tanaman.name
                        })
                        setDeleteModal(true)
                        
                      }} className="text-gray-600 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 mb-4">{tanaman.detail}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* {tanaman.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                      >
                        {tag}
                      </span>
                    ))} */}
                  </div>

                  {/* Button */}
                  <button className="w-full flex items-center justify-center gap-2 bg-teal-700 text-white py-2.5 rounded-lg hover:bg-teal-800 transition-colors font-medium">
                    <Eye className="w-4 h-4" />
                    Lihat Detail
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredData.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 text-lg">Tidak ada tanaman yang ditemukan</p>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmationModal isOpen={deleteModal} onClose={() => {
          setDeleteModal(false)
          setSelectedItem({'id': 0, 'name': ''});
        }} onConfirm={() => {
          router.delete(`/admin/plant/${selectedItem.id}`);
          setDeleteModal(false)
    
        }} itemName={selectedItem.name}/>
      </>
  );
}

KelolaTanaman.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='plant'>
    {page}
  </AdminLayout>
)