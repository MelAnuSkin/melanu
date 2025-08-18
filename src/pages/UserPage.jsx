import { ShoppingCart, Eye, LogOut} from "lucide-react";
import UserNav from "../components/UserNav";
import { Link, useNavigate } from "react-router";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { apiClient } from "../api/client.js";
import { ListOrdered } from "lucide-react";

export default function UserPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    navigate('/login');
                    return;
                }

                const response = await apiClient.get('/api/auth/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUser(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
                localStorage.removeItem('token');
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-amber-600 text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <>
            <UserNav />

            <div className="min-h-screen bg-white mb-15">
                <div className="bg-[#F0D09F] px-4 py-16">
                    <div className="max-w-6xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-mono text-amber-900 mb-4">
                            Welcome back, {user?.firstName || 'User'}!
                        </h1>
                        <p className="text-lg text-amber-700 max-w-2xl mx-auto font-mono leading-relaxed">
                            Your premium skincare journey continues here. Explore our latest products and manage your account.
                        </p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-8 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-8">
                                <h2 className="text-2xl text-amber-900 mb-8">Account Information</h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium text-amber-700">
                                            First Name
                                        </label>
                                        <p className="text-lg text-gray-700">{user?.firstName || 'N/A'}</p>
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="block text-sm font-medium text-amber-700">
                                            Last Name
                                        </label>
                                        <p className="text-lg text-gray-700">{user?.lastName || 'N/A'}</p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-amber-700">Email Address</label>
                                        <p className="text-lg text-gray-700">{user?.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl shadow-sm border border-amber-200 p-8">
                                <h2 className="text-2xl text-amber-900 mb-8">Quick Actions</h2>

                                <div className="space-y-4">
                                    <Link to="/products">
                                        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 cursor-pointer rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-3 mb-3">
                                            <ShoppingCart size={20} />
                                            Shop Products
                                        </button>
                                    </Link>

                                    <Link to="/cart">
                                        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 cursor-pointer rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-3 mb-3">
                                            <Eye size={20} />
                                            View Cart
                                        </button>
                                    </Link>


                                    <Link to="/vieworders">
                                        <button className="w-full bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 cursor-pointer rounded-xl font-medium transition-colors duration-200 flex items-center justify-center gap-3 mb-3">
                                            <ListOrdered size={20} />
                                            Orders
                                        </button>
                                    </Link>
                                    

                                    <button 
                                        onClick={handleLogout}
                                        className="bg-white w-full hover:bg-[#FEF2F2] px-6 py-2 cursor-pointer rounded-xl flex items-center justify-center text-red-500 gap-3 border border-red-500"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}