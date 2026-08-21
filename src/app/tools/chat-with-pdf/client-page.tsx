"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  FileText, Upload, Send, RotateCcw, Bot, User,
  Copy, Check, Sparkles, BookOpen, Zap, Shield,
  Clock, Hash, ChevronDown, ChevronUp, Star,
  ArrowRight, Layers, Search, Globe, Lock, Brain,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  ts: number;
}

interface PdfStats {
  name: string;
  pages: number;
  chars: number;
  words: number;
}

const MAX_QUESTIONS = 15;

const SUGGESTED: string[][] = [
  ["Summarize this document in 3 bullet points", "What are the key takeaways?", "List all main topics covered"],
  ["What conclusions does this document reach?", "Are there any action items mentioned?", "What data or statistics are cited?"],
  ["Explain the most complex part simply", "What is the author's main argument?", "What problems does this document address?"],
];

const USECASES = [
  { icon: BookOpen, label: "Research Papers", desc: "Extract insights from academic PDFs instantly" },
  { icon: FileText, label: "Contracts & Legal", desc: "Understand clauses and obligations fast" },
  { icon: Layers, label: "Reports & Manuals", desc: "Navigate long documents without reading all" },
  { icon: Search, label: "Study & Exams", desc: "Quiz yourself on any textbook or notes PDF" },
  { icon: Globe, label: "Foreign Language Docs", desc: "Ask in English, get answers from any language PDF" },
  { icon: Zap, label: "Meeting Notes", desc: "Pull decisions and action items in seconds" },
];

const FAQS = [
  {
    q: "Is my PDF stored on your servers?",
    a: "No. Text extraction happens entirely in your browser using PDF.js. Your file never leaves your device. Only the extracted text and your question are sent to the AI model — and nothing is stored.",
  },
  {
    q: "What types of PDFs work best?",
    a: "Text-based PDFs work perfectly — research papers, contracts, e-books, reports, slides exported as PDF. Scanned documents or image-only PDFs cannot be read since there is no embedded text to extract.",
  },
  {
    q: "How accurate are the answers?",
    a: "The AI answers strictly from the content of your PDF. It will not hallucinate external facts. If the answer isn't in the document, it will tell you so. Accuracy is highest on clear, well-structured text.",
  },
  {
    q: "Is there a file size limit?",
    a: "There is no hard file size limit for upload. However, the AI context window is capped at 80,000 characters of extracted text. Very large PDFs are automatically truncated to that limit.",
  },
  {
    q: "Do I need to create an account?",
    a: "No account, no sign-up, no credit card. This tool is completely free to use. Just upload a PDF and start asking questions immediately.",
  },
  {
    q: "Can I use this for multiple PDFs?",
    a: "Yes — use the 'New PDF' button to clear the current document and upload a fresh one. Each session is isolated and starts with a clean chat history.",
  },
];

const KEYWORDS_SECTION = [
  "AI PDF reader", "chat with PDF", "PDF question answering", "ask PDF questions",
  "PDF AI chatbot", "PDF summarizer", "document AI", "PDF analyzer",
  "read PDF with AI", "PDF text extractor", "AI document assistant",
  "free PDF chat", "PDF to chat", "AI for documents",
];

function wordCount(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 60000) return "just now";
  return `${Math.floor(diff / 60000)}m ago`;
}

const THINKING_LABELS = [
  "Reading your PDF…",
  "Analyzing content…",
  "Generating answer…",
  "Almost there…",
]

