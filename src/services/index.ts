// Data Service Core
export { dataService, DataService, HttpAdapter, CdnAdapter, MockAdapter } from './data-service';
export type { DataServiceAdapter, DataTransformer } from './data-service';

// Data Utilities
export { dataUtils, transformers, endpoints } from './data-utils';

// Service Examples
export { HeaderService, useHeaderConfig } from './header-service';

// Types
export type {
  DataServiceConfig,
  DataFetchOptions,
  DataResponse,
  DataServiceOptions,
} from '../types/data-service';
