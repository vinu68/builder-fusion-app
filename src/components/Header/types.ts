import type { HeaderBehaviorConfig } from './useHeaderBehaviors';

export interface NavigationItem {
  label: string;
  href: string;
  isActive?: boolean;
}

export interface UserMenuProps {
  isLoggedIn?: boolean;
  location?: string;
}

export interface HeaderTexts {
  searchPlaceholder?: string;
  storesServicesTitle?: string;
  communityLabel?: string;
  signInTitle?: string;
  signInSubtitle?: string;
  myAccountTitle?: string;
  welcomeBackText?: string;
}

export interface HeaderConfig {
  logo?: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
    href?: string;
  };
  navigation?: NavigationItem[];
  texts?: HeaderTexts;
  showSearch?: boolean;
  showStoresServices?: boolean;
  showCommunity?: boolean;
  showFavorites?: boolean;
  showCart?: boolean;
}

export interface HeaderProps {
  className?: string;
  config?: HeaderConfig;
  behaviorConfig?: HeaderBehaviorConfig;
  favoritesCount?: number;
  cartItemsCount?: number;
  userLocation?: string;
  isLoggedIn?: boolean;
}
