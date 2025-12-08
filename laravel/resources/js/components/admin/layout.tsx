import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare, Settings, Search, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import plant from '@/routes/plant';

export default function AdminLayout({children, page_title}: {children: React.ReactNode, page_title: string}) {

  const menuItems = [
    { icon: Home, label: 'Beranda' , title: ''},
    { icon: Users, label: 'Kelola Pengguna', title: 'user'},
    { icon: Sprout, label: 'Kelola Tanaman', title: 'plant'},
    { icon: Bug, label: 'Kelola Hama', title: 'pest'},
    { icon: FileText, label: 'Kelola Artikel', title: 'article'},
    { icon: MessageSquare, label: 'Kelola Komunitas', title:'community'},
    { icon: Settings, label: 'Pengaturan', title:'setting'}
  ];

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
            <Link href={'/admin/' + item.title}
              key={item.label}
              onClick={() => setActiveMenu(item.label)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                page_title === item.title
                  ? 'bg-white text-teal-800 font-medium'
                  : 'text-white hover:bg-teal-700'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
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
            {children}
        </div>
      </div>
    </div>
  );
}