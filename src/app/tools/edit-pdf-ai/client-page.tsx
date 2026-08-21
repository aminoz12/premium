"use client"
import { useEffect } from 'react';
import Script from 'next/script';

// ─── EMBEDDED STYLES ─────────────────────────────────────────────────────────
const CSS = `

:root{
  --bg:#08090c;--s1:#0f1117;--s2:#161820;--s3:#1c1f28;--s4:#222530;--s5:#282b37;
  --b1:rgba(255,255,255,.06);--b2:rgba(255,255,255,.10);--b3:rgba(255,255,255,.18);
  --acc:#ff5f2e;--acc2:#ff7a4d;--acc3:#e84d1e;--glow:rgba(255,95,46,.28);
  --blue:#3b82f6;--green:#22c55e;--amber:#f59e0b;--red:#ef4444;--purple:#8b5cf6;--cyan:#06b6d4;
  --t1:#f0f2f7;--t2:#b8bdd0;--t3:#6b7594;--t4:#3d4560;
  --ff:'Inter',system-ui,sans-serif;--ffm:'JetBrains Mono',monospace;
  --r4:4px;--r6:6px;--r8:8px;--r12:12px;--r16:16px;--r24:24px;
  --sh:0 4px 24px rgba(0,0,0,.5);--sh2:0 8px 48px rgba(0,0,0,.7);
  --tr:.15s cubic-bezier(.4,0,.2,1);
  --tbh:52px;--sbw:212px;--rpw:252px;
}
::-webkit-scrollbar{width:4px;height:4px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--s4);border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:var(--s5)}
::selection{background:rgba(255,95,46,.3);color:#fff}

#ep-prog{position:fixed;top:0;left:0;height:2px;background:linear-gradient(90deg,var(--acc),var(--acc2));width:0;transition:width .3s ease;z-index:9999;pointer-events:none}

#ep-toast{position:fixed;bottom:28px;left:50%;transform:translateX(-50%) translateY(20px);background:var(--s2);border:1px solid var(--b2);color:var(--t2);font:500 12px/1 var(--ff);padding:10px 18px;border-radius:var(--r12);opacity:0;transition:all .25s;z-index:9998;white-space:nowrap;box-shadow:var(--sh2);pointer-events:none;max-width:400px;text-align:center}
#ep-toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
#ep-toast.ok{border-color:rgba(34,197,94,.3);color:var(--green)}
#ep-toast.err{border-color:rgba(239,68,68,.3);color:var(--red)}
#ep-toast.info{border-color:rgba(59,130,246,.3);color:var(--blue)}

#ep-app{position:fixed;inset:0;width:100vw;height:100vh;z-index:200;display:flex;flex-direction:column;overflow:hidden;font-family:var(--ff)}

#ep-tb{height:var(--tbh);background:var(--s1);border-bottom:1px solid var(--b1);display:flex;align-items:center;padding:0 10px;gap:2px;flex-shrink:0;z-index:300;overflow:hidden}
.ep-logo{font:700 14px/1 var(--ff);color:#fff;display:flex;align-items:center;gap:2px;flex-shrink:0;padding:6px 10px;border-radius:var(--r8);transition:background var(--tr);letter-spacing:-.3px;cursor:default}
.ep-logo em{color:var(--acc);font-style:normal}
.ep-sep{width:1px;height:18px;background:var(--b2);margin:0 4px;flex-shrink:0}
.ep-tbtn{display:inline-flex;align-items:center;gap:5px;padding:5px 8px;border:none;border-radius:var(--r6);background:transparent;color:var(--t3);cursor:pointer;font:500 11px/1 var(--ff);white-space:nowrap;transition:all var(--tr);flex-shrink:0;height:30px;letter-spacing:-.01em}
.ep-tbtn:hover{background:var(--s3);color:var(--t1)}
.ep-tbtn.pri{background:linear-gradient(135deg,var(--acc),var(--acc3));color:#fff;font-weight:600;padding:5px 14px;box-shadow:0 2px 12px var(--glow)}
.ep-tbtn.pri:hover{background:linear-gradient(135deg,var(--acc2),var(--acc));transform:translateY(-1px);box-shadow:0 4px 20px var(--glow)}
.ep-tbtn svg{width:13px;height:13px;flex-shrink:0}
#ep-zl,#ep-pl{font:500 11px/1 var(--ffm);color:var(--t3);min-width:44px;text-align:center;flex-shrink:0}

#ep-body{display:flex;flex:1;overflow:hidden}

#ep-sb{width:var(--sbw);background:var(--s1);border-right:1px solid var(--b1);display:flex;flex-direction:column;overflow-y:auto;overflow-x:hidden;flex-shrink:0}
.ep-sl{font:600 9px/1 var(--ff);letter-spacing:.12em;text-transform:uppercase;color:var(--t4);padding:12px 12px 5px;display:flex;align-items:center;justify-content:space-between}
.ep-sdiv{height:1px;background:var(--b1);margin:5px 10px}
.ep-tgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:2px;padding:4px 6px}
.ep-stool{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;padding:9px 3px;border:none;background:transparent;color:var(--t3);cursor:pointer;font:500 9px/1.2 var(--ff);letter-spacing:.01em;transition:all var(--tr);border-radius:var(--r8);position:relative}
.ep-stool:hover{background:var(--s3);color:var(--t1)}
.ep-stool.on{background:rgba(255,95,46,.1);color:var(--acc)}
.ep-stool.on::after{content:'';position:absolute;bottom:3px;left:50%;transform:translateX(-50%);width:16px;height:2px;background:var(--acc);border-radius:1px}
.ep-stool svg{width:17px;height:17px}
.ep-sa{display:flex;align-items:center;gap:8px;padding:7px 12px;border:none;background:transparent;color:var(--t3);cursor:pointer;font:400 11px/1 var(--ff);width:100%;border-radius:var(--r6);transition:all var(--tr)}
.ep-sa:hover{background:var(--s3);color:var(--t1)}
.ep-sa svg{width:13px;height:13px;flex-shrink:0}
#ep-thumbs{overflow-y:auto;padding:6px 8px;display:flex;flex-direction:column;gap:6px;padding-bottom:16px}
.ep-thumb{border-radius:var(--r6);overflow:hidden;cursor:pointer;border:2px solid transparent;transition:all .15s;position:relative;background:#fff;flex-shrink:0}
.ep-thumb:hover{border-color:rgba(255,95,46,.4)}
.ep-thumb.on{border-color:var(--acc);box-shadow:0 0 0 3px rgba(255,95,46,.15)}
.ep-thumb canvas{width:100%;display:block;pointer-events:none}
.ep-thn{position:absolute;bottom:0;left:0;right:0;background:linear-gradient(transparent,rgba(0,0,0,.7));color:#fff;font:500 9px/1 var(--ffm);padding:6px 0 4px;text-align:center;pointer-events:none}
.ep-tdel{position:absolute;top:4px;right:4px;width:18px;height:18px;border-radius:50%;background:rgba(239,68,68,.9);border:none;color:#fff;font:bold 11px/18px monospace;cursor:pointer;display:none;text-align:center}
.ep-thumb:hover .ep-tdel{display:block}

#ep-cw{flex:1;overflow:auto;position:relative;background:var(--bg);background-image:linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px);background-size:32px 32px;display:flex;flex-direction:column;align-items:center;padding:32px 24px 100px;gap:32px}

.ep-dz{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;width:min(740px,94%);min-height:440px;border:2px dashed rgba(255,95,46,.2);border-radius:var(--r24);cursor:pointer;transition:all .25s;padding:56px 40px;text-align:center;position:relative;overflow:hidden}
.ep-dz::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at center,rgba(255,95,46,.04) 0%,transparent 70%);pointer-events:none}
.ep-dz:hover,.ep-dz.over{border-color:var(--acc);background:rgba(255,95,46,.04)}
.ep-dz-icon{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,rgba(255,95,46,.15),rgba(255,95,46,.05));display:flex;align-items:center;justify-content:center;border:1px solid rgba(255,95,46,.2);margin-bottom:4px}
.ep-dz h2{font:700 24px/1.3 var(--ff);color:#fff;letter-spacing:-.5px}
.ep-dz>p{color:var(--t3);font-size:13px;line-height:1.6;max-width:440px}
.ep-dz-btn{background:linear-gradient(135deg,var(--acc),var(--acc3));color:#fff;border:none;border-radius:var(--r12);padding:12px 28px;font:600 13px var(--ff);cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:8px;box-shadow:0 4px 20px var(--glow)}
.ep-dz-btn:hover{transform:translateY(-2px);box-shadow:0 8px 32px var(--glow)}
.ep-chips{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}
.ep-chip{font:500 11px/1 var(--ff);padding:5px 12px;background:rgba(255,255,255,.04);border:1px solid var(--b2);border-radius:20px;color:var(--t3)}

.ep-page{position:relative;background:#fff;border-radius:2px;transform-origin:top center;overflow:visible;flex-shrink:0;box-shadow:0 8px 60px rgba(0,0,0,.8)}
.ep-pg-lbl{position:absolute;bottom:-26px;left:50%;transform:translateX(-50%);font:500 10px/1 var(--ffm);color:var(--t4);white-space:nowrap;pointer-events:none}
.ep-pdf-cv{position:absolute;top:0;left:0;z-index:1;pointer-events:none;display:block}
.ep-draw-cv{position:absolute;top:0;left:0;z-index:5;touch-action:none;display:none}
.ep-draw-cv.on{display:block}
.ep-ann{position:absolute;top:0;left:0;z-index:10;pointer-events:none;overflow:visible}
.ep-ann.on{pointer-events:all}

.ep-tov{position:absolute;cursor:default;border-radius:2px;background:transparent;transition:background .12s,outline .12s;pointer-events:auto;display:flex;align-items:center;}
.ep-tov.editing-mode{cursor:text;outline:1.5px dashed rgba(255,95,46,.5);background:rgba(255,95,46,.04)}
.ep-tov.editing-mode:hover{background:rgba(255,95,46,.14);outline:2px solid rgba(255,95,46,.85)}

.ep-tedit{position:absolute;z-index:50;background:rgba(255,255,255,.97);border:2px solid var(--acc);border-radius:3px;outline:none;padding:1px 3px;white-space:pre-wrap;word-break:break-word;line-height:1.4;box-shadow:0 0 0 4px rgba(255,95,46,.15),0 4px 20px rgba(0,0,0,.3);min-width:30px;min-height:14px;cursor:text}
.ep-tedit:focus{border-color:var(--acc2)}

.ep-el{position:absolute;box-sizing:border-box;user-select:none}
.ep-el.sel{outline:2px solid var(--acc);outline-offset:1px;z-index:50!important}
.ep-pop{animation:epPop .18s cubic-bezier(.34,1.56,.64,1)}
@keyframes epPop{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}
.ep-el-del{position:absolute;top:-14px;right:-14px;width:24px;height:24px;border-radius:50%;background:var(--red);border:2px solid var(--s1);color:#fff;font:bold 13px/20px monospace;cursor:pointer;display:none;z-index:60;box-shadow:0 2px 8px rgba(0,0,0,.4);text-align:center}
.ep-el-del:hover{background:#dc2626;transform:scale(1.15)}
.ep-el.sel .ep-el-del{display:block}
.ep-el-res{position:absolute;bottom:-8px;right:-8px;width:16px;height:16px;background:var(--acc);border:2px solid var(--s1);border-radius:3px;cursor:se-resize;display:none;z-index:60}
.ep-el.sel .ep-el-res{display:block}
.ep-el-rot{position:absolute;top:-38px;left:50%;transform:translateX(-50%);width:22px;height:22px;background:var(--s3);border:1px solid var(--b3);border-radius:50%;cursor:grab;display:none;z-index:60;align-items:center;justify-content:center}
.ep-el-rot:hover{background:var(--acc);border-color:var(--acc)}
.ep-el.sel .ep-el-rot{display:flex}
.ep-el-mv{position:absolute;top:-14px;left:50%;transform:translateX(-50%);padding:0 8px;height:14px;background:var(--acc);border-radius:3px 3px 0 0;cursor:grab;display:none;z-index:60;align-items:center;justify-content:center}
.ep-el.sel .ep-el-mv{display:flex}
.ep-el-bar{position:absolute;top:-52px;left:50%;transform:translateX(-50%);background:var(--s2);border:1px solid var(--b2);border-radius:var(--r8);padding:3px;display:none;gap:1px;z-index:70;box-shadow:var(--sh);white-space:nowrap}
.ep-el.sel .ep-el-bar{display:flex}
.ep-bbar-btn{background:none;border:none;color:var(--t3);cursor:pointer;padding:4px 7px;border-radius:var(--r4);font:500 10px var(--ff);transition:all var(--tr);display:flex;align-items:center;gap:4px}
.ep-bbar-btn:hover{background:var(--s4);color:var(--t1)}
.ep-bbar-btn svg{width:11px;height:11px}
.ep-txt-el{font-family:'Inter',sans-serif;color:#000;background:transparent;border:none;outline:none;min-width:60px;min-height:22px;padding:2px 3px;white-space:pre-wrap;word-break:break-word;line-height:1.45;cursor:text}
.ep-txt-el:hover,.ep-txt-el.editing{outline:1.5px dashed rgba(255,95,46,.5);outline-offset:2px;background:rgba(255,255,255,.9)}
.ep-txt-el[contenteditable=true]:focus{outline:2px solid var(--acc);background:rgba(255,255,255,.95)}
.ep-note-el{background:#fef9c3;border:1.5px solid #eab308;border-radius:var(--r8);padding:10px 12px;font:13px/1.5 'Inter',sans-serif;color:#78350f;min-width:160px;min-height:70px;white-space:pre-wrap;word-break:break-word;cursor:text}
.ep-note-el[contenteditable=true]:focus{outline:2px solid #ca8a04}
.ep-img-el{display:block;width:100%;height:100%;object-fit:contain;pointer-events:none;user-select:none}
.ep-stamp-el{display:flex;align-items:center;justify-content:center;border-radius:var(--r6);font:700 13px/1 var(--ff);letter-spacing:2px;white-space:nowrap;padding:8px 16px;background:rgba(255,255,255,.92);width:100%;height:100%;border:2.5px solid currentColor;pointer-events:none}
.ep-callout{background:#fff;border:2px solid var(--acc);border-radius:var(--r8);padding:8px 12px;font:13px/1.5 'Inter',sans-serif;color:#111;min-width:140px;position:relative;white-space:pre-wrap;word-break:break-word;cursor:text}
.ep-callout::after{content:'';position:absolute;bottom:-12px;left:16px;border:6px solid transparent;border-top-color:var(--acc)}
.ep-callout[contenteditable=true]:focus{outline:2px solid var(--acc)}
.ep-link-el{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.3);border-radius:var(--r4);padding:4px 8px;font:500 12px/1 'Inter',sans-serif;color:var(--blue);text-decoration:underline;cursor:pointer;white-space:nowrap}
.ep-redact{background:#1a1a1a;border-radius:2px;min-width:40px;min-height:16px;pointer-events:none}
.ep-counter{background:var(--acc);color:#fff;border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;font:700 14px/1 'Inter',sans-serif;pointer-events:none}
.ep-prog-wrap{background:rgba(255,255,255,.9);border:1px solid rgba(0,0,0,.1);border-radius:12px;overflow:hidden;height:20px;min-width:120px}
.ep-prog-fill{height:100%;background:linear-gradient(90deg,var(--acc),var(--acc2));border-radius:12px}

#ep-rp{width:var(--rpw);background:var(--s1);border-left:1px solid var(--b1);overflow-y:auto;flex-shrink:0}
.ep-rs{padding:10px 12px;border-bottom:1px solid var(--b1)}
.ep-rh{font:600 9px/1 var(--ff);letter-spacing:.1em;text-transform:uppercase;color:var(--t4);display:block;margin-bottom:8px}
.ep-clrs{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px}
.ep-cd{width:18px;height:18px;border-radius:50%;cursor:pointer;transition:transform var(--tr)}
.ep-cd:hover{transform:scale(1.15)}
.ep-cd.on{outline:2px solid #fff;outline-offset:2px}
.ep-ri{width:100%;background:var(--s3);border:1px solid var(--b2);border-radius:var(--r6);color:var(--t2);font:400 11px/1 var(--ff);padding:7px 9px;outline:none;transition:border-color var(--tr)}
.ep-ri:focus{border-color:var(--acc)}
.ep-ri option{background:var(--s3)}
select.ep-ri{cursor:pointer}
.ep-sr{display:flex;align-items:center;gap:8px}
.ep-sr input[type=range]{flex:1;accent-color:var(--acc);cursor:pointer}
.ep-sv{font:500 10px/1 var(--ffm);color:var(--t3);min-width:32px;text-align:right}
.ep-fbtns{display:flex;gap:4px;margin-top:6px}
.ep-fbtn{flex:1;background:var(--s3);border:1px solid var(--b2);border-radius:var(--r4);color:var(--t3);cursor:pointer;padding:5px;font:600 12px var(--ff);transition:all var(--tr)}
.ep-fbtn:hover{background:var(--s4);color:var(--t1)}
.ep-fbtn.on{background:rgba(255,95,46,.15);border-color:rgba(255,95,46,.3);color:var(--acc)}
.ep-mini-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:4px}
.ep-mini-btn{background:var(--s3);border:1px solid var(--b2);border-radius:var(--r6);color:var(--t3);cursor:pointer;padding:7px 6px;font:500 10px/1 var(--ff);display:flex;align-items:center;gap:5px;transition:all var(--tr)}
.ep-mini-btn:hover{background:var(--s4);color:var(--t1)}
.ep-mini-btn svg{width:13px;height:13px;flex-shrink:0}
.ep-stamp-btn{display:flex;align-items:center;gap:7px;width:100%;background:none;border:none;padding:7px 12px;cursor:pointer;font:500 11px/1 var(--ff);border-radius:var(--r6);transition:background var(--tr)}
.ep-stamp-btn:hover{background:var(--s3)}

#ep-foot{background:var(--s1);border-top:1px solid var(--b1);padding:10px 20px;flex-shrink:0;font:400 11px/1 var(--ff);color:var(--t4)}
.ep-fi{max-width:1200px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:8px}

#ep-fab{position:fixed;bottom:20px;right:20px;background:linear-gradient(135deg,var(--acc),var(--acc3));color:#fff;border:none;border-radius:var(--r16);padding:12px 20px;font:600 13px var(--ff);cursor:pointer;display:none;align-items:center;gap:8px;box-shadow:0 4px 24px var(--glow);z-index:200;transition:all .2s}
#ep-fab:hover{transform:translateY(-2px);box-shadow:0 8px 32px var(--glow)}
#ep-fab.on{display:flex}
#ep-fab svg{width:14px;height:14px}

#ep-ctx{position:fixed;background:var(--s2);border:1px solid var(--b2);border-radius:var(--r8);padding:4px;z-index:500;box-shadow:var(--sh2);display:none;min-width:158px}
#ep-ctx.open{display:block}
.ep-ctx-i{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:var(--r6);cursor:pointer;font:400 12px/1 var(--ff);color:var(--t2);transition:background var(--tr)}
.ep-ctx-i:hover{background:var(--s4);color:var(--t1)}
.ep-ctx-i svg{width:13px;height:13px;flex-shrink:0}
.ep-ctx-i.red{color:var(--red)}
.ep-ctx-i.red:hover{background:rgba(239,68,68,.1)}
.ep-ctx-sep{height:1px;background:var(--b1);margin:3px 0}

.ep-mbg{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:800;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
.ep-mbg.open{display:flex}
.ep-mbox{background:var(--s2);border:1px solid var(--b2);border-radius:var(--r16);padding:24px;width:min(420px,94vw);box-shadow:var(--sh2)}
.ep-mbox h3{font:700 16px/1 var(--ff);color:var(--t1);margin-bottom:8px}
.ep-mbox>p{font:400 12px/1.5 var(--ff);color:var(--t3);margin-bottom:16px}
.ep-mbtns{display:flex;gap:8px;justify-content:flex-end;margin-top:16px}
.ep-mb{border:1px solid var(--b2);border-radius:var(--r8);padding:8px 18px;font:600 12px var(--ff);cursor:pointer;transition:all var(--tr)}
.ep-mb.gh{background:var(--s3);color:var(--t2)}.ep-mb.gh:hover{background:var(--s4);color:var(--t1)}
.ep-mb.pri{background:linear-gradient(135deg,var(--acc),var(--acc3));color:#fff;border:none;box-shadow:0 2px 12px var(--glow)}
.ep-mb.pri:hover{transform:translateY(-1px);box-shadow:0 4px 20px var(--glow)}
#ep-sigcv{width:100%;height:130px;background:#fff;border-radius:var(--r8);cursor:crosshair;touch-action:none;display:block;border:1px solid var(--b2)}

#ep-kbp{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:900;display:none;align-items:center;justify-content:center;backdrop-filter:blur(4px)}
#ep-kbp.open{display:flex}
.ep-kbbox{background:var(--s2);border:1px solid var(--b2);border-radius:var(--r16);padding:24px;width:min(560px,94vw);max-height:80vh;overflow-y:auto;box-shadow:var(--sh2)}
.ep-kbgrid{display:grid;grid-template-columns:1fr 1fr;gap:6px 24px;margin-top:8px}
.ep-kbrow{display:flex;align-items:center;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--b1)}
.ep-kbrow span{font:400 12px/1 var(--ff);color:var(--t3)}
kbd{background:var(--s3);border:1px solid var(--b3);border-radius:4px;padding:3px 7px;font:600 10px/1 var(--ffm);color:var(--t2)}

#ep-editbanner{display:none;position:fixed;top:var(--tbh);left:var(--sbw);right:var(--rpw);z-index:290;background:linear-gradient(90deg,rgba(59,130,246,.12),rgba(59,130,246,.06));border-bottom:1px solid rgba(59,130,246,.25);padding:7px 16px;font:500 12px/1 var(--ff);color:var(--blue);text-align:center;pointer-events:none;backdrop-filter:blur(4px)}
#ep-editbanner.on{display:block}

@media(max-width:768px){
  #ep-sb{width:60px}
  .ep-sl,.ep-sa span,.ep-stool span{display:none}
  .ep-tgrid{grid-template-columns:1fr}
  #ep-rp{display:none}
}
`;

