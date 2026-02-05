import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  X,
  Sparkles,
  Bell,
  Trophy,
  Lightbulb,
  Sun,
  Heart,
  Zap,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import { useNotifications, NotificationType } from '@/contexts/NotificationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const getNotificationStyle = (type: NotificationType) => {
  switch (type) {
    case 'motivation':
      return {
        gradient: ['#6366F1', '#8B5CF6'] as const,
        icon: Zap,
        iconBg: '#6366F120',
      };
    case 'reminder':
      return {
        gradient: ['#F59E0B', '#EF4444'] as const,
        icon: Bell,
        iconBg: '#F59E0B20',
      };
    case 'achievement':
      return {
        gradient: ['#10B981', '#22D3EE'] as const,
        icon: Trophy,
        iconBg: '#10B98120',
      };
    case 'tip':
      return {
        gradient: ['#22D3EE', '#6366F1'] as const,
        icon: Lightbulb,
        iconBg: '#22D3EE20',
      };
    case 'greeting':
      return {
        gradient: ['#F59E0B', '#EC4899'] as const,
        icon: Sun,
        iconBg: '#F59E0B20',
      };
    case 'nudge':
      return {
        gradient: ['#EC4899', '#A855F7'] as const,
        icon: Heart,
        iconBg: '#EC489920',
      };
    case 'celebration':
      return {
        gradient: ['#10B981', '#6366F1'] as const,
        icon: Sparkles,
        iconBg: '#10B98120',
      };
    default:
      return {
        gradient: ['#6366F1', '#8B5CF6'] as const,
        icon: Bell,
        iconBg: '#6366F120',
      };
  }
};

export default function NotificationToast() {
  const insets = useSafeAreaInsets();
  const { currentNotification, dismissNotification } = useNotifications();
  const translateY = useRef(new Animated.Value(-150)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (currentNotification) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -150,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [currentNotification, translateY, opacity, scale]);

  if (!currentNotification) {
    return null;
  }

  const style = getNotificationStyle(currentNotification.type);
  const Icon = style.icon;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          top: insets.top + SPACING.sm,
          transform: [{ translateY }, { scale }],
          opacity,
        },
      ]}
    >
      <Pressable onPress={dismissNotification} style={styles.pressable}>
        <LinearGradient
          colors={['rgba(26, 26, 36, 0.98)', 'rgba(18, 18, 26, 0.98)']}
          style={styles.toastContainer}
        >
          <View style={styles.glowEffect}>
            <LinearGradient
              colors={style.gradient}
              style={styles.glowGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
          </View>
          
          <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: style.iconBg }]}>
              <LinearGradient colors={style.gradient} style={styles.iconGradient}>
                <Icon size={18} color="#FFFFFF" />
              </LinearGradient>
            </View>
            
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {currentNotification.title}
              </Text>
              <Text style={styles.message} numberOfLines={2}>
                {currentNotification.message}
              </Text>
            </View>
            
            <Pressable
              style={styles.closeButton}
              onPress={dismissNotification}
              hitSlop={10}
            >
              <X size={16} color={Colors.dark.textTertiary} />
            </Pressable>
          </View>
          
          <View style={styles.progressContainer}>
            <Animated.View style={styles.progressTrack}>
              <LinearGradient
                colors={style.gradient}
                style={styles.progressBar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </Animated.View>
          </View>
        </LinearGradient>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 9999,
    elevation: 999,
  },
  pressable: {
    width: '100%',
  },
  toastContainer: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      web: {
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      },
    }),
  },
  glowEffect: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 100,
    height: 100,
    opacity: 0.3,
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconGradient: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: 2,
  },
  message: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 18,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    height: 3,
    backgroundColor: Colors.dark.surfaceLight,
  },
  progressTrack: {
    height: '100%',
    width: '100%',
  },
  progressBar: {
    height: '100%',
    width: '100%',
  },
});
