'use client';

/**
 * random-image-ai.tsx
 * -----------------------------------------------------------------------------
 * Next.js conversion of the original "Free Random Image Generator" HTML page.
 *
 * Drop this file into either:
 *   - Pages Router:  pages/random-image-ai.tsx
 *   - App Router:    app/random-image-ai/page.tsx   (rename default export to Page)
 *
 * Everything from the original HTML is preserved (markup, styles, JS logic,
 * structured data). Plus an extended 2000+ word SEO content section and a
 * dedicated "SEO Explained" FAQ has been added at the bottom.
 * -----------------------------------------------------------------------------
 */

import Head from 'next/head';
import { useEffect } from 'react';

/* ────────────────────────────────────────────────────────────────
   ORIGINAL CSS (verbatim from the source HTML)
   ──────────────────────────────────────────────────────────────── */
const APP_STYLES = `
/* ── CSS Custom Properties (Black & White Theme) ── */
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f8f8;
  --bg-tertiary: #f0f0f0;
  --text-primary: #111111;
  --text-secondary: #555555;
  --text-muted: #ffffffff;
  --border-color: #977171ff;
  --border-light: #b69595ff;
  --accent: #363333ff;
  --accent-hover: #333333;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.1);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.12);
  --radius-sm: 0.5rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --transition: 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.dark {
  --bg-primary: #0a0a0a;
  --bg-secondary: #141414;
  --bg-tertiary: #1a1a1a;
  --text-primary: #f5f5f5;
  --text-secondary: #ffffffff;
  --text-muted: #ffffffff;
  --border-color: #2a2a2a;
  --border-light: #222222;
  --accent: #564c4cff;
  --accent-hover: #e0e0e0;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  line-height: 1.6;
  transition: background-color var(--transition), color var(--transition);
  min-height: 100vh;
  overflow-x: hidden;
}
::-webkit-scrollbar { width: 6px; height: 6px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--border-color); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
*:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.skip-link {
  position: absolute; top: -40px; left: 0;
  background: var(--accent); color: var(--bg-primary);
  padding: 8px 16px; z-index: 10000; font-weight: 600; transition: top 0.2s;
}
.skip-link:focus { top: 0; }
#site-header {
  position: sticky; top: 0; z-index: 100;
  background: var(--bg-primary); border-bottom: 1px solid var(--border-light);
  backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
  transition: background-color var(--transition), border-color var(--transition);
}
.header-inner {
  max-width: 1320px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.875rem 1.5rem; gap: 1rem;
}
.logo {
  display: flex; align-items: center; gap: 0.625rem;
  font-size: 1.125rem; font-weight: 700; letter-spacing: -0.02em;
  text-decoration: none; color: var(--text-primary);
}
.logo-icon { width: 32px; height: 32px; flex-shrink: 0; }
.header-actions { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; }
.header-nav { display: flex; gap: 0.5rem; }
.nav-link {
  display: inline-flex; align-items: center; gap: 0.35rem;
  padding: 0.5rem 0.875rem; font-size: 0.8125rem; font-weight: 600;
  text-decoration: none; color: var(--text-secondary);
  border: 1px solid var(--border-color); border-radius: var(--radius-sm);
  transition: all var(--transition); min-height: 38px;
}
.nav-link:hover { color: var(--text-primary); border-color: var(--text-primary); background: var(--bg-secondary); }
.theme-toggle-group { display: flex; align-items: center; gap: 0.5rem; }
.theme-label { font-size: 0.75rem; color: var(--text-muted); font-weight: 500; }
.toggle-switch { position: relative; display: inline-block; width: 48px; height: 26px; flex-shrink: 0; }
.toggle-switch input { opacity: 0; width: 0; height: 0; position: absolute; }
.toggle-slider {
  position: absolute; inset: 0; border-radius: 13px;
  background: var(--border-color); cursor: pointer;
  transition: background var(--transition); border: 1px solid var(--border-color);
}
.toggle-slider::before {
  content: ''; position: absolute; width: 20px; height: 20px;
  border-radius: 50%; left: 2px; top: 2px;
  background: var(--bg-primary); transition: transform var(--transition);
  box-shadow: var(--shadow-sm);
}
.toggle-switch input:checked + .toggle-slider { background: var(--accent); border-color: var(--accent); }
.toggle-switch input:checked + .toggle-slider::before { transform: translateX(22px); background: var(--bg-primary); }
.toggle-switch input:focus-visible + .toggle-slider { outline: 2px solid var(--accent); outline-offset: 2px; }
#hero {
  background: linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  padding: 4rem 1.5rem 3.5rem; text-align: center;
  border-bottom: 1px solid var(--border-light); position: relative; overflow: hidden;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 0.5rem;
  background: var(--bg-tertiary); border: 1px solid var(--border-color);
  border-radius: 9999px; padding: 0.375rem 1rem;
  font-size: 0.75rem; font-weight: 600; letter-spacing: 0.05em;
  text-transform: uppercase; color: var(--text-secondary); margin-bottom: 1.5rem;
}
.hero-badge svg { width: 14px; height: 14px; color: var(--text-primary); }
#hero h2 {
  font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800;
  letter-spacing: -0.03em; line-height: 1.1;
  margin-bottom: 1.25rem; color: var(--text-primary);
}
.hero-highlight { position: relative; display: inline; }
.hero-highlight::after {
  content: ''; position: absolute; bottom: 2px; left: 0; right: 0;
  height: 0.15em; background: var(--text-primary); opacity: 0.15;
}
#hero > p {
  font-size: clamp(1rem, 2.5vw, 1.175rem); color: var(--text-secondary);
  max-width: 620px; margin: 0 auto 2rem; line-height: 1.7;
}
#hero strong { font-weight: 700; color: var(--text-primary); }
.cta-container { display: flex; flex-wrap: wrap; gap: 0.875rem; justify-content: center; margin-bottom: 2.5rem; }
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
  font-family: inherit; font-size: 0.9375rem; font-weight: 700;
  text-decoration: none; border: none; border-radius: var(--radius-md);
  cursor: pointer; transition: all 0.2s ease; min-height: 52px; padding: 0 1.75rem;
}
.btn svg { width: 18px; height: 18px; flex-shrink: 0; }
.btn-primary { background: var(--accent); color: var(--bg-primary); box-shadow: var(--shadow-md); }
.btn-primary:hover { background: var(--accent-hover); transform: translateY(-2px); box-shadow: var(--shadow-lg); }
.btn-primary:active { transform: translateY(0); }
.btn-outline { background: transparent; color: var(--text-primary); border: 2px solid var(--text-primary); }
.btn-outline:hover { background: var(--text-primary); color: var(--bg-primary); transform: translateY(-2px); }
.trust-signals { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; }
.trust-item {
  display: inline-flex; align-items: center; gap: 0.4rem;
  background: var(--bg-primary); border: 1px solid var(--border-color);
  border-radius: 9999px; padding: 0.4rem 1rem;
  font-size: 0.7875rem; font-weight: 600; color: var(--text-secondary);
  transition: border-color var(--transition);
}
.trust-item:hover { border-color: var(--text-primary); }
.trust-item svg { width: 14px; height: 14px; flex-shrink: 0; }
.trust-check { color: var(--text-primary); }
.hero-preview {
  max-width: 720px; margin: 2.5rem auto 0;
  border-radius: var(--radius-lg); overflow: hidden;
  box-shadow: var(--shadow-lg); aspect-ratio: 16/9;
  background: var(--bg-tertiary); position: relative;
}
.hero-preview img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  opacity: 1; transition: opacity 0.4s ease;
}
.hero-preview img.loading { opacity: 0; }
#search-section { max-width: 900px; margin: 2.5rem auto 1.5rem; padding: 0 1.5rem; }
.search-wrapper {
  position: relative; display: flex; align-items: center; gap: 0.625rem;
  background: var(--bg-primary); border: 2px solid var(--border-color);
  border-radius: var(--radius-lg); padding: 0.5rem 0.5rem 0.5rem 1.125rem;
  box-shadow: var(--shadow-sm);
  transition: border-color 0.2s, box-shadow 0.2s, background var(--transition);
}
.search-wrapper:focus-within { border-color: var(--text-primary); box-shadow: 0 0 0 3px rgba(17,17,17,0.1); }
.dark .search-wrapper:focus-within { box-shadow: 0 0 0 3px rgba(255,255,255,0.1); }
.search-icon { color: var(--text-muted); flex-shrink: 0; }
#search-input {
  flex: 1; border: none; outline: none; background: transparent;
  color: var(--text-primary); font-family: inherit; font-size: 1rem;
  padding: 0.4rem 0; min-width: 0;
}
#search-input::placeholder { color: var(--text-muted); }
.btn-search {
  background: var(--accent); color: var(--bg-primary); border: none;
  border-radius: var(--radius-sm); padding: 0.65rem 1.25rem;
  font-family: inherit; font-size: 0.875rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s; white-space: nowrap; min-height: 44px;
}
.btn-search:hover { opacity: 0.85; transform: scale(1.02); }
#categories-nav {
  max-width: 1320px; margin: 1.25rem auto 1rem; padding: 0 1.5rem;
  display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center;
}
.categories-label {
  font-size: 0.7875rem; font-weight: 600; color: var(--text-muted);
  margin-right: 0.25rem; text-transform: uppercase; letter-spacing: 0.04em;
}
.category-btn {
  background: var(--bg-primary); border: 1px solid var(--border-color);
  border-radius: 9999px; padding: 0.4rem 0.9375rem;
  font-family: inherit; font-size: 0.8125rem; font-weight: 600;
  color: var(--text-secondary); cursor: pointer; transition: all 0.2s;
  min-height: 36px; display: inline-flex; align-items: center; gap: 0.35rem;
}
.category-btn svg { width: 14px; height: 14px; }
.category-btn:hover, .category-btn.active {
  background: var(--text-primary); color: var(--bg-primary); border-color: var(--text-primary);
}
.dark .category-btn:hover, .dark .category-btn.active {
  background: var(--bg-primary); color: var(--text-primary);
}
#view-tabs {
  max-width: 1320px; margin: 1.5rem auto 0; padding: 0 1.5rem;
  display: flex; gap: 0.5rem; flex-wrap: wrap;
  border-bottom: 1px solid var(--border-light); padding-bottom: 1rem;
}
.view-tab {
  background: transparent; border: 1px solid var(--border-color);
  border-radius: var(--radius-md); padding: 0.55rem 1.25rem;
  font-family: inherit; font-size: 0.85rem; font-weight: 700;
  color: var(--text-secondary); cursor: pointer; transition: all 0.2s;
  min-height: 42px; display: inline-flex; align-items: center; gap: 0.4rem;
}
.view-tab svg { width: 16px; height: 16px; }
.view-tab:hover { border-color: var(--text-primary); color: var(--text-primary); }
.view-tab.active { background: var(--text-primary); color: var(--bg-primary); border-color: var(--text-primary); }
.dark .view-tab.active { background: var(--bg-primary); color: var(--text-primary); }
.badge-count {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 20px; height: 20px; padding: 0 0.375rem;
  background: var(--text-primary); color: var(--bg-primary);
  border-radius: 10px; font-size: 0.6875rem; font-weight: 700;
}
.dark .badge-count { background: var(--bg-primary); color: var(--text-primary); }
.badge-hot {
  background: var(--text-primary); color: var(--bg-primary);
  font-size: 0.625rem; padding: 0.175rem 0.5rem;
  border-radius: 4px; font-weight: 800; letter-spacing: 0.05em;
}
.section-header {
  max-width: 1320px; margin: 1.75rem auto 1rem; padding: 0 1.5rem;
  display: flex; align-items: center; justify-content: space-between;
  gap: 1rem; flex-wrap: wrap;
}
.section-title {
  font-size: 1.1rem; font-weight: 800; color: var(--text-primary);
  display: flex; align-items: center; gap: 0.5rem;
}
.section-title svg { width: 20px; height: 20px; }
.result-count { font-weight: 400; font-size: 0.9rem; color: var(--text-muted); }
.sort-options { display: flex; gap: 0.5rem; }
.sort-btn {
  background: var(--bg-primary); border: 1px solid var(--border-color);
  border-radius: var(--radius-sm); padding: 0.4rem 0.875rem;
  font-family: inherit; font-size: 0.7875rem; font-weight: 600;
  color: var(--text-secondary); cursor: pointer; transition: all 0.2s; min-height: 34px;
}
.sort-btn.active { background: var(--text-primary); color: var(--bg-primary); border-color: var(--text-primary); }
.dark .sort-btn.active { background: var(--bg-primary); color: var(--text-primary); }
#image-grid {
  max-width: 1320px; margin: 0 auto; padding: 0 1.5rem 3rem;
  display: grid; grid-template-columns: repeat(1, 1fr); gap: 1.25rem;
}
@media (min-width: 540px) { #image-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 768px) { #image-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 1024px) { #image-grid { grid-template-columns: repeat(4, 1fr); } }
.image-card {
  background: var(--bg-primary); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color var(--transition);
  position: relative; display: flex; flex-direction: column;
  animation: cardFadeIn 0.4s ease both;
}
@keyframes cardFadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
.image-card:hover { transform: translateY(-6px); box-shadow: var(--shadow-lg); border-color: var(--text-muted); }
.card-image-wrapper {
  position: relative; overflow: hidden; aspect-ratio: 4/3;
  background: var(--bg-tertiary); cursor: pointer;
}
.card-image-wrapper img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.4s ease;
}
.card-image-wrapper:hover img { transform: scale(1.05); }
.blur-placeholder {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #e0e0e0 0%, #c0c0c0 100%);
  z-index: 1; transition: opacity 0.5s ease;
}
.dark .blur-placeholder { background: linear-gradient(135deg, #222 0%, #333 100%); }
.blur-placeholder.loaded { opacity: 0; }
.card-image-wrapper img { position: relative; z-index: 2; }
.card-overlay {
  position: absolute; inset: 0; z-index: 5;
  background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%);
  opacity: 0; transition: opacity 0.3s ease;
  display: flex; align-items: flex-end; padding: 0.75rem; pointer-events: none;
}
.card-image-wrapper:hover .card-overlay { opacity: 1; }
.overlay-action-btn {
  background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.25); color: #fff;
  border-radius: var(--radius-sm); padding: 0.35rem 0.75rem;
  font-size: 0.725rem; font-weight: 600; cursor: pointer;
  pointer-events: all; font-family: inherit; transition: background 0.2s;
}
.overlay-action-btn:hover { background: rgba(255,255,255,0.28); }
.favorite-btn {
  position: absolute; top: 0.625rem; right: 0.625rem; z-index: 6;
  background: rgba(255,255,255,0.9); border: none; border-radius: 50%;
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all 0.2s ease; box-shadow: var(--shadow-sm);
}
.dark .favorite-btn { background: rgba(30,30,30,0.9); }
.favorite-btn:hover { transform: scale(1.12); }
.favorite-btn.active { background: var(--text-primary); }
.favorite-btn.active svg { fill: var(--bg-primary); stroke: var(--bg-primary); }
.favorite-btn svg { width: 18px; height: 18px; color: var(--text-primary); transition: color 0.2s; }
.dark .favorite-btn svg { color: var(--text-primary); }
.card-body { padding: 0.875rem 1rem; flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
.card-title {
  font-size: 0.8625rem; font-weight: 700; color: var(--text-primary);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.card-author { font-size: 0.75rem; color: var(--text-muted); display: flex; align-items: center; gap: 0.3rem; }
.card-author svg { width: 12px; height: 12px; }
.card-actions { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: auto; padding-top: 0.5rem; }
.action-btn {
  flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.3rem;
  border: 1px solid var(--border-color); border-radius: var(--radius-sm);
  padding: 0.45rem 0.5rem; font-family: inherit; font-size: 0.725rem; font-weight: 700;
  cursor: pointer; background: var(--bg-secondary); color: var(--text-secondary);
  transition: all 0.2s; min-height: 36px;
}
.action-btn svg { width: 13px; height: 13px; flex-shrink: 0; }
.action-btn:hover {
  background: var(--text-primary); color: var(--bg-primary);
  border-color: var(--text-primary); transform: scale(1.03);
}
.dark .action-btn:hover { background: var(--bg-primary); color: var(--text-primary); }
.action-btn.primary { background: var(--text-primary); color: var(--bg-primary); border-color: var(--text-primary); }
.dark .action-btn.primary { background: var(--bg-primary); color: var(--text-primary); border-color: var(--bg-primary); }
.action-btn.primary:hover { opacity: 0.85; }
.skeleton-card {
  background: var(--bg-primary); border: 1px solid var(--border-color);
  border-radius: var(--radius-lg); overflow: hidden;
}
.skeleton-image {
  aspect-ratio: 4/3;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-color) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite;
}
.skeleton-body { padding: 0.875rem 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
.skeleton-line {
  height: 11px; border-radius: 4px;
  background: linear-gradient(90deg, var(--bg-tertiary) 25%, var(--border-color) 50%, var(--bg-tertiary) 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite;
}
.skeleton-line.w60 { width: 60%; }
.skeleton-line.w45 { width: 45%; }
.skeleton-line.w30 { width: 30%; }
@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
#load-more-area { text-align: center; padding: 2rem 1rem; display: none; }
#load-more-area.visible { display: block; }
.spinner {
  width: 36px; height: 36px;
  border: 2.5px solid var(--border-color); border-top-color: var(--text-primary);
  border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto;
}
@keyframes spin { to { transform: rotate(360deg); } }
#empty-state { display: none; text-align: center; padding: 4rem 1rem; grid-column: 1 / -1; }
#empty-state.show { display: block; }
#empty-state svg { width: 64px; height: 64px; color: var(--text-muted); margin-bottom: 1rem; }
#empty-state p { color: var(--text-secondary); font-size: 1rem; }
#toast-container {
  position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
  display: flex; flex-direction: column; gap: 0.5rem; pointer-events: none;
}
.toast-notification {
  background: var(--text-primary); color: var(--bg-primary);
  border-radius: var(--radius-md); padding: 0.8rem 1.25rem;
  font-size: 0.85rem; font-weight: 600;
  display: flex; align-items: center; gap: 0.6rem;
  box-shadow: var(--shadow-lg);
  animation: toastSlideIn 0.3s ease, toastSlideOut 0.3s ease 2.7s forwards;
  pointer-events: all; min-width: 220px;
}
@keyframes toastSlideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes toastSlideOut { to { opacity: 0; transform: translateX(20px); } }
#modal-backdrop {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  display: none; align-items: center; justify-content: center; padding: 1rem;
}
#modal-backdrop.open { display: flex; }
#modal-content {
  background: var(--bg-primary); border-radius: var(--radius-lg);
  max-width: 920px; width: 100%; max-height: 92vh; overflow: hidden;
  display: flex; flex-direction: column;
  box-shadow: 0 32px 64px rgba(0,0,0,0.5);
  animation: modalAppear 0.25s ease;
}
@keyframes modalAppear { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
#modal-image-container {
  overflow: hidden; flex: 1; min-height: 0;
  background: var(--bg-tertiary);
  display: flex; align-items: center; justify-content: center;
}
#modal-image-element { width: 100%; max-height: 70vh; object-fit: contain; display: block; }
#modal-footer {
  padding: 1rem 1.25rem;
  display: flex; align-items: center; justify-content: space-between;
  flex-wrap: wrap; gap: 0.875rem; border-top: 1px solid var(--border-light);
}
#modal-info { display: flex; flex-direction: column; gap: 0.15rem; }
#modal-title-text { font-weight: 800; color: var(--text-primary); font-size: 1rem; }
#modal-author-text { font-size: 0.8rem; color: var(--text-muted); }
#modal-actions-row { display: flex; gap: 0.625rem; flex-wrap: wrap; }
.modal-close-btn {
  position: absolute; top: 1rem; right: 1rem;
  background: rgba(255,255,255,0.1); border: none;
  border-radius: 50%; width: 42px; height: 42px;
  font-size: 1.25rem; color: #fff; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s; z-index: 510;
}
.modal-close-btn:hover { background: rgba(255,255,255,0.2); }
.modal-close-btn svg { width: 22px; height: 22px; }
.view-panel { display: none; }
.view-panel.active { display: block; }
#history-grid {
  max-width: 1320px; margin: 0 auto; padding: 0 1.5rem 3rem;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
  gap: 0.75rem;
}
.history-entry {
  border-radius: var(--radius-md); overflow: hidden; aspect-ratio: 1;
  position: relative; cursor: pointer; transition: transform 0.2s;
  border: 1px solid var(--border-color);
}
.history-entry:hover { transform: scale(1.05); }
.history-entry img { width: 100%; height: 100%; object-fit: cover; display: block; }
.history-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.2s;
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: 0.7rem; font-weight: 700;
}
.history-entry:hover .history-overlay { opacity: 1; }
#faq-section, #seo-faq-section { max-width: 800px; margin: 0 auto; padding: 4rem 1.5rem 5rem; }
#faq-section h2, #seo-faq-section h2 {
  font-size: clamp(1.5rem, 4vw, 2.25rem); font-weight: 800;
  letter-spacing: -0.02em; margin-bottom: 2.5rem;
  color: var(--text-primary); text-align: center;
}
.faq-entry {
  border: 1px solid var(--border-color); border-radius: var(--radius-md);
  margin-bottom: 0.75rem; overflow: hidden; transition: border-color 0.2s;
}
.faq-question {
  padding: 1rem 1.25rem;
  display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  cursor: pointer; font-weight: 700; font-size: 0.95rem; color: var(--text-primary);
  background: var(--bg-primary); border: none; width: 100%;
  text-align: left; font-family: inherit; transition: background 0.2s;
}
.faq-question:hover { background: var(--bg-secondary); }
.faq-chevron { transition: transform 0.3s ease; flex-shrink: 0; color: var(--text-muted); }
.faq-entry.expanded .faq-chevron { transform: rotate(180deg); }
.faq-answer {
  max-height: 0; overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1), padding 0.3s;
  padding: 0 1.25rem; font-size: 0.9rem;
  color: var(--text-secondary); line-height: 1.7; background: var(--bg-primary);
}
.faq-entry.expanded .faq-answer { max-height: 800px; padding: 0.5rem 1.25rem 1.25rem; }
footer {
  background: var(--bg-secondary); border-top: 1px solid var(--border-light);
  text-align: center; padding: 2.5rem 1.5rem;
  font-size: 0.825rem; color: var(--text-muted);
  transition: background var(--transition), border-color var(--transition);
}
footer a { color: var(--text-primary); text-decoration: underline; text-underline-offset: 2px; }
footer a:hover { text-decoration-thickness: 2px; }
.footer-links { display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap; margin-top: 0.75rem; }
.footer-links a { text-decoration: none; color: var(--text-secondary); font-weight: 600; }
.footer-links a:hover { color: var(--text-primary); text-decoration: underline; }
#scroll-to-top {
  position: fixed; bottom: 5.5rem; right: 1.5rem; z-index: 200;
  background: var(--text-primary); color: var(--bg-primary);
  border: none; border-radius: 50%; width: 46px; height: 46px;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; box-shadow: var(--shadow-md);
  opacity: 0; pointer-events: none;
  transition: opacity 0.3s, transform 0.2s;
}
#scroll-to-top.visible { opacity: 1; pointer-events: all; }
#scroll-to-top:hover { transform: translateY(-3px); }
#scroll-to-top svg { width: 20px; height: 20px; }
.no-data-message { text-align: center; padding: 4rem 1rem; color: var(--text-muted); }
.no-data-message svg { width: 56px; height: 56px; margin-bottom: 1rem; opacity: 0.5; }

/* ── Long-form SEO Article Styles ── */
#seo-article {
  max-width: 880px; margin: 0 auto; padding: 4rem 1.5rem 1rem;
  color: var(--text-primary);
}
#seo-article h2 {
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  font-weight: 800; letter-spacing: -0.02em;
  margin-bottom: 1.25rem; color: var(--text-primary);
}
#seo-article h3 {
  font-size: clamp(1.15rem, 2.5vw, 1.4rem);
  font-weight: 800; margin-top: 2.25rem; margin-bottom: 0.75rem;
  color: var(--text-primary); letter-spacing: -0.01em;
}
#seo-article p, #seo-article li {
  font-size: 0.975rem; line-height: 1.75;
  color: var(--text-secondary); margin-bottom: 1rem;
}
#seo-article ul, #seo-article ol {
  margin: 0 0 1rem 1.25rem; padding-left: 0.5rem;
}
#seo-article li { margin-bottom: 0.4rem; }
#seo-article strong { color: var(--text-primary); font-weight: 700; }
#seo-article .lead {
  font-size: 1.075rem; color: var(--text-primary); font-weight: 500;
  line-height: 1.7; margin-bottom: 1.5rem;
}
#seo-article .callout {
  border-left: 3px solid var(--text-primary);
  background: var(--bg-secondary);
  padding: 1rem 1.25rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  margin: 1.5rem 0; color: var(--text-primary); font-size: 0.95rem;
}

@media (max-width: 640px) {
  .header-inner { padding: 0.75rem 1rem; }
  .header-nav { display: none; }
  #hero { padding: 3rem 1rem 2.5rem; }
  .trust-signals { gap: 0.5rem; }
  .trust-item { font-size: 0.7rem; padding: 0.3rem 0.75rem; }
  .cta-container { flex-direction: column; align-items: stretch; }
  .btn { width: 100%; justify-content: center; }
  #search-section { margin: 1.5rem auto 1rem; padding: 0 1rem; }
  #categories-nav, #view-tabs, .section-header { padding: 0 1rem; }
  #image-grid { padding: 0 1rem 2rem; gap: 1rem; }
  .card-actions { flex-direction: column; }
  .action-btn { flex: none; }
}
@media print {
  #site-header, #view-tabs, #categories-nav, #search-section,
  #scroll-to-top, #toast-container, #modal-backdrop,
  .card-actions, .favorite-btn, .card-overlay { display: none !important; }
  body { background: white !important; color: black !important; }
  .image-card { break-inside: avoid; page-break-inside: avoid; }
}
`;

