"use client"

import React from "react"

interface ProgressStepsProps {
  currentStep: number
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep }) => {
  return (
    <div className="mb-4 sm:mb-6 lg:mb-8">
      <div className="flex items-center justify-center space-x-2 sm:space-x-4 lg:space-x-8 max-w-md mx-auto">
        {/* Step 1 */}
        <div className="flex items-center min-w-0">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm lg:text-base font-medium transition-all duration-300 ${
              currentStep >= 1 
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-soft hover-lift" 
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {currentStep >= 1 ? (
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              "1"
            )}
          </div>
          <span className={`ml-1.5 sm:ml-2 text-xs sm:text-sm lg:text-base whitespace-nowrap transition-colors duration-300 ${
            currentStep >= 1 ? "gradient-text font-medium" : "text-gray-500"
          }`}>
            填写信息
          </span>
        </div>

        {/* Progress Line */}
        <div className="flex-1 min-w-[20px] sm:min-w-[40px] lg:min-w-[60px] h-0.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              currentStep >= 2 
                ? "bg-gradient-to-r from-purple-600 to-blue-600 w-full" 
                : "bg-gray-200 w-0"
            }`}
          />
        </div>

        {/* Step 2 */}
        <div className="flex items-center min-w-0">
          <div
            className={`w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm lg:text-base font-medium transition-all duration-300 ${
              currentStep >= 2 
                ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-soft hover-lift" 
                : "bg-gray-200 text-gray-500"
            }`}
          >
            {currentStep >= 2 ? (
              <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              "2"
            )}
          </div>
          <span className={`ml-1.5 sm:ml-2 text-xs sm:text-sm lg:text-base whitespace-nowrap transition-colors duration-300 ${
            currentStep >= 2 ? "gradient-text font-medium" : "text-gray-500"
          }`}>
            生成方案
          </span>
        </div>
      </div>
    </div>
  )
}