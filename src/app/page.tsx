"use client"

import { AppProvider, useApp, type Screen } from "@/lib/app-context"
import { AppHeader } from "@/components/dcdt/app-header"
import { TutorialScreen } from "@/components/dcdt/tutorial-screen"
import { PracticeScreen } from "@/components/dcdt/practice-screen"
import { CanvasScreen } from "@/components/dcdt/canvas-screen"
import { LoadingScreen } from "@/components/dcdt/loading-screen"
import { ReportScreen } from "@/components/dcdt/report-screen"

// ─── Screen Router ─────────────────────────────────────────────────────────────

function ScreenRouter() {
  const { currentScreen } = useApp()

  const screen = currentScreen as Screen
  if (screen === 'tutorial')    return <TutorialScreen />
  if (screen === 'practice')    return <PracticeScreen />
  if (screen === 'canvas')      return <CanvasScreen />
  if (screen === 'loading')     return <LoadingScreen />
  if (screen === 'report')      return <ReportScreen />

  // This line is unreachable at runtime but satisfies TypeScript's
  // exhaustive check without triggering the `never` assignment error.
  return <TutorialScreen />
}

// ─── App Shell ─────────────────────────────────────────────────────────────────

function DCDTApp() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AppHeader />
      <ScreenRouter />
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
