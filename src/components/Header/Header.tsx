'use client';

import React from 'react';
import { HeaderProps, NavigationItem } from './types';
import { useHeaderAnalytics } from '../../hooks/useAnalytics';
import { useHeaderBehaviors } from './useHeaderBehaviors';
import './Header.css';

const DEFAULT_LOGO = (
  <svg
    width="150"
    height="46"
    viewBox="0 0 150 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Laureate Logo"
  >
    <g clipPath="url(#clip0_602_4861)">
      <rect width="150" height="45" transform="translate(0 0.5)" fill="var(--header-logo-bg, #121C4D)" />
      <path d="M149.106 1.39417H0.894623V44.606H149.106V1.39417Z" stroke="white" strokeWidth="2" />
      <path d="M18.4785 29.7665H28.5692V27.1701H21.665V15.9976H18.4785V29.7665ZM41.866 29.7665H45.2099L39.0532 15.9976H35.906L29.769 29.7665H33.0342L34.2508 26.816H40.6465L41.866 29.7665ZM35.2766 24.3966L37.4599 19.1251L39.6433 24.3966H35.2766ZM53.5696 30.0049C57.4839 30.0049 59.8049 27.7626 59.8049 23.7106V15.9976H56.6577V23.5901C56.6577 26.2062 55.5365 27.2857 53.5892 27.2857C51.6616 27.2857 50.5207 26.2039 50.5207 23.5901V15.9976H47.3342V23.7082C47.3342 27.7602 49.6553 30.0049 53.5696 30.0049ZM76.2489 29.7665L73.1607 25.3408C74.0259 25.0001 74.7634 24.3985 75.271 23.6195C75.7786 22.8405 76.031 21.9227 75.9932 20.9937C75.9932 17.9049 73.6918 15.9976 70.0142 15.9976H64.0536V29.7665H67.2401V25.9309H70.1709L72.8264 29.7665H76.2489ZM72.7673 20.9937C72.7673 22.4886 71.7839 23.3934 69.8365 23.3934H67.2401V18.594H69.8353C71.7839 18.594 72.7673 19.4791 72.7673 20.9937ZM82.7811 27.2094V24.0229H89.1738V21.5445H82.7793V18.5546H90.0178V15.9976H79.6107V29.7665H90.2717V27.2094H82.7811ZM104.2 29.7665H107.544L101.387 15.9976H98.2398L92.1028 29.7665H95.368L96.5875 26.816H102.98L104.2 29.7665ZM97.6116 24.3966L99.7949 19.1251L101.978 24.3966H97.6116ZM112.245 29.7665H115.434V18.594H119.84V15.9976H107.841V18.594H112.247L112.245 29.7665ZM125.817 27.2094V24.0229H132.21V21.5445H125.817V18.5546H133.055V15.9976H122.65V29.7665H133.311V27.2094H125.817Z" fill="white" />
    </g>
    <defs>
      <clipPath id="clip0_602_4861">
        <rect width="150" height="45" fill="white" transform="translate(0 0.5)" />
      </clipPath>
    </defs>
  </svg>
);

const DEFAULT_NAVIGATION: NavigationItem[] = [
  { label: 'New', href: '/new' },
  { label: 'Brands', href: '/brands' },
  { label: 'Men', href: '/men' },
  { label: 'Women', href: '/women' },
  { label: 'Kids', href: '/kids' },
  { label: 'Home & Living', href: '/home-living' },
  { label: 'Beauty', href: '/beauty' },
  { label: 'Studio', href: '/studio' },
  { label: 'Gifts & Gift Cards', href: '/gifts' },
  { label: 'Shop Under $80', href: '/shop-under-80' },
  { label: 'Sale & Offers', href: '/sale' },
];

