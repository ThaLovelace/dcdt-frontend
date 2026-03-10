"use client"

import { createContext, useContext, useState, useRef, type ReactNode } from 'react'
import { translations, type Language, type TranslationKey } from './translations'

export type Screen = 'tutorial' | 'practice' | 'canvas' | 'loading' | 'report'

interface AppContextType {
  // Navigation
  currentScreen: Screen
  setCurrentScreen: (screen: Screen) => void

  // Behavioral Tracking
  restartCount: number
  incrementRestartCount: () => void
  resetRestartCount: () => void

  // Timer — startTCT/getTCT are functions, so they are safe to expose.
  // tctStartTime (the raw ref value) is intentionally omitted: reading
  // ref.current during render violates the react-hooks/refs rule and
  // no consumer component needs the raw value.
  startTCT: () => void
  getTCT: () => number

  // Language
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: TranslationKey) => string
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('tutorial')
  const [language, setLanguage] = useState<Language>('en')
  const [restartCount, setRestartCount] = useState(0)
  const tctStartTimeRef = useRef<number | null>(null)

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key
  }

  const incrementRestartCount = () => setRestartCount(prev => prev + 1)
  const resetRestartCount = () => setRestartCount(0)

  const startTCT = () => {
    tctStartTimeRef.current = Date.now()
  }

  const getTCT = () => {
    if (!tctStartTimeRef.current) return 0
    return Math.round((Date.now() - tctStartTimeRef.current) / 1000)
  }

  return (
    <AppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      restartCount,
      incrementRestartCount,
      resetRestartCount,
      startTCT,
      getTCT,
      language,
      setLanguage,
      t
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}