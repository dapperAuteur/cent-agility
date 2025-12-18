# Roadmap

## Current: v0.1.0 (Beta)

**Status**: Active development  
**Release**: December 2026

### Completed Features
- ✅ Hub-and-spoke drill functionality
- ✅ User authentication (sign in/sign up)
- ✅ Offline-first architecture with IndexedDB
- ✅ Speed and consistency leaderboards
- ✅ Course diagrams (SVG)
- ✅ Background sync worker
- ✅ Victory card sharing
- ✅ Responsive UI matching CentOS design

---

## Phase 1: Polish & Stability (Q4 2025)

**Focus**: Bug fixes, performance, UX improvements

### Features
- [ ] Dark mode support
- [ ] Loading skeletons for better perceived performance
- [ ] Error boundary improvements with retry logic
- [ ] Improved offline indicators
- [ ] PWA manifest and service worker optimization
- [ ] Audio file compression for faster loads

### Performance
- [ ] Lazy load leaderboard entries (virtualization)
- [ ] Optimize IndexedDB queries (batch operations)
- [ ] Image optimization (WebP, proper sizing)
- [ ] Reduce bundle size (<200kb)

### Testing
- [ ] E2E test coverage >80%
- [ ] Performance benchmarks
- [ ] Cross-browser compatibility testing

---

## Phase 2: Custom Courses (Q1 2026)

**Focus**: User-generated content

### Features
- [ ] Visual course builder with drag-and-drop
- [ ] Save custom courses to profile
- [ ] Share custom courses via URL
- [ ] Community course library
- [ ] Course ratings and favorites
- [ ] Import/export course configurations

### Data Model
```sql
-- New table
CREATE TABLE agility_custom_courses (
  id UUID PRIMARY KEY,
  creator_id UUID REFERENCES users(id),
  name TEXT,
  cone_positions JSONB,
  is_public BOOLEAN,
  usage_count INT,
  average_rating DECIMAL
);
```

---

## Phase 3: Advanced Analytics (Q2 2026)

**Focus**: Performance insights

### Features
- [ ] Fatigue curve analysis (rep-by-rep speed decline)
- [ ] Learning rate tracking (improvement over time)
- [ ] Cone-specific performance heatmaps
- [ ] Comparison with previous sessions
- [ ] Weekly/monthly progress reports
- [ ] Export data to CSV

### Metrics
- Sprint consistency score
- Reaction time trends
- Optimal rest period recommendations
- Peak performance time of day

---

## Phase 4: Biometric Integration (Q3 2026)

**Focus**: Real-time health data

### Integrations
- [ ] Bluetooth heart rate monitors
- [ ] Apple Watch / Wear OS support
- [ ] GPS tracking for outdoor courses
- [ ] Accelerometer for jump detection
- [ ] Integration with Apple Health / Google Fit

### Features
- [ ] Heart rate zones during drills
- [ ] Recovery metrics
- [ ] Training load calculation
- [ ] Readiness score

---

## Phase 5: Social & Teams (2027)

**Focus**: Community engagement

### Features
- [ ] Team challenges (group leaderboards)
- [ ] Coach accounts (assign drills to athletes)
- [ ] Activity feed (see friends' workouts)
- [ ] Training programs (structured plans)
- [ ] Video recording during drills
- [ ] Form analysis with AI

### Team Features
```typescript
interface Team {
  id: string;
  name: string;
  coach_id: string;
  members: string[];
  challenges: Challenge[];
}

interface Challenge {
  course_id: string;
  start_date: Date;
  end_date: Date;
  participants: string[];
}
```

---

## Future Considerations

### AI Features
- Voice commands ("Start drill", "End session")
- Form correction suggestions
- Personalized training recommendations
- Injury risk prediction

### Hardware
- Custom timer device (Raspberry Pi)
- Smart cones with LED indicators
- Pressure mat for start/return detection

### Enterprise
- Organization accounts (schools, sports teams)
- Bulk user management
- Custom branding
- Advanced reporting dashboard

---

## Community Requests

Vote on features: [GitHub Discussions](https://github.com/dapperAuteur/cent-agility/discussions)

**Top Requested:**
1. Custom course builder (63 votes)
2. Heart rate integration (41 votes)
3. Video recording (38 votes)
4. Team challenges (29 votes)

---

## Contribute

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to help build these features.

---

**Updated**: December 2025
