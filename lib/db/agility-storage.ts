/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * IndexedDB Storage for Agility Engine
 * Handles offline session storage and sync queue
 */

import { PendingSession, SyncQueueItem, AgilityCourse } from '../types/agility.types';

const DB_NAME = 'agility_engine_db';
const DB_VERSION = 1;

interface AgilityDB extends IDBDatabase {
  objectStoreNames: DOMStringList;
}

class AgilityStorage {
  private db: AgilityDB | null = null;

  /**
   * Initialize IndexedDB
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result as AgilityDB;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result as AgilityDB;

        // Sync queue: sessions waiting to upload
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'local_id' });
          syncStore.createIndex('attempts', 'attempts', { unique: false });
        }

        // Completed sessions (already synced)
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionsStore.createIndex('completed_at', 'completed_at', { unique: false });
        }

        // Course cache
        if (!db.objectStoreNames.contains('courses')) {
          db.createObjectStore('courses', { keyPath: 'id' });
        }
      };
    });
  }

  /**
   * Add session to sync queue
   */
  async queueSession(session: PendingSession): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');

    const queueItem: SyncQueueItem = {
      local_id: session.local_id,
      session,
      attempts: 0,
      last_attempt: null,
      error: null,
    };

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['sync_queue'], 'readwrite');
      const store = tx.objectStore('sync_queue');
      const request = store.add(queueItem);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get all pending sessions
   */
  async getPendingSessions(): Promise<SyncQueueItem[]> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['sync_queue'], 'readonly');
      const store = tx.objectStore('sync_queue');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Update sync attempt
   */
  async updateSyncAttempt(
    localId: string, 
    success: boolean, 
    error?: string
  ): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['sync_queue'], 'readwrite');
      const store = tx.objectStore('sync_queue');
      const getRequest = store.get(localId);

      getRequest.onsuccess = () => {
        const item: SyncQueueItem = getRequest.result;
        if (!item) {
          reject(new Error('Queue item not found'));
          return;
        }

        if (success) {
          // Remove from queue
          store.delete(localId);
          resolve();
        } else {
          // Increment attempts
          item.attempts += 1;
          item.last_attempt = new Date().toISOString();
          item.error = error || null;
          
          const putRequest = store.put(item);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        }
      };

      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  /**
   * Remove from sync queue (after successful sync)
   */
  async removePendingSession(localId: string): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['sync_queue'], 'readwrite');
      const store = tx.objectStore('sync_queue');
      const request = store.delete(localId);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Save synced session
   */
  async saveSession(session: any): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['sessions'], 'readwrite');
      const store = tx.objectStore('sessions');
      const request = store.put(session);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Get recent sessions (for history/stats)
   */
  async getRecentSessions(limit: number = 20): Promise<any[]> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['sessions'], 'readonly');
      const store = tx.objectStore('sessions');
      const index = store.index('completed_at');
      const request = index.openCursor(null, 'prev');

      const results: any[] = [];
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor && results.length < limit) {
          results.push(cursor.value);
          cursor.continue();
        } else {
          resolve(results);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Cache courses
   */
  async cacheCourses(courses: AgilityCourse[]): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['courses'], 'readwrite');
      const store = tx.objectStore('courses');

      let completed = 0;
      courses.forEach(course => {
        const request = store.put(course);
        request.onsuccess = () => {
          completed++;
          if (completed === courses.length) resolve();
        };
        request.onerror = () => reject(request.error);
      });
    });
  }

  /**
   * Get cached courses
   */
  async getCachedCourses(): Promise<AgilityCourse[]> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['courses'], 'readonly');
      const store = tx.objectStore('courses');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * Clear all data (for testing/reset)
   */
  async clearAll(): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');

    return new Promise((resolve, reject) => {
      const tx = this.db!.transaction(['sync_queue', 'sessions', 'courses'], 'readwrite');
      
      Promise.all([
        new Promise((res, rej) => {
          const req = tx.objectStore('sync_queue').clear();
          req.onsuccess = () => res(undefined);
          req.onerror = () => rej(req.error);
        }),
        new Promise((res, rej) => {
          const req = tx.objectStore('sessions').clear();
          req.onsuccess = () => res(undefined);
          req.onerror = () => rej(req.error);
        }),
        new Promise((res, rej) => {
          const req = tx.objectStore('courses').clear();
          req.onsuccess = () => res(undefined);
          req.onerror = () => rej(req.error);
        }),
      ])
      .then(() => resolve())
      .catch(reject);
    });
  }
}

// Singleton instance
export const agilityStorage = new AgilityStorage();
