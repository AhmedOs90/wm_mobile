// hooks/useAuthGuard.ts

import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native'; // ✅ correct
import { useAuthContext } from '../contexts/AuthContext';
import { authStorage } from '../lib/authStorage';
import { decode as atob } from 'base-64'; // for decoding base64 JWT payload

export const useAuthGuard = () => {
  const navigation = useNavigation<any>();
  const { isAuthenticated, isInitialized } = useAuthContext();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isInitialized) return;

      const token = await authStorage.getToken();

      if (!isAuthenticated || !token) {
        await authStorage.clear();
        navigation.replace('Login');
        return;
      }

      try {
        if (token.includes('.')) {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Math.floor(Date.now() / 1000);

          if (payload.exp && payload.exp < currentTime) {
            await authStorage.clear();
            navigation.replace('Login');
          }
        }
      } catch (error) {
        console.warn('Token parsing failed:', error);
        await authStorage.clear();
        navigation.replace('Login');
      }
    };

    checkAuth();
  }, [isAuthenticated, isInitialized]);

  return { isAuthenticated, isInitialized };
};
