import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { getProducts, updateProduct } from "../api";
import { FiPackage, FiEdit, FiCheck, FiX } from "react-icons/fi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product.id);
    setFormData({
      price_usd: product.price_usd,
      price_syp: product.price_syp,
      is_active: product.is_active
    });
  };

  const handleSave = async (productId) => {
    try {
      await updateProduct(productId, formData);
      await fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("حدث خطأ أثناء التحديث");
    }
  };

  const handleToggleActive = async (productId, currentStatus) => {
    try {
      await updateProduct(productId, { is_active: !currentStatus });
      await fetchProducts();
    } catch (error) {
      console.error("Error toggling product:", error);
    }
  };

  if (loading) {
    return (
      <Layout title="إدارة المنتجات">
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="إدارة المنتجات">
      <div className="mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <h3 className="text-2xl font-bold mb-2">إدارة الأسعار والمنتجات 💰</h3>
        <p className="text-indigo-100">يمكنك تعديل أسعار المنتجات وتفعيلها أو إيقافها من هنا</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
            data-testid={`product-card-${product.id}`}
          >
            <div className={`p-6 ${product.is_active ? "bg-green-50" : "bg-gray-50"}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg p-3">
                    <FiPackage className="h-6 w-6 text-white" />
                  </div>
                  <div className="mr-4">
                    <h3 className="text-lg font-bold text-gray-900">{product.icon} {product.name}</h3>
                    <p className="text-sm text-gray-600">النوع: {product.type}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleActive(product.id, product.is_active)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    product.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  data-testid={`toggle-product-${product.id}`}
                >
                  {product.is_active ? "مفعّل" : "معطّل"}
                </button>
              </div>

              {editingProduct === product.id ? (
                <div className="mt-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">السعر بالدولار</label>
                    <input
                      type="text"
                      value={formData.price_usd}
                      onChange={(e) => setFormData({ ...formData, price_usd: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      data-testid={`edit-usd-${product.id}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">السعر بالليرة السورية</label>
                    <input
                      type="text"
                      value={formData.price_syp}
                      onChange={(e) => setFormData({ ...formData, price_syp: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      data-testid={`edit-syp-${product.id}`}
                    />
                  </div>
                  <div className="flex space-x-2 space-x-reverse">
                    <button
                      onClick={() => handleSave(product.id)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      data-testid={`save-product-${product.id}`}
                    >
                      <FiCheck className="ml-2" />
                      حفظ
                    </button>
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="flex-1 flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                    >
                      <FiX className="ml-2" />
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600">السعر بالدولار</p>
                      <p className="text-lg font-bold text-green-600">{product.price_usd}</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-600">السعر بالليرة</p>
                      <p className="text-lg font-bold text-purple-600">{product.price_syp}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEdit(product)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    data-testid={`edit-product-${product.id}`}
                  >
                    <FiEdit className="ml-2" />
                    تعديل السعر
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Products;