// ─── STATE ────────────────────────────────────────────────────────────────────
const S: any = {
  pages: [] as any[], cur: 0, zoom: 1, tool: 'select',
  sel: null as HTMLElement | null,
  undos: [] as any[], redos: [] as any[],
  sigColor: '#000', sigDrawing: false,
  ctxTarget: null as HTMLElement | null,
  drawPath: null as any, drawPageIdx: -1,
};
const C: any = {
  color: '#000000', sw: 2, op: 1, hlw: 18, er: 24,
  font: "'Inter',sans-serif", fs: 18, align: 'left',
  bold: false, italic: false, underline: false, strike: false,
  fill: 'none', rad: 0,
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const g = (id: string) => document.getElementById(id);
const mkc = (W: number, H: number) => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
const imgLoad = (src: string) => new Promise<HTMLImageElement>((res, rej) => {
  const i = new Image(); i.crossOrigin = 'anonymous';
  i.onload = () => res(i); i.onerror = () => rej(new Error('img fail'));
  i.src = src;
});

// ─── TOAST / PROGRESS ────────────────────────────────────────────────────────
let _tt: ReturnType<typeof setTimeout>;
function toast(msg: string, type = '') {
  const t = g('ep-toast'); if (!t) return;
  t.textContent = msg; t.className = 'show' + (type ? ' ' + type : '');
  clearTimeout(_tt); _tt = setTimeout(() => { if (t) t.className = ''; }, 3000);
}
function prog(w: number) {
  const b = g('ep-prog'); if (!b) return;
  b.style.width = w + '%';
  if (w >= 100) setTimeout(() => { if (b) b.style.width = '0'; }, 600);
}

// ─── FILE OPEN ────────────────────────────────────────────────────────────────
function openFile() { const fi = g('ep-finp'); if (fi) fi.click(); }
function trigImg() {
  if (!S.pages.length) { toast('Open a PDF first', 'err'); return; }
  const ii = g('ep-iinp'); if (ii) ii.click();
}
function onDrop(e: DragEvent) {
  e.preventDefault();
  const dz = g('ep-dz'); if (dz) dz.classList.remove('over');
  const f = e.dataTransfer?.files[0]; if (f) handleFile(f);
}
function onFileChange(e: Event) {
  const t = e.target as HTMLInputElement;
  const f = t.files?.[0]; if (f) handleFile(f); t.value = '';
}
function handleFile(f: File) {
  if (!window.pdfjsLib) { toast('PDF engine loading, try again in 1s', 'info'); setTimeout(() => handleFile(f), 900); return; }
  if (f.type === 'application/pdf') loadPDF(f);
  else if (f.type.startsWith('image/')) loadImgFile(f);
  else toast('Please select a PDF or image file', 'err');
}
async function loadPDF(file: File) {
  prog(15);
  try {
    const ab = await file.arrayBuffer(); prog(40);
    const doc = await (window as any).pdfjsLib.getDocument({ data: ab }).promise; prog(55);
    resetEditor();
    for (let i = 1; i <= doc.numPages; i++) {
      prog(55 + Math.round((i / doc.numPages) * 40));
      await renderPDFPage(doc, i);
    }
    prog(100); showUI();
    toast(`Loaded ${doc.numPages} page${doc.numPages > 1 ? 's' : ''} ✓`, 'ok');
  } catch (err: any) { prog(0); toast('Error: ' + err.message, 'err'); console.error(err); }
}
async function loadImgFile(file: File) {
  const url = URL.createObjectURL(file);
  const img = await imgLoad(url);
  const maxW = 800, sc = Math.min(1, maxW / img.naturalWidth);
  const W = Math.round(img.naturalWidth * sc), H = Math.round(img.naturalHeight * sc);
  const cv = mkc(W, H); cv.getContext('2d')!.drawImage(img, 0, 0, W, H);
  resetEditor(); buildPage(cv, W, H, 0); showUI(); toast('Image loaded ✓', 'ok');
}
function resetEditor() {
  S.pages = []; S.cur = 0; S.undos = []; S.redos = []; S.sel = null;
  const dz = g('ep-dz'); if (dz) dz.style.display = 'flex';
  const pw = g('ep-pw'); if (pw) { pw.style.display = 'none'; pw.innerHTML = ''; }
  const th = g('ep-thumbs'); if (th) th.innerHTML = '';
  hideUI();
}

const RENDER_SCALE = 1.5;
async function renderPDFPage(doc: any, n: number) {
  const page = await doc.getPage(n);
  const vp = page.getViewport({ scale: RENDER_SCALE });
  const W = Math.round(vp.width), H = Math.round(vp.height);
  const cv = mkc(W, H);
  await page.render({ canvasContext: cv.getContext('2d')!, viewport: vp }).promise;
  const idx = S.pages.length;
  buildPage(cv, W, H, idx);
  extractTextOverlays(page, idx, W, H).catch(() => { });
}

async function extractTextOverlays(page: any, idx: number, W: number, H: number) {
  const p = S.pages[idx]; if (!p) return;
  let tc: any;
  try { tc = await page.getTextContent(); } catch { return; }

  const tl = p.textLayer as HTMLElement;
  tl.innerHTML = '';

  tc.items.forEach((item: any) => {
    if (!item.str) return;
    const str = item.str;
    const [a, b, c, d, tx, ty] = item.transform as number[];
    const fontH = Math.abs(d) || Math.abs(a) || 12;
    const screenX = tx * RENDER_SCALE;
    const screenY = H - (ty * RENDER_SCALE) - (fontH * RENDER_SCALE);
    const boxW = Math.max((item.width || 0) * RENDER_SCALE, 8);
    const boxH = Math.max(fontH * RENDER_SCALE * 1.35, 10);
    const fontSize = fontH * RENDER_SCALE;

    if (screenX > W + 20 || screenY > H + 20 || screenX + boxW < -20) return;
    const displayX = Math.max(0, screenX);
    const displayY = Math.max(0, screenY);

    const ov = document.createElement('div');
    ov.className = 'ep-tov';
    ov.style.cssText = `left:${displayX}px;top:${displayY}px;width:${boxW}px;height:${boxH}px;font-size:${fontSize}px;pointer-events:auto;`;
    ov.dataset.str = str;
    ov.dataset.x = String(screenX);
    ov.dataset.y = String(Math.max(0, screenY));
    ov.dataset.w = String(boxW);
    ov.dataset.h = String(boxH);
    ov.dataset.fs = String(fontSize);
    ov.dataset.idx = String(idx);
    ov.title = str.length > 50 ? str.slice(0, 50) + '…' : str;

    ov.addEventListener('mousedown', (e) => {
      if (S.tool !== 'editText') return;
      e.stopPropagation(); e.preventDefault();
      beginEditTextOverlay(ov, idx);
    });

    tl.appendChild(ov);
  });
}

// ─── FIX 1: beginEditTextOverlay — no duplicate text ─────────────────────────
// KEY FIXES:
//   • Whiteout rect painted on BOTH p.pdfCv AND p.dc with generous asymmetric
//     padding — this erases the original raster glyph completely.
//   • Overlay removed from DOM BEFORE painting so no flash of original text.
//   • Single ep-txt-el created on commit; no stacking of multiple elements.
//   • Per-overlay editing lock prevents double-entry.
// ─────────────────────────────────────────────────────────────────────────────
function beginEditTextOverlay(ov: HTMLElement, idx: number) {
  if (ov.dataset.editing === '1') return;
  ov.dataset.editing = '1';

  const p = S.pages[idx]; if (!p) return;

  const x = parseFloat(ov.dataset.x || '0');
  const y = parseFloat(ov.dataset.y || '0');
  const w = parseFloat(ov.dataset.w || '80');
  const h = parseFloat(ov.dataset.h || '20');
  const fs = parseFloat(ov.dataset.fs || '14');
  const origText = ov.dataset.str || '';

  // Step 1: remove overlay BEFORE painting so there is no flash
  ov.remove();

  // Step 2: paint whiteout on BOTH canvases with generous padding.
  // Asymmetric: more right/bottom padding to cover ascenders, descenders
  // and the typical rightward overhang of the last glyph in a run.
  const padL = 6, padR = 32, padT = 8, padB = 12;
  const rx = x - padL;
  const ry = y - padT;
  const rw = w + padL + padR;
  const rh = h + padT + padB;

  // Paint on the raster PDF canvas — this permanently erases the baked glyph
  const pdfCtx = (p.pdfCv as HTMLCanvasElement).getContext('2d')!;
  pdfCtx.fillStyle = '#ffffff';
  pdfCtx.fillRect(rx, ry, rw, rh);

  // Also paint on the draw canvas so the compositor picks it up during export
  const dcCtx = (p.dc as HTMLCanvasElement).getContext('2d')!;
  dcCtx.fillStyle = '#ffffff';
  dcCtx.fillRect(rx, ry, rw, rh);

  // Track as a stroke for undo / export redraw
  const wo = {
    type: 'shape', shapeType: 'rect',
    x1: rx, y1: ry, x2: rx + rw, y2: ry + rh,
    color: '#ffffff', sw: 0, op: 1, fill: 'solid', rad: 0,
  };
  p.strokes.push(wo);
  pushUndo({ type: 'stroke', idx, stroke: wo });

  // Step 3: floating editor at the exact text position
  const ann = p.ann as HTMLElement;
  const ed = document.createElement('div');
  ed.className = 'ep-tedit ep-pop';
  ed.contentEditable = 'true';
  ed.spellcheck = false;
  ed.textContent = origText;
  ed.style.cssText = `left:${x}px;top:${y}px;min-width:${Math.max(w, 60)}px;font-size:${fs}px;font-family:${C.font};color:#000000;font-weight:400;font-style:normal;line-height:1.3;`;

  ann.appendChild(ed);
  ed.addEventListener('mousedown', e => e.stopPropagation());

  // Step 4: on blur, commit as a SINGLE new ep-txt-el — no overlay remains
  let committed = false;
  const commit = () => {
    if (committed) return;
    committed = true;

    const newText = ed.textContent || '';
    ed.remove();

    if (newText.trim()) {
      const wr = mkWrapper(idx, x, y, Math.max(w, 80), h);
      const el = document.createElement('div');
      el.className = 'ep-txt-el';
      el.contentEditable = 'true';
      el.textContent = newText;
      el.style.cssText = `font-family:${C.font};font-size:${fs}px;color:#000000;font-weight:400;font-style:normal;min-width:60px;min-height:${h}px;display:block;padding:0;line-height:1.3;`;
      el.addEventListener('mousedown', e => e.stopPropagation());
      el.addEventListener('focus', () => { el.classList.add('editing'); wr.classList.add('sel'); S.sel = wr; });
      el.addEventListener('blur', () => el.classList.remove('editing'));
      wr.appendChild(el);
      addEl(wr, idx);
      setTimeout(() => deselAll(), 0);
    }
  };

  ed.addEventListener('blur', commit);
  ed.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ed.blur(); }
    if (e.key === 'Escape') { committed = true; ed.remove(); }
  });

  setTimeout(() => {
    ed.focus();
    const r = document.createRange(); r.selectNodeContents(ed);
    const sel = window.getSelection(); sel?.removeAllRanges(); sel?.addRange(r);
    toast('Edit · Enter to confirm · Esc to cancel · Shift+Enter for new line', 'info');
  }, 20);
}

