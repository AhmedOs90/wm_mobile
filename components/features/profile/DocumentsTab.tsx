import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { Upload } from 'lucide-react-native';
import CVUploadModal from './CVUploadModal';
import DocumentCard from './DocumentCard';
import Button from '@/components/ui/button';
import { useDocumentsQuery, type Document } from '@/stores/documentsStore';
import toast from 'react-native-toast-message';

interface DocumentsTabProps {
  onEditDocument?: (document: Document) => void;
  onDownloadDocument?: (document: Document) => void;
}

const DocumentsTab = ({
  onEditDocument,
  onDownloadDocument,
}: DocumentsTabProps) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const { data: documents = [], isLoading, error, refetch } = useDocumentsQuery();

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleUploadSuccess = async (cvData: any) => {
    try {
      const { cvsControllerCreate } = await import('@/wm-api/sdk.gen.ts');
      await cvsControllerCreate({
        body: {
          name: cvData.name,
          file: cvData.filePath,
        },
      });

      toast.show({ type: 'success', text1: 'CV uploaded successfully' });
      refetch();
    } catch (err) {
      console.error('Upload failed:', err);
      toast.show({ type: 'error', text1: 'Failed to upload CV' });
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-semibold">Documents</Text>
        <Button onPress={handleUploadClick}>
          <Upload size={16} style={{ marginRight: 8 }} />
          Upload CV
        </Button>
      </View>

      {isLoading ? (
        <View className="h-32 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text className="mt-2 text-gray-500">Loading documents...</Text>
        </View>
      ) : error ? (
        <View className="h-32 justify-center items-center">
          <Text className="text-red-500">Error loading documents</Text>
          <Button style={{ marginTop: 8 }} variant="outline" onPress={() => refetch()}>
            Try Again
          </Button>
        </View>
      ) : documents.length === 0 ? (
        <View className="items-center py-8">
          <Text className="text-gray-500 text-center">No documents uploaded yet.</Text>
          <Button onPress={handleUploadClick} style={{ marginTop: 16 }}>
            <Upload size={16} style={{ marginRight: 8 }} />
            Upload Your First CV
          </Button>
        </View>
      ) : (
        documents.map((doc) => (
          <DocumentCard
            key={doc.id}
            document={doc}
            onEdit={() => onEditDocument?.(doc)}
            onDownload={() => onDownloadDocument?.(doc)}
          />
        ))
      )}

      <CVUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadSuccess}
      />
    </ScrollView>
  );
};

export default DocumentsTab;
