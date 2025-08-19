// components/Table.tsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export const Table = ({ headers, rows }: { headers: string[], rows: string[][] }) => {
  return (
    <ScrollView horizontal>
      <View className="border border-gray-300 rounded-md">
        {/* Header */}
        <View className="flex-row bg-gray-200">
          {headers.map((header, index) => (
            <View key={index} className="p-3 border-r border-gray-300 min-w-[100px]">
              <Text className="font-semibold">{header}</Text>
            </View>
          ))}
        </View>

        {/* Rows */}
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} className="flex-row border-t border-gray-300">
            {row.map((cell, colIndex) => (
              <View key={colIndex} className="p-3 border-r border-gray-300 min-w-[100px]">
                <Text>{cell}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};
