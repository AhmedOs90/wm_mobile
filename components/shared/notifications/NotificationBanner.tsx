import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCircle, AlertCircle, Info } from "lucide-react-native";
import { Badge } from "@/components/ui/badge";
import { NotificationCard } from "./NotificationCard"; // We'll define this too

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

interface NotificationBannerProps {
  companyId?: string;
}

const NotificationBanner = ({ companyId }: NotificationBannerProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      return [
        {
          id: "1",
          title: "Welcome to the platform!",
          message: "Get started by posting your first job.",
          type: "info",
          read: false,
          created_at: "2024-01-01T00:00:00Z",
        },
      ];
    },
    enabled: !!companyId,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      console.log(`Marking notification ${notificationId} as read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", companyId] });
    },
  });

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  if (isLoading || !notifications?.length) return null;

  return (
    <View className="space-y-2">
      <TouchableOpacity
        onPress={() => setIsExpanded(!isExpanded)}
        className="flex-row items-center justify-between mb-2"
      >
        <View className="flex-row items-center gap-2">
          <Bell size={16} />
          <Text className="font-medium text-base">Notifications</Text>
        </View>
        {unreadCount > 0 && (
          <Badge variant="destructive">{unreadCount}</Badge>
        )}
      </TouchableOpacity>

      {isExpanded && (
        <ScrollView className="max-h-96 space-y-2">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsReadMutation.mutate(notification.id)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default NotificationBanner;
