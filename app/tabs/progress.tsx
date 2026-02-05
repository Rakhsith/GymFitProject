import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Camera,
  ImagePlus,
  X,
  Trash2,
  Calendar,
  StickyNote,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  LayoutGrid,
  Flame,
  TrendingUp,
  Lock,
  Eye,
  EyeOff,
  Heart,
  Sparkles,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS, SCREEN } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

interface ProgressPhoto {
  id: string;
  uri: string;
  date: string;
  note: string;
  category: 'front' | 'back' | 'side' | 'flexing' | 'other';
  weight?: string;
  isFavorite: boolean;
}

const STORAGE_KEY = '@gymfit_progress_photos';
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_GAP = 2;
const PHOTO_SIZE = (SCREEN_WIDTH - SPACING.xl * 2 - GRID_GAP * 2) / 3;

const CATEGORIES = [
  { id: 'all', label: 'All', icon: Grid3X3 },
  { id: 'front', label: 'Front', icon: LayoutGrid },
  { id: 'back', label: 'Back', icon: LayoutGrid },
  { id: 'side', label: 'Side', icon: LayoutGrid },
  { id: 'flexing', label: 'Flexing', icon: Flame },
  { id: 'other', label: 'Other', icon: Sparkles },
];

export default function ProgressGalleryScreen() {
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCompareMode, setShowCompareMode] = useState(false);
  const [comparePhotos, setComparePhotos] = useState<[ProgressPhoto | null, ProgressPhoto | null]>([null, null]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newPhoto, setNewPhoto] = useState<{
    uri: string;
    note: string;
    category: ProgressPhoto['category'];
    weight: string;
  }>({ uri: '', note: '', category: 'front', weight: '' });
  const [isPrivateMode, setIsPrivateMode] = useState(false);
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    loadPhotos();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const loadPhotos = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        setPhotos(JSON.parse(stored));
        console.log('Loaded progress photos:', JSON.parse(stored).length);
      }
    } catch (error) {
      console.error('Failed to load photos:', error);
    }
  };

  const savePhotos = async (updatedPhotos: ProgressPhoto[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPhotos));
      setPhotos(updatedPhotos);
      console.log('Saved progress photos:', updatedPhotos.length);
    } catch (error) {
      console.error('Failed to save photos:', error);
    }
  };

  const pickImage = async (useCamera: boolean) => {
    const permissionMethod = useCamera
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;

    const { status } = await permissionMethod();
    if (status !== 'granted') {
      Alert.alert('Permission Required', `Please grant ${useCamera ? 'camera' : 'photo library'} access to add progress photos.`);
      return;
    }

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    };

    const result = useCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled && result.assets[0]) {
      setNewPhoto({ ...newPhoto, uri: result.assets[0].uri });
      setShowAddModal(true);
    }
  };

  const addPhoto = () => {
    if (!newPhoto.uri) return;

    const photo: ProgressPhoto = {
      id: Date.now().toString(),
      uri: newPhoto.uri,
      date: new Date().toISOString(),
      note: newPhoto.note,
      category: newPhoto.category,
      weight: newPhoto.weight,
      isFavorite: false,
    };

    const updatedPhotos = [photo, ...photos];
    savePhotos(updatedPhotos);
    setNewPhoto({ uri: '', note: '', category: 'front', weight: '' });
    setShowAddModal(false);
  };

  const deletePhoto = (id: string) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this progress photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updatedPhotos = photos.filter((p) => p.id !== id);
          savePhotos(updatedPhotos);
          setSelectedPhoto(null);
        },
      },
    ]);
  };

  const toggleFavorite = (id: string) => {
    const updatedPhotos = photos.map((p) =>
      p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
    );
    savePhotos(updatedPhotos);
    if (selectedPhoto?.id === id) {
      setSelectedPhoto({ ...selectedPhoto, isFavorite: !selectedPhoto.isFavorite });
    }
  };

  const filteredPhotos = photos.filter(
    (p) => selectedCategory === 'all' || p.category === selectedCategory
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const handleCompareSelect = (photo: ProgressPhoto) => {
    if (!comparePhotos[0]) {
      setComparePhotos([photo, null]);
    } else if (!comparePhotos[1] && comparePhotos[0].id !== photo.id) {
      setComparePhotos([comparePhotos[0], photo]);
    } else {
      setComparePhotos([photo, null]);
    }
  };

  const renderPhotoGrid = useCallback(() => {
    if (filteredPhotos.length === 0) {
      return (
        <GlassCard style={styles.emptyCard}>
          <View style={styles.emptyContent}>
            <LinearGradient colors={Colors.dark.gradient.primary} style={styles.emptyIcon}>
              <Camera size={40} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.emptyTitle}>Your Private Progress Gallery</Text>
            <Text style={styles.emptyText}>
              Track your fitness transformation with progress photos. Only you can see these - it's your personal journey! 💪
            </Text>
            <View style={styles.emptyButtonsRow}>
              <Pressable style={styles.emptyButton} onPress={() => pickImage(true)}>
                <Camera size={20} color={Colors.dark.primary} />
                <Text style={styles.emptyButtonText}>Take Photo</Text>
              </Pressable>
              <Pressable style={styles.emptyButton} onPress={() => pickImage(false)}>
                <ImagePlus size={20} color={Colors.dark.primary} />
                <Text style={styles.emptyButtonText}>Upload</Text>
              </Pressable>
            </View>
          </View>
        </GlassCard>
      );
    }

    return (
      <View style={styles.gridContainer}>
        {filteredPhotos.map((photo, index) => (
          <Pressable
            key={photo.id}
            style={[
              styles.gridItem,
              showCompareMode && comparePhotos.some((p) => p?.id === photo.id) && styles.gridItemSelected,
            ]}
            onPress={() => {
              if (showCompareMode) {
                handleCompareSelect(photo);
              } else {
                setSelectedPhoto(photo);
              }
            }}
            onLongPress={() => toggleFavorite(photo.id)}
          >
            <Image
              source={{ uri: isPrivateMode ? undefined : photo.uri }}
              style={[styles.gridImage, isPrivateMode && styles.blurredImage]}
              blurRadius={isPrivateMode ? 30 : 0}
            />
            {isPrivateMode && (
              <View style={styles.privateOverlay}>
                <Lock size={24} color={Colors.dark.textSecondary} />
              </View>
            )}
            {photo.isFavorite && !isPrivateMode && (
              <View style={styles.favoriteIndicator}>
                <Heart size={14} color="#FF6B6B" fill="#FF6B6B" />
              </View>
            )}
            {showCompareMode && comparePhotos.some((p) => p?.id === photo.id) && (
              <View style={styles.compareIndicator}>
                <Text style={styles.compareIndicatorText}>
                  {comparePhotos[0]?.id === photo.id ? '1' : '2'}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>
    );
  }, [filteredPhotos, showCompareMode, comparePhotos, isPrivateMode]);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#12121A', '#0A0A0F']}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View>
                <Text style={styles.title}>Progress Gallery</Text>
                <Text style={styles.subtitle}>
                  {photos.length} photo{photos.length !== 1 ? 's' : ''} • Private to you
                </Text>
              </View>
              <View style={styles.headerActions}>
                <Pressable
                  style={styles.privacyButton}
                  onPress={() => setIsPrivateMode(!isPrivateMode)}
                >
                  {isPrivateMode ? (
                    <EyeOff size={22} color={Colors.dark.textSecondary} />
                  ) : (
                    <Eye size={22} color={Colors.dark.primary} />
                  )}
                </Pressable>
                <Pressable
                  style={[styles.compareButton, showCompareMode && styles.compareButtonActive]}
                  onPress={() => {
                    setShowCompareMode(!showCompareMode);
                    setComparePhotos([null, null]);
                  }}
                >
                  <TrendingUp size={20} color={showCompareMode ? '#FFFFFF' : Colors.dark.primary} />
                </Pressable>
              </View>
            </View>

            {showCompareMode && (
              <View style={styles.compareBanner}>
                <Text style={styles.compareBannerText}>
                  Select 2 photos to compare your transformation
                </Text>
              </View>
            )}
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContainer}
          >
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <Pressable
                  key={cat.id}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  onPress={() => setSelectedCategory(cat.id)}
                >
                  <Icon size={16} color={isActive ? '#FFFFFF' : Colors.dark.textSecondary} />
                  <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {renderPhotoGrid()}
          </ScrollView>

          <View style={styles.fabContainer}>
            <Pressable
              style={styles.fabSecondary}
              onPress={() => pickImage(false)}
            >
              <ImagePlus size={22} color={Colors.dark.primary} />
            </Pressable>
            <Pressable
              style={styles.fab}
              onPress={() => pickImage(true)}
            >
              <LinearGradient colors={Colors.dark.gradient.primary} style={styles.fabGradient}>
                <Camera size={26} color="#FFFFFF" />
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </SafeAreaView>

      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <LinearGradient
              colors={['#1A1A24', '#12121A']}
              style={StyleSheet.absoluteFillObject}
            />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Progress Photo</Text>
              <Pressable onPress={() => setShowAddModal(false)}>
                <X size={24} color={Colors.dark.textSecondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {newPhoto.uri ? (
                <Image source={{ uri: newPhoto.uri }} style={styles.previewImage} />
              ) : null}

              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryRow}>
                {(['front', 'back', 'side', 'flexing', 'other'] as const).map((cat) => (
                  <Pressable
                    key={cat}
                    style={[
                      styles.categoryOption,
                      newPhoto.category === cat && styles.categoryOptionActive,
                    ]}
                    onPress={() => setNewPhoto({ ...newPhoto, category: cat })}
                  >
                    <Text
                      style={[
                        styles.categoryOptionText,
                        newPhoto.category === cat && styles.categoryOptionTextActive,
                      ]}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={styles.inputLabel}>Current Weight (optional)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., 75 kg"
                  placeholderTextColor={Colors.dark.textTertiary}
                  value={newPhoto.weight}
                  onChangeText={(text) => setNewPhoto({ ...newPhoto, weight: text })}
                  keyboardType="numeric"
                />
              </View>

              <Text style={styles.inputLabel}>Note (optional)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="How are you feeling? Any milestones?"
                  placeholderTextColor={Colors.dark.textTertiary}
                  value={newPhoto.note}
                  onChangeText={(text) => setNewPhoto({ ...newPhoto, note: text })}
                  multiline
                  numberOfLines={3}
                />
              </View>

              <Button
                title="Save to Gallery"
                onPress={addPhoto}
                gradient
                style={styles.saveButton}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={selectedPhoto !== null && !showCompareMode} animationType="fade" transparent>
        <View style={styles.photoViewerOverlay}>
          <LinearGradient
            colors={['rgba(0,0,0,0.95)', 'rgba(10,10,15,0.98)']}
            style={StyleSheet.absoluteFillObject}
          />
          <SafeAreaView style={styles.photoViewerSafe}>
            <View style={styles.photoViewerHeader}>
              <Pressable onPress={() => setSelectedPhoto(null)} style={styles.closeButton}>
                <X size={24} color="#FFFFFF" />
              </Pressable>
              <View style={styles.photoViewerActions}>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => selectedPhoto && toggleFavorite(selectedPhoto.id)}
                >
                  <Heart
                    size={22}
                    color={selectedPhoto?.isFavorite ? '#FF6B6B' : '#FFFFFF'}
                    fill={selectedPhoto?.isFavorite ? '#FF6B6B' : 'transparent'}
                  />
                </Pressable>
                <Pressable
                  style={styles.actionButton}
                  onPress={() => selectedPhoto && deletePhoto(selectedPhoto.id)}
                >
                  <Trash2 size={22} color={Colors.dark.accentRed} />
                </Pressable>
              </View>
            </View>

            {selectedPhoto && (
              <View style={styles.photoViewerContent}>
                <Image
                  source={{ uri: selectedPhoto.uri }}
                  style={styles.fullImage}
                  resizeMode="contain"
                />
                <View style={styles.photoDetails}>
                  <View style={styles.photoDateRow}>
                    <Calendar size={16} color={Colors.dark.primary} />
                    <Text style={styles.photoDate}>
                      {formatDate(selectedPhoto.date)} • {getTimeAgo(selectedPhoto.date)}
                    </Text>
                  </View>
                  {selectedPhoto.weight && (
                    <View style={styles.photoWeightRow}>
                      <TrendingUp size={16} color={Colors.dark.accentGreen} />
                      <Text style={styles.photoWeight}>{selectedPhoto.weight}</Text>
                    </View>
                  )}
                  {selectedPhoto.note && (
                    <View style={styles.photoNoteRow}>
                      <StickyNote size={16} color={Colors.dark.accentOrange} />
                      <Text style={styles.photoNote}>{selectedPhoto.note}</Text>
                    </View>
                  )}
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryBadgeText}>
                      {selectedPhoto.category.charAt(0).toUpperCase() + selectedPhoto.category.slice(1)}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </SafeAreaView>
        </View>
      </Modal>

      <Modal visible={showCompareMode && comparePhotos[0] !== null && comparePhotos[1] !== null} animationType="slide" transparent>
        <View style={styles.compareOverlay}>
          <LinearGradient
            colors={['rgba(0,0,0,0.95)', 'rgba(10,10,15,0.98)']}
            style={StyleSheet.absoluteFillObject}
          />
          <SafeAreaView style={styles.compareSafe}>
            <View style={styles.compareHeader}>
              <Text style={styles.compareTitle}>Transformation</Text>
              <Pressable
                onPress={() => {
                  setShowCompareMode(false);
                  setComparePhotos([null, null]);
                }}
              >
                <X size={24} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={styles.compareContent}>
              {comparePhotos[0] && comparePhotos[1] && (
                <>
                  <View style={styles.compareImageContainer}>
                    <Image source={{ uri: comparePhotos[0].uri }} style={styles.compareImage} />
                    <View style={styles.compareLabel}>
                      <Text style={styles.compareLabelText}>Before</Text>
                      <Text style={styles.compareDateText}>{formatDate(comparePhotos[0].date)}</Text>
                      {comparePhotos[0].weight && (
                        <Text style={styles.compareWeightText}>{comparePhotos[0].weight}</Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.compareDivider}>
                    <ChevronRight size={24} color={Colors.dark.primary} />
                  </View>
                  <View style={styles.compareImageContainer}>
                    <Image source={{ uri: comparePhotos[1].uri }} style={styles.compareImage} />
                    <View style={styles.compareLabel}>
                      <Text style={styles.compareLabelText}>After</Text>
                      <Text style={styles.compareDateText}>{formatDate(comparePhotos[1].date)}</Text>
                      {comparePhotos[1].weight && (
                        <Text style={styles.compareWeightText}>{comparePhotos[1].weight}</Text>
                      )}
                    </View>
                  </View>
                </>
              )}
            </View>

            <View style={styles.compareStats}>
              {comparePhotos[0] && comparePhotos[1] && (
                <GlassCard style={styles.compareStatsCard}>
                  <Text style={styles.compareStatsTitle}>Progress Timeline</Text>
                  <Text style={styles.compareStatsValue}>
                    {Math.floor(
                      (new Date(comparePhotos[1].date).getTime() -
                        new Date(comparePhotos[0].date).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}{' '}
                    days apart
                  </Text>
                  <Text style={styles.compareStatsSubtext}>
                    Keep going! Every step counts 🔥
                  </Text>
                </GlassCard>
              )}
            </View>
          </SafeAreaView>
        </View>
      </Modal>
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
  content: {
    flex: 1,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xxxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  subtitle: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
  },
  headerActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  privacyButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  compareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  compareButtonActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  compareBanner: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    marginTop: SPACING.md,
  },
  compareBannerText: {
    color: Colors.dark.primaryLight,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  categoriesScroll: {
    marginTop: SPACING.lg,
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  categoryChipText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: 120,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GAP,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  gridItem: {
    width: PHOTO_SIZE,
    height: PHOTO_SIZE * 1.2,
    backgroundColor: Colors.dark.card,
    position: 'relative',
  },
  gridItemSelected: {
    borderWidth: 3,
    borderColor: Colors.dark.primary,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  blurredImage: {
    opacity: 0.3,
  },
  privateOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  favoriteIndicator: {
    position: 'absolute',
    top: SPACING.xs,
    right: SPACING.xs,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: RADIUS.full,
    padding: 4,
  },
  compareIndicator: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.dark.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compareIndicatorText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
  },
  emptyCard: {
    marginTop: SPACING.xxl,
  },
  emptyContent: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xl,
  },
  emptyTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xl,
  },
  emptyButtonsRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: Colors.dark.card,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  emptyButtonText: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  fabContainer: {
    position: 'absolute',
    bottom: SPACING.xxl,
    right: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  fabSecondary: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.dark.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.dark.surface,
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    padding: SPACING.xl,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  modalTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.xl,
  },
  inputLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.sm,
  },
  categoryRow: {
    marginBottom: SPACING.lg,
  },
  categoryOption: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.full,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  categoryOptionActive: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  categoryOptionText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  categoryOptionTextActive: {
    color: '#FFFFFF',
  },
  inputContainer: {
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: Colors.dark.border,
    marginBottom: SPACING.lg,
  },
  input: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    padding: SPACING.lg,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  photoViewerOverlay: {
    flex: 1,
  },
  photoViewerSafe: {
    flex: 1,
  },
  photoViewerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoViewerActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoViewerContent: {
    flex: 1,
    padding: SPACING.xl,
  },
  fullImage: {
    flex: 1,
    borderRadius: RADIUS.lg,
  },
  photoDetails: {
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  photoDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  photoDate: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.md,
  },
  photoWeightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  photoWeight: {
    color: Colors.dark.accentGreen,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  photoNoteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  photoNote: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    flex: 1,
    lineHeight: 22,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.dark.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.full,
  },
  categoryBadgeText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  compareOverlay: {
    flex: 1,
  },
  compareSafe: {
    flex: 1,
  },
  compareHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  compareTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  compareContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  compareImageContainer: {
    flex: 1,
    position: 'relative',
  },
  compareImage: {
    width: '100%',
    height: 400,
    borderRadius: RADIUS.lg,
  },
  compareLabel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: SPACING.md,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },
  compareLabelText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  compareDateText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  compareWeightText: {
    color: Colors.dark.accentGreen,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: 2,
  },
  compareDivider: {
    paddingHorizontal: SPACING.sm,
  },
  compareStats: {
    padding: SPACING.xl,
  },
  compareStatsCard: {
    alignItems: 'center',
  },
  compareStatsTitle: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.xs,
  },
  compareStatsValue: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: FONT_WEIGHT.bold,
  },
  compareStatsSubtext: {
    color: Colors.dark.accentOrange,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.sm,
  },
});
