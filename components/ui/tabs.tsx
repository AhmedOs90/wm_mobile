// components/Tabs.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const Tabs = ({
  tabs,
  initialTab = 0,
  tabContent,
}: {
  tabs: string[];
  initialTab?: number;
  tabContent: (index: number) => React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <View>
      <View style={styles.tabList}>
        {tabs.map((tab, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActiveTab(i)}
            style={[
              styles.tabTrigger,
              activeTab === i && styles.tabTriggerActive,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === i && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tabContent}>{tabContent(activeTab)}</View>
    </View>
  );
};
const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
    marginVertical: 8,
  },
  tabTrigger: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tabTriggerActive: {
    backgroundColor: '#007aff',
    borderRadius: 6,
  },
  tabText: {
    color: '#333',
  },
  tabTextActive: {
    color: 'white',
    fontWeight: '600',
  },
  tabContent: {
    marginTop: 12,
  },
});
