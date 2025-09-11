import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LazyImage from '../LazyImage/LazyImage'

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
                <LazyImage 
                  src={channel.logo} 
                  alt={channel.name}
                  placeholder="Loading..."
                  onError={(e) => {
                    e.target.src = '/assets/channels/placeholder.png'
                  }}
                />
                <ChannelName>{channel.name}</ChannelName>
              </ChannelItem>
            ))}
            {/* Duplicate channels for seamless loop */}
            {channelImages.map((channel, index) => (
              <ChannelItem key={`${channel.name}-duplicate-${index}`}>
                <LazyImage 
                  src={channel.logo} 
                  alt={channel.name}
                  placeholder="Loading..."
                  onError={(e) => {
                    e.target.src = '/assets/channels/placeholder.png'
                  }}
                />
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
                  <i className={sport.icon}></i>
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

const ChannelItem = styled.div`
  background: linear-gradient(135deg, var(--card-bg) 0%, rgba(255, 107, 53, 0.05) 100%);
  border-radius: var(--border-radius-lg);
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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-8px) scale(1.08);
    box-shadow: 
      0 20px 40px rgba(255, 107, 53, 0.4),
      0 0 30px rgba(255, 107, 53, 0.2);
    border-color: var(--accent-primary);
  }

  img {
    width: 100%;
    max-width: 120px;
    height: 120px;
    object-fit: contain;
    object-position: center;
    border-radius: var(--border-radius-sm);
    margin: 0 auto var(--spacing-sm) auto;
    transition: all 0.3s ease;
    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    display: block;
  }

  &:hover img {
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

  i {
    font-size: var(--font-size-3xl);
    color: var(--accent-primary);
    margin-bottom: var(--spacing-md);

    @media (max-width: 768px) {
      font-size: var(--font-size-2xl);
      margin-bottom: var(--spacing-sm);
    }

    @media (max-width: 480px) {
      font-size: var(--font-size-xl);
    }
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
