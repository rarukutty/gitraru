import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Users, Map, DollarSign, Globe, TrendingUp, ArrowUp } from 'lucide-react';
import Card from '../components/ui/Card';
import { adminStats, monthlyData, popularDestinationsData } from '../data/seed';

const PIE_COLORS = ['#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

function StatCard({ icon: Icon, label, value, change, color }: {
  icon: React.ElementType; label: string; value: string; change: string; color: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <div className="flex items-center gap-1 mt-1.5">
            <ArrowUp className="w-3 h-3 text-emerald-500" />
            <span className="text-xs text-emerald-500 font-medium">{change}</span>
            <span className="text-xs text-gray-400 ml-0.5">vs last month</span>
          </div>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
}

export default function AdminPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Platform analytics and insights</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={adminStats.totalUsers.toLocaleString()} change="+12.5%" color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
        <StatCard icon={Map} label="Active Trips" value={adminStats.activeTrips.toLocaleString()} change="+8.3%" color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" />
        <StatCard icon={DollarSign} label="Revenue (USD)" value={`$${(adminStats.totalRevenue / 1000).toFixed(0)}K`} change="+18.7%" color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" />
        <StatCard icon={Globe} label="Destinations" value={adminStats.destinations.toString()} change="+5.2%" color="bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400" />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h2 className="font-semibold text-gray-900 dark:text-white">Monthly Growth</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="tripsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(17,24,39,0.9)', border: 'none', borderRadius: 12, color: '#f9fafb', fontSize: 12 }}
              />
              <Legend />
              <Area type="monotone" dataKey="users" name="Users" stroke="#3b82f6" strokeWidth={2} fill="url(#usersGrad)" />
              <Area type="monotone" dataKey="trips" name="Trips" stroke="#10b981" strokeWidth={2} fill="url(#tripsGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Popular Destinations</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={popularDestinationsData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {popularDestinationsData.map((_, index) => (
                  <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(17,24,39,0.9)', border: 'none', borderRadius: 12, color: '#f9fafb', fontSize: 12 }}
                formatter={(value: number) => [`${value}%`, '']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1.5">
            {popularDestinationsData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i] }} />
                <span className="text-gray-600 dark:text-gray-400 flex-1">{d.name}</span>
                <span className="font-medium text-gray-900 dark:text-white">{d.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Revenue chart */}
      <Card className="p-5">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-5">Revenue Analytics</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(156,163,175,0.2)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000).toFixed(0)}K`} />
            <Tooltip
              contentStyle={{ background: 'rgba(17,24,39,0.9)', border: 'none', borderRadius: 12, color: '#f9fafb', fontSize: 12 }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent activity table */}
      <Card className="overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-gray-900 dark:text-white">Recent Users</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/60">
                {['User', 'Location', 'Trips', 'Spend', 'Joined'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { name: 'Sarah Johnson', location: 'New York, USA', trips: 8, spend: '$4,200', joined: 'Jan 2025' },
                { name: 'Marcus Chen', location: 'San Francisco, USA', trips: 5, spend: '$2,800', joined: 'Feb 2025' },
                { name: 'Elena Vasquez', location: 'Madrid, Spain', trips: 12, spend: '$7,100', joined: 'Dec 2024' },
                { name: 'Amir Patel', location: 'Mumbai, India', trips: 3, spend: '$1,400', joined: 'Mar 2025' },
                { name: 'Lisa Kim', location: 'Seoul, Korea', trips: 6, spend: '$3,600', joined: 'Jan 2025' },
              ].map(user => (
                <tr key={user.name} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-semibold text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{user.location}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-900 dark:text-white font-medium">{user.trips}</td>
                  <td className="px-5 py-3.5 text-sm text-emerald-600 dark:text-emerald-400 font-medium">{user.spend}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500 dark:text-gray-400">{user.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
