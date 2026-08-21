'use client';

import { useEffect } from 'react';

export default function TestSpeedConnection() {
  useEffect(() => {
    const $ = (id: string) => document.getElementById(id) as any;

    // ── CURSOR ──
    const cur = $('cur'), curR = $('cur-r');
    let mx = -200, my = -200, rx = -200, ry = -200;

    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    const onDown = () => document.body.classList.add('cc');
    const onUp = () => document.body.classList.remove('cc');
    const onLeave = () => { if (cur) cur.style.opacity = '0'; if (curR) curR.style.opacity = '0'; };
    const onEnter = () => { if (cur) cur.style.opacity = '1'; if (curR) curR.style.opacity = '1'; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);

    let rafId = 0;
    (function loop() {
      if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
      rx += (mx - rx) * 0.13; ry += (my - ry) * 0.13;
      if (curR) { curR.style.left = rx + 'px'; curR.style.top = ry + 'px'; }
      rafId = requestAnimationFrame(loop);
    })();

    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest?.('button,a,.server-card,.test-tab,[role="button"],.share-btn'))
        document.body.classList.add('ch');
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest?.('button,a,.server-card,.test-tab,[role="button"],.share-btn'))
        document.body.classList.remove('ch');
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);

    // ── DARK MODE ──
    const applyDark = (on: boolean) => {
      document.body.classList.toggle('dark', on);
      $('iSun')?.classList.toggle('hidden', on);
      $('iMoon')?.classList.toggle('hidden', !on);
      try { localStorage.setItem('st_dark', on ? '1' : '0'); } catch {}
    };
    const savedDark = (() => { try { return localStorage.getItem('st_dark'); } catch { return null; } })();
    applyDark(savedDark !== null ? savedDark === '1' : window.matchMedia('(prefers-color-scheme: dark)').matches);

    $('darkToggle')?.addEventListener('click', () => {
      const on = !document.body.classList.contains('dark');
      applyDark(on);
      toast(on ? 'Dark mode enabled' : 'Light mode enabled', 'info');
    });

    // ── TOAST ──
    const toastRoot = $('toastRoot');
    function toast(msg: string, type = 'info', duration = 3500) {
      const icons: Record<string, string> = {
        success: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
        error: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
        info: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
      };
      const el = document.createElement('div');
      el.className = `toast ${type}`;
      el.innerHTML = (icons[type] || icons.info) + `<span>${msg}</span>`;
      toastRoot?.appendChild(el);
      setTimeout(() => {
        el.style.opacity = '0'; el.style.transform = 'translateX(20px)';
        setTimeout(() => el.remove(), 350);
      }, duration);
    }

    // ── GAUGE ──
    const ARC_LEN = 2 * Math.PI * 110 * (270 / 360);
    const gaugeArc = $('gaugeArc');
    const gaugeNeedleDot = $('gaugeNeedleDot');
    const gaugeValueEl = $('gaugeValue');
    const gaugeLabelEl = $('gaugeLabel');

    function setGauge(speedFrac: number, label?: string, displayVal?: string) {
      speedFrac = Math.max(0, Math.min(1, speedFrac));
      const dash = speedFrac * ARC_LEN;
      if (gaugeArc) gaugeArc.style.strokeDasharray = `${dash} ${ARC_LEN + 10}`;
      const rotateDeg = -135 + speedFrac * 270;
      if (gaugeNeedleDot) gaugeNeedleDot.style.transform = `rotate(${rotateDeg}deg)`;
      if (gaugeValueEl) gaugeValueEl.textContent = displayVal !== undefined ? displayVal : (speedFrac * 200).toFixed(1);
      if (label !== undefined && gaugeLabelEl) gaugeLabelEl.textContent = label;
    }

    function resetGauge() {
      if (gaugeArc) gaugeArc.style.strokeDasharray = `0 ${ARC_LEN + 10}`;
      if (gaugeNeedleDot) gaugeNeedleDot.style.transform = 'rotate(-135deg)';
      if (gaugeValueEl) gaugeValueEl.textContent = ' , ';
      if (gaugeLabelEl) gaugeLabelEl.textContent = 'Ready';
    }
    resetGauge();

    // ── SERVER SELECTION ──
    let selectedServer = 'Cloudflare CDN';
    document.querySelectorAll('.server-card').forEach((card: any) => {
      card.addEventListener('click', () => {
        if (testActive) return;
        document.querySelectorAll('.server-card').forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        selectedServer = card.dataset.server;
        toast(`Server: ${selectedServer}`, 'info', 2000);
      });
      card.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); (card as HTMLElement).click(); }
      });
    });

    // ── TEST TYPE TABS ──
    let testType = 'full';
    document.querySelectorAll('.test-tab').forEach((tab: any) => {
      tab.addEventListener('click', () => {
        if (testActive) return;
        document.querySelectorAll('.test-tab').forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        testType = tab.dataset.test;
        toast(`Mode: ${tab.textContent}`, 'info', 1800);
      });
    });

    // ── REAL SPEED MEASUREMENT ──
    // Uses the local /api/network/benchmark route — no CORS issues
    const DOWNLOAD_URL = '/api/network/benchmark?bytes=4000000'; // 4 MB
    const UPLOAD_URL   = '/api/network/benchmark';
    const PING_URL     = '/api/network/benchmark?bytes=4096';

    async function measurePing(): Promise<{ ping: number; jitter: number }> {
      const samples: number[] = [];
      for (let i = 0; i < 5; i++) {
        const t0 = performance.now();
        try {
          await fetch(PING_URL + '&t=' + Date.now(), { cache: 'no-store', mode: 'cors' });
        } catch {}
        samples.push(performance.now() - t0);
      }
      const avg = samples.reduce((a, b) => a + b, 0) / samples.length;
      const jitter = Math.sqrt(samples.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / samples.length);
      return { ping: Math.round(avg), jitter: Math.round(jitter) };
    }

    async function measureDownload(onProgress: (mbps: number) => void): Promise<number> {
      const t0 = performance.now();
      let loaded = 0;
      try {
        const resp = await fetch(DOWNLOAD_URL + '&t=' + Date.now(), { cache: 'no-store', mode: 'cors' });
        const reader = resp.body!.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          loaded += value?.length ?? 0;
          const elapsed = (performance.now() - t0) / 1000;
          if (elapsed > 0.5) onProgress((loaded * 8) / elapsed / 1e6);
        }
      } catch {}
      const elapsed = (performance.now() - t0) / 1000;
      return elapsed > 0 ? (loaded * 8) / elapsed / 1e6 : 0;
    }

    async function measureUpload(onProgress: (mbps: number) => void): Promise<number> {
      const SIZE = 4 * 1024 * 1024; // 4 MB — within Vercel's body size limit
      const data = new Uint8Array(SIZE);
      const t0 = performance.now();
      try {
        await fetch(UPLOAD_URL + '?t=' + Date.now(), {
          method: 'POST',
          body: data,
          mode: 'cors',
          headers: { 'Content-Type': 'application/octet-stream' },
        });
      } catch {}
      const elapsed = (performance.now() - t0) / 1000;
      const mbps = elapsed > 0 ? (SIZE * 8) / elapsed / 1e6 : 0;
      onProgress(mbps);
      return mbps;
    }

    // ── TEST STATE ──
    let testActive = false;
    let abortCtrl: AbortController | null = null;

    const startBtn = $('startTestBtn');
    const startBtnText = $('startBtnText');
    const progressSection = $('progressSection');
    const progressBar = $('progressBar');
    const progressPercent = $('progressPercent');
    const progressLabel = $('progressLabel');
    const statusBox = $('statusBox');
    const resultsSection = $('resultsSection');

    function setProgress(pct: number, label?: string) {
      pct = Math.round(Math.min(100, Math.max(0, pct)));
      if (progressBar) progressBar.style.width = pct + '%';
      if (progressPercent) progressPercent.textContent = pct + '%';
      if (label && progressLabel) progressLabel.textContent = label;
    }

    function setStatus(html: string) { if (statusBox) statusBox.innerHTML = html; }

    async function startSpeedTest() {
      if (testActive) return;
      testActive = true;
      abortCtrl = new AbortController();

      startBtn.disabled = true;
      startBtnText.textContent = 'TESTING…';
      startBtn.classList.remove('pulse-glow');
      progressSection.classList.remove('hidden');
      resultsSection.classList.add('hidden');
      resetGauge();
      setProgress(0);
      setStatus(`<div class="flex items-center gap-3"><div class="spinner"></div><span style="color:var(--primary)">Waiting for stable connection…</span></div>`);

      // ── Phase 0: Stabilization wait (1.5 s) ──
      await new Promise(r => setTimeout(r, 1500));
      if (!testActive) return;

      let ping = 0, jitter = 0, download = 0, upload = 0;

      // ── Phase 1: Ping ──
      if (testType === 'full' || testType === 'ping') {
        setProgress(5, 'Measuring ping & jitter…');
        setStatus(`<div class="flex items-center gap-3"><div class="spinner"></div><span style="color:var(--primary)">Measuring ping & jitter…</span></div>`);
        setGauge(0.01, 'Ping…', '…');
        const r = await measurePing();
        ping = r.ping; jitter = r.jitter;
        setProgress(20, 'Ping measured');
      }

      // ── Phase 2: Download ──
      if (testType === 'full' || testType === 'download') {
        setStatus(`<div class="flex items-center gap-3"><div class="spinner"></div><span style="color:var(--primary)">Testing download speed…</span></div>`);
        let dlPct = 20;
        download = await measureDownload((mbps) => {
          dlPct = Math.min(65, 20 + (mbps / 200) * 45);
          setProgress(dlPct, `Download: ${mbps.toFixed(1)} Mbps`);
          setGauge(mbps / 200, 'Mbps ↓', mbps.toFixed(1));
        });
        setGauge(download / 200, 'Mbps ↓', download.toFixed(1));
        setProgress(65, `Download: ${download.toFixed(1)} Mbps`);
      }

      // ── Phase 3: Upload ──
      if (testType === 'full' || testType === 'upload') {
        setStatus(`<div class="flex items-center gap-3"><div class="spinner"></div><span style="color:var(--primary)">Testing upload speed…</span></div>`);
        setProgress(66, 'Testing upload speed…');
        upload = await measureUpload((mbps) => {
          setProgress(Math.min(95, 66 + (mbps / 200) * 29), `Upload: ${mbps.toFixed(1)} Mbps`);
          setGauge(mbps / 200, 'Mbps ↑', mbps.toFixed(1));
        });
        setGauge(upload / 200, 'Mbps ↑', upload.toFixed(1));
        setProgress(95, `Upload: ${upload.toFixed(1)} Mbps`);
      }

      if (!testActive) return;
      completeTest(download, upload, ping, jitter);
    }

    function completeTest(download: number, upload: number, ping: number, jitter: number) {
      testActive = false;

      const dl = download.toFixed(1);
      const ul = upload.toFixed(1);

      setGauge(download / 200, 'Mbps', dl);
      setProgress(100, 'Complete!');

      $('downloadResult').textContent = dl;
      $('uploadResult').textContent = ul;
      $('pingResult').textContent = String(ping || ' , ');
      $('jitterResult').textContent = String(jitter || ' , ');

      setStatus(`<div class="flex items-center gap-3"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span style="color:var(--success)">Done! ↓ ${dl} Mbps  ↑ ${ul} Mbps  Ping ${ping} ms</span></div>`);

      addHistoryRow(dl, ul, ping, selectedServer);
      resultsSection.classList.remove('hidden');
      startBtn.disabled = false;
      startBtnText.textContent = 'START TEST';
      startBtn.classList.add('pulse-glow');
      toast('Speed test complete! Results saved.', 'success');
    }

    function cancelTest() {
      if (!testActive) return;
      abortCtrl?.abort();
      testActive = false;
      startBtn.disabled = false;
      startBtnText.textContent = 'START TEST';
      startBtn.classList.add('pulse-glow');
      progressSection.classList.add('hidden');
      resetGauge();
      setStatus(`<div class="flex items-center gap-3"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted);flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><span style="color:var(--muted)">Test cancelled. Click START TEST to try again.</span></div>`);
      toast('Test cancelled', 'info');
    }

    startBtn?.addEventListener('click', startSpeedTest);

    $('testAgainBtn')?.addEventListener('click', () => {
      resultsSection.classList.add('hidden');
      progressSection.classList.add('hidden');
      resetGauge();
      setStatus(`<div class="flex items-center gap-3"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted);flex-shrink:0"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><span style="color:var(--muted)">Ready for another test. Click START TEST to begin.</span></div>`);
      toast('Ready for new test', 'info', 2000);
    });

    // ── SHARE ──
    $('copyBtn')?.addEventListener('click', () => {
      const txt = `Speed Test Results\nDownload: ${$('downloadResult').textContent} Mbps\nUpload:   ${$('uploadResult').textContent} Mbps\nPing:     ${$('pingResult').textContent} ms\nJitter:   ${$('jitterResult').textContent} ms\nServer:   ${selectedServer}\nvia TheFreeAITools`;
      navigator.clipboard.writeText(txt)
        .then(() => toast('Results copied!', 'success'))
        .catch(() => toast('Copy failed — please copy manually', 'error'));
    });

    $('twitterBtn')?.addEventListener('click', () => {
      const txt = encodeURIComponent(`My internet speed: ↓ ${$('downloadResult').textContent} Mbps  ↑ ${$('uploadResult').textContent} Mbps  Ping ${$('pingResult').textContent} ms — via TheFreeAITools`);
      window.open(`https://twitter.com/intent/tweet?text=${txt}`, '_blank', 'width=550,height=420');
    });

    // ── HISTORY ──
    function addHistoryRow(dl: string, ul: string, ping: number, server: string) {
      const tbody = $('historyTableBody');
      if (!tbody) return;
      const now = new Date();
      const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const pingClass = ping < 30 ? 'ping-good' : ping < 80 ? 'ping-ok' : 'ping-poor';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color:var(--muted)">Today, ${time}</td>
        <td class="speed-value">${dl} Mbps</td>
        <td class="speed-value">${ul} Mbps</td>
        <td class="${pingClass}">${ping || ' , '} ms</td>
        <td style="color:var(--muted)">${server}</td>
      `;
      tbody.insertBefore(tr, tbody.firstChild);
    }

    $('clearHistoryBtn')?.addEventListener('click', () => {
      $('historyTableBody').innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--muted);padding:24px;">No history yet. Run a test to see results here.</td></tr>';
      toast('History cleared', 'info');
    });

    // ── FAQ ──
    const FAQS = [
      { q: 'How accurate is this speed test?', a: 'The tool measures real download and upload throughput by fetching and sending data against Cloudflare\'s global CDN. Timing begins after a brief stabilization phase to eliminate ramp-up noise. For best accuracy, close other browser tabs and use Ethernet when possible.' },
      { q: 'Why does it wait before measuring?', a: 'A 1.5-second stabilization window lets your browser and network connection settle before timing begins. This eliminates cold-start bias that makes early measurements appear slower than your actual connection.' },
      { q: 'Why do my results differ from my ISP\'s advertised speed?', a: 'ISPs advertise theoretical maximum speeds under ideal conditions. Real-world speeds depend on network congestion, router quality, distance from exchange, Wi-Fi interference, and the number of simultaneous users on your plan.' },
      { q: 'What is a good download speed?', a: 'Basic browsing: 5–10 Mbps. HD streaming: 25+ Mbps. 4K streaming or online gaming: 50–100+ Mbps. Multi-device households: 200+ Mbps. Fiber connections often reach 500–1,000 Mbps.' },
      { q: 'What is ping and why does it matter?', a: 'Ping (latency) is the round-trip time in milliseconds from your device to the server and back. Under 30 ms is excellent for gaming and video calls. Above 100 ms causes perceptible lag.' },
      { q: 'What is jitter?', a: 'Jitter is the variation in ping over multiple measurements. Low jitter (under 10 ms) means a stable connection. High jitter causes choppy audio/video in calls even when average ping seems fine.' },
    ];

    const faqList = $('faqList');
    FAQS.forEach((faq) => {
      const item = document.createElement('div');
      item.className = 'faq-item';
      item.innerHTML = `
        <button class="faq-btn" aria-expanded="false">
          <span>${faq.q}</span>
          <svg class="faq-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="faq-body">
          <p class="text-sm leading-relaxed pt-2" style="color:var(--muted)">${faq.a}</p>
        </div>
      `;
      const btn = item.querySelector('.faq-btn') as HTMLButtonElement;
      const body = item.querySelector('.faq-body') as HTMLElement;
      const icon = item.querySelector('.faq-icon') as HTMLElement;
      btn.addEventListener('click', () => {
        const open = body.classList.contains('open');
        body.classList.toggle('open', !open);
        icon.classList.toggle('open', !open);
        btn.setAttribute('aria-expanded', String(!open));
      });
      faqList?.appendChild(item);
    });

    // ── SPEED TEST FAQ accordion ──
    document.querySelectorAll('.seo-faq-q').forEach((b: any) => {
      b.addEventListener('click', () => {
        b.parentElement.classList.toggle('open');
      });
    });

    // ── HEADER SCROLL ──
    const onScroll = () => {
      document.querySelector('.app-header')?.classList.toggle('scrolled', window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);

    // ── KEYBOARD SHORTCUTS ──
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;
      if (e.key === ' ' && !testActive && !startBtn.disabled) { e.preventDefault(); startSpeedTest(); }
      if (e.key === 'Escape' && testActive) { e.preventDefault(); cancelTest(); }
    };
    document.addEventListener('keydown', onKey);

    const welcomeTimer = setTimeout(() => toast('Welcome! Click START TEST or press Space to begin.', 'info', 5000), 1200);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(welcomeTimer);
      abortCtrl?.abort();
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
:root{
  --bg:#f8fafc;--card:#ffffff;--border:#e2e8f0;--fg:#0f172a;--muted:#64748b;
  --primary:#0ea5e9;--primary-dark:#0284c7;--primary-light:#f0f9ff;
  --success:#10b981;--warning:#f59e0b;--error:#ef4444;
  --shadow-sm:0 1px 3px rgba(0,0,0,0.06);--shadow:0 4px 16px rgba(0,0,0,0.08);
  --shadow-lg:0 24px 48px rgba(0,0,0,0.10);
  --radius:16px;--radius-sm:10px;--card-rgb:255,255,255;
}
.dark{--bg:#0f172a;--card:#1e293b;--border:#334155;--fg:#f1f5f9;--muted:#94a3b8;--primary:#38bdf8;--primary-dark:#0ea5e9;--primary-light:rgba(56,189,248,0.12);--card-rgb:30,41,59;}



#cur{position:fixed;width:10px;height:10px;border-radius:50%;background:var(--primary);pointer-events:none;z-index:99999;transform:translate(-50%,-50%);transition:width 0.2s,height 0.2s,background 0.2s;mix-blend-mode:difference;}
#cur-r{position:fixed;width:32px;height:32px;border-radius:50%;border:2px solid rgba(14,165,233,0.4);pointer-events:none;z-index:99998;transform:translate(-50%,-50%);transition:width 0.25s,height 0.25s,border-color 0.2s;}
body.ch #cur{width:16px;height:16px;}
body.ch #cur-r{width:44px;height:44px;border-color:rgba(14,165,233,0.7);}
body.cc #cur{transform:translate(-50%,-50%) scale(0.7);}

.mesh-bg{background:radial-gradient(ellipse 80% 60% at 10% 10%,rgba(14,165,233,0.08) 0%,transparent 60%),radial-gradient(ellipse 60% 50% at 90% 80%,rgba(56,189,248,0.07) 0%,transparent 60%),var(--bg);background-attachment:fixed;}

.app-header{background:rgba(var(--card-rgb),0.85);backdrop-filter:blur(16px);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:50;transition:all 0.3s;}
.app-header.scrolled{box-shadow:var(--shadow);background:rgba(var(--card-rgb),0.95);}

.main-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow-lg);position:relative;overflow:hidden;}
.main-card::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;background:linear-gradient(90deg,var(--primary),#8b5cf6,var(--success));background-size:200% 100%;animation:shimmer 3s linear infinite;opacity:0.7;}

.speed-gauge{position:relative;width:280px;height:280px;margin:0 auto;}
.gauge-svg{width:100%;height:100%;}
.gauge-center{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:62%;height:62%;background:var(--card);border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;border:6px solid var(--border);box-shadow:var(--shadow);z-index:10;}
.gauge-value{font-family:'Space Grotesk','Inter',sans-serif;font-weight:800;font-size:2.25rem;line-height:1;background:linear-gradient(135deg,var(--primary),var(--primary-dark));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;transition:all 0.3s;}
.gauge-label{font-size:0.75rem;color:var(--muted);margin-top:4px;text-transform:uppercase;letter-spacing:0.06em;font-weight:600;}

@keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
@keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 rgba(14,165,233,0.4);}50%{box-shadow:0 0 0 12px rgba(14,165,233,0);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes pulse{0%{opacity:1;}50%{opacity:0.5;}100%{opacity:1;}}

.anim-in{animation:fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) both;}
.d1{animation-delay:0.06s;}.d2{animation-delay:0.14s;}.d3{animation-delay:0.22s;}.d4{animation-delay:0.30s;}

.spinner{width:20px;height:20px;border:2.5px solid var(--border);border-top-color:var(--primary);border-radius:50%;animation:spin 1s linear infinite;flex-shrink:0;}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:14px 28px;border-radius:var(--radius-sm);border:none;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;transition:all 0.2s;position:relative;overflow:hidden;cursor:pointer;}
.btn-primary{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;box-shadow:0 4px 14px rgba(14,165,233,0.35);}
.btn-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 8px 24px rgba(14,165,233,0.45);}
.btn-primary:active:not(:disabled){transform:translateY(0);}
.btn-primary:disabled{background:var(--border);color:var(--muted);box-shadow:none;cursor:not-allowed;}
.btn-secondary{background:var(--card);color:var(--fg);border:1.5px solid var(--border);}
.btn-secondary:hover{border-color:var(--primary);color:var(--primary);background:var(--primary-light);}
.pulse-glow{animation:pulse-glow 2s infinite;}

#toastRoot{position:fixed;bottom:24px;right:24px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;}
.toast{padding:12px 18px;border-radius:12px;font-size:13.5px;font-weight:500;display:flex;align-items:center;gap:10px;box-shadow:var(--shadow-lg);pointer-events:all;max-width:320px;border:1.5px solid;animation:fadeInUp 0.35s cubic-bezier(0.16,1,0.3,1) both;background:var(--card);transition:opacity 0.3s,transform 0.3s;}
.toast.success{border-color:var(--success);color:var(--success);}
.toast.error{border-color:var(--error);color:var(--error);}
.toast.info{border-color:var(--primary);color:var(--primary);}

.feat-card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:24px;transition:all 0.3s;box-shadow:var(--shadow-sm);position:relative;overflow:hidden;}
.feat-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--primary),var(--success));opacity:0;transition:opacity 0.3s;}
.feat-card:hover{transform:translateY(-4px);box-shadow:var(--shadow);border-color:var(--primary);}
.feat-card:hover::before{opacity:1;}
.feat-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:14px;background:var(--primary-light);color:var(--primary);transition:all 0.3s;}
.feat-card:hover .feat-icon{background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;}

.faq-item{background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;transition:all 0.3s;}
.faq-item:hover{border-color:var(--primary);}
.faq-btn{width:100%;display:flex;align-items:center;justify-content:space-between;padding:18px 20px;text-align:left;background:transparent;border:none;font-family:'Inter',sans-serif;font-weight:600;color:var(--fg);transition:all 0.2s;cursor:pointer;}
.faq-btn:hover{background:var(--primary-light);}
.faq-body{max-height:0;overflow:hidden;transition:max-height 0.35s ease,padding 0.35s ease;padding:0 20px;}
.faq-body.open{max-height:600px;padding:0 20px 18px;}
.faq-icon{transition:transform 0.3s;flex-shrink:0;color:var(--muted);}
.faq-icon.open{transform:rotate(180deg);color:var(--primary);}

.badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:999px;font-size:11.5px;font-weight:600;background:var(--primary-light);color:var(--primary);border:1px solid rgba(14,165,233,0.2);}
.status-dot{display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--success);margin-right:4px;animation:pulse 2s infinite;}

.server-card{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:var(--radius-sm);border:1.5px solid var(--border);background:var(--bg);transition:all 0.2s;cursor:pointer;}
.server-card:hover,.server-card.active{border-color:var(--primary);background:var(--primary-light);}
.server-flag{width:32px;height:24px;border-radius:4px;background:linear-gradient(135deg,#cbd5e1,#94a3b8);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:10px;color:white;flex-shrink:0;}
.server-ping{font-size:13px;font-weight:600;color:var(--success);background:rgba(16,185,129,0.1);padding:2px 8px;border-radius:999px;}

.history-table{width:100%;border-collapse:collapse;font-size:14px;}
.history-table th{text-align:left;padding:12px 16px;font-weight:600;color:var(--muted);border-bottom:1px solid var(--border);font-size:12px;text-transform:uppercase;letter-spacing:0.05em;}
.history-table td{padding:14px 16px;border-bottom:1px solid var(--border);}
.history-table tr:last-child td{border-bottom:none;}
.history-table tr:hover{background:var(--primary-light);}
.speed-value{font-weight:700;font-family:'Space Grotesk','Inter',sans-serif;background:linear-gradient(135deg,var(--primary),var(--primary-dark));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.ping-good{color:var(--success);font-weight:600;}
.ping-ok{color:var(--warning);font-weight:600;}
.ping-poor{color:var(--error);font-weight:600;}

.test-tabs{display:flex;gap:4px;background:var(--bg);border-radius:var(--radius-sm);padding:4px;margin-bottom:24px;}
.test-tab{flex:1;padding:8px 10px;border-radius:8px;font-size:13px;font-weight:500;text-align:center;cursor:pointer;transition:all 0.2s;color:var(--muted);border:none;background:transparent;font-family:'Inter',sans-serif;}
.test-tab.active{background:var(--card);color:var(--fg);font-weight:600;box-shadow:var(--shadow-sm);}
.test-tab:hover:not(.active){color:var(--fg);background:rgba(148,163,184,0.1);}

.result-card{text-align:center;padding:16px;border-radius:var(--radius-sm);background:var(--bg);border:1px solid var(--border);}
.result-value{font-family:'Space Grotesk','Inter',sans-serif;font-weight:800;font-size:1.75rem;margin:4px 0;background:linear-gradient(135deg,var(--primary),var(--primary-dark));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;}
.result-label{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:0.05em;font-weight:600;}

.share-btn{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:var(--bg);border:1px solid var(--border);color:var(--fg);transition:all 0.2s;cursor:pointer;}
.share-btn:hover{background:var(--primary);color:white;border-color:var(--primary);transform:translateY(-2px);}

.flex{display:flex;}.items-center{align-items:center;}.justify-between{justify-content:space-between;}.gap-3{gap:12px;}.gap-2{gap:8px;}.gap-1{gap:4px;}
.grid{display:grid;}.space-y-3>*+*{margin-top:12px;}.space-y-4>*+*{margin-top:16px;}.mb-2{margin-bottom:8px;}.mb-4{margin-bottom:16px;}.mb-6{margin-bottom:24px;}.mb-8{margin-bottom:32px;}.mb-10{margin-bottom:40px;}.mb-12{margin-bottom:48px;}.mb-16{margin-bottom:64px;}.mt-0\.5{margin-top:2px;}.p-4{padding:16px;}.p-5{padding:20px;}.p-6{padding:24px;}.pt-2{padding-top:8px;}.px-4{padding-left:16px;padding-right:16px;}.py-2{padding-top:8px;padding-bottom:8px;}.py-8{padding-top:32px;padding-bottom:32px;}.overflow-x-hidden{overflow-x:hidden;}.overflow-x-auto{overflow-x:auto;}.overflow-hidden{overflow:hidden;}.w-full{width:100%;}.h-2\.5{height:10px;}.rounded-full{border-radius:9999px;}.rounded-xl{border-radius:12px;}.text-center{text-align:center;}.text-xs{font-size:12px;}.text-sm{font-size:14px;}.text-base{font-size:16px;}.text-lg{font-size:18px;}.font-medium{font-weight:500;}.font-semibold{font-weight:600;}.font-bold{font-weight:700;}.font-extrabold{font-weight:800;}.uppercase{text-transform:uppercase;}.tracking-wider{letter-spacing:0.05em;}.leading-tight{line-height:1.25;}.leading-relaxed{line-height:1.625;}.inline-flex{display:inline-flex;}.flex-1{flex:1;}.flex-shrink-0{flex-shrink:0;}.min-w-0{min-width:0;}.max-w-2xl{max-width:672px;}.max-w-3xl{max-width:768px;}.max-w-6xl{max-width:1152px;}.mx-auto{margin-left:auto;margin-right:auto;}.w-5{width:20px;}.h-5{height:20px;}.w-9{width:36px;}.h-9{height:36px;}.rounded-xl{border-radius:12px;}.space-y-3>*+*{margin-top:12px;}.space-y-4>*+*{margin-top:16px;}.border-t{border-top:1px solid var(--border);}.border{border:1px solid var(--border);}

::-webkit-scrollbar{width:8px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
::-webkit-scrollbar-thumb:hover{background:var(--muted);}

@media(min-width:640px){
  .sm\\:grid-cols-2{grid-template-columns:repeat(2,1fr);}
  .sm\\:text-3xl{font-size:1.875rem;}
  .sm\\:text-4xl{font-size:2.25rem;}
  .sm\\:text-lg{font-size:1.125rem;}
  .sm\\:p-8{padding:32px;}
  .sm\\:col-span-2{grid-column:span 2;}
}
@media(min-width:1024px){
  .lg\\:grid-cols-3{grid-template-columns:repeat(3,1fr);}
  .lg\\:grid-cols-4{grid-template-columns:repeat(4,1fr);}
  .lg\\:col-span-2{grid-column:span 2;}
  .lg\\:text-5xl{font-size:3rem;}
  .py-8{padding-top:32px;padding-bottom:32px;}
  .md\\:py-12{padding-top:48px;padding-bottom:48px;}
}
@media(max-width:768px){
  .speed-gauge{width:240px;height:240px;}
  .gauge-value{font-size:1.8rem;}
  .btn{width:100%;justify-content:center;}
  .test-tab{font-size:11px;padding:6px 6px;}
}

.seo-faq{max-width:880px;margin:32px auto 0;background:var(--card);border:1px solid var(--border);border-radius:var(--radius);padding:36px 32px;box-shadow:var(--shadow-sm);}
.seo-faq h2{font-family:'Space Grotesk','Inter',sans-serif;font-size:26px;font-weight:800;color:var(--fg);margin-bottom:6px;}
.seo-faq .lede{color:var(--muted);font-size:14px;margin-bottom:18px;}
.seo-faq-list{display:flex;flex-direction:column;gap:8px;}
.seo-faq-item{border:1px solid var(--border);border-radius:8px;overflow:hidden;background:var(--bg);}
.seo-faq-q{width:100%;text-align:left;padding:14px 18px;background:transparent;border:none;cursor:pointer;color:var(--fg);font-family:'Inter',sans-serif;font-size:14px;font-weight:600;display:flex;justify-content:space-between;align-items:center;}
.seo-faq-q::after{content:'+';color:var(--primary);font-size:18px;transition:transform .2s;}
.seo-faq-item.open .seo-faq-q::after{transform:rotate(45deg);}
.seo-faq-a{max-height:0;overflow:hidden;transition:max-height .25s ease,padding .25s ease;padding:0 18px;color:var(--muted);font-size:13.5px;line-height:1.7;}
.seo-faq-item.open .seo-faq-a{max-height:600px;padding:0 18px 14px;}
@media(max-width:640px){.seo-faq{padding:24px 18px;}}
      ` }} />

      <div id="cur" aria-hidden="true" />
      <div id="cur-r" aria-hidden="true" />
      <div id="toastRoot" role="status" aria-live="polite" />



      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12" role="main">
        {/* HERO */}
        <section className="text-center mb-12 anim-in" aria-labelledby="hero-heading">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'var(--primary-light)', color: 'var(--primary)', border: '1px solid rgba(14,165,233,0.3)', marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/></svg>
            Free · Accurate · Private · No Sign-Up
          </div>
          <h2 id="hero-heading" className="font-extrabold leading-tight mb-4"
            style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontSize: 'clamp(1.75rem,5vw,3rem)', color: 'var(--fg)', marginBottom: 16 }}>
            Test Your Internet Speed
            <span style={{ background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}> Instantly</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)', fontSize: 17, maxWidth: 600, margin: '0 auto' }}>
            Accurately measures your real download speed, upload speed, ping, and jitter — directly in your browser.
            The tool waits for a stable connection before timing begins, so results reflect your true throughput.
          </p>
        </section>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-3 items-start mb-16" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 24, marginBottom: 64 }}>
          {/* TEST CARD */}
          <div className="lg:col-span-2 anim-in d1" style={{ gridColumn: 'span 2' }}>
            <div className="main-card p-6 sm:p-8">
              {/* SERVER SELECTION */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-lg" style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", color: 'var(--fg)', fontSize: 18 }}>Select Test Server</h2>
                  <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>All route via Cloudflare CDN</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
                  <div className="server-card active" role="button" tabIndex={0} data-server="Cloudflare CDN (Global)" data-ping="12">
                    <div className="server-flag">CF</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>Cloudflare CDN</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>Nearest Edge — Global</div>
                    </div>
                    <div className="server-ping">Auto</div>
                  </div>
                  <div className="server-card" role="button" tabIndex={0} data-server="Cloudflare CDN (US East)" data-ping="20">
                    <div className="server-flag">US</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>US East Coast</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>Cloudflare Edge</div>
                    </div>
                    <div className="server-ping">~20 ms</div>
                  </div>
                  <div className="server-card" role="button" tabIndex={0} data-server="Cloudflare CDN (Europe)" data-ping="35">
                    <div className="server-flag">EU</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>Europe</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>Cloudflare Edge</div>
                    </div>
                    <div className="server-ping">~35 ms</div>
                  </div>
                  <div className="server-card" role="button" tabIndex={0} data-server="Cloudflare CDN (Asia)" data-ping="80">
                    <div className="server-flag">AS</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm" style={{ color: 'var(--fg)' }}>Asia Pacific</div>
                      <div className="text-xs" style={{ color: 'var(--muted)' }}>Cloudflare Edge</div>
                    </div>
                    <div className="server-ping">~80 ms</div>
                  </div>
                </div>
              </div>

              {/* GAUGE */}
              <div className="flex flex-col items-center mb-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 32 }}>
                <div className="speed-gauge mb-6" style={{ marginBottom: 24 }}>
                  <svg className="gauge-svg" viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path id="gaugeTrack"
                      d="M 62.2 217.8 A 110 110 0 1 1 217.8 217.8"
                      fill="none" strokeWidth="14" strokeLinecap="round"
                      style={{ stroke: 'var(--border)' }} />
                    <path id="gaugeArc"
                      d="M 62.2 217.8 A 110 110 0 1 1 217.8 217.8"
                      fill="none" strokeWidth="14" strokeLinecap="round"
                      stroke="url(#gaugeGradient)"
                      style={{ strokeDasharray: '0 999', transition: 'stroke-dasharray 0.4s ease-out' }} />
                    <circle id="gaugeNeedleDot" cx="62.2" cy="217.8" r="8" fill="var(--primary)"
                      style={{ transformOrigin: '140px 140px', transform: 'rotate(0deg)', transition: 'transform 0.4s ease-out' }} />
                    <defs>
                      <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="50%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="gauge-center">
                    <div className="gauge-value" id="gaugeValue" aria-live="polite"> , </div>
                    <div className="gauge-label" id="gaugeLabel">Ready</div>
                  </div>
                </div>

                {/* TABS */}
                <div className="test-tabs" style={{ width: '100%', maxWidth: 340 }}>
                  <button className="test-tab active" data-test="full" aria-pressed="true">Full Test</button>
                  <button className="test-tab" data-test="download" aria-pressed="false">Download</button>
                  <button className="test-tab" data-test="upload" aria-pressed="false">Upload</button>
                  <button className="test-tab" data-test="ping" aria-pressed="false">Ping</button>
                </div>

                {/* START BUTTON */}
                <button id="startTestBtn" className="btn btn-primary pulse-glow" style={{ fontSize: 18, padding: '16px 40px', marginBottom: 16 }} aria-label="Start Speed Test">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  <span id="startBtnText">START TEST</span>
                </button>

                <p style={{ fontSize: 13, color: 'var(--muted)' }}>
                  Press <kbd style={{ background: 'var(--border)', padding: '1px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}>Space</kbd> to start · <kbd style={{ background: 'var(--border)', padding: '1px 6px', borderRadius: 4, fontSize: 12, fontFamily: 'monospace' }}>Esc</kbd> to cancel
                </p>
              </div>

              {/* PROGRESS */}
              <div id="progressSection" className="hidden mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--muted)' }} id="progressLabel">Initializing…</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--primary)' }} id="progressPercent">0%</span>
                </div>
                <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ background: 'var(--border)', borderRadius: 9999, height: 10, overflow: 'hidden' }}>
                  <div id="progressBar" style={{ width: '0%', height: '100%', borderRadius: 9999, background: 'linear-gradient(90deg,#0ea5e9,#38bdf8)', transition: 'width 0.3s ease' }} role="progressbar" aria-valuenow={0} aria-valuemin={0} aria-valuemax={100} />
                </div>
              </div>

              {/* STATUS BOX */}
              <div id="statusBox" style={{ padding: 16, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg)', marginBottom: 24 }}>
                <div className="flex items-center gap-3">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--muted)', flexShrink: 0 }} aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  <span style={{ color: 'var(--muted)' }}>Select a server and click START TEST to measure your real internet speed.</span>
                </div>
              </div>

              {/* RESULTS */}
              <div id="resultsSection" className="hidden">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
                  <div className="result-card">
                    <div className="result-label">Download</div>
                    <div className="result-value" id="downloadResult" aria-live="polite"> , </div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>Mbps</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Upload</div>
                    <div className="result-value" id="uploadResult" aria-live="polite"> , </div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>Mbps</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Ping</div>
                    <div className="result-value" id="pingResult" aria-live="polite"> , </div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>ms</div>
                  </div>
                  <div className="result-card">
                    <div className="result-label">Jitter</div>
                    <div className="result-value" id="jitterResult" aria-live="polite"> , </div>
                    <div className="text-xs" style={{ color: 'var(--muted)' }}>ms</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-3 mb-6" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 24 }}>
                  <span className="text-sm font-medium" style={{ color: 'var(--muted)' }}>Share your results:</span>
                  <button className="share-btn" id="copyBtn" aria-label="Copy results to clipboard">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  </button>
                  <button className="share-btn" id="twitterBtn" aria-label="Share results on Twitter">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
                  </button>
                </div>

                <div className="text-center">
                  <button id="testAgainBtn" className="btn btn-secondary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 12a9 9 0 109-9M3 3v6h6"/></svg>
                    Test Again
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-4 anim-in d2" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="main-card p-5">
              <h2 className="font-bold text-base mb-4" style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", color: 'var(--fg)', marginBottom: 16 }}>Get Accurate Results</h2>
              <ul className="space-y-3 text-sm" style={{ color: 'var(--muted)', listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                {['Close other browser tabs and downloads', 'Use Ethernet for the most accurate reading', 'Run multiple tests at different times of day', 'Restart your router if speeds seem unusually low'].map((tip, i) => (
                  <li key={i} style={{ display: 'flex', gap: 12 }}>
                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 700, color: 'white' }}>{i + 1}</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="main-card p-5">
              <h2 className="font-bold text-base mb-4" style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", color: 'var(--fg)', marginBottom: 16 }}>Speed Reference</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  { label: 'Basic Browsing', range: '5–10 Mbps', pct: '15%', color: 'var(--success)' },
                  { label: 'HD Streaming', range: '25+ Mbps', pct: '40%', color: 'var(--primary)' },
                  { label: '4K / Gaming', range: '50–100+ Mbps', pct: '70%', color: 'var(--warning)' },
                  { label: 'Fiber / Pro', range: '200–1000 Mbps', pct: '100%', color: 'var(--primary-dark)' },
                ].map(({ label, range, pct, color }) => (
                  <div key={label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: 'var(--fg)', fontWeight: 500 }}>{label}</span>
                      <span style={{ color, fontWeight: 600 }}>{range}</span>
                    </div>
                    <div style={{ background: 'var(--border)', borderRadius: 9999, height: 6 }}>
                      <div style={{ width: pct, height: '100%', borderRadius: 9999, background: color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="main-card p-5" style={{ borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h2 className="font-bold text-sm" style={{ color: 'var(--fg)', fontSize: 14 }}>100% Private</h2>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.7 }}>
                We never log your IP address or personal data. Test history is stored only in your browser&apos;s localStorage — it never leaves your device.
              </p>
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <section id="features" className="mb-16 anim-in d3" aria-labelledby="features-heading">
          <div className="text-center mb-10" style={{ textAlign: 'center', marginBottom: 40 }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)', fontSize: 12 }}>Why Use This Tool</p>
            <h2 id="features-heading" style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,1.875rem)', color: 'var(--fg)' }}>
              Real Measurements, Not Estimates
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 20 }}>
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>, title: 'Real Throughput Measurement', desc: 'Downloads a 10 MB payload from Cloudflare\'s CDN and measures actual bytes transferred per second — no simulated numbers.' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>, title: 'Stabilization Phase', desc: 'A brief wait before timing ensures TCP slow-start completes and your reading reflects steady-state throughput.' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>, title: 'Ping & Jitter Analysis', desc: 'Takes 5 latency samples and computes average ping and standard deviation jitter for a statistically meaningful result.' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>, title: 'Private by Design', desc: 'No server-side logging. History stays in your browser. No account required — ever.' },
            ].map(({ icon, title, desc }) => (
              <article key={title} className="feat-card">
                <div className="feat-icon" aria-hidden="true">{icon}</div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--fg)', fontWeight: 700, marginBottom: 8 }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.625 }}>{desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" style={{ maxWidth: 768, margin: '0 auto 64px' }} className="anim-in d4" aria-labelledby="faq-heading">
          <div className="text-center mb-10" style={{ textAlign: 'center', marginBottom: 40 }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)', fontSize: 12 }}>Help &amp; Support</p>
            <h2 id="faq-heading" style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,1.875rem)', color: 'var(--fg)' }}>
              Frequently Asked Questions
            </h2>
          </div>
          <div id="faqList" style={{ display: 'flex', flexDirection: 'column', gap: 12 }} />
        </section>

        {/* HISTORY */}
        <section id="history" className="mb-16 anim-in d3" aria-labelledby="history-heading">
          <div className="text-center mb-8" style={{ textAlign: 'center', marginBottom: 32 }}>
            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--muted)', fontSize: 12 }}>Your Results</p>
            <h2 id="history-heading" style={{ fontFamily: "'Space Grotesk','Inter',sans-serif", fontWeight: 800, fontSize: 'clamp(1.4rem,3vw,1.875rem)', color: 'var(--fg)' }}>
              Test History
            </h2>
          </div>
          <div className="main-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="history-table" aria-label="Speed test history">
                <thead>
                  <tr>
                    <th scope="col">Date &amp; Time</th>
                    <th scope="col">Download</th>
                    <th scope="col">Upload</th>
                    <th scope="col">Ping</th>
                    <th scope="col">Server</th>
                  </tr>
                </thead>
                <tbody id="historyTableBody">
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>No history yet. Run a test to see results here.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ padding: 16, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <button id="clearHistoryBtn" className="btn btn-secondary text-sm" style={{ fontSize: 14 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Clear History
              </button>
            </div>
          </div>
        </section>

        {/* SPEED TEST SPECIFIC SEO FAQ */}
        <section className="seo-faq" id="seo-faq" aria-labelledby="seo-faq-heading">
          <h2 id="seo-faq-heading">Common Questions About Internet Speed</h2>
          <p className="lede">Everything you need to know about interpreting your speed test results and improving your connection.</p>
          <div className="seo-faq-list">
            {[
              { q: 'What is download speed and what affects it?', a: 'Download speed is how fast data travels from the internet to your device, measured in Mbps. It is affected by your ISP plan tier, router hardware, distance from the router, Wi-Fi band (2.4 GHz vs 5 GHz), network congestion during peak hours, and the number of active devices sharing your connection.' },
              { q: 'Why is my upload speed so much lower than my download speed?', a: 'Most residential broadband plans are asymmetric — ISPs allocate more bandwidth for downloads because typical household usage (streaming, browsing) is download-heavy. Symmetric speeds (equal download and upload) are common on fiber and business plans.' },
              { q: 'What is a good ping for gaming and video calls?', a: 'Under 20 ms is excellent for competitive gaming. Under 50 ms is comfortable for casual gaming and video calls. 50–100 ms is acceptable for most uses. Over 150 ms causes noticeable lag in real-time applications.' },
              { q: 'My speed test shows 200 Mbps but streaming still buffers — why?', a: 'Buffering is often caused by: the streaming server being overloaded, a congested path between you and the CDN, in-home Wi-Fi interference, or a device with limited processing. High speed test results measure your ISP link, not the full path to every service.' },
              { q: 'How often should I run a speed test?', a: 'Run tests at different times of day — morning, evening peak hours, and late night — over several days. Evening results are often lower due to neighbourhood congestion. Averaging 5–10 readings gives you a reliable baseline to compare against your ISP\'s advertised speed.' },
              { q: 'Does using Wi-Fi instead of Ethernet affect my speed?', a: 'Yes, significantly. Ethernet provides a direct, interference-free connection and typically delivers 10–30% faster speeds with lower latency and jitter than Wi-Fi. For accurate ISP speed testing, connect via Ethernet to bypass any Wi-Fi overhead.' },
              { q: 'What causes high jitter and how can I fix it?', a: 'High jitter is typically caused by Wi-Fi interference, a congested network link, an ageing router, or ISP throttling. Fixes include: switching to Ethernet, rebooting your router, upgrading to a Wi-Fi 6 router, or contacting your ISP if jitter persists on a wired connection.' },
              { q: 'Can a VPN slow down my internet speed?', a: 'Yes. A VPN adds encryption overhead and routes your traffic through an additional server, which can reduce speed by 5–30% depending on the VPN protocol, server distance, and server load. Test with and without the VPN to measure its impact on your connection.' },
            ].map(({ q, a }) => (
              <div key={q} className="seo-faq-item">
                <button className="seo-faq-q" aria-expanded="false">{q}</button>
                <div className="seo-faq-a"><p>{a}</p></div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}