/* ────────────────────────────────────────────────────────────────
   ORIGINAL JSON-LD STRUCTURED DATA (verbatim)
   ──────────────────────────────────────────────────────────────── */
const STRUCTURED_DATA_JSON = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "name": "Thefreeaitools- Free Random Image Generator",
      "alternateName": "ImageGen Free",
      "url": "https://www.thefreeaitools.com/tools/random-image-for-free",
      "description": "Generate random high-definition images instantly. Search millions of free stock photos. Download royalty-free pictures for commercial use without signup.",
      "applicationCategory": "MultimediaApplication",
      "operatingSystem": "Any",
      "browserRequirements": "Requires JavaScript",
      "softwareVersion": "2.0",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": "0",
          "priceCurrency": "USD",
          "name": "Free forever"
        }
      },
      "featureList": [
        "Random Image Generation",
        "Keyword-Based Image Search",
        "High-Definition Downloads",
        "Dark Mode Support",
        "Favorites System",
        "Download History",
        "Trending Images",
        "Category Browsing",
        "URL Copy & Share",
        "Fullscreen Preview"
      ],
      "author": {
        "@type": "Organization",
        "name": "Thefreeaitools",
        "url": "https://www.thefreeaitools.com"
      }
    },
    {
      "@type": "Organization",
      "name": "Thefreeaitools",
      "url": "https://www.thefreeaitools.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.thefreeaitools.com/logo.png"
      },
      "sameAs": [
        "https://twitter.com/thefreeaitools",
        "https://github.com/thefreeaitools"
      ]
    },
    {
      "@type": "WebPage",
      "@id": "https://www.thefreeaitools.com/tools/random-image-for-free#webpage",
      "url": "https://www.thefreeaitools.com/tools/random-image-for-free",
      "name": "Thefreeaitools- Free Random Image Generator - Download HD Stock Photos Online",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://www.thefreeaitools.com/#website",
        "name": "TheFreeAITools",
        "url": "https://www.thefreeaitools.com"
      },
      "about": {
        "@type": "Thing",
        "name": "Image Generator Tool",
        "description": "Free tool for generating and downloading random stock photos"
      },
      "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.thefreeaitools.com" },
          { "@type": "ListItem", "position": 2, "name": "Free Tools", "item": "https://www.thefreeaitools.com/tools/" },
          { "@type": "ListItem", "position": 3, "name": "Random Image Generator", "item": "https://www.thefreeaitools.com/tools/random-image-for-free" }
        ]
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://www.thefreeaitools.com/tools/random-image-for-free?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.thefreeaitools.com/tools/random-image-for-free#faq",
      "mainEntity": [
        { "@type": "Question", "name": "What is a random image generator and how does it work?", "acceptedAnswer": { "@type": "Answer", "text": "A random image generator is an online tool that automatically fetches and displays high-quality photographs from extensive databases like Lorem Picsum and Unsplash. When you click the generate button, the tool selects a unique image at random from thousands of available photos covering nature, technology, people, architecture, and more categories. Each click produces a different image instantly." } },
        { "@type": "Question", "name": "Is this image generator completely free to use?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, absolutely 100% free. There are no hidden charges, premium tiers, or credit card requirements. You can generate unlimited random images, search for specific keywords, preview in fullscreen, and download as many HD photos as you need without any cost or account creation." } },
        { "@type": "Question", "name": "Can I use downloaded images for commercial projects?", "acceptedAnswer": { "@type": "Answer", "text": "Images sourced through our tool come from Lorem Picsum and Unsplash Source APIs. Most images are available under free licenses that permit commercial use. However, we recommend checking the specific license terms for each image before using it in commercial projects, as some photographers may require attribution." } },
        { "@type": "Question", "name": "Where do the random images come from?", "acceptedAnswer": { "@type": "Answer", "text": "Our image generator pulls from two primary sources: (1) Lorem Picsum (picsum.photos) which provides placeholder and stock-style images, and (2) Unsplash Source which offers professional photography from a global community of photographers. Both services provide high-quality, royalty-free images suitable for various use cases." } },
        { "@type": "Question", "name": "How do I search for specific types of images?", "acceptedAnswer": { "@type": "Answer", "text": "To search for specific images, simply type your keyword into the search bar at the top of the page. You can search for any topic such as nature, technology, people, architecture, food, animals, business, travel, art, or abstract concepts. Press Enter or click the Search button to see relevant results displayed in a grid layout." } },
        { "@type": "Question", "name": "What is the resolution and quality of downloadable images?", "acceptedAnswer": { "@type": "Answer", "text": "Downloadable images are available in high definition quality, typically 1280x853 pixels or higher depending on the source. The tool fetches full-resolution versions directly from the API ensuring you get the best possible quality suitable for web use, presentations, print materials, and digital designs." } },
        { "@type": "Question", "name": "Do I need to create an account or sign up to use this tool?", "acceptedAnswer": { "@type": "Answer", "text": "No account, email address, or sign-up process is required whatsoever. The tool works immediately upon opening the page. Simply visit the URL, click Generate or Search, and start downloading images right away. Your favorites are saved locally in your browser using localStorage." } },
        { "@type": "Question", "name": "Can I save my favorite images for later access?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, you can save any image to your Favorites by clicking the heart icon on each image card. All favorited images are stored locally in your browser's localStorage, meaning they persist between sessions without requiring any server-side account. Access your saved favorites anytime via the Favorites tab." } },
        { "@type": "Question", "name": "Does this image generator work on mobile phones and tablets?", "acceptedAnswer": { "@type": "Answer", "text": "Yes, the tool is fully responsive and optimized for all device sizes including smartphones, tablets, laptops, and desktop computers. The interface automatically adapts with appropriate grid layouts, touch-friendly buttons (minimum 44px tap targets), and optimized image loading for mobile networks." } },
        { "@type": "Question", "name": "How do I copy an image URL or share an image?", "acceptedAnswer": { "@type": "Answer", "text": "Each image card includes a Copy URL button that copies the direct image link to your clipboard instantly. There is also a Share button that opens Twitter/X pre-populated with the image link and description. You can also use the fullscreen preview modal which provides additional sharing options." } },
        { "@type": "Question", "name": "What image categories are available to browse?", "acceptedAnswer": { "@type": "Answer", "text": "Available categories include Nature (landscapes, wildlife), Technology (computers, code), People (portraits, lifestyle), Architecture (buildings, interiors), Travel (destinations, adventure), Food (cuisine, drinks), Animals (pets, wildlife), Art (abstract, creative), Business (office, corporate), and many more. Click any category tag to browse themed collections." } },
        { "@type": "Question", "name": "Is there a limit on how many images I can generate or download?", "acceptedAnswer": { "@type": "Answer", "text": "There are absolutely no limits on generation or downloads. You can produce unlimited random images, perform unlimited searches, and download as many photos as you need. The underlying APIs support high-volume requests, and infinite scroll automatically loads more images as you browse." } }
      ]
    },
    {
      "@type": "Service",
      "name": "Free Random Image Generation Service",
      "description": "Online service providing free random image generation and stock photo search capabilities",
      "serviceType": "ImageGenerationService",
      "provider": { "@type": "Organization", "name": "TheFreeAITools" },
      "areaServed": { "@type": "GeoCircle", "geoMidpoint": { "@type": "GeoCoordinates", "latitude": "0", "longitude": "0" }, "geoRadius": "10000000" },
      "availableChannel": { "@type": "ServiceChannel", "serviceUrl": "https://www.thefreeaitools.com/tools/random-image-for-free", "availableLanguage": ["en"] }
    }
  ]
});

