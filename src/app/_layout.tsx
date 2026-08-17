import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import {
  useFonts,
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_600SemiBold,
} from '@expo-google-fonts/playfair-display';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import { useAppSettings } from '../hooks/useAppSettings';
import { useNotifications } from '../hooks/useNotifications';

SplashScreen.preventAutoHideAsync();

import { View } from 'react-native';

function RootLayoutNav() {
  const { theme } = useTheme();
  const { notificationEnabled, notificationTime, isLoading } = useAppSettings();

  useNotifications(!isLoading && notificationEnabled, notificationTime);
  
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
          contentStyle: { backgroundColor: theme.background },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="curhat" />
        <Stack.Screen name="more" />
        <Stack.Screen name="saved" />
        <Stack.Screen name="share" />
      </Stack>
    </View>
  );
}

export default function Layout() {
  const [loaded, error] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Tahan render sampai font selesai dimuat
  if (!loaded && !error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <RootLayoutNav />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
