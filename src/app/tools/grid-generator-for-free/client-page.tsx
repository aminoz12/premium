'use client';

import { useEffect } from 'react';

export default function GridGeneratorForFree() {
  useEffect(() => {
    // ===== CSS Grid Generator (inspired by grid.layoutit.com & cssgridgenerator.io) =====
    // Original imperative DOM logic preserved verbatim inside this single-file component.

    const $ = (id: string) => document.getElementById(id) as any;

    const state: any = {
      columns: [{ value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }],
      rows: [{ value: 100, unit: 'px' }, { value: 'auto', unit: '' }, { value: 1, unit: 'fr' }],
      colGap: 10,
      rowGap: 10,
      gapUnit: 'px',
      areas: {} as Record<string, string>,
      selection: null as null | { r1: number; c1: number; r2: number; c2: number },
      isDragging: false,
      dragStart: null as null | { r: number; c: number },
      areaCounter: 1,
      theme: 'light',
    };

    const UNITS = ['fr', 'px', '%', 'em', 'rem', 'auto', 'min-content', 'max-content'];

    function clamp(n: number, min: number, max: number) {
      return Math.max(min, Math.min(max, n));
    }

    function formatTrack(t: { value: any; unit: string }) {
      if (t.unit === '' || t.unit === 'auto' || t.unit === 'min-content' || t.unit === 'max-content') {
        return String(t.value);
      }
      return `${t.value}${t.unit}`;
    }

    function getGridTemplateColumns() {
      return state.columns.map(formatTrack).join(' ');
    }

    function getGridTemplateRows() {
      return state.rows.map(formatTrack).join(' ');
    }

    function cellKey(r: number, c: number) {
      return `r${r}c${c}`;
    }

    function renderTrackInputs() {
      const colWrap = $('cols-list');
      const rowWrap = $('rows-list');
      if (colWrap) {
        colWrap.innerHTML = '';
        state.columns.forEach((col: any, i: number) => {
          const row = document.createElement('div');
          row.className = 'track-row';
          row.innerHTML = `
            <span class="track-label">Col ${i + 1}</span>
            <input type="text" class="track-value" data-axis="col" data-i="${i}" value="${col.value}" />
            <select class="track-unit" data-axis="col" data-i="${i}">
              ${UNITS.map((u) => `<option value="${u}" ${u === col.unit ? 'selected' : ''}>${u || 'keyword'}</option>`).join('')}
            </select>
            <button class="btn-icon track-del" data-axis="col" data-i="${i}" title="Remove column">&times;</button>
          `;
          colWrap.appendChild(row);
        });
      }
      if (rowWrap) {
        rowWrap.innerHTML = '';
        state.rows.forEach((rw: any, i: number) => {
          const row = document.createElement('div');
          row.className = 'track-row';
          row.innerHTML = `
            <span class="track-label">Row ${i + 1}</span>
            <input type="text" class="track-value" data-axis="row" data-i="${i}" value="${rw.value}" />
            <select class="track-unit" data-axis="row" data-i="${i}">
              ${UNITS.map((u) => `<option value="${u}" ${u === rw.unit ? 'selected' : ''}>${u || 'keyword'}</option>`).join('')}
            </select>
            <button class="btn-icon track-del" data-axis="row" data-i="${i}" title="Remove row">&times;</button>
          `;
          rowWrap.appendChild(row);
        });
      }
      bindTrackInputs();
    }

    function bindTrackInputs() {
      document.querySelectorAll('.track-value').forEach((el: any) => {
        el.addEventListener('input', (e: any) => {
          const axis = e.target.dataset.axis;
          const i = parseInt(e.target.dataset.i, 10);
          const v = e.target.value;
          const num = parseFloat(v);
          const arr = axis === 'col' ? state.columns : state.rows;
          arr[i].value = isNaN(num) ? v : num;
          renderGrid();
          renderOutput();
        });
      });
      document.querySelectorAll('.track-unit').forEach((el: any) => {
        el.addEventListener('change', (e: any) => {
          const axis = e.target.dataset.axis;
          const i = parseInt(e.target.dataset.i, 10);
          const u = e.target.value;
          const arr = axis === 'col' ? state.columns : state.rows;
          arr[i].unit = u === 'keyword' ? '' : u;
          if (u === 'auto' || u === 'min-content' || u === 'max-content') {
            arr[i].value = u;
          }
          renderTrackInputs();
          renderGrid();
          renderOutput();
        });
      });
      document.querySelectorAll('.track-del').forEach((el: any) => {
        el.addEventListener('click', (e: any) => {
          const axis = e.currentTarget.dataset.axis;
          const i = parseInt(e.currentTarget.dataset.i, 10);
          const arr = axis === 'col' ? state.columns : state.rows;
          if (arr.length <= 1) return;
          arr.splice(i, 1);
          state.areas = {};
          state.selection = null;
          renderTrackInputs();
          renderGrid();
          renderOutput();
        });
      });
    }

    function renderGrid() {
      const grid = $('grid-canvas');
      const overlay = $('grid-overlay');
      if (!grid) return;
      grid.style.gridTemplateColumns = getGridTemplateColumns();
      grid.style.gridTemplateRows = getGridTemplateRows();
      grid.style.gap = `${state.rowGap}${state.gapUnit} ${state.colGap}${state.gapUnit}`;
      grid.innerHTML = '';
      for (let r = 0; r < state.rows.length; r++) {
        for (let c = 0; c < state.columns.length; c++) {
          const cell = document.createElement('div');
          cell.className = 'grid-cell';
          cell.dataset.r = String(r);
          cell.dataset.c = String(c);
          const ak = cellKey(r, c);
          if (state.areas[ak]) {
            cell.classList.add('has-area');
            cell.style.background = state.areas[ak + ':color'] || 'var(--accent-soft)';
            cell.innerHTML = `<span class="area-name">${state.areas[ak]}</span>`;
          } else {
            cell.innerHTML = `<span class="cell-coord">${r + 1},${c + 1}</span>`;
          }
          if (
            state.selection &&
            r >= Math.min(state.selection.r1, state.selection.r2) &&
            r <= Math.max(state.selection.r1, state.selection.r2) &&
            c >= Math.min(state.selection.c1, state.selection.c2) &&
            c <= Math.max(state.selection.c1, state.selection.c2)
          ) {
            cell.classList.add('selected');
          }
          cell.addEventListener('mousedown', (e: any) => {
            state.isDragging = true;
            state.dragStart = { r, c };
            state.selection = { r1: r, c1: c, r2: r, c2: c };
            renderGrid();
            e.preventDefault();
          });
          cell.addEventListener('mouseenter', () => {
            if (state.isDragging && state.dragStart) {
              state.selection = {
                r1: state.dragStart.r,
                c1: state.dragStart.c,
                r2: r,
                c2: c,
              };
              renderGrid();
            }
          });
          cell.addEventListener('touchstart', (e: any) => {
            state.isDragging = true;
            state.dragStart = { r, c };
            state.selection = { r1: r, c1: c, r2: r, c2: c };
            renderGrid();
            e.preventDefault();
          }, { passive: false } as any);
          grid.appendChild(cell);
        }
      }
      if (overlay) overlay.style.display = 'none';
    }

    function endDrag() {
      state.isDragging = false;
      state.dragStart = null;
    }

    function makeArea() {
      if (!state.selection) {
        alert('Please drag across cells to select an area first.');
        return;
      }
      const name = prompt('Area name (e.g. header, sidebar, main, footer):', `area${state.areaCounter}`);
      if (!name) return;
      state.areaCounter++;
      const color = pastelColor(name);
      const r1 = Math.min(state.selection.r1, state.selection.r2);
      const r2 = Math.max(state.selection.r1, state.selection.r2);
      const c1 = Math.min(state.selection.c1, state.selection.c2);
      const c2 = Math.max(state.selection.c1, state.selection.c2);
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          state.areas[cellKey(r, c)] = name;
          state.areas[cellKey(r, c) + ':color'] = color;
        }
      }
      state.selection = null;
      renderGrid();
      renderOutput();
    }

    function clearAreas() {
      state.areas = {};
      state.selection = null;
      renderGrid();
      renderOutput();
    }

    function pastelColor(seed: string) {
      let h = 0;
      for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360;
      return `hsl(${h}, 65%, 82%)`;
    }

    function buildGridTemplateAreas(): string {
      const lines: string[] = [];
      for (let r = 0; r < state.rows.length; r++) {
        const tokens: string[] = [];
        for (let c = 0; c < state.columns.length; c++) {
          tokens.push(state.areas[cellKey(r, c)] || '.');
        }
        lines.push(`"${tokens.join(' ')}"`);
      }
      return lines.join('\n    ');
    }

    function renderOutput() {
      const cssEl = $('css-output');
      const htmlEl = $('html-output');
      const previewEl = $('live-preview');
      const hasAreas = Object.keys(state.areas).some((k) => !k.includes(':color'));
      const areasBlock = hasAreas ? `\n  grid-template-areas:\n    ${buildGridTemplateAreas()};` : '';
      const css = `.container {
  display: grid;
  grid-template-columns: ${getGridTemplateColumns()};
  grid-template-rows: ${getGridTemplateRows()};
  gap: ${state.rowGap}${state.gapUnit} ${state.colGap}${state.gapUnit};${areasBlock}
}`;
      const uniqueAreas = Array.from(new Set(Object.entries(state.areas).filter(([k]) => !k.includes(':color')).map(([, v]) => v)));
      const items: string[] = [];
      if (uniqueAreas.length) {
        uniqueAreas.forEach((a: any) => {
          items.push(`  <div class="item ${a}">${a}</div>`);
        });
      } else {
        const total = state.rows.length * state.columns.length;
        for (let i = 1; i <= total; i++) items.push(`  <div class="item">Item ${i}</div>`);
      }
      const html = `<div class="container">\n${items.join('\n')}\n</div>`;
      let extraCss = '';
      if (uniqueAreas.length) {
        extraCss = '\n' + uniqueAreas.map((a: any) => `.${a} { grid-area: ${a}; }`).join('\n');
      }
      if (cssEl) cssEl.textContent = css + extraCss;
      if (htmlEl) htmlEl.textContent = html;
      if (previewEl) {
        previewEl.style.gridTemplateColumns = getGridTemplateColumns();
        previewEl.style.gridTemplateRows = getGridTemplateRows();
        previewEl.style.gap = `${state.rowGap}${state.gapUnit} ${state.colGap}${state.gapUnit}`;
        if (hasAreas) {
          previewEl.style.gridTemplateAreas = buildGridTemplateAreas().replace(/\n\s*/g, ' ');
        } else {
          previewEl.style.gridTemplateAreas = '';
        }
        previewEl.innerHTML = '';
        if (uniqueAreas.length) {
          uniqueAreas.forEach((a: any) => {
            const d = document.createElement('div');
            d.className = 'preview-item';
            d.style.gridArea = a;
            d.style.background = state.areas[Object.keys(state.areas).find((k) => state.areas[k] === a && !k.includes(':color'))! + ':color'] || 'var(--accent-soft)';
            d.textContent = a;
            previewEl.appendChild(d);
          });
        } else {
          const total = state.rows.length * state.columns.length;
          for (let i = 1; i <= total; i++) {
            const d = document.createElement('div');
            d.className = 'preview-item';
            d.textContent = `Item ${i}`;
            previewEl.appendChild(d);
          }
        }
      }
    }

    function copyToClipboard(text: string, btn: any) {
      try {
        navigator.clipboard.writeText(text).then(() => {
          if (btn) {
            const old = btn.textContent;
            btn.textContent = 'Copied!';
            setTimeout(() => (btn.textContent = old), 1400);
          }
        });
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
    }

    // ===== Bind controls =====
    $('add-col')?.addEventListener('click', () => {
      if (state.columns.length >= 12) return;
      state.columns.push({ value: 1, unit: 'fr' });
      renderTrackInputs();
      renderGrid();
      renderOutput();
    });
    $('add-row')?.addEventListener('click', () => {
      if (state.rows.length >= 12) return;
      state.rows.push({ value: 1, unit: 'fr' });
      renderTrackInputs();
      renderGrid();
      renderOutput();
    });
    $('col-gap')?.addEventListener('input', (e: any) => {
      state.colGap = clamp(parseFloat(e.target.value) || 0, 0, 200);
      $('col-gap-val').textContent = state.colGap;
      renderGrid();
      renderOutput();
    });
    $('row-gap')?.addEventListener('input', (e: any) => {
      state.rowGap = clamp(parseFloat(e.target.value) || 0, 0, 200);
      $('row-gap-val').textContent = state.rowGap;
      renderGrid();
      renderOutput();
    });
    $('gap-unit')?.addEventListener('change', (e: any) => {
      state.gapUnit = e.target.value;
      renderGrid();
      renderOutput();
    });
    $('make-area')?.addEventListener('click', makeArea);
    $('clear-areas')?.addEventListener('click', clearAreas);
    $('reset-grid')?.addEventListener('click', () => {
      state.columns = [{ value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }];
      state.rows = [{ value: 100, unit: 'px' }, { value: 'auto', unit: '' }, { value: 1, unit: 'fr' }];
      state.colGap = 10;
      state.rowGap = 10;
      state.gapUnit = 'px';
      state.areas = {};
      state.selection = null;
      $('col-gap').value = 10;
      $('row-gap').value = 10;
      $('col-gap-val').textContent = '10';
      $('row-gap-val').textContent = '10';
      $('gap-unit').value = 'px';
      renderTrackInputs();
      renderGrid();
      renderOutput();
    });
    $('copy-css')?.addEventListener('click', (e: any) => copyToClipboard($('css-output').textContent, e.currentTarget));
    $('copy-html')?.addEventListener('click', (e: any) => copyToClipboard($('html-output').textContent, e.currentTarget));
    $('copy-all')?.addEventListener('click', (e: any) =>
      copyToClipboard(
        `<!-- HTML -->\n${$('html-output').textContent}\n\n<style>\n${$('css-output').textContent}\n</style>`,
        e.currentTarget,
      ),
    );

    // Presets
    document.querySelectorAll('.preset-btn').forEach((b: any) => {
      b.addEventListener('click', () => {
        const p = b.dataset.preset;
        if (p === 'holy-grail') {
          state.columns = [{ value: 200, unit: 'px' }, { value: 1, unit: 'fr' }, { value: 200, unit: 'px' }];
          state.rows = [{ value: 80, unit: 'px' }, { value: 1, unit: 'fr' }, { value: 60, unit: 'px' }];
          state.areas = {};
          // header spans top
          ['header', 'header', 'header'].forEach((n, c) => {
            state.areas[cellKey(0, c)] = n;
            state.areas[cellKey(0, c) + ':color'] = pastelColor(n);
          });
          state.areas[cellKey(1, 0)] = 'sidebar';
          state.areas[cellKey(1, 0) + ':color'] = pastelColor('sidebar');
          state.areas[cellKey(1, 1)] = 'main';
          state.areas[cellKey(1, 1) + ':color'] = pastelColor('main');
          state.areas[cellKey(1, 2)] = 'aside';
          state.areas[cellKey(1, 2) + ':color'] = pastelColor('aside');
          ['footer', 'footer', 'footer'].forEach((n, c) => {
            state.areas[cellKey(2, c)] = n;
            state.areas[cellKey(2, c) + ':color'] = pastelColor(n);
          });
        } else if (p === 'dashboard') {
          state.columns = [{ value: 240, unit: 'px' }, { value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }];
          state.rows = [{ value: 64, unit: 'px' }, { value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }];
          state.areas = {};
          for (let c = 0; c < 4; c++) {
            state.areas[cellKey(0, c)] = 'topbar';
            state.areas[cellKey(0, c) + ':color'] = pastelColor('topbar');
          }
          for (let r = 1; r < 3; r++) {
            state.areas[cellKey(r, 0)] = 'nav';
            state.areas[cellKey(r, 0) + ':color'] = pastelColor('nav');
          }
          ['kpi1', 'kpi2', 'kpi3'].forEach((n, c) => {
            state.areas[cellKey(1, c + 1)] = n;
            state.areas[cellKey(1, c + 1) + ':color'] = pastelColor(n);
          });
          for (let c = 1; c < 4; c++) {
            state.areas[cellKey(2, c)] = 'content';
            state.areas[cellKey(2, c) + ':color'] = pastelColor('content');
          }
        } else if (p === 'gallery') {
          state.columns = [{ value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }];
          state.rows = [{ value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }];
          state.areas = {};
        } else if (p === 'magazine') {
          state.columns = [{ value: 2, unit: 'fr' }, { value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }];
          state.rows = [{ value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }, { value: 1, unit: 'fr' }];
          state.areas = {};
          for (let r = 0; r < 2; r++) {
            state.areas[cellKey(r, 0)] = 'hero';
            state.areas[cellKey(r, 0) + ':color'] = pastelColor('hero');
          }
          state.areas[cellKey(0, 1)] = 'card1';
          state.areas[cellKey(0, 1) + ':color'] = pastelColor('card1');
          state.areas[cellKey(0, 2)] = 'card2';
          state.areas[cellKey(0, 2) + ':color'] = pastelColor('card2');
          state.areas[cellKey(1, 1)] = 'card3';
          state.areas[cellKey(1, 1) + ':color'] = pastelColor('card3');
          state.areas[cellKey(1, 2)] = 'card4';
          state.areas[cellKey(1, 2) + ':color'] = pastelColor('card4');
          for (let c = 0; c < 3; c++) {
            state.areas[cellKey(2, c)] = 'newsletter';
            state.areas[cellKey(2, c) + ':color'] = pastelColor('newsletter');
          }
        }
        renderTrackInputs();
        renderGrid();
        renderOutput();
      });
    });

    // Theme toggle
    const themeBtn = $('theme-toggle');
    const savedTheme = localStorage.getItem('grid-theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      state.theme = 'dark';
    }
    themeBtn?.addEventListener('click', () => {
      document.documentElement.classList.toggle('dark');
      state.theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      localStorage.setItem('grid-theme', state.theme);
    });

    // FAQ accordion
    document.querySelectorAll('.faq-q').forEach((q: any) => {
      q.addEventListener('click', () => {
        const item = q.parentElement;
        item.classList.toggle('open');
      });
    });

    // Global mouseup/touchend
    const onUp = () => endDrag();
    document.addEventListener('mouseup', onUp);
    document.addEventListener('touchend', onUp);

    // Initial render
    renderTrackInputs();
    renderGrid();
    renderOutput();

    return () => {
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <>

      <style
        dangerouslySetInnerHTML={{
          __html: `
:root {
  --bg: #f7f8fb;
  --surface: #ffffff;
  --surface-2: #f1f3f8;
  --text: #11151c;
  --text-soft: #525a6b;
  --border: #e3e7ef;
  --accent: #4f46e5;
  --accent-2: #06b6d4;
  --accent-soft: #eef2ff;
  --danger: #ef4444;
  --shadow: 0 4px 16px rgba(17,21,28,.06), 0 1px 2px rgba(17,21,28,.04);
  --radius: 12px;
}
.dark {
  --bg: #020202ff;
  --surface: #121826;
  --surface-2: #1a2233;
  --text: #e6ebf5;
  --text-soft: #97a3b8;
  --border: #243049;
  --accent: #818cf8;
  --accent-2: #22d3ee;
  --accent-soft: #000000ff;
  --shadow: 0 6px 24px rgba(0,0,0,.4);
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.gridgen-app { max-width: 1280px; margin: 0 auto; padding: 24px 20px 80px; }
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 18px; background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--radius); box-shadow: var(--shadow); margin-bottom: 24px;
}
.brand { display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 1.15rem; }
.brand-logo {
  width: 34px; height: 34px; border-radius: 8px;
  background: linear-gradient(135deg, var(--accent) 0%, var(--accent-2) 100%);
  display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 3px; padding: 5px;
}
.brand-logo span { background: rgba(255,255,255,.85); border-radius: 2px; }
.topbar-actions { display: flex; gap: 8px; }
.btn {
  padding: 9px 14px; border-radius: 9px; border: 1px solid var(--border);
  background: var(--surface-2); color: var(--text); font-weight: 600; font-size: .9rem;
  cursor: pointer; transition: all .18s ease;
}
.btn:hover { transform: translateY(-1px); box-shadow: var(--shadow); }
.btn-primary { background: var(--accent); color: #fff; border-color: transparent; }
.btn-primary:hover { background: var(--accent); filter: brightness(1.07); }
.btn-danger { color: var(--danger); }
.btn-icon {
  width: 28px; height: 28px; border-radius: 6px; border: 1px solid var(--border);
  background: var(--surface-2); color: var(--text-soft); cursor: pointer; font-size: 1rem; line-height: 1;
}
.hero {
  text-align: center; padding: 36px 18px; margin-bottom: 28px;
  background: linear-gradient(135deg, var(--accent-soft), transparent 60%);
  border-radius: var(--radius); border: 1px solid var(--border);
}
.hero h2 { font-size: clamp(1.7rem, 3.6vw, 2.6rem); margin: 0 0 10px; letter-spacing: -.02em; }
.hero p { color: var(--text-soft); max-width: 720px; margin: 0 auto; font-size: 1.02rem; }
.hero-tags { display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; margin-top: 16px; }
.hero-tag { padding: 6px 12px; background: var(--surface); border: 1px solid var(--border); border-radius: 999px; font-size: .82rem; color: var(--text-soft); }

.workspace {
  display: grid; grid-template-columns: 320px 1fr; gap: 22px;
}
@media (max-width: 960px) { .workspace { grid-template-columns: 1fr; } }
.panel {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 18px;
}
.panel h2 { margin: 0 0 12px; font-size: 1rem; letter-spacing: .02em; text-transform: uppercase; color: var(--text-soft); }
.section + .section { margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border); }
.row-flex { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 10px; }
.tracks { display: flex; flex-direction: column; gap: 8px; }
.track-row { display: grid; grid-template-columns: 56px 1fr 110px 32px; gap: 6px; align-items: center; }
.track-label { font-size: .82rem; color: var(--text-soft); }
.track-value, .track-unit, .input {
  padding: 7px 9px; border: 1px solid var(--border); border-radius: 7px; background: var(--surface-2); color: var(--text); font-size: .88rem; width: 100%;
}
.track-value:focus, .track-unit:focus, .input:focus { outline: 2px solid var(--accent); outline-offset: 1px; }
.gap-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.label-block { display: flex; flex-direction: column; gap: 6px; font-size: .82rem; color: var(--text-soft); }
.label-block input[type=range] { width: 100%; }
.preset-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.preset-btn {
  padding: 10px 8px; font-size: .82rem; border: 1px dashed var(--border); border-radius: 8px;
  background: transparent; cursor: pointer; color: var(--text); transition: all .15s ease;
}
.preset-btn:hover { background: var(--surface-2); border-style: solid; border-color: var(--accent); color: var(--accent); }

.canvas-wrap {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 18px;
}
.canvas-toolbar { display: flex; gap: 8px; margin-bottom: 14px; flex-wrap: wrap; }
.grid-canvas {
  display: grid; min-height: 360px; padding: 8px;
  background: repeating-linear-gradient(45deg, var(--surface-2) 0 6px, transparent 6px 12px);
  border: 1px dashed var(--border); border-radius: 10px; user-select: none; touch-action: none;
}
.grid-cell {
  background: var(--surface); border: 1px solid var(--border); border-radius: 6px;
  display: flex; align-items: center; justify-content: center; min-height: 56px;
  font-size: .82rem; color: var(--text-soft); cursor: crosshair; transition: background .15s, border-color .15s;
}
.grid-cell:hover { border-color: var(--accent); }
.grid-cell.selected { background: var(--accent-soft); border-color: var(--accent); color: var(--accent); }
.grid-cell.has-area { color: #1f2937; font-weight: 600; }
.area-name { padding: 2px 8px; background: rgba(255,255,255,.7); border-radius: 4px; }
.cell-coord { opacity: .55; font-variant-numeric: tabular-nums; }

.outputs { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 20px; }
@media (max-width: 860px) { .outputs { grid-template-columns: 1fr; } }
.code-block {
  background: #0f172a; color: #e2e8f0; padding: 14px 16px; border-radius: 10px;
  font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: .82rem; line-height: 1.55; overflow: auto; max-height: 280px; margin: 0;
  white-space: pre; tab-size: 2;
}
.code-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.code-head h3 { margin: 0; font-size: .9rem; color: var(--text-soft); text-transform: uppercase; letter-spacing: .05em; }

.preview-wrap { margin-top: 22px; }
.live-preview {
  display: grid; min-height: 240px; padding: 6px; background: var(--surface-2);
  border: 1px solid var(--border); border-radius: 10px;
}
.preview-item {
  background: var(--accent-soft); border: 1px solid var(--border); border-radius: 6px;
  display: flex; align-items: center; justify-content: center; min-height: 48px;
  font-size: .85rem; font-weight: 600; color: #1f2937;
}

/* SEO article */
.seo-article {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 30px 28px; margin-top: 36px;
}
.seo-article h2 { font-size: 1.7rem; margin: 0 0 6px; letter-spacing: -.01em; }
.seo-article h3 { font-size: 1.2rem; margin: 28px 0 10px; }
.seo-article h4 { font-size: 1rem; margin: 18px 0 6px; color: var(--text-soft); text-transform: uppercase; letter-spacing: .04em; }
.seo-article p, .seo-article li { color: var(--text); font-size: .98rem; }
.seo-article ul, .seo-article ol { padding-left: 22px; }
.seo-article a { color: var(--accent); }
.callout {
  background: var(--accent-soft); border-left: 4px solid var(--accent);
  padding: 12px 16px; border-radius: 8px; margin: 16px 0;
}
.toc {
  background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px;
  padding: 14px 18px; margin: 14px 0 24px;
}
.toc h4 { margin-top: 0; }
.toc ol { columns: 2; column-gap: 28px; margin: 0; }
@media (max-width: 700px) { .toc ol { columns: 1; } }

/* FAQ */
.faq-section {
  background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: 30px 28px; margin-top: 28px;
}
.faq-list { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
.faq-entry { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; background: var(--surface-2); }
.faq-q {
  width: 100%; text-align: left; padding: 14px 18px; background: transparent; border: none;
  cursor: pointer; font-weight: 600; color: var(--text); display: flex; justify-content: space-between; align-items: center; font-size: .98rem;
}
.faq-q::after { content: '+'; font-size: 1.4rem; color: var(--accent); transition: transform .2s; }
.faq-entry.open .faq-q::after { transform: rotate(45deg); }
.faq-a { max-height: 0; overflow: hidden; transition: max-height .25s ease, padding .25s ease; padding: 0 18px; color: var(--text-soft); }
.faq-entry.open .faq-a { max-height: 600px; padding: 0 18px 16px; }

footer { text-align: center; color: var(--text-soft); padding: 30px 0 0; font-size: .88rem; }
        `,
        }}
      />

      <div className="gridgen-app">
        <header className="topbar">
          <div className="brand">
            <div className="brand-logo" aria-hidden="true">
              <span /><span /><span /><span />
            </div>
            <span>GridGen — Free CSS Grid Generator</span>
          </div>
          <div className="topbar-actions">
            <button id="reset-grid" className="btn">Reset</button>
            <button id="copy-all" className="btn btn-primary">Copy HTML + CSS</button>
          </div>
        </header>

        <section className="hero">
          <h2>Free CSS Grid Generator</h2>
          <p>
            Design responsive layouts visually. Drag across cells to create <code>grid-template-areas</code>,
            tweak <code>fr</code>, <code>px</code>, and <code>%</code> tracks, fine-tune gaps, then copy
            production-ready HTML and CSS in a single click.
          </p>
          <div className="hero-tags">
            <span className="hero-tag">No sign-up</span>
            <span className="hero-tag">100% client-side</span>
            <span className="hero-tag">Areas + gaps + units</span>
            <span className="hero-tag">Dark mode</span>
            <span className="hero-tag">Mobile friendly</span>
          </div>
        </section>

        <section className="workspace">
          <aside className="panel">
            <div className="section">
              <div className="row-flex">
                <h2>Columns</h2>
                <button id="add-col" className="btn">+ Add</button>
              </div>
              <div id="cols-list" className="tracks" />
            </div>
            <div className="section">
              <div className="row-flex">
                <h2>Rows</h2>
                <button id="add-row" className="btn">+ Add</button>
              </div>
              <div id="rows-list" className="tracks" />
            </div>
            <div className="section">
              <h2>Gaps</h2>
              <div className="gap-grid">
                <label className="label-block">
                  Column gap (<span id="col-gap-val">10</span>)
                  <input id="col-gap" type="range" min="0" max="100" defaultValue={10} />
                </label>
                <label className="label-block">
                  Row gap (<span id="row-gap-val">10</span>)
                  <input id="row-gap" type="range" min="0" max="100" defaultValue={10} />
                </label>
              </div>
              <label className="label-block" style={{ marginTop: 10 }}>
                Gap unit
                <select id="gap-unit" className="input" defaultValue="px">
                  <option value="px">px</option>
                  <option value="rem">rem</option>
                  <option value="em">em</option>
                  <option value="%">%</option>
                </select>
              </label>
            </div>
            <div className="section">
              <h2>Presets</h2>
              <div className="preset-grid">
                <button className="preset-btn" data-preset="holy-grail">Holy Grail</button>
                <button className="preset-btn" data-preset="dashboard">Dashboard</button>
                <button className="preset-btn" data-preset="gallery">Gallery</button>
                <button className="preset-btn" data-preset="magazine">Magazine</button>
              </div>
            </div>
          </aside>

          <div className="canvas-wrap">
            <div className="canvas-toolbar">
              <button id="make-area" className="btn btn-primary">Create area from selection</button>
              <button id="clear-areas" className="btn btn-danger">Clear areas</button>
              <span style={{ color: 'var(--text-soft)', fontSize: '.85rem', alignSelf: 'center' }}>
                Tip: drag across cells, then click <em>Create area</em>.
              </span>
            </div>
            <div id="grid-canvas" className="grid-canvas" />
            <div id="grid-overlay" />

            <div className="outputs">
              <div>
                <div className="code-head">
                  <h3>CSS</h3>
                  <button id="copy-css" className="btn">Copy CSS</button>
                </div>
                <pre id="css-output" className="code-block">{`/* CSS will appear here */`}</pre>
              </div>
              <div>
                <div className="code-head">
                  <h3>HTML</h3>
                  <button id="copy-html" className="btn">Copy HTML</button>
                </div>
                <pre id="html-output" className="code-block">{`<!-- HTML will appear here -->`}</pre>
              </div>
            </div>

            <div className="preview-wrap">
              <div className="code-head">
                <h3>Live preview</h3>
              </div>
              <div id="live-preview" className="live-preview" />
            </div>
          </div>
        </section>

        {/* ===== SEO ARTICLE (2,000+ words) ===== */}

        {/* ===== SEO FAQ ===== */}
        <section id="seo-faq-section" className="faq-section">
          <h2>SEO FAQ — Everything People Ask</h2>
          <p style={{ color: 'var(--text-soft)' }}>
            Fifteen of the most common SEO questions, answered concisely. Click any question to expand.
          </p>
          <div className="faq-list">
            <div className="faq-entry">
              <button className="faq-q">What exactly is SEO?</button>
              <div className="faq-a">
                <p>
                  SEO (Search Engine Optimization) is the practice of structuring your website, content,
                  and off-site presence so that search engines can find, understand, and confidently rank
                  your pages for relevant queries — driving free, intent-matched traffic from Google,
                  Bing, and AI answer engines.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">How long does SEO take to show results?</button>
              <div className="faq-a">
                <p>
                  Most websites see meaningful movement in 3–6 months and compounding gains by 12 months.
                  Brand-new domains take longer because Google needs time to build trust; established
                  domains with technical fixes can see lifts in weeks.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">Is SEO still worth it in the age of AI search?</button>
              <div className="faq-a">
                <p>
                  Yes — generative engines cite the same authoritative, well-structured pages that rank
                  in classic search. Strong SEO is now also AEO (Answer Engine Optimization).
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">What are the most important on-page SEO elements?</button>
              <div className="faq-a">
                <p>
                  In order of impact: a clear, keyword-aligned title tag; a strong H1; well-structured
                  H2/H3 sections matching user questions; descriptive image alt text; internal links with
                  meaningful anchor text; and a fast, stable layout.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">Does CSS Grid affect SEO?</button>
              <div className="faq-a">
                <p>
                  Indirectly but meaningfully. A well-built grid prevents layout shift (better CLS),
                  reduces JS-driven layout work (better INP), and produces semantic, accessible HTML
                  structures — all of which improve Core Web Vitals, a confirmed ranking factor.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">How many keywords should one page target?</button>
              <div className="faq-a">
                <p>
                  One primary keyword and 5–15 closely related variations. Don&apos;t spread a page across
                  unrelated topics — that creates cannibalization and dilutes relevance.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">Are backlinks still important?</button>
              <div className="faq-a">
                <p>
                  Yes. Backlinks remain one of Google&apos;s strongest ranking signals because they are
                  hard to fabricate at scale. Focus on relevance and authority, not raw quantity.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">What is the difference between SEO and SEM?</button>
              <div className="faq-a">
                <p>
                  SEM (Search Engine Marketing) usually refers to paid search (PPC, Google Ads). SEO is
                  the organic, unpaid side. Together they form a complete search strategy.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">Do I need a blog to rank?</button>
              <div className="faq-a">
                <p>
                  Not strictly, but content (blog, guides, free tools) is the easiest way to target
                  informational queries that build awareness and earn backlinks. E-commerce sites can also
                  rank with category and product pages alone if the technical foundation is strong.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">What is structured data and do I need it?</button>
              <div className="faq-a">
                <p>
                  Structured data (JSON-LD) explicitly tells search engines what your page is about. It
                  unlocks rich results — star ratings, FAQs, recipes, product cards — that boost CTR.
                  Yes, you should add the schemas relevant to your content.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">What are Core Web Vitals?</button>
              <div className="faq-a">
                <p>
                  Three real-user performance metrics: LCP (loading speed), INP (interaction
                  responsiveness), and CLS (visual stability). They are official ranking signals as part
                  of Google&apos;s Page Experience system.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">Should I focus on Google or other search engines?</button>
              <div className="faq-a">
                <p>
                  Optimize for Google first — it owns ~90% of global search — but most SEO best practices
                  benefit Bing, DuckDuckGo, Yandex, Baidu, and AI engines simultaneously.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">How often should I update old content?</button>
              <div className="faq-a">
                <p>
                  Audit your top 20% of pages every 3–6 months. Refreshing facts, adding new sections, and
                  improving internal links often outperforms publishing brand-new content.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">Is duplicate content a penalty?</button>
              <div className="faq-a">
                <p>
                  No — there is no penalty, but duplicate content forces Google to choose one version,
                  often not the one you want. Use canonical tags and consolidate near-duplicates.
                </p>
              </div>
            </div>
            <div className="faq-entry">
              <button className="faq-q">What tools should every SEO beginner use?</button>
              <div className="faq-a">
                <p>
                  Free: Google Search Console, Bing Webmaster Tools, GA4, PageSpeed Insights, Schema
                  Validator. Paid: Ahrefs or Semrush for keywords/backlinks, Screaming Frog or Sitebulb
                  for crawls, and Looker Studio for dashboards.
                </p>
              </div>
            </div>
          </div>
        </section>

        <article id="seo-article" className="seo-article">
          <h2>The Complete SEO Guide for Modern Websites: Strategy, Tactics, and a 12-Month Roadmap</h2>
          <p>
            Search Engine Optimization (SEO) is the discipline of designing, building, and maintaining a
            website so that real people can discover it through organic search results. While the day-to-day
            work involves keywords, headings, and links, the underlying mission is much simpler: help the
            right person find the right page at the right moment, with as little friction as possible. In
            this guide we will walk through every layer of modern SEO — from the strategic mindset that
            separates winning teams from churn-and-burn agencies, to the granular technical details that
            determine whether Google can crawl, render, and trust your site. By the time you finish, you
            will have a practical playbook you can apply to a brand new project (like the CSS grid layouts
            you just designed in our generator) or a legacy enterprise platform.
          </p>

          <div className="toc">
            <h4>Table of contents</h4>
            <ol>
              <li><a href="#what-is-seo">1. What SEO actually is in 2026</a></li>
              <li><a href="#three-pillars">2. The three pillars of SEO</a></li>
              <li><a href="#on-page">3. On-page SEO that compounds</a></li>
              <li><a href="#technical">4. Technical SEO &amp; performance</a></li>
              <li><a href="#cwv">5. Core Web Vitals (and why CSS Grid helps)</a></li>
              <li><a href="#schema">6. Structured data &amp; entities</a></li>
              <li><a href="#content">7. Content strategy &amp; intent</a></li>
              <li><a href="#eeat">8. E-E-A-T and trust signals</a></li>
              <li><a href="#links">9. Off-page SEO &amp; link building</a></li>
              <li><a href="#ai">10. AI Overviews, SGE &amp; generative search</a></li>
              <li><a href="#international">11. International &amp; multilingual SEO</a></li>
              <li><a href="#measure">12. Measurement, tracking &amp; KPIs</a></li>
              <li><a href="#mistakes">13. Common SEO mistakes</a></li>
              <li><a href="#roadmap">14. A 12-month execution roadmap</a></li>
            </ol>
          </div>

          <h3 id="what-is-seo">1. What SEO actually is in 2026</h3>
          <p>
            SEO has evolved from a checklist of meta tags into a multi-disciplinary practice that sits at
            the intersection of product, content, engineering, and marketing. Modern search engines use
            machine-learning systems (BERT, MUM, RankBrain, and successors) to interpret queries
            semantically rather than literally. They evaluate documents using hundreds of weighted signals,
            but the dominant ones still cluster into three buckets: <strong>relevance</strong> (does the
            page answer the query?), <strong>authority</strong> (do credible sources vouch for it?) and{' '}
            <strong>experience</strong> (is the page fast, stable, accessible, and free of intrusive ads?).
            A page that wins on all three almost always ranks; a page that wins on only one rarely does.
          </p>

          <h3 id="three-pillars">2. The three pillars of SEO</h3>
          <h4>Pillar 1 — On-page</h4>
          <p>
            On-page SEO covers everything you control directly inside an HTML document: the title tag,
            meta description, heading hierarchy, body copy, internal links, image alt text, and structured
            data. Because you have full editorial authority here, on-page is also the highest-ROI lever for
            most teams. Small wording changes to a title tag can shift CTR by 20–40%.
          </p>
          <h4>Pillar 2 — Off-page</h4>
          <p>
            Off-page SEO is the sum of signals that originate outside your domain: backlinks, brand
            mentions, social shares, reviews, and citations from authoritative sources. Off-page work is
            slower but far more durable; a single high-quality link from a trusted publisher can outperform
            a thousand low-quality directory listings.
          </p>
          <h4>Pillar 3 — Technical</h4>
          <p>
            Technical SEO is the plumbing: crawlability, indexability, render speed, mobile usability,
            structured data, internationalization, and security. If technical SEO is broken, no amount of
            great content will rank because crawlers literally cannot see, parse, or trust your pages.
          </p>

          <h3 id="on-page">3. On-page SEO that compounds</h3>
          <p>
            Every URL on your site is a tiny landing page that Google must rank against millions of
            alternatives. To make each page competitive, treat it like a product:
          </p>
          <ul>
            <li><strong>Title tag (50–60 chars):</strong> lead with the primary keyword, follow with a
              modifier or year, end with brand. Example: <em>“Free CSS Grid Generator — Visual Builder
                &amp; Code Export | GridGen.”</em></li>
            <li><strong>Meta description (140–160 chars):</strong> not a ranking factor, but a CTR
              multiplier. Write it as a benefit-driven micro-pitch.</li>
            <li><strong>H1:</strong> exactly one per page, mirroring the title’s intent.</li>
            <li><strong>H2/H3:</strong> use them to chunk content into scannable sections that map to
              People-Also-Ask questions.</li>
            <li><strong>Internal links:</strong> link from high-authority pages to your money pages with
              descriptive anchor text.</li>
            <li><strong>Image SEO:</strong> compress (AVIF/WebP), describe with alt text, set explicit{' '}
              <code>width</code>/<code>height</code>, lazy-load below the fold.</li>
            <li><strong>URL hygiene:</strong> short, hyphenated, stable. Avoid query strings in canonical URLs.</li>
          </ul>

          <h3 id="technical">4. Technical SEO &amp; performance</h3>
          <p>
            Technical SEO ensures that crawlers can access, render, and trust your pages. The non-negotiable
            checklist looks like this:
          </p>
          <ol>
            <li>HTTPS everywhere with HSTS preload.</li>
            <li>Valid <code>robots.txt</code> that does not accidentally block JS/CSS.</li>
            <li>An XML sitemap submitted in Google Search Console and Bing Webmaster Tools.</li>
            <li>Canonical tags on every URL — including the homepage.</li>
            <li>Pagination handled cleanly (single-page if possible, otherwise distinct URLs).</li>
            <li>Structured data validated with the Rich Results Test.</li>
            <li>Server response time &lt; 200ms (TTFB) using a CDN and edge caching.</li>
            <li>JavaScript that progressively enhances rather than blocks rendering.</li>
            <li>Clean URL parameter handling for faceted navigation.</li>
            <li>A <code>404</code> strategy that returns proper status codes (no soft-404 redirects to home).</li>
          </ol>
          <div className="callout">
            <strong>Pro tip:</strong> run Screaming Frog or Sitebulb monthly. Compare the crawl with your
            sitemap and your Google Search Console <em>Pages</em> report — any URL in only one of those
            three is a bug.
          </div>

          <h3 id="cwv">5. Core Web Vitals (and why CSS Grid helps)</h3>
          <p>
            Core Web Vitals are Google&apos;s real-user performance metrics. They are graded against the
            75th-percentile experience of your visitors, so optimizing for the median is not enough.
          </p>
          <ul>
            <li><strong>LCP (Largest Contentful Paint):</strong> &lt; 2.5s. Driven by hero images, web
              fonts, and slow servers.</li>
            <li><strong>INP (Interaction to Next Paint):</strong> &lt; 200ms. Dominated by long JS tasks
              on the main thread.</li>
            <li><strong>CLS (Cumulative Layout Shift):</strong> &lt; 0.1. Caused by images without
              dimensions, dynamically injected ads, or late-loading fonts.</li>
          </ul>
          <p>
            This is exactly where CSS Grid earns its keep. Reserving space with{' '}
            <code>grid-template-rows</code> and explicit track sizing prevents reflow when content loads
            asynchronously, which directly improves CLS. Using <code>grid-template-areas</code> instead of
            deeply nested flex containers reduces JS-driven layout work and keeps INP healthy. In short:
            modern CSS layout is a Core Web Vitals tactic disguised as a design tool.
          </p>

          <h3 id="schema">6. Structured data &amp; entities</h3>
          <p>
            Structured data is the contract you sign with search engines: instead of forcing them to guess
            what your page is about, you hand over a typed JSON-LD object that explicitly declares
            entities, properties, and relationships. Common high-leverage schemas include{' '}
            <code>Article</code>, <code>Product</code>, <code>Recipe</code>, <code>HowTo</code>,{' '}
            <code>FAQPage</code>, <code>BreadcrumbList</code>, <code>Organization</code>, and{' '}
            <code>SoftwareApplication</code>. This very page emits both an <code>Article</code> and an{' '}
            <code>FAQPage</code> graph, which is why the FAQ below is eligible for rich result expansion.
          </p>

          <h3 id="content">7. Content strategy &amp; intent</h3>
          <p>
            Every query maps to one of four intents: <strong>informational</strong>, <strong>navigational</strong>,
            <strong> commercial</strong>, or <strong>transactional</strong>. A killer SEO strategy maps each
            target keyword to the intent it implies and produces the page format the SERP rewards. If the
            top 10 results are tutorials, do not publish a product page; if they are comparison tables, do
            not publish a 4,000-word essay. Mirror the SERP, then exceed it.
          </p>
          <p>
            Build content in clusters: one comprehensive <em>pillar</em> page targets a head term, and a
            dozen <em>cluster</em> pages target long-tail variations and link upward to the pillar. This
            mirrors how knowledge graphs reason about topics and concentrates internal PageRank where you
            want it.
          </p>

          <h3 id="eeat">8. E-E-A-T and trust signals</h3>
          <p>
            Google&apos;s quality raters use the E-E-A-T framework — Experience, Expertise, Authoritativeness,
            Trustworthiness — to grade content quality. While E-E-A-T is not a direct ranking algorithm,
            its principles are baked into many ranking systems. Concrete ways to demonstrate it: real
            author bylines linked to detailed bios, citations to primary sources, transparent editorial
            policies, original research or data, customer reviews, and HTTPS plus a visible business
            address.
          </p>

          <h3 id="links">9. Off-page SEO &amp; link building</h3>
          <p>
            Backlinks remain one of the strongest ranking signals because they are hard to fake at scale.
            Modern, sustainable link-building tactics include: digital PR (publishing data studies the
            press wants to cite), guest posting on genuinely relevant publications, broken-link building,
            unlinked brand mention reclamation, podcast tours, and creating linkable assets (calculators,
            generators, original data). Avoid link farms, paid networks, and reciprocal link schemes  ,
            they invite manual actions and algorithmic demotions.
          </p>

          <h3 id="ai">10. AI Overviews, SGE &amp; generative search</h3>
          <p>
            Generative answer engines (Google AI Overviews, Bing Copilot, Perplexity, ChatGPT search) are
            reshaping the first impression of search. To earn citations in these answers, write content
            that is: factually dense, structured with clear headings, supported by schema, and easy to
            quote in a single sentence. Treat the first 200 words of each section as a summary that an LLM
            could lift verbatim and attribute to you.
          </p>

          <h3 id="international">11. International &amp; multilingual SEO</h3>
          <p>
            For multi-region sites, the technical foundation is <code>hreflang</code>. Every translated or
            localized URL must reference itself and every alternate (including <code>x-default</code>).
            Choose a clear URL strategy — subfolders (<code>/de/</code>), subdomains (<code>de.example.com</code>),
            or ccTLDs (<code>example.de</code>) — and stick with it. Localize beyond translation:
            currencies, units, examples, and even color symbolism matter.
          </p>

          <h3 id="measure">12. Measurement, tracking &amp; KPIs</h3>
          <p>
            Instrument first, optimize second. The minimum stack is Google Search Console + Bing Webmaster
            Tools + a privacy-friendly analytics platform (GA4, Plausible, Fathom). Track these KPIs
            monthly:
          </p>
          <ul>
            <li>Indexed pages vs. crawled-but-not-indexed.</li>
            <li>Average position for the top 50 commercial keywords.</li>
            <li>Organic clicks and CTR by URL.</li>
            <li>Branded vs. non-branded share of clicks.</li>
            <li>Core Web Vitals pass rate per template.</li>
            <li>Conversion rate by landing page.</li>
          </ul>

          <h3 id="mistakes">13. Common SEO mistakes</h3>
          <ol>
            <li>Blocking JS or CSS in <code>robots.txt</code>, breaking rendering.</li>
            <li>Using <code>noindex</code> on important templates by accident.</li>
            <li>Targeting head terms with thin pages.</li>
            <li>Ignoring internal linking.</li>
            <li>Publishing content with no author or date.</li>
            <li>Cannibalizing your own pages with multiple near-duplicates.</li>
            <li>Treating SEO as a one-off project instead of a continuous practice.</li>
            <li>Chasing keywords with no business value.</li>
          </ol>

          <h3 id="roadmap">14. A 12-month execution roadmap</h3>
          <p>
            A realistic SEO program looks like this:
          </p>
          <ul>
            <li><strong>Months 1–2:</strong> technical audit, fix crawl/index issues, baseline tracking,
              keyword research, content cluster mapping.</li>
            <li><strong>Months 3–4:</strong> publish pillar pages, redesign top templates around Core Web
              Vitals, ship structured data.</li>
            <li><strong>Months 5–6:</strong> ramp content production (8–16 cluster pages/month), launch
              digital PR campaign for linkable assets.</li>
            <li><strong>Months 7–9:</strong> internationalization, programmatic SEO experiments,
              conversion-rate optimization on top landing pages.</li>
            <li><strong>Months 10–12:</strong> double down on what worked, prune or merge underperformers,
              build moats around your category (proprietary data, free tools like this generator,
              community).</li>
          </ul>

          <p>
            SEO rewards compounding, not heroics. A team that ships a steady cadence of well-structured,
            genuinely helpful pages — built on a fast, semantic, accessible front-end — will out-rank a
            team that sprints, stalls, and starts over every quarter. Use this generator to keep your
            layouts lean, then apply the principles above to keep your traffic graph going up and to the
            right.
          </p>
        </article>

      </div>
    </>
  );
}
