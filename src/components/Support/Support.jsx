import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const Support = () => {
  const { t } = useTranslation()
  const supportOptions = [
    {
      icon: 'fab fa-whatsapp',
      title: t('support.whatsappTitle'),
      description: t('support.whatsappDescription'),
      color: '#25d366',
      buttonText: t('support.whatsapp'),
      action: () => window.open('https://wa.me/212723279328?text=Hi! I need help with IPTV service', '_blank')
    },
    {
      icon: 'fab fa-telegram',
      title: t('support.telegramTitle'),
      description: t('support.telegramDescription'),
      color: '#0088cc',
      buttonText: t('support.telegram'),
      action: () => window.open('https://t.me/premiumiptvsupport', '_blank')
    },
    {
      icon: 'fas fa-envelope',
      title: t('support.emailTitle'),
      description: t('support.emailDescription'),
      color: 'var(--accent-primary)',
      buttonText: t('support.email'),
      action: () => window.open('mailto:sam91bel@gmail.com', '_blank')
    }
  ]

  return (
    <SupportSection id="support">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <h2>{t('support.title')}</h2>
          <p>{t('support.subtitle')}</p>
        </div>
        
        <SupportOptions>
          {supportOptions.map((option, index) => (
            <motion.div
              key={option.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              data-aos="fade-up"
              data-aos-delay={100 + index * 50}
            >
              <SupportCard>
                <SupportIcon color={option.color}>
                  <i className={option.icon}></i>
                </SupportIcon>
                <h3>{option.title}</h3>
                <p>{option.description}</p>
                <button className="btn btn-primary" onClick={option.action}>
                  {option.buttonText}
                </button>
              </SupportCard>
            </motion.div>
          ))}
        </SupportOptions>
      </div>
    </SupportSection>
  )
}

const SupportSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: var(--primary-bg);
`

const SupportOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const SupportCard = styled.div`
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  text-align: center;
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);
  cursor: pointer;

  &:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-hover);
  }

  h3 {
    font-size: var(--font-size-xl);
    margin-bottom: var(--spacing-sm);
  }

  p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-lg);
  }
`

const SupportIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--spacing-lg);
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
  background: ${props => props.color};
`

export default Support

