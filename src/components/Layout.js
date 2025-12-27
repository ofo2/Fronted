import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiHome, FiShoppingCart, FiUsers, FiPackage, FiSettings, FiLogOut, FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

const Layout = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    navigate("/login");
  };

  const menuItems = [
    { path: "/dashboard", icon: FiHome, label: "لوحة التحكم" },
    { path: "/orders", icon: FiShoppingCart, label: "الطلبات" },
    { path: "/users", icon: FiUsers, label: "المستخدمين" },
    { path: "/products", icon: FiPackage, label: "المنتجات" },
    { path: "/settings", icon: FiSettings, label: "الإعدادات" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex" dir="rtl">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-gradient-to-b from-indigo-700 to-purple-700">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-white">لوحة التحكم 🎮</h1>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                        isActive
                          ? "bg-white text-indigo-700 shadow-lg"
                          : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                      }`}
                      data-testid={`nav-${item.label}`}
                    >
                      <Icon className={`ml-3 h-5 w-5 ${isActive ? "text-indigo-700" : "text-indigo-200"}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="px-2 mt-4">
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-4 py-3 text-sm font-medium text-indigo-100 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                  data-testid="logout-button"
                >
                  <FiLogOut className="ml-3 h-5 w-5" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-gradient-to-b from-indigo-700 to-purple-700">
            <div className="absolute top-0 left-0 -ml-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <FiX className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <h1 className="text-xl font-bold text-white">لوحة التحكم 🎮</h1>
              </div>
              <nav className="mt-8 flex-1 px-2 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                        isActive
                          ? "bg-white text-indigo-700"
                          : "text-indigo-100 hover:bg-indigo-600 hover:text-white"
                      }`}
                    >
                      <Icon className={`ml-3 h-5 w-5 ${isActive ? "text-indigo-700" : "text-indigo-200"}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="px-2 mt-4">
                <button
                  onClick={handleLogout}
                  className="group flex items-center w-full px-4 py-3 text-sm font-medium text-indigo-100 rounded-lg hover:bg-red-600 hover:text-white"
                >
                  <FiLogOut className="ml-3 h-5 w-5" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
          <button
            className="px-4 border-l border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <FiMenu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">مرحباً، أدمن 👋</span>
            </div>
          </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
