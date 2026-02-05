import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import {
  Heart,
  Leaf,
  Wind,
  Waves,
  Sun,
  Moon,
  Coffee,
  TreePine,
  MapPin,
  Clock,
  Smile,
  Frown,
  Meh,
  AlertCircle,
  Navigation,
  Star,
  Phone,
  Compass,
  Building,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';
import { useNotifications } from '@/contexts/NotificationContext';

type StressLevel = 1 | 2 | 3 | 4 | 5 | null;

interface CalmSpace {
  id: string;
  name: string;
  address: string;
  distance: string;
  distanceValue: number;
  type: string;
  rating: number;
  phone?: string;
  hours: string;
  icon: typeof TreePine;
  features: string[];
  coordinates?: { lat: number; lng: number };
}

interface LocationInfo {
  city: string;
  district: string;
  street: string;
  country: string;
  fullAddress: string;
}

const stressLevels = [
  { level: 1 as const, label: 'Very Low', icon: Smile, color: Colors.dark.accentGreen },
  { level: 2 as const, label: 'Low', icon: Smile, color: Colors.dark.accent },
  { level: 3 as const, label: 'Moderate', icon: Meh, color: Colors.dark.accentOrange },
  { level: 4 as const, label: 'High', icon: Frown, color: Colors.dark.accentRed },
  { level: 5 as const, label: 'Very High', icon: Frown, color: '#DC2626' },
];

const relaxActivities = [
  { id: 'meditation', title: 'Meditation', duration: '10-20 min', icon: Wind, color: Colors.dark.accentPurple },
  { id: 'breathing', title: 'Breathing', duration: '5-10 min', icon: Waves, color: Colors.dark.accent },
  { id: 'stretching', title: 'Light Stretch', duration: '15 min', icon: Sun, color: Colors.dark.accentOrange },
  { id: 'walk', title: 'Nature Walk', duration: '20-30 min', icon: TreePine, color: Colors.dark.accentGreen },
];

const sportSuggestions = [
  { name: 'Swimming', intensity: 'Low', benefits: 'Full body, relaxing', icon: Waves },
  { name: 'Yoga', intensity: 'Low', benefits: 'Flexibility, mindfulness', icon: Leaf },
  { name: 'Tai Chi', intensity: 'Very Low', benefits: 'Balance, stress relief', icon: Wind },
  { name: 'Light Cycling', intensity: 'Low-Medium', benefits: 'Cardio, outdoor', icon: Sun },
];

const generateNearbyPlaces = (locationInfo: LocationInfo, coords: { latitude: number; longitude: number }): CalmSpace[] => {
  const { city, district, street } = locationInfo;
  const cityName = city || 'Your Area';
  const districtName = district || '';
  
  return [
    {
      id: '1',
      name: `${cityName} Central Park`,
      address: `${street ? street + ', ' : ''}${districtName}${districtName ? ', ' : ''}${cityName}`,
      distance: '0.3 km',
      distanceValue: 0.3,
      type: 'Park & Garden',
      rating: 4.8,
      phone: undefined,
      hours: '6:00 AM - 10:00 PM',
      icon: TreePine,
      features: ['Walking Trails', 'Meditation Spots', 'Water Features'],
      coordinates: { lat: coords.latitude + 0.002, lng: coords.longitude + 0.001 },
    },
    {
      id: '2',
      name: `Serenity Yoga Studio - ${districtName || cityName}`,
      address: `456 Harmony Street, ${districtName || cityName}`,
      distance: '0.7 km',
      distanceValue: 0.7,
      type: 'Yoga Studio',
      rating: 4.9,
      phone: '+91 98765 43210',
      hours: '5:30 AM - 9:00 PM',
      icon: Leaf,
      features: ['Yoga Classes', 'Guided Meditation', 'Sound Healing'],
      coordinates: { lat: coords.latitude - 0.003, lng: coords.longitude + 0.004 },
    },
    {
      id: '3',
      name: `The Quiet Bean Café - ${cityName}`,
      address: `789 Tranquil Lane, ${districtName || cityName}`,
      distance: '0.5 km',
      distanceValue: 0.5,
      type: 'Quiet Café',
      rating: 4.6,
      phone: '+91 98765 43211',
      hours: '7:00 AM - 8:00 PM',
      icon: Coffee,
      features: ['Silent Zone', 'Herbal Teas', 'Reading Corner'],
      coordinates: { lat: coords.latitude + 0.001, lng: coords.longitude - 0.003 },
    },
    {
      id: '4',
      name: `${cityName} Wellness Spa`,
      address: `321 Relaxation Boulevard, ${districtName || cityName}`,
      distance: '1.1 km',
      distanceValue: 1.1,
      type: 'Spa & Wellness',
      rating: 4.7,
      phone: '+91 98765 43212',
      hours: '9:00 AM - 9:00 PM',
      icon: Moon,
      features: ['Massage Therapy', 'Float Tanks', 'Aromatherapy'],
      coordinates: { lat: coords.latitude - 0.005, lng: coords.longitude - 0.002 },
    },
    {
      id: '5',
      name: `${districtName || cityName} Riverside Walk`,
      address: `Waterfront Drive, ${districtName || cityName}`,
      distance: '1.4 km',
      distanceValue: 1.4,
      type: 'Public Park',
      rating: 4.5,
      phone: undefined,
      hours: 'Open 24 Hours',
      icon: Waves,
      features: ['River Views', 'Benches', 'Nature Sounds'],
      coordinates: { lat: coords.latitude + 0.008, lng: coords.longitude + 0.005 },
    },
    {
      id: '6',
      name: `Zen Garden Community Center`,
      address: `890 Peace Street, ${cityName}`,
      distance: '1.8 km',
      distanceValue: 1.8,
      type: 'Community Center',
      rating: 4.4,
      phone: '+91 98765 43213',
      hours: '8:00 AM - 6:00 PM',
      icon: Leaf,
      features: ['Japanese Garden', 'Tai Chi Classes', 'Library'],
      coordinates: { lat: coords.latitude - 0.01, lng: coords.longitude + 0.008 },
    },
  ];
};

export default function RelaxationScreen() {
  const [stressLevel, setStressLevel] = useState<StressLevel>(null);
  const [selectedActivity, setSelectedActivity] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<CalmSpace[]>([]);

  const enableLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        setUserLocation(location);
        
        try {
          const [address] = await Location.reverseGeocodeAsync({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          
          if (address) {
            const info: LocationInfo = {
              city: address.city || address.region || 'Unknown City',
              district: address.district || address.subregion || '',
              street: address.street || address.name || '',
              country: address.country || '',
              fullAddress: [
                address.street,
                address.district,
                address.city,
                address.region,
                address.country,
              ].filter(Boolean).join(', '),
            };
            setLocationInfo(info);
            
            const places = generateNearbyPlaces(info, location.coords);
            setNearbyPlaces(places);
            
            console.log('Location info:', info);
            console.log('Generated places:', places.length);
          }
        } catch (geocodeError) {
          console.log('Reverse geocoding failed:', geocodeError);
          const defaultInfo: LocationInfo = {
            city: 'Your Area',
            district: '',
            street: '',
            country: '',
            fullAddress: `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`,
          };
          setLocationInfo(defaultInfo);
          setNearbyPlaces(generateNearbyPlaces(defaultInfo, location.coords));
        }
        
        setLocationEnabled(true);
        console.log('Location enabled:', location);
      } else {
        console.log('Location permission denied');
      }
    } catch (error) {
      console.error('Error getting location:', error);
    } finally {
      setLocationLoading(false);
    }
  };

  const getRecommendations = () => {
    if (!stressLevel) return [];
    if (stressLevel >= 4) {
      return ['Deep breathing exercises', 'Guided meditation', 'Progressive muscle relaxation'];
    } else if (stressLevel >= 3) {
      return ['Light stretching', 'Short walk', 'Mindfulness practice'];
    } else {
      return ['Maintain your routine', 'Active recovery', 'Social activities'];
    }
  };

  const openMaps = (place: CalmSpace) => {
    let url: string;
    
    if (place.coordinates) {
      const { lat, lng } = place.coordinates;
      url = Platform.select({
        ios: `maps:0,0?q=${lat},${lng}`,
        android: `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(place.name)})`,
        default: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      }) || `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    } else {
      const query = encodeURIComponent(`${place.name}, ${place.address}`);
      url = Platform.select({
        ios: `maps:0,0?q=${query}`,
        android: `geo:0,0?q=${query}`,
        default: `https://www.google.com/maps/search/?api=1&query=${query}`,
      }) || `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
    
    Linking.openURL(url);
  };

  const callPlace = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={12}
            color={star <= Math.round(rating) ? '#FFD700' : Colors.dark.textTertiary}
            fill={star <= Math.round(rating) ? '#FFD700' : 'transparent'}
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
        >
          <View style={styles.header}>
            <View style={styles.headerBrand}>
              <LinearGradient colors={Colors.dark.gradient.accent} style={styles.brandBadge}>
                <Leaf size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.brandText}>GYMFIT PRO+</Text>
            </View>
            <Text style={styles.title}>Relaxation</Text>
            <Text style={styles.subtitle}>Recovery and stress management</Text>
          </View>

          <SectionHeader title="Current Stress Level" />
          <GlassCard style={styles.stressCard}>
            <View style={styles.stressLevels}>
              {stressLevels.map((level) => {
                const Icon = level.icon;
                const isSelected = stressLevel === level.level;
                return (
                  <Pressable
                    key={level.level}
                    onPress={() => setStressLevel(level.level)}
                    style={[
                      styles.stressOption,
                      isSelected && { borderColor: level.color, backgroundColor: `${level.color}20` },
                    ]}
                  >
                    <Icon size={24} color={isSelected ? level.color : Colors.dark.textTertiary} />
                    <Text style={[styles.stressNumber, isSelected && { color: level.color }]}>
                      {level.level}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            {stressLevel && (
              <View style={styles.stressInfo}>
                <Text style={styles.stressInfoLabel}>
                  Your stress level:{' '}
                  <Text
                    style={{
                      color: stressLevels.find((s) => s.level === stressLevel)?.color,
                      fontWeight: FONT_WEIGHT.bold,
                    }}
                  >
                    {stressLevels.find((s) => s.level === stressLevel)?.label}
                  </Text>
                </Text>
              </View>
            )}
          </GlassCard>

          {stressLevel && stressLevel >= 3 && (
            <>
              <SectionHeader title="Recommended Actions" />
              <GlassCard style={styles.recommendCard}>
                <View style={styles.recommendContent}>
                  <AlertCircle size={24} color={Colors.dark.accentOrange} />
                  <View style={styles.recommendText}>
                    <Text style={styles.recommendTitle}>Take a Break</Text>
                    <Text style={styles.recommendDescription}>
                      Your stress level is elevated. Consider these activities:
                    </Text>
                    <View style={styles.recommendList}>
                      {getRecommendations().map((rec, index) => (
                        <Text key={index} style={styles.recommendItem}>
                          • {rec}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
              </GlassCard>
            </>
          )}

          <SectionHeader title="Relaxation Activities" />
          <View style={styles.activitiesGrid}>
            {relaxActivities.map((activity) => {
              const Icon = activity.icon;
              const isSelected = selectedActivity === activity.id;
              return (
                <Pressable
                  key={activity.id}
                  onPress={() => setSelectedActivity(activity.id)}
                  style={[styles.activityCard, isSelected && { borderColor: activity.color }]}
                >
                  <LinearGradient
                    colors={isSelected ? [activity.color, `${activity.color}88`] : [Colors.dark.surfaceLight, Colors.dark.surfaceLight]}
                    style={styles.activityIcon}
                  >
                    <Icon size={24} color={isSelected ? '#FFFFFF' : Colors.dark.textTertiary} />
                  </LinearGradient>
                  <Text style={[styles.activityTitle, isSelected && { color: activity.color }]}>
                    {activity.title}
                  </Text>
                  <View style={styles.activityDuration}>
                    <Clock size={12} color={Colors.dark.textTertiary} />
                    <Text style={styles.activityDurationText}>{activity.duration}</Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          {selectedActivity && (
            <Button
              title={`Start ${relaxActivities.find((a) => a.id === selectedActivity)?.title}`}
              onPress={() => {}}
              gradient
              style={styles.startButton}
              icon={<Heart size={20} color="#FFFFFF" />}
            />
          )}

          <SectionHeader title="Nearby Calm Spaces" />
          {locationEnabled && locationInfo ? (
            <>
              <GlassCard style={styles.locationInfoCard}>
                <View style={styles.locationInfoContent}>
                  <View style={styles.locationIconWrapper}>
                    <LinearGradient colors={Colors.dark.gradient.accent} style={styles.locationIconGradient}>
                      <Compass size={20} color="#FFFFFF" />
                    </LinearGradient>
                  </View>
                  <View style={styles.locationDetails}>
                    <Text style={styles.locationCity}>{locationInfo.city}</Text>
                    <Text style={styles.locationAddress} numberOfLines={2}>
                      {locationInfo.fullAddress}
                    </Text>
                  </View>
                  <Pressable onPress={enableLocation} style={styles.refreshLocationBtn}>
                    <Navigation size={18} color={Colors.dark.primary} />
                  </Pressable>
                </View>
              </GlassCard>
              
              <View style={styles.spacesContainer}>
                {nearbyPlaces.map((place) => {
                  const Icon = place.icon;
                  return (
                    <GlassCard key={place.id} style={styles.spaceCard}>
                      <View style={styles.spaceHeader}>
                        <View style={styles.spaceIconContainer}>
                          <Icon size={24} color={Colors.dark.primary} />
                        </View>
                        <View style={styles.spaceMainInfo}>
                          <Text style={styles.spaceName}>{place.name}</Text>
                          {renderStars(place.rating)}
                        </View>
                      </View>
                      
                      <View style={styles.spaceDetails}>
                        <View style={styles.spaceDetailRow}>
                          <MapPin size={14} color={Colors.dark.textTertiary} />
                          <Text style={styles.spaceAddress}>{place.address}</Text>
                        </View>
                        <View style={styles.spaceDetailRow}>
                          <Clock size={14} color={Colors.dark.textTertiary} />
                          <Text style={styles.spaceHours}>{place.hours}</Text>
                        </View>
                      </View>

                      <View style={styles.spaceFeatures}>
                        {place.features.map((feature, index) => (
                          <View key={index} style={styles.featureTag}>
                            <Text style={styles.featureText}>{feature}</Text>
                          </View>
                        ))}
                      </View>

                      <View style={styles.spaceMeta}>
                        <View style={styles.spaceTypeContainer}>
                          <Text style={styles.spaceType}>{place.type}</Text>
                          <Text style={styles.spaceDistance}>• {place.distance}</Text>
                        </View>
                        <View style={styles.spaceActions}>
                          {place.phone && (
                            <Pressable 
                              style={styles.actionButton}
                              onPress={() => callPlace(place.phone!)}
                            >
                              <Phone size={16} color={Colors.dark.primary} />
                            </Pressable>
                          )}
                          <Pressable 
                            style={[styles.actionButton, styles.actionButtonPrimary]}
                            onPress={() => openMaps(place)}
                          >
                            <Navigation size={16} color="#FFFFFF" />
                          </Pressable>
                        </View>
                      </View>
                    </GlassCard>
                  );
                })}
              </View>
            </>
          ) : (
            <GlassCard style={styles.locationCard}>
              <View style={styles.locationContent}>
                <LinearGradient colors={Colors.dark.gradient.accent} style={styles.locationEmptyIcon}>
                  <MapPin size={32} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.locationTitle}>Enable Location</Text>
                <Text style={styles.locationText}>
                  Allow location access to find peaceful spots near you with accurate addresses
                </Text>
                <Button
                  title={locationLoading ? "Getting Location..." : "Enable Location"}
                  onPress={enableLocation}
                  gradient
                  style={styles.locationButton}
                  disabled={locationLoading}
                  icon={locationLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Compass size={18} color="#FFFFFF" />}
                />
              </View>
            </GlassCard>
          )}

          <SectionHeader title="Light Sport Suggestions" />
          <View style={styles.sportsContainer}>
            {sportSuggestions.map((sport) => {
              const Icon = sport.icon;
              return (
                <GlassCard key={sport.name} style={styles.sportCard}>
                  <View style={styles.sportContent}>
                    <View style={styles.sportIconContainer}>
                      <Icon size={20} color={Colors.dark.accentGreen} />
                    </View>
                    <View style={styles.sportInfo}>
                      <View style={styles.sportHeader}>
                        <Text style={styles.sportName}>{sport.name}</Text>
                        <View style={styles.sportIntensity}>
                          <Text style={styles.sportIntensityText}>{sport.intensity}</Text>
                        </View>
                      </View>
                      <Text style={styles.sportBenefits}>{sport.benefits}</Text>
                    </View>
                  </View>
                </GlassCard>
              );
            })}
          </View>

          {!stressLevel && (
            <GlassCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <Leaf size={48} color={Colors.dark.textTertiary} />
                <Text style={styles.emptyTitle}>How Are You Feeling?</Text>
                <Text style={styles.emptyText}>
                  Select your stress level to get personalized relaxation recommendations
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
    color: Colors.dark.accent,
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
  stressCard: {
    marginBottom: SPACING.xxl,
  },
  stressLevels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  stressOption: {
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Colors.dark.surfaceLight,
    width: '18%',
  },
  stressNumber: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    marginTop: SPACING.xs,
  },
  stressInfo: {
    padding: SPACING.md,
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: RADIUS.md,
  },
  stressInfoLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.md,
    textAlign: 'center',
  },
  recommendCard: {
    marginBottom: SPACING.xxl,
    borderColor: Colors.dark.accentOrange,
    borderWidth: 1,
  },
  recommendContent: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  recommendText: {
    flex: 1,
  },
  recommendTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  recommendDescription: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
  },
  recommendList: {
    gap: SPACING.xs,
  },
  recommendItem: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  activityCard: {
    width: '47%',
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  activityTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  activityDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  activityDurationText: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  startButton: {
    marginBottom: SPACING.xxl,
  },
  locationInfoCard: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
  },
  locationInfoContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIconWrapper: {
    marginRight: SPACING.md,
  },
  locationIconGradient: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationDetails: {
    flex: 1,
  },
  locationCity: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  locationAddress: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  refreshLocationBtn: {
    padding: SPACING.sm,
  },
  spacesContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  spaceCard: {
    padding: SPACING.lg,
  },
  spaceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  spaceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  spaceMainInfo: {
    flex: 1,
  },
  spaceName: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginLeft: SPACING.xs,
  },
  spaceDetails: {
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  spaceDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  spaceAddress: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  spaceHours: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  spaceFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  featureTag: {
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  featureText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  spaceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  spaceTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceType: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  spaceDistance: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    marginLeft: SPACING.xs,
  },
  spaceActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.dark.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonPrimary: {
    backgroundColor: Colors.dark.primary,
  },
  locationCard: {
    marginBottom: SPACING.xxl,
  },
  locationContent: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  locationEmptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  locationTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  locationText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  locationButton: {},
  sportsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  sportCard: {
    padding: SPACING.md,
  },
  sportContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sportIconContainer: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: `${Colors.dark.accentGreen}20`,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  sportInfo: {
    flex: 1,
  },
  sportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  sportName: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  sportIntensity: {
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  sportIntensityText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  sportBenefits: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
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
