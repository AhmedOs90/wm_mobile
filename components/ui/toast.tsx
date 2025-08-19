import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
import type { ToastConfig, ToastConfigParams } from 'react-native-toast-message';

type CustomToastProps = ToastConfigParams<any>;

export const toastConfig: ToastConfig = {
  default: ({ text1, text2, hide }: CustomToastProps) => (
    <View className="bg-white dark:bg-black border border-gray-300 dark:border-gray-700 p-4 rounded-md shadow-lg w-[90%] mx-auto mt-2">
      <View className="flex-row justify-between items-center">
        <View>
          {!!text1 && (
            <Text className="text-base font-semibold text-black dark:text-white">{text1}</Text>
          )}
          {!!text2 && (
            <Text className="text-sm text-gray-600 dark:text-gray-400">{text2}</Text>
          )}
        </View>
        <TouchableOpacity onPress={() => hide()}>
          <X size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  ),

  destructive: ({ text1, text2, hide }: CustomToastProps) => (
    <View className="bg-red-600 p-4 rounded-md shadow-lg w-[90%] mx-auto mt-2">
      <View className="flex-row justify-between items-center">
        <View>
          {!!text1 && <Text className="text-base font-semibold text-white">{text1}</Text>}
          {!!text2 && <Text className="text-sm text-white/80">{text2}</Text>}
        </View>
        <TouchableOpacity onPress={() => hide()}>
          <X size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  ),

  success: ({ text1, text2, hide }: CustomToastProps) => (
    <View className="bg-green-600 p-4 rounded-md shadow-lg w-[90%] mx-auto mt-2">
      <View className="flex-row justify-between items-center">
        <View>
          {!!text1 && <Text className="text-base font-semibold text-white">{text1}</Text>}
          {!!text2 && <Text className="text-sm text-white/80">{text2}</Text>}
        </View>
        <TouchableOpacity onPress={() => hide()}>
          <X size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  ),

  error: ({ text1, text2, hide }: CustomToastProps) => (
    <View className="bg-red-700 p-4 rounded-md shadow-lg w-[90%] mx-auto mt-2">
      <View className="flex-row justify-between items-center">
        <View>
          {!!text1 && <Text className="text-base font-semibold text-white">{text1}</Text>}
          {!!text2 && <Text className="text-sm text-white/80">{text2}</Text>}
        </View>
        <TouchableOpacity onPress={() => hide()}>
          <X size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  ),
};
