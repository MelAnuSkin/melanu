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
                <div className="px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-white space-y-8">
                            <div className="space-y-4">
                                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                    Be Naturally <br /><span className="text-yellow-300">Skinfident</span> 
                                </h1>
                                <p className="text-lg lg:text-xl text-gray-200 max-w-lg leading-relaxed">
                                    Discover premium African-inspired skincare and haircare formulations crafted with ethically sourced ingredients designed to nourish, protect, 
                                    and celebrate your natural beauty
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/products">
                                    <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded-lg font-semibold text-lg cursor-pointer">
                                    Shop Our Collection
                                    </button></Link>
                                        <Link to="/about">
                                    <button className="border-2 border-white text-white px-6 py-2 hover:bg-white hover:text-amber-900 rounded-lg font-semibold text-lg cursor-pointer">
                                        Learn More
                                    </button></Link>
                                </div>

                                <div className="flex flex-wrap gap-6 pt-8">
                                    <div className="bg-black/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                                        <div className="text-3xl font-semibold text-yellow-400">2+</div>
                                        <div className="text-sm text-gray-300">Years Crafting</div>
                                    </div>

                                    <div className="bg-black/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                                        <div className="text-3xl font-semibold text-yellow-400">50+</div>
                                        <div className="text-sm text-gray-300">Women Empowered</div>
                                    </div>
                                    <div className="bg-black/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                                        <div className="text-3xl font-semibold text-yellow-400">100%</div>
                                        <div className="text-sm text-gray-300">Natural</div>
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