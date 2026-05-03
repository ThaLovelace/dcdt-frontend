"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { X, Edit3, User, GraduationCap, Clock, ChevronRight } from 'lucide-react'

// --- Visual Step Icons (refined, consistent 20px stroke icons) ---
const STEP_ICONS = [
  <svg key="1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>,
  <svg key="2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>,
  <svg key="3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>,
  <svg key="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>,
]

// Step accent colors — subtle, clinical palette
const STEP_COLORS = [
  { bg: 'bg-blue-50', text: 'text-blue-600', badge: 'bg-blue-600', connector: 'bg-blue-200' },
  { bg: 'bg-teal-50', text: 'text-teal-600', badge: 'bg-teal-600', connector: 'bg-teal-200' },
  { bg: 'bg-violet-50', text: 'text-violet-600', badge: 'bg-violet-600', connector: 'bg-violet-200' },
  { bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-600', connector: 'bg-emerald-200' },
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
    <div className="flex flex-col w-full min-h-[100dvh] bg-slate-50 relative">

      {/* ── Header ── */}
      <header className="flex-none flex flex-col items-center pt-8 pb-3 px-6 text-center">
        {/* Eyebrow label */}
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-blue-500 mb-3 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {t('tutorialSubtitle')}
        </span>
        <h1 className="text-[1.75rem] md:text-[2rem] font-black text-gray-900 tracking-tight leading-tight max-w-sm md:max-w-lg">
          {t('tutorialTitle')}
        </h1>
        {/* Thin decorative rule */}
        <div className="mt-4 w-12 h-0.5 rounded-full bg-gradient-to-r from-blue-400 to-teal-400" />
      </header>

      {/* ── Steps: Elegant 2-column grid with timeline connectors ── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 md:px-6 pt-5 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {steps.map((step, i) => {
            const color = STEP_COLORS[i]
            return (
              <div
                key={i}
                className="group relative bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200"
              >
                {/* Step number badge + icon row */}
                <div className="flex items-center gap-3 mb-2.5">
                  {/* Number badge */}
                  <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center ${color.badge} text-white text-xs font-black shadow-sm`}>
                    {i + 1}
                  </div>

                  {/* Icon pill */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${color.bg} ${color.text}`}>
                    {STEP_ICONS[i]}
                  </div>

                  {/* Title */}
                  <h2 className="text-[0.9rem] md:text-base font-bold text-gray-900 leading-snug flex-1">
                    {t(step.titleKey)}
                  </h2>
                </div>

                {/* Body — large, legible, high contrast */}
                <p className="text-[0.875rem] md:text-sm text-gray-500 leading-relaxed pl-[calc(1.75rem+0.75rem+2rem+0.75rem)] md:pl-0">
                  {t(step.bodyKey)}
                </p>

                {/* Subtle step connector line (desktop only) */}
                {i < 3 && (
                  <span className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </main>

      {/* ── Sticky Action Bar (Glassmorphism) ── */}
      <div className="sticky bottom-0 left-0 w-full z-20">
        {/* Frosted glass panel */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-slate-200/70 shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
          <div className="max-w-2xl mx-auto px-4 py-3 pb-safe flex items-center justify-center">
            <button
              onClick={handleStartClick}
              className="w-full max-w-sm h-14 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-base font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all duration-150 tracking-wide"
            >
              {t('tutorialStartButton')}
            </button>
          </div>
        </div>
      </div>

      {/* ── Confirmation Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            {/* Modal header bar */}
            <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-100">
              <div className="w-8" />
              {/* Step indicator dots */}
              <div className="flex gap-1.5">
                <span className={`w-2 h-2 rounded-full transition-colors ${modalStep === 'ask-practice' ? 'bg-blue-500' : 'bg-slate-200'}`} />
                <span className={`w-2 h-2 rounded-full transition-colors ${modalStep === 'collect-data' ? 'bg-blue-500' : 'bg-slate-200'}`} />
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            {/* ── Ask Practice step ── */}
            {modalStep === 'ask-practice' && (
              <div className="flex flex-col items-center text-center px-7 py-6">
                <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-5 shadow-inner">
                  <Edit3 className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-gray-900 mb-2">{t('askPracticeTitle')}</h2>
                <p className="text-[0.875rem] text-gray-500 leading-relaxed mb-7 max-w-xs">{t('askPracticeDesc')}</p>
                <div className="w-full flex flex-col gap-2.5">
                  <button
                    onClick={() => { setIsModalOpen(false); setCurrentScreen('practice') }}
                    className="w-full h-13 bg-blue-600 hover:bg-blue-700 text-white text-[0.9375rem] font-bold rounded-xl transition-colors shadow-sm shadow-blue-600/20 py-3.5"
                  >
                    {t('goPracticeBtn')}
                  </button>
                  <button
                    onClick={() => setModalStep('collect-data')}
                    className="w-full h-12 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[0.9375rem] font-semibold rounded-xl transition-colors border border-slate-200 py-3"
                  >
                    {t('skipPracticeBtn')}
                  </button>
                </div>
              </div>
            )}

            {/* ── Collect Data step ── */}
            {modalStep === 'collect-data' && (
              <div className="flex flex-col px-7 py-6">
                <h2 className="text-xl font-black text-gray-900 mb-1">{t('preTestModalTitle')}</h2>
                <p className="text-[0.8125rem] text-gray-400 mb-6 leading-relaxed">{t('preTestModalDesc')}</p>

                <div className="space-y-4">
                  {/* Age field */}
                  <div>
                    <label htmlFor="age-input" className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-gray-700 mb-1.5">
                      <User className="w-3.5 h-3.5 text-blue-500" />
                      {t('ageLabel')}
                    </label>
                    <input
                      id="age-input"
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder={t('agePlaceholder')}
                      className="w-full h-13 px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-base font-medium outline-none"
                    />
                  </div>

                  {/* Education field */}
                  <div>
                    <label htmlFor="education-select" className="flex items-center gap-1.5 text-[0.8125rem] font-semibold text-gray-700 mb-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                      {t('eduLabel')}
                    </label>
                    <div className="relative">
                      <select
                        id="education-select"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        className="w-full h-13 px-4 py-3.5 rounded-xl border-2 border-slate-100 bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-base font-medium outline-none appearance-none cursor-pointer"
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
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleStartRealTest}
                  disabled={!age || !education}
                  className="w-full h-13 mt-7 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-[0.9375rem] font-bold rounded-xl transition-colors shadow-sm shadow-blue-600/20 py-3.5"
                >
                  {t('startRealTestBtn')}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Timer Warning Modal ── */}
      {showTimerWarning && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Amber icon cluster */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <Clock className="w-8 h-8 text-amber-500" />
                </div>
                {/* Pulsing ring */}
                <span className="absolute -inset-1 rounded-2xl border-2 border-amber-200 animate-ping opacity-60" />
              </div>
            </div>

            <h2 className="text-xl font-black text-gray-900 mb-2 text-center tracking-tight">
              {t('readyToStartTitle')}
            </h2>
            <p className="text-[0.875rem] text-gray-500 mb-7 text-center leading-relaxed">
              {t('readyToStartMsg')}
            </p>

            <div className="flex flex-col gap-2.5">
              <button
                onClick={() => { setShowTimerWarning(false); setCurrentScreen('canvas') }}
                className="w-full h-13 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-[0.9375rem] font-bold rounded-xl shadow-md shadow-blue-600/25 transition-all py-3.5"
              >
                {t('confirmStart')}
              </button>
              <button
                onClick={() => { setShowTimerWarning(false); setModalStep('collect-data'); setIsModalOpen(true) }}
                className="w-full py-3 text-slate-400 hover:text-slate-600 font-semibold text-sm transition-colors"
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