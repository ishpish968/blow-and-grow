
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { SocialAuthButtons } from '@/components/SocialAuthButtons';
import { AvatarDisplay } from '@/components/AvatarDisplay';
import { AvatarSelectionModal } from '@/components/AvatarSelectionModal';

export default function ProfileSetupScreen() {
  const [username, setUsername] = useState('');
  const [selectedAvatarId, setSelectedAvatarId] = useState('girl_default');
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const { createProfile } = useProfile();
  const { signIn } = useAuth();

  const handleCreateProfile = async () => {
    if (username.trim().length < 3) {
      Alert.alert('Invalid Username', 'Username must be at least 3 characters long');
      return;
    }

    if (username.trim().length > 20) {
      Alert.alert('Invalid Username', 'Username must be less than 20 characters');
      return;
    }

    try {
      // Create auth user with username provider
      const authUser = {
        id: `username_${Date.now()}`,
        name: username.trim(),
        provider: 'username' as const,
      };
      
      await signIn(authUser);
      await createProfile(username.trim(), selectedAvatarId);
      router.replace('/(tabs)/(home)');
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={styles.emoji}>🌱</Text>
          <Text style={styles.title}>Welcome to Blow and Grow!</Text>
          <Text style={styles.subtitle}>Create your gardener profile to start tracking your progress</Text>

          <View style={styles.avatarSection}>
            <Text style={styles.label}>Choose Your Avatar</Text>
            <TouchableOpacity
              style={styles.avatarButton}
              onPress={() => setShowAvatarModal(true)}
            >
              <AvatarDisplay size={100} />
              <Text style={styles.changeAvatarText}>Tap to change</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Choose Your Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter username..."
              placeholderTextColor={colors.textSecondary}
              value={username}
              onChangeText={setUsername}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={styles.hint}>3-20 characters</Text>
          </View>

          <TouchableOpacity
            style={[styles.button, username.trim().length < 3 && styles.buttonDisabled]}
            onPress={handleCreateProfile}
            disabled={username.trim().length < 3}
          >
            <Text style={styles.buttonText}>Start Growing! 🌱</Text>
          </TouchableOpacity>

          <SocialAuthButtons />

          <View style={styles.features}>
            <Text style={styles.featureTitle}>Track Your Progress:</Text>
            <Text style={styles.featureItem}>📊 Monitor your garden statistics</Text>
            <Text style={styles.featureItem}>🏆 Unlock achievements</Text>
            <Text style={styles.featureItem}>🎯 Compete with other gardeners</Text>
            <Text style={styles.featureItem}>🌟 Discover rare plants</Text>
          </View>
        </View>
      </ScrollView>

      <AvatarSelectionModal
        visible={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        onSelect={setSelectedAvatarId}
        currentAvatarId={selectedAvatarId}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  avatarSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  changeAvatarText: {
    marginTop: 8,
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  hint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  features: {
    marginTop: 32,
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: colors.secondary,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  featureItem: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
});
