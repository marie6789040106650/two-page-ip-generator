import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ContentPlaceholder } from '../content-placeholder'

describe('ContentPlaceholder', () => {
  it('should render main content area', () => {
    render(<ContentPlaceholder />)
    
    expect(screen.getByText('IP打造方案内容')).toBeInTheDocument()
    expect(screen.getByText('这里将显示为您生成的专业IP打造方案')).toBeInTheDocument()
    expect(screen.getByText('方案生成功能开发中...')).toBeInTheDocument()
  })

  it('should render core strategy section', () => {
    render(<ContentPlaceholder />)
    
    expect(screen.getByText('核心策略')).toBeInTheDocument()
  })

  it('should render execution plan section', () => {
    render(<ContentPlaceholder />)
    
    expect(screen.getByText('执行计划')).toBeInTheDocument()
  })

  it('should render professional summary section', () => {
    render(<ContentPlaceholder />)
    
    expect(screen.getByText('专业方案总结')).toBeInTheDocument()
    expect(screen.getByText('AI正在为您量身定制专业方案...')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const customClass = 'custom-test-class'
    const { container } = render(<ContentPlaceholder className={customClass} />)
    
    const rootElement = container.firstChild
    expect(rootElement).toHaveClass(customClass)
  })

  it('should have multiple card components', () => {
    const { container } = render(<ContentPlaceholder />)
    
    const cardElements = container.querySelectorAll('.card-glass')
    expect(cardElements.length).toBeGreaterThan(1)
  })

  it('should have shimmer placeholder elements', () => {
    const { container } = render(<ContentPlaceholder />)
    
    const shimmerElements = container.querySelectorAll('.placeholder-shimmer')
    expect(shimmerElements.length).toBeGreaterThan(0)
  })

  it('should have SVG icons in each section', () => {
    const { container } = render(<ContentPlaceholder />)
    
    const svgElements = container.querySelectorAll('svg')
    expect(svgElements.length).toBeGreaterThan(2) // At least 3 sections with icons
  })

  it('should have responsive grid layout', () => {
    const { container } = render(<ContentPlaceholder />)
    
    const gridElement = container.querySelector('.grid-cols-1.lg\\:grid-cols-2')
    expect(gridElement).toBeInTheDocument()
  })

  it('should have animated elements', () => {
    const { container } = render(<ContentPlaceholder />)
    
    const animatedElements = container.querySelectorAll('.animate-pulse')
    expect(animatedElements.length).toBeGreaterThan(0)
  })

  it('should have hover effects', () => {
    const { container } = render(<ContentPlaceholder />)
    
    const hoverElements = container.querySelectorAll('.hover-lift')
    expect(hoverElements.length).toBeGreaterThan(0)
    
    const hoverGlowElements = container.querySelectorAll('.hover-glow')
    expect(hoverGlowElements.length).toBeGreaterThan(0)
  })

  it('should have gradient backgrounds', () => {
    const { container } = render(<ContentPlaceholder />)
    
    const gradientElements = container.querySelectorAll('[class*="gradient-to-r"]')
    expect(gradientElements.length).toBeGreaterThan(0)
  })

  it('should have proper spacing classes', () => {
    const { container } = render(<ContentPlaceholder />)
    
    const spacingElement = container.querySelector('.space-y-4')
    expect(spacingElement).toBeInTheDocument()
  })

  it('should have responsive text sizes', () => {
    const { container } = render(<ContentPlaceholder />)
    
    const responsiveTextElements = container.querySelectorAll('[class*="sm:text-"]')
    expect(responsiveTextElements.length).toBeGreaterThan(0)
  })

  it('should have border styles', () => {
    const { container } = render(<ContentPlaceholder />)
    
    const dashedBorderElements = container.querySelectorAll('.border-dashed')
    expect(dashedBorderElements.length).toBeGreaterThan(0)
  })
})