import { Tabs, router } from 'expo-router';
import { TouchableOpacity, Text } from 'react-native';
import { C, FontSize } from '@/constants/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: C.accent,
        tabBarInactiveTintColor: C.tabIconDefault,
        tabBarStyle: { backgroundColor: C.background, borderTopColor: C.border },
        headerStyle: { backgroundColor: C.background },
        headerTintColor: C.text,
        headerTitleStyle: { color: C.text, fontWeight: '700' },
        headerRight: () => (
          <TouchableOpacity
            onPress={() => router.push('/snapshots')}
            style={{ marginRight: 16 }}
          >
            <Text style={{ color: C.accent, fontSize: FontSize.md }}>📋 스냅샷</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'MarketLens',
          tabBarLabel: '홈',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="global"
        options={{
          title: '글로벌 마켓',
          tabBarLabel: '글로벌',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🌐</Text>,
        }}
      />
      <Tabs.Screen
        name="korea"
        options={{
          title: '한국 시장',
          tabBarLabel: '한국',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 22, color }}>🇰🇷</Text>,
        }}
      />
    </Tabs>
  );
}
