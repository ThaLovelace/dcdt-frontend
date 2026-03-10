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
    <div className="flex flex-col items-center justify-center h-full bg-background p-8">
      {/* Icon */}
      <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-8">
        <Clock className="w-12 h-12 text-primary" strokeWidth={2} />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-foreground text-center mb-4">
        {t('prepTitle')}
      </h1>

      {/* Subtitle - No instructions here */}
      <p className="text-xl text-muted-foreground text-center max-w-lg mb-12">
        {t('prepSubtitle')}
      </p>

      {/* Massive Primary Button */}
      <button
        onClick={handleStart}
        className="w-full max-w-lg h-24 bg-primary text-primary-foreground text-2xl font-bold rounded-2xl shadow-xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
      >
        <Clock className="w-8 h-8" />
        {t('startTimerButton')}
      </button>
    </div>
  )
}
