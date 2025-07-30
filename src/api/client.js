import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL
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

// Add Item to Cart
export const addToCart = async (productId, quantity = 1, token) => {
    try {
        console.log('Adding to cart:', { productId, quantity });
        const response = await apiClient.post('/api/carts/add', {
            productId,
            quantity
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Add to cart response:', response);
        return response;
    } catch (error) {
        console.error('Error in addToCart:', error.response?.data || error.message);
        throw error;
    }
};

// Update Cart Item Quantity
export const updateCartItem = async (productId, quantity, token) => {
    try {
        console.log('Updating cart item:', { productId, quantity });
        const response = await apiClient.put('/api/carts/update', {
            productId,
            quantity
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        console.log('Update cart item response:', response);
        return response;
    } catch (error) {
        console.error('Error in updateCartItem:', error.response?.data || error.message);
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
    const response = await apiClient.get(`/api/products/search?category=${encodeURIComponent(category)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// Search products by name
export const searchProductsByName = async (name, token) => {
    const response = await apiClient.get(`/api/products/search?name=${encodeURIComponent(name)}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
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

export const imageBaseURL = import.meta.env.VITE_IMAGE_BASE_URL;