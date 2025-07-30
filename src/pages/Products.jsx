import { useState, useEffect } from 'react';
import { User, Search } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Link } from 'react-router';
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import UserNav from "../components/UserNav";
import Navbar from "../components/Navbar";
import { searchProductsByName, searchProductsByCategory, getAllProducts } from "../api/client.js"; 

export default function Products() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Search states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All Products");
    const [searchResults, setSearchResults] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isSearchActive, setIsSearchActive] = useState(false);

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

    // Load all products initially
    useEffect(() => {
        const loadAllProducts = async () => {
            try {
                const response = await getAllProducts();
                setAllProducts(response.data);
            } catch (error) {
                console.error('Error loading products:', error);
            }
        };
        loadAllProducts();
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

        setLoading(true);
        setError("");
        setIsSearchActive(true);

        try {
            const token = localStorage.getItem('token');
            const response = await searchProductsByName(searchValue, token);
            
            if (response.data) {
                setSearchResults(response.data);
                if (response.data.length === 0) {
                    setError(`No products found matching "${searchValue}"`);
                }
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
            setLoading(false);
        }
    };

    // Handle search by category
    const handleCategoryChange = async (category) => {
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

        setLoading(true);
        setError("");
        setIsSearchActive(true);

        try {
            const token = localStorage.getItem('token');
            // Map display names to API category names
            const categoryMap = {
                "Face Care": "Skincare",
                "Body Care": "Body Care", 
                "Hair Care": "Haircare",
                "Men's Collection": "Men's"
            };
            
            const apiCategory = categoryMap[category] || category;
            const response = await searchProductsByCategory(apiCategory, token);
            
            if (response.data) {
                setSearchResults(response.data);
                if (response.data.length === 0) {
                    setError(`No products found in "${category}" category`);
                }
            }
        } catch (error) {
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
            setLoading(false);
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

    return (
        <>
            {isAuthenticated ? <UserNav /> : <Navbar />}

            <div className="bg-[#F0D09F]">
                <div className="py-16 px-4 bg-amber-100">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-serif text-amber-800 mb-6 font-bold">Shop Natural Skincare</h1>
                        <p className="text-md md:text-lg text-amber-700 leading-relaxed max-w-3xl mx-auto">
                            Discover our premium collection of African shea butter skincare
                            <br />products, crafted with love and supporting communities through our <br />
                            SheaStrong Initiative.
                        </p>
                    </div>
                </div>

                {/* Show sign-in message for non-authenticated users */}
                {!isAuthenticated && (
                    <div className="bg-white/70 backdrop-blur-sm py-4 px-4 border-b border-amber-200">
                        <div className="max-w-6xl mx-auto text-center">
                            <div className="flex items-center justify-center gap-2 text-amber-800">
                                <User size={18} />
                                <span>Please </span>
                                <Link to="/login">
                                    <button className="text-amber-700 hover:text-amber-900 underline font-medium cursor-pointer">
                                        sign in
                                    </button>
                                </Link>
                                <span> or </span>
                                <Link to="/signup">
                                    <button className="text-amber-700 hover:text-amber-900 underline font-medium cursor-pointer">
                                        create an account
                                    </button>
                                </Link>
                                <span> to search and filter products.</span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="py-5 px-4 bg-white">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search products.."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={!isAuthenticated}
                                    className="w-full pl-8 pr-3 py-2 border-2 border-amber-500 rounded-lg focus:border-amber-700 focus:outline-none text-amber-900 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <select 
                                        value={selectedCategory}
                                        onChange={(e) => handleCategoryChange(e.target.value)}
                                        disabled={!isAuthenticated}
                                        className="appearance-none border-2 border-amber-500 rounded-lg px-6 py-2 pr-10 text-gray-500 focus:border-amber-700 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <option>All Products</option>
                                        <option>Face Care</option>
                                        <option>Body Care</option>
                                        <option>Hair Care</option>
                                        <option>Men's Collection</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-amber-600 pointer-events-none" size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Search Results Info */}
                        {isSearchActive && (
                            <div className="mt-4">
                                {loading && (
                                    <div className="text-center text-amber-700">
                                        <p>Searching products...</p>
                                    </div>
                                )}
                                
                                {!loading && searchResults.length > 0 && (
                                    <div className="text-amber-700">
                                        <p>Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} 
                                        {searchTerm && ` for "${searchTerm}"`}
                                        {selectedCategory !== "All Products" && ` in "${selectedCategory}"`}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Error Message */}
                        {error && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        {/* Clear Search Button */}
                        {(isSearchActive || searchTerm || selectedCategory !== "All Products") && (
                            <div className="mt-4">
                                <button
                                    onClick={() => {
                                        setSearchTerm("");
                                        setSelectedCategory("All Products");
                                        setIsSearchActive(false);
                                        setSearchResults([]);
                                        setError("");
                                    }}
                                    className="text-amber-600 hover:text-amber-800 underline text-sm"
                                >
                                    Clear search and show all products
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="border-t border-amber-100 mt-7 mb-5"></div>

            {/* Pass search results to ProductGrid if search is active, otherwise pass all products */}
            <ProductGrid 
                products={isSearchActive ? searchResults : allProducts}
                loading={loading}
                isSearchActive={isSearchActive}
            />

            <Footer />
        </>
    );
}