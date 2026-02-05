import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Dumbbell,
  Target,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Clock,
  Flame,
  Zap,
  Check,
  RefreshCw,
  Play,
  Youtube,
  ExternalLink,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import { useNotifications } from '@/contexts/NotificationContext';

type Goal = 'strength' | 'muscle' | 'endurance' | 'weight_loss' | 'flexibility' | null;
type Level = 'beginner' | 'intermediate' | 'advanced' | null;
type Frequency = 2 | 3 | 4 | 5 | 6 | null;

interface WorkoutTutorial {
  id: string;
  title: string;
  duration: string;
  difficulty: string;
  youtubeUrl: string;
  thumbnailUrl: string;
  category: string;
  views: string;
  channel: string;
}

const goals = [
  { key: 'strength' as const, label: 'Build Strength', icon: Dumbbell },
  { key: 'muscle' as const, label: 'Gain Muscle', icon: Zap },
  { key: 'endurance' as const, label: 'Improve Endurance', icon: TrendingUp },
  { key: 'weight_loss' as const, label: 'Lose Weight', icon: Flame },
  { key: 'flexibility' as const, label: 'Increase Flexibility', icon: RefreshCw },
];

const levels = [
  { key: 'beginner' as const, label: 'Beginner', description: 'New to training' },
  { key: 'intermediate' as const, label: 'Intermediate', description: '1-3 years' },
  { key: 'advanced' as const, label: 'Advanced', description: '3+ years' },
];

const workoutTutorials: WorkoutTutorial[] = [
  {
    id: '1',
    title: 'Full Body Workout for Beginners',
    duration: '20 min',
    difficulty: 'Beginner',
    youtubeUrl: 'https://www.youtube.com/watch?v=UItWltVZZmE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&h=225&fit=crop',
    category: 'Full Body',
    views: '15M views',
    channel: 'JEFIT Official',
  },
  {
    id: '2',
    title: 'HIIT Cardio Workout - Fat Burning',
    duration: '30 min',
    difficulty: 'Intermediate',
    youtubeUrl: 'https://www.youtube.com/watch?v=ml6cT4AZdqI',
    thumbnailUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&h=225&fit=crop',
    category: 'Cardio',
    views: '8.2M views',
    channel: 'THENX',
  },
  {
    id: '3',
    title: 'Upper Body Strength Training',
    duration: '45 min',
    difficulty: 'Intermediate',
    youtubeUrl: 'https://www.youtube.com/watch?v=roCP6wCXPqo',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=400&h=225&fit=crop',
    category: 'Upper Body',
    views: '5.1M views',
    channel: 'Jeff Nippard',
  },
  {
    id: '4',
    title: 'Leg Day Complete Workout',
    duration: '40 min',
    difficulty: 'Advanced',
    youtubeUrl: 'https://www.youtube.com/watch?v=Vy_iOwIOH-E',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=400&h=225&fit=crop',
    category: 'Lower Body',
    views: '3.8M views',
    channel: 'Athlean-X',
  },
  {
    id: '5',
    title: 'Core & Abs Workout - No Equipment',
    duration: '15 min',
    difficulty: 'Beginner',
    youtubeUrl: 'https://www.youtube.com/watch?v=AnYl6Nk9GOA',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=225&fit=crop',
    category: 'Core',
    views: '12M views',
    channel: 'Blogilates',
  },
  {
    id: '6',
    title: 'Yoga for Flexibility & Recovery',
    duration: '25 min',
    difficulty: 'All Levels',
    youtubeUrl: 'https://www.youtube.com/watch?v=v7AYKMP6rOE',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=225&fit=crop',
    category: 'Flexibility',
    views: '20M views',
    channel: 'Yoga With Adriene',
  },
  {
    id: '7',
    title: 'Push Pull Legs - Complete Guide',
    duration: '35 min',
    difficulty: 'Intermediate',
    youtubeUrl: 'https://www.youtube.com/watch?v=qVek72z3F1U',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=225&fit=crop',
    category: 'Full Body',
    views: '7.5M views',
    channel: 'Jeremy Ethier',
  },
  {
    id: '8',
    title: 'Dumbbell Only Home Workout',
    duration: '30 min',
    difficulty: 'Beginner',
    youtubeUrl: 'https://www.youtube.com/watch?v=y1r9toPQNkM',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=400&h=225&fit=crop',
    category: 'Home Workout',
    views: '9.3M views',
    channel: 'Chris Heria',
  },
];

