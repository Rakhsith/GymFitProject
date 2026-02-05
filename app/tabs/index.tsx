import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  Activity,
  Dumbbell,
  MapPin,
  Music,
  Leaf,
  Sun,
  Moon,
  CloudSun,
  Smile,
  Meh,
  Frown,
  Zap,
  Bell,
  ChevronRight,
  Calendar,
  TrendingUp,
  Target,
  Heart,
  Award,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import QuickAction from '@/components/ui/QuickAction';
import SectionHeader from '@/components/ui/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

type Mood = 'great' | 'good' | 'neutral' | 'low' | null;

const moodOptions = [
  { key: 'great' as const, icon: Smile, label: 'Great', color: Colors.dark.accentGreen },
  { key: 'good' as const, icon: Smile, label: 'Good', color: Colors.dark.accent },
  { key: 'neutral' as const, icon: Meh, label: 'Okay', color: Colors.dark.accentOrange },
  { key: 'low' as const, icon: Frown, label: 'Low', color: Colors.dark.accentRed },
];

const quickStats = [
  { label: 'Workouts', value: '0', icon: Dumbbell, color: Colors.dark.primary },
  { label: 'Calories', value: '0', icon: Zap, color: Colors.dark.accentOrange },
  { label: 'Minutes', value: '0', icon: Activity, color: Colors.dark.accentGreen },
];

