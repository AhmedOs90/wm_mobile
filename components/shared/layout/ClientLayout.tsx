import React from "react";
import { View, ScrollView } from "react-native";
import Navbar from "@/components/shared/navigation/Navbar";
import Footer from "@/components/shared/navigation/Footer";

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children }) => {
  return (
    <View className="flex-1 bg-background">
      <Navbar />
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {children}
      </ScrollView>
      <Footer />
    </View>
  );
};

export default ClientLayout;
