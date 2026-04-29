"use client"

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Brain } from 'lucide-react'

export function LoadingScreen() {
  // Access analysisData from context to monitor backend processing status
  const { t, setCurrentScreen, analysisData } = useApp()
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    t('loadingStep1'),
    t('loadingStep2'),
    t('loadingStep3'),
    t('loadingStep4'),
  ]

  useEffect(() => {
    // Smooth progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        // If data is still being processed, stall the bar at 95%
        if (prev >= 95 && !analysisData) return 95;
        if (prev >= 100) return 100;
        return prev + 1;
      })
    }, 100)

    // Cycle through dynamic instruction/status texts
    const stepInterval = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length)
    }, 1500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [analysisData, steps.length])

  /**
   * FIX: Transition logic
   * Instead of a fixed timeout, we watch for the presence of analysisData.
   * Once the backend response is stored in the context, we move to the report.
   */
  useEffect(() => {
    if (analysisData) {
      // Small visual delay to allow the progress bar to feel complete
      const transitionTimeout = setTimeout(() => {
        setCurrentScreen('report')
      }, 500)
      
      return () => clearTimeout(transitionTimeout)
    }
  }, [analysisData, setCurrentScreen])

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 p-4 md:p-8">
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12 w-full max-w-md flex flex-col items-center text-center">
        
        {/* Animated Brain Icon */}
        <div className="mb-8 inline-flex">
          <div className="w-28 h-28 rounded-[2rem] bg-blue-50 flex items-center justify-center shadow-sm animate-pulse">
            <Brain className="w-14 h-14 text-blue-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Informative Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">{t('analyzing')}</h2>

        {/* Visual Progress Bar */}
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-6 shadow-inner">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Status Text */}
        <p className="text-base md:text-lg text-gray-500 h-7 transition-opacity duration-300 font-medium">
          {steps[step]}
        </p>
      </div>
    </div>
  )
}