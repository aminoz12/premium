import React from 'react';
import { getImageObjectSchema } from '@/lib/image-seo';

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  caption?: string;
  className?: string;
  showCaption?: boolean;
}

/**
 * OptimizedImage component enforcing Image SEO standards:
 * - Explicit width & height to prevent Cumulative Layout Shift (CLS)
 * - Priority loading / eager fetch for above-the-fold hero images
 * - Lazy loading for below-the-fold images
 * - Schema.org ImageObject microdata markup for Google Images ranking
 * - Optional figure & figcaption tags for context-aware search indexing
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  caption,
  className = '',
  showCaption = false,
  ...rest
}: OptimizedImageProps) {
  const loading = priority ? 'eager' : 'lazy';
  const fetchPriority = priority ? 'high' : 'auto';

  // Build JSON-LD structured data for Google Images
  const imageSchema = getImageObjectSchema({
    path: src,
    alt,
    width,
    height,
    caption: caption || alt,
  });

  const imgElement = (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={loading}
      // @ts-expect-error - fetchpriority is standard HTML5 but React types require low/high/auto
      fetchpriority={fetchPriority}
      className={`rounded-lg object-cover transition-all duration-300 ${className}`}
      {...rest}
    />
  );

  return (
    <figure
      itemScope
      itemType="https://schema.org/ImageObject"
      className="group relative my-4 inline-block overflow-hidden rounded-xl border border-white/10 bg-slate-900/40 p-1 shadow-lg backdrop-blur-sm"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(imageSchema) }}
      />
      <meta itemProp="contentUrl" content={src.startsWith('http') ? src : `https://watchworldcup.us${src}`} />
      <meta itemProp="description" content={alt} />

      {imgElement}

      {showCaption && (caption || alt) && (
        <figcaption
          itemProp="caption"
          className="mt-2 text-center text-xs tracking-wide text-slate-400 group-hover:text-slate-200 transition-colors"
        >
          {caption || alt}
        </figcaption>
      )}
    </figure>
  );
}
