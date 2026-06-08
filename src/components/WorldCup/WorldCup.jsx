import React from 'react'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

const WorldCup = () => {
  const { t } = useTranslation()

  const handleSubscribe = () => {
    window.open(
      'https://wa.me/212723279328?text=Hi! I want to watch the World Cup 2026 on IPTV. Please help me subscribe.',
      '_blank'
    )
  }

  const scrollToPricing = () => {
    const el = document.getElementById('pricing')
    if (el) {
      const offset = el.getBoundingClientRect().top + window.pageYOffset - 80
      window.scrollTo({ top: offset, behavior: 'smooth' })
    }
  }

  const rounds = [
    { round: t('worldcup.roundGroup'), dates: 'Jun 11 – Jun 27', info: t('worldcup.matches72') },
    { round: t('worldcup.roundR32'), dates: 'Jun 28 – Jul 3', info: t('worldcup.matches16') },
    { round: t('worldcup.roundR16'), dates: 'Jul 4 – Jul 7', info: t('worldcup.matches8') },
    { round: t('worldcup.roundQuarter'), dates: 'Jul 9 – Jul 11', info: t('worldcup.matches4') },
    { round: t('worldcup.roundSemi'), dates: 'Jul 14 – Jul 15', info: t('worldcup.matches2') },
    { round: t('worldcup.roundFinal'), dates: 'Jul 19', info: t('worldcup.finalVenue') }
  ]

  const stats = [
    { num: '104', label: t('worldcup.statMatches') },
    { num: '48', label: t('worldcup.statTeams') },
    { num: '4K/8K', label: t('worldcup.statQuality') },
    { num: '$25', label: t('worldcup.statPrice') }
  ]

  return (
    <WorldCupSection id="world-cup">
      <div className="container">
        <Inner>
          <TextCol
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Tag>⚽ {t('worldcup.tag')}</Tag>
            <h2>{t('worldcup.titleStart')} <span>{t('worldcup.titleHighlight')}</span> {t('worldcup.titleEnd')}</h2>
            <p>{t('worldcup.description')}</p>

            <StatsRow>
              {stats.map((s) => (
                <Stat key={s.label}>
                  <span className="num">{s.num}</span>
                  <span className="lbl">{s.label}</span>
                </Stat>
              ))}
            </StatsRow>

            <Actions>
              <button className="btn btn-primary btn-lg" onClick={scrollToPricing}>
                <i className="fas fa-bolt"></i> {t('worldcup.getSubscription')}
              </button>
              <button className="btn btn-whatsapp btn-lg" onClick={handleSubscribe}>
                <i className="fab fa-whatsapp"></i> {t('worldcup.orderWhatsapp')}
              </button>
            </Actions>
          </TextCol>

          <ScheduleCol
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ScheduleCard>
              <h3>{t('worldcup.scheduleTitle')}</h3>
              {rounds.map((r) => (
                <Row key={r.round}>
                  <span className="r-name">{r.round}</span>
                  <span className="r-dates">{r.dates}</span>
                  <span className="r-info">{r.info}</span>
                </Row>
              ))}
              <CardCta onClick={scrollToPricing}>
                <i className="fas fa-futbol"></i> {t('worldcup.cardCta')}
              </CardCta>
            </ScheduleCard>
          </ScheduleCol>
        </Inner>
      </div>
    </WorldCupSection>
  )
}

const WorldCupSection = styled.section`
  padding: var(--spacing-3xl) 0;
  background:
    radial-gradient(900px 400px at 15% 0%, rgba(255, 107, 53, 0.14), transparent 60%),
    linear-gradient(135deg, #0c0c0c 0%, #161616 100%);
  position: relative;
  overflow: hidden;
`

const Inner = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 48px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 36px;
  }
`

const TextCol = styled(motion.div)`
  h2 {
    font-size: 2.8rem;
    font-weight: 900;
    line-height: 1.1;
    letter-spacing: -1px;
    margin-bottom: 18px;

    span {
      background: linear-gradient(135deg, #ff6b35, #f7931e, #ff8c42);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    @media (max-width: 768px) {
      font-size: 2.1rem;
    }
  }

  p {
    color: var(--text-secondary);
    font-size: 1.15rem;
    margin-bottom: 28px;
    max-width: 560px;
  }
`

const Tag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 107, 53, 0.12);
  border: 1px solid rgba(255, 107, 53, 0.4);
  color: #ffd0bb;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 22px;
`

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, auto);
  gap: 28px;
  margin-bottom: 32px;

  /* 2x2 earlier so the longer translated labels never overflow */
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
`

const Stat = styled.div`
  display: flex;
  flex-direction: column;

  .num {
    font-size: 1.9rem;
    font-weight: 900;
    color: var(--accent-primary);
    line-height: 1;
  }

  .lbl {
    color: var(--text-muted);
    font-size: 0.85rem;
    margin-top: 6px;
  }
`

const Actions = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    flex-direction: column;

    .btn {
      width: 100%;
    }
  }
`

const ScheduleCol = styled(motion.div)``

const ScheduleCard = styled.div`
  background: linear-gradient(145deg, #1a1a1a, #252525);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.35);

  h3 {
    font-size: 1.3rem;
    font-weight: 800;
    margin-bottom: 20px;
    color: #fff;
  }
`

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.2fr 1fr auto;
  gap: 10px;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid var(--border-light);

  &:last-of-type {
    border-bottom: none;
  }

  .r-name {
    font-weight: 700;
    color: #fff;
    font-size: 0.95rem;
  }

  .r-dates {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .r-info {
    color: var(--accent-primary);
    font-size: 0.85rem;
    font-weight: 600;
    text-align: right;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr auto;

    .r-info {
      display: none;
    }
  }
`

const CardCta = styled.button`
  width: 100%;
  margin-top: 20px;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #ff6b35, #f7931e);
  color: #fff;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  box-shadow: 0 10px 30px rgba(255, 107, 53, 0.3);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(255, 107, 53, 0.45);
  }
`

export default WorldCup
