import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Critical components loaded immediately
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import GlobalStyles from './styles/GlobalStyles'
import Seo from './components/Seo/Seo'
import { usePerformance } from './hooks/usePerformance'

const HOME_TITLE = 'Watch World Cup 2026 Live in 4K — All 104 Matches | Premium IPTV'
const HOME_DESC = 'Watch every FIFA World Cup 2026 match live in 4K from $25 — plus 35,000+ channels, 147,000 movies & 62,000 series on Smart TV, Firestick, Android & iPhone. Instant activation, free VPN, 24/7 support.'

// Lazy load non-critical components
const Channels = lazy(() => import('./components/Channels/Channels'))
const WorldCup = lazy(() => import('./components/WorldCup/WorldCup'))
const ContentShowcase = lazy(() => import('./components/ContentShowcase/ContentShowcase'))
const Features = lazy(() => import('./components/Features/Features'))
const Pricing = lazy(() => import('./components/Pricing/Pricing'))
const SportsSection = lazy(() => import('./components/SportsSection/SportsSection'))
const Testimonials = lazy(() => import('./components/Testimonials/Testimonials'))
const FAQ = lazy(() => import('./components/FAQ/FAQ'))
const Support = lazy(() => import('./components/Support/Support'))
const Footer = lazy(() => import('./components/Footer/Footer'))
const FloatingSupport = lazy(() => import('./components/FloatingSupport/FloatingSupport'))
const Checkout = lazy(() => import('./pages/Checkout/Checkout'))
const Blog = lazy(() => import('./pages/Blog/Blog'))

// Loading fallback component
const ComponentLoader = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px',
    color: 'var(--text-secondary)'
  }}>
    <div style={{ 
      width: '40px', 
      height: '40px', 
      border: '3px solid var(--border-color)',
      borderTop: '3px solid var(--accent-primary)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
  </div>
)

function App() {
  usePerformance() // Monitor performance metrics
  const location = useLocation()

  // Send a Google Analytics page_view on every client-side route change
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title
      })
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    // Initialize AOS with optimized settings
    AOS.init({
      duration: 600, // Reduced duration for faster animations
      easing: 'ease-out', // Faster easing
      once: true,
      offset: 50, // Reduced offset for earlier triggering
      delay: 0 // No delay for faster appearance
    })
  }, [])

  return (
    <>
      <GlobalStyles />
      <LoadingScreen />
      
      <Routes>
        {/* Main Homepage */}
        <Route path="/" element={
          <>
            <Seo title={HOME_TITLE} description={HOME_DESC} path="/" lang="en" />
            <Header />
            <Hero />
            <Suspense fallback={<ComponentLoader />}>
              <WorldCup />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Channels />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <ContentShowcase />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Pricing />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <SportsSection />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Features />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Testimonials />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <FAQ />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Support />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Footer />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <FloatingSupport />
            </Suspense>
          </>
        } />
        
        {/* Language-specific routes */}
        <Route path="/fr/" element={
          <>
            <Seo title="Regarder la Coupe du Monde 2026 en 4K — IPTV Premium" description="Regardez tous les matchs de la Coupe du Monde 2026 en direct en 4K dès 25 $ — plus de 35 000 chaînes, films et séries sur tous vos appareils. Activation instantanée, VPN gratuit." path="/fr/" lang="fr" />
            <Header />
            <Hero />
            <Suspense fallback={<ComponentLoader />}>
              <WorldCup />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Channels />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <ContentShowcase />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Pricing />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <SportsSection />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Features />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Testimonials />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <FAQ />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Support />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Footer />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <FloatingSupport />
            </Suspense>
          </>
        } />
        <Route path="/gr/" element={
          <>
            <Seo title="Παρακολουθήστε το Παγκόσμιο Κύπελλο 2026 σε 4K — Premium IPTV" description="Παρακολουθήστε όλους τους αγώνες του Παγκοσμίου Κυπέλλου 2026 ζωντανά σε 4K από 25 $ — πάνω από 35.000 κανάλια, ταινίες και σειρές σε κάθε συσκευή. Άμεση ενεργοποίηση, δωρεάν VPN." path="/gr/" lang="el" />
            <Header />
            <Hero />
            <Suspense fallback={<ComponentLoader />}>
              <WorldCup />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Channels />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <ContentShowcase />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Pricing />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <SportsSection />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Features />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Testimonials />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <FAQ />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Support />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Footer />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <FloatingSupport />
            </Suspense>
          </>
        } />
        <Route path="/al/" element={
          <>
            <Seo title="Shiko Kupën e Botës 2026 në 4K — Premium IPTV" description="Shiko të gjitha ndeshjet e Kupës së Botës 2026 drejtpërdrejt në 4K nga 25 $ — mbi 35,000 kanale, filma dhe seriale në çdo pajisje. Aktivizim i menjëhershëm, VPN falas." path="/al/" lang="sq" />
            <Header />
            <Hero />
            <Suspense fallback={<ComponentLoader />}>
              <WorldCup />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Channels />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <ContentShowcase />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Pricing />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <SportsSection />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Features />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Testimonials />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <FAQ />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Support />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <Footer />
            </Suspense>
            <Suspense fallback={<ComponentLoader />}>
              <FloatingSupport />
            </Suspense>
          </>
        } />
        
        {/* Other Pages */}
        <Route path="/checkout" element={
          <>
            <Seo title="Checkout — Premium IPTV World Cup 2026" description="Complete your Premium IPTV subscription and start watching the World Cup 2026 in 4K within minutes." path="/checkout" noindex />
            <Suspense fallback={<ComponentLoader />}>
              <Checkout />
            </Suspense>
          </>
        } />
        <Route path="/blog" element={
          <Suspense fallback={<ComponentLoader />}>
            <Blog />
          </Suspense>
        } />
        <Route path="/blog/:slug" element={
          <Suspense fallback={<ComponentLoader />}>
            <Blog />
          </Suspense>
        } />
        <Route path="/fr/blog" element={
          <Suspense fallback={<ComponentLoader />}>
            <Blog />
          </Suspense>
        } />
        <Route path="/fr/blog/:slug" element={
          <Suspense fallback={<ComponentLoader />}>
            <Blog />
          </Suspense>
        } />
        <Route path="/gr/blog" element={
          <Suspense fallback={<ComponentLoader />}>
            <Blog />
          </Suspense>
        } />
        <Route path="/gr/blog/:slug" element={
          <Suspense fallback={<ComponentLoader />}>
            <Blog />
          </Suspense>
        } />
        <Route path="/al/blog" element={
          <Suspense fallback={<ComponentLoader />}>
            <Blog />
          </Suspense>
        } />
        <Route path="/al/blog/:slug" element={
          <Suspense fallback={<ComponentLoader />}>
            <Blog />
          </Suspense>
        } />
      </Routes>
    </>
  )
}

export default App
