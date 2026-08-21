'use client';

import Script from 'next/script';
import { useEffect, useRef, useState, useId } from 'react';

declare global {
  interface Window {
    mermaid?: any;
    jspdf?: any;
  }
}

type DiagramType = 'class' | 'sequence' | 'usecase' | 'flowchart' | 'er' | 'state' | 'gantt' | 'pie' | 'git' | 'mindmap';

type Template = {
  name: string;
  type: DiagramType;
  code: string;
};

type ToastItem = {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
};

/* ── FAQ (exported for SEO) ── */
export const FAQ_ITEMS = [
  {
    question: "What is a UML diagram?",
    answer: "UML (Unified Modeling Language) is a standardized way to visualize software systems. Common types include class diagrams, sequence diagrams, ER diagrams, flowcharts, use case diagrams, and state diagrams."
  },
  {
    question: "How do I create a UML diagram for free?",
    answer: "Use this free online UML generator powered by Mermaid.js. Type your diagram code in the editor or pick a template, then click Render. Export as PNG, SVG, or PDF instantly."
  },
  {
    question: "What diagram types are supported?",
    answer: "Class, Sequence, Use Case, Flowchart, ER (entity-relationship), State, Gantt, Pie chart, Git graph, and Mindmap diagrams are all supported."
  },
  {
    question: "Can I export my UML diagram?",
    answer: "Yes. You can export to PNG (high-resolution 2x), SVG (vector), or PDF format with one click. No account needed."
  },
  {
    question: "What syntax does this UML tool use?",
    answer: "This tool uses Mermaid.js syntax, a simple markdown-like language for creating diagrams. Full documentation is available at mermaid.js.org."
  }
];

const TAB_LABELS: Record<DiagramType, string> = {
  class: 'Class', sequence: 'Sequence', usecase: 'Use Case', flowchart: 'Flowchart',
  er: 'ER', state: 'State', gantt: 'Gantt', pie: 'Pie', git: 'Git', mindmap: 'Mindmap'
};

