import Navbar from "../components/Navbar";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { apiClient } from "../api/client.js";

// Performance Debugger
const PerformanceDebugger = {
    timers: new Map(),
    
    start: (label) => {
        console.time(label);
        PerformanceDebugger.timers.set(label, performance.now());
    },
    
    end: (label) => {
        console.timeEnd(label);
        const startTime = PerformanceDebugger.timers.get(label);
        if (startTime) {
            const duration = performance.now() - startTime;
            console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
            
            // Alert for slow operations
            if (duration > 3000) {
                console.warn(`🐌 Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
            }
            
            PerformanceDebugger.timers.delete(label);
        }
    },
    
    measureApiCall: async (label, apiCall) => {
        PerformanceDebugger.start(label);
        try {
            const result = await apiCall();
            PerformanceDebugger.end(label);
            return result;
        } catch (error) {
            PerformanceDebugger.end(label);
            throw error;
        }
    }
};

// Connection Monitor
const ConnectionMonitor = {
    checkSpeed: async () => {
        const start = performance.now();
        try {
            // Make a small test request to check speed
            const response = await fetch(window.location.origin, { 
                method: 'HEAD',
                headers: { 'Cache-Control': 'no-cache' }
            });
            const end = performance.now();
            const duration = end - start;
            
            // Categorize connection speed
            if (duration < 100) return 'fast';
            if (duration < 500) return 'medium';
            return 'slow';
        } catch {
            return 'slow'; // Default to slow if test fails
        }
    },

    getTimeouts: (speed) => {
        switch (speed) {
            case 'fast': return { login: 5000, data: 8000 };
            case 'medium': return { login: 10000, data: 15000 };
            case 'slow': return { login: 20000, data: 30000 };
            default: return { login: 15000, data: 20000 };
        }
    }
};

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
    const [connectionSpeed, setConnectionSpeed] = useState('medium');
    const navigate = useNavigate();

    // Admin credentials
    const ADMIN_EMAIL = "c39744736@gmail.com";
    const ADMIN_PASSWORD = "admin123";

    // Check connection speed on component mount
    useEffect(() => {
        const checkConnection = async () => {
            const speed = await ConnectionMonitor.checkSpeed();
            setConnectionSpeed(speed);
            console.log(`Connection speed detected: ${speed}`);
        };
        checkConnection();
    }, []);

    const isAdminCredentials = (email, password) => {
        return email === ADMIN_EMAIL && password === ADMIN_PASSWORD;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            PerformanceDebugger.start('Total Login Process');
            
            // Check connection speed and adjust timeouts
            const timeouts = ConnectionMonitor.getTimeouts(connectionSpeed);
            console.log(`Using timeouts for ${connectionSpeed} connection:`, timeouts);
            
            // Show warning for slow connections
            if (connectionSpeed === 'slow') {
                setError("Slow connection detected. Login may take longer than usual...");
                setTimeout(() => setError(""), 3000);
            }

            // Add timeout wrapper for all API calls
            const loginWithTimeout = (promise) => {
                return Promise.race([
                    promise,
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Login timeout - please check your connection')), timeouts.login)
                    )
                ]);
            };

            // Check if admin credentials are being used
            if (isAdminCredentials(email, password)) {
                console.log("Admin login detected - authenticating...");
                
                try {
                    // Get real JWT token for admin immediately
                    const adminResponse = await PerformanceDebugger.measureApiCall(
                        'Admin JWT Request',
                        () => loginWithTimeout(
                            apiClient.post('/api/auth/login', { 
                                email: ADMIN_EMAIL, 
                                password: ADMIN_PASSWORD 
                            })
                        )
                    );
                    
                    console.log("Admin JWT token obtained:", adminResponse.data);
                    
                    PerformanceDebugger.start('Admin LocalStorage Operations');
                    
                    // Store admin session data with real token
                    const adminData = {
                        token: adminResponse.data.token,
                        userRole: 'admin',
                        userEmail: email,
                        isAuthenticated: 'true',
                        loginTime: new Date().toISOString()
                    };
                    
                    // Use batch localStorage operations
                    Object.entries(adminData).forEach(([key, value]) => {
                        localStorage.setItem(key, value);
                    });
                    
                    PerformanceDebugger.end('Admin LocalStorage Operations');
                    
                    console.log("Admin authentication complete - redirecting...");
                    
                    // Show transition loading
                    setShowTransition(true);
                    setLoading(false);
                    
                    PerformanceDebugger.start('Admin Navigation');
                    setTimeout(() => {
                        navigate('/admin');
                        PerformanceDebugger.end('Admin Navigation');
                        PerformanceDebugger.end('Total Login Process');
                    }, 500);
                    
                    return;
                    
                } catch (adminError) {
                    console.error("Admin authentication failed:", adminError);
                    
                    // Fallback to placeholder token if API fails
                    console.log("Using fallback admin authentication...");
                    
                    PerformanceDebugger.start('Admin Fallback LocalStorage');
                    
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
                    
                    PerformanceDebugger.end('Admin Fallback LocalStorage');
                    
                    // Show transition loading
                    setShowTransition(true);
                    setLoading(false);
                    
                    setTimeout(() => {
                        navigate('/admin');
                        PerformanceDebugger.end('Total Login Process');
                    }, 500);
                    
                    return;
                }
            }

            // Regular user login via API
            const response = await PerformanceDebugger.measureApiCall(
                'User Login Request',
                () => loginWithTimeout(
                    apiClient.post('/api/auth/login', { email, password })
                )
            );
            
            console.log("User login successful:", response.data);
            
            PerformanceDebugger.start('User LocalStorage Operations');
            
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
            
            PerformanceDebugger.end('User LocalStorage Operations');
            
            // Show transition loading
            setShowTransition(true);
            setLoading(false);
            
            PerformanceDebugger.start('User Navigation');
            setTimeout(() => {
                navigate('/userpage');
                PerformanceDebugger.end('User Navigation');
                PerformanceDebugger.end('Total Login Process');
            }, 300);
            
        } catch (error) {
            PerformanceDebugger.end('Total Login Process');
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

            {/* Transition Loading Overlay */}
            {showTransition && (
                <TransitionLoading 
                    message={
                        isAdminCredentials(email, password) 
                            ? "Setting up admin dashboard..." 
                            : "Setting up your account..."
                    } 
                />
            )}

            <div className="bg-[#FFFFFF] flex items-center justify-center mb-10">
                <div className="h-screen w-screen mt-15">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-amber-800 font-mono mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-amber-800 font-normal text-md">
                            Sign in to your MelAnu account
                        </p>
                        
                        {/* Connection Speed Indicator */}
                        {connectionSpeed === 'slow' && (
                            <div className="mt-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1 inline-block">
                                🐌 Slow connection detected
                            </div>
                        )}
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
                                            disabled={loading || showTransition}
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
                                                disabled={loading || showTransition}
                                                className="w-full px-3 py-2 pr-10 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed" />
                                            <button 
                                                type="button" 
                                                onClick={() => setShowPassword(!showPassword)}
                                                disabled={loading || showTransition}
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
                                                disabled={loading || showTransition}
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
                                        disabled={loading || showTransition}
                                        className="w-full bg-amber-600 text-white py-3 cursor-pointer rounded-md hover:bg-amber-700 transition-colors font-medium disabled:bg-amber-400 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                {connectionSpeed === 'slow' ? "Signing In... (Slow Connection)" : "Signing In..."}
                                            </div>
                                        ) : showTransition ? (
                                            "Redirecting..."
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