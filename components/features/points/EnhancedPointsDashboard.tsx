// EnhancedPointsDashboard.native.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Share, Platform } from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/mockSupabase';

// Your RN UI primitives
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ModalDialog } from '@/components/ui/dialog';
import { Tabs } from '@/components//ui/tabs';

// Icons (native)
import {
  Award,
  Users,
  TrendingUp,
  Gift,
  Copy as CopyIcon,
  Mail,
  Share2,
  Trophy,
  Target,
  History as HistoryIcon,
} from 'lucide-react-native';

import { useToast } from '@/hooks/use-toast';

// ---------- Helpers ----------
const ProgressBar = ({ value, height = 12 }: { value: number; height?: number }) => {
  const pct = Math.max(0, Math.min(100, value || 0));
  return (
    <View style={[styles.progressOuter, { height }]}>
      <View style={[styles.progressInner, { width: `${pct}%` }]} />
    </View>
  );
};

// Clipboard (tries native, then expo, then web)
const copyToClipboard = async (text: string) => {
  try {
    const RNClipboard = require('@react-native-clipboard/clipboard').default;
    RNClipboard.setString(text);
    return;
  } catch {}
  try {
    const ExpoClipboard = require('expo-clipboard');
    if (ExpoClipboard?.setStringAsync) {
      await ExpoClipboard.setStringAsync(text);
      return;
    }
  } catch {}
  // Last resort (web only; RN won’t reach here typically)
  if (Platform.OS === 'web' && (navigator as any)?.clipboard?.writeText) {
    await (navigator as any).clipboard.writeText(text);
  } else {
    throw new Error('No clipboard module available on this platform.');
  }
};

type EnhancedPointsDashboardProps = { employerId: string };

