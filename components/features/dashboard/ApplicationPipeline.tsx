// ApplicationPipeline.tsx
import React, { useMemo } from "react";
import { View, Text, useWindowDimensions } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, FileText, UserCheck, CheckCircle, XCircle } from "lucide-react-native";
import { cn } from "@/lib/utils";

type ChangeType = "up" | "down";

interface PipelineItem {
  title: string;
  value: string;
  change: string;
  changeType: ChangeType;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: "blue" | "yellow" | "green" | "red"; // base color key
  bgTone?: "50" | "100"; // optional bg tone
}

const colorHex = {
  blue:   { text: "#3B82F6", bg50: "#EFF6FF", bg100: "#DBEAFE" },   // tailwind blue-500, 50, 100
  yellow: { text: "#EAB308", bg50: "#FEFCE8", bg100: "#FEF9C3" },   // yellow-500
  green:  { text: "#22C55E", bg50: "#ECFDF5", bg100: "#D1FAE5" },   // green-500
  red:    { text: "#EF4444", bg50: "#FEF2F2", bg100: "#FEE2E2" },   // red-500
};

const ApplicationPipeline = () => {
  const pipelineData: PipelineItem[] = [
    { title: "Applications", value: "1,534", change: "+12.67%", changeType: "up",   icon: FileText,  color: "blue",  bgTone: "50" },
    { title: "Shortlisted",  value: "869",  change: "+1.98%",  changeType: "up",   icon: UserCheck, color: "yellow", bgTone: "50" },
    { title: "Hired",        value: "236",  change: "+8.35%",  changeType: "up",   icon: CheckCircle,color: "green", bgTone: "50" },
    { title: "Rejected",     value: "429",  change: "-2.81%",  changeType: "down", icon: XCircle,   color: "red",   bgTone: "50" },
  ];

  const { width } = useWindowDimensions();
  const columns = useMemo(() => {
    if (width >= 1024) return 4; // lg
    if (width >= 768) return 2;  // md/tablet
    return 1;                    // mobile
  }, [width]);

  const itemBasisClass =
    columns === 4 ? "basis-1/4" : columns === 2 ? "basis-1/2" : "basis-full";

  return (
    <View className="flex-row flex-wrap gap-6">
      {pipelineData.map((item, idx) => {
        const Icon = item.icon;
        const palette = colorHex[item.color];
        const bg = item.bgTone === "100" ? palette.bg100 : palette.bg50;

        return (
          <View key={idx} className={cn(itemBasisClass)}>
            <Card className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {item.title}
                </CardTitle>
                <View
                  style={{ backgroundColor: bg }}
                  className="p-2 rounded-lg"
                >
                  <Icon size={18} color={palette.text} />
                </View>
              </CardHeader>

              <CardContent>
                <Text className="text-2xl font-bold text-foreground">
                  {item.value}
                </Text>

                <View className="flex-row items-center mt-1">
                  {item.changeType === "up" ? (
                    <TrendingUp size={14} color={colorHex.green.text} />
                  ) : (
                    <TrendingDown size={14} color={colorHex.red.text} />
                  )}
                  <Text className="text-xs text-muted-foreground ml-1">
                    {item.change}
                  </Text>
                </View>
              </CardContent>
            </Card>
          </View>
        );
      })}
    </View>
  );
};

export default ApplicationPipeline;
