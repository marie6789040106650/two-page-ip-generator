/**
 * Accessibility utilities and helpers
 */

// ARIA live region announcer
export class LiveAnnouncer {
  private static instance: LiveAnnouncer;
  private liveElement: HTMLElement | null = null;

  static getInstance(): LiveAnnouncer {
    if (!LiveAnnouncer.instance) {
      LiveAnnouncer.instance = new LiveAnnouncer();
    }
    return LiveAnnouncer.instance;
  }

  constructor() {
    if (typeof window !== 'undefined') {
      this.createLiveElement();
    }
  }

  private createLiveElement(): void {
    this.liveElement = document.createElement('div');
    this.liveElement.setAttribute('aria-live', 'polite');
    this.liveElement.setAttribute('aria-atomic', 'true');
    this.liveElement.className = 'sr-only';
    document.body.appendChild(this.liveElement);
  }

  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (this.liveElement) {
      this.liveElement.setAttribute('aria-live', priority);
      this.liveElement.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (this.liveElement) {
          this.liveElement.textContent = '';
        }
      }, 1000);
    }
  }
}

// Focus management utilities
export class FocusManager {
  private static focusStack: HTMLElement[] = [];

  static pushFocus(element: HTMLElement): void {
    const currentFocus = document.activeElement as HTMLElement;
    if (currentFocus) {
      this.focusStack.push(currentFocus);
    }
    element.focus();
  }

  static popFocus(): void {
    const previousFocus = this.focusStack.pop();
    if (previousFocus) {
      previousFocus.focus();
    }
  }

  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
}

// Keyboard navigation helpers
export const KeyboardNavigation = {
  // Handle arrow key navigation for lists
  handleArrowNavigation: (
    event: KeyboardEvent,
    items: HTMLElement[],
    currentIndex: number,
    onIndexChange: (index: number) => void
  ) => {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowDown':
        newIndex = Math.min(currentIndex + 1, items.length - 1);
        event.preventDefault();
        break;
      case 'ArrowUp':
        newIndex = Math.max(currentIndex - 1, 0);
        event.preventDefault();
        break;
      case 'Home':
        newIndex = 0;
        event.preventDefault();
        break;
      case 'End':
        newIndex = items.length - 1;
        event.preventDefault();
        break;
    }

    if (newIndex !== currentIndex) {
      onIndexChange(newIndex);
      items[newIndex]?.focus();
    }
  },

  // Handle escape key
  handleEscape: (event: KeyboardEvent, callback: () => void) => {
    if (event.key === 'Escape') {
      callback();
      event.preventDefault();
    }
  },

  // Handle enter and space for button-like elements
  handleActivation: (event: KeyboardEvent, callback: () => void) => {
    if (event.key === 'Enter' || event.key === ' ') {
      callback();
      event.preventDefault();
    }
  },
};

// Screen reader utilities
export const ScreenReader = {
  // Generate descriptive text for form fields
  generateFieldDescription: (
    fieldName: string,
    isRequired: boolean,
    hasError: boolean,
    errorMessage?: string
  ): string => {
    let description = fieldName;
    
    if (isRequired) {
      description += ', 必填项';
    }
    
    if (hasError && errorMessage) {
      description += `, 错误: ${errorMessage}`;
    }
    
    return description;
  },

  // Generate progress announcement
  generateProgressAnnouncement: (current: number, total: number, stepName?: string): string => {
    const progress = `第 ${current} 步，共 ${total} 步`;
    return stepName ? `${progress}: ${stepName}` : progress;
  },

  // Generate loading announcement
  generateLoadingAnnouncement: (isLoading: boolean, context?: string): string => {
    if (isLoading) {
      return context ? `正在加载 ${context}` : '正在加载';
    }
    return context ? `${context} 加载完成` : '加载完成';
  },
};

// Color contrast utilities
export const ColorContrast = {
  // Calculate relative luminance
  getRelativeLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio
  getContrastRatio: (color1: [number, number, number], color2: [number, number, number]): number => {
    const l1 = this.getRelativeLuminance(...color1);
    const l2 = this.getRelativeLuminance(...color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  // Check if contrast meets WCAG standards
  meetsWCAGStandard: (
    color1: [number, number, number],
    color2: [number, number, number],
    level: 'AA' | 'AAA' = 'AA'
  ): boolean => {
    const ratio = this.getContrastRatio(color1, color2);
    return level === 'AA' ? ratio >= 4.5 : ratio >= 7;
  },
};

// Reduced motion utilities
export const ReducedMotion = {
  // Check if user prefers reduced motion
  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Apply animation only if motion is not reduced
  conditionalAnimation: (animationClass: string): string => {
    return this.prefersReducedMotion() ? '' : animationClass;
  },
};