const EnhancedPointsDashboard: React.FC<EnhancedPointsDashboardProps> = ({ employerId }) => {
  const [referralEmail, setReferralEmail] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Employer points
  const { data: pointsData, isLoading: pointsLoading } = useQuery({
    queryKey: ['employer-points', employerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employer_points')
        .select('*')
        .eq('employer_id', employerId)
        .single();

      if (error && (error as any).code !== 'PGRST116') throw error;
      return data || { current_balance: 0, points_earned: 0, points_used: 0 };
    },
  });

  // Tiers
  const { data: discountTiers } = useQuery({
    queryKey: ['discount-tiers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discount_tiers')
        .select('*')
        .order('points_required', { ascending: true });

      if (error) throw error;
      return data as Array<{
        id: string;
        tier_name: string;
        points_required: number;
        discount_percentage: number;
      }>;
    },
  });

  // Transactions
  const { data: transactions } = useQuery({
    queryKey: ['points-transactions', employerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('points_transactions')
        .select('*')
        .eq('employer_id', employerId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      return data as any[];
    },
  });

  // Referrals
  const { data: referrals } = useQuery({
    queryKey: ['employer-referrals', employerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employer_referrals')
        .select('*')
        .eq('referring_employer_id', employerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
  });

  // Send referral
  const sendReferralMutation = useMutation({
    mutationFn: async (email: string) => {
      const referralCode = `REF-${employerId.slice(0, 8)}-${Date.now()}`;

      // Create referral record
      const { data, error } = await supabase
        .from('employer_referrals')
        .insert({
          referring_employer_id: employerId,
          referred_employer_email: email,
          referral_code: referralCode,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      // Award initial points
      await supabase.from('points_transactions').insert({
        employer_id: employerId,
        transaction_type: 'earn',
        points_amount: 5,
        action_type: 'referral_sent',
        description: `Referral sent to ${email}`,
        reference_id: data.id,
        expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      });

      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Referral Sent',
        description: 'Referral invitation sent successfully! You earned 5 points.',
      });
      setReferralEmail('');
      queryClient.invalidateQueries({ queryKey: ['employer-referrals', employerId] });
      queryClient.invalidateQueries({ queryKey: ['points-transactions', employerId] });
      queryClient.invalidateQueries({ queryKey: ['employer-points', employerId] });
    },
  });

  const currentPoints = pointsData?.current_balance || 0;
  const currentTier = useMemo(
    () => discountTiers?.slice()?.reverse()?.find((t) => currentPoints >= t.points_required) || null,
    [discountTiers, currentPoints]
  );
  const nextTier = useMemo(
    () => discountTiers?.find((t) => currentPoints < t.points_required) || null,
    [discountTiers, currentPoints]
  );

  const copyReferralCode = async (code: string) => {
    try {
      await copyToClipboard(code);
      toast({ title: 'Copied!', description: 'Referral code copied to clipboard.' });
    } catch (e) {
      toast({
        title: 'Copy failed',
        description: 'Clipboard is unavailable on this device.',
        variant: 'destructive',
      });
    }
  };

  const shareReferralCode = async (code: string) => {
    const shareText = `Join our platform using my referral code: ${code}`;
    try {
      await Share.share({ message: shareText });
    } catch {
      await copyReferralCode(shareText);
    }
  };

  const totalReferrals = referrals?.length || 0;
  const signedUpReferrals =
    referrals?.filter((r) => r.status === 'registered' || r.status === 'job_posted').length || 0;
  const jobPostedReferrals = referrals?.filter((r) => r.status === 'job_posted').length || 0;

  if (pointsLoading) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading points data...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Overview */}
      <View style={styles.grid4}>
        <Card>
          <CardHeader>
            <View style={styles.headerRow}>
              <CardTitle>Current Points</CardTitle>
              <Award size={16} color="#3b82f6" />
            </View>
          </CardHeader>
          <CardContent>
            <Text style={styles.bigBlue}>{currentPoints}</Text>
            <Text style={styles.mutedXs}>Total earned: {pointsData?.points_earned || 0}</Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <View style={styles.headerRow}>
              <CardTitle>Current Discount</CardTitle>
              <Gift size={16} color="#10b981" />
            </View>
          </CardHeader>
          <CardContent>
            <Text style={styles.bigGreen}>{currentTier?.discount_percentage || 0}%</Text>
            <Text style={styles.mutedXs}>{currentTier ? currentTier.tier_name : 'No tier yet'}</Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <View style={styles.headerRow}>
              <CardTitle>Referral Funnel</CardTitle>
              <TrendingUp size={16} color="#8b5cf6" />
            </View>
          </CardHeader>
          <CardContent>
            <Text style={styles.boldMd}>
              {totalReferrals} → {signedUpReferrals} → {jobPostedReferrals}
            </Text>
            <Text style={styles.mutedXs}>Sent → Signed → Posted Job</Text>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <View style={styles.headerRow}>
              <CardTitle>Success Rate</CardTitle>
              <Target size={16} color="#f59e0b" />
            </View>
          </CardHeader>
          <CardContent>
            <Text style={styles.bigYellow}>
              {totalReferrals ? Math.round((jobPostedReferrals / totalReferrals) * 100) : 0}%
            </Text>
            <Text style={styles.mutedXs}>Referral to job conversion</Text>
          </CardContent>
        </Card>
      </View>

      {/* Next Tier */}
      {nextTier && (
        <Card>
          <CardHeader>
            <View style={styles.rowCenter}>
              <Trophy size={18} color="#2563eb" />
              <Text style={[styles.title, { marginLeft: 8 }]}>Progress to {nextTier.tier_name}</Text>
            </View>
          </CardHeader>
          <CardContent>
            <View style={{ gap: 8 }}>
              <View style={styles.rowBetween}>
                <Text style={styles.mutedSm}>{currentPoints} points</Text>
                <Text style={styles.mutedSm}>{nextTier.points_required} points needed</Text>
              </View>
              <ProgressBar value={(currentPoints / nextTier.points_required) * 100} height={12} />
              <View style={styles.rowBetween}>
                <Text style={styles.mutedSm}>
                  {nextTier.points_required - currentPoints} more points to unlock{' '}
                  {nextTier.discount_percentage}% discount
                </Text>
                <Badge variant="outline">Almost there!</Badge>
              </View>
            </View>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs
        tabs={['Earn Points', 'Referrals', 'History', 'Redeem']}
        tabContent={(i: any) => {
          switch (i) {
            case 0:
              return (
                <View style={{ gap: 12 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Ways to Earn Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={styles.grid2}>
                        <EarnCard title="Send Referral" note="When referral code is used" pts="5 pts" bg="#eff6ff" />
                        <EarnCard title="Successful Referral" note="They post job in 72h" pts="15 pts" bg="#ecfdf5" />
                        <EarnCard title="Post a Job" note="Each job posting" pts="5 pts" bg="#f5f3ff" />
                        <EarnCard title="Annual Subscription" note="Yearly commitment" pts="50 pts" bg="#fffbeb" />
                      </View>
                    </CardContent>
                  </Card>
                </View>
              );
            case 1:
              return (
                <View style={{ gap: 12 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Send New Referral</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={styles.row}>
                        <Input
                          placeholder="Enter employer email"
                          value={referralEmail}
                          onChangeText={setReferralEmail}
                          keyboardType="email-address"
                          style={{ flex: 1 }}
                        />
                        <Button
                          onPress={() => sendReferralMutation.mutate(referralEmail)}
                          disabled={!referralEmail || sendReferralMutation.isPending}
                          style={{ marginLeft: 8 }}
                          iconLeft={<Mail size={16} color="#fff" />}
                        >
                          Send (+5 pts)
                        </Button>
                      </View>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Your Referrals & Attribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={{ gap: 12 }}>
                        {referrals?.length ? (
                          referrals.map((ref: any) => (
                            <View key={ref.id} style={styles.referralItem}>
                              <View style={styles.rowBetween}>
                                <View>
                                  <Text style={styles.boldSm}>{ref.referred_employer_email}</Text>
                                  <Text style={styles.mutedSm}>Code: {ref.referral_code}</Text>
                                </View>
                                <View style={styles.row}>
                                  <Badge
                                    variant={
                                      ref.status === 'job_posted'
                                        ? 'default'
                                        : ref.status === 'registered'
                                        ? 'secondary'
                                        : 'outline'
                                    }
                                    style={{ marginRight: 6 }}
                                  >
                                    {ref.status}
                                  </Badge>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onPress={() => copyReferralCode(ref.referral_code)}
                                    iconLeft={<CopyIcon size={14} />}
                                  />
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onPress={() => shareReferralCode(ref.referral_code)}
                                    style={{ marginLeft: 6 }}
                                    iconLeft={<Share2 size={14} />}
                                  />
                                </View>
                              </View>

                              <View style={styles.rowWrapXs}>
                                <Text style={styles.mutedXs}>
                                  Sent: {new Date(ref.created_at).toLocaleDateString()}
                                </Text>
                                {ref.referred_employer_signup_date && (
                                  <Text style={styles.positiveXs}>
                                    • Signed up:{' '}
                                    {new Date(ref.referred_employer_signup_date).toLocaleDateString()}
                                  </Text>
                                )}
                                {ref.referred_employer_first_job_date && (
                                  <Text style={styles.infoXs}>
                                    • First job:{' '}
                                    {new Date(ref.referred_employer_first_job_date).toLocaleDateString()}
                                  </Text>
                                )}
                              </View>

                              <View style={styles.row}>
                                {ref.signup_points_awarded && (
                                  <Badge variant="outline" style={{ marginRight: 6 }}>
                                    ✓ Signup (+5 pts)
                                  </Badge>
                                )}
                                {ref.job_post_points_awarded && (
                                  <Badge variant="outline">✓ Job Posted (+15 pts)</Badge>
                                )}
                              </View>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.mutedCenter}>
                            No referrals sent yet. Start referring employers to earn points!
                          </Text>
                        )}
                      </View>
                    </CardContent>
                  </Card>
                </View>
              );
            case 2:
              return (
                <View style={{ gap: 12 }}>
                  <Card>
                    <CardHeader>
                      <View style={styles.rowBetween}>
                        <CardTitle>Detailed Points History</CardTitle>
                        <ModalDialog
                          trigger={
                            <Button variant="outline" size="sm" iconLeft={<HistoryIcon size={14} />}>
                              View All
                            </Button>
                          }
                          title="Complete Points History"
                        >
                          <View style={{ maxHeight: 420 }}>
                            {transactions?.map((t: any) => (
                              <View key={t.id} style={styles.txnItem}>
                                <View>
                                  <Text style={styles.boldSm}>
                                    {String(t.action_type || '').replace('_', ' ')}
                                  </Text>
                                  <Text style={styles.mutedSm}>{t.description}</Text>
                                  <Text style={styles.mutedXs}>
                                    {new Date(t.created_at).toLocaleString()}
                                  </Text>
                                </View>
                                <Badge
                                  variant={t.transaction_type === 'earn' ? 'default' : 'destructive'}
                                >
                                  {t.transaction_type === 'earn' ? '+' : '-'}
                                  {t.points_amount} pts
                                </Badge>
                              </View>
                            ))}
                          </View>
                        </ModalDialog>
                      </View>
                    </CardHeader>
                    <CardContent>
                      <View style={{ gap: 8 }}>
                        {transactions?.length ? (
                          transactions.slice(0, 10).map((t: any) => (
                            <View key={t.id} style={styles.txnItem}>
                              <View>
                                <Text style={styles.boldSm}>
                                  {String(t.action_type || '').replace('_', ' ')}
                                </Text>
                                <Text style={styles.mutedSm}>
                                  {t.description ||
                                    new Date(t.created_at).toLocaleDateString()}
                                </Text>
                              </View>
                              <Badge
                                variant={t.transaction_type === 'earn' ? 'default' : 'destructive'}
                              >
                                {t.transaction_type === 'earn' ? '+' : '-'}
                                {t.points_amount} pts
                              </Badge>
                            </View>
                          ))
                        ) : (
                          <Text style={styles.mutedCenter}>
                            No transactions yet. Start earning points by posting jobs and referring
                            employers!
                          </Text>
                        )}
                      </View>
                    </CardContent>
                  </Card>
                </View>
              );
            case 3:
              return (
                <View style={{ gap: 12 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Redeem Points for Discounts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <View style={{ gap: 12 }}>
                        {discountTiers?.map((tier) => {
                          const canRedeem = currentPoints >= tier.points_required;
                          const isCurrent = currentTier?.id === tier.id;

                          return (
                            <View
                              key={tier.id}
                              style={[
                                styles.redeemItem,
                                isCurrent
                                  ? styles.redeemCurrent
                                  : canRedeem
                                  ? styles.redeemReady
                                  : styles.redeemPending,
                              ]}
                            >
                              <View style={styles.rowBetween}>
                                <View>
                                  <Text style={styles.boldSm}>{tier.tier_name}</Text>
                                  <Text style={styles.mutedSm}>
                                    {tier.discount_percentage}% discount on subscriptions
                                  </Text>
                                  <Text style={styles.mutedXs}>
                                    Requires {tier.points_required} points
                                  </Text>
                                </View>
                                <View style={{ alignItems: 'flex-end' }}>
                                  {isCurrent ? (
                                    <Badge variant="default">Current Tier</Badge>
                                  ) : canRedeem ? (
                                    <Button size="sm">Apply Discount</Button>
                                  ) : (
                                    <Badge variant="outline">
                                      {tier.points_required - currentPoints} more pts
                                    </Badge>
                                  )}
                                </View>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    </CardContent>
                  </Card>
                </View>
              );
            default:
              return null;
          }
        }}
      />
    </ScrollView>
  );
};

// Small presentational card for “Earn” grid
const EarnCard = ({ title, note, pts, bg }: { title: string; note: string; pts: string; bg: string }) => {
  return (
    <View style={[styles.earnCard, { backgroundColor: bg }]}>
      <View>
        <Text style={styles.boldSm}>{title}</Text>
        <Text style={styles.mutedSm}>{note}</Text>
      </View>
      <Badge variant="secondary">{pts}</Badge>
    </View>
  );
};

export default EnhancedPointsDashboard;

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  grid4: {
    gap: 12,
  },
  grid2: {
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },

  bigBlue: { fontSize: 24, fontWeight: '700', color: '#2563eb' },
  bigGreen: { fontSize: 24, fontWeight: '700', color: '#16a34a' },
  bigYellow: { fontSize: 24, fontWeight: '700', color: '#ca8a04' },
  boldMd: { fontSize: 16, fontWeight: '700' },
  boldSm: { fontSize: 14, fontWeight: '600' },
  mutedSm: { fontSize: 12, color: '#6b7280' },
  mutedXs: { fontSize: 11, color: '#6b7280' },
  mutedCenter: { textAlign: 'center', color: '#6b7280' },

  progressOuter: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: 9999,
    overflow: 'hidden',
  },
  progressInner: {
    height: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 9999,
  },

  referralItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    gap: 6,
  },
  rowWrapXs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  positiveXs: { fontSize: 11, color: '#16a34a' },
  infoXs: { fontSize: 11, color: '#2563eb' },

  txnItem: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },

  redeemItem: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    borderColor: '#e5e7eb',
  },
  redeemCurrent: { backgroundColor: '#ecfdf5', borderColor: '#bbf7d0' },
  redeemReady: { backgroundColor: '#eff6ff', borderColor: '#bfdbfe' },
  redeemPending: { backgroundColor: '#f9fafb', borderColor: '#e5e7eb' },

  earnCard: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
