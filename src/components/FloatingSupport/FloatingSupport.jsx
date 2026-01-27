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
      <SupportMainButton onClick={handleWhatsAppClick}>
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

  @media (max-width: 768px) {
    bottom: var(--spacing-lg);
    right: var(--spacing-lg);
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

