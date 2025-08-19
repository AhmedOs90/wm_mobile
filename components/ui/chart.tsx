import React from "react";
import { View, Dimensions, Text } from "react-native";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export type ChartType = "line" | "bar" | "pie";

interface ChartProps {
  type: ChartType;
  data: any;
  config?: any;
  width?: number;
  height?: number;
  withLegend?: boolean;
  label?: string;
}

const defaultConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

const ChartContainer = ({
  type,
  data,
  config = {},
  width = screenWidth - 32,
  height = 220,
  withLegend = true,
  label,
}: ChartProps) => {
  const chartConfig = { ...defaultConfig, ...config };

  const renderChart = () => {
    switch (type) {
      case "line":
        return (
          <LineChart
            data={data}
            width={width}
            height={height}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16 }}
          />
        );
      case "bar":
  return (
    <BarChart
      data={data}
      width={width}
      height={height}
      chartConfig={chartConfig}
      yAxisLabel={chartConfig.yAxisLabel || ""}
      yAxisSuffix={chartConfig.yAxisSuffix || ""}
      style={{ borderRadius: 16 }}
    />
  );

      case "pie":
        return (
          <PieChart
            data={data}
            width={width}
            height={height}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ alignItems: "center", marginVertical: 16 }}>
{label && (
  <View style={{ marginBottom: 8 }}>
    <Text style={{ fontWeight: "bold", textAlign: "center" }}>{label}</Text>
    {data.legend &&
      data.legend.map((legendItem: string, idx: number) => (
        <Text key={idx} style={{ fontSize: 12, color: "#555", textAlign: "center" }}>
          {legendItem}
        </Text>
      ))}
  </View>
)}
      {renderChart()}
    </View>
  );
};

export default ChartContainer;
