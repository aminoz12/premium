import React, { useEffect } from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { getArticleBySlug, getRecentArticles, getRelatedArticles } from '../../data/blogArticles'
import { getArticleBySlugAndLang, getRecentArticlesByLanguage, getRelatedArticlesByLanguage, getArticleLanguageVersions } from '../../data/blogArticlesMultilingual'
import LazyImage from '../../components/LazyImage/LazyImage'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'

const Blog = () => {
  const { slug } = useParams()
  const location = useLocation()
  
  // Detect language from URL path
  const getCurrentLanguage = () => {
    const path = location.pathname
    if (path.startsWith('/fr/')) return 'fr'
    if (path.startsWith('/gr/')) return 'el'
    if (path.startsWith('/al/')) return 'sq'
    return 'en'
  }
  
  if (slug) {
    return <BlogPost slug={slug} currentLang={getCurrentLanguage()} />
  }
  
  return <BlogList currentLang={getCurrentLanguage()} />
}

const BlogList = ({ currentLang }) => {
  const { t, i18n } = useTranslation()
  const recentArticles = getRecentArticlesByLanguage(currentLang, 10)
  
  // Update language if needed
  useEffect(() => {
    if (currentLang && i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang)
    }
  }, [currentLang, i18n])
  
  // Build language-specific paths
  const getBasePath = () => {
    if (currentLang === 'fr') return '/fr'
    if (currentLang === 'el') return '/gr'
    if (currentLang === 'sq') return '/al'
    return ''
  }
  
  const basePath = getBasePath()
  
  return (
    <>
      <Header />
      <BlogSection>
        <div className="container">
          <BlogHeader data-aos="fade-up">
            <h1>{t('blog.title', 'IPTV Blog & Guides')}</h1>
            <p>{t('blog.subtitle', 'Expert guides, tutorials, and tips for getting the most out of your Premium IPTV service')}</p>
          </BlogHeader>
          
          <BlogGrid>
            {recentArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <BlogCard to={`${basePath}/blog/${article.slug}`}>
                  <ImageWrapper>
                    <LazyImage 
                      src={article.image || '/assets/blog/default.jpg'} 
                      alt={article.title}
                      priority={index < 3}
                    />
                    <CategoryBadge>{article.category}</CategoryBadge>
                  </ImageWrapper>
                  <CardContent>
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                    <CardMeta>
                      <span><i className="fas fa-calendar"></i> {new Date(article.publishDate).toLocaleDateString()}</span>
                      <span><i className="fas fa-clock"></i> {article.readingTime} min read</span>
                    </CardMeta>
                    <ReadMore>
                      Read More <i className="fas fa-arrow-right"></i>
                    </ReadMore>
                  </CardContent>
                </BlogCard>
              </motion.div>
            ))}
          </BlogGrid>
        </div>
      </BlogSection>
      <Footer />
    </>
  )
}

