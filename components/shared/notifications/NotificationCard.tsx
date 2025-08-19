import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
} from "lucide-react-native";
import { Badge } from "@/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
}

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: () => void;
}

export const NotificationCard = ({
  notification,
  onMarkAsRead,
}: NotificationCardProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "referral":
        return <Bell size={16} />;
      case "success":
        return <CheckCircle size={16} />;
      case "warning":
        return <AlertCircle size={16} />;
      default:
        return <Info size={16} />;
    }
  };

  return (
    <View
      className={`p-3 rounded-md border ${
        notification.read ? "opacity-60" : "border-orange-400"
      }`}
    >
      <View className="flex-row items-start justify-between">
        <View className="flex-row gap-2 flex-1">
          {getIcon(notification.type)}
          <View className="flex-1">
            <Text className="font-semibold text-sm">
              {notification.title}{" "}
              {!notification.read && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  New
                </Badge>
              )}
            </Text>
            <Text className="text-sm">{notification.message}</Text>
            <Text className="text-xs text-gray-400 mt-1">
              {new Date(notification.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
        {!notification.read && (
          <TouchableOpacity
            className="ml-2"
            onPress={onMarkAsRead}
          >
            <CheckCircle size={14} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
