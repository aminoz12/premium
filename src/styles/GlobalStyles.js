import { createGlobalStyle } from 'styled-components'

const GlobalStyles = createGlobalStyle`
  /* CSS Reset and Base Styles */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    /* Professional Dark Theme */
    --primary-bg: #0c0c0c;
    --secondary-bg: #1a1a1a;
    --tertiary-bg: #2a2a2a;
    --card-bg: #1e1e1e;
    --surface-bg: #252525;
    --text-primary: #ffffff;
    --text-secondary: #e0e0e0;
    --text-muted: #a0a0a0;
    --text-accent: #f0f0f0;
    
    /* TV Premium Inspired Accent Colors */
    --accent-primary: #ff6b35;
    --accent-secondary: #f7931e;
    --accent-tertiary: #ff8c42;
    --accent-gradient: linear-gradient(135deg, #ff6b35 0%, #f7931e 50%, #ff8c42 100%);
    --accent-gradient-hover: linear-gradient(135deg, #e55a2b 0%, #e8841a 50%, #e67e3a 100%);
    
    /* Status Colors */
    --success: #10b981;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: #3b82f6;
    
    /* Neutral Colors */
    --border-color: #404040;
    --border-light: #2a2a2a;
    --hover-bg: #2a2a2a;
    --active-bg: #3a3a3a;
    
    /* Shadows - Enhanced Modern Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
    --shadow-xl: 0 25px 50px rgba(0, 0, 0, 0.25);
    --shadow-2xl: 0 30px 60px rgba(0, 0, 0, 0.3);
    --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3);
    --shadow-glow-accent: 0 0 30px rgba(255, 107, 53, 0.4);
    --shadow-hover: 0 15px 35px rgba(255, 107, 53, 0.2);
    --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    
    /* Typography */
    --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-family-heading: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;
    --font-size-5xl: 3rem;
    --font-size-6xl: 3.75rem;
    --font-size-7xl: 4.5rem;
    
    /* Font Weights */
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-extrabold: 800;
    --font-weight-black: 900;
    
    /* Line Heights */
    --line-height-tight: 1.25;
    --line-height-snug: 1.375;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.625;
    --line-height-loose: 2;
    
    /* Spacing Scale */
    --spacing-0: 0;
    --spacing-1: 0.25rem;
    --spacing-2: 0.5rem;
    --spacing-3: 0.75rem;
    --spacing-4: 1rem;
    --spacing-5: 1.25rem;
    --spacing-6: 1.5rem;
    --spacing-8: 2rem;
    --spacing-10: 2.5rem;
    --spacing-12: 3rem;
    --spacing-16: 4rem;
    --spacing-20: 5rem;
    --spacing-24: 6rem;
    --spacing-32: 8rem;
    
    /* Legacy spacing for compatibility */
    --spacing-xs: var(--spacing-1);
    --spacing-sm: var(--spacing-2);
    --spacing-md: var(--spacing-4);
    --spacing-lg: var(--spacing-6);
    --spacing-xl: var(--spacing-8);
    --spacing-2xl: var(--spacing-12);
    --spacing-3xl: var(--spacing-16);
    
    /* Border Radius */
    --border-radius-none: 0;
    --border-radius-sm: 0.25rem;
    --border-radius-md: 0.375rem;
    --border-radius-lg: 0.5rem;
    --border-radius-xl: 0.75rem;
    --border-radius-2xl: 1rem;
    --border-radius-3xl: 1.5rem;
    --border-radius-full: 9999px;
    
    /* Transitions */
    --transition-none: none;
    --transition-all: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-colors: color 150ms cubic-bezier(0.4, 0, 0.2, 1), background-color 150ms cubic-bezier(0.4, 0, 0.2, 1), border-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-opacity: opacity 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-shadow: box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-transform: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
    
    /* Legacy transitions */
    --transition-fast: 0.15s ease;
    --transition-base: 0.3s ease;
    --transition-slow: 0.5s ease;
  }

  html {
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  html, body {
    max-width: 100%;
    overflow-x: hidden;
  }

  body {
    font-family: var(--font-family);
    background-color: var(--primary-bg);
    color: var(--text-primary);
    line-height: var(--line-height-normal);
    font-weight: var(--font-weight-normal);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  /* Prevent media from ever causing horizontal overflow on small screens */
  img, svg, video, canvas {
    max-width: 100%;
  }

  #root {
    overflow-x: hidden;
  }

  /* Professional scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: var(--secondary-bg);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--accent-primary);
    border-radius: var(--border-radius-full);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: var(--accent-secondary);
  }

  /* Selection styles */
  ::selection {
    background: var(--accent-primary);
    color: var(--text-primary);
  }

  ::-moz-selection {
    background: var(--accent-primary);
    color: var(--text-primary);
  }

  /* Utility Classes */
  .container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 var(--spacing-6);
  }

  .section-header {
    text-align: center;
    margin-bottom: var(--spacing-16);
    position: relative;
  }

  /* Premium eyebrow / kicker label above section titles */
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: var(--spacing-2);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--accent-primary);
    margin-bottom: var(--spacing-4);
  }

  .eyebrow::before {
    content: '';
    width: 24px;
    height: 1px;
    background: var(--accent-primary);
    opacity: 0.6;
  }

  .section-header h2 {
    font-size: var(--font-size-5xl);
    font-weight: var(--font-weight-extrabold);
    margin-bottom: var(--spacing-5);
    color: var(--text-primary);
    line-height: 1.1;
    letter-spacing: -0.03em;
  }

  .section-header h2 .accent {
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .section-header p {
    font-size: var(--font-size-xl);
    color: var(--text-muted);
    max-width: 620px;
    margin: 0 auto;
    line-height: var(--line-height-relaxed);
    font-weight: var(--font-weight-normal);
  }

  /* Professional focus styles */
  *:focus {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }

  *:focus:not(:focus-visible) {
    outline: none;
  }

  *:focus-visible {
    outline: 2px solid var(--accent-primary);
    outline-offset: 2px;
  }

  /* Professional Button System */
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-2);
    padding: var(--spacing-3) var(--spacing-6);
    border: none;
    border-radius: var(--border-radius-xl);
    font-family: inherit;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    letter-spacing: 0.01em;
    text-decoration: none;
    cursor: pointer;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                background 0.25s cubic-bezier(0.4, 0, 0.2, 1),
                border-color 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
  }

  .btn-primary {
    background: var(--accent-gradient);
    color: #fff;
    box-shadow: 0 6px 18px rgba(255, 107, 53, 0.28);
    border: 1px solid transparent;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--accent-gradient-hover);
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(255, 107, 53, 0.38);
  }

  .btn-primary:active {
    transform: translateY(0);
    box-shadow: 0 6px 18px rgba(255, 107, 53, 0.28);
  }

  .btn-secondary {
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-primary);
    border: 1px solid rgba(255, 255, 255, 0.16);
    backdrop-filter: blur(8px);
  }

  .btn-secondary:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.28);
    transform: translateY(-2px);
  }

  .btn-outline {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid var(--border-color);
  }

  .btn-outline:hover:not(:disabled) {
    border-color: var(--accent-primary);
    color: var(--text-primary);
    transform: translateY(-2px);
  }

  .btn-whatsapp {
    background: #25d366;
    color: #fff;
    border: 1px solid transparent;
    box-shadow: 0 6px 18px rgba(37, 211, 102, 0.28);
  }

  .btn-whatsapp:hover:not(:disabled) {
    background: #1ebe5d;
    transform: translateY(-2px);
    box-shadow: 0 12px 28px rgba(37, 211, 102, 0.38);
  }

  .btn-ghost {
    background: transparent;
    color: var(--text-secondary);
    border: 1px solid transparent;
  }

  .btn-ghost:hover:not(:disabled) {
    background: var(--hover-bg);
    color: var(--text-primary);
  }

  /* Button Sizes */
  .btn-sm {
    padding: var(--spacing-2) var(--spacing-4);
    font-size: var(--font-size-sm);
  }

  .btn-lg {
    padding: var(--spacing-4) var(--spacing-8);
    font-size: var(--font-size-lg);
  }

  .btn-xl {
    padding: var(--spacing-5) var(--spacing-10);
    font-size: var(--font-size-xl);
  }

  /* Legacy button size */
  .btn-large {
    padding: var(--spacing-4) var(--spacing-8);
    font-size: var(--font-size-lg);
  }

  /* Responsive Design */
  @media (max-width: 1024px) {
    .container {
      padding: 0 var(--spacing-md);
    }
  }

  @media (max-width: 768px) {
    .section-header h2 {
      font-size: var(--font-size-3xl);
    }
  }

  @media (max-width: 480px) {
    .container {
      padding: 0 var(--spacing-sm);
    }
    
    .section-header h2 {
      font-size: var(--font-size-2xl);
    }
  }

  /* Print Styles */
  @media print {
    .floating-support,
    .hero-video,
    .scroll-indicator {
      display: none;
    }
    
    .hero {
      height: auto;
      padding: var(--spacing-2xl) 0;
    }
    
    body {
      background: white;
      color: black;
    }
  }
`

export default GlobalStyles
