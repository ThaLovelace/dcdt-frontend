"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { X, Edit3, User, GraduationCap } from 'lucide-react'

// --- Visual Step Icons ---
const STEP_ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>,
]

export function TutorialScreen() {
  const { setCurrentScreen, t, age, setAge, education, setEducation } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState<'ask-practice' | 'collect-data'>('ask-practice')

  const steps = [
    { titleKey: 'tutorialStep1Title' as const, bodyKey: 'tutorialStep1Body' as const },
    { titleKey: 'tutorialStep2Title' as const, bodyKey: 'tutorialStep2Body' as const },
    { titleKey: 'tutorialStep3Title' as const, bodyKey: 'tutorialStep3Body' as const },
    { titleKey: 'tutorialStep4Title' as const, bodyKey: 'tutorialStep4Body' as const },
  ]

  const handleStartClick = () => {
    setModalStep('ask-practice')
    setIsModalOpen(true)
  }

  const handleStartRealTest = () => {
    if (age && education) {
      setIsModalOpen(false)
      setCurrentScreen('canvas')
    }
  }

  return (
    /**
     * Container Logic:
     * min-h-full with overflow-y-auto enables scrolling ONLY when content exceeds height (1-column).
     * sm:overflow-hidden locks the screen for desktop (2-columns).
     */
    <div className="flex flex-col w-full min-h-full sm:h-full max-w-5xl mx-auto p-4 md:p-6 overflow-y-auto sm:overflow-hidden bg-slate-50">

      {/* --- Header Section (Reduced bottom margin) --- */}
      <div className="flex-none shrink-0 flex flex-col items-center mb-4 md:mb-6 text-center pt-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          {t('tutorialTitle')}
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">
          {t('tutorialSubtitle')}
        </p>
      </div>

      {/* --- Grid Section --- */}
      <div className="flex-1 w-full flex flex-col justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full h-auto sm:h-full">
          {steps.map((step, i) => (
            <Card key={i} className="bg-white border-gray-100 shadow-sm rounded-[1.5rem] md:rounded-[2rem] overflow-hidden hover:shadow-md transition-shadow">
              {/* Reduced padding (py-3 md:py-4) to make boxes less "tall" */}
              <CardContent className="flex flex-col justify-center h-full py-3 px-4 md:py-4 md:px-6 gap-2">
                
                {/* Header Row: Number + Icon + Title (All in one line) */}
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white text-sm font-bold shadow-sm">
                    {i + 1}
                  </div>
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-500">
                    {STEP_ICONS[i]}
                  </div>
                  {/* Title moved here to the same row */}
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                    {t(step.titleKey)}
                  </h2>
                </div>

                {/* Body Text (Stays below the icon row) */}
                <p className="text-sm text-gray-500 leading-snug pl-[calc(2rem+0.75rem+2.5rem)] md:pl-0">
                  {t(step.bodyKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* --- Footer Section (Reduced top margin) --- */}
      <div className="flex-none shrink-0 w-full mt-4 md:mt-6 flex justify-center pb-4">
        <button
          onClick={handleStartClick}
          className="dcdt-btn-lg"
        >
          {t('tutorialStartButton')}
        </button>
      </div>

      {/* --- Confirmation Modal --- */}
      {isModalOpen && (
        <div className="dcdt-modal-overlay">
          <div className="dcdt-modal-panel">
            <button onClick={() => setIsModalOpen(false)} className="dcdt-modal-close-btn">
              <X className="w-6 h-6 text-gray-400" />
            </button>

            {modalStep === 'ask-practice' && (
              <div className="flex flex-col text-center mt-4">
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Edit3 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('askPracticeTitle')}</h2>
                <p className="text-gray-500 mb-8 px-2">{t('askPracticeDesc')}</p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setIsModalOpen(false); setCurrentScreen('practice'); }} className="dcdt-btn-primary-modal">
                    {t('goPracticeBtn')}
                  </button>
                  <button onClick={() => setModalStep('collect-data')} className="dcdt-btn-secondary-modal">
                    {t('skipPracticeBtn')}
                  </button>
                </div>
              </div>
            )}

            {modalStep === 'collect-data' && (
              <div className="flex flex-col mt-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('preTestModalTitle')}</h2>
                <p className="text-gray-500 mb-6 text-sm">{t('preTestModalDesc')}</p>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User className="w-4 h-4 text-blue-500" /> {t('ageLabel')}
                    </label>
                    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder={t('agePlaceholder')} className="dcdt-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <GraduationCap className="w-4 h-4 text-blue-500" /> {t('eduLabel')}
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <button onClick={() => setEducation('<8')} className={`dcdt-radio-btn ${education === '<8' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                        {t('eduLessThan8')}
                      </button>
                      <button onClick={() => setEducation('>=8')} className={`dcdt-radio-btn ${education === '>=8' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-600 hover:bg-gray-50'}`}>
                        {t('eduMoreThan8')}
                      </button>
                    </div>
                  </div>
                </div>
                <button onClick={handleStartRealTest} disabled={!age || !education} className="dcdt-btn-success">
                  {t('startRealTestBtn')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}