const BlogPost = ({ slug, currentLang }) => {
  const { t, i18n } = useTranslation()
  const location = useLocation()
  const article = getArticleBySlugAndLang(slug, currentLang)
  const relatedArticles = getRelatedArticlesByLanguage(slug, currentLang)
  const languageVersions = getArticleLanguageVersions(slug)
  
  // Update language if needed
  useEffect(() => {
    if (currentLang && i18n.language !== currentLang) {
      i18n.changeLanguage(currentLang)
    }
  }, [currentLang, i18n])
  
  // Build language-specific paths
  const getBasePath = () => {
    if (currentLang === 'fr') return '/fr'
    if (currentLang === 'el') return '/gr'
    if (currentLang === 'sq') return '/al'
    return ''
  }
  
  const basePath = getBasePath()
  
  // Add Article schema and update meta tags
  useEffect(() => {
    if (article) {
      // Update page title
      document.title = `${article.seoTitle || article.title} | Premium IPTV`
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]')
      if (!metaDescription) {
        metaDescription = document.createElement('meta')
        metaDescription.setAttribute('name', 'description')
        document.head.appendChild(metaDescription)
      }
      metaDescription.setAttribute('content', article.seoDescription || article.excerpt)
      
      // Add Article schema
      const schemaScript = document.createElement('script')
      schemaScript.type = 'application/ld+json'
      schemaScript.id = 'article-schema'
      schemaScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": article.title,
        "description": article.excerpt,
        "image": article.image ? `https://watchworldcup.us${article.image}` : "https://watchworldcup.us/logo.png",
        "datePublished": article.publishDate,
        "dateModified": article.publishDate,
        "author": {
          "@type": "Organization",
          "name": article.author,
          "url": "https://watchworldcup.us"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Premium IPTV",
          "logo": {
            "@type": "ImageObject",
            "url": "https://watchworldcup.us/logo.png"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://watchworldcup.us/blog/${article.slug}`
        },
        "articleSection": article.category,
        "keywords": article.tags.join(", ")
      })
      
      // Remove existing schema if any
      const existingSchema = document.getElementById('article-schema')
      if (existingSchema) {
        existingSchema.remove()
      }
      
      document.head.appendChild(schemaScript)
      
      // Update canonical URL
      let canonical = document.querySelector('link[rel="canonical"]')
      if (!canonical) {
        canonical = document.createElement('link')
        canonical.setAttribute('rel', 'canonical')
        document.head.appendChild(canonical)
      }
      canonical.setAttribute('href', `https://watchworldcup.us/blog/${article.slug}`)
      
      // Update Open Graph tags
      const updateOGTag = (property, content) => {
        let tag = document.querySelector(`meta[property="${property}"]`)
        if (!tag) {
          tag = document.createElement('meta')
          tag.setAttribute('property', property)
          document.head.appendChild(tag)
        }
        tag.setAttribute('content', content)
      }
      
      updateOGTag('og:title', article.title)
      updateOGTag('og:description', article.excerpt)
      updateOGTag('og:image', article.image ? `https://watchworldcup.us${article.image}` : 'https://watchworldcup.us/logo.png')
      updateOGTag('og:url', `https://watchworldcup.us${article.languagePath || ''}/blog/${article.slug}`)
      updateOGTag('og:type', 'article')
      
      return () => {
        // Cleanup on unmount
        const schema = document.getElementById('article-schema')
        if (schema) schema.remove()
      }
    }
  }, [article])
  
  if (!article) {
    return (
      <>
        <Header />
        <BlogSection>
          <div className="container">
            <NotFound>
              <h2>Article Not Found</h2>
              <p>The article you're looking for doesn't exist.</p>
              <Link to={`${basePath}/blog`} className="btn btn-primary">{t('blog.backToBlog', 'Back to Blog')}</Link>
            </NotFound>
          </div>
        </BlogSection>
        <Footer />
      </>
    )
  }
  
  return (
    <>
      <Header />
      <BlogPostSection>
        <div className="container">
          <Breadcrumb>
            <Link to={`${basePath}/`}>{t('header.home', 'Home')}</Link>
            <span>/</span>
            <Link to={`${basePath}/blog`}>{t('blog.title', 'Blog')}</Link>
            <span>/</span>
            <span>{article.title}</span>
          </Breadcrumb>
          
          <ArticleHeader>
            <CategoryBadge>{article.category}</CategoryBadge>
            <h1>{article.title}</h1>
            <ArticleMeta>
              <span><i className="fas fa-user"></i> {article.author}</span>
              <span><i className="fas fa-calendar"></i> {new Date(article.publishDate).toLocaleDateString()}</span>
              <span><i className="fas fa-clock"></i> {article.readingTime} min read</span>
            </ArticleMeta>
          </ArticleHeader>
          
          <ArticleImage>
            <LazyImage 
              src={article.image || '/assets/blog/default.jpg'} 
              alt={article.title}
              priority
            />
          </ArticleImage>
          
          <ArticleContent dangerouslySetInnerHTML={{ __html: article.content }} />
          
          <WhatsAppCTA>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WhatsAppButton
                href="https://wa.me/212723279328?text=Hi! I want to get a free IPTV test. Can you help me?"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <WhatsAppIcon>
                  <i className="fab fa-whatsapp"></i>
                </WhatsAppIcon>
                <WhatsAppText>
                  <span className="main-text">{t('blog.getFreeTest')}</span>
                  <span className="sub-text">{t('blog.tryNow')}</span>
                </WhatsAppText>
                <WhatsAppArrow>
                  <i className="fas fa-arrow-right"></i>
                </WhatsAppArrow>
              </WhatsAppButton>
            </motion.div>
          </WhatsAppCTA>
          
          <ArticleTags>
            {article.tags.map(tag => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </ArticleTags>
          
          {relatedArticles.length > 0 && (
            <RelatedSection>
              <h2>Related Articles</h2>
              <RelatedGrid>
                {relatedArticles.map(related => (
                  <RelatedCard key={related.id} to={`/blog/${related.slug}`}>
                    <LazyImage 
                      src={related.image || '/assets/blog/default.jpg'} 
                      alt={related.title}
                    />
                    <h3>{related.title}</h3>
                  </RelatedCard>
                ))}
              </RelatedGrid>
            </RelatedSection>
          )}
        </div>
      </BlogPostSection>
      <Footer />
    </>
  )
}

const BlogSection = styled.section`
  padding: calc(80px + var(--spacing-3xl)) 0 var(--spacing-3xl);
  background: var(--primary-bg);
  min-height: 100vh;
`

const BlogHeader = styled.div`
  text-align: center;
  margin-bottom: var(--spacing-3xl);
  
  h1 {
    font-size: var(--font-size-5xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-4);
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    font-size: var(--font-size-xl);
    color: var(--text-secondary);
    max-width: 700px;
    margin: 0 auto;
  }
`

const BlogGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: var(--spacing-xl);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
`

const BlogCard = styled(Link)`
  background: var(--card-bg);
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: 1px solid var(--border-color);
  text-decoration: none;
  display: block;
  box-shadow: var(--shadow-md);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-glow-accent), var(--shadow-xl);
    border-color: var(--accent-primary);
  }
