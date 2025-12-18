# ⚡ Agility Engine

**Reaction speed training app with offline support, leaderboards, and progress tracking.**

Test and improve your agility through timed cone drills. Built as an offline-first PWA for real-world training environments where internet isn't guaranteed.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)

---

## ✨ Features

### 🏃 Hub-and-Spoke Drills
- React to audio cues calling random cone numbers
- Sprint to cone and return to center
- Configurable sets, reps, and rest periods
- Random start delays test reaction time

### 📊 Performance Tracking
- **Speed Rankings**: Fastest total session times
- **Consistency Rankings**: Most consistent sprint times across reps
- **Per-Cone Analysis**: Identify which cones are fastest/slowest
- **Historical Trends**: Track improvement over time

### 🏆 Leaderboards
- Official courses with standardized cone layouts
- Separate speed and consistency leaderboards
- User profiles with avatars and stats
- Anonymous training without account

### 📡 Offline-First
- Train anywhere - park, gym, beach
- Data stored locally via IndexedDB
- Automatic sync when connection returns
- No data loss from network issues

### 🎨 Visual Course Maps
- SVG diagrams show cone positions and distances
- Appears on setup, victory cards, and leaderboard
- Helps users set up physical courses accurately

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Installation

```bash
# Clone repository
git clone https://github.com/dapperAuteur/cent-agility.git
cd cent-agility

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Configure Supabase credentials in .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Database Setup

```bash
# Apply migrations
npx supabase db push

# Verify tables created
npx supabase db diff
```

Expected tables:
- `agility_courses` (official + custom courses)
- `agility_sessions` (completed drills)
- `agility_reps` (individual sprint data)
- `agility_leaderboard` (rankings)

### Audio Files

Record 6 audio files (MP3 format) saying "Cone one" through "Cone six":

```
public/audio/cone-1.mp3
public/audio/cone-2.mp3
public/audio/cone-3.mp3
public/audio/cone-4.mp3
public/audio/cone-5.mp3
public/audio/cone-6.mp3
```

**Recording specs:**
- Duration: 0.5-1 second each
- Format: MP3, 128 kbps
- Tone: Clear, commanding voice

### Run Development Server

```bash
npm run dev
```

Navigate to `http://localhost:3000/agility/drill/setup`

---

## 🏗️ Architecture

### Tech Stack
- **Frontend**: Next.js 14, React, TypeScript
- **Database**: Supabase (PostgreSQL + Realtime)
- **Styling**: Tailwind CSS
- **Offline Storage**: IndexedDB via custom wrapper
- **Auth**: Supabase Auth (email/password)
- **Deployment**: Vercel

### Project Structure
```
cent-agility/
├── app/
│   └── agility/
│       ├── layout.tsx              # Auth provider + nav
│       ├── auth/                   # Sign in/up pages
│       ├── drill/
│       │   ├── setup/              # Course config
│       │   ├── active/             # Live drill screen
│       │   └── complete/           # Victory card
│       └── leaderboard/            # Rankings
├── components/
│   └── agility/
│       ├── AgilityNav.tsx          # Navigation header
│       └── CourseMap.tsx           # SVG cone diagrams
├── lib/
│   ├── auth/
│   │   └── auth-context.tsx        # Auth provider
│   ├── db/
│   │   └── agility-storage.ts      # IndexedDB wrapper
│   ├── sync/
│   │   └── agility-sync-worker.ts  # Background sync
│   └── types/
│       └── agility.types.ts        # TypeScript types
├── public/
│   └── audio/                      # Cone audio files
└── supabase/
    └── migrations/                 # Database schema
```

### Data Flow

**Offline Mode:**
```
1. User completes drill
2. Session saved to IndexedDB
3. Sync worker checks network every 30s
4. When online, uploads to Supabase
5. Triggers leaderboard update
```

**Leaderboard Update:**
```
1. Session inserted into agility_sessions
2. Database trigger calculates best times
3. Upserts agility_leaderboard entry
4. Updates user_profiles stats
```

---

## 🎮 Usage

### Creating a Drill

1. Navigate to `/agility/drill/setup`
2. Select official course (for leaderboard) or create custom
3. Configure sets, reps, rest periods
4. Set random start delay range (2-5s recommended)
5. Click "START DRILL"

### Running a Drill

1. Place cones according to course diagram
2. Stand at center (start position)
3. Press START when ready
4. Wait for random delay
5. Audio calls "Cone X" - sprint to that cone
6. Return to center, press RETURN button
7. Repeat for all reps
8. Rest between sets (automatic countdown)

### Viewing Results

- **Victory Card**: Shows immediately after completion
- **Leaderboard**: Compare with others on same course
- **Profile**: View personal best times and consistency

---

## 📱 Progressive Web App

Install on mobile for full-screen experience:

**iOS:**
1. Open in Safari
2. Tap Share → Add to Home Screen

**Android:**
1. Open in Chrome
2. Tap Menu → Add to Home Screen

**Features:**
- Offline functionality
- No address bar
- Fast launch
- Background sync

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint

# E2E tests (requires running dev server)
npm run test:e2e
```

### Test Coverage
- Unit tests: 80%+ for business logic
- Integration tests: Critical user flows
- E2E tests: Full drill completion, leaderboard sync

---

## 🔒 Security

### Authentication
- Email/password via Supabase Auth
- Optional anonymous usage (no leaderboard)
- Row-level security on all tables

### Data Privacy
- PII stored only in `user_profiles` table
- Drill data contains no sensitive info
- Optional public profiles (default: private)

### Reporting Vulnerabilities
Email **security@yourdomain.com** with:
- Description of vulnerability
- Steps to reproduce
- Potential impact

---

## 🛣️ Roadmap

- [x] Phase 1: Core drill functionality
- [x] Phase 2: Auth and leaderboards
- [x] Phase 3: Offline sync
- [x] Phase 4: Course diagrams
- [ ] Phase 5: Custom course builder
- [ ] Phase 6: Video recording during drills
- [ ] Phase 7: Heart rate monitor integration
- [ ] Phase 8: Team challenges

See [ROADMAP.md](./ROADMAP.md) for detailed plans.

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for:
- Development setup
- Coding standards
- Git workflow
- Testing requirements

**Good First Issues:** Look for `good-first-issue` label on GitHub

---

## 📄 License

MIT License - see [LICENSE](./LICENSE)

Copyright (c) 2025 Anthony McDonald

---

## 🙏 Acknowledgments

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Database and auth
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

Inspired by:
- [Cent OS](https://github.com/dapperAuteur/centenarian-os) - Parent project
- Sports performance apps like Freeletics, Nike Training Club

---

## 📞 Contact

- **Issues**: [GitHub Issues](https://github.com/dapperAuteur/cent-agility/issues)
- **Discussions**: [GitHub Discussions](https://github.com/dapperAuteur/cent-agility/discussions)
- **Email**: contact@yourdomain.com

---

**Status**: Beta | **Version**: 0.2.0 | **Last Updated**: December 2024