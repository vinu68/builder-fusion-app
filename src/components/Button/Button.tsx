'use client';

import React from 'react';
import { ButtonProps } from './types';
import { useButtonAnalytics } from '../../hooks/useAnalytics';
import './Button.css';

const Button: React.FC<ButtonProps> = ({
  variant = 'contained',
  size = 'medium',
  startIcon,
  endIcon,
  children,
  className = '',
  disabled = false,
  type = 'button',
  onClick,
  ...rest
}) => {
  const { trackButtonClick } = useButtonAnalytics(variant, size);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;

    // Track the button click
    trackButtonClick(
      typeof children === 'string' ? children : 'button',
      undefined, // context can be added if needed
      {
        button_type: type,
        has_start_icon: !!startIcon,
        has_end_icon: !!endIcon,
        disabled,
      }
    );

    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
  };

  const baseClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    disabled ? 'is-disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={baseClasses}
      disabled={disabled}
      aria-disabled={disabled}
      type={type}
      onClick={handleClick}
      {...rest}
    >
      {startIcon && (
        <span className="button__icon button__icon--start">
          {startIcon}
        </span>
      )}
      <span className="button__label">{children}</span>
      {endIcon && (
        <span className="button__icon button__icon--end">
          {endIcon}
        </span>
      )}
    </button>
  );
};

export default Button;
