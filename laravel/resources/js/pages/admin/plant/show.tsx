import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare } from 'lucide-react';
import { useForm, usePage } from '@inertiajs/react';

export default function EditInformasiTanaman() {
  const [activeMenu, setActiveMenu] = useState('Kelola Tanaman');
  const [formData, setFormData] = useState({
    namaTumbuhan: 'Tomat',
    namaLatin: 'Solanum lycopersicum',
    kategori: 'Buah',
    detail: 'Tomat (Solanum lycopersicum) adalah buah yang sering digunakan sebagai sayuran dalam masakan. Tanaman ini berasal dari Amerika Selatan dan termasuk keluarga Solanaceae.'
  });

  

  const { props } = usePage();
  const { plant } = props;

  console.log(plant)

  const { data, setData, submit } = useForm({
    name: plant.name,
    scientific_name: plant.scientific_name,
    detail: plant.detail
  }); 

  

  const menuItems = [
    { icon: Home, label: 'Beranda' },
    { icon: Users, label: 'Kelola Pengguna' },
    { icon: Sprout, label: 'Kelola Tanaman' },
    { icon: Bug, label: 'Info Hama' },
    { icon: MessageSquare, label: 'Komunitas' },
    { icon: FileText, label: 'Artikel' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    console.log('Updated Data:', formData);
    alert('Data tanaman berhasil diupdate!');
  };

  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus tanaman ini?')) {
      
      submit('delete', `/admin/plant/${id}`)

      console.log('Deleted');
      alert('Data tanaman berhasil dihapus!');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-teal-800 to-teal-900 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-teal-700">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Sprout className="w-5 h-5 text-teal-800" />
          </div>
          <span className="text-xl font-bold">HAMASENSE</span>
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                activeMenu === item.label
                  ? 'bg-white text-teal-800 font-medium'
                  : 'text-white hover:bg-teal-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 mb-4">
          <div className="bg-teal-700 rounded-lg p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-teal-200">▼</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="lg:hidden">
              <Menu className="w-6 h-6" />
            </button>
            <input
              type="text"
              placeholder="Cari disini"
              className="px-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative">
              <Bell className="w-6 h-6 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-600" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-8">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Edit Informasi tanaman</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Image */}
              <div>
                <div className="rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&h=600&fit=crop"
                    alt="Tomat"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>

              {/* Right Column - Form */}
              <div>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={data.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        scientific name
                      </label>
                      <input
                        type="text"
                        name="scientific_name"
                        value={data.scientific_name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 italic"
                      />
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori
                    </label>
                    <input
                      type="text"
                      name="kategori"
                      value={formData.kategori}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Detail
                    </label>
                    <textarea
                      name="detail"
                      value={data.detail}
                      onChange={handleInputChange}
                      rows="8"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                    ></textarea>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button 
                      onClick={() => {
                        handleDelete(plant.id)
                      }}
                      className="px-8 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                    >
                      Hapus
                    </button>
                    <button 
                      onClick={handleUpdate}
                      className="px-8 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}