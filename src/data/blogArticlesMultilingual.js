// Multilingual blog articles - extends existing articles with translations
// This file provides language-specific versions of all articles

import { blogArticles } from './blogArticles'

// Language path mapping
export const languagePaths = {
  en: '',
  fr: '/fr',
  el: '/gr',
  sq: '/al'
}

// Import translations
import { articleTranslations } from './articleTranslations'

// Translation helper - gets article in specific language
export const getArticleBySlugAndLang = (slug, lang = 'en') => {
  const article = blogArticles.find(a => a.slug === slug)
  if (!article) return null
  
  // Check if translation exists for this article and language
  const translation = articleTranslations[slug]?.[lang]
  
  // Return translated article if available, otherwise return English
  return {
    ...article,
    language: lang,
    languagePath: languagePaths[lang] || '',
    // Override with translations if available
    ...(translation && {
      title: translation.title,
      excerpt: translation.excerpt,
      content: translation.content,
      seoTitle: translation.seoTitle,
      seoDescription: translation.seoDescription,
      author: translation.author
    })
  }
}

// Get all articles for a specific language
export const getArticlesByLanguage = (lang = 'en') => {
  return blogArticles.map(article => ({
    ...article,
    language: lang,
    languagePath: languagePaths[lang] || ''
  }))
}

// Get recent articles by language
export const getRecentArticlesByLanguage = (lang = 'en', limit = 10) => {
  const articles = getArticlesByLanguage(lang)
  return articles
    .sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate))
    .slice(0, limit)
}

// Get related articles by language
export const getRelatedArticlesByLanguage = (slug, lang = 'en', limit = 3) => {
  const currentArticle = getArticleBySlugAndLang(slug, lang)
  if (!currentArticle) return []
  
  const articles = getArticlesByLanguage(lang)
  return articles
    .filter(article => 
      article.slug !== slug && 
      (article.category === currentArticle.category || 
       article.tags.some(tag => currentArticle.tags.includes(tag)))
    )
    .slice(0, limit)
}

// Get all language versions of an article (for hreflang)
export const getArticleLanguageVersions = (slug) => {
  return {
    en: `https://watchworldcup.us/blog/${slug}`,
    fr: `https://watchworldcup.us/fr/blog/${slug}`,
    el: `https://watchworldcup.us/gr/blog/${slug}`,
    sq: `https://watchworldcup.us/al/blog/${slug}`
  }
}

// Export all article slugs for sitemap generation
export const getAllArticleSlugs = () => {
  return blogArticles.map(article => article.slug)
}
