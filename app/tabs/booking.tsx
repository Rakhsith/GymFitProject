import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Linking,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MapPin,
  Clock,
  Star,
  Phone,
  Navigation,
  Users,
  CircleDot,
  Volleyball,
  CheckCircle,
  Filter,
  Search,
  ChevronRight,
  Zap,
  Award,
  Shield,
  Send,
  Globe,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import Button from '@/components/ui/Button';

type SportType = 'all' | 'turf' | 'pickleball' | 'badminton' | 'tennis';
type TimeSlot = 'morning' | 'afternoon' | 'evening';

interface Venue {
  id: string;
  name: string;
  address: string;
  area: string;
  distance: string;
  rating: number;
  reviewCount: number;
  sports: SportType[];
  pricePerHour: number;
  amenities: string[];
  phone: string;
  featured: boolean;
  courts: number;
  openNow: boolean;
  timings: string;
  website?: string;
}

const sportFilters: { key: SportType; label: string; icon: typeof CircleDot }[] = [
  { key: 'all', label: 'All', icon: Filter },
  { key: 'turf', label: 'Turf', icon: CircleDot },
  { key: 'pickleball', label: 'Pickleball', icon: Volleyball },
  { key: 'badminton', label: 'Badminton', icon: Volleyball },
  { key: 'tennis', label: 'Tennis', icon: CircleDot },
];

const timeSlots: { key: TimeSlot; label: string; time: string }[] = [
  { key: 'morning', label: 'Morning', time: '6 AM - 12 PM' },
  { key: 'afternoon', label: 'Afternoon', time: '12 PM - 5 PM' },
  { key: 'evening', label: 'Evening', time: '5 PM - 10 PM' },
];

