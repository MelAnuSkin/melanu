import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import UserNav from "../components/UserNav";
import { ArrowLeft, MapPin, User, Shield } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router";
import { getCartItems } from '../api/client.js';

export default function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication on component mount
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const isAuth = localStorage.getItem('isAuthenticated');
            
            if (token && isAuth) {
                setIsAuthenticated(true);
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
                const transformedItems = Array.isArray(cartData) ? cartData.map(item => ({
                    productId: item.productId || item._id || item.id,
                    _id: item._id || item.productId || item.id,
                    name: item.name || item.productName || item.product?.name || 'Unknown Product',
                    price: item.price || item.productPrice || item.product?.price || 0,
                    quantity: item.quantity || 1,
                    image: item.image || item.imageUrl || item.product?.image || item.product?.imageUrl,
                    category: item.category || item.product?.category
                })) : [];
                
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

    // Calculate totals - ensure cartItems is always an array
    const subtotal = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    // Handle order placement (you'll need to implement this endpoint later)
    const handlePlaceOrder = async () => {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            alert('Your cart is empty. Please add items before placing an order.');
            return;
        }

        // For now, just show a success message
        // Later, you can implement actual order creation API
        alert(`Order placed successfully! Total: GH₵${total.toFixed(2)}`);
        
        // Redirect to order confirmation or orders page
        // navigate('/orders');
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
                <div className="bg-[#F0D09F] px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <Link to="/cart">
                            <button className="flex items-center text-amber-800 font-mono hover:bg-[#EADAC8] hover:rounded-full hover:px-3 cursor-pointer mb-4">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Back to Cart
                            </button>
                        </Link>
                        <h1 className="text-4xl font-bold font-mono text-amber-800">Checkout</h1>
                        <p className="text-amber-700 font-bold font-mono mt-1">Complete your order securely</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* Check if cart is empty */}
                    {!Array.isArray(cartItems) || cartItems.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-amber-600 mb-4">
                                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6m-10 0V9a1 1 0 011-1h8a1 1 0 011 1v4.01" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-amber-800 mb-2">Your Cart is Empty</h2>
                            <p className="text-amber-600 mb-6">Add some products before proceeding to checkout!</p>
                            <Link to="/products">
                                <button className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 cursor-pointer">
                                    Start Shopping
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Form Section */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white rounded-lg shadow-sm shadow-amber-600 p-6">
                                    <div className="flex items-center mb-6">
                                        <User className="w-5 h-5 text-amber-600 mr-2" />
                                        <h2 className="text-xl font-semibold text-amber-800">Personal Information</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-amber-600 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                placeholder="Enter your first name"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-amber-600 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                placeholder="Enter your last name"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <label className="block text-sm font-medium text-amber-600 mb-2">Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="youremail@example.com"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-amber-600 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                placeholder="+233 XX XXX XXXX"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm shadow-amber-600 p-6">
                                    <div className="flex items-center mb-6">
                                        <MapPin className="w-5 h-5 text-amber-600 mr-2" />
                                        <h2 className="text-xl font-semibold text-amber-800">Shipping Address</h2>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-amber-600 mb-2">Street Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                placeholder="Enter your full address"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-amber-600 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    name="city"
                                                    placeholder="Enter your city"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-amber-600 mb-2">Region</label>
                                                <input
                                                    type="text"
                                                    name="region"
                                                    placeholder="Enter your region"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-amber-600 mb-2">Postal Code (Optional)</label>
                                            <input
                                                type="text"
                                                name="postalcode"
                                                placeholder="Enter postal code"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg shadow-sm shadow-amber-600 p-6">
                                    <h2 className="text-xl font-semibold text-amber-800 mb-4">Order Notes (Optional)</h2>
                                    <textarea
                                        name="orderNotes"
                                        placeholder="Any special instructions for your order..."
                                        rows="4"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                </div>
                            </div>

                            {/* Order Summary Section - Now Dynamic */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-amber-500 sticky top-8">
                                    <h2 className="text-xl font-mono font-bold text-amber-700 mb-6">Order Summary</h2>

                                    <div className="space-y-4">
                                        {cartItems.map((item) => (
                                            <div key={item.productId || item._id} className="flex items-center space-x-3">
                                                <div className="w-20 h-20 rounded-md flex items-center justify-center">
                                                    <div className="w-15 h-15 bg-gray-100 rounded-lg overflow-hidden">
                                                        <img
                                                            src={item.image || item.imageUrl || 'https://via.placeholder.com/80x80?text=Product'}
                                                            alt={item.name}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = 'https://via.placeholder.com/80x80?text=Product';
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-amber-800">{item.name}</div>
                                                    <div className="text-sm text-amber-500">Qty: {item.quantity}</div>
                                                </div>
                                                <div className="font-semibold text-amber-800">
                                                    GH₵{(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t border-amber-600 pt-4 mt-6 space-y-2">
                                        <div className="flex justify-between text-amber-600">
                                            <span>Subtotal</span>
                                            <span>GH₵{subtotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-amber-600">
                                            <span>Shipping</span>
                                            <span className="font-medium text-green-600">FREE</span>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <div className="flex items-center text-sm text-amber-600 mb-4 border border-amber-300 rounded-lg px-2 py-2 bg-[#FDF8F0]">
                                            <Shield className="w-4 h-4 text-green-600 mr-2" />
                                            Your payment information is secure and encrypted
                                        </div>

                                        <button 
                                            onClick={handlePlaceOrder}
                                            className="w-full bg-amber-600 text-white py-3 cursor-pointer px-4 rounded-md font-semibold hover:bg-amber-800 transition-colors"
                                        >
                                            Place Order - GH₵{total.toFixed(2)}
                                        </button>

                                        <p className="text-xs text-amber-500 text-center mt-3">
                                            By placing your order, you agree to our Terms of Service and Privacy Policy
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    )
}