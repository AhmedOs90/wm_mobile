import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  User, 
  FileText, 
  Award, 
  Briefcase, 
  Target,
  TrendingUp,
  X,
  ArrowRight
} from 'lucide-react';
import { candidateApi } from '@/services/candidateApi';
import { transformDashboardData, getFallbackDashboardData, type ProfileCompletionData } from '@/lib/candidateUtils';

interface ProfileUpdatePromptProps {
  trigger: 'rejection' | 'no_response' | 'low_match' | 'general';
  rejectionCount?: number;
  daysSinceLastResponse?: number;
  onUpdateProfile: () => void;
  onDismiss: () => void;
}

export const ProfileUpdatePrompt = ({ 
  trigger, 
  rejectionCount, 
  daysSinceLastResponse, 
  onUpdateProfile, 
  onDismiss 
}: ProfileUpdatePromptProps) => {
  const [dismissed, setDismissed] = useState(false);

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['profile-completion'],
    queryFn: async (): Promise<ProfileCompletionData> => {
      try {
        const dashboardSummary = await candidateApi.getDashboardSummary();
        const transformedData = transformDashboardData(dashboardSummary);
        return transformedData.profileCompletion;
      } catch (error) {
        console.error('Error fetching profile completion:', error);
        const fallbackData = getFallbackDashboardData();
        return fallbackData.profileCompletion;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  if (dismissed || isLoading) return null;

  const getTriggerContent = () => {
    switch (trigger) {
      case 'rejection':
        return {
          title: "Boost Your Application Success",
          description: `You've received ${rejectionCount} rejections recently. Let's strengthen your profile to increase your chances.`,
          urgency: 'high',
          icon: Target,
          suggestions: [
            'Update your skills section with in-demand technologies',
            'Add recent projects or achievements',
            'Refresh your professional summary',
            'Upload an updated CV/resume'
          ]
        };
      
      case 'no_response':
        return {
          title: "Get More Employer Attention",
          description: `It's been ${daysSinceLastResponse} days since your last employer response. Let's make your profile more attractive.`,
          urgency: 'medium',
          icon: TrendingUp,
          suggestions: [
            'Add portfolio projects or work samples',
            'Update your availability status',
            'Include relevant certifications',
            'Optimize your headline and summary'
          ]
        };
      
      case 'low_match':
        return {
          title: "Improve Job Matching",
          description: "Your recent job matches have been below 80%. Let's refine your profile for better recommendations.",
          urgency: 'medium',
          icon: Target,
          suggestions: [
            'Update your preferred job types and locations',
            'Add more relevant skills and technologies',
            'Set your salary expectations',
            'Update your career level and experience'
          ]
        };
      
      default:
        return {
          title: "Keep Your Profile Fresh",
          description: "Regular profile updates help you stay visible to employers and get better job matches.",
          urgency: 'low',
          icon: User,
          suggestions: [
            'Review and update your work experience',
            'Add new skills you\'ve learned',
            'Update your profile photo',
            'Refresh your professional summary'
          ]
        };
    }
  };

  const content = getTriggerContent();
  const completionScore = profileData?.completionScore || 0;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-950/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
      default: return 'border-gray-300';
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss();
  };

  return (
    <Card className={`relative ${getUrgencyColor(content.urgency)} border-l-4`}>
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0"
        onClick={handleDismiss}
      >
        <X className="h-3 w-3" />
      </Button>

      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <content.icon className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-lg">{content.title}</CardTitle>
            <CardDescription>{content.description}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Profile Completion</span>
            <span className="font-medium">{completionScore}%</span>
          </div>
          <Progress value={completionScore} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Complete profiles get 3x more employer views
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Recommended Updates
          </h4>
          <div className="space-y-2">
            {content.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span>{suggestion}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {!profileData?.hasCV && (
            <div className="flex items-center gap-2 p-2 bg-background rounded border">
              <FileText className="h-3 w-3 text-muted-foreground" />
              <span>Update CV</span>
            </div>
          )}
          {!profileData?.hasSkills && (
            <div className="flex items-center gap-2 p-2 bg-background rounded border">
              <Award className="h-3 w-3 text-muted-foreground" />
              <span>Add Skills</span>
            </div>
          )}
          {!profileData?.hasWorkHistory && (
            <div className="flex items-center gap-2 p-2 bg-background rounded border">
              <Briefcase className="h-3 w-3 text-muted-foreground" />
              <span>Work History</span>
            </div>
          )}
          {!profileData?.hasSummary && (
            <div className="flex items-center gap-2 p-2 bg-background rounded border">
              <User className="h-3 w-3 text-muted-foreground" />
              <span>Summary</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={onUpdateProfile} className="flex-1">
            Update Profile
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
          <Button variant="outline" onClick={handleDismiss}>
            Later
          </Button>
        </div>

        {content.urgency === 'high' && (
          <div className="text-center">
            <Badge variant="destructive" className="text-xs">
              Urgent: Low application success rate detected
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileUpdatePrompt;
