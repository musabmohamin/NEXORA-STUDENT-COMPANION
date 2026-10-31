export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: { PostgrestVersion: "14.18" }
  public: {
    Tables: {
      academic_years: {
        Row: { created_at: string; department_id: string; id: string; name: string; year_number: number }
        Insert: { created_at?: string; department_id: string; id?: string; name: string; year_number: number }
        Update: { created_at?: string; department_id?: string; id?: string; name?: string; year_number?: number }
        Relationships: [{ foreignKeyName: "academic_years_department_id_fkey"; columns: ["department_id"]; isOneToOne: false; referencedRelation: "departments"; referencedColumns: ["id"] }]
      }
      announcements: {
        Row: { category: string; created_at: string; deadline: string | null; department_id: string | null; description: string | null; event_date: string | null; external_url: string | null; featured: boolean | null; id: string; image_url: string | null; location: string | null; status: string; title: string }
        Insert: { category?: string; created_at?: string; deadline?: string | null; department_id?: string | null; description?: string | null; event_date?: string | null; external_url?: string | null; featured?: boolean | null; id?: string; image_url?: string | null; location?: string | null; status?: string; title: string }
        Update: { category?: string; created_at?: string; deadline?: string | null; department_id?: string | null; description?: string | null; event_date?: string | null; external_url?: string | null; featured?: boolean | null; id?: string; image_url?: string | null; location?: string | null; status?: string; title?: string }
        Relationships: [{ foreignKeyName: "announcements_department_id_fkey"; columns: ["department_id"]; isOneToOne: false; referencedRelation: "departments"; referencedColumns: ["id"] }]
      }
      applications: {
        Row: { announcement_id: string; created_at: string; cv_url: string | null; id: string; links: string[] | null; motivation: string | null; status: string; student_id: string }
        Insert: { announcement_id: string; created_at?: string; cv_url?: string | null; id?: string; links?: string[] | null; motivation?: string | null; status?: string; student_id: string }
        Update: { announcement_id?: string; created_at?: string; cv_url?: string | null; id?: string; links?: string[] | null; motivation?: string | null; status?: string; student_id?: string }
        Relationships: [{ foreignKeyName: "applications_announcement_id_fkey"; columns: ["announcement_id"]; isOneToOne: false; referencedRelation: "announcements"; referencedColumns: ["id"] }, { foreignKeyName: "applications_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      audit_log: {
        Row: { action: string; admin_id: string | null; created_at: string; details: Json | null; entity_id: string | null; entity_type: string | null; id: string }
        Insert: { action: string; admin_id?: string | null; created_at?: string; details?: Json | null; entity_id?: string | null; entity_type?: string | null; id?: string }
        Update: { action?: string; admin_id?: string | null; created_at?: string; details?: Json | null; entity_id?: string | null; entity_type?: string | null; id?: string }
        Relationships: [{ foreignKeyName: "audit_log_admin_id_fkey"; columns: ["admin_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      chat_messages: {
        Row: { content: string; created_at: string; id: string; role: string; student_id: string }
        Insert: { content: string; created_at?: string; id?: string; role: string; student_id: string }
        Update: { content?: string; created_at?: string; id?: string; role?: string; student_id?: string }
        Relationships: [{ foreignKeyName: "chat_messages_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      collaboration_posts: {
        Row: { created_at: string; department_id: string | null; description: string | null; filled: number | null; id: string; skills: string[] | null; status: string; student_id: string; team_size: number | null; title: string; type: string }
        Insert: { created_at?: string; department_id?: string | null; description?: string | null; filled?: number | null; id?: string; skills?: string[] | null; status?: string; student_id: string; team_size?: number | null; title: string; type?: string }
        Update: { created_at?: string; department_id?: string | null; description?: string | null; filled?: number | null; id?: string; skills?: string[] | null; status?: string; student_id?: string; team_size?: number | null; title?: string; type?: string }
        Relationships: [{ foreignKeyName: "collaboration_posts_department_id_fkey"; columns: ["department_id"]; isOneToOne: false; referencedRelation: "departments"; referencedColumns: ["id"] }, { foreignKeyName: "collaboration_posts_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      courses: {
        Row: { code: string; created_at: string; department_id: string; description: string | null; difficulty: string | null; id: string; outcomes: string[] | null; prerequisites: string | null; semester_id: string | null; sort_order: number | null; status: string; title: string }
        Insert: { code: string; created_at?: string; department_id: string; description?: string | null; difficulty?: string | null; id?: string; outcomes?: string[] | null; prerequisites?: string | null; semester_id?: string | null; sort_order?: number | null; status?: string; title: string }
        Update: { code?: string; created_at?: string; department_id?: string; description?: string | null; difficulty?: string | null; id?: string; outcomes?: string[] | null; prerequisites?: string | null; semester_id?: string | null; sort_order?: number | null; status?: string; title?: string }
        Relationships: [{ foreignKeyName: "courses_department_id_fkey"; columns: ["department_id"]; isOneToOne: false; referencedRelation: "departments"; referencedColumns: ["id"] }, { foreignKeyName: "courses_semester_id_fkey"; columns: ["semester_id"]; isOneToOne: false; referencedRelation: "semesters"; referencedColumns: ["id"] }]
      }
      departments: {
        Row: { created_at: string; description: string | null; icon: string | null; id: string; name: string; slug: string; status: string }
        Insert: { created_at?: string; description?: string | null; icon?: string | null; id?: string; name: string; slug: string; status?: string }
        Update: { created_at?: string; description?: string | null; icon?: string | null; id?: string; name?: string; slug?: string; status?: string }
        Relationships: []
      }
      enrollments: {
        Row: { course_id: string; created_at: string; id: string; student_id: string }
        Insert: { course_id: string; created_at?: string; id?: string; student_id: string }
        Update: { course_id?: string; created_at?: string; id?: string; student_id?: string }
        Relationships: [{ foreignKeyName: "enrollments_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] }, { foreignKeyName: "enrollments_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      join_requests: {
        Row: { created_at: string; id: string; post_id: string; status: string; student_id: string }
        Insert: { created_at?: string; id?: string; post_id: string; status?: string; student_id: string }
        Update: { created_at?: string; id?: string; post_id?: string; status?: string; student_id?: string }
        Relationships: [{ foreignKeyName: "join_requests_post_id_fkey"; columns: ["post_id"]; isOneToOne: false; referencedRelation: "collaboration_posts"; referencedColumns: ["id"] }, { foreignKeyName: "join_requests_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      notifications: {
        Row: { body: string | null; created_at: string; id: string; read: boolean; student_id: string; title: string; type: string | null }
        Insert: { body?: string | null; created_at?: string; id?: string; read?: boolean; student_id: string; title: string; type?: string | null }
        Update: { body?: string | null; created_at?: string; id?: string; read?: boolean; student_id?: string; title?: string; type?: string | null }
        Relationships: [{ foreignKeyName: "notifications_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      points_rules: {
        Row: { category: string; created_at: string; description: string | null; id: string; name: string; points: number }
        Insert: { category?: string; created_at?: string; description?: string | null; id?: string; name: string; points: number }
        Update: { category?: string; created_at?: string; description?: string | null; id?: string; name?: string; points?: number }
        Relationships: []
      }
      points_transactions: {
        Row: { created_at: string; description: string | null; id: string; points: number; rule_id: string | null; source_id: string | null; student_id: string }
        Insert: { created_at?: string; description?: string | null; id?: string; points: number; rule_id?: string | null; source_id?: string | null; student_id: string }
        Update: { created_at?: string; description?: string | null; id?: string; points?: number; rule_id?: string | null; source_id?: string | null; student_id?: string }
        Relationships: [{ foreignKeyName: "points_transactions_rule_id_fkey"; columns: ["rule_id"]; isOneToOne: false; referencedRelation: "points_rules"; referencedColumns: ["id"] }, { foreignKeyName: "points_transactions_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      profiles: {
        Row: { avatar_url: string | null; created_at: string; department: string | null; email: string | null; full_name: string | null; id: string; preferred_department_id: string | null; role: string }
        Insert: { avatar_url?: string | null; created_at?: string; department?: string | null; email?: string | null; full_name?: string | null; id: string; preferred_department_id?: string | null; role?: string }
        Update: { avatar_url?: string; created_at?: string; department?: string; email?: string; full_name?: string; id?: string; preferred_department_id?: string; role?: string; [key: string]: unknown }
        Relationships: [{ foreignKeyName: "profiles_preferred_dept_fk"; columns: ["preferred_department_id"]; isOneToOne: false; referencedRelation: "departments"; referencedColumns: ["id"] }]
      }
      projects: {
        Row: { allow_late: boolean | null; allow_retry: boolean | null; course_id: string; created_at: string; deadline: string | null; deliverables: string | null; id: string; level: string; objectives: string | null; requirements: string | null; revision_limit: number | null; rubric: Json | null; status: string; title: string | null }
        Insert: { allow_late?: boolean | null; allow_retry?: boolean | null; course_id: string; created_at?: string; deadline?: string | null; deliverables?: string | null; id?: string; level: string; objectives?: string | null; requirements?: string | null; revision_limit?: number | null; rubric?: Json | null; status?: string; title?: string | null }
        Update: { allow_late?: boolean | null; allow_retry?: boolean | null; course_id?: string; created_at?: string; deadline?: string | null; deliverables?: string | null; id?: string; level?: string; objectives?: string | null; requirements?: string | null; revision_limit?: number | null; rubric?: Json | null; status?: string; title?: string | null }
        Relationships: [{ foreignKeyName: "projects_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] }]
      }
      resources: {
        Row: { category: string; course_id: string | null; created_at: string; department_id: string | null; id: string; storage_path: string | null; title: string; url: string | null }
        Insert: { category?: string; course_id?: string | null; created_at?: string; department_id?: string | null; id?: string; storage_path?: string | null; title: string; url?: string | null }
        Update: { category?: string; course_id?: string | null; created_at?: string; department_id?: string | null; id?: string; storage_path?: string | null; title?: string; url?: string | null }
        Relationships: [{ foreignKeyName: "resources_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] }, { foreignKeyName: "resources_department_id_fkey"; columns: ["department_id"]; isOneToOne: false; referencedRelation: "departments"; referencedColumns: ["id"] }]
      }
      semesters: {
        Row: { academic_year_id: string; created_at: string; id: string; name: string; semester_number: number }
        Insert: { academic_year_id: string; created_at?: string; id?: string; name: string; semester_number: number }
        Update: { academic_year_id?: string; created_at?: string; id?: string; name?: string; semester_number?: number }
        Relationships: [{ foreignKeyName: "semesters_academic_year_id_fkey"; columns: ["academic_year_id"]; isOneToOne: false; referencedRelation: "academic_years"; referencedColumns: ["id"] }]
      }
      submission_files: {
        Row: { file_name: string; id: string; mime_type: string | null; storage_path: string; submission_id: string; uploaded_at: string }
        Insert: { file_name: string; id?: string; mime_type?: string | null; storage_path: string; submission_id: string; uploaded_at?: string }
        Update: { file_name?: string; id?: string; mime_type?: string | null; storage_path?: string; submission_id?: string; uploaded_at?: string }
        Relationships: [{ foreignKeyName: "submission_files_submission_id_fkey"; columns: ["submission_id"]; isOneToOne: false; referencedRelation: "submissions"; referencedColumns: ["id"] }]
      }
      submission_versions: {
        Row: { created_at: string; github_url: string | null; id: string; status: string | null; submission_id: string; summary: string | null; version_number: number }
        Insert: { created_at?: string; github_url?: string | null; id?: string; status?: string | null; submission_id: string; summary?: string | null; version_number?: number }
        Update: { created_at?: string; github_url?: string | null; id?: string; status?: string | null; submission_id?: string; summary?: string | null; version_number?: number }
        Relationships: [{ foreignKeyName: "submission_versions_submission_id_fkey"; columns: ["submission_id"]; isOneToOne: false; referencedRelation: "submissions"; referencedColumns: ["id"] }]
      }
      submissions: {
        Row: { demo_url: string | null; feedback: string | null; github_url: string | null; id: string; project_id: string; reviewer_id: string | null; score: number | null; status: string; student_id: string; submitted_at: string | null; summary: string | null; tech_stack: string[] | null; testing_notes: string | null; updated_at: string }
        Insert: { demo_url?: string | null; feedback?: string | null; github_url?: string | null; id?: string; project_id: string; reviewer_id?: string | null; score?: number | null; status?: string; student_id: string; submitted_at?: string | null; summary?: string | null; tech_stack?: string[] | null; testing_notes?: string | null; updated_at?: string }
        Update: { demo_url?: string | null; feedback?: string | null; github_url?: string | null; id?: string; project_id?: string; reviewer_id?: string | null; score?: number | null; status?: string; student_id?: string; submitted_at?: string | null; summary?: string | null; tech_stack?: string[] | null; testing_notes?: string | null; updated_at?: string }
        Relationships: [{ foreignKeyName: "submissions_project_id_fkey"; columns: ["project_id"]; isOneToOne: false; referencedRelation: "projects"; referencedColumns: ["id"] }, { foreignKeyName: "submissions_reviewer_id_fkey"; columns: ["reviewer_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }, { foreignKeyName: "submissions_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }]
      }
      unit_progress: {
        Row: { completed: boolean; completed_at: string | null; created_at: string; id: string; student_id: string; unit_id: string }
        Insert: { completed?: boolean; completed_at?: string | null; created_at?: string; id?: string; student_id: string; unit_id: string }
        Update: { completed?: boolean; completed_at?: string | null; created_at?: string; id?: string; student_id?: string; unit_id?: string }
        Relationships: [{ foreignKeyName: "unit_progress_student_id_fkey"; columns: ["student_id"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] }, { foreignKeyName: "unit_progress_unit_id_fkey"; columns: ["unit_id"]; isOneToOne: false; referencedRelation: "units"; referencedColumns: ["id"] }]
      }
      units: {
        Row: { course_id: string; created_at: string; description: string | null; id: string; kind: string; order_index: number; title: string }
        Insert: { course_id: string; created_at?: string; description?: string | null; id?: string; kind?: string; order_index?: number; title: string }
        Update: { course_id?: string; created_at?: string; description?: string | null; id?: string; kind?: string; order_index?: number; title?: string }
        Relationships: [{ foreignKeyName: "units_course_id_fkey"; columns: ["course_id"]; isOneToOne: false; referencedRelation: "courses"; referencedColumns: ["id"] }]
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}