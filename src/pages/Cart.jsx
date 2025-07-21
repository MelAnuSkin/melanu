import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from "../components/Navbar";
import { ArrowLeft, Minus, Plus, Trash, Truck } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router";
import { getCartItems, updateCartItem, removeFromCart, addToCart } from '../api/client.js';

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication on component mount
    useEffect(() => {
        const token = localStorage.getItem('token');
        const isAuth = localStorage.getItem('isAuthenticated');

        if (!token || !isAuth) {
            alert('Please login to view your cart');
            navigate('/login');
            return;
        }

        setIsAuthenticated(true);
    }, [navigate]);

    // Fetch cart items
    useEffect(() => {
        const fetchCartItems = async () => {
            if (!isAuthenticated) return;

            try {
                const token = localStorage.getItem('token');
                const response = await getCartItems(token);
                
                console.log('Cart API Response:', response.data); // Debug log
                
                // Handle different possible response structures
                let cartData = response.data || [];
                
                // If the response has a nested structure, extract the items
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
                
                console.log('Transformed cart items:', transformedItems); // Debug log
                setCartItems(transformedItems);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching cart:', error);
                if (error.response?.status === 401) {
                    alert('Session expired. Please login again.');
                    navigate('/login');
                } else {
                    console.error('Cart fetch error details:', error.response?.data);
                    setCartItems([]);
                }
                setLoading(false);
            }
        };

        fetchCartItems();
    }, [isAuthenticated, navigate]);

    // Listen for cart updates from other components
    useEffect(() => {
        const handleCartUpdate = () => {
            if (isAuthenticated) {
                // Refetch cart items when cart is updated
                const fetchCartItems = async () => {
                    try {
                        const token = localStorage.getItem('token');
                        const response = await getCartItems(token);
                        
                        let cartData = response.data || [];
                        if (cartData.items) {
                            cartData = cartData.items;
                        } else if (cartData.cart && cartData.cart.items) {
                            cartData = cartData.cart.items;
                        }
                        
                        const transformedItems = Array.isArray(cartData) ? cartData.map(item => ({
                            productId: item.productId || item._id || item.id,
                            _id: item._id || item.productId || item.id,
                            name: item.name || item.productName || item.product?.name || 'Unknown Product',
                            price: item.price || item.productPrice || item.product?.price || 0,
                            quantity: item.quantity || 1,
                            image: item.image || item.imageUrl || item.product?.image || item.product?.imageUrl,
                            category: item.category || item.product?.category
                        })) : [];
                        
                        setCartItems(transformedItems);
                    } catch (error) {
                        console.error('Error refreshing cart:', error);
                    }
                };
                
                fetchCartItems();
            }
        };

        window.addEventListener('cartUpdated', handleCartUpdate);
        
        return () => {
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, [isAuthenticated]);

    // Update quantity
    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return;

        // Optimistically update the UI first
        const originalItems = [...cartItems];
        setCartItems(prev => prev.map(item => 
            (item.productId === productId || item._id === productId)
                ? { ...item, quantity: newQuantity }
                : item
        ));

        try {
            const token = localStorage.getItem('token');
            console.log('Updating cart item:', { productId, newQuantity }); // Debug log
            
            await updateCartItem(productId, newQuantity, token);
            console.log('Update successful'); // Debug log
            
            // Force refresh cart from API to ensure consistency
            const response = await getCartItems(token);
            let cartData = response.data || [];
            
            if (cartData.items) {
                cartData = cartData.items;
            } else if (cartData.cart && cartData.cart.items) {
                cartData = cartData.cart.items;
            }
            
            const transformedItems = Array.isArray(cartData) ? cartData.map(item => ({
                productId: item.productId || item._id || item.id,
                _id: item._id || item.productId || item.id,
                name: item.name || item.productName || item.product?.name || 'Unknown Product',
                price: item.price || item.productPrice || item.product?.price || 0,
                quantity: item.quantity || 1,
                image: item.image || item.imageUrl || item.product?.image || item.product?.imageUrl,
                category: item.category || item.product?.category
            })) : [];
            
            setCartItems(transformedItems);
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
        } catch (error) {
            console.error('Error updating quantity:', error);
            console.error('Error details:', error.response?.data);
            
            // Revert optimistic update on failure
            setCartItems(originalItems);
            alert(`Failed to update quantity: ${error.response?.data?.message || error.message}`);
        }
    };

    // Force refresh cart from API
    const forceRefreshCart = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log('Force refreshing cart...'); // Debug log
            
            const response = await getCartItems(token);
            console.log('Raw cart API response:', response); // Debug log
            console.log('Cart data received:', response.data); // Debug log
            
            let cartData = response.data || [];
            
            // Handle different possible response structures
            if (cartData.items) {
                console.log('Using cartData.items:', cartData.items);
                cartData = cartData.items;
            } else if (cartData.cart && cartData.cart.items) {
                console.log('Using cartData.cart.items:', cartData.cart.items);
                cartData = cartData.cart.items;
            } else {
                console.log('Using cartData directly:', cartData);
            }
            
            const transformedItems = Array.isArray(cartData) ? cartData.map(item => ({
                productId: item.productId || item._id || item.id,
                _id: item._id || item.productId || item.id,
                name: item.name || item.productName || item.product?.name || 'Unknown Product',
                price: item.price || item.productPrice || item.product?.price || 0,
                quantity: item.quantity || 1,
                image: item.image || item.imageUrl || item.product?.image || item.product?.imageUrl,
                category: item.category || item.product?.category
            })) : [];
            
            console.log('Final transformed items:', transformedItems); // Debug log
            setCartItems(transformedItems);
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
            return transformedItems;
        } catch (error) {
            console.error('Error force refreshing cart:', error);
            return [];
        }
    };

    // Remove item from cart
    const handleRemoveItem = async (productId) => {
        if (!window.confirm('Remove this item from cart?')) return;

        try {
            const token = localStorage.getItem('token');
            console.log('Removing item from cart:', productId); // Debug log
            
            const response = await removeFromCart(productId, token);
            console.log('Remove response status:', response.status); // Debug log
            console.log('Remove response data:', response.data); // Debug log
            
            if (response.status === 200) {
                console.log('Remove successful, refreshing cart...'); // Debug log
                
                // Wait a moment for backend to process
                await new Promise(resolve => setTimeout(resolve, 500));
                
                // Force refresh multiple times if needed
                let attempts = 0;
                const maxAttempts = 3;
                
                while (attempts < maxAttempts) {
                    console.log(`Refresh attempt ${attempts + 1}/${maxAttempts}`);
                    const refreshedItems = await forceRefreshCart();
                    
                    // Check if the item was actually removed
                    const itemStillExists = refreshedItems.some(item => 
                        item.productId === productId || item._id === productId
                    );
                    
                    if (!itemStillExists) {
                        console.log('Item successfully removed from cart');
                        break;
                    } else {
                        console.log('Item still in cart, trying again...');
                        attempts++;
                        if (attempts < maxAttempts) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                    }
                }
                
                if (attempts >= maxAttempts) {
                    console.error('Failed to remove item after multiple attempts');
                    // Manually filter out the item as a last resort
                    setCartItems(prev => prev.filter(item => 
                        item.productId !== productId && item._id !== productId
                    ));
                }
            }
            
        } catch (error) {
            console.error('Error removing item:', error);
            console.error('Error details:', error.response?.data);
            alert(`Failed to remove item: ${error.response?.data?.message || error.message}`);
        }
    };

    // Calculate totals - ensure cartItems is always an array
    const subtotal = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0) : 0;

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-amber-700">Loading your cart...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-white">
                <div className="bg-[#F0D09F] px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <Link to="/products">
                            <button className="flex items-center text-amber-800 font-mono hover:bg-[#EADAC8] hover:rounded-full hover:px-3 cursor-pointer mb-4">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Continue Shopping
                            </button>
                        </Link>
                        <h1 className="text-4xl font-bold font-mono text-amber-800">Shopping Cart</h1>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-8">
                    {!Array.isArray(cartItems) || cartItems.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-amber-600 mb-4">
                                <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L5 3H3m4 10v6a1 1 0 001 1h10a1 1 0 001-1v-6m-10 0V9a1 1 0 011-1h8a1 1 0 011 1v4.01" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-amber-800 mb-2">Your Cart is Empty</h2>
                            <p className="text-amber-600 mb-6">Add some products to get started!</p>
                            <Link to="/products">
                                <button className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 cursor-pointer">
                                    Start Shopping
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-4">
                                {cartItems.map((item) => (
                                    <div key={item.productId || item._id} className="bg-white rounded-lg p-7 shadow-sm border border-amber-500">
                                        <div className="flex items-center space-x-4">
                                            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={item.image || item.imageUrl || 'https://via.placeholder.com/96x96?text=Product'}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/96x96?text=Product';
                                                    }}
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-medium text-amber-800 mb-2">{item.name}</h3>
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-amber-700 font-bold text-lg">GH₵{item.price}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-3">
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item.productId || item._id, item.quantity - 1)}
                                                    className="w-8 h-8 rounded-full cursor-pointer border border-amber-600 flex items-center justify-center hover:bg-amber-500"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item.productId || item._id, item.quantity + 1)}
                                                    className="w-8 h-8 rounded-full cursor-pointer border border-amber-600 flex items-center justify-center hover:bg-amber-500"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="text-right">
                                                <div className="font-bold text-lg text-amber-700">
                                                    GH₵{(item.price * item.quantity).toFixed(2)}
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleRemoveItem(item.productId || item._id)}
                                                className="text-amber-600 hover:text-amber-800 hover:bg-[#EADAC8] hover:rounded-lg hover:py-2 px-3 cursor-pointer p-1"
                                            >
                                                <Trash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-lg p-6 shadow-sm border border-amber-500 sticky top-8">
                                    <h2 className="text-xl font-mono font-bold text-amber-700 mb-6">Order Summary</h2>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between">
                                            <span className="text-amber-700">Subtotal</span>
                                            <span className="text-amber-700">GH₵{subtotal.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center space-x-2">
                                                <Truck className="w-4 h-4 text-amber-700" />
                                                <span className="text-amber-700">Shipping</span>
                                            </div>
                                            <span className="font-medium text-green-600">FREE</span>
                                        </div>

                                        <div className="border-t border-amber-500 pt-4">
                                            <div className="flex justify-between">
                                                <span className="text-lg font-bold text-amber-700">Total</span>
                                                <span className="text-xl font-bold text-amber-700">GH₵{subtotal.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <Link to="/checkout">
                                        <button className="w-full bg-amber-600 text-white cursor-pointer py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors">
                                            Proceed to Checkout
                                        </button>
                                    </Link>

                                    <div className="mt-4 text-center text-sm text-amber-500">
                                        <p>Secure checkout with 256-bit SSL encryption</p>
                                        <p>Free returns within 30 days</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}