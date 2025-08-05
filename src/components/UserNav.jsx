import { useState } from 'react';
import { useNavigate } from 'react-router';
import logo from "../assets/images/logomelanu.png";
import { LogOut, ShoppingCart, User, Menu, X } from "lucide-react";
import { Link } from "react-router";

export default function UserNav() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    // Handle logout with custom event
    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            // Clear all localStorage data
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('isAuthenticated');
            
            // Dispatch custom event to notify all components about logout
            window.dispatchEvent(new CustomEvent('authChanged'));
            
            // Close menu if open
            setIsMenuOpen(false);
            
            navigate('/');
        }
    };

    return (
        <nav className="bg-[#FEFCE9] border-b border-amber-200 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-18">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-2">
                        <div className="">
                            <img src={logo} alt="logomelanu" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-amber-800 font-bold text-base sm:text-lg">MelAnu</span>
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <ul className="flex items-center space-x-7">
                            <li className="text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer">
                                <Link to="/" className="block">Home</Link>
                            </li>
                            <li className="text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer">
                                <Link to="/about" className="block">About</Link>
                            </li>
                            <li className="text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer">
                                <Link to="/products" className="block">Products</Link>
                            </li>
                            <li className="text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer">
                                <Link to="/blog" className="block">Blog</Link>
                            </li>
                            <li className="text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer">
                                <Link to="/contact" className="block">Contact</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Desktop Action Buttons */}
                    <div className="hidden md:flex items-center space-x-6">
                        <Link to="/cart">
                            <button className="text-amber-800 hover:text-amber-900 transition-colors cursor-pointer">
                                <ShoppingCart size={18} />
                            </button>
                        </Link>

                        <button 
                            onClick={handleLogout}
                            className="bg-white px-4 py-1 cursor-pointer rounded-md flex items-center text-red-500 gap-3 border border-red-500 hover:bg-red-50 transition-colors"
                        >
                            <LogOut size={16}/>  
                            Logout  
                        </button>
                    </div>

                    {/* Mobile Action Buttons & Hamburger */}
                    <div className="flex md:hidden items-center space-x-3">
                        {/* Mobile Cart Icon */}
                        <Link to="/cart">
                            <button className="text-amber-800 hover:text-amber-900 transition-colors cursor-pointer p-2">
                                <ShoppingCart size={20} />
                            </button>
                        </Link>

                        {/* Hamburger Menu Button */}
                        <button
                            onClick={toggleMenu}
                            className="text-amber-800 hover:text-amber-900 transition-colors cursor-pointer p-2"
                            aria-label="Toggle menu"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div 
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={closeMenu}
                    ></div>

                    {/* Mobile Menu */}
                    <div className="absolute top-full left-0 right-0 bg-[#FEFCE9] border-b border-amber-200 z-50 md:hidden">
                        <div className="px-4 py-6 space-y-4">
                            {/* Navigation Links */}
                            <div className="space-y-4">
                                <Link 
                                    to="/" 
                                    className="block text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer py-2 px-3 hover:bg-amber-100 rounded-md"
                                    onClick={closeMenu}
                                >
                                    Home
                                </Link>
                                <Link 
                                    to="/about" 
                                    className="block text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer py-2 px-3 hover:bg-amber-100 rounded-md"
                                    onClick={closeMenu}
                                >
                                    About
                                </Link>
                                <Link 
                                    to="/products" 
                                    className="block text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer py-2 px-3 hover:bg-amber-100 rounded-md"
                                    onClick={closeMenu}
                                >
                                    Products
                                </Link>
                                <Link 
                                    to="/blog" 
                                    className="block text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer py-2 px-3 hover:bg-amber-100 rounded-md"
                                    onClick={closeMenu}
                                >
                                    Blog
                                </Link>
                                <Link 
                                    to="/contact" 
                                    className="block text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer py-2 px-3 hover:bg-amber-100 rounded-md"
                                    onClick={closeMenu}
                                >
                                    Contact
                                </Link>
                            </div>

                            {/* Mobile Logout Button */}
                            <div className="pt-4 border-t border-amber-200">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full bg-white px-4 py-3 cursor-pointer rounded-md flex items-center justify-center text-red-500 gap-3 border border-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16}/>  
                                    Logout  
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </nav>
    );
}