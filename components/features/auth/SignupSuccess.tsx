import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthLayout from "./AuthLayout";

const SignupSuccess = () => {
  const [showAnimation, setShowAnimation] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setShowAnimation(true), 300);
  }, []);

  const handleShowJobs = () => {
    navigate("/jobs");
  };

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <AuthLayout>
      <div className="space-y-8 text-center">
        <div className="flex justify-center">
          <div className="relative">
            {/* Main success circle */}
            <div
              className={`w-24 h-24 bg-primary rounded-full flex items-center justify-center transition-all duration-500 ${
                showAnimation ? "scale-100 opacity-100" : "scale-50 opacity-0"
              }`}
            >
              <Check className="w-12 h-12 text-primary-foreground" strokeWidth={3} />
            </div>
            
            {/* Animated dots around the circle */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-primary/40 rounded-full transition-all duration-700 delay-${i * 100} ${
                  showAnimation ? "scale-100 opacity-100" : "scale-0 opacity-0"
                }`}
                style={{
                  top: `${50 + 40 * Math.sin((i * Math.PI) / 4)}%`,
                  left: `${50 + 40 * Math.cos((i * Math.PI) / 4)}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h1 className="text-xl text-foreground leading-relaxed">
            Account created successfully! Welcome to WazifaMe, your new career starts HERE!
          </h1>

          <div className="space-y-4">
            <Button
              onClick={handleShowJobs}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
            >
              Show me jobs
            </Button>

            <Button
              onClick={handleGoHome}
              variant="outline"
              className="w-full h-12 bg-muted border-primary text-primary hover:bg-primary/10"
            >
              Go to Home
            </Button>
          </div>
        </div>

        <div className="text-center">
          <span className="text-muted-foreground">I already have an account </span>
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
};

export default SignupSuccess;
