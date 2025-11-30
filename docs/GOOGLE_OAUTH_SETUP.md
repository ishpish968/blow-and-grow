
# Google OAuth Setup Guide for "Blow and Grow"

## 🚨 Quick Fix for "Google OAuth not configured" Error

The error appears because you need to set up Google OAuth credentials. Follow these steps:

---

## 📋 Prerequisites

- A Google account
- Access to [Google Cloud Console](https://console.cloud.google.com/)
- Your app running in development mode

---

## 🛠️ Step-by-Step Setup

### Step 1: Get Your Redirect URI

1. **Run your app** in development mode
2. **Check the console logs** - you'll see output like this:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 GOOGLE OAUTH CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform: ios
Redirect URI: natively://auth
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

3. **Copy the Redirect URI** - you'll need this exact value later

---

### Step 2: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"Select a project"** at the top
3. Click **"New Project"**
4. Enter project name: **"Blow and Grow"** (or any name you prefer)
5. Click **"Create"**
6. Wait for the project to be created (takes a few seconds)

---

### Step 3: Enable Google+ API

1. In your project, click the **hamburger menu** (☰) → **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"** or **"Google Identity Services"**
3. Click on it
4. Click **"Enable"**
5. Wait for it to enable (takes a few seconds)

---

### Step 4: Create OAuth 2.0 Credentials

Now you need to create credentials for each platform you're testing on:

#### For iOS:

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: **Blow and Grow**
   - User support email: Your email
   - Developer contact: Your email
   - Click **"Save and Continue"** through the remaining steps
4. Back to creating OAuth client ID:
   - Application type: **iOS**
   - Name: **Blow and Grow iOS**
   - Bundle ID: **com.anonymous.blowandgrow**
5. Click **"Create"**
6. **Copy the Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)
7. Keep this window open - you'll need it in Step 5

#### For Android:

1. Click **"Create Credentials"** → **"OAuth client ID"** again
2. Application type: **Android**
3. Name: **Blow and Grow Android**
4. Package name: **com.anonymous.blowandgrow**
5. Get your SHA-1 certificate fingerprint:
   
   **On Mac/Linux:**
   ```bash
   keytool -keystore ~/.android/debug.keystore -list -v -alias androiddebugkey
   ```
   
   **On Windows:**
   ```bash
   keytool -keystore %USERPROFILE%\.android\debug.keystore -list -v -alias androiddebugkey
   ```
   
   **Password:** `android` (default debug keystore password)
   
6. Copy the **SHA-1** value and paste it into the form
7. Click **"Create"**
8. **Copy the Client ID**

#### For Web (Optional - for testing in browser):

1. Click **"Create Credentials"** → **"OAuth client ID"** again
2. Application type: **Web application**
3. Name: **Blow and Grow Web**
4. Authorized JavaScript origins: `http://localhost:19006`
5. Authorized redirect URIs: `http://localhost:19006`
6. Click **"Create"**
7. **Copy the Client ID**

---

### Step 5: Add Redirect URI to Credentials

This is **CRITICAL** - if you skip this, authentication will fail!

1. In Google Cloud Console, go to **"APIs & Services"** → **"Credentials"**
2. Click on the **iOS credential** you just created
3. Scroll down to **"Authorized redirect URIs"** (you may need to expand this section)
4. Click **"Add URI"**
5. Paste the **exact Redirect URI** from Step 1 (e.g., `natively://auth`)
6. Click **"Save"**
7. **Repeat for Android and Web credentials** if you created them

⚠️ **Important:** The redirect URI must match EXACTLY. Even a small difference will cause errors.

---

### Step 6: Update Your Code

1. Open your project in your code editor
2. Navigate to: **`hooks/useGoogleAuth.ts`**
3. Find these lines near the top:

```typescript
const GOOGLE_CLIENT_ID_IOS = 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_ANDROID = 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com';
```

4. Replace them with your actual Client IDs from Step 4:

