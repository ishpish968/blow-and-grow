
import { useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// Google OAuth Configuration
// NOTE: You need to set up OAuth credentials in Google Cloud Console
// and replace these with your actual client IDs
const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

const getGoogleClientId = () => {
  if (Platform.OS === 'ios') {
    return GOOGLE_CLIENT_ID_IOS;
  } else if (Platform.OS === 'android') {
    return GOOGLE_CLIENT_ID_ANDROID;
  } else {
    return GOOGLE_CLIENT_ID_WEB;
  }
};

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

export function useGoogleAuth() {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: getGoogleClientId(),
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'natively',
        path: 'auth',
      }),
    },
    discovery
  );

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (response?.type === 'success') {
      console.log('Google auth success:', response);
    } else if (response?.type === 'error') {
      console.error('Google auth error:', response.error);
      setError(response.error?.message || 'Authentication failed');
    }
  }, [response]);

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!request) {
        throw new Error('Auth request not ready');
      }

      const result = await promptAsync();
      
      if (result.type === 'success') {
        // Exchange the code for user info
        const { params } = result;
        
        // In a real app, you would exchange the code for tokens
        // and fetch user info from Google's userinfo endpoint
        // For now, we'll return a mock user
        return {
          success: true,
          params,
        };
      } else if (result.type === 'cancel') {
        console.log('User cancelled Google sign-in');
        return { success: false, cancelled: true };
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading,
    error,
    request,
  };
}
