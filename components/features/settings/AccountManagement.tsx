// screens/AccountManagement.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useMutation } from '@tanstack/react-query';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
// If you have a RN auth hook, keep this import:
import { useAuth } from '@/hooks/useAuth';

// Use the RN SDK path you’ve used elsewhere
import {
  authControllerDeactivateAccount,
  authControllerUpdateEmail,
} from '@/wm-api/sdk.gen';

const AccountManagement = () => {
  const [disableEditMail, setDisableEditMail] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth?.() ?? { user: undefined };

  const [newEmail, setNewEmail] = useState<string>(user?.email ?? '');

  useEffect(() => {
    // keep local state in sync if user changes
    setNewEmail(user?.email ?? '');
  }, [user?.email]);

  const {
    isPending: isLoadingUpdateEmail,
    mutateAsync: updateEmailMutation,
  } = useMutation({
    mutationFn: async (email: string) => {
      const res = await authControllerUpdateEmail({ body: { email } });
      return res;
    },
  });

  const {
    isPending: isLoadingDeactivateAccount,
    mutateAsync: deactivateAccountMutation,
  } = useMutation({
    mutationFn: async (email: string) => {
      const res = await authControllerDeactivateAccount({ body: { email } });
      return res;
    },
  });

  const handleChangeEmail = async () => {
    if (disableEditMail) {
      setDisableEditMail(false);
      return;
    }
    try {
      await updateEmailMutation(newEmail);
      setDisableEditMail(true);
      toast({
        title: 'Email updated successfully',
        description: 'Your email has been updated',
      });
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        title: 'Failed to update email',
        description: error?.message || 'An error occurred while updating email',
        variant: 'destructive',
      });
    }
  };

  const confirmDeactivate = () => {
    Alert.alert(
      'Deactivate Account',
      'Are you sure you want to deactivate your account? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Deactivate',
          style: 'destructive',
          onPress: handleDeactivate,
        },
      ]
    );
  };

  const handleDeactivate = async () => {
    try {
      await deactivateAccountMutation(user?.email || '');
      // Optionally sign out or navigate here if your RN stack provides it.
      // e.g. useAuth().signOut() or React Navigation reset
      // signOut?.();
    } catch (error: any) {
      console.error('Error deactivating account:', error);
      toast({
        title: 'Failed to deactivate account',
        description:
          error?.message || 'An error occurred while deactivating account',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Management</CardTitle>
        <Text className="text-sm text-muted-foreground">
          Manage your account settings
        </Text>
      </CardHeader>

      <CardContent className="space-y-4">
        <View>
          <Label>Email Address</Label>
          {!!user && (
            <Input
              value={newEmail}
              onChangeText={setNewEmail}
              editable={!disableEditMail}
            />
          )}

          <View className="flex-row gap-2 mt-2">
            <Button
              variant={disableEditMail ? 'outline' : 'default'}
              size="sm"
              onPress={handleChangeEmail}
              loading={isLoadingUpdateEmail}
            >
              {disableEditMail ? 'Change Email' : 'Save Changes'}
            </Button>

            {!disableEditMail && (
              <Button
                variant="destructive"
                size="sm"
                onPress={() => {
                  // revert and stop editing
                  setNewEmail(user?.email ?? '');
                  setDisableEditMail(true);
                }}
              >
                Cancel
              </Button>
            )}
          </View>
        </View>

        <View className="pt-4 border-t border-gray-200">
          <Text className="font-medium text-red-600 mb-2">Danger Zone</Text>
          <Button
            onPress={confirmDeactivate}
            disabled={isLoadingDeactivateAccount}
            variant="destructive"
          >
            Deactivate Account
          </Button>
        </View>
      </CardContent>
    </Card>
  );
};

export default AccountManagement;
