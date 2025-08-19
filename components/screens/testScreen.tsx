import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
// import { CareerLevelSelect } from './CareerLevelSelect'; // will add this next

export default function TestScreen() {
  const [careerLevel, setCareerLevel] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Dropdown</Text>
      {/* <CareerLevelSelect
        value={careerLevel}
        onValueChange={setCareerLevel}
        placeholder="Select career level"
      /> */}
      {careerLevel ? (
        <Text style={styles.selected}>Selected ID: {careerLevel}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
  },
  selected: {
    marginTop: 16,
    fontSize: 16,
    color: 'green',
  },
});
