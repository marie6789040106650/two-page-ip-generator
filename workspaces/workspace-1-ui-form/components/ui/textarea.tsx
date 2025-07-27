'use client'

import React, { forwardRef } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  helpText?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helpText, className = '', ...props }, ref) => {
    const textareaClasses = `form-textarea ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${className}`
    
    return (
      <div className="form-group">
        {label && (
          <label className="form-label" htmlFor={props.id}>
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          className={textareaClasses}
          rows={4}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
        {helpText && !error && <p className="form-help">{helpText}</p>}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'