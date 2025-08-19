import { Button } from "@/components/ui/button";
import { GoogleIcon } from "@/components/ui/icons";
import { authApi } from "@/services/authApi";

interface GoogleLoginButtonProps {
  className?: string;
}

const GoogleLoginButton = ({ className }: GoogleLoginButtonProps) => {
  const handleGoogleLogin = () => {
    try {
      authApi.initiateGoogleAuth();
    } catch(err) {
      console.error("Failed to initiate Google login: ", err.message ?? err);
    }
  };

  return (
    <Button
      onClick={handleGoogleLogin}
      variant="outline"
      className={`w-full h-11 bg-white border-input shadow-sm hover:bg-muted/50 ${className}`}
    >
      <GoogleIcon className="w-5 h-5 mr-2" />
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;