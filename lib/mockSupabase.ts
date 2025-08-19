// Simple mock supabase that returns consistent error responses
const mockError = { message: 'Supabase not configured' };
const mockResponse = { data: null, error: mockError };
const mockArrayResponse = { data: [], error: mockError };

// Create a chainable mock that always returns the expected structure
const createMockChain = (): any => ({
  // Query methods that accept parameters
  select: (columns?: string) => createMockChain(),
  eq: (column: string, value: any) => createMockChain(),
  neq: (column: string, value: any) => createMockChain(),
  order: (column: string, options?: any) => createMockChain(),
  limit: (count: number) => createMockChain(),
  single: () => Promise.resolve(mockResponse),
  filter: (column: string, operator: string, value: any) => createMockChain(),
  or: (query: string) => createMockChain(),
  gte: (column: string, value: any) => createMockChain(),
  lt: (column: string, value: any) => createMockChain(),
  gt: (column: string, value: any) => createMockChain(),
  lte: (column: string, value: any) => createMockChain(),
  like: (column: string, pattern: string) => createMockChain(),
  ilike: (column: string, pattern: string) => createMockChain(),
  is: (column: string, value: any) => createMockChain(),
  in: (column: string, values: any[]) => createMockChain(),
  contains: (column: string, value: any) => createMockChain(),
  range: (from: number, to: number) => createMockChain(),
  
  // Data properties that components expect
  data: [],
  error: mockError,
  
  // Make it awaitable for Promise-based usage
  then: (onResolve: any) => Promise.resolve(mockArrayResponse).then(onResolve),
  catch: (onReject: any) => Promise.reject(mockError).catch(onReject),
});

export const supabase = {
  from: (table: string) => ({
    // Query methods
    select: (columns?: string) => createMockChain(),
    insert: (values: any) => createMockChain(),
    update: (values: any) => createMockChain(),
    delete: () => createMockChain(),
    upsert: (values: any) => createMockChain(),
  }),
  rpc: (functionName: string, params?: any) => Promise.resolve(mockResponse),
  auth: {
    getUser: () => Promise.resolve({ data: { user: null }, error: mockError }),
    signUp: (credentials: any) => Promise.resolve(mockResponse),
    signIn: (credentials: any) => Promise.resolve(mockResponse),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: (callback: any) => ({ data: { subscription: null } }),
  },
  storage: {
    from: (bucket: string) => ({
      upload: (path: string, file: File) => Promise.resolve(mockResponse),
      download: (path: string) => Promise.resolve(mockResponse),
      remove: (paths: string[]) => Promise.resolve(mockArrayResponse),
      list: (path?: string) => Promise.resolve(mockArrayResponse),
    })
  }
};