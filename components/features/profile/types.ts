/** Import these types from @types.gen.ts */
export interface Profile {
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  avatar: string;
  website?: string;
  linkedin?: string;
  github?: string;
  nationality?: string;
  gender?: 'male' | 'female';
  dateOfBirth?: string;
  residenceCountry?: string;
  state?: string;
  city?: string;
  streetAddress?: string;
}

export interface Experience {
  id: string | number;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string | number;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

export interface Certification {
  id: string | number;
  name: string;
  issuer: string;
  date: string;
  credentialId: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Document {
  id: string | number;
  name: string;
  lastUpdated: string;
  size: string;
  type: 'resume' | 'cover-letter' | 'certificate' | 'other';
}

export interface QuickStats {
  applications: number;
  skills: number;
  education: number;
  experience: number;
} 