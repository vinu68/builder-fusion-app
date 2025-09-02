import type { 
  DataServiceConfig, 
  DataFetchOptions, 
  DataResponse, 
  DataServiceAdapter, 
  DataServiceOptions,
  DataTransformer 
} from '../types/data-service';

// Default HTTP Adapter
class HttpAdapter implements DataServiceAdapter {
  name = 'http';
  private config: DataServiceConfig = {};

  configure(config: DataServiceConfig): void {
    this.config = { ...this.config, ...config };
  }

  async fetch<T = any>(options: DataFetchOptions): Promise<DataResponse<T>> {
    const {
      endpoint,
      method = 'GET',
      params,
      headers = {},
      body,
      cache = 'default',
      next,
    } = options;

    try {
      // Build URL
      const baseUrl = this.config.baseUrl || '';
      let url = `${baseUrl}${endpoint}`;
      
      if (params && method === 'GET') {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        const queryString = searchParams.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
      }

      // Build headers
      const finalHeaders = {
        'Content-Type': 'application/json',
        ...this.config.headers,
        ...headers,
      };

      // Build fetch options
      const fetchOptions: RequestInit = {
        method,
        headers: finalHeaders,
        cache,
      };

      if (next) {
        (fetchOptions as any).next = next;
      }

      if (body && method !== 'GET') {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      // Make request
      const response = await fetch(url, fetchOptions);
      
      // Extract headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Parse response
      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      return {
        data,
        status: response.status,
        headers: responseHeaders,
        success: response.ok,
        error: response.ok ? undefined : `HTTP ${response.status}: ${response.statusText}`,
      };
    } catch (error) {
      return {
        data: {} as T,
        status: 0,
        headers: {},
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// CDN Adapter for static assets
class CdnAdapter implements DataServiceAdapter {
  name = 'cdn';
  private config: DataServiceConfig = {};

  configure(config: DataServiceConfig): void {
    this.config = { ...this.config, ...config };
  }

  async fetch<T = any>(options: DataFetchOptions): Promise<DataResponse<T>> {
    const {
      endpoint,
      headers = {},
      cache = 'force-cache', // Default to aggressive caching for CDN
      next,
    } = options;

    try {
      const baseUrl = this.config.baseUrl || '';
      const url = `${baseUrl}${endpoint}`;

      const finalHeaders = {
        ...this.config.headers,
        ...headers,
      };

      const fetchOptions: RequestInit = {
        method: 'GET', // CDN only supports GET
        headers: finalHeaders,
        cache,
      };

      if (next) {
        (fetchOptions as any).next = next;
      }

      const response = await fetch(url, fetchOptions);
      
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data: T;
      const contentType = response.headers.get('content-type');
      
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      return {
        data,
        status: response.status,
        headers: responseHeaders,
        success: response.ok,
        error: response.ok ? undefined : `CDN Error ${response.status}: ${response.statusText}`,
      };
    } catch (error) {
      return {
        data: {} as T,
        status: 0,
        headers: {},
        success: false,
        error: error instanceof Error ? error.message : 'CDN fetch error',
      };
    }
  }
}

// Mock Adapter for testing and development
class MockAdapter implements DataServiceAdapter {
  name = 'mock';
  private mockData: Record<string, any> = {};

  configure(config: DataServiceConfig & { mockData?: Record<string, any> }): void {
    if (config.mockData) {
      this.mockData = config.mockData;
    }
  }

  async fetch<T = any>(options: DataFetchOptions): Promise<DataResponse<T>> {
    const { endpoint } = options;
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const data = this.mockData[endpoint];
    
    if (data !== undefined) {
      return {
        data: data as T,
        status: 200,
        headers: { 'content-type': 'application/json' },
        success: true,
      };
    } else {
      return {
        data: {} as T,
        status: 404,
        headers: {},
        success: false,
        error: `Mock data not found for endpoint: ${endpoint}`,
      };
    }
  }
}

// Main Data Service
class DataService {
  private adapters: Map<string, DataServiceAdapter> = new Map();
  private defaultAdapter = 'http';

  constructor() {
    // Register built-in adapters
    this.registerAdapter(new HttpAdapter());
    this.registerAdapter(new CdnAdapter());
    this.registerAdapter(new MockAdapter());
  }

  registerAdapter(adapter: DataServiceAdapter): void {
    this.adapters.set(adapter.name, adapter);
  }

  configureAdapter(name: string, config: DataServiceConfig): void {
    const adapter = this.adapters.get(name);
    if (adapter) {
      adapter.configure(config);
    } else {
      throw new Error(`Adapter '${name}' not found`);
    }
  }

  setDefaultAdapter(name: string): void {
    if (this.adapters.has(name)) {
      this.defaultAdapter = name;
    } else {
      throw new Error(`Adapter '${name}' not found`);
    }
  }

  async fetch<T = any>(options: DataServiceOptions): Promise<T> {
    const {
      adapter: adapterName = this.defaultAdapter,
      transform,
      fallback,
      onError,
      onSuccess,
      ...fetchOptions
    } = options;

    const adapter = this.adapters.get(adapterName);
    if (!adapter) {
      throw new Error(`Adapter '${adapterName}' not found`);
    }

    try {
      const response = await adapter.fetch<T>(fetchOptions);
      
      if (response.success) {
        let data = response.data;
        
        // Apply transformation if provided
        if (transform) {
          data = transform(data);
        }
        
        onSuccess?.(data);
        return data;
      } else {
        throw new Error(response.error || 'Fetch failed');
      }
    } catch (error) {
      const errorInstance = error instanceof Error ? error : new Error('Unknown error');
      onError?.(errorInstance);
      
      if (fallback !== undefined) {
        return fallback;
      }
      
      throw errorInstance;
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, params?: Record<string, any>, options?: Omit<DataServiceOptions, 'endpoint' | 'method' | 'params'>): Promise<T> {
    return this.fetch<T>({
      ...options,
      endpoint,
      method: 'GET',
      params,
    });
  }

  async post<T = any>(endpoint: string, body?: any, options?: Omit<DataServiceOptions, 'endpoint' | 'method' | 'body'>): Promise<T> {
    return this.fetch<T>({
      ...options,
      endpoint,
      method: 'POST',
      body,
    });
  }

  async put<T = any>(endpoint: string, body?: any, options?: Omit<DataServiceOptions, 'endpoint' | 'method' | 'body'>): Promise<T> {
    return this.fetch<T>({
      ...options,
      endpoint,
      method: 'PUT',
      body,
    });
  }

  async delete<T = any>(endpoint: string, options?: Omit<DataServiceOptions, 'endpoint' | 'method'>): Promise<T> {
    return this.fetch<T>({
      ...options,
      endpoint,
      method: 'DELETE',
    });
  }
}

// Create and export singleton instance
export const dataService = new DataService();

// Export types and classes for advanced usage
export { DataService, HttpAdapter, CdnAdapter, MockAdapter };
export type { DataServiceAdapter, DataTransformer };
