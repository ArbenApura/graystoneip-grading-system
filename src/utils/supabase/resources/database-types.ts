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
          avatar: string | null
          contact_number: string | null
          created_at: number
          email: string | null
          first_name: string | null
          full_name: string | null
          gender: string | null
          id: string
          is_archived: boolean | null
          last_name: string | null
          middle_name: string | null
          password: string | null
        }
        Insert: {
          account_type?: string | null
          avatar?: string | null
          contact_number?: string | null
          created_at: number
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id: string
          is_archived?: boolean | null
          last_name?: string | null
          middle_name?: string | null
          password?: string | null
        }
        Update: {
          account_type?: string | null
          avatar?: string | null
          contact_number?: string | null
          created_at?: number
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          gender?: string | null
          id?: string
          is_archived?: boolean | null
          last_name?: string | null
          middle_name?: string | null
          password?: string | null
        }
        Relationships: []
      }
      course_classes: {
        Row: {
          course_id: string | null
          created_at: number
          id: string
          instructor_id: string | null
          name: string | null
          school_year: string | null
          semester: string | null
        }
        Insert: {
          course_id?: string | null
          created_at: number
          id: string
          instructor_id?: string | null
          name?: string | null
          school_year?: string | null
          semester?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: number
          id?: string
          instructor_id?: string | null
          name?: string | null
          school_year?: string | null
          semester?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_classes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_classes_instructor_id_fkey"
            columns: ["instructor_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          }
        ]
      }
      course_students: {
        Row: {
          course_class_id: string | null
          created_at: number
          grade: string | null
          id: string
          is_grade_released: boolean | null
          school_year: string | null
          search_key: string | null
          semester: string | null
          student_record_id: string | null
        }
        Insert: {
          course_class_id?: string | null
          created_at: number
          grade?: string | null
          id: string
          is_grade_released?: boolean | null
          school_year?: string | null
          search_key?: string | null
          semester?: string | null
          student_record_id?: string | null
        }
        Update: {
          course_class_id?: string | null
          created_at?: number
          grade?: string | null
          id?: string
          is_grade_released?: boolean | null
          school_year?: string | null
          search_key?: string | null
          semester?: string | null
          student_record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_students_course_class_id_fkey"
            columns: ["course_class_id"]
            isOneToOne: false
            referencedRelation: "course_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "course_students_student_record_id_fkey"
            columns: ["student_record_id"]
            isOneToOne: false
            referencedRelation: "student_records"
            referencedColumns: ["id"]
          }
        ]
      }
      courses: {
        Row: {
          code: string | null
          created_at: number
          description: string | null
          hours: number | null
          id: string
          is_archived: boolean | null
          units: number | null
        }
        Insert: {
          code?: string | null
          created_at: number
          description?: string | null
          hours?: number | null
          id: string
          is_archived?: boolean | null
          units?: number | null
        }
        Update: {
          code?: string | null
          created_at?: number
          description?: string | null
          hours?: number | null
          id?: string
          is_archived?: boolean | null
          units?: number | null
        }
        Relationships: []
      }
      criteria_grades: {
        Row: {
          course_class_id: string | null
          course_student_id: string | null
          created_at: number
          criteria_item_id: string | null
          id: string
          score: number | null
        }
        Insert: {
          course_class_id?: string | null
          course_student_id?: string | null
          created_at: number
          criteria_item_id?: string | null
          id: string
          score?: number | null
        }
        Update: {
          course_class_id?: string | null
          course_student_id?: string | null
          created_at?: number
          criteria_item_id?: string | null
          id?: string
          score?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "criteria_grades_course_class_id_fkey"
            columns: ["course_class_id"]
            isOneToOne: false
            referencedRelation: "course_classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criteria_grades_course_student_id_fkey"
            columns: ["course_student_id"]
            isOneToOne: false
            referencedRelation: "course_students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "criteria_grades_criteria_item_id_fkey"
            columns: ["criteria_item_id"]
            isOneToOne: false
            referencedRelation: "criteria_items"
            referencedColumns: ["id"]
          }
        ]
      }
      criteria_items: {
        Row: {
          created_at: number
          criteria_id: string | null
          id: string
          name: string | null
          total: number | null
        }
        Insert: {
          created_at: number
          criteria_id?: string | null
          id: string
          name?: string | null
          total?: number | null
        }
        Update: {
          created_at?: number
          criteria_id?: string | null
          id?: string
          name?: string | null
          total?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "criteria_items_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "criterias"
            referencedColumns: ["id"]
          }
        ]
      }
      criterias: {
        Row: {
          course_class_id: string | null
          created_at: number
          id: string
          name: string | null
          percentage: number | null
          term: string | null
        }
        Insert: {
          course_class_id?: string | null
          created_at: number
          id: string
          name?: string | null
          percentage?: number | null
          term?: string | null
        }
        Update: {
          course_class_id?: string | null
          created_at?: number
          id?: string
          name?: string | null
          percentage?: number | null
          term?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "criterias_course_class_id_fkey"
            columns: ["course_class_id"]
            isOneToOne: false
            referencedRelation: "course_classes"
            referencedColumns: ["id"]
          }
        ]
      }
      programs: {
        Row: {
          code: string | null
          created_at: number
          description: string | null
          id: string
          is_archived: boolean | null
        }
        Insert: {
          code?: string | null
          created_at: number
          description?: string | null
          id: string
          is_archived?: boolean | null
        }
        Update: {
          code?: string | null
          created_at?: number
          description?: string | null
          id?: string
          is_archived?: boolean | null
        }
        Relationships: []
      }
      recovery_requests: {
        Row: {
          created_at: number
          id: string
          source: string | null
        }
        Insert: {
          created_at: number
          id: string
          source?: string | null
        }
        Update: {
          created_at?: number
          id?: string
          source?: string | null
        }
        Relationships: []
      }
      student_records: {
        Row: {
          account_id: string | null
          created_at: number
          id: string
          is_archived: boolean | null
          program_id: string | null
          school_year: string | null
          search_key: string | null
          section: string | null
          semester: string | null
          year: string | null
        }
        Insert: {
          account_id?: string | null
          created_at: number
          id: string
          is_archived?: boolean | null
          program_id?: string | null
          school_year?: string | null
          search_key?: string | null
          section?: string | null
          semester?: string | null
          year?: string | null
        }
        Update: {
          account_id?: string | null
          created_at?: number
          id?: string
          is_archived?: boolean | null
          program_id?: string | null
          school_year?: string | null
          search_key?: string | null
          section?: string | null
          semester?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_records_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_records_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          }
        ]
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
