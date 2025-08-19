import { authControllerLogin, authControllerGoogleAuth, authControllerGoogleAuthRedirect } from "@/wm-api/sdk.gen";
import type { LoginResponseDto } from "@/wm-api/types.gen.ts";
import type { LoginDto } from "@/wm-api/types.gen.ts";
import { authStorage } from "@/lib/authStorage";



export const authApi = {
    async login(credentials: LoginDto): Promise<LoginResponseDto> {
        try {
            const response = await authControllerLogin({body: credentials});
            if (!response.data?.data) {
                throw new Error(response?.error?.error);
            }
            return response.data.data;
        } catch(err: any) {
            console.error("Login Failed:", err);
            
            // Extract error message from API response
            let errorMessage = 'Authentication failed. Please check your credentials.';
            
            if (err?.data?.error) {
                // API error response with error field
                errorMessage = err.data.error;
            } else if (err?.message) {
                // Network or other error
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            
            throw new Error(errorMessage);
        }
    },

    async logout(): Promise<void> {
        await authStorage.clear();
// window.location.href = '/login';
    },

    initiateGoogleAuth(userType: string = 'CANDIDATE', authType: string = 'login'): void {
        try {
          
            const apiUrl = 'https://api.wazifame.com'; 
            
            
            window.location.href = `${apiUrl}/auth/google?userType=${encodeURIComponent(userType)}&type=${encodeURIComponent(authType)}`;
        } catch (err) {
            console.error("Google Auth Initiation Failed:", err);
            throw new Error('Failed to initiate Google authentication');
        }
    },

    async handleGoogleAuthRedirect(): Promise<any> {
        try {
            const response = await authControllerGoogleAuthRedirect({});
            return response;
        } catch (err: any) {
            console.error("Google Auth Redirect Failed:", err);
            
            // Extract error message from API response
            let errorMessage = 'Google authentication failed';
            
            if (err?.data?.error) {
                errorMessage = err.data.error;
            } else if (err?.message) {
                errorMessage = err.message;
            } else if (typeof err === 'string') {
                errorMessage = err;
            }
            
            throw new Error(errorMessage);
        }
    }
}