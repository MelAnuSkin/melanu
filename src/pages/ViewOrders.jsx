import UserNav from "../components/UserNav";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getUserOrders } from "../api/client.js"; 

export default function ViewOrders() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Get token from localStorage
                const token = localStorage.getItem('token');
                const userEmail = localStorage.getItem('userEmail');
                
                if (!token) {
                    navigate('/login');
                    return;
                }

                // Set user info
                setUser({ email: userEmail });
                
                // Fetch user orders
                const response = await getUserOrders(token);
                console.log('Orders response:', response.data);
                setOrders(response.data || []);
                
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError(err.response?.data?.message || 'Failed to load orders');
                
                // If unauthorized, redirect to login
                if (err.response?.status === 401) {
                    localStorage.removeItem('token');
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserOrders();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userEmail');
        navigate('/');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price) => {
        return `GH₵${parseFloat(price || 0).toFixed(2)}`;
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'confirmed':
            case 'processing':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'delivered':
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'paid':
            case 'completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // Function to handle product click for incomplete payments
    const handleProductClick = (order, item) => {
        const paymentStatus = order.paymentStatus?.toLowerCase();
        const orderStatus = (order.orderStatus || order.status)?.toLowerCase();
        
        // If payment is not completed, redirect to checkout
        if (paymentStatus === 'pending' || paymentStatus === 'failed' || orderStatus === 'pending') {
            console.log('Redirecting to checkout for incomplete payment...');
            console.log('Order details:', {
                orderId: order._id,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus || order.status,
                totalAmount: order.totalAmount || order.total
            });
            
            // Store order info in localStorage for checkout page
            localStorage.setItem('pendingOrder', JSON.stringify({
                orderId: order._id,
                totalAmount: order.totalAmount || order.total,
                items: order.items || order.products || [],
                shippingInfo: order.shippingInfo
            }));
            
            navigate('/checkout');
        } else {
            // For completed orders, you might want to navigate to product detail page
            const productId = item.product?._id || item.productId || item._id;
            if (productId) {
                navigate(`/product/${productId}`);
            }
        }
    };

    // Get image URL - same logic as cart page
    const getImageUrl = (item) => {
        const baseImageUrl = import.meta.env.VITE_IMAGE_BASE_URL || 'https://skin-care-mel-api.onrender.com';
        
        // Try different image sources in order of preference
        const imageSources = [
            item.image,
            item.imageUrl,
            item.product?.image,
            item.product?.imageUrl
        ];

        for (const imageSource of imageSources) {
            if (imageSource) {
                // If image already has full URL, use it as is
                if (imageSource.startsWith('http')) {
                    return imageSource;
                }
                // Otherwise, prepend base URL
                return `${baseImageUrl}${imageSource}`;
            }
        }

        // Fallback to placeholder
        return 'https://via.placeholder.com/96x96?text=Product';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <UserNav />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
                            <div className="text-amber-600 text-xl">Loading your orders...</div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <UserNav />
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="text-red-500 text-xl mb-4">⚠️ Error Loading Orders</div>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button 
                                onClick={() => window.location.reload()} 
                                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <UserNav />
            
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
                            <p className="text-gray-600">
                                Track and manage your skincare orders
                            </p>
                        </div>
                        <div className="text-sm text-gray-500">
                            Welcome back, {user?.email}
                        </div>
                    </div>
                </div>

                {/* Orders Content */}
                {orders.length === 0 ? (
                    /* No Orders State */
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="max-w-md mx-auto">
                            <div className="text-6xl mb-6">📦</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                No Orders Yet
                            </h3>
                            <p className="text-gray-600 mb-6">
                                You haven't placed any orders yet. Start shopping for amazing skincare products!
                            </p>
                            <button 
                                onClick={() => navigate('/products')} 
                                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-medium"
                            >
                                Start Shopping
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Orders List */
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const paymentStatus = order.paymentStatus?.toLowerCase();
                            const orderStatus = (order.orderStatus || order.status)?.toLowerCase();
                            const isIncompletePayment = paymentStatus === 'pending' || paymentStatus === 'failed' || orderStatus === 'pending';
                            
                            return (
                                <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                                    {/* Order Header */}
                                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                                        <div className="flex items-center justify-between flex-wrap gap-4">
                                            <div className="flex items-center space-x-6">
                                                <div>
                                                    <p className="text-sm text-gray-600">Order ID</p>
                                                    <p className="font-mono text-sm font-medium text-gray-900">
                                                        #{order._id?.slice(-8).toUpperCase()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Date</p>
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {formatDate(order.createdAt || order.orderDate)}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Total</p>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        {formatPrice(order.totalAmount || order.total)}
                                                    </p>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center space-x-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}>
                                                    {(order.paymentStatus || 'pending').charAt(0).toUpperCase() + (order.paymentStatus || 'pending').slice(1)}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.orderStatus || order.status || 'pending')}`}>
                                                    {(order.orderStatus || order.status || 'pending').charAt(0).toUpperCase() + (order.orderStatus || order.status || 'pending').slice(1)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="p-6">
                                        <h4 className="font-medium text-gray-900 mb-4">Order Items</h4>
                                        <div className="space-y-4">
                                            {(order.items || order.products || []).map((item, index) => (
                                                <div 
                                                    key={index} 
                                                    className={`flex items-center space-x-4 py-3 border-b border-gray-100 last:border-b-0 ${isIncompletePayment ? 'cursor-pointer hover:bg-amber-50 rounded-lg transition-colors' : ''}`}
                                                    onClick={() => isIncompletePayment && handleProductClick(order, item)}
                                                >
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                                                        <img
                                                            src={getImageUrl(item)}
                                                            alt={item.product?.name || item.name || 'Product'}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/96x96?text=Product';
                                                            }}
                                                        />
                                                    </div>
                                                    
                                                    <div className="flex-1">
                                                        <h5 className="font-medium text-gray-900 mb-1">
                                                            {item.product?.name || item.name || 'Product'}
                                                        </h5>
                                                        <p className="text-sm text-gray-600 mb-1">
                                                            {item.product?.category || item.category || 'Skincare'}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm text-gray-600">
                                                                Qty: {item.quantity || 1}
                                                            </span>
                                                            <span className="font-medium text-gray-900">
                                                                {formatPrice(item.price || item.product?.price || 0)}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Click indicator for incomplete payments */}
                                                    {isIncompletePayment && (
                                                        <div className="text-amber-600 text-sm">
                                                            Click to pay →
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Shipping & Payment Info */}
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                        <div className="grid md:grid-cols-2 gap-6">

                                            {/* Payment Info */}
                                            <div>
                                                <h5 className="font-medium text-gray-900 mb-2">Payment Information</h5>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p>Status: 
                                                        <span className={`ml-2 px-2 py-1 rounded text-xs ${getPaymentStatusColor(order.paymentStatus || 'pending')}`}>
                                                            {(order.paymentStatus || 'pending').charAt(0).toUpperCase() + (order.paymentStatus || 'pending').slice(1)}
                                                        </span>
                                                    </p>
                                                    {order.paymentReference && (
                                                        <p>Reference: {order.paymentReference}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}