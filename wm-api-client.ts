import { CreateClientConfig } from "../wm-api/client.gen";
import { authStorage } from "./lib/authStorage";

export const createClientConfig: CreateClientConfig = (config) => ({
  ...config,
  baseUrl: import.meta.env.VITE_PUBLIC_API || 'http://localhost:3011',
  cache: "no-store",
  headers: {
    'Content-Type': 'application/json',
    ...config?.headers,
  },
  auth: async (auth) => {
    // Return the raw token without any prefix
    // The auth.ts file will add the Bearer prefix
    return authStorage.getToken() || "";
  },
  // Remove the beforeRequest function as it's conflicting with the auth function
  // beforeRequest: async (request) => {
  //   return request;
  // },

  afterRequest: async (response) => {
    // Handle authentication and authorization errors
    if (response.status === 401 || response.status === 403) {
      console.warn('Authentication error in API response, clearing auth data');
      
      // Clear authentication data
      authStorage.clear();
      
      // Prevent infinite redirect loops
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/signup' && !currentPath.startsWith('/auth')) {
        window.location.href = "/login";
      }
    }
    
    return response;
  }
});
