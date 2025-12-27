import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getUsers, blockUser } from "../api";
import { FiSearch, FiUser, FiShoppingBag, FiDollarSign, FiLock, FiUnlock } from "react-icons/fi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (searchTerm) {
      const filtered = users.filter(
        (user) =>
          user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.telegram_id.toString().includes(searchTerm)
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleBlockUser = async (userId) => {
    try {
      await blockUser(userId);
      await fetchUsers();
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("حدث خطأ أثناء تحديث حالة المستخدم");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SY", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <Layout title="إدارة المستخدمين">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="إدارة المستخدمين">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-lg p-3">
              <FiUser className="h-6 w-6 text-white" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
              <p className="text-3xl font-bold text-gray-900">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-lg p-3">
              <FiShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">إجمالي الطلبات</p>
              <p className="text-3xl font-bold text-gray-900">
                {users.reduce((sum, user) => sum + (user.total_orders || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-lg p-3">
              <FiDollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="mr-4">
              <p className="text-sm text-gray-600">إجمالي المبيعات</p>
              <p className="text-3xl font-bold text-gray-900">
                ${users.reduce((sum, user) => sum + (user.total_spent || 0), 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6 bg-white p-6 rounded-2xl shadow-lg">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="البحث عن مستخدم..."
            className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            data-testid="search-users-input"
          />
        </div>
        <div className="mt-4 text-sm text-gray-600">
          عرض {filteredUsers.length} من أصل {users.length} مستخدم
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الاسم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم المستخدم
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telegram ID
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  عدد الطلبات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  إجمالي المشتريات
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ التسجيل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    لا يوجد مستخدمين
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors" data-testid={`user-row-${user.id}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                            {user.first_name[0]}
                          </div>
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.first_name} {user.last_name || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      @{user.username || "غير متوفر"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.telegram_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.total_orders || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      ${(user.total_spent || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.is_blocked
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.is_blocked ? "محظور" : "نشط"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleBlockUser(user.id)}
                        className={`flex items-center ${
                          user.is_blocked
                            ? "text-green-600 hover:text-green-900"
                            : "text-red-600 hover:text-red-900"
                        }`}
                        data-testid={`block-user-${user.id}`}
                      >
                        {user.is_blocked ? (
                          <>
                            <FiUnlock className="ml-1" />
                            إلغاء الحظر
                          </>
                        ) : (
                          <>
                            <FiLock className="ml-1" />
                            حظر
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default Users;
