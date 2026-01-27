import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const Channels = () => {
  const { t } = useTranslation()
  // All channel images
  const channelImages = [
    { name: 'Cosmote', logo: '/assets/channels/cosmote-removebg-preview.png' },
    { name: 'TNT', logo: '/assets/channels/images__5_-removebg-preview (1).png' },
    { name: 'Nova', logo: '/assets/channels/nova-removebg-preview.png' },
    { name: 'SuperSport', logo: '/assets/channels/png-clipart-supersport-lyngsat-logo-south-africa-dstv-supersport-lyngsat-removebg-preview.png' },
    { name: 'DAZN', logo: '/assets/channels/téléchargé__1_-removebg-preview.png' },
    { name: 'BEIN SPORT', logo: '/assets/channels/téléchargé__2_-removebg-preview.png' }
  ]

  const sportsHighlights = [
    {
      icon: 'fas fa-futbol',
      title: t('sports.football'),
      description: t('sports.footballDescription')
    },
    {
      icon: 'fas fa-flag-checkered',
      title: t('sports.formula1'),
      description: t('sports.formula1Description')
    },
    {
      icon: 'fas fa-basketball-ball',
      title: t('sports.basketball'),
      description: t('sports.basketballDescription')
    },
    {
      icon: 'fas fa-table-tennis',
      title: t('sports.tennis'),
      description: t('sports.tennisDescription')
    }
  ]

  return (
    <ChannelsSection id="channels">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <h2>{t('channels.title')}</h2>
          <p>{t('channels.subtitle')}</p>
        </div>
        
        <ChannelCarouselContainer>
          <ChannelCarousel>
            {/* Original channels */}
            {channelImages.map((channel, index) => (
              <ChannelItem key={`${channel.name}-${index}`}>
                <ChannelImageWrapper>
                  <img 
                    src={channel.logo} 
                    alt={`${channel.name} IPTV Channel - Premium IPTV Service`}
                    loading={index < 3 ? 'eager' : 'lazy'}
                    onError={(e) => {
                      // Show fallback with channel initial
                      const img = e.target
                      img.style.display = 'none'
                      const wrapper = img.parentElement
                      if (wrapper && !wrapper.querySelector('.channel-fallback')) {
                        const fallback = document.createElement('div')
                        fallback.className = 'channel-fallback'
                        fallback.textContent = channel.name.charAt(0)
                        wrapper.appendChild(fallback)
                      }
                    }}
                    onLoad={(e) => {
                      // Ensure image is visible when loaded
                      e.target.style.opacity = '1'
                      e.target.style.display = 'block'
                    }}
                  />
                </ChannelImageWrapper>
                <ChannelName>{channel.name}</ChannelName>
              </ChannelItem>
            ))}
            {/* Duplicate channels for seamless loop */}
            {channelImages.map((channel, index) => (
              <ChannelItem key={`${channel.name}-duplicate-${index}`}>
                <ChannelImageWrapper>
                  <img 
                    src={channel.logo} 
                    alt={`${channel.name} IPTV Channel - Premium IPTV Service`}
                    loading="lazy"
                    onError={(e) => {
                      // Show fallback with channel initial
                      const img = e.target
                      img.style.display = 'none'
                      const wrapper = img.parentElement
                      if (wrapper && !wrapper.querySelector('.channel-fallback')) {
                        const fallback = document.createElement('div')
                        fallback.className = 'channel-fallback'
                        fallback.textContent = channel.name.charAt(0)
                        wrapper.appendChild(fallback)
                      }
                    }}
                    onLoad={(e) => {
                      // Ensure image is visible when loaded
                      e.target.style.opacity = '1'
                      e.target.style.display = 'block'
                    }}
                  />
                </ChannelImageWrapper>
                <ChannelName>{channel.name}</ChannelName>
              </ChannelItem>
            ))}
          </ChannelCarousel>
        </ChannelCarouselContainer>
        
        <SportsHighlights data-aos="fade-up">
          <h3>{t('sports.liveCoverage')}</h3>
          <SportsGrid>
            {sportsHighlights.map((sport, index) => (
              <motion.div
                key={sport.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                data-aos="fade-up"
                data-aos-delay={100 + index * 50}
              >
                <SportCard>
                  <SportIconWrapper>
                    <i className={sport.icon}></i>
                  </SportIconWrapper>
                  <h4>{sport.title}</h4>
                  <p>{sport.description}</p>
                </SportCard>
              </motion.div>
            ))}
          </SportsGrid>
        </SportsHighlights>
      </div>
    </ChannelsSection>
  )
}

const ChannelsSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: var(--secondary-bg);
`

const ChannelCarouselContainer = styled.div`
  position: relative;
  margin: var(--spacing-3xl) 0;
  overflow: hidden;
  padding: var(--spacing-lg) 0;
`

const ChannelCarousel = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) 0;
  animation: scrollChannels 20s linear infinite;
  
  @keyframes scrollChannels {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
`

const ChannelImageWrapper = styled.div`
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-sm);
  position: relative;
  
  img {
    width: 100%;
    max-width: 120px;
    height: 100%;
    object-fit: contain;
    object-position: center;
    border-radius: var(--border-radius-sm);
    transition: all 0.3s ease;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    display: block;
    opacity: 1;
  }
  
  .channel-fallback {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(247, 147, 30, 0.2));
    border-radius: var(--border-radius-sm);
    font-size: 2rem;
    font-weight: bold;
    color: var(--accent-primary);
    text-transform: uppercase;
    border: 2px solid rgba(255, 107, 53, 0.3);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  
  @media (max-width: 1024px) {
    height: 110px;
    
    img {
      max-width: 110px;
    }
  }

  @media (max-width: 768px) {
    height: 100px;
    
    img {
      max-width: 100px;
    }
    
    .channel-fallback {
      font-size: 1.5rem;
    }
  }

  @media (max-width: 480px) {
    height: 90px;
    
    img {
      max-width: 90px;
    }
    
    .channel-fallback {
      font-size: 1.25rem;
    }
  }
`

const ChannelItem = styled.div`
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(255, 107, 53, 0.05) 100%);
  border-radius: var(--border-radius-xl);
  padding: var(--spacing-md);
  text-align: center;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  border: 1px solid rgba(255, 107, 53, 0.2);
  min-width: 160px;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.1),
    0 0 0 0 rgba(255, 107, 53, 0);
  
  /* Animated gradient border on hover */
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, #ff6b35, #f7931e, #ff8c42, #ff6b35);
    background-size: 200% 200%;
    border-radius: var(--border-radius-xl);
    opacity: 0;
    z-index: -1;
    transition: opacity 0.4s ease;
    animation: gradientRotate 3s linear infinite;
  }
  
  @keyframes gradientRotate {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  &:hover {
    transform: translateY(-10px) scale(1.1);
    box-shadow: 
      0 25px 50px rgba(255, 107, 53, 0.5),
      0 0 40px rgba(255, 107, 53, 0.3),
      inset 0 0 20px rgba(255, 107, 53, 0.1);
    border-color: var(--accent-primary);
    
    &::after {
      opacity: 1;
    }
  }

  &:hover ${ChannelImageWrapper} img {
    transform: scale(1.1) rotateZ(2deg);
    filter: drop-shadow(0 8px 16px rgba(255, 107, 53, 0.3));
  }

  @media (max-width: 1024px) {
    min-width: 140px;
    padding: var(--spacing-md);
    
    img {
      max-width: 110px;
      height: 110px;
    }
  }

  @media (max-width: 768px) {
    min-width: 120px;
    padding: var(--spacing-sm);
    
    img {
      max-width: 100px;
      height: 100px;
    }
  }

  @media (max-width: 480px) {
    min-width: 110px;
    padding: var(--spacing-xs);
    
    img {
      max-width: 90px;
      height: 90px;
    }
  }
`

const ChannelName = styled.span`
  display: block;
  font-size: var(--font-size-xs);
  color: var(--text-primary);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  margin-top: var(--spacing-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: all 0.3s ease;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);

  ${ChannelItem}:hover & {
    color: var(--accent-primary);
    text-shadow: 0 0 8px rgba(255, 107, 53, 0.5);
    transform: scale(1.05);
  }

  @media (max-width: 768px) {
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    font-size: 0.6rem;
  }
`

const SportsHighlights = styled.div`
  h3 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-xl);
    text-align: center;

    @media (max-width: 768px) {
      font-size: var(--font-size-xl);
      margin-bottom: var(--spacing-lg);
    }

    @media (max-width: 480px) {
      font-size: var(--font-size-lg);
      margin-bottom: var(--spacing-md);
    }
  }
`

const SportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-md);
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }

  @media (max-width: 480px) {
    gap: var(--spacing-xs);
  }
