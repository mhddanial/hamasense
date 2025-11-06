import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronDown } from 'lucide-react';

export default function KelolaDataHama() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedLevel, setSelectedLevel] = useState('Semua Tingkat');

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Data Hama</h1>
            <p className="text-gray-600">Manage database hama dan penyakit tanaman</p>
          </div>
          <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
            <Plus className="w-5 h-5" />
            Tambah Hama
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari hama..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
              >
                <option>Semua Kategori</option>
                <option>Serangga</option>
                <option>Jamur</option>
                <option>Bakteri</option>
                <option>Virus</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>

            {/* Level Filter */}
            <div className="relative">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
              >
                <option>Semua Tingkat</option>
                <option>Ringan</option>
                <option>Sedang</option>
                <option>Berat</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Hama</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Ilmiah</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kategori</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tingkat Bahaya</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tanaman Terserang</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.namaHama}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 italic">{item.namaIlmiah}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{item.kategori}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${item.tingkatColor}`}>
                        {item.tingkatBahaya}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {item.tanaman.map((tanaman, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                          >
                            {tanaman}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-3">
                        <button className="text-gray-600 hover:text-green-600 transition-colors">
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button className="text-gray-600 hover:text-red-600 transition-colors">
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
  );
}