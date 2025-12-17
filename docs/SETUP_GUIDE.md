# Agility Engine - Setup Guide

## Phase 1 MVP Complete Files

### Created Files
```
lib/types/agility.types.ts          - TypeScript types
lib/db/agility-storage.ts            - IndexedDB wrapper
lib/sync/agility-sync-worker.ts      - Background sync
app/agility/drill/setup/page.tsx     - Drill configuration
app/agility/drill/active/page.tsx    - Active drill screen
app/agility/drill/complete/page.tsx  - Victory card
app/agility/leaderboard/page.tsx     - Leaderboard rankings
```

---

## 1. Database Setup

### Apply Migration
```bash
cd your-centos-project
cp agility_engine_migration.sql supabase/migrations/20241216_agility_engine.sql
supabase db push
```

### Verify Tables
```bash
supabase db diff
```

Should show:
- agility_courses (with 3 seeded courses)
- agility_sessions
- agility_reps
- agility_leaderboard
- user_profiles extended with agility columns

---

## 2. Audio Files (Your Voice)

### Record These Files
You need to record audio for each cone number:

**Files to create:**
- `public/audio/cone-1.mp3`
- `public/audio/cone-2.mp3`
- `public/audio/cone-3.mp3`
- `public/audio/cone-4.mp3`
- `public/audio/cone-5.mp3`
- `public/audio/cone-6.mp3`

**Recording specs:**
- Format: MP3
- Sample rate: 44.1 kHz
- Bit rate: 128 kbps minimum
- Duration: 0.5-1 second each
- Tone: Urgent, commanding

**Script:**
- File 1: "Cone one!"
- File 2: "Cone two!"
- File 3: "Cone three!"
- File 4: "Cone four!"
- File 5: "Cone five!"
- File 6: "Cone six!"

### Recording Tools
- **Mac:** QuickTime Player → File → New Audio Recording
- **Windows:** Voice Recorder app
- **Mobile:** Voice Memos (iOS) or Voice Recorder (Android)

### Convert to MP3
If recorded in another format:
```bash
# Using ffmpeg
ffmpeg -i cone-1.m4a -codec:a libmp3lame -b:a 128k public/audio/cone-1.mp3
```

---

## 3. Update Active Drill to Use Audio Files

Replace the `speakCone` function in `app/agility/drill/active/page.tsx`:

```typescript
const speakCone = useCallback((coneNumber: number) => {
  // Play pre-recorded audio
  const audio = new Audio(`/audio/cone-${coneNumber}.mp3`);
  audio.volume = 1.0;
  audio.play().catch(error => {
    console.error('Audio playback failed:', error);
  });
}, []);
```

---

## 4. Initialize Storage & Sync

### Create App Initialization File
`app/layout.tsx` (or add to existing):

```typescript
'use client';

import { useEffect } from 'react';
import { agilityStorage } from '@/lib/db/agility-storage';
import { syncWorker } from '@/lib/sync/agility-sync-worker';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize IndexedDB
    agilityStorage.init().then(() => {
      console.log('[Agility] Storage initialized');
    });

    // Initialize sync worker
    syncWorker.init(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    syncWorker.start();

    return () => {
      syncWorker.stop();
    };
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

---

## 5. Environment Variables

Ensure these exist in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 6. Navigation Integration

### Add to CentOS Navigation
`app/dashboard/layout.tsx` or navigation component:

```tsx
<NavLink href="/agility/drill/setup">
  ⚡ Agility Engine
