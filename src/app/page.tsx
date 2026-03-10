"use client"

import { AppProvider, useApp, type Screen } from "@/lib/app-context"
import { AppHeader } from "@/components/dcdt/app-header"
import { TutorialScreen } from "@/components/dcdt/tutorial-screen"
import { PracticeScreen } from "@/components/dcdt/practice-screen"
import { CanvasScreen } from "@/components/dcdt/canvas-screen"
import { LoadingScreen } from "@/components/dcdt/loading-screen"
import { ReportScreen } from "@/components/dcdt/report-screen"

// ─── Step Indicator ────────────────────────────────────────────────────────────

const STEPS: { label: string; screens: Screen[] }[] = [
  { label: 'คำแนะนำ',    screens: ['tutorial'] },
  { label: 'ซ้อมมือ',    screens: ['practice'] },
  { label: 'ทดสอบจริง',  screens: ['canvas'] },
  { label: 'ประมวลผล',   screens: ['loading', 'report'] },
]

function StepIndicator() {
  const { currentScreen } = useApp()

  // Index of the currently active step (0-based)
  const activeIndex = STEPS.findIndex(s => s.screens.includes(currentScreen))

  return (
    <div
      className="w-full bg-card border-b-2 border-border px-4 py-4"
      role="progressbar"
      aria-label="ขั้นตอนการทดสอบ"
      aria-valuenow={activeIndex + 1}
      aria-valuemin={1}
      aria-valuemax={STEPS.length}
    >
      <ol className="flex items-center gap-0 w-full max-w-4xl mx-auto px-4">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex
          const isActive    = index === activeIndex
          const isFuture    = index > activeIndex
          const isLast      = index === STEPS.length - 1

          return (
            <li key={step.label} className="flex items-center flex-1 min-w-0">
              {/* Step node */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                {/* Circle */}
                <div
                  className={[
                    'w-10 h-10 rounded-full flex items-center justify-center text-base font-bold border-2 transition-colors',
                    isCompleted
                      ? 'border-[var(--trust-blue)] bg-[var(--trust-blue)] text-white'
                      : isActive
                        ? 'border-[var(--trust-blue)] bg-white text-[var(--trust-blue)]'
                        : 'border-border bg-background text-muted-foreground',
                  ].join(' ')}
                  aria-hidden="true"
                >
                  {isCompleted ? (
                    // Checkmark for completed steps
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <polyline points="3 8 6.5 12 13 4" />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                {/* Label */}
                <span
                  className={[
                    'text-base font-medium text-center leading-tight whitespace-nowrap',
                    isCompleted ? 'text-[var(--trust-blue)]' : '',
                    isActive    ? 'text-[var(--trust-blue)] font-bold' : '',
                    isFuture    ? 'text-muted-foreground' : '',
                  ].join(' ')}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line — not rendered after the last step */}
              {!isLast && (
                <div
                  className={[
                    'flex-1 h-0.5 mx-2 mb-6 rounded-full transition-colors',
                    isCompleted
                      ? 'bg-[var(--trust-blue)]'
                      : 'bg-border',
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

  const screen = currentScreen as Screen
  if (screen === 'tutorial')  return <TutorialScreen />
  if (screen === 'practice')  return <PracticeScreen />
  if (screen === 'canvas')    return <CanvasScreen />
  if (screen === 'loading')   return <LoadingScreen />
  if (screen === 'report')    return <ReportScreen />

  return <TutorialScreen />
}

// ─── App Shell ─────────────────────────────────────────────────────────────────

function DCDTApp() {
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader />
      <StepIndicator />
      <main className="flex-1 min-h-0 flex flex-col">
        <ScreenRouter />
      </main>
    </div>
  )
}

// ─── Root Page ─────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <AppProvider>
      <DCDTApp />
    </AppProvider>
  )
}