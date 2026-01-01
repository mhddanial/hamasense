import React, { useState } from 'react';
import { PageProps } from '@inertiajs/core';
import { Paperclip, Upload, Plus, Trash2 } from 'lucide-react';
import { Category, Article } from '@/types/admin';
import { router, useForm } from '@inertiajs/react';
import AdminLayout from '@/components/admin/layout';
import { UpdateConfirmationModal } from '@/components/admin/UpdateConfirmModal';
import { DeleteConfirmationModal } from '@/components/admin/DeleteConfirmModal';
import { Editor } from '@/components/blocks/editor-00/editor';

type Reference = {
  source_name: string;
  url: string;
};

interface Props extends PageProps {
  article: Article;
  articles: Article[];
  categories: Category[];
}


export default function EditArtikel({ article, categories, articles }: Props) {
  // Initialize uploadedImage with the article's existing image URL
  const [uploadedImage, setUploadedImage] = useState<string>(
    typeof article.image === 'string' ? article.image : ''
  );
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [ errors, setErrors ] = useState<Record<string, string>>({}); 

  const { data, setData, delete: destroy } = useForm({
    'image': article.image as string | File | null,
    'title': article.title,
    'category_id': article.category_id,
    'related_article_ids': article.related_article_ids || [],
    'content': article.content,
    'slug': article.slug,
    'references': (article.references || []) as Reference[],
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('image', file);
      setUploadedImage(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { value, name } = e.target;
    setData(name as any, value);
  };

  const isContentEmpty = (content: string) => {
    const div = document.createElement('div');
    div.innerHTML = content;
    return div.textContent?.trim().length === 0;
  }   

  const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!data.title.trim()) {
          console.log(1)
            newErrors.title = 'Judul artikel wajib diisi';
        }

        if (isContentEmpty(data.content)) {
          newErrors.content = 'Konten artikel wajib diisi';
        }

        if (!data.category_id) {
            newErrors.category_id = 'Kategori belum dipilih';
          console.log(3)

          }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

  const addReference = () => {
    setData('references', [...data.references, { source_name: '', url: '' }]);
  };

  const removeReference = (index: number) => {
    const newRefs = data.references.filter((_, i) => i !== index);
    setData('references', newRefs);
  };

  const updateReference = (index: number, field: keyof Reference, value: string) => {
    const newRefs = [...data.references];
    newRefs[index] = { ...newRefs[index], [field]: value };
    setData('references', newRefs);
  };

  // Handle rich text editor content change
  const handleContentChange = (html: string) => {
    setData('content', html);
  };

  const handleSubmit = () => {
    if(!validate()) return;
    
    router.post(`/admin/article/${article.id}`, {
      _method: 'patch',
      ...data
    }, {
      forceFormData: true,
    });
  }

  return (
    <>
      {/* Isi konten yang harus diinput oleh admin */}
      <div className="min-h-screen space-y-6 p-8 font-sans bg-gray-50">

        {/* Edit Artikel */}
        <div className="flex items-center">
          <h1 className="text-3xl text-gray-900 font-bold">Edit Artikel</h1>
        </div>

        {/* Form upload foto */}
        <div className="grid grid-cols-1 lg:grid-cols-2 overflow-auto gap-8 text-gray-900">
          <div>
            <div className="flex rounded-lg overflow-hidden">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center w-full justify-center">
                <h3 className="text-lg font-semibold mb-6">Upload Foto</h3>
                {uploadedImage ? (
                  <div className="mb-4">
                    <img
                      src={uploadedImage}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  <button type='button'
                      onClick={(e) => {
                        e.preventDefault();
                        setData('image', null);
                        setUploadedImage('');
                      }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Hapus gambar
                    </button>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="flex justify-center mb-6">
                      <Upload className="w-16 h-16 text-gray-400" />
                    </div>
                    <p className="text-gray-700 font-medium mb-2">Seret atau unggah gambar</p>
                    <p className="text-sm text-gray-400 mb-6">
                      atau klik tombol dibawah ini untuk memilih file
                    </p>
                  </div>
                )}

                <label className="inline-flex items-center gap-2 px-6 py-2.5 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors mx-auto">
                  <Paperclip className="w-5 h-5" />
                  <span className="font-medium">Pilih File</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Judul Artikel
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    placeholder="Masukkan judul artikel..."
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 ${ errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
                  />
                  {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Kategori
                  </label>
                  <select
                    name="category"
                    value={data.category_id}
                    onChange={(e) => setData('category_id', +e.target.value)}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-gray-900 ${ errors.category_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
                  >
                    <option value="">Pilih kategori...</option>
                    {categories.map((cat, index) => (
                      <option key={index} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  {errors.category_id && <div className="text-red-500 text-sm mt-1">{errors.category_id}</div>}
                </div>
              </div>

              {/* Related Articles */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Artikel Terkait</label>
                <select
                  multiple
                  value={data.related_article_ids.map(String)}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                    setData('related_article_ids', selected);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none bg-white h-32"
                >
                  {articles && articles.map((article) => (
                    <option key={article.id} value={article.id}>{article.title}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>


        {/* Content - Rich Text Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Konten Artikel
          </label>
          <div
            className={`w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white ${ errors.content ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-teal-500'}`}
          >
            <Editor
              initialHtml={article.content}
              onHtmlChange={handleContentChange}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Gunakan toolbar di atas untuk memformat teks. Konten saat ini akan ditampilkan dalam editor.
          </p>
          {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
        </div>

        {/* References */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Referensi Sumber
            </label>
            <button
              type="button"
              onClick={addReference}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Referensi
            </button>
          </div>

          {data.references.length === 0 && (
            <p className="text-sm text-gray-500 italic">Belum ada referensi. Klik tombol di atas untuk menambah.</p>
          )}

          <div className="space-y-3">
            {data.references.map((ref, index) => (
              <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Nama Sumber</label>
                    <input
                      type="text"
                      value={ref.source_name}
                      onChange={(e) => updateReference(index, 'source_name', e.target.value)}
                      placeholder="Contoh: FAO, Jurnal Pertanian"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">URL</label>
                    <input
                      type="url"
                      value={ref.url}
                      onChange={(e) => updateReference(index, 'url', e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeReference(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-2">
          <button
            onClick={() => { setDeleteModal(true); }}
            className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Hapus
          </button>
          <button
            onClick={() => { setUpdateModal(true); }}
            className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Update
          </button>
        </div>
      </div>

      <DeleteConfirmationModal isOpen={deleteModal} onClose={() => {
        setDeleteModal(false)
      }} onConfirm={() => {
        console.log(`/admin/article/${article.id}`);
        destroy(`/admin/article/${article.id}`);
        setDeleteModal(false)
      }} itemName={article.title} />

      <UpdateConfirmationModal isOpen={updateModal} onClose={() => {
        setUpdateModal(false)
      }} onConfirm={() => {
        handleSubmit();
        setUpdateModal(false);
      }} itemName={article.title} />
    </>
  );
}

EditArtikel.layout = (page: React.ReactElement) => (
  <AdminLayout>
    {page}
  </AdminLayout>
);