'use client';

import React from 'react';
import { BuilderComponent } from '@builder.io/react';
<<<<<<< HEAD
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

  return (
    <BuilderComponent content={content as any} model={model} data={data} />
  );
=======

interface RenderBuilderContentProps {
  content: unknown;
  model: string;
}

export function RenderBuilderContent({ content, model }: RenderBuilderContentProps) {
  if (!content) {
    return null;
  }
  return <BuilderComponent model={model} content={content} />;
>>>>>>> main
}

export default RenderBuilderContent;
