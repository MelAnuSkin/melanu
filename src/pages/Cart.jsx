import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Navbar from "../components/Navbar";
import UserNav from "../components/UserNav";
import { ArrowLeft, Minus, Plus, Trash, Truck } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router";
import { getCartItems, updateCartItem, removeFromCart, clearCart } from '../api/client.js';

export default function Cart() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [updating, setUpdating] = useState({}); 
    const [removing, setRemoving] = useState({});

    
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const isAuth = localStorage.getItem('isAuthenticated');
            
            if (token && isAuth) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                alert('Please login to view your cart');
                navigate('/login');
                return;
            }
        };
        
        checkAuth();

        window.addEventListener('storage', checkAuth);
        window.addEventListener('authChanged', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChanged', checkAuth);
        };
    }, [navigate]);

  
    const normalizeCartData = (data) => {
        let cartData = data || [];
        
        // Handle different possible response structures
        if (cartData.items) {
            cartData = cartData.items;
        } else if (cartData.cart && cartData.cart.items) {
            cartData = cartData.cart.items;
        }
        
        // Transform cart data to ensure consistent structure
        return Array.isArray(cartData) ? cartData.map(item => {
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
            
            console.log('=== ITEM PROCESSING DEBUG ===');
            console.log('Processing cart item:', item);
            console.log('Extracted productId:', productId);
            console.log('Cart item _id:', item._id);
            console.log('Product nested _id:', item.product?._id);
            console.log('=== END ITEM PROCESSING ===');
            
            return {
                productId: productId,  // Only use actual product ID
                cartItemId: item._id,  // Keep cart item ID separate
                _id: item._id,         // Keep for compatibility
                name: item.name || item.productName || item.product?.name || 'Unknown Product',
                price: parseFloat(item.price || item.productPrice || item.product?.price || 0),
                quantity: parseInt(item.quantity || 1),
                image: item.image || item.imageUrl || item.product?.image || item.product?.imageUrl,
                category: item.category || item.product?.category
            };
        }).filter(item => {
            // Filter out items without productId
            if (!item.productId) {
                console.error(' Removing item without productId:', item.name);
                return false;
            }
            return true;
        }) : [];
    };

    // Fetch cart items
    const fetchCartItems = async () => {
        if (!isAuthenticated) return;

        try {
            const token = localStorage.getItem('token');
            console.log('Fetching cart items...');
            
            const response = await getCartItems(token);
            
            // === EXTENSIVE DEBUG LOGGING ===
            console.log('=== RAW CART RESPONSE DEBUG ===');
            console.log('Full response object:', response);
            console.log('Response status:', response.status);
            console.log('Response data:', response.data);
            console.log('Response data type:', typeof response.data);
            console.log('Response data stringified:', JSON.stringify(response.data, null, 2));
            
            // === SPECIFIC CART STRUCTURE DEBUG ===
            console.log('=== DETAILED CART ITEM ANALYSIS ===');
            let cartData = response.data || [];

            // Handle different possible response structures
            if (cartData.items) {
                cartData = cartData.items;
            } else if (cartData.cart && cartData.cart.items) {
                cartData = cartData.cart.items;
            }

            if (Array.isArray(cartData) && cartData.length > 0) {
                const firstItem = cartData[0];
                console.log('First cart item structure:', JSON.stringify(firstItem, null, 2));
                console.log('First item keys:', Object.keys(firstItem));
                
                // Check for product ID in different locations
                console.log('Product ID Analysis:');
                console.log('- item._id:', firstItem._id);
                console.log('- item.productId:', firstItem.productId);
                console.log('- item.product:', firstItem.product);
                console.log('- item.product?._id:', firstItem.product?._id);
                console.log('- item.id:', firstItem.id);
                
                // Check what we should actually use as productId
                console.log('Which field contains the actual product ID?');
                if (firstItem.product && firstItem.product._id) {
                    console.log('Use item.product._id:', firstItem.product._id);
                } else if (firstItem.productId) {
                    console.log(' Use item.productId:', firstItem.productId);
                } else {
                    console.log(' No clear product ID found - this is the problem!');
                    console.log('Available fields:', Object.keys(firstItem));
                }
            }
            console.log('=== END DETAILED ANALYSIS ===');
            
            // Check if data is array or object
            if (Array.isArray(response.data)) {
                console.log('Data is an array with length:', response.data.length);
                response.data.forEach((item, index) => {
                    console.log(`Item ${index}:`, JSON.stringify(item, null, 2));
                });
            } else if (response.data && typeof response.data === 'object') {
                console.log('Data is an object with keys:', Object.keys(response.data));
                if (response.data.items) {
                    console.log('Found items array:', JSON.stringify(response.data.items, null, 2));
                }
                if (response.data.cart) {
                    console.log('Found cart object:', JSON.stringify(response.data.cart, null, 2));
                }
            }
            console.log('=== END RAW CART DEBUG ===');
            
            const transformedItems = normalizeCartData(response.data);
            
            console.log('=== TRANSFORMATION DEBUG ===');
            console.log('Transformed cart items:', transformedItems);
            console.log('Number of transformed items:', transformedItems.length);
            transformedItems.forEach((item, index) => {
                console.log(`Transformed item ${index}:`, {
                    productId: item.productId,
                    _id: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    fullItem: item
                });
            });
            console.log('=== END TRANSFORMATION DEBUG ===');
            
            setCartItems(transformedItems);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching cart:', error);
            console.log('=== ERROR DEBUG ===');
            console.log('Error response:', error.response);
            console.log('Error data:', error.response?.data);
            console.log('Error status:', error.response?.status);
            console.log('=== END ERROR DEBUG ===');
            
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
                localStorage.removeItem('token');
                localStorage.removeItem('isAuthenticated');
                navigate('/login');
            } else {
                console.error('Cart fetch error details:', error.response?.data || error.message);
                setCartItems([]);
            }
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCartItems();
    }, [isAuthenticated]);

  
    useEffect(() => {
        const handleCartUpdate = () => {
            if (isAuthenticated) {
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
        if (updating[productId]) return;

        const itemKey = productId;
        setUpdating(prev => ({ ...prev, [itemKey]: true }));

        // Store original state for rollback
        const originalItems = [...cartItems];
        
        // update the UI
        setCartItems(prev => prev.map(item => 
            (item.productId === productId || item._id === productId)
                ? { ...item, quantity: newQuantity }
                : item
        ));

        try {
            const token = localStorage.getItem('token');
            console.log('=== UPDATE QUANTITY DEBUG ===');
            console.log('Updating cart item quantity:', { productId, newQuantity });
            console.log('ProductId type:', typeof productId);
            console.log('ProductId length:', productId?.length);
            console.log('=== END UPDATE DEBUG ===');
            
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
            
           
            setCartItems(originalItems);
            
            let errorMessage = 'Failed to update quantity';
            
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                
                if (status === 404) {
                    
                    errorMessage = 'Product not found in cart. This might be an ID mismatch issue.';
                    console.error('=== 404 ERROR ANALYSIS ===');
                    console.error('Sent productId:', productId);
                    console.error('Available items in state:', cartItems.map(item => ({
                        productId: item.productId,
                        _id: item._id,
                        name: item.name
                    })));
                    console.error('=== END 404 ANALYSIS ===');
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

    const handleRemoveItem = async (productId) => {
        if (!window.confirm('Remove this item from cart?')) return;
        if (removing[productId]) return;

        const itemKey = productId;
        setRemoving(prev => ({ ...prev, [itemKey]: true }));

        // Store original state for rollback
        const originalItems = [...cartItems];
        
  
        setCartItems(prev => prev.filter(item => 
            item.productId !== productId && item._id !== productId
        ));

        try {
            const token = localStorage.getItem('token');
            console.log('=== REMOVE ITEM DEBUG ===');
            console.log('Removing item from cart:', productId);
            console.log('ProductId type:', typeof productId);
            console.log('=== END REMOVE DEBUG ===');
            
            const response = await removeFromCart(productId, token);
            console.log('Remove item response:', response);
            
            if (response.status === 200 || response.status === 201 || response.status === 204) {
                // Dispatch event for other components
                window.dispatchEvent(new CustomEvent('cartUpdated'));
                console.log('Item removal successful');
                
                // Show success message
                const removedItem = originalItems.find(item => 
                    item.productId === productId || item._id === productId
                );
                if (removedItem) {
                    console.log(`Successfully removed "${removedItem.name}" from cart`);
                }
                
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
            
        } catch (error) {
            console.error(' Error removing item:', error);
            
           
            setCartItems(originalItems);
            
            let errorMessage = 'Failed to remove item';
            
            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                
                if (status === 404) {
                    errorMessage = 'Item not found in cart. This might be an ID mismatch issue.';
                    console.error('=== REMOVE 404 ERROR ANALYSIS ===');
                    console.error('Sent productId:', productId);
                    console.error('Available items:', cartItems.map(item => ({
                        productId: item.productId,
                        _id: item._id,
                        name: item.name
                    })));
                    console.error('=== END REMOVE 404 ANALYSIS ===');
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
            setRemoving(prev => ({ ...prev, [itemKey]: false }));
        }
    };

   
    const handleClearCart = async () => {
        if (!window.confirm('Are you sure you want to clear your entire cart?')) return;
        
        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            console.log('Clearing entire cart...');
            
            const response = await clearCart(token);
            console.log(' Clear cart response:', response);
            
            if (response.status === 200 || response.status === 201 || response.status === 204) {
                setCartItems([]);
                window.dispatchEvent(new CustomEvent('cartUpdated'));
                console.log('Cart cleared successfully');
            } else {
                throw new Error(`Unexpected response status: ${response.status}`);
            }
            
        } catch (error) {
            console.error('Error clearing cart:', error);
            alert('Failed to clear cart. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    
    const handleProceedToPayment = () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty');
            return;
        }
        
        console.log('=== PROCEEDING TO PAYMENT DEBUG ===');
        console.log('Cart items before checkout:', cartItems);
        console.log('Cart items productIds:', cartItems.map(item => ({
            name: item.name,
            productId: item.productId,
            _id: item._id
        })));
        console.log('=== END PAYMENT DEBUG ===');
    
        navigate('/checkout');
    };

    
    const subtotal = Array.isArray(cartItems) ? cartItems.reduce((sum, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return sum + (price * quantity);
    }, 0) : 0;

    if (loading) {
        return (
            <>
                {isAuthenticated ? <UserNav /> : <Navbar />}
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
            {isAuthenticated ? <UserNav /> : <Navbar />}

            <div className="min-h-screen bg-white">
                <div className="bg-[#F0D09F] px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <Link to="/products">
                            <button className="flex items-center text-amber-800 font-mono hover:bg-[#EADAC8] hover:rounded-full hover:px-3 cursor-pointer mb-4">
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                Continue Shopping
                            </button>
                        </Link>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold font-mono text-amber-800">Shopping Cart</h1>
                            {cartItems.length > 0 && (
                                <button 
                                    onClick={handleClearCart}
                                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer transition-colors"
                                >
                                    Clear Cart
                                </button>
                            )}
                        </div>
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
                                {cartItems.map((item) => {
                                    const itemId = item.productId || item._id;
                                    const isUpdating = updating[itemId];
                                    const isRemoving = removing[itemId];
                                    
                                    return (
                                        <div key={itemId} className={`bg-white rounded-lg p-7 shadow-sm border border-amber-500 transition-opacity ${(isUpdating || isRemoving) ? 'opacity-50' : ''}`}>
                                            <div className="flex items-center space-x-4">
                                                <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={item.image || 'https://via.placeholder.com/96x96?text=Product'}
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
                                                        <span className="text-amber-700 font-bold text-lg">GH₵{item.price.toFixed(2)}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center space-x-3">
                                                    <button 
                                                        onClick={() => handleUpdateQuantity(itemId, item.quantity - 1)}
                                                        disabled={isUpdating || isRemoving || item.quantity <= 1}
                                                        className="w-8 h-8 rounded-full cursor-pointer border border-amber-600 flex items-center justify-center hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        {isUpdating ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border border-amber-600 border-t-transparent"></div>
                                                        ) : (
                                                            <Minus className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => handleUpdateQuantity(itemId, item.quantity + 1)}
                                                        disabled={isUpdating || isRemoving}
                                                        className="w-8 h-8 rounded-full cursor-pointer border border-amber-600 flex items-center justify-center hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                    >
                                                        {isUpdating ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border border-amber-600 border-t-transparent"></div>
                                                        ) : (
                                                            <Plus className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <div className="font-bold text-lg text-amber-700">
                                                        GH₵{(item.price * item.quantity).toFixed(2)}
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => handleRemoveItem(itemId)}
                                                    disabled={isUpdating || isRemoving}
                                                    className="text-amber-600 hover:text-amber-800 hover:bg-[#EADAC8] hover:rounded-lg hover:py-2 px-3 cursor-pointer p-1 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    {isRemoving ? (
                                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-amber-600 border-t-transparent"></div>
                                                    ) : (
                                                        <Trash className="w-5 h-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
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

                                    <button 
                                        onClick={handleProceedToPayment}
                                        disabled={cartItems.length === 0}
                                        className="w-full bg-amber-600 text-white cursor-pointer py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Proceed to Payment
                                    </button>

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