import image1 from "../assets/images/image1.jpg";
import { Link } from "react-router";

export default function Hero() {
    return (
        <div className="relative min-h-screen bg-gradient-to-br from-amber-800 via-amber-800 to-amber-900 overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
                style={{backgroundImage: `url(${image1})`}}>
            </div>

            <div className="absolute inset-0 bg-black/50"></div>
            
            <div className="relative z-10 flex items-center min-h-screen">
                <div className="px-4 sm:px-6 lg:px-8 w-full">
                    <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center max-w-7xl mx-auto">
                        <div className="text-white space-y-6 sm:space-y-8 text-center lg:text-left">
                            <div className="space-y-4 sm:space-y-6">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                                    Be Naturally 
                                    <br />
                                    <span className="text-yellow-300">Skinfident</span> 
                                </h1>
                                <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-lg mx-auto lg:mx-0 leading-relaxed px-2 sm:px-0">
                                    Discover premium African-inspired skincare and haircare formulations crafted with ethically sourced ingredients designed to nourish, protect, 
                                    and celebrate your natural beauty
                                </p>

                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                                    <Link to="/products">
                                        <button className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 sm:py-3 rounded-lg font-semibold text-base sm:text-lg cursor-pointer transition-colors">
                                            Shop Our Collection
                                        </button>
                                    </Link>
                                    <Link to="/about">
                                        <button className="w-full sm:w-auto border-2 border-white text-white px-6 py-2.5 sm:py-3 hover:bg-white hover:text-amber-900 rounded-lg font-semibold text-base sm:text-lg cursor-pointer transition-colors">
                                            Learn More
                                        </button>
                                    </Link>
                                </div>

                                <div className="flex flex-wrap gap-3 sm:gap-4 lg:gap-6 pt-6 sm:pt-8 justify-center lg:justify-start">
                                    <div className="bg-black/20 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-center min-w-[100px] sm:min-w-[120px]">
                                        <div className="text-2xl sm:text-3xl font-semibold text-yellow-400">2+</div>
                                        <div className="text-xs sm:text-sm text-gray-300">Years Crafting</div>
                                    </div>

                                    <div className="bg-black/20 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-center min-w-[100px] sm:min-w-[120px]">
                                        <div className="text-2xl sm:text-3xl font-semibold text-yellow-400">50+</div>
                                        <div className="text-xs sm:text-sm text-gray-300">Women Empowered</div>
                                    </div>
                                    
                                    <div className="bg-black/20 backdrop-blur-sm rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-center min-w-[100px] sm:min-w-[120px]">
                                        <div className="text-2xl sm:text-3xl font-semibold text-yellow-400">100%</div>
                                        <div className="text-xs sm:text-sm text-gray-300">Natural</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}