'use client';

import Head from 'next/head';
import { useEffect } from 'react';

export default function FreeBooksRecommendedAI() {
  useEffect(() => {
    // ============================================================================
    // ORIGINAL JAVASCRIPT — preserved verbatim from the source HTML
    // (only wrapped in useEffect; no logic changed)
    // ============================================================================
    'use strict';

    const API = 'https://www.googleapis.com/books/v1/volumes';
    const RATE_LIMIT_DELAY = 400;

    const CATS = [
      { l: 'All', v: '' },
      { l: 'Fiction', v: 'fiction' },
      { l: 'Classic Lit', v: 'classic literature' },
      { l: 'Science', v: 'science' },
      { l: 'History', v: 'history' },
      { l: 'Philosophy', v: 'philosophy' },
      { l: 'Romance', v: 'romance' },
      { l: 'Psychology', v: 'psychology' },
      { l: 'Technology', v: 'technology' },
      { l: 'Drama', v: 'drama' },
      { l: 'Children', v: 'juvenile fiction' },
      { l: 'Biography', v: 'biography' },
      { l: 'Poetry', v: 'poetry' },
      { l: 'Mystery', v: 'mystery' },
    ];

    const FAQ = [
      { q: 'Is it legal to read these books?', a: 'Yes. FreeBooks only provides access to public domain books and Google Books previews. Public domain means copyright has expired, making them completely free and legal worldwide.' },
      { q: 'Where do the books come from?', a: 'All books are sourced from the Google Books API — the same database behind Google Books itself. Public domain books are fully readable; others may have partial previews.' },
      { q: 'Why do some books show "preview not available"?', a: 'Google Books controls preview availability based on publisher agreements. Public domain books are fully open; newer books may only show a few pages or none.' },
      { q: 'Can I download books?', a: 'Books marked as "Free" (public domain) often have PDF/EPUB download links. The Download button will appear when a download is available.' },
      { q: 'Do I need to create an account?', a: 'No. Everything works without any account. Favourites and history are stored locally in your browser — completely private.' },
      { q: 'What is the difference between "Free" and "Preview"?', a: '"Free" means the full book is in the public domain and readable in full. "Preview" means only a sample is available via Google Books.' },
    ];

    const S: any = {
      query: '',
      cat: '',
      sort: 'relevance',
      start: 0,
      total: 0,
      maxResults: 12,
      favorites: load('fb_favs', []),
      recent: load('fb_recent', []),
      zoom: 1,
      tts: false,
      ttsUtterance: null,
      progressTimer: null as any,
      readerToken: '',
      readerTimeout: null as any,
      lastReqTime: 0,
      cache: new Map<string, any>(),
    };

    function load(k: string, d: any) { try { return JSON.parse(localStorage.getItem(k) as any) || d; } catch { return d; } }
    function save(k: string, v: any) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { } }

    const $ = (s: string) => document.querySelector(s) as any;
    const $$ = (s: string) => Array.from(document.querySelectorAll(s)) as any[];
    const get = (id: string) => document.getElementById(id) as any;

    function esc(s: any) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function trunc(s: any, n: number) { s = String(s || ''); return s.length > n ? s.slice(0, n) + '…' : s; }
    function safeURL(u: any) { if (!u) return null; try { const p = new URL(u); return (p.protocol === 'http:' || p.protocol === 'https:') ? p.href : null; } catch { return null; } }
    function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }
    async function rateLimit() {
      const now = Date.now(), diff = now - S.lastReqTime;
      if (diff < RATE_LIMIT_DELAY) await sleep(RATE_LIMIT_DELAY - diff);
      S.lastReqTime = Date.now();
    }
    function stars(r: any) {
      const n = Math.round(r || 0);
      return Array.from({ length: 5 }, (_, i) => `<span style="color:${i < n ? '#F59E0B' : '#444'}">${i < n ? '★' : '☆'}</span>`).join('');
    }
    function placeholderSVG(title: string) {
      const l = (title || '?')[0].toUpperCase();
      return 'data:image/svg+xml,' + encodeURIComponent(`<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#1A1A1A"/><rect x="20" y="20" width="160" height="160" rx="4" fill="#222"/><text x="100" y="115" text-anchor="middle" font-size="64" font-family="Georgia,serif" fill="#C9A84C" opacity=".4">${l}</text><rect x="30" y="145" width="140" height="3" rx="2" fill="#2A2A2A"/><rect x="30" y="155" width="100" height="3" rx="2" fill="#2A2A2A"/></svg>`);
    }
    function coverURL(info: any) {
      const raw = (info?.imageLinks?.thumbnail || info?.imageLinks?.smallThumbnail || '');
      return raw.replace('http://', 'https://') || null;
    }

    function toast(msg: string, type = 'i') {
      const t = document.createElement('div');
      const icons: any = {
        s: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>',
        e: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        i: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
      };
      t.className = `toast ${type}`;
      t.innerHTML = (icons[type] || icons.i) + esc(msg);
      get('toasts').appendChild(t);
      setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(6px)'; t.style.transition = 'all .3s'; setTimeout(() => t.remove(), 350); }, 3500);
    }

    function isFav(id: string) { return S.favorites.some((b: any) => b.id === id); }
    function toggleFav(book: any, e?: any) {
      if (e) { e.stopPropagation(); }
      const was = isFav(book.id);
      if (was) { S.favorites = S.favorites.filter((b: any) => b.id !== book.id); toast('Removed from favourites', 'i'); }
      else { S.favorites.push(book); toast('Added to favourites', 's'); }
      save('fb_favs', S.favorites);
      updateFavCount();
      $$(`[data-fav="${book.id}"]`).forEach((btn: any) => {
        btn.classList.toggle('active', !was);
        btn.setAttribute('aria-label', was ? 'Add to favourites' : 'Remove from favourites');
      });
      if (get('favPanel').style.display !== 'none') renderFavPanel();
    }
    function updateFavCount() {
      const n = S.favorites.length;
      const el = get('favCount');
      el.textContent = n || '';
      el.style.display = n ? 'flex' : 'none';
      const span = get('favPanelCount');
      if (span) span.textContent = `(${n})`;
    }
    function toggleFavPanel() {
      const p = get('favPanel');
      const open = p.style.display !== 'none';
      p.style.display = open ? 'none' : 'block';
      if (!open) { renderFavPanel(); p.scrollIntoView({ behavior: 'smooth' }); }
    }
    function renderFavPanel() {
      const grid = get('favGrid'), empty = get('favEmpty');
      grid.innerHTML = '';
      if (!S.favorites.length) { empty.style.display = 'block'; return; }
      empty.style.display = 'none';
      S.favorites.forEach((b: any) => grid.appendChild(buildCard(b)));
    }

    function addRecent(book: any) {
      S.recent = S.recent.filter((b: any) => b.id !== book.id);
      S.recent.unshift(book);
      if (S.recent.length > 12) S.recent = S.recent.slice(0, 12);
      save('fb_recent', S.recent);
      renderRecent();
    }
    function clearRecent() {
      S.recent = []; save('fb_recent', []);
      get('recentSec').style.display = 'none';
      toast('History cleared', 'i');
    }
    function renderRecent() {
      if (!S.recent.length) { get('recentSec').style.display = 'none'; return; }
      get('recentSec').style.display = 'block';
      const strip = get('recentStrip');
      strip.innerHTML = '';
      S.recent.slice(0, 10).forEach((b: any) => {
        const d = document.createElement('div');
        d.className = 'recent-item';
        d.title = b.title;
        const img = document.createElement('img');
        img.src = b.cover || placeholderSVG(b.title);
        img.alt = b.title;
        img.loading = 'lazy';
        img.onerror = () => (img.src = placeholderSVG(b.title));
        const p = document.createElement('p');
        p.textContent = trunc(b.title, 14);
        d.append(img, p);
        d.addEventListener('click', () => openReader(b));
        strip.appendChild(d);
      });
    }

    function buildCard(item: any) {
      let book: any;
      if (item.volumeInfo) {
        const info = item.volumeInfo, access = item.accessInfo || {};
        const pdfDL = safeURL(access.pdf?.downloadLink) || null;
        const epubDL = safeURL(access.epub?.downloadLink) || null;
        const isPublic = access.accessViewStatus === 'FULL_PUBLIC_DOMAIN';
        const hasPrev = access.viewability === 'PARTIAL' || access.viewability === 'ALL_PAGES';
        book = {
          id: item.id || '',
          title: info.title || 'Unknown Title',
          authors: (info.authors || ['Unknown Author']).join(', '),
          rating: info.averageRating || 0,
          pages: info.pageCount || 0,
          year: (info.publishedDate || '').slice(0, 4),
          cover: coverURL(info),
          preview: safeURL(info.previewLink) || null,
          pdfDL, epubDL,
          download: pdfDL || epubDL,
          isPublic, hasPrev,
          description: info.description || '',
        };
      } else {
        book = item;
      }

      const card = document.createElement('article');
      card.className = 'book-card';
      card.setAttribute('role', 'listitem');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-label', `${book.title} by ${book.authors}`);

      const coverWrap = document.createElement('div');
      coverWrap.className = 'book-cover-wrap';

      if (book.cover) {
        const img = document.createElement('img');
        img.className = 'loading';
        img.alt = `Cover: ${book.title}`;
        img.loading = 'lazy';
        img.src = book.cover;
        img.onload = () => img.classList.remove('loading');
        img.onerror = () => { coverWrap.innerHTML = ''; coverWrap.appendChild(makePlaceholder(book.title)); };
        coverWrap.appendChild(img);
      } else {
        coverWrap.appendChild(makePlaceholder(book.title));
      }

      if (book.isPublic || book.hasPrev) {
        const badge = document.createElement('span');
        badge.className = `badge ${book.isPublic ? 'free' : 'preview'}`;
        badge.textContent = book.isPublic ? 'Free' : 'Preview';
        coverWrap.appendChild(badge);
      }

      const favBtn = document.createElement('button');
      favBtn.className = `fav-btn${isFav(book.id) ? ' active' : ''}`;
      favBtn.setAttribute('data-fav', book.id);
      favBtn.setAttribute('aria-label', isFav(book.id) ? 'Remove from favourites' : 'Add to favourites');
      favBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="${isFav(book.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
      favBtn.addEventListener('click', (e) => toggleFav(book, e));
      coverWrap.appendChild(favBtn);
      card.appendChild(coverWrap);

      const info = document.createElement('div');
      info.className = 'book-info';
      info.innerHTML = `
        <div class="book-title">${esc(book.title)}</div>
        <div class="book-author">${esc(book.authors)}</div>
        <div class="book-meta">
          ${book.year ? `<span>${esc(book.year)}</span>` : ''}
          ${book.pages ? `<span>·</span><span>${book.pages}p</span>` : ''}
        </div>
        ${book.rating ? `<div class="stars" aria-label="Rating ${book.rating} out of 5">${stars(book.rating)} <span style="font-size:11px;color:var(--muted)">${book.rating.toFixed(1)}</span></div>` : ''}
      `;
      card.appendChild(info);

      const actions = document.createElement('div');
      actions.className = 'book-actions';

      const readBtn = document.createElement('button');
      readBtn.className = 'btn-read';
      readBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>Read`;
      readBtn.setAttribute('aria-label', `Read ${book.title}`);
      readBtn.addEventListener('click', (e) => { e.stopPropagation(); openReader(book); });

      const dlBtn = document.createElement('button');
      dlBtn.className = 'btn-dl';
      if (book.download) {
        dlBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>DL`;
        dlBtn.setAttribute('aria-label', `Download ${book.title}`);
        dlBtn.setAttribute('title', 'Download (public domain)');
        dlBtn.addEventListener('click', (e) => { e.stopPropagation(); window.open(safeURL(book.download) as any, '_blank', 'noopener,noreferrer'); });
      } else {
        dlBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>DL`;
        dlBtn.disabled = true;
        dlBtn.title = 'Download not available';
      }

      actions.append(readBtn, dlBtn);
      card.appendChild(actions);

      card.addEventListener('click', () => openReader(book));
      card.addEventListener('keydown', (e: any) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openReader(book); } });

      return card;
    }

    function makePlaceholder(title: string) {
      const d = document.createElement('div');
      d.className = 'cover-placeholder';
      d.innerHTML = `<div class="letter">${(title || '?')[0].toUpperCase()}</div><div class="lines"><div class="line"></div><div class="line"></div><div class="line"></div></div>`;
      return d;
    }

    function showSkeleton(grid: any, count = 8) {
      grid.innerHTML = Array.from({ length: count }, () => `
        <div class="skel-card">
          <div class="skel" style="height:200px;border-radius:0"></div>
          <div style="padding:12px;display:flex;flex-direction:column;gap:8px">
            <div class="skel" style="height:13px;width:85%"></div>
            <div class="skel" style="height:11px;width:55%"></div>
            <div class="skel" style="height:11px;width:35%"></div>
            <div style="display:flex;gap:6px;margin-top:8px">
              <div class="skel" style="height:30px;flex:1;border-radius:7px"></div>
              <div class="skel" style="height:30px;width:44px;border-radius:7px"></div>
            </div>
          </div>
        </div>`).join('');
    }

    async function fetchWithRetry(url: string, retries = 3, delay = 1200): Promise<any> {
      for (let i = 0; i < retries; i++) {
        await rateLimit();
        const resp = await fetch(url);
        if (resp.status === 429) {
          if (i < retries - 1) { await sleep(delay * (i + 1)); continue; }
          throw new Error('Rate limited (429). Please try again in a moment.');
        }
        if (!resp.ok) throw new Error(`API error ${resp.status}`);
        return resp.json();
      }
    }

    async function fetchBooks(append = false) {
      const q = buildQuery();
      if (!q) return;

      const cacheKey = `${q}|${S.start}|${S.sort}`;
      const cached = S.cache.get(cacheKey);

      const grid = get('resultsGrid');
      if (!append) { showSkeleton(grid, 8); }
      get('resultsSec').style.display = 'block';
      get('trendingSec').style.display = 'none';
      get('loadMoreBtn').style.display = 'none';

      try {
        let data = cached;
        if (!data) {
          const params = new URLSearchParams({
            q,
            startIndex: String(S.start),
            maxResults: String(S.maxResults),
            orderBy: S.sort,
            printType: 'books',
            langRestrict: 'en',
          });
          data = await fetchWithRetry(`${API}?${params}`);
          S.cache.set(cacheKey, data);
          if (S.cache.size > 40) { S.cache.delete(S.cache.keys().next().value); }
        }

        const items = data.items || [];
        S.total = data.totalItems || 0;

        if (!append) grid.innerHTML = '';

        get('resultsHeading').textContent = S.query ? `"${S.query}"` : `${S.cat || 'All Books'}`;
        get('resultsCount').textContent = `${Math.min(S.total, 1000).toLocaleString()} books found`;

        if (!items.length && !append) {
          grid.innerHTML = `<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><h3>No books found</h3><p>Try a different keyword or category.</p></div>`;
          return;
        }

        const frag = document.createDocumentFragment();
        items.forEach((item: any) => frag.appendChild(buildCard(item)));
        grid.appendChild(frag);

        S.start += S.maxResults;
        const btn = get('loadMoreBtn');
        btn.style.display = (S.start < Math.min(S.total, 120)) ? 'inline-flex' : 'none';

      } catch (err: any) {
        if (!append) grid.innerHTML = `<div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg><h3>Error loading books</h3><p>${esc(err.message)}</p></div>`;
        toast(err.message, 'e');
      }
    }

    function buildQuery() {
      let q = '';
      if (S.query && S.cat) q = `${S.query}+subject:${S.cat}`;
      else if (S.query) q = S.query;
      else if (S.cat) q = `subject:${S.cat}`;
      return q;
    }

    function doSearch() {
      const v = get('searchInput').value.trim();
      if (!v) return;
      S.query = v; S.start = 0;
      get('heroInput').value = v;
      fetchBooks();
    }
    function doHeroSearch() {
      const v = get('heroInput').value.trim();
      if (!v) return;
      S.query = v; S.start = 0;
      get('searchInput').value = v;
      fetchBooks();
    }
    function loadMore() { fetchBooks(true); }

    function filterCat(val: string) {
      S.cat = val; S.start = 0; S.query = '';
      get('searchInput').value = '';
      get('heroInput').value = '';
      $$('.cat-pill').forEach((p: any) => { p.classList.toggle('active', p.dataset.val === val); });
      fetchBooks();
      return false;
    }
    function resetHome() {
      S.query = ''; S.cat = ''; S.start = 0;
      get('searchInput').value = '';
      get('heroInput').value = '';
      get('resultsSec').style.display = 'none';
      get('trendingSec').style.display = 'block';
      $$('.cat-pill').forEach((p: any) => { p.classList.toggle('active', p.dataset.val === ''); });
    }

    async function loadTrending() {
      const grid = get('trendingGrid');
      showSkeleton(grid, 10);
      const queries = ['subject:classic+fiction', 'subject:victorian+literature', 'Charles+Dickens', 'Jane+Austen', 'Mark+Twain'];
      const q = queries[Math.floor(Math.random() * queries.length)];
      const cacheKey = `trending:${q}`;
      try {
        let data = S.cache.get(cacheKey);
        if (!data) {
          await rateLimit();
          const params = new URLSearchParams({ q, maxResults: '12', orderBy: 'relevance', printType: 'books', langRestrict: 'en' });
          const resp = await fetch(`${API}?${params}`);
          if (!resp.ok) throw new Error(`API ${resp.status}`);
          data = await resp.json();
          S.cache.set(cacheKey, data);
        }
        const items = (data.items || []).slice(0, 12);
        grid.innerHTML = '';
        const frag = document.createDocumentFragment();
        items.forEach((item: any) => frag.appendChild(buildCard(item)));
        grid.appendChild(frag);
      } catch (err: any) {
        grid.innerHTML = `<div class="empty" style="grid-column:1/-1"><p style="color:var(--muted);font-size:13px">Could not load trending books. ${err.message}</p></div>`;
      }
    }

    let prevFocus: any = null;
    function openReader(book: any) {
      addRecent(book);
      prevFocus = document.activeElement;
      const modal = get('readerModal');
      modal.style.display = 'block';
      document.body.style.overflow = 'hidden';
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;

      get('readerTitle').textContent = trunc(book.title, 60);
      S.zoom = 1;
      const frame = get('readerFrame');
      frame.style.transform = '';
      frame.style.display = 'block';
      get('readerFallback').style.display = 'none';
      get('readerLoading').style.display = 'flex';
      get('progressFill').style.width = '0%';
      stopTTS();

      clearTimeout(S.readerTimeout);
      clearInterval(S.progressTimer);

      const token = `${book.id}:${Date.now()}`;
      S.readerToken = token;

      let src: string | null = null;
      if (book.isPublic || book.hasPrev) {
        src = `https://books.google.com/books?id=${encodeURIComponent(book.id)}&printsec=frontcover&output=embed&hl=en`;
      }

      if (!src) { showFallback(book); return; }

      let p = 10;
      get('progressFill').style.width = '10%';
      S.progressTimer = setInterval(() => {
        p = Math.min(p + (p < 70 ? 12 : 4), 90);
        get('progressFill').style.width = p + '%';
        if (p >= 90) clearInterval(S.progressTimer);
      }, 200);

      S.readerTimeout = setTimeout(() => {
        if (S.readerToken !== token) return;
        showFallback(book, 'The preview is taking too long. Open it directly using the links below.');
      }, 10000);

      frame.onload = function () {
        if (S.readerToken !== token) return;
        clearTimeout(S.readerTimeout);
        clearInterval(S.progressTimer);
        get('progressFill').style.width = '100%';
        get('readerLoading').style.display = 'none';
        try {
          if (frame.contentDocument?.body?.innerHTML?.includes('content is blocked')) {
            showFallback(book);
          }
        } catch { }
      };
      frame.src = src;
      get('readerModal').querySelector('.reader-btn:last-of-type').focus();
    }

    function showFallback(book: any, msg = 'Inline preview not available for this book.') {
      S.readerToken = '';
      clearTimeout(S.readerTimeout);
      clearInterval(S.progressTimer);
      get('progressFill').style.width = '0%';
      get('readerLoading').style.display = 'none';
      get('readerFrame').src = 'about:blank';
      get('readerFrame').style.display = 'none';
      const fb = get('readerFallback');
      fb.style.display = 'flex';
      get('fallbackMsg').textContent = msg;
      const gURL = book.pdfDL || book.preview || `https://books.google.com/books?id=${encodeURIComponent(book.id)}`;
      get('gLink').href = gURL;
      get('olLink').href = `https://openlibrary.org/search?q=${encodeURIComponent(book.title)}`;
    }

    function closeReader() {
      S.readerToken = '';
      clearTimeout(S.readerTimeout);
      clearInterval(S.progressTimer);
      stopTTS();
      const modal = get('readerModal');
      modal.style.display = 'none';
      const frame = get('readerFrame');
      frame.src = 'about:blank';
      frame.onload = null;
      get('readerFallback').style.display = 'none';
      get('readerLoading').style.display = 'flex';
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.overflow = '';
      window.scrollTo(0, parseInt(scrollY || '0'));
      if (prevFocus?.focus) prevFocus.focus();
    }

    function zoomIn() { S.zoom = Math.min(S.zoom + 0.1, 2); get('readerFrame').style.transform = `scale(${S.zoom})`; get('readerFrame').style.transformOrigin = 'top center'; }
    function zoomOut() { S.zoom = Math.max(S.zoom - 0.1, 0.5); get('readerFrame').style.transform = `scale(${S.zoom})`; get('readerFrame').style.transformOrigin = 'top center'; }
    function toggleFS() {
      if (!document.fullscreenElement) get('readerModal').requestFullscreen().catch(() => toast('Fullscreen not supported', 'i'));
      else document.exitFullscreen();
    }

    function stopTTS() {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      S.tts = false;
      const btn = get('ttsBtn');
      if (btn) btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>`;
    }
    function toggleTTS() {
      if (!window.speechSynthesis) { toast('TTS not supported in this browser', 'i'); return; }
      if (S.tts) { stopTTS(); return; }
      const u = new SpeechSynthesisUtterance(`Now reading: ${get('readerTitle').textContent}`);
      u.rate = 0.92; u.pitch = 1; u.onend = stopTTS; u.onerror = stopTTS;
      S.tts = true;
      get('ttsBtn').innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>`;
      window.speechSynthesis.speak(u);
    }

    function buildCats() {
      const wrap = get('catPills');
      CATS.forEach((c) => {
        const btn = document.createElement('button');
        btn.className = `cat-pill${c.v === S.cat ? ' active' : ''}`;
        btn.dataset.val = c.v;
        btn.textContent = c.l;
        btn.setAttribute('aria-label', `Filter by ${c.l}`);
        btn.addEventListener('click', () => filterCat(c.v));
        wrap.appendChild(btn);
      });
    }

    function buildFAQ() {
      const wrap = get('faqList');
      FAQ.forEach((f, i) => {
        const item = document.createElement('div');
        item.className = 'faq-item';
        const btn = document.createElement('button');
        btn.className = 'faq-q';
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-controls', `fa${i}`);
        btn.innerHTML = `<span>${esc(f.q)}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>`;
        const ans = document.createElement('div');
        ans.className = 'faq-a';
        ans.id = `fa${i}`;
        ans.textContent = f.a;
        btn.addEventListener('click', () => {
          const open = btn.getAttribute('aria-expanded') === 'true';
          $$('.faq-q').forEach((b: any) => { b.setAttribute('aria-expanded', 'false'); b.nextElementSibling.classList.remove('open'); });
          if (!open) { btn.setAttribute('aria-expanded', 'true'); ans.classList.add('open'); }
        });
        item.append(btn, ans);
        wrap.appendChild(item);
      });
    }

    // SEO FAQ accordion (additional)
    function bindSEOFAQ() {
      $$('.seo-faq-q').forEach((b: any) => {
        b.addEventListener('click', () => {
          const item = b.parentElement;
          item.classList.toggle('open');
        });
      });
    }

    // Expose handlers used by inline onclick attributes
    (window as any).resetHome = resetHome;
    (window as any).doSearch = doSearch;
    (window as any).doHeroSearch = doHeroSearch;
    (window as any).toggleFavPanel = toggleFavPanel;
    (window as any).clearRecent = clearRecent;
    (window as any).loadMore = loadMore;
    (window as any).filterCat = filterCat;
    (window as any).toggleTTS = toggleTTS;
    (window as any).zoomIn = zoomIn;
    (window as any).zoomOut = zoomOut;
    (window as any).toggleFS = toggleFS;
    (window as any).closeReader = closeReader;

    function init() {
      get('fyear').textContent = String(new Date().getFullYear());
      buildCats();
      buildFAQ();
      bindSEOFAQ();
      updateFavCount();
      renderRecent();

      const q = new URLSearchParams(window.location.search).get('q');
      if (q) { S.query = q; get('searchInput').value = q; get('heroInput').value = q; fetchBooks(); }
      else {
        setTimeout(loadTrending, 300);
      }

      window.addEventListener('online', () => toast('Connection restored', 's'));
      window.addEventListener('offline', () => toast('You are offline', 'e'));
    }

    // Modal & input listeners
    const modal = get('readerModal');
    const onModalClick = (e: any) => { if (e.target === modal) closeReader(); };
    modal?.addEventListener('click', onModalClick);

    const onKey = (e: any) => {
      if (e.key === 'Escape' && get('readerModal').style.display !== 'none') closeReader();
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); get('searchInput').focus(); }
    };
    document.addEventListener('keydown', onKey);
    get('searchInput')?.addEventListener('keydown', (e: any) => { if (e.key === 'Enter') doSearch(); });
    get('heroInput')?.addEventListener('keydown', (e: any) => { if (e.key === 'Enter') doHeroSearch(); });

    init();

    return () => {
      modal?.removeEventListener('click', onModalClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <>
      <Head>
        <title>FreeBooks — Read Free Books Online | AI-Recommended SEO Guide</title>
        <meta name="description" content="Read millions of free public domain books online — instantly, legally, no signup. Plus a 2,000+ word AI-recommended SEO guide and complete FAQ explaining everything about modern SEO." />
        <meta name="keywords" content="free books online, public domain books, read free books, ebook reader, google books, seo guide, ai seo, ai recommended seo, technical seo, faq seo" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="FreeBooks — Read Free Books Online + AI-Recommended SEO Guide" />
        <meta property="og:description" content="Millions of public domain classics + a 2,000+ word AI-recommended SEO guide and FAQ." />
        <meta property="og:url" content="https://www.thefreeaitools.com/tools/free-books" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://www.thefreeaitools.com/tools/free-books" />
      </Head>

      {/* Original styles preserved verbatim */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --bg:#0D0D0D;
  --bg2:#161616;
  --bg3:#1F1F1F;
  --border:#2A2A2A;
  --text:#F0EDE6;
  --muted:#888;
  --gold:#C9A84C;
  --gold2:#E8C97A;
  --red:#E05252;
  --green:#4CAF7D;
  --white:#FFFFFF;
  --radius:10px;
  --font-display:'Playfair Display',Georgia,serif;
  --font-body:'DM Sans',system-ui,sans-serif;
}

html{scroll-behavior:smooth}
body{font-family:var(--font-body);background:var(--bg);color:var(--text);min-height:100vh;-webkit-font-smoothing:antialiased}

::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}

header{position:sticky;top:0;z-index:100;background:rgba(13,13,13,0.95);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 24px;}
.header-inner{max-width:1400px;margin:0 auto;display:flex;align-items:center;gap:12px;height:58px}
.logo{font-family:var(--font-display);font-size:22px;font-weight:900;color:var(--gold);letter-spacing:-0.5px;white-space:nowrap;flex-shrink:0;text-decoration:none;}
.logo span{color:var(--text)}
.search-wrap{flex:1;position:relative;max-width:600px}
.search-wrap svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none;width:16px;height:16px}
#searchInput{width:100%;padding:9px 14px 9px 38px;background:var(--bg3);border:1px solid var(--border);border-radius:8px;color:var(--text);font-family:var(--font-body);font-size:14px;outline:none;transition:border-color .15s;}
#searchInput::placeholder{color:var(--muted)}
#searchInput:focus{border-color:var(--gold)}
.btn-search{padding:9px 18px;background:var(--gold);color:#0D0D0D;border:none;border-radius:8px;font-family:var(--font-body);font-size:13px;font-weight:600;cursor:pointer;transition:background .15s,transform .1s;white-space:nowrap;flex-shrink:0;}
.btn-search:hover{background:var(--gold2)}
.btn-search:active{transform:scale(.97)}
.header-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}
.icon-btn{width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--border);border-radius:8px;color:var(--muted);cursor:pointer;transition:all .15s;position:relative;}
.icon-btn:hover{border-color:var(--gold);color:var(--gold)}
.icon-btn svg{width:16px;height:16px}
#favCount{position:absolute;top:-5px;right:-5px;background:var(--gold);color:#0D0D0D;font-size:10px;font-weight:700;border-radius:999px;min-width:16px;height:16px;display:none;align-items:center;justify-content:center;padding:0 3px;}

