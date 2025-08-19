import { useState, useEffect, useRef, useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import { PersonalAccountFormData } from '../types/signupTypes';
import { FormField } from './FormField';
import { PasswordField } from './PasswordField';
import { CountrySelect, StateSelect, CitySelect } from '@/components/dropdowns';
import { FORM_CLASSES } from '../constants/signupConstants';

interface PersonalAccountFormProps {
  form: UseFormReturn<PersonalAccountFormData>;
  onSubmit: (data: PersonalAccountFormData) => void;
  onGeneratePassword: () => void;
}

export const PersonalAccountForm = ({
  form,
  onSubmit,
  onGeneratePassword,
}: PersonalAccountFormProps) => {
  // Watch all location fields together to minimize re-renders
  const [countryId, stateId, cityId] = form.watch(["countryId", "stateId", "cityId"]);
  
  // CV upload state
  const [selectedCV, setSelectedCV] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);


  const handleCountryChange = useCallback((value: string) => {
    const currentCountryId = form.getValues("countryId");
    form.setValue("countryId", value);
    
    // Only reset dependent fields if country actually changed
    if (currentCountryId !== value) {
      form.setValue("stateId", "");
      form.setValue("cityId", "");
    }
  }, [form]);

  const handleStateChange = useCallback((value: string) => {
    const currentStateId = form.getValues("stateId");
    form.setValue("stateId", value);
    
    // Only reset dependent fields if state actually changed
    if (currentStateId !== value) {
      form.setValue("cityId", "");
    }
  }, [form]);

  const handleCityChange = useCallback((value: string) => {
    form.setValue("cityId", value);
  }, [form]);

  // File upload handlers
  const handleCVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a PDF, DOC, or DOCX file');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      setSelectedCV(file);
      form.setValue('cv', file);
    }
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a JPG, JPEG, or PNG file');
        return;
      }
      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }
      setProfilePicture(file);
      form.setValue('profilePicture', file);
    }
  };

  const removeCVFile = () => {
    setSelectedCV(null);
    form.setValue('cv', undefined);
    if (cvInputRef.current) {
      cvInputRef.current.value = '';
    }
  };

  const removeProfilePicture = () => {
    setProfilePicture(null);
    form.setValue('profilePicture', undefined);
    if (profileInputRef.current) {
      profileInputRef.current.value = '';
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Personal Information */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="First Name"
          error={form.formState.errors.firstName?.message}
        >
          <Input
            {...form.register("firstName")}
            placeholder="Enter your first name"
            className={FORM_CLASSES.input}
          />
        </FormField>
        
        <FormField
          label="Last Name"
          error={form.formState.errors.lastName?.message}
        >
          <Input
            {...form.register("lastName")}
            placeholder="Enter your last name"
            className={FORM_CLASSES.input}
          />
        </FormField>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Email Address"
          error={form.formState.errors.email?.message}
        >
          <Input
            {...form.register("email")}
            type="email"
            placeholder="your.email@example.com"
            className={FORM_CLASSES.input}
          />
        </FormField>
        
        <FormField
          label="Phone Number"
          error={form.formState.errors.phone?.message}
        >
          <Input
            {...form.register("phone")}
            placeholder="+1 234 567 8900"
            className={FORM_CLASSES.input}
          />
        </FormField>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Country"
          error={form.formState.errors.countryId?.message}
        >
          <CountrySelect
            value={countryId}
            onValueChange={handleCountryChange}
          />
        </FormField>

        <FormField
          label="State"
          error={form.formState.errors.stateId?.message}
        >
          <StateSelect
            countryId={countryId}
            value={stateId}
            onValueChange={handleStateChange}
          />
        </FormField>

        <FormField
          label="City (Optional)"
          error={form.formState.errors.cityId?.message}
        >
          <CitySelect
            stateId={stateId}
            value={cityId}
            onValueChange={handleCityChange}
          />
        </FormField>
      </div>

      {/* Password */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Password"
          error={form.formState.errors.password?.message}
        >
          <PasswordField
            register={form.register}
            name="password"
            placeholder="Create a secure password"
          />
        </FormField>
        
        <FormField
          label="Confirm Password"
          error={form.formState.errors.confirmPassword?.message}
        >
          <PasswordField
            register={form.register}
            name="confirmPassword"
            placeholder="Confirm your password"
          />
        </FormField>
      </div>

      <button
        type="button"
        onClick={onGeneratePassword}
        className="text-primary hover:text-primary/80 text-sm font-medium"
      >
        Generate Secure Password
      </button>

      {/* File Uploads */}
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Profile Picture (Optional)">
          <div className="space-y-2">
            <input
              ref={profileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleProfilePictureUpload}
              className="hidden"
            />
            {profilePicture ? (
              <div className="flex items-center justify-between p-2 border rounded-md bg-green-50">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 truncate">{profilePicture.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeProfilePicture}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => profileInputRef.current?.click()}
                className="w-full justify-start"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload profile photo
              </Button>
            )}
          </div>
        </FormField>
        
        <FormField label="Resume/CV (Optional)">
          <div className="space-y-2">
            <input
              ref={cvInputRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleCVUpload}
              className="hidden"
            />
            {selectedCV ? (
              <div className="flex items-center justify-between p-2 border rounded-md bg-blue-50">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 truncate">{selectedCV.name}</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={removeCVFile}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={() => cvInputRef.current?.click()}
                className="w-full justify-start"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload your CV
              </Button>
            )}
          </div>
        </FormField>
      </div>

      <Button type="submit" className={`w-full ${FORM_CLASSES.button}`}>
        Continue to Career Preferences
      </Button>
    </form>
  );
}; 