"use client"

import { useApp } from '@/lib/app-context'
import { Languages } from 'lucide-react'
import Image from 'next/image' // 1. เพิ่ม import Image เข้ามา

export function AppHeader() {
  const { t, language, setLanguage } = useApp()

  return (
    <header className="bg-white border-b border-slate-200/70 px-4 py-3 z-10 relative shadow-[0_1px_8px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          {/* 2. เปลี่ยน SVG เดิมเป็น Image component */}
          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <Image 
              src="/dCDT-Logo.png" 
              alt="dCDT Logo" 
              width={40} 
              height={40} 
              className="object-contain"
              priority // ใส่ priority เพื่อให้โลโก้โหลดเป็นสิ่งแรกเสมอ
            />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[0.9375rem] font-black text-gray-900 tracking-tight leading-tight">{t('appTitle')}</span>
            <span className="text-[10px] font-semibold text-gray-400 tracking-[0.08em] uppercase leading-tight">Digital Clock Drawing Test</span>
          </div>
        </div>

        {/* Language Toggle */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm"
          aria-label="Toggle language"
        >
          <Languages className="w-4 h-4 text-slate-500" strokeWidth={2} />
          <span className="text-xs font-black text-slate-600 tracking-wider">{language.toUpperCase()}</span>
        </button>
      </div>
    </header>
  )
}