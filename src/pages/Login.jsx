import Navbar from "../components/Navbar";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { apiClient } from "../api/client.js";

// Transition Loading Component
const TransitionLoading = ({ message }) => (
    <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
        <div className="text-center max-w-md mx-auto p-6">
            <div className="relative">
                {/* Spinning circle */}
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-amber-600 mx-auto mb-4"></div>
                
                {/* Pulsing inner circle */}
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
                    <div className="animate-pulse rounded-full h-12 w-12 bg-amber-100"></div>
                </div>
            </div>
            
            <h2 className="text-xl font-semibold text-amber-800 mb-2 font-mono">
                {message || "Signing you in..."}
            </h2>
            <p className="text-amber-600 text-sm">Please wait while we set up your dashboard</p>
            
            {/* Progress dots */}
            <div className="flex justify-center mt-4 space-x-1">
                <div className="animate-bounce h-2 w-2 bg-amber-600 rounded-full"></div>
                <div className="animate-bounce h-2 w-2 bg-amber-600 rounded-full" style={{animationDelay: '0.1s'}}></div>
                <div className="animate-bounce h-2 w-2 bg-amber-600 rounded-full" style={{animationDelay: '0.2s'}}></div>
            </div>
        </div>
    </div>
);

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showTransition, setShowTransition] = useState(false);
    const navigate = useNavigate();

    // Admin credentials
    const ADMIN_EMAIL = "c39744736@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    const isAdminCredentials = (email, password) => {
        return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Check if admin credentials are being used
            if (isAdminCredentials(email, password)) {
                console.log("Admin login detected - authenticating...");
                
                try {
                    // Get real JWT token for admin
                    const adminResponse = await apiClient.post('/api/auth/login', { 
                        email: ADMIN_EMAIL, 
                        password: ADMIN_PASSWORD 
                    });
                    
                    console.log("Admin JWT token obtained:", adminResponse.data);
                    
                    // Store admin session data with real token
                    const adminData = {
                        token: adminResponse.data.token,
                        userRole: 'admin',
                        userEmail: email,
                        isAuthenticated: 'true',
                        loginTime: new Date().toISOString()
                    };
                    
                    // Batch localStorage operations
                    Object.entries(adminData).forEach(([key, value]) => {
                        localStorage.setItem(key, value);
                    });
                    
                    console.log("Admin authentication complete - redirecting...");
                    
                    // Navigate immediately
                    setLoading(false);
                    navigate('/admin');
                    return;
                    
                } catch (adminError) {
                    console.error("Admin authentication failed:", adminError);
                    
                    // Fallback to placeholder token if API fails
                    console.log("Using fallback admin authentication...");
                    
                    const fallbackData = {
                        token: 'admin-token',
                        userRole: 'admin', 
                        userEmail: email,
                        isAuthenticated: 'true',
                        needsTokenExchange: 'true',
                        loginTime: new Date().toISOString()
                    };
                    
                    Object.entries(fallbackData).forEach(([key, value]) => {
                        localStorage.setItem(key, value);
                    });
                    
                    // Navigate immediately
                    setLoading(false);
                    navigate('/admin');
                    return;
                }
            }

            // Regular user login via API
            const response = await apiClient.post('/api/auth/login', { email, password });
            
            console.log("User login successful:", response.data);
            
            // Store regular user session data
            const userData = {
                token: response.data.token,
                userRole: 'user',
                userEmail: email,
                isAuthenticated: 'true',
                loginTime: new Date().toISOString()
            };
            
            Object.entries(userData).forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });
            
            // Navigate immediately
            setLoading(false);
            navigate('/userpage');
            
        } catch (error) {
            console.error("Login error:", error);
            
            // Improved error handling
            let errorMessage = "Login failed. Please try again.";
            
            if (error.message.includes('timeout')) {
                errorMessage = "Login is taking too long. Please check your internet connection and try again.";
            } else if (error.response?.status === 401) {
                errorMessage = "Invalid email or password. Please try again.";
            } else if (error.response?.status === 429) {
                errorMessage = "Too many login attempts. Please wait a few minutes and try again.";
            } else if (error.response?.status >= 500) {
                errorMessage = "Server error. Please try again later.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }
            
            setError(errorMessage);
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="bg-[#FFFFFF] flex items-center justify-center mb-10">
                <div className="h-screen w-screen mt-15">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-amber-800 font-mono mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-amber-800 font-normal text-md">
                            Sign in to your MelAnu account
                        </p>
                    </div>

                    <div className="bg-white flex items-center justify-center p-4">
                        <div className="w-full max-w-md">

                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center font-mono">Sign In</h2>

                                {/* Error message display */}
                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                        <p className="text-red-600 text-sm">{error}</p>
                                    </div>
                                )}

                                <form onSubmit={handleLogin} className="space-y-6">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            placeholder="james@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={loading}
                                            className="w-full px-3 py-2 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" />
                                    </div>

                                    <div className="mt-7">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                disabled={loading}
                                                className="w-full px-3 py-2 pr-10 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={loading}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer disabled:cursor-not-allowed">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />} 
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="rememberMe"
                                                disabled={loading}
                                                className="h-3 w-3 text-amber-600 focus:ring-amber-500 border-gray-300 rounded disabled:opacity-50" />

                                            <label htmlFor="rememberMe" className="ml-2 text-sm text-amber-600">
                                                Remember me
                                            </label>
                                        </div>
                                        <Link to="/forgot-password">
                                            <a href="#" className="text-sm text-amber-600 hover:text-amber-700">
                                                Forgot password?
                                            </a>
                                        </Link>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-amber-600 text-white py-3 cursor-pointer rounded-md hover:bg-amber-700 transition-colors font-medium disabled:bg-amber-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                Signing In...
                                            </div>
                                        ) : (
                                            "Sign In"
                                        )}
                                    </button>

                                    <div className="text-center mt-6">
                                        <p className="text-sm text-amber-600">
                                            Don't have an account?
                                            <Link to="/signup">
                                                <a href="#" className="text-amber-800 hover:text-amber-500 font-medium"> Sign Up</a>
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    )
}