// components/Slider.tsx
import React from 'react';
import RNSlider from '@react-native-community/slider';
import { View, StyleSheet } from 'react-native';

interface SliderProps {
  value: number;
  onValueChange: (val: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
}

const Slider: React.FC<SliderProps> = ({
  value,
  onValueChange,
  minimumValue = 0,
  maximumValue = 100,
  step = 1,
}) => {
  return (
    <View style={styles.container}>
      <RNSlider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#2563eb" // Tailwind: bg-primary
        maximumTrackTintColor="#e5e7eb" // Tailwind: bg-secondary
        thumbTintColor="#ffffff"        // Tailwind: bg-background
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default Slider;
