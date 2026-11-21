import { brand } from '@edu/core';
import { useStudent } from '@edu/core/react';
import { colors } from '@edu/design';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, Text, View, type ColorValue } from 'react-native';

type IconName = ComponentProps<typeof Ionicons>['name'];

function LanguageToggle() {
  const { m, locale, dispatch } = useStudent();
  return (
    <Pressable
      testID="lang-toggle"
      accessibilityRole="button"
      accessibilityLabel={`Switch language to ${m.common.switchLanguage}`}
      onPress={() => dispatch({ type: 'setLocale', locale: locale === 'mr' ? 'en' : 'mr' })}
      style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 16, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' }}
    >
      <Ionicons name="language" size={16} color="#fff" />
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}>{m.common.switchLanguage}</Text>
    </Pressable>
  );
}

function BrandTitle() {
  const { L } = useStudent();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <View style={{ width: 32, height: 32, borderRadius: 9, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 3, borderBottomColor: colors.accent }}>
        <Text style={{ color: colors.primaryStrong, fontWeight: '800', fontSize: 16 }}>{L(brand.shortName).slice(0, 1)}</Text>
      </View>
      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 17 }}>{L(brand.name)}</Text>
    </View>
  );
}

const tab = (icon: IconName, activeIcon: IconName) => ({
  tabBarIcon: ({ color, focused }: { color: ColorValue; focused: boolean }) => <Ionicons name={focused ? activeIcon : icon} size={22} color={color as string} />,
});

export default function TabsLayout() {
  const { m } = useStudent();
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.primaryStrong },
        headerTintColor: '#fff',
        headerTitle: () => <BrandTitle />,
        headerRight: () => <LanguageToggle />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarStyle: { borderTopColor: colors.border },
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen name="index" options={{ title: m.nav.home, ...tab('home-outline', 'home') }} />
      <Tabs.Screen name="courses" options={{ title: m.nav.courses, ...tab('book-outline', 'book') }} />
      <Tabs.Screen name="tests" options={{ title: m.nav.tests, ...tab('clipboard-outline', 'clipboard') }} />
      <Tabs.Screen name="material" options={{ title: m.nav.materialShort, ...tab('document-text-outline', 'document-text') }} />
      <Tabs.Screen name="profile" options={{ title: m.nav.profile, ...tab('person-circle-outline', 'person-circle') }} />
    </Tabs>
  );
}
