/**
 * SEO utilities and structured data
 */

import { Metadata } from 'next';

// Structured data for the application
export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '老板IP打造方案生成器',
  description: '专业的老板IP打造方案生成工具，帮助您快速生成个性化的IP打造方案',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web Browser',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'CNY',
  },
  creator: {
    '@type': 'Organization',
    name: 'IP Generator Team',
  },
  featureList: [
    '店铺信息填写',
    '智能方案生成',
    '个性化IP打造',
    '专业方案导出',
  ],
};

// Generate page-specific metadata
export function generatePageMetadata(
  title: string,
  description: string,
  path: string = '/',
  additionalMetadata: Partial<Metadata> = {}
): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const fullUrl = `${baseUrl}${path}`;

  return {
    title: `${title} | 老板IP打造方案生成器`,
    description,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: `${title} | 老板IP打造方案生成器`,
      description,
      url: fullUrl,
      type: 'website',
      locale: 'zh_CN',
      siteName: '老板IP打造方案生成器',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | 老板IP打造方案生成器`,
      description,
    },
    ...additionalMetadata,
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbData(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// SEO-friendly URL generation
export function generateSEOUrl(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// Meta tags for Core Web Vitals optimization
export const coreWebVitalsMetaTags = [
  { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
  { name: 'theme-color', content: '#3b82f6' },
  { name: 'color-scheme', content: 'light' },
  { name: 'format-detection', content: 'telephone=no, date=no, email=no, address=no' },
];

// Preload critical resources
export const criticalResourcePreloads = [
  { rel: 'preload', href: '/globals.css', as: 'style' },
  { rel: 'dns-prefetch', href: '//fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com', crossOrigin: 'anonymous' },
];

// Generate sitemap data
export function generateSitemapData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/generate`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
  ];
}