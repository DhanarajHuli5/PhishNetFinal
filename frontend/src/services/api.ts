import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { storage } from '../utils/storage';
import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001';
const ML_SERVICE_URL = import.meta.env.VITE_ML_SERVICE_URL || 'http://localhost:8000';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: `${BASE_URL}/api/v1`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = storage.getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for token refresh
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = storage.getRefreshToken();
            if (refreshToken) {
              const response = await axios.post(
                `${BASE_URL}/api/v1/users/refresh-access-token`,
                { refreshToken }
              );

              const { accessToken } = response.data.data;
              storage.setAccessToken(accessToken);

              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              return this.api(originalRequest);
            }
          } catch (refreshError) {
            storage.clearTokens();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async register(data: any) {
    const response = await this.api.post('/users/register', data);
    return response.data;
  }

  async login(data: any) {
    const response = await this.api.post('/users/login', data);
    return response.data;
  }

  async logout() {
    try {
      await this.api.post('/users/logout');
    } finally {
      storage.clearTokens();
    }
  }

  async getCurrentUser() {
    const response = await this.api.post('/users/current-user');
    return response.data;
  }

  async refreshAccessToken() {
    const refreshToken = storage.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await this.api.post('/users/refresh-access-token', {
      refreshToken,
    });
    return response.data;
  }

  async changePassword(data: any) {
    const response = await this.api.post('/users/change-password', data);
    return response.data;
  }

  async forgotPassword(data: any) {
    const response = await this.api.post('/users/forgot-password', data);
    return response.data;
  }

  async resetPassword(token: string, data: any) {
    const response = await this.api.post(`/users/reset-password/${token}`, data);
    return response.data;
  }

  async verifyEmail(token: string) {
    const response = await this.api.get(`/users/verify-email/${token}`);
    return response.data;
  }

  async resendEmailVerification() {
    const response = await this.api.post('/users/resend-email-verification');
    return response.data;
  }

  async healthCheck() {
    const response = await this.api.get('/healthcheck');
    return response.data;
  }

  // ML Service endpoints
  async analyzeUrl(url: string) {
    try {
      // Create a direct connection to the ML service
      const response = await axios.post(`${ML_SERVICE_URL}/analyze`, {
        url: url
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error("Error analyzing URL:", error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
