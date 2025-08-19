import React, { useState, ReactNode } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
  Dimensions,
} from "react-native";
import Modal from "react-native-modal"; // install this if not: npm i react-native-modal

const screenHeight = Dimensions.get("window").height;

interface BottomSheetDrawerProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  height?: number; // default 50% height
}

export const BottomSheetDrawer = ({
  trigger,
  title,
  description,
  children,
  footer,
  height = screenHeight * 0.5,
}: BottomSheetDrawerProps) => {
  const [isVisible, setVisible] = useState(false);

  const openDrawer = () => setVisible(true);
  const closeDrawer = () => setVisible(false);

  return (
    <>
      <Pressable onPress={openDrawer}>{trigger}</Pressable>
      <Modal
        isVisible={isVisible}
        onBackdropPress={closeDrawer}
        onSwipeComplete={closeDrawer}
        swipeDirection="down"
        style={styles.modal}
        backdropOpacity={0.8}
        useNativeDriverForBackdrop
      >
        <View style={[styles.container, { height }]}>
          <View style={styles.handle} />
          {title && <Text style={styles.title}>{title}</Text>}
          {description && <Text style={styles.description}>{description}</Text>}
          <View style={styles.content}>{children}</View>
          {footer && <View style={styles.footer}>{footer}</View>}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  container: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    overflow: "hidden",
  },
  handle: {
    width: 100,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  footer: {
    marginTop: 12,
  },
});
