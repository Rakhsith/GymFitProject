import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface UserProfile {
  height?: number;
  weight?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals?: string[];
  dietaryPreferences?: string[];
}

interface AuthState {
  user: User | null;
  profile: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AUTH_STORAGE_KEY = 'gymfit_auth';
const PROFILE_STORAGE_KEY = 'gymfit_profile';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile>({});

  const authQuery = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    },
  });

  const profileQuery = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    },
  });

  useEffect(() => {
    if (authQuery.data) {
      setUser(authQuery.data);
    }
  }, [authQuery.data]);

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name: email.split('@')[0],
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      return newUser;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const signupMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        createdAt: new Date().toISOString(),
      };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser));
      return newUser;
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    },
    onSuccess: () => {
      setUser(null);
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const newProfile = { ...profile, ...updates };
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(newProfile));
      return newProfile;
    },
    onSuccess: (data) => {
      setProfile(data);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const login = useCallback((email: string, password: string) => {
    return loginMutation.mutateAsync({ email, password });
  }, []);

  const signup = useCallback((email: string, password: string, name: string) => {
    return signupMutation.mutateAsync({ email, password, name });
  }, []);

  const logout = useCallback(() => {
    return logoutMutation.mutateAsync();
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    return updateProfileMutation.mutateAsync(updates);
  }, []);

  return {
    user,
    profile,
    isAuthenticated: !!user,
    isLoading: authQuery.isLoading || profileQuery.isLoading,
    login,
    signup,
    logout,
    updateProfile,
    loginPending: loginMutation.isPending,
    signupPending: signupMutation.isPending,
    logoutPending: logoutMutation.isPending,
    profileUpdatePending: updateProfileMutation.isPending,
  };
});
