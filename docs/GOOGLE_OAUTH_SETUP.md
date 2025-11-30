
# Google OAuth Setup Guide for "Blow and Grow"

This guide will help you fix the "access blocked" error when signing in with Google.

## Why am I getting "access blocked"?

The error occurs because Google OAuth credentials haven't been configured yet. The app is using placeholder values that Google doesn't recognize.

## Step-by-Step Setup

### 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it "Blow and Grow" (or any name you prefer)
4. Click "Create"

### 2. Enable Required APIs

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google+ API" or "Google Identity Services"
3. Click "Enable"

### 3. Create OAuth 2.0 Credentials

You need to create separate credentials for each platform:

#### For iOS:

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "iOS" as application type
4. Enter Bundle ID: `com.anonymous.blowandgrow`
5. Click "Create"
6. Copy the Client ID (looks like: `xxxxx.apps.googleusercontent.com`)
7. Paste it in `hooks/useGoogleAuth.ts` as `GOOGLE_CLIENT_ID_IOS`

#### For Android:

1. Click "Create Credentials" → "OAuth client ID"
2. Select "Android" as application type
3. Enter Package name: `com.anonymous.blowandgrow`
4. Get your SHA-1 certificate fingerprint:
   ```bash
   # For debug builds (development)
   keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey
   # Password is usually: android
   ```
5. Copy the SHA-1 fingerprint and paste it
6. Click "Create"
7. Copy the Client ID
8. Paste it in `hooks/useGoogleAuth.ts` as `GOOGLE_CLIENT_ID_ANDROID`

#### For Web (optional, for testing):

1. Click "Create Credentials" → "OAuth client ID"
2. Select "Web application" as application type
3. Add authorized redirect URI: `http://localhost:19006`
4. Click "Create"
5. Copy the Client ID
6. Paste it in `hooks/useGoogleAuth.ts` as `GOOGLE_CLIENT_ID_WEB`

### 4. Configure Redirect URIs

This is crucial! You need to add your app's redirect URI to Google's allowlist.

1. In Google Cloud Console, go to your OAuth credentials
2. Click on each credential you created
3. Add these Authorized redirect URIs:
   - For development: `natively://auth`
   - For Expo Go: `exp://127.0.0.1:19000/--/auth` (adjust port if needed)
   - For production: Your custom scheme (e.g., `blowandgrow://auth`)

**To find your exact redirect URI:**
- Run your app
- Try to sign in with Google
- Check the console logs for "Google OAuth Redirect URI:"
- Copy that exact URI and add it to Google Cloud Console

### 5. Update Your Code

1. Open `hooks/useGoogleAuth.ts`
2. Replace these lines:
   ```typescript
   const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
   const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
   const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
   ```
3. With your actual Client IDs from Google Cloud Console

### 6. Test Your Setup

1. Restart your app
2. Try signing in with Google
3. You should now see the Google sign-in page
4. After signing in, you'll be redirected back to your app

## Troubleshooting

### "redirect_uri_mismatch" error

- The redirect URI in your app doesn't match what's in Google Cloud Console
- Check the console logs for the exact redirect URI being used
- Add that exact URI to your OAuth credentials in Google Cloud Console

### "invalid_client" error

- Your Client ID is incorrect
- Double-check you copied the right Client ID for the right platform
- Make sure there are no extra spaces or characters

### Still getting "access blocked"

- Make sure you've enabled the Google+ API or Google Identity Services
- Wait a few minutes after making changes in Google Cloud Console
- Try clearing your app's cache and restarting

### App verification required

- If your app isn't verified by Google, you might see a warning screen
- For development, you can click "Advanced" → "Go to [app name] (unsafe)"
- For production, you'll need to go through Google's app verification process

## Security Notes

- Never commit your Client IDs to public repositories
- For production apps, use environment variables
- Keep your Client Secret secure (never put it in your app code)
- Only the Client ID should be in your app code

## Need Help?

If you're still having issues:
1. Check the console logs for detailed error messages
2. Verify all redirect URIs match exactly
3. Make sure you're using the correct Client ID for your platform
4. Try the setup process again from step 1

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google Cloud Console](https://console.cloud.google.com/)
