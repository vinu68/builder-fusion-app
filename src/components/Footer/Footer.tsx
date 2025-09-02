'use client';

import { useState } from 'react';
import type { FooterProps, FooterSection, SocialLink, BenefitCard, PaymentBadge } from './types';
import { useFooterAnalytics } from '../../hooks/useAnalytics';
import './Footer.css';

const DEFAULT_LOGO = (
  <svg width="150" height="45" viewBox="0 0 151 46" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="150" height="45" transform="translate(0.523438 0.874023)" fill="#121C4D"/>
    <path d="M149.63 1.76855H1.41797V44.9804H149.63V1.76855Z" stroke="white" strokeWidth="2"/>
    <path d="M19.002 30.142H29.0926V27.5456H22.1885V16.373H19.002V30.142ZM42.3894 30.142H45.7333L39.5766 16.373H36.4295L30.2925 30.142H33.5577L34.7742 27.1915H41.1699L42.3894 30.142ZM35.8 24.7721L37.9834 19.5006L40.1667 24.7721H35.8ZM54.093 30.3804C58.0073 30.3804 60.3283 28.138 60.3283 24.086V16.373H57.1812V23.9656C57.1812 26.5817 56.06 27.6612 54.1127 27.6612C52.185 27.6612 51.0442 26.5794 51.0442 23.9656V16.373H47.8576V24.0837C47.8576 28.1357 50.1787 30.3804 54.093 30.3804ZM76.7724 30.142L73.6842 25.7163C74.5493 25.3756 75.2868 24.774 75.7944 23.9949C76.302 23.2159 76.5544 22.2982 76.5166 21.3692C76.5166 18.2804 74.2153 16.373 70.5376 16.373H64.577V30.142H67.7635V26.3064H70.6944L73.3498 30.142H76.7724ZM73.2908 21.3692C73.2908 22.8641 72.3073 23.7689 70.36 23.7689H67.7635V18.9695H70.3588C72.3073 18.9695 73.2908 19.8546 73.2908 21.3692ZM83.3045 27.5849V24.3984H89.6972V21.92H83.3027V18.9301H90.5413V16.373H80.1341V30.142H90.7952V27.5849H83.3045ZM104.723 30.142H108.067L101.91 16.373H98.7633L92.6263 30.142H95.8914L97.111 27.1915H103.504L104.723 30.142ZM98.135 24.7721L100.318 19.5006L102.502 24.7721H98.135ZM112.768 30.142H115.957V18.9695H120.363V16.373H108.365V18.9695H112.771L112.768 30.142ZM126.34 27.5849V24.3984H132.733V21.92H126.34V18.9301H133.579V16.373H123.174V30.142H133.835V27.5849H126.34Z" fill="white"/>
  </svg>
);

