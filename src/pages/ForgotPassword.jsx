import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import { apiClient } from "../api/client.js";

export default function ForgotPassword() {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    const handleSubmit = async () => {
        setLoading(true)
        setMessage("")
        try {
            await apiClient.post('/api/auth/forgot-password', { email })
            setMessage("Reset link sent to your email!")
        } catch (error) {
            setMessage("Error sending reset link. Please try again.")
        }
        setLoading(false)
    }

    return(
        <>
        <Navbar />

        <div className="bg-white min-h-screen flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-medium text-amber-800 font-mono mb-3">Forgot Password</h1>
                    <p className="text-amber-600 text-sm leading-relaxed">Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-amber-700 mb-2">Email Address</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="w-5 h-5 text-amber-500" />
                            </div>

                            <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full pl-10 pr-3 py-3 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                        </div>
                    </div>

                    <button 
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-amber-600 text-white py-2 cursor-pointer rounded-md font-medium hover:bg-amber-700 transition-colors disabled:opacity-50">
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>

                    {message && <p className="text-center text-sm mt-2 text-amber-600">{message}</p>}
                </div>

                <div className="mt-6 text-center">
                    <Link to="/login">
                    <button className="flex items-center justify-center gap-2 text-amber-600 hover:text-amber-700 mx-auto text-sm font-medium cursor-pointer">
                        <ArrowLeft className="w-4 h-4"/>
                        Back to Login
                        </button></Link>
                </div>
            </div>
        </div>

        <Footer />
        </>
    )
}