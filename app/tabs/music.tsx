import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import {
  Music,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  Heart,
  Zap,
  Moon,
  Sun,
  Flame,
  Loader,
  Shuffle,
  Repeat,
  ListMusic,
  Globe,
  ExternalLink,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { SPACING, FONT_SIZE, FONT_WEIGHT, RADIUS } from '@/constants/theme';
import GlassCard from '@/components/ui/GlassCard';
import SectionHeader from '@/components/ui/SectionHeader';
import { useAuth } from '@/contexts/AuthContext';

type Mood = 'energetic' | 'focused' | 'relaxed' | 'pumped' | null;
type Language = 'all' | 'tamil' | 'hindi' | 'english';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  url: string;
  bpm: string;
  mood: string;
  duration: number;
  coverUrl: string;
  genre: string;
  language: Language;
}

interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  trackCount: number;
  tracks: string[];
  language?: Language;
}

const moods = [
  { key: 'energetic' as const, label: 'Energetic', icon: Zap, color: Colors.dark.accentOrange },
  { key: 'focused' as const, label: 'Focused', icon: Sun, color: Colors.dark.accent },
  { key: 'relaxed' as const, label: 'Relaxed', icon: Moon, color: Colors.dark.accentPurple },
  { key: 'pumped' as const, label: 'Pumped', icon: Flame, color: Colors.dark.accentRed },
];

const languageFilters = [
  { key: 'all' as const, label: 'All', flag: '🌍' },
  { key: 'tamil' as const, label: 'Tamil', flag: '🎵' },
  { key: 'hindi' as const, label: 'Hindi', flag: '🎶' },
  { key: 'english' as const, label: 'English', flag: '🎸' },
];

