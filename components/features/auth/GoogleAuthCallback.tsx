import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { authControllerGetProfile } from '@sdk.gen.ts';
import { authStorage } from '@/lib/authStorage';

const GoogleAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthContext();
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const token = searchParams.get('token');
        if (!token) {
          throw new Error('Missing authentication token');
        }
        authStorage.setToken(token);
        const response = await authControllerGetProfile();
        const user = response?.data?.data;
        if (!user) {
          throw new Error('Failed to fetch user profile');
        }
        setAuth(user, token);
        navigate('/');
      } catch (err: any) {
        console.error('Google auth callback error:', err);
        setError(err.message || 'Authentication failed');
        timeoutRef.current = setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };
    handleCallback();
  }, [searchParams, navigate, setAuth]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl border border-red-200 p-8 shadow-sm max-w-md w-full text-center">
          <h1 className="text-xl font-semibold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <p className="text-sm text-gray-500">Redirecting to login page...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white rounded-xl border border-input p-8 shadow-sm max-w-md w-full text-center">
        <h1 className="text-xl font-semibold text-foreground mb-4">Completing Authentication</h1>
        <p className="text-muted-foreground">Please wait while we complete your sign-in...</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;