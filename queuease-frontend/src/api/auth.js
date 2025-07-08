import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Enhanced register function
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'user' // default role if not provided
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      throw new Error(error.response.data.message || error.response.data.error || 'Registration failed');
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error('No response from server. Check your network connection.');
    } else {
      // Something happened in setting up the request
      throw new Error('Error setting up registration request.');
    }
  }
};

// Enhanced login function
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: credentials.email,
      password: credentials.password
    });
    
    if (response.data.token) {
      // Store token in localStorage
      localStorage.setItem('token', response.data.token);
      // You might want to store user data in context/state
    }
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else {
      throw new Error('Network error. Please try again.');
    }
  }
};