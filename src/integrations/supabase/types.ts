export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance_records: {
        Row: {
          class_id: string
          id: string
          lecture_id: string
          status: string
          student_id: string
          timestamp: string | null
          verification_method: string
        }
        Insert: {
          class_id: string
          id?: string
          lecture_id: string
          status?: string
          student_id: string
          timestamp?: string | null
          verification_method: string
        }
        Update: {
          class_id?: string
          id?: string
          lecture_id?: string
          status?: string
          student_id?: string
          timestamp?: string | null
          verification_method?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      classes: {
        Row: {
          created_at: string | null
          department: string
          id: string
          name: string
          teacher_id: string
          year: string
        }
        Insert: {
          created_at?: string | null
          department: string
          id?: string
          name: string
          teacher_id: string
          year: string
        }
        Update: {
          created_at?: string | null
          department?: string
          id?: string
          name?: string
          teacher_id?: string
          year?: string
        }
        Relationships: [
          {
            foreignKeyName: "classes_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "teachers"
            referencedColumns: ["id"]
          },
        ]
      }
      lectures: {
        Row: {
          class_id: string
          created_at: string | null
          date: string | null
          id: string
          qr_code: string | null
          title: string
        }
        Insert: {
          class_id: string
          created_at?: string | null
          date?: string | null
          id?: string
          qr_code?: string | null
          title: string
        }
        Update: {
          class_id?: string
          created_at?: string | null
          date?: string | null
          id?: string
          qr_code?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "lectures_class_id_fkey"
            columns: ["class_id"]
            isOneToOne: false
            referencedRelation: "classes"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string | null
          department: string
          division: string | null
          email: string
          face_image: string | null
          face_registered: boolean | null
          full_name: string
          id: string
          roll_number: string
          updated_at: string | null
          user_id: string
          year: string
        }
        Insert: {
          created_at?: string | null
          department: string
          division?: string | null
          email: string
          face_image?: string | null
          face_registered?: boolean | null
          full_name: string
          id?: string
          roll_number: string
          updated_at?: string | null
          user_id: string
          year: string
        }
        Update: {
          created_at?: string | null
          department?: string
          division?: string | null
          email?: string
          face_image?: string | null
          face_registered?: boolean | null
          full_name?: string
          id?: string
          roll_number?: string
          updated_at?: string | null
          user_id?: string
          year?: string
        }
        Relationships: []
      }
      teachers: {
        Row: {
          created_at: string | null
          department: string
          email: string
          full_name: string
          id: string
          subject_details: Json[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department: string
          email: string
          full_name: string
          id?: string
          subject_details?: Json[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string
          email?: string
          full_name?: string
          id?: string
          subject_details?: Json[] | null
          updated_at?: string | null
          user_id?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
