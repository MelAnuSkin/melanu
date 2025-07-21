import { useState, useEffect } from 'react';
import { ShoppingCart } from "lucide-react";
import { getAllProducts, addToCart } from '../api/client.js';

export default function ProductGrid({ products, onCartUpdate }) {
    const [apiProducts, setApiProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getAllProducts();
                const productsData = response.data;
                
                // Transform API data to match component structure
                const transformedProducts = productsData.map(product => ({
                    id: product._id || product.id,
                    name: product.name,
                    price: product.price,
                    bgImage: product.imageUrl || product.image,
                    category: product.category
                }));
                
                setApiProducts(transformedProducts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Add to cart function
    const handleAddToCart = async (product) => {
        const token = localStorage.getItem('token');
        const isAuthenticated = localStorage.getItem('isAuthenticated');

        if (!token || !isAuthenticated) {
            alert('Please login to add items to cart');
            return;
        }

        setAddingToCart(product.id);

        try {
            console.log('Adding product to cart:', product); // Debug log
            const response = await addToCart(product.id, 1, token);
            console.log('Add to cart response:', response.data); // Debug log
            
            alert(`${product.name} added to cart!`);
            
            // Trigger cart update in parent components
            if (onCartUpdate) {
                onCartUpdate();
            }
            
            // Dispatch custom event for cart update
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            console.error('Error response details:', error.response?.data); // More detailed error log
            
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
            } else {
                alert(`Failed to add item to cart: ${error.response?.data?.message || error.message}`);
            }
        } finally {
            setAddingToCart(null);
        }
    };

    // Use API products only
    const displayProducts = apiProducts;

    if (loading) {
        return (
            <div className="pb-16 px-4 mt-15">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    // Show empty state if no products
    if (displayProducts.length === 0) {
        return (
            <div className="pb-16 px-4 mt-15">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No Products Available</h3>
                        <p className="text-gray-500">Products will appear here once an admin adds them.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-16 px-4 mt-15">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayProducts.map((product) => (
                        <div 
                            key={product.id} 
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:scale-105 transform transition-transform duration-300"
                        >
                            <div className="relative">
                                <img 
                                    src={product.bgImage} 
                                    alt={product.name}
                                    className="w-full h-48 object-cover"
                                />
                            </div>
                            
                            <div className="p-4">
                                <div className="text-xs text-gray-600 font-medium mb-2 uppercase tracking-wide">
                                    {product.category}
                                </div>
                            
                                <h3 className="text-amber-600 font-serif font-semibold mb-3 line-clamp-2">
                                    {product.name}
                                </h3>
                                
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-semibold text-amber-900">
                                        GH₵{product.price}
                                    </span>
                                    
                                    <button 
                                        onClick={() => handleAddToCart(product)}
                                        disabled={addingToCart === product.id}
                                        className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <ShoppingCart size={16} />
                                        {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}