
import { useState, useEffect } from 'react';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

export function useAppleAuth() {
  const [isAvailable, setIsAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    if (Platform.OS !== 'ios') {
      setIsAvailable(false);
      return;
    }

    try {
      const available = await AppleAuthentication.isAvailableAsync();
      setIsAvailable(available);
      console.log('Apple Authentication available:', available);
    } catch (err) {
      console.error('Error checking Apple auth availability:', err);
      setIsAvailable(false);
    }
  };

  const signInWithApple = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('Apple sign-in successful:', credential);

      // Extract user information
      const { user, email, fullName } = credential;
      
      return {
        success: true,
        user: {
          id: user,
          email: email || undefined,
          name: fullName 
            ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
            : undefined,
        },
      };
    } catch (err: any) {
      console.error('Apple sign-in error:', err);
      
      if (err.code === 'ERR_REQUEST_CANCELED') {
        console.log('User cancelled Apple sign-in');
        return { success: false, cancelled: true };
      } else {
        setError(err.message || 'Authentication failed');
        return { success: false, error: err };
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithApple,
    isAvailable,
    isLoading,
    error,
  };
}
