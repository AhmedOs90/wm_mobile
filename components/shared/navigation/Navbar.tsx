import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Button from "../../ui/button"; // Confirm this is RN version

const Navbar = () => {
  const navigation = useNavigation() as any;

  return (
    <View className="bg-white border-b border-gray-200 shadow-sm z-50">
      <View className="px-4 py-3 flex-row justify-between items-center">
        {/* Logo and Title */}
        <TouchableOpacity onPress={() => navigation.navigate("Home")}>
          <View className="flex-row items-center" style={{ columnGap: 8 }}>
            <Image
              source={{ uri: "https://yourdomain.com/logo.png" }} // Use PNG or local asset
              style={{ width: 148, height: 48 }}
              resizeMode="contain"
            />
            <View style={{ height: 40, width: 1, backgroundColor: "#d1d5db" }} />
            <Text className="text-gray-400 text-base">Careers</Text>
          </View>
        </TouchableOpacity>

        {/* Navigation Links */}
        <View className="flex-row items-center" style={{ columnGap: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate("ComingSoon")}>
            <Text className="text-gray-500">For Employers</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Companies")}>
            <Text className="text-gray-500">Companies</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Text className="text-gray-500">Career Advice</Text>
          </TouchableOpacity>

          <Button
            variant="outline"
            size="sm"
            onPress={() => navigation.navigate("Login")}
          >
            Sign In
          </Button>

          <Button size="sm" onPress={() => navigation.navigate("Signup")}>
            Register
          </Button>
        </View>
      </View>
    </View>
  );
};

export default Navbar;
