import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const FloatingSupport = () => {
  const { t } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const floatingRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (floatingRef.current && !floatingRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const supportOptions = [
    {
      icon: 'fab fa-whatsapp',
      title: 'Live Chat',
      color: '#25d366',
      action: () => {
        // Redirect to WhatsApp for live chat
        window.open('https://wa.me/212723279328?text=Hi! I need live chat support for IPTV service', '_blank')
      }
    }
  ]

  return (
    <FloatingContainer ref={floatingRef}>
      <SupportMainButton onClick={() => setIsOpen(!isOpen)}>
        <i className="fas fa-headset"></i>
      </SupportMainButton>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <SupportOptionsFloating>
              {supportOptions.map((option, index) => (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <SupportButton 
                    color={option.color}
                    onClick={option.action}
                  >
                    <i className={option.icon}></i>
                    <span>{option.title}</span>
                  </SupportButton>
                </motion.div>
              ))}
            </SupportOptionsFloating>
          </motion.div>
        )}
      </AnimatePresence>
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
  width: 60px;
  height: 60px;
  background: var(--accent-primary);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: all var(--transition-base);
  animation: pulse 2s infinite;

  &:hover {
    transform: scale(1.1);
  }

  i {
    font-size: var(--font-size-xl);
    color: var(--text-primary);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 rgba(0, 120, 255, 0.7);
    }
    70% {
      box-shadow: 0 0 0 20px rgba(0, 120, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(0, 120, 255, 0);
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

