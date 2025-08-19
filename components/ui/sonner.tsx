import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <NavigationContainer>
      {/* Your app content here */}
      <Toast />
    </NavigationContainer>
  );
}
