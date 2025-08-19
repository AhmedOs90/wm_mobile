// components/ui/Tooltip.tsx
import React, { useState } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Tooltip from 'react-native-walkthrough-tooltip';

export function TooltipWrapper({
  children,
  content,
  placement = 'top',
}: {
  children: React.ReactElement;
  content: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
}) {
  const [visible, setVisible] = useState(false);

  return (
    <Tooltip
      isVisible={visible}
      content={<Text style={styles.tooltipText}>{content}</Text>}
      placement={placement}
      onClose={() => setVisible(false)}
      showChildInTooltip={false}
      backgroundColor="transparent"
    >
      <TouchableOpacity activeOpacity={1} onPress={() => setVisible(true)}>
        {children}
      </TouchableOpacity>
    </Tooltip>
  );
}

const styles = StyleSheet.create({
  tooltipText: {
    color: '#fff',
    padding: 8,
    backgroundColor: '#333',
    borderRadius: 6,
  },
});
