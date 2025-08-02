import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react"; 
import UserNav from "../components/UserNav";
import { sendContactMessage } from "../api/client.js";

export default function Contact() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        inquiryType: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const isAuth = localStorage.getItem('isAuthenticated');
            
            if (token && isAuth) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
            }
        };

        checkAuth();

        window.addEventListener('storage', checkAuth);
        
        window.addEventListener('authChanged', checkAuth);

        return () => {
            window.removeEventListener('storage', checkAuth);
            window.removeEventListener('authChanged', checkAuth);
        };
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear messages when user starts typing
        if (successMessage) setSuccessMessage('');
        if (errorMessage) setErrorMessage('');
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!formData.fullName || !formData.email || !formData.inquiryType || !formData.subject || !formData.message) {
            setErrorMessage('Please fill in all required fields.');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorMessage('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await sendContactMessage(formData);
            
            if (response.status === 200 || response.status === 201) {
                setSuccessMessage('Thank you for your message! We\'ll get back to you soon.');
                // Reset form
                setFormData({
                    fullName: '',
                    email: '',
                    inquiryType: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            console.error('Error sending contact message:', error);
            setErrorMessage(
                error.response?.data?.message || 
                'Failed to send your message. Please try again later.'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {isAuthenticated ? <UserNav /> : <Navbar />}
            
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

                                {/* Success Message */}
                                {successMessage && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                        <p className="text-green-700 text-sm">{successMessage}</p>
                                    </div>
                                )}

                                {/* Error Message */}
                                {errorMessage && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                        <p className="text-red-700 text-sm">{errorMessage}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-amber-700 mb-2">Full Name <span className="text-amber-700">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="Your full name"
                                                className="w-full px-4 py-2 border border-amber-500 rounded-lg focus:ring-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-amber-700 mb-2">Email address <span className="text-amber-700">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                placeholder="youremail@example.com"
                                                className="w-full px-4 py-2 border border-amber-500 rounded-lg focus:ring-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-amber-700 mb-2">Inquiry Type <span className="text-amber-700">*</span>
                                        </label>

                                        <div className="relative">
                                            <select 
                                                name="inquiryType"
                                                value={formData.inquiryType}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-amber-500 rounded-lg focus:ring-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors cursor-pointer"
                                                disabled={isLoading}
                                            >
                                                <option value="">Select inquiry type</option>
                                                <option value="General">General inquiry</option>
                                                <option value="Order Support">Order support</option>
                                                <option value="SheaStrong Partnership">SheaStrong Partnership</option>
                                                <option value="Customer Support">Customer Support</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-amber-700 mb-2">Subject <span className="text-amber-700">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            placeholder="Brief subject of your message"
                                            className="w-full px-4 py-2 border border-amber-500 rounded-lg focus:ring-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-amber-700 mb-2">Message <span className="text-amber-700">*</span>
                                        </label>
                                        <textarea
                                            rows={6}
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            placeholder="Tell us more about how we can help you"
                                            className="w-full px-4 py-2 border border-amber-500 rounded-lg focus:ring-2 focus:outline-none focus:ring-amber-500 focus:border-amber-500 transition-colors"
                                            disabled={isLoading}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`px-8 py-3 rounded-lg font-medium transition-colors focus:ring-2 focus:ring-amber-500 outline-none focus:ring-offset-2 cursor-pointer ${
                                            isLoading 
                                                ? 'bg-amber-400 text-white cursor-not-allowed' 
                                                : 'bg-amber-600 text-white hover:bg-amber-700'
                                        }`}
                                    >
                                        {isLoading ? 'Sending...' : 'Send Message'}
                                    </button>
                                </form>
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
                                <p className="text-amber-600 text-sm leading-relaxed">We currently ship within Ghana, but international shipping is coming soon. Subscribe to our newsletter for updates.</p>
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
    );
}