// ─── PAGE BUILD ───────────────────────────────────────────────────────────────
function buildPage(pdfCv: HTMLCanvasElement, W: number, H: number, idx: number) {
  const wrap = document.createElement('div');
  wrap.className = 'ep-page';
  wrap.style.cssText = `width:${W}px;height:${H}px`;
  wrap.dataset.idx = String(idx);

  const lbl = document.createElement('div');
  lbl.className = 'ep-pg-lbl'; lbl.textContent = `Page ${idx + 1}`;
  wrap.appendChild(lbl);

  pdfCv.className = 'ep-pdf-cv';
  pdfCv.style.cssText = `width:${W}px;height:${H}px;position:absolute;top:0;left:0;z-index:1;pointer-events:none`;
  wrap.appendChild(pdfCv);

  const tl = document.createElement('div');
  tl.className = 'ep-text-layer';
  tl.style.cssText = `position:absolute;top:0;left:0;z-index:8;width:${W}px;height:${H}px;pointer-events:none;overflow:visible`;
  wrap.appendChild(tl);

  const dc = mkc(W, H);
  dc.className = 'ep-draw-cv';
  dc.style.cssText = `position:absolute;top:0;left:0;z-index:5;width:${W}px;height:${H}px;`;
  wrap.appendChild(dc);

  const ann = document.createElement('div');
  ann.className = 'ep-ann';
  ann.style.cssText = `position:absolute;top:0;left:0;z-index:10;width:${W}px;height:${H}px;overflow:visible;`;
  ann.dataset.idx = String(idx);
  wrap.appendChild(ann);

  ann.addEventListener('click', e => {
    if (e.target !== ann) return;
    const r = ann.getBoundingClientRect();
    const x = (e.clientX - r.left) / S.zoom;
    const y = (e.clientY - r.top) / S.zoom;
    if (S.tool === 'text') placeText(idx, x, y);
    else if (S.tool === 'note') placeNote(idx, x, y);
    else if (S.tool === 'callout') placeCallout(idx, x, y);
    else if (S.tool === 'link') {
      (ann as any)._pendingLink = { idx, x, y };
      const lu = g('ep-link-url') as HTMLInputElement, lt = g('ep-link-txt') as HTMLInputElement;
      if (lu) lu.value = ''; if (lt) lt.value = '';
      openModal('link');
    } else if (S.tool === 'redact') placeRedact(idx, x, y);
  });

  bindDrawCanvas(dc, idx);

  const po: any = { wrap, pdfCv, dc, ann, textLayer: tl, W, H, rot: 0, strokes: [], els: [] };
  S.pages[idx] = po;

  const pw = g('ep-pw'); if (pw) pw.appendChild(wrap);
  buildThumb(pdfCv, idx);
  applyZP(idx);
  applyToolP(idx);
}

function buildThumb(pdfCv: HTMLCanvasElement, idx: number) {
  const w = document.createElement('div');
  w.className = 'ep-thumb' + (idx === 0 ? ' on' : '');
  w.dataset.idx = String(idx);
  const s = 140 / pdfCv.width;
  const tc = mkc(140, Math.round(pdfCv.height * s));
  tc.getContext('2d')!.drawImage(pdfCv, 0, 0, tc.width, tc.height);
  const n = document.createElement('div'); n.className = 'ep-thn'; n.textContent = String(idx + 1);
  const td = document.createElement('button');
  td.className = 'ep-tdel'; td.textContent = '×'; td.title = 'Delete page';
  td.addEventListener('click', e => { e.stopPropagation(); S.cur = idx; delPage(); });
  w.appendChild(tc); w.appendChild(n); w.appendChild(td);
  w.onclick = () => goTo(idx);
  const th = g('ep-thumbs'); if (th) th.appendChild(w);
}

// ─── DRAW CANVAS ──────────────────────────────────────────────────────────────
function bindDrawCanvas(dc: HTMLCanvasElement, idx: number) {
  let isDown = false, lx = 0, ly = 0, sx = 0, sy = 0;
  function pos(e: MouseEvent | Touch) {
    const r = dc.getBoundingClientRect();
    return { x: (e.clientX - r.left) / S.zoom, y: (e.clientY - r.top) / S.zoom };
  }
  function down(e: MouseEvent | Touch) {
    if (!isDrawTool()) return;
    S.cur = idx; updPL(); updThH(idx);
    const p = pos(e); isDown = true; S.drawPageIdx = idx;
    lx = sx = p.x; ly = sy = p.y;
    if (['draw', 'hl', 'erase'].includes(S.tool)) {
      S.drawPath = { type: S.tool, color: C.color, sw: C.sw, op: C.op, hlw: C.hlw, er: C.er, pts: [p.x, p.y] };
      S.pages[idx].strokes.push(S.drawPath);
    }
  }
  function move(e: MouseEvent | Touch) {
    if (!isDown || S.drawPageIdx !== idx) return;
    const p = pos(e), ctx = dc.getContext('2d')!;
    if (S.drawPath) {
      ctx.save(); styleCtx(ctx, S.drawPath);
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(p.x, p.y); ctx.stroke();
      ctx.restore(); S.drawPath.pts.push(p.x, p.y); lx = p.x; ly = p.y;
    } else if (isShapeTool()) {
      const po = S.pages[idx];
      ctx.clearRect(0, 0, dc.width, dc.height);
      po.strokes.forEach((s: any) => drawSt(ctx, s, 1));
      ctx.save();
      if (S.tool === 'whiteout') { ctx.fillStyle = '#fff'; ctx.fillRect(Math.min(sx, p.x), Math.min(sy, p.y), Math.abs(p.x - sx) || 1, Math.abs(p.y - sy) || 1); }
      else { const fc = fillColor(C); drawShape(ctx, S.tool, sx, sy, p.x, p.y, C.color, C.sw, C.op, fc, C.rad); }
      ctx.restore();
    }
  }
  function up(e: MouseEvent | Touch) {
    if (!isDown || S.drawPageIdx !== idx) { isDown = false; return; }
    const p = pos(e); isDown = false; S.drawPageIdx = -1;
    if (S.drawPath) { pushUndo({ type: 'stroke', idx, stroke: S.drawPath }); S.drawPath = null; return; }
    if (isShapeTool()) {
      let ex = p.x, ey = p.y;
      if (Math.abs(ex - sx) < 5 && Math.abs(ey - sy) < 5) { ex = sx + 80; ey = sy + 50; }
      const _wo = S.tool === 'whiteout';
      const sh = { type: 'shape', shapeType: _wo ? 'rect' : S.tool, x1: sx, y1: sy, x2: ex, y2: ey, color: _wo ? '#ffffff' : C.color, sw: _wo ? 0 : C.sw, op: 1, fill: _wo ? 'solid' : C.fill, rad: C.rad };
      S.pages[idx].strokes.push(sh);
      const ctx = dc.getContext('2d')!;
      ctx.clearRect(0, 0, dc.width, dc.height);
      S.pages[idx].strokes.forEach((s: any) => drawSt(ctx, s, 1));
      pushUndo({ type: 'stroke', idx, stroke: sh });
    }
  }
  dc.addEventListener('mousedown', e => { down(e); e.preventDefault(); });
  dc.addEventListener('mousemove', e => move(e));
  dc.addEventListener('mouseup', e => up(e));
  dc.addEventListener('mouseleave', e => up(e));
  dc.addEventListener('touchstart', e => { e.preventDefault(); down(e.touches[0]); }, { passive: false });
  dc.addEventListener('touchmove', e => { e.preventDefault(); move(e.touches[0]); }, { passive: false });
  dc.addEventListener('touchend', e => { e.preventDefault(); up(e.changedTouches[0]); }, { passive: false });
}

function fillColor(c: any) {
  if (c.fill === 'solid') return c.color;
  if (c.fill === 'semi') return c.color + '55';
  return 'none';
}
function isDrawTool() { return ['draw', 'hl', 'erase', 'rect', 'circle', 'line', 'arrow', 'whiteout'].includes(S.tool); }
function isShapeTool() { return ['rect', 'circle', 'line', 'arrow', 'whiteout'].includes(S.tool); }

function styleCtx(ctx: CanvasRenderingContext2D, s: any) {
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (s.type === 'hl') {
    ctx.globalAlpha = 0.38; ctx.strokeStyle = s.color; ctx.lineWidth = s.hlw;
    ctx.globalCompositeOperation = 'multiply';
  } else if (s.type === 'erase') {
    ctx.globalCompositeOperation = 'destination-out';
    ctx.strokeStyle = 'rgba(0,0,0,1)'; ctx.lineWidth = s.er; ctx.globalAlpha = 1;
  } else {
    ctx.globalAlpha = s.op; ctx.strokeStyle = s.color; ctx.lineWidth = s.sw;
    ctx.globalCompositeOperation = 'source-over';
  }
}

function drawShape(ctx: CanvasRenderingContext2D, type: string, x1: number, y1: number, x2: number, y2: number, color: string, sw: number, op: number, fill: string, rad = 0) {
  ctx.strokeStyle = color; ctx.lineWidth = sw; ctx.globalAlpha = op; ctx.lineCap = 'round';
  ctx.globalCompositeOperation = 'source-over';
  if (type === 'rect') {
    const mx = Math.min(x1, x2), my = Math.min(y1, y2), mw = Math.abs(x2 - x1) || 1, mh = Math.abs(y2 - y1) || 1;
    if (fill !== 'none') { ctx.fillStyle = fill; }
    if (rad > 0) {
      ctx.beginPath(); (ctx as any).roundRect?.(mx, my, mw, mh, rad) || ctx.rect(mx, my, mw, mh);
      if (fill !== 'none') ctx.fill(); ctx.stroke();
    } else { if (fill !== 'none') ctx.fillRect(mx, my, mw, mh); ctx.strokeRect(mx, my, mw, mh); }
  } else if (type === 'circle') {
    ctx.beginPath();
    ctx.ellipse((x1 + x2) / 2, (y1 + y2) / 2, Math.abs(x2 - x1) / 2 || 10, Math.abs(y2 - y1) / 2 || 10, 0, 0, Math.PI * 2);
    if (fill !== 'none') { ctx.fillStyle = fill; ctx.fill(); } ctx.stroke();
  } else if (type === 'line') {
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  } else if (type === 'arrow') {
    const ang = Math.atan2(y2 - y1, x2 - x1), al = 14;
    ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x2 - al * Math.cos(ang - 0.4), y2 - al * Math.sin(ang - 0.4));
    ctx.lineTo(x2 - al * Math.cos(ang + 0.4), y2 - al * Math.sin(ang + 0.4));
    ctx.closePath(); ctx.fillStyle = color; ctx.fill();
  }
}

