import { X } from "lucide-react-native"; // Or any close icon
import React, { ReactNode, useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";

interface ModalDialogProps {
  title?: string;
  description?: string;
  trigger: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}

export const ModalDialog = ({
  title,
  description,
  trigger,
  children,
  footer,
}: ModalDialogProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>{trigger}</Pressable>
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center px-4">
          <View className="bg-white dark:bg-black rounded-lg p-6 w-full max-w-md relative">
            <TouchableOpacity
              className="absolute top-4 right-4"
              onPress={() => setVisible(false)}
            >
              <X size={20} color="gray" />
            </TouchableOpacity>

            {title && (
              <Text className="text-lg font-semibold text-center mb-2">{title}</Text>
            )}
            {description && (
              <Text className="text-sm text-gray-500 text-center mb-4">{description}</Text>
            )}

            <View>{children}</View>

            {footer && <View className="mt-4">{footer}</View>}
          </View>
        </View>
      </Modal>
    </>
  );
};
