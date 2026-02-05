import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Linking,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import {
  Beef,
  Egg,
  Fish,
  Milk,
  Leaf,
  MapPin,
  Phone,
  Navigation,
  Star,
  Clock,
  ChevronRight,
  Target,
  Utensils,
  ShoppingCart,
  Store,
  Coffee,
  AlertCircle,
  Zap,
  Search,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';
import Input from '@/components/ui/Input';
import { useNotifications } from '@/contexts/NotificationContext';

type FoodCategory = 'all' | 'meat' | 'dairy' | 'seafood' | 'plant' | 'eggs';
type PlaceType = 'restaurant' | 'supermarket' | 'grocery' | 'cafe';

interface ProteinFood {
  id: string;
  name: string;
  protein: number;
  calories: number;
  serving: string;
  category: FoodCategory;
  icon: typeof Beef;
  tips: string;
}

interface NearbyPlace {
  id: string;
  name: string;
  type: PlaceType;
  distance: number;
  rating: number;
  address: string;
  phone: string;
  isOpen: boolean;
  specialties: string[];
  latitude: number;
  longitude: number;
}

const proteinFoods: ProteinFood[] = [
  { id: '1', name: 'Chicken Breast', protein: 31, calories: 165, serving: '100g', category: 'meat', icon: Beef, tips: 'Lean protein, great for muscle building' },
  { id: '2', name: 'Eggs (2 large)', protein: 12, calories: 140, serving: '2 eggs', category: 'eggs', icon: Egg, tips: 'Complete protein with all amino acids' },
  { id: '3', name: 'Greek Yogurt', protein: 17, calories: 100, serving: '170g', category: 'dairy', icon: Milk, tips: 'High protein, good probiotics' },
  { id: '4', name: 'Salmon', protein: 25, calories: 208, serving: '100g', category: 'seafood', icon: Fish, tips: 'Rich in omega-3 fatty acids' },
  { id: '5', name: 'Cottage Cheese', protein: 14, calories: 98, serving: '100g', category: 'dairy', icon: Milk, tips: 'Slow-digesting casein protein' },
  { id: '6', name: 'Tuna', protein: 30, calories: 132, serving: '100g', category: 'seafood', icon: Fish, tips: 'Lean protein, low fat' },
  { id: '7', name: 'Lentils', protein: 18, calories: 230, serving: '1 cup cooked', category: 'plant', icon: Leaf, tips: 'Great plant-based protein source' },
  { id: '8', name: 'Tofu', protein: 20, calories: 144, serving: '100g', category: 'plant', icon: Leaf, tips: 'Versatile plant protein' },
  { id: '9', name: 'Turkey Breast', protein: 29, calories: 135, serving: '100g', category: 'meat', icon: Beef, tips: 'Very lean, high protein' },
  { id: '10', name: 'Beef Sirloin', protein: 27, calories: 206, serving: '100g', category: 'meat', icon: Beef, tips: 'Rich in iron and B12' },
  { id: '11', name: 'Shrimp', protein: 24, calories: 99, serving: '100g', category: 'seafood', icon: Fish, tips: 'Low calorie, high protein' },
  { id: '12', name: 'Chickpeas', protein: 15, calories: 269, serving: '1 cup cooked', category: 'plant', icon: Leaf, tips: 'Great fiber and protein combo' },
  { id: '13', name: 'Whey Protein', protein: 25, calories: 120, serving: '1 scoop', category: 'dairy', icon: Milk, tips: 'Fast absorbing post-workout' },
  { id: '14', name: 'Paneer', protein: 18, calories: 265, serving: '100g', category: 'dairy', icon: Milk, tips: 'Popular in Indian cuisine' },
  { id: '15', name: 'Quinoa', protein: 8, calories: 222, serving: '1 cup cooked', category: 'plant', icon: Leaf, tips: 'Complete plant protein' },
  { id: '16', name: 'Edamame', protein: 17, calories: 188, serving: '1 cup', category: 'plant', icon: Leaf, tips: 'Great snack option' },
];

const categoryFilters: { key: FoodCategory; label: string; icon: typeof Beef }[] = [
  { key: 'all', label: 'All', icon: Utensils },
  { key: 'meat', label: 'Meat', icon: Beef },
  { key: 'seafood', label: 'Seafood', icon: Fish },
  { key: 'dairy', label: 'Dairy', icon: Milk },
  { key: 'eggs', label: 'Eggs', icon: Egg },
  { key: 'plant', label: 'Plant', icon: Leaf },
];

const placeTypeIcons: Record<PlaceType, typeof Store> = {
  restaurant: Utensils,
  supermarket: ShoppingCart,
  grocery: Store,
  cafe: Coffee,
};

export default function ProteinScreen() {
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('all');
  const [proteinTarget, setProteinTarget] = useState('');
  const [currentProtein, setCurrentProtein] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationPermission, setLocationPermission] = useState<boolean>(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<NearbyPlace[]>([]);
  const [selectedPlaceType, setSelectedPlaceType] = useState<PlaceType | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  const { showCustomNotification } = useNotifications();

  const filteredFoods = proteinFoods.filter(
    food => selectedCategory === 'all' || food.category === selectedCategory
  );

  const proteinRemaining = proteinTarget && currentProtein 
    ? Math.max(0, parseInt(proteinTarget) - parseInt(currentProtein))
    : null;

  const generateNearbyPlaces = useCallback((lat: number, lng: number): NearbyPlace[] => {
    const restaurantNames = [
      'Protein House Grill', 'Muscle Kitchen', 'Fit Bites Cafe', 'The Healthy Bowl',
      'Grilled & Good', 'Power Plate Restaurant', 'Lean Cuisine Hub', 'Gym Eats Kitchen'
    ];
    const supermarketNames = [
      'FreshMart Supermarket', 'Organic Valley Store', 'Metro Fresh Market', 'BigBasket Store',
      'Reliance Fresh', 'More Supermarket', 'Spencer\'s Daily', 'D-Mart Express'
    ];
    const groceryNames = [
      'Green Grocer', 'Daily Needs Store', 'Farm Fresh Groceries', 'Local Kirana Store',
      'Wellness Grocery', 'Nature\'s Basket', 'Healthy Harvest', 'Quick Mart'
    ];
    const cafeNames = [
      'Protein Shake Bar', 'Fit Fuel Cafe', 'Smoothie Station', 'Health Hub Cafe',
      'Energy Boost Cafe', 'Lean Bean Coffee', 'Nutri Cafe', 'Wellness Lounge'
    ];

    const places: NearbyPlace[] = [];
    const types: PlaceType[] = ['restaurant', 'supermarket', 'grocery', 'cafe'];
    const nameArrays = [restaurantNames, supermarketNames, groceryNames, cafeNames];
    const specialtiesMap: Record<PlaceType, string[][]> = {
      restaurant: [
        ['Grilled Chicken', 'Protein Bowls', 'Egg White Omelettes'],
        ['Fish Fillet', 'Turkey Wraps', 'Quinoa Salads'],
        ['Tofu Stir-fry', 'Lentil Soup', 'Paneer Dishes'],
      ],
      supermarket: [
        ['Fresh Meat Section', 'Dairy Products', 'Protein Bars'],
        ['Organic Eggs', 'Greek Yogurt', 'Whey Protein'],
        ['Seafood Counter', 'Tofu & Tempeh', 'Nuts & Seeds'],
      ],
      grocery: [
        ['Eggs', 'Milk', 'Cheese', 'Paneer'],
        ['Lentils', 'Chickpeas', 'Beans'],
        ['Nuts', 'Seeds', 'Protein Snacks'],
      ],
      cafe: [
        ['Protein Shakes', 'Egg Sandwiches', 'Greek Yogurt Parfait'],
        ['Smoothie Bowls', 'Chicken Wraps', 'Protein Coffee'],
        ['Energy Bars', 'Nut Butter Toast', 'Cottage Cheese Bowl'],
      ],
    };

    types.forEach((type, typeIndex) => {
      const names = nameArrays[typeIndex];
      const numPlaces = 2 + Math.floor(Math.random() * 2);
      
      for (let i = 0; i < numPlaces; i++) {
        const distance = 0.3 + Math.random() * 4.5;
        const latOffset = (Math.random() - 0.5) * 0.05;
        const lngOffset = (Math.random() - 0.5) * 0.05;
        
        places.push({
          id: `${type}-${i}`,
          name: names[Math.floor(Math.random() * names.length)],
          type,
          distance: Math.round(distance * 10) / 10,
          rating: 3.5 + Math.random() * 1.5,
          address: `${Math.floor(100 + Math.random() * 900)} ${['Main Street', 'Market Road', 'Station Road', 'Park Avenue', 'Gandhi Nagar', 'MG Road'][Math.floor(Math.random() * 6)]}`,
          phone: `+91 ${Math.floor(7000000000 + Math.random() * 2999999999)}`,
          isOpen: Math.random() > 0.2,
          specialties: specialtiesMap[type][Math.floor(Math.random() * specialtiesMap[type].length)],
          latitude: lat + latOffset,
          longitude: lng + lngOffset,
        });
      }
    });

    return places.sort((a, b) => a.distance - b.distance);
  }, []);

  const requestLocationPermission = async () => {
    setLoadingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(loc);
        const places = generateNearbyPlaces(loc.coords.latitude, loc.coords.longitude);
        setNearbyPlaces(places);
        showCustomNotification(
          "Location Found! 📍",
          "We've found protein-rich food spots near you!",
          'achievement'
        );
      } else {
        showCustomNotification(
          "Location Required",
          "Enable location to find nearby protein food spots",
          'tip'
        );
      }
    } catch (error) {
      console.log('Location error:', error);
    } finally {
      setLoadingLocation(false);
    }
  };

  const onRefresh = async () => {
    if (!locationPermission) return;
    setRefreshing(true);
    try {
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocation(loc);
      const places = generateNearbyPlaces(loc.coords.latitude, loc.coords.longitude);
      setNearbyPlaces(places);
    } catch (error) {
      console.log('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const openMaps = (place: NearbyPlace) => {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
      default: 'https://maps.google.com/?q=',
    });
    const url = Platform.select({
      ios: `${scheme}?q=${place.name}&ll=${place.latitude},${place.longitude}`,
      android: `${scheme}${place.latitude},${place.longitude}?q=${place.name}`,
      default: `${scheme}${place.latitude},${place.longitude}`,
    });
    Linking.openURL(url);
  };

  const callPlace = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleTargetChange = (value: string) => {
    setProteinTarget(value);
    const target = parseInt(value);
    if (target && target >= 100) {
      showCustomNotification(
        "Protein Goal Set! 💪",
        `${target}g protein target locked in. Let's crush it!`,
        'motivation'
      );
    }
  };

  const filteredPlaces = nearbyPlaces.filter(
    place => selectedPlaceType === 'all' || place.type === selectedPlaceType
  );

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            color={star <= rating ? Colors.dark.accentOrange : Colors.dark.textTertiary}
            fill={star <= rating ? Colors.dark.accentOrange : 'transparent'}
          />
        ))}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

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
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={Colors.dark.primary}
            />
          }
        >
          <View style={styles.header}>
            <Text style={styles.title}>Protein Hub</Text>
            <Text style={styles.subtitle}>Find protein-rich foods & nearby spots</Text>
          </View>

          <SectionHeader title="Your Protein Goal" />
          <GlassCard style={styles.goalCard} gradient>
            <View style={styles.goalInputs}>
              <View style={styles.goalInputContainer}>
                <Input
                  label="Daily Target (g)"
                  placeholder="150"
                  value={proteinTarget}
                  onChangeText={handleTargetChange}
                  keyboardType="numeric"
                  icon={<Target size={18} color={Colors.dark.textTertiary} />}
                  containerStyle={styles.goalInput}
                />
              </View>
              <View style={styles.goalInputContainer}>
                <Input
                  label="Consumed (g)"
                  placeholder="0"
                  value={currentProtein}
                  onChangeText={setCurrentProtein}
                  keyboardType="numeric"
                  icon={<Zap size={18} color={Colors.dark.textTertiary} />}
                  containerStyle={styles.goalInput}
                />
              </View>
            </View>
            {proteinRemaining !== null && (
              <View style={styles.remainingContainer}>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${Math.min(100, (parseInt(currentProtein) / parseInt(proteinTarget)) * 100)}%`,
                        backgroundColor: proteinRemaining === 0 ? Colors.dark.accentGreen : Colors.dark.primary,
                      }
                    ]} 
                  />
                </View>
                <View style={styles.remainingInfo}>
                  <Text style={styles.remainingLabel}>
                    {proteinRemaining === 0 ? '🎉 Goal Achieved!' : 'Remaining'}
                  </Text>
                  <Text style={[
                    styles.remainingValue,
                    proteinRemaining === 0 && styles.goalAchieved
                  ]}>
                    {proteinRemaining}g to go
                  </Text>
                </View>
              </View>
            )}
          </GlassCard>

          <SectionHeader title="Protein-Rich Foods" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}
          >
            {categoryFilters.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.key;
              return (
                <Pressable
                  key={cat.key}
                  onPress={() => setSelectedCategory(cat.key)}
                  style={[styles.categoryChip, isSelected && styles.categoryChipSelected]}
                >
                  <Icon size={16} color={isSelected ? Colors.dark.primary : Colors.dark.textTertiary} />
                  <Text style={[styles.categoryLabel, isSelected && styles.categoryLabelSelected]}>
                    {cat.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.foodGrid}>
            {filteredFoods.map((food) => {
              const Icon = food.icon;
              return (
                <GlassCard key={food.id} style={styles.foodCard}>
                  <View style={styles.foodHeader}>
                    <View style={styles.foodIconContainer}>
                      <Icon size={24} color={Colors.dark.primary} />
                    </View>
                    <View style={styles.foodMacro}>
                      <Text style={styles.foodProtein}>{food.protein}g</Text>
                      <Text style={styles.foodProteinLabel}>protein</Text>
                    </View>
                  </View>
                  <Text style={styles.foodName}>{food.name}</Text>
                  <Text style={styles.foodServing}>{food.serving} • {food.calories} cal</Text>
                  <Text style={styles.foodTip}>{food.tips}</Text>
                </GlassCard>
              );
            })}
          </View>

          <SectionHeader title="Find Nearby" />
          
          {!locationPermission ? (
            <GlassCard style={styles.locationCard}>
              <View style={styles.locationContent}>
                <MapPin size={48} color={Colors.dark.primary} />
                <Text style={styles.locationTitle}>Enable Location</Text>
                <Text style={styles.locationText}>
                  Find restaurants, supermarkets, and grocery stores near you with protein-rich food options
                </Text>
                <Button
                  title={loadingLocation ? 'Getting Location...' : 'Enable Location'}
                  onPress={requestLocationPermission}
                  loading={loadingLocation}
                  style={styles.locationButton}
                />
              </View>
            </GlassCard>
          ) : (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.placeTypeScroll}
                contentContainerStyle={styles.placeTypeScrollContent}
              >
                <Pressable
                  onPress={() => setSelectedPlaceType('all')}
                  style={[styles.placeTypeChip, selectedPlaceType === 'all' && styles.placeTypeChipSelected]}
                >
                  <Search size={16} color={selectedPlaceType === 'all' ? Colors.dark.primary : Colors.dark.textTertiary} />
                  <Text style={[styles.placeTypeLabel, selectedPlaceType === 'all' && styles.placeTypeLabelSelected]}>
                    All Places
                  </Text>
                </Pressable>
                {(['restaurant', 'supermarket', 'grocery', 'cafe'] as PlaceType[]).map((type) => {
                  const Icon = placeTypeIcons[type];
                  const isSelected = selectedPlaceType === type;
                  return (
                    <Pressable
                      key={type}
                      onPress={() => setSelectedPlaceType(type)}
                      style={[styles.placeTypeChip, isSelected && styles.placeTypeChipSelected]}
                    >
                      <Icon size={16} color={isSelected ? Colors.dark.primary : Colors.dark.textTertiary} />
                      <Text style={[styles.placeTypeLabel, isSelected && styles.placeTypeLabelSelected]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}s
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>

              {loadingLocation ? (
                <GlassCard style={styles.loadingCard}>
                  <ActivityIndicator size="large" color={Colors.dark.primary} />
                  <Text style={styles.loadingText}>Finding nearby places...</Text>
                </GlassCard>
              ) : (
                <View style={styles.placesContainer}>
                  {filteredPlaces.map((place) => {
                    const PlaceIcon = placeTypeIcons[place.type];
                    return (
                      <GlassCard key={place.id} style={styles.placeCard}>
                        <View style={styles.placeHeader}>
                          <View style={styles.placeIconContainer}>
                            <PlaceIcon size={24} color={Colors.dark.primary} />
                          </View>
                          <View style={styles.placeInfo}>
                            <Text style={styles.placeName}>{place.name}</Text>
                            <View style={styles.placeMetaRow}>
                              <View style={styles.distanceBadge}>
                                <MapPin size={12} color={Colors.dark.accent} />
                                <Text style={styles.distanceText}>{place.distance} km</Text>
                              </View>
                              {renderStars(place.rating)}
                            </View>
                          </View>
                          <View style={[styles.statusBadge, !place.isOpen && styles.closedBadge]}>
                            <Text style={[styles.statusText, !place.isOpen && styles.closedText]}>
                              {place.isOpen ? 'Open' : 'Closed'}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.placeAddress}>
                          <MapPin size={14} color={Colors.dark.textTertiary} />
                          <Text style={styles.addressText}>{place.address}</Text>
                        </View>

                        <View style={styles.specialtiesContainer}>
                          <Text style={styles.specialtiesLabel}>Protein Options:</Text>
                          <View style={styles.specialtiesList}>
                            {place.specialties.map((spec, idx) => (
                              <View key={idx} style={styles.specialtyTag}>
                                <Text style={styles.specialtyText}>{spec}</Text>
                              </View>
                            ))}
                          </View>
                        </View>

                        <View style={styles.placeActions}>
                          <Pressable 
                            style={styles.actionButton}
                            onPress={() => callPlace(place.phone)}
                          >
                            <Phone size={18} color={Colors.dark.accentGreen} />
                            <Text style={styles.actionText}>Call</Text>
                          </Pressable>
                          <Pressable 
                            style={[styles.actionButton, styles.directionsButton]}
                            onPress={() => openMaps(place)}
                          >
                            <Navigation size={18} color={Colors.dark.text} />
                            <Text style={[styles.actionText, styles.directionsText]}>Directions</Text>
                          </Pressable>
                        </View>
                      </GlassCard>
                    );
                  })}
                </View>
              )}
            </>
          )}

          <GlassCard style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <AlertCircle size={20} color={Colors.dark.accentOrange} />
              <Text style={styles.tipTitle}>Pro Tip</Text>
            </View>
            <Text style={styles.tipText}>
              Aim for 1.6-2.2g of protein per kg of body weight for muscle building. 
              Spread your protein intake across 4-5 meals for better absorption.
            </Text>
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
  goalCard: {
    marginBottom: SPACING.xxl,
  },
  goalInputs: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  goalInputContainer: {
    flex: 1,
  },
  goalInput: {
    marginBottom: 0,
  },
  remainingContainer: {
    marginTop: SPACING.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.dark.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  remainingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  remainingValue: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  goalAchieved: {
    color: Colors.dark.accentGreen,
  },
  categoryScroll: {
    marginBottom: SPACING.lg,
    marginHorizontal: -SPACING.xl,
  },
  categoryScrollContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  categoryChipSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  categoryLabel: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  categoryLabelSelected: {
    color: Colors.dark.primary,
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  foodCard: {
    width: '47%',
    padding: SPACING.md,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  foodIconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodMacro: {
    alignItems: 'flex-end',
  },
  foodProtein: {
    color: Colors.dark.accentGreen,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  foodProteinLabel: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  foodName: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  foodServing: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.sm,
  },
  foodTip: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
    lineHeight: 16,
  },
  locationCard: {
    marginBottom: SPACING.xxl,
    minHeight: 200,
  },
  locationContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  locationTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  locationText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  locationButton: {
    minWidth: 180,
  },
  placeTypeScroll: {
    marginBottom: SPACING.lg,
    marginHorizontal: -SPACING.xl,
  },
  placeTypeScrollContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  placeTypeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  placeTypeChipSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  placeTypeLabel: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  placeTypeLabelSelected: {
    color: Colors.dark.primary,
  },
  loadingCard: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxxl,
  },
  loadingText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.lg,
  },
  placesContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  placeCard: {
    padding: SPACING.lg,
  },
  placeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  placeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  placeInfo: {
    flex: 1,
  },
  placeName: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  placeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  distanceText: {
    color: Colors.dark.accent,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: RADIUS.sm,
  },
  closedBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  statusText: {
    color: Colors.dark.accentGreen,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  closedText: {
    color: Colors.dark.accentRed,
  },
  placeAddress: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
    paddingLeft: SPACING.xs,
  },
  addressText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  specialtiesContainer: {
    marginBottom: SPACING.md,
  },
  specialtiesLabel: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.sm,
  },
  specialtiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  specialtyTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    backgroundColor: 'rgba(34, 211, 238, 0.1)',
    borderRadius: RADIUS.sm,
  },
  specialtyText: {
    color: Colors.dark.accent,
    fontSize: FONT_SIZE.xs,
  },
  placeActions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  directionsButton: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  actionText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  directionsText: {
    color: Colors.dark.text,
  },
  tipCard: {
    marginTop: SPACING.lg,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  tipTitle: {
    color: Colors.dark.accentOrange,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  tipText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
});
