import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Home, Users, Sprout, Bug, FileText, MessageSquare, Settings } from 'lucide-react';
import AdminLayout from '@/components/admin/layout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  detectionTrend: { month: string; value: number }[];
  selectedYear: number;
}

export default function HamaSenseDashboard({ detectionTrend = [], selectedYear }: DashboardProps) {
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


  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.get(route('admin.dashboard'), { year: e.target.value }, { preserveState: true, preserveScroll: true });
  };


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
    <AdminLayout>

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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Tren Deteksi Hama</h2>
              <select 
                value={selectedYear} 
                onChange={handleYearChange}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={detectionTrend}
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
                    domain={[0, 100]}
                    ticks={[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
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
              </ResponsiveContainer>
            </div>
          </div>
        </div>
    </AdminLayout>
  );
}