import { z } from "zod";

// Zod Schemas
export const personalAccountSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  countryId: z.string().min(1, "Country is required"),
  stateId: z.string().min(1, "State is required"),
  cityId: z.string().optional(),
  profilePicture: z.any().optional(),
  cv: z.any().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const careerPreferencesSchema = z.object({
  categoryId: z.string().min(1, "Job category is required"),
  functionalAreaId: z.string().optional(),
  careerLevelId: z.string().optional(), // New field
  jobTypeId: z.string().optional(), // New field
  desiredPosition: z.string().optional(), // New field
  careerLevel: z.string().min(1, "Career level is required"),
  salaryMin: z.string().min(1, "Minimum salary is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Please enter a valid number"),
  salaryMax: z.string().min(1, "Maximum salary is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, "Please enter a valid number"),
  currencyId: z.string().optional(), // New field
  preferredWorkType: z.string().min(1, "Work type is required"),
  skillIds: z.array(z.string()).min(1, "Select at least one skill"),
  otherSkill: z.string().optional(),
  fullTimeExpectedSalary: z.string().optional(),
  partTimeExpectedSalary: z.string().optional(),
  acceptTerms: z.boolean().refine(val => val === true, "You must accept the terms of use"),
}).refine((data) => Number(data.salaryMax) > Number(data.salaryMin), {
  message: "Maximum salary must be greater than minimum salary",
  path: ["salaryMax"],
});

// TypeScript Types
export type PersonalAccountFormData = z.infer<typeof personalAccountSchema>;
export type CareerPreferencesFormData = z.infer<typeof careerPreferencesSchema>;

export interface SignupStep {
  id: number;
  title: string;
  description?: string;
}

export interface WorkTypeOption {
  value: 'Remote' | 'Hybrid' | 'Onsite';
  label: string;
}

export interface SkillOption {
  value: string;
  label: string;
}

export interface RegistrationData {
  body: {
    email: string;
    password: string;
    confirmPassword: string;
    role: 'CANDIDATE';
    firstName: string;
    lastName: string;
    countryId: string;
    stateId?: string; // Optional for profile table
    cityId?: string; // Optional for profile table
    categoryId: string;
    functionalAreaId: string | null;
    // New fields for career info table
    careerLevelId?: string;
    jobTypeId?: string;
    desiredPosition?: string;
    preferredWorkType: 'Remote' | 'Hybrid' | 'Onsite';
    // Enhanced salary range for profile table
    salaryRange: {
      fullTimeExpectedSalary?: number;
      partTimeExpectedSalary?: number;
      minSalary?: string;
      maxSalary?: string;
      currencyId?: string;
    };
    skillIds: string[];
  };
} 