`

const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  
  ${BlogCard}:hover & img {
    transform: scale(1.1);
  }
`

const CategoryBadge = styled.span`
  position: absolute;
  top: var(--spacing-4);
  left: var(--spacing-4);
  background: var(--accent-gradient);
  color: var(--text-primary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  z-index: 2;
`

const CardContent = styled.div`
  padding: var(--spacing-6);
  
  h3 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-3);
    color: var(--text-primary);
    line-height: var(--line-height-tight);
  }
  
  p {
    color: var(--text-secondary);
    line-height: var(--line-height-relaxed);
    margin-bottom: var(--spacing-4);
  }
`

const CardMeta = styled.div`
  display: flex;
  gap: var(--spacing-4);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-bottom: var(--spacing-4);
  
  i {
    margin-right: var(--spacing-1);
  }
`

const ReadMore = styled.div`
  color: var(--accent-primary);
  font-weight: var(--font-weight-semibold);
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  transition: all 0.3s ease;
  
  i {
    transition: transform 0.3s ease;
  }
  
  ${BlogCard}:hover & {
    color: var(--accent-secondary);
    
    i {
      transform: translateX(4px);
    }
  }
`

const BlogPostSection = styled.section`
  padding: calc(80px + var(--spacing-3xl)) 0 var(--spacing-3xl);
  background: var(--primary-bg);
  min-height: 100vh;
`

const Breadcrumb = styled.nav`
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  margin-bottom: var(--spacing-6);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  
  a {
    color: var(--text-secondary);
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--accent-primary);
    }
  }
  
  span {
    color: var(--text-muted);
  }
`

const ArticleHeader = styled.header`
  margin-bottom: var(--spacing-6);
  
  h1 {
    font-size: var(--font-size-5xl);
    font-weight: var(--font-weight-bold);
    margin: var(--spacing-4) 0;
    line-height: var(--line-height-tight);
    background: var(--accent-gradient);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`

const ArticleMeta = styled.div`
  display: flex;
  gap: var(--spacing-6);
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-top: var(--spacing-4);
  
  i {
    margin-right: var(--spacing-1);
    color: var(--accent-primary);
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: var(--spacing-2);
  }
`

const ArticleImage = styled.div`
  width: 100%;
  height: 500px;
  border-radius: var(--border-radius-xl);
  overflow: hidden;
  margin-bottom: var(--spacing-6);
  box-shadow: var(--shadow-xl);
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 768px) {
    height: 300px;
  }
`

