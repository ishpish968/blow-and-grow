
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
      await AsyncStorage.removeItem(AUTH_USER_KEY);
      setUser(null);
      console.log('User signed out');
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
