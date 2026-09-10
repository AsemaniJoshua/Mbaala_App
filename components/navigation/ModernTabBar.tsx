import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { useApp } from '@/context/AppContext';

export const ModernTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { hasCompletedOnboarding } = useApp();

  // Keep bottom tab bar hidden during first-time onboarding
  if (!hasCompletedOnboarding) {
    return null;
  }

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync();
      } catch {
        // Fallback
      }
    }
  };

  return (
    <View style={styles.floatingDockWrap} pointerEvents="box-none">
      <View style={styles.dock}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const onPress = () => {
            triggerHaptic();
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          let label = 'Tab';
          if (route.name === 'index') label = 'Scan';
          else if (route.name === 'history') label = 'Flock';
          else if (route.name === 'settings') label = 'Settings';

          const renderIcon = (active: boolean) => {
            const color = active ? '#10B981' : '#94A3B8';

            if (route.name === 'index') {
              // Camera / Viewfinder Reticle Icon
              return (
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M4 8V6C4 4.89543 4.89543 4 6 4H8M16 4H18C19.1046 4 20 4.89543 20 6V8M20 16V18C20 19.1046 19.1046 20 18 20H16M8 20H6C4.89543 20 4 19.1046 4 18V16"
                    stroke={color}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <Circle cx="12" cy="12" r="3.5" stroke={color} strokeWidth="2.2" />
                </Svg>
              );
            }

            if (route.name === 'history') {
              // Flock Health / Records Clipboard Icon
              return (
                <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                  <Rect
                    x="5"
                    y="4"
                    width="14"
                    height="17"
                    rx="3"
                    stroke={color}
                    strokeWidth="2"
                  />
                  <Path
                    d="M9 3C9 2.44772 9.44772 2 10 2H14C14.5523 2 15 2.44772 15 3V4H9V3Z"
                    fill={active ? '#ECFDF5' : '#FFFFFF'}
                    stroke={color}
                    strokeWidth="1.8"
                  />
                  <Path
                    d="M9 10H15M9 14H13"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </Svg>
              );
            }

            // Settings / Dialect Switcher Icon
            return (
              <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
                <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
                <Path
                  d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
                  stroke={color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            );
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel || label}
              onPress={onPress}
              activeOpacity={0.8}
              style={[
                styles.tabButton,
                isFocused && styles.tabButtonActive,
              ]}
            >
              {renderIcon(isFocused)}
              {isFocused && (
                <Text style={styles.activeLabel}>{label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingDockWrap: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 24 : 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 34,
    paddingVertical: 7,
    paddingHorizontal: 10,
    minWidth: 260,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 18,
    elevation: 8,
    gap: 8,
  },
  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 24,
  },
  tabButtonActive: {
    backgroundColor: '#ECFDF5',
  },
  activeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 7,
    letterSpacing: -0.2,
  },
});
