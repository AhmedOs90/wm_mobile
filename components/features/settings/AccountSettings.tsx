// screens/AccountSettings.tsx
import React, { useState } from 'react';
import { View } from 'react-native';
import { useMutation } from '@tanstack/react-query';

import { Card, CardContent } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Use the same SDK path you used elsewhere in RN
import { authControllerUpdatePassword } from '@/wm-api/sdk.gen';

const AccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const { toast } = useToast();

  const {
    isPending: isLoading,
    mutateAsync: updatePasswordMutation,
  } = useMutation({
    mutationFn: async (passwordData: {
      currentPassword: string;
      password: string;
      confirmPassword: string;
    }) => {
      const response = await authControllerUpdatePassword({ body: passwordData });
      return response;
    },
  });

  const handleResetPassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all password fields',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Password mismatch',
        description: 'New password and confirm password do not match',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updatePasswordMutation({
        currentPassword,
        password: newPassword,
        confirmPassword,
      });

      toast({
        title: 'Success',
        description: 'Password updated successfully',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast({
        title: 'Failed to update password',
        description:
          error?.message || 'An error occurred while updating password',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <View>
          <Label>Current Password</Label>
          <Input
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            autoComplete="password"
          />
        </View>

        <View>
          <Label>New Password</Label>
          <Input
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            autoComplete="password"
          />
        </View>

        <View>
          <Label>Confirm New Password</Label>
          <Input
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="newPassword"
            autoComplete="password"
          />
        </View>

        <Button onPress={handleResetPassword} loading={isLoading}>
          {isLoading ? 'Updating…' : 'Update Password'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountSettings;
