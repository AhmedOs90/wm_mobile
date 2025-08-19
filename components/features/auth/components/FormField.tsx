import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { FORM_CLASSES } from '../constants/signupConstants';

interface FormFieldProps {
  label: string;
  children: ReactNode;
  error?: string;
  className?: string;
}

export const FormField = ({ label, children, error, className = "" }: FormFieldProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label className={FORM_CLASSES.label}>{label}</Label>
      {children}
      {error && (
        <p className={FORM_CLASSES.error}>{error}</p>
      )}
    </div>
  );
}; 