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
  Activity,
  Scale,
  Ruler,
  Calendar,
  User,
  TrendingUp,
  Heart,
  Flame,
  AlertTriangle,
  Info,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import StatCard from '@/components/ui/StatCard';
import ProgressRing from '@/components/ui/ProgressRing';
import SectionHeader from '@/components/ui/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';

type Gender = 'male' | 'female' | 'other';

export default function MetricsScreen() {
  const { profile, updateProfile, profileUpdatePending } = useAuth();
  
  const [height, setHeight] = useState(profile.height?.toString() || '');
  const [weight, setWeight] = useState(profile.weight?.toString() || '');
  const [age, setAge] = useState(profile.age?.toString() || '');
  const [gender, setGender] = useState<Gender | undefined>(profile.gender);

  const calculations = useMemo(() => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseFloat(age);

    if (!h || !w || h <= 0 || w <= 0) {
      return { bmi: null, bmr: null, category: null, riskLevel: null };
    }

    const heightInM = h / 100;
    const bmi = w / (heightInM * heightInM);

    let category = '';
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    if (bmi < 18.5) {
      category = 'Underweight';
      riskLevel = 'moderate';
    } else if (bmi < 25) {
      category = 'Normal';
      riskLevel = 'low';
    } else if (bmi < 30) {
      category = 'Overweight';
      riskLevel = 'moderate';
    } else {
      category = 'Obese';
      riskLevel = 'high';
    }

    let bmr = null;
    if (a && a > 0 && gender) {
      if (gender === 'male') {
        bmr = 88.362 + 13.397 * w + 4.799 * h - 5.677 * a;
      } else {
        bmr = 447.593 + 9.247 * w + 3.098 * h - 4.33 * a;
      }
    }

    return { bmi: bmi.toFixed(1), bmr: bmr ? Math.round(bmr) : null, category, riskLevel };
  }, [height, weight, age, gender]);

  const handleSave = async () => {
    await updateProfile({
      height: parseFloat(height) || undefined,
      weight: parseFloat(weight) || undefined,
      age: parseInt(age) || undefined,
      gender,
    });
  };

  const hasInputs = height || weight || age || gender;

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
            <Text style={styles.title}>Health Metrics</Text>
            <Text style={styles.subtitle}>Track your body composition</Text>
          </View>

          <SectionHeader title="Body Measurements" />
          <GlassCard style={styles.inputCard}>
            <View style={styles.inputGrid}>
              <View style={styles.inputHalf}>
                <Input
                  label="Height (cm)"
                  placeholder="175"
                  value={height}
                  onChangeText={setHeight}
                  keyboardType="numeric"
                  icon={<Ruler size={20} color={Colors.dark.textTertiary} />}
                  containerStyle={styles.inputContainer}
                />
              </View>
              <View style={styles.inputHalf}>
                <Input
                  label="Weight (kg)"
                  placeholder="70"
                  value={weight}
                  onChangeText={setWeight}
                  keyboardType="numeric"
                  icon={<Scale size={20} color={Colors.dark.textTertiary} />}
                  containerStyle={styles.inputContainer}
                />
              </View>
            </View>

            <View style={styles.inputGrid}>
              <View style={styles.inputHalf}>
                <Input
                  label="Age"
                  placeholder="25"
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  icon={<Calendar size={20} color={Colors.dark.textTertiary} />}
                  containerStyle={styles.inputContainer}
                />
              </View>
              <View style={styles.inputHalf}>
                <Text style={styles.genderLabel}>Gender</Text>
                <View style={styles.genderOptions}>
                  {(['male', 'female', 'other'] as Gender[]).map((g) => (
                    <Pressable
                      key={g}
                      onPress={() => setGender(g)}
                      style={[
                        styles.genderOption,
                        gender === g && styles.genderOptionSelected,
                      ]}
                    >
                      <User
                        size={16}
                        color={gender === g ? '#FFFFFF' : Colors.dark.textTertiary}
                      />
                      <Text
                        style={[
                          styles.genderText,
                          gender === g && styles.genderTextSelected,
                        ]}
                      >
                        {g.charAt(0).toUpperCase() + g.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>

            <Button
              title="Save Metrics"
              onPress={handleSave}
              loading={profileUpdatePending}
              disabled={!hasInputs}
              gradient
              style={styles.saveButton}
            />
          </GlassCard>

          {calculations.bmi && (
            <>
              <SectionHeader title="Analysis Results" />
              <View style={styles.resultsGrid}>
                <GlassCard style={styles.bmiCard} gradient>
                  <View style={styles.bmiContent}>
                    <ProgressRing
                      progress={Math.min(parseFloat(calculations.bmi) * 2.5, 100)}
                      size={140}
                      strokeWidth={12}
                      color={
                        calculations.riskLevel === 'low'
                          ? Colors.dark.accentGreen
                          : calculations.riskLevel === 'moderate'
                          ? Colors.dark.accentOrange
                          : Colors.dark.accentRed
                      }
                      value={calculations.bmi}
                      label="BMI"
                    />
                    <View style={styles.bmiInfo}>
                      <Text style={styles.bmiCategory}>{calculations.category}</Text>
                      <View
                        style={[
                          styles.riskBadge,
                          calculations.riskLevel === 'low' && styles.riskLow,
                          calculations.riskLevel === 'moderate' && styles.riskModerate,
                          calculations.riskLevel === 'high' && styles.riskHigh,
                        ]}
                      >
                        <Text style={styles.riskText}>
                          {calculations.riskLevel?.toUpperCase()} RISK
                        </Text>
                      </View>
                    </View>
                  </View>
                </GlassCard>
              </View>

              <View style={styles.statsRow}>
                <StatCard
                  label="BMR"
                  value={calculations.bmr}
                  unit="kcal/day"
                  icon={<Flame size={20} color="#FFFFFF" />}
                  gradientColors={Colors.dark.gradient.warm}
                />
                <StatCard
                  label="Health Score"
                  value={calculations.riskLevel === 'low' ? 'Good' : 'Review'}
                  icon={<Heart size={20} color="#FFFFFF" />}
                  gradientColors={Colors.dark.gradient.accent}
                />
              </View>

              {calculations.riskLevel !== 'low' && (
                <GlassCard style={styles.warningCard}>
                  <View style={styles.warningContent}>
                    <AlertTriangle size={24} color={Colors.dark.accentOrange} />
                    <View style={styles.warningText}>
                      <Text style={styles.warningTitle}>Health Advisory</Text>
                      <Text style={styles.warningDescription}>
                        Your metrics indicate a {calculations.riskLevel} health risk. 
                        Consider consulting with a healthcare professional.
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              )}
            </>
          )}

          {!calculations.bmi && (
            <GlassCard style={styles.placeholderCard}>
              <View style={styles.placeholderContent}>
                <Activity size={48} color={Colors.dark.textTertiary} />
                <Text style={styles.placeholderTitle}>Enter Your Measurements</Text>
                <Text style={styles.placeholderText}>
                  Add your height and weight to calculate BMI, BMR, and see health insights
                </Text>
              </View>
            </GlassCard>
          )}

          <SectionHeader title="Charts & Trends" />
          <GlassCard style={styles.chartPlaceholder}>
            <View style={styles.chartPlaceholderContent}>
              <TrendingUp size={32} color={Colors.dark.textTertiary} />
              <Text style={styles.chartPlaceholderTitle}>Trend Analysis</Text>
              <Text style={styles.chartPlaceholderText}>
                Track your metrics over time to see trends
              </Text>
            </View>
          </GlassCard>

          <View style={styles.disclaimer}>
            <Info size={16} color={Colors.dark.textTertiary} />
            <Text style={styles.disclaimerText}>
              These calculations are estimates and should not replace professional medical advice.
            </Text>
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
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  inputCard: {
    marginBottom: SPACING.xxl,
  },
  inputGrid: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  inputHalf: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: SPACING.sm,
  },
  genderLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.sm,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  genderOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.xs,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    backgroundColor: Colors.dark.surfaceLight,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  genderOptionSelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  genderText: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  genderTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    marginTop: SPACING.lg,
  },
  resultsGrid: {
    marginBottom: SPACING.xl,
  },
  bmiCard: {
    padding: SPACING.xl,
  },
  bmiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  bmiInfo: {
    alignItems: 'center',
  },
  bmiCategory: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.sm,
  },
  riskBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  riskLow: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  riskModerate: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  riskHigh: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  riskText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.bold,
    color: Colors.dark.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  warningCard: {
    marginBottom: SPACING.xl,
    borderColor: Colors.dark.accentOrange,
    borderWidth: 1,
  },
  warningContent: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  warningText: {
    flex: 1,
  },
  warningTitle: {
    color: Colors.dark.accentOrange,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  warningDescription: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
  placeholderCard: {
    marginBottom: SPACING.xxl,
    minHeight: 200,
  },
  placeholderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  placeholderTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  placeholderText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  chartPlaceholder: {
    height: 180,
    marginBottom: SPACING.xl,
  },
  chartPlaceholderContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartPlaceholderTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  chartPlaceholderText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: RADIUS.md,
  },
  disclaimerText: {
    flex: 1,
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    lineHeight: 16,
  },
});
