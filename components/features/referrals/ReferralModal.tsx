// ReferralModal.native.tsx
import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/mockSupabase';
import { Label } from '@/components/ui/label';
import Button from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Select, { SelectOption } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { X, Loader2 } from 'lucide-react-native';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: { id: string; name: string; position?: string };
  referringCompanyId: string;
}

interface Company {
  id: string;
  name: string;
}
interface Job {
  id: string;
  title: string;
  company_id: string;
}

const ReferralModal: React.FC<ReferralModalProps> = ({
  isOpen,
  onClose,
  candidate,
  referringCompanyId,
}) => {
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Companies (exclude referring company)
  const {
    data: companies,
    isLoading: companiesLoading,
  } = useQuery({
    queryKey: ['companies-for-referral', referringCompanyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('id, name')
        .neq('id', referringCompanyId)
        .eq('status', 'active')
        .eq('verified', true);

      if (error) throw error;
      return data as Company[];
    },
    enabled: isOpen,
  });

  const companyOptions: SelectOption[] = useMemo(
    () => (companies || []).map((c) => ({ label: c.name, value: c.id })),
    [companies]
  );

  // Jobs for chosen company
  const {
    data: jobs,
    isLoading: jobsLoading,
  } = useQuery({
    queryKey: ['jobs-for-company', selectedCompanyId],
    queryFn: async () => {
      if (!selectedCompanyId) return [];
      const { data, error } = await supabase
        .from('jobs')
        .select('id, title, company_id')
        .eq('company_id', selectedCompanyId)
        .eq('status', 'active');

      if (error) throw error;
      return data as Job[];
    },
    enabled: !!selectedCompanyId,
  });

  const jobOptions: SelectOption[] = useMemo(
    () => (jobs || []).map((j) => ({ label: j.title, value: j.title })),
    [jobs]
  );

  const resetForm = () => {
    setSelectedCompanyId('');
    setSelectedJobTitle('');
    setNotes('');
  };

  const referralMutation = useMutation({
    mutationFn: async () => {
      const { data: referralData, error: referralError } = await supabase
        .from('referrals')
        .insert({
          candidate_id: candidate.id,
          referring_company_id: referringCompanyId,
          target_company_id: selectedCompanyId,
          position_title: selectedJobTitle,
          notes: notes.trim() || null,
        })
        .select()
        .single();
      if (referralError) throw referralError;

      const targetCompany = companies?.find((c) => c.id === selectedCompanyId);
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          company_id: selectedCompanyId,
          title: 'New Candidate Referral',
          message: `You have received a referral for ${candidate.name} for the position: ${selectedJobTitle}`,
          type: 'referral',
        });
      if (notificationError) throw notificationError;

      return referralData;
    },
    onSuccess: () => {
      toast({
        title: 'Referral Sent Successfully',
        description: `${candidate.name} has been referred for the ${selectedJobTitle} position.`,
      });
      queryClient.invalidateQueries({ queryKey: ['referrals'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      resetForm();
      onClose();
    },
    onError: (err) => {
      console.error('Referral error:', err);
      toast({
        title: 'Referral Failed',
        description: 'Failed to send referral. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = () => {
    if (!selectedCompanyId || !selectedJobTitle) {
      toast({
        title: 'Missing Information',
        description: 'Please select both company and job title.',
        variant: 'destructive',
      });
      return;
    }
    referralMutation.mutate();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center px-4">
        <View className="bg-white dark:bg-black rounded-lg p-6 w-full max-w-md">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold">Refer Candidate</Text>
            <TouchableOpacity onPress={handleClose}>
              <X size={20} color="gray" />
            </TouchableOpacity>
          </View>

          {/* Candidate box */}
          <View className="mb-4">
            <Label>Candidate</Label>
            <View className="p-3 mt-1 rounded-md" style={{ backgroundColor: '#F4F4F5' }}>
              <Text className="font-medium">{candidate.name}</Text>
              {!!candidate.position && (
                <Text className="text-sm" style={{ color: '#6B7280' }}>
                  {candidate.position}
                </Text>
              )}
            </View>
          </View>

          {/* Company */}
          <View className="mb-4">
            <Label>Target Company</Label>
            <View className="mt-1" />
            <Select
              data={companyOptions}
              value={selectedCompanyId}
              onChange={(item: { value: any; }) => {
                setSelectedCompanyId(String(item.value));
                setSelectedJobTitle('');
              }}
              placeholder={companiesLoading ? 'Loading companies...' : 'Select a company'}
              disabled={companiesLoading}
            />
          </View>

          {/* Job */}
          <View className="mb-4">
            <Label>Job Title</Label>
            <View className="mt-1" />
            <Select
              data={jobOptions}
              value={selectedJobTitle}
              onChange={(item: { value: any; }) => setSelectedJobTitle(String(item.value))}
              placeholder={
                !selectedCompanyId
                  ? 'Select a company first'
                  : jobsLoading
                  ? 'Loading jobs...'
                  : 'Select a job title'
              }
              disabled={!selectedCompanyId || jobsLoading}
            />
          </View>

          {/* Notes */}
          <View className="mb-4">
            <Label>Notes (Optional)</Label>
            <View className="mt-1" />
            <Textarea
              value={notes}
              onChangeText={setNotes}
              placeholder="Add any recommendations or comments about this candidate..."
            />
          </View>

          {/* Footer */}
          <View className="flex-row justify-end gap-2 mt-2">
            <Button variant="outline" onPress={handleClose}>
              Cancel
            </Button>
            <Button
              onPress={handleSubmit}
              disabled={referralMutation.isPending || !selectedCompanyId || !selectedJobTitle}
              loading={referralMutation.isPending}
              iconLeft={
                referralMutation.isPending ? <Loader2 size={16} /> : undefined
              }
            >
              {referralMutation.isPending ? 'Sending...' : 'Send Referral'}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReferralModal;
