import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { useTheme } from '../context/ThemeContext';
import { AppTheme } from '../constants/themes';

export type TabName = 'curhat' | 'index' | 'more';

interface TabItem {
  name: TabName;
  label: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
}

const TABS: TabItem[] = [
  {
    name: 'curhat',
    label: 'Curhat',
    iconActive: 'sparkles',
    iconInactive: 'sparkles-outline',
  },
  {
    name: 'index',
    label: 'Utama',
    iconActive: 'home',
    iconInactive: 'home-outline',
  },
  {
    name: 'more',
    label: 'Lainnya',
    iconActive: 'menu',
    iconInactive: 'menu-outline',
  },
];

interface BottomNavProps {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabPress }) => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const handlePress = (tab: TabName) => {
    if (tab === activeTab) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onTabPress(tab);
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 8, backgroundColor: theme.surface, borderTopColor: theme.border }]}>
      {TABS.map((tab) => {
        const isActive = tab.name === activeTab;
        return (
          <TabButton
            key={tab.name}
            tab={tab}
            isActive={isActive}
            theme={theme}
            onPress={() => handlePress(tab.name)}
          />
        );
      })}
    </View>
  );
};

interface TabButtonProps {
  tab: TabItem;
  isActive: boolean;
  theme: AppTheme;
  onPress: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ tab, isActive, theme, onPress }) => {
  const opacity = useSharedValue(isActive ? 1 : 0.4);

  React.useEffect(() => {
    opacity.value = withTiming(isActive ? 1 : 0.4, { duration: 150 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <TouchableOpacity
      style={styles.tab}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <Animated.View style={[styles.tabInner, animatedStyle]}>
        <Ionicons
          name={isActive ? tab.iconActive : tab.iconInactive}
          size={22}
          color={isActive ? theme.textPrimary : theme.textMuted}
        />
        <Text style={[styles.label, { color: isActive ? theme.textPrimary : theme.textMuted }, isActive && styles.labelActive]}>
          {tab.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabInner: {
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontFamily: 'Inter_400Regular',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  labelActive: {
    fontFamily: 'Inter_500Medium',
  },
});

export default BottomNav;
