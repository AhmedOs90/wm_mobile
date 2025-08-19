// screens/employer/EmployerPoints.native.tsx
import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs } from '@/components/ui/tabs'; // your RN Tabs(tabs, initialTab, tabContent)
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Award,
  Gift,
  Users,
  TrendingUp,
  Star,
  Zap,
  Target,
  Calendar as CalendarIcon,
} from 'lucide-react-native';

// Tiny inline progress bar (0..100)
const ProgressBar = ({ value = 0, height = 12 }: { value?: number; height?: number }) => (
  <View
    style={{
      height,
      width: '100%',
      backgroundColor: '#E5E7EB',
      borderRadius: 999,
      overflow: 'hidden',
    }}
  >
    <View
      style={{
        height: '100%',
        width: `${Math.min(Math.max(value, 0), 100)}%`,
        backgroundColor: '#3B82F6',
      }}
    />
  </View>
);

const EmployerPoints: React.FC = () => {
  const tabs = ['Dashboard', 'History', 'Achievements', 'Rewards'];
  const [activeTab] = useState(0); // Tabs component controls itself via initialTab

  const pointsHistory = useMemo(
    () => [
      { date: '2025-01-15', action: 'Job posted', points: '+50', type: 'earned' },
      { date: '2025-01-14', action: 'Profile completion bonus', points: '+25', type: 'earned' },
      { date: '2025-01-13', action: 'Candidate unlocked', points: '-10', type: 'spent' },
      { date: '2025-01-12', action: 'Premium feature used', points: '-5', type: 'spent' },
      { date: '2025-01-11', action: 'Job featured', points: '-15', type: 'spent' },
    ],
    []
  );

  const achievements = useMemo(
    () => [
      { title: 'First Job Posted', description: 'Posted your first job listing', points: 50, completed: true, icon: Target },
      { title: 'Profile Master', description: 'Complete your company profile', points: 25, completed: true, icon: Star },
      { title: 'Early Bird', description: 'Post 5 jobs in your first month', points: 100, completed: false, icon: CalendarIcon },
      { title: 'Top Employer', description: 'Receive 50+ applications', points: 200, completed: false, icon: TrendingUp },
    ],
    []
  );

  const rewards = useMemo(
    () => [
      { name: 'Featured Job Listing', cost: 100, description: 'Highlight your job for 7 days', available: true },
      { name: 'Premium Support', cost: 50, description: '24/7 priority customer support', available: true },
      { name: 'Candidate Insights', cost: 25, description: 'Advanced analytics on applicants', available: true },
      { name: 'Brand Boost', cost: 200, description: 'Feature your company on homepage', available: false },
    ],
    []
  );

  // DASHBOARD
  const Dashboard = () => (
    <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
      {/* Header metric */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>Points & Rewards</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Award size={20} color="#EAB308" />
          <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827' }}>1,250 Points</Text>
        </View>
      </View>

      {/* Overview tiles */}
      <View style={{ gap: 12 }}>
        {/* Total Points */}
        <Card style={{ overflow: 'hidden', borderColor: '#FDE68A' }}>
          <LinearGradient colors={['#FFFBEB', '#FEF3C7']} style={{ padding: 16 }}>
            <CardContent className="p-0">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: '#4B5563' }}>Total Points</Text>
                  <Text style={{ fontSize: 28, fontWeight: '700', color: '#CA8A04' }}>1,250</Text>
                </View>
                <Award size={40} color="#EAB308" />
              </View>
            </CardContent>
          </LinearGradient>
        </Card>

        {/* This Month */}
        <Card style={{ overflow: 'hidden', borderColor: '#86EFAC' }}>
          <LinearGradient colors={['#ECFDF5', '#D1FAE5']} style={{ padding: 16 }}>
            <CardContent className="p-0">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: '#4B5563' }}>Points This Month</Text>
                  <Text style={{ fontSize: 28, fontWeight: '700', color: '#16A34A' }}>325</Text>
                </View>
                <TrendingUp size={40} color="#10B981" />
              </View>
            </CardContent>
          </LinearGradient>
        </Card>

        {/* Rank */}
        <Card style={{ overflow: 'hidden', borderColor: '#C4B5FD' }}>
          <LinearGradient colors={['#F5F3FF', '#EDE9FE']} style={{ padding: 16 }}>
            <CardContent className="p-0">
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ color: '#4B5563' }}>Rank</Text>
                  <Text style={{ fontSize: 28, fontWeight: '700', color: '#7C3AED' }}>#122</Text>
                </View>
                <Star size={40} color="#8B5CF6" />
              </View>
            </CardContent>
          </LinearGradient>
        </Card>
      </View>

      {/* Progress to Next Level */}
      <Card style={{ overflow: 'hidden', borderColor: '#BFDBFE' }}>
        <LinearGradient colors={['#EFF6FF', '#E0EAFF']} style={{ paddingBottom: 8 }}>
          <CardHeader>
            <CardTitle>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Zap size={18} color="#3B82F6" />
                <Text style={{ color: '#111827' }}>Progress to Silver Level</Text>
              </View>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text>Current: Bronze Level</Text>
                <Text>1,250 / 2,000 points</Text>
              </View>
              <ProgressBar value={62.5} />
              <Text style={{ color: '#4B5563' }}>
                Earn 750 more points to unlock Silver level benefits including priority support and enhanced job visibility.
              </Text>
            </View>
          </CardContent>
        </LinearGradient>
      </Card>

      {/* Quick Actions */}
      <Card style={{ overflow: 'hidden', borderColor: '#A5F3FC' }}>
        <LinearGradient colors={['#ECFEFF', '#E0F2FE']} style={{ paddingBottom: 8 }}>
          <CardHeader>
            <CardTitle>
              <Text>Quick Actions</Text>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 12,
                justifyContent: 'space-between',
              }}
            >
              <Button variant="outline" style={{ width: '48%', height: 80, alignItems: 'center', justifyContent: 'center' }}>
                <Target size={20} />
                <Text style={{ marginTop: 6, fontSize: 12 }}>Post Job (+50)</Text>
              </Button>
              <Button variant="outline" style={{ width: '48%', height: 80, alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
                <Text style={{ marginTop: 6, fontSize: 12 }}>Invite Candidates (+10)</Text>
              </Button>
              <Button variant="outline" style={{ width: '48%', height: 80, alignItems: 'center', justifyContent: 'center' }}>
                <Star size={20} />
                <Text style={{ marginTop: 6, fontSize: 12 }}>Rate Candidates (+5)</Text>
              </Button>
              <Button variant="outline" style={{ width: '48%', height: 80, alignItems: 'center', justifyContent: 'center' }}>
                <Gift size={20} />
                <Text style={{ marginTop: 6, fontSize: 12 }}>Refer Employer (+100)</Text>
              </Button>
            </View>
          </CardContent>
        </LinearGradient>
      </Card>
    </ScrollView>
  );

  // HISTORY
  const History = () => (
    <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
      <Card>
        <CardHeader>
          <CardTitle>
            <Text>Points History</Text>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <View style={{ gap: 12 }}>
            {pointsHistory.map((item, idx) => (
              <View
                key={`${item.date}-${idx}`}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: 12,
                  backgroundColor: '#F9FAFB',
                  borderRadius: 8,
                }}
              >
                <View>
                  <Text style={{ fontWeight: '600', color: '#111827' }}>{item.action}</Text>
                  <Text style={{ color: '#6B7280', fontSize: 12 }}>{item.date}</Text>
                </View>
                <Badge>
                  <Text style={{ color: item.type === 'earned' ? '#065F46' : '#991B1B' }}>{item.points}</Text>
                </Badge>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );

  // ACHIEVEMENTS
  const Achievements = () => (
    <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
      <View style={{ gap: 12 }}>
        {achievements.map((a, idx) => {
          const Icon = a.icon;
          const gradient = a.completed ? ['#ECFDF5', '#D1FAE5'] : ['#F9FAFB', '#F3F4F6'];
          const borderColor = a.completed ? '#86EFAC' : '#E5E7EB';

          return (
            <Card key={`${a.title}-${idx}`} style={{ overflow: 'hidden', borderColor }}>
              <LinearGradient colors={gradient} style={{ padding: 16 }}>
                <CardContent className="p-0">
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'flex-start' }}>
                    <View
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        backgroundColor: a.completed ? '#DCFCE7' : '#E5E7EB',
                      }}
                    >
                      <Icon size={22} color={a.completed ? '#16A34A' : '#6B7280'} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ fontWeight: '600', color: '#111827' }}>{a.title}</Text>
                        <Badge>
                          <Text>{a.points} pts</Text>
                        </Badge>
                      </View>
                      <Text style={{ color: '#4B5563', marginTop: 4 }}>{a.description}</Text>
                      {a.completed && (
                        <View
                          style={{
                            alignSelf: 'flex-start',
                            marginTop: 8,
                            paddingHorizontal: 8,
                            paddingVertical: 2,
                            backgroundColor: '#DCFCE7',
                            borderRadius: 999,
                          }}
                        >
                          <Text style={{ color: '#16A34A', fontSize: 12 }}>Completed</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </CardContent>
              </LinearGradient>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );

  // REWARDS
  const Rewards = () => (
    <ScrollView contentContainerStyle={{ gap: 16, paddingBottom: 16 }}>
      <View style={{ gap: 12 }}>
        {rewards.map((r, idx) => {
          const gradient = r.available ? ['#EFF6FF', '#E0EAFF'] : ['#F9FAFB', '#F3F4F6'];
          const borderColor = r.available ? '#BFDBFE' : '#E5E7EB';

          return (
            <Card key={`${r.name}-${idx}`} style={{ overflow: 'hidden', borderColor }}>
              <LinearGradient colors={gradient} style={{ padding: 16 }}>
                <CardContent className="p-0">
                  <View style={{ gap: 10 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ fontWeight: '600', color: '#111827' }}>{r.name}</Text>
                      <Badge>
                        <Text>{r.cost} pts</Text>
                      </Badge>
                    </View>
                    <Text style={{ color: '#4B5563' }}>{r.description}</Text>
                    <Button disabled={!r.available} style={{ opacity: r.available ? 1 : 0.5 }}>
                      {r.available ? 'Redeem' : 'Not Available'}
                    </Button>
                  </View>
                </CardContent>
              </LinearGradient>
            </Card>
          );
        })}
      </View>
    </ScrollView>
  );

  return (
    <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 12 }}>
      <Tabs
        tabs={tabs}
        initialTab={activeTab}
        tabContent={(index) => {
          switch (index) {
            case 0: return <Dashboard />;
            case 1: return <History />;
            case 2: return <Achievements />;
            case 3: return <Rewards />;
            default: return null;
          }
        }}
      />
    </View>
  );
};

export default EmployerPoints;