</NavLink>
```

---

## 7. Testing Checklist

### Anonymous User Flow
- [ ] Open `/agility/drill/setup`
- [ ] Select "4-Cone Square"
- [ ] Configure: 2 sets × 5 reps
- [ ] Start drill
- [ ] Complete all reps
- [ ] See victory card
- [ ] Check IndexedDB has pending session
- [ ] Go online → session syncs to Supabase
- [ ] Verify leaderboard shows entry

### Offline Mode
- [ ] Enable airplane mode
- [ ] Complete drill
- [ ] Data saved to IndexedDB
- [ ] Disable airplane mode
- [ ] Session automatically syncs within 30s

### Audio Playback
- [ ] Press START button
- [ ] Hear cone number called out
- [ ] Audio clear and loud enough outdoors

---

## 8. Known Issues & Solutions

### Issue: Audio doesn't play
**Cause:** Browser autoplay policy blocks audio without user interaction.
**Fix:** Audio plays after first button press (START button activates AudioContext).

### Issue: Timer stops when screen sleeps
**Solution:** Install NoSleep.js
```bash
npm install nosleep.js
```

Then in `active/page.tsx`:
```typescript
import NoSleep from 'nosleep.js';

const noSleep = new NoSleep();

// In handleReady function
noSleep.enable();

// In useEffect cleanup
return () => noSleep.disable();
```

### Issue: IndexedDB quota exceeded
**Cause:** Browser storage limit (usually 50-100 MB).
**Fix:** Auto-cleanup old sessions after 30 days.

---

## 9. Production Optimizations

### Service Worker for True PWA
Create `public/sw.js`:
```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('agility-v1').then((cache) => {
      return cache.addAll([
        '/audio/cone-1.mp3',
        '/audio/cone-2.mp3',
        '/audio/cone-3.mp3',
        '/audio/cone-4.mp3',
        '/audio/cone-5.mp3',
        '/audio/cone-6.mp3',
      ]);
    })
  );
});
```

### Web App Manifest
Create `public/manifest.json`:
```json
{
  "name": "Agility Engine",
  "short_name": "Agility",
  "description": "Reaction speed training",
  "start_url": "/agility/drill/setup",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#84cc16",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## 10. Next Steps (Post-MVP)

### Phase 2 Features
- [ ] Custom course builder with visual editor
- [ ] Video recording during drill for form analysis
- [ ] GPS tracking for outdoor courses
- [ ] Bluetooth heart rate monitor integration
- [ ] Team challenges and group leaderboards
- [ ] Advanced analytics (fatigue curves, learning rate)

### Content Creation Hooks
- [ ] Podcast episode: "Building Agility Engine"
- [ ] Blog post: "Offline-First PWA Architecture"
- [ ] YouTube demo: "How I Test My Reaction Speed"
- [ ] Twitter thread: "Why Hub-and-Spoke Drills Work"

### CentOS Integration
- [ ] Link drills to fitness goals
- [ ] Track correlation: sprint training → focus time
- [ ] Financial tracking: equipment costs
- [ ] Schedule recurring drill sessions

---

## Deployment

```bash
# Build
npm run build

# Test production build locally
npm run start

# Deploy to Vercel
vercel --prod
```

---

## Support

### Database Issues
```bash
# Reset tables
supabase db reset

# Re-apply migration
supabase db push
```

### Clear Local Data
Open DevTools Console:
```javascript
// Clear IndexedDB
indexedDB.deleteDatabase('agility_engine_db');

// Clear sessionStorage
sessionStorage.clear();
```

---

## File Structure

```
your-project/
├── app/
│   └── agility/
│       ├── drill/
│       │   ├── setup/page.tsx       - Configuration
│       │   ├── active/page.tsx      - Live drill
│       │   └── complete/page.tsx    - Victory card
│       └── leaderboard/page.tsx     - Rankings
├── lib/
│   ├── types/agility.types.ts       - TypeScript types
│   ├── db/agility-storage.ts        - IndexedDB
│   └── sync/agility-sync-worker.ts  - Sync logic
├── public/
│   └── audio/
│       ├── cone-1.mp3
│       ├── cone-2.mp3
│       ├── cone-3.mp3
│       ├── cone-4.mp3
│       ├── cone-5.mp3
│       └── cone-6.mp3
└── supabase/
    └── migrations/
        └── 20241216_agility_engine.sql
```

All core files created. Record audio files and test.
