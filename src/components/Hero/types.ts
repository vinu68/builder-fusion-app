export interface HeroProps {
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  backgroundImage?: string;
}

export interface HeroConfig {
  showBadge?: boolean;
  showDescription?: boolean;
  backgroundOverlay?: boolean;
  overlayOpacity?: number;
}

export interface HeroTexts {
  title?: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  descriptionTitle?: string;
}
