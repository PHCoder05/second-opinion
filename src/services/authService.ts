import { supabase } from './supabaseClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AuthError = {
  message: string;
};

export interface AuthUser {
  id: string;
  email: string;
  email_confirmed_at?: string;
  phone?: string;
  phone_confirmed_at?: string;
  user_metadata?: any;
}

export const authService = {
  // Enhanced Sign up with email and password
  signUp: async (email: string, password: string, additionalData?: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: additionalData || {},
        }
      });

      if (error) throw error;
      
      // Store auth state for persistence
      if (data.user) {
        await AsyncStorage.setItem('auth_user_id', data.user.id);
        await AsyncStorage.setItem('user_email', email);
        await AsyncStorage.setItem('login_timestamp', new Date().toISOString());
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  // Enhanced Sign in with email and password
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
      // Store auth state for persistence
      if (data.user) {
        await AsyncStorage.setItem('auth_user_id', data.user.id);
        await AsyncStorage.setItem('user_email', email);
        await AsyncStorage.setItem('login_timestamp', new Date().toISOString());
        await AsyncStorage.setItem('is_logged_in', 'true');
        await AsyncStorage.setItem('auto_login', 'true');
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  // Enhanced Sign out with session cleanup
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear all stored auth state
      await AsyncStorage.multiRemove([
        'auth_user_id',
        'user_email', 
        'login_timestamp',
        'is_logged_in',
        'auto_login',
        'user_profile_data',
        'cached_profile_picture'
      ]);
      
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  // Check if user should remain logged in
  isLoggedIn: async () => {
    try {
      const isLoggedIn = await AsyncStorage.getItem('is_logged_in');
      const autoLogin = await AsyncStorage.getItem('auto_login');
      const { data: { session } } = await supabase.auth.getSession();
      
      return isLoggedIn === 'true' && autoLogin === 'true' && session !== null;
    } catch (error) {
      return false;
    }
  },

  // Get stored user data for offline access
  getStoredUserData: async () => {
    try {
      const userId = await AsyncStorage.getItem('auth_user_id');
      const email = await AsyncStorage.getItem('user_email');
      const loginTimestamp = await AsyncStorage.getItem('login_timestamp');
      
      return {
        userId,
        email,
        loginTimestamp,
      };
    } catch (error) {
      return null;
    }
  },

  // Initialize auth state (call on app start)
  initializeAuth: async () => {
    try {
      const isLoggedIn = await authService.isLoggedIn();
      const { session } = await authService.getSession();
      
      if (isLoggedIn && session) {
        return { isAuthenticated: true, session };
      } else {
        // Clear any stale data
        await AsyncStorage.multiRemove([
          'auth_user_id',
          'user_email',
          'login_timestamp', 
          'is_logged_in',
          'auto_login'
        ]);
        return { isAuthenticated: false, session: null };
      }
    } catch (error) {
      return { isAuthenticated: false, session: null };
    }
  },

  // Reset password
  resetPassword: async (email: string) => {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'your-app://reset-password'
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  // Change password
  changePassword: async (newPassword: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  // Update user email
  updateEmail: async (newEmail: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail
      });
      
      if (error) throw error;
      
      if (data.user) {
        await AsyncStorage.setItem('user_email', newEmail);
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  // Update user phone
  updatePhone: async (phone: string) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        phone: phone
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  // Send email verification
  sendEmailVerification: async () => {
    try {
      const { user } = await authService.getCurrentUser();
      if (!user?.email) {
        throw new Error('No email found');
      }

      const { data, error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  // Send phone verification
  sendPhoneVerification: async (phone: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  // Verify phone with OTP
  verifyPhone: async (phone: string, token: string) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: token,
        type: 'sms'
      });
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  // Get current session
  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      return { session: null, error: error as AuthError };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error as AuthError };
    }
  },

  // Manual logout (disable auto-login)
  manualLogout: async () => {
    try {
      await AsyncStorage.setItem('auto_login', 'false');
      return await authService.signOut();
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  // Enable/disable auto-login
  setAutoLogin: async (enabled: boolean) => {
    try {
      await AsyncStorage.setItem('auto_login', enabled ? 'true' : 'false');
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  }
}; 