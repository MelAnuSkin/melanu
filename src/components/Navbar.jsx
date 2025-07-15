import logo from "../assets/images/logomelanu.png";
import { ShoppingCart, User } from "lucide-react";
import { Link } from "react-router";







export default function Navbar() {
    return (
        <nav className="bg-[#FEFCE9] border-b border-amber-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-18">
                    <div className="flex items-center">
                        <div className="">
                            <img src={logo} alt="logomelanu" className="w-12 h-12 object-contain" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-amber-800 font-bold text-lg">MelAnu</span>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center space-x-8">
                        <ul className="flex items-center space-x-7">
                            <li className="text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer">
                            <Link to="/"> 
                            Home</Link></li>
                                
                            <li className="text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer">
                                <Link to="/about">About</Link></li>
                                
                            <li className="text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer">
                               <Link to="/products">
                               Products</Link></li>
                            <li className="text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer">
                                Blog</li>
                            <li className="text-amber-800 hover:text-amber-900 font-medium transition-colors cursor-pointer">
                                Contact</li>
                        </ul>
                    </div>

                    <div className="flex items-center space-x-6">
                        
                        <Link to="/cart">
                        <button className="text-amber-800 hover:text-amber-900 transition-colors cursor-pointer">
                            <ShoppingCart size={18} />
                        </button></Link>

                        <Link to="/login">
                        <button className="bg-amber-700 text-white px-5 py-2 rounded-md hover:bg-amber-800 transition-colors flex items-center space-x-2 cursor-pointer">
                            <User size={14} />
                            <span>Sign In</span>
                        </button></Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}