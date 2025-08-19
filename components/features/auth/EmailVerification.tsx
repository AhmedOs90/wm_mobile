import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import AuthLayout from "./AuthLayout";
import {
  authControllerActivate,
  cvsControllerCreate,
  candidatesControllerUpdatePersonalInfo,
} from "../../../../wm-api/sdk.gen";
import { useToast } from "@/hooks/use-toast";
import { useAuthContext } from "@/contexts/AuthContext";

interface AuthActivateSuccessResponse {
  data: {
    data: {
      access_token: string;
      user: any;
    };
  };
  error?: {
    error: string;
    message: string;
    statusCode: number;
  };
}

const EmailVerification = () => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const { setAuth } = useAuthContext();

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = useParams();
  const { toast } = useToast();

  const tokenFromQuery = searchParams.get("token");
  const tokenFromPath = params.token;
  const token = tokenFromQuery || tokenFromPath;

  const userId = searchParams.get("userId");

  useEffect(() => {
    if (token) {
      setIsOtpMode(false);
      handleVerificationSubmit(token, "TOKEN");
    } else {
      setIsOtpMode(true);
      if (!userId) {
        setError(
          "Missing User ID. Please ensure you have a valid verification link or User ID."
        );
        toast({
          title: "Error",
          description: "Missing User ID for OTP verification.",
          variant: "destructive",
        });
      }
    }
  }, [token, userId]);

  const handleVerificationSubmit = async (
    value: string,
    method: "TOKEN" | "OTP"
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      let body: {
        token?: string;
        otp?: string;
        userId?: string;
        method: "TOKEN" | "OTP";
      };

      if (method === "TOKEN") {
        body = {
          token: value,
          method: "TOKEN",
        };
      } else {
        if (!userId) {
          throw new Error("User ID is required for OTP verification.");
        }
        body = {
          otp: value,
          userId: userId,
          method: "OTP",
        };
      }

      const response = (await authControllerActivate({
        body,
      })) as AuthActivateSuccessResponse;
      console.log(response);
      if (response.error) {
        const errorMessage: any =
          response.error.error || "Failed: Something went wrong!";
        setError(errorMessage);
        toast({
          title: "Verification Failed",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      const { access_token, user } = response.data.data;

      if (access_token && user) {
        setAuth(user, access_token);

        const cvFile = searchParams.get("cv");
        if (cvFile) {
          try {
            const cv = await cvsControllerCreate({
              body: {
                file: cvFile,
                name: cvFile.split("/").pop()?.split(".")[0] || "CV",
              },
            });

            if (cv) {
              await candidatesControllerUpdatePersonalInfo({
                body: {
                  approved: true,
                },
              });
            }
          } catch (e) {
            console.error("Failed to create CV:", e);
            toast({
              title: "Warning",
              description: "Email verified but failed to save CV.",
              variant: "destructive",
            });
          }
        }

        toast({
          title: "Success",
          description: "Email verified successfully!",
        });
        navigate("/signup-success");
      } else {
        throw new Error(
          "Verification successful, but no authentication data received."
        );
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Failed to verify email";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
  };

  const handleOtpSubmit = () => {
    if (code.length === 6) {
      handleVerificationSubmit(code, "OTP");
    } else {
      toast({
        title: "Error",
        description: "Please enter a 6-digit code.",
        variant: "destructive",
      });
    }
  };

  const handleResendCode = () => {
    console.log("Resending verification code...");
  };

  if (isLoading) {
    return (
      <AuthLayout>
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-lg text-foreground">
              {isOtpMode ? "Verifying OTP..." : "Verifying your email..."}
            </h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (error) {
    return (
      <AuthLayout>
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-lg text-foreground text-red-600">
              Verification Failed
            </h1>
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full h-12 bg-primary hover:bg-primary/90"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (isOtpMode) {
    return (
      <AuthLayout>
        <div className="space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-lg text-foreground">
              An email was sent to you with the confirmation code
            </h1>
            <p className="text-lg text-foreground">please enter it here :</p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center">
              <InputOTP value={code} onChange={handleCodeChange} maxLength={6}>
                <InputOTPGroup>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="h-12 w-12 bg-muted border-border text-lg"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full h-12 bg-primary hover:bg-primary/90"
              onClick={handleOtpSubmit}
              disabled={code.length < 6}
            >
              Confirm & Sign up
            </Button>

            <button
              onClick={handleResendCode}
              className="text-primary hover:text-primary/80 text-sm underline"
            >
              Resend Code
            </button>
          </div>

          <div className="text-center">
            <span className="text-muted-foreground">
              I already have an account{" "}
            </span>
            <a
              href="/login"
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Log in ?
            </a>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return null;
};

export default EmailVerification;
