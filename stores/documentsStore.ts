import { useQuery } from '@tanstack/react-query';
// import { cvsControllerFindAll } from '@sdk.gen.ts';

// Document interface matching the component expectations
export interface Document {
  id: string | number;
  name: string;
  lastUpdated: string;
  size: string;
  type: 'resume' | 'cover-letter' | 'certificate' | 'portfolio' | 'other';
  url?: string;
}

// Transform API response to Document format
const transformApiToDocument = (apiDoc: any): Document => {
  return {
    id: apiDoc.id,
    name: apiDoc.name || 'Untitled Document',
    lastUpdated: apiDoc.updatedAt || apiDoc.createdAt || 'Unknown',
    size: apiDoc.size || 'Unknown size',
    type: apiDoc.type || 'resume',
    url: apiDoc.file
  };
};


export const useDocumentsQuery = () => {
  return useQuery({
    queryKey: ['candidate-documents'],
    queryFn: async () => {
      console.log('🔄 Fetching documents with React Query...');
      
      try {
        const { cvsControllerFindAll } = await import('@/wm-api/sdk.gen.ts');
        const response = await cvsControllerFindAll();
        
        if (!response.data?.data) {
          console.log('No CVs found, returning empty array');
          return [];
        }
        
        const documents = (response.data.data || []).map(transformApiToDocument);
        console.log('✅ Documents loaded from API:', documents);
        
        return documents;
      } catch (error) {
        console.error('Failed to fetch CVs:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};

// Convenience hooks for easier component usage
export const useDocuments = () => {
  const query = useDocumentsQuery();
  return query.data || [];
};

export const useDocumentsLoading = () => {
  const query = useDocumentsQuery();
  return query.isLoading;
};

export const useDocumentsError = () => {
  const query = useDocumentsQuery();
  return query.error?.message || null;
};

export const useDocumentsFetching = () => {
  const query = useDocumentsQuery();
  return query.isFetching;
};

export const useFetchDocuments = () => {
  const query = useDocumentsQuery();
  return query.refetch;
}; 