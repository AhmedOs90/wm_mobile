import React, { useState } from 'react';
import { View, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Upload, FileText, X } from 'lucide-react-native';

import { ModalDialog } from '@/components/ui/dialog';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { uploadFile } from '@/lib/storageApi';
import { toast } from '@/hooks/use-toast';

interface CVUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (cvData: { name: string; filePath: string }) => void;
}

const CVUploadModal = ({ isOpen, onClose, onUploadSuccess }: CVUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileName, setFileName] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFilePick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setSelectedFile(file);
        setFileName(file.name.replace(/\.[^/.]+$/, ''));
      }
    } catch (err) {
      toast({ title: 'Error picking file', description: (err as Error)?.message || 'Something went wrong.' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please select a file and enter a name.',
      });
      return;
    }

    setIsUploading(true);
    try {
      const fileData = {
        uri: selectedFile.uri,
        name: selectedFile.name,
        type: selectedFile.mimeType || 'application/octet-stream',
      };

      const filePath = await uploadFile(fileData, 'cvs');

      onUploadSuccess({ name: fileName.trim(), filePath });
      handleClose();
    } catch (error) {
      toast({
        title: 'Upload Failed',
        description: error instanceof Error ? error.message : 'An error occurred while uploading.',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setFileName('');
    setIsUploading(false);
    onClose();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileName('');
  };

  return (
    isOpen && (
      <ModalDialog
        title="Upload CV"
        trigger={<></>} // External trigger, handled by isOpen
        footer={
          <View className="flex-row justify-end space-x-4">
            <Button variant="outline" onPress={handleClose} disabled={isUploading}>
              Cancel
            </Button>
            <Button onPress={handleUpload} disabled={!selectedFile || !fileName.trim() || isUploading}>
              {isUploading ? 'Uploading...' : 'Upload CV'}
            </Button>
          </View>
        }
      >
        <View className="space-y-4">
          {/* File Upload */}
          <View>
            <Label>Select CV File</Label>
            <View className="mt-2">
              {!selectedFile ? (
                <Button variant="outline" onPress={handleFilePick} iconLeft={<Upload size={16} />}>
                  Select File
                </Button>
              ) : (
                <View className="flex-row justify-between items-center p-3 border rounded-lg bg-gray-50">
                  <View className="flex-row items-center space-x-3">
                    <FileText size={28} color="#2563EB" />
                    <View>
                      <Text className="text-sm font-medium">{selectedFile.name}</Text>
                      <Text className="text-xs text-gray-500">
                        {(selectedFile.size! / (1024 * 1024)).toFixed(2)} MB
                      </Text>
                    </View>
                  </View>
                  <Button variant="ghost" size="sm" onPress={handleRemoveFile}>
                    <X size={16} />
                  </Button>
                </View>
              )}
            </View>
          </View>

          {/* CV Name Input */}
          {selectedFile && (
            <View>
              <Label>CV Name</Label>
              <Input
                value={fileName}
                onChangeText={setFileName}
                placeholder="Enter a name for your CV"
              />
            </View>
          )}
        </View>
      </ModalDialog>
    )
  );
};

export default CVUploadModal;
