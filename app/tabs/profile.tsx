import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  User,
  Settings,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Smartphone,
  Activity,
  Target,
  Award,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';

const menuItems = [
  { id: 'notifications', title: 'Notifications', icon: Bell, section: 'preferences' },
  { id: 'appearance', title: 'Appearance', icon: Moon, section: 'preferences' },
  { id: 'devices', title: 'Connected Devices', icon: Smartphone, section: 'preferences' },
  { id: 'privacy', title: 'Privacy & Security', icon: Shield, section: 'account' },
  { id: 'help', title: 'Help & Support', icon: HelpCircle, section: 'support' },
];

type MenuItemId = 'notifications' | 'appearance' | 'devices' | 'privacy' | 'help';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, profile, logout, logoutPending, isAuthenticated } = useAuth();

  const handleMenuPress = (itemId: MenuItemId) => {
    switch (itemId) {
      case 'notifications':
        Alert.alert(
          'Notifications',
          'Manage your notification preferences',
          [
            { text: 'Enable All', onPress: () => console.log('Enable all notifications') },
            { text: 'Workout Reminders Only', onPress: () => console.log('Workout reminders only') },
            { text: 'Disable All', onPress: () => console.log('Disable all notifications') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        break;
      case 'appearance':
        Alert.alert(
          'Appearance',
          'Choose your preferred theme',
          [
            { text: 'Dark Mode', onPress: () => console.log('Dark mode selected') },
            { text: 'Light Mode', onPress: () => console.log('Light mode selected') },
            { text: 'System Default', onPress: () => console.log('System default selected') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        break;
      case 'devices':
        Alert.alert(
          'Connected Devices',
          'No devices connected yet.\n\nConnect your fitness tracker or smartwatch to sync your workout data automatically.',
          [
            { text: 'Connect Device', onPress: () => console.log('Connect device') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        break;
      case 'privacy':
        Alert.alert(
          'Privacy & Security',
          'Manage your privacy settings',
          [
            { text: 'Change Password', onPress: () => console.log('Change password') },
            { text: 'Data & Privacy', onPress: () => console.log('Data privacy') },
            { text: 'Delete Account', style: 'destructive', onPress: () => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: () => console.log('Account deleted') },
                ]
              );
            }},
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        break;
      case 'help':
        Alert.alert(
          'Help & Support',
          'How can we help you?',
          [
            { text: 'FAQs', onPress: () => console.log('Open FAQs') },
            { text: 'Contact Support', onPress: () => console.log('Contact support') },
            { text: 'Report a Bug', onPress: () => console.log('Report bug') },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        break;
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  const stats = [
    { label: 'Workouts', value: '--', icon: Activity },
    { label: 'Goals', value: '--', icon: Target },
    { label: 'Achievements', value: '--', icon: Award },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#12121A']}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <Text style={styles.title}>Profile</Text>
          </View>

          <GlassCard style={styles.profileCard} gradient>
            <View style={styles.profileContent}>
              <LinearGradient colors={Colors.dark.gradient.primary} style={styles.avatar}>
                <User size={40} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user?.name || 'Guest User'}</Text>
                <Text style={styles.profileEmail}>{user?.email || 'Not signed in'}</Text>
                {user && (
                  <View style={styles.memberBadge}>
                    <Text style={styles.memberBadgeText}>PRO+ Member</Text>
                  </View>
                )}
              </View>
              <Pressable 
                style={styles.editButton}
                onPress={() => router.push('/(tabs)/metrics')}
              >
                <Settings size={20} color={Colors.dark.textSecondary} />
              </Pressable>
            </View>
          </GlassCard>

          <View style={styles.statsRow}>
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <View key={stat.label} style={styles.statItem}>
                  <View style={styles.statIcon}>
                    <Icon size={18} color={Colors.dark.primary} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>

          {profile.height || profile.weight ? (
            <>
              <SectionHeader title="Your Metrics" actionLabel="Edit" onAction={() => router.push('/(tabs)/metrics')} />
              <GlassCard style={styles.metricsCard}>
                <View style={styles.metricsGrid}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Height</Text>
                    <Text style={styles.metricValue}>
                      {profile.height ? `${profile.height} cm` : '--'}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Weight</Text>
                    <Text style={styles.metricValue}>
                      {profile.weight ? `${profile.weight} kg` : '--'}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Age</Text>
                    <Text style={styles.metricValue}>
                      {profile.age ? `${profile.age} yrs` : '--'}
                    </Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>Gender</Text>
                    <Text style={styles.metricValue}>
                      {profile.gender ? profile.gender.charAt(0).toUpperCase() + profile.gender.slice(1) : '--'}
                    </Text>
                  </View>
                </View>
              </GlassCard>
            </>
          ) : (
            <GlassCard style={styles.setupCard}>
              <View style={styles.setupContent}>
                <Activity size={32} color={Colors.dark.primary} />
                <Text style={styles.setupTitle}>Complete Your Profile</Text>
                <Text style={styles.setupText}>
                  Add your body metrics to unlock personalized health insights
                </Text>
                <Button
                  title="Add Metrics"
                  onPress={() => router.push('/(tabs)/metrics')}
                  variant="primary"
                  gradient
                  style={styles.setupButton}
                />
              </View>
            </GlassCard>
          )}

          <SectionHeader title="Preferences" />
          <View style={styles.menuSection}>
            {menuItems
              .filter((item) => item.section === 'preferences')
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Pressable 
                    key={item.id} 
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                    onPress={() => handleMenuPress(item.id as MenuItemId)}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuItemIcon}>
                        <Icon size={20} color={Colors.dark.primary} />
                      </View>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                    </View>
                    <ChevronRight size={20} color={Colors.dark.textTertiary} />
                  </Pressable>
                );
              })}
          </View>

          <SectionHeader title="Account" />
          <View style={styles.menuSection}>
            {menuItems
              .filter((item) => item.section === 'account')
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Pressable 
                    key={item.id} 
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                    onPress={() => handleMenuPress(item.id as MenuItemId)}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuItemIcon}>
                        <Icon size={20} color={Colors.dark.primary} />
                      </View>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                    </View>
                    <ChevronRight size={20} color={Colors.dark.textTertiary} />
                  </Pressable>
                );
              })}
          </View>

          <SectionHeader title="Support" />
          <View style={styles.menuSection}>
            {menuItems
              .filter((item) => item.section === 'support')
              .map((item) => {
                const Icon = item.icon;
                return (
                  <Pressable 
                    key={item.id} 
                    style={({ pressed }) => [styles.menuItem, pressed && styles.menuItemPressed]}
                    onPress={() => handleMenuPress(item.id as MenuItemId)}
                  >
                    <View style={styles.menuItemLeft}>
                      <View style={styles.menuItemIcon}>
                        <Icon size={20} color={Colors.dark.primary} />
                      </View>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                    </View>
                    <ChevronRight size={20} color={Colors.dark.textTertiary} />
                  </Pressable>
                );
              })}
          </View>

          {isAuthenticated ? (
            <Button
              title="Log Out"
              onPress={handleLogout}
              loading={logoutPending}
              variant="outline"
              style={styles.logoutButton}
              icon={<LogOut size={18} color={Colors.dark.accentRed} />}
              textStyle={{ color: Colors.dark.accentRed }}
            />
          ) : (
            <Button
              title="Sign In"
              onPress={() => router.push('/auth/login')}
              gradient
              style={styles.logoutButton}
            />
          )}

          <View style={styles.footer}>
            <Text style={styles.footerText}>GYMFIT PRO+ v1.0.0</Text>
            <Text style={styles.footerSubtext}>Your Digital Health Operating System</Text>
          </View>
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
    marginBottom: SPACING.xxl,
  },
  title: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  profileCard: {
    marginBottom: SPACING.xl,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    marginLeft: SPACING.lg,
  },
  profileName: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  profileEmail: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  memberBadge: {
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginTop: SPACING.sm,
  },
  memberBadgeText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
  },
  editButton: {
    padding: SPACING.sm,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  statLabel: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
  metricsCard: {
    marginBottom: SPACING.xxl,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metricItem: {
    width: '50%',
    paddingVertical: SPACING.sm,
  },
  metricLabel: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  metricValue: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
  },
  setupCard: {
    marginBottom: SPACING.xxl,
  },
  setupContent: {
    alignItems: 'center',
    padding: SPACING.lg,
  },
  setupTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  setupText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  setupButton: {},
  menuSection: {
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: SPACING.xxl,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  menuItemPressed: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuItemTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  logoutButton: {
    marginBottom: SPACING.xxl,
    borderColor: Colors.dark.accentRed,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  footerText: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  footerSubtext: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
});
