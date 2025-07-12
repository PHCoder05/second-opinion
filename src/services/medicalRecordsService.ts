import { supabase } from './supabaseClient';

export interface MedicalRecord {
  id: string;
  user_id: string;
  title: string;
  type: 'lab_result' | 'imaging' | 'prescription' | 'diagnosis' | 'treatment_plan' | 'consultation_note' | 'other';
  description?: string;
  date_created: string;
  date_of_record: string;
  provider_name?: string;
  facility_name?: string;
  document_url?: string;
  file_name?: string;
  file_size?: number;
  tags?: string[];
  is_shared?: boolean;
  shared_with_doctors?: string[];
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  status: 'active' | 'archived' | 'pending_review';
  metadata?: any;
  created_at: string;
  updated_at: string;
}

export interface SecondOpinionRequest {
  id: string;
  user_id: string;
  title: string;
  description: string;
  specialty_required: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  symptoms: string[];
  current_diagnosis?: string;
  current_treatment?: string;
  questions_for_doctor: string[];
  medical_records: string[]; // IDs of attached medical records
  preferred_doctor_id?: string;
  assigned_doctor_id?: string;
  status: 'draft' | 'submitted' | 'under_review' | 'responded' | 'completed' | 'cancelled';
  estimated_response_time?: string;
  doctor_response?: {
    doctor_id: string;
    response_text: string;
    recommendations: string[];
    follow_up_required: boolean;
    responded_at: string;
  };
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  sub_specialties: string[];
  experience_years: number;
  education: string[];
  certifications: string[];
  hospital_affiliations: string[];
  rating: number;
  reviews_count: number;
  consultation_fee: number;
  response_time_avg: string;
  languages: string[];
  profile_image?: string;
  bio: string;
  availability_status: 'available' | 'busy' | 'offline';
}

export interface ConsultationMessage {
  id: string;
  consultation_id: string;
  sender_id: string;
  sender_type: 'patient' | 'doctor';
  message: string;
  attachments?: string[];
  message_type: 'text' | 'voice' | 'image' | 'document';
  timestamp: string;
  is_read: boolean;
}

export type MedicalError = {
  message: string;
};

