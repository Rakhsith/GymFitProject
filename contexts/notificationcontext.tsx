import { useState, useCallback, useEffect, useRef } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export type NotificationType = 'motivation' | 'reminder' | 'achievement' | 'tip' | 'greeting' | 'nudge' | 'celebration';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  emoji?: string;
  duration?: number;
  timestamp: number;
}

const friendlyMessages = {
  greetings: {
    morning: [
      { title: "Rise & Shine! ☀️", message: "Your muscles are waiting for their morning workout!" },
      { title: "Good Morning, Champ! 💪", message: "Today's gains start with you getting up. Let's crush it!" },
      { title: "Morning Glory! 🌅", message: "The early bird gets the gains. Ready to be that bird?" },
      { title: "Hey Early Bird! 🐦", message: "Your body's been resting all night. Time to wake it up!" },
    ],
    afternoon: [
      { title: "Afternoon Check-in! 🌤️", message: "How's your day going? Don't forget to stay hydrated!" },
      { title: "Midday Motivation! 💫", message: "You're halfway through the day. Keep that energy up!" },
      { title: "Quick Reminder! 🎯", message: "Have you moved your body today? Even a walk counts!" },
    ],
    evening: [
      { title: "Evening Vibes! 🌙", message: "Perfect time for a relaxing stretch or light workout!" },
      { title: "Wind Down Time! 🧘", message: "How about some relaxation exercises before bed?" },
      { title: "Great Day! ⭐", message: "You made it through another day. Proud of you!" },
    ],
  },
  motivation: [
    { title: "You've Got This! 💪", message: "Every rep counts. Every step matters. Keep going!" },
    { title: "Friendly Nudge! 👋", message: "Remember why you started. Your future self will thank you!" },
    { title: "Quick Thought! 💭", message: "Progress isn't always visible, but it's always happening!" },
    { title: "Hey Champion! 🏆", message: "Champions aren't made in gyms. They're made from something deep inside!" },
    { title: "Just Checking In! 🤗", message: "Your consistency is your superpower. Don't forget that!" },
    { title: "Believe In You! ✨", message: "The only bad workout is the one that didn't happen!" },
    { title: "Stay Strong! 🔥", message: "Difficult roads often lead to beautiful destinations!" },
    { title: "Keep Pushing! 🚀", message: "You're one workout away from a good mood!" },
  ],
  workoutReminders: [
    { title: "Workout Time? 🏋️", message: "Your muscles are missing you! How about a quick session?" },
    { title: "Let's Move! 🏃", message: "Been sitting for a while? Time to shake things up!" },
    { title: "Body Check! 💪", message: "Your body can do it. It's your mind you need to convince!" },
    { title: "Gym Calling! 📞", message: "Hello? Yes, this is your workout calling. Pick up!" },
  ],
  dietReminders: [
    { title: "Hungry? 🍎", message: "Choose fuel that makes your body happy, not just your taste buds!" },
    { title: "Hydration Check! 💧", message: "When was your last glass of water? Your body is asking!" },
    { title: "Meal Prep Time! 🥗", message: "Good nutrition is self-respect. What's on your plate?" },
    { title: "Snack Smart! 🥜", message: "Craving something? Grab a healthy snack to keep you going!" },
  ],
  achievements: [
    { title: "Woohoo! 🎉", message: "Look at you go! You're absolutely crushing it!" },
    { title: "Amazing Work! 🌟", message: "You did something great today. Give yourself a pat on the back!" },
    { title: "Level Up! 📈", message: "Progress unlocked! Keep this momentum going!" },
    { title: "Incredible! 🏅", message: "You're on fire! Nothing can stop you now!" },
  ],
  tips: [
    { title: "Pro Tip! 💡", message: "Rest days are just as important as workout days. Honor them!" },
    { title: "Did You Know? 🧠", message: "Muscle recovery happens during sleep. Aim for 7-9 hours!" },
    { title: "Quick Tip! ⚡", message: "Stretching before bed can improve sleep quality!" },
    { title: "Fitness Fact! 📚", message: "Even 10 minutes of movement can boost your mood significantly!" },
    { title: "Health Hack! 🎯", message: "Cold water can help speed up your metabolism!" },
  ],
  relaxation: [
    { title: "Breathe! 🧘", message: "Take a deep breath. Hold. Release. Feel better?" },
    { title: "Stress Check! 🌿", message: "Feeling tense? A 5-minute meditation can work wonders!" },
    { title: "Self-Care Alert! 💆", message: "You deserve some relaxation. How about a quick break?" },
  ],
  music: [
    { title: "Tune In! 🎵", message: "The right music can boost your workout by 15%!" },
    { title: "Beat Drop! 🎧", message: "High-energy music = High-energy workout. Find your beat!" },
  ],
  travel: [
    { title: "Adventure Awaits! 🗺️", message: "Walking to your destination? Great choice for your health!" },
    { title: "On The Move! 🚶", message: "Every step is a step towards better health!" },
  ],
  booking: [
    { title: "Game On! ⚽", message: "Sports with friends = Workout + Fun. Win-win!" },
    { title: "Court's Calling! 🏸", message: "Haven't played in a while? Time to book a session!" },
  ],
  inactivity: [
    { title: "Miss You! 😢", message: "Haven't seen you work out in a while. Everything okay?" },
    { title: "Where'd You Go? 🔍", message: "Your fitness journey misses you. Come back anytime!" },
    { title: "Still Here! 🤝", message: "No judgment here. Whenever you're ready, we're ready!" },
  ],
};

