import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en')
  const dropdownRef = useRef(null)

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'el', name: 'Ελληνικά' },
    { code: 'sq', name: 'Shqip' }
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (languageCode) => {
    setSelectedLanguage(languageCode)
    setIsOpen(false)
    i18n.changeLanguage(languageCode)
  }

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage)

  return (
    <LanguageContainer ref={dropdownRef}>
      <LanguageButton 
        onClick={() => setIsOpen(!isOpen)}
        title={currentLanguage?.name}
      >
        <span className="name">{currentLanguage?.name}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'}`}></i>
      </LanguageButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <LanguageDropdown>
              {languages.map((language) => (
                <LanguageOption
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  isSelected={selectedLanguage === language.code}
                >
                  <span className="name">{language.name}</span>
                  {selectedLanguage === language.code && (
                    <i className="fas fa-check"></i>
                  )}
                </LanguageOption>
              ))}
            </LanguageDropdown>
          </motion.div>
        )}
      </AnimatePresence>
    </LanguageContainer>
  )
}

const LanguageContainer = styled.div`
  position: relative;
  z-index: 1001;
`

const LanguageButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-2) var(--spacing-3);
  background: linear-gradient(135deg, var(--card-bg) 0%, var(--surface-bg) 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-all);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  min-width: 100px;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-sm);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s;
  }

  &:hover {
    background: linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%);
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-lg);
    color: var(--text-primary);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: var(--shadow-md);
  }

  .name {
    flex: 1;
    text-align: left;
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.025em;
  }

  i {
    font-size: 0.75rem;
    transition: transform var(--transition-all);
    opacity: 0.8;
  }

  @media (max-width: 768px) {
    min-width: 80px;
    padding: var(--spacing-2);
    
    .name {
      display: block;
      font-size: var(--font-size-xs);
    }
  }
`

const LanguageDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, var(--card-bg) 0%, var(--surface-bg) 100%);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  margin-top: var(--spacing-2);
  backdrop-filter: blur(20px);
  z-index: 1002;
  
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 0;
    right: 0;
    height: 1px;
    background: var(--accent-gradient);
  }
`

const LanguageOption = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  padding: var(--spacing-3) var(--spacing-4);
  cursor: pointer;
  transition: all var(--transition-all);
  background: ${props => props.isSelected 
    ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' 
    : 'transparent'};
  color: ${props => props.isSelected ? 'white' : 'var(--text-primary)'};
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
    transition: left 0.3s;
  }

  &:hover {
    background: ${props => props.isSelected 
      ? 'linear-gradient(135deg, var(--accent-primary) 0%, var(--accent-secondary) 100%)' 
      : 'linear-gradient(135deg, var(--hover-bg) 0%, var(--secondary-bg) 100%)'};
    transform: translateX(4px);
    
    &::before {
      left: 100%;
    }
  }

  &:first-child {
    border-radius: var(--border-radius-lg) var(--border-radius-lg) 0 0;
  }

  &:last-child {
    border-radius: 0 0 var(--border-radius-lg) var(--border-radius-lg);
  }

  .name {
    flex: 1;
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    letter-spacing: 0.025em;
  }

  i {
    font-size: 0.8rem;
    color: ${props => props.isSelected ? 'white' : 'var(--accent-primary)'};
    opacity: ${props => props.isSelected ? '1' : '0.7'};
    transition: all var(--transition-all);
  }

  &:hover i {
    opacity: 1;
    transform: scale(1.1);
  }
`

export default LanguageSwitcher
