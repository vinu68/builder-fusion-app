'use client';

import React from 'react';
import { BuilderComponent } from '@builder.io/react';
import type { BuilderPageContent } from '../../types/builder';

export interface RenderBuilderContentProps {
  content: BuilderPageContent | null | undefined;
  model: string;
  data?: Record<string, unknown>;
}

export function RenderBuilderContent({ content, model, data }: RenderBuilderContentProps) {
  if (!content) {
    return null;
  }
  return <BuilderComponent content={content as unknown as any} model={model} data={data} />;
}

export default RenderBuilderContent;