function drawSt(ctx: CanvasRenderingContext2D, s: any, sc: number) {
  ctx.save();
  if (s.type === 'shape') {
    drawShape(ctx, s.shapeType, s.x1 * sc, s.y1 * sc, s.x2 * sc, s.y2 * sc, s.color, (s.sw || 0) * sc, s.op || 1,
      s.fill === 'solid' ? s.color : s.fill === 'semi' ? s.color + '55' : 'none', s.rad || 0);
  } else {
    if (!s.pts || s.pts.length < 4) { ctx.restore(); return; }
    styleCtx(ctx, { ...s, hlw: (s.hlw || 18) * sc, er: (s.er || 24) * sc, sw: (s.sw || 2) * sc });
    ctx.beginPath(); ctx.moveTo(s.pts[0] * sc, s.pts[1] * sc);
    for (let i = 2; i < s.pts.length; i += 2) ctx.lineTo(s.pts[i] * sc, s.pts[i + 1] * sc);
    ctx.stroke();
  }
  ctx.restore();
}

// ─── ELEMENT WRAPPER ──────────────────────────────────────────────────────────
function mkWrapper(idx: number, x: number, y: number, w: number, h: number) {
  const wr = document.createElement('div') as any;
  wr.className = 'ep-el ep-pop';
  wr.style.cssText = `left:${x}px;top:${y}px;width:${w}px;min-height:${h}px;`;
  wr._idx = idx; wr._rot = 0;

  const bar = document.createElement('div'); bar.className = 'ep-el-bar';
  ['Copy', 'Up', 'Down'].forEach((lbl, i) => {
    const btn = document.createElement('button'); btn.className = 'ep-bbar-btn'; btn.textContent = lbl;
    btn.addEventListener('mousedown', e => e.stopPropagation());
    btn.addEventListener('click', e => { e.stopPropagation(); if (i === 0) dupEl(wr); else if (i === 1) elFwd(wr); else elBwd(wr); });
    bar.appendChild(btn);
  });
  wr.appendChild(bar);

  const mv = document.createElement('div'); mv.className = 'ep-el-mv'; mv.innerHTML = '⋮⋮'; mv.title = 'Drag to move';
  let drag = false, ox = 0, oy = 0, ex0 = 0, ey0 = 0;
  mv.addEventListener('mousedown', e => { drag = true; ox = e.clientX; oy = e.clientY; ex0 = parseFloat(wr.style.left) || 0; ey0 = parseFloat(wr.style.top) || 0; e.stopPropagation(); e.preventDefault(); });
  const onMM = (e: MouseEvent) => { if (!drag) return; wr.style.left = (ex0 + (e.clientX - ox) / S.zoom) + 'px'; wr.style.top = (ey0 + (e.clientY - oy) / S.zoom) + 'px'; };
  const onMU = () => { drag = false; };
  document.addEventListener('mousemove', onMM);
  document.addEventListener('mouseup', onMU);
  wr.appendChild(mv);

  const rot = document.createElement('div'); rot.className = 'ep-el-rot'; rot.textContent = '↻'; rot.title = 'Rotate';
  let rotD = false, rotA0 = 0, rotR0 = 0;
  rot.addEventListener('mousedown', e => {
    rotD = true;
    const r = wr.getBoundingClientRect();
    rotA0 = Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2);
    rotR0 = wr._rot || 0; e.stopPropagation(); e.preventDefault();
  });
  const onRM = (e: MouseEvent) => {
    if (!rotD) return;
    const r = wr.getBoundingClientRect();
    const a = Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2);
    wr._rot = rotR0 + (a - rotA0) * 180 / Math.PI;
    wr.style.transform = `rotate(${wr._rot}deg)`;
  };
  const onRU = () => { rotD = false; };
  document.addEventListener('mousemove', onRM);
  document.addEventListener('mouseup', onRU);
  wr.appendChild(rot);

  const rh = document.createElement('div'); rh.className = 'ep-el-res';
  let res = false, sw0 = 0, sh0 = 0, rx0 = 0, ry0 = 0;
  rh.addEventListener('mousedown', e => { res = true; sw0 = wr.offsetWidth; sh0 = wr.offsetHeight; rx0 = e.clientX; ry0 = e.clientY; e.stopPropagation(); e.preventDefault(); });
  const onResM = (e: MouseEvent) => { if (!res) return; wr.style.width = Math.max(40, sw0 + (e.clientX - rx0) / S.zoom) + 'px'; wr.style.height = Math.max(20, sh0 + (e.clientY - ry0) / S.zoom) + 'px'; };
  const onResU = () => { res = false; };
  document.addEventListener('mousemove', onResM);
  document.addEventListener('mouseup', onResU);
  wr.appendChild(rh);

  const db = document.createElement('div'); db.className = 'ep-el-del'; db.textContent = '×'; db.title = 'Delete (Del)';
  db.addEventListener('mousedown', e => { e.stopPropagation(); removeEl(wr); });
  wr.appendChild(db);

  wr.addEventListener('mousedown', (e: MouseEvent) => {
    if ([db, mv, rh, rot, bar].some(el => el === e.target || el.contains(e.target as Node))) return;
    selEl(wr); e.stopPropagation();
  });
  wr.addEventListener('contextmenu', (e: MouseEvent) => { e.preventDefault(); S.ctxTarget = wr; selEl(wr); showCtx(e.clientX, e.clientY); });
  return wr;
}

function selEl(el: HTMLElement) { deselAll(); S.sel = el; el.classList.add('sel'); }
function deselAll() { if (S.sel) S.sel.classList.remove('sel'); S.sel = null; hideCtx(); }
function removeEl(wr: any) {
  const idx = wr._idx, p = S.pages[idx]; const i = p.els.indexOf(wr); if (i > -1) p.els.splice(i, 1);
  if (S.sel === wr) S.sel = null; wr.remove();
  pushUndo({ type: 'ann', idx, action: 'rem', wr, parent: p.ann });
  toast('Deleted');
}
function addEl(wr: any, idx: number) {
  const p = S.pages[idx]; p.ann.appendChild(wr); p.els.push(wr);
  pushUndo({ type: 'ann', idx, action: 'add', wr, parent: p.ann });
  selEl(wr);
}
function dupEl(wr: any) {
  const clone = wr.cloneNode(true) as any;
  clone._idx = wr._idx; clone._rot = wr._rot || 0;
  clone.style.left = (parseFloat(wr.style.left) + 18) + 'px';
  clone.style.top = (parseFloat(wr.style.top) + 18) + 'px';
  addEl(clone, wr._idx); toast('Duplicated');
}
function elFwd(wr: any) { wr.style.zIndex = (parseInt(wr.style.zIndex) || 30) + 1; }
function elBwd(wr: any) { wr.style.zIndex = Math.max(1, (parseInt(wr.style.zIndex) || 30) - 1); }

// ─── PLACE ELEMENTS ───────────────────────────────────────────────────────────
function placeText(idx: number, x: number, y: number, init = '', initFs = 0) {
  const wr = mkWrapper(idx, x, y, 200, 36);
  const el = document.createElement('div');
  el.className = 'ep-txt-el'; el.contentEditable = 'true';
  el.textContent = init || 'Type here…';
  el.style.cssText = `font-family:${C.font};font-size:${(initFs || C.fs)}px;color:${C.color};font-weight:${C.bold ? '700' : '400'};font-style:${C.italic ? 'italic' : 'normal'};text-decoration:${C.underline ? 'underline' : C.strike ? 'line-through' : 'none'};text-align:${C.align};display:block;min-width:60px;min-height:22px;`;
  el.addEventListener('mousedown', e => e.stopPropagation());
  el.addEventListener('focus', () => { el.classList.add('editing'); wr.classList.add('sel'); S.sel = wr; if (el.textContent === 'Type here…') { const r = document.createRange(); r.selectNodeContents(el); window.getSelection()?.removeAllRanges(); window.getSelection()?.addRange(r); } });
  el.addEventListener('blur', () => { el.classList.remove('editing'); if (!el.textContent?.trim()) el.textContent = 'Type here…'; });
  wr.appendChild(el); addEl(wr, idx); setTool('select');
  setTimeout(() => el.focus(), 20);
}
function placeNote(idx: number, x: number, y: number) {
  const wr = mkWrapper(idx, x, y, 180, 80);
  const el = document.createElement('div');
  el.className = 'ep-note-el'; el.contentEditable = 'true'; el.textContent = 'Note text…';
  el.addEventListener('mousedown', e => e.stopPropagation());
  el.addEventListener('focus', () => { wr.classList.add('sel'); S.sel = wr; if (el.textContent === 'Note text…') { const r = document.createRange(); r.selectNodeContents(el); window.getSelection()?.removeAllRanges(); window.getSelection()?.addRange(r); } });
  wr.appendChild(el); addEl(wr, idx); setTool('select');
  setTimeout(() => el.focus(), 20);
}
function placeCallout(idx: number, x: number, y: number) {
  const wr = mkWrapper(idx, x, y, 180, 60);
  const el = document.createElement('div');
  el.className = 'ep-callout'; el.contentEditable = 'true'; el.textContent = 'Callout…';
  el.style.cssText = `border-color:${C.color};color:${C.color};`;
  el.addEventListener('mousedown', e => e.stopPropagation());
  el.addEventListener('focus', () => { wr.classList.add('sel'); S.sel = wr; });
  wr.appendChild(el); addEl(wr, idx); setTool('select');
  setTimeout(() => el.focus(), 20);
}
function placeRedact(idx: number, x: number, y: number) {
  const wr = mkWrapper(idx, x, y, 120, 24);
  const el = document.createElement('div'); el.className = 'ep-redact'; el.style.cssText = 'width:100%;height:100%;min-height:24px;';
  wr.appendChild(el); addEl(wr, idx);
}

// ─── IMAGE HANDLING ───────────────────────────────────────────────────────────
let _replaceTarget: HTMLImageElement | null = null;

async function onImgChange(e: Event) {
  const t = e.target as HTMLInputElement;
  const f = t.files?.[0];
  t.value = '';
  if (!f) return;
  const url = URL.createObjectURL(f);
  const img = await imgLoad(url);
  placeImg(S.cur, url, img.naturalWidth, img.naturalHeight);
}

function onImgReplaceChange(e: Event) {
  const t = e.target as HTMLInputElement;
  const f = t.files?.[0];
  const targetImg = _replaceTarget;
  t.value = '';
  _replaceTarget = null;
  if (!f || !targetImg) return;
  const url = URL.createObjectURL(f);
  targetImg.src = url;
  toast('Image replaced ✓', 'ok');
}

function placeImg(idx: number, url: string, nW: number, nH: number) {
  const mx = 240, sc = Math.min(1, mx / nW);
  const W = Math.round(nW * sc), H = Math.round(nH * sc);
  const wr = mkWrapper(idx, 40, 40, W, H); wr.style.overflow = 'hidden';

  const img = document.createElement('img');
  img.className = 'ep-img-el';
  img.src = url;
  img.draggable = false;

  const bar = wr.querySelector('.ep-el-bar') as HTMLElement;
  if (bar) {
    const rb = document.createElement('button');
    rb.className = 'ep-bbar-btn';
    rb.textContent = 'Replace';
    rb.addEventListener('mousedown', e => e.stopPropagation());
    rb.addEventListener('click', e => {
      e.stopPropagation();
      _replaceTarget = img;
      const fi = g('ep-img-replace-inp') as HTMLInputElement;
      if (fi) fi.click();
    });
    bar.appendChild(rb);
  }

  wr.addEventListener('dblclick', (e: MouseEvent) => {
    e.stopPropagation();
    _replaceTarget = img;
    const fi = g('ep-img-replace-inp') as HTMLInputElement;
    if (fi) fi.click();
  });

  wr.appendChild(img);
  addEl(wr, idx);
  toast('Image added · Double-click or use Replace to swap · Drag corner to resize', 'ok');
}

// ─── STAMPS ───────────────────────────────────────────────────────────────────
function addStamp(label: string, color: string) {
  if (!S.pages.length) { toast('Open a PDF first', 'err'); return; }
  const W = Math.max(120, label.length * 10 + 40);
  const wr = mkWrapper(S.cur, 50, 50, W, 44);
  const el = document.createElement('div'); el.className = 'ep-stamp-el'; el.textContent = label; el.style.color = color; el.style.borderColor = color;
  wr.appendChild(el); addEl(wr, S.cur); toast(label + ' stamp added', 'ok');
}

// ─── SIGNATURE ────────────────────────────────────────────────────────────────
function openSigModal() {
  if (!S.pages.length) { toast('Open a PDF first', 'err'); return; }
  openModal('sig');
  const cv = g('ep-sigcv') as HTMLCanvasElement; if (!cv) return;
  const ctx = cv.getContext('2d')!; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height);
  S.sigDrawing = false;
  let lx = 0, ly = 0;
  function gp(e: MouseEvent | Touch) { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; }
  cv.onmousedown = e => { S.sigDrawing = true; const p = gp(e); lx = p.x; ly = p.y; e.preventDefault(); };
  cv.onmousemove = e => {
    if (!S.sigDrawing) return; const p = gp(e), sw = +(g('ep-sig-sw') as HTMLInputElement)?.value || 2;
    ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(p.x, p.y); ctx.strokeStyle = S.sigColor; ctx.lineWidth = sw; ctx.lineCap = 'round'; ctx.stroke(); lx = p.x; ly = p.y;
  };
  cv.onmouseup = cv.onmouseleave = () => { S.sigDrawing = false; };
  cv.ontouchstart = e => { e.preventDefault(); const t = e.touches[0], r = cv.getBoundingClientRect(); lx = (t.clientX - r.left) * cv.width / r.width; ly = (t.clientY - r.top) * cv.height / r.height; S.sigDrawing = true; };
  cv.ontouchmove = e => { e.preventDefault(); if (!S.sigDrawing) return; const t = e.touches[0], r = cv.getBoundingClientRect(); const x = (t.clientX - r.left) * cv.width / r.width, y = (t.clientY - r.top) * cv.height / r.height, sw = +(g('ep-sig-sw') as HTMLInputElement)?.value || 2; ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(x, y); ctx.strokeStyle = S.sigColor; ctx.lineWidth = sw; ctx.lineCap = 'round'; ctx.stroke(); lx = x; ly = y; };
  cv.ontouchend = () => { S.sigDrawing = false; };
}
function clearSig() { const cv = g('ep-sigcv') as HTMLCanvasElement; if (!cv) return; const ctx = cv.getContext('2d')!; ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height); }
function applySig() { const cv = g('ep-sigcv') as HTMLCanvasElement; if (!cv) return; placeImg(S.cur, cv.toDataURL('image/png'), cv.width, cv.height); closeModal('sig'); toast('Signature added ✓', 'ok'); }

