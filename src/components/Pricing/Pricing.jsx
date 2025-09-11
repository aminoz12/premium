import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const Pricing = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const pricingPlans = [
    {
      name: 'PREMIUM',
      price: '25',
      period: t('pricing.quarterly'),
      features: [
        t('features.tvChannels'),
        t('features.movies'),
        t('features.series'),
        t('features.multipleLanguages'),
        t('features.regularUpdates'),
        t('features.ultraQuality'),
        t('features.stability'),
        t('features.compatibleApps'),
        t('features.allDevicesSupported'),
        t('features.worldwideService')
      ],
      popular: false,
      color: '#ff6b35'
    },
    {
      name: 'PREMIUM',
      price: '38',
      period: t('pricing.monthly') + ' x6',
      features: [
        t('features.tvChannels'),
        t('features.movies'),
        t('features.series'),
        t('features.multipleLanguages'),
        t('features.regularUpdates'),
        t('features.ultraQuality'),
        t('features.stability'),
        t('features.compatibleApps'),
        t('features.allDevicesSupported'),
        t('features.worldwideService')
      ],
      popular: true,
      color: '#ff6b35',
      badge: t('pricing.bestValue')
    },
    {
      name: 'PREMIUM',
      price: '62',
      period: t('pricing.yearly'),
      features: [
        t('features.tvChannels'),
        t('features.movies'),
        t('features.series'),
        t('features.multipleLanguages'),
        t('features.regularUpdates'),
        t('features.ultraQuality'),
        t('features.stability'),
        t('features.compatibleApps'),
        t('features.allDevicesSupported'),
        t('features.worldwideService')
      ],
      popular: false,
      color: '#ff6b35'
    }
  ]

  const paymentMethods = [
    { name: 'PayPal', logo: '/assets/payment/paypal.svg' },
    { name: 'Visa', logo: '/assets/payment/visa.svg' },
    { name: 'MasterCard', logo: '/assets/payment/mastercard.svg' },
    { name: 'Revolut', logo: '/assets/payment/revolut.svg' },
    { name: 'Crypto', logo: '/assets/payment/crypto.svg' }
  ]

  const handlePlanSelection = (plan) => {
    // Redirect to WhatsApp for subscription
    window.open(`https://wa.me/212723279328?text=Hi! I want to subscribe to the ${plan.name} plan for $${plan.price}${plan.period}`, '_blank')
  }

  return (
    <PricingSection id="pricing">
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <h2>{t('pricing.title')}</h2>
        </div>
        
        <PricingGrid>
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              data-aos="fade-up"
              data-aos-delay={100 + index * 50}
            >
              <PricingCard popular={plan.popular}>
                {plan.badge && <PopularBadge>{plan.badge}</PopularBadge>}
                
                <PlanHeader>
                  <h3>{plan.name}</h3>
                  <Price>
                    <span className="amount">${plan.price}</span>
                    <span className="period">{plan.period}</span>
                  </Price>
                </PlanHeader>
                
                <PlanFeatures>
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex}>
                      <i className="fas fa-check"></i>
                      {feature}
                    </li>
                  ))}
                </PlanFeatures>
                
                <button 
                  className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => handlePlanSelection(plan)}
                >
                  {t('pricing.subscribe')}
                </button>
              </PricingCard>
            </motion.div>
          ))}
        </PricingGrid>
        
        <PaymentMethods data-aos="fade-up" data-aos-delay="300">
          <p>{t('pricing.securePayment')}</p>
          <PaymentIcons>
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
          </PaymentIcons>
        </PaymentMethods>
      </div>
    </PricingSection>
  )
}

const PricingSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: var(--secondary-bg);
`

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-2xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
`

const PricingCard = styled.div`
  background: linear-gradient(145deg, #1a1a1a, #2a2a2a);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  transition: all 0.3s ease;
  border: 2px solid ${props => props.popular ? '#ff6b35' : '#404040'};
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    border-color: #ff6b35;
  }

  ${props => props.popular && `
    transform: scale(1.05);
    background: linear-gradient(145deg, #2a1a1a, #3a2a2a);
    border-color: #ff6b35;
    box-shadow: 0 15px 35px rgba(255, 107, 53, 0.2);
    
    &:hover {
      transform: scale(1.05) translateY(-10px);
      box-shadow: 0 25px 45px rgba(255, 107, 53, 0.3);
    }
  `}

  @media (max-width: 768px) {
    ${props => props.popular && `
      transform: none;
      
      &:hover {
        transform: translateY(-10px);
      }
    `}
  }
`

const PopularBadge = styled.div`
  position: absolute;
  top: 20px;
  right: -30px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: white;
  padding: 8px 40px;
  font-size: 12px;
  font-weight: 700;
  transform: rotate(45deg);
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3);
`

const PlanHeader = styled.div`
  margin-bottom: 30px;

  h3 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #ff6b35;
    margin-bottom: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`

const Price = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;

  .amount {
    font-size: 3.5rem;
    font-weight: 900;
    color: white;
    line-height: 1;
    margin-bottom: 5px;
  }

  .period {
    font-size: 1rem;
    color: #a0a0a0;
    font-weight: 500;
  }

  @media (max-width: 480px) {
    .amount {
      font-size: 3rem;
    }
  }
`

const Savings = styled.div`
  background: var(--accent-secondary);
  color: var(--primary-bg);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
`

const PlanFeatures = styled.ul`
  list-style: none;
  margin-bottom: var(--spacing-xl);
  text-align: left;

  li {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }

  i {
    color: var(--accent-secondary);
  }
`

const PaymentMethods = styled.div`
  text-align: center;

  p {
    color: var(--text-primary);
    font-size: var(--font-size-lg);
    font-weight: var(--font-weight-semibold);
    margin-bottom: var(--spacing-lg);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
`

const PaymentIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
  padding: var(--spacing-lg) 0;

  img {
    height: 45px;
    width: auto;
    opacity: 0.8;
    transition: all var(--transition-base);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));

    &:hover {
      opacity: 1;
      transform: scale(1.1);
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }
  }
`

export default Pricing
