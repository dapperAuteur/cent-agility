/**
 * Agility Engine Database Types
 * Auto-generated from Supabase schema
 */

import type { Database } from './database.types';

export interface ConePosition {
  number: number;
  distance: number; // meters
  angle: number; // degrees from north
}

export interface AgilityCourse {
  id: string;
  name: string;
  description: string | null;
  cone_count: number;
  cone_positions: ConePosition[];
  is_official: boolean | null;
  created_by: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface AgilitySession {
  id: string;
  user_id: string | null; // Null for anonymous
  course_id: string | null;
  task_id: string | null; // CentOS integration
  goal_id: string | null; // CentOS integration
  
  // Config
  sets: number;
  reps_per_set: number;
  rest_between_sets: number; // seconds
  min_start_delay: number;
  max_start_delay: number;
  
  // Results
  total_time_ms: number;
  total_reps_completed: number;
  avg_sprint_time_ms: number | null;
  sprint_variance: number | null;
  
  // Metadata
  is_ranked: boolean;
  completed_at: string;
  created_at: string;
  synced_at: string | null;
  
  // Optional
  notes: string | null;
  rpe: number | null; // 1-10
  shared_count: number;
}

export interface AgilityRep {
  id: string;
  session_id: string;
  rep_number: number;
  set_number: number;
  target_cone: number;
  start_delay_ms: number;
  sprint_time_ms: number;
  reaction_quality: 'excellent' | 'good' | 'fair' | 'poor' | null;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  course_id: string;
  session_id: string;
  username: string;
  profile_image_url: string | null;
  best_total_time_ms: number;
  best_cone_times: Record<string, number>; // {1: 5100, 2: 4800}
  avg_sprint_time_ms: number;
  sprint_variance: number;
  total_reps: number;
  completed_at: string;
  updated_at: string;
  rank?: number; // Added by query
}

// Local-only types for offline queue
export interface PendingSession extends Omit<AgilitySession, 'id' | 'created_at' | 'synced_at'> {
  local_id: string; // UUID generated client-side
  reps: Omit<AgilityRep, 'id' | 'session_id' | 'created_at'>[];
}

export interface SyncQueueItem {
  local_id: string;
  session: PendingSession;
  attempts: number;
  last_attempt: string | null;
  error: string | null;
}

// UI State types
export interface DrillState {
  phase: 'setup' | 'pre-drill' | 'ready' | 'waiting' | 'go' | 'rest' | 'complete';
  currentSet: number;
  currentRep: number;
  targetCone: number | null;
  startTime: number | null;
  reps: Omit<AgilityRep, 'id' | 'session_id' | 'created_at'>[];
}

export interface DrillConfig {
  course: AgilityCourse;
  sets: number;
  repsPerSet: number;
  restBetweenSets: number;
  minStartDelay: number;
  maxStartDelay: number;
  linkToTask?: string; // Task ID from CentOS
  linkToGoal?: string; // Goal ID from CentOS
}

export function isDrillConfig(obj: unknown): obj is DrillConfig {
  if (typeof obj !== 'object' || obj === null) {
    return false;
  }

  const config = obj as DrillConfig;

  return (
    typeof config.course === 'object' &&
    typeof config.course.name === 'string' &&
    typeof config.course.cone_count === 'number' &&
    typeof config.sets === 'number' &&
    typeof config.repsPerSet === 'number' &&
    typeof config.restBetweenSets === 'number' &&
    typeof config.minStartDelay === 'number' &&
    typeof config.maxStartDelay === 'number' &&
    Array.isArray(config.course.cone_positions)
  );
}

// Helper to convert Supabase row to AgilityCourse
export function toAgilityCourse(row: Database['public']['Tables']['agility_courses']['Row']): AgilityCourse {
  return {
    ...row,
    cone_positions: row.cone_positions as unknown as ConePosition[],
    is_official: row.is_official ?? false,
    created_at: row.created_at || new Date().toISOString(),
    updated_at: row.updated_at || new Date().toISOString(),
  };
}