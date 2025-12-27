import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api";
import { FiUser, FiLock, FiLogIn } from "react-icons/fi";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await loginAdmin(username, password);
      localStorage.setItem("admin_token", data.access_token);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (err) {
      setError("بيانات تسجيل الدخول غير صحيحة");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg">
            <FiLogIn className="h-12 w-12 text-white" />
          </div>
          <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
            لوحة التحكم
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            بوت التلغرام للشراء والبيع
          </p>
        </div>
        
        <form className="mt-8 space-y-6 bg-white p-8 rounded-2xl shadow-2xl" onSubmit={handleLogin}>
          {error && (
            <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none relative block w-full pr-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  data-testid="username-input"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full pr-10 px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  data-testid="password-input"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
              data-testid="login-button"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري تسجيل الدخول...
                </div>
              ) : (
                <span className="flex items-center">
                  <FiLogIn className="ml-2" />
                  تسجيل الدخول
                </span>
              )}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-xs text-gray-500 mt-4">
              البيانات الافتراضية: admin / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
