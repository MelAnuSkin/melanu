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

// ==================== CART API FUNCTIONS ====================

// Get Cart Items
export const getCartItems = async (token) => {
    const response = await apiClient.get('/api/carts', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// Add Item to Cart
export const addToCart = async (productId, quantity = 1, token) => {
    const response = await apiClient.post('/api/carts/add', {
        productId,
        quantity
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// Update Cart Item Quantity
export const updateCartItem = async (productId, quantity, token) => {
    const response = await apiClient.put('/api/carts/update', {
        productId,
        quantity
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

// Remove Item from Cart
export const removeFromCart = async (productId, token) => {
    const response = await apiClient.delete('/api/carts/remove', {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        data: {
            productId
        }
    });
    return response;
};

// Clear Cart (remove all items)
export const clearCart = async (token) => {
    const response = await apiClient.delete('/api/carts/clear', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response;
};

export const imageBaseURL = import.meta.env.VITE_IMAGE_BASE_URL;