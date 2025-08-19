import { useAuthContext } from '@/contexts/AuthContext';
import { User, LoginDto } from '../wm-api/types.gen';
import * as AuthSession from 'expo-auth-session';

interface UseAuthReturn {
  user: User | null;
  userId: string | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const { user, isAuthenticated, logout, login, isLoading } = useAuthContext();
  const userId = user?.id;
  
  // const loginWithGoogle = () => {
  //   try {
     
  //     const apiUrl = import.meta.env.VITE_PUBLIC_API || 'http://localhost:3011';
      
      
  //     const redirectUrl = `${window.location.origin}/auth/google/callback`;
      
     
  //     const googleAuthUrl = `${apiUrl}/auth/google`;
  //     const params = new URLSearchParams({
  //       userType: 'CANDIDATE',
  //       type: 'login',
  //       redirectUrl: redirectUrl
  //     });
      
     
  //     window.location.href = `${googleAuthUrl}?${params.toString()}`;
  //   } catch (error) {
  //     console.error('Error initiating Google login:', error);
  //     throw new Error('Failed to initiate Google login');
  //   }
  // };


const loginWithGoogle = async () => {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API ?? 'http://localhost:3011';

    const redirectUri = AuthSession.makeRedirectUri({
      native: 'your.app://redirect', // use your custom scheme or leave default for Expo Go
    });

    const params = new URLSearchParams({
      userType: 'CANDIDATE',
      type: 'login',
      redirectUrl: redirectUri,
    });

    const authUrl = `${apiUrl}/auth/google?${params.toString()}`;

    const authRequest = new AuthSession.AuthRequest({
      clientId: 'YOUR_CLIENT_ID', // Replace with your Google client ID
      redirectUri,
      scopes: ['profile', 'email'], // Add required scopes
    });

    const discovery = {
      authorizationEndpoint: `${apiUrl}/auth/google`,
    };

    const result = await authRequest.promptAsync(discovery);

    if (result.type === 'success' && result.url) {
      // ⬇️ This is where you either:
      // 1. parse `result.url` for token info, or
      // 2. complete login via your backend (recommended)
      // e.g., extract `code` and call your API to exchange code for token

      // Example (if using authorization code flow):
      // const token = await authApi.exchangeGoogleCode(result.params.code)
      // await setAuth(token.user, token.access_token);
    } else {
      console.warn('Google login cancelled or failed');
    }
  } catch (err) {
    console.error('Google login failed:', err);
  }
};


  return {
    user,
    userId,
    isAuthenticated,
    isLoading,
    login,
    logout,
    loginWithGoogle
  };
};