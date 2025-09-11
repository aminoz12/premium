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
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
    { code: 'sq', name: 'Shqip', flag: '🇦🇱' }
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
        <span className="flag">{currentLanguage?.flag}</span>
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
                  <span className="flag">{language.flag}</span>
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
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  color: var(--text-primary);
  cursor: pointer;
  transition: all var(--transition-base);
  font-size: var(--font-size-sm);
  font-weight: 500;
  min-width: 120px;

  &:hover {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    transform: translateY(-1px);
  }

  .flag {
    font-size: 1.2rem;
  }

  .name {
    flex: 1;
    text-align: left;
  }

  i {
    font-size: 0.8rem;
    transition: transform var(--transition-base);
  }

  @media (max-width: 768px) {
    min-width: 100px;
    padding: var(--spacing-xs) var(--spacing-sm);
    
    .name {
      display: none;
    }
  }
`

const LanguageDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  overflow: hidden;
  margin-top: var(--spacing-xs);
  backdrop-filter: blur(20px);
`

const LanguageOption = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: all var(--transition-base);
  background: ${props => props.isSelected ? 'var(--accent-primary)' : 'transparent'};
  color: ${props => props.isSelected ? 'white' : 'var(--text-primary)'};

  &:hover {
    background: ${props => props.isSelected ? 'var(--accent-primary)' : 'var(--secondary-bg)'};
  }

  .flag {
    font-size: 1.2rem;
  }

  .name {
    flex: 1;
    font-size: var(--font-size-sm);
    font-weight: 500;
  }

  i {
    font-size: 0.8rem;
    color: ${props => props.isSelected ? 'white' : 'var(--accent-primary)'};
  }
`

export default LanguageSwitcher
