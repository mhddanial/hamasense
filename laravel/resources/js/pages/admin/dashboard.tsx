import React, { useState } from 'react';
import { Menu, Bell, User, Home, Users, Sprout, Bug, FileText, MessageSquare, Settings } from 'lucide-react';
import AdminLayout from '@/components/admin/layout';
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
    <AdminLayout page_title=''>

      {/* Main Content */}

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
    </AdminLayout>
  );
}