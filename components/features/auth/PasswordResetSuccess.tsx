import AuthLayout from "./AuthLayout";

const PasswordResetSuccess = () => {
  return (
    <AuthLayout>
      <div className="space-y-6 text-center">
        <h1 className="text-2xl font-semibold text-foreground">
          Reset Link Sent!
        </h1>
        <p className="text-muted-foreground">
          Please check your email. We’ve sent a password reset link to your
          inbox.
        </p>
      </div>
    </AuthLayout>
  );
};

export default PasswordResetSuccess;
