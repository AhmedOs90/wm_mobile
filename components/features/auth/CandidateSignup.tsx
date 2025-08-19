import { useState, useCallback, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { authControllerRegister } from "@sdk.gen.ts";
import { useToast } from "@/hooks/use-toast";
import { useStaticData } from "@/hooks/useStaticData";
import AuthLayout from "./AuthLayout";
import StepIndicator from "./StepIndicator";
import {
  PersonalAccountForm,
  CareerPreferencesForm,
  SocialAuthButtons,
} from "./components";
import {
  personalAccountSchema,
  careerPreferencesSchema,
  PersonalAccountFormData,
  CareerPreferencesFormData,
  RegistrationData,
} from "./types/signupTypes";
import { SIGNUP_STEPS, PASSWORD_CONFIG } from "./constants/signupConstants";

const CandidateSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [skillsSearchQuery, setSkillsSearchQuery] = useState("");
  const [debouncedSkillsSearchQuery, setDebouncedSkillsSearchQuery] =
    useState("");
  const [selectedSkills, setSelectedSkills] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [showOtherSkill, setShowOtherSkill] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  // Forms
  const personalAccountForm = useForm<PersonalAccountFormData>({
    resolver: zodResolver(personalAccountSchema),
  });

  const careerPreferencesForm = useForm<CareerPreferencesFormData>({
    resolver: zodResolver(careerPreferencesSchema),
  });

  const staticData = useStaticData("", "", "", debouncedSkillsSearchQuery);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSkillsSearchQuery(skillsSearchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [skillsSearchQuery]);

  const generatePassword = useCallback(() => {
    const chars = PASSWORD_CONFIG.charset;
    let password = "";
    for (let i = 0; i < PASSWORD_CONFIG.length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    personalAccountForm.setValue("password", password);
    personalAccountForm.setValue("confirmPassword", password);
  }, [personalAccountForm]);

  const handleSkillChange = useCallback(
    (skillValue: string) => {
      if (!skillValue) return;

      setSelectedSkill("");

      if (skillValue === "other") {
        setShowOtherSkill(true);
      } else {
        setShowOtherSkill(false);

        // Find the skill option to get both id and name
        const skillOption = staticData.skillOptions.find(
          (option) => option.value === skillValue
        );
        if (
          skillOption &&
          !selectedSkills.some((skill) => skill.id === skillValue)
        ) {
          const newSkill = { id: skillValue, name: skillOption.label };
          const updatedSkills = [...selectedSkills, newSkill];
          setSelectedSkills(updatedSkills);
          careerPreferencesForm.setValue(
            "skillIds",
            updatedSkills.map((skill) => skill.id)
          );
        }
      }
    },
    [selectedSkills, careerPreferencesForm, staticData.skillOptions]
  );

  const handleRemoveSkill = useCallback(
    (skillToRemove: string) => {
      const updatedSkills = selectedSkills.filter(
        (skill) => skill.id !== skillToRemove
      );
      setSelectedSkills(updatedSkills);
      careerPreferencesForm.setValue(
        "skillIds",
        updatedSkills.map((skill) => skill.id)
      );
    },
    [selectedSkills, careerPreferencesForm]
  );

  const handleOtherSkillAdd = useCallback(() => {
    const otherSkillValue = careerPreferencesForm.getValues("otherSkill");
    if (otherSkillValue && otherSkillValue.trim()) {
      const trimmedSkill = otherSkillValue.trim();

      if (!selectedSkills.some((skill) => skill.name === trimmedSkill)) {
        const newSkill = { id: `other_${Date.now()}`, name: trimmedSkill };
        const updatedSkills = [...selectedSkills, newSkill];
        setSelectedSkills(updatedSkills);
        careerPreferencesForm.setValue(
          "skillIds",
          updatedSkills.map((skill) => skill.id)
        );
      }

      careerPreferencesForm.setValue("otherSkill", "");
      setShowOtherSkill(false);
      setSelectedSkill("");
    }
  }, [selectedSkills, careerPreferencesForm]);

  const onOtherSkillChange = useCallback(
    (value: string) => {
      careerPreferencesForm.setValue("otherSkill", value);
    },
    [careerPreferencesForm]
  );

  const fileUploader = async (file: File, path: string) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", path);

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_STORAGE_API_URL}/api/upload/file`,
        {
          method: "POST",
          body: formData,
          headers: {
            "x-api-key": import.meta.env.VITE_PUBLIC_STORAGE_API_KEY!,
            "x-secret-key": import.meta.env.VITE_PUBLIC_STORAGE_API_SECRET!,
          },
        }
      );

      if (!response.ok) {
        throw new Error("File upload failed");
      }

      const result = await response.json();
      return { file: result.file || result.url };
    } catch (error) {
      console.error("File upload error:", error);
      return { file: null };
    }
  };

  const onPersonalAccountSubmit = useCallback(
    async (data: PersonalAccountFormData) => {
      try {
        setCurrentStep(2);
      } catch (error) {
        toast({
          title: "Error",
          description:
            error instanceof Error ? error.message : "An error occurred.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const onCareerPreferencesSubmit = useCallback(
    async (data: CareerPreferencesFormData) => {
      if (isRegistering) return; // Prevent multiple submissions
      
      setIsRegistering(true);
      try {
        const personalData = personalAccountForm.getValues();

        const registrationData: RegistrationData = {
          body: {
            email: personalData.email,
            password: personalData.password,
            confirmPassword: personalData.confirmPassword,
            role: "CANDIDATE" as const,
            firstName: personalData.firstName,
            lastName: personalData.lastName,
            countryId: personalData.countryId,
            stateId: personalData.stateId,
            ...(personalData.cityId && { cityId: personalData.cityId }),
            categoryId: data.categoryId,
            functionalAreaId: data.functionalAreaId || null,
            careerLevelId: data.careerLevel,
            jobTypeId: data.jobTypeId,
            desiredPosition: data.desiredPosition,
            preferredWorkType: data.preferredWorkType as
              | "Remote"
              | "Hybrid"
              | "Onsite",
            salaryRange: {
              fullTimeExpectedSalary: data.fullTimeExpectedSalary
                ? Number(data.fullTimeExpectedSalary)
                : undefined,
              partTimeExpectedSalary: data.partTimeExpectedSalary
                ? Number(data.partTimeExpectedSalary)
                : undefined,
              minSalary: data.salaryMin,
              maxSalary: data.salaryMax,
              currencyId: data.currencyId,
            },
            skillIds: data.skillIds,
          },
        };

        const response = await authControllerRegister(registrationData);

        if (response && response.data && response.data.status === "success") {
          let cvFileUrl = "";

          const cvFile = personalData.cv;
          if (cvFile instanceof File) {
            try {
              const result = await fileUploader(cvFile, "cvs");
              if (!result.file) {
                toast({
                  title: "CV Upload Failed",
                  description:
                    "Unable to upload CV, but registration was successful.",
                  variant: "destructive",
                });
              } else {
                cvFileUrl = result.file;
              }
            } catch (cvError) {
              console.error("CV upload failed:", cvError);
              toast({
                title: "CV Upload Failed",
                description:
                  "Unable to upload CV, but registration was successful.",
                variant: "destructive",
              });
            }
          }

          const userId = response.data.data.id;

          const queryParams = [];
          if (cvFileUrl) {
            queryParams.push(`cv=${encodeURIComponent(cvFileUrl)}`);
          }
          if (userId) {
            queryParams.push(`userId=${userId}`);
          }

          const queryString =
            queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

          navigate(`/activate${queryString}`);

          toast({
            title: "Registration successful",
            description: "Please check your email to verify your account.",
            variant: "default",
          });
        } else {
          const errorMessage = "Registration failed. Please try again.";
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error("Registration error:", error);
        toast({
          title: "Registration failed",
          description:
            error instanceof Error ? error.message : "An error occurred.",
          variant: "destructive",
        });
      } finally {
        setIsRegistering(false);
      }
    },
    [personalAccountForm, navigate, toast, isRegistering]
  );

  const handleBack = useCallback(() => {
    setCurrentStep(1);
  }, []);

  const handleSkillsSearchChange = useCallback((query: string) => {
    setSkillsSearchQuery(query);
  }, []);

  const handleGoogleSignup = useCallback(() => {
    const userType = "CANDIDATE";
    const type = "register";
    window.location.href = `${
      import.meta.env.VITE_API_BASE_URL
    }/auth/google?userType=${userType}&type=${type}`;
  }, []);

  const handleLinkedInSignup = useCallback(() => {
    console.log("LinkedIn signup");
  }, []);

  const handleFacebookSignup = useCallback(() => {
    console.log("Facebook signup");
  }, []);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalAccountForm
            form={personalAccountForm}
            onSubmit={onPersonalAccountSubmit}
            onGeneratePassword={generatePassword}
          />
        );

      case 2:
        return (
          <CareerPreferencesForm
            form={careerPreferencesForm}
            onSubmit={onCareerPreferencesSubmit}
            onBack={handleBack}
            skillOptions={staticData.skillOptions}
            skillsLoading={staticData.skillsLoading}
            selectedSkills={selectedSkills}
            selectedSkill={selectedSkill}
            showOtherSkill={showOtherSkill}
            onSkillChange={handleSkillChange}
            onRemoveSkill={handleRemoveSkill}
            onOtherSkillAdd={handleOtherSkillAdd}
            onOtherSkillChange={onOtherSkillChange}
            otherSkillValue={careerPreferencesForm.watch("otherSkill") || ""}
            onSkillSearchChange={handleSkillsSearchChange}
            isRegistering={isRegistering}
          />
        );

      default:
        return null;
    }
  };

  const stepTitles = SIGNUP_STEPS.map((step) => step.title);

  return (
    <>
      <AuthLayout>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Join as Job Seeker
            </h1>
            <p className="text-muted-foreground mt-1">
              Complete your profile to find your dream job
            </p>
          </div>

          <StepIndicator currentStep={currentStep} steps={stepTitles} />

          <div className="bg-white rounded-xl border border-input shadow-sm p-6">
            {renderStepContent()}
          </div>

          <SocialAuthButtons onGoogleSignup={handleGoogleSignup} />

          <div className="text-center">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Log in
            </Link>
          </div>
        </div>
      </AuthLayout>
    </>
  );
};

export default CandidateSignup;
