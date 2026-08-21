"use client"

import React, { useMemo, useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Script from "next/script"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import {
  ChevronDown,
  Menu,
  Search,
  Wrench,
  X,
  ChevronRight,
  Sparkles,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "./theme-toggle"
import {
  getToolsByCategory,
  searchTools,
  toolCategories,
  toolCount,
} from "@/lib/tools/tools-config"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavbarProps {
  className?: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/tools", label: "Tools" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

// Schema.org SiteNavigationElement structured data for SEO
const NAV_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  name: "Main Navigation",
  hasPart: NAV_LINKS.map((link, i) => ({
    "@type": "SiteNavigationElement",
    position: i + 1,
    name: link.label,
    url: `https://www.thefreeaitools.com${link.href}`,
  })),
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SearchDropdown({
  results,
  query,
  onClose,
}: {
  results: ReturnType<typeof searchTools>
  query: string
  onClose: () => void
}) {
  if (query.trim().length <= 1) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 6, scale: 0.98 }}
      transition={{ duration: 0.15 }}
      className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-border/60 bg-popover/98 backdrop-blur-xl shadow-2xl shadow-black/8 overflow-hidden z-50"
      role="listbox"
      aria-label="Search results"
    >
       {results.length > 0 ? (
        <div className="max-h-[min(60vh,400px)] overflow-y-auto overscroll-contain">
          <div className="px-3 pt-2.5 pb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              {results.length} result{results.length !== 1 ? "s" : ""}
            </p>
          </div>
          {results.map((tool, idx) => (
            <Link
              key={tool.id}
              href={tool.path}
              prefetch={false}
              role="option"
              aria-selected={idx === 0}
              className="flex items-center gap-3 mx-2 mb-0.5 px-3 py-2.5 rounded-xl transition-colors hover:bg-accent focus:bg-accent focus:outline-none group"
              onClick={onClose}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted group-hover:bg-background transition-colors">
                <tool.icon className="h-4 w-4 text-muted-foreground" />
              </span>
              <span className="flex-1 min-w-0">
                <span className="block text-sm font-medium truncate">{tool.name}</span>
                <span className="block text-xs text-muted-foreground truncate mt-0.5">
                  {tool.description}
                </span>
              </span>
              {idx === 0 && (
                <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
                  ↵
                </kbd>
              )}
            </Link>
          ))}
          <div className="px-3 py-2 border-t border-border/40 mt-1">
            <Link
              href={`/search?q=${encodeURIComponent(query)}`}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClose}
            >
              See all results for &quot;{query}&quot;
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 px-4 py-10">
          <Search className="h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">
            No results for &quot;{query}&quot;
          </p>
          <p className="text-xs text-muted-foreground/60">
            Try a shorter or different term
          </p>
        </div>
      )}
    </motion.div>
  )
}

function MegaMenu() {
  return (
    <div
      className="invisible opacity-0 pointer-events-none translate-y-3
        group-hover:visible group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0
        transition-all duration-200 ease-out
        absolute left-1/2 -translate-x-1/2 top-full pt-4
        w-[min(calc(100vw-2rem),780px)]"
      role="menu"
      aria-label="Tool categories"
    >
      {/* Arrow */}
      <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-popover border-l border-t border-border/60 rounded-sm" />

      <div className="rounded-2xl border border-border/60 bg-popover/98 backdrop-blur-xl shadow-2xl shadow-black/8 p-4 overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1">
          {toolCategories.map((category) => {
            const CategoryIcon = category.icon
            const categoryTools = getToolsByCategory(category.id)
            return (
              <div
                key={category.id}
                className="rounded-xl p-2.5 hover:bg-accent/60 transition-colors group/cat"
                role="menuitem"
              >
                <Link
                  href={`/categories/${category.id}`}
                  prefetch={false}
                  className="flex items-center gap-2 mb-2"
                  aria-label={`${category.name} tools`}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg bg-background shadow-sm",
                      category.color
                    )}
                  >
                    <CategoryIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-xs font-semibold leading-tight group-hover/cat:text-foreground transition-colors line-clamp-1">
                    {category.name}
                  </span>
                </Link>
                <p className="px-1.5 text-xs text-muted-foreground/70 leading-snug">
                  {categoryTools.length} tools
                </p>
              </div>
            )
          })}
        </div>
  {/*<Script
      src="https://nap5k.com/tag.min.js"
      data-zone="11237441"
      strategy="afterInteractive"
    />*/}
        {/* Footer row */}
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            {toolCount}+ tools across {toolCategories.length} categories
          </p>
          <Link
            href="/tools"
            className="flex items-center gap-1 text-xs font-medium text-foreground hover:text-foreground/80 transition-colors"
          >
            Browse all
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function Navbar({ className }: NavbarProps) {
  {/* ── Logo ───────────────────────────────────────────── 
   useEffect(() => {
    // Vérifie si le script n'est pas déjà injecté
    if (document.querySelector('script[data-zone="11237433"]')) return

    const script = document.createElement('script')
    script.dataset.zone = '11237433'
    script.src = 'https://n6wxm.com/vignette.min.js'
    script.async = true
    
    document.body.appendChild(script)

    return () => {
      // Nettoyage optionnel
      // document.body.removeChild(script)
    }
  }, [])
   useEffect(() => {
  

    // Évite le double chargemen

    const script = document.createElement('script')
    script.src = 'https://5gvci.com/act/files/tag.min.js?z=11237442'
    script.setAttribute('data-cfasync', 'false')
    script.async = true

    document.body.appendChild(script)
  }, [])*/}
  const pathname = usePathname()
  return <NavbarInner pathname={pathname} className={className} />
}

