import React, { useState } from 'react'
import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const FAQ = () => {
  const { t } = useTranslation()
  const [activeFAQ, setActiveFAQ] = useState(null)

  const faqData = [
    {
      question: t('faq.question1'),
      answer: t('faq.answer1')
    },
    {
      question: t('faq.question2'),
      answer: t('faq.answer2')
    },
    {
      question: t('faq.question3'),
      answer: t('faq.answer3')
    },
    {
      question: t('faq.question4'),
      answer: t('faq.answer4')
    },
    {
      question: t('faq.question5'),
      answer: t('faq.answer5')
    },
    {
      question: t('faq.question6'),
      answer: t('faq.answer6')
    }
  ]

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? null : index)
  }

  return (
    <FAQSection>
      <div className="container">
        <div className="section-header" data-aos="fade-up">
          <h2>{t('faq.title')}</h2>
          <p>{t('faq.subtitle')}</p>
        </div>
        
        <FAQContainer>
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              data-aos="fade-up"
              data-aos-delay={100 + index * 50}
            >
              <FAQItem active={activeFAQ === index}>
                <FAQQuestion onClick={() => toggleFAQ(index)}>
                  <h3>{faq.question}</h3>
                  <i className={`fas fa-chevron-down ${activeFAQ === index ? 'active' : ''}`}></i>
                </FAQQuestion>
                <AnimatePresence>
                  {activeFAQ === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <FAQAnswer>
                        <p>{faq.answer}</p>
                      </FAQAnswer>
                    </motion.div>
                  )}
                </AnimatePresence>
              </FAQItem>
            </motion.div>
          ))}
        </FAQContainer>
      </div>
    </FAQSection>
  )
}

const FAQSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background: var(--secondary-bg);
`

const FAQContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

const FAQItem = styled.div`
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
  transition: all var(--transition-base);

  &:hover {
    border-color: var(--accent-primary);
  }
`

const FAQQuestion = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  cursor: pointer;
  background: var(--card-bg);
  transition: background var(--transition-base);

  &:hover {
    background: var(--hover-bg);
  }

  h3 {
    font-size: var(--font-size-lg);
    font-weight: 600;
  }

  i {
    transition: transform var(--transition-base);
    
    &.active {
      transform: rotate(180deg);
    }
  }
`

const FAQAnswer = styled.div`
  p {
    padding: 0 var(--spacing-lg) var(--spacing-lg);
    color: var(--text-secondary);
    line-height: 1.6;
  }
`

export default FAQ