.hero{background:linear-gradient(160deg,#161200 0%,#0D0D0D 60%);border-bottom:1px solid var(--border);padding:64px 24px 48px;text-align:center;position:relative;overflow:hidden;}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 60% at 50% 0%,rgba(201,168,76,.12) 0%,transparent 70%);pointer-events:none;}
.hero-badge{display:inline-flex;align-items:center;gap:6px;padding:5px 14px;border-radius:999px;border:1px solid rgba(201,168,76,.3);background:rgba(201,168,76,.07);font-size:12px;color:var(--gold);font-weight:500;margin-bottom:20px;}
.hero h2{font-family:var(--font-display);font-size:clamp(38px,7vw,72px);font-weight:900;line-height:1.05;color:var(--text);margin-bottom:16px;letter-spacing:-1px;}
.hero h2 em{font-style:italic;color:var(--gold)}
.hero p{font-size:16px;color:var(--muted);max-width:500px;margin:0 auto 32px;line-height:1.6}
.hero-search-wrap{max-width:520px;margin:0 auto;display:flex;gap:8px}
.hero-search-wrap .search-wrap{max-width:none}
.hero-stats{display:flex;justify-content:center;gap:32px;margin-top:28px;flex-wrap:wrap;}
.stat{font-size:13px;color:var(--muted);display:flex;align-items:center;gap:6px}
.stat svg{width:14px;height:14px;color:var(--gold)}

.cats-wrap{background:var(--bg2);border-bottom:1px solid var(--border);overflow-x:auto;padding:10px 24px;scrollbar-width:none;}
.cats-wrap::-webkit-scrollbar{display:none}
.cats-inner{display:flex;gap:6px;max-width:1400px;margin:0 auto;width:max-content}
.cat-pill{display:inline-flex;align-items:center;gap:5px;padding:5px 14px;border-radius:999px;border:1px solid var(--border);background:transparent;color:var(--muted);font-family:var(--font-body);font-size:12px;font-weight:500;cursor:pointer;transition:all .15s;white-space:nowrap;}
.cat-pill:hover{border-color:var(--gold);color:var(--gold)}
.cat-pill.active{background:var(--gold);color:#0D0D0D;border-color:var(--gold);font-weight:600}

.main{max-width:1400px;margin:0 auto;padding:32px 24px 64px}
.sec-header{display:flex;align-items:center;gap:10px;margin-bottom:20px}
.sec-header h2{font-family:var(--font-display);font-size:22px;font-weight:700;color:var(--text)}
.sec-header svg{width:18px;height:18px;color:var(--gold)}
.sec-sub{font-size:13px;color:var(--muted);margin-left:4px}

.books-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:18px}
.books-grid.compact{grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:12px}

.book-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;display:flex;flex-direction:column;transition:transform .2s,border-color .2s,box-shadow .2s;cursor:pointer;position:relative;}
.book-card:hover{transform:translateY(-4px);border-color:rgba(201,168,76,.4);box-shadow:0 16px 40px rgba(0,0,0,.5)}
.book-cover-wrap{position:relative;overflow:hidden;background:var(--bg3)}
.book-cover-wrap img{width:100%;height:200px;object-fit:cover;display:block;transition:opacity .2s}
.book-cover-wrap img.loading{opacity:0}
.cover-placeholder{width:100%;height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:linear-gradient(145deg,#1a1a1a,#222);}
.cover-placeholder .letter{font-family:var(--font-display);font-size:52px;color:var(--gold);opacity:.4}
.cover-placeholder .lines{display:flex;flex-direction:column;gap:4px;width:70%;align-items:center}
.cover-placeholder .line{height:3px;border-radius:2px;background:var(--border)}
.cover-placeholder .line:nth-child(1){width:100%}
.cover-placeholder .line:nth-child(2){width:75%}
.cover-placeholder .line:nth-child(3){width:50%}

.badge{position:absolute;top:7px;left:7px;padding:2px 8px;border-radius:999px;font-size:10px;font-weight:700;}
.badge.free{background:var(--green);color:#fff}
.badge.preview{background:rgba(201,168,76,.9);color:#0D0D0D}

.fav-btn{position:absolute;top:7px;right:7px;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.7);border:1px solid var(--border);cursor:pointer;transition:all .15s;color:var(--muted);}
.fav-btn:hover{border-color:var(--red);color:var(--red)}
.fav-btn.active{color:var(--red);background:rgba(224,82,82,.15);border-color:var(--red)}
.fav-btn svg{width:13px;height:13px}

.book-info{padding:12px;display:flex;flex-direction:column;gap:5px;flex:1}
.book-title{font-size:13px;font-weight:600;color:var(--text);line-height:1.35;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.book-author{font-size:11px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.book-meta{display:flex;align-items:center;gap:5px;font-size:11px;color:var(--muted)}
.stars{color:#F59E0B;font-size:10px;letter-spacing:1px}
.book-actions{display:flex;gap:6px;padding:0 12px 12px;margin-top:auto}
.btn-read{flex:1;padding:7px 10px;font-size:11px;font-weight:600;background:var(--gold);color:#0D0D0D;border:none;border-radius:7px;cursor:pointer;transition:all .15s;font-family:var(--font-body);display:flex;align-items:center;justify-content:center;gap:4px;}
.btn-read:hover{background:var(--gold2)}
.btn-dl{padding:7px 10px;font-size:11px;font-weight:600;background:transparent;color:var(--muted);border:1px solid var(--border);border-radius:7px;cursor:pointer;transition:all .15s;font-family:var(--font-body);display:flex;align-items:center;justify-content:center;gap:4px;}
.btn-dl:hover:not(:disabled){border-color:var(--text);color:var(--text)}
.btn-dl:disabled{opacity:.35;cursor:not-allowed}

.skel{background:linear-gradient(90deg,var(--bg3) 25%,var(--bg2) 50%,var(--bg3) 75%);background-size:200% 100%;animation:shimmer 1.4s infinite;border-radius:4px}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
.skel-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}

.load-more-wrap{text-align:center;margin-top:32px}
.btn-more{padding:11px 32px;background:transparent;border:1px solid var(--border);color:var(--text);font-family:var(--font-body);font-size:13px;font-weight:500;border-radius:8px;cursor:pointer;transition:all .15s;display:inline-flex;align-items:center;gap:6px;}
.btn-more:hover{border-color:var(--gold);color:var(--gold)}
.btn-more:disabled{opacity:.4;cursor:not-allowed}

.section-gap{margin-top:40px}

.recent-strip{display:flex;gap:10px;overflow-x:auto;padding-bottom:4px;scrollbar-width:none}
.recent-strip::-webkit-scrollbar{display:none}
.recent-item{flex-shrink:0;width:80px;cursor:pointer;display:flex;flex-direction:column;gap:4px;}
.recent-item img{width:80px;height:110px;object-fit:cover;border-radius:6px;border:1px solid var(--border);transition:opacity .15s}
.recent-item:hover img{opacity:.75}
.recent-item p{font-size:10px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;text-align:center}

#readerModal{display:none;position:fixed;inset:0;z-index:200;background:rgba(0,0,0,.92);}
.reader-inner{display:flex;flex-direction:column;height:100%;max-width:1100px;margin:0 auto;padding:10px;}
.reader-bar{display:flex;align-items:center;gap:8px;background:var(--bg2);border:1px solid var(--border);border-radius:10px 10px 0 0;padding:8px 12px;flex-wrap:wrap;}
.reader-title{font-size:13px;font-weight:600;color:var(--text);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.reader-btns{display:flex;align-items:center;gap:4px;flex-shrink:0}
.reader-btn{width:32px;height:32px;display:flex;align-items:center;justify-content:center;background:transparent;border:1px solid var(--border);border-radius:7px;color:var(--muted);cursor:pointer;transition:all .15s;}
.reader-btn:hover{border-color:var(--gold);color:var(--gold)}
.reader-btn svg{width:14px;height:14px}
.progress-line{width:100%;height:2px;background:var(--border);border-radius:1px;order:10}
.progress-fill{height:100%;background:var(--gold);border-radius:1px;transition:width .4s;width:0%}

.reader-content{flex:1;background:var(--bg3);border:1px solid var(--border);border-top:none;border-radius:0 0 10px 10px;overflow:hidden;position:relative;}
#readerFrame{width:100%;height:100%;border:none;display:block}
#readerLoading{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;background:var(--bg3);z-index:2;}
#readerLoading .spinner{width:36px;height:36px;border:2px solid var(--border);border-top-color:var(--gold);border-radius:50%;animation:spin .7s linear infinite;}
@keyframes spin{to{transform:rotate(360deg)}}
#readerLoading p{font-size:13px;color:var(--muted)}

#readerFallback{display:none;position:absolute;inset:0;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:32px;text-align:center;background:var(--bg3);}
#readerFallback svg{width:56px;height:56px;color:var(--border)}
#readerFallback h3{font-family:var(--font-display);font-size:22px;color:var(--text)}
#readerFallback p{font-size:14px;color:var(--muted);max-width:380px;line-height:1.6}
.fallback-links{display:flex;gap:10px;flex-wrap:wrap;justify-content:center}
.fallback-link{padding:9px 20px;border-radius:8px;font-size:13px;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:all .15s;}
.fallback-link.primary{background:var(--gold);color:#0D0D0D}
.fallback-link.primary:hover{background:var(--gold2)}
.fallback-link.secondary{background:transparent;border:1px solid var(--border);color:var(--text)}
.fallback-link.secondary:hover{border-color:var(--gold);color:var(--gold)}

#favPanel{display:none;margin-top:32px}

#toasts{position:fixed;bottom:20px;right:20px;z-index:300;display:flex;flex-direction:column;gap:6px}
.toast{padding:10px 16px;border-radius:8px;font-size:13px;font-weight:500;display:flex;align-items:center;gap:8px;animation:slideUp .3s ease both;max-width:300px;box-shadow:0 8px 24px rgba(0,0,0,.5);}
@keyframes slideUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.toast.s{background:#1A3A2A;border:1px solid #2A5A3A;color:#5CDF8A}
.toast.e{background:#3A1A1A;border:1px solid #5A2A2A;color:#F08080}
.toast.i{background:var(--bg3);border:1px solid var(--border);color:var(--text)}
.toast svg{width:14px;height:14px;flex-shrink:0}

.empty{text-align:center;padding:60px 20px;grid-column:1/-1}
.empty svg{width:52px;height:52px;color:var(--border);margin:0 auto 16px}
.empty h3{font-size:18px;font-weight:600;color:var(--text);margin-bottom:8px}
.empty p{font-size:14px;color:var(--muted)}

.faq-wrap{max-width:720px;margin:0 auto}
.faq-item{border:1px solid var(--border);border-radius:var(--radius);overflow:hidden;margin-bottom:8px}
.faq-q{width:100%;text-align:left;padding:16px 20px;background:var(--bg2);border:none;cursor:pointer;font-family:var(--font-body);font-size:14px;font-weight:600;color:var(--text);display:flex;justify-content:space-between;align-items:center;gap:12px;transition:background .15s;}
.faq-q:hover{background:var(--bg3)}
.faq-q svg{width:15px;height:15px;color:var(--muted);flex-shrink:0;transition:transform .25s}
.faq-q[aria-expanded="true"] svg{transform:rotate(180deg)}
.faq-a{display:none;padding:14px 20px 18px;font-size:14px;color:var(--muted);line-height:1.7;background:var(--bg)}
.faq-a.open{display:block}

.about-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px}
.about-card{background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:22px}
.about-card svg{width:26px;height:26px;color:var(--gold);margin-bottom:12px}
.about-card h3{font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px}
.about-card p{font-size:13px;color:var(--muted);line-height:1.6}

footer{background:var(--bg2);border-top:1px solid var(--border);padding:40px 24px 24px}
.footer-inner{max-width:1400px;margin:0 auto}
.footer-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:24px;margin-bottom:28px}
.footer-col h4{font-family:var(--font-display);font-size:13px;font-weight:700;color:var(--gold);margin-bottom:10px;text-transform:uppercase;letter-spacing:.5px}
.footer-col ul{list-style:none;display:flex;flex-direction:column;gap:6px}
.footer-col li a{font-size:13px;color:var(--muted);text-decoration:none;transition:color .15s}
.footer-col li a:hover{color:var(--gold)}
.footer-bottom{border-top:1px solid var(--border);padding-top:20px;display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;align-items:center}
.footer-bottom p{font-size:12px;color:var(--muted)}
.footer-logo{font-family:var(--font-display);font-size:18px;font-weight:900;color:var(--gold)}

@media(max-width:640px){
  .hero{padding:40px 16px 32px}
  .hero h2{font-size:36px}
  .hero-stats{gap:16px}
  .main{padding:24px 16px 48px}
  .header-inner{padding:0 4px}
  .books-grid{grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
}

/* ======= ADDITIONAL SEO ARTICLE STYLES ======= */
.seo-article{max-width:880px;margin:48px auto 0;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:36px 32px;}
.seo-article h2{font-family:var(--font-display);font-size:30px;font-weight:900;color:var(--text);margin-bottom:8px;letter-spacing:-.5px}
.seo-article .lede{color:var(--muted);font-size:15px;margin-bottom:18px;line-height:1.7}
.seo-article h3{font-family:var(--font-display);font-size:20px;font-weight:700;color:var(--gold);margin:28px 0 10px}
.seo-article h4{font-size:14px;font-weight:600;color:var(--text);margin:18px 0 6px;text-transform:uppercase;letter-spacing:.04em}
.seo-article p,.seo-article li{font-size:14.5px;color:var(--text);line-height:1.75}
.seo-article ul,.seo-article ol{padding-left:22px;margin:8px 0 4px;color:var(--muted)}
.seo-article li{margin-bottom:4px}
.seo-article code{background:var(--bg3);padding:2px 6px;border-radius:4px;font-size:.88em;color:var(--gold)}
.seo-callout{background:rgba(201,168,76,.07);border-left:3px solid var(--gold);padding:12px 16px;border-radius:6px;margin:14px 0;color:var(--text);font-size:14px;}
.seo-toc{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:14px 18px;margin:14px 0 24px;font-size:13.5px}
.seo-toc h4{margin-top:0;color:var(--gold)}
.seo-toc ol{columns:2;column-gap:24px;padding-left:18px;color:var(--text)}
.seo-toc a{color:var(--text);text-decoration:none}
.seo-toc a:hover{color:var(--gold)}
@media(max-width:640px){ .seo-toc ol{columns:1} .seo-article{padding:24px 18px} }

/* SEO FAQ */
.seo-faq{max-width:880px;margin:32px auto 0;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius);padding:36px 32px;}
.seo-faq h2{font-family:var(--font-display);font-size:26px;font-weight:900;color:var(--text);margin-bottom:6px}
.seo-faq .lede{color:var(--muted);font-size:14px;margin-bottom:18px}
.seo-faq-list{display:flex;flex-direction:column;gap:8px}
.seo-faq-item{border:1px solid var(--border);border-radius:8px;overflow:hidden;background:var(--bg)}
.seo-faq-q{width:100%;text-align:left;padding:14px 18px;background:transparent;border:none;cursor:pointer;color:var(--text);font-family:var(--font-body);font-size:14px;font-weight:600;display:flex;justify-content:space-between;align-items:center}
.seo-faq-q::after{content:'+';color:var(--gold);font-size:18px;transition:transform .2s}
.seo-faq-item.open .seo-faq-q::after{transform:rotate(45deg)}
.seo-faq-a{max-height:0;overflow:hidden;transition:max-height .25s ease,padding .25s ease;padding:0 18px;color:var(--muted);font-size:13.5px;line-height:1.7}
.seo-faq-item.open .seo-faq-a{max-height:600px;padding:0 18px 14px}
        `,
        }}
      />

      {/* HEADER */}
      <header>
        <div className="header-inner">
          <a href="#" className="logo" onClick={() => (window as any).resetHome?.()}>Free<span>Books</span></a>
          <div className="search-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input id="searchInput" type="search" placeholder="Search books, authors…" autoComplete="off" />
          </div>
          <button className="btn-search" onClick={() => (window as any).doSearch?.()}>Search</button>
          <div className="header-actions">
            <button className="icon-btn" id="favToggleBtn" onClick={() => (window as any).toggleFavPanel?.()} title="My Favourites" aria-label="My Favourites">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              <span id="favCount"></span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <div className="hero" id="heroSection">
        <div className="hero-badge">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.86L12 17.77l-6.18 3.23L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
          100% Free · Public Domain · No Signup Required
        </div>
        <h2>Read Free Books<br /><em>Online</em></h2>
        <img src="/images/free-books.webp" alt="free books" width="1200" height="675" loading="lazy" decoding="async" className="w-full h-auto rounded-lg" />
        <p>Millions of public domain classics, science texts &amp; literature — instantly, legally, free.</p>
        <div className="hero-search-wrap">
          <div className="search-wrap" style={{ flex: 1 }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input id="heroInput" type="search" placeholder="e.g. Pride and Prejudice, Mark Twain…" style={{ padding: '12px 14px 12px 38px' }} />
          </div>
          <button className="btn-search" style={{ padding: '12px 22px', fontSize: 14 }} onClick={() => (window as any).doHeroSearch?.()}>Search</button>
        </div>
        <div className="hero-stats">
          <div className="stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>Millions of books</div>
          <div className="stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>Instant access</div>
          <div className="stat"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>100% Legal</div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="cats-wrap">
        <div className="cats-inner" id="catPills"></div>
      </div>

      {/* MAIN */}
      <div className="main">
        {/* RECENT */}
        <section id="recentSec" style={{ display: 'none' }} className="section-gap">
          <div className="sec-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
            <h2>Recently Viewed</h2>
            <button onClick={() => (window as any).clearRecent?.()} style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear</button>
          </div>
          <div className="recent-strip" id="recentStrip"></div>
        </section>

        {/* FAVOURITES PANEL */}
        <section id="favPanel">
          <div className="sec-header">
            <svg viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--red)' }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
            <h2>My Favourites <span id="favPanelCount" className="sec-sub"></span></h2>
            <button onClick={() => (window as any).toggleFavPanel?.()} style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Close</button>
          </div>
          <div className="books-grid" id="favGrid"></div>
          <div id="favEmpty" style={{ display: 'none', textAlign: 'center', padding: 40, color: 'var(--muted)', fontSize: 14 }}>No favourites yet. Click ♥ on any book.</div>
        </section>

        {/* RESULTS */}
        <section id="resultsSec" style={{ display: 'none' }}>
          <div className="sec-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <h2 id="resultsHeading"></h2>
            <span id="resultsCount" className="sec-sub"></span>
          </div>
          <div className="books-grid" id="resultsGrid"></div>
          <div className="load-more-wrap">
            <button className="btn-more" id="loadMoreBtn" style={{ display: 'none' }} onClick={() => (window as any).loadMore?.()}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}><polyline points="6 9 12 15 18 9" /></svg>
              Load More
            </button>
          </div>
        </section>

        {/* TRENDING */}
        <section id="trendingSec">
          <div className="sec-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
            <h2>Trending Free Classics</h2>
            <span className="sec-sub">Public domain · Ready to read</span>
          </div>
          <div className="books-grid" id="trendingGrid"></div>
        </section>

        {/* ABOUT */}
        <section className="section-gap">
          <div className="sec-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            <h2>Why FreeBooks?</h2>
          </div>
          <div className="about-grid">
            <div className="about-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <h3>100% Legal</h3>
              <p>All books come from Google Books&apos; public domain &amp; preview API. No piracy ever.</p>
            </div>
            <div className="about-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
              <h3>Instant Access</h3>
              <p>No signup, no waiting. Search and start reading any book in seconds.</p>
            </div>
            <div className="about-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
              <h3>Save Favourites</h3>
              <p>Bookmark books locally in your browser. No account needed, fully private.</p>
            </div>
            <div className="about-card">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
              <h3>Mobile Ready</h3>
              <p>Works perfectly on any device — phone, tablet or desktop, any browser.</p>
            </div>
          </div>
        </section>

        {/* ORIGINAL FAQ */}
        <section className="section-gap">
          <div className="sec-header" style={{ justifyContent: 'center' }}>
            <h2 style={{ textAlign: 'center' }}>Frequently Asked Questions</h2>
          </div>
          <div className="faq-wrap" id="faqList"></div>
        </section>

        {/* ===== ADDITIONAL: AI-RECOMMENDED SEO ARTICLE (2,000+ words) ===== */}
        <article className="seo-article" id="seo-article">
          <h2>The AI-Recommended SEO Guide: Everything About SEO in 2026</h2>
          <p className="lede">
            This 2,000+ word guide is what modern AI assistants consistently recommend when asked &quot;how do I rank
            in Google and get cited by AI?&quot; It blends classic SEO fundamentals with the new realities of
            generative search (Google AI Overviews, ChatGPT, Perplexity, Bing Copilot) and the Core Web Vitals
            era of page experience. Whether you operate a free reading site like this one, an ecommerce store, a
            SaaS product, or a personal blog, the principles below are the foundation every credible AI source
            keeps repeating.
          </p>

          <div className="seo-toc">
            <h4>What you&apos;ll learn</h4>
            <ol>
              <li><a href="#sec1">1. What SEO actually is in 2026</a></li>
              <li><a href="#sec2">2. The three pillars of SEO</a></li>
              <li><a href="#sec3">3. Keyword research the AI way</a></li>
              <li><a href="#sec4">4. On-page SEO that compounds</a></li>
              <li><a href="#sec5">5. Technical SEO checklist</a></li>
              <li><a href="#sec6">6. Core Web Vitals (LCP, INP, CLS)</a></li>
              <li><a href="#sec7">7. Structured data &amp; entities</a></li>
              <li><a href="#sec8">8. Content strategy &amp; intent</a></li>
              <li><a href="#sec9">9. E-E-A-T and trust signals</a></li>
              <li><a href="#sec10">10. Off-page SEO &amp; link building</a></li>
              <li><a href="#sec11">11. AI Overviews, SGE &amp; AEO</a></li>
              <li><a href="#sec12">12. International &amp; multilingual SEO</a></li>
              <li><a href="#sec13">13. Measurement &amp; KPIs</a></li>
              <li><a href="#sec14">14. The 12-month AI-recommended roadmap</a></li>
            </ol>
          </div>

          <h3 id="sec1">1. What SEO actually is in 2026</h3>
          <p>
            Search Engine Optimization is the discipline of designing, building, and maintaining a website so
            that real people can discover it through unpaid search results. In 2026, &quot;search&quot; no longer means
            ten blue links. It means a hybrid surface that mixes classic results, AI-generated summaries, video
            carousels, image packs, shopping cards, and conversational follow-ups. AI tools that recommend SEO
            best practices today emphasise three things above all else: <strong>helpfulness</strong> (does the
            page genuinely solve the searcher&apos;s problem?), <strong>credibility</strong> (do trusted sources and
            real experts back it up?), and <strong>experience</strong> (is the page fast, stable, accessible,
            and free of intrusive interruptions?). A page that wins on all three almost always ranks; a page
            that wins on only one rarely does.
          </p>

          <h3 id="sec2">2. The three pillars of SEO</h3>
          <h4>Pillar 1 — On-page</h4>
          <p>
            Everything you control inside an HTML document: the title tag, meta description, heading hierarchy,
            body copy, internal links, image alt text, and structured data. Because you have full editorial
            authority here, on-page is the highest-ROI lever for most teams. Small wording changes to a title
            tag can shift CTR by 20–40%.
          </p>
          <h4>Pillar 2 — Off-page</h4>
          <p>
            The sum of signals that originate outside your domain: backlinks, brand mentions, citations, social
            shares, and reviews. Off-page work is slower but far more durable; one high-quality link from a
            trusted publisher can outperform a thousand directory listings.
          </p>
          <h4>Pillar 3 — Technical</h4>
          <p>
            The plumbing: crawlability, indexability, render speed, mobile usability, structured data,
            internationalization, and security. If technical SEO is broken, no amount of great content will
            rank — crawlers literally cannot see, parse, or trust your pages.
          </p>

          <h3 id="sec3">3. Keyword research the AI way</h3>
          <p>
            Modern keyword research is no longer a spreadsheet of head terms — it is a map of <em>topics,
              intents, and sub-questions</em>. Start by asking an LLM to enumerate every question a target
            audience might have around a topic. Cluster those questions into a primary intent (informational,
            navigational, commercial, transactional) and verify search demand using Google Search Console,
            Google Trends, Ahrefs, or Semrush. Prioritise long-tail queries with clear intent: they convert
            better, attract fewer competitors, and are far more likely to be cited verbatim in AI Overviews.
          </p>

          <h3 id="sec4">4. On-page SEO that compounds</h3>
          <p>
            Treat every URL like a tiny landing page in a global competition:
          </p>
          <ul>
            <li><strong>Title tag (50–60 chars):</strong> lead with the primary keyword, then a modifier or
              year, end with brand. Example: <em>&quot;Read Free Books Online — Public Domain Library | FreeBooks.&quot;</em></li>
            <li><strong>Meta description (140–160 chars):</strong> not a ranking factor, but a CTR multiplier.
              Write it as a benefit-driven micro-pitch.</li>
            <li><strong>H1:</strong> exactly one per page, mirroring the title&apos;s intent.</li>
            <li><strong>H2/H3:</strong> chunk content into scannable sections that map to People-Also-Ask
              questions — this is exactly how AI engines extract sub-answers.</li>
            <li><strong>Internal links:</strong> link from high-authority pages to your money pages with
              descriptive anchor text.</li>
            <li><strong>Image SEO:</strong> serve modern formats (AVIF/WebP), describe with alt text, set
              explicit width/height, lazy-load below the fold.</li>
            <li><strong>URL hygiene:</strong> short, hyphenated, stable. Avoid query strings in canonicals.</li>
          </ul>

          <h3 id="sec5">5. Technical SEO checklist</h3>
          <ol>
            <li>HTTPS everywhere with HSTS preload.</li>
            <li>A valid <code>robots.txt</code> that does not accidentally block JS/CSS.</li>
            <li>An XML sitemap submitted in Google Search Console and Bing Webmaster Tools.</li>
            <li>Canonical tags on every URL — including the homepage.</li>
            <li>Pagination handled cleanly.</li>
            <li>Structured data validated with the Rich Results Test.</li>
            <li>Server response time under 200ms (TTFB) using a CDN and edge caching.</li>
            <li>JavaScript that progressively enhances rather than blocks rendering.</li>
            <li>Clean URL parameter handling for faceted navigation.</li>
            <li>Proper 404/410 status codes — no soft-404 redirects to home.</li>
          </ol>
          <div className="seo-callout">
            <strong>Pro tip:</strong> run Screaming Frog or Sitebulb monthly. Compare the crawl with your
            sitemap and your Google Search Console <em>Pages</em> report — any URL appearing in only one of
            those three is a bug.
          </div>

          <h3 id="sec6">6. Core Web Vitals (LCP, INP, CLS)</h3>
          <p>
            Core Web Vitals are Google&apos;s real-user performance metrics. They are graded against the 75th
            percentile experience of your visitors, so optimizing for the median is not enough.
          </p>
          <ul>
            <li><strong>LCP (Largest Contentful Paint):</strong> &lt; 2.5s. Driven by hero images, web fonts,
              and slow servers.</li>
            <li><strong>INP (Interaction to Next Paint):</strong> &lt; 200ms. Dominated by long JS tasks on
              the main thread.</li>
            <li><strong>CLS (Cumulative Layout Shift):</strong> &lt; 0.1. Caused by images without dimensions,
              dynamically injected ads, or late-loading fonts.</li>
          </ul>
          <p>
            For a content-heavy site like a book library, CLS is the easy win: always reserve cover image
            dimensions and never inject above-the-fold elements after first paint. INP improves dramatically
            when you defer non-critical scripts and avoid third-party tag managers on critical paths.
          </p>

          <h3 id="sec7">7. Structured data &amp; entities</h3>
          <p>
            Structured data is the contract you sign with search engines: instead of forcing them to guess,
            you hand over a typed JSON-LD object that explicitly declares entities, properties, and
            relationships. High-leverage schemas in 2026 include <code>Article</code>, <code>Product</code>,
            <code>Recipe</code>, <code>HowTo</code>, <code>FAQPage</code>, <code>BreadcrumbList</code>,
            <code>Organization</code>, <code>SoftwareApplication</code>, and <code>Book</code>. This page
            emits both an <code>Article</code> and a <code>FAQPage</code> graph so the FAQ below is eligible
            for rich result expansion.
          </p>

          <h3 id="sec8">8. Content strategy &amp; intent</h3>
          <p>
            Every query maps to one of four intents: <strong>informational</strong>, <strong>navigational</strong>,
            <strong> commercial</strong>, or <strong>transactional</strong>. A killer SEO strategy maps each
            target keyword to its dominant intent and produces the page format the SERP rewards. If the top 10
            results are tutorials, do not publish a product page; if they are comparison tables, do not publish
            a 4,000-word essay. Mirror the SERP, then exceed it. Build content in clusters: one comprehensive
            <em> pillar</em> page targets a head term, and a dozen <em>cluster</em> pages target long-tail
            variations and link upward to the pillar — concentrating internal PageRank where you want it.
          </p>

          <h3 id="sec9">9. E-E-A-T and trust signals</h3>
          <p>
            Google&apos;s quality raters use the E-E-A-T framework — Experience, Expertise, Authoritativeness,
            Trustworthiness — to grade content quality. While E-E-A-T is not a single algorithm, its
            principles are baked into many ranking systems. Demonstrate it with: real author bylines linked to
            detailed bios, citations to primary sources, transparent editorial policies, original research or
            data, customer reviews, and HTTPS plus a visible business address.
          </p>

          <h3 id="sec10">10. Off-page SEO &amp; link building</h3>
          <p>
            Backlinks remain one of the strongest ranking signals because they are hard to fake at scale.
            Modern, sustainable tactics include: digital PR (publishing data studies the press wants to cite),
            guest posting on genuinely relevant publications, broken-link building, unlinked brand mention
            reclamation, podcast tours, and creating linkable assets (calculators, generators, original data,
            free public tools — like a free reading library). Avoid link farms, paid networks, and reciprocal
            link schemes — they invite manual actions and algorithmic demotions.
          </p>

          <h3 id="sec11">11. AI Overviews, SGE &amp; Answer Engine Optimization</h3>
          <p>
            Generative answer engines (Google AI Overviews, Bing Copilot, Perplexity, ChatGPT search) are
            reshaping the first impression of search. To earn citations in these answers, write content that
            is: factually dense, structured with clear headings, supported by schema, and easy to quote in a
            single sentence. Treat the first 200 words of each section as a self-contained summary that an
            LLM could lift verbatim and attribute to you. This is the heart of <em>AEO</em> — the same SEO
            best practices, but optimized for citation rather than clicks.
          </p>

          <h3 id="sec12">12. International &amp; multilingual SEO</h3>
          <p>
            For multi-region sites, the technical foundation is <code>hreflang</code>. Every translated or
            localized URL must reference itself and every alternate (including <code>x-default</code>). Choose
            a clear URL strategy — subfolders (<code>/de/</code>), subdomains (<code>de.example.com</code>),
            or ccTLDs (<code>example.de</code>) — and stick with it. Localize beyond translation: currencies,
            units, examples, and even color symbolism matter.
          </p>

          <h3 id="sec13">13. Measurement &amp; KPIs</h3>
          <p>Instrument first, optimize second. The minimum stack is Google Search Console + Bing Webmaster
            Tools + a privacy-friendly analytics platform (GA4, Plausible, Fathom). Track these KPIs monthly:</p>
          <ul>
            <li>Indexed pages vs. crawled-but-not-indexed.</li>
            <li>Average position for the top 50 commercial keywords.</li>
            <li>Organic clicks and CTR by URL.</li>
            <li>Branded vs. non-branded share of clicks.</li>
            <li>Core Web Vitals pass rate per template.</li>
            <li>Conversion rate by landing page.</li>
            <li>AI Overview citation rate (manually sample weekly).</li>
          </ul>

          <h3 id="sec14">14. The 12-month AI-recommended roadmap</h3>
          <ul>
            <li><strong>Months 1–2:</strong> technical audit, fix crawl/index issues, baseline tracking,
              keyword research, content cluster mapping.</li>
            <li><strong>Months 3–4:</strong> publish pillar pages, redesign top templates around Core Web
              Vitals, ship structured data on every template.</li>
            <li><strong>Months 5–6:</strong> ramp content production (8–16 cluster pages/month), launch a
              digital PR campaign for at least one linkable asset.</li>
            <li><strong>Months 7–9:</strong> internationalization, programmatic SEO experiments, conversion
              rate optimization on top landing pages, formal AEO experiments (rewriting hero paragraphs into
              quote-friendly summaries).</li>
            <li><strong>Months 10–12:</strong> double down on what worked, prune or merge underperformers,
              build moats around your category (proprietary data, free tools, community).</li>
          </ul>

          <p>
            SEO rewards compounding, not heroics. A team that ships a steady cadence of well-structured,
            genuinely helpful pages — built on a fast, semantic, accessible front-end — will out-rank a team
            that sprints, stalls, and starts over every quarter. Use this free books reader as a real-world
            example: minimal CSS, lazy-loaded covers, structured data, FAQ schema, and content depth. Apply
            the same recipe to your own pages and the AI engines that increasingly mediate discovery will
            surface you confidently.
          </p>
        </article>

        {/* ===== ADDITIONAL: AI-RECOMMENDED SEO FAQ ===== */}
        <section className="seo-faq" id="seo-faq">
          <h2>SEO FAQ — Everything People Ask AI About SEO</h2>
          <p className="lede">Sixteen of the most common questions, with the answers AI assistants consistently give. Click any question to expand.</p>
          <div className="seo-faq-list">
            <div className="seo-faq-item"><button className="seo-faq-q">What is SEO and why does AI recommend it?</button>
              <div className="seo-faq-a"><p>SEO is the practice of structuring your site, content, and off-site presence so search engines (and AI engines) can find, understand, and confidently rank or cite your pages. AI tools recommend it because the same pages that rank in Google are also the ones cited in AI Overviews and chat answers.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">How long does SEO take to show results?</button>
              <div className="seo-faq-a"><p>Most websites see meaningful movement in 3–6 months and compounding gains by 12 months. New domains take longer because Google needs time to build trust; established domains with technical fixes can see lifts in weeks.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">Is SEO still worth it now that AI answers everything?</button>
              <div className="seo-faq-a"><p>Yes. Generative engines cite the same authoritative, well-structured pages that classic search ranks. Strong SEO is now also AEO (Answer Engine Optimization).</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">What are the most important on-page SEO elements?</button>
              <div className="seo-faq-a"><p>In order of impact: a clear, keyword-aligned title tag; a strong H1; well-structured H2/H3 sections matching user questions; descriptive image alt text; internal links with meaningful anchor text; and a fast, stable layout.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">How many keywords should one page target?</button>
              <div className="seo-faq-a"><p>One primary keyword and 5–15 closely related variations. Don&apos;t spread a page across unrelated topics — that creates cannibalization and dilutes relevance.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">Are backlinks still important?</button>
              <div className="seo-faq-a"><p>Yes. Backlinks remain one of Google&apos;s strongest ranking signals because they are hard to fabricate at scale. Focus on relevance and authority, not raw quantity.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">What is the difference between SEO and SEM?</button>
              <div className="seo-faq-a"><p>SEM (Search Engine Marketing) usually refers to paid search (PPC, Google Ads). SEO is the organic, unpaid side. Together they form a complete search strategy.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">Do I need a blog to rank?</button>
              <div className="seo-faq-a"><p>Not strictly, but content is the easiest way to target informational queries that build awareness and earn backlinks. E-commerce sites can also rank with category/product pages alone if the technical foundation is strong.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">What is structured data and do I need it?</button>
              <div className="seo-faq-a"><p>Structured data (JSON-LD) explicitly tells search engines what your page is about. It unlocks rich results — star ratings, FAQs, recipes, product cards — that boost CTR. Yes, you should add the schemas relevant to your content.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">What are Core Web Vitals?</button>
              <div className="seo-faq-a"><p>Three real-user performance metrics: LCP (loading speed), INP (interaction responsiveness), and CLS (visual stability). They are official ranking signals as part of Google&apos;s Page Experience system.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">Should I optimize for Google or for AI engines?</button>
              <div className="seo-faq-a"><p>Both — and the work overlaps almost completely. Clean structure, schema, helpful content, and strong authority benefit Google, Bing, ChatGPT, Perplexity, and Copilot simultaneously.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">How often should I update old content?</button>
              <div className="seo-faq-a"><p>Audit your top 20% of pages every 3–6 months. Refreshing facts, adding new sections, and improving internal links often outperforms publishing brand-new content.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">Is duplicate content a penalty?</button>
              <div className="seo-faq-a"><p>No — there is no penalty, but duplicate content forces Google to choose one version, often not the one you want. Use canonical tags and consolidate near-duplicates.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">What tools should every SEO beginner use?</button>
              <div className="seo-faq-a"><p>Free: Google Search Console, Bing Webmaster Tools, GA4, PageSpeed Insights, Schema Validator. Paid: Ahrefs or Semrush for keywords/backlinks, Screaming Frog or Sitebulb for crawls, Looker Studio for dashboards.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">How do I get cited by ChatGPT or Google AI Overviews?</button>
              <div className="seo-faq-a"><p>Be already-rankable in classic search, then make your content easy to quote: short, fact-dense paragraphs near each H2, original data, schema markup, and clear authorship. AI engines paraphrase and cite the most quotable, trustworthy passages.</p></div>
            </div>
            <div className="seo-faq-item"><button className="seo-faq-q">What are the most common SEO mistakes?</button>
              <div className="seo-faq-a"><p>Blocking JS/CSS in robots.txt, accidental noindex on important templates, thin content targeting head terms, weak internal linking, missing authors/dates, keyword cannibalization, treating SEO as a one-off project, and chasing keywords with no business value.</p></div>
            </div>
          </div>
        </section>
      </div>{/* /main */}

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-logo">FreeBooks</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 8, lineHeight: 1.6 }}>Read millions of free public domain books online. No signup. Legal sources only.</p>
            </div>
            <div className="footer-col">
              <h4>Sources</h4>
              <ul>
                <li><a href="https://books.google.com" target="_blank" rel="noopener noreferrer">Google Books</a></li>
                <li><a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer">Open Library</a></li>
                <li><a href="https://www.gutenberg.org" target="_blank" rel="noopener noreferrer">Project Gutenberg</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Categories</h4>
              <ul>
                <li><a href="#" onClick={(e) => { e.preventDefault(); (window as any).filterCat?.('fiction'); }}>Fiction</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); (window as any).filterCat?.('science'); }}>Science</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); (window as any).filterCat?.('history'); }}>History</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); (window as any).filterCat?.('philosophy'); }}>Philosophy</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>Only public domain &amp; legally free books. No copyrighted material hosted or distributed.</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; <span id="fyear"></span> FreeBooks · Powered by Google Books API</p>
            <p>Free &amp; Legal Public Domain eBooks</p>
          </div>
        </div>
      </footer>

      {/* READER MODAL */}
      <div id="readerModal" role="dialog" aria-modal="true" aria-labelledby="readerTitle">
        <div className="reader-inner">
          <div className="reader-bar">
            <span className="reader-title" id="readerTitle"></span>
            <div className="reader-btns">
              <button className="reader-btn" id="ttsBtn" onClick={() => (window as any).toggleTTS?.()} title="Text to Speech" aria-label="Text to Speech">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" /></svg>
              </button>
              <button className="reader-btn" onClick={() => (window as any).zoomOut?.()} title="Zoom out" aria-label="Zoom out">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
              </button>
              <button className="reader-btn" onClick={() => (window as any).zoomIn?.()} title="Zoom in" aria-label="Zoom in">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
              </button>
              <button className="reader-btn" onClick={() => (window as any).toggleFS?.()} title="Fullscreen" aria-label="Fullscreen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
              </button>
              <button className="reader-btn" onClick={() => (window as any).closeReader?.()} title="Close" aria-label="Close reader" style={{ borderColor: 'rgba(224,82,82,.4)', color: 'var(--red)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="progress-line"><div className="progress-fill" id="progressFill"></div></div>
          </div>
          <div className="reader-content">
            <div id="readerLoading">
              <div className="spinner"></div>
              <p id="loadingMsg">Loading book preview…</p>
            </div>
            <iframe id="readerFrame" src="about:blank" title="Book Reader"
              allow="fullscreen"
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
              referrerPolicy="no-referrer-when-downgrade"></iframe>
            <div id="readerFallback">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" /></svg>
              <h3>Preview Not Available</h3>
              <p id="fallbackMsg">This book&apos;s inline preview is restricted. Open it directly on these platforms:</p>
              <div className="fallback-links">
                <a id="gLink" href="#" target="_blank" rel="noopener noreferrer" className="fallback-link primary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  Open on Google Books
                </a>
                <a id="olLink" href="#" target="_blank" rel="noopener noreferrer" className="fallback-link secondary">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  Try Open Library
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST CONTAINER */}
      <div id="toasts"></div>
    </>
  );
}
