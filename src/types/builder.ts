export type BuilderModel = string;

export interface BuilderSEOData {
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  url?: string;
}

export interface BuilderPageData {
  url?: string;
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
  [key: string]: unknown;
}

export interface BuilderPageContent {
  id?: string;
  name?: string;
  data: BuilderPageData;
  [key: string]: unknown;
}

export interface ContentFetchOptions {
  model?: BuilderModel;
  query?: Record<string, unknown>;
  preview?: boolean;
  cacheSeconds?: number;
}
