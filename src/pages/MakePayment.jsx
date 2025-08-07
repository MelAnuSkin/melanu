import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router';
import UserNav from "../components/UserNav";
import { ArrowLeft, CheckCircle, MapPin, Package, CreditCard, Shield } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router";
import { initiatePayment } from '../api/client.js';

export default function MakePayment() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [processingPayment, setProcessingPayment] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Get order details from navigation state or localStorage backup
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const isAuth = localStorage.getItem('isAuthenticated');
            
            if (token && isAuth) {
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                alert('Please login to access payment page');
                navigate('/login');
                return;
            }
        };
        
        checkAuth();

        // Get order details from navigation state
        if (location.state?.orderDetails) {
            setOrderDetails(location.state.orderDetails);
            // Store in localStorage as backup
            localStorage.setItem('pendingOrder', JSON.stringify(location.state.orderDetails));
        } else {
            // Try to get from localStorage backup
            const storedOrder = localStorage.getItem('pendingOrder');
            if (storedOrder) {
                try {
                    setOrderDetails(JSON.parse(storedOrder));
                } catch (e) {
                    console.error('Error parsing stored order:', e);
                    alert('Order details not found. Redirecting to products...');
                    navigate('/products');
                }
            } else {
                alert('Order details not found. Please place an order first.');
                navigate('/products');
            }
        }
    }, [location.state, navigate, orderId]);

    // Handle payment initiation
    const handleMakePayment = async () => {
        if (!orderDetails) {
            alert('Order details not found. Please try again.');
            return;
        }

        setProcessingPayment(true);

        try {
            const token = localStorage.getItem('token');
            
            // Get user email from localStorage or decode from token
            let userEmail = localStorage.getItem('userEmail');
            
            if (!userEmail) {
                try {
                    const tokenPayload = JSON.parse(atob(token.split('.')[1]));
                    userEmail = tokenPayload.email;
                } catch (e) {
                    console.error('Could not decode email from token');
                    alert('Unable to retrieve user email. Please try logging in again.');
                    setProcessingPayment(false);
                    return;
                }
            }

            console.log('Initiating payment with:', { 
                email: userEmail, 
                orderId: orderDetails.orderId 
            });
            
            // Initiate payment with Paystack
            const paymentResponse = await initiatePayment(userEmail, orderDetails.orderId, token);
            
            console.log('Payment initiation response:', paymentResponse.data);

            // Handle the payment response and redirect to Paystack
            if (paymentResponse.data && paymentResponse.data.authorization_url) {
                console.log('Redirecting to Paystack...');
                // Clear stored order since payment is being processed
                localStorage.removeItem('pendingOrder');
                window.location.href = paymentResponse.data.authorization_url;
            } else if (paymentResponse.data && paymentResponse.data.paymentUrl) {
                console.log('Redirecting to payment URL...');
                localStorage.removeItem('pendingOrder');
                window.location.href = paymentResponse.data.paymentUrl;
            } else {
                throw new Error('Payment authorization URL not received');
            }

        } catch (error) {
            console.error('Error in payment process:', error);
            
            let errorMessage = 'Failed to initiate payment. Please try again.';
            
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(errorMessage);
        } finally {
            setProcessingPayment(false);
        }
    };

    if (loading || !orderDetails) {
        return (
            <>
                <UserNav />
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                        <p className="mt-4 text-amber-700">Loading order details...</p>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <UserNav />

            <div className="min-h-screen bg-white">
                {/* Hero Section - Mobile Responsive */}
                <div className="bg-[#F0D09F] px-4 py-8 sm:py-12 lg:py-16">
                    <div className="max-w-6xl mx-auto">
                        <Link to="/checkout">
                            <button className="flex items-center text-amber-800 font-mono hover:bg-[#EADAC8] hover:rounded-full hover:px-3 cursor-pointer mb-4 text-sm sm:text-base">
                                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                                Back to Checkout
                            </button>
                        </Link>
                        <div className="flex items-center mb-2">
                            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mr-3" />
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono text-amber-800">Order Confirmed!</h1>
                        </div>
                        <p className="text-amber-700 font-bold font-mono mt-1 text-sm sm:text-base">Review your order and proceed to payment</p>
                        <p className="text-amber-600 text-xs sm:text-sm mt-1">Order ID: {orderDetails.orderId}</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
                    <div className="space-y-6 sm:space-y-8">
                        {/* Order Summary Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-amber-500 p-4 sm:p-6">
                            <div className="flex items-center mb-4 sm:mb-6">
                                <Package className="w-5 h-5 text-amber-600 mr-2" />
                                <h2 className="text-lg sm:text-xl font-semibold text-amber-800">Order Summary</h2>
                            </div>

                            {/* Product Details */}
                            <div className="border border-amber-200 rounded-lg p-4 mb-4">
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                                        <img
                                            src={orderDetails.item.image || 'https://via.placeholder.com/80x80?text=Product'}
                                            alt={orderDetails.item.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/80x80?text=Product';
                                            }}
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-medium text-amber-800 text-base sm:text-lg mb-1">{orderDetails.item.name}</h3>
                                        <p className="text-amber-600 text-sm sm:text-base mb-2">GH₵{orderDetails.item.price.toFixed(2)} each</p>
                                        <p className="text-amber-700 text-sm">Quantity: {orderDetails.item.quantity}</p>
                                    </div>

                                    {/* Total Price */}
                                    <div className="text-center sm:text-right">
                                        <div className="font-bold text-lg sm:text-xl text-amber-700">
                                            GH₵{orderDetails.total.toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Totals */}
                            <div className="border-t border-amber-300 pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm sm:text-base">
                                        <span className="text-amber-700">Subtotal:</span>
                                        <span className="font-semibold text-amber-800">GH₵{orderDetails.total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm sm:text-base">
                                        <span className="text-amber-700">Shipping:</span>
                                        <span className="font-semibold text-green-600">FREE</span>
                                    </div>
                                    <div className="flex justify-between items-center text-base sm:text-lg font-bold border-t border-amber-200 pt-2">
                                        <span className="text-amber-800">Total Amount:</span>
                                        <span className="text-amber-800">GH₵{orderDetails.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Details Card */}
                        <div className="bg-white rounded-lg shadow-sm border border-amber-500 p-4 sm:p-6">
                            <div className="flex items-center mb-4 sm:mb-6">
                                <MapPin className="w-5 h-5 text-amber-600 mr-2" />
                                <h2 className="text-lg sm:text-xl font-semibold text-amber-800">Shipping Details</h2>
                            </div>

                            <div className="bg-amber-50 rounded-lg p-4">
                                <div className="space-y-2 text-sm sm:text-base">
                                    <div>
                                        <span className="font-medium text-amber-800">Address:</span>
                                        <span className="ml-2 text-amber-700">{orderDetails.shippingAddress.address}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-amber-800">City:</span>
                                        <span className="ml-2 text-amber-700">{orderDetails.shippingAddress.city}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-amber-800">Region:</span>
                                        <span className="ml-2 text-amber-700">{orderDetails.shippingAddress.region}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium text-amber-800">Phone:</span>
                                        <span className="ml-2 text-amber-700">{orderDetails.shippingAddress.phone}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Order Notes */}
                            {orderDetails.orderNotes && (
                                <div className="mt-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <span className="font-medium text-amber-800">Order Notes:</span>
                                        <p className="mt-1 text-amber-700 text-sm">{orderDetails.orderNotes}</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Section */}
                        <div className="bg-white rounded-lg shadow-sm border border-amber-500 p-4 sm:p-6">
                            <div className="text-center mb-6">
                                <h2 className="text-lg sm:text-xl font-semibold text-amber-800 mb-2">Ready to Pay?</h2>
                                <p className="text-amber-600 text-sm sm:text-base">Complete your purchase securely with Paystack</p>
                            </div>

                            {/* Security Info */}
                            <div className="flex items-start text-xs sm:text-sm text-amber-600 mb-6 border border-amber-300 rounded-lg px-3 sm:px-4 py-3 bg-[#FDF8F0]">
                                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                                <span>Your payment information is secure and encrypted with Paystack. You'll be redirected to complete your payment safely.</span>
                            </div>

                            {/* Make Payment Button */}
                            <button 
                                onClick={handleMakePayment}
                                disabled={processingPayment}
                                className="w-full bg-green-600 text-white cursor-pointer py-4 sm:py-5 rounded-lg font-semibold text-lg sm:text-xl hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                            >
                                {processingPayment ? (
                                    <>
                                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                                        <span>Redirecting to Paystack...</span>
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-6 h-6" />
                                        <span>Make Payment - GH₵{orderDetails.total.toFixed(2)}</span>
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-amber-500 text-center mt-4">
                                By clicking "Make Payment", you'll be redirected to Paystack to complete your purchase securely
                            </p>
                        </div>

                        {/* Order Status Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="text-center">
                                <h3 className="font-medium text-blue-800 mb-2">What happens next?</h3>
                                <div className="text-sm text-blue-700 space-y-1">
                                    <p>• Complete payment securely through Paystack</p>
                                    <p>• Receive order confirmation via email</p>
                                    <p>• Your order will be processed and shipped</p>
                                    <p>• Track your order status in your account</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}