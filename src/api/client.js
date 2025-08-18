import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'https://skin-care-mel-api.onrender.com'
});

export const apiFetcher = async (url) => {
    const response = await apiClient.get(url);
    return response.data;
};

export const signupUser = async (userData) => {
    const response = await apiClient.post('/api/auth/register', userData);
    return response;
};

export const verifyOTP = async (email, otp) => {
    const response = await apiClient.post('/api/auth/verify-otp', { email, otp });
    return response;
};

export const loginUser = async (email, password) => {
    const response = await apiClient.post('/api/auth/login', { email, password });
    return response;
};

// Get All Products function
export const getAllProducts = async () => {
    const response = await apiClient.get('/api/products');
    return response;
};

// Get Single Product function
export const getProduct = async (productId, token) => {
    try {
        console.log('Getting product with ID:', productId);
        const response = await apiClient.get(`/api/products/${productId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Get product response:', response);
        return response;
    } catch (error) {
        console.error('Error in getProduct:', error.response?.data || error.message);
        throw error;
    }
};

// Add Product function
export const addProduct = async (productData, token) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('stock', productData.stock);
    if (productData.image) {
        formData.append('image', productData.image);
    }

    const response = await apiClient.post('/api/products', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// Update Product function
export const updateProduct = async (productId, productData, token) => {
    const formData = new FormData();
    formData.append('name', productData.name);
    formData.append('description', productData.description);
    formData.append('price', productData.price);
    formData.append('category', productData.category);
    formData.append('stock', productData.stock);
    if (productData.image) {
        formData.append('image', productData.image);
    }

    const response = await apiClient.put(`/api/products/${productId}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// Delete Product function
export const deleteProduct = async (productId, token) => {
    const response = await apiClient.delete(`/api/products/${productId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// Get Cart Items
export const getCartItems = async (token) => {
    try {
        console.log('Getting cart items with token:', token ? 'Token exists' : 'No token');
        const response = await apiClient.get('/api/carts', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Get cart items response:', response);
        return response;
    } catch (error) {
        console.error('Error in getCartItems:', error.response?.data || error.message);
        throw error;
    }
};

// Add Item to Cart - UPDATED FOR NEW ENDPOINT FORMAT
export const addToCart = async (productId, quantity = 1, token) => {
    try {
        console.log('Adding to cart:', { productId, quantity });
        console.log('Using token:', token ? 'Token exists' : 'No token');
        console.log('Making request to:', `${apiClient.defaults.baseURL}/api/carts/add/${productId}`);
        
        const response = await apiClient.post(`/api/carts/add/${productId}`, {
            quantity: parseInt(quantity) // Only quantity in body
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('Add to cart response:', response);
        return response;
    } catch (error) {
        console.error('Error in addToCart:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error config:', error.config);
        throw error;
    }
};

// Update Cart Item Quantity - ENHANCED DEBUGGING VERSION
export const updateCartItem = async (productId, quantity, token) => {
    try {
        console.log('=== UPDATE CART ITEM DEBUG ===');
        console.log('1. Input parameters:', { productId, quantity, token: token ? 'EXISTS' : 'MISSING' });
        console.log('2. ProductId type:', typeof productId);
        console.log('3. ProductId length:', productId?.length);
        console.log('4. Quantity type:', typeof quantity);
        
        const cleanProductId = productId.toString().trim();
        const cleanQuantity = parseInt(quantity);
        
        console.log('5. Cleaned productId:', cleanProductId);
        console.log('6. Cleaned quantity:', cleanQuantity);
        
        const fullUrl = `${apiClient.defaults.baseURL}/api/carts/update/${cleanProductId}`;
        console.log('7. Full URL:', fullUrl);
        
        const requestData = {
            quantity: cleanQuantity
        };
        
        console.log('8. Request data:', requestData);
        console.log('9. About to make request...');
        
        const response = await apiClient.put(`/api/carts/update/${cleanProductId}`, requestData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        
        console.log('10. SUCCESS - Update cart item response:', response);
        return response;
    } catch (error) {
        console.log('=== UPDATE CART ERROR DEBUG ===');
        console.error('ERROR in updateCartItem:', error);
        console.error('Error response data:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error config URL:', error.config?.url);
        console.error('Error config method:', error.config?.method);
        console.error('Error config data:', error.config?.data);
        console.error('Full error config:', error.config);
        
        // Check if this is a 404 specifically about product not found
        if (error.response?.status === 404 && error.response?.data?.message?.includes('Product not found')) {
            console.log('=== 404 PRODUCT NOT FOUND ANALYSIS ===');
            console.log('This could be due to:');
            console.log('1. Product ID format mismatch');
            console.log('2. Product not actually in cart');
            console.log('3. User session/token mismatch');
            console.log('4. Backend expecting different data format');
        }
        
        throw error;
    }
};

// Remove Individual Item from Cart - Using /api/carts/clear endpoint
export const removeFromCart = async (productId, token) => {
    try {
        console.log('Removing item from cart:', { productId });
        const response = await apiClient.delete('/api/carts/clear', {
            data: { productId }, 
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Remove from cart response:', response);
        return response;
    } catch (error) {
        console.error('Error in removeFromCart:', error.response?.data || error.message);
        throw error;
    }
};

// Clear Cart (remove all items)
export const clearCart = async (token) => {
    try {
        const response = await apiClient.delete('/api/carts/clear', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        console.error('Error in clearCart:', error.response?.data || error.message);
        throw error;
    }
};

// PAYMENT FUNCTIONS

// FIXED: Create Order function - Updated to match new backend route
export const createOrder = async (orderData, productId, token) => {
    try {
        console.log('Creating order with productId in URL:', productId);
        console.log('Order data being sent:', orderData);
        // FIXED: Add productId to URL to match backend route /:productId
        const response = await apiClient.post(`/api/orders/${productId}`, orderData, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Create order response:', response);
        return response;
    } catch (error) {
        console.error('Error in createOrder:', error.response?.data || error.message);
        throw error;
    }
};

// Initiate Payment function
export const initiatePayment = async (email, orderId, token) => {
    try {
        console.log('Initiating payment:', { email, orderId });
        const response = await apiClient.post('/api/payments/initiate', {
            email,
            orderId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Initiate payment response:', response);
        return response;
    } catch (error) {
        console.error('Error in initiatePayment:', error.response?.data || error.message);
        throw error;
    }
};

export const resetPassword = async (token, password) => {
    const response = await apiClient.put(`/api/auth/reset-password?token=${token}`, {
        password
    }, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response;
};

export const subscribeToNewsletter = async (email, token) => {
    const response = await apiClient.post('/api/newsletter/subscribe',{
        email
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// Search products by category
export const searchProductsByCategory = async (category, token) => {
    try {
        console.log('Searching by category:', category);
        const response = await apiClient.get(`/api/products/search?category=${encodeURIComponent(category)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Category search response:', response);
        return response;
    } catch (error) {
        console.error('Category search error:', error.response?.data || error.message);
        throw error;
    }
};

// Search products by name
export const searchProductsByName = async (name, token) => {
    try {
        console.log('Searching by name:', name);
        const response = await apiClient.get(`/api/products/search?name=${encodeURIComponent(name)}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Name search response:', response);
        return response;
    } catch (error) {
        console.error('Name search error:', error.response?.data || error.message);
        throw error;
    }
};

// Combined search function (can search by either name or category)
export const searchProducts = async (searchParams, token) => {
    let queryString = '';
    if (searchParams.name) {
        queryString = `name=${encodeURIComponent(searchParams.name)}`;
    } else if (searchParams.category) {
        queryString = `category=${encodeURIComponent(searchParams.category)}`;
    }
    
    const response = await apiClient.get(`/api/products/search?${queryString}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// Send Contact Message function
export const sendContactMessage = async (contactData) => {
    try {
        console.log('Sending contact message:', contactData);
        const response = await apiClient.post('/api/contact/send', contactData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log('Contact message response:', response);
        return response;
    } catch (error) {
        console.error('Error in sendContactMessage:', error.response?.data || error.message);
        throw error;
    }
};

export const getAllContactMessages = async (token) => {
    try {
        console.log('Getting all contact messages for admin');
        const response = await apiClient.get('/api/contact/all', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Get all contact messages response:', response);
        return response;
    } catch (error) {
        console.error('Error in getAllContactMessages:', error.response?.data || error.message);
        throw error;
    }
};

// Reply to Contact Message function
export const replyToMessage = async (messageId, replyMessage, token) => {
    try {
        console.log('Replying to message:', { messageId, replyMessage });
        console.log('Making request to:', `${apiClient.defaults.baseURL}/api/contact/reply/${messageId}`);
        
        const requestData = {
            replyMessage: replyMessage.trim() 
        };
        
        console.log('Request data:', requestData);
        
        const response = await apiClient.post(`/api/contact/reply/${messageId}`, requestData, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Reply message response:', response);
        return response;
    } catch (error) {
        console.error('Error in replyToMessage:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        throw error;
    }
};
        // Delete Contact Message function
export const deleteContactMessage = async (messageId, token) => {
    try {
        console.log('Deleting contact message:', messageId);
        const response = await apiClient.delete(`/api/contact/delete/${messageId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('Delete message response:', response);
        return response;
    } catch (error) {
        console.error('Error in deleteContactMessage:', error.response?.data || error.message);
        throw error;
    }
};

export const getUserVisits = async (token) => {
    try {
        console.log('Getting user visits data');
        const response = await apiClient.get('/api/views/count', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        console.log('User visits response:', response);
        return response;
    } catch (error) {
        console.error('Error in getUserVisits:', error.response?.data || error.message);
        throw error;
    }
};

// ENHANCED ORDERS FUNCTIONS - Updated with detailed logging and better error handling

export const getAllOrders = async (token) => {
    try {
        console.log('API: Fetching all orders...');
        console.log('API: Token exists:', !!token);
        
        const response = await apiClient.get('/api/orders', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('API: Get all orders response status:', response.status);
        console.log('API: Orders data:', response.data);
        console.log('API: Number of orders:', response.data?.length);
        
        // Log first order structure for debugging
        if (response.data && response.data.length > 0) {
            console.log('API: First order structure:', response.data[0]);
            console.log('API: First order user:', response.data[0].user);
            console.log('API: First order items:', response.data[0].items);
            console.log('API: First order status:', response.data[0].orderStatus || response.data[0].status);
        }
        
        return response;
    } catch (error) {
        console.error('API: Error fetching orders:', error);
        console.error('API: Error response status:', error.response?.status);
        console.error('API: Error response data:', error.response?.data);
        
        if (error.response?.status === 401) {
            console.error('API: Authentication failed - token may be invalid');
        } else if (error.response?.status === 403) {
            console.error('API: Access forbidden - user may not have admin rights');
        }
        
        throw error;
    }
};

export const updateOrderStatus = async (orderId, status, token) => {
    try {
        console.log('=== UPDATE ORDER STATUS DEBUG ===');
        console.log('API: Updating order status...');
        console.log('API: Order ID:', orderId);
        console.log('API: New status:', status);
        console.log('API: Token exists:', !!token);
        
        // Handle admin token like other functions
        let validToken = token;
        if (token === 'admin-token') {
            try {
                const adminCredentials = {
                    email: localStorage.getItem('userEmail'),
                    password: 'admin123'
                };
                
                const loginResponse = await apiClient.post('/api/auth/login', adminCredentials);
                validToken = loginResponse.data.token;
                localStorage.setItem('token', validToken);
                console.log('API: Got real JWT token for order update');
            } catch (error) {
                console.error('API: Failed to get JWT token:', error);
                throw new Error('Failed to authenticate admin');
            }
        }
        
        const requestData = { status };
        console.log('API: Request data being sent:', requestData);
        console.log('API: Request URL:', `${apiClient.defaults.baseURL}/api/orders/${orderId}/status`);
        console.log('API: Using token:', validToken ? 'Valid token exists' : 'No token');
        
        const response = await apiClient.put(`/api/orders/${orderId}/status`, requestData, {
            headers: {
                'Authorization': `Bearer ${validToken}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('API: Update order status response:', response);
        console.log('API: Response status:', response.status);
        console.log('API: Response data:', response.data);
        console.log('=== END DEBUG ===');
        
        return response;
    } catch (error) {
        console.error('=== UPDATE ORDER ERROR ===');
        console.error('API: Error updating order status:', error);
        console.error('API: Error response status:', error.response?.status);
        console.error('API: Error response data:', error.response?.data);
        console.error('API: Request URL:', error.config?.url);
        console.error('API: Request data:', error.config?.data);
        console.error('=== END ERROR DEBUG ===');
        
        throw error;
    }
};


export const getUserOrders = async (token) => {
    try {
        console.log('Getting user orders...');
        console.log('Token exists:', !!token);
        
        const response = await apiClient.get('/api/orders/my', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Get user orders response:', response);
        console.log('Orders data:', response.data);
        return response;
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        if (error.response?.status === 401) {
            console.error('Authentication failed - token may be invalid');
        }
        
        throw error;
    }
};

export const imageBaseURL = import.meta.env.VITE_IMAGE_BASE_URL;