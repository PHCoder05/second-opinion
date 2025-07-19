import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const SUPABASE_URL = 'https://lqrnkjdxxrnwiyghlaed.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxcm5ramR4eHJud2l5Z2hsYWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNTQ3NjUsImV4cCI6MjA2NzYzMDc2NX0.QVASntY3WPs0Kx0aiVTA0y-0BUcfUoFTpcZKx6Ne-5g';

const getSupabaseClient = () => {
  // Check if we're running in a browser environment
  const isClient = typeof window !== 'undefined';

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: isClient ? AsyncStorage : undefined,
      autoRefreshToken: isClient,
      persistSession: isClient,
      detectSessionInUrl: isClient,
    },
  });
};

export const supabase = getSupabaseClient(); 