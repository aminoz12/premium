import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// Wrap important keywords in an accent <span> for a designed headline
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const highlightWords = (text, words) => {
  if (!text) return text
  const re = new RegExp(`(${words.map(escapeRe).join('|')})`, 'gi')
  return text.split(re).map((part, i) =>
    words.some((w) => w.toLowerCase() === part.toLowerCase())
      ? <span className="kw" key={i}>{part}</span>
      : <React.Fragment key={i}>{part}</React.Fragment>
  )
}
const TITLE_KEYWORDS = ['ULTIMATE', 'PREMIUM']
const SUBTITLE_KEYWORDS = [
  'CHANNELS', 'MOVIES', 'SERIES', 'LIVE SPORTS', '100% STABILITY', 'ALL DEVICES'
]

const Hero = () => {
  const { t } = useTranslation()
  const heroRef = useRef(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  const heroImages = [
    '/assets/header/image1.webp',
    '/assets/header/image2.webp'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [heroImages.length])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetPosition =
        element.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
    }
  }

  const features = [
    { icon: 'fas fa-gem', textKey: 'heroFeatures.quality8K' },
    { icon: 'fas fa-bolt', textKey: 'heroFeatures.zeroBuffering' },
    { icon: 'fas fa-headset', textKey: 'heroFeatures.support24_7' },
    { icon: 'fas fa-mobile-screen', textKey: 'heroFeatures.allDevices' },
    { icon: 'fas fa-layer-group', textKey: 'heroFeatures.allApps' },
    { icon: 'fas fa-shield-halved', textKey: 'heroFeatures.vpnIncluded' }
  ]

  const stats = [
    { num: '35K+', label: t('hero.channels') },
    { num: '99.9%', label: t('hero.uptime') },
    { num: '5,500+', label: t('hero.happyUsers') }
  ]

  // Subtle, once-only entrance choreography
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  }
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  }

  return (
    <HeroSection ref={heroRef} id="home">
      {/* Background image carousel */}
      <Background>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImageIndex}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="slide"
          >
            <img
              src={heroImages[currentImageIndex]}
              alt="Premium IPTV — 35,000+ channels in 4K on every device"
              onError={(e) => { e.target.style.display = 'none' }}
            />
          </motion.div>
        </AnimatePresence>
        <div className="scrim" />
      </Background>

      <Content style={{ y, opacity }}>
        <div className="container">
          <motion.div variants={container} initial="hidden" animate="show">
            <Eyebrow variants={item}>
              <span className="dot" /> {t('hero.eyebrow')}
            </Eyebrow>

            <Title variants={item}>{highlightWords(t('hero.title'), TITLE_KEYWORDS)}</Title>

            <Subtitle variants={item}>{highlightWords(t('hero.subtitle'), SUBTITLE_KEYWORDS)}</Subtitle>

            <Highlight variants={item}>
              <i className="fas fa-circle-check" />
              {t('heroFeatures.watchAnywhere')}
            </Highlight>

            <FeaturePills variants={item}>
              {features.map((f) => (
                <Pill key={f.textKey}>
                  <i className={f.icon} />
                  <span>{t(f.textKey)}</span>
                </Pill>
              ))}
            </FeaturePills>

            <Actions variants={item}>
              <button className="btn btn-primary btn-xl" onClick={() => scrollToSection('pricing')}>
                <i className="fas fa-bolt" /> {t('hero.freeTrial')}
              </button>
              <button className="btn btn-secondary btn-xl" onClick={() => scrollToSection('channels')}>
                <i className="fas fa-tv" /> {t('hero.exploreChannels')}
              </button>
            </Actions>

            <Stats variants={item}>
              {stats.map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <Divider />}
                  <Stat>
                    <span className="num">{s.num}</span>
                    <span className="label">{s.label}</span>
                  </Stat>
                </React.Fragment>
              ))}
            </Stats>
          </motion.div>
        </div>
      </Content>
    </HeroSection>
  )
}

