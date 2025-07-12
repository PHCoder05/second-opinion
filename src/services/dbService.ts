import { supabase } from './supabaseClient';

export const dbService = {
  // Get all rows from a table
  getAll: async (table: string) => {
    const { data, error } = await supabase.from(table).select('*');
    return { data, error };
  },

  // Get a single row by primary key (assumes 'id' as PK)
  getById: async (table: string, id: number | string) => {
    const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
    return { data, error };
  },

  // Insert a new row
  insert: async (table: string, values: Record<string, any>) => {
    const { data, error } = await supabase.from(table).insert([values]).select();
    return { data, error };
  },

  // Update a row by primary key (assumes 'id' as PK)
  update: async (table: string, values: Record<string, any>) => {
    if (!values.id) throw new Error('Missing id for update');
    const { data, error } = await supabase.from(table).update(values).eq('id', values.id).select();
    return { data, error };
  },

  // Delete a row by primary key (assumes 'id' as PK)
  remove: async (table: string, id: number | string) => {
    const { data, error } = await supabase.from(table).delete().eq('id', id).select();
    return { data, error };
  },
}; 