`

const SportCard = styled.div`
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all var(--transition-base);
  border: 1px solid var(--border-color);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
  }
`

const SportIconWrapper = styled.div`
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(247, 147, 30, 0.1));
  border-radius: 50%;
  border: 2px solid rgba(255, 107, 53, 0.3);
  margin: 0 auto var(--spacing-md);
  transition: all 0.3s ease;
  
  i {
    font-size: var(--font-size-3xl);
    color: var(--accent-primary);
    display: block;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-2xl);
    }

    @media (max-width: 480px) {
      font-size: var(--font-size-xl);
    }
  }
  
  ${SportCard}:hover & {
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(247, 147, 30, 0.2));
    border-color: var(--accent-primary);
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 8px 20px rgba(255, 107, 53, 0.3);
  }

  h4 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);

    @media (max-width: 768px) {
      font-size: var(--font-size-lg);
    }

    @media (max-width: 480px) {
      font-size: var(--font-size-base);
    }
  }

  p {
    color: var(--text-secondary);

    @media (max-width: 768px) {
      font-size: var(--font-size-sm);
    }

    @media (max-width: 480px) {
      font-size: 0.75rem;
    }
  }

  @media (max-width: 1024px) {
    padding: var(--spacing-lg);
  }

  @media (max-width: 768px) {
    padding: var(--spacing-md);
  }

  @media (max-width: 480px) {
    padding: var(--spacing-sm);
  }
`

export default Channels
