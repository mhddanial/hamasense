import { Users, Bug, FileText} from 'lucide-react';
import AdminLayout from '@/components/admin/layout';
import { usePage } from '@inertiajs/react';



export default function HamaSenseDashboard() {

  const { detection_total, active_user, article_total, ai_accuracy } = usePage().props;


  const statsCards = [
    {
      title: 'Total Deteksi Hama',
      value: detection_total,
      icon: Bug,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Pengguna Aktif',
      value: active_user,
      icon: Users,
      bgColor: 'bg-white',
      iconColor: 'text-gray-700'
    },
    {
      title: 'Akurasi AI',
      value: `${ai_accuracy}%`,
      icon: '⚠️',
      bgColor: 'bg-white',
      iconColor: 'text-gray-700',
      isEmoji: true
    },
    {
      title: 'Total Artikel',
      value: article_total,
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