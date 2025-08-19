import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { PasswordField } from "./components/PasswordField";
import { authControllerResetPassword } from "@sdk.gen.ts";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Password must be at least 8 characters"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useParams();
  console.log("Reset token:", token);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: ResetPasswordFormData) => {
      if (!token) {
        throw new Error('Reset token is missing');
      }
      
      const response = await authControllerResetPassword({
        body: { 
          token,
          password: data.password,
          confirmPassword: data.confirmPassword
        },
        throwOnError: true, 
      });
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Password reset successful",
        description: "You can now log in with your new password",
        variant: "default",
      });
      navigate('/login');
    },
    onError: (error: any) => {
      console.error("Error during password reset:", error.error);
      const msg = error.error || "An unexpected error occurred";

      toast({
        title: msg,
        variant: "destructive",
      });
    },
  });

  if (!token) {
    return (
      <AuthLayout>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold text-foreground">
            Invalid Reset Link
          </h1>
          <p className="text-muted-foreground">
            This password reset link is invalid or has expired.
          </p>
          <Button 
            onClick={() => navigate('/forgot-password')}
            variant="outline"
          >
            Request New Reset Link
          </Button>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Set New Password
          </h1>
          <p className="text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <label className="text-sm font-medium">
              New Password
            </label>
            <PasswordField
              placeholder="Enter new password"
              register={register}
              name="password"
              error={errors.password?.message}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Confirm New Password
            </label>
            <PasswordField
              placeholder="Confirm new password"
              register={register}
              name="confirmPassword"
              error={errors.confirmPassword?.message}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-11"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;