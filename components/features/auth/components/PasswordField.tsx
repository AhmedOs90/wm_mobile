import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FORM_CLASSES } from '../constants/signupConstants';

interface PasswordFieldProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  name?: string;
  register?: any;
  error?: string;
}

export const PasswordField = ({ 
  value, 
  onChange, 
  placeholder = "Enter password", 
  name,
  register,
  error 
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputProps = register ? register(name) : {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => onChange?.(e.target.value),
  };

  return (
    <div className="relative">
      <Input
        {...inputProps}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={`${FORM_CLASSES.input} pr-10`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
      {error && (
        <p className={FORM_CLASSES.error}>{error}</p>
      )}
    </div>
  );
}; 