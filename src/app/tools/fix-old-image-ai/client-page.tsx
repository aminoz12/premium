'use client';
import Head from 'next/head';
import Script from 'next/script';
import { useEffect } from 'react';

export default function FixOldImageAI() {
  useEffect(() => {
    const S: {
      imageObj: HTMLImageElement | null;
      baseImageData: ImageData | null;
      originalImageData: ImageData | null;
      adjustments: Record<string, number>;
      filter: string;
      activeTool: string;
      brushSize: number; brushOpacity: number; brushColor: string;
      eraserSize: number; eraserOpacity: number;
      cloneSize: number; cloneOpacity: number; cloneSource: { x: number; y: number } | null; cloneOffset: { x: number; y: number } | null;
      textSize: number; textColor: string; textWeight: string;
      isDrawing: boolean; lastX: number; lastY: number;
      zoom: number;
      history: ImageData[]; historyIndex: number;
      beforeActive: boolean;
      textPos: { x: number; y: number } | null;
    } = {
      imageObj: null,
      baseImageData: null,
      originalImageData: null,
      adjustments: {
        brightness: 0, contrast: 0, exposure: 0, highlights: 0, shadows: 0,
        saturation: 0, vibrance: 0, hue: 0, temperature: 0, tint: 0,
        sharpen: 0, blur: 0, denoise: 0,
        vignette: 0, grain: 0
      },
      filter: 'none',
      activeTool: 'pointer',
      brushSize: 12, brushOpacity: 100, brushColor: '#ffffff',
      eraserSize: 20, eraserOpacity: 100,
      cloneSize: 20, cloneOpacity: 100, cloneSource: null, cloneOffset: null,
      textSize: 24, textColor: '#ffffff', textWeight: '700',
      isDrawing: false, lastX: 0, lastY: 0,
      zoom: 1,
      history: [], historyIndex: -1,
      beforeActive: false,
      textPos: null
    };

    const MAX_DIM = 2000;
    const SLIDER_DEFS: Record<string, { key: string; label: string; min: number; max: number }[]> = {
      light: [
        { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
        { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
        { key: 'exposure', label: 'Exposure', min: -100, max: 100 },
        { key: 'highlights', label: 'Highlights', min: -100, max: 100 },
        { key: 'shadows', label: 'Shadows', min: -100, max: 100 }
      ],
      color: [
        { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
        { key: 'vibrance', label: 'Vibrance', min: -100, max: 100 },
        { key: 'hue', label: 'Hue', min: -180, max: 180 },
        { key: 'temperature', label: 'Temperature', min: -100, max: 100 },
        { key: 'tint', label: 'Tint', min: -100, max: 100 }
      ],
      detail: [
        { key: 'sharpen', label: 'Sharpen', min: 0, max: 100 },
        { key: 'blur', label: 'Blur', min: 0, max: 100 },
        { key: 'denoise', label: 'Denoise', min: 0, max: 100 }
      ],
      effects: [
        { key: 'vignette', label: 'Vignette', min: 0, max: 100 },
        { key: 'grain', label: 'Grain', min: 0, max: 100 }
      ]
    };

    const FILTERS = [
      { id: 'none', label: 'None' }, { id: 'grayscale', label: 'Grayscale' }, { id: 'sepia', label: 'Sepia' },
      { id: 'invert', label: 'Invert' }, { id: 'vintage', label: 'Vintage' }, { id: 'cool', label: 'Cool' },
      { id: 'warm', label: 'Warm' }, { id: 'dramatic', label: 'Dramatic' }, { id: 'fade', label: 'Fade' },
      { id: 'noir', label: 'Noir' }
    ];

    let canvas = document.getElementById('editor-canvas') as HTMLCanvasElement;
    let ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    let canvasArea = document.getElementById('canvas-area') as HTMLElement;
    let uploadOverlay = document.getElementById('upload-overlay') as HTMLElement;
    let editorUI = document.getElementById('editor-ui') as HTMLElement;
    let bottomBar = document.getElementById('bottom-bar') as HTMLElement;
    let fileInput = document.getElementById('file-input') as HTMLInputElement;
    let textInput = document.getElementById('text-input') as HTMLInputElement;
    let brushCursor = document.getElementById('brush-cursor') as HTMLElement;
    let adjustBanner = document.getElementById('adjust-banner') as HTMLElement;

    buildSliders();
    buildFilterGrid();
    bindEvents();
    updateToolOptions();

    function buildSliders() {
      for (const [group, defs] of Object.entries(SLIDER_DEFS)) {
        const container = document.getElementById('sliders-' + group);
        if (!container) continue;
        defs.forEach(d => {
          const row = document.createElement('div');
          row.className = 'flex items-center gap-2';
          row.innerHTML = `
            <span class="text-[11px]  w-[72px] shrink-0 truncate">${d.label}</span>
            <input type="range" min="${d.min}" max="${d.max}" value="0" data-key="${d.key}" aria-label="${d.label}">
            <span class="text-[10px]  w-[28px] text-right mono" data-val="${d.key}">0</span>
          `;
          container.appendChild(row);
          const slider = row.querySelector('input[type="range"]') as HTMLInputElement;
          slider.addEventListener('input', () => {
            S.adjustments[d.key] = parseInt(slider.value);
            (row.querySelector('[data-val]') as HTMLElement).textContent = slider.value;
            applyAdjustments();
          });
          slider.addEventListener('dblclick', () => {
            slider.value = '0';
            S.adjustments[d.key] = 0;
            (row.querySelector('[data-val]') as HTMLElement).textContent = '0';
            applyAdjustments();
          });
        });
      }
    }

    function buildFilterGrid() {
      const grid = document.getElementById('filter-grid');
      if (!grid) return;
      FILTERS.forEach(f => {
        const div = document.createElement('div');
        div.className = `filter-thumb border border-border rounded overflow-hidden ${f.id === 'none' ? 'active' : ''}`;
        div.dataset.filter = f.id;
        div.setAttribute('role', 'button');
        div.setAttribute('aria-label', f.label + ' filter');
        div.setAttribute('tabindex', '0');
        div.innerHTML = `<canvas class="w-full block" style="aspect-ratio:4/3;background:#1a1a1a" data-filter-canvas="${f.id}"></canvas><div class="text-[10px] text-center py-1 ">${f.label}</div>`;
        div.addEventListener('click', () => selectFilter(f.id));
        div.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Enter') selectFilter(f.id); });
        grid.appendChild(div);
      });
    }

    function generateFilterPreviews() {
      if (!S.imageObj) return;
      FILTERS.forEach(f => {
        const c = document.querySelector(`[data-filter-canvas="${f.id}"]`) as HTMLCanvasElement;
        if (!c) return;
        const tw = 120, th = 90;
        c.width = tw; c.height = th;
        const tctx = c.getContext('2d') as CanvasRenderingContext2D;
        tctx.drawImage(S.imageObj!, 0, 0, tw, th);
        if (f.id !== 'none') {
          const imgData = tctx.getImageData(0, 0, tw, th);
          applyFilter(imgData.data, f.id);
          tctx.putImageData(imgData, 0, 0);
        }
      });
    }

    function bindEvents() {
      uploadOverlay.addEventListener('click', () => fileInput.click());
      uploadOverlay.addEventListener('keydown', (e: KeyboardEvent) => { if (e.key === 'Enter') fileInput.click(); });
      fileInput.addEventListener('change', (e: Event) => { const t = e.target as HTMLInputElement; if (t.files && t.files[0]) loadImage(t.files[0]); });
      uploadOverlay.addEventListener('dragover', (e: DragEvent) => { e.preventDefault(); uploadOverlay.style.outline = '2px solid #fff'; });
      uploadOverlay.addEventListener('dragleave', () => { uploadOverlay.style.outline = 'none'; });
      uploadOverlay.addEventListener('drop', (e: DragEvent) => {
        e.preventDefault(); uploadOverlay.style.outline = 'none';
        if (e.dataTransfer && e.dataTransfer.files[0]) loadImage(e.dataTransfer.files[0]);
      });

      document.querySelectorAll('[data-tool]').forEach(btn => {
        btn.addEventListener('click', () => selectTool((btn as HTMLElement).dataset.tool!));
      });

      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => switchTab((btn as HTMLElement).dataset.tab!));
      });

      document.getElementById('btn-rotate-l')!.addEventListener('click', () => rotateImage(-90));
      document.getElementById('btn-rotate-r')!.addEventListener('click', () => rotateImage(90));
      document.getElementById('btn-flip-h')!.addEventListener('click', () => flipImage('h'));
      document.getElementById('btn-flip-v')!.addEventListener('click', () => flipImage('v'));

      document.getElementById('btn-undo')!.addEventListener('click', undo);
      document.getElementById('btn-redo')!.addEventListener('click', redo);

      document.getElementById('btn-fit')!.addEventListener('click', fitToScreen);
      document.getElementById('btn-zoom-in')!.addEventListener('click', () => setZoom(S.zoom + 0.1));
      document.getElementById('btn-zoom-out')!.addEventListener('click', () => setZoom(S.zoom - 0.1));
      canvasArea.addEventListener('wheel', (e: WheelEvent) => {
        if (!S.imageObj) return;
        e.preventDefault();
        setZoom(S.zoom + (e.deltaY > 0 ? -0.05 : 0.05));
      }, { passive: false });

      const beforeBtn = document.getElementById('btn-before')!;
      beforeBtn.addEventListener('mousedown', showBefore);
      beforeBtn.addEventListener('mouseup', hideBefore);
      beforeBtn.addEventListener('mouseleave', hideBefore);
      beforeBtn.addEventListener('touchstart', (e: TouchEvent) => { e.preventDefault(); showBefore(); });
      beforeBtn.addEventListener('touchend', hideBefore);

      document.getElementById('btn-apply')!.addEventListener('click', bakeAdjustments);
      document.getElementById('btn-reset')!.addEventListener('click', resetAdjustments);
      document.getElementById('banner-apply')!.addEventListener('click', bakeAdjustments);
      document.getElementById('banner-reset')!.addEventListener('click', resetAdjustments);

      document.getElementById('preset-fix')!.addEventListener('click', () => applyPreset({
        sharpen: 45, denoise: 30, contrast: 20, saturation: 15, brightness: 5, highlights: -10, shadows: 15
      }));
      document.getElementById('preset-color')!.addEventListener('click', autoColorFix);
      document.getElementById('preset-enhance')!.addEventListener('click', () => applyPreset({
        contrast: 25, saturation: 20, vibrance: 30, sharpen: 20, highlights: -15, shadows: 20
      }));

      document.getElementById('brush-size')!.addEventListener('input', (e: Event) => {
        S.brushSize = parseInt((e.target as HTMLInputElement).value);
        document.getElementById('brush-size-val')!.textContent = S.brushSize + 'px';
      });
      document.getElementById('brush-opacity')!.addEventListener('input', (e: Event) => {
        S.brushOpacity = parseInt((e.target as HTMLInputElement).value);
        document.getElementById('brush-opacity-val')!.textContent = S.brushOpacity + '%';
      });
      document.getElementById('brush-color')!.addEventListener('input', (e: Event) => { S.brushColor = (e.target as HTMLInputElement).value; });
      document.getElementById('eraser-size')!.addEventListener('input', (e: Event) => {
        S.eraserSize = parseInt((e.target as HTMLInputElement).value);
        document.getElementById('eraser-size-val')!.textContent = S.eraserSize + 'px';
      });
      document.getElementById('eraser-opacity')!.addEventListener('input', (e: Event) => {
        S.eraserOpacity = parseInt((e.target as HTMLInputElement).value);
        document.getElementById('eraser-opacity-val')!.textContent = S.eraserOpacity + '%';
      });
      document.getElementById('clone-size')!.addEventListener('input', (e: Event) => {
        S.cloneSize = parseInt((e.target as HTMLInputElement).value);
        document.getElementById('clone-size-val')!.textContent = S.cloneSize + 'px';
      });
      document.getElementById('clone-opacity')!.addEventListener('input', (e: Event) => {
        S.cloneOpacity = parseInt((e.target as HTMLInputElement).value);
        document.getElementById('clone-opacity-val')!.textContent = S.cloneOpacity + '%';
      });
      document.getElementById('text-size')!.addEventListener('input', (e: Event) => {
        S.textSize = parseInt((e.target as HTMLInputElement).value);
        document.getElementById('text-size-val')!.textContent = S.textSize + 'px';
      });
      document.getElementById('text-color')!.addEventListener('input', (e: Event) => { S.textColor = (e.target as HTMLInputElement).value; });
      document.getElementById('text-weight')!.addEventListener('change', (e: Event) => { S.textWeight = (e.target as HTMLSelectElement).value; });

      textInput.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter') commitText();
        if (e.key === 'Escape') { textInput.classList.add('hidden'); textInput.value = ''; }
      });
      textInput.addEventListener('blur', () => { if (textInput.value.trim()) commitText(); else textInput.classList.add('hidden'); });

      document.getElementById('btn-new')!.addEventListener('click', () => {
        S.imageObj = null; S.baseImageData = null; S.originalImageData = null;
        S.history = []; S.historyIndex = -1;
        resetAdjustments();
        editorUI.classList.add('hidden');
        bottomBar.classList.add('hidden');
        uploadOverlay.classList.remove('hidden');
        fileInput.value = '';
      });

      const dlBtn = document.getElementById('btn-download')!;
      const dlDrop = document.getElementById('download-dropdown')!;
      dlBtn.addEventListener('click', (e: Event) => { e.stopPropagation(); dlDrop.classList.toggle('show'); });
      document.addEventListener('click', () => dlDrop.classList.remove('show'));
      dlDrop.querySelectorAll('[data-format]').forEach(btn => {
        btn.addEventListener('click', () => { downloadImage((btn as HTMLElement).dataset.format!); dlDrop.classList.remove('show'); });
      });

      canvas.addEventListener('mousedown', onCanvasMouseDown);
      canvas.addEventListener('mousemove', onCanvasMouseMove);
      canvas.addEventListener('mouseup', onCanvasMouseUp);
      canvas.addEventListener('mouseleave', onCanvasMouseUp);
      canvas.addEventListener('contextmenu', (e: Event) => e.preventDefault());

      canvas.addEventListener('touchstart', (e: TouchEvent) => { e.preventDefault(); onCanvasMouseDown(touchToMouse(e)); }, { passive: false });
      canvas.addEventListener('touchmove', (e: TouchEvent) => { e.preventDefault(); onCanvasMouseMove(touchToMouse(e)); }, { passive: false });
      canvas.addEventListener('touchend', () => { onCanvasMouseUp(); });

      document.addEventListener('mousemove', updateBrushCursor);
      document.addEventListener('keydown', onKeyDown);
      document.addEventListener('keyup', onKeyUp);
    }

    function touchToMouse(e: TouchEvent) {
      const t = e.touches[0] || e.changedTouches[0];
      return { clientX: t.clientX, clientY: t.clientY, altKey: false, button: 0 };
    }

    function loadImage(file: File) {
      if (!file.type.startsWith('image/')) { showToast('Please select a valid image file.'); return; }
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const img = new Image();
        img.onload = () => {
          S.imageObj = img;
          let w = img.width, h = img.height;
          if (Math.max(w, h) > MAX_DIM) {
            const scale = MAX_DIM / Math.max(w, h);
            w = Math.round(w * scale);
            h = Math.round(h * scale);
          }
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);
          S.baseImageData = ctx.getImageData(0, 0, w, h);
          S.originalImageData = new ImageData(new Uint8ClampedArray(S.baseImageData.data), w, h);
          S.history = [];
          S.historyIndex = -1;
          resetAdjustments();
          saveState();
          uploadOverlay.classList.add('hidden');
          editorUI.classList.remove('hidden');
          bottomBar.classList.remove('hidden');
          (document.getElementById('img-dimensions') as HTMLElement).textContent = w + ' x ' + h;
          fitToScreen();
          generateFilterPreviews();
          showToast('Image loaded successfully');
        };
        img.src = e.target!.result as string;
      };
      reader.readAsDataURL(file);
    }

    function setZoom(level: number) {
      S.zoom = Math.max(0.1, Math.min(5, Math.round(level * 100) / 100));
      canvas.style.width = (canvas.width * S.zoom) + 'px';
      canvas.style.height = (canvas.height * S.zoom) + 'px';
      (document.getElementById('zoom-display') as HTMLElement).textContent = Math.round(S.zoom * 100) + '%';
    }

    function fitToScreen() {
      if (!S.imageObj) return;
      const rect = canvasArea.getBoundingClientRect();
      const pad = 40;
      const sx = (rect.width - pad) / canvas.width;
      const sy = (rect.height - pad) / canvas.height;
      setZoom(Math.min(sx, sy, 1));
    }

    let adjustRAF: number | null = null;
    function applyAdjustments() {
      if (adjustRAF) cancelAnimationFrame(adjustRAF);
      adjustRAF = requestAnimationFrame(_applyAdjustments);
    }

    function _applyAdjustments() {
      if (!S.baseImageData) return;
      const w = S.baseImageData.width, h = S.baseImageData.height;
      const data = new ImageData(new Uint8ClampedArray(S.baseImageData.data), w, h);
      const d = data.data;

      const { brightness, contrast, exposure, highlights, shadows, saturation, vibrance, hue, temperature, tint, sharpen, denoise, grain } = S.adjustments;

      for (let i = 0; i < d.length; i += 4) {
        let r = d[i], g = d[i + 1], b = d[i + 2];

        if (exposure !== 0) {
          const f = Math.pow(2, exposure / 100);
          r *= f; g *= f; b *= f;
        }

        if (brightness !== 0) {
          r += brightness * 2.55; g += brightness * 2.55; b += brightness * 2.55;
        }

        if (contrast !== 0) {
          const c = (contrast / 100) * 1.5;
          const f = (259 * (c * 255 + 255)) / (255 * (259 - c * 255));
          r = f * (r - 128) + 128;
          g = f * (g - 128) + 128;
          b = f * (b - 128) + 128;
        }

        if (highlights !== 0 || shadows !== 0) {
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          if (highlights !== 0) {
            const factor = Math.max(0, (lum - 128) / 127);
            const adj = highlights * 2.55 * factor;
            r += adj; g += adj; b += adj;
          }
          if (shadows !== 0) {
            const factor = Math.max(0, (128 - lum) / 128);
            const adj = shadows * 2.55 * factor;
            r += adj; g += adj; b += adj;
          }
        }

        if (temperature !== 0) {
          const t = temperature * 0.8;
          r += t; b -= t;
        }

        if (tint !== 0) {
          const tn = tint * 0.6;
          g += tn; r -= tn * 0.3; b -= tn * 0.3;
        }

        if (saturation !== 0) {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          const s = 1 + saturation / 100;
          r = gray + s * (r - gray);
          g = gray + s * (g - gray);
          b = gray + s * (b - gray);
        }

        if (vibrance !== 0) {
          const maxC = Math.max(r, g, b);
          const minC = Math.min(r, g, b);
          const satLevel = (maxC - minC) / (maxC + 0.001);
          const amount = vibrance / 100 * (1 - satLevel);
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          r = gray + (1 + amount) * (r - gray);
          g = gray + (1 + amount) * (g - gray);
          b = gray + (1 + amount) * (b - gray);
        }

        if (hue !== 0) {
          const [h2, s2, l2] = rgbToHsl(r, g, b);
          const [r2, g2, b2] = hslToRgb((h2 + hue / 360) % 1, s2, l2);
          r = r2 * 255; g = g2 * 255; b = b2 * 255;
        }

        if (grain > 0) {
          const noise = (Math.random() - 0.5) * grain * 2.5;
          r += noise; g += noise; b += noise;
        }

        d[i] = clamp(r);
        d[i + 1] = clamp(g);
        d[i + 2] = clamp(b);
      }

      if (S.filter !== 'none') {
        applyFilter(d, S.filter);
      }

      ctx.putImageData(data, 0, 0);

      if (S.adjustments.blur > 0) {
        const radius = Math.ceil(S.adjustments.blur / 15);
        ctx.filter = 'blur(' + radius + 'px)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
      }

      if (S.adjustments.sharpen > 0) {
        applySharpen(S.adjustments.sharpen / 100);
      }

      if (S.adjustments.denoise > 0) {
        applyDenoise(S.adjustments.denoise / 100);
      }

      if (S.adjustments.vignette > 0) {
        applyVignette(S.adjustments.vignette / 100);
      }

      updateAdjustBanner();
    }

    function applyFilter(d: Uint8ClampedArray, filterId: string) {
      const len = d.length;
      switch (filterId) {
        case 'grayscale':
          for (let i = 0; i < len; i += 4) {
            const g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            d[i] = d[i + 1] = d[i + 2] = g;
          }
          break;
        case 'sepia':
          for (let i = 0; i < len; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2];
            d[i] = clamp(r * 0.393 + g * 0.769 + b * 0.189);
            d[i + 1] = clamp(r * 0.349 + g * 0.686 + b * 0.168);
            d[i + 2] = clamp(r * 0.272 + g * 0.534 + b * 0.131);
          }
          break;
        case 'invert':
          for (let i = 0; i < len; i += 4) {
            d[i] = 255 - d[i]; d[i + 1] = 255 - d[i + 1]; d[i + 2] = 255 - d[i + 2];
          }
          break;
        case 'vintage':
          for (let i = 0; i < len; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2];
            d[i] = clamp(r * 0.6 + g * 0.35 + b * 0.1 + 30);
            d[i + 1] = clamp(r * 0.2 + g * 0.6 + b * 0.15 + 15);
            d[i + 2] = clamp(r * 0.1 + g * 0.2 + b * 0.45 + 10);
          }
          break;
        case 'cool':
          for (let i = 0; i < len; i += 4) {
            d[i] = clamp(d[i] * 0.85);
            d[i + 2] = clamp(d[i + 2] * 1.2 + 15);
          }
          break;
        case 'warm':
          for (let i = 0; i < len; i += 4) {
            d[i] = clamp(d[i] * 1.15 + 10);
            d[i + 1] = clamp(d[i + 1] * 1.05);
            d[i + 2] = clamp(d[i + 2] * 0.85);
          }
          break;
        case 'dramatic':
          for (let i = 0; i < len; i += 4) {
            const c = 1.5;
            const f = (259 * (c * 255 + 255)) / (255 * (259 - c * 255));
            d[i] = clamp(f * (d[i] - 128) + 128);
            d[i + 1] = clamp(f * (d[i + 1] - 128) + 128);
            d[i + 2] = clamp(f * (d[i + 2] - 128) + 128);
            const g2 = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            d[i] = clamp(g2 * 0.3 + d[i] * 0.7);
            d[i + 1] = clamp(g2 * 0.3 + d[i + 1] * 0.7);
            d[i + 2] = clamp(g2 * 0.3 + d[i + 2] * 0.7);
          }
          break;
        case 'fade':
          for (let i = 0; i < len; i += 4) {
            d[i] = clamp(d[i] * 0.8 + 50);
            d[i + 1] = clamp(d[i + 1] * 0.8 + 45);
            d[i + 2] = clamp(d[i + 2] * 0.85 + 40);
          }
          break;
        case 'noir':
          for (let i = 0; i < len; i += 4) {
            let g = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
            g = clamp(1.4 * (g - 128) + 128);
            d[i] = d[i + 1] = d[i + 2] = g;
          }
          break;
      }
    }

    function applySharpen(strength: number) {
      if (strength <= 0) return;
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const src = new Uint8ClampedArray(imgData.data);
      const dst = imgData.data;
      const w = canvas.width, h = canvas.height;
      const s = strength;
      const kernel = [
        0, -s, 0,
        -s, 1 + 4 * s, -s,
        0, -s, 0
      ];
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          for (let c = 0; c < 3; c++) {
            let val = 0;
            for (let ky = -1; ky <= 1; ky++) {
              for (let kx = -1; kx <= 1; kx++) {
                const idx = ((y + ky) * w + (x + kx)) * 4 + c;
                val += src[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
              }
            }
            dst[(y * w + x) * 4 + c] = clamp(val);
          }
          dst[(y * w + x) * 4 + 3] = src[(y * w + x) * 4 + 3];
        }
      }
      ctx.putImageData(imgData, 0, 0);
    }

    function applyDenoise(strength: number) {
      if (strength <= 0) return;
      const radius = Math.max(1, Math.round(strength * 2));
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width; tempCanvas.height = canvas.height;
      const tctx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
      tctx.filter = 'blur(' + radius + 'px)';
      tctx.drawImage(canvas, 0, 0);
      tctx.filter = 'none';
      ctx.globalAlpha = strength * 0.6;
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.globalAlpha = 1;
    }

    function applyVignette(strength: number) {
      if (strength <= 0) return;
      const w = canvas.width, h = canvas.height;
      const cx = w / 2, cy = h / 2;
      const maxR = Math.max(Math.sqrt(cx * cx + cy * cy), 1);
      const grad = ctx.createRadialGradient(cx, cy, maxR * (0.4 - strength * 0.25), cx, cy, maxR);
      grad.addColorStop(0, 'rgba(0,0,0,0)');
      grad.addColorStop(1, 'rgba(0,0,0,' + (strength * 0.85) + ')');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    function clamp(v: number) { return Math.max(0, Math.min(255, Math.round(v))); }

    function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
      r /= 255; g /= 255; b /= 255;
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      let h = 0, s = 0;
      const l = (max + min) / 2;
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        else if (max === g) h = ((b - r) / d + 2) / 6;
        else h = ((r - g) / d + 4) / 6;
      }
      return [h, s, l];
    }

    function hslToRgb(h: number, s: number, l: number): [number, number, number] {
      let r, g, b;
      if (s === 0) { r = g = b = l; }
      else {
        const hue2rgb = (p: number, q: number, t: number) => {
          if (t < 0) t += 1; if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
      }
      return [r!, g!, b!];
    }

    function applyPreset(vals: Record<string, number>) {
      if (!S.baseImageData) { showToast('Load an image first'); return; }
      for (const k in S.adjustments) S.adjustments[k] = 0;
      S.filter = 'none';
      for (const k in vals) S.adjustments[k] = vals[k];
      document.querySelectorAll('#tab-adjust input[type="range"][data-key]').forEach(slider => {
        const key = (slider as HTMLInputElement).dataset.key!;
        if (S.adjustments[key] !== undefined) {
          (slider as HTMLInputElement).value = String(S.adjustments[key]);
          const valSpan = document.querySelector('[data-val="' + key + '"]');
          if (valSpan) valSpan.textContent = String(S.adjustments[key]);
        }
      });
      document.querySelectorAll('.filter-thumb').forEach(el => el.classList.remove('active'));
      document.querySelector('.filter-thumb[data-filter="none"]')!.classList.add('active');
      applyAdjustments();
      showToast('Preset applied');
    }

    function autoColorFix() {
      if (!S.baseImageData) { showToast('Load an image first'); return; }
      const d = S.baseImageData.data;
      let rSum = 0, gSum = 0, bSum = 0, count = 0;
      for (let i = 0; i < d.length; i += 16) {
        rSum += d[i]; gSum += d[i + 1]; bSum += d[i + 2]; count++;
      }
      const rAvg = rSum / count, gAvg = gSum / count, bAvg = bSum / count;
      const avg = (rAvg + gAvg + bAvg) / 3;
      const tempFix = Math.round((avg - rAvg + bAvg - avg) * 0.4);
      const satFix = Math.max(0, Math.round((15 - Math.abs(rAvg - gAvg) - Math.abs(gAvg - bAvg)) * 0.3));
      applyPreset({
        temperature: Math.max(-60, Math.min(60, tempFix)),
        saturation: Math.max(-20, Math.min(40, satFix)),
        contrast: 8,
        brightness: Math.round((128 - avg) * 0.1)
      });
      showToast('Auto color fix applied');
    }

    function hasAdjustments() {
      for (const k in S.adjustments) { if (S.adjustments[k] !== 0) return true; }
      return S.filter !== 'none';
    }

    function updateAdjustBanner() {
      if (hasAdjustments() && (S.activeTool === 'brush' || S.activeTool === 'eraser' || S.activeTool === 'clone' || S.activeTool === 'text')) {
        adjustBanner.classList.remove('hidden');
      } else {
        adjustBanner.classList.add('hidden');
      }
    }

    function bakeAdjustments() {
      if (!hasAdjustments()) return;
      S.baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      resetAdjustmentValues();
      saveState();
      showToast('Adjustments applied');
    }

    function resetAdjustments() {
      resetAdjustmentValues();
      if (S.baseImageData) {
        ctx.putImageData(S.baseImageData, 0, 0);
      }
    }

    function resetAdjustmentValues() {
      for (const k in S.adjustments) S.adjustments[k] = 0;
      S.filter = 'none';
      document.querySelectorAll('#tab-adjust input[type="range"][data-key]').forEach(slider => {
        (slider as HTMLInputElement).value = '0';
        const valSpan = document.querySelector('[data-val="' + (slider as HTMLInputElement).dataset.key + '"]');
        if (valSpan) valSpan.textContent = '0';
      });
      document.querySelectorAll('.filter-thumb').forEach(el => el.classList.remove('active'));
      const noneThumb = document.querySelector('.filter-thumb[data-filter="none"]');
      if (noneThumb) noneThumb.classList.add('active');
      adjustBanner.classList.add('hidden');
    }

    function selectFilter(id: string) {
      S.filter = id;
      document.querySelectorAll('.filter-thumb').forEach(el => el.classList.remove('active'));
      document.querySelector('.filter-thumb[data-filter="' + id + '"]')!.classList.add('active');
      applyAdjustments();
    }

    function selectTool(tool: string) {
      if (hasAdjustments() && tool !== 'pointer') {
        bakeAdjustments();
      }
      S.activeTool = tool;
      S.cloneSource = null;
      S.cloneOffset = null;
      document.querySelectorAll('[data-tool]').forEach(b => b.classList.remove('active'));
      document.querySelector('[data-tool="' + tool + '"]')!.classList.add('active');
      updateToolOptions();
      updateBrushCursorStyle();
      if (tool === 'text') { textInput.classList.add('hidden'); textInput.value = ''; }
      if (tool === 'clone') (document.getElementById('clone-status') as HTMLElement).textContent = 'No source set';
      updateAdjustBanner();
    }

    function updateToolOptions() {
      ['brush', 'eraser', 'clone', 'text', 'pointer'].forEach(t => {
        const el = document.getElementById('tool-options-' + t);
        if (el) el.classList.toggle('hidden', t !== S.activeTool);
      });
    }

    function rotateImage(deg: number) {
      if (!S.imageObj) return;
      if (hasAdjustments()) bakeAdjustments();
      const w = canvas.width, h = canvas.height;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = w; tempCanvas.height = h;
      (tempCanvas.getContext('2d') as CanvasRenderingContext2D).drawImage(canvas, 0, 0);

      if (Math.abs(deg) === 90) {
        canvas.width = h; canvas.height = w;
      }
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(deg * Math.PI / 180);
      ctx.drawImage(tempCanvas, -w / 2, -h / 2);
      ctx.restore();

      S.baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      saveState();
      fitToScreen();
      (document.getElementById('img-dimensions') as HTMLElement).textContent = canvas.width + ' x ' + canvas.height;
      showToast('Rotated ' + deg + ' degrees');
    }

    function flipImage(dir: string) {
      if (!S.imageObj) return;
      if (hasAdjustments()) bakeAdjustments();
      const w = canvas.width, h = canvas.height;
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = w; tempCanvas.height = h;
      (tempCanvas.getContext('2d') as CanvasRenderingContext2D).drawImage(canvas, 0, 0);

      ctx.save();
      if (dir === 'h') { ctx.translate(w, 0); ctx.scale(-1, 1); }
      else { ctx.translate(0, h); ctx.scale(1, -1); }
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.restore();

      S.baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      saveState();
      showToast('Flipped ' + (dir === 'h' ? 'horizontally' : 'vertically'));
    }

    function getCanvasCoords(e: { clientX: number; clientY: number }) {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) * (canvas.width / rect.width),
        y: (e.clientY - rect.top) * (canvas.height / rect.height)
      };
    }

    function onCanvasMouseDown(e: { clientX: number; clientY: number; altKey: boolean; button: number }) {
      if (!S.baseImageData) return;
      const pos = getCanvasCoords(e);

      if (S.activeTool === 'clone' && e.altKey) {
        S.cloneSource = { x: pos.x, y: pos.y };
        S.cloneOffset = null;
        (document.getElementById('clone-status') as HTMLElement).textContent = 'Source set at (' + Math.round(pos.x) + ', ' + Math.round(pos.y) + ')';
        return;
      }

      if (S.activeTool === 'text') {
        const rect = canvas.getBoundingClientRect();
        textInput.style.left = (rect.left + pos.x * (rect.width / canvas.width)) + 'px';
        textInput.style.top = (rect.top + pos.y * (rect.height / canvas.height) - S.textSize * S.zoom * 0.5) + 'px';
        textInput.style.fontSize = (S.textSize * S.zoom) + 'px';
        textInput.style.color = S.textColor;
        textInput.style.fontWeight = S.textWeight;
        textInput.classList.remove('hidden');
        textInput.value = '';
        textInput.focus();
        S.textPos = pos;
        return;
      }

      if (S.activeTool !== 'brush' && S.activeTool !== 'eraser' && S.activeTool !== 'clone') return;

      S.isDrawing = true;
      S.lastX = pos.x;
      S.lastY = pos.y;

      if (S.activeTool === 'clone' && S.cloneSource && !S.cloneOffset) {
        S.cloneOffset = { x: pos.x - S.cloneSource.x, y: pos.y - S.cloneSource.y };
      }

      drawStroke(pos.x, pos.y, pos.x, pos.y);
    }

    function onCanvasMouseMove(e: { clientX: number; clientY: number; altKey?: boolean; button?: number }) {
      if (!S.isDrawing) return;
      const pos = getCanvasCoords(e);
      drawStroke(S.lastX, S.lastY, pos.x, pos.y);
      S.lastX = pos.x;
      S.lastY = pos.y;
    }

    function onCanvasMouseUp() {
      if (S.isDrawing) {
        S.isDrawing = false;
        S.baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        saveState();
      }
    }

    function drawStroke(x1: number, y1: number, x2: number, y2: number) {
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (S.activeTool === 'brush') {
        ctx.globalAlpha = S.brushOpacity / 100;
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = S.brushColor;
        ctx.lineWidth = S.brushSize;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      else if (S.activeTool === 'eraser') {
        ctx.globalAlpha = S.eraserOpacity / 100;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.strokeStyle = 'rgba(0,0,0,1)';
        ctx.lineWidth = S.eraserSize;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      else if (S.activeTool === 'clone') {
        if (!S.cloneSource || !S.cloneOffset) {
          ctx.restore();
          return;
        }
        ctx.globalAlpha = S.cloneOpacity / 100;
        ctx.globalCompositeOperation = 'source-over';
        const srcX = x2 - S.cloneOffset.x;
        const srcY = y2 - S.cloneOffset.y;
        const r = Math.max(1, Math.round(S.cloneSize / 2));
        ctx.beginPath();
        ctx.arc(x2, y2, r, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(canvas, srcX - r, srcY - r, r * 2, r * 2, x2 - r, y2 - r, r * 2, r * 2);
      }

      ctx.restore();
    }

    function commitText() {
      const text = textInput.value.trim();
      if (!text || !S.textPos) { textInput.classList.add('hidden'); return; }
      ctx.save();
      ctx.font = S.textWeight + ' ' + S.textSize + 'px "Space Grotesk", sans-serif';
      ctx.fillStyle = S.textColor;
      ctx.textBaseline = 'middle';
      ctx.fillText(text, S.textPos.x, S.textPos.y);
      ctx.restore();
      textInput.classList.add('hidden');
      textInput.value = '';
      S.baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      saveState();
      showToast('Text added');
    }

    function updateBrushCursor(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const inCanvas = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (inCanvas && (S.activeTool === 'brush' || S.activeTool === 'eraser' || S.activeTool === 'clone')) {
        brushCursor.style.display = 'block';
        brushCursor.style.left = e.clientX + 'px';
        brushCursor.style.top = e.clientY + 'px';
      } else {
        brushCursor.style.display = 'none';
      }
    }

    function updateBrushCursorStyle() {
      let size = 0;
      if (S.activeTool === 'brush') size = S.brushSize * S.zoom;
      else if (S.activeTool === 'eraser') size = S.eraserSize * S.zoom;
      else if (S.activeTool === 'clone') size = S.cloneSize * S.zoom;
      brushCursor.style.width = size + 'px';
      brushCursor.style.height = size + 'px';
      if (S.activeTool === 'eraser') {
        brushCursor.style.borderColor = 'rgba(255,255,255,0.5)';
        brushCursor.style.background = 'rgba(255,255,255,0.1)';
      } else {
        brushCursor.style.borderColor = 'rgba(255,255,255,0.6)';
        brushCursor.style.background = 'none';
      }
    }

    document.addEventListener('input', (e: Event) => {
      const t = e.target as HTMLElement;
      if (t.id === 'brush-size' || t.id === 'eraser-size' || t.id === 'clone-size') {
        updateBrushCursorStyle();
      }
    });

    function saveState() {
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      if (S.historyIndex < S.history.length - 1) {
        S.history = S.history.slice(0, S.historyIndex + 1);
      }
      S.history.push(data);
      if (S.history.length > 40) S.history.shift();
      S.historyIndex = S.history.length - 1;
      updateHistoryButtons();
    }

    function undo() {
      if (S.historyIndex <= 0) return;
      S.historyIndex--;
      ctx.putImageData(S.history[S.historyIndex], 0, 0);
      S.baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      updateHistoryButtons();
    }

    function redo() {
      if (S.historyIndex >= S.history.length - 1) return;
      S.historyIndex++;
      ctx.putImageData(S.history[S.historyIndex], 0, 0);
      S.baseImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      updateHistoryButtons();
    }

    function updateHistoryButtons() {
      (document.getElementById('btn-undo') as HTMLButtonElement).disabled = S.historyIndex <= 0;
      (document.getElementById('btn-redo') as HTMLButtonElement).disabled = S.historyIndex >= S.history.length - 1;
    }

    function showBefore() {
      if (!S.originalImageData) return;
      if (hasAdjustments()) {
        S.beforeActive = true;
        ctx.putImageData(S.originalImageData, 0, 0);
      }
    }

    function hideBefore() {
      if (S.beforeActive) {
        S.beforeActive = false;
        applyAdjustments();
      }
    }

    function downloadImage(format: string) {
      if (!S.baseImageData) { showToast('No image to download'); return; }
      if (hasAdjustments()) bakeAdjustments();

      const link = document.createElement('a');
      const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
      const quality = format === 'png' ? undefined : 0.92;

      if (format === 'jpeg') {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tctx = tempCanvas.getContext('2d') as CanvasRenderingContext2D;
        tctx.fillStyle = '#ffffff';
        tctx.fillRect(0, 0, canvas.width, canvas.height);
        tctx.drawImage(canvas, 0, 0);
        link.href = tempCanvas.toDataURL(mimeType, quality);
      } else {
        link.href = canvas.toDataURL(mimeType, quality);
      }

      link.download = 'thefreeaitools-edited.' + (format === 'jpeg' ? 'jpg' : format);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast('Image downloaded as ' + format.toUpperCase());
    }

    function onKeyDown(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA' || (e.target as HTMLElement).tagName === 'SELECT') return;
      const key = e.key.toLowerCase();

      if ((e.ctrlKey || e.metaKey) && key === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
      if ((e.ctrlKey || e.metaKey) && key === 's') { e.preventDefault(); (document.getElementById('btn-download') as HTMLElement).click(); return; }
      if ((e.ctrlKey || e.metaKey) && key === '0') { e.preventDefault(); fitToScreen(); return; }
      if ((e.ctrlKey || e.metaKey) && key === '=') { e.preventDefault(); setZoom(S.zoom + 0.1); return; }
      if ((e.ctrlKey || e.metaKey) && key === '-') { e.preventDefault(); setZoom(S.zoom - 0.1); return; }

      switch (key) {
        case 'v': selectTool('pointer'); break;
        case 'b': selectTool('brush'); break;
        case 'e': selectTool('eraser'); break;
        case 's': if (!e.ctrlKey && !e.metaKey) selectTool('clone'); break;
        case 't': selectTool('text'); break;
        case '[':
          if (S.activeTool === 'brush') { S.brushSize = Math.max(1, S.brushSize - 3); (document.getElementById('brush-size') as HTMLInputElement).value = String(S.brushSize); (document.getElementById('brush-size-val') as HTMLElement).textContent = S.brushSize + 'px'; updateBrushCursorStyle(); }
          if (S.activeTool === 'eraser') { S.eraserSize = Math.max(1, S.eraserSize - 3); (document.getElementById('eraser-size') as HTMLInputElement).value = String(S.eraserSize); (document.getElementById('eraser-size-val') as HTMLElement).textContent = S.eraserSize + 'px'; updateBrushCursorStyle(); }
          if (S.activeTool === 'clone') { S.cloneSize = Math.max(1, S.cloneSize - 3); (document.getElementById('clone-size') as HTMLInputElement).value = String(S.cloneSize); (document.getElementById('clone-size-val') as HTMLElement).textContent = S.cloneSize + 'px'; updateBrushCursorStyle(); }
          break;
        case ']':
          if (S.activeTool === 'brush') { S.brushSize = Math.min(100, S.brushSize + 3); (document.getElementById('brush-size') as HTMLInputElement).value = String(S.brushSize); (document.getElementById('brush-size-val') as HTMLElement).textContent = S.brushSize + 'px'; updateBrushCursorStyle(); }
          if (S.activeTool === 'eraser') { S.eraserSize = Math.min(100, S.eraserSize + 3); (document.getElementById('eraser-size') as HTMLInputElement).value = String(S.eraserSize); (document.getElementById('eraser-size-val') as HTMLElement).textContent = S.eraserSize + 'px'; updateBrushCursorStyle(); }
          if (S.activeTool === 'clone') { S.cloneSize = Math.min(100, S.cloneSize + 3); (document.getElementById('clone-size') as HTMLInputElement).value = String(S.cloneSize); (document.getElementById('clone-size-val') as HTMLElement).textContent = S.cloneSize + 'px'; updateBrushCursorStyle(); }
          break;
        case '0': if (!e.ctrlKey && !e.metaKey) fitToScreen(); break;
        case '+': case '=': setZoom(S.zoom + 0.1); break;
        case '-': setZoom(S.zoom - 0.1); break;
      }
    }

    function onKeyUp(_e: KeyboardEvent) { }

    function switchTab(tab: string) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.tab-btn[data-tab="' + tab + '"]')!.classList.add('active');
      document.querySelectorAll('#right-panel > [id^="tab-"]').forEach(el => el.classList.add('hidden'));
      const tabEl = document.getElementById('tab-' + tab)!;
      tabEl.classList.remove('hidden');
      tabEl.classList.remove('fade-in');
      void tabEl.offsetWidth;
      tabEl.classList.add('fade-in');
    }

    function showToast(msg: string) {
      const container = document.getElementById('toast-container')!;
      const toast = document.createElement('div');
      toast.className = 'toast-msg bg-white text-black text-xs font-medium px-4 py-2 rounded shadow-lg';
      toast.textContent = msg;
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      container.appendChild(toast);
      setTimeout(() => { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 3000);
    }

    window.addEventListener('resize', () => {
      if (S.imageObj) fitToScreen();
    });

    document.addEventListener('paste', (e: ClipboardEvent) => {
      const items = e.clipboardData && e.clipboardData.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) loadImage(file);
          break;
        }
      }
    });
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>thefreeaitools – Free Online Image Editor | Fix Photos, Remove Objects &amp; Color Correction</title>
        <meta name="description" content="Free online image editor to fix old photos, remove objects, correct colors, and enhance images like Photoshop. No signup, no download required. Edit directly in your browser." />
        <meta name="keywords" content="online image editor, fix old photos, remove objects from photos, color correction, photo enhancer, free photo editor, Photoshop alternative, image repair, restore photos, edit pictures online, denoise image, sharpen photo, clone stamp tool" />
        <meta name="author" content="thefreeaitools" />
        <meta name="bingbot" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="3 days" />
        <meta name="rating" content="General" />
        <meta name="distribution" content="global" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.thefreeaitools.com/tools/fix-old-image-ai" />
        <meta property="og:title" content="thefreeaitools – Free Online Image Editor | Fix, Enhance & Edit Photos" />
        <meta property="og:description" content="Fix old photos, remove objects, correct colors and enhance images directly in your browser. No signup needed." />
        <meta property="og:site_name" content="thefreeaitools" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="thefreeaitools – Free Online Image Editor" />
        <meta name="twitter:description" content="Fix old photos, remove objects, correct colors and enhance images. Free, no signup." />
        <meta name="theme-color" content="#000000" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `

input[type="range"]{-webkit-appearance:none;appearance:none;background:transparent;width:100%;height:18px;cursor:pointer}
input[type="range"]::-webkit-slider-track{height:2px;background:#2a2a2a;border-radius:1px}
input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:10px;background:#fff;border-radius:50%;margin-top:-4px}
input[type="range"]::-moz-range-track{height:2px;background:#2a2a2a;border-radius:1px;border:none}
input[type="range"]::-moz-range-thumb{width:10px;height:10px;background:#fff;border-radius:50%;border:none}
.checkerboard{background-image:linear-gradient(45deg,#151515 25%,transparent 25%),linear-gradient(-45deg,#151515 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#151515 75%),linear-gradient(-45deg,transparent 75%,#151515 75%);background-size:16px 16px;background-position:0 0,0 8px,8px -8px,-8px 0;background-color:#1a1a1a}
.tool-btn{transition:all .15s ease}.tool-btn:hover{background:#222}.tool-btn.active{background:#fff;color:#000}
.tab-btn{transition:all .15s ease;border-bottom:2px solid transparent}.tab-btn:hover{color:#fff}.tab-btn.active{color:#fff;border-color:#fff}
.filter-thumb{transition:all .15s ease;cursor:pointer}.filter-thumb:hover{border-color:#888}.filter-thumb.active{border-color:#fff;box-shadow:0 0 0 1px #fff}
.toast-msg{animation:toastIn .3s ease,toastOut .3s ease 2.5s forwards}
@keyframes toastIn{from{transform:translateY(16px);opacity:0}to{transform:translateY(0);opacity:1}}
@keyframes toastOut{from{opacity:1}to{opacity:0;pointer-events:none}}
.preset-btn{transition:all .15s ease}.preset-btn:hover{background:#fff!important;color:#000!important}
#brush-cursor{pointer-events:none;position:fixed;border:1px solid rgba(255,255,255,.6);border-radius:50%;transform:translate(-50%,-50%);z-index:9999;display:none}
.dropdown{display:none}.dropdown.show{display:block}
.fade-in{animation:fadeIn .25s ease}@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;transition-duration:.01ms!important}}
        `}} />
        <link rel="canonical" href="https://www.thefreeaitools.com/tools/fix-old-image" />
        <meta name="robots" content="index,follow" />
        <meta name="googlebot" content="index,follow" />
      </Head>

      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

      {/* Brush cursor overlay */}
      <div id="brush-cursor"></div>
      {/* Toast container */}
      <div id="toast-container" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] flex flex-col items-center gap-2"></div>


      <main>
        {/* HERO SEO SECTION */}
        <section className="px-4 pt-12 pb-8 max-w-3xl mx-auto text-center" aria-labelledby="hero-heading">
          <h2 id="hero-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-4">Free Online Image Editor — Fix Photos, Remove Objects, Correct Colors</h2>
          <p className=" text-base sm:text-lg leading-relaxed mb-6 max-w-2xl mx-auto">Restore old photographs, remove unwanted objects, fix colors like Photoshop, sharpen blurry images, and enhance any photo directly in your browser. No upload to servers, no signup, no watermarks.</p>
          <a href="#editor" className="inline-block bg-white text-black font-semibold px-6 py-3 rounded text-sm hover:bg-neutral-200 transition-colors">Open Editor</a>
        </section>

        {/* EDITOR SECTION */}
        <section id="editor" className="px-2 sm:px-4 pb-4" aria-labelledby="editor-heading">
          <h2 id="editor-heading" className="sr-only">Image Editor</h2>
          <div className="max-w-[1800px] mx-auto border border-border rounded-lg overflow-hidden bg-surface relative" style={{ minHeight: '520px' }}>

            {/* UPLOAD OVERLAY */}
            <div id="upload-overlay" className="absolute inset-0 z-30 flex flex-col items-center justify-center cursor-pointer checkerboard" role="button" tabIndex={0} aria-label="Upload an image to edit">
              <input type="file" id="file-input" accept="image/*" className="hidden" aria-label="Choose image file" />
              <svg className="w-12 h-12  mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
              <p className="text-lg font-medium mb-1">Drop your image here or click to upload</p>
              <p className="text-sm ">Supports JPEG, PNG, WebP, GIF, BMP</p>
            </div>

            {/* ADJUSTMENT BANNER */}
            <div id="adjust-banner" className="absolute top-0 left-0 right-0 z-40 bg-yellow-900/90 text-yellow-100 text-sm px-4 py-2 text-center hidden">
              Active adjustments detected. <button id="banner-apply" className="underline font-semibold hover:text-white">Apply</button> or <button id="banner-reset" className="underline font-semibold hover:text-white">Reset</button> before using drawing tools.
            </div>

            {/* EDITOR UI */}
            <div id="editor-ui" className="hidden h-[520px] flex">

              {/* LEFT TOOLBAR */}
              <aside className="w-12 border-r border-border flex flex-col items-center py-2 gap-1 shrink-0" role="toolbar" aria-label="Editing tools">
                <button className="tool-btn active w-9 h-9 rounded flex items-center justify-center text-sm" data-tool="pointer" title="Pointer (V)" aria-label="Pointer tool"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4 2l16 11H11l-4 9z" /></svg></button>
                <button className="tool-btn w-9 h-9 rounded flex items-center justify-center text-sm" data-tool="brush" title="Brush (B)" aria-label="Brush tool"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18.37 2.63a2.12 2.12 0 013 3L14 13l-4 1 1-4z" /><path d="M9 14.5A3.5 3.5 0 005.5 18c-1.2 0-2.5.5-3.5 1.5L9 14.5z" /></svg></button>
                <button className="tool-btn w-9 h-9 rounded flex items-center justify-center text-sm" data-tool="eraser" title="Eraser (E)" aria-label="Eraser tool"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 21h10" /><path d="M5.5 13.5L12 7l6.5 6.5c1 1 1 2.5 0 3.5L15 20.5c-1 1-2.5 1-3.5 0L5.5 13.5z" /></svg></button>
                <button className="tool-btn w-9 h-9 rounded flex items-center justify-center text-sm" data-tool="clone" title="Clone Stamp (S) — Alt+click to set source" aria-label="Clone stamp tool"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="8" cy="8" r="5" /><path d="M18 18l-4-4" /><circle cx="8" cy="8" r="2" /></svg></button>
                <button className="tool-btn w-9 h-9 rounded flex items-center justify-center text-sm" data-tool="text" title="Text (T)" aria-label="Text tool"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="4 7 4 4 20 4 20 7" /><line x1="9" y1="20" x2="15" y2="20" /><line x1="12" y1="4" x2="12" y2="20" /></svg></button>
                <div className="w-6 border-t border-border my-1"></div>
                <button className="tool-btn w-9 h-9 rounded flex items-center justify-center text-sm" id="btn-rotate-l" title="Rotate Left" aria-label="Rotate left"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 2v6h6" /><path d="M2.5 8A10 10 0 014.93 17.07" /><path d="M21.5 22v-6h-6" /><path d="M21.5 16A10 10 0 0019.07 6.93" /></svg></button>
                <button className="tool-btn w-9 h-9 rounded flex items-center justify-center text-sm" id="btn-rotate-r" title="Rotate Right" aria-label="Rotate right"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2v6h-6" /><path d="M21.5 8A10 10 0 0019.07 17.07" /><path d="M2.5 22v-6h6" /><path d="M2.5 16A10 10 0 004.93 6.93" /></svg></button>
                <button className="tool-btn w-9 h-9 rounded flex items-center justify-center text-sm" id="btn-flip-h" title="Flip Horizontal" aria-label="Flip horizontal"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3H5a2 2 0 00-2 2v14a2 2 0 002 2h3" /><path d="M16 3h3a2 2 0 012 2v14a2 2 0 01-2 2h-3" /><line x1="12" y1="2" x2="12" y2="22" strokeDasharray="2 2" /></svg></button>
                <button className="tool-btn w-9 h-9 rounded flex items-center justify-center text-sm" id="btn-flip-v" title="Flip Vertical" aria-label="Flip vertical"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 8V5a2 2 0 012-2h14a2 2 0 012 2v3" /><path d="M3 16v3a2 2 0 002 2h14a2 2 0 002-2v-3" /><line x1="2" y1="12" x2="22" y2="12" strokeDasharray="2 2" /></svg></button>
              </aside>

              {/* CANVAS AREA */}
              <div id="canvas-area" className="flex-1 overflow-auto checkerboard relative flex items-center justify-center" tabIndex={0} role="img" aria-label="Image editing canvas">
                <canvas id="editor-canvas" className="block"></canvas>
                {/* Text input overlay */}
                <input id="text-input" type="text" className="absolute hidden bg-transparent text-white border-b border-white outline-none px-1 text-base" style={{ zIndex: 20, minWidth: '100px' }} placeholder="Type here..." aria-label="Text to place on image" />
              </div>

              {/* RIGHT PANEL */}
              <aside id="right-panel" className="w-[260px] border-l border-border flex flex-col shrink-0 bg-panel overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-border shrink-0">
                  <button className="tab-btn active flex-1 text-xs py-2.5  font-medium" data-tab="adjust">Adjust</button>
                  <button className="tab-btn flex-1 text-xs py-2.5  font-medium" data-tab="filters">Filters</button>
                  <button className="tab-btn flex-1 text-xs py-2.5  font-medium" data-tab="tools">Tools</button>
                </div>

                {/* Adjust Tab */}
                <div id="tab-adjust" className="flex-1 overflow-y-auto p-3 space-y-4 fade-in">
                  <div>
                    <button id="preset-fix" className="preset-btn w-full text-xs py-2 px-3 rounded border border-border text-left mb-2 bg-transparent ">Fix Old Photo</button>
                    <button id="preset-color" className="preset-btn w-full text-xs py-2 px-3 rounded border border-border text-left mb-2 bg-transparent ">Auto Color Fix</button>
                    <button id="preset-enhance" className="preset-btn w-full text-xs py-2 px-3 rounded border border-border text-left bg-transparent ">Enhance</button>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest  mb-2">Light</h3>
                    <div id="sliders-light" className="space-y-1"></div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest  mb-2">Color</h3>
                    <div id="sliders-color" className="space-y-1"></div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest  mb-2">Detail</h3>
                    <div id="sliders-detail" className="space-y-1"></div>
                  </div>
                  <div>
                    <h3 className="text-[10px] font-semibold uppercase tracking-widest  mb-2">Effects</h3>
                    <div id="sliders-effects" className="space-y-1"></div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button id="btn-apply" className="flex-1 text-xs font-semibold bg-white text-black py-2 rounded hover:bg-neutral-200 transition-colors">Apply</button>
                    <button id="btn-reset" className="flex-1 text-xs font-semibold border border-border py-2 rounded hover:bg-white hover:text-black transition-colors">Reset</button>
                  </div>
                </div>

                {/* Filters Tab */}
                <div id="tab-filters" className="flex-1 overflow-y-auto p-3 hidden fade-in">
                  <div id="filter-grid" className="grid grid-cols-3 gap-2"></div>
                </div>

                {/* Tools Tab */}
                <div id="tab-tools" className="flex-1 overflow-y-auto p-3 space-y-3 hidden fade-in">
                  <div id="tool-options-brush" className="hidden space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-widest ">Brush Size</label>
                    <input type="range" id="brush-size" min="1" max="100" defaultValue="12" aria-label="Brush size" />
                    <span id="brush-size-val" className="text-xs ">12px</span>
                    <label className="text-[10px] font-semibold uppercase tracking-widest  mt-2">Opacity</label>
                    <input type="range" id="brush-opacity" min="1" max="100" defaultValue="100" aria-label="Brush opacity" />
                    <span id="brush-opacity-val" className="text-xs ">100%</span>
                    <label className="text-[10px] font-semibold uppercase tracking-widest  mt-2">Color</label>
                    <input type="color" id="brush-color" defaultValue="#ffffff" className="w-full h-8 rounded border border-border bg-transparent cursor-pointer" aria-label="Brush color" />
                  </div>
                  <div id="tool-options-eraser" className="hidden space-y-2">
                    <label className="text-[10px] font-semibold uppercase tracking-widest ">Eraser Size</label>
                    <input type="range" id="eraser-size" min="1" max="100" defaultValue="20" aria-label="Eraser size" />
                    <span id="eraser-size-val" className="text-xs ">20px</span>
                    <label className="text-[10px] font-semibold uppercase tracking-widest  mt-2">Opacity</label>
                    <input type="range" id="eraser-opacity" min="1" max="100" defaultValue="100" aria-label="Eraser opacity" />
                    <span id="eraser-opacity-val" className="text-xs ">100%</span>
                  </div>
                  <div id="tool-options-clone" className="hidden space-y-2">
                    <p className="text-xs ">Alt+click on the image to set the clone source point, then paint to copy from that area.</p>
                    <label className="text-[10px] font-semibold uppercase tracking-widest  mt-2">Clone Size</label>
                    <input type="range" id="clone-size" min="1" max="100" defaultValue="20" aria-label="Clone stamp size" />
                    <span id="clone-size-val" className="text-xs ">20px</span>
                    <label className="text-[10px] font-semibold uppercase tracking-widest  mt-2">Opacity</label>
                    <input type="range" id="clone-opacity" min="1" max="100" defaultValue="100" aria-label="Clone stamp opacity" />
                    <span id="clone-opacity-val" className="text-xs ">100%</span>
                    <div id="clone-status" className="text-xs  mt-1">No source set</div>
                  </div>
                  <div id="tool-options-text" className="hidden space-y-2">
                    <p className="text-xs ">Click on the canvas to place text.</p>
                    <label className="text-[10px] font-semibold uppercase tracking-widest  mt-2">Font Size</label>
                    <input type="range" id="text-size" min="8" max="120" defaultValue="24" aria-label="Text font size" />
                    <span id="text-size-val" className="text-xs ">24px</span>
                    <label className="text-[10px] font-semibold uppercase tracking-widest  mt-2">Text Color</label>
                    <input type="color" id="text-color" defaultValue="#ffffff" className="w-full h-8 rounded border border-border bg-transparent cursor-pointer" aria-label="Text color" />
                    <label className="text-[10px] font-semibold uppercase tracking-widest  mt-2">Font Weight</label>
                    <select id="text-weight" className="w-full bg-panel border border-border text-white text-xs py-1.5 px-2 rounded" aria-label="Text font weight">
                      <option value="400">Regular</option><option value="600">Semi Bold</option><option value="700">Bold</option>
                    </select>
                  </div>
                  <div id="tool-options-pointer" className="hidden">
                    <p className="text-xs ">Select a tool from the left toolbar to start editing.</p>
                  </div>
                </div>
              </aside>
            </div>

            {/* BOTTOM BAR */}
            <div id="bottom-bar" className="border-t border-border px-3 py-2 flex items-center gap-2 text-xs bg-panel hidden">
              <button id="btn-undo" className="px-2.5 py-1 rounded border border-border hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none" disabled aria-label="Undo">Undo</button>
              <button id="btn-redo" className="px-2.5 py-1 rounded border border-border hover:bg-white hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none" disabled aria-label="Redo">Redo</button>
              <div className="w-px h-4 bg-border mx-1"></div>
              <button id="btn-fit" className="px-2.5 py-1 rounded border border-border hover:bg-white hover:text-black transition-colors" aria-label="Fit to screen">Fit</button>
              <button id="btn-zoom-out" className="px-2 py-1 rounded border border-border hover:bg-white hover:text-black transition-colors" aria-label="Zoom out">&minus;</button>
              <span id="zoom-display" className="w-12 text-center  mono">100%</span>
              <button id="btn-zoom-in" className="px-2 py-1 rounded border border-border hover:bg-white hover:text-black transition-colors" aria-label="Zoom in">+</button>
              <div className="w-px h-4 bg-border mx-1"></div>
              <button id="btn-before" className="px-2.5 py-1 rounded border border-border hover:bg-white hover:text-black transition-colors" aria-label="Hold to see before">Before</button>
              <div className="flex-1"></div>
              <span id="img-dimensions" className=" mono hidden sm:inline"></span>
              <div className="w-px h-4 bg-border mx-1 hidden sm:block"></div>
              <button id="btn-new" className="px-2.5 py-1 rounded border border-border hover:bg-white hover:text-black transition-colors" aria-label="Load new image">New</button>
              <div className="relative">
                <button id="btn-download" className="px-3 py-1 rounded bg-white text-black font-semibold hover:bg-neutral-200 transition-colors" aria-label="Download image">Download</button>
                <div id="download-dropdown" className="dropdown absolute bottom-full right-0 mb-1 bg-panel border border-border rounded overflow-hidden shadow-xl z-50">
                  <button className="block w-full text-left px-4 py-2 text-xs hover:bg-white hover:text-black transition-colors" data-format="png">PNG (Lossless)</button>
                  <button className="block w-full text-left px-4 py-2 text-xs hover:bg-white hover:text-black transition-colors" data-format="jpeg">JPEG (Smaller)</button>
                  <button className="block w-full text-left px-4 py-2 text-xs hover:bg-white hover:text-black transition-colors" data-format="webp">WebP (Modern)</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="px-4 py-16 max-w-5xl mx-auto" aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-2xl sm:text-3xl font-bold text-center mb-3 tracking-tight">Everything You Need to Edit Images</h2>
          <p className=" text-center mb-10 max-w-xl mx-auto">Professional-grade image editing tools that run entirely in your browser. No software to install, no account to create.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <article className="border border-border rounded-lg p-5 hover:border-neutral-600 transition-colors">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mb-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg></div>
              <h3 className="font-semibold mb-1">Fix Old Photos</h3>
              <p className="text-sm  leading-relaxed">Restore faded, blurry, or damaged photographs with sharpening, noise reduction, and color correction designed for vintage images.</p>
            </article>
            <article className="border border-border rounded-lg p-5 hover:border-neutral-600 transition-colors">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mb-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg></div>
              <h3 className="font-semibold mb-1">Remove Objects</h3>
              <p className="text-sm  leading-relaxed">Erase unwanted elements from your photos using the clone stamp tool. Copy clean areas over blemishes, power lines, or distractions.</p>
            </article>
            <article className="border border-border rounded-lg p-5 hover:border-neutral-600 transition-colors">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mb-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="13.5" cy="6.5" r="2.5" /><circle cx="17.5" cy="10.5" r="2.5" /><circle cx="8.5" cy="7.5" r="2.5" /><circle cx="6.5" cy="12.5" r="2.5" /><path d="M12 22c-4.97 0-9-2.69-9-6v0c0-2 1-4 3-5.5l2.5 1.5C7.5 13 9 14.5 12 14.5s4.5-1.5 5.5-2.5L20 10.5c2 1.5 3 3.5 3 5.5v0c0 3.31-4.03 6-9 6h-2z" /></svg></div>
              <h3 className="font-semibold mb-1">Color Correction</h3>
              <p className="text-sm  leading-relaxed">Adjust temperature, tint, saturation, vibrance, and hue with Photoshop-level precision. Fix white balance and color casts instantly.</p>
            </article>
            <article className="border border-border rounded-lg p-5 hover:border-neutral-600 transition-colors">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mb-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10" /></svg></div>
              <h3 className="font-semibold mb-1">One-Click Presets</h3>
              <p className="text-sm  leading-relaxed">Fix Old Photo, Auto Color Fix, and Enhance presets apply optimized settings instantly. Fine-tune with individual sliders afterward.</p>
            </article>
            <article className="border border-border rounded-lg p-5 hover:border-neutral-600 transition-colors">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mb-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg></div>
              <h3 className="font-semibold mb-1">Photo Filters</h3>
              <p className="text-sm  leading-relaxed">Apply Grayscale, Sepia, Invert, Vintage, Cool, Warm, Dramatic, Fade, and Noir filters with live thumbnail previews.</p>
            </article>
            <article className="border border-border rounded-lg p-5 hover:border-neutral-600 transition-colors">
              <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center mb-3"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg></div>
              <h3 className="font-semibold mb-1">Fully Private</h3>
              <p className="text-sm  leading-relaxed">Your images never leave your device. All processing happens locally in your browser using HTML5 Canvas. Zero data collection.</p>
            </article>
          </div>
        </section>

        {/* HOW TO SECTION */}
        <section id="how-to" className="px-4 py-16 max-w-3xl mx-auto" aria-labelledby="howto-heading">
          <h2 id="howto-heading" className="text-2xl sm:text-3xl font-bold text-center mb-3 tracking-tight">How to Edit Photos Online</h2>
          <p className=" text-center mb-10 max-w-xl mx-auto">From uploading to downloading, the entire process takes place in your browser in seconds.</p>
          <ol className="space-y-6">
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 text-sm font-bold">1</div>
              <div><h3 className="font-semibold mb-1">Upload Your Image</h3><p className="text-sm  leading-relaxed">Drag and drop a photo into the editor or click the upload area to browse your files. All common formats are supported.</p></div>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 text-sm font-bold">2</div>
              <div><h3 className="font-semibold mb-1">Adjust or Use Presets</h3><p className="text-sm  leading-relaxed">Use one-click presets for common fixes, or manually adjust brightness, contrast, saturation, temperature, sharpening, and more with real-time preview.</p></div>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 text-sm font-bold">3</div>
              <div><h3 className="font-semibold mb-1">Edit with Drawing Tools</h3><p className="text-sm  leading-relaxed">Paint, erase, add text, or use the clone stamp to remove objects. Apply adjustments first, then switch to drawing tools for pixel-level edits.</p></div>
            </li>
            <li className="flex gap-4">
              <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center shrink-0 text-sm font-bold">4</div>
              <div><h3 className="font-semibold mb-1">Download Your Result</h3><p className="text-sm  leading-relaxed">Export as PNG for lossless quality, JPEG for smaller files, or WebP for the best of both. No watermarks, no quality limits.</p></div>
            </li>
          </ol>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="px-4 py-16 max-w-3xl mx-auto" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-center mb-10 tracking-tight">Frequently Asked Questions</h2>
          <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
            <details className="border border-border rounded-lg group" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="p-4 cursor-pointer text-sm font-medium flex justify-between items-center hover:text-neutral-300 transition-colors" itemProp="name">Is thefreeaitools really free?<span className=" group-open:rotate-45 transition-transform text-lg leading-none">+</span></summary>
              <div className="px-4 pb-4 text-sm  leading-relaxed" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"><p itemProp="text">Yes, thefreeaitools is 100% free. There are no hidden fees, no signup required, and no watermarks on your edited images. All processing happens locally in your browser using HTML5 Canvas technology.</p></div>
            </details>
            <details className="border border-border rounded-lg group" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="p-4 cursor-pointer text-sm font-medium flex justify-between items-center hover:text-neutral-300 transition-colors" itemProp="name">How does the object removal tool work?<span className=" group-open:rotate-45 transition-transform text-lg leading-none">+</span></summary>
              <div className="px-4 pb-4 text-sm  leading-relaxed" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"><p itemProp="text">thefreeaitools uses a clone stamp tool for object removal. Select the clone stamp tool, hold Alt and click on a clean area of the image to set the source point, then paint over the object you want to remove. The tool copies pixels from the source to cover the unwanted area seamlessly.</p></div>
            </details>
            <details className="border border-border rounded-lg group" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="p-4 cursor-pointer text-sm font-medium flex justify-between items-center hover:text-neutral-300 transition-colors" itemProp="name">Can I fix old and blurry photos?<span className=" group-open:rotate-45 transition-transform text-lg leading-none">+</span></summary>
              <div className="px-4 pb-4 text-sm  leading-relaxed" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"><p itemProp="text">Yes. Use the &ldquo;Fix Old Photo&rdquo; preset button to automatically apply optimal sharpening, noise reduction, contrast, and color settings. You can then fine-tune each parameter individually using the adjustment sliders for the best result.</p></div>
            </details>
            <details className="border border-border rounded-lg group" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="p-4 cursor-pointer text-sm font-medium flex justify-between items-center hover:text-neutral-300 transition-colors" itemProp="name">Are my photos uploaded to a server?<span className=" group-open:rotate-45 transition-transform text-lg leading-none">+</span></summary>
              <div className="px-4 pb-4 text-sm  leading-relaxed" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"><p itemProp="text">No. All image processing happens entirely in your browser using the HTML5 Canvas API. Your photos never leave your device. There is no server, no database, and no data collection of any kind.</p></div>
            </details>
            <details className="border border-border rounded-lg group" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="p-4 cursor-pointer text-sm font-medium flex justify-between items-center hover:text-neutral-300 transition-colors" itemProp="name">What image formats are supported?<span className=" group-open:rotate-45 transition-transform text-lg leading-none">+</span></summary>
              <div className="px-4 pb-4 text-sm  leading-relaxed" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"><p itemProp="text">You can upload JPEG, PNG, WebP, GIF, BMP, TIFF, and most other browser-supported image formats. For export, you can choose between PNG (lossless), JPEG (compressed), or WebP (modern format with excellent compression).</p></div>
            </details>
            <details className="border border-border rounded-lg group" itemScope itemProp="mainEntity" itemType="https://schema.org/Question">
              <summary className="p-4 cursor-pointer text-sm font-medium flex justify-between items-center hover:text-neutral-300 transition-colors" itemProp="name">Is there a file size or resolution limit?<span className=" group-open:rotate-45 transition-transform text-lg leading-none">+</span></summary>
              <div className="px-4 pb-4 text-sm  leading-relaxed" itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer"><p itemProp="text">Since all processing runs in your browser, there is no server-side limit. However, very large images (over 20 megapixels) may be automatically scaled down to ensure smooth performance. The editor works best with images up to 4000x4000 pixels.</p></div>
            </details>
          </div>
        </section>
      </main>


    </>
  );
}
