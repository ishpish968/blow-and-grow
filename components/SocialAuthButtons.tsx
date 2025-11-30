
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
  const { signInWithGoogle, isLoading: googleLoading } = useGoogleAuth();
  const { signInWithApple, isAvailable: appleAvailable, isLoading: appleLoading } = useAppleAuth();
  const { signIn } = useAuth();
  const { createProfile, allProfiles } = useProfile();

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      
      if (result.success && result.params) {
        // In a production app, you would fetch user info from Google's API
        // For now, we'll create a mock user
        Alert.alert(
          'Google Sign-In',
          'Google authentication is configured but requires OAuth credentials from Google Cloud Console. Please set up your OAuth client IDs in hooks/useGoogleAuth.ts',
          [{ text: 'OK' }]
        );
        
        // Mock user data for demonstration
        const mockEmail = 'user@gmail.com';
        const mockName = 'Google User';
        
        // Create auth user
        const authUser = {
          id: `google_${Date.now()}`,
          email: mockEmail,
          name: mockName,
          provider: 'google' as const,
          providerId: `google_${Date.now()}`,
        };
        
        await signIn(authUser);
        
        // Check if profile exists for this email
        const existingProfile = allProfiles.find(p => p.id === authUser.id);
        
        if (!existingProfile) {
          // Create a new profile
          await createProfile(mockName || mockEmail.split('@')[0]);
        }
        
        onSuccess?.();
        router.replace('/(tabs)/(home)');
      } else if (result.cancelled) {
        console.log('Google sign-in cancelled');
      }
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
          style={styles.googleButton}
          onPress={handleGoogleSignIn}
          disabled={googleLoading}
        >
          <Text style={styles.googleIcon}>G</Text>
          <Text style={styles.googleButtonText}>
            {googleLoading ? 'Signing in...' : 'Sign in with Google'}
          </Text>
        </TouchableOpacity>
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
  disclaimer: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});