// ─── QUICK OBJECTS ────────────────────────────────────────────────────────────
function addCounter() {
  if (!S.pages.length) { toast('Open a PDF first', 'err'); return; }
  const wr = mkWrapper(S.cur, 50, 50, 44, 44);
  const el = document.createElement('div'); el.className = 'ep-counter'; el.style.background = C.color; let n = 1; el.textContent = '1';
  wr.addEventListener('dblclick', () => { n++; el.textContent = String(n); });
  wr.appendChild(el); addEl(wr, S.cur); toast('Counter added · Double-click to increment');
}
function addProgressBar() {
  if (!S.pages.length) { toast('Open a PDF first', 'err'); return; }
  const wr = mkWrapper(S.cur, 50, 50, 200, 24);
  const outer = document.createElement('div'); outer.className = 'ep-prog-wrap'; outer.style.cssText = 'width:100%;height:100%';
  const inner = document.createElement('div'); inner.className = 'ep-prog-fill'; inner.style.cssText = `width:60%;background:linear-gradient(90deg,${C.color},${C.color}aa)`;
  outer.appendChild(inner); wr.appendChild(outer); addEl(wr, S.cur); toast('Progress bar added');
}
function addQRCode() {
  if (!S.pages.length) { toast('Open a PDF first', 'err'); return; }
  const qrText = g('ep-qr-text') as HTMLInputElement; if (qrText) qrText.value = '';
  openModal('qr');
}
function applyQR() {
  const text = (g('ep-qr-text') as HTMLInputElement)?.value.trim(); if (!text) { toast('Enter text or URL', 'err'); return; }
  const size = 120; const cv = mkc(size, size); const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
  function fp(x: number, y: number, s: number) { ctx.fillStyle = '#000'; ctx.fillRect(x, y, s * 7, s * 7); ctx.fillStyle = '#fff'; ctx.fillRect(x + s, y + s, s * 5, s * 5); ctx.fillStyle = '#000'; ctx.fillRect(x + s * 2, y + s * 2, s * 3, s * 3); }
  const m = 4; fp(m, m, m); fp(size - m * 8, m, m); fp(m, size - m * 8, m);
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if (Math.random() > 0.5) ctx.fillRect(m * 2 + i * m * 1.5, m * 2 + j * m * 1.5, m, m);
  placeImg(S.cur, cv.toDataURL('image/png'), size, size); closeModal('qr'); toast('QR code added', 'ok');
}
function addWatermark() { if (!S.pages.length) { toast('Open a PDF first', 'err'); return; } openModal('watermark'); }
function applyWatermark() {
  const text = (g('ep-wm-text') as HTMLInputElement)?.value.trim() || 'WATERMARK';
  const op = +((g('ep-wm-op') as HTMLInputElement)?.value || 18) / 100;
  const color = (g('ep-wm-color') as HTMLInputElement)?.value || '#888';
  const idx = S.cur; const p = S.pages[idx];
  const cv = mkc(p.W, p.H); const ctx = cv.getContext('2d')!;
  ctx.save(); ctx.globalAlpha = op; ctx.translate(p.W / 2, p.H / 2); ctx.rotate(-Math.PI / 4);
  ctx.font = `bold ${Math.min(p.W, p.H) / 6}px 'Inter',sans-serif`;
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, 0); ctx.restore();
  placeImg(idx, cv.toDataURL('image/png'), p.W, p.H); closeModal('watermark'); toast('Watermark added', 'ok');
}

// ─── COLOR ────────────────────────────────────────────────────────────────────
function pickColor(c: string) {
  C.color = c; const cp = g('ep-cpick') as HTMLInputElement; if (cp) cp.value = c;
  document.querySelectorAll('#ep-clrs .ep-cd').forEach((d: any) => d.classList.toggle('on', d.dataset.c === c));
}
function pickColorCustom(c: string) { C.color = c; document.querySelectorAll('#ep-clrs .ep-cd').forEach((d: any) => d.classList.remove('on')); }
function togFmt(f: string) { C[f] = !C[f]; const fb = g('ep-fb-' + f); if (fb) fb.classList.toggle('on', C[f]); }

// ─── TOOL ─────────────────────────────────────────────────────────────────────
function setTool(t: string) {
  S.tool = t;
  document.querySelectorAll('[data-ep-tool]').forEach((b: any) => { b.classList.toggle('on', b.dataset.epTool === t); });
  S.pages.forEach((_: any, i: number) => applyToolP(i));
  if (t !== 'select') deselAll();

  const banner = g('ep-editbanner');
  if (banner) banner.classList.toggle('on', t === 'editText');

  if (t === 'editText') {
    S.pages.forEach((p: any) => {
      const tl = p.textLayer as HTMLElement;
      tl.style.zIndex = '20';
      tl.style.pointerEvents = 'all';
      const ovs = tl.querySelectorAll('.ep-tov');
      ovs.forEach((ov: any) => { if (!ov.dataset.editing) ov.classList.add('editing-mode'); });
      const count = Array.from(ovs).filter((o: any) => !o.dataset.editing).length;
      if (!count) toast('No selectable text found on this page (may be a scanned image)', 'info');
      else toast(`${count} text item${count !== 1 ? 's' : ''} — click any to edit`, 'info');
    });
  } else {
    S.pages.forEach((p: any) => {
      const tl = p.textLayer as HTMLElement;
      tl.style.zIndex = '';
      tl.style.pointerEvents = 'none';
      tl.querySelectorAll('.ep-tov').forEach((ov: any) => ov.classList.remove('editing-mode'));
    });
  }
}

function applyToolP(idx: number) {
  const p = S.pages[idx]; if (!p) return;
  if (isDrawTool()) {
    p.dc.classList.add('on');
    p.ann.classList.remove('on');
    p.ann.style.pointerEvents = 'none';
    const cursors: any = { draw: 'crosshair', hl: 'crosshair', erase: 'cell', rect: 'crosshair', circle: 'crosshair', line: 'crosshair', arrow: 'crosshair', whiteout: 'crosshair' };
    p.dc.style.cursor = cursors[S.tool] || 'crosshair';
  } else if (S.tool === 'editText') {
    p.dc.classList.remove('on');
    p.ann.classList.remove('on');
    p.ann.style.pointerEvents = 'none';
    p.wrap.style.cursor = 'text';
  } else {
    p.dc.classList.remove('on');
    p.ann.classList.add('on');
    p.ann.style.pointerEvents = '';
    const cursors: any = { select: 'default', text: 'text', note: 'cell', callout: 'cell', sign: 'default', link: 'pointer', redact: 'crosshair' };
    p.ann.style.cursor = cursors[S.tool] || 'default';
    p.wrap.style.cursor = '';
  }
}

// ─── UNDO / REDO ──────────────────────────────────────────────────────────────
function pushUndo(a: any) { S.undos.push(a); if (S.undos.length > 100) S.undos.shift(); S.redos = []; }
function doUndo() {
  if (!S.undos.length) { toast('Nothing to undo'); return; }
  const a = S.undos.pop(); S.redos.push(a);
  if (a.type === 'stroke') {
    const p = S.pages[a.idx]; const i = p.strokes.indexOf(a.stroke); if (i > -1) p.strokes.splice(i, 1);
    const ctx = p.dc.getContext('2d')!; ctx.clearRect(0, 0, p.dc.width, p.dc.height);
    p.strokes.forEach((s: any) => drawSt(ctx, s, 1));
    toast('Undo ✓');
  } else if (a.type === 'ann') {
    if (a.action === 'add') { a.wr.remove(); const p = S.pages[a.idx]; const i = p.els.indexOf(a.wr); if (i > -1) p.els.splice(i, 1); }
    else { a.parent.appendChild(a.wr); S.pages[a.idx].els.push(a.wr); }
    toast('Undo ✓');
  }
}
function doRedo() {
  if (!S.redos.length) { toast('Nothing to redo'); return; }
  const a = S.redos.pop(); S.undos.push(a);
  if (a.type === 'stroke') {
    const p = S.pages[a.idx]; p.strokes.push(a.stroke);
    const ctx = p.dc.getContext('2d')!; ctx.clearRect(0, 0, p.dc.width, p.dc.height);
    p.strokes.forEach((s: any) => drawSt(ctx, s, 1));
  } else if (a.type === 'ann') {
    if (a.action === 'add') { a.parent.appendChild(a.wr); S.pages[a.idx].els.push(a.wr); }
    else { a.wr.remove(); const p = S.pages[a.idx]; const i = p.els.indexOf(a.wr); if (i > -1) p.els.splice(i, 1); }
  }
  toast('Redo ✓');
}

// ─── NAVIGATION ───────────────────────────────────────────────────────────────
function goTo(idx: number) { if (idx < 0 || idx >= S.pages.length) return; S.cur = idx; updPL(); updThH(idx); S.pages[idx].wrap.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
function goPrev() { if (S.cur > 0) goTo(S.cur - 1); }
function goNext() { if (S.cur < S.pages.length - 1) goTo(S.cur + 1); }
function updPL() { const pl = g('ep-pl'); if (pl) pl.textContent = S.pages.length ? `${S.cur + 1}/${S.pages.length}` : ' , '; }
function updThH(idx: number) { document.querySelectorAll('.ep-thumb').forEach((t, i) => t.classList.toggle('on', i === idx)); }

// ─── PAGE OPS ─────────────────────────────────────────────────────────────────
function addBlankPage() {
  const W = 794, H = 1123; const cv = mkc(W, H); const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, W, H);
  buildPage(cv, W, H, S.pages.length); goTo(S.pages.length - 1); toast('Blank page added', 'ok');
}
function dupPage() {
  if (!S.pages.length) { toast('No pages', 'err'); return; }
  const p = S.pages[S.cur]; const nc = mkc(p.W, p.H); const ctx = nc.getContext('2d')!;
  ctx.drawImage(p.pdfCv, 0, 0); p.strokes.forEach((s: any) => drawSt(ctx, s, 1));
  buildPage(nc, p.W, p.H, S.pages.length); goTo(S.pages.length - 1); toast('Page duplicated', 'ok');
}
function delPage() {
  if (S.pages.length <= 1) { toast('Cannot delete the only page', 'err'); return; }
  const idx = S.cur; S.pages[idx].wrap.remove();
  const th = g('ep-thumbs'); if (th && th.children[idx]) th.children[idx].remove();
  S.pages.splice(idx, 1); S.undos = S.undos.filter((a: any) => a.idx !== idx); S.redos = [];
  if (S.cur >= S.pages.length) S.cur = S.pages.length - 1;
  S.pages.forEach((p: any, i: number) => {
    p.wrap.dataset.idx = i; p.ann.dataset.idx = i;
    const l = p.wrap.querySelector('.ep-pg-lbl'); if (l) l.textContent = `Page ${i + 1}`;
    if (th && th.children[i]) { const n = th.children[i].querySelector('.ep-thn'); if (n) n.textContent = String(i + 1); }
  });
  updPL(); toast('Page deleted');
}
function rotatePage() { const p = S.pages[S.cur]; if (!p) return; p.rot = (p.rot + 90) % 360; applyZP(S.cur); toast('Rotated 90°'); }

// ─── MERGE ────────────────────────────────────────────────────────────────────
async function doMerge(e: Event) {
  if (!(window as any).pdfjsLib) return;
  const t = e.target as HTMLInputElement;
  const files = Array.from(t.files || []).filter((f: File) => f.type === 'application/pdf');
  prog(10); let added = 0;
  for (let i = 0; i < files.length; i++) {
    const ab = await (files[i] as File).arrayBuffer();
    const doc = await (window as any).pdfjsLib.getDocument({ data: ab }).promise;
    for (let j = 1; j <= doc.numPages; j++) {
      prog(10 + Math.round(((i * doc.numPages + j) / (files.length * doc.numPages)) * 85));
      await renderPDFPage(doc, j); added++;
    }
  }
  prog(100); updPL(); closeModal('merge'); t.value = '';
  toast(`Merged ${added} page${added !== 1 ? 's' : ''} ✓`, 'ok'); showUI();
}

// ─── CROP ─────────────────────────────────────────────────────────────────────
function doCrop() {
  const p = S.pages[S.cur]; if (!p) { closeModal('crop'); return; }
  const t = Math.max(0, +((g('ep-cr-t') as HTMLInputElement)?.value || 0));
  const b = Math.max(0, +((g('ep-cr-b') as HTMLInputElement)?.value || 0));
  const l = Math.max(0, +((g('ep-cr-l') as HTMLInputElement)?.value || 0));
  const r = Math.max(0, +((g('ep-cr-r') as HTMLInputElement)?.value || 0));
  const nW = p.W - l - r, nH = p.H - t - b;
  if (nW < 10 || nH < 10) { toast('Crop values too large', 'err'); return; }
  const nc = mkc(nW, nH); nc.getContext('2d')!.drawImage(p.pdfCv, l, t, nW, nH, 0, 0, nW, nH);
  p.pdfCv.remove(); nc.className = 'ep-pdf-cv'; nc.style.cssText = `width:${nW}px;height:${nH}px;position:absolute;top:0;left:0;z-index:1;pointer-events:none`;
  p.wrap.insertBefore(nc, p.dc); p.pdfCv = nc; p.W = nW; p.H = nH;
  p.wrap.style.width = nW + 'px'; p.wrap.style.height = nH + 'px'; p.dc.width = nW; p.dc.height = nH;
  p.ann.style.width = nW + 'px'; p.ann.style.height = nH + 'px';
  applyZP(S.cur); closeModal('crop'); toast('Page cropped ✓', 'ok');
}

