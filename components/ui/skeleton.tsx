// components/Skeleton.tsx
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  style,
  width = '100%',
  height = 20,
  borderRadius = 8,
}) => {
  const shimmerTranslate = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerTranslate, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const shimmerWidth = SCREEN_WIDTH;

  const translateX = shimmerTranslate.interpolate({
    inputRange: [-1, 1],
    outputRange: [-shimmerWidth, shimmerWidth],
  });

  return (
    <View
      style={[
        styles.container,
        {  borderRadius, overflow: 'hidden' },
        style,
      ]}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.2)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#E1E9EE', // equivalent to `bg-muted`
  },
});

export default Skeleton;
