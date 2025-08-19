import { API_STORAGE_URL } from '@env'; // From your .env file
import placeholderImage from '../assets/images/placeholder.png';
import { Platform } from 'react-native';

export const getAssetPath = (filename: string | null | undefined): string => {
  // Google or LinkedIn hosted images
  if (filename?.includes('https://lh3.googleusercontent.com') || filename?.includes('https://media.licdn.com')) {
    return filename;
  }

  // If it's already a full URL, return it
  if (filename?.startsWith('http://') || filename?.startsWith('https://')) {
    return filename;
  }

  // If nothing is available, return a local fallback image URI
  if (!filename) {
    // You can also return Image.resolveAssetSource(placeholderImage).uri if needed
    return placeholderImage;
  }

  // Final path from storage API
  return `${API_STORAGE_URL}/${filename}`;
};

export const getProfileImage = (image: string | null | undefined): string => {
  return getAssetPath(image);
};