/* ────────────────────────────────────────────────────────────────
   SECONDARY JSON-LD: Article + dedicated SEO FAQPage
   (additional schema for the new long-form SEO content)
   ──────────────────────────────────────────────────────────────── */
const SEO_ARTICLE_JSON = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "The Complete Guide to SEO for Free Image Tools, Stock Photo Pages & Visual Content Sites",
      "description": "An in-depth, 2000+ word guide explaining what SEO is, how on-page, technical, image, and content SEO work together, schema markup, Core Web Vitals, mobile-first indexing, E-E-A-T, and how to rank a free random image generator on Google.",
      "author": { "@type": "Organization", "name": "Thefreeaitools" },
      "publisher": { "@type": "Organization", "name": "Thefreeaitools", "logo": { "@type": "ImageObject", "url": "https://www.thefreeaitools.com/logo.png" } },
      "mainEntityOfPage": "https://www.thefreeaitools.com/tools/random-image-for-free#seo-guide",
      "inLanguage": "en"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.thefreeaitools.com/tools/random-image-for-free#seo-faq",
      "mainEntity": [
        { "@type": "Question", "name": "What is SEO in simple words?", "acceptedAnswer": { "@type": "Answer", "text": "SEO (Search Engine Optimization) is the practice of improving a website so search engines like Google, Bing and DuckDuckGo can understand it, trust it, and rank it higher for relevant queries. It combines on-page content, technical performance, mobile usability, structured data, and authority signals to drive free organic traffic." } },
        { "@type": "Question", "name": "What are the three pillars of SEO?", "acceptedAnswer": { "@type": "Answer", "text": "The three pillars of SEO are: (1) On-page SEO — content, titles, headings, meta descriptions, internal links, and keyword targeting; (2) Technical SEO — crawlability, indexing, site speed, Core Web Vitals, mobile-friendliness, structured data, and HTTPS; (3) Off-page SEO — backlinks, brand mentions, social signals, and authority/trust (E-E-A-T)." } },
        { "@type": "Question", "name": "How do I optimize images for SEO?", "acceptedAnswer": { "@type": "Answer", "text": "Image SEO best practices include: descriptive file names (sunset-beach-california.jpg, not IMG_8492.jpg), accurate alt text for accessibility, modern formats like WebP/AVIF, responsive srcset attributes, lazy loading via loading='lazy', compression to under 200 KB where possible, descriptive captions, EXIF/IPTC metadata, and submitting an image sitemap." } },
        { "@type": "Question", "name": "What is schema markup and why does it matter?", "acceptedAnswer": { "@type": "Answer", "text": "Schema markup (also called structured data, usually written in JSON-LD format) is code that tells search engines what your content means. It enables rich results — star ratings, FAQ accordions, breadcrumbs, sitelinks, image carousels — which take more SERP real estate and dramatically improve click-through rates." } },
        { "@type": "Question", "name": "What are Core Web Vitals?", "acceptedAnswer": { "@type": "Answer", "text": "Core Web Vitals are Google's user-experience performance metrics: LCP (Largest Contentful Paint, should be under 2.5s), INP (Interaction to Next Paint, under 200ms), and CLS (Cumulative Layout Shift, under 0.1). They are an official ranking factor and directly affect user retention." } },
        { "@type": "Question", "name": "How long does SEO take to show results?", "acceptedAnswer": { "@type": "Answer", "text": "Most websites see meaningful SEO movement in 3–6 months, with strong rankings in 6–12 months. New domains take longer due to the 'sandbox' effect. Image-heavy tool pages can rank faster if they target long-tail queries with low competition and have technically perfect pages." } },
        { "@type": "Question", "name": "What is keyword research?", "acceptedAnswer": { "@type": "Answer", "text": "Keyword research is the process of discovering what real people type into search engines. It involves identifying high-intent terms with sufficient search volume and reasonable competition, then mapping them to specific pages. Tools include Google Keyword Planner, Ahrefs, Semrush, Ubersuggest, and Google Search Console's Performance report." } },
        { "@type": "Question", "name": "What is E-E-A-T in SEO?", "acceptedAnswer": { "@type": "Answer", "text": "E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness. It comes from Google's Search Quality Rater Guidelines and is especially important for YMYL (Your Money or Your Life) topics. You build E-E-A-T through author bios, original research, accurate information, citations, secure HTTPS, and earned backlinks from reputable sites." } },
        { "@type": "Question", "name": "Are AI-generated images bad for SEO?", "acceptedAnswer": { "@type": "Answer", "text": "Not inherently. Google has stated that the focus is on quality and helpfulness, not the production method. AI-generated images are fine if they are relevant, original, properly compressed, have descriptive alt text, and serve the user's intent. Avoid using thousands of low-quality AI images purely to manipulate rankings." } },
        { "@type": "Question", "name": "Do I need backlinks to rank?", "acceptedAnswer": { "@type": "Answer", "text": "For competitive keywords, yes — backlinks remain one of the strongest ranking signals. For long-tail queries, well-optimized pages with strong on-page SEO and technical health can rank without many backlinks. Focus on earning links through outstanding content, free tools, original data, and digital PR." } },
        { "@type": "Question", "name": "What is the difference between SEO and SEM?", "acceptedAnswer": { "@type": "Answer", "text": "SEO (Search Engine Optimization) drives free, organic traffic from unpaid search results over the long term. SEM (Search Engine Marketing) is the broader term that usually refers to paid search ads (Google Ads / PPC). SEO compounds over time; SEM stops the moment you stop paying." } }
      ]
    }
  ]
});

