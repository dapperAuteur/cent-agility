# Agility Engine + CentOS Integration Guide

## Database Architecture

### New Tables
```
agility_courses          → Official + custom cone layouts
agility_sessions         → Individual training sessions
agility_reps             → Per-sprint timing data
agility_leaderboard      → Denormalized for fast queries
```

### CentOS Integration Points

**1. User Management** (Shared)
```sql
auth.users              → Single sign-on
user_profiles           → Extended with agility_username, stats
```

**2. Goal Tracking** (Optional Links)
```sql
agility_sessions.task_id    → Link drill to daily task
agility_sessions.goal_id    → Link to fitness goal
```

**3. Analytics** (Cross-Module)
```sql
-- Example: Sprint training impact on focus time
SELECT 
  a.completed_at::date,
  COUNT(a.id) as sprint_sessions,
  SUM(f.duration) as focus_minutes
FROM agility_sessions a
LEFT JOIN focus_sessions f ON f.user_id = a.user_id 
  AND f.start_time::date = a.completed_at::date
GROUP BY a.completed_at::date;
```

## Key Features

### Offline-First Strategy
1. **IndexedDB** stores sessions locally
2. **Service Worker** queues writes when offline
3. **Background Sync** pushes to Supabase when online
4. `synced_at` column tracks sync status

### Leaderboard Anti-Cheat
- **Only official courses** appear on leaderboard (`is_official = true`)
- **Server-side validation** via triggers (can't fake via client)
- **Custom courses** excluded (`is_ranked = false`)
- Users can still share victory cards from custom courses

### Anonymous Users
- Can use app without account
- Data stored in IndexedDB only
- **Upgrade path**: When creating account, all local sessions migrate to Supabase
- Warning shown after 5 sessions: "Create account to prevent data loss"

## Security Model

### Row-Level Security (RLS)
```sql
-- Users own their data
agility_sessions: WHERE auth.uid() = user_id

-- Public profiles opt-in
agility_sessions SELECT: WHERE user_profiles.agility_profile_public = true

-- Leaderboard read-only
agility_leaderboard: Anyone SELECT, only triggers INSERT/UPDATE
```

### Sensitive Data Handling
- No PII in `agility_reps` (just timing data)
- Profile images stored in Supabase Storage (separate bucket)
- Victory cards generated client-side (no server upload of images)

## Data Flow

### Session Creation (Offline)
```
1. User completes drill
2. Write to IndexedDB: sessions_queue
3. UI shows "Syncing..." indicator
4. Background worker checks network every 30s
5. When online: POST to Supabase
6. Mark local record as synced
```

### Leaderboard Update (Automatic)
```
1. User finishes ranked session
2. INSERT into agility_sessions (is_ranked = true)
3. Trigger: update_agility_leaderboard() fires
4. Calculates best times per cone
5. UPSERTS into agility_leaderboard
6. Updates user_profiles.agility_total_sessions
```

## Migration Instructions

### 1. Apply Schema
```bash
# In your Supabase project
supabase db push agility_engine_migration.sql
```

### 2. Verify Tables
```sql
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename LIKE 'agility_%';
```

Should return:
- agility_courses
- agility_sessions
- agility_reps
- agility_leaderboard

### 3. Seed Official Courses
Already included in migration:
- 4-Cone Square (10m x 10m)
- 3-Cone Triangle (8m sides)
- 5-Cone Pentagon (6m radius)

### 4. Test User Profile Extension
```sql
SELECT 
  user_id,
  agility_username,
  agility_profile_public,
  agility_total_sessions
FROM user_profiles
WHERE user_id = auth.uid();
```

## TypeScript Types

```typescript
// Auto-generated from Supabase schema
interface AgilityCourse {
  id: string;
  name: string;
  cone_count: number;
  cone_positions: ConePosition[];
  is_official: boolean;
}

interface AgilitySession {
  id: string;
  user_id: string;
  course_id: string;
  task_id?: string; // CentOS link
  goal_id?: string; // CentOS link
  sets: number;
  reps_per_set: number;
  total_time_ms: number;
  is_ranked: boolean;
  completed_at: string;
  synced_at?: string;
}

interface AgilityRep {
  session_id: string;
  rep_number: number;
  target_cone: number;
  start_delay_ms: number;
  sprint_time_ms: number;
}
```

## Next Implementation Steps

1. **IndexedDB wrapper** (`/lib/db/agility-storage.ts`)
2. **Sync queue** (`/lib/sync/agility-sync-worker.ts`)
3. **Audio files** (`/public/audio/cone-1.mp3` ... `cone-6.mp3`)
4. **Drill UI** (`/app/agility/drill/page.tsx`)
5. **Victory card generator** (`/components/agility/VictoryCard.tsx`)
6. **Leaderboard** (`/app/agility/leaderboard/page.tsx`)

## Testing Checklist

- [ ] Anonymous user can complete drill
- [ ] Data persists after browser close
- [ ] Offline mode works (airplane mode test)
- [ ] Sync works when returning online
- [ ] Account creation migrates local data
- [ ] Leaderboard only shows ranked sessions
- [ ] Custom courses excluded from leaderboard
- [ ] Victory card shares to social media
- [ ] RLS policies prevent unauthorized access

## Cost Estimates (Supabase)

### Storage
- ~1 KB per session
- ~100 bytes per rep
- 1000 sessions = ~1 MB
- Negligible cost on free tier

### Database Operations
- Session insert: 1 write
- Reps insert: 10-30 writes per session
- Leaderboard update: 1-2 writes (trigger)
- Free tier: 500 MB + 2 GB bandwidth

### Expected Usage (MVP)
- 10 users × 3 sessions/week × 20 reps = 600 writes/week
- Well within free tier limits
