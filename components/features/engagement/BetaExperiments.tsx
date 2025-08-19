// BetaExperiments.native.tsx
import { useState } from 'react';
import { View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Select from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ModalDialog } from '@/components/ui/dialog'; // your Modal wrapper
import { useToast } from '@/hooks/use-toast';
import {
  TestTube,
  Users,
  BarChart3,
  Settings,
  Plus,
  Play,
  Pause,
  Square,
  Eye,
} from 'lucide-react-native';

interface Experiment {
  id: string;
  name: string;
  description: string;
  feature_key: string;
  status: string;
  start_date: string;
  end_date?: string;
  target_percentage: number;
  success_metric: string;
  current_users: number;
  conversion_rate?: number;
  created_at: string;
}

const BetaExperiments = () => {
  const [experimentName, setExperimentName] = useState('');
  const [experimentDesc, setExperimentDesc] = useState('');
  const [featureKey, setFeatureKey] = useState('');
  const [targetPercentage, setTargetPercentage] = useState('10');
  const [successMetric, setSuccessMetric] = useState('engagement');
  const { toast } = useToast();

  const [experiments] = useState<Experiment[]>([
    {
      id: '1',
      name: 'Emoji Reactions',
      description: 'Allow users to react to forum posts with emojis',
      feature_key: 'emoji_reactions',
      status: 'active',
      start_date: '2024-01-15',
      end_date: '2024-02-15',
      target_percentage: 25,
      success_metric: 'engagement',
      current_users: 234,
      conversion_rate: 15.6,
      created_at: '2024-01-15',
    },
    {
      id: '2',
      name: 'AI Job Matching',
      description: 'AI-powered job recommendations based on user profile',
      feature_key: 'ai_job_matching',
      status: 'planned',
      start_date: '2024-02-01',
      target_percentage: 50,
      success_metric: 'applications',
      current_users: 0,
      created_at: '2024-01-20',
    },
    {
      id: '3',
      name: 'Voice Messages',
      description: 'Allow voice messages in chat system',
      feature_key: 'voice_messages',
      status: 'paused',
      start_date: '2024-01-10',
      target_percentage: 15,
      success_metric: 'messages_sent',
      current_users: 89,
      conversion_rate: 8.2,
      created_at: '2024-01-10',
    },
  ]);

  const [featureFlags] = useState([
    { key: 'emoji_reactions', name: 'Emoji Reactions', enabled: true, cohort: 'beta_users' },
    { key: 'ai_job_matching', name: 'AI Job Matching', enabled: false, cohort: 'premium_users' },
    { key: 'voice_messages', name: 'Voice Messages', enabled: false, cohort: 'power_users' },
    { key: 'advanced_search', name: 'Advanced Search', enabled: true, cohort: 'all' },
    { key: 'dark_mode', name: 'Dark Mode', enabled: true, cohort: 'all' },
    { key: 'notification_sounds', name: 'Notification Sounds', enabled: false, cohort: 'mobile_users' },
  ]);

  const createExperiment = () => {
    toast({
      title: 'Experiment Created',
      description: 'New beta experiment has been created and will start soon.',
    });
    setExperimentName('');
    setExperimentDesc('');
    setFeatureKey('');
    setTargetPercentage('10');
    setSuccessMetric('engagement');
  };

  const toggleExperiment = (experimentId: string, action: string) => {
    toast({
      title: 'Experiment Updated',
      description: `Experiment has been ${action}.`,
    });
  };

  const toggleFeatureFlag = (key: string) => {
    toast({
      title: 'Feature Flag Updated',
      description: `Feature flag for ${key} has been toggled.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'planned':
        return 'secondary';
      case 'paused':
        return 'outline';
      case 'completed':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const percentageOptions = [
    { label: '5%', value: '5' },
    { label: '10%', value: '10' },
    { label: '25%', value: '25' },
    { label: '50%', value: '50' },
  ];

  const metricOptions = [
    { label: 'User Engagement', value: 'engagement' },
    { label: 'User Retention', value: 'retention' },
    { label: 'Job Applications', value: 'applications' },
    { label: 'Messages Sent', value: 'messages' },
  ];

  const avgConv = (() => {
    const withConv = experiments.filter((e) => typeof e.conversion_rate === 'number');
    if (!withConv.length) return 0;
    const total = withConv.reduce((s, e) => s + (e.conversion_rate as number), 0);
    return Math.round((total / withConv.length) * 10) / 10;
  })();

  return (
    <View className="space-y-6">
      {/* Overview Cards */}
      <View className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
            <TestTube size={16} color="#6b7280" />
          </CardHeader>
          <CardContent>
            <View className="text-2xl font-bold">
              <Button variant="ghost" textStyle={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
                {experiments.filter((e) => e.status === 'active').length}
              </Button>
            </View>
            <View>
              <Button variant="ghost" textStyle={{ fontSize: 12, color: '#6b7280' }}>
                Total: {experiments.length}
              </Button>
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Beta Users</CardTitle>
            <Users size={16} color="#6b7280" />
          </CardHeader>
          <CardContent>
            <Button variant="ghost" textStyle={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
              {experiments.reduce((sum, exp) => sum + exp.current_users, 0)}
            </Button>
            <Button variant="ghost" textStyle={{ fontSize: 12, color: '#6b7280' }}>
              Across all experiments
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Conversion</CardTitle>
            <BarChart3 size={16} color="#6b7280" />
          </CardHeader>
          <CardContent>
            <Button variant="ghost" textStyle={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
              {avgConv}%
            </Button>
            <Button variant="ghost" textStyle={{ fontSize: 12, color: '#6b7280' }}>
              Success rate
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feature Flags</CardTitle>
            <Settings size={16} color="#6b7280" />
          </CardHeader>
          <CardContent>
            <Button variant="ghost" textStyle={{ fontSize: 24, fontWeight: '700', color: '#111827' }}>
              {featureFlags.filter((f) => f.enabled).length}
            </Button>
            <Button variant="ghost" textStyle={{ fontSize: 12, color: '#6b7280' }}>
              Enabled of {featureFlags.length}
            </Button>
          </CardContent>
        </Card>
      </View>

      {/* Experiments Management */}
      <Card>
        <CardHeader>
          <View className="flex flex-row items-center justify-between">
            <CardTitle>Beta Experiments</CardTitle>

            <ModalDialog
              title="Create New Beta Experiment"
              trigger={
                <Button>
                  <Plus size={16} />
                  Create Experiment
                </Button>
              }
            >
              <View className="space-y-4">
                <View>
                  <Label>Experiment Name</Label>
                  <Input
                    value={experimentName}
                    onChangeText={setExperimentName}
                    placeholder="Enter experiment name"
                  />
                </View>

                <View>
                  <Label>Description</Label>
                  <Textarea
                    value={experimentDesc}
                    onChangeText={setExperimentDesc}
                    placeholder="Describe the experiment"
                  />
                </View>

                <View>
                  <Label>Feature Key</Label>
                  <Input
                    value={featureKey}
                    onChangeText={setFeatureKey}
                    placeholder="e.g., new_dashboard_layout"
                  />
                </View>

                <View>
                  <Label>Target User Percentage</Label>
                  <Select
                    data={percentageOptions}
                    value={targetPercentage}
                    onChange={(item) => setTargetPercentage(String(item.value))}
                    placeholder="Select percentage"
                  />
                </View>

                <View>
                  <Label>Success Metric</Label>
                  <Select
                    data={metricOptions}
                    value={successMetric}
                    onChange={(item) => setSuccessMetric(String(item.value))}
                    placeholder="Select metric"
                  />
                </View>

                <Button
                  onPress={createExperiment}
                  disabled={!experimentName || !featureKey}
                  style={{ width: '100%' }}
                >
                  Create Experiment
                </Button>
              </View>
            </ModalDialog>
          </View>
        </CardHeader>

        <CardContent>
          <View className="space-y-4">
            {experiments.map((experiment) => (
              <View key={experiment.id} className="p-4 border rounded-lg">
                <View className="flex flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Button variant="ghost" textStyle={{ fontWeight: '600', color: '#111827' }}>
                      {experiment.name}
                    </Button>
                    <Button
                      variant="ghost"
                      textStyle={{ fontSize: 12, color: '#6b7280', textAlign: 'left' }}
                    >
                      {experiment.description}
                    </Button>

                    <View className="flex flex-row items-center gap-2 mt-2">
                      <Badge variant={getStatusColor(experiment.status)}>{experiment.status}</Badge>
                      <Button variant="ghost" textStyle={{ fontSize: 12, color: '#6b7280' }}>
                        {experiment.target_percentage}% of users
                      </Button>
                      {typeof experiment.conversion_rate === 'number' && (
                        <Button variant="ghost" textStyle={{ fontSize: 12, color: '#6b7280' }}>
                          {experiment.conversion_rate}% conversion
                        </Button>
                      )}
                    </View>
                  </View>

                  <View className="flex flex-row gap-2">
                    {experiment.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => toggleExperiment(experiment.id, 'paused')}
                      >
                        <Pause size={16} />
                      </Button>
                    )}
                    {experiment.status === 'paused' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => toggleExperiment(experiment.id, 'resumed')}
                      >
                        <Play size={16} />
                      </Button>
                    )}
                    {experiment.status === 'planned' && (
                      <Button
                        variant="default"
                        size="sm"
                        onPress={() => toggleExperiment(experiment.id, 'started')}
                      >
                        <Play size={16} />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => toggleExperiment(experiment.id, 'stopped')}
                    >
                      <Square size={16} />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye size={16} />
                    </Button>
                  </View>
                </View>

                <View className="grid grid-cols-3 gap-4">
                  <View>
                    <Button variant="ghost" textStyle={{ color: '#6b7280' }}>
                      Current Users:
                    </Button>
                    <Button variant="ghost" textStyle={{ fontWeight: '600', color: '#111827' }}>
                      {experiment.current_users}
                    </Button>
                  </View>
                  <View>
                    <Button variant="ghost" textStyle={{ color: '#6b7280' }}>
                      Start Date:
                    </Button>
                    <Button variant="ghost" textStyle={{ fontWeight: '600', color: '#111827' }}>
                      {new Date(experiment.start_date).toLocaleDateString()}
                    </Button>
                  </View>
                  <View>
                    <Button variant="ghost" textStyle={{ color: '#6b7280' }}>
                      Success Metric:
                    </Button>
                    <Button variant="ghost" textStyle={{ fontWeight: '600', color: '#111827' }}>
                      {experiment.success_metric}
                    </Button>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card>
        <CardHeader>
          <CardTitle>Feature Flags Management</CardTitle>
        </CardHeader>
        <CardContent>
          <View className="space-y-4">
            {featureFlags.map((flag) => (
              <View key={flag.key} className="flex flex-row items-center justify-between p-3 border rounded-lg">
                <View>
                  <Button variant="ghost" textStyle={{ fontWeight: '600', color: '#111827' }}>
                    {flag.name}
                  </Button>
                  <Button variant="ghost" textStyle={{ fontSize: 12, color: '#6b7280' }}>
                    Key: {flag.key} • Cohort: {flag.cohort}
                  </Button>
                </View>
                <View className="flex flex-row items-center gap-3">
                  <Badge variant={flag.enabled ? 'default' : 'secondary'}>
                    {flag.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                  <Switch
                    value={flag.enabled}
                    onValueChange={() => toggleFeatureFlag(flag.key)}
                  />
                </View>
              </View>
            ))}
          </View>
        </CardContent>
      </Card>
    </View>
  );
};

export default BetaExperiments;
