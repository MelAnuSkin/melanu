import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import UserNav from "../components/UserNav";
import { ArrowLeft, MapPin, User, Shield, Minus, Plus, CreditCard } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router";
import { getCartItems, initiatePayment, updateCartItem, createOrder } from '../api/client.js';

export default function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
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
                
                // Transform cart data to ensure consistent structure - FIXED VERSION
                const transformedItems = Array.isArray(cartData) ? cartData.map(item => {
                    // CORRECTED: Based on typical cart API responses, try these in order:
                    let productId = null;
                    
                    if (item.product && item.product._id) {
                        productId = item.product._id;  // Nested product object
                        console.log(`Using nested product ID for ${item.name}: ${productId}`);
                    } else if (item.productId) {
                        productId = item.productId;    // Direct productId field
                        console.log(`Using direct product ID for ${item.name}: ${productId}`);
                    } else {
                        console.error('NO PRODUCT ID FOUND for item:', item);
                        // Don't use item._id as fallback - it's wrong!
                    }
                    
                    return {
                        productId: productId,          // Only use actual product ID
                        cartItemId: item._id,          // Cart item ID for reference
                        _id: item._id,                 // Keep for compatibility
                        name: item.name || item.productName || item.product?.name || 'Unknown Product',
                        price: parseFloat(item.price || item.productPrice || item.product?.price || 0),
                        quantity: parseInt(item.quantity || 1),
                        image: item.image || item.imageUrl || item.product?.image || item.product?.imageUrl,
                        category: item.category || item.product?.category
                    };
                }).filter(item => {
                    // VALIDATION: Filter out items without productId
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
            
            // DEBUG: Log current cart structure
            console.log('=== CART DEBUG ===');
            console.log('Cart items array:', cartItems);
            cartItems.forEach((item, index) => {
                console.log(`Item ${index}:`, {
                    name: item.name,
                    productId: item.productId,
                    _id: item._id,
                    id: item.id,
                    fullItem: item
                });
            });
            console.log('=== END CART DEBUG ===');
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

    // Calculate totals - ensure cartItems is always an array
    const subtotal = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    // Handle payment process - FIXED WITH PROPER PRODUCT ID HANDLING
    const handleMakePayment = async () => {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            alert('Your cart is empty. Please add items before making payment.');
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

        setProcessingPayment(true);

        try {
            const token = localStorage.getItem('token');
            
            // Get user email from localStorage or decode from token
            let userEmail = localStorage.getItem('userEmail');
            
            if (!userEmail) {
                try {
                    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                    userEmail = tokenPayload.email;
                } catch (e) {
                    console.error('Could not decode email from token');
                    alert('Unable to retrieve user email. Please try logging in again.');
                    setProcessingPayment(false);
                    return;
                }
            }

            console.log('Creating order with userId:', userId);
            console.log('Token payload debug:');
            try {
                const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                console.log('Full token payload:', tokenPayload);
            } catch (e) {
                console.error('Could not decode token:', e);
            }

            // STEP 1: Create the order - FIXED productId extraction
            const orderData = {
                items: cartItems.map(item => {
                    // FIXED: Only use productId, never _id for product identification
                    const productId = item.productId;  // This should now be the actual product ID
                    
                    console.log(`Mapping item: ${item.name} -> productId: ${productId}, quantity: ${item.quantity}`);
                    
                    // Validate that we have a productId
                    if (!productId) {
                        console.error('Missing productId for item:', item);
                        throw new Error(`Product ID missing for item: ${item.name}`);
                    }
                    
                    return {
                        productId: productId,
                        quantity: item.quantity
                    };
                }),
                shippingAddress: {
                    street: formData.address,
                    city: formData.city,
                    country: "Ghana",
                    phone: formData.phone
                },
                orderNotes: formData.orderNotes
            };

            console.log('=== ORDER DATA DEBUG ===');
            console.log('Complete order data:', JSON.stringify(orderData, null, 2));
            console.log('Items being sent to backend:', orderData.items);
            
            // Validate all items have productIds before sending
            const itemsWithoutProductId = orderData.items.filter(item => !item.productId);
            if (itemsWithoutProductId.length > 0) {
                console.error('Items missing productId:', itemsWithoutProductId);
                throw new Error('Some items are missing product IDs. Please refresh and try again.');
            }
            
            console.log('=== END ORDER DATA DEBUG ===');
            
            // Create order using the updated function that includes userId
            const orderResponse = await createOrder(orderData, userId, token);
            
            console.log('Order creation response:', orderResponse.data);

            // Extract the order ID from the response
            const orderId = orderResponse.data._id || orderResponse.data.orderId || orderResponse.data.id;
            
            if (!orderId) {
                throw new Error('Order ID not received from server');
            }

            console.log('Order created successfully with ID:', orderId);

            // STEP 2: Now initiate payment with the real order ID
            console.log('Initiating payment with:', { email: userEmail, orderId });
            
            const paymentResponse = await initiatePayment(userEmail, orderId, token);
            
            console.log('Payment initiation response:', paymentResponse.data);

            // Handle the payment response and redirect to Paystack
            if (paymentResponse.data && paymentResponse.data.authorization_url) {
                console.log('Redirecting to Paystack...');
                window.location.href = paymentResponse.data.authorization_url;
            } else if (paymentResponse.data && paymentResponse.data.paymentUrl) {
                console.log('Redirecting to payment URL...');
                window.location.href = paymentResponse.data.paymentUrl;
            } else {
                throw new Error('Payment authorization URL not received');
            }

        } catch (error) {
            console.error('Error in payment process:', error);
            
            let errorMessage = 'Failed to process order. Please try again.';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setProcessingPayment(false);
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
                        <p className="text-amber-700 font-bold font-mono mt-1 text-sm sm:text-base">Complete your order securely</p>
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
                            {/* Order Review Section with Quantity Controls - Mobile Responsive */}
                            <div className="bg-white rounded-lg shadow-sm border border-amber-500 p-4 sm:p-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-amber-800 mb-4 sm:mb-6">Review Your Order</h2>
                                
                                <div className="space-y-3 sm:space-y-4">
                                    {cartItems.map((item) => {
                                        const itemId = item.productId || item._id;
                                        const isUpdating = updating[itemId];
                                        
                                        return (
                                            <div key={itemId} className={`border border-amber-200 rounded-lg p-3 sm:p-4 ${isUpdating ? 'opacity-50' : ''}`}>
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

                                {/* Order Totals - Mobile Responsive */}
                                <div className="border-t border-amber-300 pt-4 mt-4 sm:mt-6">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm sm:text-base">
                                            <span className="text-amber-700">Subtotal:</span>
                                            <span className="font-semibold text-amber-800">GH₵{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-sm sm:text-base">
                                            <span className="text-amber-700">Shipping:</span>
                                            <span className="font-semibold text-green-600">FREE</span>
                                        </div>
                                        <div className="flex justify-between items-center text-base sm:text-lg font-bold">
                                            <span className="text-amber-800">Total:</span>
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

                            {/* Make Payment Button - Mobile Responsive */}
                            <div className="bg-white rounded-lg shadow-sm border border-amber-500 p-4 sm:p-6">
                                <div className="flex items-start text-xs sm:text-sm text-amber-600 mb-4 border border-amber-300 rounded-lg px-3 sm:px-4 py-3 bg-[#FDF8F0]">
                                    <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                                    <span>Your payment information is secure and encrypted with Paystack</span>
                                </div>

                                <button 
                                    onClick={handleMakePayment}
                                    disabled={processingPayment}
                                    className="w-full bg-green-600 text-white cursor-pointer py-3 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 sm:gap-3"
                                >
                                    {processingPayment ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 sm:h-6 sm:w-6 border-2 border-white border-t-transparent"></div>
                                            <span className="text-sm sm:text-base">Processing Payment...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CreditCard className="w-5 h-5 sm:w-6 sm:h-6" />
                                            <span className="text-sm sm:text-base">Make Payment - GH₵{total.toFixed(2)}</span>
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-amber-500 text-center mt-3">
                                    By placing your order, you agree to our Terms of Service and Privacy Policy
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