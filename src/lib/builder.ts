import { builder as sdkBuilder } from '@builder.io/sdk';

// Initialize Builder.io SDK with API key from env
const apiKey = process.env.NEXT_PUBLIC_BUILDER_API_KEY;
if (apiKey) {
  try {
    sdkBuilder.init(apiKey);
  } catch {
    // ignore init errors during build if env is missing
  }
}

export const builder = sdkBuilder;
export const DEFAULT_MODEL = 'page' as const;
