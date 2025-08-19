import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CareerLevelSelect } from '../components/dropdowns/CareerLevelSelect'; // adjust path if needed
import EmptyState from '../components/shared/ui/EmptyState';

export default function Page() {
  const [careerLevel, setCareerLevel] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Career Level Dropdown Test</Text>
      <CareerLevelSelect
        value={careerLevel}
        onValueChange={setCareerLevel}
        placeholder="Select career level"
        searchPlaceholder="Search levels..."
        emptyMessage="No levels available"
      />
      <EmptyState message="No results found" />

      {careerLevel ? (
        <Text style={styles.result}>Selected: {careerLevel}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  result: {
    marginTop: 16,
    fontSize: 16,
    color: 'green',
  },
});
