import axios from 'axios';
import config from './config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
const apiService = {
  // Products
  getProducts: () => api.get(config.API_ENDPOINTS.PRODUCTS),
  getProduct: (id) => api.get(`${config.API_ENDPOINTS.PRODUCTS}/${id}`),
  addProduct: (product) => api.post(config.API_ENDPOINTS.PRODUCTS, product),
  updateProduct: (id, product) => api.put(`${config.API_ENDPOINTS.PRODUCTS}/${id}`, product),
  deleteProduct: (id) => api.delete(`${config.API_ENDPOINTS.PRODUCTS}/${id}`),
  
  // Addresses
  getAddresses: () => api.get(config.API_ENDPOINTS.ADDRESSES),
  addAddress: (address) => api.post(config.API_ENDPOINTS.ADDRESSES, address),
  updateAddress: (id, address) => api.put(`${config.API_ENDPOINTS.ADDRESSES}/${id}`, address),
  deleteAddress: (id) => api.delete(`${config.API_ENDPOINTS.ADDRESSES}/${id}`),
  
  // Credit Cards
  getCards: () => api.get(config.API_ENDPOINTS.CARDS),
  addCard: (card) => api.post(config.API_ENDPOINTS.CARDS, card),
  updateCard: (id, card) => api.put(`${config.API_ENDPOINTS.CARDS}/${id}`, card),
  deleteCard: (id) => api.delete(`${config.API_ENDPOINTS.CARDS}/${id}`),
  
  // Orders
  checkout: (orderData) => api.post(config.API_ENDPOINTS.CHECKOUT, orderData),
  
  // Error handling helper
  handleError: (error) => {
    console.error('API Error:', error);
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      errorMessage = error.response.data.message || `Error: ${error.response.status}`;
    } else if (error.request) {
      // Request was made but no response was received
      errorMessage = 'No response from server. Please check your connection.';
    }
    
    return Promise.reject(errorMessage);
  }
};

// Add response interceptor for global error handling
api.interceptors.response.use(
  response => response,
  error => {
    return apiService.handleError(error);
  }
);

// Add a development mode fallback (for when backend is unavailable)
if (config.DEV_MODE) {
  // Fallback data for development
  const mockData = {
    products: [
      {
        productid: 1,
        name: 'Running Shoes',
        price: 79.99,
        category: 'Footwear',
        description: 'Comfortable running shoes with cushioned sole for maximum support.',
        brand: 'SportyFit',
        size: '42',
        stock: 25,
      },
      {
        productid: 2,
        name: 'Wireless Headphones',
        price: 129.99,
        category: 'Electronics',
        description: 'Noise-cancelling wireless headphones with 20 hours of battery life.',
        brand: 'SoundTech',
        size: 'One Size',
        stock: 15,
      },
      {
        productid: 3,
        name: 'Cotton T-Shirt',
        price: 19.99,
        category: 'Clothing',
        description: 'Soft cotton t-shirt available in multiple colors.',
        brand: 'ComfortWear',
        size: 'M',
        stock: 50,
      }
    ],
    addresses: [
      {
        addressid: 1,
        street_1: '123 Main St',
        street_2: 'Apt 4B',
        city: 'Springfield',
        state: 'IL',
        zip: '62704',
        country: 'USA'
      }
    ],
    cards: [
      {
        card_number: '4111111111111111',
        cardholder_name: 'John Doe',
        expiry_date: '05/25',
        cvv: '123',
        addressid: 1
      }
    ]
  };

  // Add fallback for failed requests
  api.interceptors.response.use(
    response => response,
    error => {
      console.warn('API request failed, using mock data fallback', error);
      
      const { config } = error;
      const { url, method } = config;
      
      // Match failed requests to mock data
      if (method === 'get') {
        // Get Products
        if (url === config.API_ENDPOINTS.PRODUCTS) {
          return Promise.resolve({ data: mockData.products });
        }
        
        // Get Product by ID
        if (url.startsWith(`${config.API_ENDPOINTS.PRODUCTS}/`)) {
          const id = parseInt(url.split('/').pop());
          const product = mockData.products.find(p => p.productid === id);
          
          if (product) {
            return Promise.resolve({ data: product });
          }
        }
        
        // Get Addresses
        if (url === config.API_ENDPOINTS.ADDRESSES) {
          return Promise.resolve({ data: mockData.addresses });
        }
        
        // Get Cards
        if (url === config.API_ENDPOINTS.CARDS) {
          return Promise.resolve({ data: mockData.cards });
        }
      }
      
      // For other requests, still reject with error
      return Promise.reject(error);
    }
  );
}

export default apiService;