// components/ScrollArea.tsx
import React from 'react';
import {
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

type ScrollAreaProps = ScrollViewProps & {
  containerStyle?: ViewStyle;
};

export const ScrollArea = React.forwardRef<ScrollView, ScrollAreaProps>(
  ({ children, containerStyle, style, ...props }, ref) => {
    return (
      <View style={[styles.container, containerStyle]}>
        <ScrollView
          ref={ref}
          style={[styles.scrollView, style]}
          showsVerticalScrollIndicator={true}
          showsHorizontalScrollIndicator={false}
          {...props}
        >
          {children}
        </ScrollView>
      </View>
    );
  }
);

ScrollArea.displayName = 'ScrollArea';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 8, // matches "rounded-[inherit]"
  },
  scrollView: {
    flexGrow: 1,
  },
});
