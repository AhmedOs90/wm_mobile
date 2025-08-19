import { Button } from '@/components/ui/button';
import { 
  Eye, 
  User, 
  GraduationCap, 
  Award, 
  Briefcase, 
  MapPin, 
  Calendar, 
  Settings,
  ArrowLeft,
  Bell,
  Building
} from 'lucide-react';

interface CandidateSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onBackToList: () => void;
}

const CandidateSidebar = ({ activeSection, onSectionChange, onBackToList }: CandidateSidebarProps) => {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'personal-info', label: 'Personal info', icon: User },
    { id: 'qualifications', label: 'Qualifications', icon: GraduationCap, highlight: true },
    { id: 'achievements', label: 'Achievements & Projects', icon: Award },
    { id: 'work-preferences', label: 'Work preferences', icon: Briefcase },
    { id: 'my-jobs', label: 'My jobs', icon: Building, badge: '1' },
    { id: 'followed-companies', label: 'Followed companies & views', icon: Building },
    { id: 'job-alerts', label: 'Job alerts settings', icon: Bell },
    { id: 'account-settings', label: 'Account settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-white shadow-sm border-r">
      {/* Header */}
      <div className="p-4 border-b">
        <Button 
          variant="ghost" 
          onClick={onBackToList}
          className="w-full justify-start mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Candidates
        </Button>
        <h2 className="text-lg font-semibold">My Dashboard</h2>
      </div>

      {/* Menu Items */}
      <div className="p-2">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors relative ${
                isActive 
                  ? 'bg-orange-50 text-orange-600 border-l-4 border-orange-500' 
                  : 'hover:bg-gray-50 text-gray-700'
              } ${item.highlight ? 'bg-orange-50' : ''}`}
            >
              <IconComponent className="h-4 w-4" />
              <span className="text-sm">{item.label}</span>
              {item.badge && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CandidateSidebar;
