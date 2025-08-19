import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  candidatesControllerGetPersonalInfo,
  candidatesControllerUpdatePersonalInfo
} from '@/wm-api/sdk.gen';
import { uploadFile } from '../lib/storageApi';
import { CandidateProfileInfoDto, User, Gender, Country, Profile } from '@/wm-api/types.gen';

// Single, form-compatible profile structure
interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  intro: string;
  summary: string;
  nationality: { id: string; value: string } | null;
  gender: { id: string; value: string } | null;
  dateOfBirth: string;
  residenceCountry: { id: string; value: string } | null;
  state: { id: string; value: string } | null;
  city: { id: string; value: string } | null;
  streetAddress: string;
  profilePicture: File | string | null;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  intro?: string;
  summary?: string;
  nationality?: string;
  gender?: string;
  dateOfBirth?: string;
  residenceCountry?: string;
  state?: string;
  city?: string;
  streetAddress?: string;
  [key: string]: string | undefined;
}

interface UserProfileState {
  // Single source of truth - form-compatible profile data
  profile: UserProfile | null;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
  isFetching: boolean;

  // Form state
  isDirty: boolean;
  errors: FormErrors;

  // User identification
  userId: string | null;
}

interface UserProfileActions {
  // Profile Data Actions
  setProfile: (data: UserProfile) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFetching: (fetching: boolean) => void;

  // Form Management Actions
  updateField: (fieldName: keyof UserProfile, value: string | File | { id: string; value: string } | null) => void;
  setErrors: (errors: FormErrors) => void;
  setDirty: (dirty: boolean) => void;

  // User Actions
  setUserId: (userId: string | null) => void;

  // API Actions
  fetchProfile: (userId?: string) => Promise<void>;
  updateProfile: () => Promise<{ success: boolean; message?: string }>;
  resetForm: () => void;
  validateForm: () => boolean;

  // Utility Actions
  resetStore: () => void;
}

type UserProfileStore = UserProfileState & UserProfileActions;

// Type guards for safe property access
const hasUserProperty = (obj: unknown): obj is { user: User } => {
  return typeof obj === 'object' && obj !== null && 'user' in obj;
};

const hasProfileProperty = (obj: unknown): obj is { profile: Profile } => {
  return typeof obj === 'object' && obj !== null && 'profile' in obj;
};

// Transform API User data to form-compatible UserProfile
const transformApiToProfile = (apiData: User): UserProfile => {
  // Handle both response structures: direct User or {user, profile}
  const userData = hasUserProperty(apiData) ? apiData.user : apiData;
  const profileData = hasProfileProperty(apiData) ? apiData.profile : userData.profile;
  
  const profile: UserProfile = {
    firstName: userData.firstName || '',
    lastName: userData.lastName || '',
    email: userData.email || '',
    phone: profileData?.phone || '',
    intro: profileData?.intro || '',
    summary: profileData?.summary || '',
    nationality: profileData?.nationalityId ? {
      id: profileData.nationalityId,
      value: String(profileData.nationality?.country || profileData.nationality?.nationality || profileData.nationality || 'Unknown')
    } : null,
    gender: profileData?.genderId ? {
      id: profileData.genderId,
      value: String(profileData.gender?.gender || profileData.gender || 'Unknown')
    } : null,
    dateOfBirth: profileData?.dob || '',
    residenceCountry: profileData?.countryId ? {
      id: profileData.countryId,
      value: String(profileData.country?.country || profileData.country || 'Unknown')
    } : null,
    state: profileData?.stateId ? {
      id: profileData.stateId,
      value: String(profileData.state?.state || profileData.state || 'Unknown')
    } : null,
    city: profileData?.cityId ? {
      id: profileData.cityId,
      value: String(profileData.city?.city || profileData.city || 'Unknown')
    } : null,
    streetAddress: profileData?.streetAddress || '',
    profilePicture: profileData?.profileImage || null,
  };
  
  return profile;
};

