import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const Features = () => {
  const { t } = useTranslation()
  const features = [
    {
      icon: 'fas fa-tv',
      title: t('features.multiDeviceSupport'),
      description: t('features.multiDeviceDescription'),
      devices: ['fab fa-android', 'fab fa-apple', 'fab fa-windows', 'fas fa-tv']
    },
    {
      icon: 'fas fa-rocket',
      title: t('features.ultraFastStreaming'),
      description: t('features.ultraFastDescription')
    },
    {
      icon: 'fas fa-shield-alt',
      title: t('features.secureReliable'),
      description: t('features.secureReliableDescription')
    },
    {
      icon: 'fas fa-headset',
      title: t('features.support24_7'),
      description: t('features.support24_7Description')
    },
    {
      icon: 'fas fa-download',
      title: t('features.easySetup'),
      description: t('features.easySetupDescription')
    },
    {
      icon: 'fas fa-clock',
      title: t('features.catchUpTV'),
      description: t('features.catchUpTVDescription')
    }
  ]

  return (
    <FeaturesSection id="features">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <h2>{t('features.title')}</h2>
          <p>{t('features.subtitle')}</p>
        </div>
        
        <FeaturesGrid>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              data-aos="fade-up"
              data-aos-delay={100 + index * 50}
            >
              <FeatureCard>
                <FeatureIcon>
                  <i className={feature.icon}></i>
                </FeatureIcon>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                {feature.devices && (
                  <DeviceIcons>
                    {feature.devices.map((device, deviceIndex) => (
                      <i key={deviceIndex} className={device}></i>
                    ))}
                  </DeviceIcons>
                )}
              </FeatureCard>
            </motion.div>
          ))}
        </FeaturesGrid>
      </div>
    </FeaturesSection>
  )
}

const FeaturesSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: var(--primary-bg);
`

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FeatureCard = styled.div`
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all var(--transition-base);
  border: 1px solid var(--border-color);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-hover);
    border-color: var(--accent-primary);
  }

  h3 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-md);
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
  }
`

const FeatureIcon = styled.div`
  width: 80px;
  height: 80px;
  background: var(--accent-gradient);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
`

const DeviceIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);

  i {
    font-size: var(--font-size-lg);
    color: var(--accent-secondary);
  }
`

export default Features
