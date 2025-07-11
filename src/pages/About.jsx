import Navbar from "../components/Navbar"
import anita from "../assets/images/anita.jpg";








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
                                            src={anita}
                                            alt="about image"
                                            className="w-full h-dvh object-cover rounded-2xl" />
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


        </>

    )
}