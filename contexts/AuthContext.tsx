
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  provider: 'google' | 'apple' | 'username';
  providerId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (user: AuthUser) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = '@garden_auth_user';
const PROFILE_KEY = '@garden_user_profile';
const GAME_STATE_KEY = '@garden_game_state';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await AsyncStorage.getItem(AUTH_USER_KEY);
      if (savedUser) {
        const authUser: AuthUser = JSON.parse(savedUser);
        console.log('Loaded auth user:', authUser.email || authUser.name);
        setUser(authUser);
      }
    } catch (error) {
      console.error('Error loading auth user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (authUser: AuthUser) => {
    try {
      await AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
      console.log('User signed in:', authUser.email || authUser.name);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      
      // Remove auth user data
      await AsyncStorage.removeItem(AUTH_USER_KEY);
      
      // Remove profile data
      await AsyncStorage.removeItem(PROFILE_KEY);
      
      // Optionally remove game state (uncomment if you want to reset game progress on sign out)
      // await AsyncStorage.removeItem(GAME_STATE_KEY);
      
      setUser(null);
      console.log('User signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
