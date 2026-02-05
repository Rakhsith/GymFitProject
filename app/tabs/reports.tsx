import React, { useState } from 'react';
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
  FileText,
  Download,
  Calendar,
  Activity,
  Heart,
  Scale,
  TrendingUp,
  AlertTriangle,
  Info,
  ChevronRight,
  Clock,
  Share2,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';

export default function ReportsScreen() {
  const { profile } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const hasData = profile.height || profile.weight || profile.age;

  const periods = [
    { key: 'week' as const, label: 'Week' },
    { key: 'month' as const, label: 'Month' },
    { key: 'year' as const, label: 'Year' },
  ];

  const reportSections = [
    { id: 'overview', title: 'Health Overview', icon: Activity, available: hasData },
    { id: 'metrics', title: 'Body Metrics', icon: Scale, available: hasData },
    { id: 'activity', title: 'Activity Summary', icon: TrendingUp, available: false },
    { id: 'nutrition', title: 'Nutrition Analysis', icon: Heart, available: false },
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
            <Text style={styles.title}>Health Reports</Text>
            <Text style={styles.subtitle}>Medical-grade health analysis</Text>
          </View>

          <SectionHeader title="Report Period" />
          <View style={styles.periodSelector}>
            {periods.map((period) => {
              const isSelected = selectedPeriod === period.key;
              return (
                <Pressable
                  key={period.key}
                  onPress={() => setSelectedPeriod(period.key)}
                  style={[styles.periodOption, isSelected && styles.periodOptionSelected]}
                >
                  <Text style={[styles.periodLabel, isSelected && styles.periodLabelSelected]}>
                    {period.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <GlassCard style={styles.generateCard} gradient>
            <View style={styles.generateContent}>
              <View style={styles.generateInfo}>
                <Text style={styles.generateTitle}>Generate Health Report</Text>
                <Text style={styles.generateDescription}>
                  Comprehensive analysis of your health metrics and progress
                </Text>
                <View style={styles.generateMeta}>
                  <Calendar size={14} color={Colors.dark.textTertiary} />
                  <Text style={styles.generateMetaText}>
                    Last 7 days ({selectedPeriod})
                  </Text>
                </View>
              </View>
              <Button
                title="Generate"
                onPress={() => {}}
                disabled={!hasData}
                gradient={!!hasData}
                variant={hasData ? 'primary' : 'secondary'}
                icon={<FileText size={18} color="#FFFFFF" />}
              />
            </View>
          </GlassCard>

          <SectionHeader title="Report Sections" />
          <View style={styles.sectionsContainer}>
            {reportSections.map((section) => {
              const Icon = section.icon;
              return (
                <GlassCard key={section.id} style={styles.sectionCard}>
                  <View style={styles.sectionContent}>
                    <View style={styles.sectionLeft}>
                      <View
                        style={[
                          styles.sectionIcon,
                          section.available && styles.sectionIconAvailable,
                        ]}
                      >
                        <Icon
                          size={20}
                          color={section.available ? Colors.dark.primary : Colors.dark.textTertiary}
                        />
                      </View>
                      <View style={styles.sectionInfo}>
                        <Text style={styles.sectionTitle}>{section.title}</Text>
                        <Text style={styles.sectionStatus}>
                          {section.available ? 'Data available' : 'No data yet'}
                        </Text>
                      </View>
                    </View>
                    <ChevronRight
                      size={20}
                      color={section.available ? Colors.dark.textSecondary : Colors.dark.textTertiary}
                    />
                  </View>
                </GlassCard>
              );
            })}
          </View>

          <SectionHeader title="Previous Reports" />
          {hasData ? (
            <View style={styles.reportsListEmpty}>
              <Clock size={32} color={Colors.dark.textTertiary} />
              <Text style={styles.reportsEmptyTitle}>No Reports Yet</Text>
              <Text style={styles.reportsEmptyText}>
                Generate your first report to see it here
              </Text>
            </View>
          ) : (
            <GlassCard style={styles.noDataCard}>
              <View style={styles.noDataContent}>
                <FileText size={48} color={Colors.dark.textTertiary} />
                <Text style={styles.noDataTitle}>Data Required</Text>
                <Text style={styles.noDataText}>
                  Add your health metrics to generate comprehensive reports
                </Text>
              </View>
            </GlassCard>
          )}

          <SectionHeader title="Export Options" />
          <View style={styles.exportOptions}>
            <Pressable style={[styles.exportOption, !hasData && styles.exportOptionDisabled]}>
              <Download size={20} color={hasData ? Colors.dark.primary : Colors.dark.textTertiary} />
              <Text style={[styles.exportLabel, !hasData && styles.exportLabelDisabled]}>
                Download PDF
              </Text>
            </Pressable>
            <Pressable style={[styles.exportOption, !hasData && styles.exportOptionDisabled]}>
              <Share2 size={20} color={hasData ? Colors.dark.primary : Colors.dark.textTertiary} />
              <Text style={[styles.exportLabel, !hasData && styles.exportLabelDisabled]}>
                Share Report
              </Text>
            </Pressable>
          </View>

          <GlassCard style={styles.disclaimerCard}>
            <View style={styles.disclaimerContent}>
              <AlertTriangle size={20} color={Colors.dark.accentOrange} />
              <View style={styles.disclaimerText}>
                <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
                <Text style={styles.disclaimerDescription}>
                  These reports are for informational purposes only and should not replace
                  professional medical advice, diagnosis, or treatment. Always consult with
                  a qualified healthcare provider before making health decisions.
                </Text>
              </View>
            </View>
          </GlassCard>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Info size={16} color={Colors.dark.textTertiary} />
              <Text style={styles.infoText}>
                Reports are generated using your tracked data and established health guidelines.
              </Text>
            </View>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: RADIUS.md,
    padding: SPACING.xs,
    marginBottom: SPACING.xxl,
  },
  periodOption: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: RADIUS.sm,
  },
  periodOptionSelected: {
    backgroundColor: Colors.dark.primary,
  },
  periodLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  periodLabelSelected: {
    color: '#FFFFFF',
  },
  generateCard: {
    marginBottom: SPACING.xxl,
  },
  generateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  generateInfo: {
    flex: 1,
    marginRight: SPACING.lg,
  },
  generateTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  generateDescription: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  generateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  generateMetaText: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  sectionsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  sectionCard: {
    padding: SPACING.md,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIconAvailable: {
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
  },
  sectionInfo: {
    marginLeft: SPACING.md,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  sectionStatus: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  reportsListEmpty: {
    alignItems: 'center',
    padding: SPACING.xxl,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: SPACING.xxl,
  },
  reportsEmptyTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  reportsEmptyText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  noDataCard: {
    marginBottom: SPACING.xxl,
    minHeight: 180,
  },
  noDataContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  noDataTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  noDataText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  exportOptions: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  exportOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.lg,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  exportOptionDisabled: {
    opacity: 0.5,
  },
  exportLabel: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  exportLabelDisabled: {
    color: Colors.dark.textTertiary,
  },
  disclaimerCard: {
    marginBottom: SPACING.xl,
    borderColor: Colors.dark.accentOrange,
    borderWidth: 1,
  },
  disclaimerContent: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  disclaimerText: {
    flex: 1,
  },
  disclaimerTitle: {
    color: Colors.dark.accentOrange,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  disclaimerDescription: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
  infoSection: {
    padding: SPACING.md,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: RADIUS.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  infoText: {
    flex: 1,
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    lineHeight: 16,
  },
});
