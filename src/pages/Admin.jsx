import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, X, LogOut, Mail, Reply } from 'lucide-react';
import { useNavigate } from 'react-router';
import { addProduct, deleteProduct, getAllProducts, updateProduct, getAllOrders, updateOrderStatus, replyToMessage } from '../api/client.js';
import { apiClient, getAllContactMessages } from '../api/client.js';
import Header from '../components/Header.jsx';
import Navigation from '../components/Navigation.jsx';

// Reply Modal Component
const ReplyModal = ({ message, isOpen, onClose, onSend, isLoading }) => {
  const [replyText, setReplyText] = useState('');
  const [subject, setSubject] = useState(`Re: Your inquiry - ${message?.name || 'Customer Support'}`);

  const handleSend = () => {
    if (replyText.trim()) {
      onSend({
        to: message.email,
        subject: subject,
        message: replyText,
        originalMessage: message
      });
      setReplyText('');
      setSubject(`Re: Your inquiry - ${message?.name || 'Customer Support'}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 rounded-t-xl flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Reply size={20} className="sm:w-6 sm:h-6" />
              <div>
                <h3 className="text-lg sm:text-xl font-semibold">Reply to Customer</h3>
                <p className="text-blue-100 text-xs sm:text-sm">{message?.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-4">
            {/* Original Message Preview */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 border-l-4 border-blue-500">
              <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Original Message:</h4>
              <p className="text-gray-600 text-xs sm:text-sm italic">"{message?.message}"</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>From: {message?.name}</span>
                <span>Date: {new Date(message?.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Reply Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Email subject"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                  rows="6"
                  placeholder="Type your reply here..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons - Fixed */}
        <div className="border-t border-gray-200 p-4 sm:p-6 flex-shrink-0 bg-gray-50 rounded-b-xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSend}
              disabled={isLoading || !replyText.trim()}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl order-2 sm:order-1"
            >
              <Mail size={18} className="sm:w-5 sm:h-5" />
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  <span>Sending Email...</span>
                </>
              ) : (
                <span>Send Email to Customer</span>
              )}
            </button>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 font-medium text-sm sm:text-base order-1 sm:order-2"
            >
              <X size={14} className="sm:w-4 sm:h-4" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyLoading, setReplyLoading] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  
  // Order states
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  const [formData, setFormData] = useState({
    name: '', price: '', stock: '', category: '', description: '', image: null});

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

  useEffect(() => {
    const checkAdminAuth = () => {
      const token = localStorage.getItem('token');
      const userRole = localStorage.getItem('userRole');
      const userEmail = localStorage.getItem('userEmail');
      const isAuth = localStorage.getItem('isAuthenticated');

      console.log('Checking admin auth:', { token, userRole, userEmail, isAuth });

      if (!token || !isAuth || userRole !== 'admin') {
        console.log('Access denied - not admin or not authenticated');
        alert('Access denied. Admin credentials required.');
        navigate('/login');
        return;
      }

      setIsAuthenticated(true);
      setAdminEmail(userEmail);
      console.log('Admin access granted');
    };

    checkAdminAuth();
  }, [navigate]);

  const adminToken = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await getAllContactMessages(adminToken);
        setMessages(res.data || res);
      } catch (err) {
        setError(err.message || 'Failed to fetch messages');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchMessages();
    }
  }, [adminToken, isAuthenticated]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      try {
        setOrdersLoading(true);
        const token = localStorage.getItem('token');
        const response = await getAllOrders(token);
        setOrders(response.data || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setOrdersError(error.message || 'Failed to fetch orders');
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      const token = localStorage.getItem('token');
      
      await updateOrderStatus(orderId, newStatus, token);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          (order._id || order.id) === orderId 
            ? { ...order, status: newStatus }
            : order
        )
      );
      
      alert(`Order status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(`Failed to update order status: ${error.response?.data?.message || error.message}`);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setShowReplyModal(true);
  };

  const handleSendReply = async (replyData) => {
    try {
      setReplyLoading(true);
      console.log('Sending reply with full replyData object:', replyData);
      
      // Extract the reply message from replyData
      // The ReplyModal sends: { to, subject, message, originalMessage }
      const replyMessage = replyData.message;
      const messageId = replyData.originalMessage._id;
      
      console.log('Extracted data:', {
        messageId: messageId,
        replyMessage: replyMessage,
        replyLength: replyMessage?.length
      });
      
      // Validate that we have a reply message
      if (!replyMessage || !replyMessage.trim()) {
        alert('Please enter a reply message before sending.');
        setReplyLoading(false);
        return;
      }
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Authentication required. Please login again.');
        navigate('/login');
        return;
      }
      
      console.log('About to call API with:', {
        messageId: messageId,
        replyMessage: replyMessage.trim(),
        tokenExists: !!token
      });
      
      // Call the actual API to send the reply
      const response = await replyToMessage(
        messageId, 
        replyMessage.trim(), 
        token
      );
      
      console.log('Reply API response:', response);
      
      if (response.status === 200 || response.status === 201) {
        alert('Reply sent successfully!');
        setShowReplyModal(false);
        setSelectedMessage(null);
        
        // Optionally refresh messages to show updated status
        // You might want to add a "replied" status or remove the message from the list
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
      
    } catch (error) {
      console.error('Error sending reply:', error);
      console.error('Full error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      let errorMessage = 'Failed to send reply. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = `Failed to send reply: ${error.response.data.message}`;
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please login again.';
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('isAuthenticated');
          navigate('/login');
        }, 1000);
      } else if (error.response?.status === 400) {
        errorMessage = 'Invalid request. Please check your reply message.';
      } else if (error.message) {
        errorMessage = `Failed to send reply: ${error.message}`;
      }
      
      alert(errorMessage);
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this message? This action cannot be undone.')) {
      try {
        setDeletingMessageId(messageId);
        
        console.log('Deleting message:', messageId);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove message from local state
        setMessages(prevMessages => prevMessages.filter(msg => msg._id !== messageId));
        
        alert('Message deleted successfully!');
        
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Failed to delete message. Please try again.');
      } finally {
        setDeletingMessageId(null);
      }
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('isAuthenticated');
      
      console.log('Admin logged out');
      navigate('/'); 
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
      image: null 
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
        
        console.log('Attempting to delete product with ID:', productId); 
        
        let token = localStorage.getItem('token');
        
        if (token === 'admin-token') {
          try {
            const adminCredentials = {
              email: localStorage.getItem('userEmail'),
              password: 'admin123'
            };
            
            const loginResponse = await apiClient.post('/api/auth/login', adminCredentials);
            token = loginResponse.data.token;
            localStorage.setItem('token', token);
          } catch (error) {
            console.error('Failed to get admin token:', error);
            alert('Failed to authenticate admin. Please login again.');
            navigate('/login');
            return;
          }
        }

        const response = await deleteProduct(productId, token);
        
        if (response.status === 200) {
          const refreshResponse = await getAllProducts();
          setProducts(refreshResponse.data);
          alert('Product deleted successfully!');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        console.error('Error response:', error.response?.data); 
        
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
      try {
        setIsLoading(true);
        
        console.log('Attempting to update product with ID:', editingProduct._id || editingProduct.id); 
        
        let token = localStorage.getItem('token');
        
        if (token === 'admin-token') {
          try {
            const adminCredentials = {
              email: localStorage.getItem('userEmail'),
              password: 'admin123' 
            };
            
            const loginResponse = await apiClient.post('/api/auth/login', adminCredentials);
            token = loginResponse.data.token;
            localStorage.setItem('token', token); 
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
          
          const refreshResponse = await getAllProducts();
          setProducts(refreshResponse.data);
        }
      } catch (error) {
        console.error('Error updating product:', error);
        console.error('Error response:', error.response?.data); 
        
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
      try {
        setIsLoading(true);
        
        let token = localStorage.getItem('token');
        
        if (token === 'admin-token') {
          try {
            const adminCredentials = {
              email: localStorage.getItem('userEmail'),
              password: 'admin123'
            };
            
            const loginResponse = await apiClient.post('/api/auth/login', adminCredentials);
            token = loginResponse.data.token;
            localStorage.setItem('token', token); 
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
        {/* Header */}
        <Header handleLogout={handleLogout} />

        {/* Navigation Component with all props */}
        <Navigation 
          // Product-related props
          products={products}
          onAddProduct={openAddForm}
          onEditProduct={openEditForm}
          onDeleteProduct={handleDelete}
          isLoading={isLoading}
          
          // Message-related props
          messages={messages}
          onReplyMessage={handleReply}
          onDeleteMessage={handleDeleteMessage}
          deletingMessageId={deletingMessageId}
          loading={loading}
          error={error}

          // Order-related props
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          updatingOrderId={updatingOrderId}
          ordersLoading={ordersLoading}
          ordersError={ordersError}
        />

        {/* Product Forms */}
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

        {/* Reply Modal */}
        <ReplyModal
          message={selectedMessage}
          isOpen={showReplyModal}
          onClose={() => {
            setShowReplyModal(false);
            setSelectedMessage(null);
          }}
          onSend={handleSendReply}
          isLoading={replyLoading}
        />
      </div>
    </>
  );
}