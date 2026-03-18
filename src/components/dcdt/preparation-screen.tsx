"use client"

import { useApp } from '@/lib/app-context'
import { Clock } from 'lucide-react'

export function PreparationScreen() {
  const { setCurrentScreen, startTCT, t } = useApp()

  const handleStart = () => {
    startTCT()
    setCurrentScreen('canvas')
  }

  return (
    <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-4 md:p-8">
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12 w-full max-w-2xl flex flex-col items-center text-center">
        
        {/* Icon */}
        <div className="w-28 h-28 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-sm">
          <Clock className="w-14 h-14 text-blue-500" strokeWidth={2} />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
          {t('prepTitle')}
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-500 max-w-lg mb-12 leading-relaxed">
          {t('prepSubtitle')}
        </p>

        {/* Massive Primary Button */}
        <button
          onClick={handleStart}
          className="w-full max-w-lg h-20 md:h-24 bg-blue-500 text-white text-xl md:text-2xl font-bold rounded-[2rem] shadow-lg hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-4"
        >
          <Clock className="w-8 h-8" />
          {t('startTimerButton')}
        </button>
      </div>
    </div>
  )
}