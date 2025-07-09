import { ChevronLeft } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"





export default function OTP() {
    return (
        <>
            <Navbar />


            <div className="bg-[#FFFFFF] flex items-center justify-center mt-3">
                <div className="h-screen mt-15">
                    <button className="flex items-center text-amber-700 hover:text-amber-800 mb-8 cursor-pointer transition-colors">
                        <ChevronLeft size={16} />
                        <span className="text-sm">Back to Home</span>
                    </button>

                    <div className="text-center mb-8">
                        <h1 className="text-amber-800 text-3xl font-mono font-bold mb-2">Verify Your Email</h1>
                        <p className="text-amber-800 font-normal text-md">
                            We've sent a 6-digit verification code to your email</p>
                    </div>

                    <div className="mb-8 bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
                        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center font-mono">
                            Enter Verification Code</h2>

                        <div className="mb-8">
                            <input
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                            />
                            <input
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none transition-colors"
                            />
                            <input
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                            />
                            <input
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                            />
                            <input
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                            />
                            <input
                                type="text"
                                maxLength="1"
                                className="w-12 h-12 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                            />
                        </div>
                        <button className="w-full py-3 px-4 rounded-lg font-medium text-white bg-amber-600 hover:bg-amber-800 transition-colors duration-200 cursor-pointer mb-5">
                            Verify Account</button>

                        <div className="text-center space-y-4">
                            <p className="text-amber-800 font-light">Didn't receive the code?</p>

                            <button className="px-6 py-2  cursor-pointer border border-amber-500 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors duration-200">
                                Resend Code</button>

                                <p className="text-sm text-amber-700">Need help?
                                    <span className="text-sm text-amber-700 hover:text-amber-800 cursor-pointer"> Contact support</span>
                                </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />


        </>

    )
};