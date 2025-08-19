import React from 'react';
import { Text, View } from 'react-native';
import { Edit, Award } from 'lucide-react-native';

import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import type { Certification } from '@/stores/educationStore';

interface CertificationCardProps {
  certification: Certification;
  onEdit?: (certification: Certification) => void;
  onVerify?: (certification: Certification) => void;
}

const CertificationCard = ({
  certification,
  onEdit,
  onVerify
}: CertificationCardProps) => {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <View className="flex-row justify-between items-start">
          {/* Left: Certification Info */}
          <View className="flex-1 pr-2">
            <Text className="text-lg font-semibold text-gray-900">
              {certification.name}
            </Text>
            <Text className="text-blue-600 font-medium">
              {certification.issuer}
            </Text>
            <Text className="text-sm text-gray-500">
              Issued: {certification.issueDate}
            </Text>
            {certification.expiryDate && (
              <Text className="text-sm text-gray-500">
                Expires: {certification.expiryDate}
              </Text>
            )}
            {certification.credentialId && (
              <Text className="text-sm text-gray-600">
                Credential ID: {certification.credentialId}
              </Text>
            )}
            {certification.isVerified && (
              <Text className="text-sm text-green-600">✓ Verified</Text>
            )}
          </View>

          {/* Right: Action Buttons */}
          <View className="flex-row space-x-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onPress={() => onEdit(certification)}
              >
                <Edit size={16} />
              </Button>
            )}
            {onVerify && (
              <Button
                variant="outline"
                size="sm"
                onPress={() => onVerify(certification)}
                iconLeft={<Award size={16} />}
              >
                Verify
              </Button>
            )}
          </View>
        </View>
      </CardContent>
    </Card>
  );
};

export default CertificationCard;
