import { Stack } from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SessionProvider } from '../state/session';
import { colors } from '../theme/colors';

export default function RootLayout() {
  return <SafeAreaProvider>
    <SessionProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{
        contentStyle: { backgroundColor: colors.bg },
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.white,
        headerTitleStyle: { fontWeight: '800' },
        headerShadowVisible: false
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="zikir/[id]" options={{ title: 'Zikir detayı' }} />
      </Stack>
    </SessionProvider>
  </SafeAreaProvider>;
}