// Transform UserProfile to API DTO
const transformProfileToApiDto = (profile: UserProfile): CandidateProfileInfoDto => {
  const dto: CandidateProfileInfoDto = {
    generalInfo: {
      firstName: profile.firstName.trim(),
      lastName: profile.lastName.trim(),
      title: 'Professional',
      intro: profile.intro?.trim(),
      summary: profile.summary?.trim()
    },
    personalInfo: {
      ...(profile.nationality?.id && { nationalityId: profile.nationality.id }),
      ...(profile.gender?.id && { genderId: profile.gender.id }),
      dob: profile.dateOfBirth?.trim() || ''
    },
    locationInfo: {
      ...(profile.residenceCountry?.id && { countryId: profile.residenceCountry.id }),
      ...(profile.state?.id && { stateId: profile.state.id }),
      ...(profile.city?.id && { cityId: profile.city.id }),
      ...(profile.streetAddress && { streetAddress: profile.streetAddress.trim() })
    },
    contactInfo: {
      phone: profile.phone?.trim()
    }
  };

  return dto;
};

// Initial state
const initialState: UserProfileState = {
  profile: null,
  isLoading: false,
  isError: false,
  error: null,
  isFetching: false,
  isDirty: false,
  errors: {},
  userId: null,
};

export const useUserProfileStore = create<UserProfileStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Profile Data Actions
      setProfile: (data: UserProfile) => {
        set({ profile: data }, false, 'setProfile');
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading }, false, 'setLoading');
      },

      setError: (error: string | null) => {
        set({ error, isError: !!error }, false, 'setError');
      },

      setFetching: (fetching: boolean) => {
        set({ isFetching: fetching }, false, 'setFetching');
      },

      // Form Management Actions
      updateField: (fieldName: keyof UserProfile, value: string | File | { id: string; value: string } | null) => {
        set(
          (state) => {
            if (!state.profile) return state;

            const updatedProfile = {
              ...state.profile,
              [fieldName]: value
            };

            return {
              profile: updatedProfile,
              isDirty: true,
              // Clear field-specific error when user starts typing
              errors: state.errors[fieldName as keyof FormErrors] ? {
                ...state.errors,
                [fieldName]: undefined
              } : state.errors
            };
          },
          false,
          'updateField'
        );
      },

      setErrors: (errors: FormErrors) => {
        set({ errors }, false, 'setErrors');
      },

      setDirty: (dirty: boolean) => {
        set({ isDirty: dirty }, false, 'setDirty');
      },

      // User Actions
      setUserId: (userId: string | null) => {
        set({ userId }, false, 'setUserId');
      },

      // API Actions
      fetchProfile: async (userId?: string) => {
        const { setLoading, setError, setProfile, setFetching, userId: currentUserId } = get();
        const targetUserId = userId || currentUserId;

        if (!targetUserId) {
          setError('No user ID provided');
          return;
        }

        try {
          setLoading(true);
          setFetching(true);
          setError(null);

          const response = await candidatesControllerGetPersonalInfo();
          
          // Check if API response is valid
          if (!response.data?.data) {
            console.error('API Error Response:', response);
            setError('Failed to fetch user profile');
            return;
          }

          // Transform API data to form-compatible profile
          const profile = transformApiToProfile(response.data.data);
          setProfile(profile);

        } catch (error: unknown) {
          console.error('fetchProfile: Error fetching profile:', error);
          setError('Failed to fetch user profile');
        } finally {
          setLoading(false);
          setFetching(false);
        }
      },

      updateProfile: async (): Promise<{ success: boolean; message?: string }> => {
        const { setError, setDirty, setErrors, setProfile, userId, profile } = get();

        if (!userId) {
          setError('No user ID available for update');
          return { success: false, message: 'No user ID available for update' };
        }

        if (!profile) {
          setError('No profile data to update');
          return { success: false, message: 'No profile data to update' };
        }

        try {
          setError(null);

          // Validate required fields before sending
          if (!profile.firstName?.trim()) {
            throw new Error('First name is required');
          }
          if (!profile.lastName?.trim()) {
            throw new Error('Last name is required');
          }
          if (!profile.dateOfBirth?.trim()) {
            throw new Error('Date of birth is required');
          }

        
          
          let updatePayload = transformProfileToApiDto(profile)
         
          
          if (profile.profilePicture &&
                typeof profile.profilePicture === 'object' &&
                'uri' in profile.profilePicture) {
            try {
          const relativePath = await uploadFile(
            profile.profilePicture as { uri: string; name: string; type: string },
            'profile-images'
          );
          updatePayload.profileImage = relativePath;
        } catch (uploadError) {
          console.error('Failed to upload profile picture:', uploadError);
          throw new Error('Failed to upload profile picture');
        }
      }
  
          const response = await candidatesControllerUpdatePersonalInfo({
            body: updatePayload
          });

         
          if (!response.data?.data) {
            console.error('API Error Response:', response);
            setError('Failed to update profile');
            return { success: false, message: 'Failed to update profile' };
          }

    
          const updatedProfile = transformApiToProfile(response.data.data);
          setProfile(updatedProfile);
          
          setDirty(false);
          setErrors({});
          return { success: true, message: 'Profile updated successfully' };

        } catch (error: unknown) {
          console.error('updateProfile: Error updating profile:', error);
          setError('Failed to update profile');
          return { success: false, message: 'Failed to update profile' };
        }
      },

      resetForm: () => {
        set({
          errors: {},
          isDirty: false
        }, false, 'resetForm');
      },

      validateForm: () => {
        const { profile, setErrors } = get();

        if (!profile) return false;

        const newErrors: FormErrors = {};

        // Add validation rules for each field
        if (!profile.firstName?.trim()) {
          newErrors.firstName = 'First name is required';
        }

        if (!profile.lastName?.trim()) {
          newErrors.lastName = 'Last name is required';
        }

        if (!profile.email?.trim()) {
          newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
          newErrors.email = 'Email format is invalid';
        }

        if (!profile.phone?.trim()) {
          newErrors.phone = 'Phone number is required';
        }

        if (profile.intro && profile.intro.length > 500) {
          newErrors.intro = 'Intro must be less than 500 characters';
        }

        if (profile.summary && profile.summary.length > 1000) {
          newErrors.summary = 'Summary must be less than 1000 characters';
        }

        if (!profile.dateOfBirth?.trim()) {
          newErrors.dateOfBirth = 'Date of birth is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      },

      // Utility Actions
      resetStore: () => {
        set(initialState, false, 'resetStore');
      },
    }),
    {
      name: 'user-profile-store',
    }
  )
);

