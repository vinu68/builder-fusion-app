'use client';

import { Button, ThemeToggle, Section } from '../components';
import styles from "./page.module.css";

export default function Home() {
  const handleClick = (message: string) => {
    console.log(`Button clicked: ${message}`);
  };

  return (
    <div className={styles.page}>
      <Section background="default" padding="large" textAlign="center">
        <div className={styles.header}>
          <h1>Component Demo</h1>
          <ThemeToggle />
        </div>
      </Section>

      <Section background="default" padding="large">
        <h2>Variants</h2>
        <div className={styles.buttonGroup}>
          <Button variant="contained" onClick={() => handleClick('Contained')}>
            Contained
          </Button>
          <Button variant="outline" onClick={() => handleClick('Outline')}>
            Outline
          </Button>
          <Button variant="text" onClick={() => handleClick('Text')}>
            Text
          </Button>
        </div>
      </Section>

      <Section background="alternate" padding="large">
        <h2>🎨 Theme Support</h2>
        <p>Use the theme toggle above to see how buttons automatically adapt to light and dark themes using CSS custom properties.</p>
        <div className={styles.buttonGroup}>
          <Button variant="contained">Themed Contained</Button>
          <Button variant="outline">Themed Outline</Button>
          <Button variant="text">Themed Text</Button>
        </div>
      </Section>

      <Section background="alternate" padding="large">
        <h2>Sizes</h2>
        <div className={styles.buttonGroup}>
          <Button size="small" onClick={() => handleClick('Small')}>
            Small
          </Button>
          <Button size="medium" onClick={() => handleClick('Medium')}>
            Medium
          </Button>
          <Button size="large" onClick={() => handleClick('Large')}>
            Large
          </Button>
        </div>
      </Section>

      <Section background="default" padding="large">
        <h2>With Icons</h2>
        <div className={styles.buttonGroup}>
          <Button 
            startIcon={<span>💾</span>}
            onClick={() => handleClick('Start Icon')}
          >
            Save
          </Button>
          <Button 
            endIcon={<span>→</span>}
            onClick={() => handleClick('End Icon')}
          >
            Continue
          </Button>
          <Button 
            variant="outline"
            startIcon={<span>📁</span>}
            endIcon={<span>↗</span>}
            onClick={() => handleClick('Both Icons')}
          >
            Open File
          </Button>
        </div>
      </Section>

      <Section background="alternate" padding="large">
        <h2>States</h2>
        <div className={styles.buttonGroup}>
          <Button onClick={() => handleClick('Active')}>
            Active
          </Button>
          <Button disabled>
            Disabled
          </Button>
          <Button variant="outline" disabled>
            Disabled Outline
          </Button>
          <Button variant="text" disabled>
            Disabled Text
          </Button>
        </div>
      </Section>

      <Section background="default" padding="large">
        <h2>All Combinations</h2>
        <div className={styles.variantGrid}>
          {['contained', 'outline', 'text'].map((variant) => (
            <div key={variant} className={styles.variantColumn}>
              <h3>{variant.charAt(0).toUpperCase() + variant.slice(1)}</h3>
              {['small', 'medium', 'large'].map((size) => (
                <Button
                  key={`${variant}-${size}`}
                  variant={variant as any}
                  size={size as any}
                  onClick={() => handleClick(`${variant} ${size}`)}
                  className={styles.demoButton}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
