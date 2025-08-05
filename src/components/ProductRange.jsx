import image2 from "../assets/images/image2.jpg";
import image3 from "../assets/images/image3.jpg";
import image4 from "../assets/images/image4.jpg";
import image5 from "../assets/images/image5.jpg";
import image6 from "../assets/images/image6.jpg";
import image7 from "../assets/images/image7.jpg";
import { Link } from "react-router";

const products = [
    {
        id: 1,
        title: "Body Care",
        description: "Nourish and moisturize with our premium body collection",
        items: ["Shea Body Butter", "Body Oil"],
        buttonText: "Explore Body Care",
        bgImage: image2
    },

    {
        id: 2,
        title: "Hair Care",
        description: "Strengthen and shine with natural African ingredients",
        items: ["Hair Oil", "Conditioner"],
        buttonText: "Explore Hair Care",
        bgImage: image3
    },

    {
        id: 3,
        title: "Face Care",
        description: "Gentle yet effective facial care for all skin types",
        items: ["Face Serum", "Body Butter"],
        buttonText: "Explore Face Care",
        bgImage: image4
    },

    {
        id: 4,
        title: "Men's Collection",
        description: "Specially formulated for the modern African man",
        items: ["Beard Oil", "Hair Oil"],
        buttonText: "Explore Men's Collection",
        bgImage: image5
    },
];

export default function ProductRange() {
    return (
        <section className="py-12 sm:py-16 px-4 bg-[#FEFCE5]">
            <div className="max-w-7xl mx-auto">
                {/* Header Section - Mobile Responsive */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-900 mb-3 sm:mb-4 mt-2 sm:mt-4 font-bold leading-tight">
                        Our Product Range
                    </h2>
                    <p className="text-base sm:text-lg text-amber-700 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
                        From body to hair, face to men's care - discover the perfect natural
                        skincare solution crafted with love in Ghana.
                    </p>
                </div>

                {/* Product Grid - Mobile Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg overflow-hidden shadow-lg group cursor-pointer transform transition-transform duration-300 hover:scale-105"
                        >
                            {/* Product Image Header */}
                            <div
                                className="h-40 sm:h-48 bg-cover bg-center bg-no-repeat relative"
                                style={{ backgroundImage: `url(${product.bgImage})` }}
                            >
                                <div className="absolute inset-0 bg-opacity-30 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
                                
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-xl sm:text-2xl font-bold text-white text-center px-4">{product.title}</h3>
                                </div>
                            </div>

                            {/* Product Content */}
                            <div className="p-4 sm:p-6 bg-white">
                                <p className="text-amber-800 text-sm leading-relaxed mb-3 sm:mb-4">
                                    {product.description}
                                </p>

                                <ul className="text-xs sm:text-sm space-y-1 mb-4 sm:mb-6">
                                    {product.items.map((item, index) => (
                                        <li key={index} className="flex items-center text-amber-700">
                                            <span className="w-1 h-1 bg-amber-500 rounded-full mr-2 flex-shrink-0"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link to="/products">
                                    <button className="w-full py-2.5 sm:py-3 px-4 border-2 border-amber-500 text-amber-600 font-medium rounded-lg hover:bg-amber-500 hover:text-white transition-colors duration-300 cursor-pointer text-sm sm:text-base">
                                        {product.buttonText}
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Featured Collection Section - Mobile Responsive */}
                <div className="mt-12 sm:mt-16 lg:mt-18 bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl p-6 sm:p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                        {/* Featured Content */}
                        <div className="order-2 lg:order-1">
                            <h3 className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-900 mb-4 sm:mb-6 leading-tight">
                                Featured: Premium Shea Collection
                            </h3>
                            <p className="text-amber-800 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                                Our signature collection featuring the finest Grade A shea butter, sourced
                                directly from women cooperatives in Northern Ghana through our
                                SheaStrong Initiative.
                            </p>

                            <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                                <li className="flex items-center text-amber-800 text-sm sm:text-base">
                                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 flex-shrink-0"></span>
                                    100% Organic & Unrefined Shea Butter
                                </li>
                                <li className="flex items-center text-amber-800 text-sm sm:text-base">
                                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 flex-shrink-0"></span>
                                    Ethically Sourced & Fair Trade
                                </li>
                                <li className="flex items-center text-amber-800 text-sm sm:text-base">
                                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3 flex-shrink-0"></span>
                                    Supporting 200+ Women Producers
                                </li>
                            </ul>
                            
                            <Link to="/products">
                                <button className="w-full sm:w-auto bg-amber-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors duration-300 cursor-pointer text-sm sm:text-base">
                                    Shop Premium Collection
                                </button>
                            </Link>
                        </div>

                        {/* Featured Products Images */}
                        <div className="grid grid-cols-2 gap-3 sm:gap-4 order-1 lg:order-2">
                            <div className="bg-[#FCF6ED] rounded-xl p-3 sm:p-4 shadow-md">
                                <div className="rounded-lg h-32 sm:h-40 mb-3 sm:mb-4 overflow-hidden">
                                    <img 
                                        src={image6} 
                                        alt="body butter" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h4 className="font-semibold text-amber-900 mb-2 font-serif text-sm sm:text-base">
                                    Shea Body Butter
                                </h4>
                            </div>

                            <div className="bg-[#FCF6ED] rounded-xl p-3 sm:p-4 shadow-md">
                                <div className="rounded-lg h-32 sm:h-40 mb-3 sm:mb-4 overflow-hidden">
                                    <img 
                                        src={image7} 
                                        alt="hair treatment" 
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <h4 className="font-semibold text-amber-900 mb-2 font-serif text-sm sm:text-base">
                                    Hair Treatment
                                </h4>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}