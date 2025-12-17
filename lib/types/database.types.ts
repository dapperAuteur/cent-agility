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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      agility_courses: {
        Row: {
          cone_count: number
          cone_positions: Json
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_official: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          cone_count: number
          cone_positions: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_official?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          cone_count?: number
          cone_positions?: Json
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_official?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agility_leaderboard: {
        Row: {
          avg_sprint_time_ms: number
          best_cone_times: Json | null
          best_total_time_ms: number
          completed_at: string
          course_id: string
          id: string
          profile_image_url: string | null
          session_id: string
          sprint_variance: number
          total_reps: number
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          avg_sprint_time_ms: number
          best_cone_times?: Json | null
          best_total_time_ms: number
          completed_at: string
          course_id: string
          id?: string
          profile_image_url?: string | null
          session_id: string
          sprint_variance: number
          total_reps: number
          updated_at?: string | null
          user_id: string
          username: string
        }
        Update: {
          avg_sprint_time_ms?: number
          best_cone_times?: Json | null
          best_total_time_ms?: number
          completed_at?: string
          course_id?: string
          id?: string
          profile_image_url?: string | null
          session_id?: string
          sprint_variance?: number
          total_reps?: number
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: "agility_leaderboard_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "agility_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agility_leaderboard_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "agility_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      agility_reps: {
        Row: {
          created_at: string | null
          id: string
          reaction_quality: string | null
          rep_number: number
          session_id: string
          set_number: number
          sprint_time_ms: number
          start_delay_ms: number
          target_cone: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          reaction_quality?: string | null
          rep_number: number
          session_id: string
          set_number: number
          sprint_time_ms: number
          start_delay_ms: number
          target_cone: number
        }
        Update: {
          created_at?: string | null
          id?: string
          reaction_quality?: string | null
          rep_number?: number
          session_id?: string
          set_number?: number
          sprint_time_ms?: number
          start_delay_ms?: number
          target_cone?: number
        }
        Relationships: [
          {
            foreignKeyName: "agility_reps_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "agility_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      agility_sessions: {
        Row: {
          avg_sprint_time_ms: number | null
          completed_at: string
          course_id: string | null
          created_at: string | null
          goal_id: string | null
          id: string
          is_ranked: boolean | null
          max_start_delay: number
          min_start_delay: number
          notes: string | null
          reps_per_set: number
          rest_between_sets: number
          rpe: number | null
          sets: number
          shared_count: number | null
          sprint_variance: number | null
          synced_at: string | null
          task_id: string | null
          total_reps_completed: number
          total_time_ms: number
          user_id: string | null
        }
        Insert: {
          avg_sprint_time_ms?: number | null
          completed_at: string
          course_id?: string | null
          created_at?: string | null
          goal_id?: string | null
          id?: string
          is_ranked?: boolean | null
          max_start_delay: number
          min_start_delay: number
          notes?: string | null
          reps_per_set: number
          rest_between_sets: number
          rpe?: number | null
          sets: number
          shared_count?: number | null
          sprint_variance?: number | null
          synced_at?: string | null
          task_id?: string | null
          total_reps_completed: number
          total_time_ms: number
          user_id?: string | null
        }
        Update: {
          avg_sprint_time_ms?: number | null
          completed_at?: string
          course_id?: string | null
          created_at?: string | null
          goal_id?: string | null
          id?: string
          is_ranked?: boolean | null
          max_start_delay?: number
          min_start_delay?: number
          notes?: string | null
          reps_per_set?: number
          rest_between_sets?: number
          rpe?: number | null
          sets?: number
          shared_count?: number | null
          sprint_variance?: number | null
          synced_at?: string | null
          task_id?: string | null
          total_reps_completed?: number
          total_time_ms?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agility_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "agility_courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agility_sessions_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agility_sessions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_logs: {
        Row: {
          biggest_challenge: string | null
          biggest_win: string | null
          created_at: string | null
          date: string
          energy_rating: number | null
          id: string
          pain_activities: Json | null
          pain_intensity: number | null
          pain_locations: Json | null
          pain_notes: string | null
          pain_sensations: Json | null
          total_earned: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          biggest_challenge?: string | null
          biggest_win?: string | null
          created_at?: string | null
          date: string
          energy_rating?: number | null
          id?: string
          pain_activities?: Json | null
          pain_intensity?: number | null
          pain_locations?: Json | null
          pain_notes?: string | null
          pain_sensations?: Json | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          biggest_challenge?: string | null
          biggest_win?: string | null
          created_at?: string | null
          date?: string
          energy_rating?: number | null
          id?: string
          pain_activities?: Json | null
          pain_intensity?: number | null
          pain_locations?: Json | null
          pain_notes?: string | null
          pain_sensations?: Json | null
          total_earned?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      flashcard_sets: {
        Row: {
          created_at: string | null
          default_study_direction:
            | Database["public"]["Enums"]["study_direction"]
            | null
          goal_id: string | null
          id: string
          language: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          default_study_direction?:
            | Database["public"]["Enums"]["study_direction"]
            | null
          goal_id?: string | null
          id?: string
          language?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          default_study_direction?:
            | Database["public"]["Enums"]["study_direction"]
            | null
          goal_id?: string | null
          id?: string
          language?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcard_sets_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      flashcards: {
        Row: {
          back_text: string
          correct_count: number
          created_at: string | null
          difficulty: number
          front_text: string
          id: string
          incorrect_count: number
          interval: number
          last_reviewed_at: string | null
          next_review_at: string
          notes: string | null
          repetitions: number
          set_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          back_text: string
          correct_count?: number
          created_at?: string | null
          difficulty?: number
          front_text: string
          id?: string
          incorrect_count?: number
          interval?: number
          last_reviewed_at?: string | null
          next_review_at?: string
          notes?: string | null
          repetitions?: number
          set_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          back_text?: string
          correct_count?: number
          created_at?: string | null
          difficulty?: number
          front_text?: string
          id?: string
          incorrect_count?: number
          interval?: number
          last_reviewed_at?: string | null
          next_review_at?: string
          notes?: string | null
          repetitions?: number
          set_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "flashcards_set_id_fkey"
            columns: ["set_id"]
            isOneToOne: false
            referencedRelation: "flashcard_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_sessions: {
        Row: {
          break_intervals: Json | null
          created_at: string | null
          duration: number | null
          end_time: string | null
          hourly_rate: number | null
          id: string
          net_work_duration: number | null
          notes: string | null
          pomodoro_mode: boolean | null
          quality_rating: number | null
          revenue: number | null
          start_time: string
          tags: string[] | null
          task_id: string | null
          template_id: string | null
          updated_at: string | null
          user_id: string
          work_intervals: Json | null
        }
        Insert: {
          break_intervals?: Json | null
          created_at?: string | null
          duration?: number | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          net_work_duration?: number | null
          notes?: string | null
          pomodoro_mode?: boolean | null
          quality_rating?: number | null
          revenue?: number | null
          start_time: string
          tags?: string[] | null
          task_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id: string
          work_intervals?: Json | null
        }
        Update: {
          break_intervals?: Json | null
          created_at?: string | null
          duration?: number | null
          end_time?: string | null
          hourly_rate?: number | null
          id?: string
          net_work_duration?: number | null
          notes?: string | null
          pomodoro_mode?: boolean | null
          quality_rating?: number | null
          revenue?: number | null
          start_time?: string
          tags?: string[] | null
          task_id?: string | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string
          work_intervals?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "focus_sessions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "focus_sessions_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "session_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      gem_personas: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          system_prompt: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          system_prompt: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          system_prompt?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          actual_cost: number | null
          archived_at: string | null
          category: string
          created_at: string | null
          description: string | null
          estimated_cost: number | null
          id: string
          revenue: number | null
          roadmap_id: string
          status: string | null
          target_year: number
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          archived_at?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          revenue?: number | null
          roadmap_id: string
          status?: string | null
          target_year: number
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          archived_at?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          id?: string
          revenue?: number | null
          roadmap_id?: string
          status?: string | null
          target_year?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      ingredients: {
        Row: {
          brand: string | null
          calories_per_100g: number
          carbs_per_100g: number
          cost_per_unit: number
          created_at: string | null
          fat_per_100g: number
          fiber_per_100g: number | null
          id: string
          name: string
          ncv_score: string
          notes: string | null
          protein_per_100g: number
          store_name: string | null
          store_website: string | null
          unit: string
          updated_at: string | null
          usda_fdc_id: string | null
          user_id: string
          vendor_notes: string | null
        }
        Insert: {
          brand?: string | null
          calories_per_100g: number
          carbs_per_100g: number
          cost_per_unit: number
          created_at?: string | null
          fat_per_100g: number
          fiber_per_100g?: number | null
          id?: string
          name: string
          ncv_score: string
          notes?: string | null
          protein_per_100g: number
          store_name?: string | null
          store_website?: string | null
          unit: string
          updated_at?: string | null
          usda_fdc_id?: string | null
          user_id: string
          vendor_notes?: string | null
        }
        Update: {
          brand?: string | null
          calories_per_100g?: number
          carbs_per_100g?: number
          cost_per_unit?: number
          created_at?: string | null
          fat_per_100g?: number
          fiber_per_100g?: number | null
          id?: string
          name?: string
          ncv_score?: string
          notes?: string | null
          protein_per_100g?: number
          store_name?: string | null
          store_website?: string | null
          unit?: string
          updated_at?: string | null
          usda_fdc_id?: string | null
          user_id?: string
          vendor_notes?: string | null
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string
          last_restocked: string | null
          low_stock_threshold: number | null
          quantity: number
          unit: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id: string
          last_restocked?: string | null
          low_stock_threshold?: number | null
          quantity?: number
          unit: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string
          last_restocked?: string | null
          low_stock_threshold?: number | null
          quantity?: number
          unit?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      language_coach_sessions: {
        Row: {
          created_at: string | null
          gem_persona_id: string | null
          id: string
          messages: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          gem_persona_id?: string | null
          id?: string
          messages?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          gem_persona_id?: string | null
          id?: string
          messages?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "language_coach_sessions_gem_persona_id_fkey"
            columns: ["gem_persona_id"]
            isOneToOne: false
            referencedRelation: "gem_personas"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_log_ingredients: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string
          meal_log_id: string
          quantity: number
          unit: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id: string
          meal_log_id: string
          quantity: number
          unit: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string
          meal_log_id?: string
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_log_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_log_ingredients_meal_log_id_fkey"
            columns: ["meal_log_id"]
            isOneToOne: false
            referencedRelation: "meal_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          is_restaurant_meal: boolean | null
          meal_type: string | null
          notes: string | null
          protocol_id: string | null
          restaurant_address: string | null
          restaurant_city: string | null
          restaurant_country: string | null
          restaurant_name: string | null
          restaurant_state: string | null
          restaurant_website: string | null
          time: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          is_restaurant_meal?: boolean | null
          meal_type?: string | null
          notes?: string | null
          protocol_id?: string | null
          restaurant_address?: string | null
          restaurant_city?: string | null
          restaurant_country?: string | null
          restaurant_name?: string | null
          restaurant_state?: string | null
          restaurant_website?: string | null
          time: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          is_restaurant_meal?: boolean | null
          meal_type?: string | null
          notes?: string | null
          protocol_id?: string | null
          restaurant_address?: string | null
          restaurant_city?: string | null
          restaurant_country?: string | null
          restaurant_name?: string | null
          restaurant_state?: string | null
          restaurant_website?: string | null
          time?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_logs_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_prep_batches: {
        Row: {
          created_at: string | null
          date_finished: string | null
          date_made: string
          id: string
          notes: string | null
          protocol_id: string
          servings_made: number
          servings_remaining: number
          storage_location: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date_finished?: string | null
          date_made: string
          id?: string
          notes?: string | null
          protocol_id: string
          servings_made: number
          servings_remaining: number
          storage_location?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date_finished?: string | null
          date_made?: string
          id?: string
          notes?: string | null
          protocol_id?: string
          servings_made?: number
          servings_remaining?: number
          storage_location?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_prep_batches_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      milestones: {
        Row: {
          actual_cost: number | null
          archived_at: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          estimated_cost: number | null
          goal_id: string
          id: string
          revenue: number | null
          status: string | null
          target_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_cost?: number | null
          archived_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          goal_id: string
          id?: string
          revenue?: number | null
          status?: string | null
          target_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_cost?: number | null
          archived_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          estimated_cost?: number | null
          goal_id?: string
          id?: string
          revenue?: number | null
          status?: string | null
          target_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "milestones_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      protocol_ingredients: {
        Row: {
          created_at: string | null
          id: string
          ingredient_id: string
          protocol_id: string
          quantity: number
          unit: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ingredient_id: string
          protocol_id: string
          quantity: number
          unit: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ingredient_id?: string
          protocol_id?: string
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "protocol_ingredients_ingredient_id_fkey"
            columns: ["ingredient_id"]
            isOneToOne: false
            referencedRelation: "ingredients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "protocol_ingredients_protocol_id_fkey"
            columns: ["protocol_id"]
            isOneToOne: false
            referencedRelation: "protocols"
            referencedColumns: ["id"]
          },
        ]
      }
      protocols: {
        Row: {
          cook_time_minutes: number | null
          created_at: string | null
          date_finished: string | null
          date_made: string | null
          description: string | null
          id: string
          name: string
          ncv_score: string
          prep_time_minutes: number | null
          servings: number | null
          total_calories: number
          total_cost: number
          total_protein: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cook_time_minutes?: number | null
          created_at?: string | null
          date_finished?: string | null
          date_made?: string | null
          description?: string | null
          id?: string
          name: string
          ncv_score: string
          prep_time_minutes?: number | null
          servings?: number | null
          total_calories?: number
          total_cost?: number
          total_protein?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cook_time_minutes?: number | null
          created_at?: string | null
          date_finished?: string | null
          date_made?: string | null
          description?: string | null
          id?: string
          name?: string
          ncv_score?: string
          prep_time_minutes?: number | null
          servings?: number | null
          total_calories?: number
          total_cost?: number
          total_protein?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      roadmaps: {
        Row: {
          actual_cost: number | null
          archived_at: string | null
          created_at: string | null
          description: string | null
          end_date: string
          estimated_cost: number | null
          id: string
          revenue: number | null
          start_date: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          actual_cost?: number | null
          archived_at?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          estimated_cost?: number | null
          id?: string
          revenue?: number | null
          start_date: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          actual_cost?: number | null
          archived_at?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          estimated_cost?: number | null
          id?: string
          revenue?: number | null
          start_date?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      session_templates: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number
          hourly_rate: number | null
          icon: string | null
          id: string
          name: string
          notes_template: string | null
          tags: string[] | null
          updated_at: string | null
          use_pomodoro: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes: number
          hourly_rate?: number | null
          icon?: string | null
          id?: string
          name: string
          notes_template?: string | null
          tags?: string[] | null
          updated_at?: string | null
          use_pomodoro?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          hourly_rate?: number | null
          icon?: string | null
          id?: string
          name?: string
          notes_template?: string | null
          tags?: string[] | null
          updated_at?: string | null
          use_pomodoro?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      study_logs: {
        Row: {
          card_id: string
          confidence_rating: number
          created_at: string | null
          id: number
          is_correct: boolean
          session_id: string
          study_direction: Database["public"]["Enums"]["study_direction"]
          time_seconds: number
          user_id: string
        }
        Insert: {
          card_id: string
          confidence_rating: number
          created_at?: string | null
          id?: number
          is_correct: boolean
          session_id: string
          study_direction: Database["public"]["Enums"]["study_direction"]
          time_seconds: number
          user_id: string
        }
        Update: {
          card_id?: string
          confidence_rating?: number
          created_at?: string | null
          id?: number
          is_correct?: boolean
          session_id?: string
          study_direction?: Database["public"]["Enums"]["study_direction"]
          time_seconds?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_logs_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "flashcards"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          activity: string
          actual_cost: number | null
          archived_at: string | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          date: string
          description: string | null
          estimated_cost: number | null
          id: string
          milestone_id: string
          priority: number | null
          revenue: number | null
          status: string | null
          tag: string
          time: string
          updated_at: string | null
        }
        Insert: {
          activity: string
          actual_cost?: number | null
          archived_at?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          date: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          milestone_id: string
          priority?: number | null
          revenue?: number | null
          status?: string | null
          tag: string
          time: string
          updated_at?: string | null
        }
        Update: {
          activity?: string
          actual_cost?: number | null
          archived_at?: string | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          date?: string
          description?: string | null
          estimated_cost?: number | null
          id?: string
          milestone_id?: string
          priority?: number | null
          revenue?: number | null
          status?: string | null
          tag?: string
          time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_milestone_id_fkey"
            columns: ["milestone_id"]
            isOneToOne: false
            referencedRelation: "milestones"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          agility_profile_public: boolean | null
          agility_total_sessions: number | null
          agility_total_sprints: number | null
          agility_username: string | null
          created_at: string | null
          daily_focus_goal_minutes: number | null
          id: string
          low_servings_threshold: number | null
          updated_at: string | null
          user_id: string
          weekly_focus_goal_minutes: number | null
        }
        Insert: {
          agility_profile_public?: boolean | null
          agility_total_sessions?: number | null
          agility_total_sprints?: number | null
          agility_username?: string | null
          created_at?: string | null
          daily_focus_goal_minutes?: number | null
          id?: string
          low_servings_threshold?: number | null
          updated_at?: string | null
          user_id: string
          weekly_focus_goal_minutes?: number | null
        }
        Update: {
          agility_profile_public?: boolean | null
          agility_total_sessions?: number | null
          agility_total_sprints?: number | null
          agility_username?: string | null
          created_at?: string | null
          daily_focus_goal_minutes?: number | null
          id?: string
          low_servings_threshold?: number | null
          updated_at?: string | null
          user_id?: string
          weekly_focus_goal_minutes?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      correlation_candidates: {
        Row: {
          green_day_avg_energy: number | null
          green_day_count: number | null
          high_focus_completion_rate: number | null
          high_focus_day_count: number | null
          high_pain_avg_focus: number | null
          high_pain_day_count: number | null
          low_focus_completion_rate: number | null
          low_pain_avg_focus: number | null
          no_restaurant_completion_rate: number | null
          non_green_day_avg_energy: number | null
          restaurant_day_completion_rate: number | null
          restaurant_day_count: number | null
        }
        Relationships: []
      }
      daily_aggregates: {
        Row: {
          avg_ncv_numeric: number | null
          completion_rate: number | null
          daily_food_cost: number | null
          date: string | null
          day_of_week: number | null
          energy_rating: number | null
          focus_minutes: number | null
          focus_session_count: number | null
          meal_count: number | null
          ncv_score_mode: string | null
          pain_score: number | null
          restaurant_meal_count: number | null
          tasks_completed: number | null
          tasks_total: number | null
          user_id: string | null
          week_number: number | null
        }
        Relationships: []
      }
      focus_session_analytics: {
        Row: {
          avg_quality: number | null
          pomodoro_sessions: number | null
          session_date: string | null
          simple_sessions: number | null
          templates_used: number | null
          total_breaks: number | null
          total_duration: number | null
          total_net_work: number | null
          total_pomodoros: number | null
          total_revenue: number | null
          total_sessions: number | null
          unique_tasks: number | null
          user_id: string | null
        }
        Relationships: []
      }
      weekly_aggregates: {
        Row: {
          avg_completion_rate: number | null
          avg_energy_rating: number | null
          avg_ncv_score: number | null
          avg_pain_score: number | null
          avg_sessions_per_day: number | null
          days_in_week: number | null
          high_completion_days: number | null
          tasks_completed: number | null
          tasks_total: number | null
          total_focus_minutes: number | null
          total_food_cost: number | null
          total_meals: number | null
          total_restaurant_meals: number | null
          week_end: string | null
          week_number: number | null
          week_start: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_agility_leaderboard: {
        Args: { p_course_id: string; p_limit?: number; p_metric?: string }
        Returns: {
          avg_sprint_ms: number
          best_time_ms: number
          completed_at: string
          profile_image_url: string
          rank: number
          total_reps: number
          username: string
          variance: number
        }[]
      }
      get_agility_personal_best: {
        Args: { p_course_id: string; p_user_id: string }
        Returns: {
          best_time_ms: number
          consistency_score: number
          session_date: string
        }[]
      }
      refresh_focus_analytics: { Args: never; Returns: undefined }
    }
    Enums: {
      study_direction: "front_to_back" | "back_to_front"
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
      study_direction: ["front_to_back", "back_to_front"],
    },
  },
} as const
