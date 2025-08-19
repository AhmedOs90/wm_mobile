import React, { ReactNode } from 'react';
import { View, ScrollView, useWindowDimensions, SafeAreaView } from 'react-native';
import Sidebar from '../navigation/Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768; // Adjust threshold as needed

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className={`flex-1 ${isTablet ? 'flex-row' : 'flex-col'}`}>
        {isTablet && <Sidebar />}
        <View className="flex-1 min-w-0">
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Layout;
