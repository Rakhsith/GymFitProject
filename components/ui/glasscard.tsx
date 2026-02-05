import React from 'react';
import { View, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { RADIUS, SPACING } from '@/constants/theme';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: () => void;
  gradient?: boolean;
  gradientColors?: [string, string, ...string[]];
  borderGlow?: string;
  padding?: number;
}

export default function GlassCard({
  children,
  style,
  onPress,
  gradient = false,
  gradientColors,
  borderGlow,
  padding = SPACING.lg,
}: GlassCardProps) {
  const content = (
    <View
      style={[
        styles.card,
        { padding },
        borderGlow && { borderColor: borderGlow, borderWidth: 1 },
        style,
      ]}
    >
      {gradient && (
        <LinearGradient
          colors={gradientColors || ['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.05)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
      )}
      <View style={styles.glassOverlay} />
      {children}
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    overflow: 'hidden',
    position: 'relative',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.dark.glass,
  },
});
