"use client"

import { useApp } from '@/lib/app-context'
import { Languages } from 'lucide-react'

export function AppHeader() {
  const { t, language, setLanguage } = useApp()
  
  return (
    <header className="bg-white border-b border-gray-100 shadow-sm px-4 py-4 z-10 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-md">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 hidden sm:inline tracking-tight">{t('appTitle')}</span>
        </div>
        
        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors shadow-sm"
          aria-label="Toggle language"
        >
          <Languages className="w-5 h-5 text-gray-600" strokeWidth={2.5} />
          <span className="text-sm font-bold text-gray-700">{language.toUpperCase()}</span>
        </button>
      </div>
    </header>
  )
}