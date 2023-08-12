export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          account_type: string | null
          address: string | null
          avatar: string | null
          birth_date: number | null
          contact_number: string | null
          created_at: number
          email: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          id: string
          last_name: string | null
          middle_name: string | null
          password: string | null
        }
        Insert: {
          account_type?: string | null
          address?: string | null
          avatar?: string | null
          birth_date?: number | null
          contact_number?: string | null
          created_at: number
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          last_name?: string | null
          middle_name?: string | null
          password?: string | null
        }
        Update: {
          account_type?: string | null
          address?: string | null
          avatar?: string | null
          birth_date?: number | null
          contact_number?: string | null
          created_at?: number
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          last_name?: string | null
          middle_name?: string | null
          password?: string | null
        }
        Relationships: []
      }
      courses: {
        Row: {
          code: string | null
          created_at: number
          description: string | null
          hours: number | null
          id: string
          units: number | null
        }
        Insert: {
          code?: string | null
          created_at: number
          description?: string | null
          hours?: number | null
          id: string
          units?: number | null
        }
        Update: {
          code?: string | null
          created_at?: number
          description?: string | null
          hours?: number | null
          id?: string
          units?: number | null
        }
        Relationships: []
      }
      programs: {
        Row: {
          code: string | null
          created_at: number
          description: string | null
          id: string
        }
        Insert: {
          code?: string | null
          created_at: number
          description?: string | null
          id: string
        }
        Update: {
          code?: string | null
          created_at?: number
          description?: string | null
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
