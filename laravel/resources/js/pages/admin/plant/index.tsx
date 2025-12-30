import React, { useEffect, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';

import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';

import { PageProps } from '@inertiajs/core';
import { Plant } from '@/types/admin';
import { ItemHeaderDemo } from '@/components/admin/card';
import NavSearch from '@/components/admin/NavSearch';
import { AdminNotificationToast } from '@/components/admin/InformationToast';

interface Props extends PageProps {
plants: Plant[];
}


export default function KelolaTanaman({ plants } : Props) {
console.log(plants)
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

        const removeNotification = (id) => {
            setNotifications(prev => prev.filter(notif => notif.id !== id));
        };
const [ selectedItem, setSelectedItem ] = useState({
'identifier': '',
'name': ''
});

const [ deleteModal, setDeleteModal ] = useState(false);

console.log(plants)



return (
<>

    {/* Main Content */}
    <div className="flex-1 min-h-screen p-8">

        <NavSearch href='/admin/plant/create' title='Kelola Tanaman' button_title="Tambah Tanaman" page='plant' />

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/*
            <ItemHeaderDemo models={plants} name='name' img_path='img_path' description='description' /> */}

            {plants.data.map((plant) => (<>
                <ItemHeaderDemo id={plant.id} filename={plant.img_path} name={plant.name} img_path='plant' slug={plant.slug}
                    scientific_name={plant.scientific_name} delete_onclick={()=> {
                    setSelectedItem({
                    'identifier': plant.slug,
                    'name': plant.name
                    });
                    setDeleteModal(true);
                    }}/>
            </>))}

        </div>

        {/* Empty State */}
        {plants.data.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">Tidak ada tanaman yang ditemukan</p>
        </div>
        )}


        {
        plants.last_page >= 2 ? ( <div className="py-12 px-4">
            {plants.links.map(link =>
            link.url ? (
            <Link className={`p-1 mx-1 ${link.active ? 'text-blue-500 font-bold' : '' }`} key={link.label}
                href={link.url} dangerouslySetInnerHTML={{ __html: link.label }} />
            ) : (
            <span className="p-1 mx-1 text-slate-300" key={link.label}
                dangerouslySetInnerHTML={{ __html: link.label }}></span>
            )
            ) }
        </div>
        ): (<></>)
        }
    </div>



    <DeleteConfirmationModal isOpen={deleteModal} onClose={()=> {
        setDeleteModal(false)
        setSelectedItem({'identifier': '', 'name': ''});
        }} onConfirm={() => {
        router.delete(`/admin/plant/${selectedItem.identifier}`);
        setDeleteModal(false)

        }} itemName={selectedItem.name}/>

    <AdminNotificationToast notifications={notifications} removeNotification={removeNotification}/>
        
</>
);
}

KelolaTanaman.layout = (page: React.ReactElement) => (
<AdminLayout page_title='plant'>
    {page}
</AdminLayout>
)
