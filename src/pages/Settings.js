import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getSettings, updateSettings } from "../api";
import { FiSave, FiSettings as FiSettingsIcon } from "react-icons/fi";

const Settings = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await getSettings();
      setSettings(data);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateSettings(formData);
      setMessage("تم حفظ الإعدادات بنجاح ✅");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      console.error("Error updating settings:", error);
      setMessage("حدث خطأ أثناء الحفظ ❌");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (loading) {
    return (
      <Layout title="الإعدادات">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="الإعدادات">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
          <h3 className="text-2xl font-bold mb-2 flex items-center">
            <FiSettingsIcon className="ml-2" />
            إعدادات البوت
          </h3>
          <p className="text-indigo-100">تخصيص إعدادات البوت والرسائل</p>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.includes("✅")
                ? "bg-green-50 border-r-4 border-green-500 text-green-700"
                : "bg-red-50 border-r-4 border-red-500 text-red-700"
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bot Token
            </label>
            <input
              type="text"
              name="bot_token"
              value={formData.bot_token || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="7610806578:AAH1DUUk..."
              data-testid="bot-token-input"
            />
            <p className="mt-2 text-xs text-gray-500">رمز البوت من BotFather</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Telegram ID للأدمن
            </label>
            <input
              type="number"
              name="admin_telegram_id"
              value={formData.admin_telegram_id || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="123456789"
              data-testid="admin-telegram-id-input"
            />
            <p className="mt-2 text-xs text-gray-500">
              سيتم إرسال إشعارات الطلبات الجديدة إلى هذا الحساب
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رسالة الترحيب
            </label>
            <textarea
              name="welcome_message"
              value={formData.welcome_message || ""}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="مرحبًا! اختر القسم:"
              data-testid="welcome-message-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الدعم
              </label>
              <input
                type="text"
                name="support_phone"
                value={formData.support_phone || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="+963982597773"
                data-testid="support-phone-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني للدعم
              </label>
              <input
                type="email"
                name="support_email"
                value={formData.support_email || ""}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="support@example.com"
                data-testid="support-email-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رابط واتساب
            </label>
            <input
              type="text"
              name="support_whatsapp"
              value={formData.support_whatsapp || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://wa.me/963982597773"
              data-testid="support-whatsapp-input"
            />
          </div>

          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
              data-testid="save-settings-button"
            >
              <FiSave className="ml-2" />
              {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </button>
          </div>
        </form>

        <div className="mt-8 bg-blue-50 border-r-4 border-blue-500 p-6 rounded-lg">
          <h4 className="text-lg font-semibold text-blue-900 mb-2">ملاحظة مهمة 📌</h4>
          <ul className="text-sm text-blue-800 space-y-2">
            <li>• بعد تغيير Bot Token، يجب إعادة تشغيل البوت</li>
            <li>• تأكد من صحة Telegram ID للأدمن لاستقبال الإشعارات</li>
            <li>• يمكن تعديل الأسعار من صفحة المنتجات</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
