import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getStatistics, getOrders } from "../api";
import { FiUsers, FiShoppingCart, FiDollarSign, FiTrendingUp, FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [statsData, ordersData] = await Promise.all([
        getStatistics(),
        getOrders()
      ]);
      setStats(statsData);
      setRecentOrders(ordersData.slice(0, 5));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout title="لوحة التحكم">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  const statCards = [
    { title: "إجمالي المستخدمين", value: stats?.total_users || 0, icon: FiUsers, color: "bg-blue-500", change: "+12%" },
    { title: "إجمالي الطلبات", value: stats?.total_orders || 0, icon: FiShoppingCart, color: "bg-green-500", change: "+8%" },
    { title: "طلبات قيد الانتظار", value: stats?.pending_orders || 0, icon: FiClock, color: "bg-yellow-500", change: "" },
    { title: "طلبات مكتملة", value: stats?.completed_orders || 0, icon: FiCheckCircle, color: "bg-purple-500", change: "+15%" },
  ];

  const revenueData = [
    { name: "دولار", value: stats?.total_revenue_usd || 0, color: "#10b981" },
    { name: "ليرة سورية", value: (stats?.total_revenue_syp || 0) / 1000, color: "#8b5cf6" },
  ];

  const orderStatusData = [
    { name: "قيد الانتظار", value: stats?.pending_orders || 0, color: "#f59e0b" },
    { name: "مؤكدة", value: stats?.confirmed_orders || 0, color: "#3b82f6" },
    { name: "مكتملة", value: stats?.completed_orders || 0, color: "#10b981" },
    { name: "ملغية", value: stats?.cancelled_orders || 0, color: "#ef4444" },
  ];

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800" },
      confirmed: { text: "مؤكدة", className: "bg-blue-100 text-blue-800" },
      completed: { text: "مكتملة", className: "bg-green-100 text-green-800" },
      cancelled: { text: "ملغية", className: "bg-red-100 text-red-800" },
    };
    return badges[status] || badges.pending;
  };

  return (
    <Layout title="لوحة التحكم">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white overflow-hidden shadow-lg rounded-2xl hover:shadow-xl transition-shadow duration-300"
            data-testid={`stat-card-${index}`}
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className={`flex-shrink-0 ${card.color} rounded-lg p-3`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
                <div className="mr-4 flex-1">
                  <p className="text-sm font-medium text-gray-600 truncate">{card.title}</p>
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                    {card.change && (
                      <span className="mr-2 text-sm font-medium text-green-600">{card.change}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">الإيرادات الإجمالية</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">دولار أمريكي</p>
              <p className="text-2xl font-bold text-green-600">${stats?.total_revenue_usd || 0}</p>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">ليرة سورية</p>
              <p className="text-xl font-bold text-purple-600">{(stats?.total_revenue_syp || 0).toLocaleString()} ل.س</p>
            </div>
          </div>
        </div>

        {/* Order Status Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">حالة الطلبات</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Today's Stats */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 mb-8 text-white">
        <h3 className="text-2xl font-bold mb-4">إحصائيات اليوم 📊</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">طلبات اليوم</p>
            <p className="text-3xl font-bold">{stats?.today_orders || 0}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">إيرادات اليوم (دولار)</p>
            <p className="text-3xl font-bold">${stats?.today_revenue_usd || 0}</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm opacity-90">إيرادات اليوم (ليرة)</p>
            <p className="text-2xl font-bold">{(stats?.today_revenue_syp || 0).toLocaleString()} ل.س</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">أحدث الطلبات</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  رقم الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المنتج
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  السعر
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => {
                const badge = getStatusBadge(order.status);
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.transaction_code || order.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.user_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.product_type} {order.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${badge.className}`}>
                        {badge.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
