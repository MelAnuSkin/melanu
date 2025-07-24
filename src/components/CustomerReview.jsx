import { Link } from "react-router"





const reviews = [
    {
        name: "Ama Amponsah",
        role: "Verified Customer",
        review: "The shea butter cream is absolutely amazing! My skin has never felt softer. I love knowing that my purchase supports women entrepreneurs in Ghana."
    },
    {
        name: "Elsie Owusu",
        role: "Skincare Enthusiast",
        review: "I've been using MelAnu products for 6 months now and the quality is exceptional. The natural ingredients work wonders on my sensitive skin."
    },
]


export default function CustomerReview() {
    return (
        <div className="bg-[#FEFCE4] py-16 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-4xl font-serif text-amber-900 mb-4 mt-4 font-bold">Testimonials</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-amber-100"
                        >

                            <div className="flex items-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-amber-200 flex items-center justify-center mr-4 border-2 border-amber-300">
                                    <span className="text-amber-800 font-semibold text-lg">
                                        {review.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-amber-800">
                                        {review.name}
                                    </h3>
                                    <p className="text-amber-600 text-sm">
                                        {review.role}
                                    </p>
                                </div>
                            </div>


                            <div className="relative">
                                <svg
                                    className="absolute -top-2 -left-2 w-8 h-8 text-amber-300 opacity-50"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                                </svg>
                                <p className="text-amber-700 italic leading-relaxed pl-6">
                                    "{review.review}"
                                </p>
                            </div>


                            <div className="flex items-center mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-yellow-400 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-12">
                    <p className="text-amber-700 mb-6">
                        Join thousands of satisfied customers who love MelAnu products
                    </p>

                    <Link to="/products">
                    <button className="bg-amber-600 cursor-pointer hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
                        Shop Now
                    </button></Link>
                </div>

            </div>
        </div>
    )
}