const TEMPLATES: Template[] = [
  {
    name: 'Library System', type: 'class',
    code: `classDiagram
  class Library {
    -String name
    -List~Book~ books
    +addBook(book: Book) void
    +searchBook(title: String) Book
    +checkOut(book: Book, user: Member) Loan
  }
  class Book {
    -String title
    -String author
    -String ISBN
    -Boolean available
    +getTitle() String
    +isAvailable() Boolean
  }
  class Member {
    -int memberId
    -String name
    -String email
    -List~Loan~ loans
    +borrowBook(book: Book) void
    +returnBook(book: Book) void
  }
  class Loan {
    -Date checkoutDate
    -Date dueDate
    -Book book
    -Member member
    +isOverdue() Boolean
    +getDaysLeft() int
  }
  Library "1" --> "many" Book : contains
  Member "1" --> "many" Loan : has
  Loan "1" --> "1" Book : references`
  },
  {
    name: 'E-Commerce', type: 'class',
    code: `classDiagram
  class User {
    +int userId
    +String email
    +login() bool
    +register() void
  }
  class Product {
    +int productId
    +String name
    +float price
    +int stock
    +updateStock(qty: int) void
  }
  class Order {
    +int orderId
    +Date createdAt
    +String status
    +float total
    +calculateTotal() float
  }
  class OrderItem {
    +int quantity
    +float unitPrice
    +getSubtotal() float
  }
  class Cart {
    +addItem(product: Product) void
    +removeItem(product: Product) void
    +checkout() Order
  }
  class Payment {
    +String method
    +float amount
    +String status
    +process() bool
  }
  User "1" --> "1" Cart : owns
  User "1" --> "many" Order : places
  Order "1" *-- "many" OrderItem : contains
  OrderItem "many" --> "1" Product : refers
  Order "1" --> "1" Payment : paid via`
  },
  {
    name: 'User Auth', type: 'sequence',
    code: `sequenceDiagram
  actor User
  participant Browser
  participant API
  participant AuthService
  participant Database

  User->>Browser: Enter credentials
  Browser->>API: POST /auth/login
  API->>AuthService: validateCredentials()
  AuthService->>Database: SELECT user WHERE email=?
  Database-->>AuthService: User record
  AuthService->>AuthService: bcrypt.compare()
  AuthService-->>API: {valid: true, userId}
  API->>API: generateJWT(userId)
  API-->>Browser: {token, expiresIn}
  Browser->>Browser: Store token
  Browser-->>User: Redirect to dashboard
  Note over API,Database: Token valid for 24h`
  },
  {
    name: 'API Request Flow', type: 'sequence',
    code: `sequenceDiagram
  actor Client
  participant Gateway
  participant Cache
  participant Service
  participant DB

  Client->>Gateway: GET /api/products
  Gateway->>Gateway: Validate JWT
  Gateway->>Cache: Check cache key
  alt Cache hit
    Cache-->>Gateway: Cached response
    Gateway-->>Client: 200 OK (cached)
  else Cache miss
    Gateway->>Service: Forward request
    Service->>DB: SELECT * FROM products
    DB-->>Service: Product rows
    Service-->>Gateway: JSON response
    Gateway->>Cache: Store (TTL 5m)
    Gateway-->>Client: 200 OK
  end`
  },
  {
    name: 'Online Banking', type: 'usecase',
    code: `graph TB
  actor1([Customer])
  actor2([Bank Admin])
  actor3([Payment Gateway])

  subgraph sys [Online Banking System]
    uc1([Login])
    uc2([View Balance])
    uc3([Transfer Funds])
    uc4([Pay Bills])
    uc5([Download Statement])
    uc6([Manage Users])
    uc7([Process Payment])
    uc8([Generate Report])
  end

  actor1 --> uc1
  actor1 --> uc2
  actor1 --> uc3
  actor1 --> uc4
  actor1 --> uc5
  actor2 --> uc1
  actor2 --> uc6
  actor2 --> uc8
  uc3 --> actor3
  uc4 --> actor3
  actor3 --> uc7`
  },
  {
    name: 'Dev Pipeline', type: 'flowchart',
    code: `flowchart TD
  A([Developer pushes code]) --> B{Automated Tests}
  B -- Pass --> C[Build Docker Image]
  B -- Fail --> D([Notify Developer])
  C --> E[Push to Registry]
  E --> F{Environment?}
  F -- staging --> G[Deploy to Staging]
  F -- production --> H{Approval Required}
  G --> I[Run Integration Tests]
  I -- Pass --> J([Staging Ready])
  I -- Fail --> K([Rollback])
  H -- Approved --> L[Blue/Green Deploy]
  H -- Rejected --> M([Cancelled])
  L --> N[Health Check]
  N -- Healthy --> O([Production Live])
  N -- Unhealthy --> P([Auto Rollback])`
  },
  {
    name: 'Database Schema', type: 'er',
    code: `erDiagram
  CUSTOMER {
    int customer_id PK
    string first_name
    string last_name
    string email
    date created_at
  }
  ORDER {
    int order_id PK
    int customer_id FK
    date order_date
    string status
    decimal total_amount
  }
  PRODUCT {
    int product_id PK
    string name
    decimal price
    int stock_quantity
    int category_id FK
  }
  ORDER_ITEM {
    int item_id PK
    int order_id FK
    int product_id FK
    int quantity
    decimal unit_price
  }
  CATEGORY {
    int category_id PK
    string name
    string slug
  }
  CUSTOMER ||--o{ ORDER : places
  ORDER ||--|{ ORDER_ITEM : contains
  PRODUCT ||--o{ ORDER_ITEM : "ordered in"
  CATEGORY ||--o{ PRODUCT : categorizes`
  },
  {
    name: 'Order State', type: 'state',
    code: `stateDiagram-v2
  [*] --> Draft
  Draft --> Submitted : submit()
  Submitted --> UnderReview : assign()
  UnderReview --> Approved : approve()
  UnderReview --> Rejected : reject()
  Approved --> Processing : startProcess()
  Processing --> Shipped : ship()
  Shipped --> Delivered : deliver()
  Delivered --> [*]
  Rejected --> Draft : revise()
  Processing --> Cancelled : cancel()
  Shipped --> Returned : return()
  Returned --> [*]`
  },
  {
    name: 'Sprint Plan', type: 'gantt',
    code: `gantt
  title Sprint 12 — Q3 2025
  dateFormat YYYY-MM-DD
  section Design
    UI Wireframes        :done,    des1, 2025-07-01, 3d
    Design System Update :active,  des2, 2025-07-04, 4d
    Prototype Review     :         des3, 2025-07-08, 2d
  section Backend
    Auth Refactor        :done,    be1, 2025-07-01, 5d
    API v2 Endpoints     :active,  be2, 2025-07-06, 6d
    Database Migration   :         be3, 2025-07-12, 3d
  section Frontend
    Component Library    :active,  fe1, 2025-07-03, 5d
    Integration Tests    :         fe2, 2025-07-08, 4d
    Performance Audit    :         fe3, 2025-07-12, 2d`
  },
  {
    name: 'Tech Stack', type: 'pie',
    code: `pie title Tech Stack Distribution
  "TypeScript" : 42
  "Python" : 28
  "Go" : 15
  "SQL" : 10
  "Shell" : 5`
  },
  {
    name: 'Git Flow', type: 'git',
    code: `gitGraph
  commit id: "init"
  branch develop
  checkout develop
  commit id: "setup"
  branch feature/auth
  checkout feature/auth
  commit id: "login"
  commit id: "register"
  checkout develop
  merge feature/auth id: "merge-auth"
  branch feature/api
  checkout feature/api
  commit id: "endpoints"
  commit id: "tests"
  checkout develop
  merge feature/api id: "merge-api"
  checkout main
  merge develop id: "v1.0.0" tag: "v1.0.0"
  branch hotfix/bug
  checkout hotfix/bug
  commit id: "fix-null"
  checkout main
  merge hotfix/bug tag: "v1.0.1"`
  },
  {
    name: 'System Design', type: 'mindmap',
    code: `mindmap
  root((System))
    Frontend
      React App
      Mobile
        iOS
        Android
      CDN
    Backend
      API Gateway
      Auth Service
      User Service
      Payment Service
    Data
      PostgreSQL
      Redis Cache
      Elasticsearch
    Infrastructure
      AWS
        EC2
        S3
        RDS
      Docker
      Kubernetes`
  },
];


