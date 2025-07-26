/**
 * Dynamic import utilities for code splitting and lazy loading
 */

import React from 'react';
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Loading component for dynamic imports
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

// Error component for dynamic import failures
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center p-4 text-red-600">
    <p>加载组件失败: {error.message}</p>
  </div>
);

/**
 * Create a dynamically imported component with loading and error states
 */
export function createDynamicComponent<T = {}>(
  importFn: () => Promise<{ default: ComponentType<T> }>,
  options: {
    loading?: () => React.ReactElement;
    ssr?: boolean;
  } = {}
) {
  return dynamic(importFn, {
    loading: options.loading || LoadingSpinner,
    ssr: options.ssr ?? true,
  });
}

/**
 * Lazy load heavy components that are not immediately visible
 * Note: These are placeholder implementations. 
 * In a real app, you would import actual components.
 */
export const LazyComponents = {
  // Placeholder implementations to avoid import errors
  FormSection: () => <div>Form Section Placeholder</div>,
  KeywordExpansionPanel: () => <div>Keyword Expansion Panel Placeholder</div>,
  BulkInputSection: () => <div>Bulk Input Section Placeholder</div>,
};

/**
 * Preload critical components
 */
export function preloadCriticalComponents() {
  // Preload components that will be needed soon
  if (typeof window !== 'undefined') {
    // Preload form section
    import('../components/form-section');
    
    // Preload generate page components when on form page
    if (window.location.pathname === '/') {
      import('../app/generate/generate-page-content');
      import('../components/content-placeholder');
      import('../components/banner-placeholder');
    }
  }
}

/**
 * Resource hints for better performance
 */
export function addResourceHints() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Preconnect to external domains if any
    const preconnectLinks: string[] = [
      // Add any external domains here
    ];
    
    preconnectLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = href;
      document.head.appendChild(link);
    });
    
    // DNS prefetch for external resources
    const dnsPrefetchLinks: string[] = [
      // Add any external domains for DNS prefetch
    ];
    
    dnsPrefetchLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = href;
      document.head.appendChild(link);
    });
  }
}