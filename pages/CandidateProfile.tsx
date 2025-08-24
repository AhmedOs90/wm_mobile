import { useState, useEffect } from 'react';
import Layout from '@/components/shared/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import { 
  useProfile,
  useIsLoading,
  useFetchProfile,
  useSetUserId,
  useUpdateProfile,
  useProfileError,
  useValidateForm
} from '@/stores/userProfileStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import LoadingSpinner from '@/components/shared/ui/LoadingSpinner';
import {
  ProfileHeader,
  BasicInformationCard,
  PersonalInfoCard,
  AddressCard,
  QuickStatsGrid,
  ExperienceTab,
  EducationTab,
  SkillsTab,
  DocumentsTab,
  AddExperienceModal,
  AddEducationModal,
  AddSkillModal,
  UploadPhotoModal,
  ProfileSummaryHeader,
  EnhancedQuickStats,
  ProfessionalSummaryCard,
  CollapsibleDetailedInfo
} from '@/components/features/profile';
import { useCreateExperience, useUpdateExperience, type Experience } from '@/stores/experienceStore';
import { useCreateEducation, useUpdateEducation, type Education } from '@/stores/educationStore';
import { useCreateSkill, useUpdateSkill, type Skill } from '@/stores/skillsStore';
import { CreateEducationDto, UpdateEducationDto } from '@types.gen.ts';
import { useQueryClient } from '@tanstack/react-query';

const CandidateProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [isUploadPhotoModalOpen, setIsUploadPhotoModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  
  // Local states for update process - no more global state pollution
  const [isUpdating, setIsUpdating] = useState(false);

  const { userId } = useAuth();
  const { toast } = useToast();
  
  // Store hooks - simplified with new architecture
  const profile = useProfile();
  const isLoading = useIsLoading();
  const profileError = useProfileError();
  const fetchProfile = useFetchProfile();
  const setUserId = useSetUserId();
  const updateProfile = useUpdateProfile();
  const validateForm = useValidateForm();
  
  // Experience mutations
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();
  
  // Education mutations
  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation();
  
  // Skills mutations
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();
  const queryClient = useQueryClient();
  
  // Fetch real user data - only profile data, tabs handle their own data
  useEffect(() => {
    if (userId) {
      setUserId(userId);
      fetchProfile();
    }
  }, [userId, setUserId, fetchProfile]);

  // Handle error notification - simplified error handling  
  useEffect(() => {
    if (profileError) {
      toast({
        title: "Update Failed",
        description: profileError,
        variant: "destructive",
      });
    }
  }, [profileError, toast]);

  // Event handlers - simplified and more efficient
  const handleToggleEdit = async () => {
    if (isEditing) {
      // Validate form before saving
      const isValid = validateForm();
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "Please fix the errors in the form before saving.",
          variant: "destructive",
        });
        return;
      }

      setIsUpdating(true);
      try {
        const result = await updateProfile();
        
        if (result.success) {
          await fetchProfile();
          setIsEditing(false);
          toast({
            title: "Profile Updated",
            description: "Your profile has been successfully updated.",
            variant: "default",
          });
        } else {
          toast({
            title: "Update Failed",
            description: result.message || "Failed to update profile",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Update Failed",
          description: "An unexpected error occurred while updating your profile.",
          variant: "destructive",
        });
      } finally {
        setIsUpdating(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleUploadPhoto = () => {
    setIsUploadPhotoModalOpen(true);
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setIsExperienceModalOpen(true);
  };

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience);
    setIsExperienceModalOpen(true);
  };

  const handleSaveExperience = async (experienceData: any) => {
    try {
      if (editingExperience) {
        // Update existing experience
        await updateExperience.mutateAsync({
          id: String(editingExperience.id),
          data: experienceData
        });
        toast({
          title: "Experience Updated",
          description: "Your experience has been successfully updated."
        });
      } else {
        // Create new experience
        await createExperience.mutateAsync(experienceData);
        toast({
          title: "Experience Added",
          description: "Your experience has been successfully added."
        });
      }
      setIsExperienceModalOpen(false);
      setEditingExperience(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save experience. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddEducation = () => {
    setEditingEducation(null);
    setIsEducationModalOpen(true);
  };

  const handleEditEducation = (education: Education) => {
    setEditingEducation(education);
    setIsEducationModalOpen(true);
  };

  const handleSaveEducation = async (educationData: CreateEducationDto | UpdateEducationDto) => {
    try {
      if (editingEducation) {
        // Update existing education
        await updateEducation.mutateAsync({
          id: String(editingEducation.id),
          data: educationData as UpdateEducationDto
        });
        toast({
          title: "Education Updated",
          description: "Your education has been successfully updated."
        });
      } else {
        // Create new education
        await createEducation.mutateAsync(educationData as CreateEducationDto);
        toast({
          title: "Education Added",
          description: "Your education has been successfully added."
        });
      }
      setIsEducationModalOpen(false);
      setEditingEducation(null);
      
      // Wait a moment then manually refetch education data
      setTimeout(async () => {
        try {
          // Force refetch of education data
          await queryClient.invalidateQueries({ queryKey: ['candidate-education'] });
          await queryClient.refetchQueries({ queryKey: ['candidate-education'] });
        } catch (error) {
          console.error('Error refetching education data:', error);
        }
      }, 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save education. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddCertification = () => {
    setIsEducationModalOpen(true); // Reuse education modal for now
  };

  const handleAddSkill = () => {
    setEditingSkill(null);
    setIsSkillModalOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (skillData: any) => {
    try {
      if (editingSkill) {
        // Update existing skill
        await updateSkill.mutateAsync({
          id: String(editingSkill.id),
          data: skillData
        });
        toast({
          title: "Skill Updated",
          description: "Your skill has been successfully updated."
        });
      } else {
        // Create new skill
        await createSkill.mutateAsync(skillData);
        toast({
          title: "Skill Added",
          description: "Your skill has been successfully added."
        });
      }
      setIsSkillModalOpen(false);
      setEditingSkill(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save skill. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleUploadDocument = () => {
    // TODO: Implement document upload functionality
    console.log('Upload document clicked');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col h-full">
        {/* Fixed header section - simplified loading overlay */}
        <div className="flex-shrink-0 p-6 pb-0 relative">
          {isUpdating && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-40 flex items-center justify-center">
              <div className="bg-white p-4 rounded-lg shadow-lg flex items-center gap-3">
                <LoadingSpinner />
                <span className="text-sm font-medium">Updating profile...</span>
              </div>
            </div>
          )}
          <ProfileHeader 
            isEditing={isEditing}
            onToggleEdit={handleToggleEdit}
          />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-auto">
          <div className="p-6 pt-4">
            <Tabs defaultValue="overview" className="space-y-6">
              <div className="sticky top-0 bg-gray-50 py-4 z-30 -mx-6 px-6">
                <div className="bg-gray-50">
                  <TabsList className="bg-white shadow-sm p-2">
                    <TabsTrigger value="overview" className="rounded-md">Overview</TabsTrigger>
                    <TabsTrigger value="experience" className="rounded-md">Experience</TabsTrigger>
                    <TabsTrigger value="education" className="rounded-md">Education</TabsTrigger>
                    <TabsTrigger value="skills" className="rounded-md">Skills</TabsTrigger>
                    <TabsTrigger value="documents" className="rounded-md">Documents</TabsTrigger>
                  </TabsList>
                </div>
              </div>

            <TabsContent value="overview" className="space-y-2">
              {/* Enhanced Quick Stats for dashboard style */}
              <EnhancedQuickStats />
              
              {/* Dashboard Style Overview */}
              <ProfileSummaryHeader 
                isEditing={isEditing}
                onEdit={handleToggleEdit}
                onUploadPhoto={handleUploadPhoto}
              />
              
              <ProfessionalSummaryCard 
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
              />
              
              <CollapsibleDetailedInfo isEditing={isEditing} />
            </TabsContent>

            <TabsContent value="experience">
              {/* Experience component handles its own data fetching */}
              <ExperienceTab 
                onAddExperience={handleAddExperience}
                onEditExperience={handleEditExperience}
              />
            </TabsContent>

            <TabsContent value="education">
              {/* Education component handles its own data fetching */}
              <EducationTab 
                onAddEducation={handleAddEducation}
                onAddCertification={handleAddCertification}
                onEditEducation={handleEditEducation}
              />
            </TabsContent>

            <TabsContent value="skills">
              {/* Skills component handles its own data fetching */}
              <SkillsTab onAddSkill={handleAddSkill} onEditSkill={handleEditSkill} />
            </TabsContent>

            <TabsContent value="documents">
              {/* Documents component handles its own data fetching */}
              <DocumentsTab onUploadDocument={handleUploadDocument} />
            </TabsContent>
          </Tabs>
        </div>
        </div>
      </div>

      {/* Modals */}
      <AddExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => {
          setIsExperienceModalOpen(false);
          setEditingExperience(null);
        }}
        onSave={handleSaveExperience}
        editingExperience={editingExperience as any}
      />

      <AddEducationModal
        isOpen={isEducationModalOpen}
        onClose={() => {
          setIsEducationModalOpen(false);
          setEditingEducation(null);
        }}
        onSave={handleSaveEducation}
        editingEducation={editingEducation as any}
      />

      <AddSkillModal
        isOpen={isSkillModalOpen}
        onClose={() => {
          setIsSkillModalOpen(false);
          setEditingSkill(null);
        }}
        onSave={handleSaveSkill}
        editingSkill={editingSkill}
      />

      <UploadPhotoModal
        isOpen={isUploadPhotoModalOpen}
        onClose={() => setIsUploadPhotoModalOpen(false)}
        currentAvatar={profile?.profilePicture as string}
        onSave={(file) => {
          console.log('Photo uploaded:', file);
          // TODO: Here you would typically upload to backend and update profile.avatar
        }}
      />
    </Layout>
  );
};

export default CandidateProfile;
