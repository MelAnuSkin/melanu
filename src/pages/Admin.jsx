import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { addProduct, deleteProduct, getAllProducts, updateProduct } from '../api/client.js';
import { apiClient } from '../api/client.js';
import Footer from '../components/Footer';

// Move ProductForm OUTSIDE of the Admin component to prevent re-creation on every render
const ProductForm = ({ 
  isEdit = false, 
  formData, 
  handleInputChange, 
  handleImageUpload, 
  handleSubmit, 
  closeForm, 
  isLoading, 
  editingProduct 
}) => (
  <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isEdit ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter product name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (GH₵) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select category</option>
            <option value="Body Care">Body Care</option>
            <option value="Hair Care">Hair Care</option>
            <option value="Men's Collection">Men's Collection</option>
            <option value="Face Care">Face Care</option>
            <option value="Toner">Toner</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          {isEdit && editingProduct && (
            <div className="mb-4 relative">
              <img 
                src={editingProduct.imageUrl || editingProduct.image || 'https://via.placeholder.com/80x80?text=Current'} 
                alt={editingProduct.name}
                className="w-20 h-20 object-cover rounded-lg border"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/80x80?text=Current';
                }}
              />
              <div className="mt-1 text-xs text-gray-500">Current Image</div>
            </div>
          )}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="mx-auto mb-2 text-gray-400" size={24} />
            <p className="text-gray-500 mb-2">Upload product image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id={isEdit ? "edit-image-upload" : "image-upload"}
            />
            <label
              htmlFor={isEdit ? "edit-image-upload" : "image-upload"}
              className="text-blue-500 hover:text-blue-600 cursor-pointer"
            >
              Choose File
            </label>
            <span className="text-gray-400 ml-2">
              {formData.image ? formData.image.name : 'No file chosen'}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter product description"
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center cursor-pointer gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            <Plus size={16} />
            {isLoading ? 'Adding...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
          <button
            type="button"
            onClick={closeForm}
            disabled={isLoading}
            className="flex items-center cursor-pointer gap-2 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function Admin() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '',
    category: '',
    description: '',
    image: null
  });

  // Fetch products on component mount (after authentication)
  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated) return;
      
      try {
        const response = await getAllProducts();
        const productsData = response.data;
        setProducts(productsData);
        console.log('Products fetched from API:', productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [isAuthenticated]);

  // Authentication check on component mount
  useEffect(() => {
    const checkAdminAuth = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      const userEmail = localStorage.getItem('userEmail');
      const isAuth = localStorage.getItem('isAuthenticated');

      console.log('Checking admin auth:', { token, userRole, userEmail, isAuth });

      // Check if user is authenticated and has admin role
      if (!token || !isAuth || userRole !== 'admin') {
        console.log('Access denied - not admin or not authenticated');
        alert('Access denied. Admin credentials required.');
        navigate('/login');
        return;
      }

      // If all checks pass, user is authenticated admin
      setIsAuthenticated(true);
      setAdminEmail(userEmail);
      console.log('Admin access granted');
    };

    checkAdminAuth();
  }, [navigate]);

  // Admin logout function
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Clear all localStorage data
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAuthenticated');
      
      console.log('Admin logged out');
      navigate('/'); // Navigate to home instead of login
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  };

  const openAddForm = () => {
    setFormData({
      name: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      image: null
    });
    setShowAddForm(true);
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      description: product.description || '',
      image: null // Don't prefill image, let user choose new one if needed
    });
    setShowEditForm(true);
  };

  const closeForm = () => {
    setShowAddForm(false);
    setShowEditForm(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      stock: '',
      category: '',
      description: '',
      image: null
    });
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setIsLoading(true);
        
        console.log('Attempting to delete product with ID:', productId); // Debug log
        
        // Get token from localStorage
        let token = localStorage.getItem('token');
        
        // If admin token, we need to get a real token by calling the login API
        if (token === 'admin-token') {
          try {
            const adminCredentials = {
              email: localStorage.getItem('userEmail'),
              password: 'admin123' // Admin password
            };
            
            const loginResponse = await apiClient.post('/api/auth/login', adminCredentials);
            token = loginResponse.data.token;
            localStorage.setItem('token', token); // Update with real token
          } catch (error) {
            console.error('Failed to get admin token:', error);
            alert('Failed to authenticate admin. Please login again.');
            navigate('/login');
            return;
          }
        }

        const response = await deleteProduct(productId, token);
        
        if (response.status === 200) {
          // Refresh products from API to show updated list
          const refreshResponse = await getAllProducts();
          setProducts(refreshResponse.data);
          alert('Product deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        console.error('Error response:', error.response?.data); // More detailed error log
        
        if (error.response?.status === 401) {
          alert('Authentication failed. Please login again.');
          navigate('/login');
        } else if (error.response?.status === 500) {
          alert('Server error occurred. Please check if the product exists and try again.');
        } else {
          alert(`Failed to delete product: ${error.response?.data?.message || error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (showEditForm) {
      // Update existing product via API
      try {
        setIsLoading(true);
        
        console.log('Attempting to update product with ID:', editingProduct._id || editingProduct.id); // Debug log
        
        // Get token from localStorage
        let token = localStorage.getItem('token');
        
        // If admin token, we need to get a real token by calling the login API
        if (token === 'admin-token') {
          try {
            const adminCredentials = {
              email: localStorage.getItem('userEmail'),
              password: 'admin123' // Admin password
            };
            
            const loginResponse = await apiClient.post('/api/auth/login', adminCredentials);
            token = loginResponse.data.token;
            localStorage.setItem('token', token); // Update with real token
          } catch (error) {
            console.error('Failed to get admin token:', error);
            alert('Failed to authenticate admin. Please login again.');
            navigate('/login');
            return;
          }
        }

        const productId = editingProduct._id || editingProduct.id;
        const response = await updateProduct(productId, formData, token);
        
        if (response.status === 200) {
          alert('Product updated successfully!');
          closeForm();
          
          // Refresh products from API to show updated product
          const refreshResponse = await getAllProducts();
          setProducts(refreshResponse.data);
        }
      } catch (error) {
        console.error('Error updating product:', error);
        console.error('Error response:', error.response?.data); // More detailed error log
        
        if (error.response?.status === 401) {
          alert('Authentication failed. Please login again.');
          navigate('/login');
        } else if (error.response?.status === 500) {
          alert('Server error occurred. Please check if the product exists and try again.');
        } else {
          alert(`Failed to update product: ${error.response?.data?.message || error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      // Add new product via API
      try {
        setIsLoading(true);
        
        // Get token from localStorage
        let token = localStorage.getItem('token');
        
        // If admin token, we need to get a real token by calling the login API
        if (token === 'admin-token') {
          try {
            const adminCredentials = {
              email: localStorage.getItem('userEmail'),
              password: 'admin123' // Admin password
            };
            
            const loginResponse = await apiClient.post('/api/auth/login', adminCredentials);
            token = loginResponse.data.token;
            localStorage.setItem('token', token); // Update with real token
          } catch (error) {
            console.error('Failed to get admin token:', error);
            alert('Failed to authenticate admin. Please login again.');
            navigate('/login');
            return;
          }
        }

        const response = await addProduct(formData, token);
        
        if (response.status === 201) {
          alert('Product added successfully!');
          closeForm();
          
          // Refresh products from API to show new product
          const refreshResponse = await getAllProducts();
          setProducts(refreshResponse.data);
        }
      } catch (error) {
        console.error('Error adding product:', error);
        if (error.response?.status === 401) {
          alert('Authentication failed. Please login again.');
          navigate('/login');
        } else {
          alert('Failed to add product. Please try again.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      
      
      <div className="min-h-screen bg-gray-50">
        {/* Header with Admin Info and Logout */}
        <div className="bg-blue-600 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                <p className="text-blue-100">Manage your products and inventory</p>
              </div>
              <div className="text-right">
                <p className="text-blue-100 mb-2">Welcome, Admin</p>
                <p className="text-sm text-blue-200 mb-3">{adminEmail}</p>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition-colors text-sm cursor-pointer"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {/* Product Management Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
              <button
                onClick={openAddForm}
                className="flex items-center cursor-pointer gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              {products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first product to the inventory.</p>
                  <button
                    onClick={openAddForm}
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <Plus size={16} />
                    Add Your First Product
                  </button>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Price</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Stock</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id || product.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={product.imageUrl || product.image || 'https://via.placeholder.com/48x48?text=No+Image'}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded-lg border"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                              }}
                            />
                            <div>
                              <h3 className="font-medium text-gray-900">{product.name}</h3>
                              <p className="text-sm text-gray-500">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-700">{product.category}</td>
                        <td className="py-4 px-4 text-gray-700">GH₵{product.price}</td>
                        <td className="py-4 px-4">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {product.stock} in stock
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => openEditForm(product)}
                              className="p-2 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(product._id || product.id)}
                              disabled={isLoading}
                              className="p-2 text-red-600 cursor-pointer hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        {showAddForm && (
          <ProductForm
            isEdit={false}
            formData={formData}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            handleSubmit={handleSubmit}
            closeForm={closeForm}
            isLoading={isLoading}
            editingProduct={editingProduct}
          />
        )}

        {/* Edit Product Modal */}
        {showEditForm && (
          <ProductForm
            isEdit={true}
            formData={formData}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            handleSubmit={handleSubmit}
            closeForm={closeForm}
            isLoading={isLoading}
            editingProduct={editingProduct}
          />
        )}
      </div>

      <Footer />
    </>
  );
}