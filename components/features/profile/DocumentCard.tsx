import React from 'react';
import { View, Text, Linking } from 'react-native';
import { Edit, Download, FileText, Eye } from 'lucide-react-native';

import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import type { Document } from '@/stores/documentsStore';
import { getAssetPath } from '@/lib/assetHelper';
import { toast } from '@/hooks/use-toast';

interface DocumentCardProps {
  document: Document;
  onEdit?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onView?: (document: Document) => void;
}

const getDocumentColor = (type: Document['type']) => {
  switch (type) {
    case 'resume':
      return 'bg-blue-100 text-blue-600';
    case 'cover-letter':
      return 'bg-green-100 text-green-600';
    case 'certificate':
      return 'bg-purple-100 text-purple-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const DocumentCard = ({ document, onEdit, onDownload, onView }: DocumentCardProps) => {
  const fileUrl = document.url ? getAssetPath(document.url) : null;

  const handleView = async () => {
    if (fileUrl) {
      try {
        const supported = await Linking.canOpenURL(fileUrl);
        if (supported) {
          Linking.openURL(fileUrl);
        } else {
          toast({ title: 'Cannot open file', description: 'Unsupported file URL' });
        }
      } catch (err) {
        toast({ title: 'Error opening file', description: (err as Error)?.message || 'Something went wrong.' });
      }
    } else if (onView) {
      onView(document);
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      Linking.openURL(fileUrl); // You can enhance with file-system download logic if needed
    } else if (onDownload) {
      onDownload(document);
    }
  };

  const colorClass = getDocumentColor(document.type);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <View className="flex-row justify-between items-center">
          {/* Left side: icon + details */}
          <View className="flex-row items-center space-x-4 flex-1">
            <View className={`p-3 rounded-lg ${colorClass}`}>
              <FileText size={24} />
            </View>
            <View>
              <Text className="font-medium text-gray-900">{document.name}</Text>
              <Text className="text-sm text-gray-600">
                Updated {document.lastUpdated} • {document.size}
              </Text>
            </View>
          </View>

          {/* Right side: buttons */}
          <View className="flex-row space-x-2 ml-4">
            <Button variant="outline" size="sm" onPress={handleView} iconLeft={<Eye size={16} />}>
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              onPress={handleDownload}
              iconLeft={<Download size={16} />}
            >
              Download
            </Button>
            {onEdit && (
              <Button variant="outline" size="sm" onPress={() => onEdit(document)}>
                <Edit size={16} />
              </Button>
            )}
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default DocumentCard;
