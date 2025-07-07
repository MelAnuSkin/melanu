import image2 from "../assets/images/image2.jpg";
import image3 from "../assets/images/image3.jpg";
import image4 from "../assets/images/image4.jpg";
import image5 from "../assets/images/image5.jpg";
import image6 from "../assets/images/image6.jpg";
import image7 from "../assets/images/image7.jpg";

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
        buttonText: "Explore Body Care",
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
        <section className="py-16 px-4 bg-[#FEFCE5]">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-serif text-amber-900 mb-4 mt-4 font-bold">Our Product Range</h2>
                    <p className="text-lg text-amber-700 max-w-2xl mx-auto leading-relaxed">From body to hair, face to men's care - discover the perfect natural
                        skincare solution crafted with love in Ghana.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white rounded-lg overflow-hidden shadow-lg group cursor-pointer transform transition-transform duration-300 hover:scale-105"
                        >

                            <div
                                className="h-48 bg-cover bg-center bg-no-repeat relative"
                                style={{ backgroundImage: `url(${product.bgImage})` }}
                            >

                                <div className="absolute inset-0 bg-opacity-30 group-hover:bg-opacity-40 transition-opacity duration-300"></div>


                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h3 className="text-2xl font-bold text-white text-center px-4">{product.title}</h3>
                                </div>
                            </div>

                            <div className="p-6 bg-white">

                                <p className="text-amber-800 text-sm mb-4 leading-relaxed">
                                    {product.description}
                                </p>

                                <ul className="text-sm space-y-1 mb-6">
                                    {product.items.map((item, index) => (
                                        <li key={index} className="flex items-center text-amber-700">
                                            <span className="w-1 h-1 bg-amber-500 rounded-full mr-2"></span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>


                                <button className="w-full py-3 px-4 border-2 border-amber-500 text-amber-600 font-medium rounded-lg hover:bg-amber-500 hover:text-white transition-colors duration-300 cursor-pointer">
                                    {product.buttonText}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-18 bg-gradient-to-r from-amber-100 to-amber-200 rounded-2xl p-8 md:p-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h3 className="text-3xl md:text-4xl font-serif text-amber-900 mb-6">Featured: Premium Shea Collection</h3>
                            <p className="text-amber-800 text-lg leading-relaxed mb-6">Our signature collection featuring the finest Grade A shea butter, sourced
                                directly from women cooperatives in Northern Ghana through our
                                SheaStrong Initiative.</p>

                            <ul className="space-y-3 mb-8">
                                <li className="flex items-center text-amber-800">
                                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                                    100% Organic & Unrefined Shea Butter
                                </li>
                                <li className="flex items-center text-amber-800">
                                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                                    Ethically Sourced & Fair Trade
                                </li>
                                <li className="flex items-center text-amber-800">
                                    <span className="w-2 h-2 bg-amber-600 rounded-full mr-3"></span>
                                    Supporting 200+ Women Producers
                                </li>
                            </ul>
                            <button className="bg-amber-700 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors duration-300 cursor-pointer">
                                Shop Premium Collection
                            </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-[#FCF6ED] rounded-xl p-4 shadow-md">
                                <div className="rounded-lg h-40 mb-4 overflow-hidden">
                                    <img 
                                    src={image6} 
                                    alt="body butter" 
                                    className="w-full h-full object-cover"/>
                                </div>
                                <h4 className="font-semibold text-amber-900 mb-2 font-serif">Shea Body Butter</h4>
                                <p className="text-amber-700 text-sm">From GH₵60</p>
                            </div>

                            <div className="bg-[#FCF6ED] rounded-xl p-4 shadow-md">
                                <div className="rounded-lg h-40 mb-4 overflow-hidden">
                                    <img 
                                    src={image7} 
                                    alt="hair treatment" 
                                    className="w-full h-full object-cover"/>
                                </div>
                                <h4 className="font-semibold text-amber-900 mb-2 font-serif">Hair Treatment</h4>
                                <p className="text-amber-700 text-sm">From GH₵50</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}