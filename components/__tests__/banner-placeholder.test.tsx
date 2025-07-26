import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BannerPlaceholder } from '../banner-placeholder'

describe('BannerPlaceholder', () => {
  it('should render with default props', () => {
    render(<BannerPlaceholder />)
    
    expect(screen.getByText('专属Banner图片')).toBeInTheDocument()
    expect(screen.getByText('这里将显示为您量身定制的品牌Banner图片')).toBeInTheDocument()
    expect(screen.getByText('Banner生成功能开发中...')).toBeInTheDocument()
  })

  it('should render with store name', () => {
    const storeName = '测试店铺'
    render(<BannerPlaceholder storeName={storeName} />)
    
    expect(screen.getByText(`${storeName} 专属Banner`)).toBeInTheDocument()
    expect(screen.getByText('这里将显示为您量身定制的品牌Banner图片')).toBeInTheDocument()
  })

  it('should apply custom className', () => {
    const customClass = 'custom-test-class'
    const { container } = render(<BannerPlaceholder className={customClass} />)
    
    const cardElement = container.querySelector('.card-glass')
    expect(cardElement).toHaveClass(customClass)
  })

  it('should have proper aspect ratio classes', () => {
    const { container } = render(<BannerPlaceholder />)
    
    const aspectRatioElement = container.querySelector('.aspect-\\[4\\/3\\]')
    expect(aspectRatioElement).toBeInTheDocument()
  })

  it('should contain SVG icon', () => {
    const { container } = render(<BannerPlaceholder />)
    
    const svgElement = container.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
    expect(svgElement).toHaveClass('text-purple-400')
  })

  it('should have animated elements', () => {
    const { container } = render(<BannerPlaceholder />)
    
    const animatedDot = container.querySelector('.animate-pulse')
    expect(animatedDot).toBeInTheDocument()
    
    const bounceElements = container.querySelectorAll('.animate-bounce-subtle')
    expect(bounceElements.length).toBeGreaterThan(0)
  })

  it('should have decorative elements', () => {
    const { container } = render(<BannerPlaceholder />)
    
    const decorativeElements = container.querySelectorAll('.absolute')
    expect(decorativeElements.length).toBeGreaterThan(0)
  })

  it('should have responsive design classes', () => {
    const { container } = render(<BannerPlaceholder />)
    
    const responsiveElement = container.querySelector('.sm\\:aspect-\\[16\\/9\\]')
    expect(responsiveElement).toBeInTheDocument()
    
    const lgResponsiveElement = container.querySelector('.lg\\:aspect-\\[21\\/9\\]')
    expect(lgResponsiveElement).toBeInTheDocument()
  })

  it('should have gradient background', () => {
    const { container } = render(<BannerPlaceholder />)
    
    const gradientElement = container.querySelector('.gradient-bg-alt')
    expect(gradientElement).toBeInTheDocument()
  })

  it('should have hover effects', () => {
    const { container } = render(<BannerPlaceholder />)
    
    const hoverElement = container.querySelector('.hover-glow')
    expect(hoverElement).toBeInTheDocument()
    
    const hoverLiftElement = container.querySelector('.hover-lift')
    expect(hoverLiftElement).toBeInTheDocument()
  })
})