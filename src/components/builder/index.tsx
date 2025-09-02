'use client';

import React from 'react';
import { BuilderComponent } from '@builder.io/react';

interface RenderBuilderContentProps {
  content: unknown;
  model: string;
}

export function RenderBuilderContent({ content, model }: RenderBuilderContentProps) {
  if (!content) {
    return null;
  }
  return <BuilderComponent model={model} content={content} />;
}

export default RenderBuilderContent;
