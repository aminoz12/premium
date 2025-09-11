import React, { useEffect, Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'

// Critical components loaded immediately
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import GlobalStyles from './styles/GlobalStyles'
import { usePerformance } from './hooks/usePerformance'

// Lazy load non-critical components
const Channels = lazy(() => import('./components/Channels/Channels'))
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
        <Route path="/" element={
          <>
            <Header />
            <Hero />
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
        <Route path="/checkout" element={
          <Suspense fallback={<ComponentLoader />}>
            <Checkout />
          </Suspense>
        } />
      </Routes>
    </>
  )
}

export default App
