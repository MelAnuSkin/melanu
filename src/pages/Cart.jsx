import Navbar from "../components/Navbar";
import { ArrowLeft, Minus } from "lucide-react";
import image4 from "../assets/images/image4.jpg";
import image7 from "../assets/images/image7.jpg";
import image9 from "../assets/images/image9.jpg";
import { Plus, Trash } from "lucide-react";
import { Truck } from "lucide-react";
import Footer from "../components/Footer";






const cartItems = [
    {
        id: 1,
        name: "Melanu Body Butter Cream",
        price: 65.00,
        quantity: 1,
        total: 65.00,
        image: image4,
        alt: "Body Butter Cream"
    },
    {
        id: 2,
        name: "Hair Treatment Oil",
        price: 70.00,
        quantity: 1,
        total: 70.00,
        image: image7,
        alt: "Hair Treatment Oil"
    },
    {
        id: 3,
        name: "Cupid's Glow",
        price: 80.00,
        quantity: 1,
        total: 80.00,
        image: image9,
        alt: "Hair Treatment Oil"
    },


]


export default function Cart() {
    return (
        <>

            <Navbar />

            <div className="min-h-screen bg-white">
                <div className="bg-[#F0D09F] px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <button className="flex items-center text-amber-800 font-mono hover:bg-[#EADAC8] hover:rounded-full hover:px-3 cursor-pointer mb-4">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Continue Shopping
                        </button>
                        <h1 className="text-4xl font-bold font-mono text-amber-800">Shopping Cart</h1>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => (
                                <div key={item.id} className="bg-white rounded-lg p-7 shadow-sm border border-amber-500">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={item.image}
                                                alt={item.alt}
                                                className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-medium text-amber-800 mb-2">{item.name}</h3>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-amber-700 font-bold text-lg">GH₵{item.price}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <button className="w-8 h-8 rounded-full cursor-pointer border border-amber-600 flex items-center justify-center hover:bg-amber-500">
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                                            <button className="w-8 h-8 rounded-full cursor-pointer border border-amber-600 flex items-center justify-center hover:bg-amber-500">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <div className="font-bold text-lg text-amber-700">GH₵{item.total}</div>
                                        </div>

                                        <button className="text-amber-600 hover:text-amber-800 hover:bg-[#EADAC8] hover:rounded-lg hover:py-2 px-3 cursor-pointer p-1">
                                            <Trash className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg p-6 shadow-sm border border-amber-500 top-8">
                                <h2 className="text-xl font-mono font-bold text-amber-700 mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-amber-700">Subtotal</span>
                                        <span className="text-amber-700">GH₵215.00</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center space-x-2">
                                            <Truck className="w-4 h-4 text-amber-700 " />
                                            <span className="text-amber-700">Shipping</span>
                                        </div>
                                        <span className="font-medium text-green-600">FREE</span>
                                    </div>

                                    <div className="border-t border-amber-500 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-lg font-bold text-amber-700">Total</span>
                                            <span className="text-xl font-bold text-amber-700">GH₵215.00</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full bg-amber-600 text-white cursor-pointer py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors">
                                    Proceed to Checkout</button>

                                <div className="mt-4 text-center text-sm text-amber-500">
                                    <p>Secure checkout with 256-bit SSL encryption</p>
                                    <p>Free returns within 30 days</p>
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