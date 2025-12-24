import { Pest } from '@/types/admin';
import { PageProps } from '@inertiajs/core';
import React, { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/layout';
import NavSearch from '@/components/admin/NavSearch';
import { ItemHeaderDemo } from '@/components/admin/card';
import { Link, router, usePage } from '@inertiajs/react';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { AdminNotificationToast } from '@/components/admin/InformationToast';


interface Props extends PageProps {
  pests: Pest[];
  search?: string;
}


export default function KelolaDataHama({pests, search} : Props) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [ deleteModal, setDeleteModal ] = useState(false);

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

    const removeNotification = (id: any) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    return (
        <>
            <div className="flex-1 min-h-screen p-8">
                <NavSearch href='/admin/pest/create' title='Kelola Hama' button_title="Tambah Data Hama" page="pest" search={search} />

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
