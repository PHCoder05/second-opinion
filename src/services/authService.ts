import { supabase } from './supabaseClient';
import { Platform } from 'react-native';

let storage;
if (Platform.OS === 'web') {
  storage = {
    getItem: (key) => Promise.resolve(window.localStorage.getItem(key)),
    setItem: (key, value) => Promise.resolve(window.localStorage.setItem(key, value)),
    removeItem: (key) => Promise.resolve(window.localStorage.removeItem(key)),
    multiRemove: (keys) => Promise.resolve(keys.forEach((key) => window.localStorage.removeItem(key))),
    getAllKeys: () => Promise.resolve(Object.keys(window.localStorage)),
  };
} else {
  storage = require('@react-native-async-storage/async-storage').default;
}

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
        await storage.setItem('auth_user_id', data.user.id);
        await storage.setItem('user_email', email);
        await storage.setItem('login_timestamp', new Date().toISOString());
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
        await storage.setItem('auth_user_id', data.user.id);
        await storage.setItem('user_email', email);
        await storage.setItem('login_timestamp', new Date().toISOString());
        await storage.setItem('is_logged_in', 'true');
        await storage.setItem('auto_login', 'true');
      }
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as AuthError };
    }
  },

  // Enhanced Sign out with session cleanup
  signOut: async () => {
    try {
      // First, sign out from Supabase
      const { error: supabaseError } = await supabase.auth.signOut();
      if (supabaseError) throw supabaseError;
      
      // Clear all stored auth state
      await storage.multiRemove([
        'auth_user_id',
        'user_email', 
        'login_timestamp',
        'is_logged_in',
        'auto_login',
        'user_profile_data',
        'cached_profile_picture',
        'onboarding_completed' // Also clear onboarding state
      ]);
      
      // Verify session is cleared
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.warn('Session still exists after signOut, attempting manual cleanup');
        // Force clear any remaining session data
        await supabase.auth.signOut({ scope: 'global' });
      }
      
      return { error: null };
    } catch (error) {
      console.error('SignOut error:', error);
      return { error: error as AuthError };
    }
  },

  // Check if user should remain logged in
  isLoggedIn: async () => {
    try {
      const isLoggedIn = await storage.getItem('is_logged_in');
      const autoLogin = await storage.getItem('auto_login');
      const { data: { session } } = await supabase.auth.getSession();
      
      return isLoggedIn === 'true' && autoLogin === 'true' && session !== null;
    } catch (error) {
      return false;
    }
  },

  // Get stored user data for offline access
  getStoredUserData: async () => {
    try {
      const userId = await storage.getItem('auth_user_id');
      const email = await storage.getItem('user_email');
      const loginTimestamp = await storage.getItem('login_timestamp');
      
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
      const { session, error } = await authService.getSession();
      
      if (isLoggedIn && session && !error) {
        return { isAuthenticated: true, session };
      } else {
        // Clear any stale data
        await storage.multiRemove([
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

  // Force refresh authentication state
  refreshAuthState: async () => {
    try {
      console.log('Refreshing auth state...');
      
      // Clear any cached auth data
      // await AsyncStorage.removeItem('is_logged_in'); // This line was removed as per the new_code
      // await AsyncStorage.removeItem('auth_user_id'); // This line was removed as per the new_code
      
      // Get fresh session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session refresh error:', error);
        return { isAuthenticated: false, user: null };
      }

      if (session?.user) {
        console.log('Auth state refreshed - User authenticated:', session.user.email);
        // await AsyncStorage.setItem('auth_user_id', session.user.id); // This line was removed as per the new_code
        // await AsyncStorage.setItem('user_email', session.user.email || ''); // This line was removed as per the new_code
        // await AsyncStorage.setItem('is_logged_in', 'true'); // This line was removed as per the new_code
        return { isAuthenticated: true, user: session.user };
      }

      console.log('Auth state refreshed - No active session');
      return { isAuthenticated: false, user: null };
    } catch (error) {
      console.error('Auth state refresh error:', error);
      return { isAuthenticated: false, user: null };
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
        await storage.setItem('user_email', newEmail);
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
      await storage.setItem('auto_login', 'false');
      return await authService.signOut();
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  // Enable/disable auto-login
  setAutoLogin: async (enabled: boolean) => {
    try {
      await storage.setItem('auto_login', enabled ? 'true' : 'false');
      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  },

  // Comprehensive logout utility
  logout: async () => {
    try {
      console.log('Starting comprehensive logout...');
      
      // 1. Sign out from Supabase with global scope
      const { error: supabaseError } = await supabase.auth.signOut({ scope: 'global' });
      if (supabaseError) {
        console.error('Supabase signOut error:', supabaseError);
        // Continue with local cleanup even if Supabase fails
      }
      
      // 2. Clear all storage data
      const keysToRemove = [
        'auth_user_id',
        'user_email', 
        'login_timestamp',
        'is_logged_in',
        'auto_login',
        'user_profile_data',
        'cached_profile_picture',
        'onboarding_completed'
      ];
      
      // Force clear onboarding state
      await storage.removeItem('onboarding_completed');
      console.log('Onboarding state cleared');
      
      await storage.multiRemove(keysToRemove);
      console.log('Storage cleared');
      
      // 3. Additional cleanup - clear all auth-related keys
      const allKeys = await storage.getAllKeys();
      const authKeys = allKeys.filter(key => 
        key.includes('auth') || 
        key.includes('user') || 
        key.includes('login') || 
        key.includes('session') ||
        key.includes('onboarding')
      );
      
      if (authKeys.length > 0) {
        await storage.multiRemove(authKeys);
        console.log('Additional auth keys cleared:', authKeys);
      }
      
      // 4. Verify session is completely cleared
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.warn('Session still exists after global signOut');
        // Try one more time with different approach
        await supabase.auth.signOut();
      }
      
      console.log('Logout completed successfully');
      return { error: null };
    } catch (error) {
      console.error('Comprehensive logout error:', error);
      return { error: error as AuthError };
    }
  },

  // Logout and redirect utility
  logoutAndRedirect: async (router: any) => {
    try {
      console.log('Starting logout and redirect...');
      
      // Perform comprehensive logout
      const { error } = await authService.logout();
      if (error) {
        throw error;
      }
      
      // Small delay to ensure logout completes
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Force navigation to welcome screen directly
      console.log('Redirecting to welcome screen...');
      try {
        router.replace('/welcome');
        console.log('Navigation to welcome completed');
      } catch (navError) {
        console.error('Navigation error:', navError);
        // If welcome navigation fails, try root
        try {
          router.replace('/');
          console.log('Fallback navigation to root completed');
        } catch (rootError) {
          console.error('Root navigation error:', rootError);
        }
      }
      
      return { error: null };
    } catch (error) {
      console.error('Logout and redirect error:', error);
      return { error: error as AuthError };
    }
  }
}; 