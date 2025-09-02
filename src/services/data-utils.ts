import { dataService } from './data-service';
import type { DataServiceOptions } from '../types/data-service';

// Common data transformers
export const transformers = {
  // Extract data from nested response
  extractData: <T>(field: string) => (response: any): T => {
    return response[field];
  },

  // Map array items
  mapArray: <T, R>(mapper: (item: T) => R) => (data: T[]): R[] => {
    return Array.isArray(data) ? data.map(mapper) : [];
  },

  // Filter array items
  filterArray: <T>(predicate: (item: T) => boolean) => (data: T[]): T[] => {
    return Array.isArray(data) ? data.filter(predicate) : [];
  },

  // Limit array items
  limitArray: <T>(limit: number) => (data: T[]): T[] => {
    return Array.isArray(data) ? data.slice(0, limit) : [];
  },

  // Sort array items
  sortArray: <T>(compareFn: (a: T, b: T) => number) => (data: T[]): T[] => {
    return Array.isArray(data) ? [...data].sort(compareFn) : [];
  },

  // Pick specific fields from objects
  pickFields: <T extends Record<string, any>, K extends keyof T>(fields: K[]) => (data: T): Pick<T, K> => {
    const result = {} as Pick<T, K>;
    fields.forEach(field => {
      if (field in data) {
        result[field] = data[field];
      }
    });
    return result;
  },

  // Rename fields in objects
  renameFields: <T extends Record<string, any>>(fieldMap: Record<string, string>) => (data: T): any => {
    const result: any = {};
    Object.entries(data).forEach(([key, value]) => {
      const newKey = fieldMap[key] || key;
      result[newKey] = value;
    });
    return result;
  },

  // Convert string dates to Date objects
  parseDate: (dateField: string) => (data: any) => {
    if (data[dateField] && typeof data[dateField] === 'string') {
      data[dateField] = new Date(data[dateField]);
    }
    return data;
  },

  // Convert string numbers to numbers
  parseNumber: (numberField: string) => (data: any) => {
    if (data[numberField] && typeof data[numberField] === 'string') {
      const parsed = parseFloat(data[numberField]);
      if (!isNaN(parsed)) {
        data[numberField] = parsed;
      }
    }
    return data;
  },
};

// Utility functions for common data operations
export const dataUtils = {
  // Fetch data with common error handling and loading states
  async fetchWithState<T>(
    options: DataServiceOptions,
    setState?: {
      setLoading?: (loading: boolean) => void;
      setError?: (error: string | null) => void;
      setData?: (data: T) => void;
    }
  ): Promise<T | null> {
    setState?.setLoading?.(true);
    setState?.setError?.(null);

    try {
      const data = await dataService.fetch<T>(options);
      setState?.setData?.(data);
      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
      setState?.setError?.(errorMessage);
      return null;
    } finally {
      setState?.setLoading?.(false);
    }
  },

  // Fetch multiple endpoints in parallel
  async fetchMultiple<T extends Record<string, any>>(
    requests: Record<keyof T, DataServiceOptions>
  ): Promise<Partial<T>> {
    const entries = Object.entries(requests) as [keyof T, DataServiceOptions][];
    const promises = entries.map(async ([key, options]) => {
      try {
        const data = await dataService.fetch(options);
        return [key, data];
      } catch (error) {
        console.error(`Failed to fetch ${String(key)}:`, error);
        return [key, null];
      }
    });

    const results = await Promise.all(promises);
    return Object.fromEntries(results) as Partial<T>;
  },

  // Fetch with retry logic
  async fetchWithRetry<T>(
    options: DataServiceOptions,
    maxRetries = 3,
    delay = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await dataService.fetch<T>(options);
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
        }
      }
    }

    throw lastError!;
  },

  // Fetch with timeout
  async fetchWithTimeout<T>(
    options: DataServiceOptions,
    timeoutMs = 10000
  ): Promise<T> {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
    });

    return Promise.race([
      dataService.fetch<T>(options),
      timeoutPromise
    ]);
  },

  // Cache management utilities
  cache: {
    memory: new Map<string, { data: any; timestamp: number; ttl: number }>(),

    set<T>(key: string, data: T, ttlMs = 300000): void { // 5 minutes default
      this.memory.set(key, {
        data,
        timestamp: Date.now(),
        ttl: ttlMs,
      });
    },

    get<T>(key: string): T | null {
      const cached = this.memory.get(key);
      if (!cached) return null;

      if (Date.now() - cached.timestamp > cached.ttl) {
        this.memory.delete(key);
        return null;
      }

      return cached.data;
    },

    delete(key: string): boolean {
      return this.memory.delete(key);
    },

    clear(): void {
      this.memory.clear();
    },

    // Fetch with memory cache
    async fetchCached<T>(
      key: string,
      options: DataServiceOptions,
      ttlMs = 300000
    ): Promise<T> {
      const cached = this.get<T>(key);
      if (cached) return cached;

      const data = await dataService.fetch<T>(options);
      this.set(key, data, ttlMs);
      return data;
    },
  },

  // Data validation utilities
  validate: {
    required: (data: any, fields: string[]): boolean => {
      return fields.every(field => {
        const value = data[field];
        return value !== undefined && value !== null && value !== '';
      });
    },

    email: (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    url: (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    },

    schema: <T extends Record<string, any>>(
      data: any,
      schema: Record<keyof T, (value: any) => boolean>
    ): data is T => {
      return Object.entries(schema).every(([key, validator]) => {
        return validator(data[key]);
      });
    },
  },
};

// Common endpoint builders
export const endpoints = {
  // Build REST endpoints
  rest: (baseUrl: string, resource: string) => ({
    list: `${baseUrl}/${resource}`,
    get: (id: string | number) => `${baseUrl}/${resource}/${id}`,
    create: `${baseUrl}/${resource}`,
    update: (id: string | number) => `${baseUrl}/${resource}/${id}`,
    delete: (id: string | number) => `${baseUrl}/${resource}/${id}`,
  }),

  // Build GraphQL endpoints
  graphql: (baseUrl: string) => ({
    query: `${baseUrl}/graphql`,
    subscription: `${baseUrl}/graphql/subscription`,
  }),

  // Build CDN endpoints
  cdn: (baseUrl: string) => ({
    asset: (path: string) => `${baseUrl}/${path}`,
    image: (path: string, size?: string) => {
      const url = `${baseUrl}/${path}`;
      return size ? `${url}?size=${size}` : url;
    },
  }),
};

// Export everything
export { dataService };
