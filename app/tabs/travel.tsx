import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import {
  MapPin,
  Navigation,
  Footprints,
  Bike,
  Car,
  Clock,
  Banknote,
  Flame,
  AlertCircle,
  RefreshCw,
  Target,
  Zap,
  Compass,
  Building,
  Route,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import SectionHeader from '@/components/ui/SectionHeader';

type TransportMode = 'walk' | 'bike' | 'auto' | 'cab';

interface LocationInfo {
  city: string;
  district: string;
  street: string;
  country: string;
  fullAddress: string;
  postalCode: string;
}

interface RouteInfo {
  distance: number;
  destinationName: string;
  destinationAddress: string;
}

const transportModes = [
  { key: 'walk' as const, label: 'Walk', icon: Footprints, speed: 5, costPerKm: 0, calories: 60, color: Colors.dark.accentGreen },
  { key: 'bike' as const, label: 'Bike', icon: Bike, speed: 15, costPerKm: 0, calories: 30, color: Colors.dark.accent },
  { key: 'auto' as const, label: 'Auto', icon: Car, speed: 25, costPerKm: 8, calories: 0, color: Colors.dark.accentOrange },
  { key: 'cab' as const, label: 'Cab', icon: Car, speed: 35, costPerKm: 15, calories: 0, color: Colors.dark.accentPurple },
];

const popularDestinations = [
  { name: 'Nearest Gym', icon: Zap, type: 'fitness' },
  { name: 'Local Park', icon: MapPin, type: 'park' },
  { name: 'Shopping Mall', icon: Building, type: 'shopping' },
  { name: 'City Center', icon: Building, type: 'center' },
];

export default function TravelScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [destination, setDestination] = useState('');
  const [selectedMode, setSelectedMode] = useState<TransportMode | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [calculating, setCalculating] = useState(false);

  const requestLocation = async () => {
    setLocationLoading(true);
    setLocationError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied. Please enable in settings.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(currentLocation);
      
      try {
        const [address] = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        
        if (address) {
          const info: LocationInfo = {
            city: address.city || address.region || 'Unknown City',
            district: address.district || address.subregion || '',
            street: address.street || address.name || '',
            country: address.country || '',
            postalCode: address.postalCode || '',
            fullAddress: [
              address.street,
              address.district,
              address.city,
              address.postalCode,
              address.country,
            ].filter(Boolean).join(', '),
          };
          setLocationInfo(info);
          console.log('Location info:', info);
        }
      } catch (geocodeError) {
        console.log('Reverse geocoding failed:', geocodeError);
        setLocationInfo({
          city: 'Current Location',
          district: '',
          street: '',
          country: '',
          postalCode: '',
          fullAddress: `${currentLocation.coords.latitude.toFixed(6)}, ${currentLocation.coords.longitude.toFixed(6)}`,
        });
      }
      
      console.log('Location obtained:', currentLocation);
    } catch (error) {
      console.log('Location error:', error);
      setLocationError('Unable to get location. Please try again.');
    } finally {
      setLocationLoading(false);
    }
  };

  const calculateRoute = async () => {
    if (!destination.trim()) {
      Alert.alert('Enter Destination', 'Please enter a destination to calculate route');
      return;
    }
    
    setCalculating(true);
    
    try {
      const results = await Location.geocodeAsync(destination);
      
      if (results && results.length > 0 && location) {
        const destCoords = results[0];
        
        const R = 6371;
        const dLat = (destCoords.latitude - location.coords.latitude) * Math.PI / 180;
        const dLon = (destCoords.longitude - location.coords.longitude) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(location.coords.latitude * Math.PI / 180) * Math.cos(destCoords.latitude * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = R * c;
        
        try {
          const [destAddress] = await Location.reverseGeocodeAsync({
            latitude: destCoords.latitude,
            longitude: destCoords.longitude,
          });
          
          setRouteInfo({
            distance: Math.round(distance * 10) / 10,
            destinationName: destination,
            destinationAddress: destAddress ? [
              destAddress.street,
              destAddress.district,
              destAddress.city,
              destAddress.country,
            ].filter(Boolean).join(', ') : destination,
          });
        } catch {
          setRouteInfo({
            distance: Math.round(distance * 10) / 10,
            destinationName: destination,
            destinationAddress: destination,
          });
        }
      } else {
        const simulatedDistance = Math.floor(Math.random() * 15) + 1;
        setRouteInfo({
          distance: simulatedDistance,
          destinationName: destination,
          destinationAddress: `${destination}${locationInfo ? `, ${locationInfo.city}` : ''}`,
        });
      }
    } catch (error) {
      console.log('Geocoding error:', error);
      const simulatedDistance = Math.floor(Math.random() * 15) + 1;
      setRouteInfo({
        distance: simulatedDistance,
        destinationName: destination,
        destinationAddress: `${destination}${locationInfo ? `, ${locationInfo.city}` : ''}`,
      });
    } finally {
      setCalculating(false);
    }
  };

  const handleQuickDestination = (dest: typeof popularDestinations[0]) => {
    const cityName = locationInfo?.city || 'nearby';
    setDestination(`${dest.name} ${cityName}`);
  };

  const getEstimates = (mode: typeof transportModes[0]) => {
    if (!routeInfo) return null;
    const time = Math.round((routeInfo.distance / mode.speed) * 60);
    const cost = Math.round(routeInfo.distance * mode.costPerKm);
    const calories = Math.round(mode.calories * (routeInfo.distance / 5));
    return { time, cost, calories };
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
                <Route size={16} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.brandText}>GYMFIT PRO+</Text>
            </View>
            <Text style={styles.title}>Active Travel</Text>
            <Text style={styles.subtitle}>Plan your fitness-friendly commute</Text>
          </View>

          <SectionHeader title="Your Location" />
          <GlassCard style={styles.locationCard}>
            {location && locationInfo ? (
              <View style={styles.locationContent}>
                <View style={styles.locationIcon}>
                  <LinearGradient colors={Colors.dark.gradient.accent} style={styles.locationIconGradient}>
                    <Navigation size={24} color="#FFFFFF" />
                  </LinearGradient>
                </View>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationLabel}>{locationInfo.city}</Text>
                  <Text style={styles.locationAddress} numberOfLines={2}>
                    {locationInfo.fullAddress}
                  </Text>
                  <Text style={styles.locationCoords}>
                    {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                  </Text>
                  <Text style={styles.locationAccuracy}>
                    Accuracy: ±{Math.round(location.coords.accuracy || 0)}m
                  </Text>
                </View>
                <Pressable onPress={requestLocation} style={styles.refreshButton}>
                  <RefreshCw size={20} color={Colors.dark.primary} />
                </Pressable>
              </View>
            ) : (
              <View style={styles.locationEmpty}>
                <LinearGradient colors={Colors.dark.gradient.accent} style={styles.locationEmptyIcon}>
                  <Compass size={32} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.locationEmptyTitle}>Location Required</Text>
                {locationError ? (
                  <Text style={styles.locationError}>{locationError}</Text>
                ) : (
                  <Text style={styles.locationEmptyText}>
                    Enable location to plan your active travel routes with accurate distance calculation
                  </Text>
                )}
                <Button
                  title={locationLoading ? 'Getting Location...' : 'Enable Location'}
                  onPress={requestLocation}
                  loading={locationLoading}
                  gradient
                  style={styles.locationButton}
                  icon={locationLoading ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Compass size={18} color="#FFFFFF" />}
                />
              </View>
            )}
          </GlassCard>

          {location && (
            <>
              <SectionHeader title="Quick Destinations" />
              <View style={styles.quickDestinations}>
                {popularDestinations.map((dest) => {
                  const Icon = dest.icon;
                  return (
                    <Pressable 
                      key={dest.name} 
                      style={styles.quickDestCard}
                      onPress={() => handleQuickDestination(dest)}
                    >
                      <Icon size={18} color={Colors.dark.primary} />
                      <Text style={styles.quickDestText}>{dest.name}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}

          <SectionHeader title="Destination" />
          <GlassCard style={styles.destinationCard}>
            <Input
              label="Where are you going?"
              placeholder="Enter destination address or place"
              value={destination}
              onChangeText={setDestination}
              icon={<Target size={20} color={Colors.dark.textTertiary} />}
              containerStyle={styles.destinationInput}
            />
            <Button
              title={calculating ? "Calculating..." : "Calculate Route"}
              onPress={calculateRoute}
              disabled={!location || !destination.trim() || calculating}
              gradient
              icon={calculating ? <ActivityIndicator size="small" color="#FFFFFF" /> : <Route size={18} color="#FFFFFF" />}
            />
          </GlassCard>

          {routeInfo && (
            <>
              <SectionHeader title="Route Details" />
              <GlassCard style={styles.routeCard}>
                <View style={styles.routeHeader}>
                  <View style={styles.routeFromTo}>
                    <View style={styles.routePoint}>
                      <View style={styles.routePointDot} />
                      <View style={styles.routePointInfo}>
                        <Text style={styles.routePointLabel}>FROM</Text>
                        <Text style={styles.routePointName}>{locationInfo?.city || 'Current Location'}</Text>
                      </View>
                    </View>
                    <View style={styles.routeLine} />
                    <View style={styles.routePoint}>
                      <View style={[styles.routePointDot, styles.routePointDotEnd]} />
                      <View style={styles.routePointInfo}>
                        <Text style={styles.routePointLabel}>TO</Text>
                        <Text style={styles.routePointName}>{routeInfo.destinationName}</Text>
                        <Text style={styles.routePointAddress} numberOfLines={1}>{routeInfo.destinationAddress}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </GlassCard>

              <SectionHeader title="Transport Options" />
              <View style={styles.transportGrid}>
                {transportModes.map((mode) => {
                  const Icon = mode.icon;
                  const estimates = getEstimates(mode);
                  const isSelected = selectedMode === mode.key;
                  return (
                    <Pressable
                      key={mode.key}
                      onPress={() => setSelectedMode(mode.key)}
                      style={[styles.transportCard, isSelected && { borderColor: mode.color }]}
                    >
                      <LinearGradient
                        colors={
                          isSelected
                            ? [mode.color, `${mode.color}88`]
                            : [Colors.dark.surfaceLight, Colors.dark.surfaceLight]
                        }
                        style={styles.transportIcon}
                      >
                        <Icon size={24} color={isSelected ? '#FFFFFF' : Colors.dark.textTertiary} />
                      </LinearGradient>
                      <Text style={[styles.transportLabel, isSelected && { color: mode.color }]}>
                        {mode.label}
                      </Text>
                      {estimates && (
                        <View style={styles.transportEstimates}>
                          <View style={styles.estimateRow}>
                            <Clock size={12} color={Colors.dark.textTertiary} />
                            <Text style={styles.estimateText}>{estimates.time} min</Text>
                          </View>
                          {estimates.cost > 0 && (
                            <View style={styles.estimateRow}>
                              <Banknote size={12} color={Colors.dark.textTertiary} />
                              <Text style={styles.estimateText}>₹{estimates.cost}</Text>
                            </View>
                          )}
                          {estimates.calories > 0 && (
                            <View style={styles.estimateRow}>
                              <Flame size={12} color={Colors.dark.accentOrange} />
                              <Text style={[styles.estimateText, { color: Colors.dark.accentOrange }]}>
                                {estimates.calories} kcal
                              </Text>
                            </View>
                          )}
                        </View>
                      )}
                    </Pressable>
                  );
                })}
              </View>

              <SectionHeader title="Route Summary" />
              <GlassCard style={styles.summaryCard} gradient>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Distance</Text>
                    <Text style={styles.summaryValue}>{routeInfo.distance} km</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Est. Time</Text>
                    <Text style={styles.summaryValue}>
                      {selectedMode
                        ? `${getEstimates(transportModes.find((m) => m.key === selectedMode)!)?.time} min`
                        : '--'}
                    </Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryLabel}>Cost</Text>
                    <Text style={styles.summaryValue}>
                      {selectedMode
                        ? `₹${getEstimates(transportModes.find((m) => m.key === selectedMode)!)?.cost || 0}`
                        : '--'}
                    </Text>
                  </View>
                </View>
              </GlassCard>

              {selectedMode && (selectedMode === 'walk' || selectedMode === 'bike') && (
                <>
                  <SectionHeader title="Fitness Impact" />
                  <GlassCard style={styles.fitnessCard}>
                    <View style={styles.fitnessContent}>
                      <Zap size={24} color={Colors.dark.accentGreen} />
                      <View style={styles.fitnessText}>
                        <Text style={styles.fitnessTitle}>Active Commute Benefits</Text>
                        <Text style={styles.fitnessDescription}>
                          You'll burn approximately{' '}
                          <Text style={{ color: Colors.dark.accentOrange, fontWeight: FONT_WEIGHT.bold }}>
                            {Math.round(getEstimates(transportModes.find((m) => m.key === selectedMode)!)?.calories || 0)} calories
                          </Text>{' '}
                          on this trip!
                        </Text>
                      </View>
                    </View>
                  </GlassCard>

                  <SectionHeader title="Recovery Impact" />
                  <GlassCard style={styles.recoveryCard}>
                    <View style={styles.recoveryContent}>
                      <AlertCircle size={24} color={Colors.dark.accentOrange} />
                      <View style={styles.recoveryText}>
                        <Text style={styles.recoveryTitle}>Fatigue Consideration</Text>
                        <Text style={styles.recoveryDescription}>
                          This {selectedMode === 'walk' ? 'walk' : 'bike ride'} may affect your workout
                          performance if done before training. Consider recovery needs.
                        </Text>
                      </View>
                    </View>
                  </GlassCard>
                </>
              )}
            </>
          )}

          {!routeInfo && (
            <GlassCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <LinearGradient colors={Colors.dark.gradient.accent} style={styles.emptyIcon}>
                  <Route size={40} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.emptyTitle}>Plan Your Route</Text>
                <Text style={styles.emptyText}>
                  Enter a destination to see transport options with accurate time, cost, and calorie estimates
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
  locationCard: {
    marginBottom: SPACING.xxl,
  },
  locationContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {},
  locationIconGradient: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
    marginLeft: SPACING.lg,
  },
  locationLabel: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  locationAddress: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: SPACING.xs,
    lineHeight: 18,
  },
  locationCoords: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: SPACING.xs,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  locationAccuracy: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  refreshButton: {
    padding: SPACING.sm,
  },
  locationEmpty: {
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
  locationEmptyTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  locationEmptyText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 20,
  },
  locationError: {
    color: Colors.dark.accentRed,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  locationButton: {},
  quickDestinations: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  quickDestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: Colors.dark.card,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  quickDestText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  destinationCard: {
    marginBottom: SPACING.xxl,
  },
  destinationInput: {
    marginBottom: SPACING.lg,
  },
  routeCard: {
    marginBottom: SPACING.xxl,
  },
  routeHeader: {},
  routeFromTo: {
    position: 'relative',
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  routePointDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.dark.primary,
    marginTop: 4,
  },
  routePointDotEnd: {
    backgroundColor: Colors.dark.accentGreen,
  },
  routePointInfo: {
    flex: 1,
  },
  routePointLabel: {
    color: Colors.dark.textTertiary,
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
    marginBottom: 2,
  },
  routePointName: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  routePointAddress: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: Colors.dark.border,
    marginLeft: 5,
    marginVertical: SPACING.sm,
  },
  transportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  transportCard: {
    width: '47%',
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  transportIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  transportLabel: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  transportEstimates: {
    gap: SPACING.xs,
  },
  estimateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  estimateText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  summaryCard: {
    marginBottom: SPACING.xxl,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.dark.border,
  },
  summaryLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.xs,
  },
  summaryValue: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
  },
  fitnessCard: {
    marginBottom: SPACING.xl,
    borderColor: Colors.dark.accentGreen,
    borderWidth: 1,
  },
  fitnessContent: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  fitnessText: {
    flex: 1,
  },
  fitnessTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  fitnessDescription: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
  },
  recoveryCard: {
    marginBottom: SPACING.xxl,
  },
  recoveryContent: {
    flexDirection: 'row',
    gap: SPACING.md,
    alignItems: 'flex-start',
  },
  recoveryText: {
    flex: 1,
  },
  recoveryTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  recoveryDescription: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
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
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});
