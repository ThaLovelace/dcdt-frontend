"use client"

import { AppProvider, useApp, type Screen } from "@/lib/app-context"
import { AppHeader } from "@/components/dcdt/app-header"
import { WelcomeScreen } from "@/components/dcdt/welcome-screen"
import { TutorialScreen } from "@/components/dcdt/tutorial-screen"
import { PracticeScreen } from "@/components/dcdt/practice-screen"
import { CanvasScreen } from "@/components/dcdt/canvas-screen"
import { LoadingScreen } from "@/components/dcdt/loading-screen"
import { ReportScreen } from "@/components/dcdt/report-screen"

// ─── Step Indicator ────────────────────────────────────────────────────────────

function StepIndicator() {
  const { currentScreen, t } = useApp()

  const STEPS: { labelKey: 'stepTutorial' | 'stepPractice' | 'stepCanvas' | 'stepProcess'; screens: Screen[] }[] = [
    { labelKey: 'stepTutorial', screens: ['tutorial'] },
    { labelKey: 'stepPractice', screens: ['practice'] },
    { labelKey: 'stepCanvas',   screens: ['canvas'] },
    { labelKey: 'stepProcess',  screens: ['loading', 'report'] },
  ]

  const activeIndex = STEPS.findIndex(s => s.screens.includes(currentScreen))
  const ariaValueNow = activeIndex === -1 ? 1 : activeIndex + 1

  return (
    <div
      className="w-full bg-white border-b border-slate-200/70 px-4 py-2.5 z-0 relative shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
      role="progressbar"
      aria-label={t('stepProgressLabel')}
      aria-valuenow={ariaValueNow}
    >
      <ol className="flex items-start justify-center w-full max-w-2xl mx-auto">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex
          const isActive    = index === activeIndex
          const isFuture    = index > activeIndex
          const isLast      = index === STEPS.length - 1

          return (
            <li key={step.labelKey} className={`flex ${isLast ? '' : 'flex-1'}`}>
              <div className="flex flex-col items-center flex-shrink-0 w-14 md:w-20 gap-1">
                {/* Step circle */}
                <div
                  className={[
                    'w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-2 transition-all duration-200 relative z-10',
                    isCompleted ? 'border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : isActive  ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-slate-200 bg-slate-50 text-slate-400',
                  ].join(' ')}
                >
                  {isCompleted ? (
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={3} className="w-3.5 h-3.5">
                      <polyline points="3 8 6.5 12 13 4" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Label */}
                <span
                  className={[
                    'text-[9px] md:text-[10px] text-center leading-tight whitespace-nowrap font-semibold tracking-wide',
                    isCompleted ? 'text-blue-500' : '',
                    isActive    ? 'text-blue-600 font-black' : '',
                    isFuture    ? 'text-slate-400' : '',
                  ].join(' ')}
                >
                  {t(step.labelKey)}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div
                  className={[
                    'flex-1 h-px mx-1 rounded-full transition-colors mt-4',
                    isCompleted ? 'bg-blue-500' : 'bg-slate-200',
                  ].join(' ')}
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
  if (currentScreen === 'welcome')  return <WelcomeScreen />
  if (currentScreen === 'tutorial') return <TutorialScreen />
  if (currentScreen === 'practice') return <PracticeScreen />
  if (currentScreen === 'canvas')   return <CanvasScreen />
  if (currentScreen === 'loading')  return <LoadingScreen />
  if (currentScreen === 'report')   return <ReportScreen />
  return <WelcomeScreen />
}

// ─── App Shell ─────────────────────────────────────────────────────────────────

function DCDTApp() {
  const { currentScreen } = useApp()

  const isWelcome = currentScreen === 'welcome'
  const isReport  = currentScreen === 'report'

  return (
    <div className={
      isReport
        ? 'min-h-full bg-slate-50 flex flex-col'
        : 'min-h-screen lg:h-full bg-slate-50 flex flex-col'
    }>
      {/* Global header is always rendered — WelcomeScreen no longer owns its own header */}
      <AppHeader />

      {/* StepIndicator is HIDDEN on the welcome/dashboard screen */}
      {!isWelcome && <StepIndicator />}

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