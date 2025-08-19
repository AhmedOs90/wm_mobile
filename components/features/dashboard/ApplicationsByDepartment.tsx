// ApplicationsByDepartment.tsx
import React, { useMemo } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react-native";
import { PolarChart, Pie } from "victory-native";

const ApplicationsByDepartment = () => {
  const departmentData = [
    { name: "Engineering",      value: 120, color: "#3b82f6" },
    { name: "Marketing",        value: 110, color: "#10b981" },
    { name: "Sales",            value: 95,  color: "#f59e0b" },
    { name: "Customer Support", value: 85,  color: "#8b5cf6" },
    { name: "Finance",          value: 65,  color: "#ef4444" },
    { name: "Human Resources",  value: 50,  color: "#06b6d4" },
  ];

  const total = useMemo(
    () => departmentData.reduce((sum, it) => sum + it.value, 0),
    []
  );

  const { width } = useWindowDimensions();
  // keep it responsive but within a nice range
  const chartSize = Math.min(Math.max(width * 0.35, 220), 280);

  return (
    <Card>
      <CardHeader>
        <View className="flex-row items-center gap-2">
          <Building2 size={20} color="#3b82f6" />
          <CardTitle>Application by Department</CardTitle>
        </View>
      </CardHeader>

      <CardContent>
        <View className="flex-row items-center justify-between">
          {/* Chart + center total */}
          <View style={{ width: chartSize, height: chartSize }}>
            <PolarChart
              data={departmentData}
              colorKey="color"            // tell PolarChart which field is the color
                valueKey="value"         // value accessor
                labelKey="name"           // label accessor
              // width and height are removed as they are not valid props
            >
              <Pie.Chart
                innerRadius={chartSize * 0.25}
                // No labels are rendered as we show the legend instead
              />
            </PolarChart>

            {/* center total overlay */}
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                inset: 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text className="text-2xl font-bold text-foreground">{total}</Text>
              <Text className="text-sm text-muted-foreground">Total Applications</Text>
            </View>
          </View>

          {/* Legend */}
          <View className="ml-4" style={{ flex: 1 }}>
            {departmentData.map((item, idx) => (
              <View key={idx} className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  />
                  <Text className="text-sm text-muted-foreground">{item.name}</Text>
                </View>
                <Text className="text-sm font-medium text-foreground">{item.value}</Text>
              </View>
            ))}
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default ApplicationsByDepartment;
