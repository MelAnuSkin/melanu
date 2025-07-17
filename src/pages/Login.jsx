import Navbar from "../components/Navbar";
import { ChevronLeft, Eye } from "lucide-react";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { apiClient } from "../api/client.js";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await apiClient.post('/api/auth/login', { email, password });
            console.log("Login successful:", response.data);
            localStorage.setItem('token', response.data.token);
            navigate('/userpage');
        } catch (error) {
            console.error("Login error:", error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <div className="bg-[#FFFFFF] flex items-center justify-center mb-10">
                <div className="h-screen w-screen mt-15" >
                    <Link to="/">
                        <button className="flex items-center text-amber-700 hover:text-amber-800 mb-8 transition-colors cursor-pointer ml-96">
                            <ChevronLeft size={16} />
                            <span className="text-sm">Back to Home</span>
                        </button></Link>

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

                                <form onSubmit={handleLogin} className="space-y-6">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            placeholder="james@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full px-3 py-2 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                                    </div>

                                    <div className="mt-7">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                placeholder="Enter your password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                className="w-full px-3 py-2 pr-10 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                                            <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                                <Eye size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="rememberMe"
                                                className="h-3 w-3 text-amber-600 focus:ring-amber-500 border-gray-300 rounded" />

                                            <label htmlFor="rememberMe" className="ml-2 text-sm text-amber-600">
                                                Remember me
                                            </label>
                                        </div>

                                        <a href="#" className="text-sm text-amber-600 hover:text-amber-700">
                                            Forgot password?
                                        </a>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-amber-600 text-white py-3 cursor-pointer rounded-md hover:bg-amber-700 transition-colors font-medium disabled:bg-amber-400"
                                    >
                                        {loading ? "Signing In..." : "Sign In"}
                                    </button>

                                    <div className="text-center mt-6">
                                        <p className="text-sm text-amber-600">
                                            Don't have an account?
                                            <Link to="/signup"><a href="#" className="text-amber-800 hover:text-amber-500 font-medium"> Sign Up</a></Link>
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