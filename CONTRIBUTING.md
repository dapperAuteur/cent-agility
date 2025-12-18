# Contributing to Agility Engine

## Development Setup

```bash
# Fork and clone
git clone https://github.com/dapperAuteur/cent-agility.git
cd agility-engine

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Add Supabase credentials to .env.local

# Apply database migrations
npx supabase db push

# Run development server
npm run dev
```

---

## Coding Standards

### TypeScript
- **Strict mode** - No `any` without `@ts-expect-error` comment explaining why
- **Explicit return types** for exported functions
- **Interface over type** for object shapes
- **Named exports** preferred

```typescript
// ✅ Good
export interface DrillSession {
  id: string;
  user_id: string;
  total_time_ms: number;
}

export function createSession(config: DrillConfig): DrillSession {
  return { id: crypto.randomUUID(), ...config };
}

// ❌ Avoid
export type DrillSession = { id: string; user_id: string; total_time_ms: number; };
export default function(config: any) { ... }
```

### React Components
- **Functional components** with TypeScript
- **Prop interfaces** with JSDoc
- **Max 200 lines** per component
- **Client components** marked with `'use client'` directive

```typescript
interface CourseMapProps {
  /** Course data with cone positions */
  course: AgilityCourse;
  /** Show distance labels on cones */
  showDistances?: boolean;
  /** Compact mode for smaller displays */
  compact?: boolean;
}

/**
 * SVG visualization of drill course layout
 */
export function CourseMap({ course, showDistances = true, compact = false }: CourseMapProps) {
  // ...
}
```

### File Organization
```
app/agility/
  drill/
    setup/page.tsx
    active/page.tsx
    
components/agility/
  CourseMap.tsx
  CourseMap.test.tsx
  
lib/
  db/agility-storage.ts
  types/agility.types.ts
```

### Comments & Documentation
- **JSDoc** for all exported functions
- **Inline comments** explain "why", not "what"
- **TODO** with issue number: `// TODO(#45): Add pagination`

```typescript
/**
 * Syncs offline queue with Supabase when connection restored
 * @throws {Error} If database operation fails
 */
export async function syncPendingSessions(): Promise<number> {
  // Process oldest first to maintain chronological order
  const sessions = await storage.getPendingSessions();
  // ...
}
```

---

## Git Workflow

### Commits
Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(drill): add custom course builder
fix(leaderboard): prevent duplicate entries for same user
docs(readme): update installation steps for M1 Macs
refactor(storage): extract IndexedDB logic to separate file
test(sync): add offline queue edge cases
```

**Type prefixes:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `refactor`: Code restructuring (no behavior change)
- `test`: Adding/updating tests
- `perf`: Performance improvement
- `chore`: Maintenance tasks

### Branches
```
feature/custom-course-builder
fix/leaderboard-sync-issue
docs/api-reference
refactor/storage-layer
```

### Pull Requests

**Before submitting:**
```bash
npm test                  # All tests pass
npm run type-check        # No TypeScript errors
npm run lint              # No linting errors
npm run build             # Production build succeeds
```

**PR Template:**
```markdown
## What
[Brief description of changes]

## Why
[Problem solved or feature added]

## How
[Implementation approach]

## Testing
- [ ] Added unit tests
- [ ] Added E2E tests (if applicable)
- [ ] Tested offline mode
- [ ] Tested on mobile device

## Screenshots
[If UI changes, attach before/after images]

Closes #123
```

---

## Testing Requirements

### Unit Tests
- **80%+ coverage** for business logic
- **Co-located** with source: `CourseMap.test.tsx`
- **Jest + React Testing Library**

```typescript
// CourseMap.test.tsx
import { render, screen } from '@testing-library/react';
import { CourseMap } from './CourseMap';

