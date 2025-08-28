import { Link } from "react-router"

const reviews = [
    {
        name: "Hawa Issifu",
        role: "Customer",
        review: "I love sunrise body butter it smooth and smell so nice, and brother loved it, he keep asking me to buy for him."
    },
    {
        name: "Odelia Soga",
        role: "Customer",
        review: "MelAnu's products are amazing! The Hair + Scalp Treatment Tonic promotes hair growth, adds shine, and soothes my scalp. And the Sunrise Roast Body Butter smells incredible and leaves my skin soft and moisturized. I'm loving the whole range!"
    },
    {
        name: "Valentine Viel",
        role: "Customer",
        review: "I started using sunshine roast from the very first batch and honestly my skin hasn't looked any better up till then.The chocolate smell make the body butter almost eatable and the compliments just keep coming. The beard growth serum is soo effective and it also smells nice, my beard looks soo lush and full now all thanks to the beard oil.I highly recommend MelAnu skinfident all natural products for all especially anyone who wishes to enhance the beauty in their natural skin tone."
    },
    {
        name: "Aaron Kan Tamakloe",
        role: "Customer",
        review: "It feels more like skin relaxation and glows, it smells nice and comfy. I like it, but sometimes I forget to apply it constantly. It still does its job well."
    }
]

export default function CustomerReview() {
    return (
        <div className="bg-[#FEFCE4] py-12 sm:py-16 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header Section - Mobile Responsive */}
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-amber-900 mb-3 sm:mb-4 mt-2 sm:mt-4 font-bold leading-tight">
                        Testimonials
                    </h2>
                </div>

                {/* Reviews Grid - Mobile Responsive */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                    {reviews.map((review, index) => (
                        <div
                            key={index}
                            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-amber-100"
                        >
                            {/* Reviewer Info - Mobile Responsive */}
                            <div className="flex items-center mb-4 sm:mb-6">
                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-amber-200 flex items-center justify-center mr-3 sm:mr-4 border-2 border-amber-300 flex-shrink-0">
                                    <span className="text-amber-800 font-semibold text-sm sm:text-lg">
                                        {review.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-base sm:text-lg font-semibold text-amber-800 truncate">
                                        {review.name}
                                    </h3>
                                    <p className="text-amber-600 text-xs sm:text-sm">
                                        {review.role}
                                    </p>
                                </div>
                            </div>

                            {/* Review Quote - Mobile Responsive */}
                            <div className="relative">
                                <svg
                                    className="absolute -top-1 sm:-top-2 -left-1 sm:-left-2 w-6 h-6 sm:w-8 sm:h-8 text-amber-300 opacity-50"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                                </svg>
                                <p className="text-amber-700 italic leading-relaxed pl-4 sm:pl-6 text-sm sm:text-base">
                                    "{review.review}"
                                </p>
                            </div>

                            {/* Star Rating - Mobile Responsive */}
                            <div className="flex items-center mt-3 sm:mt-4">
                                {[...Array(5)].map((_, i) => (
                                    <svg
                                        key={i}
                                        className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Call to Action - Mobile Responsive */}
                <div className="text-center mt-8 sm:mt-12">
                    <p className="text-amber-700 mb-4 sm:mb-6 text-sm sm:text-base px-2 sm:px-0">
                        Join thousands of satisfied customers who love MelAnu products
                    </p>

                    <Link to="/products">
                        <button className="w-full sm:w-auto bg-amber-600 cursor-pointer hover:bg-amber-700 text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full transition-all duration-300 hover:scale-105 shadow-lg text-sm sm:text-base">
                            Shop Now
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}