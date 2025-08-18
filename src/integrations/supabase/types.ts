export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      assessments: {
        Row: {
          completed_date: string | null
          created_at: string
          description: string | null
          employee_id: string
          evaluator_id: string
          feedback: string | null
          id: string
          scheduled_date: string | null
          score: number | null
          status: string
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          completed_date?: string | null
          created_at?: string
          description?: string | null
          employee_id: string
          evaluator_id: string
          feedback?: string | null
          id?: string
          scheduled_date?: string | null
          score?: number | null
          status?: string
          title: string
          type?: string
          updated_at?: string
        }
        Update: {
          completed_date?: string | null
          created_at?: string
          description?: string | null
          employee_id?: string
          evaluator_id?: string
          feedback?: string | null
          id?: string
          scheduled_date?: string | null
          score?: number | null
          status?: string
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department_id: string | null
          email: string
          hire_date: string | null
          id: string
          manager_id: string | null
          name: string
          performance: number | null
          profile_id: string | null
          role: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          email: string
          hire_date?: string | null
          id?: string
          manager_id?: string | null
          name: string
          performance?: number | null
          profile_id?: string | null
          role: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          department_id?: string | null
          email?: string
          hire_date?: string | null
          id?: string
          manager_id?: string | null
          name?: string
          performance?: number | null
          profile_id?: string | null
          role?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback: {
        Row: {
          category: string | null
          created_at: string
          feedback_text: string
          from_user: string
          id: string
          is_anonymous: boolean | null
          rating: number | null
          to_user: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          feedback_text: string
          from_user: string
          id?: string
          is_anonymous?: boolean | null
          rating?: number | null
          to_user: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          feedback_text?: string
          from_user?: string
          id?: string
          is_anonymous?: boolean | null
          rating?: number | null
          to_user?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "feedback_to_user_fkey"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          assigned_to: string | null
          created_at: string
          created_by: string | null
          current_value: number | null
          description: string | null
          end_date: string | null
          id: string
          progress: number | null
          start_date: string | null
          status: string | null
          target_value: number | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          progress?: number | null
          start_date?: string | null
          status?: string | null
          target_value?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string
          created_by?: string | null
          current_value?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          progress?: number | null
          start_date?: string | null
          status?: string | null
          target_value?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "goals_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goals_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_by: string | null
          approved_date: string | null
          created_at: string
          days: number
          employee_id: string
          end_date: string
          id: string
          reason: string | null
          start_date: string
          status: string | null
          submitted_date: string | null
          type: string
          updated_at: string
        }
        Insert: {
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string
          days: number
          employee_id: string
          end_date: string
          id?: string
          reason?: string | null
          start_date: string
          status?: string | null
          submitted_date?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          approved_by?: string | null
          approved_date?: string | null
          created_at?: string
          days?: number
          employee_id?: string
          end_date?: string
          id?: string
          reason?: string | null
          start_date?: string
          status?: string | null
          submitted_date?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          category: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          title: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          category?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      one_on_ones: {
        Row: {
          agenda: string | null
          created_at: string
          duration_minutes: number | null
          employee_id: string
          id: string
          manager_id: string
          notes: string | null
          scheduled_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          agenda?: string | null
          created_at?: string
          duration_minutes?: number | null
          employee_id: string
          id?: string
          manager_id: string
          notes?: string | null
          scheduled_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          agenda?: string | null
          created_at?: string
          duration_minutes?: number | null
          employee_id?: string
          id?: string
          manager_id?: string
          notes?: string | null
          scheduled_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recognition: {
        Row: {
          created_at: string
          from_user: string
          id: string
          is_public: boolean | null
          message: string
          recognition_type: string | null
          title: string
          to_user: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_user: string
          id?: string
          is_public?: boolean | null
          message: string
          recognition_type?: string | null
          title: string
          to_user: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_user?: string
          id?: string
          is_public?: boolean | null
          message?: string
          recognition_type?: string | null
          title?: string
          to_user?: string
          updated_at?: string
        }
        Relationships: []
      }
      review_cycles: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string
          id: string
          name: string
          review_type: string | null
          start_date: string
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date: string
          id?: string
          name: string
          review_type?: string | null
          start_date: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          review_type?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      salaries: {
        Row: {
          created_at: string
          created_by: string | null
          effective_date: string
          employee_id: string
          id: string
          salary: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          effective_date?: string
          employee_id: string
          id?: string
          salary?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          effective_date?: string
          employee_id?: string
          id?: string
          salary?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salaries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["app_role"]
      }
    }
    Enums: {
      app_role: "hr" | "manager" | "employee"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["hr", "manager", "employee"],
    },
  },
} as const
