import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

export interface DropdownItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  onSelect: (value: string) => void;
  selected?: string;
}

export const DropdownMenu = ({ trigger, items, onSelect, selected }: DropdownMenuProps) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (value: string) => {
    onSelect(value);
    setVisible(false);
  };

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>{trigger}</Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <View style={styles.menu}>
            {items.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={[
                  styles.item,
                  selected === item.value && styles.selectedItem,
                ]}
                onPress={() => handleSelect(item.value)}
              >
                {item.icon && <View style={styles.icon}>{item.icon}</View>}
                <Text style={styles.label}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 20,
  },
  menu: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    elevation: 10,
  },
  item: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#E5F4FF",
  },
  label: {
    fontSize: 16,
  },
  icon: {
    marginRight: 10,
  },
});
