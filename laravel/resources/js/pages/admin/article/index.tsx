import React, { useState } from "react";
import {SquarePen, Trash2} from 'lucide-react';

const KelolaArtikel = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua kategori");
  const [date, setDate] = useState("");

  const articles = [
    {
      id: 1,
      title: "Teknologi baru pengendalian hama cabai",
      category: "Teknologi",
      author: "Budi Santoso",
      source: "pertanian.go.id",
      date: "2025-10-10",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/69/Chili_peppers.jpg",
    },
    {
      id: 2,
      title: "Teknologi baru pengendalian hama cabai",
      category: "Teknologi",
      author: "Budi Santoso",
      source: "pertanian.go.id",
      date: "2025-10-28",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/69/Chili_peppers.jpg",
    },
    {
      id: 3,
      title: "Teknologi baru pengendalian hama cabai",
      category: "Berita",
      author: "Budi Santoso",
      source: "pertanian.go.id",
      date: "2025-10-28",
      image: "https://upload.wikimedia.org/wikipedia/commons/6/69/Chili_peppers.jpg",
    },
  ];

  const filteredArticles = articles.filter((article) => {
    const matchSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.author.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      category === "Semua kategori" || article.category === category;
    const matchDate = date === "" || article.date === date;
    return matchSearch && matchCategory && matchDate;
  });

  return (
    <div className="flex-1 bg-gray-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-2xl p-6">
        <h1 className="text-2xl font-bold mb-2">Kelola Artikel</h1>
        <p className="text-gray-600 mb-6">
          Artikel yang dikurasi dari berbagai sumber ahli pertanian.
        </p>

        {/* Search & Filter */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 w-full md:w-1/2">
            <input
              type="text"
              placeholder="Cari berdasarkan nama, ilmiah, atau tanaman..."
              className="bg-transparent outline-none w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2"
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
            className="border border-gray-300 rounded-lg px-3 py-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-800 ml-auto">
            + Tambah Artikel
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-4 py-3 w-24">Gambar</th>
                <th className="text-left px-4 py-3">Judul</th>
                <th className="text-left px-4 py-3">Kategori</th>
                <th className="text-left px-4 py-3">Sumber</th>
                <th className="text-left px-4 py-3">Tanggal</th>
                <th className="text-center px-4 py-3">Aksi</th>
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
                  <td className="px-4 py-3">{article.title}</td>
                  <td className="px-4 py-3">{article.category}</td>
                  <td className="px-4 py-3">{article.source}</td>
                  <td className="px-4 py-3">{article.date}</td>
                  <td className="px-4 py-3 flex items-center justify-center gap-3">
                    <button className="text-blue-600 hover:text-blue-800">
                      <SquarePen size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredArticles.length === 0 && (
                <tr>
                  <td className="text-center text-gray-500 py-4">
                    Tidak ada artikel ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KelolaArtikel;
