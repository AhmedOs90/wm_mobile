import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Modal } from 'react-native';
import { Bell, Check, Settings } from 'lucide-react-native';
import { useNotifications } from '@/hooks/useNotifications';
import { useNavigation } from '@react-navigation/native';

const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, isPermissionGranted } = useNotifications();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    if (notification.actionUrl) {
      navigation.navigate(notification.actionUrl as never); // Ensure actionUrl matches a valid route name
    }
    setModalVisible(false);
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getNotificationIcon = (type: string) => {
    let bgColor = 'gray';

    switch (type) {
      case 'job_offer':
        bgColor = 'green';
        break;
      case 'job_invite':
        bgColor = 'blue';
        break;
      case 'shortlisted':
        bgColor = 'skyblue';
        break;
      case 'interview_invite':
        bgColor = 'green';
        break;
      case 'interview_reminder':
        bgColor = 'orange';
        break;
      case 'application_update':
        bgColor = 'blue';
        break;
      case 'message':
        bgColor = 'purple';
        break;
      case 'job_match':
        bgColor = 'cyan';
        break;
    }

    return <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: bgColor }} />;
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: 'relative', padding: 10 }}>
        <Bell size={24} />
        {unreadCount > 0 && (
          <View style={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'red',
            borderRadius: 10,
            paddingHorizontal: 5,
            minWidth: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ color: 'white', fontSize: 10 }}>{unreadCount > 99 ? '99+' : unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, padding: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Notifications</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {!isPermissionGranted && (
                <Text style={{ color: 'red' }}>Permission not granted</Text>
              )}
              {unreadCount > 0 && (
                <TouchableOpacity onPress={markAllAsRead}>
                  <Text style={{ color: 'blue' }}>Mark all as read</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {notifications.length === 0 ? (
            <Text style={{ marginTop: 20, color: 'gray' }}>No notifications yet</Text>
          ) : (
            <FlatList
              data={notifications.slice(0, 10)}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleNotificationClick(item)}
                  style={{
                    padding: 15,
                    backgroundColor: item.read ? '#f5f5f5' : '#e0f2fe',
                    borderBottomWidth: 1,
                    borderColor: '#ccc',
                    marginTop: 10,
                    borderRadius: 8,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    {getNotificationIcon(item.type)}
                    <View style={{ flex: 1 }}>
                      <Text numberOfLines={1} style={{ fontWeight: 'bold' }}>{item.title}</Text>
                      <Text numberOfLines={2} style={{ fontSize: 12, color: '#666' }}>{item.message}</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                        {item.company && <Text style={{ fontSize: 10 }}>{item.company}</Text>}
                        <Text style={{ fontSize: 10 }}>{formatTimeAgo(new Date(item.timestamp))}</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}

          <TouchableOpacity
            style={{ marginTop: 20, alignSelf: 'center' }}
            onPress={() => {
              navigation.navigate('Notifications' as never); // Ensure 'Notifications' matches a valid route name
              setModalVisible(false);
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Settings size={16} />
              <Text style={{ fontSize: 14 }}>View all notifications</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
    </>
  );
};

export default NotificationBell;
