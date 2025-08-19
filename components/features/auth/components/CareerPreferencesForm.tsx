import { UseFormReturn } from 'react-hook-form';
import { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { CareerPreferencesFormData } from '../types/signupTypes';
import { FormField } from './FormField';
import { SkillsSelector } from './SkillsSelector';
import { JobCategorySelect, FunctionalAreaSelect, CareerLevelSelect, WorkTypeSelect, JobTypeSelect, CurrencySelect } from '@/components/dropdowns';
import { FORM_CLASSES } from '../constants/signupConstants';

interface CareerPreferencesFormProps {
  form: UseFormReturn<CareerPreferencesFormData>;
  onSubmit: (data: CareerPreferencesFormData) => void;
  onBack: () => void;
  skillOptions: any[];
  skillsLoading: boolean;
  selectedSkills: Array<{ id: string; name: string }>;
  selectedSkill: string;
  showOtherSkill: boolean;
  onSkillChange: (value: string) => void;
  onRemoveSkill: (skill: string) => void;
  onOtherSkillAdd: () => void;
  onOtherSkillChange: (value: string) => void;
  otherSkillValue: string;
  onSkillSearchChange?: (query: string) => void;
  isRegistering?: boolean;
}

export const CareerPreferencesForm = ({
  form,
  onSubmit,
  onBack,
  skillOptions,
  skillsLoading,
  selectedSkills,
  selectedSkill,
  showOtherSkill,
  onSkillChange,
  onRemoveSkill,
  onOtherSkillAdd,
  onOtherSkillChange,
  otherSkillValue,
  onSkillSearchChange,
  isRegistering = false,
}: CareerPreferencesFormProps) => {
  const categoryId = form.watch("categoryId");

  // Reset functional area when category changes
  useEffect(() => {
    if (categoryId) {
      form.setValue("functionalAreaId", "");
    }
  }, [categoryId, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Job Category and Position */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Job Category"
          error={form.formState.errors.categoryId?.message}
        >
          <JobCategorySelect
            value={categoryId}
            onValueChange={(value) => form.setValue("categoryId", value)}
          />
        </FormField>
        
        <FormField
          label="Position (Optional)"
          error={form.formState.errors.functionalAreaId?.message}
        >
          <FunctionalAreaSelect
            categoryId={categoryId}
            value={form.watch("functionalAreaId")}
            onValueChange={(value) => form.setValue("functionalAreaId", value)}
            disabled={!categoryId}
          />
        </FormField>
      </div>

      {/* Career Level and Job Type */}
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label="Career Level"
          error={form.formState.errors.careerLevel?.message}
        >
          <CareerLevelSelect
            value={form.watch("careerLevel")}
            onValueChange={(value) => form.setValue("careerLevel", value)}
          />
        </FormField>
        
        <FormField
          label="Job Type (Optional)"
          error={form.formState.errors.jobTypeId?.message}
        >
          <JobTypeSelect
            value={form.watch("jobTypeId") || ""}
            onValueChange={(value) => form.setValue("jobTypeId", value)}
          />
        </FormField>
      </div>

      {/* Desired Position */}
      <FormField
        label="Desired Position (Optional)"
        error={form.formState.errors.desiredPosition?.message}
      >
        <Input
          {...form.register("desiredPosition")}
          placeholder="e.g., Senior Software Engineer"
          className={FORM_CLASSES.input}
        />
      </FormField>

      {/* Salary Range - What you'll accept (Profile Table) */}
      <div className="space-y-4">
        <div className="border-l-4 border-blue-500 pl-4">
          <h4 className="font-medium text-gray-900 mb-2">Salary Range</h4>
          <p className="text-sm text-gray-600 mb-3">What salary range will you accept?</p>
          
          <div className="grid grid-cols-3 gap-4">
            <FormField
              label="Minimum Salary"
              error={form.formState.errors.salaryMin?.message}
            >
              <Input
                {...form.register("salaryMin")}
                type="number"
                placeholder="40000"
                className={FORM_CLASSES.input}
                min="0"
              />
            </FormField>
            
            <FormField
              label="Maximum Salary"
              error={form.formState.errors.salaryMax?.message}
            >
              <Input
                {...form.register("salaryMax")}
                type="number"
                placeholder="60000"
                className={FORM_CLASSES.input}
                min="0"
              />
            </FormField>
            
            <FormField
              label="Currency (Optional)"
              error={form.formState.errors.currencyId?.message}
            >
              <CurrencySelect
                value={form.watch("currencyId") || ""}
                onValueChange={(value) => form.setValue("currencyId", value)}
              />
            </FormField>
          </div>
        </div>
      </div>

      {/* Work Type */}
      <FormField
        label="Preferred Work Type"
        error={form.formState.errors.preferredWorkType?.message}
      >
        <WorkTypeSelect
          value={form.watch("preferredWorkType")}
          onValueChange={(value) => form.setValue("preferredWorkType", value)}
        />
      </FormField>

      {/* Skills */}
      <SkillsSelector
        skillOptions={skillOptions}
        selectedSkills={selectedSkills}
        selectedSkill={selectedSkill}
        showOtherSkill={showOtherSkill}
        onSkillChange={onSkillChange}
        onRemoveSkill={onRemoveSkill}
        onOtherSkillAdd={onOtherSkillAdd}
        onOtherSkillChange={onOtherSkillChange}
        otherSkillValue={otherSkillValue}
        isLoading={skillsLoading}
        error={form.formState.errors.skillIds?.message}
        onSkillSearchChange={onSkillSearchChange}
      />

      {/* Terms */}
      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="acceptTerms"
          onCheckedChange={(checked) => form.setValue("acceptTerms", !!checked)}
        />
        <Label htmlFor="acceptTerms" className="text-sm text-muted-foreground">
          I accept the{" "}
          <a href="#" className="text-primary hover:underline font-medium">
            terms of use
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:underline font-medium">
            privacy policy
          </a>
        </Label>
      </div>
      {form.formState.errors.acceptTerms && (
        <p className={FORM_CLASSES.error}>{form.formState.errors.acceptTerms.message}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="h-11 px-6 border-input"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          type="submit" 
          className={`flex-1 ${FORM_CLASSES.button}`}
          disabled={isRegistering}
        >
          {isRegistering ? "Registering..." : "Complete Registration"}
        </Button>
      </div>
    </form>
  );
}; 