import React, { useState } from 'react';
import { View, LayoutChangeEvent } from 'react-native';

interface AspectRatioProps {
  ratio: number;
  children: React.ReactNode;
}

export const AspectRatio = ({ ratio, children }: AspectRatioProps) => {
  const [width, setWidth] = useState(0);

  const onLayout = (event: LayoutChangeEvent) => {
    setWidth(event.nativeEvent.layout.width);
  };

  return (
    <View onLayout={onLayout}>
      {width > 0 && (
        <View style={{ width: '100%', height: width / ratio }}>
          {children}
        </View>
      )}
    </View>
  );
};
