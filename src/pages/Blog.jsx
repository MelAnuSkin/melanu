import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import UserNav from "../components/UserNav";
import image10 from "../assets/images/image10.jpg";
import { ArrowRight } from "lucide-react";
import image11 from "../assets/images/image11.jpg";
import Footer from "../components/Footer";

export default function Blog() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status on component mount and listen for changes
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

        // Check auth on mount
        checkAuth();

        // Listen for storage changes (when user logs out from another tab/component)
        window.addEventListener('storage', checkAuth);
        
        // Listen for custom logout events
        window.addEventListener('authChanged', checkAuth);

        // Cleanup
        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChanged', checkAuth);
        };
    }, []);

    return (
        <>
            {/* Conditional Navigation */}
            {isAuthenticated ? <UserNav /> : <Navbar />}

            <div className="min-h-screen bg-white">
                <div className="bg-[#F0D09F] px-4 py-18">
                    <div className="max-w-6xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-mono text-amber-800 mb-6">Wellness & Beauty Journal</h1>
                        <p className="text-lg text-amber-800 font-mono max-w-2xl mx-auto leading-relaxed">Discover skincare wisdom, African beauty traditions, and stories from our SheaStrong community. Your guide to natural wellness.</p>
                    </div>
                </div>

                <div className="bg-white py-16 px-4 mt-5">
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white rounded-lg shadow-sm border border-amber-300 overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="relative">
                                    <img 
                                        src={image10} 
                                        alt="blog image"
                                        className="w-full h-full object-cover min-h-[400px]" />
                                </div>

                                <div className="p-8 flex flex-col justifty-center lg:p-12">
                                    <h2 className="text-2xl lg:text-3xl font-bold text-amber-800 mb-4 leading-tight">Behind the Butter: Tradition, Craft, and Community</h2>
                                    <p className="text-amber-700 mb-6 leading-relaxed text-lg">Step into the heart of local shea butter making, where skilled hands, generations of knowledge, and raw shea nuts come together to create one of nature's richest skincare treasures.</p>

                                    <button className="text-amber-600 hover:text-amber-700 font-medium text-sm inline-flex items-center cursor-pointer">Read More
                                        <ArrowRight className="w-3 h-3 ml-1"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white mt-20 mb-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <h2 className="text-3xl lg:text-4xl text-amber-800 font-bold mb-6">Skincare Tips</h2>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-amber-300 overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="relative">
                                    <img 
                                        src={image11}
                                        alt="essential tips"
                                        className="w-full h-full object-cover min-h-[400px]" />
                                </div>

                                <div className="p-8 flex flex-col justifty-center lg:p-12">
                                    <h2 className="text-2xl lg:text-3xl font-bold text-amber-800 mb-4 leading-tight">Glow Naturally: The Secret's in the Butter</h2>
                                    <p className="text-amber-700 mb-6 leading-relaxed text-lg">For soft, radiant skin, go beyond lotion—reach for body butter enriched with natural oils. Just a small scoop locks in moisture, boosts elasticity, and leaves your skin feeling luxuriously smooth all day long.</p>

                                    <button className="text-amber-600 hover:text-amber-700 font-medium text-sm inline-flex items-center cursor-pointer">Read More
                                        <ArrowRight className="w-3 h-3 ml-1"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#F0D09F] px-4 py-18 mt-30">
                        <div className="max-w-6xl mx-auto text-center">
                            <h3 className="text-2xl lg:text-3xl text-amber-800 mb-4 font-bold leading-tight">Never Miss A Story</h3>
                            <p className="text-lg text-amber-800 max-w-2xl mx-auto leading-relaxed mb-5">Subscribe to get the latest wellness tips, beauty secrets, <br />
                                and SheaStrong stories delivered to your inbox.</p>
                            <button className="text-white bg-amber-600 hover:bg-amber-800 px-6 py-2 rounded-lg cursor-pointer font-semibold">Subscribe to Newsletter</button>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}