export interface DataServiceConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
}

export interface DataFetchOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  params?: Record<string, any>;
  headers?: Record<string, string>;
  body?: any;
  cache?: 'default' | 'no-store' | 'reload' | 'no-cache' | 'force-cache' | 'only-if-cached';
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}

export interface DataResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, string>;
  success: boolean;
  error?: string;
}

export interface DataServiceAdapter {
  name: string;
  fetch<T = any>(options: DataFetchOptions): Promise<DataResponse<T>>;
  configure(config: DataServiceConfig): void;
}

export type DataTransformer<T = any, R = any> = (data: T) => R;

export interface DataServiceOptions extends DataFetchOptions {
  adapter?: string;
  transform?: DataTransformer;
  fallback?: any;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}
