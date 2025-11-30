
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, Alert } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export function GoogleAuthDebugInfo() {
  const { isConfigured, redirectUri, clientId, platform } = useGoogleAuth();

  const copyToClipboard = (text: string, label: string) => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📋 ${label.toUpperCase()}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(text);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    Alert.alert(
      `${label} Copied`,
      `Copied to console:\n\n${text}`,
      [{ text: 'OK' }]
    );
  };

  const showFullSetupGuide = () => {
    const guide = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📚 COMPLETE GOOGLE OAUTH SETUP GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

STEP 1: Go to Google Cloud Console
→ https://console.cloud.google.com/

STEP 2: Create or Select a Project
→ Click "Select a project" → "New Project"
→ Name it "Blow and Grow" (or any name)
→ Click "Create"

STEP 3: Enable Required APIs
→ Go to "APIs & Services" → "Library"
→ Search for "Google+ API" or "Google Identity Services"
→ Click "Enable"

STEP 4: Create OAuth 2.0 Credentials
→ Go to "APIs & Services" → "Credentials"
→ Click "Create Credentials" → "OAuth client ID"

For ${platform.toUpperCase()}:
→ Application type: ${platform === 'ios' ? 'iOS' : platform === 'android' ? 'Android' : 'Web application'}
→ ${platform === 'ios' ? 'Bundle ID' : platform === 'android' ? 'Package name' : 'Name'}: com.anonymous.blowandgrow
${platform === 'android' ? '→ SHA-1: Run "keytool -keystore ~/.android/debug.keystore -list -v"' : ''}

STEP 5: Add Redirect URI
→ In your OAuth credential settings
→ Add this EXACT redirect URI:

${redirectUri}

⚠️  This must match EXACTLY! Copy it carefully.

STEP 6: Copy Your Client ID
→ After creating the credential, copy the Client ID
→ It looks like: xxxxx.apps.googleusercontent.com

STEP 7: Update Your Code
→ Open: hooks/useGoogleAuth.ts
→ Find this line:
   ${clientId}
→ Replace it with your actual Client ID

STEP 8: Restart the App
→ Stop the development server
→ Restart with: npm run dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📖 For more details, see: docs/GOOGLE_OAUTH_SETUP.md
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `.trim();

    console.log(guide);
    
    Alert.alert(
      'Setup Guide',
      'Complete setup instructions have been logged to the console. Check your terminal/console for the full guide.',
      [{ text: 'OK' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Google OAuth Debug Info</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Configuration Status:</Text>
        <View style={[styles.badge, isConfigured ? styles.badgeSuccess : styles.badgeError]}>
          <Text style={styles.badgeText}>
            {isConfigured ? '✅ Configured' : '❌ Not Configured'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Platform:</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>{platform}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Current Client ID:</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{clientId}</Text>
        </View>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => copyToClipboard(clientId, 'Current Client ID')}
        >
          <Text style={styles.copyButtonText}>Copy to Console</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Redirect URI:</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{redirectUri}</Text>
        </View>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => copyToClipboard(redirectUri, 'Redirect URI')}
        >
          <Text style={styles.copyButtonText}>Copy to Console</Text>
        </TouchableOpacity>
        <Text style={styles.helperText}>
          ⚠️ Add this exact URI to your Google Cloud Console OAuth credentials
        </Text>
      </View>

      {!isConfigured && (
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>⚙️ Setup Required</Text>
          <Text style={styles.instructionsText}>
            Google Sign-In is not configured yet. Follow these steps:
          </Text>
          
          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>1</Text>
            <Text style={styles.stepText}>
              Go to Google Cloud Console{'\n'}
              console.cloud.google.com
            </Text>
          </View>

          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>2</Text>
            <Text style={styles.stepText}>
              Create OAuth 2.0 credentials for {platform}
            </Text>
          </View>

          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>3</Text>
            <Text style={styles.stepText}>
              Add the redirect URI above to your credentials
            </Text>
          </View>

          <View style={styles.stepContainer}>
            <Text style={styles.stepNumber}>4</Text>
            <Text style={styles.stepText}>
              Update Client ID in hooks/useGoogleAuth.ts
            </Text>
          </View>

          <TouchableOpacity
            style={styles.guideButton}
            onPress={showFullSetupGuide}
          >
            <Text style={styles.guideButtonText}>📖 View Complete Setup Guide</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>App Identifiers:</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>iOS Bundle ID: com.anonymous.blowandgrow</Text>
          <Text style={styles.infoText}>Android Package: com.anonymous.blowandgrow</Text>
        </View>
      </View>

      {isConfigured && (
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>✅</Text>
          <View style={styles.successTextContainer}>
            <Text style={styles.successTitle}>Configuration Complete!</Text>
            <Text style={styles.successText}>
              Google Sign-In is properly configured and ready to use.
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  badgeSuccess: {
    backgroundColor: '#D4EDDA',
  },
  badgeError: {
    backgroundColor: '#F8D7DA',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  codeBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  codeText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#333',
  },
  copyButton: {
    marginTop: 8,
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  copyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  helperText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  instructionsBox: {
    backgroundColor: '#FFF3CD',
    borderWidth: 2,
    borderColor: '#FFE69C',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 16,
    lineHeight: 20,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#856404',
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },
  stepText: {
    flex: 1,
    fontSize: 13,
    color: '#856404',
    lineHeight: 20,
  },
  guideButton: {
    backgroundColor: '#856404',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  guideButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#E7F3FF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#B3D9FF',
  },
  infoText: {
    fontSize: 13,
    color: '#004085',
    marginBottom: 4,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D4EDDA',
    borderWidth: 2,
    borderColor: '#C3E6CB',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  successTextContainer: {
    flex: 1,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 4,
  },
  successText: {
    fontSize: 14,
    color: '#155724',
    lineHeight: 20,
  },
});