const coimbatoreVenues: Venue[] = [
  {
    id: '1',
    name: 'Kovai Turf Arena',
    address: 'No. 45, Avinashi Road, Near PSG Tech',
    area: 'Peelamedu',
    distance: '2.5 km',
    rating: 4.7,
    reviewCount: 342,
    sports: ['turf', 'badminton'],
    pricePerHour: 1200,
    amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria'],
    phone: '+91 98765 43210',
    featured: true,
    courts: 4,
    openNow: true,
    timings: '6 AM - 11 PM',
  },
  {
    id: '2',
    name: 'Champions Sports Hub',
    address: 'SF No. 123, Saravanampatti Main Road',
    area: 'Saravanampatti',
    distance: '4.2 km',
    rating: 4.5,
    reviewCount: 218,
    sports: ['turf', 'pickleball', 'badminton'],
    pricePerHour: 1000,
    amenities: ['Floodlights', 'Parking', 'Equipment Rental', 'Coaching'],
    phone: '+91 87654 32109',
    featured: true,
    courts: 6,
    openNow: true,
    timings: '5 AM - 10 PM',
  },
  {
    id: '3',
    name: 'Pickleball Coimbatore',
    address: 'Plot No. 78, Behind KG Hospital',
    area: 'RS Puram',
    distance: '1.8 km',
    rating: 4.8,
    reviewCount: 156,
    sports: ['pickleball'],
    pricePerHour: 800,
    amenities: ['Floodlights', 'Parking', 'Equipment Rental', 'Coaching', 'Pro Shop'],
    phone: '+91 96543 21098',
    featured: true,
    courts: 8,
    openNow: true,
    timings: '6 AM - 10 PM',
  },
  {
    id: '4',
    name: 'Green Valley Sports Complex',
    address: 'Door No. 234, Trichy Road, Near Singanallur Signal',
    area: 'Singanallur',
    distance: '5.1 km',
    rating: 4.3,
    reviewCount: 189,
    sports: ['turf', 'tennis', 'badminton'],
    pricePerHour: 900,
    amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria', 'Gym'],
    phone: '+91 94321 09876',
    featured: false,
    courts: 5,
    openNow: true,
    timings: '5:30 AM - 10:30 PM',
  },
  {
    id: '5',
    name: 'Royal Turf Club',
    address: 'SF No. 456, Mettupalayam Road',
    area: 'Thudiyalur',
    distance: '7.3 km',
    rating: 4.6,
    reviewCount: 275,
    sports: ['turf'],
    pricePerHour: 1500,
    amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria', 'First Aid'],
    phone: '+91 93210 98765',
    featured: true,
    courts: 3,
    openNow: true,
    timings: '6 AM - 11 PM',
  },
  {
    id: '6',
    name: 'Athena Badminton Academy',
    address: 'No. 89, Gandhipuram 5th Street',
    area: 'Gandhipuram',
    distance: '3.0 km',
    rating: 4.4,
    reviewCount: 198,
    sports: ['badminton'],
    pricePerHour: 600,
    amenities: ['AC Courts', 'Parking', 'Equipment Rental', 'Coaching', 'Pro Shop'],
    phone: '+91 91098 76543',
    featured: false,
    courts: 10,
    openNow: true,
    timings: '6 AM - 10 PM',
  },
  {
    id: '7',
    name: 'PSG Sports Arena',
    address: 'PSG College Campus, Avinashi Road',
    area: 'Peelamedu',
    distance: '2.8 km',
    rating: 4.5,
    reviewCount: 312,
    sports: ['turf', 'tennis', 'badminton'],
    pricePerHour: 800,
    amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'First Aid'],
    phone: '+91 90876 54321',
    featured: false,
    courts: 7,
    openNow: true,
    timings: '6 AM - 9 PM',
  },
  {
    id: '8',
    name: 'Coimbatore Pickleball Club',
    address: 'Door No. 567, Race Course Road',
    area: 'Race Course',
    distance: '2.1 km',
    rating: 4.9,
    reviewCount: 89,
    sports: ['pickleball'],
    pricePerHour: 1000,
    amenities: ['Floodlights', 'Parking', 'Equipment Rental', 'Coaching', 'Tournament Ready'],
    phone: '+91 89012 34567',
    featured: true,
    courts: 6,
    openNow: true,
    timings: '5:30 AM - 10 PM',
  },
  {
    id: '9',
    name: 'Strikers Football Turf',
    address: 'SF No. 789, Hopes College Road',
    area: 'Hopes College',
    distance: '3.5 km',
    rating: 4.2,
    reviewCount: 167,
    sports: ['turf'],
    pricePerHour: 1100,
    amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Water Cooler'],
    phone: '+91 87012 34567',
    featured: false,
    courts: 2,
    openNow: true,
    timings: '6 AM - 10 PM',
  },
  {
    id: '10',
    name: 'Tennis Point Academy',
    address: 'Plot No. 321, Nava India Road',
    area: 'Tatabad',
    distance: '2.9 km',
    rating: 4.6,
    reviewCount: 143,
    sports: ['tennis'],
    pricePerHour: 700,
    amenities: ['Floodlights', 'Parking', 'Equipment Rental', 'Coaching', 'Ball Machine'],
    phone: '+91 86543 21098',
    featured: false,
    courts: 4,
    openNow: true,
    timings: '5 AM - 9 PM',
  },
  {
    id: '11',
    name: 'Fun Zone Sports',
    address: 'Door No. 654, Sathy Road',
    area: 'Ganapathy',
    distance: '4.8 km',
    rating: 4.1,
    reviewCount: 134,
    sports: ['turf', 'badminton', 'pickleball'],
    pricePerHour: 850,
    amenities: ['Floodlights', 'Parking', 'Cafeteria', 'Kids Play Area'],
    phone: '+91 85432 10987',
    featured: false,
    courts: 5,
    openNow: true,
    timings: '7 AM - 10 PM',
  },
  {
    id: '12',
    name: 'Elite Sports Academy',
    address: 'SF No. 987, Palakkad Main Road',
    area: 'Vadavalli',
    distance: '6.2 km',
    rating: 4.7,
    reviewCount: 256,
    sports: ['turf', 'tennis', 'badminton', 'pickleball'],
    pricePerHour: 1300,
    amenities: ['Floodlights', 'Parking', 'Changing Rooms', 'Cafeteria', 'Gym', 'Swimming Pool'],
    phone: '+91 84321 09876',
    featured: true,
    courts: 12,
    openNow: true,
    timings: '5 AM - 11 PM',
  },
];

