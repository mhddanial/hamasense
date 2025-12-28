import React, { useEffect, useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { PageProps } from '@inertiajs/core';
import { Disease } from '@/types/admin';
import { AdminNotificationToast } from '@/components/admin/InformationToast';
import { ItemHeaderDemo } from '@/components/admin/card';
import NavSearch from '@/components/admin/NavSearch';

// Pagination Link Type
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Paginated Response Type
interface PaginatedDiseases {
    data: Disease[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props extends PageProps {
    diseases: PaginatedDiseases;
}

export default function KelolaDataPenyakit({ diseases }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [notifications, setNotifications] = useState<any[]>([]);

    const { flash } = usePage().props;

    const success = flash?.success;
    const error = flash?.error;

    useEffect(() => {
        if (success) {
            setNotifications((prev) => [...prev, { type: 'success', message: success }])
        }
        if (error) {
            setNotifications((prev) => [...prev, { type: 'error', message: error }])
        }
    }, [success, error]);

    const [selectedItem, setSelectedItem] = useState({
        'id': 0,
        'name': ''
    });

    const [deleteModal, setDeleteModal] = useState(false);

    const removeNotification = (id: number) => {
        setNotifications(prev => prev.filter(notif => notif.id !== id));
    };

    // Get diseases data safely
    const diseasesData = diseases?.data || [];

    return (
        <>
            <div className="flex-1 min-h-screen p-8">

                <NavSearch href='/admin/disease/create' title='Kelola Penyakit' onChange={(e) => { setSearchTerm(e.target.value) }} search_term={searchTerm} button_title="Tambah Data Penyakit" />

                {/* Table */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {diseasesData.map((disease) => (
                        <ItemHeaderDemo
                            key={disease.id}
                            id={disease.id}
                            name={disease.name}
                            img_path={'disease'}
                            filename={disease.img_path}
                            scientific_name={disease.label || '-'}
                            delete_onclick={() => {
                                setSelectedItem({
                                    'id': disease.id,
                                    'name': disease.name
                                });
                                setDeleteModal(true);
                            }}
                        />
                    ))}

                    {/* Empty State */}
                    {diseasesData.length === 0 && (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500 text-lg">Tidak ada data Penyakit yang ditemukan</p>
                        </div>
                    )}
                </div>
            </div>
            <DeleteConfirmationModal isOpen={deleteModal} onClose={() => {
                setDeleteModal(false)
                setSelectedItem({ 'id': 0, 'name': '' });
            }} onConfirm={() => {
                router.delete(`/admin/disease/${selectedItem.id}`);
                setDeleteModal(false)

            }} itemName={selectedItem.name} />

            <AdminNotificationToast notifications={notifications} removeNotification={removeNotification} />
        </>
    );
}

KelolaDataPenyakit.layout = (page: React.ReactElement) => (
    <AdminLayout>
        {page}
    </AdminLayout>
)
