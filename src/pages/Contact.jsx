import { Clock, Mail, MapPin, Phone } from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"











export default function Contact() {
    return (
        <>

            <Navbar />
            <div className="min-h-screen bg-white">
                <div className="bg-[#F0D09F] px-4 py-16">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold font-mono text-amber-800 mb-6">Get in Touch</h1>
                        <p className="text-lg text-amber-800 font-mono max-w-2xl mx-auto leading-relaxed">Have questions about our products or SheaStrong Initiative? We'd love to hear from you. Reach out and let's start a conversation.</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-8">
                                <h2 className="text-xl font-bold text-amber-800 mb-6">Send us a Message</h2>

                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-amber-700 mb-2">Full Name <span className="text-amber-700">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Your full name"
                                                className="w-full px-4 py-2 border border-amber-500 rounded-lg focus:ring-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors" />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-amber-700 mb-2">Email address <span className="text-amber-700">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="youremail@example.com"
                                                className="w-full px-4 py-2 border border-amber-500 rounded-lg focus:ring-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-amber-700 mb-2">Inquiry Type <span className="text-amber-700">*</span>
                                        </label>

                                        <div className="relative">
                                            <select className="w-full px-4 py-2 border border-amber-500 rounded-lg focus:ring-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors cursor-pointer">
                                                <option>Select inquiry type</option>
                                                <option>General inquiry</option>
                                                <option>Order support</option>
                                                <option>SheaStrong Partnership</option>
                                                <option>Customer Support</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-amber-700 mb-2">Subject <span className="text-amber-700">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Brief subject of your message"
                                            className="w-full px-4 py-2 border border-amber-500 rounded-lg focus:ring-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors" />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-amber-700 mb-2">Message <span className="text-amber-700">*</span>
                                        </label>
                                        <textarea
                                            rows={6}
                                            placeholder="Tell us more about how we can help you"
                                            className="w-full px-4 py-2 border border-amber-500 rounded-lg focus:ring-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors" />
                                    </div>

                                    <button
                                        type="button"
                                        className="bg-amber-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-amber-700 transition-colors focus:ring-2 focus:ring-amber-500 outline-none focus:ring-offset-2">Send Message
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                                <div className="flex items-center mb-4">
                                    <MapPin className="w-5 h-5 text-amber-600 mr-3" />
                                    <h3 className="text-lg font-semibold text-amber-800">Visit Our Store</h3>
                                </div>
                                <div className="text-amber-700 space-y-1">
                                    <p className="">MelAnu Skincare</p>
                                    <p>Tamale, Northern Region, Ghana</p>
                                    <p>Near Central Market</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                                <div className="flex items-center mb-4">
                                    <Phone className="w-5 h-5 text-amber-600 mr-3" />
                                    <h3 className="text-lg font-semibold text-amber-800">Call Us</h3>
                                </div>
                                <div className="text-amber-700 space-y-1">
                                    <p>+233 24 613 0414</p>
                                    <p className="text-sm">Mon-Fri: 8AM-6PM GMT</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                                <div className="flex items-center mb-4">
                                    <Mail className="w-5 h-5 text-amber-600 mr-3" />
                                    <h3 className="text-lg font-semibold text-amber-800">Email Us</h3>
                                </div>
                                <div className="text-amber-700 space-y-1">
                                    <p>melanu.gh@gmail.com</p>
                                    <p>support@melanu.com</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                                <div className="flex items-center mb-4">
                                    <Clock className="w-5 h-5 text-amber-600 mr-3" />
                                    <h3 className="text-lg font-semibold text-amber-800">Business Hours</h3>
                                </div>
                                <div className="text-amber-700 space-y-1">
                                    <p>Monday - Friday: 8AM - 6PM</p>
                                    <p>Saturday: 9AM - 4PM</p>
                                    <p>Sunday: Closed</p>
                                </div>
                            </div>

                             <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                                <div className="flex items-center mb-4">
                                    <h3 className="text-lg font-semibold text-amber-800">Follow Our Journey</h3>
                                </div>
                                <div className="text-amber-700 space-y-1">
                                    <p>Instagram: <a href="">@melanuskingh</a></p>
                                    <p>Whatsapp +233 50 052 5952</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#F7F3F0] py-16 px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-amber-800 mb-4">Frequently Asked Questions</h2>
                            <p className="text-amber-600">Quick answers to common questions about MelAnu products and services.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
                                <h3 className="font-semibold text-amber-800 mb-3">What makes MelAnu products different?</h3>
                                <p className="text-amber-600 text-sm leading-relaxed">Our products are made with premium Grade A shea butter sourced directly from women cooperatives in Northern Ghana through our SheaStrong Initiative.</p>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6" >
                                <h3 className="font-semibold text-amber-800 mb-3">How long does shipping take?</h3>
                                <p className="text-amber-600 text-sm leading-relaxed">Delivery within Accra takes 1-2 days, while other regions in Ghana receive orders within 3-5 business days.</p>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6" >
                                <h3 className="font-semibold text-amber-800 mb-3">Do you ship internationally?</h3>
                                <p className="text-amber-600 text-sm leading-relaxed">Delivery within Accra takes 1-2 days, while other regions in Ghana receive orders within 3-5 business days.We currently ship within Ghana, but international shipping is coming soon. Subscribe to our newsletter for updates.</p>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6" >
                                <h3 className="font-semibold text-amber-800 mb-3">What payment methods do you accept?</h3>
                                <p className="text-amber-600 text-sm leading-relaxed">We accept Mobile Money (MTN, Telecel, AirTelTigo), bank cards (Visa, Mastercard), Paystack, and bank transfers.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}