export default function BookingScreen() {
  const [selectedSport, setSelectedSport] = useState<SportType>('all');
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryName, setEnquiryName] = useState('');
  const [enquiryPhone, setEnquiryPhone] = useState('');
  const [enquiryNotes, setEnquiryNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVenues = coimbatoreVenues.filter((venue) => {
    const sportMatch = selectedSport === 'all' || venue.sports.includes(selectedSport);
    const searchMatch = searchQuery === '' || 
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.area.toLowerCase().includes(searchQuery.toLowerCase());
    return sportMatch && searchMatch;
  });

  const featuredVenues = filteredVenues.filter(v => v.featured);
  const otherVenues = filteredVenues.filter(v => !v.featured);

  const openMaps = (venue: Venue) => {
    const query = encodeURIComponent(`${venue.name}, ${venue.address}, Coimbatore`);
    const url = Platform.select({
      ios: `maps:0,0?q=${query}`,
      android: `geo:0,0?q=${query}`,
      default: `https://www.google.com/maps/search/?api=1&query=${query}`,
    });
    Linking.openURL(url);
  };

  const callVenue = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEnquirySubmit = () => {
    if (!selectedVenue || !selectedTimeSlot || !enquiryName || !enquiryPhone) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    console.log('Booking enquiry submitted:', {
      venue: selectedVenue.name,
      timeSlot: selectedTimeSlot,
      players: playerCount,
      name: enquiryName,
      phone: enquiryPhone,
      notes: enquiryNotes,
    });

    Alert.alert(
      'Enquiry Sent!',
      `Your booking enquiry for ${selectedVenue.name} has been submitted. They will contact you shortly at ${enquiryPhone}.\n\nYou can also call them directly at ${selectedVenue.phone}`,
      [{ text: 'OK', onPress: () => {
        setShowEnquiryForm(false);
        setSelectedVenue(null);
        setEnquiryName('');
        setEnquiryPhone('');
        setEnquiryNotes('');
      }}]
    );
  };

  const getSportIcon = (sport: SportType) => {
    switch (sport) {
      case 'turf':
        return <CircleDot size={12} color={Colors.dark.accentGreen} />;
      case 'pickleball':
        return <Volleyball size={12} color={Colors.dark.accentOrange} />;
      case 'badminton':
        return <Volleyball size={12} color={Colors.dark.accent} />;
      case 'tennis':
        return <CircleDot size={12} color={Colors.dark.accentPurple} />;
      default:
        return null;
    }
  };

  const renderVenueCard = (venue: Venue, isFeatured: boolean = false) => (
    <Pressable 
      key={venue.id} 
      onPress={() => {
        setSelectedVenue(venue);
        setShowEnquiryForm(true);
      }}
    >
      <GlassCard style={[styles.venueCard, isFeatured && styles.featuredCard]}>
        {isFeatured && (
          <View style={styles.featuredBadge}>
            <Award size={12} color="#FFFFFF" />
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <View style={styles.venueHeader}>
          <LinearGradient
            colors={isFeatured ? Colors.dark.gradient.primary : [Colors.dark.surfaceLight, Colors.dark.surface]}
            style={styles.venueIconContainer}
          >
            {venue.sports.includes('turf') ? (
              <CircleDot size={28} color={isFeatured ? '#FFFFFF' : Colors.dark.accentGreen} />
            ) : venue.sports.includes('pickleball') ? (
              <Volleyball size={28} color={isFeatured ? '#FFFFFF' : Colors.dark.accentOrange} />
            ) : (
              <Volleyball size={28} color={isFeatured ? '#FFFFFF' : Colors.dark.accent} />
            )}
          </LinearGradient>
          <View style={styles.venueMainInfo}>
            <Text style={styles.venueName}>{venue.name}</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={12}
                  color={star <= Math.round(venue.rating) ? '#FFD700' : Colors.dark.textTertiary}
                  fill={star <= Math.round(venue.rating) ? '#FFD700' : 'transparent'}
                />
              ))}
              <Text style={styles.ratingText}>{venue.rating} ({venue.reviewCount})</Text>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceValue}>₹{venue.pricePerHour}</Text>
            <Text style={styles.priceUnit}>/hr</Text>
          </View>
        </View>

        <View style={styles.venueDetails}>
          <View style={styles.venueDetailRow}>
            <MapPin size={14} color={Colors.dark.textTertiary} />
            <Text style={styles.venueAddress} numberOfLines={2}>{venue.address}</Text>
          </View>
          <View style={styles.venueDetailRow}>
            <Navigation size={14} color={Colors.dark.textTertiary} />
            <Text style={styles.venueDistance}>{venue.area} • {venue.distance}</Text>
            <Text style={styles.separator}>•</Text>
            <Text style={[styles.openStatus, { color: venue.openNow ? Colors.dark.accentGreen : Colors.dark.error }]}>
              {venue.openNow ? 'Open Now' : 'Closed'}
            </Text>
          </View>
          <View style={styles.venueDetailRow}>
            <Clock size={14} color={Colors.dark.textTertiary} />
            <Text style={styles.venueTimings}>{venue.timings}</Text>
          </View>
          <View style={styles.venueDetailRow}>
            <Phone size={14} color={Colors.dark.primary} />
            <Text style={styles.venuePhone}>{venue.phone}</Text>
          </View>
        </View>

        <View style={styles.sportTags}>
          {venue.sports.map((sport) => (
            <View key={sport} style={styles.sportTag}>
              {getSportIcon(sport)}
              <Text style={styles.sportTagText}>{sport.charAt(0).toUpperCase() + sport.slice(1)}</Text>
            </View>
          ))}
          <View style={styles.courtTag}>
            <Text style={styles.courtTagText}>{venue.courts} Courts</Text>
          </View>
        </View>

        <View style={styles.amenitiesRow}>
          {venue.amenities.slice(0, 3).map((amenity, index) => (
            <View key={index} style={styles.amenityTag}>
              <CheckCircle size={10} color={Colors.dark.accentGreen} />
              <Text style={styles.amenityText}>{amenity}</Text>
            </View>
          ))}
          {venue.amenities.length > 3 && (
            <Text style={styles.moreAmenities}>+{venue.amenities.length - 3}</Text>
          )}
        </View>

        <View style={styles.venueMeta}>
          <View style={styles.availabilityContainer}>
            {venue.rating >= 4.5 ? (
              <>
                <Star size={14} color="#FFD700" fill="#FFD700" />
                <Text style={styles.availabilityText}>Highly Rated</Text>
              </>
            ) : (
              <>
                <Zap size={14} color={Colors.dark.accentGreen} />
                <Text style={styles.availabilityText}>Available</Text>
              </>
            )}
          </View>
          <View style={styles.venueActions}>
            <Pressable 
              style={styles.actionButton}
              onPress={() => callVenue(venue.phone)}
            >
              <Phone size={16} color={Colors.dark.primary} />
            </Pressable>
            <Pressable 
              style={styles.actionButton}
              onPress={() => openMaps(venue)}
            >
              <Navigation size={16} color={Colors.dark.primary} />
            </Pressable>
            <View style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Enquire</Text>
              <ChevronRight size={14} color={Colors.dark.primary} />
            </View>
          </View>
        </View>
      </GlassCard>
    </Pressable>
  );

  if (showEnquiryForm && selectedVenue) {
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
              <Pressable onPress={() => setShowEnquiryForm(false)}>
                <Text style={styles.backButton}>← Back</Text>
              </Pressable>
              <Text style={styles.title}>Booking Enquiry</Text>
              <Text style={styles.subtitle}>{selectedVenue.name}</Text>
            </View>

            <GlassCard style={styles.venuePreview}>
              <View style={styles.venuePreviewContent}>
                <LinearGradient
                  colors={Colors.dark.gradient.primary}
                  style={styles.venuePreviewIcon}
                >
                  <CircleDot size={24} color="#FFFFFF" />
                </LinearGradient>
                <View style={styles.venuePreviewInfo}>
                  <Text style={styles.venuePreviewName}>{selectedVenue.name}</Text>
                  <Text style={styles.venuePreviewAddress}>{selectedVenue.area}, Coimbatore</Text>
                  <Text style={styles.venuePreviewPrice}>₹{selectedVenue.pricePerHour}/hour</Text>
                </View>
              </View>
              <View style={styles.venueContactRow}>
                <Pressable 
                  style={styles.contactButton}
                  onPress={() => callVenue(selectedVenue.phone)}
                >
                  <Phone size={16} color="#FFFFFF" />
                  <Text style={styles.contactButtonText}>Call Now</Text>
                </Pressable>
                <Pressable 
                  style={styles.contactButtonSecondary}
                  onPress={() => openMaps(selectedVenue)}
                >
                  <Navigation size={16} color={Colors.dark.primary} />
                  <Text style={styles.contactButtonTextSecondary}>Directions</Text>
                </Pressable>
              </View>
            </GlassCard>

            <SectionHeader title="Select Time Slot" />
            <View style={styles.timeSlotsContainer}>
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot.key;
                return (
                  <Pressable
                    key={slot.key}
                    onPress={() => setSelectedTimeSlot(slot.key)}
                    style={[styles.timeSlotCard, isSelected && styles.timeSlotCardSelected]}
                  >
                    <Clock size={20} color={isSelected ? Colors.dark.primary : Colors.dark.textTertiary} />
                    <Text style={[styles.timeSlotLabel, isSelected && styles.timeSlotLabelSelected]}>
                      {slot.label}
                    </Text>
                    <Text style={styles.timeSlotTime}>{slot.time}</Text>
                  </Pressable>
                );
              })}
            </View>

            <SectionHeader title="Number of Players" />
            <View style={styles.playerCountContainer}>
              {[2, 4, 6, 8, 10, 12].map((count) => {
                const isSelected = playerCount === count;
                return (
                  <Pressable
                    key={count}
                    onPress={() => setPlayerCount(count)}
                    style={[styles.playerCountOption, isSelected && styles.playerCountOptionSelected]}
                  >
                    <Users size={16} color={isSelected ? Colors.dark.primary : Colors.dark.textTertiary} />
                    <Text style={[styles.playerCountText, isSelected && styles.playerCountTextSelected]}>
                      {count}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <SectionHeader title="Your Details" />
            <GlassCard style={styles.formCard}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={enquiryName}
                  onChangeText={setEnquiryName}
                  placeholder="Enter your name"
                  placeholderTextColor={Colors.dark.textTertiary}
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number *</Text>
                <TextInput
                  style={styles.textInput}
                  value={enquiryPhone}
                  onChangeText={setEnquiryPhone}
                  placeholder="Enter phone number"
                  placeholderTextColor={Colors.dark.textTertiary}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Additional Notes</Text>
                <TextInput
                  style={[styles.textInput, styles.textAreaInput]}
                  value={enquiryNotes}
                  onChangeText={setEnquiryNotes}
                  placeholder="Any special requirements..."
                  placeholderTextColor={Colors.dark.textTertiary}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </GlassCard>

            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Venue</Text>
                <Text style={styles.summaryValue}>{selectedVenue.name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Location</Text>
                <Text style={styles.summaryValue}>{selectedVenue.area}, Coimbatore</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Time Slot</Text>
                <Text style={styles.summaryValue}>
                  {selectedTimeSlot ? timeSlots.find(t => t.key === selectedTimeSlot)?.label : 'Not selected'}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Players</Text>
                <Text style={styles.summaryValue}>{playerCount} players</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Estimated Cost</Text>
                <Text style={styles.summaryPrice}>₹{selectedVenue.pricePerHour}/hour</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Contact</Text>
                <Text style={styles.summaryPhone}>{selectedVenue.phone}</Text>
              </View>
            </View>

            <Button
              title="Submit Enquiry"
              onPress={handleEnquirySubmit}
              gradient
              style={styles.submitButton}
              icon={<Send size={20} color="#FFFFFF" />}
            />

            <View style={styles.disclaimer}>
              <Shield size={14} color={Colors.dark.textTertiary} />
              <Text style={styles.disclaimerText}>
                The venue will contact you to confirm availability. You can also call them directly at {selectedVenue.phone}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

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
            <View style={styles.locationBadge}>
              <MapPin size={14} color={Colors.dark.primary} />
              <Text style={styles.locationText}>Coimbatore, Tamil Nadu</Text>
            </View>
            <Text style={styles.title}>Book a Court</Text>
            <Text style={styles.subtitle}>Find turf, pickleball & badminton courts in Coimbatore</Text>
          </View>

          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Search size={20} color={Colors.dark.textTertiary} />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search by name, area..."
                placeholderTextColor={Colors.dark.textTertiary}
              />
            </View>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filtersScroll}
            contentContainerStyle={styles.filtersContent}
          >
            {sportFilters.map((filter) => {
              const Icon = filter.icon;
              const isSelected = selectedSport === filter.key;
              return (
                <Pressable
                  key={filter.key}
                  onPress={() => setSelectedSport(filter.key)}
                  style={[styles.filterChip, isSelected && styles.filterChipSelected]}
                >
                  <Icon size={16} color={isSelected ? '#FFFFFF' : Colors.dark.textSecondary} />
                  <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                    {filter.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {featuredVenues.length > 0 && (
            <>
              <SectionHeader title="Featured Venues" subtitle={`${featuredVenues.length} top-rated`} />
              <View style={styles.venuesContainer}>
                {featuredVenues.map((venue) => renderVenueCard(venue, true))}
              </View>
            </>
          )}

          {otherVenues.length > 0 && (
            <>
              <SectionHeader title="All Venues" subtitle={`${otherVenues.length} available`} />
              <View style={styles.venuesContainer}>
                {otherVenues.map((venue) => renderVenueCard(venue, false))}
              </View>
            </>
          )}

          {filteredVenues.length === 0 && (
            <GlassCard style={styles.emptyCard}>
              <View style={styles.emptyContent}>
                <MapPin size={48} color={Colors.dark.textTertiary} />
                <Text style={styles.emptyTitle}>No Venues Found</Text>
                <Text style={styles.emptyText}>
                  Try adjusting your filters or search to find available venues in Coimbatore.
                </Text>
              </View>
            </GlassCard>
          )}

          <GlassCard style={styles.infoCard}>
            <Globe size={20} color={Colors.dark.primary} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Coimbatore Sports Hub</Text>
              <Text style={styles.infoText}>
                All venues listed are in Coimbatore. Contact them directly for real-time availability and booking confirmation.
              </Text>
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
    marginBottom: SPACING.xl,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: `${Colors.dark.primary}20`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  locationText: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  backButton: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.md,
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
  searchContainer: {
    marginBottom: SPACING.lg,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  searchInput: {
    flex: 1,
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    paddingVertical: SPACING.md,
    marginLeft: SPACING.sm,
  },
  filtersScroll: {
    marginBottom: SPACING.xl,
  },
  filtersContent: {
    gap: SPACING.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  filterChipSelected: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  filterChipText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  venuesContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  venueCard: {
    padding: SPACING.lg,
  },
  featuredCard: {
    borderColor: Colors.dark.primary,
    borderWidth: 1,
  },
  featuredBadge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.dark.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    zIndex: 1,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
  venueHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  venueIconContainer: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  venueMainInfo: {
    flex: 1,
  },
  venueName: {
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
  priceContainer: {
    alignItems: 'flex-end',
  },
  priceValue: {
    color: Colors.dark.accentGreen,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  priceUnit: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  venueDetails: {
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  venueDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  venueAddress: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    flex: 1,
  },
  venueDistance: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  venueTimings: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  separator: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
  },
  sportTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  sportTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  sportTagText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
  },
  courtTag: {
    backgroundColor: `${Colors.dark.primary}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  courtTagText: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.medium,
  },
  amenitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  amenityText: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  moreAmenities: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.xs,
  },
  venueMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  availabilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  availabilityText: {
    color: Colors.dark.accentGreen,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  venueActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: `${Colors.dark.primary}20`,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
  },
  bookButtonText: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  venuePreview: {
    marginBottom: SPACING.xl,
  },
  venuePreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  venuePreviewIcon: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  venuePreviewInfo: {
    flex: 1,
  },
  venuePreviewName: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  venuePreviewAddress: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  venuePreviewPrice: {
    color: Colors.dark.accentGreen,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: 4,
  },
  venueContactRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: Colors.dark.primary,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  contactButtonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  contactButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: `${Colors.dark.primary}20`,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.md,
  },
  contactButtonTextSecondary: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  timeSlotsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  timeSlotCard: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  timeSlotCardSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: `${Colors.dark.primary}10`,
  },
  timeSlotLabel: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    marginTop: SPACING.sm,
  },
  timeSlotLabelSelected: {
    color: Colors.dark.primary,
  },
  timeSlotTime: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 4,
  },
  playerCountContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  playerCountOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  playerCountOptionSelected: {
    borderColor: Colors.dark.primary,
    backgroundColor: `${Colors.dark.primary}10`,
  },
  playerCountText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.medium,
  },
  playerCountTextSelected: {
    color: Colors.dark.primary,
  },
  formCard: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.sm,
  },
  textInput: {
    backgroundColor: Colors.dark.surfaceLight,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    color: Colors.dark.text,
    fontSize: FONT_SIZE.md,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  textAreaInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  summaryLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
  },
  summaryValue: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
    flex: 1,
    textAlign: 'right',
    marginLeft: SPACING.md,
  },
  summaryPrice: {
    color: Colors.dark.accentGreen,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
  },
  summaryPhone: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  submitButton: {
    marginBottom: SPACING.lg,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  openStatus: {
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  venuePhone: {
    color: Colors.dark.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
    padding: SPACING.lg,
    marginTop: SPACING.md,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.xs,
  },
  infoText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.xs,
    lineHeight: 16,
  },
});
