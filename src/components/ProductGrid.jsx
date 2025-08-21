import { useState, useEffect } from 'react';
import { ShoppingCart, Zap, Search } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { getAllProducts, addToCart, searchProductsByName, searchProductsByCategory } from '../api/client.js';

export default function ProductGrid({ onCartUpdate }) {
    const [apiProducts, setApiProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(null);
    
    // Search states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Products");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const isAuth = localStorage.getItem('isAuthenticated');
            
            if (token && isAuth) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };
        checkAuth();

        window.addEventListener('storage', checkAuth);
        window.addEventListener('authChanged', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChanged', checkAuth);
        };
    }, []);

    // Fetch all products from API initially
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
                    category: product.category,
                    originalProduct: product // Keep original for search
                }));
                
                setApiProducts(transformedProducts);
                setLoading(false);
            } catch (error) {
                console.error('❌ Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle search by name
    const handleSearchByName = async (searchValue) => {
        if (!searchValue.trim()) {
            setIsSearchActive(false);
            setSearchResults([]);
            setError("");
            return;
        }

        if (!isAuthenticated) {
            setError("Please log in to search products");
            return;
        }

        setSearchLoading(true);
        setError("");
        setIsSearchActive(true);

        try {
            const token = localStorage.getItem('token');
            const response = await searchProductsByName(searchValue, token);
            const products = response.data;
            
            if (products && Array.isArray(products)) {
                // Transform search results to match component structure
                const transformedSearchResults = products.map(product => ({
                    id: product._id || product.id,
                    name: product.name,
                    price: product.price,
                    bgImage: product.imageUrl || product.image,
                    category: product.category,
                    originalProduct: product
                }));
                
                setSearchResults(transformedSearchResults);
                
                if (transformedSearchResults.length === 0) {
                    setError(`No products found matching "${searchValue}"`);
                } else {
                    setError("");
                }
            } else {
                setError("Unexpected response format from server");
                setSearchResults([]);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Please log in again to search products");
                localStorage.removeItem('token');
                localStorage.removeItem('isAuthenticated');
                setIsAuthenticated(false);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to search products. Please try again.");
            }
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    // Handle search by category
    const handleCategoryChange = async (category) => {
        console.log('📂 Category selected:', category);
        
        setSelectedCategory(category);
        setSearchTerm(""); // Clear search term when changing category
        
        if (category === "All Products") {
            setIsSearchActive(false);
            setSearchResults([]);
            setError("");
            return;
        }

        if (!isAuthenticated) {
            setError("Please log in to filter products by category");
            return;
        }

        setSearchLoading(true);
        setError("");
        setIsSearchActive(true);

        try {
            const token = localStorage.getItem('token');
            
            // Map display names to API category names - let's check what categories exist in your products
            const categoryMap = {
                "Face Care": "Skincare",
                "Body Care": "Body Care", 
                "Hair Care": "Haircare",
                "Men's Collection": "Men's"
            };
            
            const apiCategory = categoryMap[category] || category;
            console.log('📂 Mapped category for API:', apiCategory);
            console.log('📂 Available categories in all products:', [...new Set(apiProducts.map(p => p.category))]);
            
            const response = await searchProductsByCategory(apiCategory, token);
            console.log('📦 Category search response:', response);
            console.log('📦 Category search response data:', response.data);
            
            const products = response.data;
            
            if (products && Array.isArray(products)) {
                console.log('📊 Raw category results:', products);
                
                // Transform search results to match component structure
                const transformedSearchResults = products.map(product => ({
                    id: product._id || product.id,
                    name: product.name,
                    price: product.price,
                    bgImage: product.imageUrl || product.image,
                    category: product.category,
                    originalProduct: product
                }));
                
                console.log('✅ Transformed category results:', transformedSearchResults);
                setSearchResults(transformedSearchResults);
                
                if (transformedSearchResults.length === 0) {
                    console.log('❌ No products found for category:', apiCategory);
                    setError(`No products found in "${category}" category`);
                } else {
                    console.log(`🎉 Found ${transformedSearchResults.length} product(s) in "${category}" category`);
                    setError("");
                }
            } else {
                console.error('❌ Unexpected response format for category search:', typeof products, products);
                setError("Unexpected response format from server");
                setSearchResults([]);
            }
        } catch (error) {
            console.error('💥 Category search error:', error);
            console.error('💥 Error response:', error.response);
            console.error('💥 Error response data:', error.response?.data);
            
            if (error.response?.status === 401) {
                setError("Please log in again to filter products");
                localStorage.removeItem('token');
                localStorage.removeItem('isAuthenticated');
                setIsAuthenticated(false);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to filter products. Please try again.");
            }
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    // Handle search input change with debouncing
    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            if (searchTerm && selectedCategory === "All Products") {
                handleSearchByName(searchTerm);
            }
        }, 500); // 500ms delay for debouncing

        return () => clearTimeout(delayedSearch);
    }, [searchTerm, isAuthenticated]);

    // Clear search when search term is empty
    useEffect(() => {
        if (!searchTerm && selectedCategory === "All Products") {
            setIsSearchActive(false);
            setSearchResults([]);
            setError("");
        }
    }, [searchTerm, selectedCategory]);

    // Add to cart function
    const handleAddToCart = async (product) => {
        const token = localStorage.getItem('token');
        const isAuth = localStorage.getItem('isAuthenticated');

        if (!token || !isAuth) {
            alert('Please login to add items to cart');
            return;
        }

        setAddingToCart(product.id);

        try {
            console.log('Adding product to cart:', product);
            const response = await addToCart(product.id, 1, token);
            console.log('Add to cart response:', response.data);
            
            alert(`${product.name} added to cart!`);
            
            if (onCartUpdate) {
                onCartUpdate();
            }
            
            window.dispatchEvent(new CustomEvent('cartUpdated'));
            
        } catch (error) {
            console.error('Error adding to cart:', error);
            
            if (error.response?.status === 401) {
                alert('Session expired. Please login again.');
            } else {
                alert(`Failed to add item to cart: ${error.response?.data?.message || error.message}`);
            }
        } finally {
            setAddingToCart(null);
        }
    };

    // Buy now function
    const handleBuyNow = (product) => {
        const token = localStorage.getItem('token');
        const isAuth = localStorage.getItem('isAuthenticated');

        if (!token || !isAuth) {
            alert('Please login to make a purchase');
            return;
        }

        window.location.href = '/checkout';
    };

    // Determine which products to display
    const displayProducts = isSearchActive ? searchResults : apiProducts;

    if (loading) {
        return (
            <div className="pb-16 px-4 mt-15">
                <div className="max-w-6xl mx-auto">
                    {/* Search and Filter Section */}
                    <div className="py-4 sm:py-5 px-4 bg-white rounded-lg shadow-sm mb-6">
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                            {/* Search Input */}
                            <div className="relative flex-1 max-w-full sm:max-w-md">
                                <Search size={14} className="sm:w-4 sm:h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
                                <input
                                    type="text"
                                    placeholder="Type product name to search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={!isAuthenticated || loading}
                                    className="w-full pl-8 sm:pl-8 pr-3 py-2 sm:py-2.5 border-2 border-amber-500 rounded-lg focus:border-amber-700 focus:outline-none text-amber-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base" 
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="flex items-center justify-center sm:justify-end">
                                <div className="relative w-full sm:w-auto">
                                    <select 
                                        value={selectedCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        disabled={!isAuthenticated || loading}
                                        className="appearance-none border-2 border-amber-500 rounded-lg px-4 sm:px-6 py-2 sm:py-2.5 pr-8 sm:pr-10 text-gray-500 focus:border-amber-700 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base"
                                    >
                                        <option>All Products</option>
                                        <option>Face Care</option>
                                        <option>Body Care</option>
                                        <option>Hair Care</option>
                                        <option>Men's Collection</option>
                                    </select>
                                    <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-amber-600 pointer-events-none w-4 h-4 sm:w-4 sm:h-4" />
                                </div>
                            </div>
                        </div>
                        
                        {/* Auth message for search */}
                        {!isAuthenticated && (
                            <div className="mt-3 p-3 bg-amber-100 border border-amber-300 text-amber-700 rounded text-sm">
                                Please log in to search and filter products.
                            </div>
                        )}
                    </div>

                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading products...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-16 px-4 mt-15">
            <div className="max-w-6xl mx-auto">
                {/* Search and Filter Section */}
                <div className="py-4 sm:py-5 px-4 bg-white rounded-lg shadow-sm mb-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-full sm:max-w-md">
                            <Search size={14} className="sm:w-4 sm:h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600" />
                            <input
                                type="text"
                                placeholder="Type product name to search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                disabled={!isAuthenticated}
                                className="w-full pl-8 sm:pl-8 pr-3 py-2 sm:py-2.5 border-2 border-amber-500 rounded-lg focus:border-amber-700 focus:outline-none text-amber-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base" 
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center justify-center sm:justify-end">
                            <div className="relative w-full sm:w-auto">
                                <select 
                                    value={selectedCategory}
                                    onChange={(e) => handleCategoryChange(e.target.value)}
                                    disabled={!isAuthenticated}
                                    className="appearance-none border-2 border-amber-500 rounded-lg px-4 sm:px-6 py-2 sm:py-2.5 pr-8 sm:pr-10 text-gray-500 focus:border-amber-700 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto text-sm sm:text-base"
                                >
                                    <option>All Products</option>
                                    <option>Face Care</option>
                                    <option>Body Care</option>
                                    <option>Hair Care</option>
                                    <option>Men's Collection</option>
                                </select>
                                <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-amber-600 pointer-events-none w-4 h-4 sm:w-4 sm:h-4" />
                            </div>
                        </div>
                    </div>

                    {/* Search Results Info */}
                    {isSearchActive && (
                        <div className="mt-3 sm:mt-4">
                            {searchLoading && (
                                <div className="text-center text-amber-700">
                                    <p className="text-sm sm:text-base">Searching products...</p>
                                </div>
                            )}
                            
                            {!searchLoading && searchResults.length > 0 && (
                                <div className="text-amber-700">
                                    <p className="text-sm sm:text-base">
                                        Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} 
                                        {searchTerm && ` for "${searchTerm}"`}
                                        {selectedCategory !== "All Products" && ` in "${selectedCategory}"`}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-3 sm:mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm sm:text-base">
                            {error}
                        </div>
                    )}

                    {/* Auth message for search */}
                    {!isAuthenticated && (
                        <div className="mt-3 p-3 bg-amber-100 border border-amber-300 text-amber-700 rounded text-sm">
                            Please log in to search and filter products.
                        </div>
                    )}

                    {/* Clear Search Button */}
                    {(isSearchActive || searchTerm || selectedCategory !== "All Products") && (
                        <div className="mt-3 sm:mt-4">
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setSelectedCategory("All Products");
                                    setIsSearchActive(false);
                                    setSearchResults([]);
                                    setError("");
                                }}
                                className="text-amber-600 hover:text-amber-800 underline text-xs sm:text-sm transition-colors"
                            >
                                Clear search and show all products
                            </button>
                        </div>
                    )}
                </div>

                {/* Products Grid */}
                {displayProducts.length === 0 && !loading ? (
                    <div className="text-center py-16">
                        <div className="text-gray-400 mb-4">
                            <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            {isSearchActive ? 'No products found' : 'No Products Available'}
                        </h3>
                        <p className="text-gray-500">
                            {isSearchActive 
                                ? 'Try adjusting your search terms or clear the search to see all products.'
                                : 'Products will appear here once an admin adds them.'
                            }
                        </p>
                    </div>
                ) : (
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
                                    
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-lg font-semibold text-amber-900">
                                            GH₵{product.price}
                                        </span>
                                    </div>

                                    {/* Button Container */}
                                    <div className="flex flex-col gap-2">
                                        
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            disabled={addingToCart === product.id}
                                            className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer px-4 py-2 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ShoppingCart size={16} />
                                            {addingToCart === product.id ? 'Adding...' : 'Add to Cart'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}