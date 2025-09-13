import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const Hero = () => {
  const { t } = useTranslation()
  const videoRef = useRef(null)
  const heroRef = useRef(null)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "10%"])
  const opacity = useTransform(scrollYProgress, [0, 0.9], [1, 0])

  const heroImages = [
    '/assets/header/image1.png',
    '/assets/header/image2.png',
    '/assets/header/image3.png',
    '/assets/header/image4.jpg'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % heroImages.length
      )
    }, 5000) // Change image every 5 seconds

    return () => clearInterval(interval)
  }, [heroImages.length])

  useEffect(() => {
    const handleVideoLoad = () => {
      setIsVideoLoaded(true)
    }

    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', handleVideoLoad)
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleVideoLoad)
        }
      }
    }
  }, [])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const features = [
    { icon: 'fas fa-tv', text: '8K HDR QUALITY', color: '#00d4ff' }, // Cyan blue
    { icon: 'fas fa-bolt', text: 'ZERO BUFFERING', color: 'var(--accent-secondary)' },
    { icon: 'fas fa-headset', text: '24/7 PREMIUM SUPPORT', color: '#ff6b9d' }, // Pink
    { icon: 'fas fa-mobile-alt', text: 'ALL DEVICES SUPPORTED', color: 'var(--success)' },
    { icon: 'fas fa-cogs', text: 'ALL APPLICATIONS SUPPORTED', color: '#9c27b0' }, // Purple
    { icon: 'fas fa-shield-alt', text: 'VPN INCLUDED', color: '#4caf50' } // Green
  ]

  return (
    <HeroSection ref={heroRef} id="home">
      <GlobalLaptopStyles />
      <HeroBackground>
        <HeroVideo 
          ref={videoRef}
          autoPlay 
          muted 
          loop
          playsInline
          preload="metadata"
          poster="/assets/hero-poster.jpg"
          onError={(e) => {
            e.target.style.display = 'none'
            e.target.parentElement.style.backgroundImage = 'url("/assets/hero-fallback.jpg")'
            e.target.parentElement.style.backgroundSize = 'cover'
            e.target.parentElement.style.backgroundPosition = 'center'
          }}
        >
          <source src="/assets/hero-video.mp4" type="video/mp4" />
        </HeroVideo>
        <HeroOverlay />
        <HeroGradient />
      </HeroBackground>

      {/* Desktop Background Image Carousel */}
      <BackgroundImageCarousel className="desktop-layout">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ 
              opacity: 0, 
              scale: 1.05,
              filter: "blur(2px) brightness(0.8)"
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: "blur(0px) brightness(1)"
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              filter: "blur(1px) brightness(0.9)"
            }}
            transition={{ 
              duration: 0.3, 
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { duration: 0.2 },
              scale: { duration: 0.3 },
              filter: { duration: 0.25 }
            }}
            className="image-container"
          >
            <img 
              src={heroImages[currentImageIndex]} 
              alt={`Hero background ${currentImageIndex + 1}`}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div className="image-overlay" />
          </motion.div>
        </AnimatePresence>
      </BackgroundImageCarousel>
      
      {/* Desktop Layout - Original */}
      <HeroContent style={{ y, opacity }} className="desktop-layout">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <HeroText>

              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hero-description"
              >
                <span className="main-description laptop-hide">{t('hero.title')}: {t('hero.subtitle')}</span> <span className="highlight-text">WATCH ANYTIME, ANYWHERE, NO INTERRUPTIONS !</span>
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                <HeroFeatures>
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.text}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      <FeatureItem>
                        <motion.div
                          animate={{ 
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                          }}
                          transition={{ 
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.5
                          }}
                        >
                        <FeatureIcon color={feature.color}>
                          <i className={feature.icon}></i>
                        </FeatureIcon>
                        </motion.div>
                        <motion.span
                          animate={{ 
                            color: [feature.color, "#ff6b35", feature.color]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: index * 0.3
                          }}
                        >
                          {feature.text}
                        </motion.span>
                      </FeatureItem>
                    </motion.div>
                  ))}
                </HeroFeatures>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                <HeroCTA>
                  <button 
                    className="btn btn-primary btn-xl"
                    onClick={() => scrollToSection('pricing')}
                  >
                    <i className="fas fa-play"></i>
                    Start Your Journey
                  </button>
                  <button 
                    className="btn btn-secondary btn-xl"
                    onClick={() => scrollToSection('channels')}
                  >
                    <i className="fas fa-tv"></i>
                    Explore Channels
                  </button>
                </HeroCTA>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1.1 }}
              >
                <TrustIndicators>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                  <TrustItem>
                      <motion.span 
                        className="number"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          color: ["#ff6b35", "#f7931e", "#ff6b35"]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        +35K
                      </motion.span>
                    <span className="label">{t('hero.channels')}</span>
                  </TrustItem>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.4 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                  <TrustItem>
                      <motion.span 
                        className="number"
                      >
                        99.9%
                      </motion.span>
                    <span className="label">Uptime</span>
                  </TrustItem>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1.5 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                  <TrustItem>
                      <motion.span 
                        className="number"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          color: ["#ff6b35", "#f7931e", "#ff6b35"]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                      >
                        5500+
                      </motion.span>
                    <span className="label">{t('hero.happyUsers')}</span>
                  </TrustItem>
                  </motion.div>
                </TrustIndicators>
              </motion.div>
            </HeroText>
          </motion.div>
        </div>
      </HeroContent>

      {/* Mobile/Tablet Layout - Text Below Images */}
      <BackgroundImageCarousel className="mobile-layout">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ 
              opacity: 0, 
              scale: 1.05,
              filter: "blur(2px) brightness(0.8)"
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              filter: "blur(0px) brightness(1)"
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              filter: "blur(1px) brightness(0.9)"
            }}
            transition={{ 
              duration: 0.3, 
              ease: [0.25, 0.46, 0.45, 0.94],
              opacity: { duration: 0.2 },
              scale: { duration: 0.3 },
              filter: { duration: 0.25 }
            }}
            className="image-container"
          >
            <img 
              src={heroImages[currentImageIndex]} 
              alt={`Hero background ${currentImageIndex + 1}`}
              onError={(e) => {
                e.target.style.display = 'none'
              }}
            />
            <div className="image-overlay" />
          </motion.div>
        </AnimatePresence>
      </BackgroundImageCarousel>
      
      <HeroContentBelow className="mobile-layout">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <HeroText>

              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hero-description"
              >
                <span className="main-description laptop-hide">{t('hero.title')}: {t('hero.subtitle')}</span> <span className="highlight-text">WATCH ANYTIME, ANYWHERE, NO INTERRUPTIONS !</span>
              </motion.p>
              
              {/* Trust Indicators - Moved up for mobile */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
              >
                <TrustIndicators>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                  <TrustItem>
                      <motion.span 
                        className="number"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          color: ["#ff6b35", "#f7931e", "#ff6b35"]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        +35K
                      </motion.span>
                    <span className="label">{t('hero.channels')}</span>
                  </TrustItem>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                  <TrustItem>
                      <motion.span 
                        className="number"
                      >
                        99.9%
                      </motion.span>
                    <span className="label">Uptime</span>
                  </TrustItem>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                  <TrustItem>
                      <motion.span 
                        className="number"
                        animate={{ 
                          scale: [1, 1.1, 1],
                          color: ["#ff6b35", "#f7931e", "#ff6b35"]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: 1
                        }}
                      >
                        5500+
                      </motion.span>
                    <span className="label">{t('hero.happyUsers')}</span>
                  </TrustItem>
                  </motion.div>
                </TrustIndicators>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.3 }}
                style={{ marginTop: 'var(--spacing-12)' }}
              >
                <HeroCTA>
                  <button 
                    className="btn btn-primary btn-xl"
                    onClick={() => scrollToSection('pricing')}
                  >
                    <i className="fas fa-play"></i>
                    Start Your Journey
                  </button>
                  <button 
                    className="btn btn-secondary btn-xl"
                    onClick={() => scrollToSection('channels')}
                  >
                    <i className="fas fa-tv"></i>
                    Explore Channels
                  </button>
                </HeroCTA>
              </motion.div>
            </HeroText>
          </motion.div>
        </div>
      </HeroContentBelow>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
      >
        <ScrollIndicator>
          <ScrollArrow />
        </ScrollIndicator>
      </motion.div>
    </HeroSection>
  )
}

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  min-height: 800px;
  display: flex;
  align-items: center;
  overflow: visible;
  background: var(--primary-bg);

  /* Desktop layout - original */
  .desktop-layout {
    display: block;
    
    @media (max-width: 768px) {
      display: none;
    }
  }

  /* Mobile/Tablet layout - text below images */
  .mobile-layout {
    display: none;
    
    @media (max-width: 768px) {
      display: block;
    }
  }

  @media (max-width: 768px) {
    height: auto;
    min-height: auto;
    flex-direction: column;
  }
