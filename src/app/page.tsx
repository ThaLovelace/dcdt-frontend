"use client"

import { AppProvider, useApp, type Screen, type Language } from "@/lib/app-context"
import { AppHeader } from "@/components/dcdt/app-header"
import { TutorialScreen } from "@/components/dcdt/tutorial-screen"
import { PracticeScreen } from "@/components/dcdt/practice-screen"
import { CanvasScreen } from "@/components/dcdt/canvas-screen"
import { LoadingScreen } from "@/components/dcdt/loading-screen"
import { ReportScreen } from "@/components/dcdt/report-screen"
import { PreparationScreen } from "@/components/dcdt/preparation-screen"

// ─── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator() {
  const { currentScreen, t } = useApp()

  const STEPS: { labelKey: 'stepTutorial'|'stepPractice'|'stepCanvas'|'stepProcess'; screens: Screen[] }[] = [
    { labelKey: 'stepTutorial', screens: ['tutorial'] },
    { labelKey: 'stepPractice', screens: ['practice'] },
    { labelKey: 'stepCanvas',   screens: ['canvas'] },
    { labelKey: 'stepProcess',  screens: ['loading', 'report'] },
  ]

  const activeIndex = STEPS.findIndex(s => s.screens.includes(currentScreen))

  return (
    <div
      className="w-full bg-white border-b border-gray-100 px-4 py-5 shadow-sm z-0 relative"
      role="progressbar"
      aria-label={t('stepProgressLabel')}
      aria-valuenow={activeIndex + 1}
      aria-valuemin={1}
      aria-valuemax={STEPS.length}
    >
      <ol className="flex items-center gap-0 w-full max-w-5xl mx-auto px-4">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex
          const isActive    = index === activeIndex
          const isFuture    = index > activeIndex
          const isLast      = index === STEPS.length - 1

          return (
            <li key={step.labelKey} className="flex items-center flex-1 min-w-0">
              <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
                <div
                  className={[
                    'w-12 h-12 rounded-[1rem] flex items-center justify-center text-lg font-black border-2 transition-colors shadow-sm',
                    isCompleted
                      ? 'border-blue-500 bg-blue-500 text-white'
                      : isActive
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 bg-gray-50 text-gray-400',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                      <polyline points="3 8 6.5 12 13 4" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={[
                    'text-sm md:text-base text-center leading-tight whitespace-nowrap',
                    isCompleted ? 'text-blue-500 font-bold' : '',
                    isActive    ? 'text-blue-600 font-black' : '',
                    isFuture    ? 'text-gray-400 font-semibold' : '',
                  ].join(' ')}
                >
                  {t(step.labelKey)}
                </span>
              </div>
              {!isLast && (
                <div
                  className={[
                    'flex-1 h-1 mx-3 mb-8 rounded-full transition-colors',
                    isCompleted ? 'bg-blue-500' : 'bg-gray-100',
                  ].join(' ')}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

// ─── Screen Router ─────────────────────────────────────────────────────────────

function ScreenRouter() {
  const { currentScreen } = useApp()
  if (currentScreen === 'tutorial')    return <TutorialScreen />
  if (currentScreen === 'practice')    return <PracticeScreen />
  if (currentScreen === 'canvas')      return <CanvasScreen />
  if (currentScreen === 'loading')     return <LoadingScreen />
  if (currentScreen === 'report')      return <ReportScreen />
  return <TutorialScreen />
}

// ─── App Shell ─────────────────────────────────────────────────────────────────

function DCDTApp() {
  const { currentScreen } = useApp()
  const isReport = currentScreen === 'report'

  return (
    <div className={isReport ? 'min-h-full bg-slate-50 flex flex-col' : 'h-full bg-slate-50 flex flex-col'}>
      <AppHeader />
      <StepIndicator />
      <main className={isReport ? 'flex flex-col' : 'flex-1 min-h-0 flex flex-col'}>
        <ScreenRouter />
      </main>
    </div>
  )
}

export default function Page() {
  return (
    <AppProvider>
      <DCDTApp />
    </AppProvider>
  )
}