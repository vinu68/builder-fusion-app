export interface HeroProps {
  className?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  currentPrice?: string;
  originalPrice?: string;
  offerText?: string;
  backgroundImage?: string;
  onShopNow?: () => void;
}

export interface HeroConfig {
  showPricing?: boolean;
  showButton?: boolean;
  backgroundOverlay?: boolean;
  overlayOpacity?: number;
}

export interface HeroTexts {
  title?: string;
  description?: string;
  buttonText?: string;
  currentPrice?: string;
  originalPrice?: string;
  offerText?: string;
}
