import { ReactNode, CSSProperties } from 'react';

export interface SectionConfig {
  background?: 'default' | 'alternate' | 'primary' | 'secondary' | 'transparent';
  padding?: 'none' | 'small' | 'medium' | 'large' | 'xlarge';
  maxWidth?: 'small' | 'medium' | 'large' | 'xlarge' | 'full';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  spacing?: 'none' | 'small' | 'medium' | 'large';
  border?: 'none' | 'top' | 'bottom' | 'both';
  elevation?: 'none' | 'low' | 'medium' | 'high';
}

export interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  config?: SectionConfig;
  style?: CSSProperties;
  
  // Direct props for backward compatibility
  background?: SectionConfig['background'];
  padding?: SectionConfig['padding'];
  maxWidth?: SectionConfig['maxWidth'];
  textAlign?: SectionConfig['textAlign'];
  spacing?: SectionConfig['spacing'];
  border?: SectionConfig['border'];
  elevation?: SectionConfig['elevation'];
  
  as?: 'section' | 'div' | 'article' | 'aside' | 'main' | 'header' | 'footer' | 'nav';
  
  // Event handlers
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}