// Simplified hook exports - single source of truth
export const useProfile = () => useUserProfileStore((state) => state.profile);
export const useIsLoading = () => useUserProfileStore((state) => state.isLoading);
export const useIsError = () => useUserProfileStore((state) => state.isError);
export const useProfileError = () => useUserProfileStore((state) => state.error);
export const useIsFetching = () => useUserProfileStore((state) => state.isFetching);

export const useFormErrors = () => useUserProfileStore((state) => state.errors);
export const useIsDirty = () => useUserProfileStore((state) => state.isDirty);

export const useUpdateField = () => useUserProfileStore((state) => state.updateField);
export const useResetForm = () => useUserProfileStore((state) => state.resetForm);
export const useValidateForm = () => useUserProfileStore((state) => state.validateForm);
export const useUpdateProfile = () => useUserProfileStore((state) => state.updateProfile);

export const useFetchProfile = () => useUserProfileStore((state) => state.fetchProfile);
export const useSetUserId = () => useUserProfileStore((state) => state.setUserId);
export const useResetStore = () => useUserProfileStore((state) => state.resetStore);

// React Query hooks for profile management
export const useProfileQuery = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const response = await candidatesControllerGetPersonalInfo();
      
      if (!response.data?.data) {
        throw new Error('Failed to fetch user profile');
      }
      
      return transformApiToProfile(response.data.data);
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

export const useProfileMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (profileData: UserProfile) => {
      // Validate required fields
      if (!profileData.firstName?.trim()) {
        throw new Error('First name is required');
      }
      if (!profileData.lastName?.trim()) {
        throw new Error('Last name is required');
      }
      if (!profileData.dateOfBirth?.trim()) {
        throw new Error('Date of birth is required');
      }
      
      let updatePayload = transformProfileToApiDto(profileData);
      
      // Handle profile picture upload
      if (profileData.profilePicture &&
  typeof profileData.profilePicture === 'object' &&
  'uri' in profileData.profilePicture) {
        try {
          const relativePath = await uploadFile(
            profileData.profilePicture as { uri: string; name: string; type: string },
            'profile-images'
          );
          updatePayload.profileImage = relativePath;
        } catch (uploadError) {
          throw new Error('Failed to upload profile picture');
        }
      }
      
      const response = await candidatesControllerUpdatePersonalInfo({
        body: updatePayload
      });
      
      if (!response.data?.data) {
        throw new Error('Failed to update profile');
      }
      
      return transformApiToProfile(response.data.data);
    },
    onSuccess: () => {
      // Refetch the profile to ensure UI is in sync
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
};

// Export types for components
export type { UserProfile, FormErrors };
