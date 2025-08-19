import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { toast } from '@/hooks/use-toast'; // Replace this if you're using a different toast lib
import { Upload, X, Camera } from 'lucide-react-native';
import { ModalDialog } from '../../ui/dialog'; // your reusable modal
import  Button  from '@/components/ui/button';
import { launchImageLibrary } from 'react-native-image-picker';

interface UploadPhotoModalProps {
  currentAvatar?: string;
  onSave: (file: any) => void;
}

const UploadPhotoModal = ({ currentAvatar, onSave }: UploadPhotoModalProps) => {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const handleFileSelect = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: false,
    });

    const file = result.assets?.[0];
    if (!file) return;

    if (!file.type?.startsWith('image/')) {
toast({
  title: 'Invalid File',
  description: 'Please select a valid image file',
  variant: 'error'
});
      return;
    }

    if (file.fileSize && file.fileSize > 2 * 1024 * 1024) {
      toast({
        title: 'Invalid File',
        description: 'File size must be less than 2MB',
        variant: 'error'
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(file.uri || '');
  };

  const handleRemoveSelected = () => {
    setSelectedFile(null);
    setPreviewUrl('');
  };

  const handleSave = () => {
    if (selectedFile) {
      onSave(selectedFile);
      toast({
        title: 'Upload Successful',
        description: 'Profile picture updated successfully',
        variant: 'success'
      });
      handleRemoveSelected();
    }
  };

  return (
    <ModalDialog
      title="Upload Profile Picture"
      trigger={
        <TouchableOpacity className="rounded-full bg-gray-200 dark:bg-gray-800 p-2">
          <Upload size={20} />
        </TouchableOpacity>
      }
      footer={
        <View className="flex-row justify-between space-x-4">
          <Button variant="outline" onPress={handleRemoveSelected}>
            Cancel
          </Button>
          <Button onPress={handleSave} disabled={!selectedFile}>
            Save Photo
          </Button>
        </View>
      }
    >
      <View className="items-center space-y-4">
        <View className="w-32 h-32 rounded-full overflow-hidden">
          {previewUrl || currentAvatar ? (
            <Image
              source={{ uri: previewUrl || currentAvatar }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full justify-center items-center bg-gray-200 dark:bg-gray-700">
              <Camera size={32} />
            </View>
          )}
        </View>

        {selectedFile && (
          <View className="items-center">
            <Text className="text-sm font-medium">{selectedFile.fileName}</Text>
            <Text className="text-xs text-gray-500">
              {(selectedFile.fileSize / (1024 * 1024)).toFixed(2)} MB
            </Text>
          </View>
        )}

        <View className="flex-row items-center space-x-2 mt-4">
          <Button variant="outline" onPress={handleFileSelect}>
            <Upload size={16} className="mr-2" />
            Choose Photo
          </Button>

          {selectedFile && (
            <Button variant="outline" size="icon" onPress={handleRemoveSelected}>
              <X size={16} />
            </Button>
          )}
        </View>

        <View className="mt-4">
          <Text className="text-xs text-gray-500 text-center">
            Supported formats: JPG, PNG, GIF
          </Text>
          <Text className="text-xs text-gray-500 text-center">
            Maximum file size: 2MB
          </Text>
        </View>
      </View>
    </ModalDialog>
  );
};

export default UploadPhotoModal;