export default function DashboardScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const { showCustomNotification, showMotivation } = useNotifications();

  const handleMoodSelect = (mood: Mood) => {
    setSelectedMood(mood);
    const messages: Record<string, { title: string; message: string }> = {
      great: { title: "Feeling Great! 🌟", message: "That's the spirit! Let's channel this energy into something amazing!" },
      good: { title: "Good Vibes! 😊", message: "Nice! A positive mindset is half the battle won!" },
      neutral: { title: "Hanging In There! 💪", message: "Every day can't be a 10/10. But showing up matters!" },
      low: { title: "Hey, It's Okay! 🤗", message: "Rough days happen. How about a light workout to boost your mood?" },
    };
    if (mood) {
      const msg = messages[mood];
      showCustomNotification(msg.title, msg.message, mood === 'great' || mood === 'good' ? 'celebration' : 'nudge');
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: 'Good Morning', icon: Sun };
    if (hour < 17) return { text: 'Good Afternoon', icon: CloudSun };
    return { text: 'Good Evening', icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  const hasProfileData = profile.height || profile.weight || profile.age;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#12121A', '#0f0f1a']}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.brandContainer}>
                <LinearGradient colors={Colors.dark.gradient.primary} style={styles.brandLogo}>
                  <Dumbbell size={18} color="#FFFFFF" />
                </LinearGradient>
                <View>
                  <Text style={styles.brandName}>GYMFIT PRO+</Text>
                  <View style={styles.greetingRow}>
                    <GreetingIcon size={14} color={Colors.dark.accentOrange} />
                    <Text style={styles.greeting}>{greeting.text}</Text>
                  </View>
                </View>
              </View>
              <Text style={styles.userName}>{user?.name || 'Athlete'}</Text>
            </View>
            <View style={styles.headerRight}>
              <Pressable style={styles.notificationButton}>
                <Bell size={22} color={Colors.dark.textSecondary} />
                <View style={styles.notificationDot} />
              </Pressable>
              <Pressable 
                style={styles.avatarButton}
                onPress={() => router.push('/(tabs)/profile')}
              >
                <LinearGradient colors={Colors.dark.gradient.primary} style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {getInitials(user?.name || 'GA')}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>

          <GlassCard style={styles.readinessCard} gradient>
            <View style={styles.readinessHeader}>
              <View style={styles.readinessLeft}>
                <View style={styles.readinessBadge}>
                  <Award size={14} color={Colors.dark.primary} />
                  <Text style={styles.readinessBadgeText}>Daily Readiness</Text>
                </View>
                {hasProfileData ? (
                  <>
                    <Text style={styles.readinessValue}>--</Text>
                    <Text style={styles.readinessSubtext}>
                      Complete more metrics to get your score
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.readinessPlaceholder}>Not Available</Text>
                    <Pressable
                      style={styles.setupButton}
                      onPress={() => router.push('/(tabs)/metrics')}
                    >
                      <Text style={styles.setupButtonText}>Setup Profile</Text>
                      <ChevronRight size={14} color={Colors.dark.primary} />
                    </Pressable>
                  </>
                )}
              </View>
              <View style={styles.readinessIcon}>
                <LinearGradient colors={Colors.dark.gradient.primary} style={styles.readinessIconGradient}>
                  <Zap size={28} color="#FFFFFF" />
                </LinearGradient>
              </View>
            </View>
          </GlassCard>

          <View style={styles.quickStatsRow}>
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <GlassCard key={stat.label} style={styles.quickStatCard}>
                  <View style={[styles.quickStatIcon, { backgroundColor: `${stat.color}20` }]}>
                    <Icon size={18} color={stat.color} />
                  </View>
                  <Text style={styles.quickStatValue}>{stat.value}</Text>
                  <Text style={styles.quickStatLabel}>{stat.label}</Text>
                </GlassCard>
              );
            })}
          </View>

          <SectionHeader title="How are you feeling today?" />
          <View style={styles.moodContainer}>
            {moodOptions.map((mood) => {
              const MoodIcon = mood.icon;
              const isSelected = selectedMood === mood.key;
              return (
                <Pressable
                  key={mood.key}
                  onPress={() => handleMoodSelect(mood.key)}
                  style={[
                    styles.moodOption,
                    isSelected && { borderColor: mood.color, backgroundColor: `${mood.color}20` },
                  ]}
                >
                  <MoodIcon
                    size={24}
                    color={isSelected ? mood.color : Colors.dark.textTertiary}
                  />
                  <Text
                    style={[
                      styles.moodLabel,
                      isSelected && { color: mood.color },
                    ]}
                  >
                    {mood.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <SectionHeader title="Quick Actions" subtitle="What would you like to do?" />
          <View style={styles.actionsGrid}>
            <QuickAction
              title="Start Workout"
              subtitle="Train smarter"
              icon={<Dumbbell size={22} color="#FFFFFF" />}
              gradientColors={['#6366F1', '#8B5CF6']}
              onPress={() => router.push('/(tabs)/workouts')}
            />
            <QuickAction
              title="Plan Trip"
              subtitle="Active travel"
              icon={<MapPin size={22} color="#FFFFFF" />}
              gradientColors={['#22D3EE', '#0891B2']}
              onPress={() => router.push('/(tabs)/travel')}
            />
            <QuickAction
              title="Find Music"
              subtitle="Workout beats"
              icon={<Music size={22} color="#FFFFFF" />}
              gradientColors={['#1DB954', '#1ed760']}
              onPress={() => router.push('/(tabs)/music')}
            />
            <QuickAction
              title="Relax"
              subtitle="Unwind & recover"
              icon={<Leaf size={22} color="#FFFFFF" />}
              gradientColors={['#10B981', '#22D3EE']}
              onPress={() => router.push('/(tabs)/relaxation')}
            />
          </View>

          <SectionHeader title="Featured" />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredScroll}
          >
            <Pressable 
              style={styles.featuredCard}
              onPress={() => router.push('/(tabs)/workouts')}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=200&fit=crop' }}
                style={styles.featuredImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.featuredOverlay}
              />
              <View style={styles.featuredContent}>
                <View style={styles.featuredBadge}>
                  <Text style={styles.featuredBadgeText}>NEW</Text>
                </View>
                <Text style={styles.featuredTitle}>YouTube Tutorials</Text>
                <Text style={styles.featuredSubtitle}>Learn proper form with video guides</Text>
              </View>
            </Pressable>
            
            <Pressable 
              style={styles.featuredCard}
              onPress={() => router.push('/(tabs)/booking')}
            >
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&h=200&fit=crop' }}
                style={styles.featuredImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.9)']}
                style={styles.featuredOverlay}
              />
              <View style={styles.featuredContent}>
                <View style={[styles.featuredBadge, { backgroundColor: Colors.dark.accentGreen }]}>
                  <Text style={styles.featuredBadgeText}>BOOK</Text>
                </View>
                <Text style={styles.featuredTitle}>Turf & Sports</Text>
                <Text style={styles.featuredSubtitle}>Book nearby sports facilities</Text>
              </View>
            </Pressable>
          </ScrollView>

          <SectionHeader
            title="Today's Insights"
            actionLabel="View All"
            onAction={() => router.push('/(tabs)/reports')}
          />
          <GlassCard style={styles.insightsCard}>
            {hasProfileData ? (
              <View style={styles.insightRow}>
                <View style={styles.insightIcon}>
                  <Activity size={20} color={Colors.dark.primary} />
                </View>
                <Text style={styles.insightText}>
                  Complete more activities to see personalized insights
                </Text>
                <ChevronRight size={18} color={Colors.dark.textTertiary} />
              </View>
            ) : (
              <View style={styles.emptyInsights}>
                <LinearGradient colors={Colors.dark.gradient.primary} style={styles.emptyInsightsIcon}>
                  <TrendingUp size={28} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.emptyInsightsTitle}>No Insights Yet</Text>
                <Text style={styles.emptyInsightsText}>
                  Add your metrics to start receiving personalized health insights
                </Text>
                <Pressable 
                  style={styles.getStartedButton}
                  onPress={() => router.push('/(tabs)/metrics')}
                >
                  <Text style={styles.getStartedText}>Get Started</Text>
                  <ChevronRight size={16} color={Colors.dark.primary} />
                </Pressable>
              </View>
            )}
          </GlassCard>

          <SectionHeader title="Location Overview" />
          <GlassCard style={styles.mapPreview}>
            <View style={styles.mapPlaceholder}>
              <LinearGradient colors={Colors.dark.gradient.accent} style={styles.mapIcon}>
                <MapPin size={32} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.mapPlaceholderTitle}>Map Preview</Text>
              <Text style={styles.mapPlaceholderText}>
                Enable location to see nearby gyms, parks and trails
              </Text>
              <Pressable
                style={styles.enableLocationButton}
                onPress={() => router.push('/(tabs)/travel')}
              >
                <Text style={styles.enableLocationText}>Enable Location</Text>
              </Pressable>
            </View>
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xxl,
  },
  headerLeft: {},
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  brandLogo: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
  },
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: 2,
  },
  greeting: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  userName: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.accentRed,
  },
  avatarButton: {},
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  readinessCard: {
    marginBottom: SPACING.lg,
  },
  readinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readinessLeft: {},
  readinessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  readinessBadgeText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  readinessValue: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.display,
    fontWeight: FONT_WEIGHT.bold,
  },
  readinessPlaceholder: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  readinessSubtext: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  setupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  setupButtonText: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  readinessIcon: {},
  readinessIconGradient: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickStatsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  quickStatCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
  },
  quickStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickStatValue: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  quickStatLabel: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  moodContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  moodOption: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: Colors.dark.surfaceLight,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodLabel: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  featuredScroll: {
    gap: SPACING.md,
    paddingBottom: SPACING.md,
  },
  featuredCard: {
    width: 280,
    height: 160,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  featuredContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
  },
  featuredBadge: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
    alignSelf: 'flex-start',
    marginBottom: SPACING.sm,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
  },
  featuredTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  featuredSubtitle: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  insightsCard: {
    marginBottom: SPACING.xxl,
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.dark.primary}20`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightText: {
    flex: 1,
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  emptyInsights: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyInsightsIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyInsightsTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  emptyInsightsText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  getStartedText: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  mapPreview: {
    height: 200,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  mapPlaceholderTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  mapPlaceholderText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  enableLocationButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.sm,
    backgroundColor: Colors.dark.primary,
  },
  enableLocationText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
});
