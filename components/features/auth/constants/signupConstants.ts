import { SignupStep, WorkTypeOption } from '../types/signupTypes';

// Signup Steps
export const SIGNUP_STEPS: SignupStep[] = [
  { id: 1, title: "Personal & Account", description: "Basic information and account setup" },
  { id: 2, title: "Career Preferences", description: "Job preferences and skills" }
];

// Work Type Options
export const WORK_TYPE_OPTIONS: WorkTypeOption[] = [
  { value: "Remote", label: "Remote" },
  { value: "Hybrid", label: "Hybrid" },
  { value: "Onsite", label: "Onsite" }
];

// Popular Skills (fallback when API fails)
export const POPULAR_SKILLS = [
  "JavaScript", "React", "Python", "Node.js", 
  "SQL", "AWS", "Docker", "Git", "TypeScript", 
  "Vue.js", "Angular", "Java", "C#", "PHP"
];

// Password Generation
export const PASSWORD_CONFIG = {
  length: 12,
  charset: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*"
};

// API Configuration
export const API_CONFIG = {
  staleTime: 10 * 60 * 1000, // 10 minutes
  countriesLimit: 25,
  retryAttempts: 3
};

// Form Field Classes
export const FORM_CLASSES = {
  input: "h-11 bg-white border-input shadow-sm",
  label: "text-sm font-medium",
  error: "text-sm text-destructive",
  button: "h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-lg shadow-sm"
};

// Social Auth Providers
export const SOCIAL_AUTH_PROVIDERS = {
  GOOGLE: 'google',
  LINKEDIN: 'linkedin', 
  FACEBOOK: 'facebook'
} as const;

export type SocialAuthProvider = typeof SOCIAL_AUTH_PROVIDERS[keyof typeof SOCIAL_AUTH_PROVIDERS]; 