export default function UmlDiagramGeneratorPage() {
  const [code, setCode] = useState('');
  const [activeTab, setActiveTab] = useState<DiagramType>('class');
  const [activeSnippet, setActiveSnippet] = useState(-1);
  const [zoom, setZoomState] = useState(1);
  const [svgOutput, setSvgOutput] = useState('');
  const [status, setStatus] = useState<'ready' | 'rendering' | 'error'>('ready');
  const [errorMsg, setErrorMsg] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [cursorPos, setCursorPos] = useState('1:1');
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState('');

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const outputWrapRef = useRef<HTMLDivElement>(null);
  const editorPanelRef = useRef<HTMLElement>(null);
  const resizerRef = useRef<HTMLDivElement>(null);
  const previewVpRef = useRef<HTMLDivElement>(null);
  const mermaidReadyRef = useRef(false);
  const renderTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const renderIdRef = useRef(0);

  const uid = useId();

  // Toast helper
  const toast = (message: string, type: ToastItem['type'] = 'info', duration = 2800) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration);
  };

  // Line numbers derived from code
  const lineCount = code.split('\n').length;

  // Zoom wrapper
  const setZoom = (z: number) => {
    setZoomState(Math.max(0.25, Math.min(3, z)));
  };

  // Render
  const renderDiagram = async () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setSvgOutput('');
      setStatus('ready');
      return;
    }
    if (!window.mermaid || !mermaidReadyRef.current) {
      setTimeout(renderDiagram, 200);
      return;
    }

    setStatus('rendering');
    const id = ++renderIdRef.current;
    const mermaidId = `mermaid-${uid}-${Date.now()}`;

    try {
      const { svg } = await window.mermaid.render(mermaidId, trimmed);
      if (id !== renderIdRef.current) return;
      setSvgOutput(svg);
      setStatus('ready');
      setErrorMsg('');
    } catch (err: any) {
      if (id !== renderIdRef.current) return;
      const msg = (err?.message || String(err)).replace(/\n\n[\s\S]*/, '');
      setSvgOutput('');
      setStatus('error');
      setErrorMsg(msg);
    }
  };

  const scheduleRender = (delay = 700) => {
    if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current);
    renderTimeoutRef.current = setTimeout(renderDiagram, delay);
  };

  // Init mermaid
  const initMermaid = () => {
    if (!window.mermaid || mermaidReadyRef.current) return;
    window.mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      themeVariables: {
        background: '#ffffff',
        primaryColor: '#f4f4f5',
        primaryTextColor: '#18181b',
        primaryBorderColor: '#d4d4d8',
        lineColor: '#71717a',
        secondaryColor: '#fafafa',
        tertiaryColor: '#f4f4f5',
        edgeLabelBackground: '#fafafa',
        clusterBkg: '#f4f4f5',
        titleColor: '#18181b',
        attributeBackgroundColorEven: '#fafafa',
        attributeBackgroundColorOdd: '#f4f4f5',
        nodeBorder: '#a1a1aa',
        mainBkg: '#fafafa',
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: '13px',
      },
      flowchart: { htmlLabels: true, curve: 'basis' },
      sequence: { diagramMarginX: 24, diagramMarginY: 16, actorMargin: 60, boxMargin: 10, useMaxWidth: true },
      logLevel: 'error',
    });
    mermaidReadyRef.current = true;
    loadTemplate(0);
    setTimeout(() => toast('Pick a template or start typing your diagram.', 'info', 3200), 400);
  };

  // Load template
  const loadTemplate = (idx: number) => {
    const tmpl = TEMPLATES[idx];
    if (!tmpl) return;
    setCode(tmpl.code);
    setActiveSnippet(idx);
    setActiveTab(tmpl.type);
    if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current);
    setTimeout(() => renderDiagram(), 50);
    toast(`Loaded: ${tmpl.name}`, 'info', 1800);
  };

  const handleTabClick = (type: DiagramType) => {
    setActiveTab(type);
    const idx = TEMPLATES.findIndex(t => t.type === type);
    if (idx >= 0) loadTemplate(idx);
  };

  const handleClear = () => {
    setCode('');
    setSvgOutput('');
    setStatus('ready');
    setErrorMsg('');
    setActiveSnippet(-1);
    if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current);
    toast('Editor cleared', 'info');
  };

  const handleCopy = () => {
    if (!code.trim()) { toast('Nothing to copy', 'error'); return; }
    navigator.clipboard.writeText(code)
      .then(() => toast('Code copied!', 'success'))
      .catch(() => toast('Failed to copy', 'error'));
  };

  const handleEditorKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const editor = editorRef.current;
      if (!editor) return;
      const s = editor.selectionStart;
      const end = editor.selectionEnd;
      const newValue = editor.value.substring(0, s) + '  ' + editor.value.substring(end);
      setCode(newValue);
      requestAnimationFrame(() => {
        editor.selectionStart = editor.selectionEnd = s + 2;
      });
    }
  };

  const updateCursor = () => {
    const editor = editorRef.current;
    if (!editor) return;
    const pos = editor.selectionStart;
    const lines = editor.value.substring(0, pos).split('\n');
    setCursorPos(`${lines.length}:${lines[lines.length - 1].length + 1}`);
  };

  // Export helpers
  const getSvgEl = (): SVGElement | null => {
    return outputWrapRef.current?.querySelector('svg') || null;
  };

  const svgToCanvas = (svgEl: SVGElement, scale = 2): Promise<HTMLCanvasElement> => {
    return new Promise((resolve, reject) => {
      let width = 0, height = 0;
      const vb = svgEl.getAttribute('viewBox');
      if (vb) {
        const parts = vb.trim().split(/[\s,]+/).map(Number);
        if (parts.length >= 4 && parts[2] > 10) { width = parts[2]; height = parts[3]; }
      }
      if (!width) {
        const r = svgEl.getBoundingClientRect();
        width = r.width > 10 ? r.width : 800;
        height = r.height > 10 ? r.height : 600;
      }

      const clone = svgEl.cloneNode(true) as SVGElement;
      clone.style.transform = '';
      clone.setAttribute('width', String(width));

      clone.setAttribute('height', String(height));

      const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      bg.setAttribute('width', '100%');
      bg.setAttribute('height', '100%');
      bg.setAttribute('fill', 'white');
      clone.insertBefore(bg, clone.firstChild);

      const svgStr = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(width * scale);
        canvas.height = Math.ceil(height * scale);
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(url);
        resolve(canvas);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG render failed')); };
      img.src = url;
    });
  };

  const exportPNG = async () => {
    const svgEl = getSvgEl();
    if (!svgEl) { toast('No diagram to export — render first!', 'error'); return; }
    setExporting(true);
    setExportMsg('Generating PNG…');
    try {
      const canvas = await svgToCanvas(svgEl, 2);
      const link = document.createElement('a');
      link.download = 'diagram.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast('PNG exported!', 'success');
    } catch (e: any) {
      toast('PNG export failed: ' + e.message, 'error');
    } finally {
      setExporting(false);
    }
  };

  const exportSVG = () => {
    const svgEl = getSvgEl();
    if (!svgEl) { toast('No diagram to export — render first!', 'error'); return; }
    const clone = svgEl.cloneNode(true) as SVGElement;
    clone.style.transform = '';
    const svgStr = new XMLSerializer().serializeToString(clone);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'diagram.svg';
    a.href = url;
    a.click();
    URL.revokeObjectURL(url);
    toast('SVG exported!', 'success');
  };

  const exportPDF = async () => {
    const svgEl = getSvgEl();
    if (!svgEl) { toast('No diagram to export — render first!', 'error'); return; }
    if (!window.jspdf) { toast('PDF library not loaded yet, try again', 'error'); return; }
    setExporting(true);
    setExportMsg('Generating PDF…');
    try {
      const { width, height } = (() => {
        const rect = svgEl.getBoundingClientRect();
        if (rect.width > 10 && rect.height > 10) return { width: rect.width, height: rect.height };
        const vb = svgEl.getAttribute('viewBox');
        if (vb) {
          const p = vb.trim().split(/[\s,]+/).map(Number);
          if (p.length >= 4 && p[2] > 0) return { width: p[2], height: p[3] };
        }
        return { width: 800, height: 600 };
      })();
      const canvas = await svgToCanvas(svgEl, 1.5);
      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const orientation = width > height ? 'landscape' : 'portrait';
      const pw = width + 40, ph = height + 56;
      const pdf = new jsPDF({ orientation, unit: 'px', format: [pw, ph] });
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pw, ph, 'F');
      pdf.setTextColor(17, 24, 39);
      pdf.setFontSize(8);
      pdf.text('TheFreeAITools.com — UML Diagram Generator', 20, 16);
      pdf.setTextColor(113, 113, 122);
      pdf.text('Generated ' + new Date().toLocaleString(), 20, 28);
      pdf.addImage(imgData, 'PNG', 20, 38, width, height);
      pdf.save('diagram.pdf');
      toast('PDF exported!', 'success');
    } catch (e: any) {
      toast('PDF export failed: ' + e.message, 'error');
    } finally {
      setExporting(false);
    }
  };

  // Effects
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setModalOpen(false); return; }
      if (e.key === '?' && !e.ctrlKey && !e.metaKey && document.activeElement !== editorRef.current) {
        setModalOpen(true); return;
      }
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') { e.preventDefault(); if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current); renderDiagram(); return; }
        if (e.shiftKey && e.key === 'X') { e.preventDefault(); handleClear(); return; }
        if (e.shiftKey && e.key === 'P') { e.preventDefault(); exportPNG(); return; }
        if (e.shiftKey && e.key === 'D') { e.preventDefault(); exportPDF(); return; }
      }
    };
    document.addEventListener('keydown', onKeyDown);

    const resizer = resizerRef.current;
    const editorPnl = editorPanelRef.current;
    let dragging = false, startX = 0, startW = 0;
    const onResizerDown = (e: MouseEvent) => {
      if (!editorPnl) return;
      dragging = true;
      startX = e.clientX;
      startW = editorPnl.offsetWidth;
      resizer?.classList.add('bg-gray-900');
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    };
    const onResizerMove = (e: MouseEvent) => {
      if (!dragging || !editorPnl) return;
      const newW = Math.max(220, Math.min(window.innerWidth - 300, startW + (e.clientX - startX)));
      editorPnl.style.width = newW + 'px';
    };
    const onResizerUp = () => {
      if (!dragging) return;
      dragging = false;
      resizer?.classList.remove('bg-gray-900');
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
    resizer?.addEventListener('mousedown', onResizerDown);
    document.addEventListener('mousemove', onResizerMove);
    document.addEventListener('mouseup', onResizerUp);

    const previewVp = previewVpRef.current;
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setZoomState(prev => Math.max(0.25, Math.min(3, prev + (e.deltaY < 0 ? 0.1 : -0.1))));
      }
    };
    previewVp?.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      resizer?.removeEventListener('mousedown', onResizerDown);
      document.removeEventListener('mousemove', onResizerMove);
      document.removeEventListener('mouseup', onResizerUp);
      previewVp?.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Debounced render on code change
  useEffect(() => {
    scheduleRender();
    return () => { if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  // Apply zoom to rendered SVG
  useEffect(() => {
    const svgEl = outputWrapRef.current?.querySelector('svg') as SVGElement | null;
    if (svgEl) {
      svgEl.style.transform = `scale(${zoom})`;
      svgEl.style.transformOrigin = 'top center';
    }
  }, [zoom, svgOutput]);

  return (
    <div className=" dark:bg-[#0000] bg-white text-black  dark:text-white font-mono text-[13px] leading-relaxed antialiased flex flex-col">
      {/* Scripts */}
      <Script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js" strategy="afterInteractive" onLoad={initMermaid} />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="afterInteractive" />

      {/* Toasts */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className={`pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-lg border text-[11.5px] font-medium shadow-lg animate-[slideUp_0.2s_ease_both] max-w-[260px] ${t.type === 'success' ? 'bg-white border-green-200 text-green-600' :
              t.type === 'error' ? 'bg-white border-red-200 text-red-600' :
                'bg-white border-gray-200 text-gray-700'
            }`}>
            {t.type === 'success' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>}
            {t.type === 'error' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>}
            {t.type === 'info' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>}
            <span>{t.message}</span>
          </div>
        ))}
      </div>

      {/* Export Overlay */}
      {exporting && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-[300] gap-4">
          <div className="w-9 h-9 rounded-full border-2 border-gray-200 border-t-black animate-spin" />
          <p className="font-mono text-xs text-black  dark:text-white">{exportMsg}</p>
        </div>
      )}

      {/* Shortcuts Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200] flex items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="bg-white border border-gray-200 rounded-xl p-6 w-[90%] shadow-2xl">
            <h2 className="text-base font-bold text-black  dark:text-white mb-1">Keyboard Shortcuts</h2>
            <p className="text-[11px] text-black  dark:text-white mb-5">Speed up your workflow.</p>
            <table className="w-full text-xs text-gray-600 border-collapse">
              <tbody>
                {[
                  ['Render diagram', 'Ctrl', 'Enter'],
                  ['Clear editor', 'Ctrl + Shift', 'X'],
                  ['Export PNG', 'Ctrl + Shift', 'P'],
                  ['Export PDF', 'Ctrl + Shift', 'D'],
                ].map(([label, mod, key]) => (
                  <tr key={label} className="border-b border-gray-100 last:border-0">
                    <td className="py-2 text-gray-700">{label}</td>
                    <td className="py-2 text-right">
                      <kbd className="inline-flex items-center px-1 py-0.5 rounded font-mono text-[10px] bg-gray-100 text-gray-600 border border-gray-300">{mod}</kbd>
                      {' + '}
                      <kbd className="inline-flex items-center px-1 py-0.5 rounded font-mono text-[10px] bg-gray-100 text-gray-600 border border-gray-300">{key}</kbd>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="py-2 text-gray-700">Show shortcuts</td>
                  <td className="py-2 text-right">
                    <kbd className="inline-flex items-center px-1 py-0.5 rounded font-mono text-[10px] bg-gray-100 text-gray-600 border border-gray-300">?</kbd>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-end mt-5">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition-colors">Got it</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="h-[52px] flex items-center px-4 gap-3 border-b border-gray-200 bg-white shrink-0 z-50">
        <a href="/" className="flex items-center gap-2 no-underline shrink-0" aria-label="Home">
          <div className="w-[30px] h-[30px] bg-black rounded-md flex items-center justify-center font-mono font-bold text-[9px] text-white tracking-tighter">UML</div>
          <span className="font-mono font-bold text-[13px] text-black  dark:text-white tracking-tight hidden sm:block">TheFreeAI<span className="font-black">TOOLS</span></span>
        </a>

        <div className="flex-1 flex justify-center overflow-hidden">
          <div className="flex gap-0.5 bg-gray-100 border border-gray-200 rounded-lg p-[3px] overflow-x-auto [&::-webkit-scrollbar]:hidden" role="tablist">
            {(Object.keys(TAB_LABELS) as DiagramType[]).map((type) => (
              <button
                key={type}
                role="tab"
                aria-selected={activeTab === type}
                onClick={() => handleTabClick(type)}
                className={`px-3 py-[5px] rounded-md text-[11px] font-semibold transition-all whitespace-nowrap tracking-wide ${activeTab === type ? 'bg-black text-white' : 'text-black  dark:text-white hover:text-black hover:bg-white'}`}
              >
                {TAB_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button onClick={() => { if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current); renderDiagram(); }} title="Render (Ctrl+Enter)" className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-md border border-gray-300 bg-white text-[11px] font-semibold text-gray-700 hover:border-black hover:text-black transition-all">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            <span className="hidden sm:inline">Render</span>
          </button>
          <button onClick={exportPNG} title="Export PNG (Ctrl+Shift+P)" className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-md border border-gray-300 bg-white text-[11px] font-semibold text-gray-700 hover:border-black hover:text-black transition-all">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
            <span className="hidden sm:inline">PNG</span>
          </button>
          <button onClick={exportSVG} title="Export SVG" className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-md border border-gray-300 bg-white text-[11px] font-semibold text-gray-700 hover:border-black hover:text-black transition-all">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
            <span className="hidden sm:inline">SVG</span>
          </button>
          <button onClick={exportPDF} title="Export PDF (Ctrl+Shift+D)" className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-md border border-gray-300 bg-white text-[11px] font-semibold text-gray-700 hover:border-black hover:text-black transition-all hidden md:flex">
            PDF
          </button>
          <button onClick={handleClear} title="Clear (Ctrl+Shift+X)" className="p-[5px] rounded-md border border-gray-200 bg-white text-gray-400 hover:text-red-600 hover:border-red-300 transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" /></svg>
          </button>
          <button onClick={() => setModalOpen(true)} title="Shortcuts (?)" className="p-[5px] rounded-md border border-gray-200 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-700 transition-all">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          </button>
        </div>
      </header>

      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Editor */}
        <aside ref={editorPanelRef} aria-label="Code editor" className="flex flex-col border-r border-gray-200 bg-white shrink-0" style={{ width: '40%', minWidth: 240 }}>
          <div className="h-9 flex items-center px-3 border-b border-gray-100 gap-2 shrink-0 bg-gray-50">
            <div className="flex gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <span className="font-mono text-[10px] text-gray-400 flex-1 text-center">diagram.mmd</span>
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div aria-hidden="true" className="w-10 pt-3 pr-1.5 bg-gray-50 border-r border-gray-100 font-mono text-[11px] text-gray-300 text-right overflow-hidden select-none shrink-0 leading-[1.7]">
              {Array.from({ length: lineCount }, (_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              aria-label="Diagram code editor"
              placeholder="Start typing your diagram code here…"
              className="flex-1 p-3 font-mono text-[12.5px] leading-[1.7] text-black  dark:text-white bg-white border-none resize-none outline-none"
              style={{ caretColor: '#000', tabSize: 2, whiteSpace: 'pre', overflowWrap: 'normal', overflowX: 'auto' }}
              onScroll={(e) => { const t = e.currentTarget; const ln = t.previousElementSibling as HTMLDivElement; if (ln) ln.scrollTop = t.scrollTop; }}
              onKeyUp={updateCursor}
              onClick={updateCursor}
              onKeyDown={handleEditorKey}
            />
          </div>

          <div className="h-[30px] border-t border-gray-100 px-3 flex items-center justify-between shrink-0 bg-gray-50">
            <div className="flex gap-2.5 items-center">
              <span className={`font-mono text-[11px] ${status === 'ready' ? 'text-green-600' : status === 'rendering' ? 'text-amber-600' : 'text-red-500'}`}>
                {status === 'ready' ? '● Ready' : status === 'rendering' ? '● Rendering…' : '● Error'}
              </span>
              <span className="font-mono text-[10px] text-gray-400">{cursorPos}</span>
            </div>
            <span className="font-mono text-[10px] text-gray-300">
              <kbd className="px-1 py-0.5 rounded bg-gray-100 text-black  dark:text-white border border-gray-200 text-[9px]">Ctrl</kbd>
              +<kbd className="px-1 py-0.5 rounded bg-gray-100 text-black  dark:text-white border border-gray-200 text-[9px]">Enter</kbd> to render
            </span>
          </div>
        </aside>

        {/* Resizer */}
        <div ref={resizerRef} aria-hidden="true" className="w-1 bg-gray-200 shrink-0 z-10 transition-colors hover:bg-black" style={{ cursor: 'col-resize' }} />

        {/* Preview */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50" aria-label="Diagram preview">
          <div className="h-9 flex items-center justify-between px-3 border-b border-gray-200 bg-white shrink-0">
            <span className="font-mono text-[10px] text-gray-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-pulse" />
              Live Preview
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setZoom(zoom - 0.2)} title="Zoom out" className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-400 hover:border-black hover:text-black transition-all">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
              </button>
              <span className="font-mono text-[10px] text-gray-400 min-w-[34px] text-center">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(zoom + 0.2)} title="Zoom in" className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-400 hover:border-black hover:text-black transition-all">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
              </button>
              <button onClick={() => { setZoom(1); toast('Zoom reset to 100%', 'info', 1200); }} title="Reset zoom" className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-400 hover:border-black hover:text-black transition-all">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" /></svg>
              </button>
              <button onClick={handleCopy} title="Copy code" className="w-7 h-7 flex items-center justify-center rounded border border-gray-200 bg-white text-gray-400 hover:border-black hover:text-black transition-all">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
              </button>
            </div>
          </div>

          <div ref={previewVpRef} className="flex-1 overflow-auto flex items-start justify-center p-8" style={{ backgroundImage: 'radial-gradient(#e4e4e7 1px, transparent 1px)', backgroundSize: '22px 22px' }}>
            <div ref={outputWrapRef} className="relative z-10 bg-white border border-gray-200 rounded-xl p-8 min-w-[280px] min-h-[180px] shadow-sm flex items-center justify-center max-w-full">
              {!svgOutput && !errorMsg && (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-5xl mb-3 opacity-10 select-none">◇</div>
                  <h3 className="font-semibold text-[13px] mb-1.5 text-gray-400">No diagram yet</h3>
                  <p className="text-[11px] leading-7 text-gray-300">
                    Pick a template from the sidebar<br />or start typing in the editor.<br /><br />
                    Press <kbd className="px-1 py-0.5 rounded bg-gray-100 text-black  dark:text-white border border-gray-200 text-[9px]">Ctrl</kbd>+<kbd className="px-1 py-0.5 rounded bg-gray-100 text-black  dark:text-white border border-gray-200 text-[9px]">Enter</kbd> to render.
                  </p>
                </div>
              )}
              {errorMsg && (
                <div className="text-center p-5">
                  <div className="bg-red-50 border border-red-200 rounded-lg px-5 py-4 font-mono text-[11px] text-red-600 text-left whitespace-pre-wrap max-w-md leading-relaxed">⚠ Syntax Error{'\n\n'}{errorMsg}</div>
                  <p className="mt-3 text-[11px] text-gray-400">Check your diagram syntax and try again.</p>
                </div>
              )}
              {svgOutput && !errorMsg && (
                <div dangerouslySetInnerHTML={{ __html: svgOutput }} className="w-full flex justify-center" />
              )}
            </div>
          </div>
        </main>

        {/* Sidebar */}
        <aside className=" border-l border-gray-200 bg-white flex flex-col overflow-hidden shrink-0 hidden lg:flex" aria-label="Diagram templates">
          <div className="px-3 py-2.5 border-b border-gray-100 font-mono text-[9px] text-gray-400 uppercase tracking-[1.5px]">Templates</div>
          <div className="overflow-y-auto flex-1 p-1.5">
            {TEMPLATES.map((tmpl, i) => (
              <div
                key={i}
                role="button"
                tabIndex={0}
                aria-label={`Load ${tmpl.name} template`}
                onClick={() => loadTemplate(i)}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); loadTemplate(i); } }}
                className={`px-2.5 py-2 rounded-lg cursor-pointer transition-all mb-0.5 select-none ${activeSnippet === i ? 'bg-black' : 'hover:bg-gray-100'}`}
              >
                <div className={`text-[11px] font-semibold mb-1 ${activeSnippet === i ? 'text-white' : 'text-gray-800'}`}>{tmpl.name}</div>
                <span className={`text-[8px] font-bold uppercase tracking-wide px-1 py-[1px] rounded ${activeSnippet === i ? 'bg-white/20 text-white/80' : 'bg-gray-100 text-black  dark:text-white'}`}>{tmpl.type}</span>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* ── SEO / MARKETING SECTIONS ── */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">

          {/* Quick Answer */}
          <section className="max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-black  dark:text-white mb-3">What is a UML diagram and how do I create one for free?</h2>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-700 leading-relaxed">
              UML (Unified Modeling Language) is a standardized way to visualize software systems. You can create class diagrams, sequence diagrams, ER diagrams, flowcharts, and more for free using the editor above. Simply pick a template or type Mermaid.js syntax, then export to PNG, SVG, or PDF instantly.
            </div>
          </section>

          {/* Who Uses This */}
          <section>
            <h2 className="text-2xl font-bold text-black  dark:text-white mb-6 text-center">Who Uses This Tool?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: 'Software Engineers', desc: 'Design system architecture, plan APIs, and document code structure with class and sequence diagrams.', icon: '⚡' },
                { title: 'System Architects', desc: 'Map out infrastructure, database schemas, and microservice interactions using ER and flowchart diagrams.', icon: '🏗️' },
                { title: 'Students & Educators', desc: 'Learn UML notation, complete assignments, and visualize algorithms with ready-to-use templates.', icon: '🎓' },
                { title: 'Project Managers', desc: 'Plan sprints with Gantt charts, track workflows, and communicate requirements with use case diagrams.', icon: '📊' },
              ].map((card) => (
                <div key={card.title} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="text-2xl mb-3">{card.icon}</div>
                  <h3 className="font-semibold text-black  dark:text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-black  dark:text-white leading-relaxed">{card.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Email Capture */}
          <section className="max-w-xl mx-auto text-center">
            <h3 className="text-lg font-bold text-black  dark:text-white mb-2">Get new diagram templates in your inbox</h3>
            <p className="text-sm text-black  dark:text-white mb-4">Join 12,000+ developers. We send new Mermaid templates and tips weekly. No spam.</p>
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); toast('Thanks for subscribing!', 'success'); }}>
              <input type="email" placeholder="you@example.com" className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-black" required />
              <button type="submit" className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors">Subscribe</button>
            </form>
          </section>

          {/* FAQ */}
          <section className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-black  dark:text-white mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} className="group bg-white border border-gray-200 rounded-xl open:ring-1 open:ring-black/5 transition-all">
                  <summary className="flex justify-between items-center cursor-pointer p-5 font-semibold text-black  dark:text-white text-sm list-none">
                    {item.question}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform text-xs">▼</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed">{item.answer}</div>
                </details>
              ))}
            </div>
          </section>

          {/* Related Tools */}
          <section>
            <h2 className="text-xl font-bold text-black  dark:text-white mb-4 text-center">Related Tools</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { name: 'SQL Generator', href: '/sql-generator', desc: 'Generate SQL queries from natural language' },
                { name: 'JSON Formatter', href: '/json-formatter', desc: 'Format and validate JSON instantly' },
                { name: 'Regex Tester', href: '/regex-tester', desc: 'Test and debug regular expressions' },
                { name: 'Markdown Editor', href: '/markdown-editor', desc: 'Live preview markdown with export' },
              ].map((tool) => (
                <a key={tool.name} href={tool.href} className="block bg-gray-50 border border-gray-200 rounded-xl p-4 hover:border-gray-400 hover:bg-white transition-all">
                  <h3 className="font-semibold text-black  dark:text-white text-sm mb-1">{tool.name}</h3>
                  <p className="text-xs text-black  dark:text-white">{tool.desc}</p>
                </a>
              ))}
            </div>
          </section>

          {/* Footer Content */}
          <footer className="border-t border-gray-200 pt-10 pb-4 text-center">
            <p className="text-sm text-gray-600 leading-relaxed max-w-2xl mx-auto mb-4">
              Our free UML diagram generator is powered by Mermaid.js, the same diagramming engine used by GitHub, Notion, and GitLab.
              Create professional software architecture diagrams, database ER diagrams, API sequence diagrams, and project Gantt charts without installing anything.
              Everything runs in your browser — your diagram code never leaves your device.
            </p>
            <p className="text-xs text-gray-400">
              Related searches: free UML tool, online class diagram maker, sequence diagram generator, ER diagram tool, Mermaid editor,
              flowchart creator, Git graph visualizer, system design diagram tool, database schema diagram, export diagram to PDF.
            </p>
          </footer>
        </div>
      </div>

      {/* Global Styles */}
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e4e4e7; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #d4d4d8; }
      `}</style>
    </div>
  );
}