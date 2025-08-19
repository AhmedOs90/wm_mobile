import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Search,
  Award,
  Bell,
  MessageSquare,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react-native";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/stores/userProfileStore";
import { getProfileImage } from "@/lib/assetHelper";
import Button from "@/components/ui/button";
import NotificationBell from "@/components/shared/notifications/NotificationBell";
import LogoutButton from "../../features/auth/LogoutButton";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const profile = useProfile();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", route: "Dashboard" },
    { icon: Search, label: "Find Jobs", route: "Jobs" },
    { icon: Briefcase, label: "My Applications", route: "Applications" },
    { icon: Calendar, label: "Interviews", route: "Interviews" },
    { icon: Users, label: "My Profile", route: "Profile" },
    { icon: Award, label: "Saved Jobs", route: "SavedJobs" },
    { icon: Bell, label: "Notifications", route: "Notifications" },
    { icon: MessageSquare, label: "Messages", route: "Messages" },
    { icon: Settings, label: "Settings", route: "Settings" },
  ];

  const isActive = (targetRoute: string) => route.name === targetRoute;

  return (
    <View
      className={`bg-white border-r border-gray-200 h-full ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
        {!collapsed && (
          <View className="flex-row items-center space-x-2">
            <Image
              source={require("@/assets/logo.png")}
              style={{ height: 32, width: 120 }}
              resizeMode="contain"
            />
          </View>
        )}
        <View className="flex-row items-center space-x-2">
          <NotificationBell />
          <TouchableOpacity
            onPress={() => setCollapsed(!collapsed)}
            className="p-1"
          >
            {collapsed ? (
              <ChevronRight size={20} />
            ) : (
              <ChevronLeft size={20} />
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Menu */}
      <ScrollView className="flex-1 p-2">
        {menuItems.map(({ icon: Icon, label, route }) => (
          <TouchableOpacity
            key={route}
            className={`flex-row items-center px-3 py-2 rounded-lg mb-2 ${
              isActive(route)
                ? "bg-orange-100 text-orange-900"
                : "text-gray-600"
            } ${collapsed ? "justify-center" : ""}`}
            onPress={() => navigation.navigate(route as never)}
          >
            <Icon size={20} />
            {!collapsed && <Text className="ml-3 text-sm">{label}</Text>}
          </TouchableOpacity>
        ))}

        <LogoutButton variant="sidebar" collapsed={collapsed} />
      </ScrollView>

      {/* Footer */}
      <View className="p-4 border-t border-gray-200">
        <View
          className={`flex-row items-center ${
            collapsed ? "justify-center" : "space-x-3"
          }`}
        >
          {profile?.profilePicture ? (
            <Image
              source={{ uri: getProfileImage(profile.profilePicture as string) }}
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
              }}
            />
          ) : (
            <View className="w-8 h-8 rounded-full bg-orange-500 items-center justify-center">
              <Text className="text-white text-sm font-bold">
                {user?.firstName?.charAt(0)}
              </Text>
            </View>
          )}

          {!collapsed && (
            <View>
              <Text className="text-sm font-medium text-gray-900">
                {user?.firstName} {user?.lastName}
              </Text>
              <Text className="text-xs text-gray-500">{user?.role}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Sidebar;
