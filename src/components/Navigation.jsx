import { useState } from "react";
import { Plus, Edit, Trash2, Reply, MessageCircle, Clock, User, Mail, X, Package, CheckCircle, AlertCircle, Truck } from 'lucide-react';

export default function Navigation({ 
  // Product-related props
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct, 
  isLoading,
  
  // Message-related props
  messages, 
  onReplyMessage, 
  onDeleteMessage, 
  deletingMessageId,
  loading,
  error,

  // Order-related props
  orders,
  onUpdateOrderStatus,
  updatingOrderId,
  ordersLoading,
  ordersError
}) {
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'messages', or 'orders'

  // Status color mapping
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Status icon mapping
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return <Clock size={14} />;
      case 'processing':
        return <AlertCircle size={14} />;
      case 'shipped':
        return <Truck size={14} />;
      case 'delivered':
        return <CheckCircle size={14} />;
      case 'cancelled':
        return <X size={14} />;
      default:
        return <Package size={14} />;
    }
  };

  return (
    <>
      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Product Management
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'orders'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Order Management
              {orders && orders.length > 0 && (
                <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 py-1">
                  {orders.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors relative ${
                activeTab === 'messages'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Customer Messages
              {messages && messages.length > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                  {messages.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Product Management</h2>
              <button
                onClick={onAddProduct}
                className="flex items-center cursor-pointer gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} />
                Add Product
              </button>
            </div>

            <div className="overflow-x-auto">
              {!products || products.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Yet</h3>
                  <p className="text-gray-500 mb-4">Get started by adding your first product to the inventory.</p>
                  <button
                    onClick={onAddProduct}
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
                              onClick={() => onEditProduct(product)}
                              className="p-2 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-md transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(product._id || product.id)}
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
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Package className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Order Management</h2>
                    <p className="text-gray-600">Track and update customer order statuses</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                    <span className="text-2xl font-bold text-green-600">{orders ? orders.length : 0}</span>
                    <p className="text-sm text-gray-500">Total Orders</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {ordersLoading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-3 text-gray-600">Loading orders...</span>
                </div>
              )}

              {ordersError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <X className="text-red-500" size={16} />
                    <span className="text-red-700 font-medium">Error</span>
                  </div>
                  <p className="text-red-600 mt-1">{ordersError}</p>
                </div>
              )}

              {!ordersLoading && !ordersError && (!orders || orders.length === 0) && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Package className="mx-auto" size={64} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                  <p className="text-gray-500">Customer orders will appear here when they make purchases.</p>
                </div>
              )}

              {!ordersLoading && orders && orders.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50">
                        <th className="text-left py-4 px-4 font-medium text-gray-700">Order ID</th>
                        <th className="text-left py-4 px-4 font-medium text-gray-700">Customer</th>
                        <th className="text-left py-4 px-4 font-medium text-gray-700">Items</th>
                        <th className="text-left py-4 px-4 font-medium text-gray-700">Total</th>
                        <th className="text-left py-4 px-4 font-medium text-gray-700">Date</th>
                        <th className="text-left py-4 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-4 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order._id || order.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">
                              #{(order._id || order.id).slice(-8).toUpperCase()}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{order.customerName || order.user?.name || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{order.customerEmail || order.user?.email || 'N/A'}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-700">
                              {order.items?.length || order.products?.length || 0} item(s)
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="font-medium text-gray-900">
                              GH₵{order.totalAmount || order.total || '0.00'}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="text-sm text-gray-700">
                              {new Date(order.createdAt || order.orderDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              {(order.status || 'pending').charAt(0).toUpperCase() + (order.status || 'pending').slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <select
                                onChange={(e) => onUpdateOrderStatus(order._id || order.id, e.target.value)}
                                disabled={updatingOrderId === (order._id || order.id)}
                                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                defaultValue=""
                              >
                                <option value="" disabled>Update Status</option>
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                              {updatingOrderId === (order._id || order.id) && (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <MessageCircle className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Customer Messages</h2>
                    <p className="text-gray-600">Manage and respond to customer inquiries</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                    <span className="text-2xl font-bold text-blue-600">{messages ? messages.length : 0}</span>
                    <p className="text-sm text-gray-500">Total Messages</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">Loading messages...</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2">
                    <X className="text-red-500" size={16} />
                    <span className="text-red-700 font-medium">Error</span>
                  </div>
                  <p className="text-red-600 mt-1">{error}</p>
                </div>
              )}

              {!loading && !error && (!messages || messages.length === 0) && (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <MessageCircle className="mx-auto" size={64} />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Messages Yet</h3>
                  <p className="text-gray-500">Customer messages will appear here when they contact you.</p>
                </div>
              )}

              {!loading && messages && messages.length > 0 && (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg._id} className="bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                              <User className="text-blue-600" size={20} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold text-gray-900 text-lg">{msg.name}</h3>
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                  New
                                </span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                                <div className="flex items-center gap-1">
                                  <Mail size={14} />
                                  <span>{msg.email}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock size={14} />
                                  <span>{new Date(msg.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                          <h4 className="font-medium text-gray-800 mb-2">Message:</h4>
                          <p className="text-gray-700 leading-relaxed">{msg.message}</p>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <MessageCircle size={14} />
                              Customer Inquiry
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => onReplyMessage(msg)}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors font-medium"
                            >
                              <Reply size={16} />
                              Reply
                            </button>
                            <button
                              onClick={() => onDeleteMessage(msg._id)}
                              disabled={deletingMessageId === msg._id}
                              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {deletingMessageId === msg._id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                  <span>Deleting...</span>
                                </>
                              ) : (
                                <>
                                  <Trash2 size={16} />
                                  <span>Delete</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}