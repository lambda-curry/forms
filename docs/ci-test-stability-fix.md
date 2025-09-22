# CI/CD Test Stability Fix for Select Component Stories

## Problem
The Storybook test-runner was failing in CI environments but passing locally for the `CreatableOption` story in `select.stories.tsx`. The failure occurred when trying to find portaled dropdown elements with timeouts.

## Root Cause
**Race conditions in CI environments** where:
1. Portaled dropdown content (rendered in `document.body`) takes longer to mount
2. Search input elements inside portals aren't immediately available
3. CI environments are inherently slower than local development

## Solution
### 1. Added Explicit Timing Controls
```typescript
// Wait for portal content to stabilize before interaction
await new Promise(resolve => setTimeout(resolve, 200));
```

### 2. Extended Test-Runner Configuration
Created `.storybook/test-runner.js`:
- Increased test timeout from 15s to 30s
- Added custom setup file for testing-library configuration

Created `.storybook/test-runner-setup.js`:
- Extended `asyncUtilTimeout` from 1s to 10s for `findBy*` queries

### 3. Enhanced Async Handling in Tests
**Before:**
```typescript
const listbox = await within(document.body).findByRole('listbox');
const input = await within(document.body).findByPlaceholderText('Search...');
```

**After:**
```typescript
const listbox = await within(document.body).findByRole('listbox');
await new Promise(resolve => setTimeout(resolve, 200)); // Stabilization delay
const input = await within(document.body).findByPlaceholderText('Search...');
```

## Files Modified
1. `apps/docs/src/remix-hook-form/select.stories.tsx` - Added stabilization delays
2. `apps/docs/.storybook/test-runner.js` - Extended timeouts
3. `apps/docs/.storybook/test-runner-setup.js` - Testing-library config

## Why This Works
- **Predictable timing**: Explicit delays ensure portal content is ready
- **CI-friendly timeouts**: Longer timeouts accommodate slower CI environments  
- **Minimal changes**: Only adds small delays where portal interaction occurs
- **Maintains test integrity**: Tests still verify the same functionality

## Best Practices for Future Portal Testing
1. Always add small delays after finding portal elements
2. Use `findBy*` queries for portal content (they have built-in waiting)
3. Consider CI environment speed differences when setting timeouts
4. Test locally with network throttling to simulate CI conditions

## Verification
The fix addresses the specific timeout error that was occurring at line 516 and 519 in the failing CI run, where `findByRole('listbox')` and `findByPlaceholderText('Search...')` were timing out.