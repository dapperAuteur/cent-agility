/**
 * Agility Engine Sync Worker
 * Background service for uploading queued sessions to Supabase
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database.types';
import { agilityStorage } from '../db/agility-storage';
import type { PendingSession } from '../types/agility.types';

const SYNC_INTERVAL = 30000; // 30 seconds
const MAX_RETRIES = 5;

class AgilitySyncWorker {
  private syncIntervalId: NodeJS.Timeout | null = null;
  private isSyncing = false;
  private supabase: ReturnType<typeof createClient<Database>> | null = null;

  /**
   * Initialize worker with Supabase client
   */
  init(supabaseUrl: string, supabaseAnonKey: string) {
    this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }

  /**
   * Start background sync
   */
  start() {
    if (this.syncIntervalId) return; // Already running

    console.log('[AgilitySyncWorker] Starting background sync');
    
    // Immediate sync
    this.syncPendingSessions();

    // Periodic sync
    this.syncIntervalId = setInterval(() => {
      this.syncPendingSessions();
    }, SYNC_INTERVAL);
  }

  /**
   * Stop background sync
   */
  stop() {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
      console.log('[AgilitySyncWorker] Stopped background sync');
    }
  }

  /**
   * Manual sync trigger
   */
  async syncNow(): Promise<{ success: number; failed: number }> {
    return this.syncPendingSessions();
  }

  /**
   * Sync all pending sessions
   */
  private async syncPendingSessions(): Promise<{ success: number; failed: number }> {
    if (this.isSyncing) {
      console.log('[AgilitySyncWorker] Sync already in progress, skipping');
      return { success: 0, failed: 0 };
    }

    if (!this.supabase) {
      console.warn('[AgilitySyncWorker] Supabase not initialized');
      return { success: 0, failed: 0 };
    }

    // Check network
    if (!navigator.onLine) {
      console.log('[AgilitySyncWorker] Offline, skipping sync');
      return { success: 0, failed: 0 };
    }

    this.isSyncing = true;
    let successCount = 0;
    let failedCount = 0;

    try {
      const pending = await agilityStorage.getPendingSessions();
      
      if (pending.length === 0) {
        console.log('[AgilitySyncWorker] No pending sessions');
        return { success: 0, failed: 0 };
      }

      console.log(`[AgilitySyncWorker] Syncing ${pending.length} sessions`);

      for (const item of pending) {
        // Skip if max retries exceeded
        if (item.attempts >= MAX_RETRIES) {
          console.warn(`[AgilitySyncWorker] Max retries exceeded for ${item.local_id}`);
          failedCount++;
          continue;
        }

        try {
          await this.uploadSession(item.session);
          await agilityStorage.removePendingSession(item.local_id);
          successCount++;
          console.log(`[AgilitySyncWorker] Synced ${item.local_id}`);
        } catch (error) {
          failedCount++;
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          console.error(`[AgilitySyncWorker] Failed to sync ${item.local_id}:`, errorMsg);
          
          await agilityStorage.updateSyncAttempt(
            item.local_id, 
            false, 
            errorMsg
          );
        }
      }
    } catch (error) {
      console.error('[AgilitySyncWorker] Sync error:', error);
    } finally {
      this.isSyncing = false;
    }

    return { success: successCount, failed: failedCount };
  }

  /**
   * Upload single session to Supabase
   */
  private async uploadSession(session: PendingSession): Promise<void> {
    if (!this.supabase) throw new Error('Supabase not initialized');

    // Calculate aggregates
    const sprintTimes = session.reps.map(r => r.sprint_time_ms);
    const avgSprintTime = sprintTimes.reduce((a, b) => a + b, 0) / sprintTimes.length;
    const variance = this.calculateVariance(sprintTimes);

    // Insert session
    const { data: sessionData, error: sessionError } = await this.supabase
      .from('agility_sessions')
      .insert({
        user_id: session.user_id,
        course_id: session.course_id,
        task_id: session.task_id,
        goal_id: session.goal_id,
        sets: session.sets,
        reps_per_set: session.reps_per_set,
        rest_between_sets: session.rest_between_sets,
        min_start_delay: session.min_start_delay,
        max_start_delay: session.max_start_delay,
        total_time_ms: session.total_time_ms,
        total_reps_completed: session.total_reps_completed,
        avg_sprint_time_ms: Math.round(avgSprintTime),
        sprint_variance: variance,
        is_ranked: session.is_ranked,
        completed_at: session.completed_at,
        notes: session.notes,
        rpe: session.rpe,
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Insert reps
    const repsToInsert = session.reps.map(rep => ({
      session_id: sessionData.id,
      rep_number: rep.rep_number,
      set_number: rep.set_number,
      target_cone: rep.target_cone,
      start_delay_ms: rep.start_delay_ms,
      sprint_time_ms: rep.sprint_time_ms,
      reaction_quality: rep.reaction_quality,
    }));

    const { error: repsError } = await this.supabase
      .from('agility_reps')
      .insert(repsToInsert);

    if (repsError) throw repsError;

    // Save to local completed sessions
    await agilityStorage.saveSession(sessionData);
  }

  /**
   * Calculate variance for consistency metric
   */
  private calculateVariance(values: number[]): number {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const squaredDiffs = values.map(v => Math.pow(v - mean, 2));
    const variance = squaredDiffs.reduce((a, b) => a + b, 0) / values.length;
    return Math.sqrt(variance); // Return standard deviation
  }

  /**
   * Get sync status
   */
  async getSyncStatus(): Promise<{
    pending: number;
    lastSync: string | null;
    isOnline: boolean;
  }> {
    const pending = await agilityStorage.getPendingSessions();
    
    return {
      pending: pending.length,
      lastSync: pending.length > 0 
        ? pending[0].last_attempt 
        : null,
      isOnline: navigator.onLine,
    };
  }
}

export const syncWorker = new AgilitySyncWorker();
