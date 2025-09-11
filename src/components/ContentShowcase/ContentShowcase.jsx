import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LazyImage from '../LazyImage/LazyImage'

const ContentShowcase = () => {
  const { t } = useTranslation()
  const scrollContainerRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!scrollContainerRef.current || isHovered) return

    const scrollContainer = scrollContainerRef.current
    let animationId
    let scrollPosition = 0
    const scrollSpeed = 0.5 // pixels per frame (adjust for speed)

    const continuousScroll = () => {
      if (isHovered) return

      scrollPosition += scrollSpeed
      const scrollWidth = scrollContainer.scrollWidth
      const clientWidth = scrollContainer.clientWidth
      const maxScroll = scrollWidth - clientWidth

      if (scrollPosition >= maxScroll) {
        scrollPosition = 0 // Reset to beginning for infinite loop
      }

      scrollContainer.scrollLeft = scrollPosition
      animationId = requestAnimationFrame(continuousScroll)
    }

    animationId = requestAnimationFrame(continuousScroll)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isHovered])

  const contentItems = [
    {
      title: 'Kanan',
      category: 'IPTV Premium Abonnement VOD Streaming',
      image: '/assets/movies/kanan.jpg',
      type: 'series'
    },
    {
      title: 'Mufasa Le roi Lion',
      category: 'Disney IPTV Premium Abonnement VOD Streaming',
      image: '/assets/movies/Mufasa.png',
      type: 'movie'
    },
    {
      title: 'One Piece',
      category: 'IPTV Premium Abonnement VOD Streaming',
      image: '/assets/movies/onepiece.png',
      type: 'anime'
    },
    {
      title: 'Solo Leveling',
      category: 'IPTV Premium Abonnement VOD Streaming',
      image: '/assets/movies/sololeveling.png',
      type: 'anime'
    },
    {
      title: 'Daredevil Reborn',
      category: 'Disney+ IPTV Premium Abonnement VOD Streaming',
      image: '/assets/movies/DaredevilReborn.jpg',
      type: 'series'
    },
    {
      title: 'The Gorge',
      category: 'IPTV Premium Abonnement VOD Streaming',
      image: '/assets/movies/TheGorge.png',
      type: 'movie'
    },
    {
      title: 'Reacher',
      category: 'Amazon IPTV Premium Abonnement VOD Streaming',
      image: '/assets/movies/Reacher.png',
      type: 'series'
    },
    {
      title: 'The Electric State',
      category: 'Netflix IPTV Premium Abonnement VOD Streaming',
      image: '/assets/movies/TheElectricState.png',
      type: 'movie'
    },
    {
      title: 'Bob l\'éponge',
      category: 'IPTV Premium Abonnement VOD Streaming',
      image: '/assets/movies/Bobleponge.jpg',
      type: 'kids'
    },
    {
      title: 'Shangri-La Frontier',
      category: 'IPTV Premium Abonnement VOD Streaming',
      image: '/assets/movies/shangri.png',
      type: 'anime'
    },
    {
      title: 'Paddington au Pérou',
      category: 'IPTV Premium Abonnement VOD Streaming',
      image: '/assets/movies/Paddington.jpg',
      type: 'movie'
    }
  ]

  return (
    <ContentSection>
      <div className="container">
        <SectionTitle>
          <h2>{t('contentShowcase.title')}</h2>
          <p>{t('contentShowcase.subtitle')}</p>
        </SectionTitle>
        <ContentGrid 
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {contentItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              data-aos="fade-up"
              data-aos-delay={index * 50}
            >
              <ContentCard>
                <ContentImage>
                  <LazyImage 
                    src={item.image} 
                    alt={item.title}
                    placeholder="Loading..."
                    onError={(e) => {
                      e.target.src = '/assets/content/placeholder.jpg'
                    }}
                  />
                  <ContentOverlay>
                    <PlayButton>
                      <i className="fas fa-play"></i>
                    </PlayButton>
                  </ContentOverlay>
                </ContentImage>
                <ContentInfo>
                  <ContentTitle>{item.title}</ContentTitle>
                  <ContentCategory>{item.category}</ContentCategory>
                </ContentInfo>
              </ContentCard>
            </motion.div>
          ))}
        </ContentGrid>
      </div>
    </ContentSection>
  )
}

const ContentSection = styled.section`
  padding: 100px 0;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a1a 100%);
  min-height: 80vh;
`

const ContentGrid = styled.div`
  display: flex;
  gap: 25px;
  overflow-x: auto;
  padding: 30px 20px;
  position: relative;
  
  /* Hide scrollbar */
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
  }

  /* Gradient fade effects on sides */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 100%;
    background: linear-gradient(90deg, rgba(12, 12, 12, 0.9), transparent);
    z-index: 2;
    pointer-events: none;
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 100%;
    z-index: 2;
    pointer-events: none;
  }

  @media (max-width: 1200px) {
    gap: 20px;
    padding: 25px 15px;
  }

  @media (max-width: 768px) {
    gap: 15px;
    padding: 20px 10px;
  }
`

const ContentCard = styled.div`
  background: transparent;
  border-radius: 0;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 300px;
  flex-shrink: 0;
  position: relative;

  &:hover {
    transform: translateY(-15px) scale(1.02);
  }

  @media (max-width: 1200px) {
    min-width: 270px;
  }

  @media (max-width: 768px) {
    min-width: 240px;
  }
`

const ContentImage = styled.div`
  position: relative;
  height: 400px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 0;
  }

  &:hover img {
    transform: scale(1.08);
  }

  @media (max-width: 1200px) {
    height: 360px;
  }

  @media (max-width: 768px) {
    height: 320px;
  }
`

const ContentOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;

  ${ContentCard}:hover & {
    opacity: 1;
  }
`

const PlayButton = styled.div`
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(255, 107, 53, 0.4);
  position: relative;
  z-index: 3;

  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    background: linear-gradient(135deg, #ff6b35, #f7931e);
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 12px 35px rgba(255, 107, 53, 0.6);
    
    &::before {
      opacity: 0.3;
    }
  }
`

const ContentInfo = styled.div`
  padding: 25px;
  position: relative;
  z-index: 2;
  background: transparent;
`

const ContentTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 800;
  color: white;
  margin-bottom: 12px;
  line-height: 1.3;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: color 0.3s ease;

  ${ContentCard}:hover & {
    color: #ff6b35;
  }
`

const ContentCategory = styled.p`
  font-size: 0.9rem;
  color: #b0b0b0;
  line-height: 1.4;
  margin: 0;
  font-weight: 500;
  transition: color 0.3s ease;

  ${ContentCard}:hover & {
    color: #d0d0d0;
  }
`

const SectionTitle = styled.div`
  text-align: center;
  margin-bottom: 50px;

  h2 {
    font-size: 2.5rem;
    font-weight: 900;
    color: white;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #ffffff, #ff6b35);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    font-size: 1.1rem;
    color: #a0a0a0;
    margin: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 30px;
    
    h2 {
      font-size: 2rem;
    }
    
    p {
      font-size: 1rem;
    }
  }
`

export default ContentShowcase

