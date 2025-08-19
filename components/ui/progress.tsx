// components/Progress.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Animated,
} from 'react-native';

type ProgressProps = {
  value: number; // Between 0 and 100
  style?: StyleProp<ViewStyle>;
  barStyle?: StyleProp<ViewStyle>;
};

export const Progress: React.FC<ProgressProps> = ({ value, style, barStyle }) => {
  const widthAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: value,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [value]);

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.bar,
          barStyle,
          {
            width: widthInterpolated,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 16,
    width: '100%',
    backgroundColor: '#E5E7EB', // bg-secondary
    borderRadius: 9999,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    backgroundColor: '#3B82F6', // bg-primary
  },
});
