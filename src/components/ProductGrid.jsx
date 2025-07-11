import image4 from "../assets/images/image4.jpg";
import { ShoppingCart } from "lucide-react";
import image7 from "../assets/images/image7.jpg";
import image8 from "../assets/images/image8.jpg";
import image9 from "../assets/images/image9.jpg";




export default function ProductGrid({products}) {

    const defaultProducts = [
        {
            id: 1,
            name: "MelAnu Body Butter Cream",
            price: "65.00",
            bgImage: image4,
            category: "Body Care"
        },
        {
            id: 2,
            name: "Hair Treatment Oil",
            price: "70.00",
            bgImage: image7,
            category: "Hair Care"
        },
    
        {
            id: 3,
            name: "Beard Growth Oil",
            price: "90.00",
            bgImage: image8,
            category: "Men's Collection"
        },
        {
            id: 4,
            name: "Cupid's Glow",
            price: "80.00",
            bgImage: image9,
            category: "Face Care"
        }
    
    ];





const displayProducts = products || defaultProducts;

    return(

        <div className="pb-16 px-4 mt-15">
            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                   {displayProducts.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:scale-105 transform transition-transform duration-300"
            >
              
              <div className="relative">
                <img 
                  src={product.bgImage} 
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              


              <div className="p-4">
                <div className="text-xs text-gray-600 font-medium mb-2 uppercase tracking-wide">
                  {product.category}
                </div>
            
                <h3 className="text-amber-600 font-serif font-semibold mb-3 line-clamp-2">
                  {product.name}
                </h3>
                
                
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-amber-900">
                    GH₵{product.price}
                  </span>
                  
                 
                  <button className="bg-amber-600 hover:bg-amber-700 text-white cursor-pointer px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2">
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
                </div>
            </div>
        </div>

    )
}