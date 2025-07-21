import { useState, useEffect } from 'react';
import { User, Search } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Link } from 'react-router';
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";
import UserNav from "../components/UserNav";
import Navbar from "../components/Navbar";

export default function Products() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
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
                                <span> to add items to your cart and make purchases.</span>
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
                                    className="w-full pl-8 pr-3 py-2 border-2 border-amber-500 rounded-lg focus:border-amber-700 focus:outline-none text-amber-900 placeholder-gray-500" 
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <select className="appearance-none border-2 border-amber-500 rounded-lg px-6 py-2 pr-10 text-gray-500 focus:border-amber-700 focus:outline-none cursor-pointer">
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
                    </div>
                </div>
            </div>
            <div className="border-t border-amber-100 mt-7 mb-5"></div>

            <ProductGrid />

            <Footer />
        </>
    );
}