import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Utensils,
  Flame,
  Beef,
  Wheat,
  Droplets,
  Leaf,
  Fish,
  Egg,
  Apple,
  Clock,
  Info,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';

type DietPreference = 'standard' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';
type Goal = 'maintain' | 'lose' | 'gain';

const dietOptions: { key: DietPreference; label: string; icon: typeof Leaf }[] = [
  { key: 'standard', label: 'Standard', icon: Utensils },
  { key: 'vegetarian', label: 'Vegetarian', icon: Leaf },
  { key: 'vegan', label: 'Vegan', icon: Apple },
  { key: 'keto', label: 'Keto', icon: Beef },
  { key: 'paleo', label: 'Paleo', icon: Fish },
];

const goalOptions: { key: Goal; label: string; modifier: number }[] = [
  { key: 'lose', label: 'Lose Weight', modifier: -500 },
  { key: 'maintain', label: 'Maintain', modifier: 0 },
  { key: 'gain', label: 'Gain Muscle', modifier: 300 },
];

export default function DietScreen() {
  const { profile } = useAuth();
  const [calories, setCalories] = useState('');
  const [preference, setPreference] = useState<DietPreference>('standard');
  const [goal, setGoal] = useState<Goal>('maintain');
  const [showPlan, setShowPlan] = useState(false);
  const { showCustomNotification, showDietReminder } = useNotifications();

  const handleCaloriesChange = (value: string) => {
    setCalories(value);
    const cal = parseInt(value);
    if (cal && cal > 0 && value.length >= 4) {
      showCustomNotification(
        "Calories Set! 🎯",
        "Great start! Now let's build your perfect nutrition plan.",
        'achievement'
      );
    }
  };

  const handleDietSelect = (diet: DietPreference) => {
    setPreference(diet);
    const messages: Record<DietPreference, string> = {
      standard: "Balanced nutrition for balanced results! 🍽️",
      vegetarian: "Plant-powered gains coming your way! 🥬",
      vegan: "Going green! Your body and planet will thank you! 🌱",
      keto: "Keto mode activated! Fat-burning furnace ON! 🔥",
      paleo: "Eating like our ancestors! Back to basics! 🦴",
    };
    showCustomNotification("Diet Selected!", messages[diet], 'tip');
  };

  const handleGoalSelect = (g: Goal) => {
    setGoal(g);
    if (g === 'lose') {
      showCustomNotification("Weight Loss Mode! 🏃", "Remember: It's a marathon, not a sprint. You got this!", 'motivation');
    } else if (g === 'gain') {
      showCustomNotification("Bulk Season! 💪", "Time to eat big and lift bigger! Gains incoming!", 'motivation');
    }
  };

  const handleShowPlan = () => {
    setShowPlan(!showPlan);
    if (!showPlan) {
      showDietReminder();
    }
  };

  const macros = useMemo(() => {
    const cal = parseInt(calories);
    if (!cal || cal <= 0) return null;

    let proteinRatio = 0.3;
    let carbRatio = 0.4;
    let fatRatio = 0.3;

    if (preference === 'keto') {
      proteinRatio = 0.25;
      carbRatio = 0.05;
      fatRatio = 0.7;
    } else if (goal === 'gain') {
      proteinRatio = 0.35;
      carbRatio = 0.45;
      fatRatio = 0.2;
    } else if (goal === 'lose') {
      proteinRatio = 0.4;
      carbRatio = 0.3;
      fatRatio = 0.3;
    }

    return {
      protein: Math.round((cal * proteinRatio) / 4),
      carbs: Math.round((cal * carbRatio) / 4),
      fat: Math.round((cal * fatRatio) / 9),
      proteinCal: Math.round(cal * proteinRatio),
      carbsCal: Math.round(cal * carbRatio),
      fatCal: Math.round(cal * fatRatio),
    };
  }, [calories, preference, goal]);

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
            <Text style={styles.title}>Nutrition</Text>
            <Text style={styles.subtitle}>Plan your daily macros</Text>
          </View>

          <SectionHeader title="Daily Calorie Target" />
          <GlassCard style={styles.inputCard}>
            <Input
              label="Target Calories"
              placeholder="e.g., 2000"
              value={calories}
              onChangeText={handleCaloriesChange}
              keyboardType="numeric"
              icon={<Flame size={20} color={Colors.dark.textTertiary} />}
              containerStyle={styles.calorieInput}
            />
            {profile.weight && profile.height && profile.age && (
              <View style={styles.suggestionRow}>
                <Info size={14} color={Colors.dark.primary} />
                <Text style={styles.suggestionText}>
                  Based on your metrics, suggested range: 1800-2200 kcal
                </Text>
              </View>
            )}
          </GlassCard>

          <SectionHeader title="Dietary Preference" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dietScroll}
            contentContainerStyle={styles.dietScrollContent}
          >
            {dietOptions.map((diet) => {
              const Icon = diet.icon;
              const isSelected = preference === diet.key;
              return (
                <Pressable
                  key={diet.key}
                  onPress={() => handleDietSelect(diet.key)}
                  style={[styles.dietOption, isSelected && styles.dietOptionSelected]}
                >
                  <Icon
                    size={24}
                    color={isSelected ? Colors.dark.primary : Colors.dark.textTertiary}
                  />
                  <Text style={[styles.dietLabel, isSelected && styles.dietLabelSelected]}>
                    {diet.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <SectionHeader title="Nutrition Goal" />
          <View style={styles.goalsContainer}>
            {goalOptions.map((g) => {
              const isSelected = goal === g.key;
              return (
                <Pressable
                  key={g.key}
                  onPress={() => handleGoalSelect(g.key)}
                  style={[styles.goalOption, isSelected && styles.goalOptionSelected]}
                >
                  <Text style={[styles.goalLabel, isSelected && styles.goalLabelSelected]}>
                    {g.label}
                  </Text>
                  <Text style={styles.goalModifier}>
                    {g.modifier > 0 ? `+${g.modifier}` : g.modifier} kcal
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {macros && (
            <>
              <SectionHeader title="Macro Distribution" />
              <GlassCard style={styles.macroCard} gradient>
                <View style={styles.macroHeader}>
                  <Text style={styles.macroTitle}>Daily Targets</Text>
                  <Text style={styles.macroCalories}>{calories} kcal</Text>
                </View>

                <View style={styles.macroBar}>
                  <View
                    style={[
                      styles.macroSegment,
                      styles.proteinSegment,
                      { flex: macros.proteinCal },
                    ]}
                  />
                  <View
                    style={[styles.macroSegment, styles.carbsSegment, { flex: macros.carbsCal }]}
                  />
                  <View
                    style={[styles.macroSegment, styles.fatSegment, { flex: macros.fatCal }]}
                  />
                </View>

                <View style={styles.macroDetails}>
                  <View style={styles.macroItem}>
                    <View style={[styles.macroDot, styles.proteinDot]} />
                    <View style={styles.macroInfo}>
                      <Text style={styles.macroName}>Protein</Text>
                      <Text style={styles.macroValue}>{macros.protein}g</Text>
                    </View>
                  </View>
                  <View style={styles.macroItem}>
                    <View style={[styles.macroDot, styles.carbsDot]} />
                    <View style={styles.macroInfo}>
                      <Text style={styles.macroName}>Carbs</Text>
                      <Text style={styles.macroValue}>{macros.carbs}g</Text>
                    </View>
                  </View>
                  <View style={styles.macroItem}>
                    <View style={[styles.macroDot, styles.fatDot]} />
                    <View style={styles.macroInfo}>
                      <Text style={styles.macroName}>Fat</Text>
                      <Text style={styles.macroValue}>{macros.fat}g</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>

              <Button
                title={showPlan ? 'Hide Meal Ideas' : 'Show Meal Ideas'}
                onPress={handleShowPlan}
                variant="secondary"
                style={styles.mealButton}
              />

              {showPlan && (
                <>
                  <SectionHeader title="Sample Meal Plan" />
                  {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map((meal, index) => (
                    <GlassCard key={meal} style={styles.mealCard}>
                      <View style={styles.mealHeader}>
                        <View style={styles.mealLeft}>
                          <Clock size={16} color={Colors.dark.primary} />
                          <Text style={styles.mealTitle}>{meal}</Text>
                        </View>
                        <Text style={styles.mealCalories}>
                          ~{Math.round(parseInt(calories) * (index === 3 ? 0.1 : 0.3))} kcal
                        </Text>
                      </View>
                      <Text style={styles.mealPlaceholder}>
                        {preference === 'vegan' && 'Plant-based options recommended'}
                        {preference === 'keto' && 'Low-carb, high-fat options'}
                        {preference === 'vegetarian' && 'Meat-free options'}
                        {preference === 'standard' && 'Balanced meal options'}
                        {preference === 'paleo' && 'Whole food options'}
                      </Text>
                    </GlassCard>
                  ))}
                </>
              )}
            </>
          )}

          {!macros && (
            <GlassCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Utensils size={48} color={Colors.dark.textTertiary} />
                <Text style={styles.emptyTitle}>Set Your Calories</Text>
                <Text style={styles.emptyText}>
                  Enter your daily calorie target to see personalized macro recommendations
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
  inputCard: {
    marginBottom: SPACING.xxl,
  },
  calorieInput: {
    marginBottom: 0,
  },
  suggestionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.md,
    padding: SPACING.md,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: RADIUS.md,
  },
  suggestionText: {
    flex: 1,
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  dietScroll: {
    marginBottom: SPACING.xxl,
    marginHorizontal: -SPACING.xl,
  },
  dietScrollContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  dietOption: {
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    minWidth: 90,
  },
  dietOptionSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  dietLabel: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    marginTop: SPACING.sm,
  },
  dietLabelSelected: {
    color: Colors.dark.primary,
  },
  goalsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  goalOption: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  goalOptionSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  goalLabel: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  goalLabelSelected: {
    color: Colors.dark.primary,
  },
  goalModifier: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  macroCard: {
    marginBottom: SPACING.xl,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  macroTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
  },
  macroCalories: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  macroBar: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  macroSegment: {
    height: '100%',
  },
  proteinSegment: {
    backgroundColor: Colors.dark.accentPink,
  },
  carbsSegment: {
    backgroundColor: Colors.dark.accent,
  },
  fatSegment: {
    backgroundColor: Colors.dark.accentOrange,
  },
  macroDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  macroDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  proteinDot: {
    backgroundColor: Colors.dark.accentPink,
  },
  carbsDot: {
    backgroundColor: Colors.dark.accent,
  },
  fatDot: {
    backgroundColor: Colors.dark.accentOrange,
  },
  macroInfo: {},
  macroName: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  macroValue: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  mealButton: {
    marginBottom: SPACING.xxl,
  },
  mealCard: {
    marginBottom: SPACING.md,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  mealLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  mealTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  mealCalories: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  mealPlaceholder: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    fontStyle: 'italic',
  },
  emptyCard: {
    marginTop: SPACING.xl,
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
