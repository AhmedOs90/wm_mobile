import React from "react";
import { Text, View } from "react-native";
import { cn } from "../../lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const Card = ({ children, className, ...props }: CardProps) => (
  <View
    className={cn(
      "rounded-lg border border-border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  >
    {children}
  </View>
);

export const CardHeader = ({ children, className, ...props }: CardProps) => (
  <View className={cn("flex flex-col space-y-1.5 p-6", className)} {...props}>
    {children}
  </View>
);

export const CardTitle = ({ children, className, ...props }: CardProps) => (
  <Text className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props}>
    {children}
  </Text>
);

export const CardDescription = ({ children, className, ...props }: CardProps) => (
  <Text className={cn("text-sm text-muted-foreground", className)} {...props}>
    {children}
  </Text>
);

export const CardContent = ({ children, className, ...props }: CardProps) => (
  <View className={cn("p-6 pt-0", className)} {...props}>
    {children}
  </View>
);

export const CardFooter = ({ children, className, ...props }: CardProps) => (
  <View className={cn("flex-row items-center p-6 pt-0", className)} {...props}>
    {children}
  </View>
);
