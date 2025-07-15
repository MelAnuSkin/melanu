import { useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { ChevronLeft, Eye } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router";
import { signupUser } from "../api/client.js"; // Update path as needed

export default function SignUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        acceptedTerms: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signupUser(formData);
            localStorage.setItem('signupEmail', formData.email);
            navigate('/OTP');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="bg-[#FFFFFF] flex items-center justify-center mb-40">
                <div className="h-screen mt-15">
                    <Link to="/">
                        <button className="flex items-center text-amber-700 hover:text-amber-800 mb-8 transition-colors cursor-pointer">
                            <ChevronLeft size={16} />
                            <span className="text-sm">Back to Home</span>
                        </button>
                    </Link>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-amber-800 font-mono mb-2">
                            Join MelAnu
                        </h1>
                        <p className="text-amber-800 font-normal text-md">
                            Create your account to start your skin care journey
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center font-mono">Create Account</h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="James"
                                        required
                                        className="w-full px-3 py-2 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        required
                                        className="w-full px-3 py-2 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="james@example.com"
                                    required
                                    className="w-full px-3 py-2 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a strong password"
                                        required
                                        className="w-full px-3 py-2 pr-10 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="Confirm your password"
                                        required
                                        className="w-full px-3 py-2 pr-10 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    />
                                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                                        <Eye size={16} />
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    id="acceptedTerms"
                                    name="acceptedTerms"
                                    checked={formData.acceptedTerms}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 h-3 w-3 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                                />
                                <label htmlFor="acceptedTerms" className="text-sm text-amber-900">
                                    I agree to the{' '}
                                    <a href="#" className="text-amber-600 hover:text-amber-700">Terms of Service</a>
                                    {' '}and{' '}
                                    <a href="#" className="text-amber-600 hover:text-amber-700">Privacy Policy</a>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-amber-600 text-white py-3 rounded-md hover:bg-amber-700 transition-colors font-medium cursor-pointer disabled:opacity-50"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>

                            <div className="text-center mt-6">
                                <p className="text-sm text-amber-600">
                                    Already have an account?{' '}
                                    <Link to="/login">
                                        <a href="#" className="text-amber-800 hover:text-amber-500 font-medium">Sign in</a>
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}