`

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`

const HeroVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`

const HeroOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(12, 12, 12, 0.9) 0%,
    rgba(12, 12, 12, 0.7) 50%,
    rgba(12, 12, 12, 0.9) 100%
  );
  z-index: 2;
`

const HeroGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(59, 130, 246, 0.1) 50%,
    transparent 100%
  );
  z-index: 3;
`

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  padding: var(--spacing-8) 0 var(--spacing-20) 0;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`

const HeroText = styled.div`
  max-width: 900px;
  text-align: center;
  margin: 150px auto 0;

  h1 {
    font-size: 3rem; /* Reduced from 4.5rem */
    font-weight: 900;
    line-height: 1.1;
    margin-bottom: 12px; /* Reduced margin */
    letter-spacing: -0.02em;
    background: linear-gradient(135deg, #ffffff, #e0e0e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }

  .hero-subtitle {
    font-size: 1.2rem; /* Reduced from 1.5rem */
    font-weight: 700;
    color: #ff6b35;
    margin-bottom: 20px; /* Reduced margin */
    text-transform: uppercase;
    letter-spacing: 1.5px; /* Reduced letter spacing */
  }

  .hero-description {
    font-size: 1.125rem; /* Increased by 2px from 1.1rem */
    color: #ffffff;
    margin-bottom: 40px; /* Reduced margin */
    line-height: 1.6; /* Slightly reduced line height */
    font-weight: 600;
    max-width: 700px; /* Slightly narrower */
    margin-left: auto;
    margin-right: auto;
    text-shadow: 0 3px 6px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255, 255, 255, 0.1);
    letter-spacing: 0.3px; /* Reduced letter spacing */
    text-align: center;
  }

  .main-description {
    font-size: 1.525rem; /* Bigger letters + 2px */
    font-weight: 700; /* Bolder */
    color: #ffffff;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    letter-spacing: 0.5px;
    line-height: 1.5;
  }

  .highlight-text {
    color: #ff6b35; /* Orange accent color */
    font-weight: 800;
    font-size: 1em; /* Same size as regular text */
    position: relative;
    display: inline-block;
    padding: 4px 12px;
    background: linear-gradient(135deg, #ff6b35, #f7931e, #ff8c42);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 12px rgba(255, 107, 53, 0.6);
    animation: highlightPulse 3s ease-in-out infinite;
    border-radius: 8px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }

  @keyframes highlightPulse {
    0%, 100% {
      text-shadow: 0 0 12px rgba(255, 107, 53, 0.6);
      transform: scale(1);
    }
    50% {
      text-shadow: 0 0 20px rgba(255, 107, 53, 0.9);
      transform: scale(1.05);
    }
  }

  @media (max-width: 1200px) {
    h1 {
      font-size: 2.5rem; /* Reduced from 3.5rem */
    }
    .hero-subtitle {
      font-size: 1.1rem; /* Reduced from 1.3rem */
    }
    .hero-description {
      font-size: 1.025rem; /* Increased by 2px from 1rem */
    }
    
    .main-description {
      font-size: 1.325rem; /* Responsive bigger letters + 2px */
    }
    margin: 120px auto 0;
  }

  @media (max-width: 1024px) {
    h1 {
      font-size: 2.2rem; /* Reduced from 3rem */
    }
    .hero-subtitle {
      font-size: 1rem; /* Reduced from 1.2rem */
    }
    .hero-description {
      font-size: 0.975rem; /* Increased by 2px from 0.95rem */
    }
    
    .main-description {
      font-size: 1.225rem; /* Responsive bigger letters + 2px */
    }
    margin: 100px auto 0;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2rem; /* Reduced from 2.5rem */
    }
    .hero-subtitle {
      font-size: 0.95rem; /* Reduced from 1.1rem */
      letter-spacing: 1px;
    }
    .hero-description {
      font-size: 0.925rem; /* Increased by 2px from 0.9rem */
      margin-bottom: 32px;
    }
    
    .main-description {
      font-size: 1.125rem; /* Responsive bigger letters + 2px */
    }
    margin: 40px auto 0; /* Reduced from 80px for tighter spacing */
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.8rem; /* Reduced from 2rem */
    }
    .hero-subtitle {
      font-size: 0.9rem; /* Reduced from 1rem */
      letter-spacing: 0.5px;
    }
    .hero-description {
      font-size: 0.875rem; /* Increased by 2px from 0.85rem */
      margin-bottom: 24px;
    }
    
    .main-description {
      font-size: 1.075rem; /* Responsive bigger letters + 2px */
    }
    margin: 30px auto 0; /* Reduced from 60px for tighter spacing */
  }

  @media (max-width: 360px) {
    h1 {
      font-size: 1.6rem; /* Reduced from 1.8rem */
    }
    .hero-subtitle {
      font-size: 0.8rem; /* Reduced from 0.9rem */
    }
    .hero-description {
      font-size: 0.825rem; /* Increased by 2px from 0.8rem */
    }
    
    .main-description {
      font-size: 1.025rem; /* Responsive bigger letters + 2px */
    }
    margin: 50px auto 0;
  }

  /* Responsive visibility controls */
  .mobile-trust-indicators {
    display: none;
    
    @media (max-width: 768px) {
      display: block;
    }
  }

  .desktop-features {
    display: block;
    
    @media (max-width: 768px) {
      display: none;
    }
  }

  /* Hide main-description text on laptop screens only (1024px to 1600px) */
  @media (min-width: 1024px) and (max-width: 1600px) {
    .main-description,
    .laptop-hide {
      display: none !important;
    }
  }
`

