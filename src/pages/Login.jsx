import Navbar from "../components/Navbar";
import { ChevronLeft, Eye } from "lucide-react";




export default function Login() {
    return (
        <>
            <Navbar />

            <div className="bg-[#FFFFFF] flex items-center justify-center">
                <div className="h-screen w-screen mt-15" >
                    <button className="flex items-center text-amber-700 hover:text-amber-800 mb-8 transition-colors cursor-pointer ml-96">
                        <ChevronLeft size={16} />
                        <span className="text-sm">Back to Home</span>
                    </button>

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




                                <div className="space-y-6">

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input
                                            type="email"
                                            placeholder="james@example.com"
                                            className="w-full px-3 py-2 border border-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                                    </div>

                                    <div className="mt-7">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                        <div className="relative">
                                            <input
                                                type="password"
                                                placeholder="Create a strong password"
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
                                        type="button"
                                        className="w-full bg-amber-600 text-white py-3 rounded-md hover:bg-amber-700 transition-colors font-medium"
                                    >
                                        Sign In
                                    </button>


                                    <div className="relative my-6">
                                        <hr className="text-amber-500" />
                                        <div className="relative flex justify-center text-sm">
                                            <span className="px-2 bg-white text-amber-600">OR CONTINUE WITH</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <button type="button" className="flex items-center justify-center px-14 py-2 border border-amber-400 rounded-md hover:bg-amber-50 transition-colors cursor-pointer">
                                            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                            </svg>
                                            <span className="text-sm font-medium">Google</span>
                                        </button>

                                        <button
                                            type="button"
                                            className="flex items-center justify-center px-4 py-3 border border-amber-400 rounded-md hover:bg-amber-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                            <span className="text-sm font-medium">Facebook</span>
                                        </button>
                                    </div>

                                    <div className="text-center mt-6">
                                        <p className="text-sm text-amber-600">
                                            Don't have an account?
                                            <a href="#" className="text-amber-800 hover:text-amber-500 font-medium"> Sign Up</a>
                                        </p>
                                    </div>




                                </div>


                            </div>




                        </div>

                    </div>

                </div>
            </div>

        </>
    )
}