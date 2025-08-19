import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  SafeAreaView,
} from 'react-native';

const LinkText = ({ children, href }: { children: string; href: string }) => (
  <TouchableOpacity onPress={() => Linking.openURL(href)}>
    <Text className="text-gray-300 text-base">{children}</Text>
  </TouchableOpacity>
);

const Footer = () => {
  return (
    <SafeAreaView className="bg-foreground px-4 py-12">
      <View className="flex flex-col gap-8 md:flex-row md:justify-between max-w-screen-xl mx-auto">
        <View className="flex-1">
          <Text className="text-2xl font-bold text-white mb-4">WazifaME</Text>
          <Text className="text-gray-300 text-base">
            The leading platform connecting job seekers with top employers
            across Egypt and MENA.
          </Text>
        </View>

        <View className="flex-1">
          <Text className="font-semibold text-white mb-4">For Job Seekers</Text>
          <View className="space-y-2">
            <LinkText href="#">Browse Jobs</LinkText>
            <LinkText href="#">Create CV</LinkText>
            <LinkText href="#">Job Alerts</LinkText>
            <LinkText href="#">Career Advice</LinkText>
          </View>
        </View>

        <View className="flex-1">
          <Text className="font-semibold text-white mb-4">Companies</Text>
          <View className="space-y-2">
            <LinkText href="#">Top Companies</LinkText>
            <LinkText href="#">Company Reviews</LinkText>
            <LinkText href="#">Salaries</LinkText>
            <LinkText href="#">For Employers</LinkText>
          </View>
        </View>

        <View className="flex-1">
          <Text className="font-semibold text-white mb-4">Support</Text>
          <View className="space-y-2">
            <LinkText href="#">Help Center</LinkText>
            <LinkText href="#">Contact Us</LinkText>
            <LinkText href="#">Privacy Policy</LinkText>
            <LinkText href="#">Terms of Service</LinkText>
          </View>
        </View>
      </View>

      <View className="border-t border-gray-700 mt-12 pt-8">
        <Text className="text-center text-gray-300 text-sm">
          © 2024 WazifaME. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Footer;
