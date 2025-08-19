// CandidateInsights.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Users, TrendingUp, UserCheck, Clock } from 'lucide-react-native';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
  CartesianChart,
  Line,
  Bar,
  CartesianAxis,
  PolarChart,
  Pie,
} from 'victory-native';

// import { useFont } from '@shopify/react-native-skia';
// ⬇️ Replace with a real TTF in your project, e.g. /assets/fonts/Inter-Medium.ttf
// import inter from '@/assets/fonts/Inter-Medium.ttf';

const CandidateInsights = () => {
  // const font = useFont(inter, 10);

  const registrationTrends = [
    { month: 'Jan', count: 245 },
    { month: 'Feb', count: 289 },
    { month: 'Mar', count: 356 },
    { month: 'Apr', count: 423 },
    { month: 'May', count: 398 },
    { month: 'Jun', count: 567 },
  ];

  const skillDistribution = [
    { skill: 'JavaScript', count: 234, color: '#3b82f6' },
    { skill: 'Python', count: 189, color: '#10b981' },
    { skill: 'React', count: 167, color: '#f59e0b' },
    { skill: 'Node.js', count: 145, color: '#ef4444' },
    { skill: 'SQL', count: 123, color: '#8b5cf6' },
  ];

  const experienceLevels = [
    { level: 'Entry Level', count: 423, color: '#06b6d4' },
    { level: 'Mid Level', count: 567, color: '#10b981' },
    { level: 'Senior Level', count: 234, color: '#f59e0b' },
    { level: 'Expert Level', count: 89, color: '#ef4444' },
  ];

  const locationData = [
    { country: 'Egypt', count: 2340 },
    { country: 'UAE', count: 1567 },
    { country: 'Saudi Arabia', count: 1234 },
    { country: 'Jordan', count: 987 },
    { country: 'Lebanon', count: 678 },
  ];

  return (
    <View className="space-y-6">
      {/* Key Metrics */}
      <View className="gap-4">
        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-gray-600">Total Candidates</Text>
                <Text className="text-2xl font-bold">6,847</Text>
                <Text className="text-xs text-green-600">+12.5% this month</Text>
              </View>
              <Users size={32} color="#3b82f6" />
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-gray-600">Active Candidates</Text>
                <Text className="text-2xl font-bold">4,239</Text>
                <Text className="text-xs text-green-600">61.9% activity rate</Text>
              </View>
              <UserCheck size={32} color="#10b981" />
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-gray-600">Profile Completion</Text>
                <Text className="text-2xl font-bold">78.4%</Text>
                <Text className="text-xs text-yellow-600">Average completion</Text>
              </View>
              <TrendingUp size={32} color="#8b5cf6" />
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-sm text-gray-600">Avg Response Time</Text>
                <Text className="text-2xl font-bold">2.3h</Text>
                <Text className="text-xs text-blue-600">To job applications</Text>
              </View>
              <Clock size={32} color="#f59e0b" />
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Registration Trends (Line) */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <View style={{ height: 300, paddingHorizontal: 12 }}>
            <CartesianChart
              data={registrationTrends}
              xKey="month"
              yKeys={['count']}
              domainPadding={{ left: 16, right: 16, top: 8, bottom: 8 }}
              padding={{ left: 12, right: 12, top: 8, bottom: 18 }}
            >
              {({
                points,
                chartBounds,
                xScale,
                yScale,
                xTicks,
                yTicks,
              }) => (
                <>
                  <CartesianAxis
                    xScale={xScale}
                    yScale={yScale}
                    xTicksNormalized={xTicks}
                    yTicksNormalized ={yTicks}
                    // font={font}
                    labelColor="#64748b"
                    formatXLabel={(v) => String(v)}
                    formatYLabel={(v) => String(v)}
                  />
                  <Line points={points.count} />
                </>
              )}
            </CartesianChart>
          </View>
        </CardContent>
      </Card>

      {/* Experience Level Distribution (Pie via PolarChart) */}
      <Card>
        <CardHeader>
          <CardTitle>Experience Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <View style={{ height: 300, alignItems: 'center', justifyContent: 'center' }}>
            <PolarChart
              data={experienceLevels}
              labelKey="level"
              valueKey="count"
              colorKey="color"
            >
              <Pie.Chart>
                {/* Optional:
                <Pie.Slice>
                  <Pie.Label font={font} color="#0f172a" />
                </Pie.Slice>
                */}
              </Pie.Chart>
            </PolarChart>
          </View>
        </CardContent>
      </Card>

      {/* Top Skills in Demand (Bar) */}
      <Card>
        <CardHeader>
          <CardTitle>Top Skills in Demand</CardTitle>
        </CardHeader>
        <CardContent>
          <View style={{ height: 300, paddingHorizontal: 12 }}>
            <CartesianChart
              data={skillDistribution}
              xKey="skill"
              yKeys={['count']}
              domainPadding={{ left: 16, right: 16, top: 4, bottom: 8 }}
              padding={{ left: 12, right: 12, top: 8, bottom: 18 }}
            >
              {({
                points,
                chartBounds,
                xScale,
                yScale,
                xTicks,
                yTicks,
              }) => (
                <>
                  <CartesianAxis
                    xScale={xScale}
                    yScale={yScale}
                    xTicksNormalized={xTicks}
                    yTicksNormalized={yTicks}
                    // font={font}
                    labelColor="#64748b"
                    formatXLabel={(v) => String(v)}
                    formatYLabel={(v) => String(v)}
                  />
                  <Bar
                    points={points.count}
                    chartBounds={chartBounds}         // ✅ required
                    // Optional spacing/size:
                    // innerPadding={0.25}
                    // barCount={skillDistribution.length}
                    // barWidth={12}
                    // Optional rounded caps:
                    // roundedCorners={{ topLeft: 6, topRight: 6, bottomLeft: 0, bottomRight: 0 }}
                    // Optional single color for all bars:
                    // color="#3b82f6"
                    // Optional labels above bars:
                    // labels={{ font, color: '#0f172a', formatter: (p) => String(p.yValue) }}
                  />
                </>
              )}
            </CartesianChart>
          </View>
        </CardContent>
      </Card>

      {/* Candidates by Location (Bar) */}
      <Card>
        <CardHeader>
          <CardTitle>Candidates by Location</CardTitle>
        </CardHeader>
        <CardContent>
          <View style={{ height: 300, paddingHorizontal: 12 }}>
            <CartesianChart
              data={locationData}
              xKey="country"
              yKeys={['count']}
              domainPadding={{ left: 16, right: 16, top: 4, bottom: 8 }}
              padding={{ left: 12, right: 12, top: 8, bottom: 18 }}
            >
              {({
                points,
                chartBounds,
                xScale,
                yScale,
                xTicks,
                yTicks,
              }) => (
                <>
                  <CartesianAxis
                    xScale={xScale}
                    yScale={yScale}
                    xTicksNormalized={xTicks}
                    yTicksNormalized={yTicks}
                    // font={font}
                    labelColor="#64748b"
                    formatXLabel={(v) => String(v)}
                    formatYLabel={(v) => String(v)}
                  />
                  <Bar
                    points={points.count}
                    chartBounds={chartBounds}         // ✅ required
                    // innerPadding={0.25}
                    // barCount={locationData.length}
                    // roundedCorners={{ topLeft: 6, topRight: 6 }}
                  />
                </>
              )}
            </CartesianChart>
          </View>
        </CardContent>
      </Card>

      {/* Additional Insights (plain text KPIs) */}
      <View className="gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Application Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <Row label="Applications Sent" value="12,456" />
              <Row label="Interviews Secured" value="2,847 (22.9%)" valueClassName="text-blue-600" />
              <Row label="Job Offers Received" value="945 (7.6%)" valueClassName="text-green-600" />
              <Row label="Jobs Accepted" value="721 (5.8%)" valueClassName="text-purple-600" />
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Profile Quality Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <Row label="Complete Profiles" value="5,367 (78.4%)" valueClassName="text-green-600" />
              <Row label="With Profile Photo" value="4,239 (61.9%)" />
              <Row label="CV Uploaded" value="5,891 (86.1%)" />
              <Row label="Skills Added" value="6,123 (89.4%)" />
            </View>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <View className="space-y-3">
              <Row label="Daily Active Users" value="1,847" />
              <Row label="Weekly Active Users" value="4,239" />
              <Row label="Monthly Active Users" value="6,123" />
              <Row label="Avg Session Duration" value="12.4 min" valueClassName="text-blue-600" />
            </View>
          </CardContent>
        </Card>
      </View>
    </View>
  );
};

// Small helper for KPI rows
const Row = ({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <View className="flex-row justify-between items-center">
    <Text>{label}</Text>
    <Text className={`font-bold ${valueClassName || ''}`}>{value}</Text>
  </View>
);

export default CandidateInsights;
