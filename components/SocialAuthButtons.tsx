
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Alert } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import { colors } from '@/styles/commonStyles';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';
import { useAppleAuth } from '@/hooks/useAppleAuth';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { router } from 'expo-router';

interface SocialAuthButtonsProps {
  onSuccess?: () => void;
}

export function SocialAuthButtons({ onSuccess }: SocialAuthButtonsProps) {
  const { 
    signInWithGoogle, 
    isLoading: googleLoading, 
    error: googleError,
    isConfigured: googleConfigured,
    redirectUri,
    userInfo,
  } = useGoogleAuth();
  
  const { signInWithApple, isAvailable: appleAvailable, isLoading: appleLoading } = useAppleAuth();
  const { signIn } = useAuth();
  const { createProfile, allProfiles } = useProfile();

  // Show user info when available
  React.useEffect(() => {
    if (userInfo) {
      handleGoogleUserInfo(userInfo);
    }
  }, [userInfo]);

  const handleGoogleUserInfo = async (userData: any) => {
    try {
      console.log('Processing Google user info:', userData);
      
      const authUser = {
        id: `google_${userData.id}`,
        email: userData.email,
        name: userData.name,
        provider: 'google' as const,
        providerId: userData.id,
      };

      await signIn(authUser);

      // Check if profile exists for this email
      const existingProfile = allProfiles.find(p => p.id === authUser.id);

      if (!existingProfile) {
        // Create a new profile
        await createProfile(userData.name || userData.email.split('@')[0]);
      }

      onSuccess?.();
      router.replace('/(tabs)/(home)');
    } catch (error) {
      console.error('Error processing Google user info:', error);
      Alert.alert('Error', 'Failed to complete sign in. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log('Google sign-in button pressed');
      
      const result = await signInWithGoogle();

      if (!result.success) {
        if (result.cancelled) {
          console.log('User cancelled sign-in');
          return;
        }

        if (result.setupInstructions) {
          // Show setup instructions
          Alert.alert(
            'Google OAuth Setup Required',
            'Google Sign-In needs to be configured. Please check the console logs for detailed setup instructions.\n\n' +
            `Your redirect URI is:\n${redirectUri}\n\n` +
            'Add this to your Google Cloud Console OAuth credentials.',
            [
              {
                text: 'Copy Redirect URI',
                onPress: () => {
                  console.log('='.repeat(60));
                  console.log('COPY THIS REDIRECT URI:');
                  console.log(redirectUri);
                  console.log('='.repeat(60));
                  Alert.alert('Redirect URI', `Copied to console:\n${redirectUri}`);
                },
              },
              { text: 'OK' },
            ]
          );
          return;
        }

        if (result.errorMessage) {
          Alert.alert('Sign In Failed', result.errorMessage);
        }
      }
      
      // Success case is handled by the useEffect hook when userInfo is set
    } catch (error) {
      console.error('Google sign-in error:', error);
      Alert.alert('Error', 'Failed to sign in with Google. Please try again.');
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await signInWithApple();

      if (result.success && result.user) {
        const { id, email, name } = result.user;

        // Create auth user
        const authUser = {
          id: `apple_${id}`,
          email,
          name,
          provider: 'apple' as const,
          providerId: id,
        };

        await signIn(authUser);

        // Check if profile exists for this Apple ID
        const existingProfile = allProfiles.find(p => p.id === authUser.id);

        if (!existingProfile) {
          // Create a new profile
          const username = name || email?.split('@')[0] || 'Apple User';
          await createProfile(username);
        }

        onSuccess?.();
        router.replace('/(tabs)/(home)');
      } else if (result.cancelled) {
        console.log('Apple sign-in cancelled');
      }
    } catch (error) {
      console.error('Apple sign-in error:', error);
      Alert.alert('Error', 'Failed to sign in with Apple. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialButtons}>
        {appleAvailable && Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={12}
            style={styles.appleButton}
            onPress={handleAppleSignIn}
          />
        )}

        <TouchableOpacity
          style={[
            styles.googleButton,
            (googleLoading || !googleConfigured) && styles.googleButtonDisabled,
          ]}
          onPress={handleGoogleSignIn}
          disabled={googleLoading}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleButtonText}>
            {googleLoading ? 'Signing in...' : 'Sign in with Google'}
          </Text>
        </TouchableOpacity>

        {!googleConfigured && (
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              Google Sign-In requires setup. Tap the button above for instructions.
            </Text>
          </View>
        )}

        {googleError && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{googleError}</Text>
          </View>
        )}
      </View>

      <Text style={styles.disclaimer}>
        By signing in, you agree to track your garden progress and compete with other players.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.secondary,
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  socialButtons: {
    gap: 12,
  },
  appleButton: {
    width: '100%',
    height: 50,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DADCE0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    height: 50,
  },
  googleButtonDisabled: {
    opacity: 0.6,
  },
  googleIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4285F4',
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C4043',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFE69C',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  warningIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#856404',
    lineHeight: 18,
  },
  errorBox: {
    backgroundColor: '#F8D7DA',
    borderWidth: 1,
    borderColor: '#F5C2C7',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#842029',
    lineHeight: 18,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});
