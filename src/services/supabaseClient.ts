import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lqrnkjdxxrnwiyghlaed.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxxcm5ramR4eHJud2l5Z2hsYWVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNTQ3NjUsImV4cCI6MjA2NzYzMDc2NX0.QVASntY3WPs0Kx0aiVTA0y-0BUcfUoFTpcZKx6Ne-5g';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 