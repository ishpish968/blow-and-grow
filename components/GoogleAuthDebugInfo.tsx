
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useGoogleAuth } from '@/hooks/useGoogleAuth';

export function GoogleAuthDebugInfo() {
  const { isConfigured, redirectUri } = useGoogleAuth();

  const copyToClipboard = (text: string) => {
    console.log('='.repeat(60));
    console.log('COPY THIS:');
    console.log(text);
    console.log('='.repeat(60));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Google OAuth Debug Info</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Configuration Status:</Text>
        <View style={[styles.badge, isConfigured ? styles.badgeSuccess : styles.badgeError]}>
          <Text style={styles.badgeText}>
            {isConfigured ? '✓ Configured' : '✗ Not Configured'}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Redirect URI:</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{redirectUri}</Text>
        </View>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => copyToClipboard(redirectUri)}
        >
          <Text style={styles.copyButtonText}>Copy to Console</Text>
        </TouchableOpacity>
      </View>

      {!isConfigured && (
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>Setup Required</Text>
          <Text style={styles.instructionsText}>
            To enable Google Sign-In:
          </Text>
          <Text style={styles.instructionsStep}>
            1. Go to Google Cloud Console{'\n'}
            https://console.cloud.google.com/
          </Text>
          <Text style={styles.instructionsStep}>
            2. Create OAuth 2.0 credentials for iOS, Android, and Web
          </Text>
          <Text style={styles.instructionsStep}>
            3. Add the redirect URI above to your OAuth credentials
          </Text>
          <Text style={styles.instructionsStep}>
            4. Update Client IDs in hooks/useGoogleAuth.ts
          </Text>
          <Text style={styles.instructionsStep}>
            5. See docs/GOOGLE_OAUTH_SETUP.md for detailed instructions
          </Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.label}>Bundle/Package Info:</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>iOS Bundle ID: com.anonymous.blowandgrow</Text>
          <Text style={styles.infoText}>Android Package: com.anonymous.blowandgrow</Text>
        </View>
      </View>
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
  instructionsBox: {
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFE69C',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#856404',
    marginBottom: 12,
  },
  instructionsText: {
    fontSize: 14,
    color: '#856404',
    marginBottom: 8,
  },
  instructionsStep: {
    fontSize: 13,
    color: '#856404',
    marginBottom: 8,
    lineHeight: 20,
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
});
