import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

const Checkout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [plan, setPlan] = useState('')
  const [price, setPrice] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    paymentMethod: 'card'
  })

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const planParam = searchParams.get('plan')
    const priceParam = searchParams.get('price')
    
    if (planParam && priceParam) {
      setPlan(planParam)
      setPrice(priceParam)
    } else {
      // Redirect to home if no plan selected
      navigate('/')
    }
  }, [location.search, navigate])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would integrate with your payment processor
    alert(`Payment processing for ${plan} plan at $${price}. This would integrate with Stripe, PayPal, or your preferred payment processor.`)
  }

  const pricingPlans = {
    'Monthly': { price: '19', period: '/month' },
    '6 Months': { price: '69', period: '/6 months' },
    'Yearly': { price: '99', period: '/year' }
  }

  const currentPlan = pricingPlans[plan] || { price, period: '' }

  return (
    <>
      <Header />
      <CheckoutContainer>
        <div className="container">
          <CheckoutHeader>
            <h1>Complete Your Purchase</h1>
            <p>You're just one step away from enjoying premium IPTV service</p>
          </CheckoutHeader>

          <CheckoutContent>
            <CheckoutForm>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h2>Billing Information</h2>
                <form onSubmit={handleSubmit}>
                  <FormGroup>
                    <label htmlFor="name">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <label htmlFor="phone">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </FormGroup>

                  <FormGroup>
                    <label>Payment Method</label>
                    <PaymentMethods>
                      <PaymentOption>
                        <input
                          type="radio"
                          id="card"
                          name="paymentMethod"
                          value="card"
                          checked={formData.paymentMethod === 'card'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="card">
                          <i className="fas fa-credit-card"></i>
                          Credit/Debit Card
                        </label>
                      </PaymentOption>
                      <PaymentOption>
                        <input
                          type="radio"
                          id="paypal"
                          name="paymentMethod"
                          value="paypal"
                          checked={formData.paymentMethod === 'paypal'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="paypal">
                          <i className="fab fa-paypal"></i>
                          PayPal
                        </label>
                      </PaymentOption>
                      <PaymentOption>
                        <input
                          type="radio"
                          id="crypto"
                          name="paymentMethod"
                          value="crypto"
                          checked={formData.paymentMethod === 'crypto'}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="crypto">
                          <i className="fab fa-bitcoin"></i>
                          Cryptocurrency
                        </label>
                      </PaymentOption>
                    </PaymentMethods>
                  </FormGroup>

                  <SubmitButton type="submit" className="btn btn-primary btn-large">
                    Complete Purchase - ${currentPlan.price}{currentPlan.period}
                  </SubmitButton>
                </form>
              </motion.div>
            </CheckoutForm>

            <OrderSummary>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2>Order Summary</h2>
                <PlanDetails>
                  <div>
                    <h3>{plan} Plan</h3>
                    <p>Premium IPTV Service</p>
                  </div>
                  <div>
                    <span className="price">${currentPlan.price}</span>
                    <span className="period">{currentPlan.period}</span>
                  </div>
                </PlanDetails>

                <FeaturesList>
                  <h4>What's included:</h4>
                  <ul>
                    <li><i className="fas fa-check"></i>10,000+ Channels</li>
                    <li><i className="fas fa-check"></i>4K/HD Quality</li>
                    <li><i className="fas fa-check"></i>All Devices</li>
                    <li><i className="fas fa-check"></i>24/7 Support</li>
                    <li><i className="fas fa-check"></i>No Contract</li>
                  </ul>
                </FeaturesList>

                <SecurityBadge>
                  <i className="fas fa-shield-alt"></i>
                  <span>Secure Payment - 256-bit SSL encryption</span>
                </SecurityBadge>
              </motion.div>
            </OrderSummary>
          </CheckoutContent>
        </div>
      </CheckoutContainer>
      <Footer />
    </>
  )
}

const CheckoutContainer = styled.div`
  min-height: 100vh;
  padding-top: 80px;
  background: var(--primary-bg);
`

const CheckoutHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-3xl);

  h1 {
    font-size: var(--font-size-4xl);
    margin-bottom: var(--spacing-md);
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    font-size: var(--font-size-lg);
    color: var(--text-secondary);
  }
`

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-3xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-xl);
  }
`

const CheckoutForm = styled.div`
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  border: 1px solid var(--border-color);

  h2 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-xl);
  }
`

const FormGroup = styled.div`
  margin-bottom: var(--spacing-lg);

  label {
    display: block;
    margin-bottom: var(--spacing-sm);
    font-weight: 500;
    color: var(--text-primary);
  }

  input {
    width: 100%;
    padding: var(--spacing-md);
    background: var(--secondary-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius-md);
    color: var(--text-primary);
    font-family: inherit;
    transition: border-color var(--transition-base);

    &:focus {
      outline: none;
      border-color: var(--accent-primary);
    }

    &::placeholder {
      color: var(--text-muted);
    }
  }
`

const PaymentMethods = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`

const PaymentOption = styled.div`
  input[type="radio"] {
    display: none;
  }

  label {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--secondary-bg);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-base);

    i {
      font-size: var(--font-size-lg);
      color: var(--accent-primary);
    }
  }

  input[type="radio"]:checked + label {
    border-color: var(--accent-primary);
    background: rgba(0, 120, 255, 0.1);
  }
`

const SubmitButton = styled.button`
  width: 100%;
  margin-top: var(--spacing-lg);
`

const OrderSummary = styled.div`
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  border: 1px solid var(--border-color);
  height: fit-content;

  h2 {
    font-size: var(--font-size-2xl);
    margin-bottom: var(--spacing-xl);
  }
`

const PlanDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  background: var(--secondary-bg);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-xl);

  h3 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-xs);
  }

  p {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
  }

  .price {
    font-size: var(--font-size-2xl);
    font-weight: 700;
    color: var(--accent-primary);
  }

  .period {
    color: var(--text-secondary);
    font-size: var(--font-size-sm);
    margin-left: var(--spacing-xs);
  }
`

const FeaturesList = styled.div`
  margin-bottom: var(--spacing-xl);

  h4 {
    font-size: var(--font-size-lg);
    margin-bottom: var(--spacing-md);
  }

  ul {
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
    color: var(--text-secondary);

    i {
      color: var(--accent-secondary);
    }
  }
`

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: var(--secondary-bg);
  border-radius: var(--border-radius-md);
  color: var(--text-secondary);
  font-size: var(--font-size-sm);

  i {
    color: var(--accent-secondary);
  }
`

export default Checkout