const allTracks: Track[] = [
  // Tamil Songs
  {
    id: 't1',
    title: 'Vaathi Coming',
    artist: 'Anirudh Ravichander',
    album: 'Master',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    bpm: '140-170',
    mood: 'pumped',
    duration: 210,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    genre: 'Mass',
    language: 'tamil',
  },
  {
    id: 't2',
    title: 'Aalaporan Thamizhan',
    artist: 'A.R. Rahman',
    album: 'Mersal',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    bpm: '120-140',
    mood: 'energetic',
    duration: 245,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    genre: 'Motivational',
    language: 'tamil',
  },
  {
    id: 't3',
    title: 'Verithanam',
    artist: 'A.R. Rahman',
    album: 'Bigil',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    bpm: '140-170',
    mood: 'pumped',
    duration: 198,
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    genre: 'Sports',
    language: 'tamil',
  },
  {
    id: 't4',
    title: 'Enjoy Enjaami',
    artist: 'Dhee, Arivu',
    album: 'Single',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    bpm: '90-120',
    mood: 'energetic',
    duration: 267,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    genre: 'Folk Fusion',
    language: 'tamil',
  },
  {
    id: 't5',
    title: 'Kutti Story',
    artist: 'Anirudh Ravichander',
    album: 'Master',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    bpm: '120-140',
    mood: 'focused',
    duration: 215,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    genre: 'Motivational',
    language: 'tamil',
  },
  {
    id: 't6',
    title: 'Rowdy Baby',
    artist: 'Dhanush, Dhee',
    album: 'Maari 2',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    bpm: '140-170',
    mood: 'pumped',
    duration: 242,
    coverUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&h=300&fit=crop',
    genre: 'Dance',
    language: 'tamil',
  },
  {
    id: 't7',
    title: 'Naan Sirithal',
    artist: 'Hiphop Tamizha',
    album: 'Naan Sirithal',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    bpm: '90-120',
    mood: 'relaxed',
    duration: 195,
    coverUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
    genre: 'Feel Good',
    language: 'tamil',
  },
  {
    id: 't8',
    title: 'Chilla Chilla',
    artist: 'Anirudh Ravichander',
    album: 'Thunivu',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    bpm: '140-170',
    mood: 'pumped',
    duration: 185,
    coverUrl: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=300&h=300&fit=crop',
    genre: 'Mass',
    language: 'tamil',
  },
  {
    id: 't9',
    title: 'Arabic Kuthu',
    artist: 'Anirudh Ravichander',
    album: 'Beast',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    bpm: '140-170',
    mood: 'energetic',
    duration: 238,
    coverUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
    genre: 'Dance',
    language: 'tamil',
  },
  {
    id: 't10',
    title: 'Kaavaalaa',
    artist: 'Anirudh Ravichander',
    album: 'Jailer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    bpm: '120-140',
    mood: 'energetic',
    duration: 225,
    coverUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=300&fit=crop',
    genre: 'Mass',
    language: 'tamil',
  },

  // Hindi Songs
  {
    id: 'h1',
    title: 'Kar Har Maidaan Fateh',
    artist: 'Sukhwinder Singh',
    album: 'Sanju',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    bpm: '120-140',
    mood: 'pumped',
    duration: 285,
    coverUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
    genre: 'Motivational',
    language: 'hindi',
  },
  {
    id: 'h2',
    title: 'Ziddi Dil',
    artist: 'Vishal Dadlani',
    album: 'Mary Kom',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    bpm: '140-170',
    mood: 'pumped',
    duration: 198,
    coverUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=300&h=300&fit=crop',
    genre: 'Sports',
    language: 'hindi',
  },
  {
    id: 'h3',
    title: 'Apna Time Aayega',
    artist: 'Ranveer Singh',
    album: 'Gully Boy',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    bpm: '90-120',
    mood: 'focused',
    duration: 232,
    coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    language: 'hindi',
  },
  {
    id: 'h4',
    title: 'Malhari',
    artist: 'Vishal Dadlani',
    album: 'Bajirao Mastani',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    bpm: '140-170',
    mood: 'pumped',
    duration: 267,
    coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop',
    genre: 'Celebratory',
    language: 'hindi',
  },
  {
    id: 'h5',
    title: 'Suno Gaur Se',
    artist: 'Shankar-Ehsaan-Loy',
    album: 'Dus',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    bpm: '120-140',
    mood: 'energetic',
    duration: 245,
    coverUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&h=300&fit=crop',
    genre: 'Patriotic',
    language: 'hindi',
  },
  {
    id: 'h6',
    title: 'Sultan',
    artist: 'Salman Khan, Vishal',
    album: 'Sultan',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    bpm: '120-140',
    mood: 'pumped',
    duration: 278,
    coverUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop',
    genre: 'Sports',
    language: 'hindi',
  },
  {
    id: 'h7',
    title: 'Dangal',
    artist: 'Daler Mehndi',
    album: 'Dangal',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    bpm: '120-140',
    mood: 'pumped',
    duration: 312,
    coverUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=300&h=300&fit=crop',
    genre: 'Sports',
    language: 'hindi',
  },
  {
    id: 'h8',
    title: 'Badtameez Dil',
    artist: 'Benny Dayal',
    album: 'Yeh Jawaani Hai Deewani',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    bpm: '140-170',
    mood: 'energetic',
    duration: 235,
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    genre: 'Dance',
    language: 'hindi',
  },
  {
    id: 'h9',
    title: 'Chak De India',
    artist: 'Sukhwinder Singh',
    album: 'Chak De India',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    bpm: '120-140',
    mood: 'pumped',
    duration: 295,
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    genre: 'Sports',
    language: 'hindi',
  },
  {
    id: 'h10',
    title: 'Ainvayi Ainvayi',
    artist: 'Salim Merchant',
    album: 'Band Baaja Baaraat',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    bpm: '140-170',
    mood: 'energetic',
    duration: 248,
    coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop',
    genre: 'Dance',
    language: 'hindi',
  },

  // English Songs
  {
    id: 'e1',
    title: 'Stronger',
    artist: 'Kanye West',
    album: 'Graduation',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    bpm: '120-140',
    mood: 'pumped',
    duration: 312,
    coverUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    language: 'english',
  },
  {
    id: 'e2',
    title: 'Eye of the Tiger',
    artist: 'Survivor',
    album: 'Rocky III',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    bpm: '120-140',
    mood: 'pumped',
    duration: 245,
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    genre: 'Rock',
    language: 'english',
  },
  {
    id: 'e3',
    title: 'Lose Yourself',
    artist: 'Eminem',
    album: '8 Mile',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    bpm: '90-120',
    mood: 'focused',
    duration: 326,
    coverUrl: 'https://images.unsplash.com/photo-1526401485004-46910ecc8e51?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    language: 'english',
  },
  {
    id: 'e4',
    title: 'Till I Collapse',
    artist: 'Eminem ft. Nate Dogg',
    album: 'The Eminem Show',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    bpm: '140-170',
    mood: 'pumped',
    duration: 298,
    coverUrl: 'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    language: 'english',
  },
  {
    id: 'e5',
    title: 'Can\'t Hold Us',
    artist: 'Macklemore & Ryan Lewis',
    album: 'The Heist',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    bpm: '140-170',
    mood: 'energetic',
    duration: 258,
    coverUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    language: 'english',
  },
  {
    id: 'e6',
    title: 'Thunderstruck',
    artist: 'AC/DC',
    album: 'The Razors Edge',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    bpm: '140-170',
    mood: 'pumped',
    duration: 292,
    coverUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop',
    genre: 'Rock',
    language: 'english',
  },
  {
    id: 'e7',
    title: 'Remember The Name',
    artist: 'Fort Minor',
    album: 'The Rising Tied',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    bpm: '90-120',
    mood: 'focused',
    duration: 228,
    coverUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    language: 'english',
  },
  {
    id: 'e8',
    title: 'Believer',
    artist: 'Imagine Dragons',
    album: 'Evolve',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    bpm: '120-140',
    mood: 'pumped',
    duration: 204,
    coverUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=300&fit=crop',
    genre: 'Rock',
    language: 'english',
  },
  {
    id: 'e9',
    title: 'Hall of Fame',
    artist: 'The Script ft. will.i.am',
    album: '#3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    bpm: '90-120',
    mood: 'focused',
    duration: 212,
    coverUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c149a?w=300&h=300&fit=crop',
    genre: 'Pop Rock',
    language: 'english',
  },
  {
    id: 'e10',
    title: 'Run This Town',
    artist: 'Jay-Z ft. Rihanna',
    album: 'The Blueprint 3',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    bpm: '120-140',
    mood: 'energetic',
    duration: 267,
    coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    language: 'english',
  },
  {
    id: 'e11',
    title: 'Pump It',
    artist: 'Black Eyed Peas',
    album: 'Monkey Business',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    bpm: '140-170',
    mood: 'energetic',
    duration: 213,
    coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop',
    genre: 'Hip Hop',
    language: 'english',
  },
  {
    id: 'e12',
    title: 'Levels',
    artist: 'Avicii',
    album: 'Single',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    bpm: '120-140',
    mood: 'energetic',
    duration: 182,
    coverUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&h=300&fit=crop',
    genre: 'EDM',
    language: 'english',
  },
];

