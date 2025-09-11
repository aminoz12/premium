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
    
    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 20px 25px rgba(0, 0, 0, 0.15);
    --shadow-xl: 0 25px 50px rgba(0, 0, 0, 0.25);
    --shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3);
    
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
  }

  body {
    font-family: var(--font-family);
    background-color: var(--primary-bg);
    color: var(--text-primary);
    line-height: var(--line-height-normal);
    overflow-x: hidden;
    font-weight: var(--font-weight-normal);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
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
    margin-bottom: var(--spacing-20);
    position: relative;
  }

  .section-header h2 {
    font-size: var(--font-size-5xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-6);
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: var(--line-height-tight);
    letter-spacing: -0.025em;
  }

  .section-header p {
    font-size: var(--font-size-xl);
    color: var(--text-secondary);
    max-width: 700px;
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
    border-radius: var(--border-radius-lg);
    font-family: inherit;
    font-size: var(--font-size-base);
    font-weight: var(--font-weight-semibold);
    text-decoration: none;
    cursor: pointer;
    transition: var(--transition-all);
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
    color: var(--text-primary);
    box-shadow: var(--shadow-md);
    border: 1px solid transparent;
  }

  .btn-primary:hover:not(:disabled) {
    background: var(--accent-gradient-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-lg);
  }

  .btn-primary:active {
    transform: translateY(0);
    box-shadow: var(--shadow-md);
  }

  .btn-secondary {
    background: var(--accent-primary);
    color: var(--text-primary);
    border: 2px solid var(--accent-primary);
    box-shadow: var(--shadow-sm);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--accent-secondary);
    border-color: var(--accent-secondary);
    color: var(--text-primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  .btn-outline {
    background: transparent;
    color: var(--text-secondary);
    border: 2px solid var(--border-color);
    box-shadow: var(--shadow-sm);
  }

  .btn-outline:hover:not(:disabled) {
    border-color: var(--accent-primary);
    background: var(--accent-primary);
    color: var(--text-primary);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
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
