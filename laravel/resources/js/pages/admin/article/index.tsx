import React, { useState } from "react";
import {SquarePen, Trash2} from 'lucide-react';
import { Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/components/admin/layout";
import { DeleteConfirmationModal } from "@/components/admin/DeleteConfirmModal";
import { PageProps } from '@inertiajs/core';

import { Article } from "@/types/admin";

interface Props extends PageProps {
  articles: Article[]
}

const KelolaArtikel = ({ articles }: Props) => {
  // search state
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua kategori");
  const [date, setDate] = useState("");

  // operation state
  const [selectedItem, setSelectedItem] = useState({
    'id': 0,
    'name': ''
  });
  const [ deleteModal, setDeleteModal ] = useState(false);

  const filteredArticles = articles.filter((article) => {
    const matchSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.writer.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "Semua kategori" || article.category.name === category;
    const matchDate = date === "" || article.created_at === date;
    return matchSearch && matchCategory && matchDate;
  });

  return (
    <>
    <div className="flex-1 bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2 text-gray-900">Kelola Artikel</h1>
        <p className="text-gray-700 mb-6">
          Artikel yang dikurasi dari berbagai sumber ahli pertanian.
        </p>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full md:w-1/2">
            <input
              type="text"
              placeholder="Cari berdasarkan nama, ilmiah, atau tanaman..."
              className="bg-transparent outline-none w-full text-gray-900 placeholder:text-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Semua kategori</option>
            <option>Tips</option>
            <option>Lingkungan & Cuaca</option>
            <option>Berita</option>
            <option>Teknologi</option>
          </select>

          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <Link href={'/admin/article/create'} className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 ml-auto">
            + Tambah Artikel
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 w-24 text-gray-900 font-semibold">Gambar</th>
                <th className="text-left px-4 py-3 text-gray-900 font-semibold">Judul</th>
                <th className="text-left px-4 py-3 text-gray-900 font-semibold">Kategori</th>
                <th className="text-left px-4 py-3 text-gray-900 font-semibold">Sumber</th>
                <th className="text-left px-4 py-3 text-gray-900 font-semibold">Tanggal</th>
                <th className="text-center px-4 py-3 text-gray-900 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map((article) => (
                <tr
                  key={article.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <img
                      src={article.image}
                      alt="thumbnail"
                      className="w-16 h-12 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-900">{article.title}</td>
                  <td className="px-4 py-3 text-gray-900">{article.category.name}</td>
                  <td className="px-4 py-3 text-gray-900">{article.content}</td>
                  <td className="px-4 py-3 text-gray-900">{article.created_at}</td>
                  <td className="px-4 py-3 flex items-center justify-center gap-3">
                    <Link href={`/admin/article/${article.id}`} className="text-blue-600 hover:text-blue-800">
                      <SquarePen size={18} />
                    </Link>
                    <button onClick={() => {
                      setSelectedItem({'id': article.id, 'name': article.title})
                      setDeleteModal(true);
                    }} className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredArticles.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-gray-700 py-4">
                    Tidak ada artikel ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
            
              

    <DeleteConfirmationModal isOpen={deleteModal} onClose={() => {
          setDeleteModal(false)
          setSelectedItem({'id': 0, 'name': ''});
        }} onConfirm={() => {
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