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
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua Kategori');
  const [selectedLevel, setSelectedLevel] = useState('Semua Tingkat');

  const [notifications, setNotifications] = useState<any[]>([]);

  const { flash } = usePage().props;

  const success = flash?.success;
  const error = flash?.error;
  useEffect(() => {
    if(success){
      setNotifications((prev) => [...prev, success])}
    if(error){
      setNotifications((prev) => [...prev, error])}
    console.log(success)
    console.log(error)
    }
  , [success, error]);
  
  const [selectedItem, setSelectedItem] = useState({
    'id': 0,
    'name': ''
  });

  const [ deleteModal, setDeleteModal ] = useState(false);

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  // const filteredData = hamaData.filter(item => {
  //   const matchesSearch = item.namaHama.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //                        item.namaIlmiah.toLowerCase().includes(searchTerm.toLowerCase());
  //   const matchesCategory = selectedCategory === 'Semua Kategori' || item.kategori === selectedCategory;
  //   const matchesLevel = selectedLevel === 'Semua Tingkat' || item.tingkatBahaya === selectedLevel;
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
