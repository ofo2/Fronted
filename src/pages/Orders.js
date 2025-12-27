import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getOrders, updateOrder } from "../api";
import { FiSearch, FiFilter, FiEye, FiCheck, FiX, FiClock } from "react-icons/fi";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.transaction_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleUpdateStatus = async (orderId, newStatus, notes = "") => {
    setUpdating(true);
    try {
      await updateOrder(orderId, { status: newStatus, admin_notes: notes });
      await fetchOrders();
      setShowModal(false);
      setSelectedOrder(null);
    } catch (error) {
      console.error("Error updating order:", error);
      alert("حدث خطأ أثناء تحديث الطلب");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "قيد الانتظار", className: "bg-yellow-100 text-yellow-800", icon: FiClock },
      confirmed: { text: "مؤكدة", className: "bg-blue-100 text-blue-800", icon: FiCheck },
      completed: { text: "مكتملة", className: "bg-green-100 text-green-800", icon: FiCheck },
      cancelled: { text: "ملغية", className: "bg-red-100 text-red-800", icon: FiX },
    };
    return badges[status] || badges.pending;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ar-SY", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Layout title="إدارة الطلبات">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="إدارة الطلبات">
      {/* Filters */}
      <div className="mb-6 bg-white p-6 rounded-2xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="البحث عن طلب..."
              className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              data-testid="search-orders-input"
            />
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <FiFilter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              data-testid="filter-status-select"
            >
              <option value="all">جميع الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="confirmed">مؤكدة</option>
              <option value="completed">مكتملة</option>
              <option value="cancelled">ملغية</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          عرض {filteredOrders.length} من أصل {orders.length} طلب
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
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
                  طريقة الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الحالة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  التاريخ
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    لا توجد طلبات
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const badge = getStatusBadge(order.status);
                  const StatusIcon = badge.icon;
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors" data-testid={`order-row-${order.id}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.transaction_code || order.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.user_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.product_type} {order.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {order.payment_method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${badge.className}`}>
                          <StatusIcon className="ml-1 h-3 w-3" />
                          {badge.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 flex items-center"
                          data-testid={`view-order-${order.id}`}
                        >
                          <FiEye className="ml-1" />
                          عرض
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed z-50 inset-0 overflow-y-auto" dir="rtl">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-2xl text-right overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                <h3 className="text-2xl font-bold text-white">تفاصيل الطلب</h3>
              </div>
              
              <div className="bg-white px-6 py-5">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">رقم الطلب</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedOrder.transaction_code || selectedOrder.id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">الحالة</p>
                    <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getStatusBadge(selectedOrder.status).className}`}>
                      {getStatusBadge(selectedOrder.status).text}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">العميل</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedOrder.user_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Telegram ID</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedOrder.user_telegram_id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">المنتج</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedOrder.product_type} {selectedOrder.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">السعر</p>
                    <p className="text-lg font-semibold text-green-600">{selectedOrder.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">العملة</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedOrder.currency_display}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">طريقة الدفع</p>
                    <p className="text-lg font-semibold text-gray-900">{selectedOrder.payment_method}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">إثبات الدفع</p>
                    <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded">{selectedOrder.payment_proof || "لا يوجد"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">ملاحظات الأدمن</p>
                    <p className="text-sm text-gray-900 mt-1 p-2 bg-gray-50 rounded">{selectedOrder.admin_notes || "لا توجد ملاحظات"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">تاريخ الطلب</p>
                    <p className="text-sm text-gray-900 mt-1">{formatDate(selectedOrder.created_at)}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedOrder.status === "pending" && (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "confirmed", "تم تأكيد الطلب")}
                      disabled={updating}
                      className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                      data-testid="confirm-order-button"
                    >
                      <FiCheck className="ml-2" />
                      {updating ? "جاري التأكيد..." : "تأكيد الطلب"}
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled", "تم إلغاء الطلب")}
                      disabled={updating}
                      className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      data-testid="cancel-order-button"
                    >
                      <FiX className="ml-2" />
                      {updating ? "جاري الإلغاء..." : "إلغاء الطلب"}
                    </button>
                  </div>
                )}

                {selectedOrder.status === "confirmed" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "completed", "تم إكمال الطلب وتسليم المنتج")}
                    disabled={updating}
                    className="w-full flex items-center justify-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-6"
                    data-testid="complete-order-button"
                  >
                    <FiCheck className="ml-2" />
                    {updating ? "جاري الإكمال..." : "إكمال الطلب"}
                  </button>
                )}
              </div>

              <div className="bg-gray-50 px-6 py-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Orders;
