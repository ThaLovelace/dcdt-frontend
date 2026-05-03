"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { X, Edit3, User, GraduationCap, Clock } from 'lucide-react'

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
  const [showTimerWarning, setShowTimerWarning] = useState(false)

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
      setShowTimerWarning(true)
    }
  }

  return (
    /**
     * MODERN STICKY FOOTER LAYOUT:
     * - min-h-[100dvh]: Allows natural, smooth full-page scrolling. No internal scrollbars.
     * - relative: Needed context for the sticky footer.
     */
    <div className="flex flex-col w-full min-h-[100dvh] bg-slate-50 relative">

      {/* --- Header Section --- */}
      <div className="flex-none flex flex-col items-center pt-6 pb-4 px-4 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          {t('tutorialTitle')}
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-1 font-medium">
          {t('tutorialSubtitle')}
        </p>
      </div>

      {/* --- Grid Section --- */}
      {/* flex-1 lets it expand naturally. pb-8 gives some breathing room before the footer. */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full">
          {steps.map((step, i) => (
            <Card key={i} className="bg-white border-gray-100 shadow-sm rounded-[1.5rem] md:rounded-[2rem] hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col justify-center py-5 px-5 md:py-6 md:px-8 gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-blue-500 text-white text-base md:text-lg font-bold shadow-sm">
                    {i + 1}
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-500">
                    {STEP_ICONS[i]}
                  </div>
                  <h2 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">
                    {t(step.titleKey)}
                  </h2>
                </div>

                <p className="text-sm md:text-base text-gray-600 leading-relaxed pl-[calc(2.5rem+1rem+3rem)] md:pl-0">
                  {t(step.bodyKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* --- Footer Section (Sticky Action Bar) --- */}
      {/* 
        - sticky bottom-0: Pins the container to the bottom of the viewport.
        - backdrop-blur-md & bg-slate-50/90: Creates a modern frosted glass effect over the scrolling content.
        - z-20: Ensures it stays above the grid cards.
      */}
      <div className="sticky bottom-0 left-0 w-full flex justify-center p-4 pb-6 md:pb-8 bg-slate-50/90 backdrop-blur-md border-t border-slate-200/60 z-20">
        <button
          onClick={handleStartClick}
          className="dcdt-btn-lg shadow-xl hover:-translate-y-0.5 transition-transform"
        >
          {t('tutorialStartButton')}
        </button>
      </div>

      {/* --- Confirmation Modal --- */}
      {isModalOpen && (
        <div className="dcdt-modal-overlay z-50">
          <div className="dcdt-modal-panel">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="dcdt-modal-close-btn"
              aria-label="Close modal"
            >
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
                    <label htmlFor="age-input" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User className="w-4 h-4 text-blue-500" /> {t('ageLabel')}
                    </label>
                    <input 
                      id="age-input"
                      type="number" 
                      value={age} 
                      onChange={(e) => setAge(e.target.value)} 
                      placeholder={t('agePlaceholder')} 
                      className="dcdt-input" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="education-select" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <GraduationCap className="w-4 h-4 text-blue-500" /> {t('eduLabel')}
                    </label>
                    <div className="relative">
                      <select
                        id="education-select"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full h-14 px-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-base font-medium outline-none appearance-none cursor-pointer"
                      >
                        <option value="" disabled>{t('eduSelectPlaceholder')}</option>
                        <option value="0">{t('eduLevel0')}</option>
                        <option value="4">{t('eduLevel4')}</option>
                        <option value="6">{t('eduLevel6')}</option>
                        <option value="9">{t('eduLevel9')}</option>
                        <option value="12">{t('eduLevel12')}</option>
                        <option value="14">{t('eduLevel14')}</option>
                        <option value="16">{t('eduLevel16')}</option>
                        <option value="18">{t('eduLevel18')}</option>
                      </select>
                      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                  </div>
                </div>
                <button onClick={handleStartRealTest} disabled={!age || !education} className="dcdt-btn-success mt-8">
                  {t('startRealTestBtn')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Timer Modal */}
      {showTimerWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-amber-600 animate-pulse" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4 text-center">{t('readyToStartTitle')}</h2>
            <p className="text-gray-600 mb-8 text-center leading-relaxed">{t('readyToStartMsg')}</p>
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setShowTimerWarning(false); setCurrentScreen('canvas'); }}
                className="w-full h-16 bg-blue-600 text-white text-lg font-bold rounded-2xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
              >
                {t('confirmStart')}
              </button>
              <button 
                onClick={() => { setShowTimerWarning(false); setModalStep('collect-data'); setIsModalOpen(true); }}
                className="w-full h-14 text-gray-400 font-bold text-base hover:text-gray-600"
              >
                {t('cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}