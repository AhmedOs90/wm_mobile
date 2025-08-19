import { ChevronRight, MoreHorizontal } from "lucide-react-native";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";
import { cn } from "../lib/utils";

import type { ReactNode } from "react";

interface BreadcrumbProps {
  children: ReactNode;
  [key: string]: any;
}

export const Breadcrumb = ({ children, ...props }: BreadcrumbProps) => (
  <View {...props}>
    {children}
  </View>
);

interface BreadcrumbListProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const BreadcrumbList = ({ children, className, ...props }: BreadcrumbListProps) => (
  <View
    {...props}
    className={cn("flex-row flex-wrap items-center gap-1.5", className)}
  >
    {children}
  </View>
);

interface BreadcrumbItemProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const BreadcrumbItem = ({ children, className, ...props }: BreadcrumbItemProps) => (
  <View className={cn("flex-row items-center gap-1.5", className)} {...props}>
    {children}
  </View>
);

interface BreadcrumbLinkProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  [key: string]: any;
}

export const BreadcrumbLink = ({
  children,
  onPress,
  className,
  ...props
}: BreadcrumbLinkProps) => (
  <TouchableOpacity onPress={onPress} {...props}>
    <Text className={cn("text-muted-foreground hover:text-foreground", className)}>
      {children}
    </Text>
  </TouchableOpacity>
);

interface BreadcrumbPageProps {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const BreadcrumbPage = ({ children, className, ...props }: BreadcrumbPageProps) => (
  <Text
    accessibilityRole="text"
    aria-current="page"
    className={cn("text-foreground font-normal", className)}
    {...props}
  >
    {children}
  </Text>
);

interface BreadcrumbSeparatorProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const BreadcrumbSeparator = ({ children, className, ...props }: BreadcrumbSeparatorProps) => (
  <View
    accessibilityElementsHidden
    importantForAccessibility="no"
    className={cn("mx-1 [&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight size={14} />}
  </View>
);

interface BreadcrumbEllipsisProps {
  className?: string;
  [key: string]: any;
}

export const BreadcrumbEllipsis = ({ className, ...props }: BreadcrumbEllipsisProps) => (
  <Pressable
    accessibilityElementsHidden
    importantForAccessibility="no"
    className={cn("h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal size={16} />
    <Text className="sr-only">More</Text>
  </Pressable>
);
