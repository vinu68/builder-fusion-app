export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: string;
}

export interface PaymentBadge {
  name: string;
  icon: React.ReactNode;
  alt: string;
}

export interface BenefitCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: {
    text: string;
    href: string;
  };
}

export interface NewsletterConfig {
  title?: string;
  subtitle?: string;
  inputPlaceholder?: string;
  buttonText?: string;
  buttonLoadingText?: string;
}

export interface FooterTexts {
  mindfulBrandText?: string;
  copyrightText?: string;
  newsletter?: NewsletterConfig;
}

export interface FooterConfig {
  logo?: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  companyDescription?: string;
  sections?: FooterSection[];
  socialLinks?: SocialLink[];
  benefitCards?: BenefitCard[];
  paymentBadges?: PaymentBadge[];
  texts?: FooterTexts;
  showNewsletter?: boolean;
  showMindfulBrand?: boolean;
  showBenefits?: boolean;
  showPaymentBadges?: boolean;
}

export interface FooterProps {
  className?: string;
  config?: FooterConfig;
  // Remove all analytics-related event handlers
  // These will be handled internally by analytics hooks
}