const HeroContentBelow = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  padding: var(--spacing-8) 0 var(--spacing-20) 0;
  background: var(--primary-bg);
  margin-top: -50px; /* Overlap slightly with images */

  /* Mobile and tablet - bring text closer to images */
  @media (max-width: 768px) {
    margin-top: -80px; /* More overlap for tighter spacing */
    padding-top: var(--spacing-4); /* Reduced top padding */
  }

  @media (max-width: 480px) {
    margin-top: -60px; /* Slightly less overlap on small phones */
    padding-top: var(--spacing-3); /* Even tighter spacing */
  }

  /* Hide main-description text on laptop screens only (1024px to 1600px) */
  @media (min-width: 1024px) and (max-width: 1600px) {
    .main-description,
    .laptop-hide {
      display: none !important;
    }
  }
`

const Highlight = styled.span`
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: inline-block;
  position: relative;
`

const HeroFeatures = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-6);
  margin-bottom: var(--spacing-4);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  padding: var(--spacing-4);
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.05), rgba(247, 147, 30, 0.05));
  border-radius: var(--border-radius-xl);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 53, 0.2);
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    animation: shimmer 4s infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-4);
    padding: var(--spacing-3);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-3);
    padding: var(--spacing-2);
    margin-bottom: var(--spacing-3);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-2);
    padding: var(--spacing-2);
    margin-bottom: var(--spacing-2);
  }

  @media (max-width: 360px) {
    padding: var(--spacing-1);
    margin-bottom: var(--spacing-1);
  }
`

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-4);
  background: rgba(255, 107, 53, 0.05);
  border-radius: var(--border-radius-xl);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 53, 0.2);
  transition: var(--transition-all);
  position: relative;
  z-index: 2;
  box-shadow: 0 4px 16px rgba(255, 107, 53, 0.1);
  cursor: pointer;

  &:hover {
    background: rgba(255, 107, 53, 0.1);
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(255, 107, 53, 0.2);
  }

  span {
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
    font-size: var(--font-size-sm);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: var(--spacing-2);
    gap: var(--spacing-2);
    
    span {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    padding: var(--spacing-1);
    gap: var(--spacing-1);
    
    span {
      font-size: 0.7rem;
    }
  }
`

const FeatureIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-lg);
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--font-size-lg);
  box-shadow: var(--shadow-md);

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: var(--font-size-base);
  }

  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
    font-size: var(--font-size-sm);
  }
`

const HeroCTA = styled.div`
  display: flex;
  gap: var(--spacing-6);
  justify-content: center;
  margin-bottom: var(--spacing-16);
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-4);
    margin-bottom: var(--spacing-12);
  }

  @media (max-width: 480px) {
    gap: var(--spacing-3);
    margin-bottom: var(--spacing-8);
  }

  .btn {
    min-width: 200px;

    @media (max-width: 768px) {
      min-width: 180px;
      padding: var(--spacing-3) var(--spacing-4);
    }

    @media (max-width: 480px) {
      min-width: 160px;
      padding: var(--spacing-2) var(--spacing-3);
      font-size: var(--font-size-sm);
    }
  }
`

const TrustIndicators = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-8);
  padding: var(--spacing-3);
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(247, 147, 30, 0.1));
  border-radius: var(--border-radius-lg);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 107, 53, 0.3);
  max-width: 500px;
  margin: -5px auto var(--spacing-8) auto; /* Added bottom margin for better separation */
  box-shadow: 0 8px 32px rgba(255, 107, 53, 0.2);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    animation: shimmer 3s infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }

  @media (max-width: 1024px) {
    gap: var(--spacing-6);
    padding: var(--spacing-2);
  }

  @media (max-width: 768px) {
    gap: var(--spacing-4);
    flex-wrap: wrap;
    padding: var(--spacing-2);
    max-width: 400px;
  }

  @media (max-width: 480px) {
    gap: var(--spacing-3);
    padding: var(--spacing-1);
    max-width: 300px;
  }

  @media (max-width: 360px) {
    gap: var(--spacing-2);
    padding: var(--spacing-1);
    max-width: 280px;
  }
