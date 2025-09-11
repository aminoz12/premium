import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 100)

    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000)

    return () => {
      clearTimeout(timer)
      clearInterval(progressInterval)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <LoadingContainer>
            <LoadingContent>
              <LogoContainer>
                <LogoIcon>
                  <i className="fas fa-play"></i>
                </LogoIcon>
                <LogoText>PREMIUM IPTV</LogoText>
              </LogoContainer>
              
              <LoaderContainer>
                <Loader>
                  <LoaderRing />
                  <LoaderRing />
                  <LoaderRing />
                </Loader>
                <ProgressText>{Math.round(progress)}%</ProgressText>
              </LoaderContainer>
              
              <LoadingText>
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Loading your premium experience...
                </motion.div>
              </LoadingText>
            </LoadingContent>
          </LoadingContainer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
`

const LoadingContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--primary-bg);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
`

const LoadingContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-8);
`

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
`

const LogoIcon = styled.div`
  width: 80px;
  height: 80px;
  background: var(--accent-gradient);
  border-radius: var(--border-radius-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: var(--font-size-3xl);
  box-shadow: var(--shadow-xl);
  animation: ${pulse} 2s ease-in-out infinite;
`

const LogoText = styled.h1`
  font-size: var(--font-size-4xl);
  font-weight: var(--font-weight-black);
  background: var(--accent-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
`

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4);
`

const Loader = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
`

const LoaderRing = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
  border-top: 3px solid var(--accent-primary);
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;

  &:nth-child(2) {
    width: 60px;
    height: 60px;
    top: 10px;
    left: 10px;
    border-top-color: var(--accent-secondary);
    animation-duration: 1.5s;
    animation-direction: reverse;
  }

  &:nth-child(3) {
    width: 40px;
    height: 40px;
    top: 20px;
    left: 20px;
    border-top-color: var(--accent-tertiary);
    animation-duration: 2s;
  }
`

const ProgressText = styled.div`
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--accent-primary);
`

const LoadingText = styled.div`
  font-size: var(--font-size-base);
  color: var(--text-secondary);
  text-align: center;
  font-weight: var(--font-weight-medium);
`

export default LoadingScreen