function ThinkingIndicator() {
  const [labelIdx, setLabelIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setLabelIdx((i) => (i + 1) % THINKING_LABELS.length), 1800)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 border-2 dark:border-white dark:border-white border-black">
      {/* Pulsing brain icon */}
      <div className="relative flex-shrink-0">
        <div
          className="absolute inset-0 rounded-full bg-black opacity-20"
          style={{ animation: "pulse-ring 1.2s ease-out infinite" }}
        />
        <div className="w-7 h-7 bg-black flex items-center justify-center relative z-10">
          <Brain className="w-3.5 h-3.5 text-white" style={{ animation: "shimmer 1.4s ease infinite" }} />
        </div>
      </div>
      {/* Wave bars */}
      <div className="flex items-end gap-0.5 h-5">
        {[0, 0.15, 0.3, 0.45, 0.6, 0.45, 0.3, 0.15].map((delay, i) => (
          <div
            key={i}
            className="wave-bar w-1 bg-black rounded-full"
            style={{
              height: `${10 + (i % 3) * 5}px`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>
      {/* Cycling label */}
      <span className="thinking-text font-code text-[11px] uppercase tracking-widest dark:text-white text-black">
        {THINKING_LABELS[labelIdx]}
      </span>
    </div>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2 text-gray-400 hover:text-black"
      title="Copy answer"
    >
      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-semibold dark:text-white text-black leading-snug">{q}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        )}
      </button>
      {open && (
        <p className="text-sm dark:text-white text-black leading-relaxed pb-4">{a}</p>
      )}
    </div>
  );
}

export default function ChatWithPdfClient() {
  // Unique session ID per browser tab — generated once, never stored, never shared
  const [sessionId] = useState<string>(() =>
    typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2)
  );
  const [pdfText, setPdfText] = useState("");
  const [pdfStats, setPdfStats] = useState<PdfStats | null>(null);
  const [noText, setNoText] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [questionCount, setQuestionCount] = useState(0);
  const [streaming, setStreaming] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [suggestIdx, setSuggestIdx] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    const t = setInterval(() => setSuggestIdx((i) => (i + 1) % SUGGESTED.length), 4000);
    return () => clearInterval(t);
  }, []);

  const extractPdf = async (file: File) => {
    setUploading(true);
    setNoText(false);
    setPdfText("");
    setPdfStats(null);
    setMessages([]);
    setQuestionCount(0);
    setUploadProgress(0);

    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const numPages = pdf.numPages;

      let fullText = "";
      for (let i = 1; i <= numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => ("str" in item ? item.str : ""))
          .join(" ");
        fullText += pageText + "\n";
        setUploadProgress(Math.round((i / numPages) * 100));
      }

      const stats: PdfStats = {
        name: file.name,
        pages: numPages,
        chars: fullText.length,
        words: wordCount(fullText),
      };

      if (fullText.trim().length === 0) {
        setNoText(true);
        setPdfStats(stats);
      } else {
        setPdfText(fullText);
        setPdfStats(stats);
      }
    } catch (e) {
      console.error(e);
      setNoText(true);
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") extractPdf(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") extractPdf(file);
  };

  const sendMessage = async (q?: string) => {
    const question = (q ?? input).trim();
    if (!question || !pdfText || streaming || questionCount >= MAX_QUESTIONS) return;

    setInput("");
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [...prev, { role: "user", content: question, ts: Date.now() }]);
    setQuestionCount((c) => c + 1);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, pdfText, history, sessionId }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";
      const ts = Date.now();

      setMessages((prev) => [...prev, { role: "assistant", content: "", ts }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantMsg += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: assistantMsg, ts };
          return updated;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again.", ts: Date.now() },
      ]);
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const reset = () => {
    setPdfText("");
    setPdfStats(null);
    setNoText(false);
    setMessages([]);
    setQuestionCount(0);
    setInput("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const remaining = MAX_QUESTIONS - questionCount;
  const progressPct = Math.min(100, Math.round((questionCount / MAX_QUESTIONS) * 100));
  const hasPdf = !!pdfText && !noText;

  return (
    <div className="min-h-screen dark:bg-black dark:text-white bg-white text-black selection:bg-black selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'DM Serif Display', Georgia, serif; }
        .font-code { font-family: 'DM Mono', 'Courier New', monospace; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes shimmer { 0%,100%{opacity:0.3} 50%{opacity:1} }
        @keyframes wave { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
        @keyframes pulse-ring { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(1.6);opacity:0} }
        @keyframes thinking-text { 0%,100%{opacity:0.4} 50%{opacity:1} }
        .fade-up { animation: fadeUp 0.4s ease both; }
        .shimmer { animation: shimmer 1.4s ease infinite; }
        .msg-enter { animation: fadeUp 0.25s ease both; }
        .progress-bar { transition: width 0.35s ease; }
        .wave-bar { animation: wave 1s ease-in-out infinite; }
        .thinking-text { animation: thinking-text 1.8s ease infinite; }
      `}</style>


      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* HERO UPLOAD */}
        {!hasPdf && !uploading && !noText && (
          <div className="fade-up">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 border dark:border-white dark:border-white border-black px-3 py-1 font-code text-[10px] uppercase tracking-widest mb-5">
                <Sparkles className="w-3 h-3" />
                Free · No account · No file size limit
              </div>
              <p className="font-display text-4xl sm:text-6xl leading-[1.05] mb-4">
                Chat with any PDF.<br />
                <em>Get answers instantly.</em>
              </p>
              <p className="font-code text-sm sm:text-base dark:text-white text-black max-w-xl mx-auto leading-relaxed">
                Upload a PDF and ask questions in plain English — research papers, contracts, reports, textbooks, manuals. Powered by AI.
              </p>
            </div>

            {/* Upload zone */}
            <div
              className={`border-2 border-dashed dark:border-white dark:border-white border-black cursor-pointer transition-all mb-8 ${isDragging ? "bg-gray-50 scale-[1.01]" : "hover:bg-gray-50"}`}
              onDrop={handleDrop}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={() => fileRef.current?.click()}
            >
              <input ref={fileRef} type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
              <div className="flex flex-col items-center justify-center py-14 px-6 text-center gap-5">
                <div className={`w-20 h-20 border-2 dark:border-white dark:border-white border-black flex items-center justify-center transition-transform ${isDragging ? "scale-110" : ""}`}>
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-display text-2xl mb-1">Drop your PDF here</p>
                  <p className="font-code text-xs text-gray-400 uppercase tracking-widest">
                    or click to browse — any PDF, any size
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-3 w-full max-w-sm mt-1">
                  {[
                    { icon: Zap, label: "Instant answers" },
                    { icon: Shield, label: "100% private" },
                    { icon: Star, label: "Completely free" },
                  ].map(({ icon: Icon, label }) => (
                    <div key={label} className="border border-gray-200 py-3 flex flex-col items-center gap-1.5">
                      <Icon className="w-4 h-4" />
                      <span className="font-code text-[10px] uppercase tracking-widest dark:text-white text-black">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Suggested prompts */}
            <div className="mb-12">
              <p className="font-code text-[10px] uppercase tracking-widest dark:text-white text-black mb-3 text-center">
                Example questions you can ask after uploading
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {SUGGESTED[suggestIdx].map((s) => (
                  <div key={s} className="border border-gray-100 px-4 py-3 font-code text-xs dark:text-white text-black flex items-start gap-2 transition-all">
                    <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 dark:text-white text-black" />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* UPLOADING */}
        {uploading && (
          <div className="border-2 dark:border-white dark:border-white border-black py-16 flex flex-col items-center gap-5 fade-up">
            <div className="w-14 h-14 border-2 dark:border-white dark:border-white border-black flex items-center justify-center">
              <FileText className="w-6 h-6 shimmer" />
            </div>
            <div className="w-full max-w-xs">
              <div className="flex justify-between font-code text-[10px] uppercase tracking-widest text-gray-400 mb-2">
                <span>Extracting text locally</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-1 bg-gray-100 w-full">
                <div className="h-1 bg-black progress-bar" style={{ width: `${uploadProgress}%` }} />
              </div>
            </div>
            <p className="font-code text-xs text-gray-400">Processing pages in your browser — nothing uploaded</p>
          </div>
        )}

        {/* NO TEXT FALLBACK */}
        {noText && (
          <div className="border-2 dark:border-white dark:border-white border-black p-10 text-center fade-up">
            <div className="w-14 h-14 border-2 dark:border-white dark:border-white border-black flex items-center justify-center mx-auto mb-5">
              <FileText className="w-6 h-6 dark:text-white text-black" />
            </div>
            <p className="font-display text-2xl mb-2">No readable text found</p>
            <p className="font-code text-xs dark:text-white text-black leading-relaxed max-w-xs mx-auto mb-6">
              This PDF appears to be scanned or image-based. Only PDFs with embedded text can be processed. Try exporting from Word, Google Docs, or a native PDF source.
            </p>
            <button
              onClick={reset}
              className="font-code text-xs uppercase tracking-widest border-2 dark:border-white dark:border-white border-black px-5 py-2.5 hover:bg-black hover:text-white transition-colors"
            >
              Try another PDF
            </button>
          </div>
        )}

        {/* CHAT INTERFACE */}
        {hasPdf && pdfStats && (
          <div className="fade-up ">
            {/* Stats bar */}
            <div className="border-2 dark:border-white border-2 dark:border-white dark:border-white border-black bg-black text-white px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <FileText className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                <span className="font-code text-xs truncate max-w-[180px]" title={pdfStats.name}>
                  {pdfStats.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 dark:text-white text-black" />
                <span className="font-code text-xs dark:text-white text-black">{pdfStats.pages} {pdfStats.pages === 1 ? "page" : "pages"}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 dark:text-white text-black" />
                <span className="font-code text-xs dark:text-white text-black">{pdfStats.words.toLocaleString()} words</span>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <span className={`font-code text-[10px] uppercase tracking-widest ${remaining <= 3 ? "text-red-400" : "text-gray-400"}`}>
                  {remaining}/{MAX_QUESTIONS} questions left
                </span>
              </div>
            </div>

            {/* Session progress bar */}
            <div className="border-l-2 border-r-2 dark:border-white dark:border-white border-black h-1 bg-gray-900">
              <div className="h-1 bg-white progress-bar" style={{ width: `${100 - progressPct}%` }} />
            </div>

            {/* Chat scroll area */}
            <div className="border-2 dark:border-white dark:border-white border-black flex flex-col">
              <ScrollArea className="h-[460px] px-4 sm:px-6 py-5">
                {/* Empty state */}
                {messages.length === 0 && (
                  <div className="flex flex-col items-center gap-6 py-8">
                    <div className="text-center">
                      <div className="w-12 h-12 border border-gray-200 flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-5 h-5 dark:text-white text-black" />
                      </div>
                      <p className="font-display text-xl mb-1">Ready to answer your questions</p>
                      <p className="font-code text-xs text-gray-400">
                        {pdfStats.chars.toLocaleString()} characters extracted · Try a suggested question
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                      {SUGGESTED[suggestIdx].map((s) => (
                        <button
                          key={s}
                          onClick={() => sendMessage(s)}
                          className="border border-gray-200 hover:dark:border-white dark:border-white border-black hover:bg-gray-50 transition-all px-3 py-3 font-code text-xs text-left dark:text-white text-black hover:text-black flex items-start gap-2"
                        >
                          <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 dark:text-white text-black" />
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex flex-col gap-5">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`msg-enter flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                    >
                      <div className={`w-7 h-7 flex-shrink-0 flex items-center justify-center border-2 ${msg.role === "user" ? "bg-black dark:border-white dark:border-white border-black" : "bg-white dark:border-white dark:border-white border-black"}`}>
                        {msg.role === "user" ? <User className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-black" />}
                      </div>
                      <div className={`group flex flex-col gap-1 max-w-[82%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                        {msg.role === "assistant" && !msg.content ? (
                          <ThinkingIndicator />
                        ) : (
                          <div className={`relative px-4 py-3 border-2 font-code text-sm leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-black text-white dark:border-white dark:border-white border-black" : "bg-white text-black dark:border-white dark:border-white border-black"}`}>
                            {msg.content}
                            {msg.role === "assistant" && msg.content && <CopyButton text={msg.content} />}
                          </div>
                        )}
                        <span className="font-code text-[9px] dark:text-white text-black uppercase tracking-widest px-1">
                          {timeAgo(msg.ts)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>

              {/* Input bar */}
              <div className="border-t-2 dark:border-white dark:border-white border-black p-3 sm:p-4">
                {questionCount >= MAX_QUESTIONS ? (
                  <div className="text-center py-2">
                    <p className="font-code text-xs dark:text-white text-black mb-3">
                      Session limit of {MAX_QUESTIONS} questions reached.
                    </p>
                    <button
                      onClick={reset}
                      className="font-code text-xs uppercase tracking-widest border-2 dark:border-white dark:border-white border-black px-4 py-2 hover:bg-black hover:text-white transition-colors"
                    >
                      Upload new PDF & start over
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 items-end">
                      <Textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything about this PDF… (Enter to send, Shift+Enter for new line)"
                        rows={2}
                        className="flex-1 resize-none font-code text-sm border-2 dark:border-white dark:border-white border-black rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:dark:border-white dark:border-white border-black min-h-[52px] py-2.5"
                      />
                      <button
                        onClick={() => sendMessage()}
                        disabled={streaming || !input.trim()}
                        className="w-10 h-10 sm:w-12 sm:h-[52px] bg-black text-white flex items-center justify-center hover:bg-gray-800 disabled:opacity-25 transition-colors flex-shrink-0 border-2 dark:border-white dark:border-white border-black"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-2 px-0.5">
                      <span className="font-code text-[9px] dark:text-white text-black uppercase tracking-widest">
                        Shift+Enter for new line
                      </span>
                      {input.length > 0 && (
                        <span className="font-code text-[9px] text-gray-400">{input.length} chars</span>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* USE CASES */}
        <section className="mt-20" aria-label="Use cases for PDF AI chat tool">
          <div className="text-center mb-8">
            <p className="font-code text-[10px] uppercase tracking-widest text-gray-400 mb-2">Works for every document type</p>
            <h2 className="font-display text-3xl sm:text-4xl">What can you do with PDF Chat AI?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {USECASES.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="border-2 dark:border-white dark:border-white border-black p-5 hover:bg-black hover:text-white transition-colors group cursor-default">
                <Icon className="w-5 h-5 mb-3" />
                <p className="font-display text-xl mb-1">{label}</p>
                <p className="font-code text-xs dark:text-white text-black group-hover:dark:text-white text-black leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-20" aria-label="How to use AI PDF chat tool">
          <div className="text-center mb-10">
            <p className="font-code text-[10px] uppercase tracking-widest text-gray-400 mb-2">Simple 3-step process</p>
            <h2 className="font-display text-3xl sm:text-4xl">How it works</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 border-2 dark:border-white dark:border-white border-black">
            {[
              { n: "01", icon: Upload, title: "Upload your PDF", body: "Drag & drop or click to select. Research papers, contracts, textbooks, reports. Text extracted entirely in your browser — nothing stored." },
              { n: "02", icon: Search, title: "Ask your question", body: "Type any question in plain English. Summarize, extract facts, compare clauses, find key points. Ask follow-up questions naturally." },
              { n: "03", icon: Zap, title: "Get instant answers", body: "The AI reads your PDF and answers precisely. No hallucinations — only content from your document. Results stream in real time." },
            ].map(({ n, icon: Icon, title, body }, i) => (
              <div
                key={n}
                className={`p-7 ${i < 2 ? "sm:border-r-2 dark:border-white dark:border-white border-black" : ""} border-b-2 sm:border-b-0 dark:border-white dark:border-white border-black last:border-b-0`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="font-display text-4xl text-gray-100">{n}</span>
                  <Icon className="w-5 h-5" />
                </div>
                <p className="font-display text-xl mb-2">{title}</p>
                <p className="font-code text-xs dark:text-white text-black leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TRUST BADGES */}
        <section className="mt-16 border-2 dark:border-white dark:border-white border-black" aria-label="Trust signals">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x-0 sm:divide-x-2 divide-y-2 sm:divide-y-0 divide-black">
            {[
              { icon: Lock, label: "Private", sub: "Files never leave your browser" },
              { icon: Star, label: "100% Free", sub: "No subscription, ever" },
              { icon: Globe, label: "Any language", sub: "Ask in English, read any PDF" },
              { icon: Clock, label: "Instant", sub: "Answers stream in real time" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center p-5 gap-2">
                <Icon className="w-5 h-5" />
                <p className="font-display text-base">{label}</p>
                <p className="font-code text-[10px] text-gray-400 leading-tight">{sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-20" aria-label="Frequently asked questions">
          <div className="text-center mb-8">
            <p className="font-code text-[10px] uppercase tracking-widest text-gray-400 mb-2">Got questions?</p>
            <h2 className="font-display text-3xl sm:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="border-2 dark:border-white dark:border-white dark:border-white border-black px-6 py-2">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </section>

        {/* SEO CONTENT */}
        <section className="mt-20 border-t-2 dark:border-white dark:border-white border-black pt-12" aria-label="About this free AI PDF chat tool">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            <div>
              <h2 className="font-display text-2xl mb-4">The fastest way to read any PDF</h2>
              <p className="font-code text-sm dark:text-white text-black leading-relaxed mb-4">
                Our <strong>AI PDF chat tool</strong> lets you have a real conversation with your documents. Whether you need to <strong>summarize a research paper</strong>, <strong>extract key clauses from a contract</strong>, or <strong>quiz yourself on a textbook</strong>, this free tool handles it instantly — no account required.
              </p>
              <p className="font-code text-sm dark:text-white text-black leading-relaxed mb-4">
                Unlike other <strong>PDF reader AI</strong> tools that require sign-ups or paid plans, this is completely free. Text extraction happens locally in your browser using PDF.js — your document never touches our servers.
              </p>
              <p className="font-code text-sm dark:text-white text-black leading-relaxed">
                Powered by state-of-the-art large language models, this <strong>AI document assistant</strong> delivers accurate, grounded answers — it only uses content from your PDF, so you will never get hallucinated facts.
              </p>
            </div>
            <div>
              <h3 className="font-display text-2xl mb-4">Popular use cases</h3>
              <ul className="space-y-2.5">
                {[
                  "Summarize long research papers in seconds",
                  "Ask questions about legal contracts and terms",
                  "Extract key data from annual reports",
                  "Study from textbooks and lecture notes",
                  "Understand technical manuals quickly",
                  "Find specific information in large PDFs",
                  "Review meeting notes and extract action items",
                  "Translate concepts from foreign language PDFs",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 font-code text-sm dark:text-white text-black">
                    <ArrowRight className="w-3 h-3 mt-1 flex-shrink-0 dark:text-white text-black" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* SEO keyword cloud */}
          <div className="mt-10 pt-8 border-t border-gray-100">
            <p className="font-code text-[10px] uppercase tracking-widest dark:text-white text-black mb-3">Related searches</p>
            <div className="flex flex-wrap gap-2">
              {KEYWORDS_SECTION.map((kw) => (
                <span key={kw} className="border border-gray-100 px-3 py-1 font-code text-xs text-gray-400">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CTA */}
        {!hasPdf && (
          <div className="mt-16 border-2 dark:border-white dark:border-white border-black bg-black text-white text-center py-14 px-8">
            <h2 className="font-display text-3xl sm:text-4xl mb-3">Ready to chat with your PDF?</h2>
            <p className="font-code text-sm text-gray-400 mb-6">No account. No limit on file size. Completely free.</p>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 bg-white text-black font-code text-sm uppercase tracking-widest px-6 py-3 hover:bg-gray-100 transition-colors border-2 border-white"
            >
              <Upload className="w-4 h-4" />
              Upload PDF now
            </button>
          </div>
        )}

        <footer className="mt-12 pb-8 text-center font-code text-[10px] dark:text-white text-black uppercase tracking-widest">
          Free AI PDF Chat · No account required · Private by design
        </footer>
      </div>
    </div>
  );
}