---
paths:
  - "**/__tests__/**"
  - "e2e/**"
  - "**/*.test.ts"
  - "**/*.spec.ts"
---

# Testing Rules

## Test Organization

```
apps/api/src/routes/__tests__/    # API route tests (Vitest)
apps/api/src/services/__tests__/  # Service logic tests (Vitest)
packages/shared/validations/__tests__/  # Zod schema tests (Vitest)
e2e/                              # Playwright E2E tests
e2e/accessibility/                # axe-core accessibility tests
```

## Testing Stack

| Layer | Tool | Scope |
|-------|------|-------|
| API routes | Vitest + `app.request()` | Full HTTP request → response through Hono |
| Services | Vitest | Business logic in isolation |
| Validations | Vitest | Zod schema parsing with valid/invalid/edge inputs |
| E2E | Playwright | Critical user flows through the browser |
| Accessibility | axe-playwright | WCAG 2.1 AA on all pages |

## Vitest Patterns

### API Route Test
```typescript
import { describe, it, expect } from 'vitest';
import { app } from '../../index';

describe('GET /api/v2/assets', () => {
  it('returns paginated list', async () => {
    const res = await app.request('/api/v2/assets');
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('meta.total');
  });
});
```

### Zod Schema Test
```typescript
describe('createAssetSchema', () => {
  it('accepts valid input', () => { /* ... */ });
  it('rejects missing required fields', () => { /* ... */ });
  it('rejects invalid types', () => { /* ... */ });
  it('trims whitespace', () => { /* ... */ });
});
```

## Playwright Patterns

### Page Test
```typescript
import { test, expect } from '@playwright/test';

test('asset list loads', async ({ page }) => {
  await page.goto('/assets');
  await expect(page.locator('table')).toBeVisible();
});
```

### Accessibility Test
```typescript
import AxeBuilder from '@axe-core/playwright';

test('no critical a11y violations', async ({ page }) => {
  await page.goto('/assets');
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  expect(results.violations.filter(v => v.impact === 'critical')).toHaveLength(0);
});
```

## Coverage Targets

- **API routes**: Every endpoint tested (happy path + error cases)
- **Zod schemas**: Every schema tested (valid + invalid + edge)
- **E2E**: Asset CRUD flow, dashboard load, search, navigation
- **Accessibility**: Every new page scanned

## Rules

1. **Co-locate unit tests** — `__tests__/` next to the code being tested
2. **E2E in `e2e/`** — organized by feature area
3. **Test contracts, not internals** — test inputs and outputs, not implementation
4. **Mock data is the test fixture** — tests run against mock providers (no DB needed)
5. **Tests must pass in CI** — `pnpm test` in the GitHub Actions pipeline
