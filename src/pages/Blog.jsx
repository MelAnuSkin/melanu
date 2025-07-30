import { useState, useEffect } from 'react';
import Navbar from "../components/Navbar";
import UserNav from "../components/UserNav";
import image10 from "../assets/images/image10.jpg";
import { ArrowRight } from "lucide-react";
import image11 from "../assets/images/image11.jpg";
import Footer from "../components/Footer";
import { subscribeToNewsletter } from "../api/client.js"; 

export default function Blog() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    // Newsletter form states
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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

    // Newsletter subscription handler
    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        
        // Clear previous messages
        setError("");
        setMessage("");

        // Check if user is authenticated
        if (!isAuthenticated) {
            setError("Please log in to subscribe to our newsletter");
            return;
        }

        // Validate email
        if (!email) {
            setError("Please enter your email address");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await subscribeToNewsletter(email, token);
            
            if (response.status === 200 || response.status === 201) {
                setMessage("Successfully subscribed to our newsletter! Check your email for confirmation.");
                setEmail(""); // Clear the email input
            }
        } catch (error) {
            if (error.response?.status === 401) {
                setError("Please log in again to subscribe to our newsletter");
                // Optionally clear authentication
                localStorage.removeItem('token');
                localStorage.removeItem('isAuthenticated');
                setIsAuthenticated(false);
            } else if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to subscribe. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

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

                            {/* Success Message */}
                            {message && (
                                <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded max-w-md mx-auto">
                                    {message}
                                </div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded max-w-md mx-auto">
                                    {error}
                                </div>
                            )}

                            {/* Newsletter Form */}
                            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="flex-1 px-4 py-3 bg-white border border-white-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" 
                                />

                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-900 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Joining..." : "Join Now"}
                                </button>
                            </form>

                            {/* Login prompt for non-authenticated users */}
                            {!isAuthenticated && (
                                <p className="text-amber-700 text-sm mt-2">
                                    <span className="font-medium">Note:</span> Please log in to subscribe to our newsletter
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}