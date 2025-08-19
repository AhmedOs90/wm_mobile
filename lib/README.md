# API Client Migration Guide

This document explains how to use the new global API client and the migration from the old `apiClient`.

## Overview

We've migrated from the old `apiClient` in `src/lib/apiClient.ts` to a new global client system that integrates with the OpenAPI-generated SDK. The new system provides:

- **Global client instance**: No need to pass client objects around
- **Automatic authentication**: Token management and 401 handling
- **Type safety**: Full TypeScript support with generated types
- **Interceptors**: Request/response interceptors for common operations

## Migration Summary

### Old Way (Deprecated)
```typescript
import { apiClient } from '../lib/apiClient';

// Direct API calls
const response = await apiClient.get({
  url: '/some-endpoint',
});

// SDK calls with explicit client
const response = await someControllerFunction({
  client: apiClient,
  // ... other params
});
```

### New Way (Recommended)
```typescript
import globalClient from '../wm-api-client';
import { someControllerFunction } from '../wm-api/sdk.gen';

// Direct API calls
const response = await globalClient.get({
  url: '/some-endpoint',
});

// SDK calls (client is automatically used)
const response = await someControllerFunction({
  // ... params only, no client needed
});
```

## Usage Examples

### 1. Using the Global Client Directly

```typescript
import globalClient from '../wm-api-client';

// GET request
const response = await globalClient.get({
  url: '/api/endpoint',
  query: { page: 1, limit: 10 }
});

// POST request
const response = await globalClient.post({
  url: '/api/endpoint',
  body: { name: 'John', email: 'john@example.com' }
});

// PUT request
const response = await globalClient.put({
  url: '/api/endpoint/123',
  body: { name: 'Updated Name' }
});

// DELETE request
const response = await globalClient.delete({
  url: '/api/endpoint/123'
});
```

### 2. Using Generated SDK Functions

```typescript
import { authControllerLogin, jobsControllerGetJobs } from '../wm-api/sdk.gen';

// Login (no client parameter needed)
const loginResponse = await authControllerLogin({
  body: { email: 'user@example.com', password: 'password' }
});

// Get jobs with filters
const jobsResponse = await jobsControllerGetJobs({
  query: { 
    search: 'developer',
    category: ['tech'],
    limit: 20,
    page: 1
  }
});
```

### 3. Using Utility Functions

```typescript
import { authUtils, jobUtils, staticDataUtils } from '../lib/apiUtils';

// Authentication
const loginResult = await authUtils.login('user@example.com', 'password');
const profile = await authUtils.getProfile();

// Jobs
const jobs = await jobUtils.getJobs({
  search: 'react developer',
  category: ['frontend'],
  limit: 10
});

// Static data
const countries = await staticDataUtils.getCountries();
const skills = await staticDataUtils.getSkills('javascript');
```

## Configuration

The global client is configured in `src/wm-api-client.ts` with:

- **Base URL**: From environment variable `VITE_PUBLIC_API` or fallback
- **Authentication**: Automatic token management from localStorage
- **Headers**: Default Content-Type and Authorization headers
- **Error handling**: Automatic 401 redirect to login page

## Authentication

The global client automatically:

1. **Adds auth token** to requests from localStorage
2. **Handles 401 errors** by clearing token and redirecting to login
3. **Manages token lifecycle** through interceptors

```typescript
// Token is automatically added to requests
const response = await authControllerGetProfile();
// No need to manually add Authorization header
```

## Error Handling

The client includes built-in error handling:

```typescript
try {
  const response = await someApiCall();
  // Handle success
} catch (error) {
  // Handle specific errors
  if (error.status === 401) {
    // Already handled by client - user redirected to login
  } else if (error.status === 400) {
    // Handle validation errors
  }
}
```

## Migration Checklist

- [x] Update imports from `../lib/apiClient` to `../wm-api-client`
- [x] Remove `client: apiClient` parameters from SDK calls
- [x] Update direct API calls to use `globalClient`
- [x] Test authentication flows
- [x] Verify error handling works correctly

## Benefits

1. **Simplified API calls**: No need to pass client objects
2. **Better type safety**: Full TypeScript support with generated types
3. **Centralized configuration**: Single place to manage client settings
4. **Automatic authentication**: Token management handled automatically
5. **Consistent error handling**: Standardized error responses
6. **Better developer experience**: IntelliSense and autocomplete support

## Troubleshooting

### Common Issues

1. **Type errors**: Make sure to use the correct parameter structure for SDK functions
2. **Authentication issues**: Check that tokens are properly stored in localStorage
3. **CORS errors**: Verify the base URL is correct in your environment variables

### Getting Help

- Check the generated types in `src/wm-api/types.gen.ts`
- Review the SDK functions in `src/wm-api/sdk.gen.ts`
- Use the utility functions in `src/lib/apiUtils.ts` for common operations 