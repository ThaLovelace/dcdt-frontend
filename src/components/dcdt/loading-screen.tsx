"use client"

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Brain } from 'lucide-react'

export function LoadingScreen() {
  const { t, setCurrentScreen, setResultIndex } = useApp()
  const [step, setStep] = useState(0)
  const [progress, setProgress] = useState(0)

  const steps = [
    t('loadingStep1'),
    t('loadingStep2'),
    t('loadingStep3'),
    t('loadingStep4'),
  ]

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100
        return prev + 2
      })
    }, 50)

    // Step text animation
    const stepInterval = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length)
    }, 1000)

    // Navigate to report after 3 seconds
    const timeout = setTimeout(() => {
      // In a real scenario, this would be the result from the API
      const randomResultIndex = Math.floor(Math.random() * 8)
      setResultIndex(randomResultIndex)
      setCurrentScreen('report')
    }, 3000)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      clearTimeout(timeout)
    }
  }, [setCurrentScreen, setResultIndex, steps.length])

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 p-4 md:p-8">
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12 w-full max-w-md flex flex-col items-center text-center">
        
        {/* Brain Icon */}
        <div className="mb-8 inline-flex">
          <div className="w-28 h-28 rounded-[2rem] bg-blue-50 flex items-center justify-center shadow-sm animate-pulse">
            <Brain className="w-14 h-14 text-blue-500" strokeWidth={1.5} />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">{t('analyzing')}</h2>

        {/* Progress Bar */}
        <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-6 shadow-inner">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Dynamic Step Text */}
        <p className="text-base md:text-lg text-gray-500 h-7 transition-opacity duration-300 font-medium">
          {steps[step]}
        </p>
      </div>
    </div>
  )
}