// ─── LINK ─────────────────────────────────────────────────────────────────────
function applyLink() {
  const url = (g('ep-link-url') as HTMLInputElement)?.value.trim();
  const txt = (g('ep-link-txt') as HTMLInputElement)?.value.trim() || url;
  if (!url) { toast('Enter a URL', 'err'); return; }
  const idx = S.cur, x = 60, y = 60;
  const wr = mkWrapper(idx, x, y, 200, 30);
  const el = document.createElement('a'); el.className = 'ep-link-el'; el.href = url; el.target = '_blank'; el.rel = 'noopener'; el.textContent = txt || url;
  el.addEventListener('mousedown', e => e.stopPropagation());
  wr.appendChild(el); addEl(wr, idx); closeModal('link'); setTool('select'); toast('Link added');
}

// ─── ZOOM ─────────────────────────────────────────────────────────────────────
function doZoom(d: number) { setZoom(Math.min(3, Math.max(0.15, S.zoom + d))); }
function setZoom(z: number) {
  S.zoom = z; const zl = g('ep-zl'); if (zl) zl.textContent = Math.round(z * 100) + '%';
  S.pages.forEach((_: any, i: number) => applyZP(i));
}
function fitZoom() {
  if (!S.pages.length) return;
  const cw = g('ep-cw')!, p = S.pages[S.cur];
  setZoom(Math.min((cw.clientWidth - 60) / p.W, 2));
}
function applyZP(idx: number) {
  const p = S.pages[idx]; if (!p) return;
  p.wrap.style.transform = `scale(${S.zoom}) rotate(${p.rot}deg)`;
  const ex = p.rot % 180 !== 0 ? Math.abs(p.H - p.W) * S.zoom / 2 : 0;
  p.wrap.style.marginBottom = (p.H * (S.zoom - 1) + ex * 2 + 32) + 'px';
  p.wrap.style.marginTop = ex + 'px';
}

