import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-url-polyfill/auto';
import { isSupabaseConfigured } from '@/lib/supabase';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';

const queryClient = new QueryClient();

export const unstable_settings = { anchor: '(tabs)' };

function AppShell() {
  const { colors, isDark } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured) {
      import('@/lib/supabase').then(({ supabase }) => {
        supabase.auth.getSession().finally(() => setReady(true));
      }).catch(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/login" options={{ title: '로그인', headerShown: true, presentation: 'modal' }} />
        <Stack.Screen name="snapshots" options={{ title: '스냅샷 히스토리', headerShown: true }} />
        <Stack.Screen name="snapshot-detail" options={{ title: '스냅샷 상세', headerShown: true }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AppShell />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
