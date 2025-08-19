// components/HoverCard.tsx
import React, { useState } from 'react';
import { Modal, Pressable, Text, View, StyleSheet } from 'react-native';
import RNModal from 'react-native-modal';

type HoverCardProps = {
  trigger: React.ReactNode;
  content: React.ReactNode;
};

const HoverCard = ({ trigger, content }: HoverCardProps) => {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  return (
    <>
      <Pressable onPress={open} onLongPress={open}>
        {trigger}
      </Pressable>

      <RNModal
        isVisible={visible}
        onBackdropPress={close}
        backdropOpacity={0.1}
        animationIn="zoomIn"
        animationOut="zoomOut"
        style={styles.modal}
      >
        <View style={styles.card}>
          {content}
        </View>
      </RNModal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  card: {
    width: 250,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 5,
  },
});

export default HoverCard;
