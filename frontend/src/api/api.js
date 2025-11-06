import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = "https://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true // send HttpOnly cookie automatically
});

// normalize responses and handle errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // network or unknown error
      return Promise.reject({ message: error.message });
    }

    // handle 401 Unauthorized (e.g., expired or missing cookie)
    if (error.response.status === 401) {
      toast.error('Session expired, please login again');
      window.location.href = '/login'; // redirect to login page
    }

    // propagate other errors
    return Promise.reject(error);
  }
);

export default api;
