import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher'

const Header = () => {
  const { t } = useTranslation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
      
      // Update active section based on scroll position
      const sections = ['home', 'channels', 'features', 'pricing', 'support']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    // If support is clicked, redirect to WhatsApp
    if (sectionId === 'support') {
      window.open('https://wa.me/212723279328?text=Hi! I need support for IPTV service', '_blank')
      setIsMobileMenuOpen(false)
      return
    }
    
    const element = document.getElementById(sectionId)
    if (element) {
      const headerOffset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
    setIsMobileMenuOpen(false)
  }

  const navItems = [
    { id: 'home', label: t('header.home') },
    { id: 'channels', label: t('header.channels') },
    { id: 'features', label: t('header.features') },
    { id: 'pricing', label: t('header.pricing') },
    { id: 'support', label: t('header.support') }
  ]

  return (
    <Navbar isScrolled={isScrolled}>
      <NavContainer>
        <NavLogo>
          <LogoImage>
            <img src="/assets/logo.png" alt="PREMIUM IPTV" />
          </LogoImage>
          <LogoText>
            <span className="brand">{t('header.brand')}</span>
          </LogoText>
        </NavLogo>
        
        <NavMenu isOpen={isMobileMenuOpen}>
          {/* Desktop Navigation */}
          <DesktopNav>
            {navItems.map((item) => (
              <NavLink 
                key={item.id}
                active={activeSection === item.id}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </NavLink>
            ))}
          </DesktopNav>
          
          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <NavLink 
                      active={activeSection === item.id}
                      onClick={() => scrollToSection(item.id)}
                    >
                      {item.label}
                    </NavLink>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                >
                  <MobileLanguageSwitcher>
                    <LanguageSwitcher />
                  </MobileLanguageSwitcher>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </NavMenu>
        
        <NavActions>
          <LanguageSwitcher />
          <GetStartedButton 
            className="btn btn-primary"
            onClick={() => scrollToSection('pricing')}
          >
            <i className="fas fa-rocket"></i>
            {t('header.getStarted')}
          </GetStartedButton>
        </NavActions>
        
        <Hamburger 
          isOpen={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </Hamburger>
      </NavContainer>
    </Navbar>
  )
}

const Navbar = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  height: 80px;
  background: ${props => props.isScrolled 
    ? 'rgba(12, 12, 12, 0.95)' 
    : 'rgba(12, 12, 12, 0.8)'};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.isScrolled 
    ? 'var(--border-color)' 
    : 'transparent'};
  z-index: 1000;
  transition: var(--transition-all);
  box-shadow: ${props => props.isScrolled 
    ? 'var(--shadow-lg)' 
    : 'none'};
`

const NavContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4) var(--spacing-6);
  max-width: 1280px;
  margin: 0 auto;
`

const NavLogo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  text-decoration: none;
  transition: var(--transition-all);

  &:hover {
    transform: scale(1.05);
  }
`

const LogoImage = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: var(--transition-all);

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    object-position: center;
  }

  &:hover {
    transform: scale(1.05);
  }
`

const LogoText = styled.div`
  display: flex;
  flex-direction: column;
  line-height: var(--line-height-tight);

  .brand {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    color: var(--text-primary);
  }

  .tagline {
    font-size: var(--font-size-xs);
    color: var(--text-muted);
    font-weight: var(--font-weight-medium);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`

const NavMenu = styled.div`
  display: flex;
  gap: var(--spacing-2);

  @media (max-width: 768px) {
    position: fixed;
    top: ${props => props.isOpen ? '80px' : '-100%'};
    left: 0;
    width: 100%;
    background: var(--secondary-bg);
    flex-direction: column;
    padding: var(--spacing-6);
    transition: top var(--transition-all);
    border-top: 1px solid var(--border-color);
    backdrop-filter: blur(20px);
    box-shadow: var(--shadow-lg);
  }
`

const DesktopNav = styled.div`
  display: flex;
  gap: var(--spacing-2);

  @media (max-width: 768px) {
    display: none;
  }
`

const NavLink = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.active ? 'var(--accent-primary)' : 'transparent'};
  color: ${props => props.active ? 'var(--text-primary)' : 'var(--text-secondary)'};
  border: none;
  padding: var(--spacing-3) var(--spacing-4);
  border-radius: var(--border-radius-lg);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: var(--transition-all);
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  &:hover {
    background: ${props => props.active ? 'var(--accent-primary)' : 'var(--hover-bg)'};
    color: var(--text-primary);
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    justify-content: flex-start;
    padding: var(--spacing-4);
    font-size: var(--font-size-base);
  }
`

const NavActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);

  @media (max-width: 768px) {
    display: none;
  }
`

const GetStartedButton = styled.button`
  /* Inherits styles from global .btn .btn-primary */
`

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  cursor: pointer;
  gap: 4px;
  padding: var(--spacing-2);
  border-radius: var(--border-radius-md);
  transition: var(--transition-all);

  &:hover {
    background: var(--hover-bg);
  }

  span {
    width: 24px;
    height: 2px;
    background: var(--text-primary);
    transition: var(--transition-all);
    border-radius: var(--border-radius-full);

    &:nth-child(1) {
      transform: ${props => props.isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'};
    }

    &:nth-child(2) {
      opacity: ${props => props.isOpen ? '0' : '1'};
    }

    &:nth-child(3) {
      transform: ${props => props.isOpen ? 'rotate(-45deg) translate(7px, -6px)' : 'none'};
    }
  }

  @media (max-width: 768px) {
    display: flex;
  }
`

const MobileLanguageSwitcher = styled.div`
  padding: var(--spacing-sm) 0;
  border-top: 1px solid var(--border-color);
  margin-top: var(--spacing-sm);
  
  @media (min-width: 769px) {
    display: none;
  }
`

export default Header
