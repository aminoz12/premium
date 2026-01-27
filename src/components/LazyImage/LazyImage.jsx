import React, { useState, useRef, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'

// Helper function to convert image path to WebP if supported
const getOptimizedSrc = (src) => {
  if (!src) return src
  // Check if browser supports WebP
  if (typeof window !== 'undefined' && window.Modernizr?.webp) {
    // If WebP is supported and image is not already WebP, try WebP version
    if (!src.includes('.webp') && !src.includes('data:') && !src.includes('http')) {
      const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      return webpSrc
    }
  }
  return src
}

// Generate srcset for responsive images
const generateSrcSet = (src, basePath = '') => {
  if (!src || src.includes('http') || src.includes('data:')) return undefined
  
  const sizes = [320, 640, 768, 1024, 1280, 1920]
  const extension = src.split('.').pop()
  const baseName = src.replace(`.${extension}`, '')
  
  return sizes
    .map(size => `${basePath}${baseName}-${size}w.${extension} ${size}w`)
    .join(', ')
}

const LazyImage = ({ 
  src, 
  alt, 
  placeholder, 
  onError, 
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  loading = 'lazy',
  width,
  height,
  fetchpriority,
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const imgRef = useRef(null)
  const imgElementRef = useRef(null)
  
  // Optimize src for WebP support
  const optimizedSrc = getOptimizedSrc(src)
  const srcSet = generateSrcSet(src)

  // Preload critical images immediately
  useEffect(() => {
    if (priority) {
      setIsInView(true)
      preloadImage(optimizedSrc)
    }
  }, [priority, optimizedSrc])

  const preloadImage = useCallback((imageSrc) => {
    if (!imageSrc) return
    
    setIsLoading(true)
    const img = new Image()
    
    // Use fetchpriority for critical images
    if (priority && img.fetchPriority !== undefined) {
      img.fetchPriority = 'high'
    }
    
    img.onload = () => {
      setIsLoaded(true)
      setIsLoading(false)
    }
    img.onerror = () => {
      // Fallback to original src if WebP fails
      if (imageSrc !== src && imageSrc.includes('.webp')) {
        preloadImage(src)
        return
      }
      setHasError(true)
      setIsLoading(false)
      if (onError) {
        onError(new Event('error'))
      }
    }
    img.src = imageSrc
  }, [onError, priority, src])

  useEffect(() => {
    if (isInView && !isLoaded && !isLoading && !hasError) {
      preloadImage(optimizedSrc)
    }
  }, [isInView, isLoaded, isLoading, hasError, optimizedSrc, preloadImage])

  useEffect(() => {
    if (priority) return // Skip intersection observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { 
        threshold: 0.01, // Reduced threshold for faster loading
        rootMargin: '100px' // Increased margin to start loading earlier
      }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [priority])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    setIsLoading(false)
  }, [])

  const handleError = useCallback((e) => {
    // Try fallback to original format if WebP fails
    if (optimizedSrc !== src && optimizedSrc.includes('.webp') && !hasError) {
      const img = e.target
      img.src = src
      return
    }
    setHasError(true)
    setIsLoading(false)
    if (onError) {
      onError(e)
    }
  }, [onError, optimizedSrc, src, hasError])

  return (
    <ImageContainer ref={imgRef} {...props}>
      {/* Skeleton Loading State */}
      {isInView && !isLoaded && !hasError && (
        <SkeletonLoader>
          <SkeletonShimmer />
        </SkeletonLoader>
      )}
      
      {/* Error State */}
      {hasError && (
        <ErrorPlaceholder>
          <i className="fas fa-image"></i>
          <span>Image unavailable</span>
        </ErrorPlaceholder>
      )}
      
      {/* Actual Image with optimized loading */}
      {isInView && !hasError && (
        <img
          ref={imgElementRef}
          src={optimizedSrc}
          srcSet={srcSet}
          alt={alt || ''}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? 'eager' : loading}
          fetchpriority={priority ? 'high' : fetchpriority}
          sizes={sizes}
          width={width}
          height={height}
          decoding="async"
          style={{ 
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          {...props}
        />
      )}
    </ImageContainer>
  )
}

const shimmer = keyframes`
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
`

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  background: var(--card-bg);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease-in-out;
  }
`

const SkeletonLoader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    var(--card-bg) 0%, 
    var(--surface-bg) 50%, 
    var(--card-bg) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 0.875rem;
`

const SkeletonShimmer = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(255, 255, 255, 0.1) 50%, 
    transparent 100%
  );
  animation: ${shimmer} 1.5s infinite;
`

const ErrorPlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--card-bg);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);

  i {
    font-size: 2rem;
    margin-bottom: 0.5rem;
    opacity: 0.5;
  }

  span {
    font-size: 0.75rem;
    text-align: center;
  }
`

export default LazyImage

