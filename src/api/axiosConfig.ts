// axiosConfig.ts - Axios interceptors for better error handling

import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import type { ApiResponseDTO } from './types/api-response.types';

// Custom error interface
export interface ApiError extends AxiosError {
  response?: AxiosResponse<ApiResponseDTO<null>>;
}

// Create axios instance with base configuration
const apiClient: AxiosInstance = axios.create({
  // baseURL: 'http://localhost:8080/api', // Adjust to your API base URL
  baseURL: 'http://54.169.220.135:5051/api', // Adjust to your API base URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor – no auth token logic
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => config,
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

// Response interceptor – handle common error scenarios
apiClient.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError): Promise<AxiosError> => {
    const status = error.response?.status;
    if (status === 403) {
      console.error('Access forbidden');
    } else if (status && status >= 500) {
      console.error('Server error occurred');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
