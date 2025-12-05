# Architecture Improvements - Portfolio & CMS

## Tổng quan

Document này mô tả các cải thiện về kiến trúc đã được triển khai cho cả Portfolio frontend và CMS.

## CMS Architecture Improvements

### 1. Custom Hooks

#### `useApiMutation` - Hook cho mutations (POST, PUT, DELETE)
- **Location**: `cms/src/hooks/useApiMutation.ts`
- **Features**:
  - Automatic timeout handling
  - Error handling với toast notifications
  - Success callbacks và redirects
  - Loading states
- **Usage**:
```typescript
const { mutate, loading, error } = useApiMutation(
  '/api/specializations',
  'POST',
  {
    successMessage: 'Created successfully!',
    redirectTo: '/dashboard/specializations',
  }
)

await mutate(formData)
```

#### `useApiQuery` - Hook cho queries (GET)
- **Location**: `cms/src/hooks/useApiQuery.ts`
- **Features**:
  - Automatic data fetching
  - Loading và error states
  - Timeout handling
  - Refetch capability
- **Usage**:
```typescript
const { data, loading, error, refetch } = useApiQuery<Specialization>(
  `/api/specializations/${id}`
)
```

### 2. Shared Components

#### `ErrorAlert` - Reusable error display
- **Location**: `cms/src/components/ErrorAlert.tsx`
- **Features**: Consistent error UI với animations

#### `FormField` - Reusable form field wrapper
- **Location**: `cms/src/components/FormField.tsx`
- **Features**: Label, required indicator, error display

#### `FormSection` - Form section wrapper
- **Location**: `cms/src/components/FormSection.tsx`
- **Features**: Consistent section styling

### 3. Centralized API Client

#### `apiClient` - Centralized API client
- **Location**: `cms/src/lib/apiClient.ts`
- **Features**:
  - Consistent error handling
  - Automatic timeout
  - Auth handling
  - Type-safe methods (get, post, put, delete)
- **Usage**:
```typescript
import { apiClient } from '@/lib/apiClient'

const data = await apiClient.get<Specialization[]>('/api/specializations')
const result = await apiClient.post('/api/specializations', formData)
```

### 4. Centralized Types

#### API Types
- **Location**: `cms/src/types/api.ts`
- **Exports**: `HeroContent`, `Project`, `Experience`, `Specialization`, `Skill`, `ApiError`, `ApiResponse`
- **Usage**: Import từ `@/types/api` hoặc `@/types` (re-exported)

### 5. Code Organization

#### Before (Issues):
- ❌ Duplicate error handling logic in every form
- ❌ Inconsistent timeout handling
- ❌ Repeated loading/error state management
- ❌ Scattered type definitions
- ❌ No shared form components

#### After (Improvements):
- ✅ Reusable hooks for common patterns
- ✅ Consistent error handling
- ✅ Shared components for forms
- ✅ Centralized types
- ✅ Cleaner, more maintainable code

## Portfolio Frontend Architecture

### Current Structure
```
apps/portfolio/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── config/        # Configuration
│   ├── contexts/      # React contexts
│   ├── hooks/         # Custom hooks
│   └── translations/  # i18n translations
```

### Recommendations

1. **API Services**: 
   - ✅ Good: `experienceService.js` exists
   - ⚠️ Consider: Create services for other entities (Hero, Skills, Portfolio)
   - ⚠️ Consider: Centralize error handling in services

2. **Error Handling**:
   - ⚠️ Current: `console.error` in services
   - ✅ Recommended: Add error boundary components
   - ✅ Recommended: User-friendly error messages

3. **Code Organization**:
   - ✅ Good: Clear separation of concerns
   - ✅ Good: Component-based architecture
   - ⚠️ Consider: Extract common patterns into hooks

4. **Type Safety**:
   - ⚠️ Current: JavaScript (no types)
   - ✅ Recommended: Consider migrating to TypeScript for better type safety

## Migration Guide

### Refactoring Dashboard Pages

#### Before:
```typescript
const [loading, setLoading] = useState(false)
const [error, setError] = useState<string | null>(null)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 15000)
  
  try {
    const response = await fetchWithAuth('/api/endpoint', {
      method: 'POST',
      body: JSON.stringify(data),
      signal: controller.signal,
    })
    // ... error handling
  } catch (err) {
    // ... duplicate error handling
  } finally {
    setLoading(false)
  }
}
```

#### After:
```typescript
const { mutate, loading, error } = useApiMutation(
  '/api/endpoint',
  'POST',
  {
    successMessage: 'Success!',
    redirectTo: '/dashboard',
  }
)

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  await mutate(formData)
}
```

## Best Practices

### 1. Use Custom Hooks
- ✅ Use `useApiMutation` for POST/PUT/DELETE
- ✅ Use `useApiQuery` for GET requests
- ✅ Avoid manual fetch calls in components

### 2. Use Shared Components
- ✅ Use `ErrorAlert` for error display
- ✅ Use `FormField` and `FormSection` for forms
- ✅ Avoid duplicating form structure

### 3. Type Safety
- ✅ Import types from `@/types/api`
- ✅ Use TypeScript interfaces for all API responses
- ✅ Avoid `any` types

### 4. Error Handling
- ✅ Let hooks handle errors automatically
- ✅ Use toast notifications for user feedback
- ✅ Avoid manual error state management

## Next Steps

1. **Refactor remaining pages** to use new hooks and components
2. **Add error boundaries** for better error handling
3. **Create more shared components** as patterns emerge
4. **Consider TypeScript migration** for Portfolio frontend
5. **Add unit tests** for hooks and utilities

## Files Created/Modified

### New Files:
- `cms/src/hooks/useApiMutation.ts`
- `cms/src/hooks/useApiQuery.ts`
- `cms/src/components/ErrorAlert.tsx`
- `cms/src/components/FormField.tsx`
- `cms/src/components/FormSection.tsx`
- `cms/src/lib/apiClient.ts`
- `cms/src/types/api.ts`

### Modified Files:
- `cms/src/types/index.ts` - Re-exports API types
- `cms/src/app/dashboard/specializations/new/page.tsx` - Refactored example
- `cms/src/app/dashboard/specializations/[id]/edit/page.tsx` - Refactored example

## Summary

Kiến trúc đã được cải thiện với:
- ✅ Reusable hooks cho common patterns
- ✅ Shared components cho consistency
- ✅ Centralized API client
- ✅ Type safety với centralized types
- ✅ Cleaner, more maintainable code

Codebase giờ đây dễ maintain hơn, có ít duplication hơn, và dễ extend hơn.

