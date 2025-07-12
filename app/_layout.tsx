import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="welcome" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding-step2" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding-step3" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding-step4" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding-step5" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding-step6" options={{ headerShown: false }} />
        <Stack.Screen name="comprehensive-health-assessment" options={{ headerShown: false }} />
        <Stack.Screen name="symptom-checker" options={{ headerShown: false }} />
        <Stack.Screen name="consultation-flow" options={{ headerShown: false }} />
        <Stack.Screen name="self-service-flow" options={{ headerShown: false }} />
        <Stack.Screen name="assisted-help-flow" options={{ headerShown: false }} />
        <Stack.Screen name="ai-assessment-results" options={{ headerShown: false }} />
        <Stack.Screen name="medical-education" options={{ headerShown: false }} />
        <Stack.Screen name="medical-protocol-flow" options={{ headerShown: false }} />
        <Stack.Screen name="app-flow-guide" options={{ headerShown: false }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="medical-records" options={{ headerShown: false }} />
        <Stack.Screen name="consultations" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="signin" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="forgot-password" options={{ headerShown: false }} />
        <Stack.Screen name="verify-2fa" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
