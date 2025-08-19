import { createClient } from '../wm-api/client';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '@env'; // <-- from .env

export const apiClient = createClient({
  baseUrl: API_BASE_URL || 'https://staging-api.wazifame.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (request) => {
  const token = await SecureStore.getItemAsync('auth_token');
  if (token) {
    request.headers.set('Authorization', token);
  }
  return request;
});

apiClient.interceptors.response.use(async (response) => {
  if (!response.ok && (response.status === 401 || response.status === 403)) {
    console.warn('Auth error, clearing session.');
    await SecureStore.deleteItemAsync('auth_token');
    await SecureStore.deleteItemAsync('user_data');
    // redirect via global store or navigation if needed
  }

  if (!response.ok && response.status >= 500) {
    console.error('Server error:', response.status);
  }

  return response;
});

export default apiClient;
