// ReferralHistory.tsx (React Native)
import React from 'react';
import { View, Text } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/mockSupabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components//ui/scroll-area'; // RN version you provided
import { Users, ArrowRight, Calendar } from 'lucide-react-native';

interface Referral {
  id: string;
  position_title: string;
  notes: string | null;
  status: 'accepted' | 'rejected' | 'pending' | string;
  created_at: string;
  candidate: {
    name: string;
    position: string | null;
  };
  target_company: { name: string };
  referring_company: { name: string };
}

interface ReferralHistoryProps {
  companyId?: string;
  candidateId?: string;
  type?: 'outgoing' | 'incoming' | 'candidate';
}

const ReferralHistory = ({ companyId, candidateId, type = 'outgoing' }: ReferralHistoryProps) => {
  const { data: referrals, isLoading } = useQuery({
    queryKey: ['referrals', companyId, candidateId, type],
    queryFn: async () => {
      let query = supabase
        .from('referrals')
        .select(`
          id,
          position_title,
          notes,
          status,
          created_at,
          candidate:candidates(name, position),
          target_company:companies!referrals_target_company_id_fkey(name),
          referring_company:companies!referrals_referring_company_id_fkey(name)
        `)
        .order('created_at', { ascending: false });

      if (type === 'outgoing' && companyId) {
        query = query.eq('referring_company_id', companyId);
      } else if (type === 'incoming' && companyId) {
        query = query.eq('target_company_id', companyId);
      } else if (type === 'candidate' && candidateId) {
        query = query.eq('candidate_id', candidateId);
      }

      // Your mock is a thenable; await works fine.
      const { data, error } = await query;
      if (error) throw error;
      return data as Referral[];
    },
    enabled: !!(companyId || candidateId),
  });

  const getStatusVariant = (status: Referral['status']) => {
    switch (status) {
      case 'accepted':
        return 'default' as const;
      case 'rejected':
        return 'destructive' as const;
      case 'pending':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'outgoing':
        return 'Outgoing Referrals';
      case 'incoming':
        return 'Incoming Referrals';
      case 'candidate':
        return 'Referral History';
      default:
        return 'Referrals';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <View className="flex-row items-center gap-2">
            <Users size={20} />
            <CardTitle>{getTitle()}</CardTitle>
          </View>
        </CardHeader>
        <CardContent>
          <View className="items-center py-8">
            <Text>Loading referrals...</Text>
          </View>
        </CardContent>
      </Card>
    );
  }

  const empty = !referrals || referrals.length === 0;

  return (
    <Card>
      <CardHeader>
        <View className="flex-row items-center gap-2">
          <Users size={20} />
          <CardTitle>{getTitle()}</CardTitle>
          {!empty ? <Badge variant="secondary">{String(referrals!.length)}</Badge> : null}
        </View>
      </CardHeader>

      <CardContent>
        {empty ? (
          <View className="items-center py-8">
            <Text className="text-muted-foreground">No referrals found</Text>
          </View>
        ) : (
          <ScrollArea containerStyle={{ height: 384 }}>
            <View className="gap-4">
              {referrals!.map((referral) => (
                <View key={referral.id} className="p-4 border rounded-lg gap-3">
                  {/* Top row: candidate + status */}
                  <View className="flex-row items-start justify-between">
                    <View className="gap-1">
                      <Text className="font-medium">{referral.candidate.name}</Text>
                      {referral.candidate.position ? (
                        <Text className="text-sm text-muted-foreground">
                          {referral.candidate.position}
                        </Text>
                      ) : null}
                    </View>
                    <Badge variant={getStatusVariant(referral.status)}>
                      {referral.status}
                    </Badge>
                  </View>

                  {/* Companies row */}
                  <View className="flex-row items-center gap-2">
                    <Text className="text-sm font-medium">{referral.referring_company.name}</Text>
                    <ArrowRight size={16} />
                    <Text className="text-sm font-medium">{referral.target_company.name}</Text>
                  </View>

                  {/* Details */}
                  <View className="gap-2">
                    <View className="flex-row">
                      <Text className="text-sm font-medium">Position: </Text>
                      <Text className="text-sm">{referral.position_title}</Text>
                    </View>

                    {referral.notes ? (
                      <View>
                        <Text className="text-sm font-medium">Notes:</Text>
                        <Text className="text-sm text-muted-foreground mt-1">{referral.notes}</Text>
                      </View>
                    ) : null}

                    <View className="flex-row items-center gap-1">
                      <Calendar size={12} />
                      <Text className="text-xs text-muted-foreground">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferralHistory;
