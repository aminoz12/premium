'use client';

import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    [key: string]: any;
  }
}

export default function DiagrammGeneratorAi() {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const svgCanvasRef = useRef<SVGSVGElement | null>(null);
  const initRef = useRef(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  // ── ALL ORIGINAL LOGIC PRESERVED + IMPROVEMENTS ──
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;

    // ==================== STATE ====================
    let nodes: any[] = [];
    let edges: any[] = [];
    let selectedNodes: any[] = [];
    let selectedEdge: any = null;
    let activeTool = 'select';
    let zoom = 1;
    let panX = 0,
      panY = 0;
    let isDragging = false,
      isResizing = false,
      isPanning = false;
    let dragStart = { x: 0, y: 0 };
    let dragNodeStart: any[] = [];
    let currentHandle: string | null = null;
    let drawingEdge = false;
    let edgeStart: any = null;
    let edgeTemp: SVGElement | null = null;
    let nodeIdCounter = 1;
    let edgeIdCounter = 1;
    let undoStack: any[] = [],
      redoStack: any[] = [];
    let gridEnabled = true;
    let minimapVisible = false;
    let dragShape_type: string | null = null;
    let copiedStyle: any = null;
    let clipboardNodes: any[] = []; // NEW: clipboard for copy/paste
    let nodeDefaults = {
      fill: '#1e2d5a',
      stroke: '#5b6ef5',
      strokeWidth: 1.5,
      fontSize: 13,
      fontColor: '#e8e8f0',
      rx: 4,
    };
    const GRID = 20;
    const STORAGE_KEY = 'diagramm_generator_ai_v1'; // NEW: autosave key

    const canvas = document.getElementById('canvas') as HTMLDivElement;
    const svgCanvas = document.getElementById('svg-canvas') as unknown as SVGSVGElement;

    // ==================== TOOL ====================
    function setTool(t: string) {
      activeTool = t;
      document.querySelectorAll('.tool-btn[id^="tool-"]').forEach((b) => b.classList.remove('active'));
      const btn = document.getElementById('tool-' + t);
      if (btn) btn.classList.add('active');
      canvas.style.cursor =
        t === 'hand' ? 'grab' : t === 'text' ? 'text' : t === 'select' ? 'default' : 'crosshair';
      hideContextMenu();
    }

    // ==================== GRID ====================
    function toggleGrid() {
      gridEnabled = !gridEnabled;
      canvas.classList.toggle('canvas-grid-bg', gridEnabled);
      const cb = document.getElementById('opt-grid') as HTMLInputElement | null;
      if (cb) cb.checked = gridEnabled;
    }
    function toggleGridOpt(cb: HTMLInputElement) {
      gridEnabled = cb.checked;
      canvas.classList.toggle('canvas-grid-bg', gridEnabled);
    }
    function snapToGrid(v: number) {
      return gridEnabled ? Math.round(v / GRID) * GRID : v;
    }

    // ==================== ZOOM ====================
    function setZoom(z: number) {
      zoom = Math.max(0.25, Math.min(4, z));
      const el = document.getElementById('zoom-level');
      if (el) el.textContent = Math.round(zoom * 100) + '%';
      renderAll();
    }
    function zoomIn() {
      setZoom(zoom * 1.2);
    }
    function zoomOut() {
      setZoom(zoom / 1.2);
    }
    function resetZoom() {
      zoom = 1;
      panX = 0;
      panY = 0;
      renderAll();
    }
    function fitPage() {
      if (nodes.length === 0) {
        resetZoom();
        return;
      }
      const xs = nodes.map((n) => n.x),
        ys = nodes.map((n) => n.y);
      const xe = nodes.map((n) => n.x + n.w),
        ye = nodes.map((n) => n.y + n.h);
      const minX = Math.min(...xs),
        minY = Math.min(...ys),
        maxX = Math.max(...xe),
        maxY = Math.max(...ye);
      const ca = document.getElementById('canvas-area')!;
      const aw = ca.clientWidth - 60,
        ah = ca.clientHeight - 60;
      const dw = maxX - minX,
        dh = maxY - minY;
      const z = Math.min(aw / dw, ah / dh, 2);
      zoom = z;
      panX = aw / 2 - z * (minX + dw / 2);
      panY = ah / 2 - z * (minY + dh / 2);
      const el = document.getElementById('zoom-level');
      if (el) el.textContent = Math.round(zoom * 100) + '%';
      renderAll();
    }
    function handleWheel(e: WheelEvent) {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        const z = e.deltaY < 0 ? zoom * 1.1 : zoom / 1.1;
        setZoom(z);
      } else {
        panX -= e.deltaX;
        panY -= e.deltaY;
        renderAll();
      }
    }
    function toggleMinimap() {
      minimapVisible = !minimapVisible;
      const m = document.getElementById('minimap')!;
      m.style.display = minimapVisible ? 'block' : 'none';
      if (minimapVisible) drawMinimap();
    }

    // ==================== NODE CREATION ====================
    function createNode(type: string, x: number, y: number, w?: number, h?: number, label?: string) {
      saveUndo();
      const id = 'n' + nodeIdCounter++;
      const n: any = {
        id,
        type,
        x: snapToGrid(x),
        y: snapToGrid(y),
        w: w || 120,
        h: h || 60,
        label: label || getDefaultLabel(type),
        fill: nodeDefaults.fill,
        stroke: nodeDefaults.stroke,
        strokeWidth: nodeDefaults.strokeWidth,
        fontSize: nodeDefaults.fontSize,
        fontColor: nodeDefaults.fontColor,
        rx: nodeDefaults.rx,
        fontBold: false,
        fontItalic: false,
        fontUnderline: false,
        opacity: 100,
        strokeStyle: 'solid',
        zIndex: nodeIdCounter,
      };
      nodes.push(n);
      renderNode(n);
      const hint = document.getElementById('canvas-hint');
      if (hint) hint.style.display = 'none';
      updateStatus();
      autosave();
      return n;
    }
    function getDefaultLabel(type: string) {
      const labels: Record<string, string> = {
        rect: 'Shape',
        ellipse: 'Shape',
        diamond: 'Decision',
        triangle: 'Triangle',
        cylinder: 'Database',
        hexagon: 'Process',
        text: 'Text',
        note: 'Note',
        process: 'Process',
        terminator: 'Start/End',
        decision: 'Decision',
        parallelogram: 'I/O',
        umlClass: 'ClassName',
        actor: 'Actor',
        server: 'Server',
        cloud: 'Cloud',
        router: 'Router',
        pc: 'Computer',
        mobile: 'Mobile',
        firewall: 'Firewall',
        callout: 'Comment',
        step: 'Step',
        arrowRight: '',
        cross: '',
        brackets: '',
        star: '',
        manualInput: 'Input',
        document: 'Document',
        connector: '',
        frame: 'Frame',
        group: 'Group',
        lifeline: 'Object',
        umlInterface: 'Interface',
        package: 'Package',
        fragment: 'Fragment',
        switch: 'Switch',
        roundrect: 'Shape',
      };
      return labels[type] || type;
    }

    // ==================== RENDER NODE ====================
    function renderNode(n: any) {
      let el = document.getElementById(n.id) as HTMLDivElement | null;
      if (el) el.remove();
      el = document.createElement('div');
      el.id = n.id;
      el.className = 'node';
      el.style.cssText = `left:${n.x * zoom + panX}px;top:${n.y * zoom + panY}px;width:${n.w * zoom}px;height:${n.h * zoom
        }px;z-index:${n.zIndex}`;
      const shapeDiv = document.createElement('div');
      shapeDiv.className = 'node-shape';
      const opA = n.opacity / 100;
      const sw = n.strokeWidth;
      const sda =
        n.strokeStyle === 'dashed'
          ? `stroke-dasharray="${Math.max(6, n.w / 6)} ${Math.max(3, n.w / 12)}"`
          : n.strokeStyle === 'dotted'
            ? `stroke-dasharray="2 4"`
            : '';
      shapeDiv.innerHTML = getShapeSVG(n, opA, sw, sda);
      el.appendChild(shapeDiv);
      if (n.type !== 'arrowRight' && n.type !== 'cross' && n.type !== 'connector') {
        const label = document.createElement('div');
        label.className = 'node-label';
        label.style.cssText = `font-size:${n.fontSize * zoom}px;color:${n.fontColor};font-weight:${n.fontBold ? '600' : '400'
          };font-style:${n.fontItalic ? 'italic' : 'normal'};text-decoration:${n.fontUnderline ? 'underline' : 'none'}`;
        label.textContent = n.label;
        el.appendChild(label);
      }
      ['top', 'bottom', 'left', 'right'].forEach((side) => {
        const p = document.createElement('div');
        p.className = 'conn-port ' + side;
        p.onmousedown = (e) => {
          e.stopPropagation();
          startEdge(n, side, e);
        };
        el!.appendChild(p);
      });
      ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br'].forEach((h) => {
        const hd = document.createElement('div');
        hd.className = 'handle ' + h;
        hd.style.display = 'none';
        hd.onmousedown = (e) => {
          e.stopPropagation();
          startResize(n, h, e);
        };
        el!.appendChild(hd);
      });
      el.onmousedown = (e) => nodeMouseDown(n, e);
      el.ondblclick = (e) => {
        e.stopPropagation();
        editLabel(n);
      };
      canvas.appendChild(el);
    }

    function getShapeSVG(n: any, opA: number, sw: number, sda: string): string {
      const W = n.w * zoom,
        H = n.h * zoom;
      const f = n.fill,
        s = n.stroke;
      const base = `fill="${f}" fill-opacity="${opA}" stroke="${s}" stroke-width="${sw}" ${sda}`;
      switch (n.type) {
        case 'rect':
        case 'process':
        case 'frame':
        case 'group':
        case 'roundrect':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${sw / 2}" y="${sw / 2}" width="${W - sw
            }" height="${H - sw}" rx="${n.type === 'roundrect' ? 12 : n.rx}" ${base}/></svg>`;
        case 'ellipse':
        case 'connector':
        case 'usecase':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><ellipse cx="${W / 2}" cy="${H / 2}" rx="${W / 2 - sw / 2
            }" ry="${H / 2 - sw / 2}" ${base}/></svg>`;
        case 'diamond':
        case 'decision':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><polygon points="${W / 2},${sw / 2} ${W - sw / 2
            },${H / 2} ${W / 2},${H - sw / 2} ${sw / 2},${H / 2}" ${base}/></svg>`;
        case 'triangle':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><polygon points="${W / 2},${sw / 2} ${W - sw / 2
            },${H - sw / 2} ${sw / 2},${H - sw / 2}" ${base}/></svg>`;
        case 'hexagon':
        case 'preparation':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><polygon points="${W * 0.25},${sw / 2} ${W * 0.75
            },${sw / 2} ${W - sw / 2},${H / 2} ${W * 0.75},${H - sw / 2} ${W * 0.25},${H - sw / 2} ${sw / 2},${H / 2
            }" ${base}/></svg>`;
        case 'cylinder':
        case 'database':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><ellipse cx="${W / 2}" cy="${H * 0.15
            }" rx="${W / 2 - sw / 2}" ry="${H * 0.14}" ${base}/><rect x="${sw / 2}" y="${H * 0.15}" width="${W - sw
            }" height="${H * 0.71}" fill="${f}" fill-opacity="${opA}" stroke="none"/><path d="M${sw / 2} ${H * 0.15
            } L${sw / 2} ${H * 0.85}" stroke="${s}" stroke-width="${sw}"/><path d="M${W - sw / 2} ${H * 0.15
            } L${W - sw / 2} ${H * 0.85}" stroke="${s}" stroke-width="${sw}"/><ellipse cx="${W / 2}" cy="${H * 0.85
            }" rx="${W / 2 - sw / 2}" ry="${H * 0.14}" ${base}/></svg>`;
        case 'parallelogram':
        case 'data': {
          const o = W * 0.2;
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><polygon points="${o},${sw / 2} ${W - sw / 2
            },${sw / 2} ${W - o},${H - sw / 2} ${sw / 2},${H - sw / 2}" ${base}/></svg>`;
        }
        case 'terminator':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${sw / 2}" y="${sw / 2}" width="${W - sw
            }" height="${H - sw}" rx="${H / 2}" ${base}/></svg>`;
        case 'cloud':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="M${W * 0.25} ${H * 0.8} C${W * 0.05
            } ${H * 0.8} ${W * 0.05} ${H * 0.5} ${W * 0.2} ${H * 0.45} C${W * 0.15} ${H * 0.2} ${W * 0.35} ${H * 0.1} ${W * 0.5
            } ${H * 0.2} C${W * 0.55} ${H * 0.05} ${W * 0.75} ${H * 0.05} ${W * 0.8} ${H * 0.25} C${W * 0.95} ${H * 0.2
            } ${W * 0.98} ${H * 0.5} ${W * 0.9} ${H * 0.6} C${W * 0.98} ${H * 0.65} ${W * 0.98} ${H * 0.8} ${W * 0.85
            } ${H * 0.8}Z" ${base}/></svg>`;
        case 'star': {
          const pts: string[] = [];
          for (let i = 0; i < 10; i++) {
            const a = (i * 36 * Math.PI) / 180 - Math.PI / 2;
            const r = i % 2 === 0 ? Math.min(W, H) / 2 - sw : Math.min(W, H) / 4;
            pts.push(`${W / 2 + r * Math.cos(a)},${H / 2 + r * Math.sin(a)}`);
          }
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><polygon points="${pts.join(' ')}" ${base}/></svg>`;
        }
        case 'note': {
          const fold = Math.min(W, H) * 0.25;
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="M${sw / 2},${sw / 2} L${W - fold
            },${sw / 2} L${W - sw / 2},${fold} L${W - sw / 2},${H - sw / 2} L${sw / 2},${H - sw / 2}Z" ${base}/><path d="M${W - fold
            },${sw / 2} L${W - fold},${fold} L${W - sw / 2},${fold}" fill="none" stroke="${s}" stroke-width="${sw * 0.7
            }"/></svg>`;
        }
        case 'manualInput':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="M${sw / 2},${H * 0.35} L${W - sw / 2
            },${sw / 2} L${W - sw / 2},${H - sw / 2} L${sw / 2},${H - sw / 2}Z" ${base}/></svg>`;
        case 'document':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="M${sw / 2},${sw / 2} L${W - sw / 2
            },${sw / 2} L${W - sw / 2},${H * 0.75} C${W * 0.75},${H * 0.75} ${W * 0.65},${H - sw / 2} ${W * 0.5},${H * 0.85
            } C${W * 0.35},${H * 0.75} ${W * 0.25},${H - sw / 2} ${sw / 2},${H * 0.85}Z" ${base}/></svg>`;
        case 'umlClass':
        case 'umlInterface':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${sw / 2}" y="${sw / 2}" width="${W - sw
            }" height="${H - sw}" rx="2" ${base}/><line x1="${sw}" y1="${H * 0.28}" x2="${W - sw}" y2="${H * 0.28
            }" stroke="${s}" stroke-width="${sw * 0.7}"/><line x1="${sw}" y1="${H * 0.55}" x2="${W - sw}" y2="${H * 0.55
            }" stroke="${s}" stroke-width="${sw * 0.7}"/></svg>`;
        case 'actor':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><circle cx="${W / 2}" cy="${H * 0.18
            }" r="${H * 0.14}" ${base}/><line x1="${W / 2}" y1="${H * 0.32}" x2="${W / 2}" y2="${H * 0.68
            }" stroke="${s}" stroke-width="${sw}" stroke-linecap="round"/><line x1="${W * 0.25}" y1="${H * 0.45
            }" x2="${W * 0.75}" y2="${H * 0.45}" stroke="${s}" stroke-width="${sw}" stroke-linecap="round"/><line x1="${W / 2
            }" y1="${H * 0.68}" x2="${W * 0.28}" y2="${H * 0.92}" stroke="${s}" stroke-width="${sw
            }" stroke-linecap="round"/><line x1="${W / 2}" y1="${H * 0.68}" x2="${W * 0.72}" y2="${H * 0.92
            }" stroke="${s}" stroke-width="${sw}" stroke-linecap="round"/></svg>`;
        case 'server':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${sw / 2}" y="${sw / 2}" width="${W - sw
            }" height="${H * 0.28}" rx="2" ${base}/><rect x="${sw / 2}" y="${H * 0.35}" width="${W - sw}" height="${H * 0.28
            }" rx="2" ${base}/><rect x="${sw / 2}" y="${H * 0.7}" width="${W - sw}" height="${H * 0.28
            }" rx="2" ${base}/><circle cx="${W * 0.85}" cy="${H * 0.14}" r="${H * 0.05}" fill="${s}"/><circle cx="${W * 0.85
            }" cy="${H * 0.49}" r="${H * 0.05}" fill="${s}"/><circle cx="${W * 0.85}" cy="${H * 0.84}" r="${H * 0.05
            }" fill="${s}"/></svg>`;
        case 'pc':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${sw / 2}" y="${sw / 2}" width="${W - sw
            }" height="${H * 0.7}" rx="2" ${base}/><line x1="${W * 0.35}" y1="${H * 0.7}" x2="${W * 0.3}" y2="${H - 0.5
            }" stroke="${s}" stroke-width="${sw}"/><line x1="${W * 0.65}" y1="${H * 0.7}" x2="${W * 0.7}" y2="${H - 0.5
            }" stroke="${s}" stroke-width="${sw}"/><line x1="${W * 0.2}" y1="${H - 0.5}" x2="${W * 0.8}" y2="${H - 0.5
            }" stroke="${s}" stroke-width="${sw}"/></svg>`;
        case 'mobile':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${W * 0.2}" y="${sw / 2
            }" width="${W * 0.6}" height="${H - sw}" rx="3" ${base}/><circle cx="${W * 0.5}" cy="${H * 0.92}" r="${H * 0.03
            }" fill="${s}"/><line x1="${W * 0.37}" y1="${H * 0.06}" x2="${W * 0.63}" y2="${H * 0.06
            }" stroke="${s}" stroke-width="${sw * 0.8}" stroke-linecap="round"/></svg>`;
        case 'firewall':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="M${W / 2},${sw / 2} L${W - sw / 2
            },${H * 0.35} L${W - sw / 2},${H * 0.7} C${W - sw / 2},${H * 0.9} ${W * 0.65},${H - sw / 2} ${W / 2},${H - sw / 2
            } C${W * 0.35},${H - sw / 2} ${sw / 2},${H * 0.9} ${sw / 2},${H * 0.7} L${sw / 2},${H * 0.35}Z" ${base}/></svg>`;
        case 'router':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><ellipse cx="${W / 2}" cy="${H / 2}" rx="${Math.min(W, H) / 2 - sw / 2
            }" ry="${Math.min(W, H) / 2 - sw / 2}" ${base}/><line x1="${W * 0.3}" y1="${H / 2}" x2="${W * 0.7}" y2="${H / 2
            }" stroke="${s}" stroke-width="${sw}"/><line x1="${W / 2}" y1="${H * 0.3}" x2="${W / 2}" y2="${H * 0.7
            }" stroke="${s}" stroke-width="${sw}"/></svg>`;
        case 'switch':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${sw / 2}" y="${H * 0.25
            }" width="${W - sw}" height="${H * 0.5}" rx="4" ${base}/><circle cx="${W * 0.2}" cy="${H / 2}" r="${H * 0.12
            }" fill="${s}"/><line x1="${W * 0.5}" y1="${H * 0.38}" x2="${W * 0.85}" y2="${H * 0.38
            }" stroke="${s}" stroke-width="${sw * 0.8}"/><line x1="${W * 0.5}" y1="${H * 0.62}" x2="${W * 0.85}" y2="${H * 0.62
            }" stroke="${s}" stroke-width="${sw * 0.8}"/></svg>`;
        case 'callout':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="M${sw / 2},${sw / 2} L${W - sw / 2
            },${sw / 2} L${W - sw / 2},${H * 0.7} L${W * 0.4},${H * 0.7} L${W * 0.3},${H - sw / 2} L${W * 0.25},${H * 0.7
            } L${sw / 2},${H * 0.7}Z" ${base}/></svg>`;
        case 'step': {
          const io = W * 0.15;
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><polygon points="${sw / 2},${H / 2} ${io},${sw / 2
            } ${W - sw / 2},${sw / 2} ${W - sw / 2},${H - sw / 2} ${io},${H - sw / 2}" ${base}/></svg>`;
        }
        case 'arrowRight':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><line x1="${sw}" y1="${H / 2}" x2="${W - sw * 2
            }" y2="${H / 2}" stroke="${s}" stroke-width="${sw * 1.5}" stroke-linecap="round"/><polygon points="${W - sw * 2
            },${H * 0.2} ${W - sw / 2},${H / 2} ${W - sw * 2},${H * 0.8}" fill="${s}"/></svg>`;
        case 'cross':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><line x1="${W / 2}" y1="${sw}" x2="${W / 2
            }" y2="${H - sw}" stroke="${s}" stroke-width="${sw * 1.5}"/><line x1="${sw}" y1="${H / 2}" x2="${W - sw
            }" y2="${H / 2}" stroke="${s}" stroke-width="${sw * 1.5}"/></svg>`;
        case 'brackets':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><path d="M${W * 0.3},${sw / 2} L${W * 0.15
            },${sw / 2} L${W * 0.15},${H - sw / 2} L${W * 0.3},${H - sw / 2}" fill="none" stroke="${s
            }" stroke-width="${sw}" stroke-linecap="round"/><path d="M${W * 0.7},${sw / 2} L${W * 0.85},${sw / 2
            } L${W * 0.85},${H - sw / 2} L${W * 0.7},${H - sw / 2}" fill="none" stroke="${s
            }" stroke-width="${sw}" stroke-linecap="round"/></svg>`;
        case 'lifeline':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${W * 0.15}" y="${sw / 2
            }" width="${W * 0.7}" height="${H * 0.25}" rx="2" ${base}/><line x1="${W / 2}" y1="${H * 0.25}" x2="${W / 2
            }" y2="${H - sw}" stroke="${s}" stroke-width="${sw}" stroke-dasharray="6 4"/></svg>`;
        case 'package':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${sw / 2}" y="${H * 0.25
            }" width="${W - sw}" height="${H * 0.73}" rx="1" ${base}/><rect x="${sw / 2}" y="${H * 0.25}" width="${W * 0.4
            }" height="${H * 0.25}" rx="1" ${base}/></svg>`;
        case 'fragment':
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${sw / 2}" y="${sw / 2}" width="${W - sw
            }" height="${H - sw}" rx="2" ${base}/><path d="M${sw / 2},${H * 0.28} L${W * 0.35},${H * 0.28} L${W * 0.45
            },${sw / 2}" fill="none" stroke="${s}" stroke-width="${sw * 0.7}"/></svg>`;
        default:
          return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect x="${sw / 2}" y="${sw / 2}" width="${W - sw
            }" height="${H - sw}" rx="${n.rx}" ${base}/></svg>`;
      }
    }

    // ==================== RENDER ALL ====================
    function renderAll() {
      nodes.forEach((n) => renderNode(n));
      edges.forEach((e) => renderEdge(e));
      if (minimapVisible) drawMinimap();
    }

    // ==================== EDGE ====================
    function startEdge(n: any, side: string, e: MouseEvent) {
      e.preventDefault();
      drawingEdge = true;
      edgeStart = { node: n, side };
      const p = getPortPos(n, side);
      edgeTemp = document.createElementNS('http://www.w3.org/2000/svg', 'line') as unknown as SVGElement;
      edgeTemp.setAttribute('stroke', '#5b6ef5');
      edgeTemp.setAttribute('stroke-width', '1.5');
      edgeTemp.setAttribute('stroke-dasharray', '6 3');
      edgeTemp.setAttribute('x1', String(p.x));
      edgeTemp.setAttribute('y1', String(p.y));
      edgeTemp.setAttribute('x2', String(p.x));
      edgeTemp.setAttribute('y2', String(p.y));
      svgCanvas.appendChild(edgeTemp);
    }
    function getPortPos(n: any, side: string) {
      const cx = n.x * zoom + panX,
        cy = n.y * zoom + panY;
      const w = n.w * zoom,
        h = n.h * zoom;
      const map: Record<string, { x: number; y: number }> = {
        top: { x: cx + w / 2, y: cy },
        bottom: { x: cx + w / 2, y: cy + h },
        left: { x: cx, y: cy + h / 2 },
        right: { x: cx + w, y: cy + h / 2 },
      };
      return map[side] || { x: cx + w / 2, y: cy + h / 2 };
    }
    function finishEdge(targetNode: any) {
      if (!drawingEdge || !edgeStart || edgeStart.node.id === targetNode.id) {
        cancelEdge();
        return;
      }
      saveUndo();
      const e2: any = {
        id: 'e' + edgeIdCounter++,
        from: edgeStart.node.id,
        fromSide: edgeStart.side,
        to: targetNode.id,
        toSide: detectCloseSide(targetNode),
        type: activeTool === 'dashed' ? 'dashed' : activeTool === 'line' ? 'line' : 'arrow',
        stroke: '#5b6ef5',
        strokeWidth: 1.5,
        label: '',
      };
      edges.push(e2);
      cancelEdge();
      renderEdge(e2);
      updateStatus();
      autosave();
    }
    function cancelEdge() {
      drawingEdge = false;
      edgeStart = null;
      if (edgeTemp) {
        edgeTemp.remove();
        edgeTemp = null;
      }
    }
    function detectCloseSide(_n: any) {
      return 'top';
    }
    function renderEdge(e2: any) {
      const old = document.getElementById('edge-' + e2.id);
      if (old) old.remove();
      const fn = nodes.find((n) => n.id === e2.from);
      const tn = nodes.find((n) => n.id === e2.to);
      if (!fn || !tn) return;
      const fp = getPortPos(fn, e2.fromSide);
      const tp = getPortPos(tn, e2.toSide || 'top');
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.id = 'edge-' + e2.id;
      const dx = tp.x - fp.x,
        dy = tp.y - fp.y;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const cx1 = fp.x + dx / 3,
        cy1 = fp.y,
        cx2 = tp.x - dx / 3,
        cy2 = tp.y;
      path.setAttribute('d', `M${fp.x},${fp.y} C${cx1},${cy1} ${cx2},${cy2} ${tp.x},${tp.y}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', e2.stroke || '#5b6ef5');
      path.setAttribute('stroke-width', String(e2.strokeWidth || 1.5));
      if (e2.type === 'dashed') path.setAttribute('stroke-dasharray', '8 4');
      if (e2.type === 'arrow' || e2.type === 'dashed') path.setAttribute('marker-end', 'url(#arrowhead)');
      g.appendChild(path);
      if (e2.label) {
        const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        t.setAttribute('x', String((fp.x + tp.x) / 2));
        t.setAttribute('y', String((fp.y + tp.y) / 2 - 6));
        t.setAttribute('text-anchor', 'middle');
        t.setAttribute('class', 'edge-label');
        t.textContent = e2.label;
        g.appendChild(t);
      }
      const hit = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      hit.setAttribute('d', `M${fp.x},${fp.y} C${cx1},${cy1} ${cx2},${cy2} ${tp.x},${tp.y}`);
      hit.setAttribute('fill', 'none');
      hit.setAttribute('stroke', 'transparent');
      hit.setAttribute('stroke-width', '12');
      (hit as unknown as HTMLElement).style.cursor = 'pointer';
      hit.onclick = (ev: any) => {
        ev.stopPropagation();
        selectEdge(e2);
      };
      g.appendChild(hit);
      svgCanvas.appendChild(g);
    }

    function selectEdge(e2: any) {
      clearSelection();
      selectedEdge = e2;
      const el = document.getElementById('edge-' + e2.id);
      if (el) {
        const p = el.querySelector('path');
        if (p) p.setAttribute('stroke', '#7c8dff');
      }
    }

    // ==================== MOUSE ====================
    function canvasMouseDown(e: any) {
      if (e.target === canvas || e.target === svgCanvas || e.target.tagName === 'svg') {
        clearSelection();
        if (activeTool === 'hand') {
          isPanning = true;
          dragStart = { x: e.clientX - panX, y: e.clientY - panY };
          canvas.style.cursor = 'grabbing';
        } else if (
          activeTool !== 'select' &&
          activeTool !== 'line' &&
          activeTool !== 'arrow' &&
          activeTool !== 'dashed'
        ) {
          const r = canvas.getBoundingClientRect();
          const x = (e.clientX - r.left - panX) / zoom,
            y = (e.clientY - r.top - panY) / zoom;
          const dims = getDefaultDims(activeTool);
          createNode(activeTool, x - dims.w / 2, y - dims.h / 2, dims.w, dims.h);
        }
      }
    }
    function getDefaultDims(type: string) {
      if (['actor', 'lifeline'].includes(type)) return { w: 60, h: 100 };
      if (['cylinder', 'database', 'server'].includes(type)) return { w: 100, h: 80 };
      if (['text'].includes(type)) return { w: 120, h: 40 };
      if (['diamond', 'decision'].includes(type)) return { w: 120, h: 70 };
      if (['cloud'].includes(type)) return { w: 130, h: 80 };
      return { w: 120, h: 60 };
    }
    function canvasMouseMove(e: any) {
      const r = canvas.getBoundingClientRect();
      const mx = (e.clientX - r.left - panX) / zoom,
        my = (e.clientY - r.top - panY) / zoom;
      const cur = document.getElementById('status-cursor');
      if (cur) cur.textContent = `x: ${Math.round(mx)}, y: ${Math.round(my)}`;
      if (isPanning) {
        panX = e.clientX - dragStart.x;
        panY = e.clientY - dragStart.y;
        renderAll();
        return;
      }
      if (drawingEdge && edgeTemp) {
        edgeTemp.setAttribute('x2', String(e.clientX - r.left));
        edgeTemp.setAttribute('y2', String(e.clientY - r.top));
        return;
      }
      if (isDragging && selectedNodes.length > 0) {
        const dx = (e.clientX - dragStart.x) / zoom,
          dy = (e.clientY - dragStart.y) / zoom;
        selectedNodes.forEach((n, i) => {
          n.x = snapToGrid(dragNodeStart[i].x + dx);
          n.y = snapToGrid(dragNodeStart[i].y + dy);
        });
        renderAll();
        updateStylePanel();
      }
      if (isResizing && currentHandle && selectedNodes.length > 0) {
        const n = selectedNodes[0];
        const dx = (e.clientX - dragStart.x) / zoom,
          dy = (e.clientY - dragStart.y) / zoom;
        const orig = dragNodeStart[0];
        if (currentHandle.includes('r')) n.w = Math.max(40, snapToGrid(orig.w + dx));
        if (currentHandle.includes('b')) n.h = Math.max(30, snapToGrid(orig.h + dy));
        if (currentHandle.includes('l')) {
          n.x = snapToGrid(orig.x + dx);
          n.w = Math.max(40, snapToGrid(orig.w - dx));
        }
        if (currentHandle.includes('t') && !currentHandle.includes('tr')) {
          n.y = snapToGrid(orig.y + dy);
          n.h = Math.max(30, snapToGrid(orig.h - dy));
        }
        if (currentHandle === 'tr') {
          n.w = Math.max(40, snapToGrid(orig.w + dx));
          n.y = snapToGrid(orig.y + dy);
          n.h = Math.max(30, snapToGrid(orig.h - dy));
        }
        renderAll();
        updateStylePanel();
      }
    }
    function canvasMouseUp(_e: any) {
      if (isPanning) {
        isPanning = false;
        canvas.style.cursor = activeTool === 'hand' ? 'grab' : 'default';
      }
      if (isDragging || isResizing) {
        saveUndoIfChanged();
        autosave();
      }
      isDragging = false;
      isResizing = false;
      currentHandle = null;
      if (drawingEdge) cancelEdge();
    }
    function nodeMouseDown(n: any, e: any) {
      if (e.button === 2) return;
      e.stopPropagation();
      if (activeTool === 'line' || activeTool === 'arrow' || activeTool === 'dashed') return;
      if (e.shiftKey) {
        if (selectedNodes.includes(n)) selectedNodes = selectedNodes.filter((x) => x !== n);
        else selectedNodes.push(n);
        updateSelection();
      } else {
        if (!selectedNodes.includes(n)) {
          clearSelection();
          selectedNodes = [n];
          updateSelection();
        }
      }
      isDragging = true;
      dragStart = { x: e.clientX, y: e.clientY };
      dragNodeStart = selectedNodes.map((nd) => ({ x: nd.x, y: nd.y, w: nd.w, h: nd.h }));
      switchTab('style');
      updateStylePanel();
    }
    function startResize(n: any, handle: string, e: any) {
      clearSelection();
      selectedNodes = [n];
      updateSelection();
      isResizing = true;
      currentHandle = handle;
      dragStart = { x: e.clientX, y: e.clientY };
      dragNodeStart = [{ x: n.x, y: n.y, w: n.w, h: n.h }];
    }
    function canvasDblClick(e: any) {
      if (e.target === canvas || e.target === svgCanvas || e.target.tagName === 'svg') {
        const r = canvas.getBoundingClientRect();
        const x = (e.clientX - r.left - panX) / zoom,
          y = (e.clientY - r.top - panY) / zoom;
        const t = activeTool === 'select' ? 'rect' : activeTool;
        if (['line', 'arrow', 'dashed', 'hand'].includes(t)) return;
        const dims = getDefaultDims(t);
        const nn = createNode(t, x - dims.w / 2, y - dims.h / 2, dims.w, dims.h);
        clearSelection();
        selectedNodes = [nn];
        updateSelection();
        setTimeout(() => editLabel(nn), 50);
      }
    }

    // ==================== SELECTION ====================
    function clearSelection() {
      selectedNodes.forEach((n) => {
        const el = document.getElementById(n.id);
        if (el) {
          el.classList.remove('selected');
          el.querySelectorAll('.handle').forEach((h) => ((h as HTMLElement).style.display = 'none'));
        }
      });
      selectedNodes = [];
      if (selectedEdge) {
        const el = document.getElementById('edge-' + selectedEdge.id);
        if (el) {
          const p = el.querySelector('path');
          if (p) p.setAttribute('stroke', selectedEdge.stroke || '#5b6ef5');
        }
      }
      selectedEdge = null;
      updateStatus();
      const ns = document.getElementById('no-selection');
      const sp = document.getElementById('style-props');
      if (ns) ns.style.display = 'block';
      if (sp) sp.style.display = 'none';
    }
    function updateSelection() {
      nodes.forEach((n) => {
        const el = document.getElementById(n.id);
        if (!el) return;
        if (selectedNodes.includes(n)) {
          el.classList.add('selected');
          el.querySelectorAll('.handle').forEach((h) => ((h as HTMLElement).style.display = 'block'));
        } else {
          el.classList.remove('selected');
          el.querySelectorAll('.handle').forEach((h) => ((h as HTMLElement).style.display = 'none'));
        }
      });
      updateStatus();
      const ns = document.getElementById('no-selection');
      const sp = document.getElementById('style-props');
      if (selectedNodes.length > 0) {
        if (ns) ns.style.display = 'none';
        if (sp) sp.style.display = 'block';
      } else {
        if (ns) ns.style.display = 'block';
        if (sp) sp.style.display = 'none';
      }
    }
    function updateStatus() {
      const n1 = document.getElementById('status-nodes');
      const n2 = document.getElementById('status-edges');
      const n3 = document.getElementById('status-selected');
      if (n1) n1.textContent = nodes.length + ' shape' + (nodes.length !== 1 ? 's' : '');
      if (n2) n2.textContent = edges.length + ' connection' + (edges.length !== 1 ? 's' : '');
      if (n3) n3.textContent = selectedNodes.length > 0 ? selectedNodes.length + ' selected' : 'Nothing selected';
    }

    // ==================== LABEL EDIT ====================
    function editLabel(n: any) {
      const el = document.getElementById(n.id);
      if (!el) return;
      const label = el.querySelector('.node-label') as HTMLDivElement | null;
      if (!label) return;
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.value = n.label;
      inp.style.cssText = `position:absolute;inset:4px;background:rgba(0,0,0,.7);border:1px solid var(--accent);border-radius:3px;color:var(--text);font-size:${n.fontSize * zoom
        }px;text-align:center;outline:none;font-family:'Sora',sans-serif;z-index:200;padding:2px 4px`;
      el.appendChild(inp);
      inp.focus();
      inp.select();
      const done = () => {
        n.label = inp.value;
        inp.remove();
        renderNode(n);
        if (selectedNodes.includes(n)) updateSelection();
        autosave();
      };
      inp.onblur = done;
      inp.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === 'Escape') {
          done();
          e.stopPropagation();
        }
      };
    }

    // ==================== SHAPE PANEL ====================
    function toggleSection(id: string) {
      const grid = document.getElementById('grid-' + id);
      if (grid) grid.style.display = grid.style.display === 'none' ? 'grid' : 'none';
    }
    function filterShapes(q: string) {
      document.querySelectorAll('.shape-item').forEach((item) => {
        const t = (item as HTMLElement).title || '';
        (item as HTMLElement).style.display =
          !q || t.toLowerCase().includes(q.toLowerCase()) ? 'flex' : 'none';
      });
    }
    function dragShape(type: string) {
      dragShape_type = type;
    }
    function handleDrop(e: any) {
      if (!dragShape_type) return;
      e.preventDefault();
      const r = canvas.getBoundingClientRect();
      const x = (e.clientX - r.left - panX) / zoom,
        y = (e.clientY - r.top - panY) / zoom;
      const dims = getDefaultDims(dragShape_type);
      createNode(dragShape_type, x - dims.w / 2, y - dims.h / 2, dims.w, dims.h);
      dragShape_type = null;
    }
    function quickInsert(type: string) {
      const ca = document.getElementById('canvas-area')!;
      const x = (ca.clientWidth / 2 - panX) / zoom - 60,
        y = (ca.clientHeight / 2 - panY) / zoom - 30;
      const dims = getDefaultDims(type);
      const n = createNode(type, x, y, dims.w, dims.h);
      clearSelection();
      selectedNodes = [n];
      updateSelection();
      switchTab('style');
      updateStylePanel();
    }
    function showMoreShapes() {
      toast('More shape libraries coming soon!');
    }

    // ==================== STYLE PANEL ====================
    function switchTab(t: string) {
      document.querySelectorAll('.panel-tab').forEach((el) => el.classList.remove('active'));
      const tab = document.getElementById('tab-' + t);
      if (tab) tab.classList.add('active');
      const bd = document.getElementById('body-diagram');
      const bs = document.getElementById('body-style');
      if (bd) bd.style.display = t === 'diagram' ? 'block' : 'none';
      if (bs) bs.style.display = t === 'style' ? 'block' : 'none';
    }
    function updateStylePanel() {
      if (selectedNodes.length === 0) return;
      const n = selectedNodes[0];
      const set = (id: string, v: any) => {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (el) el.value = v;
      };
      const setBg = (id: string, v: string) => {
        const el = document.getElementById(id);
        if (el) el.style.background = v;
      };
      set('prop-x', Math.round(n.x));
      set('prop-y', Math.round(n.y));
      set('prop-w', Math.round(n.w));
      set('prop-h', Math.round(n.h));
      set('fill-color', n.fill || '#1e2d5a');
      setBg('fill-swatch', n.fill || '#1e2d5a');
      set('fill-opacity', n.opacity || 100);
      set('stroke-color', n.stroke || '#5b6ef5');
      setBg('stroke-swatch', n.stroke || '#5b6ef5');
      set('stroke-width', n.strokeWidth || 1.5);
      set('font-size', n.fontSize || 13);
      set('font-color', n.fontColor || '#e8e8f0');
      set('corner-radius', n.rx || 4);
      const cv = document.getElementById('corner-val');
      if (cv) cv.textContent = (n.rx || 4) + 'px';
      ['solid', 'dashed', 'dotted'].forEach((s) =>
        document.getElementById('stroke-' + s)?.classList.remove('active')
      );
      document.getElementById('stroke-' + (n.strokeStyle || 'solid'))?.classList.add('active');
      ['bold', 'italic', 'underline'].forEach((s) => {
        const b = document.getElementById('font-' + s);
        if (b) b.classList.toggle('active', !!n['font' + s.charAt(0).toUpperCase() + s.slice(1)]);
      });
    }
    function updateNodeProp(prop: string, val: any) {
      selectedNodes.forEach((n) => {
        if (prop === 'x') n.x = parseFloat(val) || n.x;
        if (prop === 'y') n.y = parseFloat(val) || n.y;
        if (prop === 'w') n.w = Math.max(40, parseFloat(val) || n.w);
        if (prop === 'h') n.h = Math.max(30, parseFloat(val) || n.h);
      });
      renderAll();
      autosave();
    }
    function updateFill(v: string) {
      selectedNodes.forEach((n) => {
        n.fill = v;
      });
      const sw = document.getElementById('fill-swatch');
      if (sw) sw.style.background = v;
      renderAll();
      autosave();
    }
    function updateFillOpacity(v: any) {
      selectedNodes.forEach((n) => {
        n.opacity = parseInt(v);
      });
      renderAll();
      autosave();
    }
    function updateStroke(v: string) {
      selectedNodes.forEach((n) => {
        n.stroke = v;
      });
      const sw = document.getElementById('stroke-swatch');
      if (sw) sw.style.background = v;
      renderAll();
      autosave();
    }
    function updateStrokeWidth(v: any) {
      selectedNodes.forEach((n) => {
        n.strokeWidth = parseFloat(v);
      });
      renderAll();
      autosave();
    }
    function setStrokeStyle(s: string) {
      selectedNodes.forEach((n) => {
        n.strokeStyle = s;
      });
      ['solid', 'dashed', 'dotted'].forEach((x) =>
        document.getElementById('stroke-' + x)?.classList.remove('active')
      );
      document.getElementById('stroke-' + s)?.classList.add('active');
      renderAll();
      autosave();
    }
    function updateFontSize(v: any) {
      selectedNodes.forEach((n) => {
        n.fontSize = parseInt(v);
      });
      renderAll();
      autosave();
    }
    function updateFontColor(v: string) {
      selectedNodes.forEach((n) => {
        n.fontColor = v;
      });
      renderAll();
      autosave();
    }
    function updateCornerRadius(v: any) {
      selectedNodes.forEach((n) => {
        n.rx = parseInt(v);
      });
      const cv = document.getElementById('corner-val');
      if (cv) cv.textContent = v + 'px';
      renderAll();
      autosave();
    }
    function toggleFontStyle(s: string) {
      selectedNodes.forEach((n) => {
        const k = 'font' + s.charAt(0).toUpperCase() + s.slice(1);
        n[k] = !n[k];
      });
      document.getElementById('font-' + s)?.classList.toggle('active');
      renderAll();
      autosave();
    }
    function alignNodes(dir: string) {
      if (selectedNodes.length < 2) return;
      const xs = selectedNodes.map((n) => n.x),
        ys = selectedNodes.map((n) => n.y);
      const xe = selectedNodes.map((n) => n.x + n.w),
        ye = selectedNodes.map((n) => n.y + n.h);
      const minX = Math.min(...xs),
        maxXe = Math.max(...xe),
        minY = Math.min(...ys),
        maxYe = Math.max(...ye);
      const cx = (minX + maxXe) / 2,
        cy = (minY + maxYe) / 2;
      selectedNodes.forEach((n) => {
        if (dir === 'left') n.x = minX;
        if (dir === 'right') n.x = maxXe - n.w;
        if (dir === 'center') n.x = cx - n.w / 2;
        if (dir === 'top') n.y = minY;
        if (dir === 'bottom') n.y = maxYe - n.h;
        if (dir === 'middle') n.y = cy - n.h / 2;
      });
      renderAll();
      autosave();
    }

    // ==================== ACTIONS ====================
    function deleteSelected() {
      saveUndo();
      selectedNodes.forEach((n) => {
        nodes = nodes.filter((x) => x.id !== n.id);
        edges = edges.filter((e) => e.from !== n.id && e.to !== n.id);
        document.getElementById(n.id)?.remove();
        edges
          .filter((e) => e.from === n.id || e.to === n.id)
          .forEach((e) => document.getElementById('edge-' + e.id)?.remove());
      });
      if (selectedEdge) {
        edges = edges.filter((e) => e.id !== selectedEdge.id);
        document.getElementById('edge-' + selectedEdge.id)?.remove();
        selectedEdge = null;
      }
      clearSelection();
      renderAll();
      updateStatus();
      const hint = document.getElementById('canvas-hint');
      if (hint && nodes.length === 0) hint.style.display = 'block';
      autosave();
    }
    function duplicateSelected() {
      saveUndo();
      const newNodes = selectedNodes.map((n) => {
        const nn = { ...n, id: 'n' + nodeIdCounter++, x: n.x + 20, y: n.y + 20, zIndex: nodeIdCounter };
        nodes.push(nn);
        renderNode(nn);
        return nn;
      });
      clearSelection();
      selectedNodes = newNodes;
      updateSelection();
      updateStatus();
      autosave();
    }
    function bringToFront() {
      selectedNodes.forEach((n) => {
        n.zIndex = nodeIdCounter++;
        renderNode(n);
      });
      autosave();
    }
    function sendToBack() {
      selectedNodes.forEach((n) => {
        n.zIndex = 1;
        renderNode(n);
      });
      autosave();
    }
    function changeBgColor(v: string) {
      canvas.style.background = v;
    }

    // ==================== UNDO/REDO ====================
    function getState() {
      return JSON.parse(JSON.stringify({ nodes, edges }));
    }
    function saveUndo() {
      undoStack.push(getState());
      if (undoStack.length > 50) undoStack.shift();
      redoStack = [];
    }
    let lastSavedState: any = null;
    function saveUndoIfChanged() {
      const cur = JSON.stringify(getState());
      if (cur !== JSON.stringify(lastSavedState)) {
        saveUndo();
        lastSavedState = JSON.parse(cur);
      }
    }
    function undo() {
      if (undoStack.length === 0) return;
      redoStack.push(getState());
      const s = undoStack.pop();
      nodes = s.nodes;
      edges = s.edges;
      canvas.querySelectorAll('.node').forEach((el) => el.remove());
      svgCanvas.querySelectorAll('g').forEach((el) => el.remove());
      clearSelection();
      renderAll();
      updateStatus();
      const hint = document.getElementById('canvas-hint');
      if (hint) hint.style.display = nodes.length === 0 ? 'block' : 'none';
      toast('Undo');
      autosave();
    }
    function redo() {
      if (redoStack.length === 0) return;
      undoStack.push(getState());
      const s = redoStack.pop();
      nodes = s.nodes;
      edges = s.edges;
      canvas.querySelectorAll('.node').forEach((el) => el.remove());
      svgCanvas.querySelectorAll('g').forEach((el) => el.remove());
      clearSelection();
      renderAll();
      updateStatus();
      toast('Redo');
      autosave();
    }

    // ==================== CONTEXT MENU ====================
    function showContextMenu(e: any) {
      e.preventDefault();
      const m = document.getElementById('ctx-menu')!;
      m.style.display = 'block';
      m.style.left = e.clientX + 'px';
      m.style.top = e.clientY + 'px';
    }
    function hideContextMenu() {
      const m = document.getElementById('ctx-menu');
      if (m) m.style.display = 'none';
    }
    function ctxAction(a: string) {
      hideContextMenu();
      if (a === 'delete') deleteSelected();
      else if (a === 'duplicate') duplicateSelected();
      else if (a === 'front') bringToFront();
      else if (a === 'back') sendToBack();
      else if (a === 'select-all') {
        selectedNodes = [...nodes];
        updateSelection();
      } else if (a === 'copy-style') {
        if (selectedNodes.length > 0) {
          const n = selectedNodes[0];
          copiedStyle = {
            fill: n.fill,
            stroke: n.stroke,
            strokeWidth: n.strokeWidth,
            fontSize: n.fontSize,
            fontColor: n.fontColor,
            rx: n.rx,
            opacity: n.opacity,
            strokeStyle: n.strokeStyle,
          };
          toast('Style copied');
        }
      } else if (a === 'paste-style') {
        if (copiedStyle && selectedNodes.length > 0) {
          selectedNodes.forEach((n) => Object.assign(n, copiedStyle));
          renderAll();
          toast('Style pasted');
        }
      } else if (a === 'group') toast('Group: select multiple shapes and group them');
      else if (a === 'paste') pasteClipboard();
      else if (a === 'copy') copyClipboard();
    }
    document.addEventListener('click', hideContextMenu);

    // ==================== EXPORT ====================
    function openExportModal() {
      document.getElementById('export-modal')?.classList.add('open');
    }
    function closeExportModal() {
      document.getElementById('export-modal')?.classList.remove('open');
    }
    function exportAs(fmt: string) {
      closeExportModal();
      const titleEl = document.getElementById('diagram-title') as HTMLInputElement | null;
      const fileBase = (titleEl?.value || 'diagram').trim().replace(/[^\w\d-]+/g, '_').toLowerCase() || 'diagram';
      if (fmt === 'json') {
        const data = JSON.stringify({ nodes, edges }, null, 2);
        download(fileBase + '.json', 'application/json', data);
      } else if (fmt === 'xml') {
        let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/>\n';
        nodes.forEach((n) => {
          xml += `<mxCell id="${n.id}" value="${n.label}" style="shape=${n.type};fillColor=${n.fill};strokeColor=${n.stroke};" vertex="1" parent="1"><mxGeometry x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" as="geometry"/></mxCell>\n`;
        });
        edges.forEach((e) => {
          xml += `<mxCell id="${e.id}" style="edgeStyle=orthogonalEdgeStyle;" edge="1" source="${e.from}" target="${e.to}" parent="1"><mxGeometry relative="1" as="geometry"/></mxCell>\n`;
        });
        xml += '</root></mxGraphModel>';
        download(fileBase + '.xml', 'application/xml', xml);
      } else if (fmt === 'svg') {
        // IMPROVED: build a clean self-contained SVG with all nodes + edges
        const svg = buildExportSVG();
        download(fileBase + '.svg', 'image/svg+xml', svg);
      } else if (fmt === 'html') {
        const html = `<!DOCTYPE html><html><head><title>${titleEl?.value || 'Diagram'
          }</title></head><body style="margin:0;background:#1a1a1e">${canvas.innerHTML}</body></html>`;
        download(fileBase + '.html', 'text/html', html);
      } else if (fmt === 'png') {
        // IMPROVED: actual PNG export using canvas rasterization
        exportPNG(fileBase);
        return;
      }
      toast(`Exported as ${fmt.toUpperCase()}`);
    }
    function download(name: string, type: string, content: string) {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([content], { type }));
      a.download = name;
      a.click();
      URL.revokeObjectURL(a.href);
    }

    // NEW: build clean export SVG
    function buildExportSVG(): string {
      if (nodes.length === 0) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><text x="50%" y="50%" text-anchor="middle" fill="#888">Empty diagram</text></svg>';
      }
      const xs = nodes.map((n) => n.x),
        ys = nodes.map((n) => n.y);
      const xe = nodes.map((n) => n.x + n.w),
        ye = nodes.map((n) => n.y + n.h);
      const pad = 40;
      const minX = Math.min(...xs) - pad,
        minY = Math.min(...ys) - pad;
      const W = Math.max(...xe) - minX + pad,
        H = Math.max(...ye) - minY + pad;
      const oldZ = zoom,
        opx = panX,
        opy = panY;
      zoom = 1;
      panX = -minX;
      panY = -minY;
      let inner = `<defs><marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0, 8 3, 0 6" fill="#5b6ef5"/></marker></defs>`;
      // edges first
      edges.forEach((e2) => {
        const fn = nodes.find((n) => n.id === e2.from);
        const tn = nodes.find((n) => n.id === e2.to);
        if (!fn || !tn) return;
        const fp = getPortPos(fn, e2.fromSide);
        const tp = getPortPos(tn, e2.toSide || 'top');
        const dx = tp.x - fp.x;
        const cx1 = fp.x + dx / 3,
          cy1 = fp.y,
          cx2 = tp.x - dx / 3,
          cy2 = tp.y;
        const dash = e2.type === 'dashed' ? ' stroke-dasharray="8 4"' : '';
        const marker = e2.type === 'arrow' || e2.type === 'dashed' ? ' marker-end="url(#arrowhead)"' : '';
        inner += `<path d="M${fp.x},${fp.y} C${cx1},${cy1} ${cx2},${cy2} ${tp.x},${tp.y}" fill="none" stroke="${e2.stroke || '#5b6ef5'
          }" stroke-width="${e2.strokeWidth || 1.5}"${dash}${marker}/>`;
      });
      // nodes
      nodes.forEach((n) => {
        const opA = n.opacity / 100;
        const sw = n.strokeWidth;
        const sda =
          n.strokeStyle === 'dashed'
            ? `stroke-dasharray="${Math.max(6, n.w / 6)} ${Math.max(3, n.w / 12)}"`
            : n.strokeStyle === 'dotted'
              ? `stroke-dasharray="2 4"`
              : '';
        const shape = getShapeSVG(n, opA, sw, sda);
        const inner2 = shape.replace(/^<svg[^>]*>|<\/svg>$/g, '');
        inner += `<g transform="translate(${n.x + panX},${n.y + panY})">${inner2}`;
        if (n.label) {
          inner += `<text x="${n.w / 2}" y="${n.h / 2}" text-anchor="middle" dominant-baseline="middle" font-family="Sora,sans-serif" font-size="${n.fontSize}" font-weight="${n.fontBold ? 600 : 400
            }" font-style="${n.fontItalic ? 'italic' : 'normal'}" fill="${n.fontColor}">${escapeXML(n.label)}</text>`;
        }
        inner += `</g>`;
      });
      zoom = oldZ;
      panX = opx;
      panY = opy;
      return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="background:#1a1a1e">${inner}</svg>`;
    }
    function escapeXML(s: string) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // NEW: PNG export via SVG → canvas rasterization (no external libs)
    function exportPNG(fileBase: string) {
      const svgStr = buildExportSVG();
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        const scale = 2;
        const c = document.createElement('canvas');
        c.width = img.width * scale;
        c.height = img.height * scale;
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = '#1a1a1e';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        c.toBlob((b) => {
          if (!b) {
            toast('PNG export failed');
            return;
          }
          const a = document.createElement('a');
          a.href = URL.createObjectURL(b);
          a.download = fileBase + '.png';
          a.click();
          URL.revokeObjectURL(a.href);
          URL.revokeObjectURL(url);
          toast('Exported as PNG');
        }, 'image/png');
      };
      img.onerror = () => {
        toast('PNG export failed');
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }

    // ==================== MINIMAP ====================
    function drawMinimap() {
      const mc = document.getElementById('minimap-canvas') as HTMLCanvasElement;
      if (!mc) return;
      const ctx = mc.getContext('2d')!;
      ctx.clearRect(0, 0, 140, 90);
      ctx.fillStyle = '#222228';
      ctx.fillRect(0, 0, 140, 90);
      if (nodes.length === 0) return;
      const xs = nodes.map((n) => n.x),
        ys = nodes.map((n) => n.y),
        xe = nodes.map((n) => n.x + n.w),
        ye = nodes.map((n) => n.y + n.h);
      const minX = Math.min(...xs),
        minY = Math.min(...ys),
        maxX = Math.max(...xe),
        maxY = Math.max(...ye);
      const scale = Math.min(130 / (maxX - minX + 60), 80 / (maxY - minY + 60));
      nodes.forEach((n) => {
        ctx.fillStyle = n.fill || '#2a3a6e';
        ctx.strokeStyle = n.stroke || '#5b6ef5';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.rect((n.x - minX + 30) * scale + 5, (n.y - minY + 30) * scale + 5, n.w * scale, n.h * scale);
        ctx.fill();
        ctx.stroke();
      });
    }

    // ==================== MENU ACTIONS ====================
    function showMenu(m: string) {
      if (m === 'file') openFileMenu();
      else if (m === 'edit') toast('Edit: use Ctrl+Z/Y, Ctrl+C/V, Del');
      else if (m === 'view') toggleMinimap();
      else if (m === 'arrange') toast('Arrange: select shapes and use the alignment buttons in the Style panel');
      else toast(`${m.charAt(0).toUpperCase() + m.slice(1)} menu — full menus coming soon!`);
    }
    function openFileMenu() {
      // NEW: file actions popup
      if (confirm('New diagram? Unsaved changes will be lost.')) {
        nodes = [];
        edges = [];
        canvas.querySelectorAll('.node').forEach((el) => el.remove());
        svgCanvas.querySelectorAll('g').forEach((el) => el.remove());
        clearSelection();
        renderAll();
        updateStatus();
        const hint = document.getElementById('canvas-hint');
        if (hint) hint.style.display = 'block';
        autosave();
      }
    }
    function insertTable() {
      const n = createNode('umlClass', 200, 200, 160, 100, 'Table\n─────\nid: int\nname: string');
      clearSelection();
      selectedNodes = [n];
      updateSelection();
    }
    function insertImage() {
      // IMPROVED: real file picker
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'image/*';
      inp.onchange = () => {
        const file = inp.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          const n = createNode('rect', 200, 200, 200, 140, '');
          n.image = reader.result as string;
          n.fill = 'transparent';
          n.stroke = 'transparent';
          // monkey-patch render: override label area with <img>
          const el = document.getElementById(n.id);
          if (el) {
            const shape = el.querySelector('.node-shape') as HTMLDivElement;
            if (shape)
              shape.innerHTML = `<img src="${n.image}" style="width:100%;height:100%;object-fit:contain" alt="diagram image"/>`;
          }
          autosave();
        };
        reader.readAsDataURL(file);
      };
      inp.click();
    }

    // ==================== KEYBOARD ====================
    function copyClipboard() {
      if (selectedNodes.length === 0) return;
      clipboardNodes = JSON.parse(JSON.stringify(selectedNodes));
      toast(`Copied ${selectedNodes.length} shape(s)`);
    }
    function pasteClipboard() {
      if (clipboardNodes.length === 0) return;
      saveUndo();
      const newNodes: any[] = [];
      clipboardNodes.forEach((n: any) => {
        const nn = { ...n, id: 'n' + nodeIdCounter++, x: n.x + 30, y: n.y + 30, zIndex: nodeIdCounter };
        nodes.push(nn);
        renderNode(nn);
        newNodes.push(nn);
      });
      clearSelection();
      selectedNodes = newNodes;
      updateSelection();
      updateStatus();
      autosave();
    }

    document.addEventListener('keydown', (e) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Delete' || e.key === 'Backspace') deleteSelected();
      if (e.key === 'r' || e.key === 'R') setTool('rect');
      if (e.key === 'e' || e.key === 'E') setTool('ellipse');
      if (e.key === 'd' || e.key === 'D') setTool('diamond');
      if (e.key === 'a' || e.key === 'A') setTool('arrow');
      if (e.key === 'l' || e.key === 'L') setTool('line');
      if (e.key === 't' || e.key === 'T') setTool('text');
      if (e.key === 'v' || e.key === 'V') setTool('select');
      if (e.key === 'h' || e.key === 'H') setTool('hand');
      if (e.key === '?') setHelpOpen(true);
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          undo();
        }
        if (e.key === 'y' || e.key === 'Z') {
          e.preventDefault();
          redo();
        }
        if (e.key === 'd') {
          e.preventDefault();
          duplicateSelected();
        }
        if (e.key === 'a') {
          e.preventDefault();
          selectedNodes = [...nodes];
          updateSelection();
        }
        if (e.key === '+' || e.key === '=') {
          e.preventDefault();
          zoomIn();
        }
        if (e.key === '-') {
          e.preventDefault();
          zoomOut();
        }
        if (e.key === '0') {
          e.preventDefault();
          resetZoom();
        }
        if (e.key === 's') {
          e.preventDefault();
          autosave();
          toast('Diagram saved!');
        }
        if (e.key === 'c') {
          e.preventDefault();
          copyClipboard();
        }
        if (e.key === 'v') {
          e.preventDefault();
          pasteClipboard();
        }
        if (e.key === 'e') {
          e.preventDefault();
          openExportModal();
        }
      }
      if (e.key === 'Escape') {
        clearSelection();
        setTool('select');
        cancelEdge();
      }
      if (
        ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key) &&
        selectedNodes.length > 0
      ) {
        e.preventDefault();
        const d = e.shiftKey ? 10 : GRID;
        selectedNodes.forEach((n) => {
          if (e.key === 'ArrowLeft') n.x -= d;
          if (e.key === 'ArrowRight') n.x += d;
          if (e.key === 'ArrowUp') n.y -= d;
          if (e.key === 'ArrowDown') n.y += d;
        });
        renderAll();
        updateStylePanel();
        autosave();
      }
    });

    // ==================== TOAST ====================
    let toastTimer: any;
    function toast(msg: string) {
      const t = document.getElementById('toast');
      if (!t) return;
      t.textContent = msg;
      t.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => t.classList.remove('show'), 2000);
    }

    // ==================== NODE HOVER for edge drawing ====================
    canvas.addEventListener('mouseover', (e: any) => {
      const nodeEl = e.target.closest('.node');
      if (drawingEdge && nodeEl) {
        const n = nodes.find((x) => x.id === nodeEl.id);
        if (n && edgeStart && n.id !== edgeStart.node.id) nodeEl.style.outline = '2px solid var(--accent)';
      }
    });
    canvas.addEventListener('mouseout', (e: any) => {
      const nodeEl = e.target.closest('.node');
      if (nodeEl) nodeEl.style.outline = 'none';
    });
    canvas.addEventListener('mouseup', (e: any) => {
      if (drawingEdge) {
        const nodeEl = e.target.closest('.node');
        if (nodeEl) {
          const n = nodes.find((x) => x.id === nodeEl.id);
          if (n) finishEdge(n);
          else cancelEdge();
        } else cancelEdge();
      }
    });

    // ==================== AUTOSAVE / RESTORE ====================
    function autosave() {
      try {
        const titleEl = document.getElementById('diagram-title') as HTMLInputElement | null;
        const data = JSON.stringify({ nodes, edges, title: titleEl?.value || 'Untitled Diagram' });
        localStorage.setItem(STORAGE_KEY, data);
      } catch { }
    }
    function restore() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (!data || !Array.isArray(data.nodes)) return;
        nodes = data.nodes;
        edges = data.edges || [];
        if (data.title) {
          const t = document.getElementById('diagram-title') as HTMLInputElement | null;
          if (t) t.value = data.title;
        }
        // bump counters past existing IDs
        nodes.forEach((n) => {
          const num = parseInt((n.id || '').replace(/^n/, '')) || 0;
          nodeIdCounter = Math.max(nodeIdCounter, num + 1);
        });
        edges.forEach((e: any) => {
          const num = parseInt((e.id || '').replace(/^e/, '')) || 0;
          edgeIdCounter = Math.max(edgeIdCounter, num + 1);
        });
        renderAll();
        updateStatus();
        const hint = document.getElementById('canvas-hint');
        if (hint && nodes.length > 0) hint.style.display = 'none';
        toast('Diagram restored from autosave');
      } catch { }
    }

    // ==================== EXPOSE TO WINDOW ====================
    Object.assign(window, {
      setTool,
      toggleGrid,
      toggleGridOpt,
      zoomIn,
      zoomOut,
      resetZoom,
      fitPage,
      handleWheel,
      toggleMinimap,
      undo,
      redo,
      deleteSelected,
      duplicateSelected,
      bringToFront,
      sendToBack,
      changeBgColor,
      filterShapes,
      dragShape,
      handleDrop,
      quickInsert,
      showMoreShapes,
      switchTab,
      updateNodeProp,
      updateFill,
      updateFillOpacity,
      updateStroke,
      updateStrokeWidth,
      setStrokeStyle,
      updateFontSize,
      updateFontColor,
      updateCornerRadius,
      toggleFontStyle,
      alignNodes,
      showContextMenu,
      ctxAction,
      openExportModal,
      closeExportModal,
      exportAs,
      showMenu,
      insertTable,
      insertImage,
      toggleSection,
      canvasMouseDown,
      canvasMouseMove,
      canvasMouseUp,
      canvasDblClick,
      copyClipboard,
      pasteClipboard,
      __autosave: autosave,
      __restore: restore,
    });

    // ==================== INIT ====================
    const hint = document.getElementById('canvas-hint');
    if (hint) hint.style.display = 'block';
    setTool('select');
    restore();

    // Title autosave
    const titleEl = document.getElementById('diagram-title') as HTMLInputElement | null;
    if (titleEl) titleEl.addEventListener('input', () => autosave());
  }, []);


  return (
    <>
      <Head>
        <title>Thefreeaitools – Free Online Diagram Editor | Flowcharts, UML, ERD, Mind Maps</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="description"
          content="Free online diagram editor: build flowcharts, UML, ERD, network diagrams and mind maps in your browser. Drag-and-drop shapes, autosave, and export to SVG, PNG, XML, JSON or HTML. No signup required."
        />
        <meta
          name="keywords"
          content="diagram editor, flowchart maker, UML diagram online, ER diagram tool, network diagram, mind map, online diagram tool, free diagram software, draw.io alternative, lucidchart alternative, mermaid alternative, free flowchart maker, diagram generator AI"
        />
        <meta name="author" content="TheFreeAITools" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1" />
        <meta name="googlebot" content="index,follow" />
        <meta name="application-name" content="Thefreeaitools Diagram Editor" />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="Thefreeaitools – Free Online Diagram Editor" />
        <meta
          property="og:description"
          content="Create professional flowcharts, UML, ERD, mind maps and network diagrams online for free. Autosave + multiple export formats."
        />
        <meta property="og:url" content="https://www.thefreeaitools.com/tools/diagramm-generator-ai" />
        <meta property="og:site_name" content="TheFreeAITools" />
        <meta property="og:image" content="https://www.thefreeaitools.com/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Thefreeaitools online diagram editor preview" />
        <meta property="og:locale" content="en_US" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Thefreeaitools – Free Online Diagram Editor" />
        <meta name="twitter:description" content="Flowcharts, UML, ERD, mind maps and network diagrams. Free, fast, no signup." />
        <meta name="twitter:image" content="https://www.thefreeaitools.com/og-image.png" />
        <meta name="twitter:site" content="@thefreeaitools" />

        <link rel="canonical" href="https://www.thefreeaitools.com/tools/flowchart-maker" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Sora:wght@400;500;600&display=swap"
          rel="stylesheet"
        />

      </Head>

      {/* Tailwind CDN (preserved from original) */}
      <Script src="https://cdn.tailwindcss.com" strategy="afterInteractive" />

      {/* TITLE BAR */}
      <div id="titlebar">
        <div className="logo">
          <div className="logo-icon">
            <svg viewBox="0 0 16 16">
              <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H9zM9 9h5v5H9z" />
            </svg>
          </div>
          <span className="logo-text">Thefreeaitools</span>
        </div>
        <div className="menus">
          <button className="menu-btn" onClick={() => window.showMenu?.('file')}>File</button>
          <button className="menu-btn" onClick={() => window.showMenu?.('edit')}>Edit</button>
          <button className="menu-btn" onClick={() => window.showMenu?.('view')}>View</button>
          <button className="menu-btn" onClick={() => window.showMenu?.('arrange')}>Arrange</button>
          <button className="menu-btn" onClick={() => window.openExportModal?.()}>Extras</button>
          <button className="menu-btn" onClick={() => setHelpOpen(true)}>Help</button>
        </div>
        <div
          style={{
            padding: '0 8px',
            borderRight: '1px solid var(--border)',
            borderLeft: '1px solid var(--border)',
            marginLeft: 8,
          }}
        >
          <input id="diagram-title" className="title-input" defaultValue="Untitled Diagram" />
        </div>
        <div className="spacer"></div>
        <div className="tb-actions">
          <div className="tb-icon-btn" title="Undo (Ctrl+Z)" onClick={() => window.undo?.()}>
            <svg viewBox="0 0 16 16">
              <path d="M3 8c0-2.76 2.24-5 5-5 1.93 0 3.6 1.1 4.44 2.7l1.34-.78A6.5 6.5 0 108 1.5V0L4 2.5 8 5V3.5c2.48 0 4.5 2.02 4.5 4.5S10.48 12.5 8 12.5 3.5 10.48 3.5 8H2c0 3.31 2.69 6 6 6s6-2.69 6-6-2.69-6-6-6C4.69 2 2 4.69 2 8" />
            </svg>
          </div>
          <div className="tb-icon-btn" title="Redo (Ctrl+Y)" onClick={() => window.redo?.()}>
            <svg viewBox="0 0 16 16">
              <path d="M13 8c0-2.76-2.24-5-5-5-1.93 0-3.6 1.1-4.44 2.7L2.22 4.92A6.5 6.5 0 1 0 8 1.5V0L12 2.5 8 5V3.5C5.52 3.5 3.5 5.52 3.5 8S5.52 12.5 8 12.5 12.5 10.48 12.5 8H14c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6c3.31 0 6 2.69 6 6" />
            </svg>
          </div>
          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 2px' }}></div>
          <div className="tb-icon-btn" title="Theme" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            <svg viewBox="0 0 16 16">
              <path d="M8 2a6 6 0 100 12V2z" />
            </svg>
          </div>
          <div className="tb-icon-btn" title="Export (Ctrl+E)" onClick={() => window.openExportModal?.()}>
            <svg viewBox="0 0 16 16">
              <path
                d="M8 1v8M4 6l4 4 4-4M2 12v1a1 1 0 001 1h10a1 1 0 001-1v-1"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="tb-icon-btn" title="Share">
            <svg viewBox="0 0 16 16">
              <circle cx="13" cy="3" r="2" stroke="currentColor" fill="none" strokeWidth="1.5" />
              <circle cx="3" cy="8" r="2" stroke="currentColor" fill="none" strokeWidth="1.5" />
              <circle cx="13" cy="13" r="2" stroke="currentColor" fill="none" strokeWidth="1.5" />
              <path d="M5 7l6-3M5 9l6 3" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </div>
          <button
            className="share-btn"
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'Diagram', url: location.href }).catch(() => { });
              } else {
                navigator.clipboard?.writeText(location.href);
              }
            }}
          >
            Share
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div id="toolbar">
        <div className="tool-group">
          <div className="tool-btn active" id="tool-select" title="Select (V)" onClick={() => window.setTool?.('select')}>
            <svg viewBox="0 0 16 16"><path d="M2 2l4.5 12 2.5-4.5L13 7.5z" /></svg>
          </div>
          <div className="tool-btn" id="tool-hand" title="Hand / Pan (H)" onClick={() => window.setTool?.('hand')}>
            <svg viewBox="0 0 16 16">
              <path
                d="M8 1.5v7M5.5 4V3a1 1 0 0 0-2 0v5m9-4v4M10.5 4V3a1 1 0 0 0-2 0v1m0 0V3a1 1 0 0 0-2 0v1"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M3.5 8v3a4 4 0 0 0 4 4h1a4 4 0 0 0 4-4V6"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
        <div className="tool-sep"></div>
        <div className="tool-group">
          <div className="tool-btn" id="tool-rect" title="Rectangle (R)" onClick={() => window.setTool?.('rect')}>
            <svg viewBox="0 0 16 16"><rect x="2" y="4" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
          </div>
          <div className="tool-btn" id="tool-ellipse" title="Ellipse (E)" onClick={() => window.setTool?.('ellipse')}>
            <svg viewBox="0 0 16 16"><ellipse cx="8" cy="8" rx="6" ry="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
          </div>
          <div className="tool-btn" id="tool-diamond" title="Diamond (D)" onClick={() => window.setTool?.('diamond')}>
            <svg viewBox="0 0 16 16"><path d="M8 2l6 6-6 6-6-6z" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
          </div>
          <div className="tool-btn" id="tool-triangle" title="Triangle" onClick={() => window.setTool?.('triangle')}>
            <svg viewBox="0 0 16 16"><path d="M8 2l6 11H2z" stroke="currentColor" strokeWidth="1.5" fill="none" /></svg>
          </div>
          <div className="tool-btn" id="tool-cylinder" title="Cylinder / Database" onClick={() => window.setTool?.('cylinder')}>
            <svg viewBox="0 0 16 16">
              <ellipse cx="8" cy="4" rx="5" ry="2" stroke="currentColor" strokeWidth="1.3" fill="none" />
              <path d="M3 4v8" stroke="currentColor" strokeWidth="1.3" fill="none" />
              <path d="M13 4v8" stroke="currentColor" strokeWidth="1.3" fill="none" />
              <ellipse cx="8" cy="12" rx="5" ry="2" stroke="currentColor" strokeWidth="1.3" fill="none" />
            </svg>
          </div>
          <div className="tool-btn" id="tool-hexagon" title="Hexagon" onClick={() => window.setTool?.('hexagon')}>
            <svg viewBox="0 0 16 16"><path d="M8 1l6 3.5v7L8 15l-6-3.5v-7z" stroke="currentColor" strokeWidth="1.4" fill="none" /></svg>
          </div>
          <div className="tool-btn" id="tool-parallelogram" title="Parallelogram" onClick={() => window.setTool?.('parallelogram')}>
            <svg viewBox="0 0 16 16">
              <path d="M4 12L1 4h7l3 8z" stroke="currentColor" strokeWidth="1.4" fill="none" />
              <path d="M8 4l3 0 2 8h-2" stroke="currentColor" strokeWidth="1.4" fill="none" />
            </svg>
          </div>
          <div className="tool-btn" id="tool-text" title="Text (T)" onClick={() => window.setTool?.('text')}>
            <svg viewBox="0 0 16 16"><path d="M3 3h10M8 3v10M5 13h6" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" /></svg>
          </div>
        </div>
        <div className="tool-sep"></div>
        <div className="tool-group">
          <div className="tool-btn" id="tool-line" title="Line (L)" onClick={() => window.setTool?.('line')}>
            <svg viewBox="0 0 16 16"><path d="M3 13L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <div className="tool-btn" id="tool-arrow" title="Arrow (A)" onClick={() => window.setTool?.('arrow')}>
            <svg viewBox="0 0 16 16"><path d="M3 13L13 3M9 3h4v4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="tool-btn" id="tool-dashed" title="Dashed Arrow" onClick={() => window.setTool?.('dashed')}>
            <svg viewBox="0 0 16 16">
              <path d="M3 13L13 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="3 2" />
              <path d="M9 3h4v4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="tool-sep"></div>
        <div className="tool-group">
          <div className="tool-btn" title="Table" onClick={() => window.insertTable?.()}>
            <svg viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M2 6h12M7 2v12" stroke="currentColor" strokeWidth="1.3" /></svg>
          </div>
          <div className="tool-btn" title="Image" onClick={() => window.insertImage?.()}>
            <svg viewBox="0 0 16 16">
              <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" />
              <circle cx="5.5" cy="6.5" r="1.2" stroke="currentColor" strokeWidth="1.2" fill="none" />
              <path d="M2 11l3.5-3.5 3 3 2-2 3.5 3.5" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </div>
        <div className="tool-sep"></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
          <div className="tool-btn" title="Zoom Out" onClick={() => window.zoomOut?.()}>
            <svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M5 7h4M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <div className="zoom-display" id="zoom-level" onClick={() => window.resetZoom?.()}>100%</div>
          <div className="tool-btn" title="Zoom In" onClick={() => window.zoomIn?.()}>
            <svg viewBox="0 0 16 16"><circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M5 7h4M7 5v4M10.5 10.5l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          </div>
          <div className="tool-btn" title="Fit Page" onClick={() => window.fitPage?.()}>
            <svg viewBox="0 0 16 16"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></svg>
          </div>
          <div className="tool-btn" title="Toggle Grid" onClick={() => window.toggleGrid?.()} id="grid-btn">
            <svg viewBox="0 0 16 16"><path d="M1 5h14M1 10h14M5 1v14M10 1v14" stroke="currentColor" strokeWidth="1.2" /></svg>
          </div>
          <div className="tool-btn" title="Minimap" onClick={() => window.toggleMinimap?.()}>
            <svg viewBox="0 0 16 16"><rect x="1" y="3" width="14" height="10" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /><rect x="3" y="5" width="4" height="3" rx=".5" fill="currentColor" opacity=".5" /></svg>
          </div>
        </div>
        <div style={{ flex: 1 }}></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div className="tool-btn" title="Delete Selected (Del)" onClick={() => window.deleteSelected?.()}>
            <svg viewBox="0 0 16 16"><path d="M4 5h8l-1 8H5zM2 5h12M6 3h4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="tool-btn" title="Duplicate (Ctrl+D)" onClick={() => window.duplicateSelected?.()}>
            <svg viewBox="0 0 16 16"><rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M11 5V4a1 1 0 00-1-1H4a1 1 0 00-1 1v6a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
          </div>
          <div className="tool-btn" title="Bring to Front" onClick={() => window.bringToFront?.()}>
            <svg viewBox="0 0 16 16"><rect x="5" y="1" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /><rect x="1" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" opacity=".4" /></svg>
          </div>
          <div className="tool-btn" title="Send to Back" onClick={() => window.sendToBack?.()}>
            <svg viewBox="0 0 16 16"><rect x="1" y="1" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" opacity=".4" /><rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div id="main">
        {/* LEFT PANEL */}
        <div id="left-panel">
          <div id="search-box" style={{ position: 'relative' }}>
            <div className="search-icon"><svg viewBox="0 0 16 16"><circle cx="6.5" cy="6.5" r="4" stroke="currentColor" strokeWidth="1.5" fill="none" /><path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></div>
            <input placeholder="Search shapes…" id="shape-search" onInput={(e) => window.filterShapes?.((e.target as HTMLInputElement).value)} />
          </div>
          <div id="shape-panel">
            {(
              [
                {
                  id: 'general',
                  title: 'General',
                  items: [
                    ['Rectangle', 'rect', <rect key="r" x="3" y="6" width="18" height="12" rx="1.5" />],
                    ['Rounded Rect', 'roundrect', <rect key="r" x="3" y="6" width="18" height="12" rx="4" />],
                    ['Text', 'text', <path key="r" d="M5 6h14M12 6v12M8 18h8" strokeLinecap="round" />],
                    [
                      'Note/Sticky',
                      'note',
                      <>
                        <path key="r1" d="M5 5h14v10l-4 4H5z" />
                        <path key="r2" d="M15 15l4 0-4 4z" fill="none" strokeWidth="0.5" />
                      </>,
                    ],
                    ['Ellipse', 'ellipse', <ellipse key="r" cx="12" cy="12" rx="9" ry="6" />],
                    ['Diamond', 'diamond', <path key="r" d="M12 3l9 9-9 9-9-9z" />],
                    ['Triangle', 'triangle', <path key="r" d="M12 4l9 16H3z" />],
                    ['Hexagon', 'hexagon', <path key="r" d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />],
                    ['Parallelogram', 'parallelogram', <path key="r" d="M6 18l3-12h9l-3 12z" />],
                    [
                      'Cylinder',
                      'cylinder',
                      <>
                        <ellipse key="r1" cx="12" cy="6" rx="7" ry="2.5" />
                        <path key="r2" d="M5 6v12" />
                        <path key="r3" d="M19 6v12" />
                        <ellipse key="r4" cx="12" cy="18" rx="7" ry="2.5" />
                      </>,
                    ],
                    ['Cloud', 'cloud', <path key="r" d="M6 19a4 4 0 01-.5-8 5 5 0 019.9-1 3.5 3.5 0 01.1 9H6z" />],
                    ['Star', 'star', <path key="r" d="M12 2l2.9 6.3L22 9.3l-5 4.9 1.2 6.8L12 17.8l-6.2 3.2L7 14.2 2 9.3l7.1-1z" />],
                    ['Arrow Right', 'arrowRight', <path key="r" d="M5 12h14M13 6l6 6-6 6" />],
                    ['Cross/Plus', 'cross', <path key="r" d="M12 5v14M5 12h14" />],
                    ['Frame', 'frame', <rect key="r" x="3" y="3" width="18" height="18" rx="1" fill="none" strokeWidth="2.5" />],
                    [
                      'Group',
                      'group',
                      <>
                        <rect key="r1" x="3" y="8" width="9" height="8" rx="1" opacity=".5" />
                        <rect key="r2" x="10" y="5" width="9" height="8" rx="1" opacity=".5" />
                      </>,
                    ],
                  ],
                },
                {
                  id: 'flowchart',
                  title: 'Flowchart',
                  items: [
                    ['Process', 'process', <rect key="r" x="3" y="7" width="18" height="10" rx="1" />],
                    ['Decision', 'decision', <path key="r" d="M12 3l9 9-9 9-9-9z" />],
                    ['Terminator', 'terminator', <rect key="r" x="4" y="7" width="16" height="10" rx="5" />],
                    ['Data/IO', 'parallelogram', <path key="r" d="M7 17l3-10h7l-3 10z" />],
                    [
                      'Database',
                      'cylinder',
                      <>
                        <ellipse key="r1" cx="12" cy="6" rx="7" ry="2.5" />
                        <path key="r2" d="M5 6v12" />
                        <path key="r3" d="M19 6v12" />
                        <ellipse key="r4" cx="12" cy="18" rx="7" ry="2.5" />
                      </>,
                    ],
                    ['Manual Input', 'manualInput', <path key="r" d="M3 9l5-5h13v15H3z" />],
                    ['Document', 'document', <path key="r" d="M3 7h18v11c-2 2-4-1-6 1s-4-1-6 1-4-1-6 0V7z" />],
                    ['Connector', 'connector', <circle key="r" cx="12" cy="12" r="5" />],
                  ],
                },
                {
                  id: 'uml',
                  title: 'UML',
                  items: [
                    [
                      'Class',
                      'umlClass',
                      <>
                        <rect key="r1" x="3" y="3" width="18" height="18" rx="1" fill="none" strokeWidth="1.5" />
                        <path key="r2" d="M3 8h18M3 13h18" />
                      </>,
                    ],
                    [
                      'Interface',
                      'umlInterface',
                      <>
                        <rect key="r1" x="3" y="3" width="18" height="18" rx="5" fill="none" strokeWidth="1.5" />
                        <path key="r2" d="M3 9h18" />
                      </>,
                    ],
                    [
                      'Actor',
                      'actor',
                      <>
                        <circle key="r1" cx="12" cy="6" r="2.5" />
                        <path key="r2" d="M7 21l2.5-7h5l2.5 7M8 12h8M12 14v3" />
                      </>,
                    ],
                    ['Use Case', 'ellipse', <ellipse key="r" cx="12" cy="12" rx="9" ry="5.5" />],
                    [
                      'Lifeline',
                      'lifeline',
                      <>
                        <rect key="r1" x="7" y="2" width="10" height="5" rx="1" />
                        <path key="r2" d="M12 7v15M9 14l3 3 3-3" strokeDasharray="2 1" />
                      </>,
                    ],
                    ['Note', 'note', <path key="r" d="M5 5h14v10l-4 4H5z" />],
                    [
                      'Package',
                      'package',
                      <>
                        <rect key="r1" x="3" y="6" width="18" height="15" rx="1" fill="none" strokeWidth="1.5" />
                        <path key="r2" d="M3 10h7V6h4v4h7" fill="none" strokeWidth="1.5" />
                      </>,
                    ],
                    [
                      'Fragment',
                      'fragment',
                      <>
                        <rect key="r1" x="3" y="3" width="18" height="18" rx="1" fill="none" strokeWidth="1.5" />
                        <path key="r2" d="M3 8h7l2-5" strokeWidth="1.5" />
                      </>,
                    ],
                  ],
                },
                {
                  id: 'network',
                  title: 'Network',
                  items: [
                    [
                      'Server',
                      'server',
                      <>
                        <rect key="r1" x="4" y="4" width="16" height="5" rx="1" />
                        <rect key="r2" x="4" y="10" width="16" height="5" rx="1" />
                        <rect key="r3" x="4" y="16" width="16" height="5" rx="1" />
                      </>,
                    ],
                    [
                      'Database',
                      'cylinder',
                      <>
                        <ellipse key="r1" cx="12" cy="6" rx="7" ry="2.5" />
                        <path key="r2" d="M5 6v12" />
                        <path key="r3" d="M19 6v12" />
                        <ellipse key="r4" cx="12" cy="18" rx="7" ry="2.5" />
                      </>,
                    ],
                    ['Cloud', 'cloud', <path key="r" d="M6 19a4 4 0 01-.5-8 5 5 0 019.9-1 3.5 3.5 0 01.1 9H6z" />],
                    [
                      'Router',
                      'router',
                      <>
                        <circle key="r1" cx="12" cy="12" r="7" />
                        <path key="r2" d="M8 12h8M12 8v8" />
                      </>,
                    ],
                    [
                      'PC',
                      'pc',
                      <>
                        <rect key="r1" x="3" y="4" width="18" height="12" rx="1" />
                        <path key="r2" d="M8 20h8M12 16v4" />
                      </>,
                    ],
                    [
                      'Mobile',
                      'mobile',
                      <>
                        <rect key="r1" x="7" y="2" width="10" height="20" rx="2" />
                        <circle key="r2" cx="12" cy="19" r="1" fill="currentColor" />
                      </>,
                    ],
                    ['Firewall', 'firewall', <path key="r" d="M12 2l8 4v6c0 5-4 9-8 10C8 21 4 17 4 12V6z" />],
                    [
                      'Switch',
                      'switch',
                      <>
                        <rect key="r1" x="2" y="8" width="20" height="8" rx="2" />
                        <circle key="r2" cx="6" cy="12" r="1.5" fill="currentColor" />
                        <circle key="r3" cx="10" cy="12" r="1.5" fill="currentColor" />
                        <path key="r4" d="M18 12h-4" />
                      </>,
                    ],
                  ],
                },
                {
                  id: 'misc',
                  title: 'Misc',
                  items: [
                    ['Brackets', 'brackets', <path key="r" d="M8 4H5v16h3M16 4h3v16h-3" />],
                    ['Callout', 'callout', <path key="r" d="M3 5h18v11H9l-4 4v-4H3z" />],
                    ['Step', 'step', <path key="r" d="M3 8h13l4 4-4 4H3z" />],
                  ],
                },
              ] as Array<{ id: string; title: string; items: Array<[string, string, any]> }>
            ).map((sec) => (
              <div className="shape-section" id={`sec-${sec.id}`} key={sec.id}>
                <div className="shape-section-header" onClick={() => window.toggleSection?.(sec.id)}>
                  <span>{sec.title}</span>
                  <div className="chevron">
                    <svg viewBox="0 0 10 6"><path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>
                  </div>
                </div>
                <div className="shape-grid" id={`grid-${sec.id}`}>
                  {sec.items.map(([title, type, content], i) => (
                    <div
                      key={i}
                      className="shape-item"
                      title={title}
                      draggable
                      onDragStart={() => window.dragShape?.(type)}
                      onClick={() => window.quickInsert?.(type)}
                    >
                      <svg viewBox="0 0 24 24">{content}</svg>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ height: 8 }}></div>
            <div style={{ padding: 4, borderTop: '1px solid var(--border)' }}>
              <button
                onClick={() => window.showMoreShapes?.()}
                style={{
                  width: '100%',
                  height: 32,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 5,
                  fontSize: 12,
                  color: 'var(--accent2)',
                  cursor: 'pointer',
                  fontFamily: "'Sora',sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3v10M3 8h10" /></svg>
                More Shapes
              </button>
            </div>
          </div>
        </div>

        {/* CANVAS AREA */}
        <div id="canvas-area" onDragOver={(e) => e.preventDefault()} onDrop={(e) => window.handleDrop?.(e)}>
          <div
            id="canvas"
            ref={canvasRef}
            className="canvas-grid-bg"
            onMouseDown={(e) => window.canvasMouseDown?.(e)}
            onMouseMove={(e) => window.canvasMouseMove?.(e)}
            onMouseUp={(e) => window.canvasMouseUp?.(e)}
            onDoubleClick={(e) => window.canvasDblClick?.(e)}
            onContextMenu={(e) => window.showContextMenu?.(e)}
            onWheel={(e) => window.handleWheel?.(e)}
          >
            <svg id="svg-canvas" ref={svgCanvasRef} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#5b6ef5" />
                </marker>
                <marker id="arrowhead-dashed" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="#9090a8" />
                </marker>
              </defs>
            </svg>
          </div>
          <div id="minimap" style={{ display: 'none' }}>
            <canvas id="minimap-canvas" width={140} height={90}></canvas>
          </div>
          <div
            id="canvas-hint"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%,-50%)',
              textAlign: 'center',
              pointerEvents: 'none',
              userSelect: 'none',
              opacity: 0.25,
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 12 }}>
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <rect x="4" y="16" width="24" height="16" rx="2" stroke="#9090a8" strokeWidth="2" />
                <path d="M28 24h8l4 4-4 4h-8" stroke="#9090a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="36" y="32" width="16" height="12" rx="2" stroke="#5b6ef5" strokeWidth="2" />
              </svg>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text2)', fontWeight: 500 }}>Drop shapes or double-click to start</p>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4 }}>
              Press <kbd className="kbd-hint">R</kbd> for rect · <kbd className="kbd-hint">E</kbd> for ellipse ·{' '}
              <kbd className="kbd-hint">Del</kbd> to delete · <kbd className="kbd-hint">?</kbd> for help
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div id="right-panel">
          <div className="panel-tabs">
            <div className="panel-tab active" id="tab-diagram" onClick={() => window.switchTab?.('diagram')}>Diagram</div>
            <div className="panel-tab" id="tab-style" onClick={() => window.switchTab?.('style')}>Style</div>
          </div>
          {/* Diagram Tab */}
          <div className="panel-body" id="body-diagram">
            <div className="prop-section">
              <div className="prop-label">View</div>
              <div className="prop-row">
                <span className="prop-name">Grid</span>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                  <input type="checkbox" id="opt-grid" defaultChecked onChange={(e) => window.toggleGridOpt?.(e.target)} style={{ accentColor: 'var(--accent)' }} />
                  <span className="prop-val" style={{ fontSize: 11 }}>10 pt</span>
                </label>
              </div>
              <div className="prop-row">
                <span className="prop-name">Page View</span>
                <input type="checkbox" id="opt-page" defaultChecked style={{ accentColor: 'var(--accent)' }} />
              </div>
              <div className="prop-row">
                <span className="prop-name">Connection Arrows</span>
                <input type="checkbox" id="opt-conn" defaultChecked style={{ accentColor: 'var(--accent)' }} />
              </div>
              <div className="prop-row">
                <span className="prop-name">Guides</span>
                <input type="checkbox" id="opt-guides" defaultChecked style={{ accentColor: 'var(--accent)' }} />
              </div>
            </div>
            <div className="prop-section">
              <div className="prop-label">Background</div>
              <div className="prop-row">
                <span className="prop-name">Color</span>
                <div className="color-swatch" style={{ background: 'var(--bg)' }}>
                  <input type="color" defaultValue="#1a1a1e" onChange={(e) => window.changeBgColor?.(e.target.value)} />
                </div>
              </div>
              <div className="prop-row">
                <span className="prop-name">Shadow</span>
                <input type="checkbox" style={{ accentColor: 'var(--accent)' }} />
              </div>
            </div>
            <div className="prop-section">
              <div className="prop-label">Paper Size</div>
              <select
                style={{
                  width: '100%',
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 4,
                  padding: '5px 8px',
                  fontSize: 12,
                  color: 'var(--text)',
                  outline: 'none',
                  fontFamily: "'Sora',sans-serif",
                }}
              >
                <option>A4</option>
                <option>Letter</option>
                <option>Legal</option>
                <option>A3</option>
                <option>Custom</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button
                onClick={() => window.openExportModal?.()}
                style={{
                  width: '100%',
                  height: 32,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 5,
                  fontSize: 12,
                  color: 'var(--text2)',
                  cursor: 'pointer',
                  fontFamily: "'Sora',sans-serif",
                  transition: 'all .15s',
                }}
              >
                Edit Data…
              </button>
              <button
                style={{
                  width: '100%',
                  height: 32,
                  background: 'var(--bg3)',
                  border: '1px solid var(--border)',
                  borderRadius: 5,
                  fontSize: 12,
                  color: 'var(--text2)',
                  cursor: 'pointer',
                  fontFamily: "'Sora',sans-serif",
                  transition: 'all .15s',
                }}
              >
                Clear Default Style
              </button>
            </div>
          </div>
          {/* Style Tab */}
          <div className="panel-body" id="body-style" style={{ display: 'none' }}>
            <div id="no-selection" style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text3)' }}>
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ margin: '0 auto 12px' }}>
                <rect x="4" y="8" width="24" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M4 12h24" stroke="currentColor" strokeWidth="1" />
              </svg>
              <p style={{ fontSize: 12 }}>Select a shape to edit its style</p>
            </div>
            <div id="style-props" style={{ display: 'none' }}>
              <div className="prop-section">
                <div className="prop-label">Geometry</div>
                <div className="prop-row"><span className="prop-name">X</span><input className="prop-input" id="prop-x" type="number" onChange={(e) => window.updateNodeProp?.('x', e.target.value)} /></div>
                <div className="prop-row"><span className="prop-name">Y</span><input className="prop-input" id="prop-y" type="number" onChange={(e) => window.updateNodeProp?.('y', e.target.value)} /></div>
                <div className="prop-row"><span className="prop-name">Width</span><input className="prop-input" id="prop-w" type="number" onChange={(e) => window.updateNodeProp?.('w', e.target.value)} /></div>
                <div className="prop-row"><span className="prop-name">Height</span><input className="prop-input" id="prop-h" type="number" onChange={(e) => window.updateNodeProp?.('h', e.target.value)} /></div>
              </div>
              <div className="prop-section">
                <div className="prop-label">Fill</div>
                <div className="prop-row">
                  <span className="prop-name">Color</span>
                  <div className="color-swatch" id="fill-swatch" style={{ background: '#2a3a6e' }}>
                    <input type="color" id="fill-color" defaultValue="#2a3a6e" onChange={(e) => window.updateFill?.(e.target.value)} />
                  </div>
                </div>
                <div className="prop-row">
                  <span className="prop-name">Opacity</span>
                  <input className="prop-input" id="fill-opacity" type="number" min="0" max="100" defaultValue="100" onChange={(e) => window.updateFillOpacity?.(e.target.value)} />
                </div>
              </div>
              <div className="prop-section">
                <div className="prop-label">Stroke</div>
                <div className="prop-row">
                  <span className="prop-name">Color</span>
                  <div className="color-swatch" id="stroke-swatch" style={{ background: '#5b6ef5' }}>
                    <input type="color" id="stroke-color" defaultValue="#5b6ef5" onChange={(e) => window.updateStroke?.(e.target.value)} />
                  </div>
                </div>
                <div className="prop-row">
                  <span className="prop-name">Width</span>
                  <input className="prop-input" id="stroke-width" type="number" min="0" max="10" defaultValue="1.5" step=".5" onChange={(e) => window.updateStrokeWidth?.(e.target.value)} />
                </div>
                <div className="prop-row">
                  <span className="prop-name">Style</span>
                  <div className="btn-row">
                    <button className="style-btn active" id="stroke-solid" onClick={() => window.setStrokeStyle?.('solid')}> , </button>
                    <button className="style-btn" id="stroke-dashed" onClick={() => window.setStrokeStyle?.('dashed')}>- -</button>
                    <button className="style-btn" id="stroke-dotted" onClick={() => window.setStrokeStyle?.('dotted')}>···</button>
                  </div>
                </div>
              </div>
              <div className="prop-section">
                <div className="prop-label">Font</div>
                <div className="prop-row"><span className="prop-name">Size</span><input className="prop-input" id="font-size" type="number" defaultValue="13" min="8" max="72" onChange={(e) => window.updateFontSize?.(e.target.value)} /></div>
                <div className="prop-row">
                  <span className="prop-name">Style</span>
                  <div className="btn-row">
                    <button className="style-btn" id="font-bold" onClick={() => window.toggleFontStyle?.('bold')}><b>B</b></button>
                    <button className="style-btn" id="font-italic" onClick={() => window.toggleFontStyle?.('italic')}><i>I</i></button>
                    <button className="style-btn" id="font-underline" onClick={() => window.toggleFontStyle?.('underline')}><u>U</u></button>
                  </div>
                </div>
                <div className="prop-row">
                  <span className="prop-name">Color</span>
                  <div className="color-swatch" style={{ background: '#e8e8f0' }}>
                    <input type="color" id="font-color" defaultValue="#e8e8f0" onChange={(e) => window.updateFontColor?.(e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="prop-section">
                <div className="prop-label">Align</div>
                <div className="align-btns">
                  <button className="align-btn" title="Align Left" onClick={() => window.alignNodes?.('left')}><svg viewBox="0 0 16 16"><path d="M2 3h12M2 8h8M2 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
                  <button className="align-btn" title="Align Center" onClick={() => window.alignNodes?.('center')}><svg viewBox="0 0 16 16"><path d="M2 3h12M4 8h8M3 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
                  <button className="align-btn" title="Align Right" onClick={() => window.alignNodes?.('right')}><svg viewBox="0 0 16 16"><path d="M2 3h12M6 8h8M4 13h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
                  <button className="align-btn" title="Align Top" onClick={() => window.alignNodes?.('top')}><svg viewBox="0 0 16 16"><path d="M3 2v12M8 2v8M13 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
                  <button className="align-btn" title="Align Middle" onClick={() => window.alignNodes?.('middle')}><svg viewBox="0 0 16 16"><path d="M3 2v12M8 4v8M13 3v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
                  <button className="align-btn" title="Align Bottom" onClick={() => window.alignNodes?.('bottom')}><svg viewBox="0 0 16 16"><path d="M3 2v12M8 4v10M13 2v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg></button>
                </div>
              </div>
              <div className="prop-section">
                <div className="prop-label">Corner Radius</div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  defaultValue="4"
                  id="corner-radius"
                  style={{ width: '100%' }}
                  onInput={(e) => window.updateCornerRadius?.((e.target as HTMLInputElement).value)}
                  onChange={(e) => window.updateCornerRadius?.(e.target.value)}
                />
                <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'right' }} id="corner-val">4px</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATUS BAR */}
      <div id="statusbar">
        <span id="status-nodes">0 shapes</span>
        <span>·</span>
        <span id="status-edges">0 connections</span>
        <span>·</span>
        <span id="status-selected" className="status-accent">Nothing selected</span>
        <span style={{ flex: 1 }}></span>
        <span id="status-cursor">x: 0, y: 0</span>
      </div>

      {/* CONTEXT MENU */}
      <div id="ctx-menu">
        <div className="ctx-item" onClick={() => window.ctxAction?.('select-all')}><svg viewBox="0 0 16 16"><rect x="2" y="2" width="12" height="12" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>Select All</div>
        <div className="ctx-item" onClick={() => window.ctxAction?.('copy')}><svg viewBox="0 0 16 16"><rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /><rect x="2" y="2" width="9" height="9" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" opacity=".5" /></svg>Copy</div>
        <div className="ctx-item" onClick={() => window.ctxAction?.('paste')}><svg viewBox="0 0 16 16"><rect x="4" y="4" width="9" height="11" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M7 4V3a1 1 0 012 0v1" stroke="currentColor" strokeWidth="1.3" /></svg>Paste</div>
        <div className="ctx-sep"></div>
        <div className="ctx-item" onClick={() => window.ctxAction?.('duplicate')}><svg viewBox="0 0 16 16"><rect x="5" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /><path d="M11 5V4a1 1 0 00-1-1H4a1 1 0 00-1 1v6a1 1 0 001 1h1" stroke="currentColor" strokeWidth="1.3" /></svg>Duplicate</div>
        <div className="ctx-item" onClick={() => window.ctxAction?.('copy-style')}><svg viewBox="0 0 16 16"><path d="M7 3l3 3-6 6-3-1 1-3z" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>Copy Style</div>
        <div className="ctx-item" onClick={() => window.ctxAction?.('paste-style')}><svg viewBox="0 0 16 16"><path d="M9 7l3 3-2 2-3-3V7h2z" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>Paste Style</div>
        <div className="ctx-sep"></div>
        <div className="ctx-item" onClick={() => window.ctxAction?.('front')}><svg viewBox="0 0 16 16"><rect x="5" y="1" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>Bring to Front</div>
        <div className="ctx-item" onClick={() => window.ctxAction?.('back')}><svg viewBox="0 0 16 16"><rect x="1" y="5" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>Send to Back</div>
        <div className="ctx-sep"></div>
        <div className="ctx-item" style={{ color: 'var(--teal)' }} onClick={() => window.ctxAction?.('group')}><svg viewBox="0 0 16 16" style={{ color: 'var(--teal)' }}><path d="M1 4h14M1 12h14M4 1v14M12 1v14" stroke="currentColor" strokeWidth="1.2" opacity=".5" /></svg>Group</div>
        <div className="ctx-item" style={{ color: 'var(--red)' }} onClick={() => window.ctxAction?.('delete')}><svg viewBox="0 0 16 16" style={{ color: 'var(--red)' }}><path d="M4 5h8l-1 8H5zM2 5h12M6 3h4" stroke="currentColor" strokeWidth="1.3" fill="none" strokeLinecap="round" /></svg>Delete</div>
      </div>

      {/* EXPORT MODAL */}
      <div id="export-modal">
        <div className="modal-box" style={{ position: 'relative' }}>
          <div className="modal-title">Export Diagram</div>
          <div className="modal-close" onClick={() => window.closeExportModal?.()}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="export-option" onClick={() => window.exportAs?.('svg')}>
            <div className="ext" style={{ background: '#1a3a2e', color: '#4ade80' }}>SVG</div>
            <div className="info"><p>SVG Vector</p><span>Scalable, editable vector format</span></div>
          </div>
          <div className="export-option" onClick={() => window.exportAs?.('png')}>
            <div className="ext" style={{ background: '#1a2a3e', color: '#60a5fa' }}>PNG</div>
            <div className="info"><p>PNG Image</p><span>High-quality raster image (2× scale)</span></div>
          </div>
          <div className="export-option" onClick={() => window.exportAs?.('xml')}>
            <div className="ext" style={{ background: '#2e2218', color: '#fbbf24' }}>XML</div>
            <div className="info"><p>XML / draw.io</p><span>Compatible with draw.io format</span></div>
          </div>
          <div className="export-option" onClick={() => window.exportAs?.('json')}>
            <div className="ext" style={{ background: '#2e1a2e', color: '#e879f9' }}>JSON</div>
            <div className="info"><p>JSON Data</p><span>Raw diagram data</span></div>
          </div>
          <div className="export-option" onClick={() => window.exportAs?.('html')}>
            <div className="ext" style={{ background: '#2e1a1a', color: '#f87171' }}>HTML</div>
            <div className="info"><p>HTML Page</p><span>Embed in web page</span></div>
          </div>
        </div>
      </div>

      {/* HELP / KEYBOARD SHORTCUTS MODAL */}
      {helpOpen && (
        <div id="help-modal" onClick={() => setHelpOpen(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">Keyboard Shortcuts</div>
            <div className="modal-close" onClick={() => setHelpOpen(false)}>
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            </div>
            <table style={{ width: '100%', fontSize: 12, color: 'var(--text2)' }}>
              <tbody>
                {[
                  ['Select tool', 'V'],
                  ['Hand / Pan', 'H'],
                  ['Rectangle', 'R'],
                  ['Ellipse', 'E'],
                  ['Diamond', 'D'],
                  ['Arrow', 'A'],
                  ['Line', 'L'],
                  ['Text', 'T'],
                  ['Delete', 'Del / Backspace'],
                  ['Undo / Redo', 'Ctrl+Z / Ctrl+Y'],
                  ['Copy / Paste', 'Ctrl+C / Ctrl+V'],
                  ['Duplicate', 'Ctrl+D'],
                  ['Select All', 'Ctrl+A'],
                  ['Save', 'Ctrl+S'],
                  ['Export', 'Ctrl+E'],
                  ['Zoom In / Out', 'Ctrl + / Ctrl -'],
                  ['Reset Zoom', 'Ctrl+0'],
                  ['Move selection', 'Arrows (Shift = fine)'],
                  ['Help', '?'],
                ].map(([k, v]) => (
                  <tr key={k} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '6px 4px' }}>{k}</td>
                    <td style={{ padding: '6px 4px', textAlign: 'right' }}>
                      <kbd className="kbd-hint">{v}</kbd>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div id="toast"></div>

      {/* HIDDEN SEO CONTENT */}
      <div className="seo-only">
        <p>Free Online Diagram Editor – Flowcharts, UML, ERD, Mind Maps</p>
        <p>
          Thefreeaitools is a free, browser-based diagram editor inspired by draw.io and Lucidchart. Build flowcharts,
          UML class and use case diagrams, entity-relationship database schemas, network architecture diagrams and mind
          maps with drag-and-drop shapes. Diagrams autosave to your browser, support undo/redo, copy/paste, multi-select,
          and export to SVG, PNG, draw.io-compatible XML, JSON or embeddable HTML — all without an account.
        </p>
        <h2>Features</h2>
        <ul>
          <li>Drag-and-drop shape libraries: General, Flowchart, UML, Network, Misc</li>
          <li>Bezier connections with arrows, dashed arrows, plain lines</li>
          <li>Style panel: fill color, opacity, stroke color/width/style, font, alignment, corner radius</li>
          <li>Snap-to-grid (20px) with toggleable grid background</li>
          <li>Zoom 25%-400%, pan with hand tool or trackpad, fit-to-page</li>
          <li>Minimap for navigating large diagrams</li>
          <li>Autosave to browser localStorage</li>
          <li>Export: SVG, PNG (2× scale), XML (draw.io), JSON, HTML</li>
          <li>Full keyboard shortcuts (press ? for help)</li>
        </ul>
        <h2>FAQ</h2>
        <h3>Is it free?</h3>
        <p>Yes — no signup, no watermark, no usage limits.</p>
        <h3>Can I open my diagram later?</h3>
        <p>Yes. Diagrams autosave to your browser and reload automatically.</p>
        <h3>Is the XML export compatible with draw.io?</h3>
        <p>Yes. Open the exported XML in draw.io / diagrams.net to keep editing.</p>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Sora:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg:#1a1a1e; --bg2:#222228; --bg3:#2a2a32; --bg4:#32323c;
          --border:#3a3a46; --border2:#4a4a58;
          --accent:#5b6ef5; --accent2:#7c8dff;
          --text:#e8e8f0; --text2:#9090a8; --text3:#5a5a72;
          --green:#4ade80; --red:#f87171; --amber:#fbbf24; --teal:#2dd4bf;
        }
     
        /* TITLEBAR */
        #titlebar { height: 38px; background: var(--bg2); border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 0; flex-shrink: 0; }
        #titlebar .logo { display: flex; align-items: center; gap: 8px; padding: 0 16px; border-right: 1px solid var(--border); height: 100%; }
        #titlebar .logo-icon { width: 22px; height: 22px; background: var(--accent); border-radius: 5px; display: flex; align-items: center; justify-content: center; }
        #titlebar .logo-icon svg { width: 13px; height: 13px; fill: white; }
        #titlebar .logo-text { font-size: 13px; font-weight: 600; color: var(--text); }
        #titlebar .title-input { background: transparent; border: none; outline: none; color: var(--text); font-family: 'Sora', sans-serif; font-size: 13px; width: 180px; padding: 0 8px; }
        #titlebar .menus { display: flex; align-items: center; gap: 0; margin-left: 4px; }
        #titlebar .menu-btn { height: 38px; padding: 0 12px; font-size: 12px; color: var(--text2); cursor: pointer; border: none; background: transparent; font-family: 'Sora', sans-serif; transition: all .15s; }
        #titlebar .menu-btn:hover { background: var(--bg3); color: var(--text); }
        #titlebar .spacer { flex: 1; }
        #titlebar .tb-actions { display: flex; align-items: center; gap: 6px; padding: 0 12px; }
        .tb-icon-btn { width: 28px; height: 28px; border: 1px solid var(--border); background: var(--bg3); border-radius: 5px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text2); transition: all .15s; }
        .tb-icon-btn:hover { background: var(--bg4); color: var(--text); border-color: var(--border2); }
        .tb-icon-btn svg { width: 14px; height: 14px; fill: currentColor; }
        .share-btn { height: 28px; padding: 0 12px; background: var(--accent); color: white; border: none; border-radius: 5px; font-size: 12px; font-weight: 500; cursor: pointer; font-family: 'Sora', sans-serif; transition: all .15s; }
        .share-btn:hover { background: var(--accent2); }
        /* TOOLBAR */
        #toolbar { height: 40px; background: var(--bg2); border-bottom: 1px solid var(--border); display: flex; align-items: center; padding: 0 12px; gap: 4px; flex-shrink: 0; }
        .tool-group { display: flex; align-items: center; gap: 2px; padding: 0 4px; }
        .tool-sep { width: 1px; height: 24px; background: var(--border); margin: 0 4px; }
        .tool-btn { width: 30px; height: 30px; border: 1px solid transparent; background: transparent; border-radius: 5px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--text2); transition: all .15s; font-size: 11px; font-family: 'Sora', sans-serif; }
        .tool-btn:hover { background: var(--bg3); color: var(--text); border-color: var(--border); }
        .tool-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
        .tool-btn svg { width: 15px; height: 15px; fill: currentColor; }
        .zoom-display { height: 28px; padding: 0 8px; background: var(--bg3); border: 1px solid var(--border); border-radius: 5px; font-size: 12px; color: var(--text2); display: flex; align-items: center; min-width: 52px; justify-content: center; cursor: pointer; user-select: none; }
        /* MAIN LAYOUT */
        #main { flex: 1; display: flex; overflow: hidden; }
        /* LEFT PANEL */
        #left-panel { width: 200px; background: var(--bg2); border-right: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; overflow: hidden; }
        #search-box { padding: 8px; border-bottom: 1px solid var(--border); }
        #search-box input { width: 100%; background: var(--bg3); border: 1px solid var(--border); border-radius: 5px; padding: 5px 8px 5px 28px; font-size: 12px; color: var(--text); outline: none; font-family: 'Sora', sans-serif; }
        #search-box input:focus { border-color: var(--accent); }
        #search-box .search-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--text3); }
        #search-box .search-icon svg { width: 12px; height: 12px; fill: currentColor; }
        #shape-panel { flex: 1; overflow-y: auto; padding: 8px; }
        #shape-panel::-webkit-scrollbar { width: 4px; }
        #shape-panel::-webkit-scrollbar-track { background: transparent; }
        #shape-panel::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
        .shape-section-header { display: flex; align-items: center; justify-content: space-between; padding: 4px 4px 6px; cursor: pointer; user-select: none; }
        .shape-section-header span { font-size: 11px; font-weight: 600; color: var(--text2); text-transform: uppercase; letter-spacing: .06em; }
        .shape-section-header .chevron { color: var(--text3); transition: transform .2s; }
        .shape-section-header .chevron svg { width: 10px; height: 10px; fill: currentColor; }
        .shape-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3px; margin-bottom: 8px; }
        .shape-item { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; border: 1px solid transparent; border-radius: 4px; cursor: pointer; transition: all .15s; }
        .shape-item:hover { background: var(--bg3); border-color: var(--border); }
        .shape-item svg { width: 20px; height: 20px; fill: none; stroke: var(--text2); stroke-width: 1.5; }
        .shape-item:hover svg { stroke: var(--text); }
        /* CANVAS */
        #canvas-area { flex: 1; position: relative; overflow: hidden; background: var(--bg); }
        #canvas { position: absolute; inset: 0; cursor: default; }
        .canvas-grid-bg { background-image: radial-gradient(circle, var(--border) 1px, transparent 1px); background-size: 20px 20px; }
        #svg-canvas { width: 100%; height: 100%; position: absolute; inset: 0; }
        /* RIGHT PANEL */
        #right-panel { width: 240px; background: var(--bg2); border-left: 1px solid var(--border); display: flex; flex-direction: column; flex-shrink: 0; overflow: hidden; }
        .panel-tabs { display: flex; border-bottom: 1px solid var(--border); }
        .panel-tab { flex: 1; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: var(--text2); cursor: pointer; border-bottom: 2px solid transparent; transition: all .15s; }
        .panel-tab.active { color: var(--accent2); border-bottom-color: var(--accent); }
        .panel-body { flex: 1; overflow-y: auto; padding: 12px; }
        .panel-body::-webkit-scrollbar { width: 4px; }
        .panel-body::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }
        .prop-section { margin-bottom: 16px; }
        .prop-label { font-size: 11px; font-weight: 600; color: var(--text3); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 8px; }
        .prop-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
        .prop-name { font-size: 12px; color: var(--text2); }
        .prop-val { font-size: 12px; color: var(--text); }
        .prop-input { width: 80px; background: var(--bg3); border: 1px solid var(--border); border-radius: 4px; padding: 3px 6px; font-size: 12px; color: var(--text); outline: none; font-family: 'Sora', sans-serif; text-align: right; }
        .prop-input:focus { border-color: var(--accent); }
        .color-swatch { width: 24px; height: 24px; border-radius: 4px; border: 1px solid var(--border2); cursor: pointer; position: relative; overflow: hidden; }
        .color-swatch input[type=color] { position: absolute; inset: -4px; opacity: 0; cursor: pointer; width: 200%; height: 200%; }
        .btn-row { display: flex; gap: 4px; flex-wrap: wrap; }
        .style-btn { height: 26px; padding: 0 8px; background: var(--bg3); border: 1px solid var(--border); border-radius: 4px; font-size: 11px; color: var(--text2); cursor: pointer; font-family: 'Sora', sans-serif; transition: all .15s; }
        .style-btn:hover { background: var(--bg4); color: var(--text); }
        .style-btn.active { background: var(--accent); color: white; border-color: var(--accent); }
        .align-btns { display: grid; grid-template-columns: repeat(3, 1fr); gap: 3px; }
        .align-btn { height: 28px; background: var(--bg3); border: 1px solid var(--border); border-radius: 4px; font-size: 10px; color: var(--text2); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; }
        .align-btn:hover { background: var(--accent); color: white; border-color: var(--accent); }
        .align-btn svg { width: 13px; height: 13px; fill: currentColor; }
        /* DIAGRAM NODES */
        .node { position: absolute; user-select: none; cursor: move; }
        .node-shape { position: absolute; inset: 0; pointer-events: all; }
        .node-label { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; color: var(--text); pointer-events: none; padding: 4px; text-align: center; line-height: 1.3; white-space: pre-wrap; }
        .node.selected .node-shape { filter: drop-shadow(0 0 0 2px var(--accent)); }
        .handle { position: absolute; width: 8px; height: 8px; background: var(--accent); border: 2px solid var(--bg); border-radius: 2px; cursor: nw-resize; z-index: 100; }
        .handle.tl { top: -4px; left: -4px; cursor: nw-resize; }
        .handle.tr { top: -4px; right: -4px; cursor: ne-resize; }
        .handle.bl { bottom: -4px; left: -4px; cursor: sw-resize; }
        .handle.br { bottom: -4px; right: -4px; cursor: se-resize; }
        .handle.tm { top: -4px; left: 50%; transform: translateX(-50%); cursor: n-resize; }
        .handle.bm { bottom: -4px; left: 50%; transform: translateX(-50%); cursor: s-resize; }
        .handle.ml { top: 50%; left: -4px; transform: translateY(-50%); cursor: w-resize; }
        .handle.mr { top: 50%; right: -4px; transform: translateY(-50%); cursor: e-resize; }
        .conn-port { position: absolute; width: 10px; height: 10px; background: var(--accent); border: 2px solid var(--bg); border-radius: 50%; opacity: 0; transition: opacity .15s; cursor: crosshair; z-index: 50; }
        .node:hover .conn-port { opacity: 1; }
        .conn-port.top { top: -5px; left: 50%; transform: translateX(-50%); }
        .conn-port.bottom { bottom: -5px; left: 50%; transform: translateX(-50%); }
        .conn-port.left { left: -5px; top: 50%; transform: translateY(-50%); }
        .conn-port.right { right: -5px; top: 50%; transform: translateY(-50%); }
        /* TOAST */
        #toast { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%) translateY(60px); background: var(--bg3); border: 1px solid var(--border2); border-radius: 8px; padding: 8px 16px; font-size: 13px; color: var(--text); opacity: 0; transition: all .3s; z-index: 1000; }
        #toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
        /* CONTEXT MENU */
        #ctx-menu { display: none; position: fixed; background: var(--bg3); border: 1px solid var(--border2); border-radius: 8px; padding: 4px; z-index: 500; min-width: 160px; box-shadow: 0 8px 24px rgba(0,0,0,.4); }
        .ctx-item { padding: 7px 12px; font-size: 12px; color: var(--text); cursor: pointer; border-radius: 5px; display: flex; align-items: center; gap: 8px; transition: background .1s; }
        .ctx-item:hover { background: var(--bg4); }
        .ctx-item svg { width: 13px; height: 13px; fill: currentColor; color: var(--text2); }
        .ctx-sep { height: 1px; background: var(--border); margin: 3px 0; }
        /* STATUS BAR */
        #statusbar { height: 24px; background: var(--bg2); border-top: 1px solid var(--border); display: flex; align-items: center; padding: 0 12px; gap: 16px; flex-shrink: 0; }
        #statusbar span { font-size: 11px; color: var(--text3); }
        #statusbar .status-accent { color: var(--accent2); }
        /* MINIMAP */
        #minimap { position: absolute; bottom: 32px; right: 16px; width: 140px; height: 90px; background: var(--bg2); border: 1px solid var(--border2); border-radius: 6px; overflow: hidden; z-index: 10; }
        #minimap canvas { width: 100%; height: 100%; }
        /* SCROLLBARS */
        #canvas-area::-webkit-scrollbar { width: 8px; height: 8px; }
        #canvas-area::-webkit-scrollbar-track { background: var(--bg); }
        #canvas-area::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }
        /* EDGE LABEL */
        .edge-label { font-size: 11px; fill: var(--text2); pointer-events: none; }
        /* EXPORT MODAL */
        #export-modal { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 800; align-items: center; justify-content: center; }
        #export-modal.open { display: flex; }
        .modal-box { background: var(--bg2); border: 1px solid var(--border2); border-radius: 10px; padding: 24px; width: 360px; max-width: 90vw; }
        .modal-title { font-size: 15px; font-weight: 600; margin-bottom: 16px; }
        .modal-close { position: absolute; top: 12px; right: 12px; cursor: pointer; color: var(--text2); }
        .export-option { display: flex; align-items: center; gap: 10px; padding: 10px; border: 1px solid var(--border); border-radius: 6px; margin-bottom: 6px; cursor: pointer; transition: all .15s; }
        .export-option:hover { border-color: var(--accent); background: var(--bg3); }
        .export-option .ext { width: 36px; height: 36px; border-radius: 6px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; }
        .export-option .info { flex: 1; }
        .export-option .info p { font-size: 13px; font-weight: 500; }
        .export-option .info span { font-size: 11px; color: var(--text2); }
        /* HELP MODAL */
        #help-modal { position: fixed; inset: 0; background: rgba(0,0,0,.6); z-index: 850; display: flex; align-items: center; justify-content: center; }
        #help-modal .modal-box { width: 420px; max-height: 80vh; overflow-y: auto; position: relative; }
        /* HINT KBD */
        .kbd-hint { background: var(--bg3); border: 1px solid var(--border); border-radius: 3px; padding: 1px 5px; font-size: 11px; font-family: 'JetBrains Mono', monospace; color: var(--text2); }
        /* SEO ONLY */
        .seo-only { position: fixed; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
      `}</style>
    </>
  );
}
