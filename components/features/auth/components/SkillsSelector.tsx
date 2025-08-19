import { SearchableSelect, SearchableSelectOption } from '@/components/shared/ui';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FORM_CLASSES } from '../constants/signupConstants';

interface SkillsSelectorProps {
  skillOptions: SearchableSelectOption[];
  selectedSkills: Array<{ id: string; name: string }>;
  selectedSkill: string;
  showOtherSkill: boolean;
  onSkillChange: (value: string) => void;
  onRemoveSkill: (skill: string) => void;
  onOtherSkillAdd: () => void;
  onOtherSkillChange: (value: string) => void;
  otherSkillValue: string;
  isLoading?: boolean;
  error?: string;
  onSkillSearchChange?: (query: string) => void;
}

export const SkillsSelector = ({
  skillOptions,
  selectedSkills,
  selectedSkill,
  showOtherSkill,
  onSkillChange,
  onRemoveSkill,
  onOtherSkillAdd,
  onOtherSkillChange,
  otherSkillValue,
  isLoading = false,
  error,
  onSkillSearchChange
}: SkillsSelectorProps) => {
  return (
    <div className="space-y-3">
      <Label className={FORM_CLASSES.label}>Key Skills</Label>
      
      {/* Selected Skills Pills */}
      {selectedSkills.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border">
          {selectedSkills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-1 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
              <span>{skill.name}</span>
              <button
                type="button"
                onClick={() => onRemoveSkill(skill.id)}
                className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                aria-label={`Remove ${skill.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Skill Selection Dropdown */}
      <SearchableSelect
        options={skillOptions}
        value={selectedSkill}
        onValueChange={onSkillChange}
        placeholder="Search and select skills..."
        searchPlaceholder="Search skills..."
        emptyMessage="No skills found"
        loading={isLoading}
        className="w-full"
        onSearchChange={onSkillSearchChange}
      />
      
      {/* Other Skill Input */}
      {showOtherSkill && (
        <div className="flex gap-2">
          <Input
            value={otherSkillValue}
            onChange={(e) => onOtherSkillChange(e.target.value)}
            placeholder="Enter your skill"
            className={`${FORM_CLASSES.input} flex-1`}
          />
          <Button
            type="button"
            onClick={onOtherSkillAdd}
            className="h-11 px-4 bg-primary hover:bg-primary/90"
          >
            Add
          </Button>
        </div>
      )}
      
      {error && (
        <p className={FORM_CLASSES.error}>{error}</p>
      )}
    </div>
  );
}; 