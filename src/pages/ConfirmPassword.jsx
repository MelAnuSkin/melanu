import Navbar from "../components/Navbar"
import { Eye, EyeOff } from "lucide-react"
import { Link, useParams, useNavigate } from "react-router"
import { useState } from "react"
import { resetPassword } from "../api/client.js"; 

export default function ConfirmPassword() {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    
    const { token } = useParams(); 
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!password) {
            setError("Please enter a password");
            return;
        }
        
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            const response = await resetPassword(token, password);
            
            if (response.status === 200) {
                setMessage("Password reset successful! Redirecting to login...");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            }
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to reset password. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-white min-h-screen flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                    <div className="text-center mb-6">
                        <h1 className="text-2xl font-medium text-amber-800 font-mono mb-3">Enter Your New Password</h1>
                    </div>

                    
                    {message && (
                        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                            {message}
                        </div>
                    )}

                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full px-3 py-2 pr-10 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent mb-4" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-amber-600 text-white py-2 cursor-pointer rounded-md font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
                        >
                            {loading ? "Confirming..." : "Confirm"}
                        </button>
                    </form>

                    <div className="mt-4 text-center">
                        <Link to="/login" className="text-amber-600 hover:text-amber-700 text-sm">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}