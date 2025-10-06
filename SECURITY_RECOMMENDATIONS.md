# Security & Best Practices Recommendations

## Problems Found & Fixed

### 1. ✅ FIXED: Aggressive Client-Side Caching
**Problem**: User data, projects, and tasks were cached in IndexedDB/localStorage and loaded immediately on page reload BEFORE session validation.

**Fix Applied**:
- Modified `useServiceProject.ts` to fetch from server FIRST
- Modified `useGetTask.ts` to disable automatic cache loading
- Cache is now only used as fallback when network fails
- Cache is cleared on authentication errors (401, 403, 440)

### 2. ✅ FIXED: Cache Not Cleared on Logout
**Problem**: Logout only cleared tokens, but left user data and application data in browser storage.

**Fix Applied** (`apps/frontend/app/sign-out/Signout.tsx`):
```typescript
- localforage.clear()
- clearAllGoalieToken()
- clearGoalieUser()
+ localStorage.clear()      // Added
+ sessionStorage.clear()    // Added
```

### 3. ✅ FIXED: No Cache Invalidation on Auth Errors
**Problem**: When server returned 401/403, old cached data remained accessible.

**Fix Applied** (`apps/frontend/services/_req.ts`):
- Added axios interceptor to clear ALL caches on 401/403/440 responses
- Automatically redirects to login after clearing caches

### 4. ⚠️ PARTIALLY ADDRESSED: Sensitive Data in localStorage

**Current State**:
The application stores sensitive data in localStorage:
- User object (`GOALIE_USER`)
- JWT tokens (`GOALIE_JWT_TOKEN`)
- Refresh tokens (`GOALIE_REFRESH_TOKEN`)
- Organization data (`GOALIE_ORG`)

**Why This Is Bad**:
- localStorage is accessible by any JavaScript running on the page (XSS vulnerability)
- Data persists indefinitely
- No encryption
- Accessible across browser tabs

**Recommended Fix** (Requires Backend Changes):
1. **Move tokens to httpOnly cookies** (prevents JavaScript access)
2. **Store user data in memory only** (cleared on page reload)
3. **Use sessionStorage as fallback** (cleared when browser closes)

**Short-term Mitigation** (Already Implemented):
- Clear all storage on logout ✅
- Clear all storage on auth errors ✅
- Validate session before using cached data ✅
- Added cache utility with TTL support ✅

## Best Practices Implementation

### Cache Strategy (Network-First)
```
1. Request data from server
2. If success: Update cache + UI
3. If fail: Try cache as fallback
4. If auth error: Clear ALL caches + redirect to login
```

### Cache Utilities
New file: `packages/core/src/client/storage/cache-utils.ts`

Features:
- `clearAllCaches()` - Clear everything
- `setCacheItem()` - Set with optional TTL
- `getCacheItem()` - Get with expiry check
- `clearCacheByPattern()` - Clear by pattern (e.g., 'PROJECT_*')
- `getCacheStats()` - Debug cache usage

### Usage Example
```typescript
import { setCacheItem, getCacheItem } from '@/packages/core/src/client/storage/cache-utils'

// Set with 1 hour TTL
await setCacheItem('projects', data, 60 * 60 * 1000)

// Get (returns null if expired)
const projects = await getCacheItem('projects')
```

## Remaining Security Concerns

### 1. Token Storage (High Priority)
**Issue**: JWT tokens in localStorage are vulnerable to XSS attacks.

**Recommendation**:
- Backend: Set tokens as httpOnly, secure, SameSite cookies
- Frontend: Remove token storage from localStorage
- Use `/api/me` endpoint to get user info on page load

### 2. No CSRF Protection
**Issue**: No visible CSRF token implementation.

**Recommendation**:
- Implement CSRF tokens for state-changing requests
- Or use SameSite cookies (requires backend change)

### 3. No Content Security Policy
**Issue**: No CSP headers to prevent XSS.

**Recommendation**:
Add CSP headers in `next.config.js`:
```javascript
headers: async () => [
  {
    source: '/:path*',
    headers: [
      {
        key: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; ..."
      }
    ]
  }
]
```

### 4. Refresh Token Rotation
**Issue**: Refresh tokens don't appear to rotate.

**Recommendation**:
- Implement refresh token rotation
- Invalidate old refresh token on use
- Detect refresh token reuse (possible attack)

## Testing the Fixes

### Test 1: Database Reset + Logout
```bash
# Reset database
yarn prisma migrate reset --schema=./packages/database/src/prisma/schema.prisma

# Open browser, verify:
# 1. Page redirects to /sign-in
# 2. No errors in console
# 3. IndexedDB is empty
# 4. localStorage is empty
```

### Test 2: Session Expiry
```bash
# 1. Login
# 2. Delete JWT token from localStorage
# 3. Reload page
# Expected: Redirect to /sign-in, all caches cleared
```

### Test 3: Network-First Loading
```bash
# 1. Login
# 2. Open project
# 3. Check Network tab - should see API requests BEFORE UI renders
# Expected: Fresh data loaded from server first
```

## Summary

✅ **Fixed**:
- Cache cleared on logout
- Cache cleared on auth errors
- Network-first loading strategy
- Cache invalidation on session expiry

⚠️ **Still Needs Work**:
- Move tokens to httpOnly cookies (requires backend changes)
- Add CSRF protection
- Add CSP headers
- Implement refresh token rotation

The current fixes significantly improve security and prevent the original issue (cached data showing after database reset). However, for production use, implementing the remaining recommendations is strongly advised.
