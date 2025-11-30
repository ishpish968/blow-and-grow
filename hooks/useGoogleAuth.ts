
import { useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// ============================================================================
// GOOGLE OAUTH SETUP INSTRUCTIONS
// ============================================================================
// 
// To fix the "access blocked" error, you need to:
//
// 1. Go to Google Cloud Console: https://console.cloud.google.com/
// 2. Create a new project or select an existing one
// 3. Enable Google+ API (or Google Identity Services)
// 4. Go to "Credentials" and create OAuth 2.0 Client IDs for each platform:
//
//    FOR iOS:
//    - Application type: iOS
//    - Bundle ID: com.anonymous.blowandgrow (from app.json)
//    - Copy the Client ID and paste it below as GOOGLE_CLIENT_ID_IOS
//
//    FOR ANDROID:
//    - Application type: Android
//    - Package name: com.anonymous.blowandgrow (from app.json)
//    - SHA-1 certificate fingerprint: Get this by running:
//      keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey
//      (password is usually "android")
//    - Copy the Client ID and paste it below as GOOGLE_CLIENT_ID_ANDROID
//
//    FOR WEB:
//    - Application type: Web application
//    - Authorized redirect URIs: Add your web URL (e.g., http://localhost:19006)
//    - Copy the Client ID and paste it below as GOOGLE_CLIENT_ID_WEB
//
// 5. IMPORTANT: Add authorized redirect URIs in Google Cloud Console:
//    - For development: natively://auth
//    - For Expo Go: exp://127.0.0.1:19000/--/auth (adjust port if needed)
//
// 6. Replace the placeholder values below with your actual Client IDs
//
// ============================================================================

// REPLACE THESE WITH YOUR ACTUAL GOOGLE OAUTH CLIENT IDs
const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';

// Check if OAuth is configured
const isConfigured = () => {
  const clientId = getGoogleClientId();
  return !clientId.includes('YOUR_') && !clientId.includes('CLIENT_ID');
};

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<any>(null);

  // Get the redirect URI that will be used
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'natively',
    path: 'auth',
  });

  console.log('Google OAuth Redirect URI:', redirectUri);
  console.log('Google OAuth Client ID:', getGoogleClientId());
  console.log('OAuth Configured:', isConfigured());

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: getGoogleClientId(),
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      usePKCE: true,
      extraParams: {
        access_type: 'offline',
      },
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      console.log('Google auth success:', response);
      const { code } = response.params;
      
      // Exchange code for tokens and fetch user info
      exchangeCodeForTokens(code);
    } else if (response?.type === 'error') {
      console.error('Google auth error:', response.error);
      setError(response.error?.message || 'Authentication failed');
    } else if (response?.type === 'cancel') {
      console.log('Google auth cancelled by user');
    }
  }, [response]);

  const exchangeCodeForTokens = async (code: string) => {
    try {
      // Exchange the authorization code for tokens
      const tokenResponse = await AuthSession.exchangeCodeAsync(
        {
          clientId: getGoogleClientId(),
          code,
          redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier || '',
          },
        },
        discovery
      );

      console.log('Token exchange successful');

      // Fetch user info from Google
      const userInfoResponse = await fetch(
        'https://www.googleapis.com/oauth2/v2/userinfo',
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        }
      );

      const userData = await userInfoResponse.json();
      console.log('User info fetched:', userData);
      setUserInfo(userData);

      return userData;
    } catch (err) {
      console.error('Error exchanging code for tokens:', err);
      setError('Failed to complete authentication');
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Check if OAuth is configured
      if (!isConfigured()) {
        const setupInstructions = `
Google OAuth is not configured yet!

To fix the "access blocked" error:

1. Go to Google Cloud Console
   https://console.cloud.google.com/

2. Create OAuth 2.0 credentials for:
   - iOS (Bundle ID: com.anonymous.blowandgrow)
   - Android (Package: com.anonymous.blowandgrow)
   - Web (for testing)

3. Add this redirect URI to your OAuth credentials:
   ${redirectUri}

4. Update the Client IDs in:
   hooks/useGoogleAuth.ts

Current platform: ${Platform.OS}
Current Client ID: ${getGoogleClientId()}
        `.trim();

        console.error(setupInstructions);
        setError('Google OAuth not configured. Check console for setup instructions.');
        
        return {
          success: false,
          error: 'OAuth not configured',
          setupInstructions,
        };
      }

      if (!request) {
        throw new Error('Auth request not ready. Please try again.');
      }

      console.log('Starting Google sign-in flow...');
      const result = await promptAsync();

      if (result.type === 'success') {
        // Wait for the token exchange to complete
        // The userInfo will be set by the useEffect hook
        return {
          success: true,
          params: result.params,
        };
      } else if (result.type === 'cancel') {
        console.log('User cancelled Google sign-in');
        return { success: false, cancelled: true };
      } else if (result.type === 'error') {
        throw new Error(result.error?.message || 'Authentication failed');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      
      return {
        success: false,
        error: err,
        errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithGoogle,
    isLoading,
    error,
    request,
    userInfo,
    isConfigured: isConfigured(),
    redirectUri,
  };
}