const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const getTimeOfDay = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

export const [NotificationProvider, useNotifications] = createContextHook(() => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [hasShownGreeting, setHasShownGreeting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const showNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      duration: notification.duration || 4000,
    };

    setCurrentNotification(newNotification);
    setNotifications(prev => [newNotification, ...prev].slice(0, 50));
    triggerHaptic();

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setCurrentNotification(null);
    }, newNotification.duration);

    console.log('[Notification] Shown:', newNotification.title);
  }, [triggerHaptic]);

  const dismissNotification = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setCurrentNotification(null);
  }, []);

  const showGreeting = useCallback(() => {
    const timeOfDay = getTimeOfDay();
    const greetings = friendlyMessages.greetings[timeOfDay];
    const greeting = getRandomItem(greetings);
    showNotification({
      type: 'greeting',
      title: greeting.title,
      message: greeting.message,
      duration: 5000,
    });
  }, [showNotification]);

  const showMotivation = useCallback(() => {
    const motivation = getRandomItem(friendlyMessages.motivation);
    showNotification({
      type: 'motivation',
      title: motivation.title,
      message: motivation.message,
    });
  }, [showNotification]);

  const showWorkoutReminder = useCallback(() => {
    const reminder = getRandomItem(friendlyMessages.workoutReminders);
    showNotification({
      type: 'reminder',
      title: reminder.title,
      message: reminder.message,
    });
  }, [showNotification]);

  const showDietReminder = useCallback(() => {
    const reminder = getRandomItem(friendlyMessages.dietReminders);
    showNotification({
      type: 'reminder',
      title: reminder.title,
      message: reminder.message,
    });
  }, [showNotification]);

  const showAchievement = useCallback((customMessage?: string) => {
    const achievement = getRandomItem(friendlyMessages.achievements);
    showNotification({
      type: 'achievement',
      title: achievement.title,
      message: customMessage || achievement.message,
      duration: 5000,
    });
  }, [showNotification]);

  const showTip = useCallback(() => {
    const tip = getRandomItem(friendlyMessages.tips);
    showNotification({
      type: 'tip',
      title: tip.title,
      message: tip.message,
    });
  }, [showNotification]);

  const showRelaxationReminder = useCallback(() => {
    const reminder = getRandomItem(friendlyMessages.relaxation);
    showNotification({
      type: 'nudge',
      title: reminder.title,
      message: reminder.message,
    });
  }, [showNotification]);

  const showMusicSuggestion = useCallback(() => {
    const suggestion = getRandomItem(friendlyMessages.music);
    showNotification({
      type: 'tip',
      title: suggestion.title,
      message: suggestion.message,
    });
  }, [showNotification]);

  const showTravelTip = useCallback(() => {
    const tip = getRandomItem(friendlyMessages.travel);
    showNotification({
      type: 'tip',
      title: tip.title,
      message: tip.message,
    });
  }, [showNotification]);

  const showBookingReminder = useCallback(() => {
    const reminder = getRandomItem(friendlyMessages.booking);
    showNotification({
      type: 'nudge',
      title: reminder.title,
      message: reminder.message,
    });
  }, [showNotification]);

  const showCustomNotification = useCallback((title: string, message: string, type: NotificationType = 'motivation') => {
    showNotification({
      type,
      title,
      message,
    });
  }, [showNotification]);

  useEffect(() => {
    const initGreeting = async () => {
      try {
        const lastGreeting = await AsyncStorage.getItem('lastGreetingDate');
        const today = new Date().toDateString();
        
        if (lastGreeting !== today && !hasShownGreeting) {
          setTimeout(() => {
            showGreeting();
            setHasShownGreeting(true);
            AsyncStorage.setItem('lastGreetingDate', today);
          }, 2000);
        }
      } catch (error) {
        console.log('[Notification] Error checking greeting:', error);
      }
    };

    initGreeting();
  }, [showGreeting, hasShownGreeting]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const shouldShow = Math.random() > 0.6;
      if (shouldShow && !currentNotification) {
        const notificationTypes = ['motivation', 'tip', 'workout', 'diet'];
        const type = getRandomItem(notificationTypes);
        
        switch (type) {
          case 'motivation':
            showMotivation();
            break;
          case 'tip':
            showTip();
            break;
          case 'workout':
            showWorkoutReminder();
            break;
          case 'diet':
            showDietReminder();
            break;
        }
      }
    }, 120000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentNotification, showMotivation, showTip, showWorkoutReminder, showDietReminder]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    currentNotification,
    notifications,
    showNotification,
    dismissNotification,
    showGreeting,
    showMotivation,
    showWorkoutReminder,
    showDietReminder,
    showAchievement,
    showTip,
    showRelaxationReminder,
    showMusicSuggestion,
    showTravelTip,
    showBookingReminder,
    showCustomNotification,
  };
});