```typescript
const GOOGLE_CLIENT_ID_IOS = '123456789-abcdefg.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_ANDROID = '987654321-hijklmn.apps.googleusercontent.com';
const GOOGLE_CLIENT_ID_WEB = '555555555-opqrstu.apps.googleusercontent.com';
```

5. **Save the file**

---

### Step 7: Restart Your App

1. **Stop** the development server (Ctrl+C or Cmd+C)
2. **Restart** it: `npm run dev` or `expo start`
3. **Try signing in with Google** again

---

## ✅ Verification

After completing the setup, you should see in the console:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📱 GOOGLE OAUTH CONFIGURATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Platform: ios
Client ID: 123456789-abcdefg.apps.googleusercontent.com
Configured: ✅ YES
Redirect URI: natively://auth
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

The warning box in the app should also disappear.

---

## 🐛 Troubleshooting

### Error: "redirect_uri_mismatch"

**Problem:** The redirect URI doesn't match what's configured in Google Cloud Console.

**Solution:**
1. Check the console logs for the exact redirect URI being used
2. Go to Google Cloud Console → Credentials → Your OAuth client
3. Make sure the redirect URI is added EXACTLY as shown in logs
4. Save and try again

### Error: "invalid_client"

**Problem:** The Client ID is incorrect or doesn't exist.

**Solution:**
1. Double-check you copied the correct Client ID from Google Cloud Console
2. Make sure you're using the right Client ID for the right platform (iOS/Android/Web)
3. Verify there are no extra spaces or characters

### Error: "access_blocked: This app's request is invalid"

**Problem:** The OAuth consent screen isn't configured properly.

**Solution:**
1. Go to Google Cloud Console → APIs & Services → OAuth consent screen
2. Fill in all required fields (app name, support email, etc.)
3. Add your email as a test user if the app is in testing mode
4. Save and try again

### Still getting "Google OAuth not configured"

**Problem:** The Client IDs in your code still contain placeholder text.

**Solution:**
1. Open `hooks/useGoogleAuth.ts`
2. Make sure the Client IDs don't contain "YOUR_" or "CLIENT_ID"
3. They should look like: `123456789-abcdefg.apps.googleusercontent.com`
4. Save the file and restart the app

### App verification warning

**Problem:** Google shows a warning that the app isn't verified.

**Solution:**
- For development: Click "Advanced" → "Go to [app name] (unsafe)"
- For production: You'll need to submit your app for Google's verification process

---

## 🔒 Security Best Practices

1. **Never commit credentials to Git:**
   - Add `hooks/useGoogleAuth.ts` to `.gitignore` if it contains real credentials
   - Use environment variables for production

2. **Use different credentials for development and production:**
   - Create separate OAuth clients for dev and prod
   - Use environment variables to switch between them

3. **Restrict your credentials:**
   - In Google Cloud Console, restrict each credential to specific bundle IDs/package names
   - Add only necessary redirect URIs

4. **Keep your Client Secret secure:**
   - Never put the Client Secret in your app code
   - Only the Client ID should be in your app

---

## 📚 Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/)
- [Google Cloud Console](https://console.cloud.google.com/)

---

## 💡 Quick Reference

**App Identifiers:**
- iOS Bundle ID: `com.anonymous.blowandgrow`
- Android Package: `com.anonymous.blowandgrow`

**Files to Update:**
- `hooks/useGoogleAuth.ts` - Add your Client IDs here

**Console Logs to Check:**
- Look for "GOOGLE OAUTH CONFIGURATION" section
- Check if "Configured" shows ✅ YES

---

## 🆘 Still Need Help?

If you're still having issues after following this guide:

1. Check the console logs for detailed error messages
2. Verify all steps were completed exactly as described
3. Make sure redirect URIs match EXACTLY (case-sensitive)
4. Try deleting and recreating the OAuth credentials
5. Wait a few minutes after making changes in Google Cloud Console

The most common issue is the redirect URI not matching exactly. Double-check this first!