const playlists: Playlist[] = [
  // Language-based playlists
  {
    id: 'tamil-hits',
    name: 'Tamil Workout Hits',
    description: 'Best Tamil songs for your workout',
    coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
    trackCount: 10,
    tracks: ['t1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10'],
    language: 'tamil',
  },
  {
    id: 'hindi-hits',
    name: 'Hindi Power Playlist',
    description: 'Bollywood beats to fuel your workout',
    coverUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop',
    trackCount: 10,
    tracks: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'h7', 'h8', 'h9', 'h10'],
    language: 'hindi',
  },
  {
    id: 'english-hits',
    name: 'English Gym Anthems',
    description: 'International hits for maximum gains',
    coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop',
    trackCount: 12,
    tracks: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'e10', 'e11', 'e12'],
    language: 'english',
  },
  // Mood-based playlists
  {
    id: 'beast-mode',
    name: 'Beast Mode',
    description: 'High intensity workout hits',
    coverUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&h=300&fit=crop',
    trackCount: 8,
    tracks: ['t1', 't6', 'h2', 'h4', 'e4', 'e6', 't8', 'h9'],
  },
  {
    id: 'cardio-blast',
    name: 'Cardio Blast',
    description: 'Keep your heart pumping',
    coverUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=300&h=300&fit=crop',
    trackCount: 6,
    tracks: ['t9', 'h8', 'e5', 'e11', 'e12', 't4'],
  },
  {
    id: 'focus-flow',
    name: 'Focus & Flow',
    description: 'Stay in the zone',
    coverUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=300&h=300&fit=crop',
    trackCount: 5,
    tracks: ['h3', 'e3', 'e7', 'e9', 't5'],
  },
];