export default function WorkoutsScreen() {
  const [selectedGoal, setSelectedGoal] = useState<Goal>(null);
  const [selectedLevel, setSelectedLevel] = useState<Level>(null);
  const [frequency, setFrequency] = useState<Frequency>(null);
  const [showPlan, setShowPlan] = useState(false);
  const { showAchievement, showCustomNotification, showTip } = useNotifications();

  const canGeneratePlan = selectedGoal && selectedLevel && frequency;

  const handleGeneratePlan = () => {
    if (canGeneratePlan) {
      setShowPlan(true);
      showAchievement("Your personalized workout plan is ready! Time to get those gains! 💪");
    }
  };

  const handleGoalSelect = (goalKey: Goal) => {
    setSelectedGoal(goalKey);
    const messages: Record<string, { title: string; message: string }> = {
      strength: { title: "Strength Mode! 💪", message: "Building strength is the foundation of fitness. Great choice!" },
      muscle: { title: "Gains Loading... 🏋️", message: "Ready to build that physique? Let's get you jacked!" },
      endurance: { title: "Endurance Beast! 🏃", message: "Cardio kings unite! Your heart will thank you." },
      weight_loss: { title: "Burn Baby Burn! 🔥", message: "Fat doesn't stand a chance against you!" },
      flexibility: { title: "Flexy Vibes! 🧘", message: "Flexibility is the key to longevity. Smart choice!" },
    };
    if (goalKey) {
      const msg = messages[goalKey];
      if (msg) {
      showCustomNotification(msg.title, msg.message, 'motivation');
      }
    }
  };

  const openYouTube = (url: string) => {
    showTip();
    Linking.openURL(url).catch((err) => console.error('Failed to open URL:', err));
  };

  const getFilteredTutorials = () => {
    if (!selectedGoal && !selectedLevel) return workoutTutorials;
    
    return workoutTutorials.filter((tutorial) => {
      if (selectedLevel === 'beginner' && tutorial.difficulty !== 'Beginner' && tutorial.difficulty !== 'All Levels') return false;
      if (selectedLevel === 'advanced' && tutorial.difficulty === 'Beginner') return false;
      
      if (selectedGoal === 'flexibility' && tutorial.category !== 'Flexibility') return false;
      if (selectedGoal === 'weight_loss' && tutorial.category !== 'Cardio') return false;
      if (selectedGoal === 'strength' && !['Upper Body', 'Lower Body', 'Full Body'].includes(tutorial.category)) return false;
      
      return true;
    });
  };

  const filteredTutorials = getFilteredTutorials();

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
            <View style={styles.headerBrand}>
              <LinearGradient colors={Colors.dark.gradient.primary} style={styles.brandBadge}>
                <Dumbbell size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.brandText}>GYMFIT PRO+</Text>
            </View>
            <Text style={styles.title}>Workouts</Text>
            <Text style={styles.subtitle}>Personalized training programs</Text>
          </View>

          <SectionHeader title="Select Your Goal" />
          <View style={styles.goalsGrid}>
            {goals.map((goal) => {
              const Icon = goal.icon;
              const isSelected = selectedGoal === goal.key;
              return (
                <Pressable
                  key={goal.key}
                  onPress={() => handleGoalSelect(goal.key)}
                  style={[styles.goalCard, isSelected && styles.goalCardSelected]}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? Colors.dark.gradient.primary
                        : [Colors.dark.surfaceLight, Colors.dark.surfaceLight]
                    }
                    style={styles.goalIconContainer}
                  >
                    <Icon size={24} color={isSelected ? '#FFFFFF' : Colors.dark.textTertiary} />
                  </LinearGradient>
                  <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                    {goal.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkmark}>
                      <Check size={12} color="#FFFFFF" />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          {selectedGoal && (
            <>
              <SectionHeader title="Experience Level" />
              <View style={styles.levelsContainer}>
                {levels.map((level) => {
                  const isSelected = selectedLevel === level.key;
                  return (
                    <Pressable
                      key={level.key}
                      onPress={() => setSelectedLevel(level.key)}
                      style={[styles.levelCard, isSelected && styles.levelCardSelected]}
                    >
                      <View style={styles.levelContent}>
                        <Text style={[styles.levelLabel, isSelected && styles.levelLabelSelected]}>
                          {level.label}
                        </Text>
                        <Text style={styles.levelDescription}>{level.description}</Text>
                      </View>
                      <View
                        style={[styles.levelRadio, isSelected && styles.levelRadioSelected]}
                      >
                        {isSelected && <View style={styles.levelRadioInner} />}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {selectedLevel && (
            <>
              <SectionHeader title="Weekly Frequency" />
              <View style={styles.frequencyContainer}>
                {([2, 3, 4, 5, 6] as const).map((num) => {
                  const isSelected = frequency === num;
                  return (
                    <Pressable
                      key={num}
                      onPress={() => setFrequency(num)}
                      style={[styles.frequencyOption, isSelected && styles.frequencyOptionSelected]}
                    >
                      <Text
                        style={[
                          styles.frequencyNumber,
                          isSelected && styles.frequencyNumberSelected,
                        ]}
                      >
                        {num}
                      </Text>
                      <Text style={styles.frequencyLabel}>days</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          {frequency && !showPlan && (
            <Button
              title="Generate Workout Plan"
              onPress={handleGeneratePlan}
              gradient
              size="lg"
              icon={<Target size={20} color="#FFFFFF" />}
              style={styles.generateButton}
            />
          )}

          {showPlan && (
            <>
              <SectionHeader title="Your Weekly Plan" actionLabel="Edit" onAction={() => setShowPlan(false)} />
              <GlassCard style={styles.planCard} gradient>
                <View style={styles.planHeader}>
                  <View style={styles.planInfo}>
                    <Text style={styles.planTitle}>
                      {selectedGoal?.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())} Program
                    </Text>
                    <Text style={styles.planSubtitle}>
                      {frequency} days/week • {selectedLevel?.charAt(0).toUpperCase() + selectedLevel!.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.planBadge}>
                    <Text style={styles.planBadgeText}>Active</Text>
                  </View>
                </View>
              </GlassCard>

              <SectionHeader title="Periodization Schedule" />
              <View style={styles.periodizationContainer}>
                {['Week 1-3', 'Week 4-6', 'Week 7-9', 'Week 10-12'].map((period, index) => (
                  <GlassCard key={period} style={styles.periodCard}>
                    <View style={styles.periodContent}>
                      <View style={styles.periodLeft}>
                        <Calendar size={18} color={Colors.dark.primary} />
                        <Text style={styles.periodTitle}>{period}</Text>
                      </View>
                      <Text style={styles.periodPhase}>
                        {index === 0 && 'Foundation'}
                        {index === 1 && 'Build'}
                        {index === 2 && 'Peak'}
                        {index === 3 && 'Deload'}
                      </Text>
                    </View>
                  </GlassCard>
                ))}
              </View>

              <SectionHeader title="Recovery & Deload" />
              <GlassCard style={styles.deloadCard}>
                <View style={styles.deloadContent}>
                  <RefreshCw size={24} color={Colors.dark.accentGreen} />
                  <View style={styles.deloadText}>
                    <Text style={styles.deloadTitle}>Deload Week: Week 10-12</Text>
                    <Text style={styles.deloadDescription}>
                      Reduce training volume by 40-50% to allow recovery and adaptation
                    </Text>
                  </View>
                </View>
              </GlassCard>

              <SectionHeader title="Injury Prevention" />
              <GlassCard style={styles.injuryCard}>
                <View style={styles.injuryContent}>
                  <AlertTriangle size={24} color={Colors.dark.accentOrange} />
                  <View style={styles.injuryText}>
                    <Text style={styles.injuryTitle}>Risk Assessment</Text>
                    <Text style={styles.injuryDescription}>
                      Based on your program, focus on proper warm-up and mobility work before training
                    </Text>
                  </View>
                </View>
                <View style={styles.injuryTips}>
                  {['Dynamic warm-up: 10 min', 'Mobility work: 5 min', 'Cool-down stretches: 5 min'].map((tip) => (
                    <View key={tip} style={styles.tipRow}>
                      <Check size={14} color={Colors.dark.accentGreen} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            </>
          )}

          <SectionHeader 
            title="YouTube Workout Tutorials" 
            subtitle="Learn proper form & techniques"
          />
          <View style={styles.tutorialsBadge}>
            <Youtube size={16} color="#FF0000" />
            <Text style={styles.tutorialsBadgeText}>
              {filteredTutorials.length} tutorials available
            </Text>
          </View>
          
          <View style={styles.tutorialsContainer}>
            {filteredTutorials.map((tutorial) => (
              <Pressable 
                key={tutorial.id} 
                onPress={() => openYouTube(tutorial.youtubeUrl)}
                style={styles.tutorialCard}
              >
                <View style={styles.thumbnailContainer}>
                  <Image
                    source={{ uri: tutorial.thumbnailUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.thumbnailOverlay}
                  />
                  <View style={styles.playButton}>
                    <Play size={24} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                  <View style={styles.durationBadge}>
                    <Clock size={10} color="#FFFFFF" />
                    <Text style={styles.durationText}>{tutorial.duration}</Text>
                  </View>
                </View>
                <View style={styles.tutorialInfo}>
                  <Text style={styles.tutorialTitle} numberOfLines={2}>
                    {tutorial.title}
                  </Text>
                  <View style={styles.tutorialMeta}>
                    <Text style={styles.tutorialChannel}>{tutorial.channel}</Text>
                    <Text style={styles.tutorialViews}>• {tutorial.views}</Text>
                  </View>
                  <View style={styles.tutorialTags}>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{tutorial.category}</Text>
                    </View>
                    <View style={[styles.difficultyTag, 
                      tutorial.difficulty === 'Beginner' && styles.beginnerTag,
                      tutorial.difficulty === 'Intermediate' && styles.intermediateTag,
                      tutorial.difficulty === 'Advanced' && styles.advancedTag,
                    ]}>
                      <Text style={styles.difficultyTagText}>{tutorial.difficulty}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.watchButton}>
                  <ExternalLink size={18} color={Colors.dark.primary} />
                </View>
              </Pressable>
            ))}
          </View>

          {!selectedGoal && (
            <GlassCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Dumbbell size={48} color={Colors.dark.textTertiary} />
                <Text style={styles.emptyTitle}>Start Your Journey</Text>
                <Text style={styles.emptyText}>
                  Select a fitness goal above to create your personalized workout plan
                </Text>
              </View>
            </GlassCard>
          )}
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
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  brandBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
  },
  title: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  goalCard: {
    width: '47%',
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    position: 'relative',
  },
  goalCardSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  goalLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  goalLabelSelected: {
    color: Colors.dark.text,
  },
  checkmark: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  levelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  levelCardSelected: {
    borderColor: Colors.dark.primary,
  },
  levelContent: {
    flex: 1,
  },
  levelLabel: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  levelLabelSelected: {
    color: Colors.dark.primary,
  },
  levelDescription: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  levelRadio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  levelRadioSelected: {
    borderColor: Colors.dark.primary,
  },
  levelRadioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.primary,
  },
  frequencyContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  frequencyOption: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  frequencyOptionSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  frequencyNumber: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  frequencyNumberSelected: {
    color: Colors.dark.primary,
  },
  frequencyLabel: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
  },
  generateButton: {
    marginBottom: SPACING.xxl,
  },
  planCard: {
    marginBottom: SPACING.xxl,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planInfo: {},
  planTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  planSubtitle: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  planBadge: {
    backgroundColor: Colors.dark.accentGreen,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  planBadgeText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
  },
  periodizationContainer: {
    gap: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  periodCard: {
    padding: SPACING.md,
  },
  periodContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  periodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  periodTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  periodPhase: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  deloadCard: {
    marginBottom: SPACING.xxl,
  },
  deloadContent: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  deloadText: {
    flex: 1,
  },
  deloadTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  deloadDescription: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
  injuryCard: {
    marginBottom: SPACING.xxl,
  },
  injuryContent: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  injuryText: {
    flex: 1,
  },
  injuryTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  injuryDescription: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
  injuryTips: {
    gap: SPACING.sm,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  tipText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  tutorialsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: RADIUS.md,
    alignSelf: 'flex-start',
  },
  tutorialsBadgeText: {
    color: '#FF0000',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  tutorialsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  tutorialCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  thumbnailContainer: {
    width: 140,
    height: 110,
    position: 'relative',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  tutorialInfo: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  tutorialTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
    lineHeight: 18,
  },
  tutorialMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  tutorialChannel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  tutorialViews: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginLeft: SPACING.xs,
  },
  tutorialTags: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  categoryTag: {
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  categoryTagText: {
    color: Colors.dark.textSecondary,
    fontSize: 10,
  },
  difficultyTag: {
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  beginnerTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  intermediateTag: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  advancedTag: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  difficultyTagText: {
    color: Colors.dark.textSecondary,
    fontSize: 10,
  },
  watchButton: {
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  emptyCard: {
    marginTop: SPACING.xxl,
    minHeight: 200,
  },
  emptyContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
