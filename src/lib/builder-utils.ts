import { builder, DEFAULT_MODEL } from './builder';
import type { 
  BuilderPageContent, 
  ContentFetchOptions, 
  BuilderSEOData,
  BuilderModel 
} from '../types/builder';

/**
 * Get Builder.io content by URL path
 */
export async function getBuilderContent(
  urlPath: string,
  options: ContentFetchOptions = {}
): Promise<BuilderPageContent | null> {
  const {
    model = DEFAULT_MODEL,
    query = {},
    preview = false,
    cacheSeconds = 60
  } = options;

  try {
    const content = await builder
      .get(model, {
        url: urlPath,
        query,
        cacheSeconds,
        preview,
        staleCacheSeconds: cacheSeconds * 10,
      })
      .promise();

    return content as BuilderPageContent;
  } catch (error) {
    console.error('Error fetching Builder.io content:', error);
    return null;
  }
}

/**
 * Get all Builder.io content for a specific model (for generating static paths)
 */
export async function getAllBuilderContent(
  model: BuilderModel = DEFAULT_MODEL
): Promise<BuilderPageContent[]> {
  try {
    const content = await builder
      .getAll(model, {
        fields: 'id,name,data.url,data.title',
        limit: 100,
      })
      .promise();

    return content as BuilderPageContent[];
  } catch (error) {
    console.error('Error fetching all Builder.io content:', error);
    return [];
  }
}

/**
 * Generate URL path from slug array
 */
export function getUrlFromSlug(slug?: string[]): string {
  if (!slug || slug.length === 0) {
    return '/';
  }
  
  return '/' + slug.join('/');
}

/**
 * Extract SEO metadata from Builder.io content
 */
export function extractSEOData(content: BuilderPageContent): BuilderSEOData {
  const { data } = content;
  
  return {
    title: data.title || content.name || 'Page',
    description: data.description,
    keywords: data.keywords,
    image: data.image,
    url: data.url,
  };
}

/**
 * Check if content exists for a given URL
 */
export async function contentExists(
  urlPath: string,
  model: BuilderModel = DEFAULT_MODEL
): Promise<boolean> {
  try {
    const content = await getBuilderContent(urlPath, { model });
    return content !== null;
  } catch {
    return false;
  }
}

/**
 * Get preview content (for draft/preview mode)
 */
export async function getPreviewContent(
  urlPath: string,
  model: BuilderModel = DEFAULT_MODEL
): Promise<BuilderPageContent | null> {
  return getBuilderContent(urlPath, {
    model,
    preview: true,
    cacheSeconds: 0, // No caching for preview content
  });
}

/**
 * Generate metadata for Next.js from Builder.io content
 */
export function generateMetadataFromContent(content: BuilderPageContent) {
  const seoData = extractSEOData(content);
  
  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      images: seoData.image ? [{ url: seoData.image }] : undefined,
      url: seoData.url,
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      images: seoData.image ? [seoData.image] : undefined,
    },
  };
}
