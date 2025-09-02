// Standard components
export { default as Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button/types";

export { default as ThemeToggle } from "./ThemeToggle";

// Export Header without client-only hooks to keep server imports safe
export { default as Header } from "./Header/Header";
export type { HeaderProps, HeaderConfig, HeaderTexts, NavigationItem, UserMenuProps } from "./Header/types";

export { default as Footer } from "./Footer";
export type {
  FooterProps,
  FooterConfig,
  FooterTexts,
  FooterLink,
  FooterSection,
  SocialLink,
  BenefitCard,
  PaymentBadge,
  NewsletterConfig,
} from "./Footer/types";

export { default as Section } from "./Section";
export type { SectionProps } from "./Section/types";
