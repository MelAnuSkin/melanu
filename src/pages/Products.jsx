import { useState, useEffect } from 'react';
import { User } from "lucide-react";
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
                {/* Hero Section - Mobile Responsive */}
                <div className="py-8 sm:py-12 lg:py-16 px-4 bg-amber-100">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-amber-800 mb-4 sm:mb-6 font-bold leading-tight">
                            Shop Natural Skincare
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg text-amber-700 leading-relaxed max-w-3xl mx-auto px-2 sm:px-0">
                            Discover our premium collection of African shea butter skincare
                            <span className="hidden sm:inline"><br /></span>
                            <span className="sm:hidden"> </span>
                            products, crafted with love and supporting communities through our 
                            <span className="hidden sm:inline"><br /></span>
                            <span className="sm:hidden"> </span>
                            SheaStrong Initiative.
                        </p>
                    </div>
                </div>

                {/* Authentication Message - Mobile Responsive */}
                {!isAuthenticated && (
                    <div className="bg-white/70 backdrop-blur-sm py-3 sm:py-4 px-4 border-b border-amber-200">
                        <div className="max-w-6xl mx-auto text-center">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-amber-800 text-sm sm:text-base">
                                <div className="flex items-center gap-2">
                                    <User size={16} className="sm:w-[18px] sm:h-[18px]" />
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
                                </div>
                                <span className="text-center">to search and filter products.</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Divider */}
            <div className="border-t border-amber-100 mt-4 sm:mt-7 mb-3 sm:mb-5"></div>

            {/* ProductGrid now handles all search functionality internally */}
            <ProductGrid />

            <Footer />
        </>
    );
}