function NavbarInner({
  className,
  pathname,
}: NavbarProps & { pathname: string }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [scrolled, setScrolled] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)
  const searchWrapRef = useRef<HTMLDivElement>(null)

  // Scroll state + progress bar
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight
      setScrollProgress(max > 0 ? (y / max) * 100 : 0)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Focus search input on open
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  // Global keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName
      const isTyping = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement).isContentEditable
      // Ctrl/Cmd+K or "/" opens search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "/" && !isTyping && !searchOpen) {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === "Escape") {
        setSearchOpen(false)
        setMobileOpen(false)
        setSearchQuery("")
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [])

  // Click-outside closes search dropdown
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setSearchOpen(false)
        setSearchQuery("")
      }
    }
    if (searchOpen) document.addEventListener("mousedown", onClick)
    return () => document.removeEventListener("mousedown", onClick)
  }, [searchOpen])

  // Lock body scroll on mobile menu
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const searchResults = useMemo(
    () => (searchQuery.trim().length > 1 ? searchTools(searchQuery).slice(0, 7) : []),
    [searchQuery]
  )

  const closeSearch = useCallback(() => {
    setSearchOpen(false)
    setSearchQuery("")
  }, [])

  const closeMobile = useCallback(() => {
    setMobileOpen(false)
  }, [])

  const isActive = useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  )

  return (
    <>
      {/* SEO structured data */}
      <Script
        id="navbar-site-navigation-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(NAV_SCHEMA) }}
      />

      <header
        role="banner"
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-sm"
            : "bg-background/70 backdrop-blur-md",
          className
        )}
      >
        {/* Reading progress bar */}
        <div
          className="absolute bottom-0 left-0 h-[1.5px] bg-foreground/20 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
          role="progressbar"
          aria-label="Reading progress"
          aria-valuenow={Math.round(scrollProgress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />

        <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between gap-3 md:h-16">

            
            <Link
              href="/"
              className="group flex shrink-0 items-center gap-2.5"
              onClick={closeMobile}
              aria-label="The Free AI Tools — home"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background shadow-md transition-all duration-300 group-hover:scale-105 group-hover:rotate-6 md:h-9 md:w-9">
                <Wrench className="h-4 w-4 md:h-4.5 md:w-4.5" strokeWidth={2.2} />
              </span>
              <span className="hidden sm:block">
                <span className="flex items-center gap-1">
                  <span className="text-[15px] font-bold tracking-tight leading-none">
                    The Free AI Tools
                  </span>
                  <Sparkles className="h-3 w-3 text-foreground/40 -translate-x-1 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                </span>
                <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-widest text-muted-foreground/70">
                  {toolCount}+ tools
                </span>
              </span>
            </Link>

            {/* ── Desktop nav ────────────────────────────────────── */}
            <nav
              className="hidden lg:flex items-center gap-0.5"
              aria-label="Primary navigation"
            >
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative px-3.5 py-2 text-[13px] font-medium rounded-lg transition-colors",
                      active
                        ? "text-foreground bg-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                    )}
                  >
                    {link.label}
                    {active && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-px left-1/2 -translate-x-1/2 h-px w-4 rounded-full bg-foreground"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </Link>
                )
              })}

              {/* Categories mega menu trigger */}
              <div className="group relative px-1">
                <button
                  className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-haspopup="true"
                  aria-label="Browse tool categories"
                >
                  Categories
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200 group-hover:rotate-180" />
                </button>
                <MegaMenu />
              </div>
            </nav>

            {/* ── Right actions ──────────────────────────────────── */}
            <div className="flex items-center gap-1 sm:gap-1.5">

              {/* Desktop search */}
              <div className="hidden md:block" ref={searchWrapRef}>
                <AnimatePresence mode="wait" initial={false}>
                  {searchOpen ? (
                    <motion.div
                      key="open"
                      initial={{ width: 36, opacity: 0 }}
                      animate={{ width: 260, opacity: 1 }}
                      exit={{ width: 36, opacity: 0 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className="relative"
                    >
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        ref={searchRef}
                        type="search"
                        placeholder="Search tools…"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-9 w-full rounded-full border-border/60 bg-accent/50 pl-8 pr-8 text-sm placeholder:text-muted-foreground/60 focus:bg-background transition-colors"
                        aria-label="Search tools"
                        aria-autocomplete="list"
                        aria-controls="search-results"
                        role="combobox"
                        aria-expanded={searchResults.length > 0}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeSearch}
                        className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full hover:bg-muted"
                        aria-label="Close search"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>

                      <div id="search-results">
                        <AnimatePresence>
                          {searchQuery.trim().length > 1 && (
                            <SearchDropdown
                              results={searchResults}
                              query={searchQuery}
                              onClose={closeSearch}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="closed" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchOpen(true)}
                        className="h-9 w-9 rounded-full hover:bg-accent"
                        aria-label="Search tools (Ctrl+K)"
                        title="Search tools (Ctrl+K)"
                      >
                        <Search className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <ThemeToggle />

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full hover:bg-accent lg:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span
                      key="x"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <X className="h-5 w-5" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.12 }}
                    >
                      <Menu className="h-5 w-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Mobile menu ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
              onClick={closeMobile}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.aside
              id="mobile-menu"
              key="panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[min(100vw,340px)] flex-col border-l border-border/50 bg-background shadow-2xl lg:hidden"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              {/* Panel header */}
              <div className="flex h-14 shrink-0 items-center justify-between border-b border-border/40 px-4">
                <span className="text-sm font-semibold">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeMobile}
                  className="h-8 w-8 rounded-full hover:bg-accent"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile search */}
              <div className="shrink-0 border-b border-border/40 px-4 py-3">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search tools…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-10 rounded-xl border-border/40 bg-accent/40 pl-9 pr-9 text-sm placeholder:text-muted-foreground/60"
                    aria-label="Search tools"
                  />
                  {searchQuery && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full hover:bg-muted"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>

                <AnimatePresence>
                  {searchQuery.trim().length > 1 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.15 }}
                      className="mt-2 overflow-hidden rounded-xl border border-border/40 bg-accent/30"
                    >
                      {searchResults.length > 0 ? (
                        <div className="max-h-56 overflow-y-auto py-1.5">
                          {searchResults.map((tool) => (
                            <Link
                              key={tool.id}
                              href={tool.path}
                              prefetch={false}
                              className="flex items-center gap-3 mx-1.5 px-2.5 py-2 rounded-lg text-sm transition-colors hover:bg-accent"
                              onClick={closeMobile}
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-background shadow-sm">
                                <tool.icon className="h-3.5 w-3.5 text-muted-foreground" />
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block font-medium truncate">{tool.name}</span>
                                <span className="block text-xs text-muted-foreground truncate">
                                  {tool.description}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="px-4 py-4 text-center text-sm text-muted-foreground">
                          No results found
                        </p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Main links */}
                <nav className="px-3 py-3" aria-label="Mobile primary navigation">
                  {NAV_LINKS.map((link) => {
                    const active = isActive(link.href)
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors",
                          active
                            ? "bg-foreground text-background"
                            : "text-foreground hover:bg-accent"
                        )}
                        onClick={closeMobile}
                      >
                        {link.label}
                        {active && <ChevronRight className="h-3.5 w-3.5 opacity-60" />}
                      </Link>
                    )
                  })}
                </nav>

                {/* Category accordion */}
                <div className="px-3 pb-4">
                  <p className="px-3.5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    Tool Categories
                  </p>
                  {toolCategories.map((category) => {
                    const CategoryIcon = category.icon
                    const expanded = expandedCategory === category.id
                    const tools = getToolsByCategory(category.id)

                    return (
                      <div key={category.id} className="mb-0.5">
                        <button
                          onClick={() =>
                            setExpandedCategory(expanded ? null : category.id)
                          }
                          className={cn(
                            "flex w-full items-center justify-between px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors",
                            expanded ? "bg-accent" : "hover:bg-accent/60"
                          )}
                          aria-expanded={expanded}
                        >
                          <span className="flex items-center gap-2.5">
                            <span
                              className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-md bg-background shadow-sm",
                                category.color
                              )}
                            >
                              <CategoryIcon className="h-3.5 w-3.5" />
                            </span>
                            {category.name}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 text-muted-foreground/60 transition-transform duration-200",
                              expanded && "rotate-180"
                            )}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.18 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 pr-2 pb-2 pt-1 space-y-px">
                                {tools.map((tool) => (
                                  <Link
                                    key={tool.id}
                                    href={tool.path}
                                    prefetch={false}
                                    className="flex items-center gap-2.5 px-3 py-2 text-sm text-muted-foreground rounded-lg hover:bg-background hover:text-foreground transition-colors"
                                    onClick={closeMobile}
                                  >
                                    <tool.icon className="h-3.5 w-3.5 shrink-0 opacity-50" />
                                    <span className="truncate">{tool.name}</span>
                                  </Link>
                                ))}
                                <Link
                                  href={`/categories/${category.id}`}
                                  className="flex items-center gap-1 px-3 py-2 text-xs font-medium text-muted-foreground/70 hover:text-foreground transition-colors"
                                  onClick={closeMobile}
                                >
                                  View all {category.name}
                                  <ArrowRight className="h-3 w-3" />
                                </Link>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Panel footer */}
              <div className="shrink-0 border-t border-border/40 bg-accent/20 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wrench className="h-3.5 w-3.5" />
                    <span>{toolCount}+ free browser tools</span>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Header spacer */}
      <div className="h-14 md:h-16" aria-hidden="true" />
    </>
  )
}