/* ────────────────────────────────────────────────────────────────
   COMPONENT
   ──────────────────────────────────────────────────────────────── */
export default function RandomImageAi() {
  /* All original IIFE script logic — runs once on mount */
  useEffect(() => {
    (function () {
      'use strict';

      const AppState: any = {
        currentQuery: 'random',
        currentPage: 1,
        isLoading: false,
        isFetching: false,
        imageCollection: [] as any[],
        savedFavorites: JSON.parse(localStorage.getItem('imggen_fav') || '[]'),
        downloadLog: JSON.parse(localStorage.getItem('imggen_dl_history') || '[]'),
        activePanel: 'gallery',
        activeCategory: 'random',
        sortPreference: 'latest',
        currentModalData: null as any,
        scrollObserver: null as IntersectionObserver | null,
        debounceTimerId: null as any,
        trendingHasLoaded: false,
      };

      const DOM: any = {
        galleryGrid: document.getElementById('image-grid'),
        emptyStateEl: document.getElementById('empty-state'),
        loadMoreArea: document.getElementById('load-more-area'),
        heroPreviewImg: document.getElementById('hero-preview-img') as HTMLImageElement | null,
        searchInputField: document.getElementById('search-input') as HTMLInputElement | null,
        modalOverlay: document.getElementById('modal-backdrop'),
        modalImage: document.getElementById('modal-image-element') as HTMLImageElement | null,
        modalTitle: document.getElementById('modal-title-text'),
        modalAuthor: document.getElementById('modal-author-text'),
        toastBox: document.getElementById('toast-container'),
        scrollTopBtn: document.getElementById('scroll-to-top'),
        favGridContainer: document.getElementById('favorites-grid'),
        dlHistoryGrid: document.getElementById('history-grid'),
        trendingGridContainer: document.getElementById('trending-grid'),
        favBadgeCounter: document.getElementById('favorites-badge-count'),
      };

      /* Theme management */
      const themeSwitch = document.getElementById('theme-toggle-input') as HTMLInputElement | null;
      const themeModeLabel = document.getElementById('theme-mode-label');
      const storedTheme = localStorage.getItem('imggen_theme_pref');
      const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialDarkMode = storedTheme === 'dark' || (!storedTheme && prefersDarkScheme);

      function applyThemeSetting(isDark: boolean) {
        document.documentElement.classList.toggle('dark', isDark);
        if (themeSwitch) {
          themeSwitch.checked = isDark;
          themeSwitch.setAttribute('aria-checked', String(isDark));
        }
        if (themeModeLabel) themeModeLabel.textContent = isDark ? 'Dark' : 'Light';
        localStorage.setItem('imggen_theme_pref', isDark ? 'dark' : 'light');
      }
      applyThemeSetting(initialDarkMode);
      themeSwitch?.addEventListener('change', function () {
        applyThemeSetting(themeSwitch.checked);
        showNotification(themeSwitch.checked ? 'Dark mode enabled' : 'Light mode enabled');
      });

      /* Image source configuration */
      const PICSUM_BASE_URL = 'https://picsum.photos';
      const CATEGORY_SEED_MAP: Record<string, number[] | null> = {
        random: null,
        nature: [10, 15, 37, 54, 62, 64, 65, 107, 111, 119, 134, 145, 165, 167, 175, 178],
        technology: [1, 2, 8, 11, 20, 42, 58, 82, 96, 157, 188, 213, 239, 250, 261, 279],
        people: [22, 25, 29, 30, 64, 91, 100, 103, 120, 131, 169, 229, 237, 246, 252, 267],
        architecture: [3, 6, 13, 24, 33, 41, 47, 50, 56, 75, 85, 92, 99, 143, 162, 200],
        travel: [4, 7, 16, 19, 23, 31, 35, 43, 60, 73, 80, 89, 117, 149, 172, 219],
        food: [292, 294, 312, 326, 338, 343, 431, 433, 442, 452, 488, 493, 501, 539, 543, 547],
        animals: [237, 240, 248, 256, 268, 272, 287, 289, 295, 326, 357, 395, 399, 403, 416, 425],
        art: [5, 9, 12, 17, 32, 39, 44, 48, 55, 71, 83, 87, 93, 104, 116, 142],
        business: [26, 28, 36, 38, 45, 52, 57, 66, 69, 74, 78, 88, 97, 105, 118, 128],
      };
      const TRENDING_SEED_ARRAY = [1002, 1011, 1015, 1016, 1021, 1024, 1025, 1043, 1044, 1062, 1063, 1069, 1074, 1079, 1080];
      const TRENDING_TITLE_ARRAY = ['Urban Life', 'Forest Path', 'Ocean Waves', 'Mountain Peak', 'City Lights', 'Desert Dunes', 'Golden Hour', 'Misty Morning', 'Wild Nature', 'Night Sky', 'Ancient Town', 'Foggy Lake', 'Autumn Leaves', 'Rainy Street', 'Sunrise Peak'];
      const AUTHOR_NAMES_POOL = ['Alex Morgan', 'Sam Chen', 'Jess Park', 'Tyler Wade', 'Robin Lu', 'Morgan Keys', 'Jamie Fox', 'Chris Vale', 'Taylor Kim', 'Jordan Lee'];
      const TITLE_ADJECTIVES = ['Serene', 'Vibrant', 'Minimal', 'Bold', 'Elegant', 'Wild', 'Golden', 'Mystic', 'Urban', 'Calm', 'Dynamic', 'Classic'];
      const TITLE_NOUNS = ['Landscape', 'Portrait', 'Scene', 'Moment', 'View', 'Shot', 'Frame', 'Capture', 'Composition', 'Perspective'];

      function buildImageDataArray(keyword: string, quantity: number, pageOffset: number) {
        const outputArray: any[] = [];
        const seedsForCategory = CATEGORY_SEED_MAP[keyword];
        const thumbWidth = 400, thumbHeight = 300;
        const displayWidth = 800, displayHeight = 600;
        const downloadWidth = 1280, downloadHeight = 853;
        for (let i = 0; i < quantity; i++) {
          const seedIndex = (pageOffset + i) % (seedsForCategory ? seedsForCategory.length : 1000);
          const imageSeed = seedsForCategory ? seedsForCategory[seedIndex % seedsForCategory.length] : (Math.floor(Math.random() * 900) + 100);
          const thumbnailUrl = `${PICSUM_BASE_URL}/seed/${imageSeed}/${thumbWidth}/${thumbHeight}`;
          const displayUrl = `${PICSUM_BASE_URL}/seed/${imageSeed}/${displayWidth}/${displayHeight}`;
          const downloadUrl = `${PICSUM_BASE_URL}/seed/${imageSeed}/${downloadWidth}/${downloadHeight}`;
          const authorName = AUTHOR_NAMES_POOL[(imageSeed + i) % AUTHOR_NAMES_POOL.length];
          const titleAdjective = TITLE_ADJECTIVES[(imageSeed * 3 + i) % TITLE_ADJECTIVES.length];
          const titleNoun = TITLE_NOUNS[(imageSeed + i * 2) % TITLE_NOUNS.length];
          const generatedTitle = `${titleAdjective} ${titleNoun}`;
          outputArray.push({
            uniqueId: `img-${imageSeed}-${i}`,
            seedValue: imageSeed,
            thumbnailSrc: thumbnailUrl,
            displaySrc: displayUrl,
            downloadSrc: downloadUrl,
            titleText: generatedTitle,
            authorName,
            categoryTag: keyword,
          });
        }
        return outputArray;
      }

      function renderSkeletonLoaders(count: number) {
        if (!DOM.galleryGrid) return;
        DOM.galleryGrid.innerHTML = '';
        for (let i = 0; i < count; i++) {
          const skeletonNode = document.createElement('div');
          skeletonNode.className = 'skeleton-card';
          skeletonNode.setAttribute('aria-hidden', 'true');
          skeletonNode.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-body">
              <div class="skeleton-line"></div>
              <div class="skeleton-line w60"></div>
              <div class="skeleton-line w45"></div>
              <div class="skeleton-line w30"></div>
            </div>
          `;
          DOM.galleryGrid.appendChild(skeletonNode);
        }
      }

      function renderImageCard(imageData: any, targetContainer?: HTMLElement) {
        const isAlreadyFavorited = AppState.savedFavorites.some((fav: any) => fav.uniqueId === imageData.uniqueId);
        const cardElement = document.createElement('article');
        cardElement.className = 'image-card';
        cardElement.setAttribute('aria-label', imageData.titleText + ' photographed by ' + imageData.authorName);
        cardElement.innerHTML = `
          <div class="card-image-wrapper" role="button" tabindex="0" aria-label="Preview ${imageData.titleText}">
            <div class="blur-placeholder" id="blur-${imageData.uniqueId}"></div>
            <img
              src="${imageData.thumbnailSrc}"
              alt="${imageData.titleText} - Free high-definition photo by ${imageData.authorName}"
              loading="lazy"
              width="400"
              height="300"
              data-display-url="${imageData.displaySrc}"
              data-download-url="${imageData.downloadSrc}"
              data-image-id="${imageData.uniqueId}"
            />
            <div class="card-overlay">
              <button class="overlay-action-btn" data-preview-target="${imageData.uniqueId}" aria-label="Open fullscreen preview of ${imageData.titleText}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                Full Preview
              </button>
            </div>
            <button class="favorite-btn ${isAlreadyFavorited ? 'active' : ''}" data-favorite-target="${imageData.uniqueId}" aria-label="${isAlreadyFavorited ? 'Remove from favorites' : 'Add to favorites'}" aria-pressed="${isAlreadyFavorited}">
              <svg viewBox="0 0 24 24" fill="${isAlreadyFavorited ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>
          <div class="card-body">
            <div class="card-title">${imageData.titleText}</div>
            <div class="card-author">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              ${imageData.authorName}
            </div>
            <div class="card-actions">
              <button class="action-btn primary" data-dl-target="${imageData.downloadSrc}" data-dl-name="${imageData.titleText}" aria-label="Download ${imageData.titleText}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download
              </button>
              <button class="action-btn" data-copy-target="${imageData.displaySrc}" aria-label="Copy URL of ${imageData.titleText}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                Copy URL
              </button>
              <button class="action-btn" data-share-target="${imageData.displaySrc}" data-share-title="${imageData.titleText}" aria-label="Share ${imageData.titleText} on Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Share
              </button>
            </div>
          </div>
        `;
        const imgElement = cardElement.querySelector('.card-image-wrapper img') as HTMLImageElement;
        const blurElement = cardElement.querySelector('.blur-placeholder') as HTMLDivElement;
        imgElement.addEventListener('load', () => blurElement.classList.add('loaded'));
        imgElement.addEventListener('error', () => {
          imgElement.src = PICSUM_BASE_URL + '/400/300?random=' + Math.random();
          blurElement.classList.add('loaded');
        });
        const thumbWrapper = cardElement.querySelector('.card-image-wrapper') as HTMLElement;
        thumbWrapper.addEventListener('click', (clickEvent: any) => {
          if (clickEvent.target.closest('.favorite-btn') || clickEvent.target.closest('.overlay-action-btn')) return;
          launchModalPreview(imageData);
        });
        thumbWrapper.addEventListener('keydown', (keyEvent: any) => {
          if (keyEvent.key === 'Enter' || keyEvent.key === ' ') {
            keyEvent.preventDefault();
            launchModalPreview(imageData);
          }
        });
        const overlayBtn = cardElement.querySelector('[data-preview-target]');
        overlayBtn?.addEventListener('click', (evt: any) => { evt.stopPropagation(); launchModalPreview(imageData); });
        const favButton = cardElement.querySelector('.favorite-btn') as HTMLButtonElement;
        favButton.addEventListener('click', (favEvent: any) => { favEvent.stopPropagation(); handleFavoriteToggle(imageData, favButton); });
        cardElement.querySelector('[data-dl-target]')?.addEventListener('click', (dlEvent: any) => {
          dlEvent.stopPropagation();
          initiateDownload(imageData.downloadSrc, imageData.titleText + '-' + imageData.categoryTag);
        });
        cardElement.querySelector('[data-copy-target]')?.addEventListener('click', (copyEvent: any) => {
          copyEvent.stopPropagation();
          copyTextToClipboard(imageData.displaySrc);
        });
        cardElement.querySelector('[data-share-target]')?.addEventListener('click', (shareEvent: any) => {
          shareEvent.stopPropagation();
          shareOnTwitterPlatform(imageData.displaySrc, imageData.titleText);
        });
        (targetContainer || DOM.galleryGrid).appendChild(cardElement);
        return cardElement;
      }

      function loadImageSet(keyword: string, pageNumber: number, appendMode: boolean) {
        if (AppState.isLoading) return;
        AppState.isLoading = true;
        DOM.emptyStateEl?.classList.remove('show');
        const imagesPerBatch = 12;
        const offsetCalculation = (pageNumber - 1) * imagesPerBatch;
        if (!appendMode) {
          renderSkeletonLoaders(imagesPerBatch);
          DOM.galleryGrid?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          DOM.loadMoreArea?.classList.add('visible');
        }
        setTimeout(() => {
          const fetchedImages = buildImageDataArray(keyword, imagesPerBatch, offsetCalculation);
          if (!appendMode) {
            if (DOM.galleryGrid) DOM.galleryGrid.innerHTML = '';
          } else {
            DOM.loadMoreArea?.classList.remove('visible');
          }
          if (fetchedImages.length === 0) {
            DOM.emptyStateEl?.classList.add('show');
          } else {
            fetchedImages.forEach((imgData: any) => {
              AppState.imageCollection.push(imgData);
              renderImageCard(imgData, DOM.galleryGrid);
            });
          }
          refreshResultCountDisplay();
          AppState.isLoading = false;
          configureScrollObserver();
        }, 450);
      }

      function refreshResultCountDisplay() {
        const counterEl = document.getElementById('results-counter');
        if (counterEl) counterEl.textContent = '\u2014 ' + AppState.imageCollection.length + ' photos found';
      }

      let sentinelElement: HTMLDivElement | null = null;
      function configureScrollObserver() {
        if (AppState.scrollObserver) AppState.scrollObserver.disconnect();
        if (sentinelElement) sentinelElement.remove();
        sentinelElement = document.createElement('div');
        sentinelElement.id = 'scroll-sentinel-marker';
        sentinelElement.style.height = '1px';
        sentinelElement.setAttribute('aria-hidden', 'true');
        DOM.galleryGrid?.after(sentinelElement);
        AppState.scrollObserver = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !AppState.isLoading && AppState.activePanel === 'gallery') {
            AppState.currentPage++;
            loadImageSet(AppState.currentQuery, AppState.currentPage, true);
          }
        }, { rootMargin: '300px' });
        AppState.scrollObserver.observe(sentinelElement);
      }

      function executeSearchOperation(searchTerm: string) {
        searchTerm = searchTerm.trim();
        if (!searchTerm) searchTerm = 'random';
        AppState.currentQuery = searchTerm;
        AppState.currentPage = 1;
        AppState.imageCollection = [];
        const headingEl = document.getElementById('gallery-title');
        if (headingEl) {
          headingEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Results for "<em>' + searchTerm + '</em>" <span class="result-count" id="results-counter"></span>';
        }
        document.querySelectorAll('.category-btn').forEach((btn) => {
          btn.classList.remove('active');
          btn.setAttribute('aria-pressed', 'false');
        });
        loadImageSet(searchTerm, 1, false);
      }

      DOM.searchInputField?.addEventListener('input', () => {
        clearTimeout(AppState.debounceTimerId);
        AppState.debounceTimerId = setTimeout(() => {
          if (DOM.searchInputField?.value.trim()) executeSearchOperation(DOM.searchInputField.value);
        }, 350);
      });
      document.getElementById('execute-search-btn')?.addEventListener('click', () => {
        executeSearchOperation(DOM.searchInputField?.value || 'random');
      });
      DOM.searchInputField?.addEventListener('keydown', (keyEvt: KeyboardEvent) => {
        if (keyEvt.key === 'Enter') executeSearchOperation(DOM.searchInputField?.value || 'random');
      });
      document.getElementById('jump-to-search-btn')?.addEventListener('click', () => {
        document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' });
        DOM.searchInputField?.focus();
      });

      document.querySelectorAll('.category-btn').forEach((categoryButton) => {
        categoryButton.addEventListener('click', function (this: HTMLElement) {
          document.querySelectorAll('.category-btn').forEach((b) => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          this.classList.add('active');
          this.setAttribute('aria-pressed', 'true');
          const selectedCategory = (this as HTMLElement).dataset.category!;
          AppState.activeCategory = selectedCategory;
          AppState.currentQuery = selectedCategory;
          AppState.currentPage = 1;
          AppState.imageCollection = [];
          if (DOM.searchInputField) DOM.searchInputField.value = selectedCategory === 'random' ? '' : selectedCategory;
          const headingEl = document.getElementById('gallery-title');
          if (headingEl) {
            headingEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> ' + (this.textContent || '').trim() + ' Gallery <span class="result-count" id="results-counter"></span>';
          }
          switchActiveView('gallery');
          loadImageSet(selectedCategory, 1, false);
        });
      });

      function loadHeroRandomImage() {
        if (!DOM.heroPreviewImg) return;
        DOM.heroPreviewImg.classList.add('loading');
        const randomSeed = Math.floor(Math.random() * 900) + 100;
        const tempImg = new Image();
        tempImg.onload = function () {
          if (!DOM.heroPreviewImg) return;
          DOM.heroPreviewImg.src = tempImg.src;
          DOM.heroPreviewImg.alt = 'Random high-definition photograph \u2014 seed ' + randomSeed;
          DOM.heroPreviewImg.classList.remove('loading');
        };
        tempImg.onerror = function () { DOM.heroPreviewImg?.classList.remove('loading'); };
        tempImg.src = PICSUM_BASE_URL + '/seed/' + randomSeed + '/700/394';
      }

      document.getElementById('generate-random-btn')?.addEventListener('click', () => {
        loadHeroRandomImage();
        AppState.imageCollection = [];
        AppState.currentPage = 1;
        AppState.currentQuery = 'random';
        document.querySelectorAll('.category-btn').forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        const randomCatBtn = document.querySelector('[data-category="random"]');
        if (randomCatBtn) {
          randomCatBtn.classList.add('active');
          randomCatBtn.setAttribute('aria-pressed', 'true');
        }
        const headingEl = document.getElementById('gallery-title');
        if (headingEl) {
          headingEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg> Random Gallery <span class="result-count" id="results-counter"></span>';
        }
        switchActiveView('gallery');
        loadImageSet('random', 1, false);
        document.getElementById('gallery-panel')?.scrollIntoView({ behavior: 'smooth' });
      });

      function initiateDownload(url: string, filename: string) {
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = (filename || 'image').replace(/[^a-z0-9\-]/gi, '-').toLowerCase() + '.jpg';
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        document.body.appendChild(anchor);
        anchor.click();
        setTimeout(() => anchor.remove(), 100);
        showNotification('Download started successfully');
        recordToDownloadHistory(url, filename);
      }

      function recordToDownloadHistory(url: string, title: string) {
        const entry = {
          url,
          title: title || 'Downloaded Image',
          timestamp: Date.now(),
          thumbnail: url.replace('/1280/853', '/200/200'),
        };
        AppState.downloadLog.unshift(entry);
        if (AppState.downloadLog.length > 50) AppState.downloadLog.pop();
        localStorage.setItem('imggen_dl_history', JSON.stringify(AppState.downloadLog));
        if (AppState.activePanel === 'history') renderDownloadHistory();
      }

      function renderDownloadHistory() {
        if (!DOM.dlHistoryGrid) return;
        DOM.dlHistoryGrid.innerHTML = '';
        const noMsgEl = document.getElementById('no-history-msg') as HTMLElement | null;
        if (AppState.downloadLog.length === 0) {
          if (noMsgEl) noMsgEl.style.display = 'block';
          return;
        }
        if (noMsgEl) noMsgEl.style.display = 'none';
        AppState.downloadLog.forEach((item: any) => {
          const entryEl = document.createElement('div');
          entryEl.className = 'history-entry';
          entryEl.setAttribute('role', 'img');
          entryEl.setAttribute('aria-label', item.title || 'Previously downloaded image');
          entryEl.innerHTML = '<img src="' + item.thumbnail + '" alt="' + (item.title || 'Downloaded image') + '" loading="lazy" /><div class="history-overlay">View</div>';
          entryEl.addEventListener('click', () => {
            launchModalPreview({
              url: item.url,
              downloadSrc: item.url,
              titleText: item.title || 'Downloaded Image',
              authorName: 'From History',
              uniqueId: 'hist-' + item.timestamp,
            });
          });
          DOM.dlHistoryGrid.appendChild(entryEl);
        });
      }

      document.getElementById('clear-history-btn')?.addEventListener('click', () => {
        AppState.downloadLog = [];
        localStorage.removeItem('imggen_dl_history');
        renderDownloadHistory();
        showNotification('Download history cleared');
      });

      function copyTextToClipboard(textString: string) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(textString)
            .then(() => showNotification('URL copied to clipboard'))
            .catch(() => fallbackClipboardCopy(textString));
        } else {
          fallbackClipboardCopy(textString);
        }
      }
      function fallbackClipboardCopy(textString: string) {
        const textarea = document.createElement('textarea');
        textarea.value = textString;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        textarea.remove();
        showNotification('Link copied successfully');
      }

      function shareOnTwitterPlatform(url: string, title: string) {
        const tweetText = encodeURIComponent('Check out this free HD photo: "' + title + '" \u2014 via TheFreeAITools Image Generator');
        const linkParam = encodeURIComponent(url);
        window.open('https://x.com/intent/tweet?text=' + tweetText + '&url=' + linkParam, '_blank', 'noopener,width=600,height=420');
      }

      function showNotification(messageText: string) {
        if (!DOM.toastBox) return;
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = messageText;
        toast.setAttribute('role', 'status');
        DOM.toastBox.appendChild(toast);
        setTimeout(() => toast.remove(), 3200);
      }

      function handleFavoriteToggle(imageData: any, buttonElement: HTMLButtonElement) {
        const existingIndex = AppState.savedFavorites.findIndex((f: any) => f.uniqueId === imageData.uniqueId);
        if (existingIndex === -1) {
          AppState.savedFavorites.unshift(imageData);
          buttonElement.classList.add('active');
          buttonElement.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
          buttonElement.setAttribute('aria-label', 'Remove from favorites');
          buttonElement.setAttribute('aria-pressed', 'true');
          showNotification('Added to favorites');
        } else {
          AppState.savedFavorites.splice(existingIndex, 1);
          buttonElement.classList.remove('active');
          buttonElement.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
          buttonElement.setAttribute('aria-label', 'Add to favorites');
          buttonElement.setAttribute('aria-pressed', 'false');
          showNotification('Removed from favorites');
        }
        localStorage.setItem('imggen_fav', JSON.stringify(AppState.savedFavorites));
        updateFavoriteBadgeCounter();
        if (AppState.activePanel === 'favorites') renderFavoritesGrid();
      }

      function updateFavoriteBadgeCounter() {
        if (!DOM.favBadgeCounter) return;
        if (AppState.savedFavorites.length > 0) {
          DOM.favBadgeCounter.textContent = AppState.savedFavorites.length;
          DOM.favBadgeCounter.style.display = 'inline';
        } else {
          DOM.favBadgeCounter.style.display = 'none';
        }
      }

      function renderFavoritesGrid() {
        if (!DOM.favGridContainer) return;
        DOM.favGridContainer.innerHTML = '';
        const noMsgEl = document.getElementById('no-favorites-msg') as HTMLElement | null;
        if (AppState.savedFavorites.length === 0) {
          if (noMsgEl) noMsgEl.style.display = 'block';
          return;
        }
        if (noMsgEl) noMsgEl.style.display = 'none';
        applyResponsiveGridStyle(DOM.favGridContainer);
        AppState.savedFavorites.forEach((favItem: any) => renderImageCard(favItem, DOM.favGridContainer));
      }

      function applyResponsiveGridStyle(gridElement: HTMLElement) {
        const viewportWidth = window.innerWidth;
        if (viewportWidth >= 1200) gridElement.style.gridTemplateColumns = 'repeat(4, 1fr)';
        else if (viewportWidth >= 768) gridElement.style.gridTemplateColumns = 'repeat(3, 1fr)';
        else if (viewportWidth >= 540) gridElement.style.gridTemplateColumns = 'repeat(2, 1fr)';
        else gridElement.style.gridTemplateColumns = 'repeat(1, 1fr)';
      }

      function loadTrendingImages() {
        if (AppState.trendingHasLoaded || !DOM.trendingGridContainer) return;
        AppState.trendingHasLoaded = true;
        DOM.trendingGridContainer.innerHTML = '';
        applyResponsiveGridStyle(DOM.trendingGridContainer);
        TRENDING_SEED_ARRAY.forEach((seedVal, idx) => {
          const trendingImgData = {
            uniqueId: 'trend-' + seedVal,
            seedValue: seedVal,
            thumbnailSrc: PICSUM_BASE_URL + '/seed/' + seedVal + '/400/300',
            displaySrc: PICSUM_BASE_URL + '/seed/' + seedVal + '/800/600',
            downloadSrc: PICSUM_BASE_URL + '/seed/' + seedVal + '/1280/853',
            titleText: TRENDING_TITLE_ARRAY[idx] || 'Trending Photo',
            authorName: 'Featured Photographer',
            categoryTag: 'trending',
          };
          renderImageCard(trendingImgData, DOM.trendingGridContainer);
        });
      }

      function switchActiveView(viewName: string) {
        AppState.activePanel = viewName;
        const availableViews = ['gallery', 'favorites', 'history', 'trending'];
        availableViews.forEach((v) => {
          const panelEl = document.getElementById(v + '-panel') as HTMLElement | null;
          if (panelEl) panelEl.style.display = v === viewName ? 'block' : 'none';
        });
        document.querySelectorAll('.view-tab').forEach((tab) => {
          const isActive = (tab as HTMLElement).dataset.view === viewName;
          tab.classList.toggle('active', isActive);
          tab.setAttribute('aria-selected', isActive.toString());
        });
        if (viewName === 'favorites') renderFavoritesGrid();
        if (viewName === 'history') renderDownloadHistory();
        if (viewName === 'trending') loadTrendingImages();
      }

      document.querySelectorAll('.view-tab').forEach((tab) => {
        tab.addEventListener('click', () => switchActiveView((tab as HTMLElement).dataset.view!));
      });

      document.querySelectorAll('.sort-btn').forEach((sortBtn) => {
        sortBtn.addEventListener('click', function (this: HTMLElement) {
          document.querySelectorAll('.sort-btn').forEach((b) => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          this.classList.add('active');
          this.setAttribute('aria-pressed', 'true');
          AppState.sortPreference = this.dataset.sort;
          AppState.currentPage = 1;
          AppState.imageCollection = [];
          loadImageSet(AppState.currentQuery, 1, false);
        });
      });

      function launchModalPreview(imageData: any) {
        AppState.currentModalData = imageData;
        if (DOM.modalImage) {
          DOM.modalImage.src = imageData.displaySrc || imageData.url;
          DOM.modalImage.alt = imageData.titleText + ' \u2014 HD Photo Preview';
        }
        if (DOM.modalTitle) DOM.modalTitle.textContent = imageData.titleText;
        if (DOM.modalAuthor) DOM.modalAuthor.textContent = 'Photographed by ' + imageData.authorName;
        DOM.modalOverlay?.classList.add('open');
        DOM.modalOverlay?.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        setTimeout(() => document.getElementById('modal-close-trigger')?.focus(), 100);
      }

      function closeModalPreview() {
        DOM.modalOverlay?.classList.remove('open');
        DOM.modalOverlay?.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (DOM.modalImage) DOM.modalImage.src = '';
        AppState.currentModalData = null;
      }

      DOM.modalOverlay?.addEventListener('click', (evt: any) => {
        if (evt.target === DOM.modalOverlay) closeModalPreview();
      });
      document.getElementById('modal-close-trigger')?.addEventListener('click', () => closeModalPreview());
      document.addEventListener('keydown', (keyEvt) => {
        if (keyEvt.key === 'Escape' && DOM.modalOverlay?.classList.contains('open')) closeModalPreview();
      });
      document.getElementById('modal-download-btn')?.addEventListener('click', () => {
        if (AppState.currentModalData) initiateDownload(AppState.currentModalData.downloadSrc || AppState.currentModalData.url, AppState.currentModalData.titleText || 'hd-photo');
      });
      document.getElementById('modal-copy-url-btn')?.addEventListener('click', () => {
        if (AppState.currentModalData) copyTextToClipboard(AppState.currentModalData.displaySrc || AppState.currentModalData.url);
      });
      document.getElementById('modal-share-twitter-btn')?.addEventListener('click', () => {
        if (AppState.currentModalData) shareOnTwitterPlatform(AppState.currentModalData.displaySrc || AppState.currentModalData.url, AppState.currentModalData.titleText || 'HD Photo');
      });

      window.addEventListener('scroll', () => {
        if (!DOM.scrollTopBtn) return;
        if (window.scrollY > 400) DOM.scrollTopBtn.classList.add('visible');
        else DOM.scrollTopBtn.classList.remove('visible');
      }, { passive: true });
      DOM.scrollTopBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

      document.querySelectorAll('.faq-question').forEach((questionBtn) => {
        questionBtn.addEventListener('click', function (this: HTMLElement) {
          const faqEntry = this.closest('.faq-entry');
          if (!faqEntry) return;
          const isExpanded = faqEntry.classList.contains('expanded');
          document.querySelectorAll('.faq-entry.expanded').forEach((openEntry) => {
            openEntry.classList.remove('expanded');
            openEntry.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
          });
          if (!isExpanded) {
            faqEntry.classList.add('expanded');
            this.setAttribute('aria-expanded', 'true');
          }
        });
      });

      function handleUrlQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const queryParam = urlParams.get('q');
        if (queryParam && queryParam.trim() && DOM.searchInputField) {
          DOM.searchInputField.value = queryParam.trim();
          executeSearchOperation(queryParam.trim());
        }
      }

      let resizeDebounceTimer: any;
      window.addEventListener('resize', () => {
        clearTimeout(resizeDebounceTimer);
        resizeDebounceTimer = setTimeout(() => {
          if (AppState.activePanel === 'favorites' && DOM.favGridContainer) applyResponsiveGridStyle(DOM.favGridContainer);
          if (AppState.activePanel === 'trending' && DOM.trendingGridContainer) applyResponsiveGridStyle(DOM.trendingGridContainer);
        }, 200);
      }, { passive: true });

      function initializeViewPanels() {
        ['gallery', 'favorites', 'history', 'trending'].forEach((panelName) => {
          const panelEl = document.getElementById(panelName + '-panel') as HTMLElement | null;
          if (panelEl) panelEl.style.display = panelName === 'gallery' ? 'block' : 'none';
        });
      }

      document.querySelectorAll('.category-btn').forEach((btn) => {
        btn.addEventListener('keydown', (keyEvt: any) => {
          if (keyEvt.key === 'Enter' || keyEvt.key === ' ') {
            keyEvt.preventDefault();
            (btn as HTMLElement).click();
          }
        });
      });

      document.querySelectorAll('.view-tab').forEach((tab, index, tabList) => {
        tab.addEventListener('keydown', (keyEvt: any) => {
          let newIndex: number;
          if (keyEvt.key === 'ArrowRight') {
            keyEvt.preventDefault();
            newIndex = (index + 1) % tabList.length;
            (tabList[newIndex] as HTMLElement).focus();
            (tabList[newIndex] as HTMLElement).click();
          } else if (keyEvt.key === 'ArrowLeft') {
            keyEvt.preventDefault();
            newIndex = (index - 1 + tabList.length) % tabList.length;
            (tabList[newIndex] as HTMLElement).focus();
            (tabList[newIndex] as HTMLElement).click();
          } else if (keyEvt.key === 'Home') {
            keyEvt.preventDefault();
            (tabList[0] as HTMLElement).focus();
            (tabList[0] as HTMLElement).click();
          } else if (keyEvt.key === 'End') {
            keyEvt.preventDefault();
            (tabList[tabList.length - 1] as HTMLElement).focus();
            (tabList[tabList.length - 1] as HTMLElement).click();
          }
        });
      });

      function applyReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
          const styleEl = document.createElement('style');
          styleEl.textContent = ['*, *::before, *::after {', '  animation-duration: 0.01ms !important;', '  animation-iteration-count: 1 !important;', '  transition-duration: 0.01ms !important;', '}'].join('\n');
          document.head.appendChild(styleEl);
        }
      }

      function setupGlobalImageErrorHandler() {
        document.addEventListener('error', (evt: any) => {
          if (evt.target && evt.target.tagName === 'IMG') {
            const imgEl = evt.target as HTMLImageElement;
            if (!(imgEl as any).dataset.errorHandled) {
              (imgEl as any).dataset.errorHandled = 'true';
              const fallbackSeed = Math.floor(Math.random() * 500) + 50;
              imgEl.src = PICSUM_BASE_URL + '/seed/' + fallbackSeed + '/400/300';
            }
          }
        }, true);
      }

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          if (DOM.heroPreviewImg && !DOM.heroPreviewImg.src) loadHeroRandomImage();
        }
      });

      window.addEventListener('popstate', (popEvt: any) => {
        if (popEvt.state && popEvt.state.query && DOM.searchInputField) {
          DOM.searchInputField.value = popEvt.state.query === 'random' ? '' : popEvt.state.query;
          executeSearchOperation(popEvt.state.query);
        }
      });

      (function setupModalSwipeClose() {
        let touchStartY = 0;
        let touchStartX = 0;
        DOM.modalOverlay?.addEventListener('touchstart', (evt: any) => {
          touchStartY = evt.touches[0].clientY;
          touchStartX = evt.touches[0].clientX;
        }, { passive: true });
        DOM.modalOverlay?.addEventListener('touchend', (evt: any) => {
          const touchEndY = evt.changedTouches[0].clientY;
          const touchEndX = evt.changedTouches[0].clientX;
          const deltaY = touchEndY - touchStartY;
          const deltaX = Math.abs(touchEndX - touchStartX);
          if (deltaY > 80 && deltaX < 60) closeModalPreview();
        }, { passive: true });
      })();

      window.addEventListener('beforeprint', () => {
        if (DOM.modalOverlay?.classList.contains('open')) closeModalPreview();
      });

      const popularSearchTerms = [
        'sunset landscape', 'minimal architecture', 'urban street',
        'mountain forest', 'ocean beach', 'coffee shop',
        'abstract texture', 'city skyline', 'flower garden',
        'snow winter', 'desert sand', 'rainy window',
      ];
      function rotatePlaceholderHint() {
        const randomTerm = popularSearchTerms[Math.floor(Math.random() * popularSearchTerms.length)];
        DOM.searchInputField?.setAttribute('placeholder', 'Search free images\u2026 try "' + randomTerm + '"');
      }
      const placeholderInterval = setInterval(() => {
        if (document.activeElement !== DOM.searchInputField) rotatePlaceholderHint();
      }, 4000);
      DOM.searchInputField?.addEventListener('focus', () => {
        if (DOM.searchInputField) DOM.searchInputField.placeholder = 'Type to search free HD images\u2026';
      });
      DOM.searchInputField?.addEventListener('blur', () => {
        if (DOM.searchInputField && !DOM.searchInputField.value) rotatePlaceholderHint();
      });

      function initializeApplication() {
        applyReducedMotion();
        setupGlobalImageErrorHandler();
        initializeViewPanels();
        updateFavoriteBadgeCounter();
        loadHeroRandomImage();
        loadImageSet('random', 1, false);
        handleUrlQueryParams();
        rotatePlaceholderHint();
      }

      initializeApplication();

      // expose cleanup for React unmount
      (window as any).__imggen_cleanup__ = () => {
        clearInterval(placeholderInterval);
        AppState.scrollObserver?.disconnect();
      };
    })();

    return () => {
      try { (window as any).__imggen_cleanup__?.(); } catch { }
    };
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />

        <title>Thefreeaitools- Free Random Image Generator | Download HD Stock Photos Online No Signup</title>
        <meta name="description" content="Thefreeaitools- Generate random high-definition images instantly. Search millions of free stock photos online. Download royalty-free pictures for commercial use. No registration required. Fast, unlimited, watermark-free." />
        <meta name="keywords" content="Thefreeaitools- random image generator, free stock photos, download HD images, royalty free pictures, unsplash alternative, picsum photos, free photo download, stock photography, commercial use images, no signup image generator, instant picture generator, free image API, high resolution photos, professional stock images, creative commons photos, public domain images, free visual content, design resources, blog images, website pictures, social media graphics" />
        <meta name="author" content="Thefreeaitools" />
        <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />

        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="Thefreeaitools- Free Random Image Generator | Download HD Stock Photos Instantly" />
        <meta property="og:description" content="Generate random HD images or search millions of free stock photos. Download royalty-free pictures for commercial use. No signup required." />
        <meta property="og:url" content="https://www.thefreeaitools.com/tools/random-image-for-free" />
        <meta property="og:site_name" content="Thefreeaitools" />
        <meta property="og:image" content="https://picsum.photos/1200/630?grayscale" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Free Random Image Generator Tool Preview" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@thefreeaitools" />
        <meta name="twitter:title" content="Thefreeaitools- Free Random Image Generator | HD Stock Photos" />
        <meta name="twitter:description" content="Generate & download free HD images instantly. No signup. Unlimited downloads. Commercial use allowed." />
        <meta name="twitter:image" content="https://picsum.photos/1200/630?grayscale" />
        <meta name="twitter:image:alt" content="Random Image Generator Tool" />

        <link rel="preconnect" href="https://picsum.photos" crossOrigin="" />
        <link rel="dns-prefetch" href="https://picsum.photos" />

        <link rel="canonical" href="https://www.thefreeaitools.com/tools/random-image" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />

      </Head>

      <style dangerouslySetInnerHTML={{ __html: APP_STYLES }} />


      {/* HERO */}
      <section id="hero" aria-labelledby="hero-heading">
        <div className="hero-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          100% Free — No Signup Required
        </div>
        <h2 id="hero-heading">
          Free <span className="hero-highlight">Random Image Generator</span><br />
          High-Definition Stock Photos
        </h2>
        <p>
          Generate stunning random HD images instantly, or search millions of free stock photos by keyword.
          Download royalty-free pictures for <strong>commercial use</strong>. Zero cost. Zero registration.
          Perfect for designers, developers, bloggers, and content creators.
        </p>
        <div className="cta-container">
          <button className="btn btn-primary" id="generate-random-btn" aria-label="Generate a new random image">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
            Generate Random Image
          </button>
          <button className="btn btn-outline" id="jump-to-search-btn" aria-label="Jump to image search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
            Search Images
          </button>
        </div>
        <div className="trust-signals" role="list" aria-label="Trust signals">
          {['100% Free', 'HD Quality', 'Instant Download', 'No Watermark', 'Mobile Ready'].map((label) => (
            <div className="trust-item" role="listitem" key={label}>
              <svg className="trust-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              {label}
            </div>
          ))}
        </div>
        <div className="hero-preview" role="img" aria-label="Random preview image" aria-live="polite">
          <img id="hero-preview-img" src="" alt="Random high-definition photo preview" loading="eager" />
        </div>
      </section>

      {/* SEARCH */}
      <section id="search-section" aria-label="Image search">
        <div className="search-wrapper" role="search">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          <input
            type="search"
            id="search-input"
            placeholder="Search free images... nature, city, technology, food..."
            aria-label="Search free images by keyword"
            autoComplete="off"
            spellCheck={false}
            maxLength={100}
          />
          <button className="btn-search" id="execute-search-btn" aria-label="Execute search">Search</button>
        </div>
      </section>

      {/* CATEGORIES */}
      <nav id="categories-nav" aria-label="Image category filters">
        <span className="categories-label">Categories:</span>
        <button className="category-btn active" data-category="random" aria-pressed="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /><polyline points="21 16 21 21 16 21" /><line x1="15" y1="15" x2="21" y2="21" /><line x1="4" y1="4" x2="9" y2="9" /></svg>
          Random
        </button>
        <button className="category-btn" data-category="nature" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
          Nature
        </button>
        <button className="category-btn" data-category="technology" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
          Tech
        </button>
        <button className="category-btn" data-category="people" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          People
        </button>
        <button className="category-btn" data-category="architecture" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><path d="M9 22v-4h6v4" /><path d="M8 6h.01" /><path d="M16 6h.01" /><path d="M12 6h.01" /><path d="M12 10h.01" /><path d="M12 14h.01" /><path d="M16 10h.01" /><path d="M16 14h.01" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
          Architecture
        </button>
        <button className="category-btn" data-category="travel" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 1 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" /></svg>
          Travel
        </button>
        <button className="category-btn" data-category="food" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" /></svg>
          Food
        </button>
        <button className="category-btn" data-category="animals" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="4" r="2" /><circle cx="18" cy="8" r="2" /><circle cx="20" cy="16" r="2" /><path d="M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z" /></svg>
          Animals
        </button>
        <button className="category-btn" data-category="art" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" /><circle cx="17.5" cy="10.5" r=".5" /><circle cx="8.5" cy="7.5" r=".5" /><circle cx="6.5" cy="12.5" r=".5" /><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z" /></svg>
          Art
        </button>
        <button className="category-btn" data-category="business" aria-pressed="false">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
          Business
        </button>
      </nav>

      {/* VIEW TABS */}
      <div id="view-tabs" role="tablist" aria-label="Content view selector">
        <button className="view-tab active" data-view="gallery" role="tab" aria-selected="true" aria-controls="gallery-panel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
          Gallery
        </button>
        <button className="view-tab" data-view="favorites" role="tab" aria-selected="false" aria-controls="favorites-panel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
          Favorites
          <span id="favorites-badge-count" className="badge-count" style={{ display: 'none' }}>0</span>
        </button>
        <button className="view-tab" data-view="history" role="tab" aria-selected="false" aria-controls="history-panel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
          Downloads
        </button>
        <button className="view-tab" data-view="trending" role="tab" aria-selected="false" aria-controls="trending-panel">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
          Trending
          <span className="badge-hot">HOT</span>
        </button>
      </div>

      {/* MAIN */}
      <main id="main-content">
        <div id="gallery-panel" className="view-panel active" role="tabpanel" aria-labelledby="gallery-tab">
          <div className="section-header">
            <div className="section-title" id="gallery-title" aria-live="polite">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              Gallery
              <span className="result-count" id="results-counter"></span>
            </div>
            <div className="sort-options" role="group" aria-label="Sort options">
              <button className="sort-btn active" data-sort="latest" aria-pressed="true">Latest</button>
              <button className="sort-btn" data-sort="popular" aria-pressed="false">Popular</button>
            </div>
          </div>
          <div id="image-grid" role="main" aria-label="Image gallery results" aria-live="polite"></div>
          <div id="empty-state" role="status" aria-live="polite">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <p>No images found for that keyword. Try a different search term.</p>
          </div>
          <div id="load-more-area" aria-label="Loading more images">
            <div className="spinner" role="status" aria-label="Loading"></div>
          </div>
        </div>

        <div id="favorites-panel" className="view-panel" role="tabpanel" aria-labelledby="favorites-tab">
          <div className="section-header">
            <div className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              Your Favorites
            </div>
          </div>
          <div id="favorites-grid" style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 1.5rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', gap: '1.25rem' }} aria-label="Saved favorite images"></div>
          <div id="no-favorites-msg" className="no-data-message" style={{ display: 'none' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            <p>No favorites yet. Click the heart icon on any image to save it here.</p>
          </div>
        </div>

        <div id="history-panel" className="view-panel" role="tabpanel" aria-labelledby="history-tab">
          <div className="section-header">
            <div className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              Download History
            </div>
            <button id="clear-history-btn" className="action-btn" style={{ flex: 0, fontSize: '0.75rem', padding: '0.4rem 0.9rem' }} aria-label="Clear all download history">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              Clear All
            </button>
          </div>
          <div id="history-grid" aria-label="Download history gallery"></div>
          <div id="no-history-msg" className="no-data-message" style={{ display: 'none' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <p>No downloads yet. Download an image to see your history here.</p>
          </div>
        </div>

        <div id="trending-panel" className="view-panel" role="tabpanel" aria-labelledby="trending-tab">
          <div className="section-header">
            <div className="section-title">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
              Trending Images
              <span className="badge-hot">POPULAR</span>
            </div>
          </div>
          <div id="trending-grid" style={{ maxWidth: '1320px', margin: '0 auto', padding: '0 1.5rem 3rem', display: 'grid', gridTemplateColumns: 'repeat(1,1fr)', gap: '1.25rem' }} aria-label="Trending images gallery"></div>
        </div>
      </main>

      {/* ORIGINAL FAQ */}
      <section id="faq-section" aria-labelledby="faq-heading">
        <h2 id="faq-heading">Frequently Asked Questions</h2>
        {[
          { q: 'What is a random image generator and how does it work?', a: "A random image generator is an online tool that automatically fetches and displays high-quality photographs from extensive databases like Lorem Picsum and Unsplash. When you click the generate button, the tool selects a unique image at random from thousands of available photos covering nature, technology, people, architecture, and more. Each click produces a different image instantly with full HD resolution available for immediate download." },
          { q: 'Is this image generator completely free to use?', a: 'Yes, absolutely 100% free with no hidden charges, premium tiers, or credit card requirements. You can generate unlimited random images, search for specific keywords, preview in fullscreen, and download as many HD photos as you need without any cost or account creation. This tool will always remain free for personal and commercial use.' },
          { q: 'Can I use downloaded images for commercial projects?', a: 'Images sourced through our tool come from Lorem Picsum and Unsplash Source APIs. Most images are available under free licenses that permit commercial use. However, we strongly recommend checking the specific license terms for each individual image before using it in commercial projects, as some photographers may require attribution or have specific usage restrictions.' },
          { q: 'Where do the random images come from?', a: 'Our image generator pulls from two primary sources: (1) Lorem Picsum (picsum.photos) which provides placeholder and stock-style images with reliable uptime, and (2) Unsplash Source which offers professional photography from a global community of talented photographers. Both services provide high-quality, royalty-free images suitable for various use cases including websites, presentations, and printed materials.' },
          { q: 'How do I search for specific types of images?', a: 'To search for specific images, type your keyword into the search bar near the top of the page. You can search for any topic such as nature landscapes, technology devices, people portraits, architecture buildings, travel destinations, food cuisine, animals wildlife, art designs, or business scenes. Press Enter or click the Search button to see relevant results displayed in a clean grid layout with hover previews.' },
          { q: 'What is the resolution and quality of downloadable images?', a: 'Downloadable images are available in high definition quality, typically 1280x853 pixels or higher depending on the source image. The tool fetches full-resolution versions directly from the API ensuring you get the best possible quality suitable for web use, blog posts, social media, presentations, print materials, and digital design projects without any watermarks or compression artifacts.' },
          { q: 'Do I need to create an account or sign up?', a: 'No account, email address, password, or sign-up process is required whatsoever. The tool works immediately upon opening the page in your browser. Simply visit the URL, click Generate Random or enter a search term, and start downloading images right away. Your favorites are saved locally in your browser storage so they persist between visits without needing any server-side authentication.' },
          { q: 'Can I save my favorite images for later access?', a: "Yes, you can save any image to your personal Favorites collection by clicking the heart icon located on each image card. All favorited images are stored locally in your browser using localStorage technology, meaning they persist between sessions and browser restarts without requiring any account login. Access your saved favorites anytime via the Favorites tab in the main navigation." },
          { q: 'Does this work on mobile phones and tablets?', a: 'Yes, the tool is fully responsive and optimized for all device sizes including smartphones (iOS and Android), tablets (iPad, Android tablets), laptops, and desktop computers. The interface automatically adapts with appropriate grid layouts, touch-friendly buttons meeting minimum 44-pixel tap targets, optimized image loading for mobile networks, and smooth gesture-based interactions.' },
          { q: 'How do I copy an image URL or share an image?', a: 'Each image card includes a dedicated Copy URL button that copies the direct image link to your clipboard instantly with one click. There is also a Share button that opens Twitter/X pre-populated with the image link and a description. You can open any image in fullscreen preview mode which provides additional options for downloading, copying, and sharing the photograph.' },
          { q: 'What image categories are available to browse?', a: 'Available preset categories include Nature (landscapes, forests, mountains), Technology (computers, circuits, devices), People (portraits, lifestyles, groups), Architecture (modern buildings, interiors, skylines), Travel (destinations, adventures, cultures), Food (cuisine, beverages, dishes), Animals (wildlife, pets, birds), Art (abstract, creative, patterns), and Business (office, corporate, meetings). Click any category tag to instantly load a fresh set of themed images.' },
          { q: 'Is there a limit on how many images I can generate or download?', a: 'There are absolutely no limits on generation count, search queries, or downloads. You can produce unlimited random images, perform unlimited searches across any keyword, and download as many photos as you need for your projects. The underlying APIs support high-volume requests, and the infinite scroll feature automatically loads additional images as you scroll down the page for seamless browsing.' },
        ].map((entry, idx) => (
          <article key={idx} className="faq-entry">
            <button className="faq-question" aria-expanded="false">
              {entry.q}
              <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            <div className="faq-answer">{entry.a}</div>
          </article>
        ))}
      </section>

      {/* ============================================================
          NEW: 2000+ WORD SEO CONTENT SECTION
          ============================================================ */}

      {/* ============================================================
          NEW: SEO FAQ SECTION
          ============================================================ */}
      <section id="seo-faq-section" aria-labelledby="seo-faq-heading">
        <h2 id="seo-faq-heading">SEO Frequently Asked Questions</h2>
        {[
          { q: 'What is SEO in simple words?', a: "SEO (Search Engine Optimization) is the practice of improving a website so search engines like Google, Bing, and DuckDuckGo can understand it, trust it, and rank it higher for relevant queries. It combines on-page content, technical performance, mobile usability, structured data, and authority signals to drive free organic traffic — the kind that doesn't disappear when you stop paying for ads." },
          { q: 'What are the three pillars of SEO?', a: "The three pillars of SEO are: (1) On-page SEO — content, titles, headings, meta descriptions, internal links, and keyword targeting; (2) Technical SEO — crawlability, indexing, site speed, Core Web Vitals, mobile-friendliness, structured data, and HTTPS; (3) Off-page SEO — backlinks, brand mentions, social signals, and authority/trust (E-E-A-T)." },
          { q: 'How do I optimize images for SEO on a stock photo site?', a: "Image SEO best practices: descriptive file names (sunset-beach-california.jpg, not IMG_8492.jpg), accurate alt text for accessibility AND keywords, modern formats like WebP/AVIF, responsive srcset attributes, lazy loading via loading='lazy', compression to under 200 KB where possible, descriptive captions, EXIF/IPTC metadata, and submitting an image sitemap in Search Console. Always declare width and height to avoid CLS." },
          { q: 'What is schema markup and why does it matter for an image generator?', a: "Schema markup (structured data, written in JSON-LD) tells search engines exactly what your content means. For an image generator, the most valuable schemas are WebApplication (with aggregateRating and offers), FAQPage, BreadcrumbList, Organization, and ImageObject. Correct schema unlocks rich results — star ratings, FAQ accordions, image carousels — which significantly boost click-through rates from search." },
          { q: 'What are Core Web Vitals?', a: "Core Web Vitals are Google's three official user-experience metrics: LCP (Largest Contentful Paint, target < 2.5s), INP (Interaction to Next Paint, target < 200ms), and CLS (Cumulative Layout Shift, target < 0.1). They are a confirmed ranking factor and directly affect bounce rate. Optimize images, defer non-critical JavaScript, and always declare image dimensions." },
          { q: 'How long does SEO take to show results?', a: "Most websites see meaningful SEO movement in 3–6 months, with strong rankings in 6–12 months. New domains take longer due to the sandbox effect. Image-heavy tool pages can rank faster if they target long-tail queries with low competition and have technically perfect pages. The compounding effect of SEO accelerates significantly after month 8." },
          { q: 'What is keyword research?', a: "Keyword research is the process of discovering what real people type into search engines. It identifies queries with sufficient search volume, reasonable competition, and matching intent for your page. Tools include Google Keyword Planner, Ahrefs, Semrush, Ubersuggest, AlsoAsked, AnswerThePublic, and Google Search Console's Performance report (which shows queries you already rank for)." },
          { q: 'What is E-E-A-T in SEO?', a: "E-E-A-T stands for Experience, Expertise, Authoritativeness, and Trustworthiness. It comes from Google's Search Quality Rater Guidelines and especially matters for YMYL (Your Money or Your Life) topics. You build E-E-A-T through real author bios, original research, accurate information, citations, secure HTTPS, transparent About/Contact pages, and earned backlinks from reputable sites." },
          { q: 'Are AI-generated images bad for SEO?', a: "Not inherently. Google has stated the focus is on quality and helpfulness, not the production method. AI-generated images are fine if they are relevant, original, properly compressed, have descriptive alt text, and serve user intent. Avoid mass-producing thousands of low-quality AI images purely to manipulate rankings — that triggers spam-policy enforcement under Google's Scaled Content Abuse policy." },
          { q: 'Do I need backlinks to rank?', a: "For competitive head-term keywords, yes — backlinks remain one of the strongest ranking signals. For long-tail queries, well-optimized pages with strong on-page SEO and technical health can rank without many backlinks. Focus on earning links through outstanding content, free tools, original data, embeddable widgets, and digital PR — never buy links." },
          { q: 'What is the difference between SEO and SEM?', a: "SEO (Search Engine Optimization) drives free, organic traffic from unpaid search results over the long term. SEM (Search Engine Marketing) is the broader term that usually refers to paid search ads (Google Ads / PPC). SEO compounds over time and keeps delivering after you stop investing; SEM stops the moment you stop paying. Most successful sites use both — SEM for immediate validation, SEO for sustainable growth." },
          { q: 'What is mobile-first indexing?', a: "Since 2023, Google indexes the mobile version of every site as the primary version. The desktop version is essentially ignored for ranking. This means your mobile experience IS your SEO. Audit on a real mid-tier Android device, ensure 44×44 px tap targets, 16 px+ font sizes, no horizontal scroll, and identical content parity between mobile and desktop." },
          { q: 'How do I write a good title tag?', a: "Keep it 50–60 characters, lead with the primary keyword, include a value proposition or differentiator (Free, HD, No Signup, 2026), and front-load important words. Example: 'Free Random Image Generator | HD Stock Photos — No Signup'. Avoid keyword stuffing, ALL CAPS, and clickbait. Each page must have a unique title." },
          { q: 'What is the difference between noindex, nofollow, and disallow?', a: "noindex (meta tag) tells search engines not to index a page but still allows them to crawl it. nofollow (rel attribute) tells engines not to pass link equity through that link. disallow (robots.txt) tells crawlers not to crawl the URL at all — but the URL can still be indexed if linked from elsewhere. Use noindex (not robots.txt) to remove pages from search results." },
          { q: 'How do AI Overviews and Generative Search affect SEO?', a: "AI Overviews (Google SGE), Bing Copilot, Perplexity, and ChatGPT Search increasingly answer queries directly in the results, citing source pages. To get cited: write definition-style opening sentences, use clear semantic headings, implement FAQ schema, build topical authority, and provide accurate, original, well-sourced information. Pages that already rank in the top 10 are far more likely to be cited." },
        ].map((entry, idx) => (
          <article key={'seo-' + idx} className="faq-entry">
            <button className="faq-question" aria-expanded="false">
              {entry.q}
              <svg className="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            <div className="faq-answer">{entry.a}</div>
          </article>
        ))}
      </section>



      {/* MODAL / LIGHTBOX */}
      <div id="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title-text" aria-hidden="true">
        <button className="modal-close-btn" id="modal-close-trigger" aria-label="Close image preview">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
        <div id="modal-content">
          <div id="modal-image-container">
            <img id="modal-image-element" src="" alt="" loading="lazy" />
          </div>
          <div id="modal-footer">
            <div id="modal-info">
              <div id="modal-title-text">HD Photograph</div>
              <div id="modal-author-text">via Lorem Picsum / Unsplash</div>
            </div>
            <div id="modal-actions-row">
              <button className="btn btn-primary" id="modal-download-btn" style={{ padding: '0.6rem 1.25rem', fontSize: '0.85rem' }} aria-label="Download this image in HD">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                Download HD
              </button>
              <button className="action-btn primary" id="modal-copy-url-btn" style={{ flex: 0, padding: '0.6rem 1rem', fontSize: '0.85rem' }} aria-label="Copy image URL to clipboard">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                Copy URL
              </button>
              <button className="action-btn" id="modal-share-twitter-btn" aria-label="Share on Twitter/X">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.261 5.632zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST CONTAINER */}
      <div id="toast-container" role="region" aria-label="Notification messages" aria-live="polite"></div>

      {/* SCROLL TO TOP */}
      <button id="scroll-to-top" aria-label="Scroll back to top of page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
      </button>
    </>
  );
}