`

const TrustItem = styled.div`
  text-align: center;
  position: relative;
  z-index: 2;

  .number {
    display: block;
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-bold);
    color: var(--accent-primary);
    line-height: var(--line-height-tight);
    text-shadow: 0 2px 4px rgba(255, 107, 53, 0.3);
    cursor: pointer;

    @media (max-width: 768px) {
      font-size: var(--font-size-xl);
    }

    @media (max-width: 480px) {
      font-size: var(--font-size-lg);
    }
  }

  .label {
    display: block;
    font-size: var(--font-size-sm);
    color: var(--text-muted);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 4px;

    @media (max-width: 768px) {
      font-size: 0.75rem;
    }

    @media (max-width: 480px) {
      font-size: 0.7rem;
    }
  }

  &:hover .number {
    text-shadow: 0 4px 8px rgba(255, 107, 53, 0.5);
  }
`

const ScrollIndicator = styled.div`
  position: absolute;
  bottom: var(--spacing-8);
  left: 50%;
  transform: translateX(-50%);
  z-index: 4;
`

const ScrollArrow = styled.div`
  width: 24px;
  height: 24px;
  border-right: 2px solid var(--text-primary);
  border-bottom: 2px solid var(--text-primary);
  transform: rotate(45deg);
  animation: bounce 2s infinite;
  opacity: 0.8;
  transition: var(--transition-all);

  &:hover {
    opacity: 1;
    transform: rotate(45deg) scale(1.1);
  }
