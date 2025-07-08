import axios from 'axios';
import api from './api'; // Your base axios instance

export const registerQueue = async (serviceData) => {
  try {
    const response = await api.post('/queues/register', serviceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to register queue' };
  }
};

export const getServiceTypes = async () => {
  try {
    const response = await api.get('/services/types');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch service types' };
  }
};