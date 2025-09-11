import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'

const LazyImage = ({ src, alt, placeholder, onError, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setIsLoaded(true)
  }

  const handleError = (e) => {
    if (onError) {
      onError(e)
    }
  }

  return (
    <ImageContainer ref={imgRef} {...props}>
      {isInView && (
        <>
          {!isLoaded && placeholder && (
            <Placeholder>{placeholder}</Placeholder>
          )}
          <img
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            style={{ opacity: isLoaded ? 1 : 0 }}
            {...props}
          />
        </>
      )}
    </ImageContainer>
  )
}

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
  }
`

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--card-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
`

export default LazyImage

