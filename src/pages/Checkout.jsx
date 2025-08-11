import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import UserNav from "../components/UserNav";
import { ArrowLeft, MapPin, User, Shield, Minus, Plus, CheckCircle } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router";
import { getCartItems, updateCartItem, createOrder } from '../api/client.js';

export default function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [processingOrder, setProcessingOrder] = useState(false);
    const [updating, setUpdating] = useState({});
    const [userId, setUserId] = useState(null);
    
    // Form data state
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        region: '',
        phone: '',
        orderNotes: ''
    });

    // Check authentication on component mount
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const isAuth = localStorage.getItem('isAuthenticated');
            
            if (token && isAuth) {
                setIsAuthenticated(true);
                
                // Extract userId from token
                try {
                    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                    setUserId(tokenPayload.userId || tokenPayload.id || tokenPayload._id);
                    console.log('User ID from token:', tokenPayload.userId || tokenPayload.id || tokenPayload._id);
                } catch (e) {
                    console.error('Could not decode userId from token:', e);
                    // You might want to get userId from localStorage as backup
                    const storedUserId = localStorage.getItem('userId');
                    if (storedUserId) {
                        setUserId(storedUserId);
                    }
                }
            } else {
                setIsAuthenticated(false);
                alert('Please login to access checkout');
                navigate('/login');
                return;
            }
        };
        
        checkAuth();

        // Listen for storage changes (e.g., login/logout in another tab)
        window.addEventListener('storage', checkAuth);
        window.addEventListener('authChanged', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChanged', checkAuth);
        };
    }, [navigate]);

    // Fetch cart items for checkout
    useEffect(() => {
        const fetchCartItems = async () => {
            if (!isAuthenticated) return;

            try {
                const token = localStorage.getItem('token');
                const response = await getCartItems(token);
                
                console.log('Checkout Cart API Response:', response.data);
                
                // Handle different possible response structures (same logic as Cart.jsx)
                let cartData = response.data || [];
                
                if (cartData.items) {
                    cartData = cartData.items;
                } else if (cartData.cart && cartData.cart.items) {
                    cartData = cartData.cart.items;
                }
                
                // Transform cart data to ensure consistent structure
                const transformedItems = Array.isArray(cartData) ? cartData.map(item => {
                    let productId = null;
                    
                    if (item.product && item.product._id) {
                        productId = item.product._id;
                        console.log(`Using nested product ID for ${item.name}: ${productId}`);
                    } else if (item.productId) {
                        productId = item.productId;
                        console.log(`Using direct product ID for ${item.name}: ${productId}`);
                    } else {
                        console.error('NO PRODUCT ID FOUND for item:', item);
                    }
                    
                    return {
                        productId: productId,
                        cartItemId: item._id,
                        _id: item._id,
                        name: item.name || item.productName || item.product?.name || 'Unknown Product',
                        price: parseFloat(item.price || item.productPrice || item.product?.price || 0),
                        quantity: parseInt(item.quantity || 1),
                        image: item.image || item.imageUrl || item.product?.image || item.product?.imageUrl,
                        category: item.category || item.product?.category
                    };
                }).filter(item => {
                    if (!item.productId) {
                        console.error('Removing item without productId:', item.name);
                        return false;
                    }
                    return true;
                }) : [];
                
                console.log('Checkout transformed items:', transformedItems);
                setCartItems(transformedItems);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart for checkout:', error);
                if (error.response?.status === 401) {
                    alert('Session expired. Please login again.');
                    navigate('/login');
                } else {
                    console.error('Checkout cart fetch error:', error.response?.data);
                    setCartItems([]);
                }
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [isAuthenticated, navigate]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Update quantity function
    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;
        if (updating[productId]) return;

        const itemKey = productId;
        setUpdating(prev => ({ ...prev, [itemKey]: true }));

        // Store original state for rollback
        const originalItems = [...cartItems];
        
        // Optimistically update the UI
        setCartItems(prev => prev.map(item => 
            (item.productId === productId || item._id === productId)
                ? { ...item, quantity: newQuantity }
                : item
        ));

        try {
            const token = localStorage.getItem('token');
            
            console.log('Updating cart item quantity:', { productId, newQuantity });
            
            const response = await updateCartItem(productId, newQuantity, token);
            console.log('Update quantity response:', response);
            
            if (response.status === 200 || response.status === 201 || response.status === 204) {
                window.dispatchEvent(new CustomEvent('cartUpdated'));
                console.log('Quantity update successful');
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Error updating quantity:', error);
            
            // Revert optimistic update on failure
            setCartItems(originalItems);
            
            let errorMessage = 'Failed to update quantity';
            
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                
                if (status === 404) {
                    errorMessage = 'Product not found in cart.';
                } else if (status === 401) {
                    errorMessage = 'Please login again';
                    setTimeout(() => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('isAuthenticated');
                        navigate('/login');
                    }, 1000);
                } else if (data?.message) {
                    errorMessage += `: ${data.message}`;
                }
            }
            
            alert(errorMessage);
        } finally {
            setUpdating(prev => ({ ...prev, [itemKey]: false }));
        }
    };

    // Calculate totals for all items
    const subtotal = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    // Helper function to create order for a single item
    const createSingleOrder = async (item, token, shippingData) => {
        const orderData = {
            quantity: item.quantity,
            shippingAddress: shippingData
        };

        console.log(`Creating order for item: ${item.name}`, {
            productId: item.productId,
            orderData
        });

        const orderResponse = await createOrder(orderData, item.productId, token);
        
        const orderId = orderResponse.data.order._id || orderResponse.data.order.orderId || orderResponse.data.order.id;
        
        if (!orderId) {
            throw new Error(`Order ID not received for ${item.name}`);
        }

        return {
            orderId,
            item,
            total: item.price * item.quantity,
            response: orderResponse.data
        };
    };

    // Handle confirm order - Create orders for all items
    const handleConfirmOrder = async () => {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            alert('Your cart is empty. Please add items before confirming order.');
            return;
        }

        // Validate required fields
        if (!formData.address || !formData.city || !formData.region || !formData.phone) {
            alert('Please fill in all required shipping information.');
            return;
        }

        // Validate userId
        if (!userId) {
            alert('User ID not found. Please try logging in again.');
            return;
        }

        setProcessingOrder(true);

        try {
            const token = localStorage.getItem('token');

            console.log('Creating orders for all items with userId:', userId);

            // Prepare shipping address
            const shippingAddress = {
                address: formData.address,
                city: formData.city,
                region: formData.region,
                phone: formData.phone,
                postalCode: ""
            };

            // Create orders for all items
            const orderPromises = cartItems.map(item => 
                createSingleOrder(item, token, shippingAddress)
            );

            console.log(`Processing ${cartItems.length} orders...`);

            // Execute all orders
            const orderResults = await Promise.allSettled(orderPromises);

            // Check results
            const successfulOrders = [];
            const failedOrders = [];

            orderResults.forEach((result, index) => {
                if (result.status === 'fulfilled') {
                    successfulOrders.push(result.value);
                    console.log(`Order ${index + 1} successful:`, result.value.orderId);
                } else {
                    failedOrders.push({
                        item: cartItems[index],
                        error: result.reason
                    });
                    console.error(`Order ${index + 1} failed:`, result.reason);
                }
            });

            // Handle results
            if (successfulOrders.length === cartItems.length) {
                // All orders successful
                alert(`All ${successfulOrders.length} orders created successfully!`);
                
                // Navigate to payment page with all order details
                navigate('/makepayment', {
                    state: {
                        orderDetails: {
                            orders: successfulOrders,
                            shippingAddress,
                            orderNotes: formData.orderNotes,
                            totalAmount: total,
                            isMultipleOrders: true
                        }
                    }
                });

            } else if (successfulOrders.length > 0) {
                // Some orders successful
                const successItems = successfulOrders.map(order => order.item.name).join(', ');
                const failedItems = failedOrders.map(failed => failed.item.name).join(', ');
                
                alert(`${successfulOrders.length} of ${cartItems.length} orders created successfully.\n\nSuccessful: ${successItems}\n\nFailed: ${failedItems}\n\nYou can proceed with the successful orders and retry the failed ones later.`);
                
                // Navigate with successful orders only
                navigate('/makepayment', {
                    state: {
                        orderDetails: {
                            orders: successfulOrders,
                            shippingAddress,
                            orderNotes: formData.orderNotes,
                            totalAmount: successfulOrders.reduce((sum, order) => sum + order.total, 0),
                            isMultipleOrders: true,
                            hasFailedOrders: true,
                            failedItems: failedOrders.map(f => f.item.name)
                        }
                    }
                });

            } else {
                // All orders failed
                throw new Error('All orders failed to create. Please try again.');
            }

        } catch (error) {
            console.error('Error in order creation process:', error);
            
            let errorMessage = 'Failed to create orders. Please try again.';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setProcessingOrder(false);
        }
    };

    if (loading) {
        return (
            <>
                <UserNav />
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-amber-700">Loading checkout...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <UserNav />

            <div className="min-h-screen bg-white">
                {/* Hero Section - Mobile Responsive */}
                <div className="bg-[#F0D09F] px-4 py-8 sm:py-12 lg:py-16">
                    <div className="max-w-6xl mx-auto">
                        <Link to="/cart">
                            <button className="flex items-center text-amber-800 font-mono hover:bg-[#EADAC8] hover:rounded-full hover:px-3 cursor-pointer mb-4 text-sm sm:text-base">
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Back to Cart
                            </button>
                        </Link>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono text-amber-800">Checkout</h1>
                        <p className="text-amber-700 font-bold font-mono mt-1 text-sm sm:text-base">Review and confirm your order</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
                    {/* Check if cart is empty */}
                    {!Array.isArray(cartItems) || cartItems.length === 0 ? (
                        <div className="text-center py-12 sm:py-16">
                            <div className="text-amber-600 mb-4">
                                <svg className="mx-auto h-12 w-12 sm:h-16 sm:w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6m-10 0V9a1 1 0 011-1h8a1 1 0 011 1v4.01" />
                                </svg>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-amber-800 mb-2">Your Cart is Empty</h2>
                            <p className="text-amber-600 mb-6 text-sm sm:text-base">Add some products before proceeding to checkout!</p>
                            <Link to="/products">
                                <button className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 cursor-pointer text-sm sm:text-base">
                                    Start Shopping
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6 sm:space-y-8">
                            {/* Success Notice for Multiple Items */}
                            {cartItems.length > 1 && (
                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-center">
                                        <div className="text-green-600 mr-3">
                                            <CheckCircle className="w-5 h-5" />
                                        </div>
                                        <div className="text-green-800">
                                            <h3 className="font-medium">Multiple Items Order</h3>
                                            <p className="text-sm mt-1">All {cartItems.length} items in your cart will be processed as separate orders with the same shipping information.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Order Review Section with Quantity Controls - Mobile Responsive */}
                            <div className="bg-white rounded-lg shadow-sm border border-amber-500 p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-amber-800 mb-4 sm:mb-6">Review Your Order</h2>
                                
                                <div className="space-y-3 sm:space-y-4">
                                    {cartItems.map((item, index) => {
                                        const itemId = item.productId || item._id;
                                        const isUpdating = updating[itemId];
                                        
                                        return (
                                            <div key={itemId} className={`border rounded-lg p-3 sm:p-4 border-green-200 bg-green-50 ${isUpdating ? 'opacity-50' : ''}`}>
                                                {/* Item status indicator */}
                                                <div className="mb-2 text-xs text-green-600 font-medium">
                                                    ✓ Item {index + 1} - Will be processed
                                                </div>

                                                {/* Mobile Layout: Vertical Stack */}
                                                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                                    {/* Product Image and Info */}
                                                    <div className="flex items-start space-x-3 sm:space-x-0">
                                                        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                            <img
                                                                src={item.image || 'https://via.placeholder.com/80x80?text=Product'}
                                                                alt={item.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.target.src = 'https://via.placeholder.com/80x80?text=Product';
                                                                }}
                                                            />
                                                        </div>

                                                        <div className="flex-1 min-w-0 sm:ml-4">
                                                            <h3 className="font-medium text-amber-800 mb-1 text-sm sm:text-base leading-tight">{item.name}</h3>
                                                            <p className="text-amber-600 text-sm sm:text-base">GH₵{item.price.toFixed(2)} each</p>
                                                        </div>
                                                    </div>

                                                    {/* Quantity Controls and Price - Mobile Bottom */}
                                                    <div className="flex items-center justify-between sm:flex-col sm:items-end sm:space-y-3">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center space-x-2 sm:space-x-3">
                                                            <span className="text-xs sm:text-sm text-amber-700 font-medium">Qty:</span>
                                                            <div className="flex items-center space-x-1 sm:space-x-2">
                                                                <button 
                                                                    onClick={() => handleUpdateQuantity(itemId, item.quantity - 1)}
                                                                    disabled={isUpdating || item.quantity <= 1}
                                                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full cursor-pointer border border-amber-600 flex items-center justify-center hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    {isUpdating ? (
                                                                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border border-amber-600 border-t-transparent"></div>
                                                                    ) : (
                                                                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    )}
                                                                </button>
                                                                
                                                                <input
                                                                    type="number"
                                                                    value={item.quantity}
                                                                    onChange={(e) => {
                                                                        const newQuantity = parseInt(e.target.value) || 1;
                                                                        if (newQuantity >= 1) {
                                                                            handleUpdateQuantity(itemId, newQuantity);
                                                                        }
                                                                    }}
                                                                    className="w-12 sm:w-16 text-center border border-amber-300 rounded-md px-1 sm:px-2 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                                                    min="1"
                                                                />
                                                                
                                                                <button 
                                                                    onClick={() => handleUpdateQuantity(itemId, item.quantity + 1)}
                                                                    disabled={isUpdating}
                                                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full cursor-pointer border border-amber-600 flex items-center justify-center hover:bg-amber-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                                >
                                                                    {isUpdating ? (
                                                                        <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border border-amber-600 border-t-transparent"></div>
                                                                    ) : (
                                                                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                    )}
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Total Price */}
                                                        <div className="text-right">
                                                            <div className="font-bold text-base sm:text-lg text-amber-700">
                                                                GH₵{(item.price * item.quantity).toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Order Totals - All items */}
                                <div className="border-t border-amber-300 pt-4 mt-4 sm:mt-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm sm:text-base">
                                            <span className="text-amber-700">Subtotal ({cartItems.length} item{cartItems.length > 1 ? 's' : ''}):</span>
                                            <span className="font-semibold text-amber-800">GH₵{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm sm:text-base">
                                            <span className="text-amber-700">Shipping:</span>
                                            <span className="font-semibold text-green-600">FREE</span>
                                        </div>
                                        <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                                            <span className="text-amber-800">Total Amount:</span>
                                            <span className="text-amber-800">GH₵{total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Form - Mobile Responsive */}
                            <div className="bg-white rounded-lg shadow-sm border border-amber-500 p-4 sm:p-6">
                                <div className="flex items-center mb-4 sm:mb-6">
                                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mr-2" />
                                    <h2 className="text-lg sm:text-xl font-semibold text-amber-800">Shipping Address</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-amber-600 mb-2">
                                            Street Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                            placeholder="Enter your full address"
                                            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm sm:text-base"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-amber-600 mb-2">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                placeholder="Enter your city"
                                                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm sm:text-base"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-amber-600 mb-2">
                                                Region <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="region"
                                                value={formData.region}
                                                onChange={handleInputChange}
                                                placeholder="Enter your region"
                                                className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm sm:text-base"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-amber-600 mb-2">
                                            Phone Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="+233 XX XXX XXXX"
                                            className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm sm:text-base"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Order Notes - Mobile Responsive */}
                            <div className="bg-white rounded-lg shadow-sm border border-amber-500 p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-amber-800 mb-4">Order Notes (Optional)</h2>
                                <textarea
                                    name="orderNotes"
                                    value={formData.orderNotes}
                                    onChange={handleInputChange}
                                    placeholder="Any special instructions for your order..."
                                    rows="4"
                                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent text-sm sm:text-base"
                                />
                            </div>

                            {/* Confirm Order Button - Mobile Responsive */}
                            <div className="bg-white rounded-lg shadow-sm border border-amber-500 p-4 sm:p-6">
                                <div className="flex items-start text-xs sm:text-sm text-amber-600 mb-4 border border-amber-300 rounded-lg px-3 sm:px-4 py-3 bg-[#FDF8F0]">
                                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <span>All items will be processed as separate orders. Please review your order details carefully before confirming.</span>
                                </div>

                                <button 
                                    onClick={handleConfirmOrder}
                                    disabled={processingOrder}
                                    className="w-full bg-amber-600 text-white cursor-pointer py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-amber-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                                >
                                    {processingOrder ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                                            <span className="text-sm sm:text-base">Processing {cartItems.length} Order{cartItems.length > 1 ? 's' : ''}...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                                            <span className="text-sm sm:text-base">Confirm {cartItems.length} Order{cartItems.length > 1 ? 's' : ''} - GH₵{total.toFixed(2)}</span>
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-amber-500 text-center mt-3">
                                    After confirming, you'll be taken to review your order{cartItems.length > 1 ? 's' : ''} and make payment
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}