import * as SecureStore from 'expo-secure-store';
import type { User } from '../wm-api/types.gen';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const authStorage = {
  setToken: async (token: string) => {
    if (!token) return;
    const cleanToken = token.startsWith('Bearer ') ? token.substring(7) : token;
    await SecureStore.setItemAsync(TOKEN_KEY, cleanToken);
  },

  getToken: async (): Promise<string | null> => {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  },

  setUser: async (user: User) => {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
  },

  getUser: async (): Promise<User | null> => {
    const userData = await SecureStore.getItemAsync(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  clear: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
  },
};