describe('CourseMap', () => {
  const mockCourse = {
    id: '1',
    name: '4-Cone Square',
    cone_count: 4,
    cone_positions: [
      { number: 1, distance: 10, angle: 0 },
      { number: 2, distance: 10, angle: 90 },
      { number: 3, distance: 10, angle: 180 },
      { number: 4, distance: 10, angle: 270 },
    ],
  };

  it('renders all cones with correct positions', () => {
    render(<CourseMap course={mockCourse} />);
    expect(screen.getAllByText(/\d/)).toHaveLength(4);
  });

  it('shows distance labels when enabled', () => {
    render(<CourseMap course={mockCourse} showDistances />);
    expect(screen.getByText('10m')).toBeInTheDocument();
  });
});
```

### E2E Tests
- **Critical flows**: Sign up → drill → leaderboard
- **Playwright**
- **Location**: `e2e/` directory

```typescript
// e2e/drill.spec.ts
test('complete drill and see leaderboard entry', async ({ page }) => {
  await page.goto('/agility/auth/signup');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.goto('/agility/drill/setup');
  await page.click('text=4-Cone Square');
  await page.click('text=START DRILL');
  
  // Complete drill...
  
  await page.goto('/agility/leaderboard');
  await expect(page.getByText('test@example.com')).toBeVisible();
});
```

---

## Database Changes

### Migrations
1. **File naming**: `YYYYMMDDHHMMSS_description.sql`
2. **Include rollback** instructions in comments
3. **Test locally** before pushing
4. **Add RLS policies** for new tables

```sql
-- Migration: Add heart rate tracking
-- Created: 2024-12-17
-- Rollback: DROP TABLE agility_heart_rate;

CREATE TABLE agility_heart_rate (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES agility_sessions(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL,
  bpm INT NOT NULL CHECK (bpm BETWEEN 40 AND 220),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_heart_rate_session ON agility_heart_rate(session_id);

-- RLS
ALTER TABLE agility_heart_rate ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own heart rate data"
  ON agility_heart_rate FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM agility_sessions
      WHERE agility_sessions.id = agility_heart_rate.session_id
      AND agility_sessions.user_id = auth.uid()
    )
  );
```

---

## Security Requirements

### Never Commit
- ❌ API keys or secrets
- ❌ `.env` files (use `.env.example` template)
- ❌ User data or PII
- ❌ Database credentials

### Always
- ✅ Validate user input (Zod schemas)
- ✅ Use parameterized queries (Supabase provides this)
- ✅ Enable RLS on new tables
- ✅ Add CSRF protection for mutations
- ✅ Test in incognito mode

```typescript
// ✅ Good - validated input
import { z } from 'zod';

const DrillConfigSchema = z.object({
  sets: z.number().int().min(1).max(10),
  repsPerSet: z.number().int().min(1).max(50),
  restBetweenSets: z.number().int().min(10).max(300),
});

export function configureDrill(input: unknown) {
  const config = DrillConfigSchema.parse(input);
  // ...
}

// ❌ Bad - unvalidated
export function configureDrill(input: any) {
  // Accepts anything
}
```

---

## Code Review Checklist

**Reviewers verify:**
- [ ] Tests pass locally
- [ ] No TypeScript errors
- [ ] Follows coding standards
- [ ] Security best practices
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Accessible (keyboard nav, ARIA)
- [ ] Mobile responsive

**Performance:**
- [ ] No unnecessary re-renders
- [ ] Lazy loading for heavy components
- [ ] Optimized images (WebP, proper sizing)
- [ ] IndexedDB queries batched

---

## Areas Needing Help

### High Priority
- **Custom course builder UI** (Issue #12)
- **Heart rate monitor integration** (Issue #18)
- **E2E test coverage** (Issue #22)

### Good First Issues
- **Add dark mode** (Issue #8)
- **Improve error messages** (Issue #15)
- **Add loading skeletons** (Issue #19)

### Documentation
- **Video tutorials** for setup
- **API reference** for developers
- **Architecture diagrams**

---

## Questions?

- **Issues**: [GitHub Issues](https://github.com/dapperAuteur/cent-agility/issues)
- **Discussions**: [GitHub Discussions](https://github.com/dapperAuteur/cent-agility/discussions)
- **Email**: dev@awews.com

---

## Recognition

Contributors listed in:
- `README.md` (Contributors section)
- Release notes
- Git commit history

Thank you for contributing! 🎉
