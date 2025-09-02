'use client';

import React from 'react';
import './Hero.css';

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

const Hero: React.FC<HeroProps> = ({
  className = '',
  title = 'GET THE BEST QUALITY PRODUCTS AT THE LOWEST PRICES',
  description = 'We have prepared special discounts for you on grocery products. Don\'t miss these opportunities...',
  buttonText = 'SHOP NOW',
  currentPrice = '$21.67',
  originalPrice = '$26.67',
  offerText = 'Don\'t miss this limited time offer.',
  backgroundImage = 'https://api.builder.io/api/v1/image/assets/TEMP/f8588ca9b9f1062669cb4b75f56daff5bf9713ec?width=3984',
  onShopNow,
}) => {
  const handleShopNow = () => {
    if (onShopNow) {
      onShopNow();
    } else {
      console.log('Shop Now clicked');
    }
  };

  return (
    <section className={`hero ${className}`}>
      <div className="hero__container">
        <div
          className="hero__background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="hero__overlay"></div>
          <div className="hero__content">
            <div className="hero__main-content">
              <h1 className="hero__title">{title}</h1>
              <p className="hero__description">{description}</p>

              <div className="hero__actions">
                <button
                  className="hero__shop-button"
                  onClick={handleShopNow}
                  aria-label="Shop now for discounted products"
                >
                  {buttonText}
                </button>

                <div className="hero__pricing">
                  <div className="hero__price-current">{currentPrice}</div>
                  <div className="hero__price-original">{originalPrice}</div>
                  <div className="hero__offer-text">{offerText}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