const ArticleContent = styled.article`
  max-width: 800px;
  margin: 0 auto;
  line-height: var(--line-height-relaxed);
  color: var(--text-secondary);
  
  h2 {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    margin: var(--spacing-8) 0 var(--spacing-4);
    color: var(--text-primary);
  }
  
  h3 {
    font-size: var(--font-size-2xl);
    font-weight: var(--font-weight-semibold);
    margin: var(--spacing-6) 0 var(--spacing-3);
    color: var(--text-primary);
  }
  
  h4 {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-semibold);
    margin: var(--spacing-4) 0 var(--spacing-2);
    color: var(--text-primary);
  }
  
  p {
    margin-bottom: var(--spacing-4);
    line-height: var(--line-height-relaxed);
  }
  
  ul, ol {
    margin: var(--spacing-4) 0;
    padding-left: var(--spacing-6);
    
    li {
      margin-bottom: var(--spacing-2);
      line-height: var(--line-height-relaxed);
    }
  }
  
  strong {
    color: var(--text-primary);
    font-weight: var(--font-weight-semibold);
  }
  
  a {
    color: var(--accent-primary);
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--accent-secondary);
      text-decoration: underline;
    }
  }
`

const ArticleTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-3);
  margin-top: var(--spacing-8);
  padding-top: var(--spacing-6);
  border-top: 1px solid var(--border-color);
`

const Tag = styled.span`
  background: var(--card-bg);
  color: var(--text-secondary);
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  border: 1px solid var(--border-color);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--accent-primary);
    color: var(--text-primary);
    border-color: var(--accent-primary);
  }
`

const RelatedSection = styled.section`
  margin-top: var(--spacing-3xl);
  padding-top: var(--spacing-3xl);
  border-top: 1px solid var(--border-color);
  
  h2 {
    font-size: var(--font-size-3xl);
    font-weight: var(--font-weight-bold);
    margin-bottom: var(--spacing-6);
    text-align: center;
  }
`

const RelatedGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
`

const RelatedCard = styled(Link)`
  background: var(--card-bg);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid var(--border-color);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-primary);
  }
  
  img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }
  
  h3 {
    padding: var(--spacing-4);
    font-size: var(--font-size-lg);
    color: var(--text-primary);
    font-weight: var(--font-weight-semibold);
  }
`

const NotFound = styled.div`
  text-align: center;
  padding: var(--spacing-3xl) 0;
  
  h2 {
    font-size: var(--font-size-3xl);
    margin-bottom: var(--spacing-4);
  }
  
  p {
    color: var(--text-secondary);
    margin-bottom: var(--spacing-6);
  }
`

const WhatsAppCTA = styled.div`
  margin: var(--spacing-3xl) 0;
  display: flex;
  justify-content: center;
`

const WhatsAppButton = styled(motion.a)`
  display: flex;
  align-items: center;
  gap: var(--spacing-4);
  background: linear-gradient(135deg, #25d366 0%, #128c7e 100%);
  color: white;
  padding: var(--spacing-5) var(--spacing-6);
  border-radius: var(--border-radius-xl);
  text-decoration: none;
  font-weight: var(--font-weight-bold);
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 300px;
  justify-content: space-between;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s;
  }
  
  &:hover {
    box-shadow: 0 12px 32px rgba(37, 211, 102, 0.6);
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
    
    ${WhatsAppArrow} {
      transform: translateX(4px);
    }
  }
  
  @media (max-width: 768px) {
    min-width: auto;
    padding: var(--spacing-4) var(--spacing-5);
    gap: var(--spacing-3);
  }
`

const WhatsAppIcon = styled.div`
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  width: 56px;
  height: 56px;
  border-radius: 50%;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    font-size: 1.5rem;
  }
`

const WhatsAppText = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  
  .main-text {
    font-size: var(--font-size-xl);
    font-weight: var(--font-weight-bold);
    line-height: 1.2;
    
    @media (max-width: 768px) {
      font-size: var(--font-size-lg);
    }
  }
  
  .sub-text {
    font-size: var(--font-size-sm);
    opacity: 0.9;
    font-weight: var(--font-weight-medium);
    margin-top: 2px;
  }
`

const WhatsAppArrow = styled.div`
  font-size: var(--font-size-lg);
  transition: transform 0.3s ease;
  flex-shrink: 0;
`

export default Blog
