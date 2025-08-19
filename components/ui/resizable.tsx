// components/ResizablePanels.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutChangeEvent,
} from 'react-native';

export const ResizablePanels = ({
  left,
  right,
  minWidth = 80,
  handleWidth = 10,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  minWidth?: number;
  handleWidth?: number;
}) => {
  const [containerWidth, setContainerWidth] = useState(0);
  const leftWidth = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newWidth = gesture.moveX;
        if (newWidth > minWidth && newWidth < containerWidth - minWidth) {
          leftWidth.setValue(newWidth);
        }
      },
    })
  ).current;

  const onLayout = (e: LayoutChangeEvent) => {
    const width = e.nativeEvent.layout.width;
    setContainerWidth(width);
    leftWidth.setValue(width / 2); // Start with 50%
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.View style={{ width: leftWidth }}>
        {left}
      </Animated.View>

      <View
        {...panResponder.panHandlers}
        style={[styles.handle, { width: handleWidth }]}
      />

      <Animated.View
        style={{
          flex: 1,
        }}
      >
        {right}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flex: 1,
  },
  handle: {
    backgroundColor: '#ccc',
    zIndex: 10,
  },
});