const DEFAULT_SECTIONS: FooterSection[] = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Features', href: '/features' },
      { label: 'Works', href: '/works' },
      { label: 'Career', href: '/career' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Customer Support', href: '/support' },
      { label: 'Delivery Details', href: '/delivery' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
    ],
  },
  {
    title: 'FAQ',
    links: [
      { label: 'Account', href: '/faq/account' },
      { label: 'Manage Deliveries', href: '/faq/deliveries' },
      { label: 'Orders', href: '/faq/orders' },
      { label: 'Payments', href: '/faq/payments' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Free eBooks', href: '/resources/ebooks' },
      { label: 'Development Tutorial', href: '/resources/tutorials' },
      { label: 'How to - Blog', href: '/blog' },
      { label: 'Youtube Playlist', href: '/youtube', external: true },
    ],
  },
];

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  { platform: 'Twitter', href: 'https://twitter.com', icon: 'twitter' },
  { platform: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { platform: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { platform: 'GitHub', href: 'https://github.com', icon: 'github' },
];

const DEFAULT_BENEFIT_CARDS: BenefitCard[] = [
  {
    icon: (
      <svg width="38" height="27" viewBox="0 0 38 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0.461161 0.330078H26.8022C26.9769 0.330078 27.1444 0.399484 27.268 0.523028C27.3915 0.646573 27.4609 0.814132 27.4609 0.98885V26.0123C27.4609 26.187 27.3915 26.3546 27.268 26.4781C27.1444 26.6017 26.9769 26.6711 26.8022 26.6711H0.461161C0.286444 26.6711 0.118891 26.6017 -0.00465202 26.4781C-0.128197 26.3546 -0.197611 26.187 -0.197611 26.0123V0.98885C-0.197611 0.814132 -0.128197 0.646573 -0.00465202 0.523028C0.118891 0.399484 0.286444 0.330078 0.461161 0.330078ZM9.02223 1.64663V8.22738H18.2411V1.64263L9.02223 1.64663ZM1.12494 25.3535H26.1424V1.64663H19.5576V8.89016C19.5576 9.06487 19.4882 9.23243 19.3647 9.35598C19.2411 9.47952 19.0736 9.54893 18.8989 9.54893H8.36245C8.18773 9.54893 8.02018 9.47952 7.89664 9.35598C7.77309 9.23243 7.70368 9.06487 7.70368 8.89016V1.64663H1.11893L1.12494 25.3535Z" fill="#B4CAE4"/>
        <path d="M31.8909 10.2074V11.189L29.0459 9.5496L31.8909 7.91016V8.89182H37.3371C37.4257 8.88836 37.514 8.90283 37.5969 8.93436C37.6798 8.96588 37.7555 9.01382 37.8194 9.07529C37.8833 9.13675 37.9341 9.21048 37.9689 9.29207C38.0036 9.37366 38.0215 9.46141 38.0215 9.55008C38.0215 9.63876 38.0036 9.72653 37.9689 9.80811C37.9341 9.8897 37.8833 9.96343 37.8194 10.0249C37.7555 10.0864 37.6798 10.1343 37.5969 10.1658C37.514 10.1974 37.4257 10.2118 37.3371 10.2084L31.8909 10.2074Z" fill="#B4CAE4"/>
        <path d="M29.4354 16.7932H34.8815V15.8115L37.7266 17.451L34.8815 19.0904V18.1087H29.4354C29.2607 18.1087 29.0931 18.0393 28.9696 17.9158C28.846 17.7922 28.7766 17.6247 28.7766 17.45C28.7766 17.2753 28.846 17.1077 28.9696 16.9841C29.0931 16.8606 29.2607 16.7912 29.4354 16.7912V16.7932Z" fill="#B4CAE4"/>
      </svg>
    ),
    title: 'Easy returns',
    description: 'Return within 15 days of order delivery.',
    link: { text: 'See T&Cs', href: '/terms' },
  },
  {
    icon: (
      <svg width="41" height="24" viewBox="0 0 41 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.06943 6.46862C6.16631 6.37607 6.29519 6.32452 6.42917 6.32473H13.5691V0.728707C13.5691 0.589833 13.6243 0.456656 13.7225 0.358457C13.8207 0.260258 13.9538 0.205078 14.0927 0.205078H40.367C40.5059 0.205078 40.6391 0.260258 40.7373 0.358457C40.8355 0.456656 40.8906 0.589833 40.8906 0.728707V20.4736C40.8906 20.6125 40.8355 20.7457 40.7373 20.8439C40.6391 20.9421 40.5059 20.9973 40.367 20.9973H35.7703C35.6451 21.7952 35.239 22.5221 34.6252 23.0471C34.0114 23.572 33.2303 23.8605 32.4227 23.8605C31.615 23.8605 30.8339 23.572 30.2201 23.0471C29.6063 22.5221 29.2003 21.7952 29.075 20.9973H9.77479C9.65096 21.7963 9.24544 22.5246 8.6315 23.0507C8.01757 23.5768 7.23569 23.866 6.42717 23.866C5.61865 23.866 4.83679 23.5768 4.22286 23.0507C3.60892 22.5246 3.2034 21.7963 3.07957 20.9973H1.10296C0.964088 20.9973 0.830914 20.9421 0.732712 20.8439C0.634514 20.7457 0.57935 20.6125 0.57935 20.4736V11.8798C0.579395 11.8087 0.593941 11.7383 0.62212 11.673C0.650299 11.6077 0.691505 11.5489 0.743217 11.5L6.06943 6.46862Z" fill="#B4CAE4"/>
      </svg>
    ),
    title: 'We ship worldwide',
    description: 'visit',
    link: { text: 'www.laurent.abc', href: 'https://www.laurent.abc' },
  },
  {
    icon: (
      <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.8204 17.0545C9.08195 16.9158 9.3435 16.7788 9.60506 16.64C10.2349 16.3072 10.8666 15.9745 11.4964 15.6418C12.2562 15.2397 13.0159 14.8393 13.7775 14.4372C14.4358 14.0885 15.0959 13.7415 15.7543 13.3928C16.0728 13.2255 16.3859 13.0423 16.7097 12.8875C16.7151 12.8857 16.7186 12.8821 16.7222 12.8803C16.6635 12.9835 16.6048 13.085 16.5461 13.1882C16.5461 12.9106 16.5461 12.633 16.5461 12.3554C16.5461 11.6918 16.5461 11.0299 16.5461 10.3662C16.5461 9.56203 16.5461 8.7578 16.5461 7.95177C16.5461 7.25963 16.5461 6.56572 16.5461 5.87355C16.5461 5.53731 16.5336 5.19924 16.5461 4.86293C16.5461 4.85759 16.5461 4.85402 16.5461 4.84868C16.724 4.95192 16.9037 5.0533 17.0816 5.15651C16.8201 5.2953 16.5585 5.4323 16.2969 5.57106C15.6671 5.90379 15.0354 6.23653 14.4056 6.57106C13.6458 6.97319 12.8861 7.37526 12.1245 7.77562C11.4662 8.12438 10.8061 8.4731 10.1477 8.82005C9.82925 8.98729 9.51609 9.17058 9.19226 9.32536C9.18693 9.32717 9.18337 9.33071 9.17981 9.33248C9.23852 9.2293 9.29724 9.12789 9.35596 9.02471C9.35596 9.30223 9.35596 9.57982 9.35596 9.85561C9.35596 10.5175 9.35596 11.1811 9.35596 11.843C9.35596 12.6472 9.35596 13.4515 9.35596 14.2557C9.35596 14.9479 9.35596 15.64 9.35596 16.3322C9.35596 16.6685 9.36486 17.0065 9.35596 17.3428C9.35596 17.3481 9.35596 17.3517 9.35596 17.357C9.35596 17.5439 9.19226 17.7218 9.0001 17.7129C8.80794 17.704 8.64425 17.5563 8.64425 17.357C8.64425 17.0795 8.64425 16.8018 8.64425 16.5261C8.64425 15.8642 8.64425 15.2005 8.6442..." fill="#B4CAE4"/>
      </svg>
    ),
    title: 'Free shipping',
    description: 'Free shipping on orders above ₹ 1,000',
  },
  {
    icon: (
      <svg width="38" height="24" viewBox="0 0 38 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M-0.387993 7.27519C31.4373 0.26746 15.8067 3.72082 32.0384 0.112441C32.097 0.0967172 32.1582 0.0927091 32.2184 0.100637C32.2786 0.108565 32.3366 0.128278 32.3892 0.15865C32.4418 0.189021 32.4878 0.229456 32.5248 0.277642C32.5617 0.325829 32.5888 0.380822 32.6044 0.439479L34.6777 6.15908H37.538C37.6605 6.15908 37.778 6.20775 37.8647 6.29441C37.9513 6.38106 38 6.49858 38 6.62112V23.0118C38 23.1344 37.9513 23.2519 37.8647 23.3385C37.778 23.4252 37.6605 23.4739 37.538 23.4739H4.15948C4.15948 23.4739 -0.494007 7.3362 -0.387993 7.27519Z" fill="#B4CAE4"/>
        <path d="M34.2997 18.2644C33.8995 18.2647 33.5158 18.4238 33.2328 18.7067C32.9499 18.9897 32.7908 19.3734 32.7905 19.7736C32.7905 19.8961 32.7418 20.0136 32.6552 20.1003C32.5685 20.1869 32.451 20.2356 32.3285 20.2356H9.35706C9.23452 20.2356 9.11701 20.1869 9.03036 20.1003C8.9437 20.0136 8.89503 19.8961 8.89503 19.7736C8.89476 19.3741 8.73622 18.991 8.45412 18.7082C8.17202 18.4253 7.78934 18.2657 7.38986 18.2644C7.26732 18.2644 7.14979 18.2157 7.06314 18.1291C6.97649 18.0424 6.92781 17.9249 6.92781 17.8024V11.8287C6.92781 11.7062 6.97649 11.5887 7.06314 11.502C7.14979 11.4154 7.26732 11.3667 7.38986 11.3667C7.79004 11.3664 8.17374 11.2073 8.4567 10.9244C8.73967 10.6414 8.89876 10.2577 8.89902 9.85753C8.89902 9.73499 8.9477 9.61749 9.03435 9.53084C9.121 9.44419 9.23852 9.39551 9.36106 9.39551H32.3285C32.451 9.39551 32.5685 9.44419 32.6552 9.53084C32.7418 9.61749 32.7905 9.73499 32.7905 9.85753C32.7908 10.2577 32.9499 10.6414 33.2328 10.9244C33.5158 11.2073 33.8995 11.3664 34.2997 11.3667C34.4222 11.3667 34.5397 11.4154 34.6264 11.502C34.713 11.5887 34.7617 11.7062 34.7617 11.8287V17.8024C34.7615 17.9247 34.7127 18.042 34.626 18.1284C34.5394 18.2149 34.422 18.2644 34.2997 18.2644Z" fill="#B4CAE4"/>
        <path d="M20.8438 17.6034C20.2922 17.6034 19.753 17.4398 19.2943 17.1334C18.8357 16.8269 18.4782 16.3913 18.2671 15.8817C18.056 15.3721 18.0008 14.8113 18.1084 14.2703C18.216 13.7293 18.4816 13.2323 18.8717 12.8423C19.2617 12.4522 19.7587 12.1866 20.2997 12.079C20.8407 11.9714 21.4015 12.0266 21.9111 12.2377C22.4207 12.4488 22.8563 12.8063 23.1628 13.2649C23.4692 13.7235 23.6328 14.2628 23.6328 14.8144C23.632 15.5538 23.3379 16.2628 22.8151 16.7856C22.2922 17.3085 21.5833 17.6026 20.8438 17.6034Z" fill="#B4CAE4"/>
      </svg>
    ),
    title: 'Cash on delivery',
    description: 'COD available',
  },
];

export default function Footer({
  className = '',
  config = {},
}: FooterProps) {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use analytics hooks for tracking
  const {
    trackNewsletterSubmit,
    trackSocialClick,
    trackFooterLinkClick,
    trackBenefitClick,
  } = useFooterAnalytics();

  // Configuration with defaults
  const {
    logo = {},
    companyDescription = "We have clothes that suits your style and which you're proud to wear. From women to men.",
    sections = DEFAULT_SECTIONS,
    socialLinks = DEFAULT_SOCIAL_LINKS,
    benefitCards = DEFAULT_BENEFIT_CARDS,
    paymentBadges = [],
    texts = {},
    showNewsletter = true,
    showMindfulBrand = true,
    showBenefits = true,
    showPaymentBadges = true,
  } = config;

  const {
    mindfulBrandText = "We're only a mindful brand if we",
    copyrightText = "Shop.co © 2000-2023, All Rights Reserved",
    newsletter = {},
  } = texts;

  const {
    title = "JOIN SHOPPING COMMUNITY TO GET MONTHLY PROMO",
    subtitle = "Type your email down below and be young wild generation",
    inputPlaceholder = "Enter your email address here",
    buttonText = "SIGN ME UP",
    buttonLoadingText = "SIGNING UP...",
  } = newsletter;

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    let success = false;
    
    try {
      // Here you would typically call your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      success = true;
      setEmail('');
      console.log('Newsletter signup successful:', email);
    } catch (error) {
      success = false;
      console.error('Newsletter signup error:', error);
    } finally {
      // Track the form submission
      trackNewsletterSubmit(email, success);
      setIsSubmitting(false);
    }
  };

  const handleSocialClick = (platform: string, href: string) => {
    trackSocialClick(platform, href);
    // Handle actual navigation
    window.open(href, '_blank');
  };

  const handleFooterLinkClick = (label: string, href: string, section: string, external?: boolean) => {
    trackFooterLinkClick(label, href, section);
    // Handle actual navigation
    if (external) {
      window.open(href, '_blank');
    } else {
      window.location.href = href;
    }
  };

  const handleBenefitLinkClick = (benefit: string, href: string) => {
    trackBenefitClick(benefit, href);
    // Handle actual navigation
    window.location.href = href;
  };

  const handleLogoClick = () => {
    // Track logo click using general analytics
    console.log('Footer logo clicked');
    window.location.href = '/';
  };

  return (
    <footer className={`footer ${className}`}>
      {/* Newsletter Section */}
      {showNewsletter && (
        <section className="footer__newsletter-section">
          <div className="footer__newsletter-container">
            <h2 className="footer__newsletter-title">{title}</h2>
            <p className="footer__newsletter-subtitle">{subtitle}</p>
            <form onSubmit={handleNewsletterSubmit} className="footer__newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={inputPlaceholder}
                className="footer__newsletter-input"
                required
                disabled={isSubmitting}
              />
              <button 
                type="submit" 
                className="footer__newsletter-button"
                disabled={isSubmitting || !email.trim()}
              >
                {isSubmitting ? buttonLoadingText : buttonText}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Mindful Brand Section */}
      {showMindfulBrand && (
        <section className="footer__mindful-section">
          <div className="footer__mindful-container">
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="footer__heart">
              <path d="M11.3427 0.656262C8.78603 0.281668 8.09635 2.15963 7.92203 2.73901C7.75024 3.32087 7.64414 3.76789 7.4395 3.79786V3.78537C7.23487 3.7554 7.12877 3.30839 6.95445 2.72652C6.78266 2.14465 6.09045 0.269182 3.53381 0.643775C0.979705 1.02087 0.151072 4.57202 1.77297 6.79211C3.38981 9.00221 6.82055 11.5494 7.4395 13.5822V13.5947C8.05593 11.5619 11.4892 9.0147 13.1061 6.8046C14.728 4.5845 13.8994 1.03335 11.3427 0.656262Z" fill="#E96775"/>
            </svg>
            <span>{mindfulBrandText}</span>
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="footer__heart">
              <path d="M10.452 0.656262C7.89541 0.281668 7.20573 2.15963 7.03141 2.73901C6.85962 3.32087 6.75352 3.76789 6.54888 3.79786V3.78537C6.34425 3.7554 6.23815 3.30839 6.06383 2.72652C5.89204 2.14465 5.19983 0.269182 2.64319 0.643775C0.0890803 1.02087 -0.739553 4.57202 0.882345 6.79211C2.49919 9.00221 5.92993 11.5494 6.54888 13.5822V13.5947C7.16531 11.5619 10.5985 9.0147 12.2154 6.8046C13.8373 4.5845 13.0087 1.03335 10.452 0.656262Z" fill="#E96775"/>
            </svg>
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {showBenefits && benefitCards.length > 0 && (
        <section className="footer__benefits-section">
          <div className="footer__benefits-container">
            {benefitCards.map((card, index) => (
              <div key={index} className="footer__benefit-card">
                <div className="footer__benefit-icon">{card.icon}</div>
                <div className="footer__benefit-content">
                  <h3 className="footer__benefit-title">{card.title}</h3>
                  <p className="footer__benefit-description">{card.description}</p>
                  {card.link && (
                    <button 
                      className="footer__benefit-link"
                      onClick={() => handleBenefitLinkClick(card.title, card.link!.href)}
                    >
                      {card.link.text}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Main Footer */}
      <section className="footer__main">
        <div className="footer__main-container">
          <div className="footer__main-content">
            {/* Company Info */}
            <div className="footer__company">
              <div className="footer__logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                {logo.src ? (
                  <img
                    src={logo.src}
                    alt={logo.alt || 'Company Logo'}
                    width={logo.width || 150}
                    height={logo.height || 45}
                  />
                ) : (
                  <div className="footer__logo-icon">
                    <svg width="52" height="62" viewBox="0 0 70 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.5 7.71387L7 43.0161L45 43.0161L41.5 7.71387L9.5 7.71387Z" fill="url(#paint0_linear_602_1813)"/>
                      <path d="M24.7355 11.3633C25.3677 11.3633 25.9097 11.5828 26.3613 12.0217C26.8129 12.4375 27.05 12.9689 27.0726 13.6158V21.9672C27.05 22.9144 27.1065 23.7923 27.2419 24.6009C27.4 25.3864 27.7613 26.091 28.3258 26.7148C28.8903 27.3385 29.6016 27.6735 30.4597 27.7197H41.2984C41.9306 27.7428 42.45 27.9854 42.8565 28.4474C43.2855 28.9095 43.5 29.4639 43.5 30.1108C43.4774 30.7346 43.2516 31.2659 42.8226 31.7049C42.4161 32.1207 41.9081 32.3402 41.2984 32.3633H29.3081C27.7274 32.2709 26.4177 31.728 25.379 30.7346C24.3629 29.7181 23.629 28.4821 23.1774 27.0266C22.7484 25.5712 22.5226 24.0233 22.5 22.3831V13.6158C22.5226 12.992 22.7484 12.4722 23.1774 12.0564C23.6065 11.6174 24.1258 11.3864 24.7355 11.3633Z" fill="#5000BB"/>
                      <text fill="white" fontSize="40" x="19.5" y="29.7393">L</text>
                      <defs>
                        <linearGradient id="paint0_linear_602_1813" x1="43.2006" y1="9.41443" x2="8.29943" y2="44.3156" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#B38DE6"/>
                          <stop offset="1" stopColor="#5000BB"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                )}
                <div className="footer__logo-text">{DEFAULT_LOGO}</div>
              </div>
              <p className="footer__company-description">{companyDescription}</p>
              
              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="footer__social-links">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="footer__social-link"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSocialClick(social.platform, social.href);
                      }}
                      aria-label={social.platform}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {/* Default social icons */}
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="12" fill="white"/>
                        <path d="M20.7071 11.3474C20.2881 11.5336 19.8458 11.65 19.3802 11.7198C19.8458 11.4405 20.2183 10.9982 20.3812 10.4628C19.9389 10.7188 19.4501 10.9051 18.9146 11.0215C18.4956 10.5792 17.8904 10.2998 17.2386 10.2998C15.9815 10.2998 14.9572 11.3241 14.9572 12.5811C14.9572 12.7674 14.9805 12.9303 15.0271 13.0933C13.1415 13.0002 11.4421 12.0923 10.3014 10.6955C10.1152 11.0447 9.99878 11.4172 9.99878 11.8362C9.99878 12.6277 10.3945 13.3261 11.0231 13.7451C10.6506 13.7218 10.3014 13.6287 9.9755 13.4658V13.489C9.9755 14.6064 10.767 15.5376 11.8145 15.7471C11.6283 15.7937 11.4188 15.8169 11.2093 15.8169C11.0696 15.8169 10.9067 15.7937 10.767 15.7704C11.0696 16.6783 11.9077 17.3533 12.9087 17.3533C12.1172 17.9586 11.1395 18.3311 10.0686 18.3311C9.88239 18.3311 9.69616 18.3311 9.5332 18.3078C10.5575 18.9596 11.7447 19.3321 13.0483 19.3321C17.2618 19.3321 19.5665 15.8402 19.5665 12.8139C19.5665 12.7208 19.5665 12.6044 19.5665 12.5113C20.0088 12.2087 20.4045 11.8129 20.7071 11.3474Z" fill="black"/>
                      </svg>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Links */}
            {sections.length > 0 && (
              <div className="footer__links-section">
                {sections.map((section, index) => (
                  <div key={index} className="footer__link-column">
                    <h4 className="footer__link-title">{section.title}</h4>
                    <ul className="footer__link-list">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className="footer__link"
                            onClick={(e) => {
                              e.preventDefault();
                              handleFooterLinkClick(link.label, link.href, section.title, link.external);
                            }}
                            target={link.external ? '_blank' : undefined}
                            rel={link.external ? 'noopener noreferrer' : undefined}
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Bottom */}
          <div className="footer__bottom">
            <div className="footer__bottom-content">
              <p className="footer__copyright">{copyrightText}</p>
              
              {/* Payment Badges */}
              {showPaymentBadges && paymentBadges.length > 0 && (
                <div className="footer__payment-badges">
                  {paymentBadges.map((badge, index) => (
                    <div key={index} className="footer__payment-badge" title={badge.alt}>
                      {badge.icon}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </footer>
  );
}
