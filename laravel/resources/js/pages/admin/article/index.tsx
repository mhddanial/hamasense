import React, { useState } from "react";
import {Calendar, SquarePen, Trash2, User} from 'lucide-react';
import { Link, router } from "@inertiajs/react";
import AdminLayout from "@/components/admin/layout";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmModal";
import { PageProps } from '@inertiajs/core';

import { Article } from "@/types/admin";
import NavSearch from "@/components/admin/NavSearch";

interface Props extends PageProps {
articles: Article[]
}

const KelolaArtikel = ({ articles }: Props) => {

const [ searchTerm, setSearchTerm ] = useState("");

console.log(articles)
// operation state
const [selectedItem, setSelectedItem] = useState({
'id': 0,
'name': ''
});
const [ deleteModal, setDeleteModal ] = useState(false);

return (
<>

    {/* <ItemHeaderDemo></ItemHeaderDemo> */}
    <div className="flex-1 min-h-screen p-8">
        <NavSearch href='/admin/article/create' title='Kelola Artikel' onChange={(e)=> {
            setSearchTerm(e.target.value)
            }} search_term={searchTerm} button_title="Tambah Artikel" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.data.map((article) => (
                <div key={article.id}
                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1 flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-teal-50 to-green-50">
                        <img src={article.image} alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                        {article.category && (
                        <span
                            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                            {article.category.name}
                        </span>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col">
                        {/* Title & Author */}
                        <div className="mb-3">
                            <h3 className="text-base font-bold text-gray-900 line-clamp-2 mb-2 leading-tight">
                                {article.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <User className="w-3.5 h-3.5" />
                                <span>{article.writer.name}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-gray-700 line-clamp-3 mb-4 flex-1">
                            {article.content}
                        </p>

                        {/* Footer - Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{new Date(article.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                    })}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                <Link href={`/admin/article/${article.id}`}
                                    className="p-2 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                    title="Edit artikel">
                                <SquarePen size={16} />
                                </Link>
                                <button onClick={()=> {
                                    setSelectedItem({'id': article.id, 'name': article.title})
                                    setDeleteModal(true);
                                    }}
                                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg
                                    transition-colors"
                                    title="Hapus artikel"
                                    >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            {
            articles.last_page >= 2 ? ( <div className="py-12 px-4">
                {articles.links.map(link =>
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
        setSelectedItem({'id': 0, 'name': ''});
        }} onConfirm={() =>
        {
        // console.log(`/admin/pest/${selectedItem.id}`);
        router.delete(`/admin/article/${selectedItem.id}`);
        setDeleteModal(false)

        }} itemName={selectedItem.name}/>
</>
);

};

export default KelolaArtikel;

KelolaArtikel.layout = (page: React.ReactElement) => (
<AdminLayout page_title="article">
    {page}
</AdminLayout>
)
