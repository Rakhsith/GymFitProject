import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { RADIUS, SPACING, FONT_SIZE, FONT_WEIGHT } from '@/constants/theme';

interface StatCardProps {
  label: string;
  value: string | number | null;
  unit?: string;
  icon: React.ReactNode;
  gradientColors?: readonly [string, string, ...string[]];
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

export default function StatCard({
  label,
  value,
  unit,
  icon,
  gradientColors = Colors.dark.gradient.primary,
  trend,
  trendValue,
}: StatCardProps) {
  const hasValue = value !== null && value !== undefined && value !== '';

  return (
    <View style={styles.card}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.iconContainer}
      >
        {icon}
      </LinearGradient>
      <Text style={styles.label}>{label}</Text>
      {hasValue ? (
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {unit && <Text style={styles.unit}>{unit}</Text>}
        </View>
      ) : (
        <Text style={styles.placeholder}>--</Text>
      )}
      {trend && trendValue && hasValue && (
        <View style={[styles.trendContainer, trend === 'up' && styles.trendUp, trend === 'down' && styles.trendDown]}>
          <Text style={styles.trendText}>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    minWidth: 140,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  label: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  unit: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.xs,
  },
  placeholder: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  trendContainer: {
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    backgroundColor: Colors.dark.surfaceLight,
    alignSelf: 'flex-start',
  },
  trendUp: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  trendDown: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  trendText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
});
