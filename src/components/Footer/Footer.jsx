import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

const Footer = () => {
  const { t } = useTranslation()
  const scrollToSection = (sectionId) => {
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
  }

  const paymentMethods = [
    { name: 'PayPal', logo: '/assets/payment/paypal.svg' },
    { name: 'Visa', logo: '/assets/payment/visa.svg' },
    { name: 'MasterCard', logo: '/assets/payment/mastercard.svg' },
    { name: 'Revolut', logo: '/assets/payment/revolut.svg' },
    { name: 'Crypto', logo: '/assets/payment/crypto.svg' }
  ]

  const socialLinks = [
    { icon: 'fab fa-facebook', url: '#' },
    { icon: 'fab fa-twitter', url: '#' },
    { icon: 'fab fa-instagram', url: '#' },
    { icon: 'fab fa-youtube', url: '#' }
  ]

  return (
    <FooterSection>
      <div className="container">
        <FooterContent>
          <FooterColumn>
            <FooterLogo>
              <img src="/assets/logo.png" alt={t('header.brand')} />
              <span>{t('header.brand')}</span>
            </FooterLogo>
            <p>
              {t('footer.description')}
            </p>
            <SocialLinks>
              {socialLinks.map((social, index) => (
                <a key={index} href={social.url} target="_blank" rel="noopener noreferrer">
                  <i className={social.icon}></i>
                </a>
              ))}
            </SocialLinks>
          </FooterColumn>
          
          <FooterColumn>
            <h3>Quick Links</h3>
            <ul>
              <li><button onClick={() => scrollToSection('home')}>{t('header.home')}</button></li>
              <li><button onClick={() => scrollToSection('channels')}>{t('header.channels')}</button></li>
              <li><button onClick={() => scrollToSection('features')}>{t('header.features')}</button></li>
              <li><button onClick={() => scrollToSection('pricing')}>{t('header.pricing')}</button></li>
              <li><button onClick={() => scrollToSection('support')}>{t('header.support')}</button></li>
            </ul>
          </FooterColumn>
          
          <FooterColumn>
            <h3>{t('header.support')}</h3>
            <ul>
              <li><a href="#">{t('footer.setupGuide')}</a></li>
              <li><a href="#">{t('footer.faq')}</a></li>
              <li><a href="#">{t('footer.contactUs')}</a></li>
              <li><a href="https://wa.me/212723279328?text=Hi! I need live chat support for IPTV service" target="_blank" rel="noopener noreferrer">{t('footer.liveChat')}</a></li>
              <li><a href="#">{t('footer.tutorials')}</a></li>
            </ul>
          </FooterColumn>
          
          <FooterColumn>
            <h3>Legal</h3>
            <ul>
              <li><a href="#">{t('footer.termsOfService')}</a></li>
              <li><a href="#">{t('footer.privacyPolicy')}</a></li>
              <li><a href="#">{t('footer.refundPolicy')}</a></li>
              <li><a href="#">{t('footer.dmca')}</a></li>
            </ul>
          </FooterColumn>
        </FooterContent>
        
        <FooterBottom>
          <p>{t('footer.copyright')}</p>
          <PaymentIconsFooter>
            {paymentMethods.map((method, index) => (
              <img 
                key={index}
                src={method.logo} 
                alt={method.name}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            ))}
          </PaymentIconsFooter>
        </FooterBottom>
      </div>
    </FooterSection>
  )
}

const FooterSection = styled.footer`
  background: var(--primary-bg);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-3xl) 0 var(--spacing-lg);
`

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`

const FooterLogo = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xl);
  font-weight: 700;
  margin-bottom: var(--spacing-md);

  img {
    width: 48px;
    height: 48px;
  }
`

const SocialLinks = styled.div`
  display: flex;
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    justify-content: center;
  }

  a {
    width: 40px;
    height: 40px;
    background: var(--card-bg);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-secondary);
    transition: all var(--transition-base);
    text-decoration: none;

    &:hover {
      background: var(--accent-primary);
      color: var(--text-primary);
      transform: translateY(-3px);
    }
  }
`

const FooterColumn = styled.div`
  h3 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-lg);
  }

  p {
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: var(--spacing-lg);
  }

  ul {
    list-style: none;
  }

  ul li {
    margin-bottom: var(--spacing-sm);
  }

  ul li a,
  ul li button {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color var(--transition-base);
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
    font-size: inherit;
    padding: 0;

    &:hover {
      color: var(--text-primary);
    }
  }
`

const FooterBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: var(--spacing-md);

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }

  p {
    color: var(--text-muted);
  }
`

const PaymentIconsFooter = styled.div`
  display: flex;
  gap: var(--spacing-lg);
  flex-wrap: wrap;

  img {
    height: 35px;
    width: auto;
    opacity: 0.8;
    transition: all var(--transition-base);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));

    &:hover {
      opacity: 1;
      transform: scale(1.05);
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }
  }
`

export default Footer
