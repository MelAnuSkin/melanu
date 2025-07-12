import Navbar from "../components/Navbar"
import about from "../assets/images/about.jpg";
import { MicVocal } from "lucide-react";
import anita from "../assets/images/anita.jpg";
import Footer from "../components/Footer";







export default function About() {
    return (


        <>
            <Navbar />

            <div className="bg-[#F0D09F]">
                <div className="container mx-auto px-6 py-16">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        <div className="flex-1 max-w-2xl">
                            <h1 className="text-4xl lg:text-5xl font-serif text-amber-900 mb-6 leading-tight mt-8">Our Story of <br />
                                <span className="text-amber-700">Natural Beauty</span></h1>

                            <p className="text-lg text-amber-800 mb-8 leading-relaxed font-semibold">MelAnu was born from a deep appreciation for African skincare
                                <br />traditions and a vision to share these treasures with the world<br />while empowering the communities that make it all possible</p>

                            <button className="bg-amber-600 hover:bg-amber-800 text-white font-medium px-7 py-2 rounded-lg transition-all duration-300 transform hover:shadow-lg cursor-pointer">Join Our Mission</button>
                        </div>

                        <div className="flex-1 max-w-2xl">
                            <div className="relative">
                                <div className="rounded-3xl overflow-hidden shadow-2xl">
                                    <div className="aspect-[4/3] relative">
                                        <img
                                            src={about}
                                            alt="about image"
                                            className="w-full h-full object-cover rounded-2xl" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white py-20">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl lg:text-4xl font-serif font-bold text-amber-900 mb-6">Our Mission & Values</h2>
                        <p className="text-lg text-amber-800 max-w-4xl mx-auto leading-relaxed">We're committed to creating premium skincare products while building stronger <br />
                            communities and preserving traditional African beauty wisdom.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                        <div className="bg-white rounded-xl p-7 shadow-lg hover:shadow-xl transition-shadow text-center group">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">Authentic Care</h3>
                            <p className="text-amber-700 leading-relaxed">Every product is crafted with <br />
                                genuine love and traditional<br />African wisdom passed down<br />through generations.</p>
                        </div>

                        <div className="bg-white rounded-xl p-7 shadow-lg hover:shadow-xl transition-shadow text-center group">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">Community First</h3>
                            <p className="text-amber-700 leading-relaxed">We believe in empowering communities, especially women,
                                through fair trade and sustainable partnerships.</p>
                        </div>

                        <div className="bg-white rounded-xl p-7 shadow-lg hover:shadow-xl transition-shadow text-center group">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">Natural Purity</h3>
                            <p className="text-amber-700 leading-relaxed">Our commitment to 100% natural, unrefined ingredients ensures
                                the highest quality for your skin.</p>
                        </div>

                        <div className="bg-white rounded-xl p-7 shadow-lg hover:shadow-xl transition-shadow text-center group">
                            <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-amber-900 mb-2">Excellence</h3>
                            <p className="text-amber-700 leading-relaxed"> We maintain rigorous quality standards while honoring
                                traditional production methods.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#F7F3F0] py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <h3 className="text-3xl md:text-4xl font-serif font-bold text-center text-amber-900 mb-16">A Note From Our Founder</h3>
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="bg-white rounded-2xl shadow-lg p-8 relative">
                            <div className="absolute top-6 right-6 w-8 h-8 text-amber-500">
                                <MicVocal size={20} />
                            </div>
                            <div className="text-gray-600 italic text-lg leading-relaxed">
                                "Growing up in Ghana, I watched my grandmother carefully prepare shea butter and natural oils that kept our family's skin healthy and radiant. These weren't just beauty products—they were traditions, stories, and wisdom passed down through generations.
                                <br /><br />
                                When I moved away for my studies, I struggled to find skincare products that worked for my skin the way my grandmother's remedies did. That's when I realized the world needed access to these authentic African beauty secrets, prepared with the same care and tradition I grew up with.
                                <br /><br />
                                MelAnu isn't just about selling products—it's about honoring our heritage, empowering the women who make these treasures possible, and sharing the gift of natural, effective skincare with everyone who believes in the power of authentic beauty"
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <img
                                src={anita}
                                alt="anita"
                                className="rounded-2xl shadow-lg w-full max-w-md h-dvh object-cover" />

                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white py-16 px-4 mt-10">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                        <div className="flex justify-center mb-5">
                            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center">
                                <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif text-amber-800 mb-6">Join Our Community</h2>
                        <p className="text-amber-600 text-lg mb-8 max-w-2xl mx-auto">
                            Be the first to discover new products, wellness tips, and stories from our
                            SheaStrong community. Plus, get 15% off your first order!
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />

                            <button className="px-8 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-900 cursor-pointer transition-colors">
                                Join Now
                            </button>
                        </div>
                        <p className="text-amber-500 text-sm">
                            We respect your privacy. Unsubscribe at any time.
                        </p>
                    </div>
                </div>
            </div>


            <Footer />




        </>

    )
}