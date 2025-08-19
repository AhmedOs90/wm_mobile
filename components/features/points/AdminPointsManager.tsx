// AdminPointsManager.native.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/mockSupabase';

// UI
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ModalDialog } from '@/components/ui/dialog';
import Select, { type SelectOption } from '@/components/ui/select';
import { Tabs } from '@/components/ui/tabs';

import { useToast } from '@/hooks/use-toast';

// Icons
import {
  Users,
  TrendingUp,
  Award,
  RefreshCw,
  Plus,
  Minus,
  Settings,
  Copy,
  BarChart3,
} from 'lucide-react-native';

type Company = {
  id: string;
  name: string;
  email: string;
  subscription?: string | null;
  verified?: boolean | null;
  created_at?: string;
  jobs_posted?: number;
};

type EmployerPoints = {
  employer_id: string;
  current_balance: number;
};

type EmployerReferral = {
  id: string;
  referring_employer_id: string;
  referred_employer_email?: string | null;
  referral_code: string;
  status: 'pending' | 'registered' | 'job_posted' | 'active' | string;
  created_at: string;
  referred_employer_signup_date?: string | null;
  referred_employer_first_job_date?: string | null;
  signup_points_awarded?: boolean | null;
  job_post_points_awarded?: boolean | null;
};

const AdminPointsManager = () => {
  const [selectedEmployer, setSelectedEmployer] = useState<string>('');
  const [pointsAmount, setPointsAmount] = useState<string>('');
  const [adjustmentReason, setAdjustmentReason] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Companies
  const { data: companies, isLoading: companiesLoading } = useQuery({
    queryKey: ['companies-admin'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('companies')
        .select(`
          id,
          name,
          email,
          subscription,
          verified,
          created_at,
          jobs_posted
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as Company[];
    },
  });

  // Points
  const { data: allEmployerPoints } = useQuery({
    queryKey: ['all-employer-points'],
    queryFn: async () => {
      const { data, error } = await supabase.from('employer_points').select('*');
      if (error) throw error;
      return (data || []) as EmployerPoints[];
    },
  });

  // Referrals
  const { data: allReferrals } = useQuery({
    queryKey: ['all-employer-referrals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employer_referrals')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data || []) as EmployerReferral[];
    },
  });

  // Current admin (for audit)
  const { data: adminProfile } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser() as { data: { user: { id: string } | null } };
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id )
        .single();
      if (error) throw error;
      return data as any;
    },
  });

  // Generate referral code
  const generateCodeMutation = useMutation({
    mutationFn: async (employerId: string) => {
      const { data: newCode, error: codeError } = await supabase
        .rpc('generate_company_referral_code', { company_uuid: employerId });
      if (codeError) throw codeError;

      const { data, error } = await supabase
        .from('employer_referrals')
        .insert({
          referring_employer_id: employerId,
          referred_employer_email: '',
          referral_code: newCode,
          status: 'active',
        })
        .select()
        .single();

      if (error) {
        // upsert on conflict-like path
        const { data: updateData, error: updateError } = await supabase
          .from('employer_referrals')
          .update({
            referral_code: newCode,
            status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('referring_employer_id', employerId)
          .eq('referred_employer_email', '')
          .select()
          .single();
        if (updateError) throw updateError;
        return updateData;
      }
      return data;
    },
    onSuccess: () => {
      toast({ title: 'Code Generated', description: 'New referral code generated successfully!' });
      queryClient.invalidateQueries({ queryKey: ['all-employer-referrals'] });
    },
  });

  // Adjust points
  const adjustPointsMutation = useMutation({
    mutationFn: async ({
      employerId,
      amount,
      type,
      reason,
    }: {
      employerId: string;
      amount: number;
      type: 'add' | 'deduct';
      reason: string;
    }) => {
      const adminName = adminProfile?.full_name || adminProfile?.email || 'Unknown Admin';

      const { error: transactionError } = await supabase.from('points_transactions').insert({
        employer_id: employerId,
        transaction_type: type === 'add' ? 'earn' : 'redeem',
        points_amount: amount,
        action_type: 'admin_adjustment',
        description: `${reason || `Admin ${type === 'add' ? 'added' : 'deducted'} points`} | Admin: ${adminName}`,
        expires_at:
          type === 'add'
            ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
            : null,
      });
      if (transactionError) throw transactionError;

      const { data: newBalance, error: balanceError } = await supabase.rpc(
        'calculate_points_balance',
        { employer_uuid: employerId }
      );
      if (balanceError) throw balanceError;

      const { error: pointsError } = await supabase.from('employer_points').upsert({
        employer_id: employerId,
        current_balance: newBalance || 0,
        updated_at: new Date().toISOString(),
      });
      if (pointsError) throw pointsError;
    },
    onSuccess: () => {
      toast({ title: 'Points Adjusted', description: 'Points have been successfully adjusted!' });
      setPointsAmount('');
      setAdjustmentReason('');
      setSelectedEmployer('');
      queryClient.invalidateQueries({ queryKey: ['all-employer-points'] });
    },
  });

  // Helpers
  const filteredCompanies = useMemo(
    () =>
      (companies || []).filter(
        (c) =>
          c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [companies, searchTerm]
  );

  const copyReferralCode = (code: string) => {
    Clipboard.setString(code);
    toast({ title: 'Copied!', description: 'Referral code copied to clipboard.' });
  };

  const getCompanyPoints = (employerId: string) =>
    (allEmployerPoints || []).find((p) => p.employer_id === employerId)?.current_balance || 0;

  const getCompanyReferrals = (employerId: string) =>
    (allReferrals || []).filter((r) => r.referring_employer_id === employerId);

  // Loading
  if (companiesLoading) {
    return (
      <View className="p-6">
        <Text>Loading subscriber data...</Text>
      </View>
    );
  }

  // ----- Tab content builders -----
  const SubscribersTab = () => (
    <Card>
      <CardHeader>
        <View className="flex-row items-center justify-between">
          <CardTitle>Subscriber Management</CardTitle>

          <View className="flex-row gap-2">
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChangeText={setSearchTerm}
              // width via style because RN Button/Input don't take className
              style={{ width: 240 }}
            />

            <ModalDialog
              title="Adjust Subscriber Points"
              trigger={
                <Button iconLeft={<Settings size={16} color="#fff" />}>
                  Adjust Points
                </Button>
              }
            >
              <View className="gap-4">
                <View className="gap-1.5">
                  <Label>Select Subscriber</Label>
                  <Select
                    data={(companies || []).map<SelectOption>((c) => ({
                      label: `${c.name} (${c.email})`,
                      value: c.id,
                    }))}
                    value={selectedEmployer}
                    onChange={(opt) => setSelectedEmployer(String(opt.value))}
                    placeholder="Choose a subscriber"
                  />
                </View>

                <View className="gap-1.5">
                  <Label>Points Amount</Label>
                  <Input
                    keyboardType="numeric"
                    value={pointsAmount}
                    onChangeText={setPointsAmount}
                    placeholder="Enter points amount"
                  />
                </View>

                <View className="gap-1.5">
                  <Label>Reason for Adjustment</Label>
                  <Textarea
                    value={adjustmentReason}
                    onChangeText={setAdjustmentReason}
                    placeholder="Explain why points are being adjusted..."
                  />
                </View>

                <View className="flex-row gap-8">
                  <Button
                    onPress={() =>
                      adjustPointsMutation.mutate({
                        employerId: selectedEmployer,
                        amount: parseInt(pointsAmount || '0', 10),
                        type: 'add',
                        reason: adjustmentReason,
                      })
                    }
                    disabled={
                      !selectedEmployer ||
                      !pointsAmount ||
                      adjustPointsMutation.isPending
                    }
                    style={{ flex: 1 }}
                    iconLeft={<Plus size={16} color="#fff" />}
                  >
                    Add Points
                  </Button>

                  <Button
                    variant="destructive"
                    onPress={() =>
                      adjustPointsMutation.mutate({
                        employerId: selectedEmployer,
                        amount: parseInt(pointsAmount || '0', 10),
                        type: 'deduct',
                        reason: adjustmentReason,
                      })
                    }
                    disabled={
                      !selectedEmployer ||
                      !pointsAmount ||
                      adjustPointsMutation.isPending
                    }
                    style={{ flex: 1 }}
                    iconLeft={<Minus size={16} color="#fff" />}
                  >
                    Deduct Points
                  </Button>
                </View>
              </View>
            </ModalDialog>
          </View>
        </View>
      </CardHeader>

      <CardContent>
        <View className="gap-4">
          {filteredCompanies.map((company) => {
            const points = getCompanyPoints(company.id);
            const referrals = getCompanyReferrals(company.id);
            const activeReferrals = referrals.filter(
              (r) => r.status === 'pending' || r.status === 'registered'
            );

            return (
              <View
                key={company.id}
                className="flex-row items-center justify-between p-4 border rounded-lg"
              >
                <View className="flex-1">
                  <View className="flex-row items-center gap-3">
                    <View>
                      <Text className="font-medium">{company.name}</Text>
                      <Text className="text-sm text-muted-foreground">{company.email}</Text>
                    </View>
                    <View className="flex-row gap-2">
                      <Badge variant={company.verified ? 'default' : 'secondary'}>
                        {company.verified ? 'Verified' : 'Unverified'}
                      </Badge>
                      <Badge variant="outline">{company.subscription || 'None'}</Badge>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center gap-4">
                  <View className="items-end">
                    <Text className="font-medium">{points} pts</Text>
                    <Text className="text-sm text-muted-foreground">
                      {activeReferrals.length} active referrals
                    </Text>
                  </View>
                  <Button
                    variant="outline"
                    size="sm"
                    onPress={() => generateCodeMutation.mutate(company.id)}
                    disabled={generateCodeMutation.isPending}
                    iconLeft={<RefreshCw size={16} color="#111827" />}
                    textStyle={{ color: '#111827' }}
                  >
                    New Code
                  </Button>
                </View>
              </View>
            );
          })}
        </View>
      </CardContent>
    </Card>
  );

  const ReferralsTab = () => (
    <View className="gap-4">
      {/* Points Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Points System Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="gap-4">
            <View className="flex-row items-center justify-between p-3 border rounded-lg">
              <View>
                <Text className="font-medium">Send Referral</Text>
                <Text className="text-sm text-muted-foreground">When referral code is used</Text>
              </View>
              <Badge variant="secondary">5 pts</Badge>
            </View>

            <View className="flex-row items-center justify-between p-3 border rounded-lg">
              <View>
                <Text className="font-medium">Successful Referral</Text>
                <Text className="text-sm text-muted-foreground">
                  Referred user posts job within 72h
                </Text>
              </View>
              <Badge variant="secondary">15 pts</Badge>
            </View>

            <View className="flex-row items-center justify-between p-3 border rounded-lg">
              <View>
                <Text className="font-medium">Job Posting</Text>
                <Text className="text-sm text-muted-foreground">Each job posted</Text>
              </View>
              <Badge variant="secondary">5 pts</Badge>
            </View>

            <View className="flex-row items-center justify-between p-3 border rounded-lg">
              <View>
                <Text className="font-medium">Annual Subscription</Text>
                <Text className="text-sm text-muted-foreground">Yearly commitment bonus</Text>
              </View>
              <Badge variant="secondary">50 pts</Badge>
            </View>
          </View>
        </CardContent>
      </Card>

      {/* Referral Code Management */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Code Management & Attribution</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="gap-4">
            {(allReferrals || []).length === 0 ? (
              <Text className="text-center text-muted-foreground py-8">
                No referral codes generated yet
              </Text>
            ) : (
              (allReferrals || []).map((referral) => {
                const company = (companies || []).find(
                  (c) => c.id === referral.referring_employer_id
                );
                const isExpired =
                  referral.created_at &&
                  new Date(referral.created_at) <
                    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

                const statusVariant =
                  referral.status === 'job_posted'
                    ? 'default'
                    : referral.status === 'registered'
                    ? 'secondary'
                    : isExpired
                    ? 'destructive'
                    : 'outline';

                return (
                  <View
                    key={referral.id}
                    className="flex-row items-start justify-between p-4 border rounded-lg"
                  >
                    <View style={{ flex: 1 }}>
                      <View className="flex-row items-center justify-between mb-2">
                        <Text className="font-medium">
                          {company?.name || 'Unknown Company'}
                        </Text>

                        <View className="flex-row items-center gap-2">
                          <Badge variant={statusVariant}>
                            {isExpired && referral.status === 'pending'
                              ? 'Expired'
                              : referral.status}
                          </Badge>

                          <Button
                            variant="outline"
                            size="sm"
                            onPress={() => copyReferralCode(referral.referral_code)}
                            iconLeft={<Copy size={14} color="#111827" />}
                            textStyle={{ color: '#111827' }}
                          >
                            Copy
                          </Button>
                        </View>
                      </View>

                      <View className="flex-row gap-6">
                        <View className="gap-1">
                          <Text>
                            <Text className="font-medium">Code: </Text>
                            {referral.referral_code}
                          </Text>
                          <Text>
                            <Text className="font-medium">Created: </Text>
                            {new Date(referral.created_at).toLocaleDateString()}
                          </Text>
                        </View>

                        <View className="gap-1">
                          {!!referral.referred_employer_email && (
                            <Text>
                              <Text className="font-medium">Referred: </Text>
                              {referral.referred_employer_email}
                            </Text>
                          )}
                          {!!referral.referred_employer_signup_date && (
                            <Text>
                              <Text className="font-medium">Signed up: </Text>
                              {new Date(
                                referral.referred_employer_signup_date
                              ).toLocaleDateString()}
                            </Text>
                          )}
                          {!!referral.referred_employer_first_job_date && (
                            <Text>
                              <Text className="font-medium">First job: </Text>
                              {new Date(
                                referral.referred_employer_first_job_date
                              ).toLocaleDateString()}
                            </Text>
                          )}
                        </View>
                      </View>

                      <View className="flex-row gap-2 mt-2">
                        {referral.signup_points_awarded ? (
                          <Badge variant="outline">✓ Signup Points (+5)</Badge>
                        ) : null}
                        {referral.job_post_points_awarded ? (
                          <Badge variant="outline">✓ Job Post Points (+15)</Badge>
                        ) : null}
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </View>
        </CardContent>
      </Card>
    </View>
  );

  const AnalyticsTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Referral Analytics & Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <View className="gap-6">
          <View className="gap-4">
            <Text className="font-medium">Top Referring Companies</Text>
            {(companies || []).slice(0, 5).map((company) => {
              const referrals = getCompanyReferrals(company.id);
              const successfulReferrals = referrals.filter((r) => r.status === 'job_posted');

              return (
                <View
                  key={company.id}
                  className="flex-row items-center justify-between p-3 border rounded"
                >
                  <View>
                    <Text className="font-medium">{company.name}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {successfulReferrals.length} successful / {referrals.length} total
                    </Text>
                  </View>
                  <Badge variant="secondary">{getCompanyPoints(company.id)} pts</Badge>
                </View>
              );
            })}
          </View>

          <View className="gap-4">
            <Text className="font-medium">Recent Activity</Text>
            {(allReferrals || []).slice(0, 5).map((referral) => {
              const company = (companies || []).find(
                (c) => c.id === referral.referring_employer_id
              );
              return (
                <View
                  key={referral.id}
                  className="flex-row items-center justify-between p-3 border rounded"
                >
                  <View>
                    <Text className="font-medium">{company?.name}</Text>
                    <Text className="text-sm text-muted-foreground">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </Text>
                  </View>
                  <Badge variant={referral.status === 'job_posted' ? 'default' : 'outline'}>
                    {referral.status}
                  </Badge>
                </View>
              );
            })}
          </View>
        </View>
      </CardContent>
    </Card>
  );

  // ----- Top metrics cards -----
  const totalSubscribers = companies?.length || 0;
  const verifiedCount = (companies || []).filter((c) => c.verified).length || 0;
  const totalPoints =
    (allEmployerPoints || []).reduce((sum, p) => sum + (p.current_balance || 0), 0) || 0;

  const activeReferralsCount =
    (allReferrals || []).filter((r) => r.status === 'pending' || r.status === 'registered')
      .length || 0;

  const conversionCount = (allReferrals || []).filter((r) => r.status === 'job_posted')
    .length || 0;

  const conversionRate =
    (allReferrals || []).length > 0
      ? Math.round((conversionCount / (allReferrals || []).length) * 100)
      : 0;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>

      {/* Overview cards */}
      <View className="gap-6">
        <View className="gap-6">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
              <Users size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text className="text-2xl font-bold">{totalSubscribers}</Text>
              <Text className="text-xs text-muted-foreground">Verified: {verifiedCount}</Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Points</CardTitle>
              <Award size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text className="text-2xl font-bold">{totalPoints}</Text>
              <Text className="text-xs text-muted-foreground">
                Distributed across all subscribers
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Active Referrals</CardTitle>
              <TrendingUp size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text className="text-2xl font-bold">{activeReferralsCount}</Text>
              <Text className="text-xs text-muted-foreground">
                Total referrals: {(allReferrals || []).length}
              </Text>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Successful Conversions</CardTitle>
              <BarChart3 size={16} color="#6b7280" />
            </CardHeader>
            <CardContent>
              <Text className="text-2xl font-bold">{conversionCount}</Text>
              <Text className="text-xs text-muted-foreground">
                Conversion rate: {conversionRate}%
              </Text>
            </CardContent>
          </Card>
        </View>

        {/* Tabs */}
        <Tabs
          tabs={['Subscribers', 'Referral Management', 'Analytics']}
          tabContent={(index) => {
            switch (index) {
              case 0:
                return <SubscribersTab />;
              case 1:
                return <ReferralsTab />;
              case 2:
                return <AnalyticsTab />;
              default:
                return null;
            }
          }}
        />
      </View>
    </ScrollView>
  );
};

export default AdminPointsManager;
