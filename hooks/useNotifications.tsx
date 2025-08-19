import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Linking, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

interface NotificationData {
  id: string;
  type:
    | 'job_invite'
    | 'job_offer'
    | 'shortlisted'
    | 'interview_invite'
    | 'application_update'
    | 'interview_reminder'
    | 'profile_view'
    | 'job_match'
    | 'message';
  title: string;
  message: string;
  company?: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  isPermissionGranted: boolean;
  requestPermission: () => Promise<void>;
  addNotification: (
    notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>
  ) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    try {
      const settings = await Notifications.getPermissionsAsync();
      setIsPermissionGranted(settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED);
    } catch (err) {
      console.warn('Failed to check notification permissions:', err);
      setIsPermissionGranted(false);
    }
  };

  const requestPermission = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      setIsPermissionGranted(status === 'granted');
    } catch (err) {
      console.warn('Failed to request permission:', err);
      setIsPermissionGranted(false);
    }
  };

  const showToastNotification = (notification: NotificationData) => {
    Toast.show({
      type:
        notification.priority === 'high'
          ? 'error'
          : notification.priority === 'medium'
          ? 'info'
          : 'success',
      text1: notification.title,
      text2: notification.company
        ? `${notification.company} • ${notification.message}`
        : notification.message,
      onPress: () => {
        if (notification.actionUrl) Linking.openURL(notification.actionUrl);
      }
    });
  };

  const addNotification = async (
    notificationData: Omit<NotificationData, 'id' | 'timestamp' | 'read'>
  ) => {
    try {
      const savedPreferences = await AsyncStorage.getItem('notificationPreferences');
      const preferences = savedPreferences ? JSON.parse(savedPreferences) : null;

      if (
        preferences &&
        preferences[notificationData.type] &&
        !preferences[notificationData.type].enabled
      ) {
        return;
      }

      const notification: NotificationData = {
        ...notificationData,
        id: Date.now().toString(),
        timestamp: new Date(),
        read: false
      };

      setNotifications((prev) => [notification, ...prev]);

      const quietHoursRaw = await AsyncStorage.getItem('quietHours');
      const isQuietTime = quietHoursRaw ? checkQuietHours(JSON.parse(quietHoursRaw)) : false;

      if (!isQuietTime) {
        showToastNotification(notification);
        if (
          notification.priority === 'high' &&
          (!preferences ||
            !preferences[notificationData.type] ||
            preferences[notificationData.type].sound !== false)
        ) {
          // Optional: Hook into expo-av to play a sound
        }
      }
    } catch (err) {
      console.warn('Failed to handle notification:', err);
    }
  };

  const checkQuietHours = (quietHours: any) => {
    if (!quietHours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    const [startHour, startMin] = quietHours.start.split(':').map(Number);
    const [endHour, endMin] = quietHours.end.split(':').map(Number);
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isPermissionGranted,
        requestPermission,
        addNotification,
        markAsRead,
        markAllAsRead
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
