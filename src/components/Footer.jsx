import logo from "../assets/images/logomelanu.png";
import { Link } from "react-router";

export default function Footer() {
    return (
        <footer className="bg-[#573E29] text-amber-100">
            {/* Main Footer Content - Mobile Responsive */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                    {/* Brand Section - Mobile Responsive */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <div className="flex items-center mb-3 sm:mb-4">
                            <div className="flex items-center justify-center mr-2">
                                <img src={logo} alt="logomelanu" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                            </div>
                            <div className="">
                                <h3 className="text-lg sm:text-xl font-bold text-amber-100">MelAnu</h3>
                                <p className="text-xs sm:text-sm text-amber-200">Be Naturally Skinfident</p>
                            </div>
                        </div>
                        <p className="text-amber-200 text-xs sm:text-sm leading-relaxed max-w-sm">
                            Premium African-inspired skincare and haircare products crafted with 
                            ethically sourced Shea butter and indigenous botanicals.
                        </p>
                    </div>

                    {/* Explore Section - Mobile Responsive */}
                    <div className="sm:col-span-1">
                        <h4 className="text-base sm:text-lg font-bold text-amber-100 mb-3 sm:mb-4">Explore</h4>
                        <ul className="space-y-2">
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
                                <Link to='/products' className="block">
                                    Body Care
                                </Link>
                            </li>
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
                                <Link to='/products' className="block">
                                    Hair Care
                                </Link>
                            </li>
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
                                <Link to='/products' className="block">
                                    Face Care
                                </Link>
                            </li>
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
                                <Link to='/products' className="block">
                                    Men's Collection
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Section - Mobile Responsive */}
                    <div className="sm:col-span-1">
                        <h4 className="text-base sm:text-lg font-bold text-amber-100 mb-3 sm:mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
                                <Link to="/" className="block">
                                    Home
                                </Link>
                            </li>
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
                                <Link to="/about" className="block">
                                    About
                                </Link>
                            </li>
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
                                <Link to="/products" className="block">
                                    Product
                                </Link>
                            </li>
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
                                <Link to="/blog" className="block">
                                    Blog
                                </Link>
                            </li>
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200 cursor-pointer">
                                <Link to="/contact" className="block">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section - Mobile Responsive */}
                    <div className="sm:col-span-2 md:col-span-1">
                        <h4 className="text-base sm:text-lg font-bold text-amber-100 mb-3 sm:mb-4">Contact</h4>
                        <ul className="space-y-2">
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200 break-all">
                                melanu.gh@gmail.com
                            </li>
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200">
                                +233 246130414
                            </li>
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200">
                                Ghana (Tamale & Accra)
                            </li>
                            <li className="text-amber-200 hover:text-amber-100 text-xs sm:text-sm transition-colors duration-200">
                                Instagram: @melanu.skin
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Footer Bottom - Mobile Responsive */}
            <div className="border-t border-amber-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left">
                        <p className="text-amber-200 text-xs sm:text-sm mb-2 sm:mb-0">
                            ©2025 MelAnu Skin. All rights reserved.
                        </p>
                        <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-6">
                            <p className="text-amber-200 text-xs sm:text-sm hover:text-amber-100 transition-colors duration-200 cursor-pointer">
                                Privacy Policy
                            </p>
                            <p className="text-amber-200 text-xs sm:text-sm hover:text-amber-100 transition-colors duration-200 cursor-pointer">
                                Terms of Service
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}