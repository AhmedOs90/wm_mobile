import { STORAGE_API_URL, STORAGE_API_KEY, STORAGE_API_SECRET, STORAGE_API_ENV } from '@env';

export const uploadFile = async (
  file: { uri: string; name: string; type: string },
  folder: string = 'images'
): Promise<string> => {
  if (!file || !file.uri) {
    throw new Error('No file provided');
  }

  const formData = new FormData();
  formData.append('application', 'wazifame');
  formData.append('env', STORAGE_API_ENV || 'stg');
  formData.append('path', folder);
  formData.append('file', {
    uri: file.uri,
    name: file.name,
    type: file.type,
  } as any); // Some FormData implementations require `as any` in RN

  const response = await fetch(`${STORAGE_API_URL}/api/upload/file`, {
    method: 'POST',
    headers: {
      'x-api-key': STORAGE_API_KEY,
      'x-secret-key': STORAGE_API_SECRET,
      // Don't set Content-Type, RN will set it automatically for multipart/form-data
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to upload file: ${errorText}`);
  }

  const result = await response.json();
  const relativePath = result.metadata?.fileUrl;

  if (!relativePath) {
    throw new Error('No fileUrl returned from upload');
  }

  return relativePath;
};
