import { Link } from "react-router";
import image from "../assets/images/image12.jpg";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center max-w-2xl mx-auto px-4">
                <img 
                    src={image} 
                    alt="not found page" 
                    className="h-auto w-full max-w-md mx-auto mb-8 object-contain"
                />
                
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Page Not Found</h1>
                    <p className="text-gray-600 mb-6">
                        Sorry, the page you're looking for doesn't exist. 
                        Let's get you back to our beautiful skincare products!
                    </p>
                </div>
                
                <Link to="/">
                    <button className="bg-amber-600 hover:bg-amber-700 text-white font-medium px-6 py-3 rounded-lg transition-colors cursor-pointer">
                        Back to Home
                    </button>
                </Link>
            </div>
        </div>
    );
}