`

const BackgroundImageCarousel = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1a, #2a2a2a);

  .image-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    display: block;
    opacity: 0.8;
    transition: transform 0.3s ease;
  }

  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      135deg,
      rgba(12, 12, 12, 0.3) 0%,
      rgba(12, 12, 12, 0.1) 50%,
      rgba(12, 12, 12, 0.4) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  /* Desktop hover effect */
  &:hover img {
    transform: scale(1.02);
  }

  /* Mobile layout - positioned at top */
  &.mobile-layout {
    position: relative;
    height: 72vh; /* 60vh + 20% = 72vh */
    min-height: 480px; /* 400px + 20% = 480px */

    @media (max-width: 768px) {
      height: 60vh; /* 50vh + 20% = 60vh */
      min-height: 360px; /* 300px + 20% = 360px */
    }

    @media (max-width: 480px) {
      height: 48vh; /* 40vh + 20% = 48vh */
      min-height: 300px; /* 250px + 20% = 300px */
    }

    img {
      opacity: 0.9;
    }

    .image-overlay {
      background: linear-gradient(
        180deg,
        rgba(12, 12, 12, 0.2) 0%,
        rgba(12, 12, 12, 0.1) 50%,
        rgba(12, 12, 12, 0.3) 100%
      );
    }
  }

  /* Professional transition effects */
  .image-container {
    will-change: transform, opacity, filter;
    backface-visibility: hidden;
    transform: translateZ(0);
  }
`

export default Hero

// Global CSS to hide main-description on laptop screens
const GlobalLaptopStyles = styled.div`
  @media (min-width: 1024px) and (max-width: 1600px) {
    .main-description,
    .laptop-hide {
      display: none !important;
    }
  }
`