/* ---------- styled ---------- */

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  /* Clear the 80px fixed header + breathing room; content is never clipped */
  padding: 104px 0 72px;
  background: var(--primary-bg);

  @media (max-width: 768px) {
    min-height: auto;
    padding: 120px 0 64px;
  }
`

const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  .slide {
    position: absolute;
    inset: 0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  /* Premium readability scrim: darker on the left where text sits */
  .scrim {
    position: absolute;
    inset: 0;
    background:
      linear-gradient(90deg, rgba(8, 8, 8, 0.95) 0%, rgba(8, 8, 8, 0.7) 45%, rgba(8, 8, 8, 0.45) 100%),
      linear-gradient(0deg, rgba(8, 8, 8, 0.95) 0%, rgba(8, 8, 8, 0.1) 40%),
      radial-gradient(900px 500px at 18% 40%, rgba(255, 107, 53, 0.12), transparent 70%);
  }

  @media (max-width: 768px) {
    .scrim {
      background:
        linear-gradient(180deg, rgba(8, 8, 8, 0.6) 0%, rgba(8, 8, 8, 0.85) 55%, rgba(8, 8, 8, 0.97) 100%),
        radial-gradient(600px 400px at 50% 20%, rgba(255, 107, 53, 0.12), transparent 70%);
    }
  }
`

const Content = styled(motion.div)`
  position: relative;
  z-index: 2;
  width: 100%;

  .container {
    max-width: 1180px;
  }

  /* Constrain the text column for a refined, editorial feel */
  & > .container > div {
    max-width: 760px;

    @media (max-width: 768px) {
      text-align: center;
      margin: 0 auto;
    }
  }
`

const Eyebrow = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-primary);
  margin-bottom: 22px;

  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--accent-primary);
    box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.2);
  }

  @media (max-width: 768px) {
    justify-content: center;
  }
`

const Title = styled(motion.h1)`
  font-size: clamp(2.4rem, 5.2vw, 4rem);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -0.03em;
  color: #fff;
  margin-bottom: 20px;
  text-wrap: balance;

  .kw {
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

const Subtitle = styled(motion.p)`
  font-size: clamp(1rem, 1.4vw, 1.2rem);
  line-height: 1.6;
  color: var(--text-muted);
  max-width: 560px;
  margin-bottom: 26px;

  .kw {
    color: #fff;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    margin-left: auto;
    margin-right: auto;
  }
`

const Highlight = styled(motion.div)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-secondary);
  padding: 10px 18px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 107, 53, 0.1);
  border: 1px solid rgba(255, 107, 53, 0.25);
  margin-bottom: 26px;

  i { color: var(--accent-primary); }

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`

const FeaturePills = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    justify-content: center;
  }
`

const Pill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 9px 15px;
  border-radius: var(--border-radius-full);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(8px);
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;

  i {
    color: var(--accent-primary);
    font-size: 0.9rem;
  }

  span {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: 0.02em;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 107, 53, 0.4);
    background: rgba(255, 107, 53, 0.08);
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    span { font-size: 0.72rem; }
  }
`

const Actions = styled(motion.div)`
  display: flex;
  gap: 16px;
  margin-bottom: 34px;
  flex-wrap: wrap;

  .btn { min-width: 200px; }

  @media (max-width: 768px) {
    justify-content: center;
    .btn { min-width: 180px; flex: 1; }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    .btn { width: 100%; }
  }
`

const Stats = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 28px;

  @media (max-width: 768px) {
    justify-content: center;
  }

  @media (max-width: 480px) {
    gap: 16px;
  }
`

const Divider = styled.span`
  width: 1px;
  height: 38px;
  background: linear-gradient(180deg, transparent, var(--border-color), transparent);
`

const Stat = styled.div`
  display: flex;
  flex-direction: column;

  .num {
    font-size: clamp(1.5rem, 2.4vw, 2rem);
    font-weight: 800;
    color: #fff;
    line-height: 1;
    letter-spacing: -0.02em;
  }

  .label {
    margin-top: 6px;
    font-size: 0.8rem;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
`

export default Hero
