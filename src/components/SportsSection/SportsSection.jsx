import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import LazyImage from '../LazyImage/LazyImage'

const SportsSection = () => {
  const { t } = useTranslation()
  const sportsLeagues = [
    {
      name: 'NBA',
      logo: '/assets/sports/NBA.png',
      description: 'Basketball'
    },
    {
      name: 'NFL',
      logo: '/assets/sports/NFL.png',
      description: 'American Football'
    },
    {
      name: 'La Liga',
      logo: '/assets/sports/laliga.png',
      description: 'Spanish Football'
    },
    {
      name: 'Premier League',
      logo: '/assets/sports/premierleague.png',
      description: 'English Football'
    },
    {
      name: 'Bundesliga',
      logo: '/assets/sports/Bundesliga.png',
      description: 'German Football'
    },
    {
      name: 'Ligue 1',
      logo: '/assets/sports/Ligue1.png',
      description: 'French Football'
    },
    {
      name: 'Serie A',
      logo: '/assets/sports/serieA.png',
      description: 'Italian Football'
    },
    {
      name: 'Champions League',
      logo: '/assets/sports/ChampionsLeague.png',
      description: 'European Football'
    },
    {
      name: 'Formula 1',
      logo: '/assets/sports/Formula1.png',
      description: 'Racing Championship'
    }
  ]

  return (
    <SportsSectionWrapper>
      <div className="container">
        <SectionHeader data-aos="fade-up">
          <h2>{t('sports.title')}</h2>
        </SectionHeader>
        
        <SportsGrid>
          {sportsLeagues.map((league, index) => (
            <motion.div
              key={league.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <SportsCard>
                <SportsLogo>
                  <LazyImage 
                    src={league.logo} 
                    alt={league.name}
                    placeholder="Loading..."
                    onError={(e) => {
                      e.target.src = '/assets/sports/placeholder.png'
                    }}
                  />
                </SportsLogo>
                <SportsInfo>
                  <h3>{league.name}</h3>
                  <p>{league.description}</p>
                </SportsInfo>
              </SportsCard>
            </motion.div>
          ))}
        </SportsGrid>
      </div>
    </SportsSectionWrapper>
  )
}

const SportsSectionWrapper = styled.section`
  padding: 80px 0;
  background: linear-gradient(135deg, #1a1a1a 0%, #0c0c0c 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/assets/sports/pattern.svg') repeat;
    opacity: 0.05;
    z-index: 1;
  }
`

const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 60px;
  position: relative;
  z-index: 2;

  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    color: white;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
    background: linear-gradient(135deg, #ffffff, #e0e0e0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }
`

const SportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 40px;
  position: relative;
  z-index: 2;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 30px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 25px;
  }
`

const SportsCard = styled.div`
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border-radius: 20px;
  padding: 40px 20px;
  text-align: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 107, 53, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-15px) scale(1.02);
    box-shadow: 0 25px 50px rgba(255, 107, 53, 0.2);
    border-color: #ff6b35;

    &::before {
      left: 100%;
    }
  }
`

const SportsLogo = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.1), rgba(247, 147, 30, 0.1));
  border-radius: 50%;
  border: 3px solid rgba(255, 107, 53, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(247, 147, 30, 0.2));
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  ${SportsCard}:hover & {
    background: linear-gradient(135deg, rgba(255, 107, 53, 0.2), rgba(247, 147, 30, 0.2));
    border-color: #ff6b35;
    transform: scale(1.15);
    box-shadow: 0 15px 35px rgba(255, 107, 53, 0.3);

    &::before {
      opacity: 1;
    }
  }

  img {
    width: 80px;
    height: 80px;
    object-fit: contain;
    border-radius: 50%;
    filter: brightness(0.9);
    transition: all 0.3s ease;
    position: relative;
    z-index: 2;

    ${SportsCard}:hover & {
      filter: brightness(1.2);
      transform: scale(1.1);
    }
  }
`

const SportsInfo = styled.div`
  h3 {
    font-size: 1.2rem;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  p {
    font-size: 0.9rem;
    color: #a0a0a0;
    margin: 0;
    font-weight: 500;
  }
`

export default SportsSection

