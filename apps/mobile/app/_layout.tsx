import { StudentProvider, useStudent } from '@edu/core/react';
import { colors } from '@edu/design';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { deviceStorage } from '@/storage';

function RootStack() {
  const { m } = useStudent();
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.primaryStrong },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: '700' },
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="course/[id]" options={{ title: m.nav.courses }} />
        <Stack.Screen name="test/[id]" options={{ title: m.nav.tests }} />
        <Stack.Screen name="material/[id]" options={{ title: m.nav.material }} />
        <Stack.Screen name="login" options={{ title: m.auth.login }} />
        <Stack.Screen name="register" options={{ title: m.auth.createAccount }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StudentProvider storage={deviceStorage}>
        <RootStack />
      </StudentProvider>
    </SafeAreaProvider>
  );
}
