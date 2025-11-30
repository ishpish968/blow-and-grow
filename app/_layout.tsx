
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AuthProvider } from '@/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="modal"
          options={{
            presentation: 'modal',
            headerShown: true,
            title: 'Modal',
          }}
        />
        <Stack.Screen
          name="formsheet"
          options={{
            presentation: 'formSheet',
            headerShown: true,
            title: 'Form Sheet',
          }}
        />
        <Stack.Screen
          name="transparent-modal"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
