import { Tabs, router } from 'expo-router';
import { TouchableOpacity, Text, View } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { FontSize } from '@/constants/theme';

export default function TabLayout() {
  const { colors, isDark, toggle } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerShadowVisible: !isDark,
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12, gap: 4 }}>
            <TouchableOpacity
              onPress={toggle}
              style={{ padding: 6, borderRadius: 8, backgroundColor: colors.surfaceAlt }}
            >
              <Text style={{ fontSize: 16 }}>{isDark ? '☀️' : '🌙'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/snapshots')}
              style={{ padding: 6, paddingHorizontal: 10, borderRadius: 8, backgroundColor: colors.accentSoft }}
            >
              <Text style={{ color: colors.accent, fontSize: FontSize.sm, fontWeight: '700' }}>📋 스냅샷</Text>
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'MarketLens',
          tabBarLabel: '홈',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="global"
        options={{
          title: '글로벌 마켓',
          tabBarLabel: '글로벌',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🌐</Text>,
        }}
      />
      <Tabs.Screen
        name="korea"
        options={{
          title: '한국 시장',
          tabBarLabel: '한국',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 20, color }}>🇰🇷</Text>,
        }}
      />
    </Tabs>
  );
}
