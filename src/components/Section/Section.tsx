import type { SectionProps } from './types';
import './Section.css';

export default function Section({
  children,
  id,
  className = '',
  config = {},
  style,
  
  // Direct props for backward compatibility
  background,
  padding,
  maxWidth,
  textAlign,
  spacing,
  border,
  elevation,
  
  as: Component = 'section',
  onClick,
  onMouseEnter,
  onMouseLeave,
}: SectionProps) {
  // Merge config with direct props (direct props take precedence)
  const finalConfig = {
    background: background || config.background || 'default',
    padding: padding || config.padding || 'medium',
    maxWidth: maxWidth || config.maxWidth || 'large',
    textAlign: textAlign || config.textAlign || 'left',
    spacing: spacing || config.spacing || 'medium',
    border: border || config.border || 'none',
    elevation: elevation || config.elevation || 'none',
  };

  const sectionClasses = [
    'section',
    `section--background-${finalConfig.background}`,
    `section--padding-${finalConfig.padding}`,
    `section--max-width-${finalConfig.maxWidth}`,
    `section--text-${finalConfig.textAlign}`,
    `section--spacing-${finalConfig.spacing}`,
    `section--border-${finalConfig.border}`,
    `section--elevation-${finalConfig.elevation}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component 
      id={id} 
      className={sectionClasses}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="section__container">
        {children}
      </div>
    </Component>
  );
}
