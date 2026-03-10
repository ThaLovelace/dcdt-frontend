"use client"

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Brain } from 'lucide-react'

export function LoadingScreen() {
  const { t, setCurrentScreen } = useApp()
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
      setCurrentScreen('report')
    }, 3000)
    
    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
      clearTimeout(timeout)
    }
  }, [setCurrentScreen, steps.length])
  
  return (
    <div className="fixed inset-0 bg-foreground/95 flex items-center justify-center z-50">
      <div className="text-center px-6 max-w-md">
        {/* Brain Icon */}
        <div className="mb-8 inline-flex">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center animate-pulse">
            <Brain className="w-12 h-12 text-primary" strokeWidth={1.5} />
          </div>
        </div>
        
        {/* Title */}
        <h2 className="text-2xl font-bold text-white mb-6">{t('analyzing')}</h2>
        
        {/* Progress Bar */}
        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        {/* Dynamic Step Text */}
        <p className="text-lg text-white/80 h-7 transition-opacity duration-300">
          {steps[step]}
        </p>
      </div>
    </div>
  )
}
