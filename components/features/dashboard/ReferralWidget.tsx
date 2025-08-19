import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface ReferralWidgetProps {
  companyId?: string;
}

const ReferralWidget = ({ companyId }: ReferralWidgetProps) => {
  const { data: referralStats, isLoading } = useQuery({
    queryKey: ['referral-stats', companyId],
    queryFn: async () => {
      if (!companyId) return null;
      
      // Mock referral stats
      const outgoingStats = {
        total: 12,
        pending: 3,
        accepted: 8,
        rejected: 1,
      };

      const incomingStats = {
        total: 8,
        pending: 2,
        accepted: 5,
        rejected: 1,
      };

      return { outgoing: outgoingStats, incoming: incomingStats };
    },
    enabled: !!companyId,
  });

  if (isLoading || !referralStats) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Outgoing Referrals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Outgoing Referrals
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{referralStats.outgoing.total}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {referralStats.outgoing.pending} Pending
            </Badge>
            <Badge variant="default" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              {referralStats.outgoing.accepted} Accepted
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Candidates you've referred to other companies
          </p>
        </CardContent>
      </Card>

      {/* Incoming Referrals */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Incoming Referrals
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{referralStats.incoming.total}</div>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {referralStats.incoming.pending} Pending
            </Badge>
            <Badge variant="default" className="text-xs">
              <CheckCircle className="h-3 w-3 mr-1" />
              {referralStats.incoming.accepted} Accepted
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Candidates referred to your company
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralWidget;
