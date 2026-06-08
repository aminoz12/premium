import React, { useRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const FloatingSupport = () => {
  const { t } = useTranslation()
  const floatingRef = useRef(null)

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/212723279328?text=Hi! I need support for Premium IPTV service', '_blank')
  }

  return (
    <FloatingContainer ref={floatingRef}>
      <TryNowLabel onClick={handleWhatsAppClick}>{t('support.tryNow')}</TryNowLabel>
      <SupportMainButton onClick={handleWhatsAppClick} aria-label={t('support.tryNow')}>
        <i className="fab fa-whatsapp"></i>
      </SupportMainButton>
    </FloatingContainer>
  )
}

const FloatingContainer = styled.div`
  position: fixed;
  bottom: var(--spacing-xl);
  right: var(--spacing-xl);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  @media (max-width: 768px) {
    bottom: var(--spacing-lg);
    right: var(--spacing-lg);
  }
`

const TryNowLabel = styled.span`
  position: relative;
  background: #25d366;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  padding: 7px 14px;
  border-radius: 14px;
  box-shadow: 0 6px 18px rgba(37, 211, 102, 0.4);
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
  transform-origin: bottom right;
  animation: tryNowWave 2.2s ease-in-out infinite;

  /* little speech-bubble tail pointing down to the icon */
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    right: 18px;
    width: 12px;
    height: 12px;
    background: #25d366;
    border-radius: 0 0 3px 0;
    transform: rotate(45deg);
  }

  @keyframes tryNowWave {
    0%, 100% { transform: translateY(0) rotate(0deg); }
    20% { transform: translateY(-4px) rotate(-3deg); }
    40% { transform: translateY(0) rotate(3deg); }
    60% { transform: translateY(-2px) rotate(-2deg); }
    80% { transform: translateY(0) rotate(1deg); }
  }
`

const SupportMainButton = styled.button`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #25d366, #128c7e);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: whatsappPulse 2s infinite;
  position: relative;
  overflow: visible;

  &:hover {
    transform: scale(1.15);
    box-shadow: 0 6px 30px rgba(37, 211, 102, 0.6);
    background: linear-gradient(135deg, #2fe576, #1ba085);
  }

  &:active {
    transform: scale(1.05);
  }

  i {
    font-size: 32px;
    color: white;
    z-index: 2;
    position: relative;
  }

  @keyframes whatsappPulse {
    0% {
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4), 0 0 0 0 rgba(37, 211, 102, 0.7);
    }
    50% {
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4), 0 0 0 10px rgba(37, 211, 102, 0);
    }
    100% {
      box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4), 0 0 0 0 rgba(37, 211, 102, 0);
    }
  }

  @media (max-width: 768px) {
    width: 56px;
    height: 56px;
    
    i {
      font-size: 28px;
    }
  }
`

const SupportOptionsFloating = styled.div`
  position: absolute;
  bottom: 80px;
  right: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);

  @media (max-width: 768px) {
    bottom: 70px;
  }
`

const SupportButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--card-bg);
  border: none;
  border-radius: var(--border-radius-md);
  text-decoration: none;
  color: var(--text-primary);
  transition: all var(--transition-base);
  box-shadow: var(--shadow);
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    transform: translateX(-5px);
    background: ${props => props.color};
  }

  i {
    font-size: var(--font-size-lg);
  }

  span {
    font-size: var(--font-size-sm);
    font-weight: 500;
  }
`

export default FloatingSupport