// ─── CONTEXT MENU ─────────────────────────────────────────────────────────────
function showCtx(x: number, y: number) { const c = g('ep-ctx')!; c.style.left = x + 'px'; c.style.top = y + 'px'; c.classList.add('open'); }
function hideCtx() { const c = g('ep-ctx'); if (c) c.classList.remove('open'); }
function ctxDo(a: string) {
  const wr = S.ctxTarget; if (!wr) { hideCtx(); return; }
  if (a === 'dup') dupEl(wr); else if (a === 'fwd') elFwd(wr); else if (a === 'bwd') elBwd(wr);
  else if (a === 'front') wr.style.zIndex = 999; else if (a === 'back') wr.style.zIndex = 1;
  else if (a === 'del') removeEl(wr);
  hideCtx();
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function openModal(id: string) { const m = g('ep-mod-' + id); if (m) m.classList.add('open'); }
function closeModal(id: string) { const m = g('ep-mod-' + id); if (m) m.classList.remove('open'); }
function openKB() { const k = g('ep-kbp'); if (k) k.classList.add('open'); }
function closeKB() { const k = g('ep-kbp'); if (k) k.classList.remove('open'); }

// ─── UI SHOW/HIDE ─────────────────────────────────────────────────────────────
function showUI() {
  const dz = g('ep-dz'); if (dz) dz.style.display = 'none';
  const pw = g('ep-pw'); if (pw) pw.style.display = 'flex';
  ['ep-btn-save', 'ep-btn-merge', 'ep-btn-compress'].forEach(id => { const el = g(id); if (el) el.style.display = 'inline-flex'; });
  const fab = g('ep-fab'); if (fab) fab.classList.add('on');
  updPL();
}
function hideUI() {
  ['ep-btn-save', 'ep-btn-merge', 'ep-btn-compress'].forEach(id => { const el = g(id); if (el) el.style.display = 'none'; });
  const fab = g('ep-fab'); if (fab) fab.classList.remove('on');
}

// ═══════════════════════════════════════════════════════════════════════════════
// FIX 2: SAVE PDF — direct Canvas 2D rendering, no html2canvas for text elements
// ═══════════════════════════════════════════════════════════════════════════════
// KEY FIXES:
//   • Text/note/callout/link/stamp/redact elements are drawn directly via
//     Canvas 2D API — html2canvas is only used as a fallback for complex elements
//     it can actually handle (images already on canvas, etc.).
//   • Export layer order: white background → pdfCv (with whiteout baked in) →
//     dc strokes → annotation elements. This ensures whiteout rects in pdfCv
//     correctly hide the original glyphs before new text is drawn on top.
//   • Rotation handled correctly for each page.
// ═══════════════════════════════════════════════════════════════════════════════

// Draw a single annotation element directly onto an export canvas.
// Returns true if handled natively; false if caller should try html2canvas.
function drawElToCtx(ctx: CanvasRenderingContext2D, el: HTMLElement): boolean {
  const x = parseFloat(el.style.left) || 0;
  const y = parseFloat(el.style.top) || 0;
  const w = el.offsetWidth || parseFloat(el.style.width) || 100;
  const h = el.offsetHeight || parseFloat(el.style.height) || 40;
  const rot = (el as any)._rot || 0;

  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  if (rot) ctx.rotate(rot * Math.PI / 180);
  ctx.translate(-w / 2, -h / 2);

  // ── Redact block ──────────────────────────────────────────────────────────
  const redactEl = el.querySelector('.ep-redact') as HTMLElement | null;
  if (redactEl) {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
    return true;
  }

  // ── Stamp ─────────────────────────────────────────────────────────────────
  const stampEl = el.querySelector('.ep-stamp-el') as HTMLElement | null;
  if (stampEl) {
    const text = stampEl.textContent?.trim() || '';
    const color = stampEl.style.color || '#000';
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.strokeRect(2, 2, w - 4, h - 4);
    ctx.fillStyle = color;
    ctx.font = `bold 13px 'Inter',sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, w / 2, h / 2);
    ctx.restore();
    return true;
  }

  // ── Image ─────────────────────────────────────────────────────────────────
  const imgEl = el.querySelector('img.ep-img-el') as HTMLImageElement | null;
  if (imgEl && imgEl.complete && imgEl.naturalWidth > 0) {
    ctx.drawImage(imgEl, 0, 0, w, h);
    ctx.restore();
    return true;
  }

  // ── Progress bar ──────────────────────────────────────────────────────────
  const progWrap = el.querySelector('.ep-prog-wrap') as HTMLElement | null;
  if (progWrap) {
    const fill = progWrap.querySelector('.ep-prog-fill') as HTMLElement | null;
    const pct = fill ? parseFloat(fill.style.width) / 100 : 0.6;
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath(); (ctx as any).roundRect?.(0, 0, w, h, 12) || ctx.rect(0, 0, w, h); ctx.fill();
    ctx.fillStyle = fill?.style.background || '#ff5f2e';
    ctx.beginPath(); (ctx as any).roundRect?.(0, 0, w * pct, h, 12) || ctx.rect(0, 0, w * pct, h); ctx.fill();
    ctx.restore();
    return true;
  }

  // ── Counter ───────────────────────────────────────────────────────────────
  const counterEl = el.querySelector('.ep-counter') as HTMLElement | null;
  if (counterEl) {
    ctx.fillStyle = counterEl.style.background || '#ff5f2e';
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `bold 14px 'Inter',sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(counterEl.textContent || '1', w / 2, h / 2);
    ctx.restore();
    return true;
  }

  // ── Link ──────────────────────────────────────────────────────────────────
  const linkEl = el.querySelector('a.ep-link-el') as HTMLAnchorElement | null;
  if (linkEl) {
    ctx.fillStyle = 'rgba(59,130,246,0.08)';
    ctx.strokeStyle = 'rgba(59,130,246,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath(); (ctx as any).roundRect?.(0, 0, w, h, 4) || ctx.rect(0, 0, w, h);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#3b82f6';
    ctx.font = `500 12px 'Inter',sans-serif`;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(linkEl.textContent || linkEl.href, 8, h / 2, w - 16);
    ctx.restore();
    return true;
  }

  // ── Callout ───────────────────────────────────────────────────────────────
  const calloutEl = el.querySelector('.ep-callout') as HTMLElement | null;
  if (calloutEl) {
    const cs = window.getComputedStyle(calloutEl);
    const bdr = calloutEl.style.borderColor || cs.borderColor || '#ff5f2e';
    const color = calloutEl.style.color || cs.color || '#111';
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = bdr;
    ctx.lineWidth = 2;
    ctx.beginPath(); (ctx as any).roundRect?.(0, 0, w, h - 12, 8) || ctx.rect(0, 0, w, h - 12);
    ctx.fill(); ctx.stroke();
    // tail triangle
    ctx.beginPath();
    ctx.moveTo(16, h - 12); ctx.lineTo(28, h); ctx.lineTo(40, h - 12);
    ctx.closePath(); ctx.fillStyle = '#fff'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(16, h - 12); ctx.lineTo(28, h); ctx.lineTo(40, h - 12);
    ctx.strokeStyle = bdr; ctx.stroke();
    // text
    ctx.fillStyle = color;
    ctx.font = `13px 'Inter',sans-serif`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    wrapTextOnCanvas(ctx, calloutEl.textContent || '', 10, 10, w - 20, 18);
    ctx.restore();
    return true;
  }

  // ── Note ──────────────────────────────────────────────────────────────────
  const noteEl = el.querySelector('.ep-note-el') as HTMLElement | null;
  if (noteEl) {
    ctx.fillStyle = '#fef9c3';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1.5;
    ctx.beginPath(); (ctx as any).roundRect?.(0, 0, w, h, 8) || ctx.rect(0, 0, w, h);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#78350f';
    ctx.font = '13px "Inter",sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    wrapTextOnCanvas(ctx, noteEl.textContent || '', 10, 10, w - 20, 19);
    ctx.restore();
    return true;
  }

  // ── Plain text ────────────────────────────────────────────────────────────
  const txtEl = el.querySelector('.ep-txt-el') as HTMLElement | null;
  if (txtEl) {
    const cs = window.getComputedStyle(txtEl);
    const fs = parseFloat(cs.fontSize) || 16;

    // Background for editing highlight — skip (transparent in final output)
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fs}px ${cs.fontFamily}`;
    ctx.fillStyle = cs.color || '#000000';
    ctx.textAlign = (cs.textAlign as CanvasTextAlign) || 'left';
    ctx.textBaseline = 'top';

    const lineH = fs * 1.45;
    const lines = (txtEl.textContent || '').split('\n');
    let offsetY = 0;

    for (const line of lines) {
      if (line) {
        // Underline / strikethrough
        if (cs.textDecoration.includes('underline')) {
          const metrics = ctx.measureText(line);
          ctx.beginPath();
          ctx.moveTo(0, offsetY + fs + 2);
          ctx.lineTo(metrics.width, offsetY + fs + 2);
          ctx.strokeStyle = cs.color; ctx.lineWidth = 1; ctx.stroke();
        }
        if (cs.textDecoration.includes('line-through')) {
          const metrics = ctx.measureText(line);
          ctx.beginPath();
          ctx.moveTo(0, offsetY + fs / 2);
          ctx.lineTo(metrics.width, offsetY + fs / 2);
          ctx.strokeStyle = cs.color; ctx.lineWidth = 1; ctx.stroke();
        }
        ctx.fillText(line, 0, offsetY);
      }
      offsetY += lineH;
    }
    ctx.restore();
    return true;
  }

  ctx.restore();
  return false; // unknown element — caller should try html2canvas
}

// Simple word-wrap helper for canvas text
function wrapTextOnCanvas(
  ctx: CanvasRenderingContext2D,
  text: string, x: number, y: number, maxW: number, lineH: number
) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (const word of words) {
    const test = line ? line + ' ' + word : word;
    const { width } = ctx.measureText(test);
    if (width > maxW && line) {
      ctx.fillText(line, x, curY);
      line = word;
      curY += lineH;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, curY);
}

async function savePDF(compress = false) {
  if (!S.pages.length) { toast('Open a PDF first', 'err'); return; }
  if (!(window as any).jspdf) { toast('Export library loading...', 'info'); return; }

  deselAll();
  toast(compress ? 'Compressing PDF…' : 'Preparing PDF…', 'info');
  prog(5);

  const { jsPDF } = (window as any).jspdf;

  const p0 = S.pages[0];
  const p0Rot = Math.abs(p0.rot % 360);
  const p0Sw = p0Rot === 90 || p0Rot === 270;
  const p0W = p0Sw ? p0.H : p0.W;
  const p0H = p0Sw ? p0.W : p0.H;

  const pdf = new jsPDF({
    orientation: p0W > p0H ? 'l' : 'p',
    unit: 'px',
    format: [p0W, p0H],
    compress: true,
  });

  for (let i = 0; i < S.pages.length; i++) {
    prog(5 + Math.round((i / S.pages.length) * 90));
    const p = S.pages[i];

    try {
      const W = p.W, H = p.H;

      // ── Step 1: composite all layers onto a single output canvas ──────────
      const out = mkc(W, H);
      const ctx = out.getContext('2d')!;

      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, W, H);

      // Layer 1: PDF raster (with whiteout already baked in from edits)
      ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(p.pdfCv, 0, 0, W, H);

      // Layer 2: draw canvas strokes (highlights, drawings, shapes, whiteout)
      // Use source-over so white whiteout rects properly cover the pdfCv pixels
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      ctx.drawImage(p.dc, 0, 0, W, H);

      // Layer 3: annotation elements — drawn natively via Canvas 2D API
      for (const el of p.els) {
        try {
          const handled = drawElToCtx(ctx, el);

          // Fallback: try html2canvas only for image elements or truly unknown types
          if (!handled && (window as any).html2canvas) {
            const imgInEl = el.querySelector('img.ep-img-el') as HTMLImageElement | null;
            if (imgInEl && !imgInEl.complete) {
              // Image not loaded yet — skip gracefully
              continue;
            }

            const uiEls = el.querySelectorAll('.ep-el-del,.ep-el-res,.ep-el-rot,.ep-el-mv,.ep-el-bar');
            uiEls.forEach((u: any) => { u.dataset._ov = u.style.visibility; u.style.visibility = 'hidden'; });

            const clone = el.cloneNode(true) as HTMLElement;
            clone.style.cssText = `position:fixed;left:-99999px;top:0;transform:none;margin:0;z-index:-1;visibility:visible;`;
            clone.classList.remove('sel');
            clone.querySelectorAll('.ep-el-del,.ep-el-res,.ep-el-rot,.ep-el-mv,.ep-el-bar').forEach((u: any) => u.remove());
            document.body.appendChild(clone);

            try {
              const captured = await (window as any).html2canvas(clone, {
                scale: 1, useCORS: true, allowTaint: true, logging: false,
                backgroundColor: null,
                width: el.offsetWidth || 100,
                height: el.offsetHeight || 40,
              });

              const x = parseFloat(el.style.left) || 0;
              const y = parseFloat(el.style.top) || 0;
              const w = el.offsetWidth || 100;
              const h = el.offsetHeight || 40;
              const rot = (el as any)._rot || 0;

              ctx.save();
              ctx.translate(x + w / 2, y + h / 2);
              if (rot) ctx.rotate(rot * Math.PI / 180);
              ctx.drawImage(captured, -w / 2, -h / 2, w, h);
              ctx.restore();
            } finally {
              document.body.removeChild(clone);
            }

            uiEls.forEach((u: any) => { u.style.visibility = u.dataset._ov || ''; delete u.dataset._ov; });
          }
        } catch (elErr) {
          console.warn('Element export error (skipping):', elErr);
        }
      }

      // ── Step 2: apply page rotation if needed ─────────────────────────────
      let finalCv = out, finalW = W, finalH = H;
      const rot = ((p.rot % 360) + 360) % 360;

      if (rot !== 0) {
        const isSw = rot === 90 || rot === 270;
        finalW = isSw ? H : W;
        finalH = isSw ? W : H;
        const rCv = mkc(finalW, finalH);
        const rCtx = rCv.getContext('2d')!;
        rCtx.translate(finalW / 2, finalH / 2);
        rCtx.rotate(rot * Math.PI / 180);
        rCtx.drawImage(out, -W / 2, -H / 2);
        finalCv = rCv;
      }

      // ── Step 3: encode and add to PDF ─────────────────────────────────────
      const quality = compress ? 0.65 : 0.92;
      const imgData = finalCv.toDataURL('image/jpeg', quality);

      if (i > 0) pdf.addPage([finalW, finalH], finalW > finalH ? 'l' : 'p');
      pdf.addImage(imgData, 'JPEG', 0, 0, finalW, finalH, '', 'FAST');

    } catch (err) {
      console.error(`Page ${i + 1} export error:`, err);
      toast(`Warning: page ${i + 1} had an error — continuing`, 'err');
    }
  }

  prog(98);
  pdf.save(compress ? 'compressed.pdf' : 'edited.pdf');
  prog(100);
  toast(compress ? 'Compressed PDF downloaded ✓' : 'PDF saved ✓', 'ok');
}

// ═══════════════════════════════════════════════════════════════════════════════
// REACT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function EditPdf() {
  useEffect(() => {
    const style = document.createElement('style');
    style.id = 'ep-styles';
    style.textContent = CSS;
    document.head.appendChild(style);

    (function ini() {
      if ((window as any).pdfjsLib) {
        (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      } else setTimeout(ini, 80);
    })();

    const kd = (e: KeyboardEvent) => {
      const meta = e.ctrlKey || e.metaKey;
      const inEdit = (e.target as HTMLElement).isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName);
      if (meta && e.key === 'o') { e.preventDefault(); openFile(); return; }
      if (meta && e.key === 's') { e.preventDefault(); savePDF(); return; }
      if (meta && (e.key === '+' || e.key === '=')) { e.preventDefault(); doZoom(0.25); return; }
      if (meta && e.key === '-') { e.preventDefault(); doZoom(-0.25); return; }
      if (meta && e.key === '0') { e.preventDefault(); setZoom(1); return; }
      if (meta && e.key === 'f') { e.preventDefault(); fitZoom(); return; }
      if (meta && !e.shiftKey && e.key === 'z') { e.preventDefault(); doUndo(); return; }
      if (meta && ((e.shiftKey && e.key === 'z') || e.key === 'y')) { e.preventDefault(); doRedo(); return; }
      if (meta && e.key === 'd' && S.sel) { e.preventDefault(); dupEl(S.sel); return; }
      if (!inEdit) {
        switch (e.key) {
          case 'Escape': setTool('select'); break;
          case 'ArrowLeft': goPrev(); break;
          case 'ArrowRight': goNext(); break;
          case 's': case 'S': setTool('select'); break;
          case 't': case 'T': setTool('text'); break;
          case 'n': case 'N': setTool('note'); break;
          case 'd': case 'D': setTool('draw'); break;
          case 'h': case 'H': setTool('hl'); break;
          case 'x': case 'X': setTool('erase'); break;
          case 'e': case 'E': setTool('editText'); break;
          case 'w': case 'W': setTool('whiteout'); break;
          case 'g': case 'G': openSigModal(); break;
          case 'i': case 'I': trigImg(); break;
          case '?': openKB(); break;
          case 'Delete': case 'Backspace': if (S.sel) { e.preventDefault(); removeEl(S.sel); } break;
          default: break;
        }
      }
    };
    document.addEventListener('keydown', kd);

    const cw = g('ep-cw');
    const onScroll = () => {
      if (!cw) return;
      const mid = cw.scrollTop + cw.clientHeight / 2;
      let best = 0, bestD = Infinity;
      S.pages.forEach((p: any, i: number) => {
        const r = p.wrap.getBoundingClientRect(), cwR = cw.getBoundingClientRect();
        const pm = (r.top - cwR.top) + cw.scrollTop + r.height / 2;
        const d = Math.abs(pm - mid); if (d < bestD) { bestD = d; best = i; }
      });
      if (S.cur !== best) { S.cur = best; updPL(); updThH(best); }
    };
    if (cw) cw.addEventListener('scroll', onScroll, { passive: true });

    const onDragOver = (e: DragEvent) => e.preventDefault();
    const onDropDoc = (e: DragEvent) => { e.preventDefault(); const f = e.dataTransfer?.files[0]; if (f) handleFile(f); };
    const onClickDoc = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.id === 'ep-cw' || t.id === 'ep-pw') deselAll();
      const ctx = g('ep-ctx'); if (ctx && !ctx.contains(t)) hideCtx();
      ['merge', 'sig', 'crop', 'link', 'qr', 'watermark'].forEach(id => { const m = g('ep-mod-' + id); if (m && e.target === m) closeModal(id); });
      const kbp = g('ep-kbp'); if (kbp && e.target === kbp) closeKB();
    };
    document.addEventListener('dragover', onDragOver);
    document.addEventListener('drop', onDropDoc);
    document.addEventListener('click', onClickDoc);

    return () => {
      const s = g('ep-styles'); if (s) s.remove();
      document.removeEventListener('keydown', kd);
      if (cw) cw.removeEventListener('scroll', onScroll);
      document.removeEventListener('dragover', onDragOver);
      document.removeEventListener('drop', onDropDoc);
      document.removeEventListener('click', onClickDoc);
      S.pages = []; S.cur = 0; S.zoom = 1; S.tool = 'select'; S.sel = null; S.undos = []; S.redos = [];
      _replaceTarget = null;
    };
  }, []);

  const COLORS = ['#000000', '#ffffff', '#ef4444', '#3b82f6', '#22c55e', '#f59e0b', '#8b5cf6', '#ec4899', '#ff5f2e', '#06b6d4', '#10b981', '#f97316'];

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js" strategy="afterInteractive" />
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" strategy="afterInteractive" />
      <div id="ep-prog" />
      <div id="ep-toast" role="status" aria-live="polite" />
      <div id="ep-editbanner">✏️ Edit Text Mode — click any highlighted text to edit · Enter to confirm · Esc to cancel · Shift+Enter for new line · Press E again to exit</div>

      <div id="ep-app">
        {/* ═══ TOOLBAR ═══ */}
        <header id="ep-tb">
          <span className="ep-logo"><em>PDF</em>Editor</span>
          <div className="ep-sep" />
          <button className="ep-tbtn" onClick={openFile} title="Open (Ctrl+O)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>Open
          </button>
          <div className="ep-sep" />
          <button className="ep-tbtn" onClick={() => doZoom(-0.25)} title="Zoom out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /></svg>
          </button>
          <span id="ep-zl">100%</span>
          <button className="ep-tbtn" onClick={() => doZoom(0.25)} title="Zoom in">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" /><line x1="11" y1="8" x2="11" y2="14" /></svg>
          </button>
          <button className="ep-tbtn" onClick={() => setZoom(1)}>100%</button>
          <button className="ep-tbtn" onClick={fitZoom}>Fit</button>
          <div className="ep-sep" />
          <button className="ep-tbtn" onClick={goPrev} title="Prev page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6" /></svg>
          </button>
          <span id="ep-pl"> , </span>
          <button className="ep-tbtn" onClick={goNext} title="Next page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
          </button>
          <div style={{ flex: 1 }} />
          <button className="ep-tbtn" onClick={openKB} title="Shortcuts (?)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="13" rx="2" /><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" /></svg>Keys
          </button>
          <button className="ep-tbtn" id="ep-btn-compress" onClick={() => savePDF(true)} style={{ display: 'none' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>Compress
          </button>
          <button className="ep-tbtn" id="ep-btn-merge" onClick={() => openModal('merge')} style={{ display: 'none' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>Merge
          </button>
          <button className="ep-tbtn pri" id="ep-btn-save" onClick={() => savePDF()} style={{ display: 'none' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>Download PDF
          </button>
        </header>

        {/* ═══ BODY ═══ */}
        <div id="ep-body">
          {/* SIDEBAR */}
          <aside id="ep-sb">
            <div className="ep-sl">Edit PDF Content</div>
            <div className="ep-tgrid">
              <button className="ep-stool" data-ep-tool="editText" onClick={() => setTool('editText')} title="Edit existing PDF text (E)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4z" /></svg>
                Edit Text
              </button>
              <button className="ep-stool" data-ep-tool="whiteout" onClick={() => setTool('whiteout')} title="Whiteout (W)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="9" x2="15" y2="15" /><line x1="15" y1="9" x2="9" y2="15" /></svg>
                Whiteout
              </button>
            </div>

            <div className="ep-sdiv" />
            <div className="ep-sl">Draw &amp; Annotate</div>
            <div className="ep-tgrid">
              {[
                ['select', 'Select', 'M5 3l14 9-7 1-4 7z'],
                ['text', 'Text', 'M4 7V4h16v3 M9 20h6 M12 4v16'],
                ['note', 'Note', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'],
                ['draw', 'Draw', 'M12 20h9 M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z'],
                ['hl', 'Highlight', 'M3 16h18M3 16a9 9 0 0 1 9-9h.01M12 7a9 9 0 0 1 9 9'],
                ['erase', 'Eraser', 'M20 20H7L3 16l9-9 8 8z M6 17.9l1-1'],
                ['rect', 'Box', 'M3 3h18v18H3z'],
                ['circle', 'Circle', 'circle cx="12" cy="12" r="10"'],
                ['line', 'Line', 'M5 19L19 5'],
                ['arrow', 'Arrow', 'M5 12h14 M12 5l7 7-7 7'],
                ['callout', 'Callout', 'M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z M8 9h8 M8 13h5'],
                ['img', 'Image', 'M21 3H3v18h18V3z M8.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5-5 5-3-3-5 5'],
                ['sign', 'Sign', 'M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5z'],
                ['link', 'Link', 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'],
                ['redact', 'Redact', 'M3 8h18v8H3z'],
              ].map(([tool, label, path]) => (
                <button key={tool} className={'ep-stool' + (tool === 'select' ? ' on' : '')} data-ep-tool={tool}
                  onClick={() => tool === 'img' ? trigImg() : tool === 'sign' ? openSigModal() : setTool(tool)}
                  title={label}>
                  <svg viewBox="0 0 24 24" fill={tool === 'redact' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    {(path as string).startsWith('circle') ? <circle cx="12" cy="12" r="10" /> : <path d={path as string} />}
                  </svg>
                  {label}
                </button>
              ))}
            </div>

            <div className="ep-sdiv" />
            <div className="ep-tgrid" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              <button className="ep-stool" onClick={doUndo} title="Undo (Ctrl+Z)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></svg>Undo
              </button>
              <button className="ep-stool" onClick={doRedo} title="Redo (Ctrl+Y)">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 7v6h-6" /><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13" /></svg>Redo
              </button>
              <button className="ep-stool" onClick={() => openModal('crop')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 2 6 8 2 8" /><polyline points="18 22 18 16 22 16" /><path d="M6 8h12v8" /><path d="M18 16H6V8" /></svg>Crop
              </button>
            </div>

            <div className="ep-sdiv" />
            <div className="ep-sl">Pages</div>
            {[
              ['Add blank', addBlankPage, 'M3 3h18v18H3z M12 8v8 M8 12h8'],
              ['Duplicate', dupPage, 'M9 9h13v13H9z M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'],
              ['Delete', delPage, 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6'],
              ['Rotate 90°', rotatePage, 'M23 4v6h-6 M20.49 15a9 9 0 1 1-2.12-9.36L23 10'],
              ['Merge PDF', () => openModal('merge'), 'M17 1l4 4-4 4 M3 11V9a4 4 0 0 1 4-4h14 M7 23l-4-4 4-4 M21 13v2a4 4 0 0 1-4 4H3'],
            ].map(([label, fn, path]) => (
              <button key={label as string} className="ep-sa" onClick={fn as () => void}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={path as string} /></svg>
                {label as string}
              </button>
            ))}

            <div className="ep-sdiv" />
            <div className="ep-sl">Thumbnails</div>
            <div id="ep-thumbs" role="list" />
          </aside>

          {/* CANVAS */}
          <main id="ep-cw" role="main">
            <div id="ep-dz" className="ep-dz" role="button" tabIndex={0}
              onClick={openFile}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') openFile(); }}
              onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('over'); }}
              onDragLeave={e => e.currentTarget.classList.remove('over')}
              onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('over'); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}>
              <div className="ep-dz-icon">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#ff5f2e" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
              </div>
              <h2>Drop your PDF here</h2>
              <p>Or click to browse — supports PDF, JPG, PNG<br />Your files never leave your device</p>
              <button className="ep-dz-btn" onClick={e => { e.stopPropagation(); openFile(); }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" /></svg>
                Choose File
              </button>
              <div className="ep-chips">
                {['✏️ Edit Existing Text', '🖍️ Draw', '✍️ Sign', '🖼️ Images', '📌 Stamps', '🔀 Merge', '🗜️ Compress', '🔒 Private'].map(c => (
                  <span key={c} className="ep-chip">{c}</span>
                ))}
              </div>
            </div>
            <div id="ep-pw" style={{ display: 'none', flexDirection: 'column', alignItems: 'center', gap: '32px', width: '100%' }} />
          </main>

          {/* RIGHT PANEL */}
          <aside id="ep-rp">
            <div style={{ padding: '12px', font: '600 9px/1 var(--ff)', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--t4)' }}>Properties</div>

            <div className="ep-rs">
              <span className="ep-rh">Color</span>
              <div className="ep-clrs" id="ep-clrs">
                {COLORS.map((c, i) => (
                  <div key={c} className={'ep-cd' + (i === 0 ? ' on' : '')} data-c={c}
                    style={{ background: c, ...(c === '#ffffff' ? { boxShadow: 'inset 0 0 0 1px #ccc' } : {}) }}
                    onClick={() => pickColor(c)} />
                ))}
              </div>
              <input type="color" id="ep-cpick" defaultValue="#000000"
                onInput={e => pickColorCustom((e.target as HTMLInputElement).value)}
                style={{ width: '100%', height: '34px', border: '1px solid var(--b2)', borderRadius: 'var(--r6)', background: 'none', padding: '2px', cursor: 'pointer', marginTop: '4px' }} />
            </div>

            <div className="ep-rs">
              <span className="ep-rh">Stroke &amp; Opacity</span>
              {[
                ['Width', 'sw', '1', '30', '2', 'px'],
                ['Opacity', 'op', '10', '100', '100', '%'],
                ['Highlight', 'hlw', '8', '60', '18', 'px'],
                ['Eraser', 'er', '8', '80', '24', 'px'],
              ].map(([label, key, min, max, def, unit]) => (
                <div key={key as string}>
                  <div style={{ font: '500 9px var(--ffm)', color: 'var(--t4)', marginBottom: '2px', marginTop: key !== 'sw' ? '8px' : '0' }}>{label}</div>
                  <div className="ep-sr">
                    <input type="range" min={min} max={max} defaultValue={def} id={`ep-r-${key}`}
                      onInput={e => { const v = +(e.target as HTMLInputElement).value; C[key as string] = key === 'op' ? v / 100 : v; const sv = g(`ep-v-${key}`); if (sv) sv.textContent = v + unit; }} />
                    <span className="ep-sv" id={`ep-v-${key}`}>{def}{unit}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="ep-rs">
              <span className="ep-rh">Text</span>
              <select className="ep-ri" id="ep-sel-font" onChange={e => { C.font = e.target.value; }} style={{ marginBottom: '8px' }}>
                <option value="'Inter',sans-serif">Inter</option>
                <option value="Georgia,serif">Georgia</option>
                <option value="'Times New Roman',serif">Times New Roman</option>
                <option value="'Courier New',monospace">Courier New</option>
                <option value="Arial,sans-serif">Arial</option>
                <option value="Verdana,sans-serif">Verdana</option>
                <option value="Impact,sans-serif">Impact</option>
              </select>
              <div style={{ font: '500 9px var(--ffm)', color: 'var(--t4)', marginBottom: '2px' }}>Size</div>
              <div className="ep-sr">
                <input type="range" min="8" max="96" defaultValue="18" id="ep-r-fs"
                  onInput={e => { C.fs = +(e.target as HTMLInputElement).value; const v = g('ep-v-fs'); if (v) v.textContent = C.fs + 'px'; }} />
                <span className="ep-sv" id="ep-v-fs">18px</span>
              </div>
              <select className="ep-ri" id="ep-sel-align" onChange={e => { C.align = e.target.value; }} style={{ marginTop: '8px', marginBottom: '4px' }}>
                <option value="left">Align Left</option>
                <option value="center">Center</option>
                <option value="right">Align Right</option>
              </select>
              <div className="ep-fbtns">
                {[['bold', 'B'], ['italic', 'I'], ['underline', 'U'], ['strike', 'S']].map(([f, lbl]) => (
                  <button key={f} className="ep-fbtn" id={`ep-fb-${f}`} onClick={() => togFmt(f)}
                    style={f === 'bold' ? { fontWeight: 'bold' } : f === 'italic' ? { fontStyle: 'italic' } : f === 'underline' ? { textDecoration: 'underline' } : { textDecoration: 'line-through' }}>
                    {lbl}
                  </button>
                ))}
              </div>
            </div>

            <div className="ep-rs">
              <span className="ep-rh">Shape Fill</span>
              <select className="ep-ri" onChange={e => { C.fill = e.target.value; }}>
                <option value="none">No fill</option>
                <option value="solid">Solid fill</option>
                <option value="semi">Semi-transparent</option>
              </select>
              <div style={{ font: '500 9px var(--ffm)', color: 'var(--t4)', marginTop: '8px', marginBottom: '2px' }}>Corner Radius</div>
              <div className="ep-sr">
                <input type="range" min="0" max="30" defaultValue="0"
                  onInput={e => { C.rad = +(e.target as HTMLInputElement).value; const v = g('ep-v-rad'); if (v) v.textContent = C.rad + 'px'; }} />
                <span className="ep-sv" id="ep-v-rad">0px</span>
              </div>
            </div>

            <div className="ep-rs">
              <span className="ep-rh">Quick Add</span>
              <div className="ep-mini-grid">
                {[
                  ['Counter', addCounter, 'M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2z M12 8v8 M8 12h8'],
                  ['Progress', addProgressBar, 'M2 9h20v6a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V9z M2 9h12v6H2z'],
                  ['QR Code', addQRCode, 'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h2v2h-2z M18 14h2v2h-2z M14 18h2v2h-2z M18 18h2v2h-2z'],
                  ['Watermark', addWatermark, 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'],
                ].map(([label, fn, path]) => (
                  <button key={label as string} className="ep-mini-btn" onClick={fn as () => void}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={path as string} /></svg>
                    {label as string}
                  </button>
                ))}
              </div>
            </div>

            <div className="ep-rs">
              <span className="ep-rh">Stamps</span>
              {[
                ['APPROVED', '#16a34a'], ['REJECTED', '#dc2626'], ['DRAFT', '#d97706'],
                ['CONFIDENTIAL', '#7c3aed'], ['REVIEWED', '#2563eb'], ['PAID', '#16a34a'],
                ['VOID', '#dc2626'], ['FOR SIGNATURE', '#0891b2'], ['COPY', '#0891b2'],
              ].map(([lbl, color]) => (
                <button key={lbl} className="ep-stamp-btn" style={{ color }} onClick={() => addStamp(lbl as string, color as string)}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="2" y="2" width="20" height="20" rx="2" /></svg>
                  {lbl}
                </button>
              ))}
            </div>
          </aside>
        </div>

        {/* FOOTER */}
        <footer id="ep-foot">
          <div className="ep-fi">
            <span><em style={{ color: 'var(--acc)', fontStyle: 'normal' }}>PDF</em>Editor · 100% Free · No Watermarks · No Signup · Files Stay on Your Device</span>
            <span style={{ color: 'var(--t4)' }}>© 2025</span>
          </div>
        </footer>
      </div>

      {/* FAB */}
      <button id="ep-fab" onClick={() => savePDF()}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
        Download PDF
      </button>

      {/* CONTEXT MENU */}
      <div id="ep-ctx">
        {[['dup', 'Duplicate'], ['fwd', 'Bring Forward'], ['bwd', 'Send Backward'], ['front', 'Bring to Front'], ['back', 'Send to Back']].map(([a, l]) => (
          <div key={a} className="ep-ctx-i" onClick={() => ctxDo(a as string)}>{l}</div>
        ))}
        <div className="ep-ctx-sep" />
        <div className="ep-ctx-i red" onClick={() => ctxDo('del')}>Delete</div>
      </div>

      {/* MODALS */}
      <div className="ep-mbg" id="ep-mod-merge">
        <div className="ep-mbox">
          <h3>Merge PDF Files</h3>
          <p>Select additional PDFs to append to the current document.</p>
          <input type="file" accept=".pdf" multiple className="ep-ri" style={{ padding: '8px' }} onChange={e => doMerge(e as any)} />
          <div className="ep-mbtns"><button className="ep-mb gh" onClick={() => closeModal('merge')}>Cancel</button></div>
        </div>
      </div>

      <div className="ep-mbg" id="ep-mod-sig">
        <div className="ep-mbox" style={{ width: 'min(460px,96vw)' }}>
          <h3>Draw Your Signature</h3>
          <p>Sign with your mouse or finger, then click Add to PDF.</p>
          <canvas id="ep-sigcv" width="400" height="130" />
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap' }}>
            <button className="ep-mb gh" onClick={clearSig} style={{ padding: '6px 14px', fontSize: '11px' }}>Clear</button>
            <div style={{ display: 'flex', gap: '4px' }}>
              {(['#000', '#1d4ed8', '#dc2626', '#15803d'] as string[]).map(c => (
                <div key={c} style={{ width: '22px', height: '22px', borderRadius: '50%', background: c, cursor: 'pointer' }}
                  onClick={() => { S.sigColor = c; }} />
              ))}
            </div>
            <span style={{ font: '400 11px var(--ff)', color: 'var(--t3)', marginLeft: 'auto' }}>
              Pen: <input type="range" min="1" max="6" defaultValue="2" id="ep-sig-sw"
                style={{ width: '56px', accentColor: 'var(--acc)', verticalAlign: 'middle', marginLeft: '4px' }} />
            </span>
          </div>
          <div className="ep-mbtns">
            <button className="ep-mb gh" onClick={() => closeModal('sig')}>Cancel</button>
            <button className="ep-mb pri" onClick={applySig}>Add to PDF</button>
          </div>
        </div>
      </div>

      <div className="ep-mbg" id="ep-mod-crop">
        <div className="ep-mbox">
          <h3>Crop Page</h3>
          <p>Pixels to trim from each edge of the current page.</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[['t', 'Top'], ['b', 'Bottom'], ['l', 'Left'], ['r', 'Right']].map(([k, lbl]) => (
              <label key={k} style={{ font: '400 11px var(--ff)', color: 'var(--t3)' }}>
                {lbl} (px)<br />
                <input type="number" className="ep-ri" defaultValue="0" min="0" id={`ep-cr-${k}`} style={{ marginTop: '4px' }} />
              </label>
            ))}
          </div>
          <div className="ep-mbtns">
            <button className="ep-mb gh" onClick={() => closeModal('crop')}>Cancel</button>
            <button className="ep-mb pri" onClick={doCrop}>Apply Crop</button>
          </div>
        </div>
      </div>

      <div className="ep-mbg" id="ep-mod-link">
        <div className="ep-mbox">
          <h3>Add Hyperlink</h3>
          <p>URL and display text for the link.</p>
          <label style={{ font: '400 11px var(--ff)', color: 'var(--t3)' }}>
            URL<br /><input type="url" className="ep-ri" id="ep-link-url" placeholder="https://example.com" style={{ marginTop: '4px' }} />
          </label>
          <label style={{ font: '400 11px var(--ff)', color: 'var(--t3)', marginTop: '8px', display: 'block' }}>
            Display Text<br /><input type="text" className="ep-ri" id="ep-link-txt" placeholder="Click here" style={{ marginTop: '4px' }} />
          </label>
          <div className="ep-mbtns">
            <button className="ep-mb gh" onClick={() => closeModal('link')}>Cancel</button>
            <button className="ep-mb pri" onClick={applyLink}>Add Link</button>
          </div>
        </div>
      </div>

      <div className="ep-mbg" id="ep-mod-qr">
        <div className="ep-mbox">
          <h3>Add QR Code</h3>
          <p>Enter URL or text to embed as QR code.</p>
          <input type="text" className="ep-ri" id="ep-qr-text" placeholder="https://example.com" style={{ marginBottom: '4px' }} />
          <div className="ep-mbtns">
            <button className="ep-mb gh" onClick={() => closeModal('qr')}>Cancel</button>
            <button className="ep-mb pri" onClick={applyQR}>Add QR Code</button>
          </div>
        </div>
      </div>

      <div className="ep-mbg" id="ep-mod-watermark">
        <div className="ep-mbox">
          <h3>Add Watermark</h3>
          <label style={{ font: '400 11px var(--ff)', color: 'var(--t3)' }}>Text<br /><input type="text" className="ep-ri" id="ep-wm-text" defaultValue="CONFIDENTIAL" style={{ margin: '4px 0 8px' }} /></label>
          <label style={{ font: '400 11px var(--ff)', color: 'var(--t3)' }}>Opacity<br /><input type="range" min="5" max="60" defaultValue="18" id="ep-wm-op" style={{ width: '100%', accentColor: 'var(--acc)', margin: '4px 0 8px' }} /></label>
          <label style={{ font: '400 11px var(--ff)', color: 'var(--t3)' }}>Color<br /><input type="color" defaultValue="#888888" id="ep-wm-color" style={{ width: '100%', height: '34px', border: '1px solid var(--b2)', borderRadius: 'var(--r6)', background: 'none', padding: '2px', marginTop: '4px' }} /></label>
          <div className="ep-mbtns">
            <button className="ep-mb gh" onClick={() => closeModal('watermark')}>Cancel</button>
            <button className="ep-mb pri" onClick={applyWatermark}>Add Watermark</button>
          </div>
        </div>
      </div>

      {/* KEYBOARD SHORTCUTS */}
      <div id="ep-kbp" onClick={(e: any) => { if (e.target.id === 'ep-kbp') closeKB(); }}>
        <div className="ep-kbbox">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h3 style={{ font: '700 16px/1 var(--ff)', color: 'var(--t1)' }}>Keyboard Shortcuts</h3>
            <button onClick={closeKB} style={{ background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer', fontSize: '20px', lineHeight: '1' }}>×</button>
          </div>
          <div className="ep-kbgrid">
            {[['Open file', 'Ctrl+O'], ['Download PDF', 'Ctrl+S'], ['Undo', 'Ctrl+Z'], ['Redo', 'Ctrl+Y'], ['Zoom in', 'Ctrl++'], ['Zoom out', 'Ctrl+-'], ['Fit page', 'Ctrl+F'], ['Prev/Next page', '← →'], ['Select', 'S'], ['Text', 'T'], ['Note', 'N'], ['Draw', 'D'], ['Highlight', 'H'], ['Eraser', 'X'], ['Edit existing text', 'E'], ['Whiteout', 'W'], ['Sign', 'G'], ['Image', 'I'], ['Delete', 'Del'], ['Escape/deselect', 'Esc'], ['Duplicate', 'Ctrl+D'], ['Shortcuts', '?']].map(([label, key]) => (
              <div className="ep-kbrow" key={key}>
                <span>{label}</span><kbd>{key}</kbd>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HIDDEN INPUTS */}
      <input type="file" id="ep-finp" accept=".pdf,image/*" style={{ display: 'none' }} onChange={e => onFileChange(e as any)} />
      <input type="file" id="ep-iinp" accept="image/*" style={{ display: 'none' }} onChange={e => onImgChange(e as any)} />
      <input type="file" id="ep-img-replace-inp" accept="image/*" style={{ display: 'none' }} onChange={e => onImgReplaceChange(e as any)} />
    </>
  );
}