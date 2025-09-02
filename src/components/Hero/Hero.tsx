'use client';

import React from 'react';
import './Hero.css';

export interface HeroProps {
  className?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  badgeText?: string;
  backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({
  className = '',
  title = 'HEALTHY FOOD RECIPES',
  subtitle = 'FRESHER FRUITS',
  description = 'Why is healthy food important? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce iaculis vitae nulla quis egestas. Mauris eros diam, rutrum posuere',
  badgeText = 'FRESHER FRUITS',
  backgroundImage = 'https://api.builder.io/api/v1/image/assets/TEMP/e496f0e6bc675523b196f7171d2f405b77fe090b?width=3840',
}) => {
  return (
    <section className={`hero ${className}`}>
      <div className="hero__container">
        <div 
          className="hero__background"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="hero__content">
            <div className="hero__badge">
              <div className="hero__badge-icon">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 2L24.5 15.5L38 20L24.5 24.5L20 38L15.5 24.5L2 20L15.5 15.5L20 2Z" fill="#FFA500"/>
                </svg>
              </div>
              <span className="hero__badge-text">{badgeText}</span>
            </div>
            
            <div className="hero__main-content">
              <h1 className="hero__title">{title}</h1>
              
              <div className="hero__description-section">
                <h3 className="hero__description-title">Why is healthy food important?</h3>
                <p className="hero__description">{description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
