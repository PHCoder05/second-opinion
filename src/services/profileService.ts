import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  phone_number?: string;
  phone_verified?: boolean;
  email_verified?: boolean;
  profile_picture?: string;
  profile_picture_url?: string;
  profile_picture_updated_at?: string;
  health_goal?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  medical_conditions?: string[];
  medications?: string[];
  allergies?: string[];
  insurance_provider?: string;
  preferred_language?: string;
  address?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  gender?: string;
  blood_type?: string;
  height?: string;
  weight?: string;
  occupation?: string;
  created_at: string;
  updated_at: string;
}

export interface UserActivity {
  id: string;
  user_id: string;
  activity_type: 'login' | 'logout' | 'profile_update' | 'health_assessment' | 'appointment_scheduled' | 'message_sent';
  activity_data?: any;
  timestamp: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  login_time: string;
  logout_time?: string;
  session_duration?: number; // in minutes
  device_info?: string;
}

export type ProfileError = {
  message: string;
};

export const profileService = {
  // Create user profile after successful registration
  createUserProfile: async (userId: string, email: string, profileData?: Partial<UserProfile>) => {
    try {
      const profile = {
        user_id: userId,
        email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...profileData,
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profile])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Get user profile
  getUserProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Update user profile
  updateUserProfile: async (userId: string, updates: Partial<UserProfile>) => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      // Log the activity
      await profileService.logActivity(userId, 'profile_update', updates);

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Log user activity
  logActivity: async (userId: string, activityType: UserActivity['activity_type'], activityData?: any) => {
    try {
      const activity = {
        user_id: userId,
        activity_type: activityType,
        activity_data: activityData,
        timestamp: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('user_activities')
        .insert([activity])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Get user activities with pagination
  getUserActivities: async (userId: string, limit = 50, offset = 0) => {
    try {
      const { data, error } = await supabase
        .from('user_activities')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Start a new session (login)
  startSession: async (userId: string, deviceInfo?: string) => {
    try {
      const session = {
        user_id: userId,
        login_time: new Date().toISOString(),
        device_info: deviceInfo,
      };

      const { data, error } = await supabase
        .from('user_sessions')
        .insert([session])
        .select()
        .single();

      if (error) throw error;

      // Store session ID locally for logout tracking
      await AsyncStorage.setItem('current_session_id', data.id);
      
      // Log login activity
      await profileService.logActivity(userId, 'login', { device_info: deviceInfo });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // End session (logout)
  endSession: async (userId: string) => {
    try {
      const sessionId = await AsyncStorage.getItem('current_session_id');
      if (!sessionId) {
        return { data: null, error: { message: 'No active session found' } };
      }

      // Get session start time to calculate duration
      const { data: sessionData, error: sessionError } = await supabase
        .from('user_sessions')
        .select('login_time')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      const logoutTime = new Date();
      const loginTime = new Date(sessionData.login_time);
      const durationMinutes = Math.round((logoutTime.getTime() - loginTime.getTime()) / (1000 * 60));

      const { data, error } = await supabase
        .from('user_sessions')
        .update({
          logout_time: logoutTime.toISOString(),
          session_duration: durationMinutes,
        })
        .eq('id', sessionId)
        .select()
        .single();

      if (error) throw error;

      // Clear local session
      await AsyncStorage.removeItem('current_session_id');
      
      // Log logout activity
      await profileService.logActivity(userId, 'logout', { session_duration: durationMinutes });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Get user session history
  getUserSessions: async (userId: string, limit = 10) => {
    try {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('login_time', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Get user statistics
  getUserStats: async (userId: string) => {
    try {
      // Get total sessions
      const { count: totalSessions } = await supabase
        .from('user_sessions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get total activities
      const { count: totalActivities } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get average session duration
      const { data: sessionData } = await supabase
        .from('user_sessions')
        .select('session_duration')
        .eq('user_id', userId)
        .not('session_duration', 'is', null);

      const avgSessionDuration = sessionData?.length 
        ? sessionData.reduce((sum, session) => sum + (session.session_duration || 0), 0) / sessionData.length 
        : 0;

      // Get last login
      const { data: lastSession } = await supabase
        .from('user_sessions')
        .select('login_time')
        .eq('user_id', userId)
        .order('login_time', { ascending: false })
        .limit(1)
        .single();

      return {
        data: {
          totalSessions: totalSessions || 0,
          totalActivities: totalActivities || 0,
          averageSessionDuration: Math.round(avgSessionDuration),
          lastLogin: lastSession?.login_time,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Check if user has an active session
  hasActiveSession: async () => {
    try {
      const sessionId = await AsyncStorage.getItem('current_session_id');
      return !!sessionId;
    } catch (error) {
      return false;
    }
  },

  // Upload profile picture
  uploadProfilePicture: async (userId: string, imageUri: string, fileName: string) => {
    try {
      // This would typically involve uploading to Supabase Storage
      // For demo purposes, we'll store the URI and simulate upload
      const profilePictureUrl = `https://storage.supabase.co/profile-pictures/${userId}/${fileName}`;
      
      const { data, error } = await profileService.updateUserProfile(userId, {
        profile_picture: imageUri,
        profile_picture_url: profilePictureUrl,
        profile_picture_updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Cache the image locally
      await AsyncStorage.setItem(`profile_picture_${userId}`, imageUri);
      
      // Log the activity
      await profileService.logActivity(userId, 'profile_update', { 
        action: 'profile_picture_updated',
        file_name: fileName 
      });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Get cached profile picture
  getCachedProfilePicture: async (userId: string) => {
    try {
      const cachedImage = await AsyncStorage.getItem(`profile_picture_${userId}`);
      return cachedImage;
    } catch (error) {
      return null;
    }
  },

  // Remove profile picture
  removeProfilePicture: async (userId: string) => {
    try {
      const { data, error } = await profileService.updateUserProfile(userId, {
        profile_picture: undefined,
        profile_picture_url: undefined,
        profile_picture_updated_at: new Date().toISOString(),
      });

      if (error) throw error;

      // Remove cached image
      await AsyncStorage.removeItem(`profile_picture_${userId}`);
      
      // Log the activity
      await profileService.logActivity(userId, 'profile_update', { 
        action: 'profile_picture_removed' 
      });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Mark email as verified
  markEmailVerified: async (userId: string) => {
    try {
      const { data, error } = await profileService.updateUserProfile(userId, {
        email_verified: true,
      });

      if (error) throw error;

      // Log the activity
      await profileService.logActivity(userId, 'profile_update', { 
        action: 'email_verified' 
      });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Mark phone as verified
  markPhoneVerified: async (userId: string) => {
    try {
      const { data, error } = await profileService.updateUserProfile(userId, {
        phone_verified: true,
      });

      if (error) throw error;

      // Log the activity
      await profileService.logActivity(userId, 'profile_update', { 
        action: 'phone_verified' 
      });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Update phone number and reset verification
  updatePhoneNumber: async (userId: string, phoneNumber: string) => {
    try {
      const { data, error } = await profileService.updateUserProfile(userId, {
        phone_number: phoneNumber,
        phone_verified: false, // Reset verification when phone changes
      });

      if (error) throw error;

      // Log the activity
      await profileService.logActivity(userId, 'profile_update', { 
        action: 'phone_number_updated',
        phone_number: phoneNumber 
      });

      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Get comprehensive profile data with verification status
  getProfileWithVerificationStatus: async (userId: string) => {
    try {
      const { data: profile, error } = await profileService.getUserProfile(userId);
      
      if (error) throw error;

      const verificationStatus = {
        emailVerified: profile?.email_verified || false,
        phoneVerified: profile?.phone_verified || false,
        profileComplete: !!(profile?.first_name && profile?.last_name && profile?.phone_number),
        hasProfilePicture: !!(profile?.profile_picture || profile?.profile_picture_url),
      };

      return { 
        data: { 
          profile, 
          verificationStatus 
        }, 
        error: null 
      };
    } catch (error) {
      return { data: null, error: error as ProfileError };
    }
  },

  // Store OTP verification token temporarily
  storeVerificationToken: async (userId: string, type: 'email' | 'phone', token: string) => {
    try {
      const key = `verification_${type}_${userId}`;
      const data = {
        token,
        timestamp: new Date().toISOString(),
        expiry: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      };
      
      await AsyncStorage.setItem(key, JSON.stringify(data));
      return { success: true, error: null };
    } catch (error) {
      return { success: false, error: error as ProfileError };
    }
  },

  // Verify OTP token
  verifyToken: async (userId: string, type: 'email' | 'phone', inputToken: string) => {
    try {
      const key = `verification_${type}_${userId}`;
      const storedData = await AsyncStorage.getItem(key);
      
      if (!storedData) {
        return { valid: false, error: { message: 'No verification token found' } };
      }

      const { token, expiry } = JSON.parse(storedData);
      const now = new Date();
      const expiryDate = new Date(expiry);

      if (now > expiryDate) {
        await AsyncStorage.removeItem(key);
        return { valid: false, error: { message: 'Verification token expired' } };
      }

      if (token !== inputToken) {
        return { valid: false, error: { message: 'Invalid verification token' } };
      }

      // Token is valid, mark as verified and clean up
      await AsyncStorage.removeItem(key);
      
      if (type === 'email') {
        await profileService.markEmailVerified(userId);
      } else {
        await profileService.markPhoneVerified(userId);
      }

      return { valid: true, error: null };
    } catch (error) {
      return { valid: false, error: error as ProfileError };
    }
  },

  // Generate mock OTP (in production, this would be handled by backend)
  generateMockOTP: () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },
}; 