export default function MusicScreen() {
  const { user } = useAuth();
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('all');
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [activePlaylist, setActivePlaylist] = useState<Playlist | null>(null);
  const [showQueue, setShowQueue] = useState(false);
  

  const player = useAudioPlayer(currentTrack?.url ? { uri: currentTrack.url } : null);
  const status = useAudioPlayerStatus(player);

  const streamingApps = [
    { 
      id: 'spotify', 
      name: 'Spotify', 
      color: '#1DB954',
      icon: '🎵',
      getUrl: (track: Track) => `https://open.spotify.com/search/${encodeURIComponent(`${track.title} ${track.artist}`)}`
    },
    { 
      id: 'jiosaavn', 
      name: 'JioSaavn', 
      color: '#2BC5B4',
      icon: '🎶',
      getUrl: (track: Track) => `https://www.jiosaavn.com/search/${encodeURIComponent(`${track.title} ${track.artist}`)}`
    },
    { 
      id: 'gaana', 
      name: 'Gaana', 
      color: '#E72C30',
      icon: '🎧',
      getUrl: (track: Track) => `https://gaana.com/search/${encodeURIComponent(`${track.title} ${track.artist}`)}`
    },
    { 
      id: 'applemusic', 
      name: 'Apple Music', 
      color: '#FC3C44',
      icon: '🍎',
      getUrl: (track: Track) => `https://music.apple.com/search?term=${encodeURIComponent(`${track.title} ${track.artist}`)}`
    },
    { 
      id: 'youtube', 
      name: 'YouTube Music', 
      color: '#FF0000',
      icon: '▶️',
      getUrl: (track: Track) => `https://music.youtube.com/search?q=${encodeURIComponent(`${track.title} ${track.artist}`)}`
    },
  ];

  const openInStreamingApp = async (appId: string) => {
    if (!currentTrack) return;
    const app = streamingApps.find(a => a.id === appId);
    if (!app) return;
    
    const url = app.getUrl(currentTrack);
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        await Linking.openURL(url);
      }
    } catch (error) {
      console.log('Error opening URL:', error);
      Alert.alert('Error', `Could not open ${app.name}`);
    }
  };

  const filteredTracks = allTracks.filter((track) => {
    const moodMatch = !selectedMood || track.mood === selectedMood;
    const languageMatch = selectedLanguage === 'all' || track.language === selectedLanguage;
    return moodMatch && languageMatch;
  });

  const currentQueue = activePlaylist 
    ? allTracks.filter(t => activePlaylist.tracks.includes(t.id))
    : filteredTracks;

  const filteredPlaylists = selectedLanguage === 'all' 
    ? playlists 
    : playlists.filter(p => !p.language || p.language === selectedLanguage);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const handlePlayTrack = useCallback((track: Track) => {
    console.log('Selected track:', track.title);
    setCurrentTrack(track);
    const index = currentQueue.findIndex(t => t.id === track.id);
    setTrackIndex(index >= 0 ? index : 0);
  }, [currentQueue]);

  const handlePlayPlaylist = (playlist: Playlist) => {
    setActivePlaylist(playlist);
    const firstTrack = allTracks.find(t => t.id === playlist.tracks[0]);
    if (firstTrack) {
      handlePlayTrack(firstTrack);
    }
  };

  const handlePlayPause = useCallback(() => {
    if (!currentTrack) {
      if (currentQueue.length > 0) {
        handlePlayTrack(currentQueue[0]);
      } else {
        Alert.alert('No Tracks', 'Please select a language or mood to see available tracks.');
      }
      return;
    }

    if (status.playing) {
      console.log('Pausing audio');
      player.pause();
    } else {
      console.log('Playing audio');
      player.play();
    }
  }, [currentTrack, status.playing, player, currentQueue, handlePlayTrack]);

  const handleNextTrack = useCallback(() => {
    if (currentQueue.length === 0) return;
    
    let nextIndex: number;
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * currentQueue.length);
    } else {
      nextIndex = (trackIndex + 1) % currentQueue.length;
    }
    
    setTrackIndex(nextIndex);
    setCurrentTrack(currentQueue[nextIndex]);
  }, [trackIndex, currentQueue, isShuffled]);

  const handlePrevTrack = useCallback(() => {
    if (currentQueue.length === 0) return;
    const prevIndex = trackIndex === 0 ? currentQueue.length - 1 : trackIndex - 1;
    setTrackIndex(prevIndex);
    setCurrentTrack(currentQueue[prevIndex]);
  }, [trackIndex, currentQueue]);

  const handleSeek = (percent: number) => {
    if (status.duration > 0) {
      const newTime = (percent / 100) * status.duration;
      player.seekTo(newTime);
    }
  };

  useEffect(() => {
    if (currentTrack && player) {
      player.play();
    }
  }, [currentTrack, player]);

  useEffect(() => {
    if (status.didJustFinish) {
      if (repeatMode === 'one') {
        player.seekTo(0);
        player.play();
      } else {
        handleNextTrack();
      }
    }
  }, [status.didJustFinish, handleNextTrack, repeatMode, player]);

  const progressPercent = status.duration > 0 
    ? (status.currentTime / status.duration) * 100 
    : 0;

  const getLanguageColor = (lang: Language) => {
    switch (lang) {
      case 'tamil': return '#FF6B6B';
      case 'hindi': return '#4ECDC4';
      case 'english': return '#45B7D1';
      default: return Colors.dark.primary;
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0A0F', '#1a1a2e', '#16213e']}
        style={StyleSheet.absoluteFillObject}
      />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.headerBrand}>
                <LinearGradient colors={['#1DB954', '#1ed760']} style={styles.brandBadge}>
                  <Music size={16} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.brandText}>GYMFIT PRO+</Text>
              </View>
              <View style={styles.userBadge}>
                <Text style={styles.userBadgeText}>{user?.name?.[0] || 'G'}</Text>
              </View>
            </View>
            <Text style={styles.title}>Workout Music</Text>
            <Text style={styles.subtitle}>Tamil • Hindi • English workout beats</Text>
          </View>

          <SectionHeader title="Select Language" subtitle="Choose your vibe" />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.languageFilters}
          >
            {languageFilters.map((lang) => {
              const isSelected = selectedLanguage === lang.key;
              return (
                <Pressable
                  key={lang.key}
                  onPress={() => {
                    setSelectedLanguage(lang.key);
                    setActivePlaylist(null);
                  }}
                  style={[
                    styles.languageChip, 
                    isSelected && styles.languageChipSelected,
                    isSelected && { borderColor: getLanguageColor(lang.key) }
                  ]}
                >
                  <Text style={styles.languageFlag}>{lang.flag}</Text>
                  <Text style={[
                    styles.languageLabel, 
                    isSelected && { color: getLanguageColor(lang.key) }
                  ]}>
                    {lang.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <SectionHeader title="Playlists" subtitle="Jump right in" />
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.playlistsScroll}
          >
            {filteredPlaylists.map((playlist) => (
              <Pressable 
                key={playlist.id} 
                style={styles.playlistItem}
                onPress={() => handlePlayPlaylist(playlist)}
              >
                <View style={styles.playlistCoverContainer}>
                  <Image 
                    source={{ uri: playlist.coverUrl }} 
                    style={styles.playlistCover}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.8)']}
                    style={styles.playlistCoverOverlay}
                  />
                  {playlist.language && (
                    <View style={[styles.playlistLangBadge, { backgroundColor: getLanguageColor(playlist.language) }]}>
                      <Text style={styles.playlistLangText}>
                        {playlist.language.charAt(0).toUpperCase() + playlist.language.slice(1)}
                      </Text>
                    </View>
                  )}
                  <View style={styles.playlistPlayIcon}>
                    <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                </View>
                <Text style={styles.playlistName} numberOfLines={1}>{playlist.name}</Text>
                <Text style={styles.playlistDesc} numberOfLines={1}>{playlist.trackCount} songs</Text>
              </Pressable>
            ))}
          </ScrollView>

          <SectionHeader title="How do you feel?" />
          <View style={styles.moodGrid}>
            {moods.map((mood) => {
              const Icon = mood.icon;
              const isSelected = selectedMood === mood.key;
              return (
                <Pressable
                  key={mood.key}
                  onPress={() => setSelectedMood(isSelected ? null : mood.key)}
                  style={[styles.moodCard, isSelected && { borderColor: mood.color }]}
                >
                  <LinearGradient
                    colors={
                      isSelected
                        ? [mood.color, `${mood.color}88`]
                        : [Colors.dark.surfaceLight, Colors.dark.surfaceLight]
                    }
                    style={styles.moodIconContainer}
                  >
                    <Icon size={28} color={isSelected ? '#FFFFFF' : Colors.dark.textTertiary} />
                  </LinearGradient>
                  <Text style={[styles.moodLabel, isSelected && { color: mood.color }]}>
                    {mood.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <SectionHeader 
            title={activePlaylist ? `Playing: ${activePlaylist.name}` : "All Tracks"} 
            subtitle={`${currentQueue.length} songs`}
            actionLabel={showQueue ? "Hide" : "Show All"}
            onAction={() => setShowQueue(!showQueue)}
          />
          
          {(showQueue || !currentTrack) && (
            <View style={styles.tracksContainer}>
              {currentQueue.slice(0, showQueue ? currentQueue.length : 8).map((track, index) => {
                const isCurrentTrack = currentTrack?.id === track.id;
                const isFavorite = favorites.includes(track.id);
                return (
                  <Pressable 
                    key={track.id} 
                    onPress={() => handlePlayTrack(track)}
                    style={[styles.trackRow, isCurrentTrack && styles.activeTrackRow]}
                  >
                    <Text style={styles.trackNumber}>{index + 1}</Text>
                    <Image source={{ uri: track.coverUrl }} style={styles.trackCover} />
                    <View style={styles.trackInfo}>
                      <Text style={[styles.trackTitle, isCurrentTrack && styles.activeTrackTitle]} numberOfLines={1}>
                        {track.title}
                      </Text>
                      <View style={styles.trackSubInfo}>
                        <Text style={styles.trackArtist} numberOfLines={1}>
                          {track.artist}
                        </Text>
                        <View style={[styles.langBadge, { backgroundColor: `${getLanguageColor(track.language)}30` }]}>
                          <Text style={[styles.langBadgeText, { color: getLanguageColor(track.language) }]}>
                            {track.language.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.trackDuration}>{formatTime(track.duration)}</Text>
                    <Pressable 
                      style={styles.favoriteBtn}
                      onPress={() => toggleFavorite(track.id)}
                    >
                      <Heart 
                        size={18} 
                        color={isFavorite ? '#1DB954' : Colors.dark.textTertiary}
                        fill={isFavorite ? '#1DB954' : 'transparent'}
                      />
                    </Pressable>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={styles.playerSection}>
            <GlassCard style={styles.playerCard}>
              {currentTrack ? (
                <>
                  <View style={styles.playerTop}>
                    <Image source={{ uri: currentTrack.coverUrl }} style={styles.albumArt} />
                    <View style={styles.trackDetails}>
                      <Text style={styles.nowPlayingLabel}>NOW PLAYING</Text>
                      <Text style={styles.currentTrackTitle} numberOfLines={1}>{currentTrack.title}</Text>
                      <Text style={styles.currentTrackArtist}>{currentTrack.artist}</Text>
                      <View style={styles.trackMeta}>
                        <View style={[styles.metaBadge, { backgroundColor: `${getLanguageColor(currentTrack.language)}30` }]}>
                          <Globe size={10} color={getLanguageColor(currentTrack.language)} />
                          <Text style={[styles.metaText, { color: getLanguageColor(currentTrack.language) }]}>
                            {currentTrack.language.charAt(0).toUpperCase() + currentTrack.language.slice(1)}
                          </Text>
                        </View>
                        <View style={styles.metaBadge}>
                          <Music size={10} color={Colors.dark.textTertiary} />
                          <Text style={styles.metaText}>{currentTrack.genre}</Text>
                        </View>
                      </View>
                    </View>
                    <Pressable 
                      style={styles.favoriteButton}
                      onPress={() => toggleFavorite(currentTrack.id)}
                    >
                      <Heart 
                        size={24} 
                        color={favorites.includes(currentTrack.id) ? '#1DB954' : Colors.dark.textTertiary}
                        fill={favorites.includes(currentTrack.id) ? '#1DB954' : 'transparent'}
                      />
                    </Pressable>
                  </View>

                  <Pressable 
                    style={styles.progressContainer}
                    onPress={(e) => {
                      const { locationX } = e.nativeEvent;
                      const percent = (locationX / 300) * 100;
                      handleSeek(Math.min(100, Math.max(0, percent)));
                    }}
                  >
                    <View style={styles.progressBar}>
                      <LinearGradient 
                        colors={['#1DB954', '#1ed760']} 
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.progressFill, { width: `${progressPercent}%` }]} 
                      />
                      <View style={[styles.progressKnob, { left: `${progressPercent}%` }]} />
                    </View>
                    <View style={styles.progressTimes}>
                      <Text style={styles.progressTime}>{formatTime(status.currentTime)}</Text>
                      <Text style={styles.progressTime}>{formatTime(status.duration || currentTrack.duration)}</Text>
                    </View>
                  </Pressable>

                  <View style={styles.controls}>
                    <Pressable 
                      style={[styles.controlButton, isShuffled && styles.controlButtonActive]}
                      onPress={() => setIsShuffled(!isShuffled)}
                    >
                      <Shuffle size={20} color={isShuffled ? '#1DB954' : Colors.dark.textSecondary} />
                    </Pressable>
                    <Pressable style={styles.controlButton} onPress={handlePrevTrack}>
                      <SkipBack size={28} color={Colors.dark.text} fill={Colors.dark.text} />
                    </Pressable>
                    <Pressable
                      style={styles.playButton}
                      onPress={handlePlayPause}
                    >
                      <LinearGradient colors={['#1DB954', '#1ed760']} style={styles.playButtonGradient}>
                        {status.isBuffering ? (
                          <Loader size={32} color="#FFFFFF" />
                        ) : status.playing ? (
                          <Pause size={32} color="#FFFFFF" fill="#FFFFFF" />
                        ) : (
                          <Play size={32} color="#FFFFFF" fill="#FFFFFF" />
                        )}
                      </LinearGradient>
                    </Pressable>
                    <Pressable style={styles.controlButton} onPress={handleNextTrack}>
                      <SkipForward size={28} color={Colors.dark.text} fill={Colors.dark.text} />
                    </Pressable>
                    <Pressable 
                      style={[styles.controlButton, repeatMode !== 'off' && styles.controlButtonActive]}
                      onPress={() => setRepeatMode(prev => prev === 'off' ? 'all' : prev === 'all' ? 'one' : 'off')}
                    >
                      <Repeat size={20} color={repeatMode !== 'off' ? '#1DB954' : Colors.dark.textSecondary} />
                      {repeatMode === 'one' && <View style={styles.repeatOneBadge}><Text style={styles.repeatOneText}>1</Text></View>}
                    </Pressable>
                  </View>

                  <View style={styles.streamingSection}>
                    <Text style={styles.streamingTitle}>Open full song in:</Text>
                    <View style={styles.streamingApps}>
                      {streamingApps.map((app) => (
                        <Pressable
                          key={app.id}
                          style={[styles.streamingButton, { borderColor: app.color }]}
                          onPress={() => openInStreamingApp(app.id)}
                        >
                          <Text style={styles.streamingIcon}>{app.icon}</Text>
                          <Text style={[styles.streamingName, { color: app.color }]}>{app.name}</Text>
                          <ExternalLink size={12} color={app.color} />
                        </Pressable>
                      ))}
                    </View>
                  </View>

                  <View style={styles.volumeContainer}>
                    <Volume2 size={18} color={Colors.dark.textTertiary} />
                    <View style={styles.volumeBar}>
                      <LinearGradient 
                        colors={['#1DB954', '#1ed760']} 
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.volumeFill, { width: '70%' }]} 
                      />
                    </View>
                    <ListMusic size={18} color={Colors.dark.textTertiary} />
                  </View>
                </>
              ) : (
                <View style={styles.playerEmpty}>
                  <LinearGradient colors={['#1DB954', '#1ed760']} style={styles.emptyIcon}>
                    <Music size={40} color="#FFFFFF" />
                  </LinearGradient>
                  <Text style={styles.playerEmptyTitle}>Select a Song</Text>
                  <Text style={styles.playerEmptyText}>
                    Tap any song to preview & open in your favorite streaming app
                  </Text>
                  <View style={styles.emptyStreamingHint}>
                    <Text style={styles.emptyStreamingText}>Supports:</Text>
                    <View style={styles.emptyStreamingLogos}>
                      <Text style={styles.streamingHintIcon}>🎵</Text>
                      <Text style={styles.streamingHintIcon}>🎶</Text>
                      <Text style={styles.streamingHintIcon}>🎧</Text>
                      <Text style={styles.streamingHintIcon}>🍎</Text>
                      <Text style={styles.streamingHintIcon}>▶️</Text>
                    </View>
                  </View>
                </View>
              )}
            </GlassCard>
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
    paddingBottom: 120,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  brandBadge: {
    width: 28,
    height: 28,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: '#1DB954',
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
  },
  userBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userBadgeText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
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
  languageFilters: {
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  languageChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    borderWidth: 2,
    borderColor: Colors.dark.border,
  },
  languageChipSelected: {
    backgroundColor: `${Colors.dark.primary}15`,
  },
  languageFlag: {
    fontSize: 20,
  },
  languageLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  playlistsScroll: {
    paddingBottom: SPACING.lg,
    gap: SPACING.md,
  },
  playlistItem: {
    width: 140,
    marginRight: SPACING.md,
  },
  playlistCoverContainer: {
    width: 140,
    height: 140,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.sm,
    position: 'relative',
  },
  playlistCover: {
    width: '100%',
    height: '100%',
  },
  playlistCoverOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  playlistLangBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  playlistLangText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
  },
  playlistPlayIcon: {
    position: 'absolute',
    bottom: SPACING.sm,
    right: SPACING.sm,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistName: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.semibold,
  },
  playlistDesc: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginTop: 2,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    marginBottom: SPACING.xxl,
  },
  moodCard: {
    width: '47%',
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: Colors.dark.border,
    alignItems: 'center',
  },
  moodIconContainer: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  moodLabel: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.semibold,
  },
  tracksContainer: {
    marginBottom: SPACING.xl,
    backgroundColor: Colors.dark.card,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  activeTrackRow: {
    backgroundColor: 'rgba(29, 185, 84, 0.1)',
  },
  trackNumber: {
    width: 24,
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  trackCover: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  trackInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  trackTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: FONT_WEIGHT.medium,
  },
  activeTrackTitle: {
    color: '#1DB954',
  },
  trackSubInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: 2,
  },
  trackArtist: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    flex: 1,
  },
  langBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  langBadgeText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
  },
  trackDuration: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginRight: SPACING.sm,
  },
  favoriteBtn: {
    padding: SPACING.xs,
  },
  playerSection: {
    marginTop: SPACING.md,
  },
  playerCard: {
    padding: SPACING.xl,
    backgroundColor: 'rgba(26, 26, 46, 0.9)',
  },
  playerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  albumArt: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.md,
  },
  trackDetails: {
    flex: 1,
    marginLeft: SPACING.lg,
  },
  nowPlayingLabel: {
    color: '#1DB954',
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  currentTrackTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.bold,
  },
  currentTrackArtist: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginTop: 2,
  },
  trackMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  metaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.dark.surfaceLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  metaText: {
    color: Colors.dark.textTertiary,
    fontSize: 10,
  },
  favoriteButton: {
    padding: SPACING.sm,
  },
  progressContainer: {
    marginBottom: SPACING.xl,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.dark.border,
    borderRadius: 3,
    overflow: 'visible',
    position: 'relative',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressKnob: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    marginLeft: -7,
  },
  progressTimes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  progressTime: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  controlButton: {
    padding: SPACING.sm,
    position: 'relative',
  },
  controlButtonActive: {
    opacity: 1,
  },
  repeatOneBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1DB954',
    alignItems: 'center',
    justifyContent: 'center',
  },
  repeatOneText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: FONT_WEIGHT.bold,
  },
  playButton: {
    overflow: 'hidden',
    borderRadius: 36,
  },
  playButtonGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  volumeBar: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.dark.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  volumeFill: {
    height: '100%',
  },
  playerEmpty: {
    alignItems: 'center',
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
  playerEmptyTitle: {
    color: Colors.dark.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: FONT_WEIGHT.semibold,
    marginBottom: SPACING.sm,
  },
  playerEmptyText: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    textAlign: 'center',
  },
  emptyStreamingHint: {
    marginTop: SPACING.lg,
    alignItems: 'center',
  },
  emptyStreamingText: {
    color: Colors.dark.textTertiary,
    fontSize: FONT_SIZE.xs,
    marginBottom: SPACING.sm,
  },
  emptyStreamingLogos: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  streamingHintIcon: {
    fontSize: 20,
  },
  streamingSection: {
    marginBottom: SPACING.xl,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.border,
  },
  streamingTitle: {
    color: Colors.dark.textSecondary,
    fontSize: FONT_SIZE.sm,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  streamingApps: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    justifyContent: 'center',
  },
  streamingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  streamingIcon: {
    fontSize: 14,
  },
  streamingName: {
    fontSize: FONT_SIZE.xs,
    fontWeight: FONT_WEIGHT.semibold,
  },
});