const Header: React.FC<HeaderProps> = ({
  className = '',
  config = {},
  behaviorConfig = {},
  favoritesCount = 0,
  cartItemsCount = 0,
  userLocation = 'Laurent, Jakarta',
  isLoggedIn = false,
}) => {
  // Use analytics hooks for tracking
  const {
    trackLogoClick,
    trackSearchSubmit,
    trackNavigationClick,
    trackActionClick,
  } = useHeaderAnalytics();

  // Use behavior hook for all interactions
  const behaviors = useHeaderBehaviors({
    ...behaviorConfig,
    onUserAction: (action, data) => {
      const payload = (data ?? {}) as Record<string, unknown>;
      // Handle analytics tracking through the behavior hook
      switch (action) {
        case 'search': {
          const query = typeof payload.query === 'string' ? payload.query : '';
          const results = typeof payload.results === 'number' ? payload.results : undefined;
          trackSearchSubmit(query, results);
          break;
        }
        case 'logo_click':
          trackLogoClick();
          break;
        case 'navigation_click': {
          const label = typeof payload.label === 'string' ? payload.label : '';
          const href = typeof payload.href === 'string' ? payload.href : '#';
          trackNavigationClick(label, href);
          break;
        }
        case 'stores_services_click':
          trackActionClick('stores_services', { 
            location: userLocation,
            action_type: 'stores_services' 
          });
          break;
        case 'community_click':
          trackActionClick('community', { action_type: 'community' });
          break;
        case 'sign_in_click':
          trackActionClick('sign_in', { 
            is_logged_in: isLoggedIn,
            action_type: isLoggedIn ? 'account_menu' : 'sign_in'
          });
          break;
        case 'favorites_click':
          trackActionClick('favorites', { 
            favorites_count: favoritesCount,
            action_type: 'favorites' 
          });
          break;
        case 'cart_click':
          trackActionClick('cart', { 
            cart_items_count: cartItemsCount,
            action_type: 'cart' 
          });
          break;
      }
      
      // Call any additional user action handler
      if (behaviorConfig.onUserAction) {
        behaviorConfig.onUserAction(action, data);
      }
    },
  });

  // Configuration with defaults
  const {
    logo = {},
    navigation = DEFAULT_NAVIGATION,
    texts = {},
    showSearch = true,
    showStoresServices = true,
    showCommunity = true,
    showFavorites = true,
    showCart = true,
  } = config;

  const {
    searchPlaceholder = 'Search',
    storesServicesTitle = 'Stores & Services',
    communityLabel = 'Community',
    signInTitle = isLoggedIn ? 'My Account' : 'Sign In',
    signInSubtitle = isLoggedIn ? 'Welcome back!' : 'for FREE Shipping 🚚',
  } = texts;

  return (
    <header className={`header ${className}`}>
      {/* Top Header Section */}
      <div className="header__top">
        <div className="header__container">
          {/* Logo */}
          <div className="header__logo-section">
            <div className="header__logo" onClick={behaviors.handleLogoClick} style={{ cursor: 'pointer' }}>
              {logo.src ? (
                <img
                  src={logo.src}
                  alt={logo.alt || 'Logo'}
                  width={logo.width || 150}
                  height={logo.height || 46}
                />
              ) : (
                DEFAULT_LOGO
              )}
            </div>

            {/* Search Bar */}
            {showSearch && (
              <form onSubmit={behaviors.handleSearchSubmit} className="header__search" role="search">
                <div className="header__search-container">
                  <div className="header__search-icon" aria-hidden="true">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 0C7.5913 0 9.11742 0.632141 10.2426 1.75736C11.3679 2.88258 12 4.4087 12 6C12 7.47667 11.4667 8.82867 10.582 9.87333L15.8527 15.146H15.854C15.9477 15.24 16.0003 15.3673 16.0003 15.5C16.0003 15.6327 15.9477 15.76 15.854 15.854C15.76 15.9477 15.6327 16.0003 15.5 16.0003C15.3673 16.0003 15.24 15.9477 15.146 15.854L9.87467 10.5813C8.79251 11.4993 7.41903 12.0021 6 12C4.4087 12 2.88258 11.3679 1.75736 10.2426C0.632141 9.11742 0 7.5913 0 6C0 4.4087 0.632141 2.88258 1.75736 1.75736C2.88258 0.632141 4.4087 0 6 0ZM6 1C5.34337 0.999913 4.69315 1.12918 4.08648 1.38042C3.47981 1.63167 2.92858 1.99996 2.46427 2.46427C1.99996 2.92858 1.63167 3.47981 1.38042 4.08648C1.12918 4.69315 0.999913 5.34337 1 6C1 8.762 3.238 11 6 11C8.762 11 11 8.762 11 6C11 3.238 8.762 1 6 1Z" fill="currentColor" />
                    </svg>
                  </div>
                  <input
                    type="search"
                    value={behaviors.state.searchQuery}
                    onChange={(e) => behaviors.handleSearchQueryChange(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="header__search-input"
                    aria-label="Search products"
                    disabled={behaviors.state.isSearching}
                  />
                  {behaviors.state.isSearching && (
                    <div className="header__search-loading" aria-hidden="true">
                      <div className="spinner"></div>
                    </div>
                  )}
                </div>
              </form>
            )}
          </div>

          {/* Right Section */}
          <div className="header__actions">
            {/* Stores & Services */}
            {showStoresServices && (
              <button 
                className="header__stores-services"
                onClick={behaviors.handleStoresServicesClick}
                aria-label="Find stores and services"
              >
                <div className="header__stores-icon">
                  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.7793 24.5C1.64669 24.5 1.51951 24.4473 1.42574 24.3536C1.33198 24.2598 1.2793 24.1326 1.2793 24V4C1.2793 3.86739 1.33198 3.74021 1.42574 3.64645C1.51951 3.55268 1.64669 3.5 1.7793 3.5H22.7793C22.9119 3.5 23.0391 3.55268 23.1329 3.64645C23.2266 3.74021 23.2793 3.86739 23.2793 4V24C23.2793 24.1326 23.2266 24.2598 23.1329 24.3536C23.0391 24.4473 22.9119 24.5 22.7793 24.5H1.7793ZM22.2793 23.5V4.5H2.2793V23.5H22.2793Z" fill="currentColor" />
                    <path d="M0.279297 23.5H24.2793V25.5H0.279297V23.5Z" fill="currentColor" />
                    <path d="M7.7793 24.5C7.64669 24.5 7.51951 24.4473 7.42574 24.3536C7.33198 24.2598 7.2793 24.1326 7.2793 24V14C7.2793 13.8674 7.33198 13.7402 7.42574 13.6464C7.51951 13.5527 7.64669 13.5 7.7793 13.5H16.7793C16.9119 13.5 17.0391 13.5527 17.1329 13.6464C17.2266 13.7402 17.2793 13.8674 17.2793 14V24C17.2793 24.1326 17.2266 24.2598 17.1329 24.3536C17.0391 24.4473 16.9119 24.5 16.7793 24.5H7.7793ZM16.2793 23.5V14.5H8.2793V23.5H16.2793Z" fill="currentColor" />
                    <path d="M11.7793 13.5H12.7793V24.5H11.7793V13.5ZM1.2793 6.5V5.5H23.2793V6.5H1.2793ZM1.2793 8.5V7.5H23.2793V8.5H1.2793ZM1.2793 10.5V9.5H23.2793V10.5H1.2793Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="header__stores-text">
                  <div className="header__stores-title">{storesServicesTitle}</div>
                  <div className="header__stores-location">{userLocation}</div>
                </div>
              </button>
            )}

            <div className="header__divider" aria-hidden="true"></div>

            {/* Community */}
            {showCommunity && (
              <button 
                className="header__community"
                onClick={behaviors.handleCommunityClick}
                aria-label="Community"
              >
                <div className="header__community-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M16 4C18.2091 4 20 5.79086 20 8C20 10.2091 18.2091 12 16 12C13.7909 12 12 10.2091 12 8C12 5.79086 13.7909 4 16 4ZM16 6C14.8954 6 14 6.89543 14 8C14 9.10457 14.8954 10 16 10C17.1046 10 18 9.10457 18 8C18 6.89543 17.1046 6 16 6ZM8 6C9.65685 6 11 7.34315 11 9C11 10.6569 9.65685 12 8 12C6.34315 12 5 10.6569 5 9C5 7.34315 6.34315 6 8 6ZM8 8C7.44772 8 7 8.44772 7 9C7 9.55228 7.44772 10 8 10C8.55228 10 9 9.55228 9 9C9 8.44772 8.55228 8 8 8ZM8 13C11.866 13 15 16.134 15 20H1C1 16.134 4.13401 13 8 13ZM8 15C5.23858 15 3 17.2386 3 20H13C13 17.2386 10.7614 15 8 15ZM16.5 14C19.5376 14 22 16.4624 22 19.5V20H17V18H20C20 17.567 19.433 17 18.5 17C17.567 17 17 17.567 17 18V20H15V19.5C15 16.4624 17.4624 14 16.5 14Z" fill="currentColor"/>
                  </svg>
                </div>
                <span>{communityLabel}</span>
              </button>
            )}

            {/* Sign In */}
            <button 
              className="header__signin"
              onClick={behaviors.handleSignInClick}
              aria-label={isLoggedIn ? 'Account menu' : 'Sign in for free shipping'}
            >
              <div className="header__signin-text">
                <div className="header__signin-title">{signInTitle}</div>
                <div className="header__signin-subtitle">{signInSubtitle}</div>
              </div>
            </button>

            {/* Favorites */}
            {showFavorites && (
              <button 
                className="header__favorites"
                onClick={behaviors.handleFavoritesClick}
                aria-label={`Favorites (${favoritesCount} items)`}
              >
                <div className="header__favorites-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.9994 3.09998C24.6994 5.29998 24.5994 10.3 22.0994 12.8C19.8994 15.6 14.6994 20.9 12.7994 22.4C12.2994 22.8 11.6994 22.8 11.1994 22.4C9.39939 20.9 4.1994 15.6 1.9994 12.8C-0.600604 10.2 -0.700604 5.19998 1.9994 3.09998C4.5994 0.499975 9.6994 0.699975 11.9994 4.19998C14.2994 0.799975 19.2994 0.499975 21.9994 3.09998ZM21.2994 3.89998C18.8994 1.49998 14.0994 1.89998 12.3994 5.39998C12.2994 5.69998 11.9994 5.79997 11.6994 5.59998C11.5994 5.59998 11.4994 5.49998 11.4994 5.39998C9.89939 1.89998 4.9994 1.39998 2.5994 3.89998C0.399395 5.59998 0.499396 9.99998 2.6994 12.2C4.8994 14.9 9.9994 20.2 11.7994 21.6C11.8994 21.7 11.9994 21.7 12.0994 21.6C13.8994 20.2 18.9994 14.9 21.1994 12.1C23.4994 9.99998 23.5994 5.59998 21.2994 3.89998Z" fill="currentColor" />
                  </svg>
                  {favoritesCount > 0 && (
                    <span className="header__counter" aria-hidden="true">
                      {favoritesCount}
                    </span>
                  )}
                </div>
              </button>
            )}

            {/* Cart */}
            {showCart && (
              <button 
                className="header__cart"
                onClick={behaviors.handleCartClick}
                aria-label={`Shopping cart (${cartItemsCount} items)`}
              >
                <div className="header__cart-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 4C7 2.89543 7.89543 2 9 2H15C16.1046 2 17 2.89543 17 4V6H19C19.5523 6 20 6.44772 20 7C20 7.55228 19.5523 8 19 8H18V19C18 20.1046 17.1046 21 16 21H8C6.89543 21 6 20.1046 6 19V8H5C4.44772 8 4 7.55228 4 7C4 6.44772 4.44772 6 5 6H7V4ZM9 6H15V4H9V6ZM8 8V19H16V8H8Z" fill="currentColor"/>
                  </svg>
                  {cartItemsCount > 0 && (
                    <span className="header__counter" aria-hidden="true">
                      {cartItemsCount}
                    </span>
                  )}
                </div>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="header__mobile-toggle"
              onClick={behaviors.handleMobileMenuToggle}
              aria-label="Toggle mobile menu"
              aria-expanded={behaviors.state.isMobileMenuOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="header__nav" aria-label="Main navigation">
        {/* Mobile overlay */}
        {behaviors.state.isMobileMenuOpen && (
          <div
            className="mobile-nav-overlay"
            onClick={behaviors.closeMobileMenu}
          />
        )}

        <div className="header__nav-container">
          <ul className={`header__nav-list ${behaviors.state.isMobileMenuOpen ? 'header__nav-list--open' : ''}`}>
            {navigation.map((item, index) => (
              <li key={index} className="header__nav-item">
                <a
                  href={item.href}
                  className={`header__nav-link ${item.isActive ? 'header__nav-link--active' : ''}`}
                  onClick={(e) => behaviors.handleNavigationItemClick(item, e)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
