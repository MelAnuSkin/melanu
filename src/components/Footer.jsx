import logo from "../assets/images/logomelanu.png";
import { Link } from "react-router";




export default function Footer() {
    return (
        <footer className="bg-[#573E29] text-amber-100">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="md:col-span-1">
                        <div className="flex items-center mb-4">
                            <div className="flex items-center justify-center mr-2">
                                <img src={logo} alt="logomelanu" className="w-12 h-12 object-contain" />
                            </div>
                            <div className="">
                                <h3 className="text-xl font-bold text-amber-100">MelAnu</h3>
                                <p className="text-sm text-amber-200">Be Naturally Skinfident</p>
                            </div>
                        </div>
                        <p className="text-amber-200 text-sm leading-relaxed">Premium African-inspired skincare and haircare products crafted with 
                            ethically sourced Shea butter and indigenous botanicals.</p>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-amber-100 mb-4">Explore</h4>
                        <ul className="space-y-2">
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">Body Care</li>
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">Hair Care</li>
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">Face Care</li>
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">Men's Collection</li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-amber-100 mb-4">Company</h4>
                        <ul className="space-y-2">
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">
                                <Link to="/">
                                Home</Link></li>
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">
                                <Link to="/about">
                                About</Link></li>
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">
                                <Link to="/products">
                                Product</Link></li>
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">
                                <Link to="/blog">
                                Blog</Link></li>
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">
                                <Link to="/contact">
                                Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold text-amber-100 mb-4">Contact</h4>
                        <ul className="space-y-2">
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">melanu.gh@gmail.com</li>
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">+233 246130414</li>
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">Ghana (Tamale & Accra)</li>
                            <li className="text-amber-200 hover:text-amber-100 text-sm transition-colors duration-200 cursor-pointer">Instagram: @melanu.skin</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="border-t border-amber-200">
            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <p className="text-amber-200 text-sm mb-2 md:mb-0">©2025 MelAnu Skin. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <p className="text-amber-200 text-sm">Privacy Policy</p>
                        <p className="text-amber-200 text-sm">Terms of Service</p>
                    </div>
                </div>
            </div>
            </div>

        </footer>
    )
}