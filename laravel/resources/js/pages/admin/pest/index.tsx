import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { PageProps } from '@inertiajs/core';
import { Pest } from '@/types/admin';
import { AdminNotificationToast } from '@/components/admin/InformationToast';
import { ItemHeaderDemo } from '@/components/admin/card';
import NavSearch from '@/components/admin/NavSearch';

interface Props extends PageProps {
  pests: Pest[];
}

export default function KelolaDataHama({pests} : Props) {
  const [notifications, setNotifications] = useState<any[]>([]);

  const { flash } = usePage().props;

  const success = flash?.success;
  const error = flash?.error;
  
  useEffect(() => {
    if(success){
      setNotifications((prev) => [...prev, {type: 'success', message: success}])}
    if(error){
      setNotifications((prev) => [...prev, {type: 'error', message: error}])}
    }
  , [success, error]);
  
  const [selectedItem, setSelectedItem] = useState({
    'id': 0,
    'name': ''
  });

  const [ deleteModal, setDeleteModal ] = useState(false);

  // const removeNotification = (id: number) => {
  //   setNotifications(prev => prev.filter(notif => notif.id !== id));
  // };

  // const filteredData = hamaData.filter(item => {
  //   const matchesSearch = item.namaHama.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        item.namaIlmiah.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = selectedCategory === 'Semua Kategori' || item.kategori === selectedCategory;
  //   const matchesLevel = selectedLevel === 'Semua Tingkat' || item.tingkatBahaya === selectedLevel;
  //   return matchesSearch && matchesCategory && matchesLevel;
  // });
  // Determine risk level color
  // const getRiskColor = (level: string) => {
  //   switch (level) {
  //     case 'Rendah': return 'bg-green-100 text-green-600';
  //     case 'Sedang': return 'bg-orange-100 text-orange-600';
  //     case 'Berat': return 'bg-red-100 text-red-600';
  //     default: return 'bg-gray-100 text-gray-600';
  //   }
  // };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // const filteredData = pests.filter(item => {
  //   const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        item.scientific_name.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = selectedCategory === 'Semua Kategori' || item.category === selectedCategory;
  //   const matchesLevel = selectedLevel === 'Semua Tingkat' || item.risk_level === selectedLevel;
  //   return matchesSearch && matchesCategory && matchesLevel;
  // });

  return (
    <>
    <div className="flex-1 min-h-screen p-8">

        <NavSearch href='/admin/pest/create' title='Kelola Hama' button_title="Tambah Data Hama" page="pest" />

        {/* Table */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {pests.data.map((pest) => (
                  <ItemHeaderDemo id={pest.id} name={pest.name} img_path={'pest'} filename={pest.img_path} scientific_name={pest.scientific_name} delete_onclick={() => {
                    setSelectedItem({
                      'id': pest.id,
                      'name': pest.name
                    });
                    setDeleteModal(true);
                  }}/> 
    // <div className="min-h-screen bg-gray-50 p-8 text-gray-900">
    //   <div className="max-w-7xl mx-auto">
    //     {/* Header */}
    //     <div className="mb-8 flex items-center justify-between">
    //       <div>
    //         <h1 className="text-3xl font-bold text-gray-900 mb-2">Kelola Data Hama</h1>
    //         <p className="text-gray-600">Manage database hama dan penyakit tanaman</p>
    //       </div>
    //       <Link href='/admin/pest/create' className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium">
    //         <Plus className="w-5 h-5" />
    //         Tambah Hama
    //       </Link>
    //     </div>

    //     {/* Filters */}
    //     <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
    //       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //         <SearchBar value={searchTerm} onChange={setSearchTerm}/>
    //         <FilterDropdown
    //           options={["Semua Kategori", "Serangga", "Jamur", "Bakteri", "Virus"]}
    //           value={selectedCategory}
    //           onChange={setSelectedCategory}
    //         />
    //         <FilterDropdown
    //           options={["Semua Tingkat", "Rendah", "Sedang", "Berat"]}
    //           value={selectedLevel}
    //           onChange={setSelectedLevel}
    //         />
    //       </div>
    //     </div>

    //     {/* Table */}
    //     <div className="bg-white rounded-lg shadow-sm overflow-hidden">
    //       <div className="overflow-x-auto">
    //         <table className="w-full">
    //           <thead className="bg-gray-50 border-b border-gray-200">
    //             <tr>
    //               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Gambar Hama</th>
    //               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Hama</th>
    //               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Ilmiah</th>
    //               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kategori</th>
    //               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tingkat Bahaya</th>
    //               <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tanaman Terserang</th>
    //               <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
    //             </tr>
    //           </thead>
    //           <tbody className="divide-y divide-gray-200">
    //             {filteredData?.map((item) => (
    //               <tr key={item.id} className="hover:bg-gray-50 transition-colors">
    //                 <td className="px-6 py-4">
    //                   {item.image_path ? (
    //                     <img 
    //                       src={`/storage/${item.image_path}`} 
    //                       alt={item.name} 
    //                       className="w-16 h-16 object-cover rounded-md"
    //                     />
    //                   ) : (
    //                     <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
    //                       <span className="text-xs">No Img</span>
    //                     </div>
    //                   )}
    //                 </td>
    //                 <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
    //                 <td className="px-6 py-4 text-sm text-gray-600 italic">{item.scientific_name}</td>
    //                 <td className="px-6 py-4 text-sm text-gray-700">{item.category}</td>
    //                 <td className="px-6 py-4">
    //                   <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(item.risk_level)}`}>
    //                     {item.risk_level}
    //                   </span>
    //                 </td>
    //                 <td className="px-6 py-4 text-sm text-gray-700">
    //                   {item.plant_types && item.plant_types.length > 0 ? (
    //                     <div className="flex flex-wrap gap-1">
    //                       {item.plant_types.map((pt) => (
    //                           <span key={pt.id} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100">
    //                             {pt.name}
    //                           </span>
    //                       ))}
    //                     </div>
    //                   ) : (
    //                     <span className="text-gray-400 italic">None</span>
    //                   )}
    //                 </td>
    //                 {/* <td className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tanaman Terserang</td> */}
    //                 <td className="px-6 py-4">
    //                   <div className="flex items-center justify-center gap-3">
    //                     <Link href={`/admin/pest/${item.id}`} className="text-gray-600 hover:text-green-600 transition-colors">
    //                       <Edit2 className="w-5 h-5" />
    //                     </Link>
    //                     <button onClick={() => {
    //                       setSelectedItem({'id': item.id, 'name': item.name})
    //                       setDeleteModal(true)
    //                     }} className="text-gray-600 hover:text-red-600 transition-colors">
    //                       <Trash2 className="w-5 h-5" />
    //                     </button>
    //                   </div>
    //                 </td>
    //               </tr>
                ))}

        </div>

        
           {
                      pests.last_page >= 2 ? (        
                      <div className="py-12 px-4">
                      {pests.links.map(link =>
                          link.url ? (
                              <Link
                                  className={`p-1 mx-1 ${link.active ? 'text-blue-500 font-bold' : ''}`}
                                  key={link.label}
                                  href={link.url}
                                  dangerouslySetInnerHTML={{ __html: link.label }} />
                          ) : (
                              <span
                                  className="p-1 mx-1 text-slate-300"
                                  key={link.label}
                                  dangerouslySetInnerHTML={{ __html: link.label }} ></span>
                          )
                      ) }
                      </div>
                      ): (<></>)
                    }
          </div>

    <DeleteConfirmationModal isOpen={deleteModal} onClose={() => {
      setDeleteModal(false)
      setSelectedItem({'id': 0, 'name': ''});
    }} onConfirm={() => {
      console.log(`/admin/pest/${selectedItem.id}`)
      router.delete(`/admin/pest/${selectedItem.id}`);
      setDeleteModal(false)

    }} itemName={selectedItem.name}/>

    <AdminNotificationToast notifications={notifications} removeNotification={removeNotification}/>
    </>
  );
}

KelolaDataHama.layout = (page: React.ReactElement) => (
  <AdminLayout page_title='pest'>
    {page}
  </AdminLayout>
)
