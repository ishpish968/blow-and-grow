
import { useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// ============================================================================
// GOOGLE OAUTH SETUP INSTRUCTIONS
// ============================================================================
// 
// To fix the "Google OAuth not configured" error, you need to:
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
//    - The redirect URI will be logged to console when you run the app
//    - Copy that exact URI and add it to your OAuth credentials
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

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📱 GOOGLE OAUTH CONFIGURATION');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Platform:', Platform.OS);
  console.log('Client ID:', getGoogleClientId());
  console.log('Configured:', isConfigured() ? '✅ YES' : '❌ NO');
  console.log('Redirect URI:', redirectUri);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  if (!isConfigured()) {
    console.log('⚠️  SETUP REQUIRED:');
    console.log('1. Go to: https://console.cloud.google.com/');
    console.log('2. Create OAuth 2.0 credentials');
    console.log('3. Add this redirect URI to your credentials:');
    console.log('   👉', redirectUri);
    console.log('4. Update Client IDs in: hooks/useGoogleAuth.ts');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

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
      console.log('✅ Google auth success:', response);
      const { code } = response.params;
      
      // Exchange code for tokens and fetch user info
      exchangeCodeForTokens(code);
    } else if (response?.type === 'error') {
      console.error('❌ Google auth error:', response.error);
      setError(response.error?.message || 'Authentication failed');
    } else if (response?.type === 'cancel') {
      console.log('🚫 Google auth cancelled by user');
    }
  }, [response]);

  const exchangeCodeForTokens = async (code: string) => {
    try {
      console.log('🔄 Exchanging authorization code for tokens...');
      
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

      console.log('✅ Token exchange successful');

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
      console.log('✅ User info fetched:', userData);
      setUserInfo(userData);

      return userData;
    } catch (err) {
      console.error('❌ Error exchanging code for tokens:', err);
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
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  GOOGLE OAUTH NOT CONFIGURED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

To enable Google Sign-In, follow these steps:

1️⃣  Go to Google Cloud Console:
   https://console.cloud.google.com/

2️⃣  Create a new project (or select existing)

3️⃣  Enable Google+ API or Google Identity Services

4️⃣  Create OAuth 2.0 Client IDs:
   
   For ${Platform.OS.toUpperCase()}:
   - Application type: ${Platform.OS === 'ios' ? 'iOS' : Platform.OS === 'android' ? 'Android' : 'Web application'}
   - ${Platform.OS === 'ios' ? 'Bundle ID' : Platform.OS === 'android' ? 'Package name' : 'Name'}: com.anonymous.blowandgrow
   ${Platform.OS === 'android' ? '- SHA-1: Run "keytool -keystore ~/.android/debug.keystore -list -v"' : ''}

5️⃣  Add this EXACT redirect URI to your OAuth credentials:
   
   👉 ${redirectUri}
   
   ⚠️  Copy this exactly! It must match perfectly.

6️⃣  Copy your Client ID and update it in:
   hooks/useGoogleAuth.ts
   
   Replace: ${getGoogleClientId()}
   With your actual Client ID from Google Cloud Console

7️⃣  Restart the app after updating

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 For detailed instructions, see: docs/GOOGLE_OAUTH_SETUP.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

        console.log(setupInstructions);
        setError('Google OAuth not configured. Check console for setup instructions.');
        
        return {
          success: false,
          error: 'OAuth not configured',
          setupInstructions,
          redirectUri,
        };
      }

      if (!request) {
        throw new Error('Auth request not ready. Please try again.');
      }

      console.log('🚀 Starting Google sign-in flow...');
      const result = await promptAsync();

      if (result.type === 'success') {
        console.log('✅ Sign-in successful, waiting for user info...');
        // Wait for the token exchange to complete
        // The userInfo will be set by the useEffect hook
        return {
          success: true,
          params: result.params,
        };
      } else if (result.type === 'cancel') {
        console.log('🚫 User cancelled Google sign-in');
        return { success: false, cancelled: true };
      } else if (result.type === 'error') {
        throw new Error(result.error?.message || 'Authentication failed');
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      console.error('❌ Google sign-in error:', err);
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
    clientId: getGoogleClientId(),
    platform: Platform.OS,
  };
}
