import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AuthLayout from "./AuthLayout";
import { authControllerForgetPassword } from "@sdk.gen.ts";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

const ForgetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const mutation = useMutation({
    mutationFn: async (data: ForgotFormData) => {
      const response = await authControllerForgetPassword({
        body: { email: data.email },
        throwOnError: true,
      });
      return response;
    },
    onSuccess: () => {
      reset();
      navigate("/password-reset/success");
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

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-foreground">
            Forgot your password?
          </h1>
          <p className="text-muted-foreground">
            Enter your email and we’ll send you a reset link.
          </p>
        </div>

        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              {...register("email")}
              disabled={mutation.isPending}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;
