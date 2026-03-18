"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { X, Edit3, User, GraduationCap } from 'lucide-react'

// ─── Step icons (visual only — no text) ──────────────────────────────────────

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

// ─── Component ────────────────────────────────────────────────────────────────

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
    // Mobile allows scroll, Desktop hides scroll to fit in one screen perfectly
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto p-4 md:p-6 overflow-y-auto md:overflow-hidden bg-slate-50">

      {/* ── Header ── */}
      <div className="flex-none shrink-0 flex flex-col items-center mb-4 md:mb-6 text-center pt-2">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
          {t('tutorialTitle')}
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-2 font-medium">
          {t('tutorialSubtitle')}
        </p>
      </div>

      {/* ── 4-Step Grid ── */}
      <div className="flex-1 min-h-0 w-full flex flex-col justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5 w-full h-full max-h-full">
          {steps.map((step, i) => (
            <Card key={i} className="bg-white border-gray-100 shadow-sm rounded-[2rem] overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="flex flex-col justify-center h-full p-5 md:p-6 gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-blue-500 text-white text-base font-bold shadow-sm">
                    {i + 1}
                  </div>
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center bg-blue-50 text-blue-500">
                    {STEP_ICONS[i]}
                  </div>
                </div>
                <h2 className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
                  {t(step.titleKey)}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t(step.bodyKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="flex-none shrink-0 w-full mt-6 md:mt-8 flex justify-center pb-2">
        <button
          onClick={handleStartClick}
          className="w-full max-w-md h-14 md:h-16 text-lg rounded-[1.5rem] text-white font-bold bg-blue-500 shadow-lg hover:bg-blue-600 transition-colors active:scale-[0.98]"
        >
          {t('tutorialStartButton')}
        </button>
      </div>

      {/* ── Confirmation Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md p-6 md:p-8 shadow-2xl relative max-h-[95vh] overflow-y-auto scrollbar-hide">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>

            {/* Step 1: Ask Practice */}
            {modalStep === 'ask-practice' && (
              <div className="flex flex-col text-center mt-4">
                <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Edit3 className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">{t('askPracticeTitle')}</h2>
                <p className="text-gray-500 mb-8 px-2">{t('askPracticeDesc')}</p>
                
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(false)
                      setCurrentScreen('practice')
                    }}
                    className="w-full h-14 rounded-2xl font-bold text-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors shadow-md"
                  >
                    {t('goPracticeBtn')}
                  </button>
                  <button
                    onClick={() => setModalStep('collect-data')}
                    className="w-full h-14 rounded-2xl font-semibold text-lg border-2 border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    {t('skipPracticeBtn')}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Collect Data */}
            {modalStep === 'collect-data' && (
              <div className="flex flex-col mt-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('preTestModalTitle')}</h2>
                <p className="text-gray-500 mb-6 text-sm">{t('preTestModalDesc')}</p>

                <div className="space-y-5">
                  {/* Age Form */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <User className="w-4 h-4 text-blue-500" /> {t('ageLabel')}
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder={t('agePlaceholder')}
                      className="w-full h-14 px-4 rounded-xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-lg font-medium outline-none"
                    />
                  </div>

                  {/* Education Form */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <GraduationCap className="w-4 h-4 text-blue-500" /> {t('eduLabel')}
                    </label>
                    <div className="grid grid-cols-1 gap-3">
                      <button
                        onClick={() => setEducation('<8')}
                        className={`h-14 px-4 rounded-xl border-2 text-left transition-all font-medium ${
                          education === '<8' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-100 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {t('eduLessThan8')}
                      </button>
                      <button
                        onClick={() => setEducation('>=8')}
                        className={`h-14 px-4 rounded-xl border-2 text-left transition-all font-medium ${
                          education === '>=8' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-100 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {t('eduMoreThan8')}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStartRealTest}
                  disabled={!age || !education}
                  className="mt-8 w-full h-14 rounded-2xl font-bold text-lg bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-md"
                >
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