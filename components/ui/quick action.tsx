import React from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { RADIUS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

interface QuickActionProps {
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  gradientColors: [string, string, ...string[]];
  onPress: () => void;
}

export default function QuickAction({
  title,
  subtitle,
  icon,
  gradientColors,
  onPress,
}: QuickActionProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.container, { opacity: pressed ? 0.9 : 1 }]}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: '45%',
  },
  gradient: {
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    minHeight: 120,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: FONT_SIZE.xs,
  },
});
