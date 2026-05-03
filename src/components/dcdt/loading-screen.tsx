"use client"

import { useEffect, useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Brain } from 'lucide-react'

export function LoadingScreen() {
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
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95 && !analysisData) return 95
        if (prev >= 100) return 100
        return prev + 1
      })
    }, 100)

    const stepInterval = setInterval(() => {
      setStep(prev => (prev + 1) % steps.length)
    }, 1500)

    return () => {
      clearInterval(progressInterval)
      clearInterval(stepInterval)
    }
  }, [analysisData, steps.length])

  useEffect(() => {
    if (analysisData) {
      const transitionTimeout = setTimeout(() => {
        setCurrentScreen('report')
      }, 500)
      return () => clearTimeout(transitionTimeout)
    }
  }, [analysisData, setCurrentScreen])

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12 w-full max-w-sm flex flex-col items-center text-center">

        {/* Animated icon cluster */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Brain className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
          </div>
          {/* Pulsing ring */}
          <span className="absolute -inset-2 rounded-[1.25rem] border-2 border-blue-200 animate-ping opacity-50" />
        </div>

        <h2 className="text-xl font-black text-gray-900 mb-1 tracking-tight">{t('analyzing')}</h2>
        <p className="text-[0.8125rem] text-gray-400 mb-8 font-medium">
          {steps[step]}
        </p>

        {/* Progress bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs font-bold text-gray-400">{progress}%</span>
      </div>
    </div>
  )
}