export const medicalRecordsService = {
  // Medical Records Management
  createMedicalRecord: async (userId: string, recordData: Partial<MedicalRecord>) => {
    try {
      const record = {
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active',
        urgency: 'medium',
        ...recordData,
      };

      const { data, error } = await supabase
        .from('medical_records')
        .insert([record])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  getUserMedicalRecords: async (userId: string, filters?: {
    type?: string;
    category?: string;
    status?: string;
    urgency?: string;
  }) => {
    try {
      let query = supabase
        .from('medical_records')
        .select('*')
        .eq('user_id', userId)
        .order('date_of_record', { ascending: false });

      if (filters?.type) {
        query = query.eq('type', filters.type);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      if (filters?.urgency) {
        query = query.eq('urgency', filters.urgency);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  updateMedicalRecord: async (recordId: string, updates: Partial<MedicalRecord>) => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('medical_records')
        .update(updateData)
        .eq('id', recordId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  deleteMedicalRecord: async (recordId: string) => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .delete()
        .eq('id', recordId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  // Second Opinion Requests
  createSecondOpinionRequest: async (userId: string, requestData: Partial<SecondOpinionRequest>) => {
    try {
      const request = {
        user_id: userId,
        status: 'draft',
        urgency: 'medium',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...requestData,
      };

      const { data, error } = await supabase
        .from('second_opinion_requests')
        .insert([request])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  getUserSecondOpinionRequests: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('second_opinion_requests')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  updateSecondOpinionRequest: async (requestId: string, updates: Partial<SecondOpinionRequest>) => {
    try {
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('second_opinion_requests')
        .update(updateData)
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  submitSecondOpinionRequest: async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('second_opinion_requests')
        .update({
          status: 'submitted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', requestId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  // Doctor Management
  searchDoctors: async (filters: {
    specialty?: string;
    sub_specialty?: string;
    rating_min?: number;
    max_fee?: number;
    language?: string;
    availability?: string;
  }) => {
    try {
      let query = supabase
        .from('doctors')
        .select('*')
        .order('rating', { ascending: false });

      if (filters.specialty) {
        query = query.eq('specialty', filters.specialty);
      }
      if (filters.sub_specialty) {
        query = query.contains('sub_specialties', [filters.sub_specialty]);
      }
      if (filters.rating_min) {
        query = query.gte('rating', filters.rating_min);
      }
      if (filters.max_fee) {
        query = query.lte('consultation_fee', filters.max_fee);
      }
      if (filters.language) {
        query = query.contains('languages', [filters.language]);
      }
      if (filters.availability) {
        query = query.eq('availability_status', filters.availability);
      }

      const { data, error } = await query;

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  getDoctorById: async (doctorId: string) => {
    try {
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', doctorId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  getRecommendedDoctors: async (specialty: string, symptoms: string[], limit = 5) => {
    try {
      // This would typically use AI/ML to match doctors based on specialty and symptoms
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('specialty', specialty)
        .eq('availability_status', 'available')
        .order('rating', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  // Consultation Messaging
  sendConsultationMessage: async (consultationId: string, senderId: string, senderType: 'patient' | 'doctor', message: string, messageType: 'text' | 'voice' | 'image' | 'document' = 'text') => {
    try {
      const messageData = {
        consultation_id: consultationId,
        sender_id: senderId,
        sender_type: senderType,
        message,
        message_type: messageType,
        timestamp: new Date().toISOString(),
        is_read: false,
      };

      const { data, error } = await supabase
        .from('consultation_messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  getConsultationMessages: async (consultationId: string) => {
    try {
      const { data, error } = await supabase
        .from('consultation_messages')
        .select('*')
        .eq('consultation_id', consultationId)
        .order('timestamp', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  markMessagesAsRead: async (consultationId: string, userId: string) => {
    try {
      const { data, error } = await supabase
        .from('consultation_messages')
        .update({ is_read: true })
        .eq('consultation_id', consultationId)
        .neq('sender_id', userId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  // Statistics and Analytics
  getUserMedicalStats: async (userId: string) => {
    try {
      // Get total medical records count
      const { count: totalRecords } = await supabase
        .from('medical_records')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get second opinion requests count
      const { count: totalRequests } = await supabase
        .from('second_opinion_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // Get completed consultations count
      const { count: completedConsultations } = await supabase
        .from('second_opinion_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed');

      // Get pending requests count
      const { count: pendingRequests } = await supabase
        .from('second_opinion_requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('status', ['submitted', 'under_review']);

      return {
        data: {
          totalMedicalRecords: totalRecords || 0,
          totalSecondOpinionRequests: totalRequests || 0,
          completedConsultations: completedConsultations || 0,
          pendingRequests: pendingRequests || 0,
        },
        error: null,
      };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  // File Upload (placeholder - would integrate with Supabase Storage)
  uploadMedicalDocument: async (userId: string, file: any, recordId: string) => {
    try {
      // This would handle actual file upload to Supabase Storage
      // For now, we'll simulate the process
      const fileName = `medical_documents/${userId}/${recordId}/${file.name}`;
      
      // Simulate upload
      const documentUrl = `https://storage.supabase.co/object/public/medical-documents/${fileName}`;
      
      // Update the medical record with the document URL
      const { data, error } = await medicalRecordsService.updateMedicalRecord(recordId, {
        document_url: documentUrl,
        file_name: file.name,
        file_size: file.size,
      });

      if (error) throw error;
      return { data: { url: documentUrl }, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  // Sharing and Collaboration
  shareMedicalRecord: async (recordId: string, doctorIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('medical_records')
        .update({
          is_shared: true,
          shared_with_doctors: doctorIds,
          updated_at: new Date().toISOString(),
        })
        .eq('id', recordId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: error as MedicalError };
    }
  },

  // Medical Record Categories and Templates
  getMedicalCategories: () => {
    return [
      'Cardiology',
      'Neurology',
      'Oncology',
      'Orthopedics',
      'Dermatology',
      'Gastroenterology',
      'Endocrinology',
      'Pulmonology',
      'Psychiatry',
      'Radiology',
      'Pathology',
      'Emergency Medicine',
      'General Medicine',
      'Surgery',
      'Pediatrics',
      'Gynecology',
      'Urology',
      'Ophthalmology',
      'ENT',
      'Other'
    ];
  },

  getRecordTypes: () => {
    return [
      { value: 'lab_result', label: 'Lab Results' },
      { value: 'imaging', label: 'Medical Imaging' },
      { value: 'prescription', label: 'Prescription' },
      { value: 'diagnosis', label: 'Diagnosis' },
      { value: 'treatment_plan', label: 'Treatment Plan' },
      { value: 'consultation_note', label: 'Consultation Notes' },
      { value: 'other', label: 'Other' },
    ];
  },
}; 