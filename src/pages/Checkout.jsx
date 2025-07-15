import UserNav from "../components/UserNav";
import { ArrowLeft, MapPin, User } from "lucide-react";
import image4 from "../assets/images/image4.jpg";
import image7 from "../assets/images/image7.jpg";
import image9 from "../assets/images/image9.jpg";
import { Shield } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router";



const orderItems = [
    {
        id: 1,
        name: "Melanu Body Butter Cream",
        price: 65.00,
        quantity: 1,
        image: image4,

    },
    {
        id: 2,
        name: "Hair Treatment Oil",
        price: 70.00,
        quantity: 1,
        image: image7
    },
    {
        id: 3,
        name: "Cupid's Glow",
        price: 80.00,
        quantity: 1,
        image: image9
    }
];








export default function Checkout() {
    return (


        <>
            <UserNav />

            <div className="min-h-screen bg-white">
                <div className="bg-[#F0D09F] px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <Link to="/cart">
                        <button className="flex items-center text-amber-800 font-mono hover:bg-[#EADAC8] hover:rounded-full hover:px-3 cursor-pointer mb-4">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Cart
                        </button></Link>
                        <h1 className="text-4xl font-bold font-mono text-amber-800">Checkout</h1>
                        <p className="text-amber-700 font-bold font-mono mt-1">Complete your order securely</p>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow-sm shadow-amber-600 p-6">
                                <div className="flex items-center mb-6">
                                    <User className="w-5 h-5 text-amber-600 mr-2" />
                                    <h2 className="text-xl font-semibold text-amber-800">Personal Information</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-amber-600 mb-2">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="Enter your first name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-amber-600 mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Enter your last name"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div>
                                        <label className="block text-sm font-medium text-amber-600 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="youremail@example.com"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-amber-600 mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="+233 XX XXX XXXX"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm shadow-amber-600 p-6">
                                <div className="flex items-center mb-6">
                                    <MapPin className="w-5 h-5 text-amber-600 mr-2" />
                                    <h2 className="text-xl font-semibold text-amber-800">Shipping Address</h2>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-amber-600 mb-2">Street Address</label>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Enter your full address"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-amber-600 mb-2">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                placeholder="Enter your city"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-amber-600 mb-2">Region</label>
                                            <input
                                                type="text"
                                                name="region"
                                                placeholder="Enter your region"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-amber-600 mb-2">Postal Code (Optional)</label>
                                        <input
                                            type="text"
                                            name="postalcode"
                                            placeholder="Enter postal code"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm shadow-amber-600 p-6">
                                <h2 className="text-xl font-semibold text-amber-800 mb-4">Order Notes (Optional)</h2>
                                <textarea
                                    name="orderNotes"
                                    placeholder="Any special instructions for your order..."
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-600 focus:border-transparent" />
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-amber-500 sticky top-8">
                                <h2 className="text-xl font-mono font-bold text-amber-700 mb-6">Order Summary</h2>


                                <div className="space-y-4">
                                    {orderItems.map((item) => (
                                        <div key={item.id} className="flex items-center space-x-3">
                                            <div className="w-20 h-20 rounded-md flex items-center justify-center">
                                                <div className="w-15 h-15 bg-gray-100 rounded-lg overflow-hidden">
                                                    <img
                                                        src={item.image}
                                                        alt="images"
                                                        className="w-full h-full object-cover" />
                                                </div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-amber-800">{item.name}</div>
                                                <div className="text-sm text-amber-500">Qty: {item.quantity}</div>
                                            </div>
                                            <div className="font-semibold text-amber-800">GH₵{item.price}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-amber-600 pt-4 mt-6 space-y-2">
                                    <div className="flex justify-between text-amber-600">
                                        <span>Subtotal</span>
                                        <span>GH₵215.00</span>
                                    </div>
                                    <div className="flex justify-between text-amber-600">
                                        <span>Shipping</span>
                                        <span className="font-medium text-green-600">FREE</span>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <div className="flex items-center text-sm text-amber-600 mb-4 border border-amber-300 rounded-lg px-2 py-2 bg-[#FDF8F0]">
                                        <Shield className="w-4 h-4 text-green-600 mr-2" />
                                        Your payment information is secure and encrypted
                                    </div>

                                    <button className="w-full bg-amber-600 text-white py-3 cursor-pointer px-4 rounded-md font-semibold hover:bg-amber-800 transition-colors">
                                        Place Order - GH₵215.00
                                    </button>

                                    <p className="text-xs text-amber-500 text-center mt-3">
                                        By placing your order, you agree to our Terms of Service and Privacy Policy
                                    </p>
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