import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare, Settings } from 'lucide-react';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function HamaSenseDashboard() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const menuItems = [
    { icon: Home, label: 'Dashboard' },
    { icon: Users, label: 'Kelola Pengguna' },
    { icon: Sprout, label: 'Kelola Tanaman' },
    { icon: Bug, label: 'Kelola Hama' },
    { icon: FileText, label: 'Kelola Artikel' },
    { icon: MessageSquare, label: 'Kelola Komunitas' },
    { icon: Settings, label: 'Pengaturan' }
  ];

  const chartData = [
    { month: 'JAN', value: 400 },
    { month: 'FEB', value: 450 },
    { month: 'MAR', value: 550 },
    { month: 'APR', value: 500 },
    { month: 'MAY', value: 600 },
    { month: 'JUN', value: 650 },
    { month: 'JUL', value: 700 },
    { month: 'AUG', value: 680 }
  ];

  const statsCards = [
    {
      title: 'Total Deteksi Hama',
      value: '150',
      icon: Bug,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Pengguna Aktif',
      value: '150',
      icon: Users,
      bgColor: 'bg-white',
      iconColor: 'text-gray-700'
    },
    {
      title: 'Akurasi AI',
      value: '80%',
      icon: '⚠️',
      bgColor: 'bg-white',
      iconColor: 'text-gray-700',
      isEmoji: true
    },
    {
      title: 'Total Artikel',
      value: '150',
      icon: FileText,
      bgColor: 'bg-white',
      iconColor: 'text-gray-700'
    }
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

        {/* Dashboard Content */}
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statsCards.map((card, index) => (
              <div
                key={index}
                className={`${card.bgColor} rounded-lg shadow-sm p-6`}
              >
                <div className="flex items-center justify-between mb-3">
                  {card.isEmoji ? (
                    <span className="text-2xl">{card.icon}</span>
                  ) : (
                    <card.icon className={`w-6 h-6 ${card.iconColor}`} />
                  )}
                </div>
                <div className="text-sm text-gray-600 mb-2">{card.title}</div>
                <div className="text-3xl font-bold text-gray-800">{card.value}</div>
              </div>
            ))}
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Tren Deteksi Hama</h2>
            <div className="h-96">
              {/* <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                  />
                  <YAxis 
                    tick={{ fill: '#666', fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                    domain={[0, 1000]}
                    ticks={[100, 200, 300, 400, 500, 600, 700, 800, 900]}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      padding: '10px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}