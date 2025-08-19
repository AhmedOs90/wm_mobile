import { useEffect, useState } from 'react';
import Select, { SelectOption } from '../ui/select';
import { staticDataControllerGetJobTypes } from '@/wm-api/sdk.gen.ts';
import type { JobType } from '@/wm-api/types.gen.ts';

interface JobTypeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const JobTypeSelect = ({
  value,
  onValueChange,
  placeholder = "Select job type",
  disabled = false,
}: JobTypeSelectProps) => {
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobTypes = async () => {
      try {
        setLoading(true);
        const response = await staticDataControllerGetJobTypes();
        if (response.data?.data) {
          setJobTypes(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching job types:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobTypes();
  }, []);

  const jobTypeOptions: SelectOption[] = jobTypes.map((jt) => ({
    label: jt.jobType,
    value: jt.id,
  }));

  return (
    <Select
      data={jobTypeOptions}
      value={value}
      onChange={(selected) => onValueChange(String(selected.value))}
      placeholder={loading ? "Loading..." : placeholder}
      disabled={disabled || loading}
    />
  );
};