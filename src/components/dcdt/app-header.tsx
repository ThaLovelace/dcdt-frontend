"use client"

import { useApp } from '@/lib/app-context'
import { Languages } from 'lucide-react'

export function AppHeader() {
  const { t, language, setLanguage } = useApp()
  
  return (
    <header className="bg-card border-b-2 border-border px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <svg className="w-6 h-6 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-foreground hidden sm:inline">{t('appTitle')}</span>
        </div>
        
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
          aria-label="Toggle language"
        >
          <Languages className="w-5 h-5 text-foreground" strokeWidth={2} />
          <span className="text-sm font-bold text-foreground">{language.toUpperCase()}</span>
        </button>
      </div>
    </header>
  )
}
