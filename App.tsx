import React from 'react';
import { SafeAreaView } from 'react-native';
import TestScreen from './components/screens/testScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }}>
        <TestScreen />
      </SafeAreaView>
    </QueryClientProvider>
  );
}
