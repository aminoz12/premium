import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const Testimonials = () => {
  const { t } = useTranslation()
  const testimonials = [
    {
      name: t('testimonials.customer1'),
      role: t('testimonials.country1'),
      image: '/assets/testimonials/greece-flag.svg',
      rating: 5,
      text: t('testimonials.testimonial1')
    },
    {
      name: t('testimonials.customer2'),
      role: t('testimonials.country2'),
      image: '/assets/testimonials/uk-flag.svg',
      rating: 5,
      text: t('testimonials.testimonial2')
    },
    {
      name: t('testimonials.customer3'),
      role: t('testimonials.country3'),
      image: '/assets/testimonials/usa-flag.svg',
      rating: 5,
      text: t('testimonials.testimonial3')
    }
  ]

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index} 
        className="fas fa-star"
        style={{ color: index < rating ? '#ffc107' : '#333' }}
      />
    ))
  }

  return (
    <TestimonialsSection>
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <h2>{t('testimonials.title')}</h2>
          <p>{t('testimonials.subtitle')}</p>
        </div>
        
        <TestimonialsGrid>
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              data-aos="fade-up"
              data-aos-delay={100 + index * 50}
            >
              <TestimonialCard>
                <Stars>
                  {renderStars(testimonial.rating)}
                </Stars>
                <p>"{testimonial.text}"</p>
                <TestimonialAuthor>
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    onError={(e) => {
                      e.target.src = '/assets/testimonials/placeholder.jpg'
                    }}
                  />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <span>{testimonial.role}</span>
                  </div>
                </TestimonialAuthor>
              </TestimonialCard>
            </motion.div>
          ))}
        </TestimonialsGrid>
      </div>
    </TestimonialsSection>
  )
}

const TestimonialsSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: var(--primary-bg);
`

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-xl);

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const TestimonialCard = styled.div`
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  border: 1px solid var(--border-color);
  transition: all var(--transition-base);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-hover);
  }

  p {
    color: var(--text-secondary);
    font-style: italic;
    margin-bottom: var(--spacing-lg);
    line-height: 1.6;
  }
`

const Stars = styled.div`
  color: #ffc107;
  margin-bottom: var(--spacing-md);
`

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);

  img {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    object-fit: cover;
  }

  h4 {
    font-size: var(--font-size-base);
    margin-bottom: var(--spacing-xs);
  }

  span {
    font-size: var(--font-size-sm);
    color: var(--text-muted);
  }
`

export default Testimonials

