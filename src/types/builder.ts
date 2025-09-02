export type BuilderModel = string;

export interface BuilderPageContent {
  id: string;
  name?: string;
  data: Record<string, any> & {
    url?: string;
    title?: string;
    description?: string;
    keywords?: string[] | string;
    image?: string;
  };
}

export interface ContentFetchOptions {
  model?: BuilderModel;
  query?: Record<string, any>;
  preview?: boolean;
  cacheSeconds?: number;
}

export interface BuilderSEOData {
  title?: string;
  description?: string;
  keywords?: string[] | string;
  image?: string;
  url?: string;
}
