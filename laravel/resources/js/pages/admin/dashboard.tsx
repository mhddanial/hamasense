import React from 'react';
import { router } from '@inertiajs/react';
import {
  Users,
  Bug,
  FileText,
  MessageSquare,
  Sprout,
  Activity,
  TrendingUp,
  UserPlus
} from 'lucide-react';
import AdminLayout from '@/components/admin/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface Stats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalDetections: number;
  totalArticles: number;
  totalPests: number;
  totalCommunityPosts: number;
  totalPlantTypes: number;
}

interface DetectionByLabel {
  name: string;
  value: number;
  [key: string]: string | number;
}

interface RecentDetection {
  id: number;
  label: string;
  confidence: number | null;
  created_at: string;
  user: {
    name: string;
    avatar: string;
  } | null;
}

interface DashboardProps {
  detectionTrend: { month: string; value: number }[];
  selectedYear: number;
  stats: Stats;
  detectionByLabel: DetectionByLabel[];
  recentDetections: RecentDetection[];
}

// Colors for pie chart
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function HamaSenseDashboard({
  detectionTrend = [],
  selectedYear,
  stats = {
    totalUsers: 0,
    newUsersThisMonth: 0,
    totalDetections: 0,
    totalArticles: 0,
    totalPests: 0,
    totalCommunityPosts: 0,
    totalPlantTypes: 0,
  },
  detectionByLabel = [],
  recentDetections = []
}: DashboardProps) {

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.get(route('admin.dashboard'), { year: e.target.value }, { preserveState: true, preserveScroll: true });
  };

  const statsCards = [
    {
      title: 'Total Deteksi',
      value: stats.totalDetections,
      icon: Activity,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Pengguna Aktif',
      value: stats.totalUsers,
      subtitle: `+${stats.newUsersThisMonth} bulan ini`,
      icon: Users,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Total Hama',
      value: stats.totalPests,
      icon: Bug,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50'
    },
    {
      title: 'Total Artikel',
      value: stats.totalArticles,
      icon: FileText,
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Post Komunitas',
      value: stats.totalCommunityPosts,
      icon: MessageSquare,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      title: 'Jenis Tanaman',
      value: stats.totalPlantTypes,
      icon: Sprout,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];


  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Admin</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Selamat datang! Berikut ringkasan aktivitas aplikasi Hamasense.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Real-time Data</span>
          </div>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statsCards.map((card, index) => (
            <Card
              key={index}
              className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              <CardContent className="flex flex-col items-center text-center">
                <div className={`p-2.5 rounded-xl ${card.bgColor} mb-3`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{card.title}</p>
                  {card.subtitle && (
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <UserPlus className="w-3 h-3 text-emerald-500" />
                      <span className="text-xs text-emerald-600 font-medium">{card.subtitle}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line Chart - Detection Trend */}
          <Card className="lg:col-span-2 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-semibold">Tren Deteksi Hama</CardTitle>
              <select
                value={selectedYear}
                onChange={handleYearChange}
                className="border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800"
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={detectionTrend}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <YAxis
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      axisLine={{ stroke: '#e5e7eb' }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      labelStyle={{ fontWeight: 600 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: '#3b82f6', r: 4, strokeWidth: 2, stroke: '#fff' }}
                      activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                      fill="url(#colorValue)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart - Detection by Label */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Distribusi Deteksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {detectionByLabel.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={detectionByLabel}
                        cx="50%"
                        cy="45%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                        dataKey="value"
                        label={({ name, percent = 0 }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        labelLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                      >
                        {detectionByLabel.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Belum ada data deteksi</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentDetections.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 dark:border-gray-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Pengguna</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Hasil Deteksi</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Kepercayaan</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentDetections.map((detection) => (
                      <tr
                        key={detection.id}
                        className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={detection.user?.avatar} alt={detection.user?.name} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">
                                {detection.user?.name?.charAt(0).toUpperCase() || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {detection.user?.name || 'Unknown User'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline" className="font-medium">
                            {detection.label}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          {detection.confidence !== null ? (
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${detection.confidence >= 80 ? 'bg-emerald-500' :
                                    detection.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500'
                                    }`}
                                  style={{ width: `${detection.confidence}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-300">
                                {detection.confidence}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">N/A</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                          {detection.created_at}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <Activity className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Belum ada aktivitas deteksi terbaru</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}