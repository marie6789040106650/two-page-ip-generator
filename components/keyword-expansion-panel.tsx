"use client"

import React from "react"

interface KeywordExpansionPanelProps {
  type: string
  keywords: string[]
  currentValue: string
  onKeywordClick: (keyword: string) => void
  onMouseLeave: () => void
  onMouseEnter: () => void
}

export const KeywordExpansionPanel: React.FC<KeywordExpansionPanelProps> = ({
  type,
  keywords,
  currentValue,
  onKeywordClick,
  onMouseLeave,
  onMouseEnter
}) => {
  return (
    <div
      className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-medium animate-slide-down"
      data-keyword-area={type}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
      style={{
        maxHeight: '200px',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#d1d5db transparent'
      }}
    >
      {keywords.map((keyword, index) => (
        <div
          key={index}
          className="keyword-tag-blue px-4 py-2 cursor-pointer hover:bg-purple-50 text-sm transition-all duration-150 hover-lift touch-manipulation animate-fade-in"
          style={{ animationDelay: `${index * 0.05}s` }}
          onClick={() => onKeywordClick(keyword)}
        >
          <span className="flex items-center space-x-1">
            <span>{keyword}</span>
            <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </span>
        </div>
      ))}
    </div>
  )
}