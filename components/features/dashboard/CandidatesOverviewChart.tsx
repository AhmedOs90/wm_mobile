// CandidatesOverviewChart.tsx
import React from "react";
import { View, useWindowDimensions } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react-native";
import { BarChart } from "react-native-chart-kit";

const CandidatesOverviewChart = () => {
  const candidatesData = [
    { name: "CV Uploaded", value: 87, color: "#8b5cf6" },
    { name: "Applied Jobs", value: 64, color: "#06b6d4" },
    { name: "Visits", value: 22, color: "#f59e0b" },
  ];

  const labels = candidatesData.map((d) => d.name);
  const values = candidatesData.map((d) => d.value);

  const { width } = useWindowDimensions();
  // leave a little padding so bars don't touch card edges
  const chartWidth = Math.max(320, width - 48);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex-row items-center gap-2">
          <Users size={20} color="#a855f7" />{/* purple-500 */}
          <View className="ml-2" />
          Candidates Overview
        </CardTitle>
      </CardHeader>

      <CardContent>
        <BarChart
          width={chartWidth}
          height={300}
          data={{
            labels,
            datasets: [{ data: values }],
          }}
          fromZero
          showValuesOnTopOfBars
          withInnerLines
          withHorizontalLabels
          // Single purple color like the web version's <Bar fill="#8b5cf6" />
          chartConfig={{
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(139, 92, 246, ${opacity})`, // purple bars/axes
            labelColor: (opacity = 1) => `rgba(113, 113, 122, ${opacity})`, // zinc-500-ish
            propsForBackgroundLines: {
              strokeDasharray: "3 3",
              strokeOpacity: 0.3,
            },
            propsForHorizontalLabels: {
              // keep labels neat on small screens
              fontSize: 12,
            },
          }}
          style={{
            borderRadius: 8,
          }}
          yAxisInterval={1} 
          yAxisLabel={""} 
          yAxisSuffix={""}       
             // Rounded tops like radius={[4,4,0,0]}
          // (supported in recent versions of chart-kit)
          // barRadius is not supported by BarChart
        />
      </CardContent>
    </Card>
  );
};

export default CandidatesOverviewChart;
